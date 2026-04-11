import type {GeometrySketchDefinition} from "../render/geometry-sketch-types";

function cx(box: {x: number; width: number}) {
  return box.x + box.width / 2;
}

function cy(box: {y: number; height: number}) {
  return box.y + box.height / 2;
}

function right(box: {x: number; width: number}) {
  return box.x + box.width;
}

const COMPUTER = {x: 74, y: 268, width: 156, height: 90};
const BYTECODE = {x: 288, y: 218, width: 228, height: 70};
const SCL = {x: 288, y: 324, width: 228, height: 70};
const RUNTIME = {x: 640, y: 118, width: 530, height: 366};
const RUNTIME_INNER = {x: 740, y: 222, width: 330, height: 150};

export const page11R1Sketch: GeometrySketchDefinition = {
  id: "page11-r1",
  label: "Runtime landing sketch",
  stepId: "page_11",
  contract: {
    pageGoal: "Show page11 as the handoff page where both cook files visibly land on the runtime side.",
    receiverPlane: "Runtime Frame",
    primaryLine: ".shaderbytecode + .scl.csv -> runtime frame",
    keepStable: "Keep the same left-to-right poles as page10 while letting the runtime side grow larger.",
    newChange: "Make the runtime frame the receiver and show both file inputs clearly entering it.",
    doNot: "Do not add the return leg yet or let the computer dominate the slide.",
  },
  nodes: [
    {
      id: "computer",
      label: "Computer",
      x: COMPUTER.x,
      y: COMPUTER.y,
      width: COMPUTER.width,
      height: COMPUTER.height,
      tone: "muted",
    },
    {
      id: "shaderbytecode",
      label: ".shaderbytecode",
      x: BYTECODE.x,
      y: BYTECODE.y,
      width: BYTECODE.width,
      height: BYTECODE.height,
      tone: "default",
    },
    {
      id: "scl",
      label: ".scl.csv",
      x: SCL.x,
      y: SCL.y,
      width: SCL.width,
      height: SCL.height,
      tone: "default",
    },
    {
      id: "runtime",
      label: "Runtime Frame",
      x: RUNTIME.x,
      y: RUNTIME.y,
      width: RUNTIME.width,
      height: RUNTIME.height,
      tone: "receiver",
    },
    {
      id: "runtime-inner",
      label: "Runtime",
      containerId: "runtime",
      x: RUNTIME_INNER.x,
      y: RUNTIME_INNER.y,
      width: RUNTIME_INNER.width,
      height: RUNTIME_INNER.height,
      tone: "default",
    },
  ],
  edges: [
    {
      id: "computer-to-files",
      from: {x: right(COMPUTER) + 8, y: cy(COMPUTER)},
      to: {x: BYTECODE.x - 8, y: cy(COMPUTER)},
      waypoints: [{x: BYTECODE.x - 36, y: cy(COMPUTER)}],
      tone: "support",
      dashed: true,
    },
    {
      id: "bytecode-to-runtime",
      from: {x: right(BYTECODE) + 8, y: cy(BYTECODE)},
      to: {x: RUNTIME.x - 8, y: cy(BYTECODE)},
      waypoints: [{x: RUNTIME.x - 40, y: cy(BYTECODE)}],
      tone: "primary",
    },
    {
      id: "scl-to-runtime",
      from: {x: right(SCL) + 8, y: cy(SCL)},
      to: {x: RUNTIME.x - 8, y: cy(SCL)},
      waypoints: [{x: RUNTIME.x - 58, y: cy(SCL)}],
      tone: "primary",
    },
  ],
};
