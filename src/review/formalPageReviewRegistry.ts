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
    node("before-image", "启用前截图", {x: 120, y: 60, width: 760, height: 176}, {
      fontSizeOverride: 22,
      fontWeightOverride: 760,
    }),
    textNode("before-label", "PSO Cache启用前", {x: 930, y: 131, width: 240, height: 34}, {
      fontSizeOverride: 18,
      fontWeightOverride: 820,
      textColorOverride: "#c66f4c",
    }),
    node("compile-image", "编译条", {x: 120, y: 296, width: 760, height: 128}, {
      fontSizeOverride: 20,
      fontWeightOverride: 740,
    }),
    textNode("compile-label", "编译着色器", {x: 930, y: 343, width: 200, height: 34}, {
      fontSizeOverride: 18,
      fontWeightOverride: 820,
      textColorOverride: "#c66f4c",
    }),
    node("after-image", "启用后截图", {x: 120, y: 484, width: 760, height: 176}, {
      fontSizeOverride: 22,
      fontWeightOverride: 740,
    }),
    textNode("after-label", "PSO Cache启用后", {x: 930, y: 555, width: 240, height: 34}, {
      fontSizeOverride: 18,
      fontWeightOverride: 820,
      textColorOverride: "#c66f4c",
    }),
  ],
);

const page02FormalReviewSketch = makeFormalReviewSketch(
  "formal-page02",
  "page_02",
  "Page 02 pipeline-state preview",
  [
    node("pso-preview", "PSO = Shader + State", {x: 52, y: 424, width: 446, height: 288}, {
      fontSizeOverride: 20,
      fontWeightOverride: 820,
    }),
    node("pso-shader", "Shader / Program / Function", {x: 68, y: 460, width: 414, height: 40}, {
      containerId: "pso-preview",
      fontSizeOverride: 15.6,
      fontWeightOverride: 780,
    }),
    textNode("pso-state-caption", "State 里常见会收什么", {x: 68, y: 502, width: 280, height: 28}, {
      containerId: "pso-preview",
      fontSizeOverride: 14.4,
      fontWeightOverride: 720,
    }),
    node("pso-state-1", "Vertex Decl / Input Layout", {x: 68, y: 536, width: 202, height: 56}, {
      containerId: "pso-preview",
      fontSizeOverride: 13.2,
      fontWeightOverride: 760,
    }),
    node("pso-state-2", "RT / Format", {x: 280, y: 536, width: 202, height: 56}, {
      containerId: "pso-preview",
      fontSizeOverride: 14.2,
      fontWeightOverride: 760,
    }),
    node("pso-state-3", "Depth / Stencil Test", {x: 68, y: 600, width: 202, height: 56}, {
      containerId: "pso-preview",
      fontSizeOverride: 13.8,
      fontWeightOverride: 760,
    }),
    node("pso-state-4", "Blend / Rasterizer State", {x: 280, y: 600, width: 202, height: 56}, {
      containerId: "pso-preview",
      fontSizeOverride: 13,
      fontWeightOverride: 760,
    }),
    node("pso-state-5", "Primitive / Samples / Pass", {x: 68, y: 664, width: 414, height: 40}, {
      containerId: "pso-preview",
      fontSizeOverride: 14.4,
      fontWeightOverride: 760,
    }),
    node("pipeline-state", "Pipeline State", {x: 518, y: 136, width: 244, height: 60}, {
      fontSizeOverride: 21,
      fontWeightOverride: 710,
    }),
    node("vertex-buffer-image", "VertexBuffer", {x: 782, y: 428, width: 440, height: 160}, {
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
    node("left-code", "Vertex", {x: 72, y: 132, width: 520, height: 286}),
    node("right-code", "Factory", {x: 610, y: 132, width: 584, height: 286}),
    node("left-image", "Texcoord1", {x: 72, y: 446, width: 520, height: 222}),
    node("right-image", "Texcoord2", {x: 610, y: 446, width: 584, height: 232}),
    node("footer", "Footer", {x: 120, y: 688, width: 1040, height: 54}),
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
  makeFormalReviewSketch("formal-page31", "page_31", "Page 31 harness loop", [
    node("loop-card", "Harness Loop", {x: 84, y: 138, width: 644, height: 418}),
    node("agent-node", "Agent", {x: 104, y: 224, width: 176, height: 72}, {
      containerId: "loop-card",
    }),
    node("edge-node", "Front Edge Probe", {x: 320, y: 224, width: 176, height: 72}, {
      containerId: "loop-card",
    }),
    node("artifact-node", "Artifact", {x: 536, y: 224, width: 176, height: 72}, {
      containerId: "loop-card",
    }),
    node("metrics-node", "Metrics", {x: 536, y: 432, width: 176, height: 72}, {
      containerId: "loop-card",
    }),
    node("policy-node", "Policy", {x: 320, y: 432, width: 176, height: 72}, {
      containerId: "loop-card",
    }),
    node("feedback-node", "Feedback", {x: 104, y: 432, width: 176, height: 72}, {
      containerId: "loop-card",
    }),
    node("helper-card", "Hook And Gates", {x: 752, y: 138, width: 378, height: 418}),
    node("trigger-1", "hook", {x: 774, y: 230, width: 156, height: 42}, {
      containerId: "helper-card",
      fontSizeOverride: 18,
    }),
    node("trigger-2", "workflow_gate.py", {x: 946, y: 230, width: 164, height: 42}, {
      containerId: "helper-card",
      labelLines: ["workflow_gate", ".py"],
      fontSizeOverride: 14,
    }),
    node("trigger-3", "review:mechanical", {x: 774, y: 286, width: 156, height: 42}, {
      containerId: "helper-card",
      labelLines: ["review:", "mechanical"],
      fontSizeOverride: 13.5,
    }),
    node("trigger-4", "front Edge probe", {x: 946, y: 286, width: 164, height: 42}, {
      containerId: "helper-card",
      labelLines: ["front Edge", "probe"],
      fontSizeOverride: 13.5,
    }),
    node("gate-1", "Overlap", {x: 774, y: 452, width: 156, height: 42}, {
      containerId: "helper-card",
      fontSizeOverride: 16,
    }),
    node("gate-2", "Crossing", {x: 946, y: 452, width: 164, height: 42}, {
      containerId: "helper-card",
      fontSizeOverride: 16,
    }),
    node("gate-3", "Pierce", {x: 774, y: 508, width: 156, height: 42}, {
      containerId: "helper-card",
      fontSizeOverride: 16,
    }),
    node("gate-4", "Overflow", {x: 946, y: 508, width: 164, height: 42}, {
      containerId: "helper-card",
      fontSizeOverride: 16,
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
  page00FormalReviewSketch,
  page02FormalReviewSketch,
  page03FormalReviewSketch,
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
