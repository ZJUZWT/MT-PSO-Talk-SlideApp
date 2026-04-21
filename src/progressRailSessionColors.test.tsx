import {cleanup, render} from "@testing-library/react";
import {afterEach, describe, expect, it} from "vitest";
import {ProgressBubbles} from "./components/ProgressBubbles";
import {masterStoryboard} from "./storyboard-data/pso-storyboard";
import type {StoryStepId} from "./storyboard-data/pso-workbench-types";
import type {WorkbenchState} from "./state/useWorkbenchState";
import {VARIANT_OPTIONS} from "./state/useWorkbenchState";

afterEach(() => {
  cleanup();
});

function buildState(
  stepId: StoryStepId,
  overrides: Partial<WorkbenchState> = {},
): WorkbenchState {
  const steps = masterStoryboard.steps.filter(
    (step) => step.hiddenInNavigation !== true,
  );
  const visibleStepIds = new Set(steps.map((step) => step.id));
  const sessions = (masterStoryboard.sessions ?? [])
    .map((session) => ({
      ...session,
      stepIds: session.stepIds.filter((entry) => visibleStepIds.has(entry)),
    }))
    .filter((session) => session.stepIds.length > 0);
  const currentStep =
    steps.find((step) => step.id === stepId) ?? steps[0];

  return {
    variantId: "bus-clean",
    setVariantId: () => {},
    stepId,
    setStepId: () => {},
    goToPreviousStep: () => {},
    goToNextStep: () => {},
    aspectRatio: "16:9",
    sessions,
    steps,
    currentStep,
    supportedStepIds: steps.map((step) => step.id),
    variantOptions: VARIANT_OPTIONS,
    activeVariant: VARIANT_OPTIONS[0],
    ...overrides,
  };
}

function readSessionToken(stepId: string) {
  const shell = document.querySelector<HTMLElement>(
    `.progress-step-shell[data-step-id="${stepId}"]`,
  );
  const bubble = shell?.querySelector<HTMLElement>(".progress-bubble");

  expect(shell, `Missing progress shell for ${stepId}`).not.toBeNull();
  expect(bubble, `Missing progress bubble for ${stepId}`).not.toBeNull();

  return {
    shell,
    bubble,
    shellToken: shell?.getAttribute("data-session-color"),
    bubbleToken: bubble?.getAttribute("data-session-color"),
  };
}

describe("progress rail session colors", () => {
  it("maps steps into their parent session color groups", () => {
    render(
      <ProgressBubbles state={buildState("page_16")} onStepJump={() => {}} transition={null} />,
    );

    expect(readSessionToken("page_01").shellToken).toBe("session-1");
    expect(readSessionToken("page_05").shellToken).toBe("session-2");
    expect(readSessionToken("page_11").shellToken).toBe("session-3");
    expect(readSessionToken("page_16").shellToken).toBe("session-4");
    expect(readSessionToken("page_22").shellToken).toBe("session-5");
    expect(readSessionToken("page_24").shellToken).toBe("session-6");
    expect(readSessionToken("page_16").bubbleToken).toBe("session-4");
  });

  it("falls back to a neutral token when sessions are unavailable", () => {
    render(
      <ProgressBubbles
        state={buildState("page_16", {
          sessions: [],
        })}
        onStepJump={() => {}}
        transition={null}
      />,
    );

    const token = readSessionToken("page_16");

    expect(token.shellToken).toBe("session-neutral");
    expect(token.bubbleToken).toBe("session-neutral");
  });
});
