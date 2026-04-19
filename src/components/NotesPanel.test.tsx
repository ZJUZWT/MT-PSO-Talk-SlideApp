import {cleanup, render, screen} from "@testing-library/react";
import {afterEach, describe, expect, it} from "vitest";
import {masterStoryboard} from "../storyboard-data/pso-storyboard";
import type {StoryStepId} from "../storyboard-data/pso-workbench-types";
import type {WorkbenchState} from "../state/useWorkbenchState";
import {VARIANT_OPTIONS} from "../state/useWorkbenchState";
import {NotesPanel} from "./NotesPanel";

afterEach(() => {
  cleanup();
});

function buildState(stepId: StoryStepId): WorkbenchState {
  const currentStep =
    masterStoryboard.steps.find((step) => step.id === stepId) ?? masterStoryboard.steps[0];

  return {
    variantId: "bus-clean",
    setVariantId: () => {},
    stepId,
    setStepId: () => {},
    goToPreviousStep: () => {},
    goToNextStep: () => {},
    aspectRatio: "16:9",
    sessions: masterStoryboard.sessions ?? [],
    steps: masterStoryboard.steps,
    currentStep,
    supportedStepIds: masterStoryboard.steps.map((step) => step.id),
    variantOptions: VARIANT_OPTIONS,
    activeVariant: VARIANT_OPTIONS[0],
  };
}

describe("NotesPanel", () => {
  it("renders the page16 ShaderStableKey sample table in the notes column", () => {
    render(<NotesPanel state={buildState("page_16")} transition={null} />);

    expect(screen.getByText("ShaderStableKey 样例")).toBeInTheDocument();
    expect(
      screen.getByText("Material /Game/MyActor/MyMaterial.MyMaterial"),
    ).toBeInTheDocument();
    expect(screen.getByText("ShaderType")).toBeInTheDocument();
    expect(
      screen.getByText("TMobileBasePassVSFNoLightMapPolicyHDRLinear64"),
    ).toBeInTheDocument();
    expect(screen.getByText("VFType")).toBeInTheDocument();
    expect(screen.getByText("FLocalVertexFactory")).toBeInTheDocument();
    expect(screen.getByText("OutputHash")).toBeInTheDocument();
    expect(
      screen.getByText("770BF39593DD7BE95F23F2C8AF5D759BD6F8A1D3"),
    ).toBeInTheDocument();
  });

  it("does not render the ShaderStableKey sample table for page15", () => {
    render(<NotesPanel state={buildState("page_15")} transition={null} />);

    expect(screen.queryByText("ShaderStableKey 样例")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Material /Game/MyActor/MyMaterial.MyMaterial"),
    ).not.toBeInTheDocument();
  });
});
