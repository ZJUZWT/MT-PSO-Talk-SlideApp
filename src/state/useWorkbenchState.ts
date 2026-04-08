import {useState} from "react";
import {masterStoryboard} from "../storyboard-data/pso-storyboard";
import type {
  StoryStep,
  StoryStepId,
  VariantId,
} from "../storyboard-data/pso-workbench-types";

type VariantOption = {
  id: VariantId;
  label: string;
};

export const DEFAULT_VARIANT_ID: VariantId = "bus-clean";
export const DEFAULT_STEP_ID: StoryStepId = "page_01";

export const VARIANT_OPTIONS: VariantOption[] = [
  {id: "bus-clean", label: "Bus Clean"},
  {id: "bus-wide", label: "Bus Wide"},
  {id: "shared-focus", label: "Shared Focus"},
];

export function isVariantId(value: string | null | undefined): value is VariantId {
  return VARIANT_OPTIONS.some((option) => option.id === value);
}

export function isStoryStepId(
  value: string | null | undefined,
): value is StoryStepId {
  return masterStoryboard.steps.some((step) => step.id === value);
}

export type WorkbenchState = {
  variantId: VariantId;
  setVariantId: (variantId: VariantId) => void;
  stepId: StoryStepId;
  setStepId: (stepId: StoryStepId) => void;
  goToPreviousStep: () => void;
  goToNextStep: () => void;
  aspectRatio: "16:9";
  steps: StoryStep[];
  currentStep: StoryStep;
  supportedStepIds: StoryStepId[];
  variantOptions: VariantOption[];
  activeVariant: VariantOption;
};

type InitialWorkbenchSelection = {
  variantId?: VariantId;
  stepId?: StoryStepId;
};

export function useWorkbenchState(
  initialSelection: InitialWorkbenchSelection = {},
): WorkbenchState {
  const [selection, setSelection] = useState<{
    variantId: VariantId;
    stepId: StoryStepId;
  }>({
    variantId: initialSelection.variantId ?? DEFAULT_VARIANT_ID,
    stepId: initialSelection.stepId ?? DEFAULT_STEP_ID,
  });
  const supportedStepIds = masterStoryboard.steps.map((step) => step.id);

  const currentStep =
    masterStoryboard.steps.find((step) => step.id === selection.stepId) ??
    masterStoryboard.steps[0];
  const activeVariant =
    VARIANT_OPTIONS.find((option) => option.id === selection.variantId) ??
    VARIANT_OPTIONS[0];

  const setVariantId = (variantId: VariantId) => {
    setSelection((current) => ({
      ...current,
      variantId,
    }));
  };

  const setStepId = (stepId: StoryStepId) => {
    setSelection((current) => ({
      ...current,
      stepId,
    }));
  };

  const goToRelativeStep = (offset: -1 | 1) => {
    setSelection((current) => {
      const currentIndex = masterStoryboard.steps.findIndex(
        (step) => step.id === current.stepId,
      );
      const safeCurrentIndex = currentIndex === -1 ? 0 : currentIndex;
      const nextIndex = Math.max(
        0,
        Math.min(masterStoryboard.steps.length - 1, safeCurrentIndex + offset),
      );

      return {
        variantId: current.variantId,
        stepId: masterStoryboard.steps[nextIndex]?.id ?? current.stepId,
      };
    });
  };

  return {
    variantId: selection.variantId,
    setVariantId,
    stepId: selection.stepId,
    setStepId,
    goToPreviousStep: () => {
      goToRelativeStep(-1);
    },
    goToNextStep: () => {
      goToRelativeStep(1);
    },
    aspectRatio: "16:9",
    steps: masterStoryboard.steps,
    currentStep,
    supportedStepIds,
    variantOptions: VARIANT_OPTIONS,
    activeVariant,
  };
}
