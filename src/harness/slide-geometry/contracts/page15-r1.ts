import type {GeometrySketchDefinition} from "../render/geometry-sketch-types";

const COMPUTER = {x: 52, y: 291, width: 202, height: 110};
const PHONE = {x: 1040, y: 154, width: 188, height: 412};
const REC = {x: 518, y: 92, width: 296, height: 66};
const EXPAND_MERGE = {x: 312, y: 328, width: 36, height: 36};
const STABLE_PC = {x: 398, y: 313, width: 206, height: 66};
const SCL = {x: 235, y: 426, width: 190, height: 66};
const BYTECODE = {x: 494, y: 542, width: 292, height: 76};
const MERGE_B = {x: 672, y: 328, width: 36, height: 36};
const STABLE_UPIPE = {x: 780, y: 291, width: 200, height: 110};
const SPLIT_A = {x: 322, y: 572, width: 16, height: 16};
const PHONE_VERTEX = {x: 1098, y: 232, width: 72, height: 108};
const PHONE_GPU = {x: 1074, y: 374, width: 120, height: 48};
const PHONE_PIXELS = {x: 1092, y: 462, width: 84, height: 20};

function left(box: {x: number}) {
  return box.x;
}

function right(box: {x: number; width: number}) {
  return box.x + box.width;
}

function top(box: {y: number}) {
  return box.y;
}

function bottom(box: {y: number; height: number}) {
  return box.y + box.height;
}

function centerX(box: {x: number; width: number}) {
  return box.x + box.width / 2;
}

function centerY(box: {y: number; height: number}) {
  return box.y + box.height / 2;
}

