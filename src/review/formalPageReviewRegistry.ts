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
    node("left-card", "什么时候会失效？", {x: 80, y: 146, width: 608, height: 402}, {
      textRuns: [
        {text: "PSO 缓存有效性边界", x: 22, y: 28, fontSize: 19, fontWeight: 820},
        {text: "什么时候会失效？", x: 22, y: 104, fontSize: 24, fontWeight: 820},
        {
          text: "先问边界：PSO Cache 不是跨内容、跨版本、跨环境永久复用。",
          x: 22,
          y: 178,
          fontSize: 16.5,
          fontWeight: 740,
        },
        {
          text: "Shader / PSO 描述、编译链、映射关系、驱动环境一变，",
          x: 22,
          y: 201,
          fontSize: 16.5,
          fontWeight: 680,
        },
        {
          text: "旧缓存就可能失效。",
          x: 22,
          y: 224,
          fontSize: 16.5,
          fontWeight: 680,
        },
        {
          text: "关键不是幻想永不失效，而是先分清复用边界和重建边界。",
          x: 22,
          y: 247,
          fontSize: 16.5,
          fontWeight: 680,
        },
      ],
      fontSizeOverride: 24,
    }),
    node("right-1", "内容 / 状态变了", {x: 712, y: 146, width: 432, height: 102}, {
      textRuns: [
        {text: "内容 / 状态变了", x: 20, y: 26, fontSize: 18, fontWeight: 820},
        {
          text: "Shader、Permute、Vertex Layout、",
          x: 20,
          y: 58,
          fontSize: 16,
          fontWeight: 720,
        },
        {
          text: "Render State 一变，就已经不是同一组 PSO。",
          x: 20,
          y: 80,
          fontSize: 16,
          fontWeight: 670,
        },
      ],
    }),
    node("right-2", "版本 / 构建变了", {x: 712, y: 296, width: 432, height: 102}, {
      textRuns: [
        {text: "版本 / 构建变了", x: 20, y: 26, fontSize: 18, fontWeight: 820},
        {
          text: "SharedCode、codegen、Hash、scl 映射一变，",
          x: 20,
          y: 58,
          fontSize: 16,
          fontWeight: 720,
        },
        {
          text: "旧缓存通常就要重新 expand / build。",
          x: 20,
          y: 80,
          fontSize: 16,
          fontWeight: 670,
        },
      ],
    }),
    node("right-3", "环境变了", {x: 712, y: 446, width: 432, height: 114}, {
      textRuns: [
        {text: "环境变了", x: 20, y: 26, fontSize: 18, fontWeight: 820},
        {
          text: "OS / Driver / GPU / API 一变，本地缓存就可能失效。",
          x: 20,
          y: 58,
          fontSize: 16,
          fontWeight: 720,
        },
        {
          text: "各 API 的持久化边界本来就不同。",
          x: 20,
          y: 79,
          fontSize: 16,
          fontWeight: 670,
        },
      ],
    }),
    node("footer", "复用 / 重建边界", {x: 164, y: 606, width: 948, height: 54}, {
      textRuns: [
        {
          text: "缓存不是永不失效，而是把可复用边界和重建边界讲清楚。",
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

const page22FormalReviewSketch = makeFormalReviewSketch(
  "formal-page22",
  "page_22",
  "Page 22 narrative understanding of PSO cache",
  [
    node("left-card", "预编译的 PSO 不会消失，只会转移。", {x: 88, y: 146, width: 600, height: 402}, {
      textRuns: [
        {text: "核心判断", x: 22, y: 28, fontSize: 19, fontWeight: 820},
        {
          text: "预编译的 PSO 不会消失，只会转移。",
          x: 22,
          y: 104,
          fontSize: 28,
          fontWeight: 820,
        },
        {
          text: "它把运行时卡顿改写成启动成本与内存成本。",
          x: 22,
          y: 178,
          fontSize: 17,
          fontWeight: 740,
        },
        {
          text: "page21 讲何时失效，page22 讲这套工程该怎么理解。",
          x: 22,
          y: 203,
          fontSize: 17,
          fontWeight: 680,
        },
        {
          text: "所以 PSO Cache 不是对象本身，而是围绕对象做的工程安排。",
          x: 22,
          y: 228,
          fontSize: 17,
          fontWeight: 680,
        },
      ],
      fontSizeOverride: 28,
    }),
    node("right-1", "对象", {x: 712, y: 146, width: 424, height: 102}, {
      textRuns: [
        {text: "对象", x: 20, y: 26, fontSize: 18, fontWeight: 820},
        {
          text: "PSO 是要被创建、绑定、命中的运行时对象。",
          x: 20,
          y: 58,
          fontSize: 17,
          fontWeight: 720,
        },
      ],
    }),
    node("right-2", "方法", {x: 712, y: 296, width: 424, height: 102}, {
      textRuns: [
        {text: "方法", x: 20, y: 26, fontSize: 18, fontWeight: 820},
        {
          text: "围绕 Shader / State 的收集、",
          x: 20,
          y: 58,
          fontSize: 16,
          fontWeight: 720,
        },
        {
          text: "保存、预热方法。",
          x: 20,
          y: 78,
          fontSize: 16,
          fontWeight: 720,
        },
      ],
    }),
    node("right-3", "工程取舍", {x: 712, y: 446, width: 424, height: 114}, {
      textRuns: [
        {text: "工程取舍", x: 20, y: 26, fontSize: 18, fontWeight: 820},
        {
          text: "先换掉运行时尖峰，",
          x: 20,
          y: 58,
          fontSize: 16.5,
          fontWeight: 720,
        },
        {
          text: "再回收首启和空间开销。",
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
          text: "PSO Cache 是工程方法，不是让代价凭空消失的魔法。",
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
    node("table", "Compression Table", {x: 98, y: 148, width: 748, height: 418}),
    node("card-1", "Compression", {x: 868, y: 148, width: 308, height: 126}),
    node("card-2", "Precompute", {x: 868, y: 290, width: 308, height: 126}),
    node("card-3", "Algorithm", {x: 868, y: 432, width: 308, height: 140}),
    textNode("link", "GDC Link", {x: 884, y: 576, width: 360, height: 26}, {
      fontSizeOverride: 14,
    }),
    node("footer", "Footer", {x: 164, y: 606, width: 948, height: 54}),
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
    node("image-1", "SampleA", {x: 96, y: 172, width: 500, height: 148}),
    node("image-2", "SampleB", {x: 96, y: 348, width: 500, height: 148}),
    node("right-card", "PSOState", {x: 608, y: 160, width: 574, height: 390}),
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
    node("left-code", "Vertex", {x: 88, y: 140, width: 504, height: 440}),
    node("right-code", "Factory", {x: 610, y: 140, width: 538, height: 440}),
    node("token-4", "A4", {x: 648, y: 552, width: 122, height: 38}, {
      containerId: "right-code",
    }),
    node("token-5", "A5", {x: 774, y: 552, width: 122, height: 38}, {
      containerId: "right-code",
    }),
    node("token-6", "A6", {x: 900, y: 552, width: 122, height: 38}, {
      containerId: "right-code",
    }),
    node("token-7", "A7", {x: 1026, y: 552, width: 122, height: 38}, {
      containerId: "right-code",
    }),
    node("footer", "Footer", {x: 164, y: 606, width: 948, height: 54}),
  ]),
  makeFormalReviewSketch("formal-page30", "page_30", "Page 30 governance conclusion", [
    node("image-1", "UV4", {x: 86, y: 144, width: 516, height: 292}),
    node("image-2", "UV8", {x: 678, y: 144, width: 516, height: 292}),
    node("note", "Governance Note", {x: 88, y: 458, width: 1104, height: 100}),
    node("token-uv", "UV", {x: 106, y: 564, width: 202, height: 38}),
    node("token-vd", "Vertex Decl", {x: 376, y: 564, width: 202, height: 38}),
    node("token-material", "Material", {x: 646, y: 564, width: 202, height: 38}),
    node("token-color", "Color Buffer", {x: 916, y: 564, width: 202, height: 38}),
    node("footer", "Footer", {x: 164, y: 606, width: 948, height: 54}),
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
    node("gate-1", "Overlap", {x: 656, y: 388, width: 220, height: 44}, {
      containerId: "right-card",
    }),
    node("gate-2", "Crossing", {x: 900, y: 388, width: 220, height: 44}, {
      containerId: "right-card",
    }),
    node("gate-3", "Pierce", {x: 656, y: 444, width: 220, height: 44}, {
      containerId: "right-card",
    }),
    node("gate-4", "Overflow", {x: 900, y: 444, width: 220, height: 44}, {
      containerId: "right-card",
    }),
    node("footer", "Footer", {x: 164, y: 606, width: 948, height: 54}),
  ]),
  makeFormalReviewSketch("formal-page32", "page_32", "Page 32 reading", [
    node("left-card", "Engineering Reading", {x: 84, y: 136, width: 504, height: 356}),
    node("right-card", "Culture Reading", {x: 628, y: 136, width: 504, height: 356}),
    node("game-card", "Game Reading", {x: 84, y: 526, width: 1048, height: 116}),
  ]),
  makeFormalReviewSketch("formal-page33", "page_33", "Page 33 quote", [
    node("quote", "Closing Quote", {x: 192, y: 152, width: 896, height: 398}),
    node("footer", "Quote Footer", {x: 430, y: 566, width: 420, height: 52}),
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
