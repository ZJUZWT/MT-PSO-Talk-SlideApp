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

const COMPUTER = {x: 90, y: 304, width: 166, height: 90};
const REC = {x: 446, y: 90, width: 388, height: 82};
const RUNTIME = {x: 906, y: 180, width: 236, height: 176};

export const page12R1Sketch: GeometrySketchDefinition = {
  id: "page12-r1",
  label: "Runtime return sketch",
  stepId: "page_12",
  contract: {
    pageGoal: "Show page12 as the first return leg where runtime emits a recorded upipelinecache artifact back toward the computer side.",
    receiverPlane: ".rec.upipelinecache return leg",
    primaryLine: "runtime frame -> .rec.upipelinecache -> computer side",
    keepStable: "Keep computer visible on the left and runtime visible on the right while introducing only one return artifact.",
    newChange: "Lift the recorded cache file onto an upper band so the viewer immediately reads it as a return path.",
    doNot: "Do not re-expand cook outputs or add the stable outputs yet.",
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
      id: "return-leg",
      label: ".rec.upipelinecache",
      x: REC.x,
      y: REC.y,
      width: REC.width,
      height: REC.height,
      tone: "receiver",
    },
    {
      id: "runtime",
      label: "Runtime Frame",
      x: RUNTIME.x,
      y: RUNTIME.y,
      width: RUNTIME.width,
      height: RUNTIME.height,
      tone: "default",
    },
  ],
  edges: [
    {
      id: "runtime-to-rec",
      from: {x: cx(RUNTIME), y: RUNTIME.y - 8},
      to: {x: cx(REC), y: bottom(REC) + 8},
      waypoints: [
        {x: cx(RUNTIME), y: cy(REC) + 28},
        {x: cx(REC), y: cy(REC) + 28},
      ],
      tone: "primary",
    },
    {
      id: "rec-to-computer",
      from: {x: REC.x - 8, y: cy(REC)},
      to: {x: right(COMPUTER) + 8, y: cy(COMPUTER)},
      waypoints: [
        {x: COMPUTER.x + 240, y: cy(REC)},
        {x: COMPUTER.x + 240, y: cy(COMPUTER)},
      ],
      tone: "primary",
    },
  ],
};

function bottom(box: {y: number; height: number}) {
  return box.y + box.height;
}
