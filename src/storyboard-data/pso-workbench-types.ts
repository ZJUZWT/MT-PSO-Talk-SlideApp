export type VariantId =
  | "bus-clean"
  | "bus-wide"
  | "shared-focus";

export type StoryStepId =
  | "page_01"
  | "page_02"
  | "page_03"
  | "page_04"
  | "page_05"
  | "page_06"
  | "page_07"
  | "page_08"
  | "page_09"
  | "page_10"
  | "page_11"
  | "page_12"
  | "page_13"
  | "page_14"
  | "page_15"
  | "page_16"
  | "page_17"
  | "page_18";

export type StoryStep = {
  id: StoryStepId;
  label: string;
  caption: string;
  notes: string;
  focusTarget: string;
  timingHint: string;
  intro?: string;
  manuscript?: string;
  codeSample?: string;
  codeLegend?: Array<{label: string; color: string}>;
  apiListTitle?: string;
  apiList?: Array<{id: number; label: string}>;
  focusColorKey?: string;
};

export type Storyboard = {
  storyId: string;
  title: string;
  summary: string;
  steps: StoryStep[];
};
