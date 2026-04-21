import {useMemo, useState} from "react";
import {masterStoryboard} from "../storyboard-data/pso-storyboard";
import type {
  StorySession,
  StoryStep,
  StoryStepId,
  VariantId,
} from "../storyboard-data/pso-workbench-types";

type VariantOption = {
  id: VariantId;
  label: string;
};

export const DEFAULT_VARIANT_ID: VariantId = "bus-clean";
export const DEFAULT_STEP_ID: StoryStepId = "page_00";

export const VARIANT_OPTIONS: VariantOption[] = [
  {id: "bus-clean", label: "Bus Clean"},
  {id: "bus-wide", label: "Bus Wide"},
  {id: "shared-focus", label: "Shared Focus"},
];

export function isVariantId(value: string | null | undefined): value is VariantId {
  return VARIANT_OPTIONS.some((option) => option.id === value);
}

function isVisibleStoryboardStep(step: StoryStep) {
  return step.hiddenInNavigation !== true;
}

export function isStoryStepId(
  value: string | null | undefined,
): value is StoryStepId {
  return masterStoryboard.steps.some((step) => step.id === value);
}

export function isVisibleStoryStepId(
  value: string | null | undefined,
): value is StoryStepId {
  return masterStoryboard.steps.some(
    (step) => step.id === value && isVisibleStoryboardStep(step),
  );
}

export type WorkbenchState = {
  variantId: VariantId;
  setVariantId: (variantId: VariantId) => void;
  stepId: StoryStepId;
  setStepId: (stepId: StoryStepId) => void;
  goToPreviousStep: () => void;
  goToNextStep: () => void;
  aspectRatio: "16:9";
  sessions: StorySession[];
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
  const visibleSteps = useMemo(
    () => masterStoryboard.steps.filter(isVisibleStoryboardStep),
    [],
  );
  const visibleStepIds = useMemo(
    () => visibleSteps.map((step) => step.id),
    [visibleSteps],
  );
  const visibleSessions = useMemo(
    () =>
      (masterStoryboard.sessions ?? [])
        .map((session) => ({
          ...session,
          stepIds: session.stepIds.filter((stepId) => visibleStepIds.includes(stepId)),
        }))
        .filter((session) => session.stepIds.length > 0),
    [visibleStepIds],
  );
  const [selection, setSelection] = useState<{
    variantId: VariantId;
    stepId: StoryStepId;
  }>({
    variantId: initialSelection.variantId ?? DEFAULT_VARIANT_ID,
    stepId:
      initialSelection.stepId && visibleStepIds.includes(initialSelection.stepId)
        ? initialSelection.stepId
        : DEFAULT_STEP_ID,
  });
  const supportedStepIds = visibleStepIds;
  const sessions = visibleSessions;

  const currentStep = useMemo(
    () =>
      visibleSteps.find((step) => step.id === selection.stepId) ??
      visibleSteps[0],
    [selection.stepId, visibleSteps],
  );
  const activeVariant = useMemo(
    () =>
      VARIANT_OPTIONS.find((option) => option.id === selection.variantId) ??
      VARIANT_OPTIONS[0],
    [selection.variantId],
  );

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
      const currentIndex = visibleSteps.findIndex(
        (step) => step.id === current.stepId,
      );
      const safeCurrentIndex = currentIndex === -1 ? 0 : currentIndex;
      const nextIndex = Math.max(
        0,
        Math.min(visibleSteps.length - 1, safeCurrentIndex + offset),
      );

      return {
        variantId: current.variantId,
        stepId: visibleSteps[nextIndex]?.id ?? current.stepId,
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
    sessions,
    steps: visibleSteps,
    currentStep,
    supportedStepIds,
    variantOptions: VARIANT_OPTIONS,
    activeVariant,
  };
}
