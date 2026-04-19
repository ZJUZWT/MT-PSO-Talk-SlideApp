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
  durationInFrames: 3294,
  fps: 60,
} as const;

const STEP_FRAME_MAP: Record<StoryStepId, number> = {
  page_01: 18,
  page_02: 108,
  page_03: 198,
  page_04: 288,
  page_04_data: 348,
  page_05: 492,
  page_06: 582,
  page_07: 672,
  page_08: 762,
  page_09: 852,
  page_09_img: 912,
  page_10: 1164,
  page_11: 1254,
  page_12: 1361,
  page_13: 1468,
  page_14: 1575,
  page_13_img: 1635,
  page_15_img: 1695,
  page_15: 1800,
  page_16: 1907,
  page_17: 2039,
  page_18: 2146,
  page_18_img: 2206,
  page_19: 2314,
  page_20: 2421,
  page_21: 2492,
  page_22: 2563,
  page_23: 2634,
  page_24: 2705,
  page_25: 2776,
  page_26: 2847,
  page_27: 2918,
  page_28: 3006,
  page_29: 3086,
};

export function resolveRemotionStepFrame(stepId: StoryStepId): number {
  return STEP_FRAME_MAP[stepId];
}
