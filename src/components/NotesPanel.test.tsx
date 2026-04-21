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
  it("renders page00 with the first objective fact about shader compilation as startup path", () => {
    const {container} = render(
      <NotesPanel state={buildState("page_00")} transition={null} />,
    );

    expect(screen.getByText("客观事实")).toBeInTheDocument();
    const objectiveFactCopies = container.querySelectorAll(".notes-point-copy--objective-facts");
    expect(objectiveFactCopies[0]?.textContent).toBe("启动游戏必经之路——着色器编译");
    expect(
      screen.getByText("着色器编译", {
        selector: ".notes-inline-emphasis--precompile",
      }),
    ).toBeInTheDocument();
  });

  it("renders page02 with the new PSO state-space fact and emphasizes exponential growth", () => {
    const {container} = render(
      <NotesPanel state={buildState("page_02")} transition={null} />,
    );

    const objectiveFactItems = container.querySelectorAll(".notes-point-item--objective-facts");
    const objectiveFactCopies = container.querySelectorAll(".notes-point-copy--objective-facts");
    expect(objectiveFactCopies[0]?.textContent).toBe("启动游戏必经之路——着色器编译");
    expect(objectiveFactCopies[1]?.textContent).toBe("PSO 的状态组合空间呈指数级增长");
    expect(objectiveFactItems[0]?.getAttribute("data-fact-state")).toBe("stable");
    expect(objectiveFactItems[1]?.getAttribute("data-fact-state")).toBe("new");
    expect(
      screen.getByText("指数级增长", {
        selector: ".notes-inline-emphasis--exponential",
      }),
    ).toBeInTheDocument();
  });

  it("renders page03 with objective facts instead of caption, key points, and goal copy", () => {
    const {container} = render(
      <NotesPanel state={buildState("page_03")} transition={null} />,
    );

    expect(screen.getByText("当前 Session")).toBeInTheDocument();
    expect(screen.getByText("第 4 / 6 页")).toBeInTheDocument();
    expect(screen.queryByText("本节第 4 / 6 页")).not.toBeInTheDocument();
    expect(container.querySelector(".notes-focus-pill")).toBeNull();
    expect(screen.getByText("客观事实")).toBeInTheDocument();
    const objectiveFactCopies = container.querySelectorAll(".notes-point-copy--objective-facts");
    expect(objectiveFactCopies[0]?.textContent).toBe("启动游戏必经之路——着色器编译");
    expect(objectiveFactCopies[1]?.textContent).toBe("PSO 的状态组合空间呈指数级增长");
    expect(objectiveFactCopies[2]?.textContent).toBe("OpenGL 无 PSO，只有 Program");
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

    expect(getByTextContent("PSO 的状态组合空间呈指数级增长")).toBeInTheDocument();
    expect(getByTextContent("OpenGL 无 PSO，只有 Program")).toBeInTheDocument();
    const psoOptimizationFact = getByTextContent("Vulkan / Metal 有 PSO可以深度优化");
    expect(psoOptimizationFact).toBeInTheDocument();
    expect(psoOptimizationFact.querySelector(".notes-inline-emphasis--pso")).not.toBeNull();
  });

  it("renders page04_data with the new compile/link cost fact in cumulative objective facts", () => {
    render(<NotesPanel state={buildState("page_04_data")} transition={null} />);

    expect(getByTextContent("PSO 的状态组合空间呈指数级增长")).toBeInTheDocument();
    expect(getByTextContent("OpenGL 无 PSO，只有 Program")).toBeInTheDocument();
    const psoOptimizationFact = getByTextContent("Vulkan / Metal 有 PSO可以深度优化");
    expect(psoOptimizationFact).toBeInTheDocument();
    expect(psoOptimizationFact.querySelector(".notes-inline-emphasis--pso")).not.toBeNull();
    expect(getByTextContent("Shader的Compile、Link耗时极高")).toBeInTheDocument();
    expect(
      screen.getByText("Compile", {
        selector: ".notes-inline-emphasis--compile-link",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Link", {
        selector: ".notes-inline-emphasis--compile-link",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("极高", {
        selector: ".notes-inline-emphasis--high-cost",
      }),
    ).toBeInTheDocument();
  });

  it("renders page06 with the new Inline-mode shader storage fact as the freshly introduced fact", () => {
    const {container} = render(
      <NotesPanel state={buildState("page_06")} transition={null} />,
    );

    const objectiveFactItems = Array.from(
      container.querySelectorAll(".notes-point-item--objective-facts"),
    );
    const objectiveFactCopies = Array.from(
      container.querySelectorAll(".notes-point-copy--objective-facts"),
    );
    expect(objectiveFactCopies.at(-1)?.textContent).toBe("Inline模式下ShaderCode由资产自身持有");
    expect(objectiveFactItems.at(-1)?.getAttribute("data-fact-state")).toBe("new");
  });

  it("renders page09 with the new Shared-mode global-asset fact as the freshly introduced fact", () => {
    const {container} = render(
      <NotesPanel state={buildState("page_09")} transition={null} />,
    );

    const objectiveFactItems = Array.from(
      container.querySelectorAll(".notes-point-item--objective-facts"),
    );
    const objectiveFactCopies = Array.from(
      container.querySelectorAll(".notes-point-copy--objective-facts"),
    );
    expect(objectiveFactCopies.at(-1)?.textContent).toBe("Shared模式下ShaderCode由全局资产持有");
    expect(objectiveFactItems.at(-1)?.getAttribute("data-fact-state")).toBe("new");
  });

  it("renders page11 with the new collection-loop fact and numbered objective-fact badges", () => {
    const {container} = render(
      <NotesPanel state={buildState("page_11")} transition={null} />,
    );

    const objectiveFactItems = Array.from(
      container.querySelectorAll(".notes-point-item--objective-facts"),
    );
    const objectiveFactCopies = Array.from(
      container.querySelectorAll(".notes-point-copy--objective-facts"),
    );
    const objectiveFactBadges = Array.from(
      container.querySelectorAll(".notes-point-bullet"),
    ).map((node) => node.textContent);

    expect(objectiveFactCopies.at(-1)?.textContent).toBe(
      "由于②，PSO只能从真机上面收集到真实被使用的条目，而我们需要在测试环境跑收集循环。",
    );
    expect(objectiveFactItems.at(-1)?.getAttribute("data-fact-state")).toBe("new");
    expect(objectiveFactBadges.slice(0, 4)).toEqual(["1", "2", "3", "4"]);
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
    const objectiveFactCopies = Array.from(
      currentLayer?.querySelectorAll(".notes-point-copy--objective-facts") ?? [],
    );
    expect(objectiveFactItems).toHaveLength(2);
    expect(objectiveFactCopies[0]?.textContent).toBe("启动游戏必经之路——着色器编译");
    expect(objectiveFactItems[0]?.getAttribute("data-fact-state")).toBe("stable");
    expect(objectiveFactCopies[1]?.textContent).toBe("PSO 的状态组合空间呈指数级增长");
    expect(objectiveFactItems[1]?.getAttribute("data-fact-state")).toBe("new");
  });

  it("keeps only the current page's introduced fact glowing on page03", () => {
    const {container} = render(
      <NotesPanel state={buildState("page_03")} transition={null} />,
    );

    const objectiveFactItems = Array.from(
      container.querySelectorAll(".notes-point-item--objective-facts"),
    );
    const objectiveFactCopies = Array.from(
      container.querySelectorAll(".notes-point-copy--objective-facts"),
    );
    expect(objectiveFactCopies[0]?.textContent).toBe("启动游戏必经之路——着色器编译");
    expect(objectiveFactItems[0]?.getAttribute("data-fact-state")).toBe("stable");
    expect(objectiveFactCopies[1]?.textContent).toBe("PSO 的状态组合空间呈指数级增长");
    expect(objectiveFactItems[1]?.getAttribute("data-fact-state")).toBe("stable");
    expect(objectiveFactCopies[2]?.textContent).toBe("OpenGL 无 PSO，只有 Program");
    expect(objectiveFactItems[2]?.getAttribute("data-fact-state")).toBe("new");
  });

  it("keeps cumulative objective facts on later pages and removes the old key-point summary", () => {
    render(<NotesPanel state={buildState("page_31")} transition={null} />);

    expect(getByTextContent("PSO 的状态组合空间呈指数级增长")).toBeInTheDocument();
    expect(getByTextContent("OpenGL 无 PSO，只有 Program")).toBeInTheDocument();
    expect(getByTextContent("Vulkan / Metal 有 PSO可以深度优化")).toBeInTheDocument();
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
