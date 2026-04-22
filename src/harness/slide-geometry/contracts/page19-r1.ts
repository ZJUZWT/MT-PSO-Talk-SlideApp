import type {GeometrySketchDefinition} from "../render/geometry-sketch-types";

const MID_Y = 320;

export const page19R1Sketch: GeometrySketchDefinition = {
  id: "page19-r1",
  label: "Page 19 merged precompile cache chain",
  stepId: "page_19",
  contract: {
    pageGoal:
      "Explain the simplified precompile chain with only three slim orange anchors: stable.upipelinecache, 内存中GfxPSO, and 硬盘中的 PSO, plus the top horizontal GPU strip and the three-note binary boundary row.",
    receiverPlane:
      "Single merged stage with one left orange anchor, one centered 内存中GfxPSO pivot, one right orange anchor, one top horizontal GPU strip, and a three-note binary boundary row at the bottom.",
    primaryLine:
      "stable.upipelinecache -> 内存中GfxPSO -> GPU strip / 硬盘中的 PSO",
    keepStable:
      "Keep the three orange anchors slim and symmetric, keep VertexData / GPU / Pixels horizontal above 内存中GfxPSO, and keep the bottom three notes aligned to the same three-column grid.",
    newChange:
      "Delete all nine inner white cards, let the three orange anchors stand on their own, and replace the three right-side cache routes with one clean dashed handoff.",
    doNot:
      "Do not restore the old white child cards, do not add replacement labels inside the orange anchors, and do not bring back the old vertical GPU spine.",
  },
  nodes: [
    {
      id: "stable",
      label: "stable.upipelinecache",
      textRuns: [
        {
          text: "UE PSO",
          x: 131,
          y: 96,
          fontSize: 38,
          fontWeight: 820,
          textAnchor: "middle",
        },
        {
          text: "stable.upipelinecache",
          x: 131,
          y: 132,
          fontSize: 17,
          fontWeight: 760,
          textAnchor: "middle",
        },
      ],
      x: 142,
      y: 206,
      width: 262,
      height: 228,
    },
    {
      id: "vertex-icon",
      label: "",
      x: 402,
      y: 34,
      width: 88,
      height: 88,
      renderStyle: "textOnly",
    },
    {
      id: "gpu",
      label: "GPU",
      x: 582,
      y: 38,
      width: 116,
      height: 80,
      renderStyle: "textOnly",
      fontSizeOverride: 52,
    },
    {
      id: "pixel-icon",
      label: "",
      x: 790,
      y: 40,
      width: 68,
      height: 76,
      renderStyle: "textOnly",
    },
    {
      id: "gfx-pso",
      label: "内存中GfxPSO",
      x: 509,
      y: 206,
      width: 262,
      height: 228,
      fontSizeOverride: 30,
    },
    {
      id: "disk-group",
      label: "硬盘中的 PSO",
      x: 876,
      y: 206,
      width: 262,
      height: 228,
      fontSizeOverride: 31,
    },
    {
      id: "binary-note-1",
      label: "Shader / State",
      x: 142,
      y: 500,
      width: 262,
      height: 78,
      textRuns: [
        {text: "Shader / State", x: 18, y: 20, fontSize: 17, fontWeight: 820},
        {text: "内容一变，旧缓存就可能不再匹配。", x: 18, y: 43, fontSize: 13, fontWeight: 700},
        {text: "binary / cache 不是稳定接口。", x: 18, y: 61, fontSize: 12.5, fontWeight: 660},
      ],
    },
    {
      id: "binary-note-2",
      label: "codegen / 映射",
      x: 509,
      y: 500,
      width: 262,
      height: 78,
      textRuns: [
        {text: "codegen / 映射", x: 18, y: 20, fontSize: 17, fontWeight: 820},
        {text: "SharedCode / Hash / scl 一变，就要重建。", x: 18, y: 43, fontSize: 12.5, fontWeight: 700},
        {text: "旧 binary 只对应那次构建组合。", x: 18, y: 61, fontSize: 12.5, fontWeight: 660},
      ],
    },
    {
      id: "binary-note-3",
      label: "OS / Driver / GPU / API",
      x: 876,
      y: 500,
      width: 262,
      height: 78,
      textRuns: [
        {text: "OS / Driver / GPU / API", x: 18, y: 20, fontSize: 15, fontWeight: 820},
        {text: "环境一变，本地 binary 也可能立刻失效。", x: 18, y: 43, fontSize: 12.5, fontWeight: 700},
        {text: "它只是某次平台组合的落盘形态。", x: 18, y: 61, fontSize: 12.5, fontWeight: 660},
      ],
    },
    {
      id: "binary-archive2",
      label: "Metal Binary Archive 2 ?",
      x: 924,
      y: 648,
      width: 166,
      height: 44,
      textRuns: [
        {text: "Metal", x: 83, y: 13, fontSize: 12.5, fontWeight: 820, textAnchor: "middle"},
        {text: "Binary Archive 2 ?", x: 83, y: 29, fontSize: 14, fontWeight: 800, textAnchor: "middle"},
      ],
    },
  ],
  edges: [
    {
      id: "stable-to-gfx",
      from: {x: 432, y: MID_Y},
      to: {x: 478, y: MID_Y},
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "vertex-to-gpu",
      from: {x: 490, y: 78},
      to: {x: 582, y: 78},
      tone: "support",
      arrowEnd: true,
    },
    {
      id: "gpu-to-pixel",
      from: {x: 698, y: 78},
      to: {x: 790, y: 78},
      tone: "support",
      arrowEnd: true,
    },
    {
      id: "gfx-to-gpu",
      from: {x: 640, y: 206},
      to: {x: 640, y: 118},
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "gfx-to-disk",
      from: {x: 771, y: MID_Y},
      to: {x: 876, y: MID_Y},
      tone: "proof",
      dashed: true,
      arrowEnd: true,
    },
  ],
};
