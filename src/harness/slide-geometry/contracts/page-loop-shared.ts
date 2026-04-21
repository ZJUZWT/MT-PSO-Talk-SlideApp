import type {StoryStepId} from "../../../storyboard-data/pso-workbench-types";
import type {
  GeometrySketchDefinition,
  SketchContract,
  SketchEdge,
  SketchNode,
} from "../render/geometry-sketch-types";

export type LoopNodeId =
  | "computer"
  | "phone"
  | "a"
  | "bytecode"
  | "scl"
  | "stable-pc"
  | "b"
  | "stable-upipe"
  | "rec";

export type LoopEdgeId =
  | "computer-to-a"
  | "a-to-bytecode"
  | "a-to-scl"
  | "bytecode-to-phone"
  | "computer-to-stablepc"
  | "stablepc-to-b"
  | "scl-to-b"
  | "b-to-stableupipe"
  | "stableupipe-to-phone"
  | "phone-to-rec"
  | "rec-to-computer";

const COMPUTER = {x: 112, y: 430, width: 196, height: 66};
const PHONE = {x: 1122, y: 430, width: 128, height: 66};
const SCL = {x: 506, y: 434, width: 184, height: 58};
const BYTECODE = {x: 486, y: 545, width: 274, height: 58};
const STABLE_PC = {x: 392, y: 349, width: 226, height: 58};
const B = {x: 742, y: 360, width: 36, height: 36};
const STABLE_UPIPE = {x: 800, y: 333, width: 246, height: 90};
const REC = {x: 500, y: 186, width: 320, height: 58};
const A = {x: 430, y: 520, width: 16, height: 16};

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

const A_POINT = {x: centerX(A), y: centerY(A)};
const COMPUTER_COOK_FROM = {x: right(COMPUTER), y: centerY(COMPUTER) + 11};
const COMPUTER_EXPAND_FROM = {x: right(COMPUTER), y: centerY(COMPUTER) - 11};
const COOK_DELTA = A_POINT.y - COMPUTER_COOK_FROM.y;
const COOK_TURN = {
  x: COMPUTER_COOK_FROM.x + COOK_DELTA,
  y: COMPUTER_COOK_FROM.y + COOK_DELTA,
};
const BYTECODE_TURN = {
  x: A_POINT.x + (centerY(BYTECODE) - A_POINT.y),
  y: centerY(BYTECODE),
};
const SCL_TURN = {
  x: A_POINT.x + (A_POINT.y - centerY(SCL)),
  y: centerY(SCL),
};
const BYTECODE_TO_PHONE_TARGET = {x: left(PHONE), y: centerY(PHONE) + 10};
const BYTECODE_TO_PHONE_TURN = {
  x:
    BYTECODE_TO_PHONE_TARGET.x -
    (centerY(BYTECODE) - BYTECODE_TO_PHONE_TARGET.y),
  y: centerY(BYTECODE),
};
const EXPAND_DELTA = COMPUTER_EXPAND_FROM.y - centerY(STABLE_PC);
const EXPAND_TURN = {
  x: COMPUTER_EXPAND_FROM.x + EXPAND_DELTA,
  y: centerY(STABLE_PC),
};
const STABLE_PC_TO_B_TARGET = {x: left(B), y: centerY(B)};
const SCL_TO_B_TARGET = {x: centerX(B), y: bottom(B)};
const SCL_TO_B_TURN = {
  x: centerX(B),
  y: centerY(SCL),
};
const B_TO_STABLE_TARGET = {x: left(STABLE_UPIPE), y: centerY(STABLE_UPIPE)};
const STABLE_TO_PHONE_TARGET = {x: left(PHONE), y: centerY(PHONE) - 10};
const STABLE_TO_PHONE_TURN = {
  x:
    STABLE_TO_PHONE_TARGET.x -
    (STABLE_TO_PHONE_TARGET.y - centerY(STABLE_UPIPE)),
  y: centerY(STABLE_UPIPE),
};
const PHONE_TO_REC_TURN = {x: centerX(PHONE), y: centerY(REC)};
const REC_TO_COMPUTER_TURN = {x: centerX(COMPUTER), y: centerY(REC)};

const BASE_NODES: Record<LoopNodeId, SketchNode> = {
  computer: {
    id: "computer",
    label: "构建机",
    x: COMPUTER.x,
    y: COMPUTER.y,
    width: COMPUTER.width,
    height: COMPUTER.height,
    tone: "receiver",
    fontSizeOverride: 32,
  },
  phone: {
    id: "phone",
    label: "Phone",
    x: PHONE.x,
    y: PHONE.y,
    width: PHONE.width,
    height: PHONE.height,
    tone: "receiver",
    fontSizeOverride: 32,
  },
  a: {
    id: "a",
    label: "",
    x: A.x,
    y: A.y,
    width: A.width,
    height: A.height,
    tone: "muted",
    shape: "circle",
  },
  bytecode: {
    id: "bytecode",
    label: ".ushaderbytecode",
    x: BYTECODE.x,
    y: BYTECODE.y,
    width: BYTECODE.width,
    height: BYTECODE.height,
    fontSizeOverride: 28,
  },
  scl: {
    id: "scl",
    label: ".scl.csv",
    x: SCL.x,
    y: SCL.y,
    width: SCL.width,
    height: SCL.height,
    fontSizeOverride: 28,
  },
  "stable-pc": {
    id: "stable-pc",
    label: "stablepc.csv",
    x: STABLE_PC.x,
    y: STABLE_PC.y,
    width: STABLE_PC.width,
    height: STABLE_PC.height,
    fontSizeOverride: 28,
  },
  b: {
    id: "b",
    label: "+",
    x: B.x,
    y: B.y,
    width: B.width,
    height: B.height,
    tone: "muted",
    shape: "circle",
    fontSizeOverride: 22,
  },
  "stable-upipe": {
    id: "stable-upipe",
    label: "stable.upipelinecache",
    labelLines: ["stable.", "upipelinecache"],
    x: STABLE_UPIPE.x,
    y: STABLE_UPIPE.y,
    width: STABLE_UPIPE.width,
    height: STABLE_UPIPE.height,
    fontSizeOverride: 28,
  },
  rec: {
    id: "rec",
    label: "rec.upipelinecache",
    x: REC.x,
    y: REC.y,
    width: REC.width,
    height: REC.height,
    fontSizeOverride: 28,
  },
};

