import {existsSync} from "node:fs";
import {dirname, join, resolve} from "node:path";
import {execFile} from "node:child_process";
import {promisify} from "node:util";
import {fileURLToPath} from "node:url";
import {buildGeometryReviewArtifact} from "../harness/slide-geometry/review/geometryReviewArtifact";
import type {BrowserGeometryTextProbe} from "../harness/slide-geometry/review/browserGeometryTextProbe";
import {REMOTION_STEP_SEQUENCE} from "../remotion/sceneTimeline";
import type {StoryStepId} from "../storyboard-data/pso-workbench-types";
import {
  buildGeometryReviewMarkdown,
  buildGeometryReviewSummary,
} from "./geometryReviewSummary";
import {
  findPreferredGeometryReviewSurfaceByStepId,
  type GeometryReviewSurfaceSource,
} from "./geometryReviewSurface";
import {writeJsonArtifact, writeTextArtifact} from "./reviewArtifactWriter";

const execFileAsync = promisify(execFile);
const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(CURRENT_DIR, "../../..");
const WORKLOAD_ROOT = join(REPO_ROOT, "Docs", "剧本", "workloads");

export type ReviewPageEntry =
  | {
      stepId: StoryStepId;
      status: "ok";
      sketchId: string;
      reviewSource: GeometryReviewSurfaceSource;
      summary: ReturnType<typeof buildGeometryReviewSummary>;
    }
  | {
      stepId: StoryStepId;
      status: "missing_sketch";
    };

export type TimingProbeOkResult = {
  verdict: string;
  markdown: string;
  payload: Record<string, unknown>;
};

export type TimingProbeResponse =
  | {
      status: "ok";
      result: TimingProbeOkResult;
    }
  | {
      status: "probe_error" | "probe_not_requested";
      error?: string;
      result?: undefined;
    };

export type ReviewTransitionEntry =
  | {
      fromStepId: StoryStepId;
      toStepId: StoryStepId;
      status: "ok";
      workloadPath: string;
      timing: TimingProbeOkResult;
    }
  | {
      fromStepId: StoryStepId;
      toStepId: StoryStepId;
      status: "missing_workload";
    }
  | {
      fromStepId: StoryStepId;
      toStepId: StoryStepId;
      status: "probe_error" | "probe_not_requested";
      workloadPath: string;
      error?: string;
    };

export type Page19PlusReviewSummary = {
  fromStepId: StoryStepId;
  stepIds: StoryStepId[];
  pages: ReviewPageEntry[];
  transitions: ReviewTransitionEntry[];
};

export type ProbeTimingTransition = (args: {
  fromStepId: StoryStepId;
  toStepId: StoryStepId;
  workloadPath: string;
}) => Promise<TimingProbeResponse>;

export type ResolveWorkloadPath = (args: {
  fromStepId: StoryStepId;
  toStepId: StoryStepId;
}) => string | undefined;

export type ResolveBrowserTextProbe = (args: {
  stepId: StoryStepId;
}) => Promise<BrowserGeometryTextProbe | null>;

export function normalizeTimingProbeStdout(raw: string): TimingProbeOkResult {
  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    payload = {rawOutput: raw};
  }

  const verdict =
    typeof (payload as {timingStandardEval?: {verdict?: string}}).timingStandardEval
      ?.verdict === "string"
      ? (payload as {timingStandardEval: {verdict: string}}).timingStandardEval.verdict
      : "unknown";
  const markdown =
    typeof payload.markdown === "string" && payload.markdown.trim().length > 0
      ? payload.markdown
      : raw;

  return {
    verdict,
    markdown,
    payload,
  };
}

export function resolvePage19PlusStepIds(
  fromStepId: StoryStepId = "page_19",
): StoryStepId[] {
  const startIndex = REMOTION_STEP_SEQUENCE.indexOf(fromStepId);
  if (startIndex === -1) {
    throw new Error(`Unknown review start step: ${fromStepId}`);
  }
  return REMOTION_STEP_SEQUENCE.slice(startIndex);
}

function resolveWorkloadPathCandidate(
  fromStepId: StoryStepId,
  toStepId: StoryStepId,
) {
  return join(WORKLOAD_ROOT, `${fromStepId}_to_${toStepId}.json`);
}

function compactPageId(stepId: StoryStepId) {
  return stepId.replace("page_", "page");
}

function resolveExistingWorkloadPath(
  fromStepId: StoryStepId,
  toStepId: StoryStepId,
): string | undefined {
  const candidates = [
    resolveWorkloadPathCandidate(fromStepId, toStepId),
    join(WORKLOAD_ROOT, `${compactPageId(fromStepId)}_to_${toStepId}.json`),
    join(WORKLOAD_ROOT, `${fromStepId}_to_${compactPageId(toStepId)}.json`),
    join(
      WORKLOAD_ROOT,
      `${compactPageId(fromStepId)}_to_${compactPageId(toStepId)}.json`,
    ),
  ];

  return candidates.find((candidate) => existsSync(candidate));
}

function resolvePageMarkdown(entry: ReviewPageEntry) {
  if (entry.status === "missing_sketch") {
    return `# ${entry.stepId} Geometry Review\n\n- status: missing_sketch\n`;
  }
  return buildGeometryReviewMarkdown(entry.summary);
}

