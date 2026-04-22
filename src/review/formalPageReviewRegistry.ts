import type {StoryStepId} from "../storyboard-data/pso-workbench-types";
import {page19R1Sketch} from "../harness/slide-geometry/contracts/page19-r1";
import type {
  GeometrySketchDefinition,
  SketchNode,
} from "../harness/slide-geometry/render/geometry-sketch-types";

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function node(
  id: string,
  label: string,
  box: Box,
  options: Partial<SketchNode> = {},
): SketchNode {
  return {
    id,
    label,
    x: box.x,
    y: box.y,
    width: box.width,
    height: box.height,
    shape: "roundedRect",
    ...options,
  };
}

function textNode(
  id: string,
  label: string,
  box: Box,
  options: Partial<SketchNode> = {},
): SketchNode {
  return node(id, label, box, {
    renderStyle: "textOnly",
    ...options,
  });
}

function buildPage24PlatformPillNodes(
  rowNodeId: string,
  rowBox: Box,
  labels: {
    windows: string;
    macos: string;
    android: string;
    ios: string;
  },
): SketchNode[] {
  const pillWidth = (rowBox.width - 52) / 2;
  const pillHeight = 28;
  const leftPillX = rowBox.x + 18;
  const rightPillX = rowBox.x + rowBox.width - 18 - pillWidth;
  const pillOptions = {
    containerId: rowNodeId,
    fontSizeOverride: 13.2,
    fontWeightOverride: 760,
  } satisfies Partial<SketchNode>;

  return [
    node(`${rowNodeId}-windows`, labels.windows, {
      x: leftPillX,
      y: rowBox.y + 58,
      width: pillWidth,
      height: pillHeight,
    }, pillOptions),
    node(`${rowNodeId}-macos`, labels.macos, {
      x: rightPillX,
      y: rowBox.y + 58,
      width: pillWidth,
      height: pillHeight,
    }, pillOptions),
    node(`${rowNodeId}-android`, labels.android, {
      x: leftPillX,
      y: rowBox.y + 92,
      width: pillWidth,
      height: pillHeight,
    }, pillOptions),
    node(`${rowNodeId}-ios`, labels.ios, {
      x: rightPillX,
      y: rowBox.y + 92,
      width: pillWidth,
      height: pillHeight,
    }, pillOptions),
  ];
}

function makeFormalReviewSketch(
  id: string,
  stepId: StoryStepId,
  label: string,
  nodes: SketchNode[],
): GeometrySketchDefinition {
  return {
    id,
    stepId,
    label,
    contract: {
      pageGoal: "Score the formal slide page with the shared geometry harness.",
      receiverPlane: "Formal Remotion stage",
      primaryLine: "Keep the main reading order and spacing legible.",
      keepStable: "Preserve the approved formal page composition.",
      newChange: "Use the formal page boxes as first-class review surfaces.",
      doNot: "Do not invent a second score system or parse SVG as the source of truth.",
    },
    nodes,
    edges: [],
  };
}

const page00FormalReviewSketch = makeFormalReviewSketch(
  "formal-page00",
  "page_00",
  "Page 00 three-step opening",
  [
    node("before-image", "启用前截图", {x: 88, y: 48, width: 820, height: 192}, {
      fontSizeOverride: 22,
      fontWeightOverride: 760,
    }),
    textNode("before-label", "PSO Cache启用前", {x: 950, y: 127, width: 240, height: 34}, {
      fontSizeOverride: 18,
      fontWeightOverride: 820,
      textColorOverride: "#c66f4c",
    }),
    node("compile-image", "编译条", {x: 88, y: 288, width: 820, height: 144}, {
      fontSizeOverride: 20,
      fontWeightOverride: 740,
    }),
    textNode("compile-label", "编译着色器", {x: 950, y: 343, width: 200, height: 34}, {
      fontSizeOverride: 18,
      fontWeightOverride: 820,
      textColorOverride: "#c66f4c",
    }),
    node("after-image", "启用后截图", {x: 88, y: 480, width: 820, height: 192}, {
      fontSizeOverride: 22,
      fontWeightOverride: 740,
    }),
    textNode("after-label", "PSO Cache启用后", {x: 950, y: 559, width: 240, height: 34}, {
      fontSizeOverride: 18,
      fontWeightOverride: 820,
      textColorOverride: "#c66f4c",
    }),
  ],
);

const page01FormalReviewSketch = makeFormalReviewSketch(
  "formal-page01",
  "page_01",
  "Page 01 abstract function",
  [
    node("input-box", "Input", {x: 210, y: 316, width: 150, height: 88}, {
      fontSizeOverride: 28,
      fontWeightOverride: 680,
    }),
    node("fx-box", "f(x)", {x: 480, y: 304, width: 320, height: 112}, {
      fontSizeOverride: 36,
      fontWeightOverride: 700,
    }),
    node("output-box", "Output", {x: 920, y: 316, width: 150, height: 88}, {
      fontSizeOverride: 28,
      fontWeightOverride: 680,
    }),
  ],
);

const page02FormalReviewSketch = makeFormalReviewSketch(
  "formal-page02",
  "page_02",
  "Page 02 pipeline-state preview",
  [
    node("pso-preview", "PSO = Shaders + States", {x: 120, y: 438, width: 504, height: 268}, {
      fontSizeOverride: 22,
      fontWeightOverride: 820,
    }),
    node("pso-shader", "VS / FS / GS / ...", {x: 138, y: 474, width: 468, height: 46}, {
      containerId: "pso-preview",
      fontSizeOverride: 20,
      fontWeightOverride: 780,
    }),
    node("pso-state-1", "Input Layout", {x: 138, y: 528, width: 228, height: 54}, {
      containerId: "pso-preview",
      fontSizeOverride: 20,
      fontWeightOverride: 760,
    }),
    node("pso-state-2", "RT / Format", {x: 378, y: 528, width: 228, height: 54}, {
      containerId: "pso-preview",
      fontSizeOverride: 20,
      fontWeightOverride: 760,
    }),
    node("pso-state-3", "Depth / Stencil Test", {x: 138, y: 586, width: 228, height: 54}, {
      containerId: "pso-preview",
      fontSizeOverride: 20,
      fontWeightOverride: 760,
    }),
    node("pso-state-4", "Blend / Rasterizer", {x: 378, y: 586, width: 228, height: 54}, {
      containerId: "pso-preview",
      fontSizeOverride: 20,
      fontWeightOverride: 760,
    }),
    node("pso-state-5", "Primitive / Samples / Pass", {x: 138, y: 644, width: 468, height: 44}, {
      containerId: "pso-preview",
      fontSizeOverride: 20,
      fontWeightOverride: 760,
    }),
    node("pipeline-state", "Pipeline State", {x: 518, y: 140, width: 244, height: 60}, {
      fontSizeOverride: 22,
      fontWeightOverride: 710,
    }),
    textNode("pipeline-api-label", "GfxAPI设置", {x: 694, y: 232, width: 176, height: 40}, {
      fontSizeOverride: 22,
      fontWeightOverride: 700,
      textColorOverride: "#d06b44",
    }),
    node("vertex-buffer-image", "VertexBuffer", {x: 690, y: 486, width: 560, height: 172}, {
      fontSizeOverride: 12.5,
      fontWeightOverride: 820,
    }),
    node("gpu", "GPU", {x: 480, y: 304, width: 320, height: 112}, {
      fontSizeOverride: 48,
      fontWeightOverride: 760,
    }),
    node("vertex-data", "VertexData", {x: 224, y: 327, width: 126, height: 60}, {
      fontSizeOverride: 16,
      fontWeightOverride: 720,
    }),
    node("pixels", "Pixels", {x: 965, y: 330, width: 60, height: 60}, {
      fontSizeOverride: 14,
      fontWeightOverride: 720,
    }),
  ],
);

