import {buildLoopSketch} from "./page-loop-shared";

export const page14R1Sketch = buildLoopSketch({
  id: "page14-r1",
  label: "Expand into stable outputs sketch",
  stepId: "page_14",
  contract: {
    pageGoal:
      "Show page14 as the computer-side expand page where rec.upipelinecache has returned, expand becomes visible, and the stable outputs form without entering the phone yet.",
    receiverPlane: "Computer expand and stable merge",
    primaryLine:
      "Computer -> stablepc.csv + .scl.csv -> B -> stable.upipelinecache",
    keepStable:
      "Keep the already-built cook, landing, and return routes visible so expand reads as the next build-side layer.",
    newChange:
      "Reveal the expand branch, the stablepc.csv artifact, the merge junction B, and stable.upipelinecache.",
    doNot:
      "Do not connect stable.upipelinecache back into Phone yet.",
  },
  visibleNodeIds: [
    "computer",
    "phone",
    "a",
    "bytecode",
    "scl",
    "rec",
    "stable-pc",
    "b",
    "stable-upipe",
  ],
  visibleEdgeIds: [
    "computer-to-a",
    "a-to-bytecode",
    "a-to-scl",
    "bytecode-to-phone",
    "phone-to-rec",
    "rec-to-computer",
    "computer-to-stablepc",
    "stablepc-to-b",
    "scl-to-b",
    "b-to-stableupipe",
  ],
  nodeOverrides: {
    computer: {tone: "receiver"},
    phone: {tone: "muted"},
    "stable-pc": {tone: "receiver"},
    "stable-upipe": {tone: "receiver"},
  },
  edgeOverrides: {
    "computer-to-stablepc": {strokeWidthOverride: 6.2},
    "stablepc-to-b": {strokeWidthOverride: 6},
    "scl-to-b": {strokeWidthOverride: 6},
    "b-to-stableupipe": {strokeWidthOverride: 6},
  },
});
