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
  durationInFrames: 3680,
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
  page_21: 2389,
  page_22: 2460,
  page_24: 2531,
  page_25: 2602,
  page_26: 2673,
  page_27: 2744,
  page_28: 2822,
  page_29: 2902,
  page_30: 2973,
  page_31: 3044,
  page_32: 3115,
  page_33: 3195,
};

export function resolveRemotionStepFrame(stepId: StoryStepId): number {
  return STEP_FRAME_MAP[stepId];
}