const page03FormalReviewSketch = makeFormalReviewSketch(
  "formal-page03",
  "page_03",
  "Page 03 lowered spine and top configuration band",
  [
    node("shader-code", "RawShaderCode", {x: 286, y: 134, width: 156, height: 54}, {
      fontSizeOverride: 18,
      fontWeightOverride: 760,
    }),
    node("shader-binary", "BinaryShaderCode", {x: 536, y: 134, width: 152, height: 54}, {
      fontSizeOverride: 18,
      fontWeightOverride: 760,
    }),
    node("depth", "Depth", {x: 700, y: 134, width: 92, height: 54}, {
      fontSizeOverride: 18,
      fontWeightOverride: 760,
    }),
    node("blend", "Blend", {x: 814, y: 134, width: 92, height: 54}, {
      fontSizeOverride: 18,
      fontWeightOverride: 760,
    }),
    node("program", "Program", {x: 528, y: 244, width: 152, height: 52}, {
      fontSizeOverride: 24,
      fontWeightOverride: 720,
    }),
    node("vertex-data", "VertexData", {x: 210, y: 424, width: 150, height: 88}, {
      fontSizeOverride: 16,
      fontWeightOverride: 720,
    }),
    node("gpu", "GPU", {x: 420, y: 402, width: 440, height: 126}, {
      fontSizeOverride: 52,
      fontWeightOverride: 760,
    }),
    node("pixels", "Pixels", {x: 920, y: 424, width: 150, height: 88}, {
      fontSizeOverride: 16,
      fontWeightOverride: 720,
    }),
  ],
);

const page04FormalReviewSketch = makeFormalReviewSketch(
  "formal-page04",
  "page_04",
  "Page 04 PSO workflow stack",
  [
    node("workflow-frame", "", {x: 264, y: 92, width: 664, height: 281}, {
      renderStyle: "outline",
    }),
    node("shader-code", "RawShaderCode", {x: 286, y: 110, width: 156, height: 54}, {
      containerId: "workflow-frame",
      fontSizeOverride: 18,
      fontWeightOverride: 760,
    }),
    node("shader-binary", "BinaryShaderCode", {x: 536, y: 110, width: 152, height: 54}, {
      containerId: "workflow-frame",
      fontSizeOverride: 18,
      fontWeightOverride: 760,
    }),
    node("depth", "Depth", {x: 700, y: 110, width: 92, height: 54}, {
      containerId: "workflow-frame",
      fontSizeOverride: 18,
      fontWeightOverride: 760,
    }),
    node("blend", "Blend", {x: 814, y: 110, width: 92, height: 54}, {
      containerId: "workflow-frame",
      fontSizeOverride: 18,
      fontWeightOverride: 760,
    }),
    node("description", "Description", {x: 460, y: 211, width: 360, height: 44}, {
      containerId: "workflow-frame",
      fontSizeOverride: 23,
      fontWeightOverride: 700,
    }),
    node("pso", "PSO", {x: 460, y: 303, width: 360, height: 52}, {
      containerId: "workflow-frame",
      fontSizeOverride: 30,
      fontWeightOverride: 760,
    }),
    node("vertex-data", "VertexData", {x: 210, y: 424, width: 150, height: 88}, {
      fontSizeOverride: 16,
      fontWeightOverride: 720,
    }),
    node("gpu", "GPU", {x: 420, y: 402, width: 440, height: 126}, {
      fontSizeOverride: 52,
      fontWeightOverride: 760,
    }),
    node("pixels", "Pixels", {x: 920, y: 424, width: 150, height: 88}, {
      fontSizeOverride: 16,
      fontWeightOverride: 720,
    }),
  ],
);

const page04DataFormalReviewSketch = makeFormalReviewSketch(
  "formal-page04-data",
  "page_04_data",
  "Page 04 data overlay table",
  [
    textNode("data-title", "OpenGL / Vulkan 耗时对比表", {x: 360, y: 34, width: 560, height: 40}, {
      fontSizeOverride: 30,
      fontWeightOverride: 790,
    }),
    textNode("data-subtitle", "指标单位：ms，单元格格式为 Nubia / Pixel 7", {
      x: 308,
      y: 78,
      width: 664,
      height: 34,
    }, {
      fontSizeOverride: 24,
      fontWeightOverride: 640,
    }),
    textNode("data-note-n", "N = Nubia Z60 Ultra (Snapdragon 8 Gen 3)", {
      x: 260,
      y: 116,
      width: 760,
      height: 32,
    }, {
      fontSizeOverride: 22,
      fontWeightOverride: 620,
    }),
    textNode("data-note-p", "P = Pixel 7 (Google Tensor G2)", {
      x: 330,
      y: 152,
      width: 620,
      height: 32,
    }, {
      fontSizeOverride: 22,
      fontWeightOverride: 620,
    }),
    node("data-table", "耗时表", {x: 40, y: 200, width: 1200, height: 456}),
    textNode("data-header-api", "API", {x: 48, y: 214, width: 484, height: 44}, {
      containerId: "data-table",
      fontSizeOverride: 28,
      fontWeightOverride: 780,
    }),
    textNode("data-header-min", "Min (N/P)", {x: 556, y: 214, width: 185, height: 44}, {
      containerId: "data-table",
      fontSizeOverride: 28,
      fontWeightOverride: 780,
    }),
    textNode("data-header-max", "Max (N/P)", {x: 789, y: 214, width: 185, height: 44}, {
      containerId: "data-table",
      fontSizeOverride: 28,
      fontWeightOverride: 780,
    }),
    textNode("data-header-avg", "Avg (N/P)", {x: 1022, y: 214, width: 162, height: 44}, {
      containerId: "data-table",
      fontSizeOverride: 28,
      fontWeightOverride: 780,
    }),
    textNode("data-row-compile-api", "Compile (glCompileShader)", {
      x: 48,
      y: 291,
      width: 484,
      height: 42,
    }, {
      containerId: "data-table",
      fontSizeOverride: 22,
      fontWeightOverride: 760,
    }),
    textNode("data-row-compile-min", "0.396 / 0.470", {x: 556, y: 291, width: 185, height: 42}, {
      containerId: "data-table",
      fontSizeOverride: 22,
      fontWeightOverride: 760,
    }),
    textNode("data-row-compile-max", "19.797 / 85.457", {x: 789, y: 291, width: 185, height: 42}, {
      containerId: "data-table",
      fontSizeOverride: 22,
      fontWeightOverride: 760,
    }),
    textNode("data-row-compile-avg", "7.262 / 15.350", {x: 1014, y: 291, width: 178, height: 42}, {
      containerId: "data-table",
      fontSizeOverride: 22,
      fontWeightOverride: 760,
    }),
    textNode("data-row-link-api", "Link (glLinkProgram)", {x: 48, y: 367, width: 484, height: 42}, {
      containerId: "data-table",
      fontSizeOverride: 22,
      fontWeightOverride: 760,
    }),
    textNode("data-row-link-min", "1.059 / 0.125", {x: 556, y: 367, width: 185, height: 42}, {
      containerId: "data-table",
      fontSizeOverride: 22,
      fontWeightOverride: 760,
    }),
    textNode("data-row-link-max", "30.576 / 66.751", {x: 789, y: 367, width: 185, height: 42}, {
      containerId: "data-table",
      fontSizeOverride: 22,
      fontWeightOverride: 760,
    }),
    textNode("data-row-link-avg", "7.572 / 13.722", {x: 1014, y: 367, width: 178, height: 42}, {
      containerId: "data-table",
      fontSizeOverride: 22,
      fontWeightOverride: 760,
    }),
    textNode("data-row-bind-program-api", "Bind (BindProgramPipeline)", {
      x: 48,
      y: 444,
      width: 484,
      height: 42,
    }, {
      containerId: "data-table",
      fontSizeOverride: 22,
      fontWeightOverride: 760,
    }),
    textNode("data-row-bind-program-min", "0.000 / 0.000", {
      x: 556,
      y: 444,
      width: 185,
      height: 42,
    }, {
      containerId: "data-table",
      fontSizeOverride: 22,
      fontWeightOverride: 760,
    }),
    textNode("data-row-bind-program-max", "1.293 / 0.757", {
      x: 789,
      y: 444,
      width: 185,
      height: 42,
    }, {
      containerId: "data-table",
      fontSizeOverride: 22,
      fontWeightOverride: 760,
    }),
    textNode("data-row-bind-program-avg", "0.003 / 0.004", {
      x: 1014,
      y: 444,
      width: 178,
      height: 42,
    }, {
      containerId: "data-table",
      fontSizeOverride: 22,
      fontWeightOverride: 760,
    }),
    textNode("data-row-create-api", "Create (CreateGfxPipeline)", {
      x: 48,
      y: 520,
      width: 484,
      height: 42,
    }, {
      containerId: "data-table",
      fontSizeOverride: 22,
      fontWeightOverride: 760,
    }),
    textNode("data-row-create-min", "0.052 / 0.089", {x: 556, y: 520, width: 185, height: 42}, {
      containerId: "data-table",
      fontSizeOverride: 22,
      fontWeightOverride: 760,
    }),
    textNode("data-row-create-max", "59.581 / 122.600", {x: 789, y: 520, width: 185, height: 42}, {
      containerId: "data-table",
      fontSizeOverride: 22,
      fontWeightOverride: 760,
    }),
    textNode("data-row-create-avg", "13.968 / 23.243", {x: 1014, y: 520, width: 178, height: 42}, {
      containerId: "data-table",
      fontSizeOverride: 22,
      fontWeightOverride: 760,
    }),
    textNode("data-row-bind-pipeline-api", "Bind (BindGfxPipeline)", {
      x: 48,
      y: 597,
      width: 484,
      height: 42,
    }, {
      containerId: "data-table",
      fontSizeOverride: 22,
      fontWeightOverride: 760,
    }),
    textNode("data-row-bind-pipeline-min", "0.000 / 0.000", {
      x: 556,
      y: 597,
      width: 185,
      height: 42,
    }, {
      containerId: "data-table",
      fontSizeOverride: 22,
      fontWeightOverride: 760,
    }),
    textNode("data-row-bind-pipeline-max", "0.472 / 0.583", {
      x: 789,
      y: 597,
      width: 185,
      height: 42,
    }, {
      containerId: "data-table",
      fontSizeOverride: 22,
      fontWeightOverride: 760,
    }),
    textNode("data-row-bind-pipeline-avg", "0.001 / 0.004", {
      x: 1014,
      y: 597,
      width: 178,
      height: 42,
    }, {
      containerId: "data-table",
      fontSizeOverride: 22,
      fontWeightOverride: 760,
    }),
  ],
);

