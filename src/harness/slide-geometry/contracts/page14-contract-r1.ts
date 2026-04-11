import type {GeometrySketchDefinition} from "../render/geometry-sketch-types";
import {page14ContractR1Logic} from "./page14-contract-r1.logic";

const COMPUTER = {x: 132, y: 397, width: 192, height: 64};
const PHONE = {x: 1116, y: 397, width: 128, height: 64};
const SCL = {x: 596, y: 400, width: 176, height: 58};
const BYTECODE = {x: 552, y: 512, width: 276, height: 58};
const STABLE_PC = {x: 442, y: 331, width: 196, height: 58};
const B = {x: 792, y: 344, width: 32, height: 32};
const STABLE_UPIPE = {x: 836, y: 312, width: 224, height: 96};
const REC = {x: 569, y: 182, width: 282, height: 58};
const A = {x: 450, y: 492, width: 16, height: 16};

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

function contractNodeLabel(nodeId: string) {
  const node = page14ContractR1Logic.nodes.find((candidate) => candidate.id === nodeId);

  if (!node) {
    throw new Error(`Missing page14 contract node: ${nodeId}`);
  }

  return node.label;
}

function contractEdgeLabel(edgeId: string) {
  const edge = page14ContractR1Logic.edges.find((candidate) => candidate.id === edgeId);

  if (!edge?.segmentLabel) {
    throw new Error(`Missing page14 contract edge label: ${edgeId}`);
  }

  return edge.segmentLabel;
}

const A_POINT = {x: A.x + A.width / 2, y: A.y + A.height / 2};
const COMPUTER_COOK_FROM = {
  x: right(COMPUTER),
  y: centerY(COMPUTER) + 11,
};
const COMPUTER_EXPAND_FROM = {
  x: right(COMPUTER),
  y: centerY(COMPUTER) - 11,
};
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
const BYTECODE_TO_PHONE_TARGET = {
  x: left(PHONE),
  y: centerY(PHONE) + 10,
};
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
const B_TO_STABLE_TARGET = {
  x: left(STABLE_UPIPE),
  y: centerY(STABLE_UPIPE),
};
const STABLE_PC_TO_B_TARGET = {
  x: left(B),
  y: centerY(B),
};
const SCL_TO_B_TARGET = {
  x: centerX(B),
  y: bottom(B),
};
const SCL_TO_B_TURN = {
  x: SCL_TO_B_TARGET.x - (centerY(SCL) - SCL_TO_B_TARGET.y),
  y: centerY(SCL),
};
const STABLE_TO_PHONE_TARGET = {
  x: left(PHONE),
  y: centerY(PHONE) - 10,
};
const STABLE_TO_PHONE_TURN = {
  x:
    STABLE_TO_PHONE_TARGET.x -
    (STABLE_TO_PHONE_TARGET.y - centerY(STABLE_UPIPE)),
  y: centerY(STABLE_UPIPE),
};

