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
  it("renders page21 with a goal-side PSO intro and explicit black bullets for key points", () => {
    const {container} = render(
      <NotesPanel state={buildState("page_21")} transition={null} />,
    );

    const goalDetail = screen.getByText(
      "这里的 PSO，可以先粗略理解成：进入游戏前会尽量预编译好的那组着色器与管线状态对象。",
    );
    expect(goalDetail).toBeInTheDocument();

    const bullets = container.querySelectorAll("[data-testid='notes-point-bullet']");
    expect(bullets.length).toBe(4);
    expect(bullets[0]).toHaveStyle("background-color: var(--ink)");

    const apiPanelTitle = screen.getByText("涉及 API / 文件");
    expect(goalDetail.compareDocumentPosition(apiPanelTitle)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("renders the page31 harness loop framing in the left notes card", () => {
    render(<NotesPanel state={buildState("page_31")} transition={null} />);

    expect(
      screen.getByText(
        "入口不是手动盯图，而是 hook + workflow_gate.py + review:mechanical 先把任务送进 harness。",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "取数不是公式臆测，而是前台 Microsoft Edge / browser probe 读真实文本与布局数据。",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "计算链路是 geometryReviewArtifact -> geometryMetrics -> geometryScorePolicy，最后回写下一轮修改。",
      ),
    ).toBeInTheDocument();
  });

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