const page05FormalReviewSketch = makeFormalReviewSketch(
  "formal-page05",
  "page_05",
  "Page 05 UE Cook chain with top-right UE PSO card",
  [
    node("material-node", "Material", {x: 124, y: 108, width: 140, height: 58}, {
      fontSizeOverride: 22,
      fontWeightOverride: 740,
    }),
    node("cooked-node", "CookedShaderCode", {x: 530, y: 99, width: 200, height: 76}, {
      fontSizeOverride: 22,
      fontWeightOverride: 760,
    }),
    node("binary-node", "Binary ShaderCode", {x: 530, y: 265, width: 200, height: 76}, {
      fontSizeOverride: 22,
      fontWeightOverride: 760,
    }),
    node("mesh-node", "Mesh", {x: 138, y: 467, width: 112, height: 58}, {
      fontSizeOverride: 24,
      fontWeightOverride: 700,
    }),
    node("vertex-data-node", "VertexData", {x: 310, y: 452, width: 150, height: 88}, {
      fontSizeOverride: 16,
      fontWeightOverride: 720,
    }),
    node("gpu-node", "GPU", {x: 520, y: 430, width: 440, height: 126}, {
      fontSizeOverride: 52,
      fontWeightOverride: 760,
    }),
    node("pixels-node", "Pixels", {x: 1020, y: 452, width: 150, height: 88}, {
      fontSizeOverride: 16,
      fontWeightOverride: 720,
    }),
    node("ue-pso-card", "", {x: 796, y: 34, width: 430, height: 302}),
    textNode("ue-pso-title", "UE PSO = Shaders+States+？", {
      x: 796,
      y: 40,
      width: 430,
      height: 28,
    }, {
      containerId: "ue-pso-card",
      fontSizeOverride: 18.5,
      fontWeightOverride: 820,
    }),
    node("ue-pso-shader", "VertexShader Hash / PixelShader Hash", {
      x: 812,
      y: 70,
      width: 398,
      height: 40,
    }, {
      containerId: "ue-pso-card",
      fontSizeOverride: 15,
      fontWeightOverride: 780,
    }),
    node("ue-pso-usage-mask", "UsageMask", {x: 812, y: 126, width: 194, height: 28}, {
      containerId: "ue-pso-card",
      fontSizeOverride: 13.6,
      fontWeightOverride: 760,
    }),
    node("ue-pso-bind-count", "BindCount", {x: 1016, y: 126, width: 194, height: 28}, {
      containerId: "ue-pso-card",
      fontSizeOverride: 13.4,
      fontWeightOverride: 760,
    }),
    node("ue-pso-state-1", "FVertexDeclaration / ElementList", {
      x: 812,
      y: 162,
      width: 194,
      height: 56,
    }, {
      containerId: "ue-pso-card",
      fontSizeOverride: 14.2,
      fontWeightOverride: 760,
    }),
    node("ue-pso-state-2", "FGraphicsPipeline / RenderTargetsInfo", {
      x: 1016,
      y: 162,
      width: 194,
      height: 56,
    }, {
      containerId: "ue-pso-card",
      fontSizeOverride: 13.2,
      fontWeightOverride: 760,
    }),
    node("ue-pso-state-3", "FDepthStencilState / InitializerRHI", {
      x: 812,
      y: 226,
      width: 194,
      height: 56,
    }, {
      containerId: "ue-pso-card",
      fontSizeOverride: 13.4,
      fontWeightOverride: 760,
    }),
    node("ue-pso-state-4", "FBlendStateInitializerRHI / FRasterizerStateInitializerRHI", {
      x: 1016,
      y: 226,
      width: 194,
      height: 56,
    }, {
      containerId: "ue-pso-card",
      fontSizeOverride: 10.9,
      fontWeightOverride: 760,
    }),
    node("ue-pso-state-5", "EPrimitiveType / NumSamples / FRHIRenderPassInfo", {
      x: 812,
      y: 290,
      width: 398,
      height: 40,
    }, {
      containerId: "ue-pso-card",
      fontSizeOverride: 12.8,
      fontWeightOverride: 760,
    }),
  ],
);

const page14FormalReviewSketch: GeometrySketchDefinition = {
  id: "formal-page14",
  stepId: "page_14",
  label: "Page 14 split UE/Gfx PSO explanation board",
  contract: {
    pageGoal:
      "Explain runtime collection as a split UE PSO / Gfx PSO board, where .rec.upipelinecache records the UE-side description and GPU only consumes the runtime object.",
    receiverPlane: "Formal Remotion stage",
    primaryLine: "UE PSO -> Gfx PSO -> GPU, with one support route UE PSO -> .rec.upipelinecache",
    keepStable:
      "Keep the approved anchors at x 300 / 732 / 1072 and preserve the shared horizontal spine.",
    newChange:
      "Model the page14 explanation board as a first-class formal review surface so the shared harness scores the real split-PSO layout instead of the retired loop sketch.",
    doNot:
      "Do not reintroduce label overlap, node piercing, or a fake GPU conversion role.",
  },
  nodes: [
    node("page14-board", "", {x: 148, y: 104, width: 984, height: 512}),
    node("rec-card", ".rec.upipelinecache", {x: 148, y: 104, width: 304, height: 88}, {
      containerId: "page14-board",
      fontSizeOverride: 24,
      fontWeightOverride: 760,
    }),
    node("record-save-pill", "record / save", {x: 154, y: 232, width: 140, height: 40}, {
      containerId: "page14-board",
      fontSizeOverride: 21,
      fontWeightOverride: 760,
    }),
    node("ue-pso-card", "UE PSO", {x: 172, y: 300, width: 256, height: 196}, {
      containerId: "page14-board",
      textRuns: [
        {
          text: "UE PSO",
          x: 128,
          y: 42,
          fontSize: 30,
          fontWeight: 790,
          textAnchor: "middle",
          dominantBaseline: "middle",
        },
        {
          text: "ShaderHash + State",
          x: 128,
          y: 90,
          fontSize: 24,
          fontWeight: 730,
          textAnchor: "middle",
          dominantBaseline: "middle",
        },
        {
          text: "引擎侧记录 / 描述",
          x: 128,
          y: 126,
          fontSize: 22,
          fontWeight: 700,
          textAnchor: "middle",
          dominantBaseline: "middle",
        },
        {
          text: "BSS + State",
          x: 128,
          y: 156,
          fontSize: 20,
          fontWeight: 680,
          textAnchor: "middle",
          dominantBaseline: "middle",
        },
      ],
    }),
    node("create-resolve-pill", "create / resolve", {x: 436, y: 330, width: 176, height: 40}, {
      containerId: "page14-board",
      fontSizeOverride: 22,
      fontWeightOverride: 760,
    }),
    node("gfx-pso-card", "Gfx PSO", {x: 620, y: 300, width: 224, height: 196}, {
      containerId: "page14-board",
      textRuns: [
        {
          text: "Gfx PSO",
          x: 112,
          y: 42,
          fontSize: 30,
          fontWeight: 790,
          textAnchor: "middle",
          dominantBaseline: "middle",
        },
        {
          text: "RHI / driver object",
          x: 112,
          y: 90,
          fontSize: 22,
          fontWeight: 720,
          textAnchor: "middle",
          dominantBaseline: "middle",
        },
        {
          text: "运行时对象 / 编译结果",
          x: 112,
          y: 126,
          fontSize: 21,
          fontWeight: 700,
          textAnchor: "middle",
          dominantBaseline: "middle",
        },
        {
          text: "create or hit",
          x: 112,
          y: 156,
          fontSize: 19,
          fontWeight: 680,
          textAnchor: "middle",
          dominantBaseline: "middle",
        },
      ],
    }),
    node("bind-use-pill", "bind / use", {x: 856, y: 330, width: 140, height: 40}, {
      containerId: "page14-board",
      fontSizeOverride: 21,
      fontWeightOverride: 760,
    }),
    node("gpu-runtime-stack", "GPU", {x: 1004, y: 300, width: 128, height: 196}, {
      containerId: "page14-board",
      fontSizeOverride: 32,
      fontWeightOverride: 800,
    }),
    textNode(
      "page14-footer-1",
      "UE PSO 记录描述；Gfx PSO 是运行时对象 / 编译结果",
      {x: 182, y: 544, width: 916, height: 32},
      {
        containerId: "page14-board",
        fontSizeOverride: 21,
        fontWeightOverride: 720,
      },
    ),
    textNode(
      "page14-footer-2",
      "注：Vulkan / Metal = BSS + State，OpenGL = BSS（无显式 State）",
      {x: 160, y: 584, width: 960, height: 32},
      {
        containerId: "page14-board",
        fontSizeOverride: 19,
        fontWeightOverride: 700,
      },
    ),
  ],
  edges: [
    {
      id: "ue-to-gfx",
      from: {x: 436, y: 398},
      to: {x: 612, y: 398},
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "gfx-to-gpu",
      from: {x: 852, y: 398},
      to: {x: 1004, y: 398},
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "ue-to-rec",
      from: {x: 300, y: 300},
      to: {x: 300, y: 192},
      waypoints: [
        {x: 300, y: 210},
        {x: 300, y: 192},
      ],
      tone: "support",
      dashed: true,
      arrowEnd: true,
    },
  ],
};

