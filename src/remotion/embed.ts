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
  durationInFrames: 2124,
  fps: 60,
} as const;

const STEP_FRAME_MAP: Record<StoryStepId, number> = {
  page_01: 18,
  page_02: 54,
  page_03: 90,
  page_04: 126,
  page_04_data: 144,
  page_05: 198,
  page_06: 270,
  page_07: 306,
  page_08: 342,
  page_09: 378,
  page_10: 510,
  page_11: 582,
  page_12: 636,
  page_13: 690,
  page_14: 744,
  page_13_img: 798,
  page_15_img: 852,
  page_15: 906,
  page_16: 996,
  page_17: 1086,
  page_18: 1176,
  page_18_img: 1230,
  page_19: 1284,
  page_20: 1374,
  page_21: 1464,
  page_22: 1554,
  page_23: 1644,
  page_24: 1734,
  page_25: 1824,
  page_26: 1914,
  page_27: 2004,
};

export function resolveRemotionStepFrame(stepId: StoryStepId): number {
  return STEP_FRAME_MAP[stepId];
}
