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
  durationInFrames: 954,
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
  page_10: 474,
  page_11: 546,
  page_12: 600,
  page_13: 654,
  page_14: 708,
  page_15: 762,
  page_16: 816,
  page_17: 870,
  page_18: 924,
};

export function resolveRemotionStepFrame(stepId: StoryStepId): number {
  return STEP_FRAME_MAP[stepId];
}