const page16FormalReviewSketch = makeFormalReviewSketch(
  "formal-page16",
  "page_16",
  "Page 16 why-expand stable uplift board",
  [
    node("page16-board", "", {x: 76, y: 56, width: 1128, height: 576}),
    textNode("page16-title", "为什么需要 expand", {x: 104, y: 94, width: 324, height: 56}, {
      containerId: "page16-board",
      fontSizeOverride: 46,
      fontWeightOverride: 840,
    }),
    textNode(
      "page16-subtitle",
      "旧版UE PSO不能直接复用",
      {x: 76, y: 154, width: 400, height: 22},
      {
        containerId: "page16-board",
        fontSizeOverride: 14,
        fontWeightOverride: 700,
        textColorOverride: "#66748a",
      },
    ),
    textNode(
      "page16-subtitle-line2",
      "要靠同版本 Cook 的双向映射",
      {x: 96, y: 178, width: 380, height: 22},
      {
        containerId: "page16-board",
        fontSizeOverride: 14,
        fontWeightOverride: 700,
        textColorOverride: "#66748a",
      },
    ),
    textNode("rec-phase-label", "手机包收集到的UE PSO", {x: 100, y: 232, width: 360, height: 32}, {
      containerId: "page16-board",
      fontSizeOverride: 17.5,
      fontWeightOverride: 780,
      textColorOverride: "#d06b44",
    }),
    node("rec-node", "", {x: 100, y: 272, width: 360, height: 104}, {
      containerId: "page16-board",
      textRuns: [
        {
          text: "ShaderHash + State",
          x: 180,
          y: 28,
          fontSize: 22,
          fontWeight: 800,
          textAnchor: "middle",
        },
        {
          text: "（历史版本）",
          x: 180,
          y: 54,
          fontSize: 17.5,
          fontWeight: 720,
          textAnchor: "middle",
        },
        {
          text: "rec.upipelinecache",
          x: 180,
          y: 80,
          fontSize: 16,
          fontWeight: 700,
          textAnchor: "middle",
        },
      ],
    }),
    textNode("scl-phase-label-top", "和UE PSO同版本Cook出来的", {x: 380, y: 58, width: 540, height: 22}, {
      containerId: "page16-board",
      fontSizeOverride: 14,
      fontWeightOverride: 720,
      textColorOverride: "#d06b44",
    }),
    textNode("scl-phase-label", "双向映射", {x: 510, y: 82, width: 280, height: 26}, {
      containerId: "page16-board",
      fontSizeOverride: 17.5,
      fontWeightOverride: 780,
      textColorOverride: "#d06b44",
    }),
    node("scl-node", "", {x: 480, y: 110, width: 340, height: 84}, {
      containerId: "page16-board",
      textRuns: [
        {
          text: "ShaderHash <-> ShaderStableKey",
          x: 170,
          y: 28,
          fontSize: 18.5,
          fontWeight: 760,
          textAnchor: "middle",
        },
        {
          text: ".scl.csv",
          x: 170,
          y: 56,
          fontSize: 16,
          fontWeight: 700,
          textAnchor: "middle",
        },
      ],
    }),
    node("expand-merge", "+", {x: 626, y: 300, width: 48, height: 48}, {
      containerId: "page16-board",
      shape: "circle",
      fontSizeOverride: 26,
      fontWeightOverride: 840,
    }),
    node("expand-pill", "expand", {x: 694, y: 288, width: 108, height: 34}, {
      containerId: "page16-board",
      fontSizeOverride: 17,
      fontWeightOverride: 800,
    }),
    node("stablepc-node", "", {x: 820, y: 272, width: 360, height: 104}, {
      containerId: "page16-board",
      textRuns: [
        {
          text: "ShaderStableKey + State",
          x: 180,
          y: 30,
          fontSize: 21,
          fontWeight: 800,
          textAnchor: "middle",
        },
        {
          text: "stablepc.csv",
          x: 180,
          y: 62,
          fontSize: 16,
          fontWeight: 700,
          textAnchor: "middle",
        },
      ],
    }),
    textNode("stable-note-top", "stable = 语义稳定", {x: 845, y: 404, width: 350, height: 28}, {
      containerId: "page16-board",
      fontSizeOverride: 18,
      fontWeightOverride: 800,
      textColorOverride: "#d06b44",
    }),
    textNode("stable-note-bottom", "不是 hash 稳定", {x: 895, y: 438, width: 250, height: 28}, {
      containerId: "page16-board",
      fontSizeOverride: 17,
      fontWeightOverride: 740,
      textColorOverride: "#556173",
    }),
    node("expand-example-card", "", {x: 100, y: 400, width: 560, height: 220}, {
      containerId: "page16-board",
      tone: "muted",
    }),
    textNode("expand-example-title", "Expand Example", {x: 118, y: 418, width: 246, height: 24}, {
      containerId: "expand-example-card",
      fontSizeOverride: 16,
      fontWeightOverride: 820,
      textColorOverride: "#556173",
    }),
    textNode(
      "expand-example-detail",
      "1 个 Hash_rec 映射到 2 个 StableKey",
      {x: 118, y: 448, width: 366, height: 24},
      {
        containerId: "expand-example-card",
        fontSizeOverride: 14.5,
        fontWeightOverride: 740,
        textColorOverride: "#66748a",
      },
    ),
    node("hash-token", "Hash_rec", {x: 159, y: 514, width: 154, height: 40}, {
      containerId: "expand-example-card",
      fontSizeOverride: 16.5,
      fontWeightOverride: 780,
    }),
    node("stable-key-a", "StableKey_A", {x: 483, y: 484, width: 154, height: 40}, {
      containerId: "expand-example-card",
      fontSizeOverride: 15.5,
      fontWeightOverride: 780,
    }),
    node("stable-key-b", "StableKey_B", {x: 483, y: 544, width: 154, height: 40}, {
      containerId: "expand-example-card",
      fontSizeOverride: 15.5,
      fontWeightOverride: 780,
    }),
  ],
);

