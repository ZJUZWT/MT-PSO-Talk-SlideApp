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

function bottom(box: {y: number; height: number}) {
  return box.y + box.height;
}

const COMPUTER = {x: 58, y: 176, width: 336, height: 276};
const MATERIAL = {x: 118, y: 310, width: 214, height: 84};
const COOK_SPLIT = {x: 486, y: 426, width: 20, height: 20};
const BYTECODE = {x: 644, y: 328, width: 248, height: 68};
const SCL = {x: 644, y: 476, width: 248, height: 68};
const PHONE = {x: 918, y: 132, width: 310, height: 430};
const RUNTIME = {x: 964, y: 222, width: 216, height: 286};
const VERTEX_DATA = {x: 992, y: 284, width: 160, height: 48};
const GPU = {x: 1026, y: 354, width: 92, height: 48};
const PIXELS = {x: 1000, y: 424, width: 144, height: 48};

export const page10R1Sketch: GeometrySketchDefinition = {
  id: "page10-r1",
  label: "Cook split into runtime sketch",
  stepId: "page_10",
  contract: {
    pageGoal:
      "Show page10 as one clean cook-split bridge where the computer side emits two aligned cook outputs that both enter the phone-side runtime.",
    receiverPlane: "Phone / Runtime",
    primaryLine:
      "Computer(Material) --cook--> split -> .ushaderbytecode + .scl.csv -> Phone(Runtime)",
    keepStable:
      "Keep the page as one left-to-right bridge with computer on the left and phone on the right.",
    newChange:
      "Use one empty split junction with mirrored outgoing branches, plus computer and phone presentation containers.",
    doNot:
      "Do not turn cook into a box node, and do not collapse Runtime into one leaf node.",
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
      id: "material",
      label: "Material",
      x: MATERIAL.x,
      y: MATERIAL.y,
      width: MATERIAL.width,
      height: MATERIAL.height,
      tone: "default",
      containerId: "computer",
    },
    {
      id: "cook-split",
      label: "",
      x: COOK_SPLIT.x,
      y: COOK_SPLIT.y,
      width: COOK_SPLIT.width,
      height: COOK_SPLIT.height,
      tone: "muted",
      shape: "circle",
    },
    {
      id: "shaderbytecode",
      label: ".ushaderbytecode",
      x: BYTECODE.x,
      y: BYTECODE.y,
      width: BYTECODE.width,
      height: BYTECODE.height,
      tone: "default",
    },
    {
      id: "scl-csv",
      label: ".scl.csv",
      x: SCL.x,
      y: SCL.y,
      width: SCL.width,
      height: SCL.height,
      tone: "default",
    },
    {
      id: "phone",
      label: "Phone",
      x: PHONE.x,
      y: PHONE.y,
      width: PHONE.width,
      height: PHONE.height,
      tone: "muted",
    },
    {
      id: "runtime",
      label: "Runtime",
      x: RUNTIME.x,
      y: RUNTIME.y,
      width: RUNTIME.width,
      height: RUNTIME.height,
      tone: "receiver",
      containerId: "phone",
    },
    {
      id: "vertexdata",
      label: "VertexData",
      containerId: "runtime",
      x: VERTEX_DATA.x,
      y: VERTEX_DATA.y,
      width: VERTEX_DATA.width,
      height: VERTEX_DATA.height,
      tone: "default",
    },
    {
      id: "gpu",
      label: "GPU",
      containerId: "runtime",
      x: GPU.x,
      y: GPU.y,
      width: GPU.width,
      height: GPU.height,
      tone: "default",
    },
    {
      id: "pixels",
      label: "Pixels",
      containerId: "runtime",
      x: PIXELS.x,
      y: PIXELS.y,
      width: PIXELS.width,
      height: PIXELS.height,
      tone: "default",
    },
  ],
  edges: [
    {
      id: "material-to-cook-split",
      from: {x: right(MATERIAL) + 10, y: cy(MATERIAL)},
      to: {x: cx(COOK_SPLIT), y: cy(COOK_SPLIT)},
      waypoints: [{x: right(MATERIAL) + 94, y: cy(COOK_SPLIT)}],
      tone: "primary",
      label: "cook",
      labelPoint: {x: right(MATERIAL) + 134, y: cy(MATERIAL) + 72},
    },
    {
      id: "cook-split-to-shaderbytecode",
      from: {x: cx(COOK_SPLIT), y: cy(COOK_SPLIT)},
      to: {x: BYTECODE.x - 10, y: cy(BYTECODE)},
      waypoints: [{x: cx(COOK_SPLIT) + 74, y: cy(COOK_SPLIT) - 74}],
      tone: "primary",
    },
    {
      id: "cook-split-to-scl-csv",
      from: {x: cx(COOK_SPLIT), y: cy(COOK_SPLIT)},
      to: {x: SCL.x - 10, y: cy(SCL)},
      waypoints: [{x: cx(COOK_SPLIT) + 74, y: cy(COOK_SPLIT) + 74}],
      tone: "primary",
    },
    {
      id: "shaderbytecode-to-runtime",
      from: {x: right(BYTECODE), y: cy(BYTECODE)},
      to: {x: RUNTIME.x, y: cy(VERTEX_DATA)},
      tone: "support",
    },
    {
      id: "scl-csv-to-runtime",
      from: {x: right(SCL), y: cy(SCL)},
      to: {x: RUNTIME.x, y: cy(PIXELS)},
      tone: "support",
    },
    {
      id: "vertexdata-to-gpu",
      from: {x: cx(VERTEX_DATA), y: bottom(VERTEX_DATA) + 6},
      to: {x: cx(GPU), y: GPU.y - 6},
      tone: "support",
    },
    {
      id: "gpu-to-pixels",
      from: {x: cx(GPU), y: bottom(GPU) + 6},
      to: {x: cx(PIXELS), y: PIXELS.y - 6},
      tone: "support",
    },
  ],
};
