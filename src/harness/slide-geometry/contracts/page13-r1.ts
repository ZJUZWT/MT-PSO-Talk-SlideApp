import {buildLoopSketch} from "./page-loop-shared";

export const page13R1Sketch = buildLoopSketch({
  id: "page13-r1",
  label: "Runtime return sketch",
  stepId: "page_13",
  contract: {
    pageGoal:
      "Show page13 as the first real return page where the phone sends rec.upipelinecache back toward the computer, completing the return half of the loop.",
    receiverPlane: "Phone return arc",
    primaryLine: "Phone -> rec.upipelinecache -> Computer",
    keepStable:
      "Keep the cook split and bytecode landing visible so the new return path feels like the next layer on the same system.",
    newChange:
      "Lift rec.upipelinecache onto the top band and draw the clockwise return toward the computer.",
    doNot:
      "Do not reveal the expand band or stable outputs yet.",
  },
  visibleNodeIds: ["computer", "phone", "a", "bytecode", "scl", "rec"],
  visibleEdgeIds: [
    "computer-to-a",
    "a-to-bytecode",
    "a-to-scl",
    "bytecode-to-phone",
    "phone-to-rec",
    "rec-to-computer",
  ],
  nodeOverrides: {
    computer: {tone: "muted"},
    phone: {tone: "receiver"},
    rec: {tone: "receiver"},
  },
  edgeOverrides: {
    "phone-to-rec": {strokeWidthOverride: 6.2},
    "rec-to-computer": {strokeWidthOverride: 6.2},
  },
});
