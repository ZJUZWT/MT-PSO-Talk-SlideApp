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

function hasExactText(node: Element | null, text: string) {
  if (!node || node.textContent !== text) {
    return false;
  }

  return Array.from(node.children).every((child) => child.textContent !== text);
}

function getByTextContent(text: string) {
  return screen.getByText((_, node) => hasExactText(node, text));
}

describe("NotesPanel", () => {
  it("renders page00 with the first objective fact about one-time shader precompile", () => {
    const {container} = render(
      <NotesPanel state={buildState("page_00")} transition={null} />,
    );

    expect(screen.getByText("客观事实")).toBeInTheDocument();
    const objectiveFactCopies = container.querySelectorAll(".notes-point-copy--objective-facts");
    expect(objectiveFactCopies[0]?.textContent).toBe("启动游戏预编译着色器，通常只要一次。");
    expect(
      screen.getByText("预编译着色器", {
        selector: ".notes-inline-emphasis--precompile",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("一次", {selector: ".notes-inline-emphasis--once"}),
    ).toBeInTheDocument();
    expect(
      getComputedStyle(
        screen.getByText("预编译着色器", {
          selector: ".notes-inline-emphasis--precompile",
        }),
      ).color,
    ).toBe(
      getComputedStyle(
        screen.getByText("一次", {selector: ".notes-inline-emphasis--once"}),
      ).color,
    );
  });

  it("renders page02 with the new PSO complexity fact and emphasizes exponential complexity", () => {
    const {container} = render(
      <NotesPanel state={buildState("page_02")} transition={null} />,
    );

    const objectiveFactCopies = container.querySelectorAll(".notes-point-copy--objective-facts");
    expect(objectiveFactCopies[0]?.textContent).toBe("启动游戏预编译着色器，通常只要一次。");
    expect(objectiveFactCopies[1]?.textContent).toBe("PSO的复杂度是指数级别。");
    expect(
      screen.getByText("指数级别", {
        selector: ".notes-inline-emphasis--exponential",
      }),
    ).toBeInTheDocument();
  });

  it("renders page03 with objective facts instead of caption, key points, and goal copy", () => {
    const {container} = render(
      <NotesPanel state={buildState("page_03")} transition={null} />,
    );

    expect(screen.getByText("当前 Session")).toBeInTheDocument();
    expect(screen.getByText("本节第 4 / 6 页")).toBeInTheDocument();
    expect(screen.getByText("客观事实")).toBeInTheDocument();
    const objectiveFactCopies = container.querySelectorAll(".notes-point-copy--objective-facts");
    expect(objectiveFactCopies[0]?.textContent).toBe("启动游戏预编译着色器，通常只要一次。");
    expect(objectiveFactCopies[1]?.textContent).toBe("PSO的复杂度是指数级别。");
    expect(objectiveFactCopies[2]?.textContent).toBe("OpenGL无PSO，有Program");
    expect(
      screen.getByText("PSO", {selector: ".notes-inline-emphasis--pso"}),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Program", {selector: ".notes-inline-emphasis--program"}),
    ).toBeInTheDocument();
    expect(
      getComputedStyle(
        screen.getByText("PSO", {selector: ".notes-inline-emphasis--pso"}),
      ).color,
    ).toBe(
      getComputedStyle(
        screen.getByText("Program", {selector: ".notes-inline-emphasis--program"}),
      ).color,
    );

    expect(screen.queryByText("本页重点")).not.toBeInTheDocument();
    expect(screen.queryByText("讲解目标")).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "把 Raw ShaderCode 先 compile 成 Binary ShaderCode，再经过 link 得到 Program；这一页只讲结构和调用链。",
      ),
    ).not.toBeInTheDocument();

    const objectiveFactsSection = container.querySelector(".notes-section--objective-facts");
    expect(objectiveFactsSection).not.toBeNull();
    expect(
      objectiveFactsSection?.querySelector(".notes-section-label--objective-facts"),
    ).not.toBeNull();
    expect(
      objectiveFactsSection?.querySelector(".notes-point-item--objective-facts"),
    ).not.toBeNull();
    expect(
      objectiveFactCopies[2]?.className,
    ).toContain("notes-point-copy--objective-facts");
  });

  it("renders page04 with cumulative objective facts from page03 and page04", () => {
    render(<NotesPanel state={buildState("page_04")} transition={null} />);

    expect(getByTextContent("PSO的复杂度是指数级别。")).toBeInTheDocument();
    expect(getByTextContent("OpenGL无PSO，有Program")).toBeInTheDocument();
    expect(
      screen.getByText("Vulkan / Metal 有 PSO 的概念。"),
    ).toBeInTheDocument();
  });

  it("renders page04_data with the new compile/link cost fact in cumulative objective facts", () => {
    render(<NotesPanel state={buildState("page_04_data")} transition={null} />);

    expect(getByTextContent("PSO的复杂度是指数级别。")).toBeInTheDocument();
    expect(getByTextContent("OpenGL无PSO，有Program")).toBeInTheDocument();
    expect(
      screen.getByText("Vulkan / Metal 有 PSO 的概念。"),
    ).toBeInTheDocument();
    expect(
      getByTextContent("Compile、Link耗时极高，单帧不可接受"),
    ).toBeInTheDocument();
  });

  it("marks only the newly added objective fact as fresh during the page01 to page02 transition", () => {
    const {container} = render(
      <NotesPanel
        state={buildState("page_02")}
        transition={{direction: "forward", outgoingStepId: "page_01"}}
      />,
    );

    const currentLayer = container.querySelector(
      '.notes-card-layer--current[data-step-id="page_02"]',
    );
    const objectiveFactItems = Array.from(
      currentLayer?.querySelectorAll(".notes-point-item--objective-facts") ?? [],
    );
    expect(objectiveFactItems).toHaveLength(2);
    expect(objectiveFactItems[0]?.textContent).toBe("启动游戏预编译着色器，通常只要一次。");
    expect(objectiveFactItems[0]?.getAttribute("data-fact-state")).toBe("stable");
    expect(objectiveFactItems[1]?.textContent).toBe("PSO的复杂度是指数级别。");
    expect(objectiveFactItems[1]?.getAttribute("data-fact-state")).toBe("new");
  });

  it("keeps cumulative objective facts on later pages and removes the old key-point summary", () => {
    render(<NotesPanel state={buildState("page_31")} transition={null} />);

    expect(getByTextContent("PSO的复杂度是指数级别。")).toBeInTheDocument();
    expect(getByTextContent("OpenGL无PSO，有Program")).toBeInTheDocument();
    expect(
      screen.getByText("Vulkan / Metal 有 PSO 的概念。"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        "计算链路是 geometryReviewArtifact -> geometryMetrics -> geometryScorePolicy，最后回写下一轮修改。",
      ),
    ).not.toBeInTheDocument();
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
