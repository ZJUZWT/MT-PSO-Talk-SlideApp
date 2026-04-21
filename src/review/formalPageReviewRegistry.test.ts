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
        "page_04_data",
        "page_05",
        "page_14",
        "page_18",
        "page_18_img",
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
        "pipeline-api-label",
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

  it("registers page_04_data as a first-class formal overlay review surface", () => {
    const page04Data = findFormalPageReviewSketchByStepId("page_04_data");

    expect(page04Data).toBeDefined();
    expect(page04Data?.nodes.map((node) => node.id)).toEqual(
      expect.arrayContaining([
        "data-title",
        "data-subtitle",
        "data-table",
        "data-header-api",
        "data-row-create-api",
        "data-row-bind-pipeline-avg",
      ]),
    );

    const artifact = buildGeometryReviewArtifact(page04Data!);

    expect(artifact.metrics.overlapCount).toBe(0);
    expect(artifact.metrics.crossingCount).toBe(0);
    expect(artifact.metrics.nodePierceCount).toBe(0);
    expect(artifact.metrics.textOverflowCount).toBe(0);
    expect(artifact.metrics.childOutOfBoundsCount).toBe(0);
    expect(artifact.scores.blockerOpen).toBe(false);
  });

  it("registers page_05 as a first-class formal UE Cook review surface", () => {
    const page05 = findFormalPageReviewSketchByStepId("page_05");

    expect(page05).toBeDefined();
    expect(page05?.nodes.map((node) => node.id)).toEqual(
      expect.arrayContaining([
        "material-node",
        "cooked-node",
        "binary-node",
        "mesh-node",
        "vertex-data-node",
        "gpu-node",
        "pixels-node",
        "ue-pso-card",
        "ue-pso-title",
        "ue-pso-shader",
        "ue-pso-usage-mask",
        "ue-pso-bind-count",
        "ue-pso-state-1",
        "ue-pso-state-2",
        "ue-pso-state-3",
        "ue-pso-state-4",
        "ue-pso-state-5",
      ]),
    );

    const artifact = buildGeometryReviewArtifact(page05!);

    expect(artifact.metrics.overlapCount).toBe(0);
    expect(artifact.metrics.crossingCount).toBe(0);
    expect(artifact.metrics.nodePierceCount).toBe(0);
    expect(artifact.metrics.textOverflowCount).toBe(0);
    expect(artifact.metrics.childOutOfBoundsCount).toBe(0);
    expect(artifact.scores.blockerOpen).toBe(false);
  });

  it("registers page_14 as a split UE-PSO and Gfx-PSO review surface", () => {
    const page14 = findFormalPageReviewSketchByStepId("page_14");
    const recCard = page14?.nodes.find((node) => node.id === "rec-card");
    const recordSavePill = page14?.nodes.find((node) => node.id === "record-save-pill");
    const bindUsePill = page14?.nodes.find((node) => node.id === "bind-use-pill");
    const ueToRec = page14?.edges.find((edge) => edge.id === "ue-to-rec");

    expect(page14).toBeDefined();
    expect(page14?.nodes.map((node) => node.id)).toEqual(
      expect.arrayContaining([
        "page14-board",
        "rec-card",
        "record-save-pill",
        "ue-pso-card",
        "create-resolve-pill",
        "gfx-pso-card",
        "bind-use-pill",
        "gpu-runtime-stack",
      ]),
    );
    expect(recCard?.width).toBeGreaterThanOrEqual(288);
    expect((recordSavePill?.x ?? Infinity) + (recordSavePill?.width ?? 0)).toBeLessThan(308);
    expect(bindUsePill?.x).toBeLessThan(780);
    expect(
      Math.abs((ueToRec?.waypoints?.[0]?.x ?? 0) - 320),
    ).toBeLessThanOrEqual(96);

    const artifact = buildGeometryReviewArtifact(page14!);
    const ueToRecMetric = artifact.edgeRouteMetrics.find((edge) => edge.edgeId === "ue-to-rec");

    expect(artifact.metrics.overlapCount).toBe(0);
    expect(artifact.metrics.crossingCount).toBe(0);
    expect(artifact.metrics.nodePierceCount).toBe(0);
    expect(artifact.metrics.textOverflowCount).toBe(0);
    expect(artifact.metrics.childOutOfBoundsCount).toBe(0);
    expect(artifact.metrics.minNodeGap).toBeGreaterThanOrEqual(6);
    expect(ueToRecMetric?.detourRatio ?? Infinity).toBeLessThan(0.2);
    expect(artifact.scores.blockerOpen).toBe(false);
    expect(artifact.mechanicalScore).toBeGreaterThanOrEqual(6);
  });

  it("registers page_18 as a first-class formal review surface", () => {
    const page18 = findFormalPageReviewSketchByStepId("page_18");

    expect(page18).toBeDefined();
    expect(page18?.nodes.map((node) => node.id)).toEqual(
      expect.arrayContaining([
        "rec-node",
        "computer-shell",
        "scl-node",
        "merge-a",
        "stablepc-node",
        "merge-b",
        "stable-upipe-node",
        "split-a",
        "bytecode-node",
        "phone-shell",
      ]),
    );

    const artifact = buildGeometryReviewArtifact(page18!);

    expect(artifact.metrics.overlapCount).toBe(0);
    expect(artifact.metrics.crossingCount).toBe(0);
    expect(artifact.metrics.nodePierceCount).toBe(0);
    expect(artifact.metrics.textOverflowCount).toBe(0);
    expect(artifact.metrics.minNodeGap).toBeGreaterThan(0);
    expect(artifact.scores.blockerOpen).toBe(false);
  });

  it("registers page_18_img as a first-class formal overlay review surface", () => {
    const page18Img = findFormalPageReviewSketchByStepId("page_18_img");

    expect(page18Img).toBeDefined();
    expect(page18Img?.nodes.map((node) => node.id)).toEqual(
      expect.arrayContaining([
        "evidence-image",
        "prompt-card",
      ]),
    );

    const artifact = buildGeometryReviewArtifact(page18Img!);

    expect(artifact.metrics.overlapCount).toBe(0);
    expect(artifact.metrics.crossingCount).toBe(0);
    expect(artifact.metrics.nodePierceCount).toBe(0);
    expect(artifact.metrics.textOverflowCount).toBe(0);
    expect(artifact.metrics.childOutOfBoundsCount).toBe(0);
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

  it("measures page_21 shader card typography as explicit technical-name runs", () => {
    const page21 = findFormalPageReviewSketchByStepId("page_21");

    expect(page21).toBeDefined();

    const artifact = buildGeometryReviewArtifact(page21!);
    const shaderCard = artifact.nodeTextMetrics.find(
      (nodeMetric) => nodeMetric.nodeId === "shader-card",
    );

    expect(shaderCard).toMatchObject({
      nodeId: "shader-card",
      lineCount: 2,
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
