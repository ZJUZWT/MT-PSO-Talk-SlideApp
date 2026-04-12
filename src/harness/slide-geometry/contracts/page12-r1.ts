import {buildLoopSketch} from "./page-loop-shared";

export const page12R1Sketch = buildLoopSketch({
  id: "page12-r1",
  label: "Bytecode landing sketch",
  stepId: "page_12",
  contract: {
    pageGoal:
      "Show page12 as the first runtime landing page where .ushaderbytecode visibly enters Phone while the cook split remains visible in the background.",
    receiverPlane: "Phone runtime landing",
    primaryLine: ".ushaderbytecode -> Phone",
    keepStable:
      "Keep the page11 cook split visible so page12 reads as one added downstream handoff.",
    newChange:
      "Promote the bytecode handoff into Phone and make the phone side the emphasized receiver.",
    doNot:
      "Do not reveal rec.upipelinecache or the stable expand band yet.",
  },
  visibleNodeIds: ["computer", "phone", "a", "bytecode", "scl"],
  visibleEdgeIds: [
    "computer-to-a",
    "a-to-bytecode",
    "a-to-scl",
    "bytecode-to-phone",
  ],
  nodeOverrides: {
    computer: {tone: "muted"},
    phone: {tone: "receiver"},
  },
  edgeOverrides: {
    "bytecode-to-phone": {strokeWidthOverride: 6.4},
  },
});
