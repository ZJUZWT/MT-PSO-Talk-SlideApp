import {mkdtempSync, readFileSync, rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {afterEach, describe, expect, it} from "vitest";
import type {BrowserGeometryTextProbe} from "../harness/slide-geometry/review/browserGeometryTextProbe";

const tempDirs: string[] = [];

function createTempDir() {
  const dir = mkdtempSync(join(tmpdir(), "page19plus-review-"));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) {
      rmSync(dir, {recursive: true, force: true});
    }
  }
});

describe("page_19+ review harness", () => {
  it("defaults review scope to page_19 and onward", async () => {
    const mod = await import("./page19PlusReview");

    expect(mod.resolvePage19PlusStepIds()).toEqual([
      "page_19",
      "page_21",
      "page_22",
      "page_24",
      "page_26",
      "page_28",
      "page_29",
      "page_29_data",
      "page_30",
      "page_31",
      "page_32",
      "page_33",
    ]);
  });

  it("marks missing workloads as advisory statuses while formal page review stays available", async () => {
    const mod = await import("./page19PlusReview");
    const outputDir = createTempDir();

    const summary = await mod.runPage19PlusReview({
      outputDir,
      resolveWorkloadPath: ({fromStepId, toStepId}: {fromStepId: string; toStepId: string}) =>
        fromStepId === "page_18_img" && toStepId === "page_19"
          ? join(
              process.cwd(),
              "Docs",
              "剧本",
              "workloads",
              "page_18_img_to_page_19.json",
            )
          : undefined,
      probeTimingTransition: async ({fromStepId, toStepId}: {fromStepId: string; toStepId: string}) => ({
        status:
          fromStepId === "page_18_img" && toStepId === "page_19"
            ? "ok"
            : "probe_not_requested",
        result:
          fromStepId === "page_18_img" && toStepId === "page_19"
            ? {
                verdict: "in_range",
                markdown: "# mock timing report",
                payload: {timingStandardEval: {verdict: "in_range"}},
              }
            : undefined,
      }),
    });

    expect(summary.pages.find((entry: {stepId: string}) => entry.stepId === "page_22")).toMatchObject({
      stepId: "page_22",
      status: "ok",
      reviewSource: "formal",
    });
    expect(
      summary.transitions.find(
        (entry: {fromStepId: string; toStepId: string}) =>
          entry.fromStepId === "page_19" && entry.toStepId === "page_21",
      ),
    ).toMatchObject({
      fromStepId: "page_19",
      toStepId: "page_21",
      status: "missing_workload",
    });
  });

  it("writes summary plus page and transition artifacts", async () => {
    const mod = await import("./page19PlusReview");
    const outputDir = createTempDir();

    await mod.runPage19PlusReview({
      outputDir,
      probeTimingTransition: async () => ({
        status: "ok",
        result: {
          verdict: "in_range",
          markdown: "# mock timing report",
          payload: {
            timingStandardEval: {
              verdict: "in_range",
              requiredSec: 1.1,
              allowedMinSec: 1.1,
              allowedMaxSec: 1.485,
            },
          },
        },
      }),
    });

    const summary = JSON.parse(readFileSync(join(outputDir, "summary.json"), "utf-8"));
    const page22 = JSON.parse(
      readFileSync(join(outputDir, "pages", "page_22.geometry.json"), "utf-8"),
    );
    const transition = JSON.parse(
      readFileSync(
        join(outputDir, "transitions", "page_18_img__to__page_19.timing.json"),
        "utf-8",
      ),
    );

    expect(summary.fromStepId).toBe("page_19");
    expect(page22.status).toBe("ok");
    expect(page22.reviewSource).toBe("formal");
    expect(transition.status).toBe("ok");
    expect(
      readFileSync(
        join(outputDir, "transitions", "page_18_img__to__page_19.timing.md"),
        "utf-8",
      ),
    ).toContain("mock timing report");
  });

  it("uses a formal page_19 sketch when available", async () => {
    const mod = await import("./page19PlusReview");
    const outputDir = createTempDir();

    const summary = await mod.runPage19PlusReview({
      outputDir,
      resolveWorkloadPath: () => undefined,
      probeTimingTransition: async () => ({
        status: "probe_not_requested",
      }),
    });

    expect(summary.pages.find((entry: {stepId: string}) => entry.stepId === "page_19")).toMatchObject({
      stepId: "page_19",
      status: "ok",
      sketchId: "page19-r1",
    });
  });

  it("can start mechanical review from page_02 and uses a formal page_02 surface", async () => {
    const mod = await import("./page19PlusReview");
    const outputDir = createTempDir();

    const summary = await mod.runPage19PlusReview({
      outputDir,
      fromStepId: "page_02",
      resolveWorkloadPath: () => undefined,
      probeTimingTransition: async () => ({
        status: "probe_not_requested",
      }),
    });

    expect(summary.fromStepId).toBe("page_02");
    expect(summary.pages.find((entry: {stepId: string}) => entry.stepId === "page_02")).toMatchObject({
      stepId: "page_02",
      status: "ok",
      reviewSource: "formal",
      sketchId: "formal-page02",
    });
  });

  it("uses formal review surfaces for page_22 and page_24 instead of missing sketches", async () => {
    const mod = await import("./page19PlusReview");
    const outputDir = createTempDir();

    const summary = await mod.runPage19PlusReview({
      outputDir,
      resolveWorkloadPath: () => undefined,
      probeTimingTransition: async () => ({
        status: "probe_not_requested",
      }),
    });

    expect(summary.pages.find((entry: {stepId: string}) => entry.stepId === "page_22")).toMatchObject({
      stepId: "page_22",
      status: "ok",
      reviewSource: "formal",
    });
    expect(summary.pages.find((entry: {stepId: string}) => entry.stepId === "page_24")).toMatchObject({
      stepId: "page_24",
      status: "ok",
      reviewSource: "formal",
    });
  });

  it("feeds matching front-browser text probe data into page summaries", async () => {
    const mod = await import("./page19PlusReview");
    const outputDir = createTempDir();
    const browserTextProbe: BrowserGeometryTextProbe = {
      sketchId: "formal-page22",
      nodes: [
        {
          nodeId: "left-column",
          label: "非要这么干？",
          fontSizePx: 18.5,
          lineCount: 6,
          topPaddingPx: 18.4,
          rightPaddingPx: -34.7,
          bottomPaddingPx: 19.8,
          leftPaddingPx: 20.2,
          tightestPaddingPx: -34.7,
          textBounds: {
            x: 84.2,
            y: 156.4,
            width: 414.5,
            height: 395.8,
          },
          nodeBounds: {
            x: 64,
            y: 138,
            width: 400,
            height: 434,
          },
        },
      ],
    };

    const summary = await mod.runPage19PlusReview({
      outputDir,
      resolveWorkloadPath: () => undefined,
      probeTimingTransition: async () => ({
        status: "probe_not_requested",
      }),
      resolveBrowserTextProbe: async ({stepId}: {stepId: string}) =>
        stepId === "page_22" ? browserTextProbe : null,
    });

    const page22 = summary.pages.find(
      (entry: {stepId: string}) => entry.stepId === "page_22",
    );

    expect(page22).toMatchObject({
      stepId: "page_22",
      status: "ok",
      summary: {
        keyMetrics: {
          textOverflowCount: 1,
        },
      },
    });
    if (!page22 || page22.status !== "ok") {
      throw new Error("Expected page_22 review page entry");
    }
    expect(
      page22.summary.worstNodes.find((node) => node.nodeId === "left-column"),
    ).toMatchObject({
      nodeId: "left-column",
      overflowPx: 34.7,
    });
  });
});
