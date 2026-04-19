import {resolveRemotionStepFrame} from "../src/remotion/embed";
import {computeSceneModel} from "../src/remotion/model/computeSceneModel";

const stepId = (process.argv[2] ?? "page_08") as Parameters<
  typeof resolveRemotionStepFrame
>[0];
const frame = resolveRemotionStepFrame(stepId);
const scene = computeSceneModel(frame);

const snapshot = {
  stepId,
  frame,
  cameraViewportCenterX: scene.cameraViewportCenterX,
  cameraViewportCenterY: scene.cameraViewportCenterY,
  zoomScale: scene.zoomScale,
  zoomFocusX: scene.zoomFocusX,
  zoomFocusY: scene.zoomFocusY,
  page6StageCenterX: scene.page6StageCenterX,
  page6StageCenterY: scene.page6StageCenterY,
  page6StageScale: scene.page6StageScale,
  settledPage910Progress: scene.settledPage910Progress,
  page8ActiveUassetFrame: scene.page8ActiveUassetFrame,
  page6MaterialBox: scene.page6MaterialBox,
  page6ResourceBox: scene.page6ResourceBox,
  page6ShaderMapBox: scene.page6ShaderMapBox,
  page6FShaderBox: scene.page6FShaderBox,
  page6InlineResourceBox: scene.page6InlineResourceBox,
  page6ResourceCodeBox: scene.page6ResourceCodeBox,
  page6CookedBox: scene.page6CookedBox,
  page8ProofMaterialGlobalBox: scene.page8ProofMaterialGlobalBox,
  page8ProofCookedCueGlobalBox: scene.page8ProofCookedCueGlobalBox,
  page8PsoBox: scene.page8PsoBox,
  page8PsoDividerX: scene.page8PsoDividerX,
  page8PsoFieldSpecs: scene.page8PsoFieldSpecs,
  page8VsHashFieldX: scene.page8VsHashFieldX,
  page8PsHashFieldX: scene.page8PsHashFieldX,
  page8VsHashGlobalX: scene.page8VsHashGlobalX,
  page8PsHashGlobalX: scene.page8PsHashGlobalX,
  page8HashRefStartY: scene.page8HashRefStartY,
  page8HashRefEndY: scene.page8HashRefEndY,
  page8VsHashRefBendY: scene.page8VsHashRefBendY,
  page8PsHashRefBendY: scene.page8PsHashRefBendY,
  page8CookedArrowTargetGlobal: scene.page8CookedArrowTargetGlobal,
  page9VsHashLibraryTargetGlobal: scene.page9VsHashLibraryTargetGlobal,
  page9PsHashLibraryTargetGlobal: scene.page9PsHashLibraryTargetGlobal,
  page6InlineResourceBaseBox: scene.page6InlineResourceBaseBox,
  page6FShaderIndexPillWidth: scene.page6FShaderIndexPillWidth,
};

console.log(JSON.stringify(snapshot, null, 2));
