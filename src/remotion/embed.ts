import type {
  StoryStepId,
  VariantId,
} from "../storyboard-data/pso-workbench-types";

export type RemotionWorkbenchProps = {
  variantId?: VariantId;
};

export const REMOTION_PLAYER_CONFIG = {
  compositionWidth: 1280,
  compositionHeight: 720,
  durationInFrames: 594,
  fps: 60,
} as const;

const STEP_FRAME_MAP: Record<StoryStepId, number> = {
  page_01: 18,
  page_02: 54,
  page_03: 90,
  page_04: 126,
  page_05: 162,
  page_06: 234,
  page_07: 270,
  page_08: 306,
  page_09: 342,
  page_10: 414,
  page_11: 450,
  page_12: 486,
  page_13: 522,
  page_14: 558,
};

export function resolveRemotionStepFrame(stepId: StoryStepId): number {
  return STEP_FRAME_MAP[stepId];
}
