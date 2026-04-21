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
  durationInFrames: 3468,
  fps: 60,
} as const;

const STEP_FRAME_MAP: Record<StoryStepId, number> = {
  page_00: 18,
  page_01: 108,
  page_02: 198,
  page_03: 288,
  page_04: 378,
  page_04_data: 438,
  page_05: 582,
  page_06: 672,
  page_07: 762,
  page_08: 852,
  page_09: 942,
  page_09_img: 1002,
  page_10: 1254,
  page_11: 1344,
  page_12: 1451,
  page_13: 1558,
  page_14: 1665,
  page_13_img: 1725,
  page_15_img: 1785,
  page_15: 1890,
  page_16: 1997,
  page_17: 2129,
  page_18: 2236,
  page_18_img: 2296,
  page_19: 2404,
  page_21: 2618,
  page_22: 2690,
  page_24: 2761,
  page_25: 2761,
  page_26: 2832,
  page_27: 2832,
  page_28: 2903,
  page_29: 2983,
  page_30: 3054,
  page_31: 3125,
  page_32: 3196,
  page_33: 3276,
};

export function resolveRemotionStepFrame(stepId: StoryStepId): number {
  return STEP_FRAME_MAP[stepId];
}
