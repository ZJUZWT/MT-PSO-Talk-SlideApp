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
      "page_25",
      "page_26",
      "page_27",
      "page_28",
      "page_29",
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

    expect(summary.pages.find((entry: {stepId: string}) => entry.stepId === "page_21")).toMatchObject({
      stepId: "page_21",
      status: "ok",
      reviewSource: "formal",
    });
    expect(
      summary.transitions.find(
        (entry: {fromStepId: string; toStepId: string}) =>
          entry.fromStepId === "page_21" && entry.toStepId === "page_22",
      ),
    ).toMatchObject({
      fromStepId: "page_21",
      toStepId: "page_22",
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
    const page21 = JSON.parse(
      readFileSync(join(outputDir, "pages", "page_21.geometry.json"), "utf-8"),
    );
    const transition = JSON.parse(
      readFileSync(
        join(outputDir, "transitions", "page_18_img__to__page_19.timing.json"),
        "utf-8",
      ),
    );

    expect(summary.fromStepId).toBe("page_19");
    expect(page21.status).toBe("ok");
    expect(page21.reviewSource).toBe("formal");
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

  it("uses formal review surfaces for page_21 and page_22 instead of missing sketches", async () => {
    const mod = await import("./page19PlusReview");
    const outputDir = createTempDir();

    const summary = await mod.runPage19PlusReview({
      outputDir,
      resolveWorkloadPath: () => undefined,
      probeTimingTransition: async () => ({
        status: "probe_not_requested",
      }),
    });

    expect(summary.pages.find((entry: {stepId: string}) => entry.stepId === "page_21")).toMatchObject({
      stepId: "page_21",
      status: "ok",
      reviewSource: "formal",
    });
    expect(summary.pages.find((entry: {stepId: string}) => entry.stepId === "page_22")).toMatchObject({
      stepId: "page_22",
      status: "ok",
      reviewSource: "formal",
    });
  });

  it("feeds matching front-browser text probe data into page summaries", async () => {
    const mod = await import("./page19PlusReview");
    const outputDir = createTempDir();
    const browserTextProbe: BrowserGeometryTextProbe = {
      sketchId: "formal-page21",
      nodes: [
        {
          nodeId: "left-card",
          label: "什么时候会失效？",
          fontSizePx: 17.5,
          lineCount: 5,
          topPaddingPx: 14.2,
          rightPaddingPx: -56.1,
          bottomPaddingPx: 163.1,
          leftPaddingPx: 22,
          tightestPaddingPx: -56.1,
          textBounds: {
            x: 126,
            y: 160.2,
            width: 602.1,
            height: 224.7,
          },
          nodeBounds: {
            x: 104,
            y: 146,
            width: 568,
            height: 402,
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
        stepId === "page_21" ? browserTextProbe : null,
    });

    const page21 = summary.pages.find(
      (entry: {stepId: string}) => entry.stepId === "page_21",
    );

    expect(page21).toMatchObject({
      stepId: "page_21",
      status: "ok",
      summary: {
        keyMetrics: {
          textOverflowCount: 1,
        },
      },
    });
    if (!page21 || page21.status !== "ok") {
      throw new Error("Expected page_21 review page entry");
    }
    expect(
      page21.summary.worstNodes.find((node) => node.nodeId === "left-card"),
    ).toMatchObject({
      nodeId: "left-card",
      overflowPx: 56.1,
    });
  });
});