export const page14ContractR1Sketch: GeometrySketchDefinition = {
  id: "page14-contract-r1",
  label: "Page14 compiled contract sketch",
  stepId: "page_14",
  contract: {
    pageGoal: page14ContractR1Logic.pageGoal,
    receiverPlane: "Computer lower-left anchor to Phone lower-right anchor",
    primaryLine:
      "Computer -> A -> .ushaderbytecode / .scl.csv -> Phone, with stablepc.csv / .scl.csv converging through B before stable.upipelinecache",
    keepStable:
      "Keep the shared baselines, the A split semantics, and the return loop from the text contract.",
    newChange:
      "This sketch is compiled from an explicit page14 text contract instead of from a rough image trace.",
    doNot:
      "Do not promote line labels into nodes or use any non-0/45/90 route segment.",
  },
  nodes: [
    {
      id: "computer",
      label: contractNodeLabel("computer"),
      x: COMPUTER.x,
      y: COMPUTER.y,
      width: COMPUTER.width,
      height: COMPUTER.height,
      tone: "receiver",
      fontSizeOverride: 32,
    },
    {
      id: "phone",
      label: contractNodeLabel("phone"),
      x: PHONE.x,
      y: PHONE.y,
      width: PHONE.width,
      height: PHONE.height,
      tone: "receiver",
      fontSizeOverride: 32,
    },
    {
      id: "a",
      label: "",
      x: A.x,
      y: A.y,
      width: A.width,
      height: A.height,
      tone: "muted",
      shape: "circle",
    },
    {
      id: "b",
      label: "+",
      x: B.x,
      y: B.y,
      width: B.width,
      height: B.height,
      tone: "muted",
      shape: "circle",
      fontSizeOverride: 20,
    },
    {
      id: "scl",
      label: contractNodeLabel("scl"),
      x: SCL.x,
      y: SCL.y,
      width: SCL.width,
      height: SCL.height,
      fontSizeOverride: 28,
    },
    {
      id: "bytecode",
      label: contractNodeLabel("bytecode"),
      x: BYTECODE.x,
      y: BYTECODE.y,
      width: BYTECODE.width,
      height: BYTECODE.height,
      fontSizeOverride: 28,
    },
    {
      id: "stable-pc",
      label: contractNodeLabel("stable-pc"),
      x: STABLE_PC.x,
      y: STABLE_PC.y,
      width: STABLE_PC.width,
      height: STABLE_PC.height,
      fontSizeOverride: 28,
    },
    {
      id: "stable-upipe",
      label: contractNodeLabel("stable-upipe"),
      x: STABLE_UPIPE.x,
      y: STABLE_UPIPE.y,
      width: STABLE_UPIPE.width,
      height: STABLE_UPIPE.height,
      labelLines: ["stable.", "upipelinecache"],
      fontSizeOverride: 28,
    },
    {
      id: "rec",
      label: contractNodeLabel("rec"),
      x: REC.x,
      y: REC.y,
      width: REC.width,
      height: REC.height,
      fontSizeOverride: 28,
    },
  ],
  edges: [
    {
      id: "computer-to-a",
      from: COMPUTER_COOK_FROM,
      to: A_POINT,
      waypoints: [COOK_TURN],
      tone: "primary",
      label: contractEdgeLabel("computer-to-a"),
      labelPoint: {x: 394, y: COOK_TURN.y - 18},
      arrowEnd: true,
    },
    {
      id: "a-to-bytecode",
      from: A_POINT,
      to: {x: left(BYTECODE), y: centerY(BYTECODE)},
      waypoints: [BYTECODE_TURN],
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "a-to-scl",
      from: A_POINT,
      to: {x: left(SCL), y: centerY(SCL)},
      waypoints: [SCL_TURN],
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "bytecode-to-phone",
      from: {x: right(BYTECODE), y: centerY(BYTECODE)},
      to: BYTECODE_TO_PHONE_TARGET,
      waypoints: [BYTECODE_TO_PHONE_TURN],
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "computer-to-stablepc",
      from: COMPUTER_EXPAND_FROM,
      to: {x: left(STABLE_PC), y: centerY(STABLE_PC)},
      waypoints: [EXPAND_TURN],
      tone: "primary",
      label: contractEdgeLabel("computer-to-stablepc"),
      labelPoint: {x: 392, y: EXPAND_TURN.y - 14},
      arrowEnd: true,
    },
    {
      id: "scl-to-b",
      from: {x: right(SCL), y: centerY(SCL)},
      to: SCL_TO_B_TARGET,
      waypoints: [SCL_TO_B_TURN],
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "stablepc-to-b",
      from: {x: right(STABLE_PC), y: centerY(STABLE_PC)},
      to: STABLE_PC_TO_B_TARGET,
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "b-to-stableupipe",
      from: {x: right(B), y: centerY(B)},
      to: B_TO_STABLE_TARGET,
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "stableupipe-to-phone",
      from: {x: right(STABLE_UPIPE), y: centerY(STABLE_UPIPE)},
      to: STABLE_TO_PHONE_TARGET,
      waypoints: [STABLE_TO_PHONE_TURN],
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "phone-to-rec",
      from: {x: centerX(PHONE), y: top(PHONE)},
      to: {x: right(REC), y: centerY(REC)},
      waypoints: [{x: centerX(PHONE), y: centerY(REC)}],
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "rec-to-computer",
      from: {x: left(REC), y: centerY(REC)},
      to: {x: centerX(COMPUTER), y: top(COMPUTER)},
      waypoints: [{x: centerX(COMPUTER), y: centerY(REC)}],
      tone: "primary",
      arrowEnd: true,
    },
  ],
};
