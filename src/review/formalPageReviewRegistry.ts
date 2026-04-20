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

const page21FormalReviewSketch = makeFormalReviewSketch(
  "formal-page21",
  "page_21",
  "Page 21 PSO cache validity boundary",
  [
    node("left-card", "缓存效果由四个边界共同决定", {x: 96, y: 146, width: 596, height: 402}, {
      labelLines: [
        "PSO Cache 不是默认必开、永久有效的银弹。",
        "它是否值回票价，要同时看收集、首启、状态模型和环境稳定性。",
        "边界讲清以后，后面的策略页才不会被误读成默认正确。",
      ],
      fontSizeOverride: 28,
    }),
    node("right-1", "收集边界", {x: 720, y: 146, width: 408, height: 114}),
    node("right-2", "首启边界", {x: 720, y: 280, width: 408, height: 114}),
    node("right-3", "平台 / 环境边界", {x: 720, y: 414, width: 408, height: 134}),
    node("footer", "边界讲清", {x: 164, y: 608, width: 948, height: 50}),
  ],
);

const page22FormalReviewSketch = makeFormalReviewSketch(
  "formal-page22",
  "page_22",
  "Page 22 narrative understanding of PSO cache",
  [
    node("left-card", "预编译的 PSO 不会消失，只会转移。", {x: 96, y: 146, width: 596, height: 402}, {
      labelLines: [
        "它把运行时卡顿改写成启动成本与内存成本。",
        "所以 PSO Cache 不是对象本身，而是围绕对象做的工程安排。",
        "理解这一点，后面的策略页才能统一落在工程取舍上。",
      ],
      fontSizeOverride: 28,
    }),
    node("right-1", "对象", {x: 720, y: 146, width: 408, height: 114}),
    node("right-2", "方法", {x: 720, y: 280, width: 408, height: 114}),
    node("right-3", "工程取舍", {x: 720, y: 414, width: 408, height: 134}),
    node("footer", "工程方法", {x: 164, y: 608, width: 948, height: 50}),
  ],
);

