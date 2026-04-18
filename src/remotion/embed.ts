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
  durationInFrames: 2740,
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
  page_10: 984,
  page_11: 1074,
  page_12: 1181,
  page_13: 1288,
  page_14: 1395,
  page_13_img: 1455,
  page_15_img: 1515,
  page_15: 1575,
  page_16: 1682,
  page_17: 1789,
  page_18: 1896,
  page_18_img: 1956,
  page_19: 2016,
  page_20: 2123,
  page_21: 2194,
  page_22: 2265,
  page_23: 2336,
  page_24: 2407,
  page_25: 2478,
  page_26: 2549,
  page_27: 2620,
};

export function resolveRemotionStepFrame(stepId: StoryStepId): number {
  return STEP_FRAME_MAP[stepId];
}