function resolveTransitionMarkdown(entry: ReviewTransitionEntry) {
  if (entry.status === "ok") {
    return entry.timing.markdown;
  }
  const lines = [
    `# ${entry.fromStepId} -> ${entry.toStepId} Timing Review`,
    "",
    `- status: ${entry.status}`,
  ];
  if ("error" in entry && entry.error) {
    lines.push(`- error: ${entry.error}`);
  }
  return `${lines.join("\n")}\n`;
}

export async function defaultProbeTimingTransition(args: {
  fromStepId: StoryStepId;
  toStepId: StoryStepId;
  workloadPath: string;
}): Promise<TimingProbeResponse> {
  const probeScript = join(
    REPO_ROOT,
    "scripts",
    "slide-geometry-harness",
    "probe_transition_timeline.py",
  );

  try {
    const {stdout} = await execFileAsync("python3", [
      probeScript,
      "--from-step",
      args.fromStepId,
      "--to-step",
      args.toStepId,
      "--workload-json",
      args.workloadPath,
      "--emit-markdown",
    ], {
      cwd: REPO_ROOT,
      maxBuffer: 1024 * 1024 * 8,
    });

    const raw = stdout.trim();

    return {
      status: "ok",
      result: normalizeTimingProbeStdout(raw),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      status: "probe_error",
      error: message,
    };
  }
}

export async function runPage19PlusReview(args: {
  outputDir: string;
  fromStepId?: StoryStepId;
  probeTimingTransition?: ProbeTimingTransition;
  resolveWorkloadPath?: ResolveWorkloadPath;
  resolveBrowserTextProbe?: ResolveBrowserTextProbe;
}): Promise<Page19PlusReviewSummary> {
  const fromStepId = args.fromStepId ?? "page_19";
  const stepIds = resolvePage19PlusStepIds(fromStepId);
  const probeTimingTransition =
    args.probeTimingTransition ?? defaultProbeTimingTransition;
  const resolveWorkloadPath =
    args.resolveWorkloadPath ??
    (({fromStepId: previousStepId, toStepId}: {fromStepId: StoryStepId; toStepId: StoryStepId}) =>
      resolveExistingWorkloadPath(previousStepId, toStepId));

  const pages: ReviewPageEntry[] = [];
  for (const stepId of stepIds) {
    const reviewSurface = findPreferredGeometryReviewSurfaceByStepId(stepId);
    if (!reviewSurface) {
      pages.push({
        stepId,
        status: "missing_sketch",
      });
      continue;
    }

    const browserTextProbe = args.resolveBrowserTextProbe
      ? await args.resolveBrowserTextProbe({stepId})
      : null;
    const artifact = buildGeometryReviewArtifact(reviewSurface.sketch, {
      browserTextProbe,
    });
    pages.push({
      stepId,
      status: "ok",
      sketchId: reviewSurface.sketch.id,
      reviewSource: reviewSurface.reviewSource,
      summary: buildGeometryReviewSummary({
        sketchId: reviewSurface.sketch.id,
        stepId: reviewSurface.sketch.stepId,
        label: reviewSurface.sketch.label,
        artifact,
      }),
    });
  }

  const transitions: ReviewTransitionEntry[] = [];
  for (const stepId of stepIds) {
    const index = REMOTION_STEP_SEQUENCE.indexOf(stepId);
    if (index <= 0) {
      continue;
    }

    const previousStepId = REMOTION_STEP_SEQUENCE[index - 1]!;
    const workloadPath = resolveWorkloadPath({
      fromStepId: previousStepId,
      toStepId: stepId,
    });
    if (!workloadPath) {
      transitions.push({
        fromStepId: previousStepId,
        toStepId: stepId,
        status: "missing_workload",
      });
      continue;
    }

    const probeResult = await probeTimingTransition({
      fromStepId: previousStepId,
      toStepId: stepId,
      workloadPath,
    });

    if (probeResult.status === "ok") {
      transitions.push({
        fromStepId: previousStepId,
        toStepId: stepId,
        status: "ok",
        workloadPath,
        timing: probeResult.result,
      });
      continue;
    }

    transitions.push({
      fromStepId: previousStepId,
      toStepId: stepId,
      status: probeResult.status,
      workloadPath,
      error: probeResult.error,
    });
  }

  const summary: Page19PlusReviewSummary = {
    fromStepId,
    stepIds,
    pages,
    transitions,
  };

  writeJsonArtifact(join(args.outputDir, "summary.json"), summary);

  pages.forEach((entry) => {
    writeJsonArtifact(
      join(args.outputDir, "pages", `${entry.stepId}.geometry.json`),
      entry,
    );
    writeTextArtifact(
      join(args.outputDir, "pages", `${entry.stepId}.geometry.md`),
      resolvePageMarkdown(entry),
    );
  });

  transitions.forEach((entry) => {
    const baseName = `${entry.fromStepId}__to__${entry.toStepId}.timing`;
    writeJsonArtifact(join(args.outputDir, "transitions", `${baseName}.json`), entry);
    writeTextArtifact(
      join(args.outputDir, "transitions", `${baseName}.md`),
      resolveTransitionMarkdown(entry),
    );
  });

  return summary;
}