const page17FormalReviewSketch = makeFormalReviewSketch(
  "formal-page17",
  "page_17",
  "Page 17 build-only stable-to-current mapping board",
  [
    node("page17-board", "", {x: 146, y: 170, width: 988, height: 438}),
    textNode("stable-label-top", "所有历史版本的", {x: 304, y: 212, width: 160, height: 24}, {
      containerId: "page17-board",
      fontSizeOverride: 14.4,
      fontWeightOverride: 790,
      textColorOverride: "#d06b44",
    }),
    textNode("stable-label", "稳定UE PSO", {x: 334, y: 238, width: 220, height: 24}, {
      containerId: "page17-board",
      fontSizeOverride: 14.6,
      fontWeightOverride: 790,
      textColorOverride: "#d06b44",
    }),
    node("stablepc-node", "", {x: 292, y: 266, width: 310, height: 72}, {
      containerId: "page17-board",
      textRuns: [
        {
          text: "ShaderStableKey + State",
          x: 155,
          y: 28,
          fontSize: 18.2,
          fontWeight: 790,
          textAnchor: "middle",
        },
        {
          text: "stablepc.csv",
          x: 155,
          y: 54,
          fontSize: 15.2,
          fontWeight: 720,
          textAnchor: "middle",
        },
      ],
    }),
    textNode("current-label", "当前版本Cook出来的双向映射", {x: 238, y: 372, width: 360, height: 24}, {
      containerId: "page17-board",
      fontSizeOverride: 15,
      fontWeightOverride: 790,
      textColorOverride: "#d06b44",
    }),
    node("current-scl-node", ".scl.csv", {x: 286, y: 408, width: 264, height: 68}, {
      containerId: "page17-board",
      fontSizeOverride: 18.2,
      fontWeightOverride: 780,
    }),
    textNode("mapping-example", "ShaderHash <-> ShaderStableKey", {x: 258, y: 488, width: 320, height: 24}, {
      containerId: "page17-board",
      fontSizeOverride: 15,
      fontWeightOverride: 700,
      textColorOverride: "#44536a",
    }),
    node("build-pill", "build", {x: 620, y: 286, width: 84, height: 36}, {
      containerId: "page17-board",
      fontSizeOverride: 16.8,
      fontWeightOverride: 790,
    }),
    node("build-merge", "+", {x: 624, y: 340, width: 40, height: 40}, {
      containerId: "page17-board",
      shape: "circle",
      fontSizeOverride: 23,
      fontWeightOverride: 840,
    }),
    node("mapping-pill", "StableKey -> 当前 Hash", {x: 574, y: 408, width: 226, height: 36}, {
      containerId: "page17-board",
      fontSizeOverride: 14.2,
      fontWeightOverride: 760,
    }),
    node("stable-cache-node", "stable.upipelinecache", {x: 764, y: 308, width: 318, height: 92}, {
      containerId: "page17-board",
      labelLines: ["stable.", "upipelinecache"],
      fontSizeOverride: 18,
      fontWeightOverride: 800,
    }),
    textNode("stable-cache-detail", "当前包体可以用作预编译的UE PSO", {x: 742, y: 272, width: 364, height: 24}, {
      containerId: "page17-board",
      fontSizeOverride: 14.8,
      fontWeightOverride: 760,
      textColorOverride: "#d06b44",
    }),
  ],
);

const page18FormalReviewSketch = makeFormalReviewSketch(
  "formal-page18",
  "page_18",
  "Page 18 stable return loop closure",
  [
    node("rec-node", "rec.upipelinecache", {x: 454, y: 86, width: 220, height: 56}, {
      fontSizeOverride: 16.8,
      fontWeightOverride: 760,
    }),
    node("computer-shell", "Computer", {x: 92, y: 214, width: 228, height: 248}, {
      fontSizeOverride: 26,
      fontWeightOverride: 800,
    }),
    node("scl-node", ".scl.csv", {x: 372, y: 242, width: 156, height: 52}, {
      fontSizeOverride: 18,
      fontWeightOverride: 760,
    }),
    node("merge-a", "+", {x: 552, y: 242, width: 52, height: 52}, {
      fontSizeOverride: 24,
      fontWeightOverride: 820,
    }),
    node("stablepc-node", "stablepc.csv", {x: 628, y: 238, width: 180, height: 60}, {
      fontSizeOverride: 18.5,
      fontWeightOverride: 780,
    }),
    node("merge-b", "+", {x: 834, y: 242, width: 52, height: 52}, {
      fontSizeOverride: 24,
      fontWeightOverride: 820,
    }),
    node("stable-upipe-node", "stable.upipelinecache", {x: 912, y: 230, width: 238, height: 76}, {
      labelLines: ["stable.", "upipelinecache"],
      fontSizeOverride: 18,
      fontWeightOverride: 800,
    }),
    node("split-a", "cook", {x: 360, y: 480, width: 88, height: 48}, {
      fontSizeOverride: 18,
      fontWeightOverride: 760,
    }),
    node("bytecode-node", ".ushaderbytecode", {x: 594, y: 476, width: 196, height: 56}, {
      fontSizeOverride: 16.2,
      fontWeightOverride: 760,
    }),
    node("phone-shell", "Phone", {x: 930, y: 420, width: 250, height: 224}, {
      fontSizeOverride: 28,
      fontWeightOverride: 820,
    }),
  ],
);

const page18ImageFormalReviewSketch = makeFormalReviewSketch(
  "formal-page18-img",
  "page_18_img",
  "Page 18 image overlay evidence",
  [
    node("evidence-image", "预编译平滑高峰证据图", {
      x: 46,
      y: 36,
      width: 1188,
      height: 648,
    }, {
      fontSizeOverride: 24,
      fontWeightOverride: 760,
      tone: "muted",
    }),
    node("prompt-card", "", {
      x: 896,
      y: 74,
      width: 338,
      height: 117,
    }, {
      containerId: "evidence-image",
      textRuns: [
        {
          text: "Q: 为什么许多游戏",
          x: 18,
          y: 28,
          fontSize: 19,
          fontWeight: 790,
          textAnchor: "start",
        },
        {
          text: "只需要第一次编译着色器，",
          x: 18,
          y: 52,
          fontSize: 19,
          fontWeight: 730,
          textAnchor: "start",
        },
        {
          text: "后面就不需要了呢？",
          x: 18,
          y: 76,
          fontSize: 19,
          fontWeight: 730,
          textAnchor: "start",
        },
      ],
    }),
  ],
);

const page21FormalReviewSketch = makeFormalReviewSketch(
  "formal-page21",
  "page_21",
  "Page 21 player-ready asset landing",
  [
    node("pso-card", "stable.upipelinecache", {x: 126, y: 156, width: 336, height: 88}, {
      textRuns: [
        {
          text: "stable.upipelinecache",
          x: 168,
          y: 36,
          fontSize: 23,
          fontWeight: 760,
          textAnchor: "middle",
        },
        {
          text: "预构建 PSO",
          x: 168,
          y: 61,
          fontSize: 17,
          fontWeight: 700,
          textAnchor: "middle",
        },
      ],
      fontSizeOverride: 23,
    }),
    node("shader-card", "ShaderLibrary", {x: 126, y: 372, width: 336, height: 88}, {
      textRuns: [
        {
          text: "ShaderLibrary",
          x: 168,
          y: 33,
          fontSize: 27,
          fontWeight: 780,
          textAnchor: "middle",
        },
        {
          text: ".ushaderbytecode",
          x: 168,
          y: 58,
          fontSize: 17,
          fontWeight: 700,
          textAnchor: "middle",
        },
      ],
    }),
    node("phone-shell", "玩家", {x: 724, y: 32, width: 252, height: 552}, {
      textRuns: [
        {
          text: "玩家",
          x: 126,
          y: 64,
          fontSize: 30,
          fontWeight: 760,
          textAnchor: "middle",
        },
      ],
    }),
    node("footer", "玩家拿到 stable.upipelinecache + ShaderLibrary", {x: 158, y: 594, width: 948, height: 54}, {
      textRuns: [
        {
          text: "玩家拿到 stable.upipelinecache + ShaderLibrary 后，运行时更不容易卡顿。",
          x: 474,
          y: 27,
          fontSize: 18,
          fontWeight: 700,
          textAnchor: "middle",
        },
      ],
    }),
  ],
);

