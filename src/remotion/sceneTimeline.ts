import type {StoryStepId} from "../storyboard-data/pso-workbench-types";
import {resolveRemotionStepFrame} from "./embed";

export const REMOTION_STEP_SEQUENCE: StoryStepId[] = [
  "page_01",
  "page_02",
  "page_03",
];

export function resolveRemotionSceneWindow(frame: number) {
  const safeFrame = Math.max(0, Math.round(frame));
  const firstStep = REMOTION_STEP_SEQUENCE[0];
  const firstFrame = resolveRemotionStepFrame(firstStep);

  if (safeFrame <= firstFrame || REMOTION_STEP_SEQUENCE.length === 1) {
    return {
      fromStepId: firstStep,
      toStepId: firstStep,
      fromFrame: safeFrame,
      toFrame: firstFrame,
      progress: 1,
    };
  }

  for (let index = 0; index < REMOTION_STEP_SEQUENCE.length - 1; index += 1) {
    const fromStepId = REMOTION_STEP_SEQUENCE[index]!;
    const toStepId = REMOTION_STEP_SEQUENCE[index + 1]!;
    const fromFrame = resolveRemotionStepFrame(fromStepId);
    const toFrame = resolveRemotionStepFrame(toStepId);

    if (safeFrame <= toFrame) {
      return {
        fromStepId,
        toStepId,
        fromFrame,
        toFrame,
        progress: (safeFrame - fromFrame) / Math.max(1, toFrame - fromFrame),
      };
    }
  }

  const lastStep = REMOTION_STEP_SEQUENCE[REMOTION_STEP_SEQUENCE.length - 1]!;
  const lastFrame = resolveRemotionStepFrame(lastStep);

  return {
    fromStepId: lastStep,
    toStepId: lastStep,
    fromFrame: lastFrame,
    toFrame: lastFrame,
    progress: 1,
  };
}
