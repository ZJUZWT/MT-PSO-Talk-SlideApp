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

const COMPUTER = {x: 88, y: 216, width: 186, height: 104};
const EXPAND = {x: 382, y: 232, width: 180, height: 84};
const STABLES = {x: 652, y: 146, width: 474, height: 300};
const STABLE_PC = {x: 708, y: 234, width: 362, height: 70};
const STABLE_PIPE = {x: 708, y: 334, width: 362, height: 70};

export const page13R1Sketch: GeometrySketchDefinition = {
  id: "page13-r1",
  label: "Stable outputs sketch",
  stepId: "page_13",
  contract: {
    pageGoal: "Show page13 as the computer-side expansion page that turns the recorded cache into stable products.",
    receiverPlane: "Stable Outputs",
    primaryLine: "computer side -> expand -> stablepc.csv + stable.upipelinecache",
    keepStable: "Keep the loop anchored on the computer side and make the expand route feel like a new stage, not a replay of cook.",
    newChange: "Use a stable output receiver container with two clearly separated product files.",
    doNot: "Do not let the runtime side dominate this page or collapse the two stable files into one generic node.",
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
      id: "expand",
      label: "expand",
      x: EXPAND.x,
      y: EXPAND.y,
      width: EXPAND.width,
      height: EXPAND.height,
      tone: "default",
    },
    {
      id: "stable-outputs",
      label: "Stable Outputs",
      x: STABLES.x,
      y: STABLES.y,
      width: STABLES.width,
      height: STABLES.height,
      tone: "receiver",
    },
    {
      id: "stable-pc",
      label: "stablepc.csv",
      containerId: "stable-outputs",
      x: STABLE_PC.x,
      y: STABLE_PC.y,
      width: STABLE_PC.width,
      height: STABLE_PC.height,
      tone: "default",
    },
    {
      id: "stable-pipeline",
      label: "stable.upipelinecache",
      containerId: "stable-outputs",
      x: STABLE_PIPE.x,
      y: STABLE_PIPE.y,
      width: STABLE_PIPE.width,
      height: STABLE_PIPE.height,
      tone: "default",
    },
  ],
  edges: [
    {
      id: "computer-to-expand",
      from: {x: right(COMPUTER) + 8, y: cy(COMPUTER)},
      to: {x: EXPAND.x - 8, y: cy(EXPAND)},
      tone: "support",
    },
    {
      id: "expand-to-stablepc",
      from: {x: right(EXPAND) + 8, y: cy(EXPAND) - 12},
      to: {x: STABLE_PC.x - 8, y: cy(STABLE_PC)},
      waypoints: [
        {x: STABLE_PC.x - 36, y: cy(EXPAND) - 12},
        {x: STABLE_PC.x - 36, y: cy(STABLE_PC)},
      ],
      tone: "primary",
    },
    {
      id: "expand-to-stablepipeline",
      from: {x: right(EXPAND) + 8, y: cy(EXPAND) + 12},
      to: {x: STABLE_PIPE.x - 8, y: cy(STABLE_PIPE)},
      waypoints: [
        {x: STABLE_PIPE.x - 56, y: cy(EXPAND) + 12},
        {x: STABLE_PIPE.x - 56, y: cy(STABLE_PIPE)},
      ],
      tone: "primary",
    },
  ],
};
