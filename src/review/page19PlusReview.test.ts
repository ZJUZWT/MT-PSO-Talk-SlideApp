import {mkdtempSync, readFileSync, rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {afterEach, describe, expect, it} from "vitest";

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
});