export const page15R1Sketch: GeometrySketchDefinition = {
  id: "page15-r1",
  label: "Page15 live layout contract",
  stepId: "page_15",
  contract: {
    pageGoal:
      "Score the current live page15 layout from the actual remotion topology, including the expand pre-merge and the final stable cache landing back into Phone.",
    receiverPlane: "Computer lower-left source, Phone lower-right runtime sink, stable band across the middle",
    primaryLine:
      "Computer -> split A -> .scl.csv / .ushaderbytecode -> Phone, plus Computer/.scl.csv -> expand merge -> stablepc.csv -> merge B -> stable.upipelinecache -> Phone",
    keepStable:
      "Keep the top rec.upipelinecache return loop, the phone runtime stack, and both bytecode/stable landing routes visible at once.",
    newChange:
      "Use the current live page15 geometry instead of the older shared loop contract so the score matches the real remotion frame.",
    doNot:
      "Do not simplify away merge-a, do not fake line labels as nodes, and do not grade an outdated sketch topology.",
  },
  nodes: [
    {
      id: "computer",
      label: "构建机",
      x: COMPUTER.x,
      y: COMPUTER.y,
      width: COMPUTER.width,
      height: COMPUTER.height,
      tone: "muted",
      fontSizeOverride: 25,
      fontWeightOverride: 760,
    },
    {
      id: "phone",
      label: "",
      x: PHONE.x,
      y: PHONE.y,
      width: PHONE.width,
      height: PHONE.height,
      tone: "receiver",
    },
    {
      id: "phone-vertex",
      label: "",
      containerId: "phone",
      x: PHONE_VERTEX.x,
      y: PHONE_VERTEX.y,
      width: PHONE_VERTEX.width,
      height: PHONE_VERTEX.height,
      tone: "muted",
      renderStyle: "outline",
    },
    {
      id: "phone-gpu",
      label: "GPU",
      containerId: "phone",
      x: PHONE_GPU.x,
      y: PHONE_GPU.y,
      width: PHONE_GPU.width,
      height: PHONE_GPU.height,
      tone: "muted",
      renderStyle: "outline",
      fontSizeOverride: 32,
      fontWeightOverride: 800,
    },
    {
      id: "phone-pixels",
      label: "",
      containerId: "phone",
      x: PHONE_PIXELS.x,
      y: PHONE_PIXELS.y,
      width: PHONE_PIXELS.width,
      height: PHONE_PIXELS.height,
      tone: "muted",
      renderStyle: "outline",
    },
    {
      id: "rec",
      label: "rec.upipelinecache",
      x: REC.x,
      y: REC.y,
      width: REC.width,
      height: REC.height,
      fontSizeOverride: 26,
      fontWeightOverride: 760,
    },
    {
      id: "expand-merge",
      label: "+",
      x: EXPAND_MERGE.x,
      y: EXPAND_MERGE.y,
      width: EXPAND_MERGE.width,
      height: EXPAND_MERGE.height,
      tone: "muted",
      shape: "circle",
      fontSizeOverride: 22,
      fontWeightOverride: 760,
    },
    {
      id: "stable-pc",
      label: "stablepc.csv",
      x: STABLE_PC.x,
      y: STABLE_PC.y,
      width: STABLE_PC.width,
      height: STABLE_PC.height,
      fontSizeOverride: 26,
      fontWeightOverride: 760,
    },
    {
      id: "scl",
      label: ".scl.csv",
      x: SCL.x,
      y: SCL.y,
      width: SCL.width,
      height: SCL.height,
      fontSizeOverride: 26,
      fontWeightOverride: 760,
    },
    {
      id: "bytecode",
      label: ".ushaderbytecode",
      x: BYTECODE.x,
      y: BYTECODE.y,
      width: BYTECODE.width,
      height: BYTECODE.height,
      fontSizeOverride: 26,
      fontWeightOverride: 760,
    },
    {
      id: "a",
      label: "",
      x: SPLIT_A.x,
      y: SPLIT_A.y,
      width: SPLIT_A.width,
      height: SPLIT_A.height,
      tone: "muted",
      shape: "circle",
    },
    {
      id: "b",
      label: "+",
      x: MERGE_B.x,
      y: MERGE_B.y,
      width: MERGE_B.width,
      height: MERGE_B.height,
      tone: "muted",
      shape: "circle",
      fontSizeOverride: 22,
      fontWeightOverride: 760,
    },
    {
      id: "stable-upipe",
      label: "stable.upipelinecache",
      labelLines: ["stable.", "upipelinecache"],
      x: STABLE_UPIPE.x,
      y: STABLE_UPIPE.y,
      width: STABLE_UPIPE.width,
      height: STABLE_UPIPE.height,
      tone: "receiver",
      fontSizeOverride: 26,
      fontWeightOverride: 760,
    },
  ],
  edges: [
    {
      id: "computer-to-a",
      from: {x: centerX(COMPUTER), y: bottom(COMPUTER) + 8},
      to: {x: centerX(SPLIT_A) - 8, y: centerY(SPLIT_A)},
      waypoints: [{x: centerX(COMPUTER), y: centerY(SPLIT_A)}],
      tone: "primary",
      label: "cook",
      labelPoint: {x: (centerX(COMPUTER) + (centerX(SPLIT_A) - 8)) / 2, y: centerY(SPLIT_A) - 28},
      arrowEnd: true,
    },
    {
      id: "a-to-scl",
      from: {x: centerX(SPLIT_A), y: top(SPLIT_A)},
      to: {x: centerX(SCL), y: bottom(SCL)},
      tone: "primary",
      labelPoint: {x: centerX(SCL), y: SCL.y - 28},
      arrowEnd: true,
    },
    {
      id: "a-to-bytecode",
      from: {x: centerX(SPLIT_A) + 8, y: centerY(SPLIT_A)},
      to: {x: left(BYTECODE) - 12, y: centerY(BYTECODE)},
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "bytecode-to-phone",
      from: {x: right(BYTECODE) + 12, y: centerY(BYTECODE)},
      to: {x: left(PHONE) - 10, y: centerY(PHONE_GPU) + 76},
      waypoints: [
        {x: 920, y: centerY(BYTECODE)},
        {x: 920, y: centerY(PHONE_GPU) + 76},
      ],
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "phone-to-rec",
      from: {x: centerX(PHONE), y: top(PHONE) - 8},
      to: {x: right(REC) + 12, y: centerY(REC)},
      waypoints: [{x: centerX(PHONE), y: centerY(REC)}],
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "rec-to-computer",
      from: {x: left(REC) - 12, y: centerY(REC)},
      to: {x: centerX(COMPUTER), y: top(COMPUTER) - 8},
      waypoints: [{x: centerX(COMPUTER), y: centerY(REC)}],
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "computer-to-expand-merge",
      from: {x: right(COMPUTER) + 18, y: centerY(EXPAND_MERGE)},
      to: {x: left(EXPAND_MERGE), y: centerY(EXPAND_MERGE)},
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "scl-to-expand-merge",
      from: {x: centerX(SCL), y: top(SCL) - 10},
      to: {x: centerX(EXPAND_MERGE), y: centerY(EXPAND_MERGE) + 18},
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "expand-merge-to-stablepc",
      from: {x: right(EXPAND_MERGE), y: centerY(EXPAND_MERGE)},
      to: {x: left(STABLE_PC) - 10, y: centerY(STABLE_PC)},
      tone: "primary",
      label: "expand",
      labelPoint: {x: (right(EXPAND_MERGE) + left(STABLE_PC) - 10) / 2, y: centerY(EXPAND_MERGE) - 24},
      arrowEnd: true,
    },
    {
      id: "stablepc-to-b",
      from: {x: right(STABLE_PC) + 10, y: centerY(MERGE_B)},
      to: {x: left(MERGE_B) - 2, y: centerY(MERGE_B)},
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "scl-to-b",
      from: {x: right(SCL) + 10, y: centerY(SCL)},
      to: {x: centerX(MERGE_B), y: centerY(MERGE_B) + 18},
      waypoints: [{x: centerX(MERGE_B), y: centerY(SCL)}],
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "b-to-stableupipe",
      from: {x: right(MERGE_B) + 2, y: centerY(MERGE_B)},
      to: {x: left(STABLE_UPIPE) - 10, y: centerY(STABLE_UPIPE)},
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "stableupipe-to-phone",
      from: {x: right(STABLE_UPIPE) + 10, y: centerY(STABLE_UPIPE)},
      to: {x: left(PHONE) - 10, y: centerY(STABLE_UPIPE)},
      tone: "primary",
      arrowEnd: true,
      strokeWidthOverride: 6.4,
    },
    {
      id: "runtime-edge-1",
      from: {x: centerX(PHONE), y: centerY(PHONE_VERTEX) + 54},
      to: {x: centerX(PHONE), y: centerY(PHONE_GPU) - 24},
      tone: "support",
      arrowEnd: true,
    },
    {
      id: "runtime-edge-2",
      from: {x: centerX(PHONE), y: centerY(PHONE_GPU) + 24},
      to: {x: centerX(PHONE), y: centerY(PHONE_PIXELS) - 10},
      tone: "support",
      arrowEnd: true,
    },
  ],
};