const page22FormalReviewSketch = makeFormalReviewSketch(
  "formal-page22",
  "page_22",
  "Page 22 narrative understanding of PSO cache",
  [
    node("left-card", "PSO 是对象，PSO Cache 是方法。", {x: 88, y: 146, width: 600, height: 402}, {
      textRuns: [
        {text: "核心区分", x: 22, y: 28, fontSize: 19, fontWeight: 820},
        {
          text: "PSO 是对象，PSO Cache 是方法。",
          x: 22,
          y: 104,
          fontSize: 26,
          fontWeight: 820,
        },
        {
          text: "它附属于 Shader，用启动时间 + 内存空间换运行时卡顿率。",
          x: 22,
          y: 178,
          fontSize: 17,
          fontWeight: 740,
        },
        {
          text: "没有 PSO Cache，项目也可能照样跑得很好。",
          x: 22,
          y: 203,
          fontSize: 17,
          fontWeight: 680,
        },
        {
          text: "所以它是手段，不是每个项目都必须上的答案。",
          x: 22,
          y: 228,
          fontSize: 17,
          fontWeight: 680,
        },
      ],
      fontSizeOverride: 26,
    }),
    node("right-1", "PSO：对象", {x: 712, y: 146, width: 424, height: 102}, {
      textRuns: [
        {text: "PSO：对象", x: 20, y: 26, fontSize: 18, fontWeight: 820},
        {
          text: "被创建、绑定、命中的运行时对象。",
          x: 20,
          y: 58,
          fontSize: 17,
          fontWeight: 720,
        },
      ],
    }),
    node("right-2", "PSO Cache：方法", {x: 712, y: 296, width: 424, height: 102}, {
      textRuns: [
        {text: "PSO Cache：方法", x: 20, y: 26, fontSize: 18, fontWeight: 820},
        {
          text: "依赖 Shader Module 提供数据；",
          x: 20,
          y: 58,
          fontSize: 15.5,
          fontWeight: 720,
        },
        {
          text: ".ushaderbytecode / .scl.csv 会参与。",
          x: 20,
          y: 78,
          fontSize: 15.5,
          fontWeight: 720,
        },
      ],
    }),
    node("right-3", "代价 / 适用", {x: 712, y: 446, width: 424, height: 114}, {
      textRuns: [
        {text: "代价 / 适用", x: 20, y: 26, fontSize: 18, fontWeight: 820},
        {
          text: "不是所有项目都需要它；",
          x: 20,
          y: 58,
          fontSize: 16.5,
          fontWeight: 720,
        },
        {
          text: "而且代价往往比想象中更大。",
          x: 20,
          y: 79,
          fontSize: 16.5,
          fontWeight: 670,
        },
      ],
    }),
    node("footer", "工程方法", {x: 164, y: 606, width: 948, height: 54}, {
      textRuns: [
        {
          text: "PSO 的成本不会消失，只会转移。",
          x: 474,
          y: 27,
          fontSize: 20,
          fontWeight: 700,
          textAnchor: "middle",
        },
      ],
    }),
  ],
);

