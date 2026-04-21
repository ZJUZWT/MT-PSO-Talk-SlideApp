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
        "page_00",
        "page_02",
        "page_03",
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

  it("registers page_00 as a first-class formal review surface", () => {
    const page00 = findFormalPageReviewSketchByStepId("page_00");

    expect(page00).toBeDefined();
    expect(page00?.nodes.map((node) => node.id)).toEqual(
      expect.arrayContaining([
        "before-image",
        "before-label",
        "compile-image",
        "compile-label",
        "after-label",
        "after-image",
      ]),
    );

    const artifact = buildGeometryReviewArtifact(page00!);

    expect(artifact.metrics.overlapCount).toBe(0);
    expect(artifact.metrics.crossingCount).toBe(0);
    expect(artifact.metrics.nodePierceCount).toBe(0);
    expect(artifact.metrics.textOverflowCount).toBe(0);
    expect(artifact.scores.blockerOpen).toBe(false);
  });

  it("registers page_02 as a first-class formal review surface", () => {
    const page02 = findFormalPageReviewSketchByStepId("page_02");

    expect(page02).toBeDefined();
    expect(page02?.nodes.map((node) => node.id)).toEqual(
      expect.arrayContaining([
        "pso-preview",
        "vertex-buffer-image",
        "pipeline-state",
        "gpu",
        "vertex-data",
        "pixels",
      ]),
    );

    const artifact = buildGeometryReviewArtifact(page02!);

    expect(artifact.metrics.overlapCount).toBe(0);
    expect(artifact.metrics.crossingCount).toBe(0);
    expect(artifact.metrics.nodePierceCount).toBe(0);
    expect(artifact.metrics.textOverflowCount).toBe(0);
    expect(artifact.metrics.minNodeGap).toBeGreaterThan(0);
    expect(artifact.metrics.minInternalPadding).toBeGreaterThanOrEqual(6);
    expect(artifact.scores.blockerOpen).toBe(false);
  });

  it("registers page_03 as a first-class formal review surface", () => {
    const page03 = findFormalPageReviewSketchByStepId("page_03");

    expect(page03).toBeDefined();
    expect(page03?.nodes.map((node) => node.id)).toEqual(
      expect.arrayContaining([
        "shader-code",
        "shader-binary",
        "depth",
        "blend",
        "program",
        "vertex-data",
        "gpu",
        "pixels",
      ]),
    );

    const artifact = buildGeometryReviewArtifact(page03!);

    expect(artifact.metrics.overlapCount).toBe(0);
    expect(artifact.metrics.crossingCount).toBe(0);
    expect(artifact.metrics.nodePierceCount).toBe(0);
    expect(artifact.metrics.textOverflowCount).toBe(0);
    expect(artifact.metrics.minNodeGap).toBeGreaterThan(0);
    expect(artifact.scores.blockerOpen).toBe(false);
  });

  it("lets the existing geometry score chain review page_31 without a sketch-only path", () => {
    const page31 = findFormalPageReviewSketchByStepId("page_31");

    expect(page31).toBeDefined();
    expect(page31?.nodes.map((node) => node.id)).toEqual(
      expect.arrayContaining([
        "loop-card",
        "agent-node",
        "edge-node",
        "artifact-node",
        "metrics-node",
        "policy-node",
        "feedback-node",
        "helper-card",
      ]),
    );

    const artifact = buildGeometryReviewArtifact(page31!);

    expect(artifact.metrics.overlapCount).toBe(0);
    expect(artifact.metrics.crossingCount).toBe(0);
    expect(artifact.metrics.nodePierceCount).toBe(0);
    expect(artifact.metrics.textOverflowCount).toBe(0);
    expect(artifact.scores.stageLayout).toBeGreaterThanOrEqual(6);
    expect(artifact.mechanicalScore).toBeGreaterThanOrEqual(6.3);
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
      lineCount: 6,
      overflowPx: 0,
    });
  });

  it("models page_24 platform pills as explicit child review surfaces", () => {
    const page24 = findFormalPageReviewSketchByStepId("page_24");

    expect(page24).toBeDefined();
    expect(page24?.nodes.map((node) => node.id)).toEqual(
      expect.arrayContaining([
        "package-row-1-windows",
        "package-row-1-macos",
        "package-row-1-android",
        "package-row-1-ios",
        "package-row-2-windows",
        "package-row-2-macos",
        "package-row-2-android",
        "package-row-2-ios",
        "package-row-3-windows",
        "package-row-3-macos",
        "package-row-3-android",
        "package-row-3-ios",
      ]),
    );

    const artifact = buildGeometryReviewArtifact(page24!);

    expect(artifact.metrics.childOutOfBoundsCount).toBe(0);
    expect(artifact.metrics.textOverflowCount).toBe(0);
    expect(artifact.metrics.minContainmentPad).toBeGreaterThanOrEqual(4);
  });
});
