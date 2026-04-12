import {buildLoopSketch} from "./page-loop-shared";

export const page11R1Sketch = buildLoopSketch({
  id: "page11-r1",
  label: "First cook split sketch",
  stepId: "page_11",
  contract: {
    pageGoal:
      "Show page11 as the first explicit cook page where the computer emits two separate UE5 artifacts before anything enters the phone side.",
    receiverPlane: "Cook split staging",
    primaryLine: "Computer -> A -> .ushaderbytecode / .scl.csv",
    keepStable:
      "Keep the eventual full-loop silhouette so later pages only add paths instead of redrawing the stage.",
    newChange:
      "Reveal the cook split and both output files while the phone stays visible only as a future receiver.",
    doNot:
      "Do not connect the files into Phone yet, and do not reveal the return or stable paths.",
  },
  visibleNodeIds: ["computer", "phone", "a", "bytecode", "scl"],
  visibleEdgeIds: ["computer-to-a", "a-to-bytecode", "a-to-scl"],
  nodeOverrides: {
    computer: {tone: "receiver"},
    phone: {tone: "muted"},
  },
  edgeOverrides: {
    "computer-to-a": {strokeWidthOverride: 6.4},
    "a-to-bytecode": {strokeWidthOverride: 6},
    "a-to-scl": {strokeWidthOverride: 6},
  },
});