const lateTailFormalReviewSketches: GeometrySketchDefinition[] = [
  makeFormalReviewSketch("formal-page24", "page_24", "Page 24 strategy", [
    node("left-card", "Package", {x: 44, y: 58, width: 520, height: 560}),
    node("package-row-1", "LZ4", {x: 62, y: 140, width: 484, height: 132}, {
      containerId: "left-card",
    }),
    ...buildPage24PlatformPillNodes(
      "package-row-1",
      {x: 62, y: 140, width: 484, height: 132},
      {
        windows: "Windows 2.9 / 0.14",
        macos: "macOS 2.1 / 0.05",
        android: "Android 0.26",
        ios: "iOS 0.04",
      },
    ),
    node("package-row-2", "zstd", {x: 62, y: 280, width: 484, height: 132}, {
      containerId: "left-card",
    }),
    ...buildPage24PlatformPillNodes(
      "package-row-2",
      {x: 62, y: 280, width: 484, height: 132},
      {
        windows: "Windows 77.3 / 0.31",
        macos: "macOS 34.9 / 0.12",
        android: "Android 0.40",
        ios: "iOS 0.09",
      },
    ),
    node("package-row-3", "Oodle Leviathan", {x: 62, y: 420, width: 484, height: 132}, {
      containerId: "left-card",
      fontSizeOverride: 20,
    }),
    ...buildPage24PlatformPillNodes(
      "package-row-3",
      {x: 62, y: 420, width: 484, height: 132},
      {
        windows: "Windows 2.7 / 0.14",
        macos: "macOS 3.4 / 0.11",
        android: "Android 0.47",
        ios: "iOS 0.11",
      },
    ),
    node("right-card", "Memory", {x: 588, y: 58, width: 648, height: 560}),
    node("memory", "Memory Residency", {x: 616, y: 186, width: 268, height: 248}, {
      containerId: "right-card",
    }),
    node("flow-lane", "", {x: 892, y: 216, width: 40, height: 188}, {
      containerId: "right-card",
    }),
    node("disk", "External IO", {x: 940, y: 186, width: 268, height: 248}, {
      containerId: "right-card",
    }),
    node("memory-method-1", "选取策略", {x: 612, y: 472, width: 190, height: 108}, {
      containerId: "right-card",
    }),
    node("memory-method-2", "回填路径", {x: 817, y: 472, width: 190, height: 108}, {
      containerId: "right-card",
    }),
    node("memory-method-3", "外存载体", {x: 1022, y: 472, width: 190, height: 108}, {
      containerId: "right-card",
    }),
    node("footer", "Footer", {x: 120, y: 628, width: 1040, height: 52}),
  ]),
  makeFormalReviewSketch("formal-page25", "page_25", "Page 25 storage", [
    node("left-card", "Storage Strategy", {x: 96, y: 146, width: 596, height: 402}),
    node("memory", "Memory", {x: 120, y: 222, width: 252, height: 228}, {
      containerId: "left-card",
    }),
    node("disk", "IO", {x: 416, y: 222, width: 252, height: 228}, {
      containerId: "left-card",
    }),
    node("right-1", "Replacement", {x: 720, y: 146, width: 408, height: 114}),
    node("right-2", "Mapping", {x: 720, y: 280, width: 408, height: 114}),
    node("right-3", "Carrier", {x: 720, y: 414, width: 408, height: 134}),
    node("footer", "Footer", {x: 164, y: 606, width: 948, height: 54}),
  ]),
  makeFormalReviewSketch("formal-page26", "page_26", "Page 26 timing", [
    node("usage-mask-path", "Reduce Compile Set", {x: 84, y: 146, width: 556, height: 404}, {
      textRuns: [
        {text: "路径 1：减少编译集合", x: 18, y: 24, fontSize: 20, fontWeight: 820},
        {
          text: "按地图触发 + UsageMask，让“该编什么”先收缩。",
          x: 18,
          y: 46,
          fontSize: 15,
          fontWeight: 700,
        },
      ],
    }),
    node("event-strip", "Event Flow", {x: 108, y: 204, width: 508, height: 84}, {
      containerId: "usage-mask-path",
      textRuns: [
        {text: "事件入口", x: 18, y: 18, fontSize: 15.5, fontWeight: 800},
      ],
    }),
    node("game-mask", "Game Mask", {x: 108, y: 314, width: 236, height: 124}, {
      containerId: "usage-mask-path",
      textRuns: [
        {text: "当前游戏视角", x: 20, y: 24, fontSize: 14.5, fontWeight: 800},
        {text: "Game", x: 118, y: 52, fontSize: 17.5, fontWeight: 820, textAnchor: "middle"},
        {
          text: "UsageMask = A",
          x: 118,
          y: 72,
          fontSize: 17.5,
          fontWeight: 820,
          textAnchor: "middle",
        },
        {
          text: "只保留当前游戏",
          x: 118,
          y: 94,
          fontSize: 13.5,
          fontWeight: 700,
          textAnchor: "middle",
        },
        {
          text: "真的在用的集合",
          x: 118,
          y: 110,
          fontSize: 13.5,
          fontWeight: 700,
          textAnchor: "middle",
        },
      ],
    }),
    node("compile-mask", "Compile Mask", {x: 364, y: 314, width: 236, height: 124}, {
      containerId: "usage-mask-path",
      textRuns: [
        {text: "编译调度视角", x: 20, y: 24, fontSize: 14.5, fontWeight: 800},
        {text: "Compile", x: 118, y: 52, fontSize: 17.5, fontWeight: 820, textAnchor: "middle"},
        {
          text: "UsageMask = A + B",
          x: 118,
          y: 72,
          fontSize: 17.5,
          fontWeight: 820,
          textAnchor: "middle",
        },
        {
          text: "地图 B 下载完成后",
          x: 118,
          y: 94,
          fontSize: 13.5,
          fontWeight: 700,
          textAnchor: "middle",
        },
        {
          text: "立刻把 B 加进调度",
          x: 118,
          y: 110,
          fontSize: 13.5,
          fontWeight: 700,
          textAnchor: "middle",
        },
      ],
    }),
    node("usage-mask-note", "UsageMask Note", {x: 108, y: 462, width: 508, height: 74}, {
      containerId: "usage-mask-path",
      textRuns: [
        {text: "UE 原生只有一套 UsageMask 语义；", x: 18, y: 18, fontSize: 14.5, fontWeight: 760},
        {text: "这里拆的是调度，不是两套存储。", x: 18, y: 38, fontSize: 13.5, fontWeight: 700},
        {
          text: "这条路优化的是“要编什么”，本质在减少编译集合。",
          x: 18,
          y: 57,
          fontSize: 13,
          fontWeight: 680,
        },
      ],
    }),
    node("parallel-path", "Increase Throughput", {x: 658, y: 146, width: 538, height: 404}, {
      textRuns: [
        {text: "路径 2：提升编译吞吐", x: 18, y: 24, fontSize: 20, fontWeight: 820},
        {
          text: "并行改的是执行方式，让“同样要编的集合”更快跑完。",
          x: 18,
          y: 46,
          fontSize: 15,
          fontWeight: 700,
        },
      ],
    }),
    node("parallel-signal-a", "任务独立", {x: 682, y: 212, width: 200, height: 50}, {
      containerId: "parallel-path",
      textRuns: [
        {text: "任务独立", x: 100, y: 18, fontSize: 17, fontWeight: 820, textAnchor: "middle"},
        {text: "批量、重复、可拆", x: 100, y: 34, fontSize: 13, fontWeight: 660, textAnchor: "middle"},
      ],
    }),
    node("parallel-signal-b", "纯 CPU 计算", {x: 902, y: 212, width: 200, height: 50}, {
      containerId: "parallel-path",
      textRuns: [
        {text: "纯 CPU 计算", x: 100, y: 18, fontSize: 17, fontWeight: 820, textAnchor: "middle"},
        {text: "最适合直接拆 worker", x: 100, y: 34, fontSize: 13, fontWeight: 660, textAnchor: "middle"},
      ],
    }),
    node("parallel-queue", "Queue", {x: 692, y: 310, width: 124, height: 136}, {
      containerId: "parallel-path",
      labelLines: ["Task", "Queue"],
      fontSizeOverride: 24,
    }),
    node("parallel-worker-1", "Worker1", {x: 896, y: 304, width: 110, height: 44}, {
      containerId: "parallel-path",
      fontSizeOverride: 17,
    }),
    node("parallel-worker-2", "Worker2", {x: 896, y: 356, width: 110, height: 44}, {
      containerId: "parallel-path",
      fontSizeOverride: 17,
    }),
    node("parallel-worker-3", "Worker3", {x: 896, y: 408, width: 110, height: 44}, {
      containerId: "parallel-path",
      fontSizeOverride: 17,
    }),
    node("parallel-throughput", "More Throughput", {x: 1044, y: 332, width: 132, height: 92}, {
      containerId: "parallel-path",
      labelLines: ["More", "Throughput"],
      fontSizeOverride: 17,
    }),
    node("parallel-note", "Parallel Note", {x: 682, y: 476, width: 490, height: 74}, {
      containerId: "parallel-path",
      textRuns: [
        {text: "并行改的是执行方式，", x: 18, y: 18, fontSize: 14.5, fontWeight: 760},
        {text: "不是把 UsageMask 讲成另一个东西。", x: 18, y: 38, fontSize: 13.5, fontWeight: 690},
        {text: "同样目标下，一条路减集合，一条路提吞吐。", x: 18, y: 57, fontSize: 13, fontWeight: 670},
      ],
    }),
    node("footer", "Footer", {x: 164, y: 606, width: 948, height: 54}),
  ]),
  makeFormalReviewSketch("formal-page27", "page_27", "Page 27 parallel", [
    node("left-card", "Parallel", {x: 94, y: 144, width: 604, height: 406}),
    node("queue", "Queue", {x: 128, y: 242, width: 148, height: 160}, {
      containerId: "left-card",
    }),
    node("worker-1", "Worker1", {x: 346, y: 228, width: 128, height: 62}, {
      containerId: "left-card",
    }),
    node("worker-2", "Worker2", {x: 346, y: 304, width: 128, height: 62}, {
      containerId: "left-card",
    }),
    node("worker-3", "Worker3", {x: 346, y: 380, width: 128, height: 62}, {
      containerId: "left-card",
    }),
    node("done", "Done", {x: 532, y: 270, width: 148, height: 126}, {
      containerId: "left-card",
    }),
    node("right-1", "Traits", {x: 726, y: 144, width: 398, height: 158}),
    node("right-2", "Notes", {x: 726, y: 322, width: 398, height: 228}),
    node("footer", "Footer", {x: 164, y: 606, width: 948, height: 54}),
  ]),
  makeFormalReviewSketch("formal-page28", "page_28", "Page 28 governance surface", [
    node("image-1", "SampleA", {x: 96, y: 92, width: 500, height: 136}),
    node("image-2", "SampleB", {x: 96, y: 252, width: 500, height: 136}),
    node("image-3", "VertexBuffer", {x: 96, y: 408, width: 500, height: 182}),
    node("right-card", "PSOState", {x: 608, y: 92, width: 574, height: 498}),
    node("shader", "Shader", {x: 632, y: 232, width: 526, height: 54}, {
      containerId: "right-card",
    }),
    node("state-1", "VertexDecl", {x: 632, y: 316, width: 258, height: 64}, {
      containerId: "right-card",
    }),
    node("state-2", "RT", {x: 900, y: 316, width: 258, height: 64}, {
      containerId: "right-card",
    }),
    node("state-3", "DepthStencil", {x: 632, y: 392, width: 258, height: 64}, {
      containerId: "right-card",
    }),
    node("state-4", "BlendRaster", {x: 900, y: 392, width: 258, height: 64}, {
      containerId: "right-card",
    }),
    node("state-5", "PrimitivePass", {x: 632, y: 468, width: 526, height: 64}, {
      containerId: "right-card",
    }),
    node("footer", "Footer", {x: 164, y: 606, width: 948, height: 54}),
  ]),
  makeFormalReviewSketch("formal-page29", "page_29", "Page 29 governance source", [
    node("compile-param", "CompileParam = 2", {x: 330, y: 64, width: 620, height: 42}, {
      fontSizeOverride: 17,
      fontWeightOverride: 780,
    }),
    node("left-code", "Vertex", {x: 72, y: 112, width: 520, height: 286}),
    node("right-code", "Factory", {x: 610, y: 112, width: 584, height: 286}),
    node("left-image", "Mesh 1 UV", {x: 72, y: 426, width: 520, height: 200}),
    node("right-image", "Mesh 2 UV", {x: 610, y: 426, width: 584, height: 208}),
    node("footer", "Footer", {x: 120, y: 648, width: 1040, height: 48}),
  ]),
  makeFormalReviewSketch("formal-page29-data", "page_29_data", "Page 29 data driver optimization", [
    node("shader-card", "Shader", {x: 72, y: 56, width: 1136, height: 194}),
    node("vertex-code", "Vertex Shader", {x: 72, y: 56, width: 552, height: 194}, {
      containerId: "shader-card",
      fontSizeOverride: 16,
      fontWeightOverride: 760,
    }),
    node("fragment-code", "Fragment Shader", {x: 656, y: 56, width: 552, height: 194}, {
      containerId: "shader-card",
      fontSizeOverride: 16,
      fontWeightOverride: 740,
    }),
    node("state-card", "State", {x: 72, y: 264, width: 1136, height: 78}),
    node("state-vk", "Vulkan known at build", {x: 72, y: 264, width: 552, height: 78}, {
      containerId: "state-card",
      fontSizeOverride: 13,
      fontWeightOverride: 780,
    }),
    node("state-gl", "OpenGL build-time blind", {x: 656, y: 264, width: 552, height: 78}, {
      containerId: "state-card",
      fontSizeOverride: 13,
      fontWeightOverride: 760,
    }),
    node("pc-card", "PC RTX3080", {x: 72, y: 368, width: 552, height: 282}),
    node("pc-row-1", "loop=10", {x: 126, y: 506, width: 444, height: 60}, {
      containerId: "pc-card",
      fontSizeOverride: 16,
      fontWeightOverride: 760,
    }),
    node("pc-row-2", "loop=5000", {x: 126, y: 566, width: 444, height: 60}, {
      containerId: "pc-card",
      fontSizeOverride: 16,
      fontWeightOverride: 760,
    }),
    node("android-card", "Android Adreno", {x: 656, y: 368, width: 552, height: 282}),
    node("android-row-1", "loop=10", {x: 710, y: 506, width: 444, height: 60}, {
      containerId: "android-card",
      fontSizeOverride: 16,
      fontWeightOverride: 760,
    }),
    node("android-row-2", "loop=5000", {x: 710, y: 566, width: 444, height: 60}, {
      containerId: "android-card",
      fontSizeOverride: 16,
      fontWeightOverride: 760,
    }),
    node("footer-note", "Footnote", {x: 72, y: 664, width: 1136, height: 36}, {
      fontSizeOverride: 15,
      fontWeightOverride: 760,
    }),
  ]),
  makeFormalReviewSketch("formal-page30", "page_30", "Page 30 PSO reading", [
    node("reading-card", "PSO Reading", {x: 208, y: 148, width: 864, height: 446}),
    node("reading-link-1", "UE Precaching", {x: 356, y: 268, width: 568, height: 50}, {
      containerId: "reading-card",
    }),
    node("reading-link-2", "PSO Experiment", {x: 356, y: 350, width: 568, height: 50}, {
      containerId: "reading-card",
    }),
    node("reading-link-3", "UE PSO Cache", {x: 356, y: 432, width: 568, height: 50}, {
      containerId: "reading-card",
    }),
    node("reading-link-4", "Mesa", {x: 356, y: 514, width: 568, height: 50}, {
      containerId: "reading-card",
    }),
  ]),
  makeFormalReviewSketch("formal-page31", "page_31", "Page 31 harness loop", [
    textNode("loop-core-kicker", "Live Harness", {x: 550, y: 280, width: 180, height: 28}, {
      fontSizeOverride: 16,
      fontWeightOverride: 800,
      textColorOverride: "#d06b44",
    }),
    textNode("loop-core-title", "先看真实结果", {x: 488, y: 310, width: 304, height: 40}, {
      fontSizeOverride: 31,
      fontWeightOverride: 820,
    }),
    textNode("loop-core-subtitle", "再决定停或继续", {x: 470, y: 356, width: 340, height: 36}, {
      fontSizeOverride: 24,
      fontWeightOverride: 760,
    }),
    node("hook-node", "Hook 进入", {x: 526, y: 166, width: 228, height: 74}, {
      fontSizeOverride: 24,
      fontWeightOverride: 760,
    }),
    node("data-node", "网页数据评分", {x: 844, y: 292, width: 212, height: 86}, {
      fontSizeOverride: 23,
      fontWeightOverride: 760,
    }),
    node("image-node", "网页图片评分", {x: 522, y: 452, width: 236, height: 86}, {
      fontSizeOverride: 23,
      fontWeightOverride: 760,
    }),
    node("receipt-node", "回执循环", {x: 224, y: 292, width: 220, height: 86}, {
      fontSizeOverride: 24,
      fontWeightOverride: 780,
    }),
    node("source-1", "workflow gate", {x: 520, y: 112, width: 236, height: 42}, {
      fontSizeOverride: 14.5,
      fontWeightOverride: 760,
    }),
    node("source-2", "front probe", {x: 906, y: 228, width: 180, height: 42}, {
      fontSizeOverride: 14.5,
      fontWeightOverride: 760,
    }),
    node("source-3", "browser capture", {x: 480, y: 560, width: 320, height: 42}, {
      fontSizeOverride: 13.8,
      fontWeightOverride: 760,
    }),
    node("source-4", "blind critics", {x: 146, y: 228, width: 194, height: 42}, {
      fontSizeOverride: 14.5,
      fontWeightOverride: 760,
    }),
    node("decision-1", "通过则停止", {x: 126, y: 394, width: 196, height: 44}, {
      fontSizeOverride: 15,
      fontWeightOverride: 780,
    }),
    node("decision-2", "不通过继续", {x: 126, y: 446, width: 196, height: 44}, {
      fontSizeOverride: 15,
      fontWeightOverride: 780,
    }),
  ]),
  makeFormalReviewSketch("formal-page32", "page_32", "Page 32 feedback bridge", [
    textNode("bridge-title", "反馈系统与人的学习", {x: 338, y: 78, width: 604, height: 52}, {
      fontSizeOverride: 34,
      fontWeightOverride: 830,
      textColorOverride: "#d66630",
    }),
    node("concept-harness", "harness", {x: 594, y: 172, width: 300, height: 54}, {
      fontSizeOverride: 28,
      fontWeightOverride: 760,
    }),
    node("concept-loss", "loss + back propagation", {x: 502, y: 246, width: 420, height: 54}, {
      fontSizeOverride: 26,
      fontWeightOverride: 760,
    }),
    node("concept-feedback", "feedback system", {x: 430, y: 324, width: 332, height: 54}, {
      fontSizeOverride: 27,
      fontWeightOverride: 760,
    }),
    node("model-system-frame", "Input / f(x) / Output system", {x: 124, y: 406, width: 1032, height: 176}, {
      renderStyle: "outline",
      fontSizeOverride: 18,
      fontWeightOverride: 760,
    }),
    node("model-input", "Input", {x: 168, y: 448, width: 172, height: 92}, {
      containerId: "model-system-frame",
      fontSizeOverride: 28,
      fontWeightOverride: 680,
    }),
    node("model-fx", "f(x)", {x: 450, y: 430, width: 344, height: 128}, {
      containerId: "model-system-frame",
      fontSizeOverride: 36,
      fontWeightOverride: 700,
    }),
    node("model-output", "Output", {x: 940, y: 448, width: 172, height: 92}, {
      containerId: "model-system-frame",
      fontSizeOverride: 28,
      fontWeightOverride: 680,
    }),
    textNode("bridge-footer", "Feedback Bridge Footer", {x: 184, y: 648, width: 912, height: 38}, {
      fontSizeOverride: 27,
      fontWeightOverride: 800,
      textColorOverride: "#d66630",
    }),
  ]),
  makeFormalReviewSketch("formal-page33", "page_33", "Page 33 final epilogue", [
    textNode("quote-body", "Closing Quote", {x: 192, y: 138, width: 896, height: 270}, {
      fontSizeOverride: 40,
      fontWeightOverride: 760,
    }),
    textNode("quote-footer", "Quote Footer", {x: 370, y: 416, width: 540, height: 34}, {
      fontSizeOverride: 21,
      fontWeightOverride: 640,
    }),
    node("left-link-1", "Foundation", {x: 120, y: 522, width: 280, height: 46}),
    node("left-link-2", "Ideology Course", {x: 120, y: 608, width: 280, height: 46}),
    node("repo-qr", "Repo QR", {x: 540, y: 480, width: 200, height: 200}),
    node("repo-url", "Repo URL", {x: 438, y: 681, width: 404, height: 30}, {
      fontSizeOverride: 15.5,
      fontWeightOverride: 650,
    }),
    node("right-link-1", "Outer Wilds", {x: 880, y: 522, width: 280, height: 46}),
    node("right-link-2", "Type Help", {x: 880, y: 608, width: 280, height: 46}),
  ]),
];

const FORMAL_PAGE_REVIEW_SKETCHES: GeometrySketchDefinition[] = [
  page00FormalReviewSketch,
  page01FormalReviewSketch,
  page02FormalReviewSketch,
  page03FormalReviewSketch,
  page04FormalReviewSketch,
  page04DataFormalReviewSketch,
  page05FormalReviewSketch,
  page14FormalReviewSketch,
  page16FormalReviewSketch,
  page17FormalReviewSketch,
  page18FormalReviewSketch,
  page18ImageFormalReviewSketch,
  page19R1Sketch,
  page21FormalReviewSketch,
  page22FormalReviewSketch,
  ...lateTailFormalReviewSketches,
];

const FORMAL_PAGE_REVIEW_REGISTRY = new Map(
  FORMAL_PAGE_REVIEW_SKETCHES.map((sketch) => [sketch.stepId, sketch]),
);

export function listFormalPageReviewSketches(): GeometrySketchDefinition[] {
  return [...FORMAL_PAGE_REVIEW_SKETCHES];
}

export function findFormalPageReviewSketchByStepId(
  stepId: StoryStepId,
): GeometrySketchDefinition | undefined {
  return FORMAL_PAGE_REVIEW_REGISTRY.get(stepId);
}
