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
  durationInFrames: 1656,
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
  page_15: 798,
  page_16: 852,
  page_17: 942,
  page_18: 1032,
  page_19: 1086,
  page_20: 1176,
  page_21: 1266,
  page_22: 1356,
  page_23: 1446,
  page_24: 1536,
};

export function resolveRemotionStepFrame(stepId: StoryStepId): number {
  return STEP_FRAME_MAP[stepId];
}
