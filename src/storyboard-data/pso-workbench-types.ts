export type VariantId =
  | "bus-clean"
  | "bus-wide"
  | "shared-focus";

export type StoryStepId =
  | "page_01"
  | "page_02"
  | "page_03"
  | "page_04"
  | "page_04_data"
  | "page_05"
  | "page_06"
  | "page_07"
  | "page_08"
  | "page_09"
  | "page_09_img"
  | "page_10"
  | "page_11"
  | "page_12"
  | "page_13"
  | "page_13_img"
  | "page_14"
  | "page_15"
  | "page_15_img"
  | "page_16"
  | "page_17"
  | "page_18"
  | "page_18_img"
  | "page_19"
  | "page_20"
  | "page_21"
  | "page_22"
  | "page_23"
  | "page_24"
  | "page_25"
  | "page_26"
  | "page_27";

export type StorySession = {
  id: string;
  label: string;
  stepIds: StoryStepId[];
};

export type StoryLink = {
  label: string;
  url: string;
};

export type StoryStep = {
  id: StoryStepId;
  label: string;
  caption: string;
  notes: string;
  keyPoints?: string[];
  apiHighlights?: string[];
  relatedLinks?: StoryLink[];
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
  sessions?: StorySession[];
  steps: StoryStep[];
};