const BASE_EDGES: Record<LoopEdgeId, SketchEdge> = {
  "computer-to-a": {
    id: "computer-to-a",
    from: COMPUTER_COOK_FROM,
    to: A_POINT,
    waypoints: [COOK_TURN],
    tone: "primary",
    label: "cook",
    labelPoint: {x: 394, y: COOK_TURN.y - 18},
    arrowEnd: true,
  },
  "a-to-bytecode": {
    id: "a-to-bytecode",
    from: A_POINT,
    to: {x: left(BYTECODE), y: centerY(BYTECODE)},
    waypoints: [BYTECODE_TURN],
    tone: "primary",
    arrowEnd: true,
  },
  "a-to-scl": {
    id: "a-to-scl",
    from: A_POINT,
    to: {x: left(SCL), y: centerY(SCL)},
    waypoints: [SCL_TURN],
    tone: "primary",
    arrowEnd: true,
  },
  "bytecode-to-phone": {
    id: "bytecode-to-phone",
    from: {x: right(BYTECODE), y: centerY(BYTECODE)},
    to: BYTECODE_TO_PHONE_TARGET,
    waypoints: [BYTECODE_TO_PHONE_TURN],
    tone: "primary",
    arrowEnd: true,
  },
  "computer-to-stablepc": {
    id: "computer-to-stablepc",
    from: COMPUTER_EXPAND_FROM,
    to: {x: left(STABLE_PC), y: centerY(STABLE_PC)},
    waypoints: [EXPAND_TURN],
    tone: "primary",
    label: "expand",
    labelPoint: {x: 404, y: centerY(STABLE_PC) - 20},
    arrowEnd: true,
  },
  "stablepc-to-b": {
    id: "stablepc-to-b",
    from: {x: right(STABLE_PC), y: centerY(STABLE_PC)},
    to: STABLE_PC_TO_B_TARGET,
    tone: "primary",
    arrowEnd: true,
  },
  "scl-to-b": {
    id: "scl-to-b",
    from: {x: right(SCL), y: centerY(SCL)},
    to: SCL_TO_B_TARGET,
    waypoints: [SCL_TO_B_TURN],
    tone: "primary",
    arrowEnd: true,
  },
  "b-to-stableupipe": {
    id: "b-to-stableupipe",
    from: {x: right(B), y: centerY(B)},
    to: B_TO_STABLE_TARGET,
    tone: "primary",
    arrowEnd: true,
  },
  "stableupipe-to-phone": {
    id: "stableupipe-to-phone",
    from: {x: right(STABLE_UPIPE), y: centerY(STABLE_UPIPE)},
    to: STABLE_TO_PHONE_TARGET,
    waypoints: [STABLE_TO_PHONE_TURN],
    tone: "primary",
    arrowEnd: true,
  },
  "phone-to-rec": {
    id: "phone-to-rec",
    from: {x: centerX(PHONE), y: top(PHONE)},
    to: {x: right(REC), y: centerY(REC)},
    waypoints: [PHONE_TO_REC_TURN],
    tone: "primary",
    arrowEnd: true,
  },
  "rec-to-computer": {
    id: "rec-to-computer",
    from: {x: left(REC), y: centerY(REC)},
    to: {x: centerX(COMPUTER), y: top(COMPUTER)},
    waypoints: [REC_TO_COMPUTER_TURN],
    tone: "primary",
    arrowEnd: true,
  },
};

type BuildLoopSketchOptions = {
  id: string;
  label: string;
  stepId: StoryStepId;
  contract: SketchContract;
  visibleNodeIds: LoopNodeId[];
  visibleEdgeIds: LoopEdgeId[];
  nodeOverrides?: Partial<Record<LoopNodeId, Partial<SketchNode>>>;
  edgeOverrides?: Partial<Record<LoopEdgeId, Partial<SketchEdge>>>;
};

export function buildLoopSketch({
  id,
  label,
  stepId,
  contract,
  visibleNodeIds,
  visibleEdgeIds,
  nodeOverrides,
  edgeOverrides,
}: BuildLoopSketchOptions): GeometrySketchDefinition {
  return {
    id,
    label,
    stepId,
    contract,
    nodes: visibleNodeIds.map((nodeId) => ({
      ...BASE_NODES[nodeId],
      ...(nodeOverrides?.[nodeId] ?? {}),
    })),
    edges: visibleEdgeIds.map((edgeId) => ({
      ...BASE_EDGES[edgeId],
      ...(edgeOverrides?.[edgeId] ?? {}),
    })),
  };
}
