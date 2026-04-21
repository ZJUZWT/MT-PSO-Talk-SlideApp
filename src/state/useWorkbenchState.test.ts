import {act, renderHook} from "@testing-library/react";
import {describe, expect, it} from "vitest";
import {
  DEFAULT_STEP_ID,
  useWorkbenchState,
} from "./useWorkbenchState";

describe("useWorkbenchState", () => {
  it("keeps page_21 and page_30 visible while filtering only the still-retired late-tail placeholders", () => {
    const {result} = renderHook(() => useWorkbenchState());

    expect(result.current.supportedStepIds).toContain("page_21");
    expect(result.current.supportedStepIds).not.toContain("page_25");
    expect(result.current.supportedStepIds).not.toContain("page_27");
    expect(result.current.supportedStepIds).toContain("page_30");
    expect(result.current.supportedStepIds).toContain("page_22");
    expect(result.current.supportedStepIds).toContain("page_26");
    expect(
      result.current.sessions.find((session) => session.id === "s5-awareness-bridge")?.stepIds,
    ).toEqual(["page_21", "page_22"]);
    expect(
      result.current.sessions.find((session) => session.id === "s6-optimization-notes")?.stepIds,
    ).toEqual([
      "page_24",
      "page_26",
      "page_28",
      "page_29",
      "page_30",
      "page_31",
      "page_32",
      "page_33",
    ]);
  });

  it("falls back to the default step when initialized with a hidden page", () => {
    const {result} = renderHook(() =>
      useWorkbenchState({
        stepId: "page_25",
      }),
    );

    expect(result.current.stepId).toBe(DEFAULT_STEP_ID);
    expect(result.current.currentStep.id).toBe(DEFAULT_STEP_ID);
  });

  it("navigates across the late tail by entering page_21 and skipping the still-hidden placeholders", () => {
    const {result} = renderHook(() =>
      useWorkbenchState({
        stepId: "page_19",
      }),
    );

    act(() => {
      result.current.goToNextStep();
    });
    expect(result.current.stepId).toBe("page_21");

    act(() => {
      result.current.goToNextStep();
    });
    expect(result.current.stepId).toBe("page_22");

    act(() => {
      result.current.setStepId("page_29");
    });
    act(() => {
      result.current.goToNextStep();
    });
    expect(result.current.stepId).toBe("page_30");

    act(() => {
      result.current.goToNextStep();
    });
    expect(result.current.stepId).toBe("page_31");

    act(() => {
      result.current.goToPreviousStep();
    });
    expect(result.current.stepId).toBe("page_30");
  });
});
