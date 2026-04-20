import {describe, expect, it} from "vitest";
import {buildGeometryReviewArtifact} from "../harness/slide-geometry/review/geometryReviewArtifact";
import {
  findFormalPageReviewSketchByStepId,
  listFormalPageReviewSketches,
} from "./formalPageReviewRegistry";

describe("formal page review registry", () => {
  it("registers the late-tail formal pages as first-class review surfaces", () => {
    const stepIds = listFormalPageReviewSketches().map((entry) => entry.stepId);

    expect(stepIds).toEqual(
      expect.arrayContaining([
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
      ]),
    );
  });

  it("lets the existing geometry score chain review page_31 without a sketch-only path", () => {
    const page31 = findFormalPageReviewSketchByStepId("page_31");

    expect(page31).toBeDefined();

    const artifact = buildGeometryReviewArtifact(page31!);

    expect(artifact.metrics.overlapCount).toBe(0);
    expect(artifact.metrics.crossingCount).toBe(0);
    expect(artifact.metrics.nodePierceCount).toBe(0);
    expect(artifact.metrics.textOverflowCount).toBe(0);
    expect(artifact.scores.stageLayout).toBeGreaterThanOrEqual(6);
    expect(artifact.mechanicalScore).toBeGreaterThanOrEqual(6.5);
  });

  it("measures page_21 lead-card typography as multiple explicit runs", () => {
    const page21 = findFormalPageReviewSketchByStepId("page_21");

    expect(page21).toBeDefined();

    const artifact = buildGeometryReviewArtifact(page21!);
    const leadCard = artifact.nodeTextMetrics.find(
      (nodeMetric) => nodeMetric.nodeId === "left-card",
    );

    expect(leadCard).toMatchObject({
      nodeId: "left-card",
      lineCount: 5,
      overflowPx: 0,
    });
  });
});