const lateTailFormalReviewSketches: GeometrySketchDefinition[] = [
  makeFormalReviewSketch("formal-page24", "page_24", "Page 24 strategy", [
    node("table", "Compression Table", {x: 98, y: 148, width: 732, height: 418}),
    node("card-1", "Compression", {x: 856, y: 148, width: 300, height: 118}),
    node("card-2", "Precompute", {x: 856, y: 286, width: 300, height: 118}),
    node("card-3", "Algorithm", {x: 856, y: 424, width: 300, height: 142}),
    textNode("link", "GDC Link", {x: 876, y: 578, width: 300, height: 22}, {
      fontSizeOverride: 14,
    }),
    node("footer", "Footer", {x: 164, y: 608, width: 948, height: 50}),
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
    node("footer", "Footer", {x: 164, y: 608, width: 948, height: 50}),
  ]),
  makeFormalReviewSketch("formal-page26", "page_26", "Page 26 timing", [
    node("left-card", "Mask Decouple", {x: 96, y: 146, width: 566, height: 402}),
    node("game-mask", "Game Mask", {x: 120, y: 208, width: 228, height: 212}, {
      containerId: "left-card",
    }),
    node("compile-mask", "Compile Mask", {x: 372, y: 208, width: 266, height: 212}, {
      containerId: "left-card",
    }),
    node("download-pill", "Download Compile", {x: 120, y: 444, width: 518, height: 60}, {
      containerId: "left-card",
    }),
    node("right-1", "Lazy Load", {x: 690, y: 146, width: 426, height: 114}),
    node("right-2", "Streaming", {x: 690, y: 280, width: 426, height: 114}),
    node("right-3", "Deferred Compile", {x: 690, y: 414, width: 426, height: 134}),
    node("footer", "Footer", {x: 164, y: 608, width: 948, height: 50}),
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
    node("done", "Done", {x: 540, y: 270, width: 132, height: 126}, {
      containerId: "left-card",
    }),
    node("right-1", "Traits", {x: 726, y: 144, width: 398, height: 158}),
    node("right-2", "Notes", {x: 726, y: 322, width: 398, height: 228}),
    node("footer", "Footer", {x: 164, y: 608, width: 948, height: 50}),
  ]),
  makeFormalReviewSketch("formal-page28", "page_28", "Page 28 governance surface", [
    node("image-1", "SampleA", {x: 96, y: 172, width: 500, height: 148}),
    node("image-2", "SampleB", {x: 96, y: 348, width: 500, height: 148}),
    node("right-card", "PSOState", {x: 620, y: 160, width: 550, height: 390}),
    node("shader", "Shader", {x: 644, y: 232, width: 502, height: 54}, {
      containerId: "right-card",
    }),
    node("state-1", "VertexDecl", {x: 644, y: 316, width: 248, height: 60}, {
      containerId: "right-card",
    }),
    node("state-2", "RT", {x: 898, y: 316, width: 248, height: 60}, {
      containerId: "right-card",
    }),
    node("state-3", "DepthStencil", {x: 644, y: 392, width: 248, height: 60}, {
      containerId: "right-card",
    }),
    node("state-4", "BlendRaster", {x: 898, y: 392, width: 248, height: 60}, {
      containerId: "right-card",
    }),
    node("state-5", "PrimitivePass", {x: 644, y: 468, width: 502, height: 56}, {
      containerId: "right-card",
    }),
    node("footer", "Footer", {x: 164, y: 608, width: 948, height: 50}),
  ]),
  makeFormalReviewSketch("formal-page29", "page_29", "Page 29 governance source", [
    node("left-code", "Vertex", {x: 94, y: 140, width: 492, height: 440}),
    node("right-code", "Factory", {x: 610, y: 140, width: 538, height: 440}),
    node("token-4", "A4", {x: 690, y: 552, width: 98, height: 36}, {
      containerId: "right-code",
    }),
    node("token-5", "A5", {x: 798, y: 552, width: 98, height: 36}, {
      containerId: "right-code",
    }),
    node("token-6", "A6", {x: 906, y: 552, width: 98, height: 36}, {
      containerId: "right-code",
    }),
    node("token-7", "A7", {x: 1014, y: 552, width: 98, height: 36}, {
      containerId: "right-code",
    }),
    node("footer", "Footer", {x: 164, y: 608, width: 948, height: 50}),
  ]),
  makeFormalReviewSketch("formal-page30", "page_30", "Page 30 governance conclusion", [
    node("image-1", "UV4", {x: 86, y: 144, width: 516, height: 292}),
    node("image-2", "UV8", {x: 678, y: 144, width: 516, height: 292}),
    node("note", "Governance Note", {x: 88, y: 458, width: 1104, height: 92}),
    node("token-uv", "UV", {x: 106, y: 566, width: 190, height: 36}),
    node("token-vd", "Vertex Decl", {x: 376, y: 566, width: 190, height: 36}),
    node("token-material", "Material", {x: 646, y: 566, width: 190, height: 36}),
    node("token-color", "Color Buffer", {x: 916, y: 566, width: 190, height: 36}),
    node("footer", "Footer", {x: 164, y: 608, width: 948, height: 50}),
  ]),
  makeFormalReviewSketch("formal-page31", "page_31", "Page 31 harness", [
    node("left-card", "Review Chain", {x: 92, y: 138, width: 512, height: 418}),
    node("chain-1", "Artifact", {x: 126, y: 210, width: 444, height: 60}, {
      containerId: "left-card",
    }),
    node("chain-2", "Metrics", {x: 126, y: 318, width: 444, height: 60}, {
      containerId: "left-card",
    }),
    node("chain-3", "Policy", {x: 126, y: 426, width: 444, height: 60}, {
      containerId: "left-card",
    }),
    node("right-card", "Math Rules", {x: 634, y: 138, width: 528, height: 418}),
    node("gate-1", "Overlap", {x: 656, y: 390, width: 220, height: 40}, {
      containerId: "right-card",
    }),
    node("gate-2", "Crossing", {x: 900, y: 390, width: 220, height: 40}, {
      containerId: "right-card",
    }),
    node("gate-3", "Pierce", {x: 656, y: 446, width: 220, height: 40}, {
      containerId: "right-card",
    }),
    node("gate-4", "Overflow", {x: 900, y: 446, width: 220, height: 40}, {
      containerId: "right-card",
    }),
    node("footer", "Footer", {x: 164, y: 608, width: 948, height: 50}),
  ]),
  makeFormalReviewSketch("formal-page32", "page_32", "Page 32 reading", [
    node("left-card", "Engineering Reading", {x: 84, y: 136, width: 504, height: 356}),
    node("right-card", "Culture Reading", {x: 628, y: 136, width: 504, height: 356}),
    node("game-card", "Game Reading", {x: 84, y: 526, width: 1048, height: 116}),
  ]),
  makeFormalReviewSketch("formal-page33", "page_33", "Page 33 quote", [
    node("quote", "Closing Quote", {x: 192, y: 152, width: 896, height: 398}),
    node("footer", "Quote Footer", {x: 456, y: 574, width: 370, height: 40}),
  ]),
];

const FORMAL_PAGE_REVIEW_SKETCHES: GeometrySketchDefinition[] = [
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
