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
        "page_01",
        "page_02",
        "page_03",
        "page_04",
        "page_04_data",
        "page_05",
        "page_14",
        "page_16",
        "page_17",
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
        "page_29_data",
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

  it("registers page_01 as a first-class formal review surface", () => {
    const page01 = findFormalPageReviewSketchByStepId("page_01");

    expect(page01).toBeDefined();
    expect(page01?.nodes.map((node) => node.id)).toEqual(
      expect.arrayContaining([
        "input-box",
        "fx-box",
        "output-box",
      ]),
    );

    const artifact = buildGeometryReviewArtifact(page01!);

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

  it("registers page_04 as a first-class formal PSO review surface", () => {
    const page04 = findFormalPageReviewSketchByStepId("page_04");

    expect(page04).toBeDefined();
    expect(page04?.nodes.map((node) => node.id)).toEqual(
      expect.arrayContaining([
        "workflow-frame",
        "depth",
        "blend",
        "description",
        "pso",
      ]),
    );

    const artifact = buildGeometryReviewArtifact(page04!);

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
    const uePsoCard = page14?.nodes.find((node) => node.id === "ue-pso-card");
    const createResolvePill = page14?.nodes.find((node) => node.id === "create-resolve-pill");
    const gfxPsoCard = page14?.nodes.find((node) => node.id === "gfx-pso-card");
    const bindUsePill = page14?.nodes.find((node) => node.id === "bind-use-pill");
    const gpuRuntimeStack = page14?.nodes.find((node) => node.id === "gpu-runtime-stack");
    const ueToGfx = page14?.edges.find((edge) => edge.id === "ue-to-gfx");
    const ueToRec = page14?.edges.find((edge) => edge.id === "ue-to-rec");
    const gfxToGpu = page14?.edges.find((edge) => edge.id === "gfx-to-gpu");

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
    expect(
      Math.abs(
        (ueToRec?.from.x ?? 0) - ((recordSavePill?.x ?? 0) + (recordSavePill?.width ?? 0)),
      ),
    ).toBeLessThanOrEqual(16);
    expect(recordSavePill?.y).toBeGreaterThanOrEqual(228);
    expect((gfxPsoCard?.x ?? 0) - ((uePsoCard?.x ?? 0) + (uePsoCard?.width ?? 0))).toBeGreaterThanOrEqual(140);
    expect(
      (gpuRuntimeStack?.x ?? 0) - ((gfxPsoCard?.x ?? 0) + (gfxPsoCard?.width ?? 0)),
    ).toBeGreaterThanOrEqual(130);
    expect(createResolvePill?.y).toBeGreaterThanOrEqual(328);
    expect(bindUsePill?.y).toBeGreaterThanOrEqual(328);
    expect(
      Math.abs(
        (createResolvePill?.x ?? 0) +
          (createResolvePill?.width ?? 0) / 2 -
          (((ueToGfx?.from.x ?? 0) + (ueToGfx?.to.x ?? 0)) / 2),
      ),
    ).toBeLessThanOrEqual(8);
    expect(
      Math.abs(
        (bindUsePill?.x ?? 0) +
          (bindUsePill?.width ?? 0) / 2 -
          (((gfxToGpu?.from.x ?? 0) + (gfxToGpu?.to.x ?? 0)) / 2),
      ),
    ).toBeLessThanOrEqual(8);
    expect(
      Math.abs((ueToRec?.waypoints?.[0]?.x ?? 0) - 300),
    ).toBeLessThanOrEqual(72);

    const artifact = buildGeometryReviewArtifact(page14!);
    const ueToRecMetric = artifact.edgeRouteMetrics.find((edge) => edge.edgeId === "ue-to-rec");

    expect(artifact.metrics.overlapCount).toBe(0);
    expect(artifact.metrics.crossingCount).toBe(0);
    expect(artifact.metrics.nodePierceCount).toBe(0);
    expect(artifact.metrics.textOverflowCount).toBe(0);
    expect(artifact.metrics.childOutOfBoundsCount).toBe(0);
    expect(artifact.metrics.minNodeGap).toBeGreaterThanOrEqual(8);
    expect(ueToRecMetric?.detourRatio ?? Infinity).toBeLessThan(0.2);
    expect(artifact.scores.blockerOpen).toBe(false);
    expect(artifact.mechanicalScore).toBeGreaterThanOrEqual(6);
  });

  it("registers page_16 as a first-class why-expand formal review surface", () => {
    const page16 = findFormalPageReviewSketchByStepId("page_16");
    const expandMergeNode = page16?.nodes.find((node) => node.id === "expand-merge");
    const exampleCard = page16?.nodes.find((node) => node.id === "expand-example-card");

    expect(page16).toBeDefined();
    expect(page16?.nodes.map((node) => node.id)).toEqual(
      expect.arrayContaining([
        "page16-board",
        "page16-title",
        "page16-subtitle",
        "rec-node",
        "scl-node",
        "expand-merge",
        "expand-pill",
        "stablepc-node",
        "stable-note-top",
        "stable-note-bottom",
        "expand-example-card",
        "hash-token",
        "stable-key-a",
        "stable-key-b",
      ]),
    );
    expect(expandMergeNode?.shape).toBe("circle");
    expect(exampleCard?.tone).toBe("muted");

    const artifact = buildGeometryReviewArtifact(page16!);

    expect(artifact.metrics.overlapCount).toBe(0);
    expect(artifact.metrics.crossingCount).toBe(0);
    expect(artifact.metrics.nodePierceCount).toBe(0);
    expect(artifact.metrics.textOverflowCount).toBe(0);
    expect(artifact.metrics.childOutOfBoundsCount).toBe(0);
    expect(artifact.metrics.minMargin).toBeGreaterThanOrEqual(20);
    expect(artifact.metrics.minNodeGap).toBeGreaterThan(0);
    expect(artifact.scores.blockerOpen).toBe(false);
  });

  it("registers page_17 as a build-only formal review surface", () => {
    const page17 = findFormalPageReviewSketchByStepId("page_17");
    const stablepcNode = page17?.nodes.find((node) => node.id === "stablepc-node");
    const currentSclNode = page17?.nodes.find((node) => node.id === "current-scl-node");
    const stableCacheNode = page17?.nodes.find((node) => node.id === "stable-cache-node");
    const buildMergeNode = page17?.nodes.find((node) => node.id === "build-merge");
    const stableLabelTop = page17?.nodes.find((node) => node.id === "stable-label-top");
    const stableLabel = page17?.nodes.find((node) => node.id === "stable-label");
    const currentLabel = page17?.nodes.find((node) => node.id === "current-label");
    const mappingExample = page17?.nodes.find((node) => node.id === "mapping-example");
    const stableCacheDetail = page17?.nodes.find((node) => node.id === "stable-cache-detail");

    expect(page17).toBeDefined();
    expect(page17?.nodes.map((node) => node.id)).toEqual(
      expect.arrayContaining([
        "page17-board",
        "stablepc-node",
        "current-scl-node",
        "build-pill",
        "build-merge",
        "mapping-pill",
        "stable-cache-node",
      ]),
    );
    expect(stablepcNode?.width).toBeGreaterThanOrEqual(300);
    expect(currentSclNode?.width).toBeGreaterThanOrEqual(220);
    expect(stableCacheNode?.width).toBeGreaterThanOrEqual(300);
    expect(stableLabelTop?.label).toBe("所有历史版本的");
    expect(stableLabel?.label).toBe("稳定UE PSO");
    expect(stablepcNode?.textRuns?.map((run) => run.text)).toEqual(
      expect.arrayContaining(["ShaderStableKey + State", "stablepc.csv"]),
    );
    expect(currentLabel?.label).toBe("当前版本Cook出来的双向映射");
    expect(mappingExample?.label).toBe("ShaderHash <-> ShaderStableKey");
    expect(stableCacheDetail?.label).toBe("当前包体可以用作预编译的UE PSO");
    expect(stableCacheNode?.labelLines).toEqual(["stable.", "upipelinecache"]);
    expect(buildMergeNode?.shape).toBe("circle");

    const artifact = buildGeometryReviewArtifact(page17!);

    expect(artifact.metrics.overlapCount).toBe(0);
    expect(artifact.metrics.crossingCount).toBe(0);
    expect(artifact.metrics.nodePierceCount).toBe(0);
    expect(artifact.metrics.textOverflowCount).toBe(0);
    expect(artifact.metrics.childOutOfBoundsCount).toBe(0);
    expect(artifact.metrics.minMargin).toBeGreaterThanOrEqual(24);
    expect(artifact.metrics.minNodeGap).toBeGreaterThan(0);
    expect(artifact.scores.blockerOpen).toBe(false);
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

  it("registers page_29_data as a first-class formal late-tail review surface", () => {
    const page29Data = findFormalPageReviewSketchByStepId("page_29_data");

    expect(page29Data).toBeDefined();
    expect(page29Data?.nodes.map((node) => node.id)).toEqual(
      expect.arrayContaining([
        "shader-card",
        "vertex-code",
        "fragment-code",
        "state-card",
        "state-vk",
        "state-gl",
        "pc-card",
        "android-card",
        "pc-row-1",
        "pc-row-2",
        "android-row-1",
        "android-row-2",
        "footer-note",
      ]),
    );

    const artifact = buildGeometryReviewArtifact(page29Data!);

    expect(artifact.metrics.overlapCount).toBe(0);
    expect(artifact.metrics.crossingCount).toBe(0);
    expect(artifact.metrics.nodePierceCount).toBe(0);
    expect(artifact.metrics.textOverflowCount).toBe(0);
    expect(artifact.metrics.childOutOfBoundsCount).toBe(0);
    expect(artifact.scores.blockerOpen).toBe(false);
  });

  it("registers page_29 as a centered twin-code evidence surface", () => {
    const page29 = findFormalPageReviewSketchByStepId("page_29");

    expect(page29).toBeDefined();
    expect(page29?.nodes.map((node) => node.id)).toEqual(
      expect.arrayContaining([
        "compile-param",
        "left-code",
        "right-code",
        "left-image",
        "right-image",
        "footer",
      ]),
    );

    const leftCode = page29?.nodes.find((node) => node.id === "left-code");
    const rightCode = page29?.nodes.find((node) => node.id === "right-code");
    const leftImage = page29?.nodes.find((node) => node.id === "left-image");
    const rightImage = page29?.nodes.find((node) => node.id === "right-image");
    const pairCenter =
      (((leftCode?.x ?? 0) + (leftCode?.width ?? 0) / 2) +
        ((rightCode?.x ?? 0) + (rightCode?.width ?? 0) / 2)) /
      2;

    expect(leftCode?.width).toBe(rightCode?.width);
    expect(leftCode?.height).toBe(rightCode?.height);
    expect(leftImage?.width).toBe(leftCode?.width);
    expect(rightImage?.width).toBe(rightCode?.width);
    expect(leftImage?.height).toBe(rightImage?.height);
    expect(Math.abs(pairCenter - 640)).toBeLessThanOrEqual(2);

    const artifact = buildGeometryReviewArtifact(page29!);

    expect(artifact.metrics.overlapCount).toBe(0);
    expect(artifact.metrics.crossingCount).toBe(0);
    expect(artifact.metrics.nodePierceCount).toBe(0);
    expect(artifact.metrics.textOverflowCount).toBe(0);
    expect(artifact.metrics.childOutOfBoundsCount).toBe(0);
    expect(artifact.scores.blockerOpen).toBe(false);
  });

  it("registers page_30 as a full-stage reading column instead of a narrow center strip", () => {
    const page30 = findFormalPageReviewSketchByStepId("page_30");

    expect(page30).toBeDefined();
    expect(page30?.nodes.map((node) => node.id)).toEqual(
      expect.arrayContaining([
        "reading-card",
        "reading-link-1",
        "reading-link-2",
        "reading-link-3",
        "reading-link-4",
      ]),
    );

    const readingCard = page30?.nodes.find((node) => node.id === "reading-card");
    const link1 = page30?.nodes.find((node) => node.id === "reading-link-1");
    const link2 = page30?.nodes.find((node) => node.id === "reading-link-2");
    const link3 = page30?.nodes.find((node) => node.id === "reading-link-3");
    const link4 = page30?.nodes.find((node) => node.id === "reading-link-4");

    expect(readingCard).toBeDefined();
    expect(readingCard?.x).toBeLessThanOrEqual(140);
    expect(readingCard?.width).toBeGreaterThanOrEqual(1000);
    expect(readingCard?.height).toBeGreaterThanOrEqual(540);
    expect(link1?.containerId).toBe("reading-card");
    expect(link4?.containerId).toBe("reading-card");
    expect(link1?.width).toBeGreaterThanOrEqual(900);
    expect(link1?.x).toBeLessThanOrEqual(186);
    expect((link2?.y ?? 0) - (link1?.y ?? 0)).toBeGreaterThanOrEqual(120);
    expect((link3?.y ?? 0) - (link2?.y ?? 0)).toBeGreaterThanOrEqual(120);
    expect((link4?.y ?? 0) - (link3?.y ?? 0)).toBeGreaterThanOrEqual(120);

    const artifact = buildGeometryReviewArtifact(page30!);

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
        "loop-core-title",
        "hook-node",
        "data-node",
        "image-node",
        "receipt-node",
        "source-1",
        "source-2",
        "decision-1",
        "decision-2",
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

  it("registers page_32 as the page_01-style abstract endpoint", () => {
    const page32 = findFormalPageReviewSketchByStepId("page_32");

    expect(page32).toBeDefined();
    expect(page32?.nodes.map((node) => node.id)).toEqual(
      expect.arrayContaining([
        "bridge-title",
        "concept-harness",
        "concept-loss",
        "concept-feedback",
        "model-system-frame",
        "model-input",
        "model-fx",
        "model-output",
        "bridge-footer",
      ]),
    );

    const modelSystemFrame = page32?.nodes.find((node) => node.id === "model-system-frame");
    const conceptHarness = page32?.nodes.find((node) => node.id === "concept-harness");
    const conceptLoss = page32?.nodes.find((node) => node.id === "concept-loss");
    const conceptFeedback = page32?.nodes.find((node) => node.id === "concept-feedback");
    const modelFx = page32?.nodes.find((node) => node.id === "model-fx");
    const modelInput = page32?.nodes.find((node) => node.id === "model-input");
    const modelOutput = page32?.nodes.find((node) => node.id === "model-output");

    expect(modelSystemFrame).toBeDefined();
    expect(conceptHarness).toBeDefined();
    expect(conceptLoss).toBeDefined();
    expect(conceptFeedback).toBeDefined();
    expect(
      Math.abs(
        ((conceptHarness?.x ?? 0) + (conceptHarness?.width ?? 0) / 2) -
          ((modelSystemFrame?.x ?? 0) + (modelSystemFrame?.width ?? 0) / 2),
      ),
    ).toBeLessThanOrEqual(2);
    expect(
      Math.abs(
        ((conceptFeedback?.x ?? 0) + (conceptFeedback?.width ?? 0) / 2) -
          ((modelSystemFrame?.x ?? 0) + (modelSystemFrame?.width ?? 0) / 2),
      ),
    ).toBeLessThanOrEqual(2);
    expect((conceptLoss?.y ?? 0) - (conceptHarness?.y ?? 0)).toBeGreaterThanOrEqual(90);
    expect((conceptFeedback?.y ?? 0) - (conceptLoss?.y ?? 0)).toBeGreaterThanOrEqual(90);
    expect((conceptLoss?.x ?? 0) + (conceptLoss?.width ?? 0) / 2).toBeLessThan(
      (conceptHarness?.x ?? 0) + (conceptHarness?.width ?? 0) / 2 - 100,
    );
    expect(modelInput?.containerId).toBe("model-system-frame");
    expect(modelFx?.containerId).toBe("model-system-frame");
    expect(modelOutput?.containerId).toBe("model-system-frame");
    expect(
      Math.abs(
        ((modelFx?.x ?? 0) + (modelFx?.width ?? 0) / 2) -
          ((modelSystemFrame?.x ?? 0) + (modelSystemFrame?.width ?? 0) / 2),
      ),
    ).toBeLessThanOrEqual(2);

    const artifact = buildGeometryReviewArtifact(page32!);

    expect(artifact.metrics.overlapCount).toBe(0);
    expect(artifact.metrics.crossingCount).toBe(0);
    expect(artifact.metrics.nodePierceCount).toBe(0);
    expect(artifact.metrics.textOverflowCount).toBe(0);
    expect(artifact.scores.blockerOpen).toBe(false);
  });

  it("registers page_33 as the standalone final epilogue surface", () => {
    const page33 = findFormalPageReviewSketchByStepId("page_33");

    expect(page33).toBeDefined();
    expect(page33?.nodes.map((node) => node.id)).toEqual(
      expect.arrayContaining([
        "quote-body",
        "quote-footer",
        "left-link-1",
        "left-link-2",
        "repo-qr",
        "repo-url",
        "right-link-1",
        "right-link-2",
      ]),
    );

    const quoteTitle = page33?.nodes.find((node) => node.id === "quote-title");
    const quoteFooter = page33?.nodes.find((node) => node.id === "quote-footer");
    const leftLink = page33?.nodes.find((node) => node.id === "left-link-1");
    const rightLink = page33?.nodes.find((node) => node.id === "right-link-1");
    const repoQr = page33?.nodes.find((node) => node.id === "repo-qr");
    const leftMargin = leftLink?.x ?? 0;
    const rightMargin = 1280 - ((rightLink?.x ?? 0) + (rightLink?.width ?? 0));
    const leftGap = (repoQr?.x ?? 0) - ((leftLink?.x ?? 0) + (leftLink?.width ?? 0));
    const rightGap = (rightLink?.x ?? 0) - ((repoQr?.x ?? 0) + (repoQr?.width ?? 0));

    expect(quoteTitle).toBeUndefined();
    expect((repoQr?.y ?? 0) - ((quoteFooter?.y ?? 0) + (quoteFooter?.height ?? 0))).toBeGreaterThanOrEqual(24);
    expect(leftMargin).toBeGreaterThanOrEqual(120);
    expect(rightMargin).toBeGreaterThanOrEqual(120);
    expect(Math.abs(leftMargin - rightMargin)).toBeLessThanOrEqual(2);
    expect(leftGap).toBeGreaterThanOrEqual(120);
    expect(rightGap).toBeGreaterThanOrEqual(120);
    expect(Math.abs(leftGap - rightGap)).toBeLessThanOrEqual(2);

    const artifact = buildGeometryReviewArtifact(page33!);

    expect(artifact.metrics.overlapCount).toBe(0);
    expect(artifact.metrics.textOverflowCount).toBe(0);
    expect(artifact.scores.blockerOpen).toBe(false);
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

  it("models page_22 as a centered three-column rebuttal table with wider flow lanes", () => {
    const page22 = findFormalPageReviewSketchByStepId("page_22");

    expect(page22).toBeDefined();
    expect(page22?.nodes.map((node) => node.id)).toEqual(
      expect.arrayContaining([
        "left-column",
        "facts-column",
        "right-column",
        "footer",
      ]),
    );

    const leftColumn = page22?.nodes.find((node) => node.id === "left-column");
    const factsColumn = page22?.nodes.find((node) => node.id === "facts-column");
    const rightColumn = page22?.nodes.find((node) => node.id === "right-column");
    const leftGap = (factsColumn?.x ?? 0) - ((leftColumn?.x ?? 0) + (leftColumn?.width ?? 0));
    const rightGap = (rightColumn?.x ?? 0) - ((factsColumn?.x ?? 0) + (factsColumn?.width ?? 0));

    expect(leftColumn?.x).toBe(64);
    expect(leftColumn?.width).toBe(400);
    expect(factsColumn?.width).toBe(248);
    expect(rightColumn?.width).toBe(400);
    expect(leftGap).toBeGreaterThanOrEqual(52);
    expect(rightGap).toBeGreaterThanOrEqual(52);
    expect(Math.abs(leftGap - rightGap)).toBeLessThanOrEqual(1);

    const artifact = buildGeometryReviewArtifact(page22!);

    expect(artifact.metrics.overlapCount).toBe(0);
    expect(artifact.metrics.textOverflowCount).toBe(0);
    expect(artifact.scores.blockerOpen).toBe(false);
  });

  it("models page_24 as a comparison table plus a virtualization guide", () => {
    const page24 = findFormalPageReviewSketchByStepId("page_24");

    expect(page24).toBeDefined();
    expect(page24?.nodes.map((node) => node.id)).toEqual(
      expect.arrayContaining([
        "left-card",
        "package-row-1",
        "package-row-2",
        "package-row-3",
        "right-card",
        "virtual-guide",
        "memory",
        "disk",
        "footer",
      ]),
    );

    const artifact = buildGeometryReviewArtifact(page24!);

    expect(artifact.metrics.childOutOfBoundsCount).toBe(0);
    expect(artifact.metrics.textOverflowCount).toBe(0);
    expect(artifact.metrics.minContainmentPad).toBeGreaterThanOrEqual(4);
  });
});
