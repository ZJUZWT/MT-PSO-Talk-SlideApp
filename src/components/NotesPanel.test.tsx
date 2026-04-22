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
    expect(
      screen.getByText("资产自身", {
        selector: ".notes-inline-emphasis--asset-self",
      }),
    ).toBeInTheDocument();
  });

  it("does not render the API/file panel on page06", () => {
    render(<NotesPanel state={buildState("page_06")} transition={null} />);

    expect(screen.queryByText("涉及 API / 文件")).not.toBeInTheDocument();
    expect(screen.queryByText("UMaterial")).not.toBeInTheDocument();
    expect(screen.queryByText("FMaterialResource")).not.toBeInTheDocument();
    expect(screen.queryByText("FMaterialShaderMap")).not.toBeInTheDocument();
  });

  it("does not render the API/file panel on page05", () => {
    render(<NotesPanel state={buildState("page_05")} transition={null} />);

    expect(screen.queryByText("涉及 API / 文件")).not.toBeInTheDocument();
    expect(screen.queryByText("Mesh")).not.toBeInTheDocument();
    expect(screen.queryByText("Material")).not.toBeInTheDocument();
    expect(screen.queryByText("Cooked ShaderCode")).not.toBeInTheDocument();
    expect(screen.queryByText("Binary ShaderCode")).not.toBeInTheDocument();
  });

  it("renders page05 with ShaderHash and 索引 emphasized in the objective fact", () => {
    render(<NotesPanel state={buildState("page_05")} transition={null} />);

    expect(getByTextContent("UE PSO 以 ShaderHash 为索引定位对应的 ShaderCode")).toBeInTheDocument();
    expect(
      screen.getByText("ShaderHash", {
        selector: ".notes-inline-emphasis--hash-index",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("索引", {
        selector: ".notes-inline-emphasis--hash-index",
      }),
    ).toBeInTheDocument();
  });

  it("does not render the API/file panel for page08", () => {
    render(<NotesPanel state={buildState("page_08")} transition={null} />);

    expect(screen.queryByText("涉及 API / 文件")).not.toBeInTheDocument();
    expect(screen.queryByText("PSO Cache")).not.toBeInTheDocument();
  });

  it("does not render the API/file panel for page09", () => {
    render(<NotesPanel state={buildState("page_09")} transition={null} />);

    expect(screen.queryByText("涉及 API / 文件")).not.toBeInTheDocument();
    expect(screen.getByText("客观事实")).toBeInTheDocument();
    expect(screen.queryByText("ShaderMapEntries[ShaderMapIndex]")).not.toBeInTheDocument();
  });

  it("renders page09 with the new Shared-mode global asset, global index, and sharing fact as the freshly introduced fact", () => {
    const {container} = render(
      <NotesPanel state={buildState("page_09")} transition={null} />,
    );

    const objectiveFactItems = Array.from(
      container.querySelectorAll(".notes-point-item--objective-facts"),
    );
    const objectiveFactCopies = Array.from(
      container.querySelectorAll(".notes-point-copy--objective-facts"),
    );
    expect(objectiveFactCopies.at(-1)?.textContent).toBe(
      "Shared模式下ShaderCode由全局资产持有，含全局索引，Material共享",
    );
    expect(objectiveFactItems.at(-1)?.getAttribute("data-fact-state")).toBe("new");
    expect(
      screen.getByText("全局资产", {
        selector: ".notes-inline-emphasis--global-asset",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("全局索引", {
        selector: ".notes-inline-emphasis--global-index",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("共享", {
        selector: ".notes-inline-emphasis--shared-mode",
      }),
    ).toBeInTheDocument();
  });

  it("renders page09 related link to the FShaderCodeLibrary API page", () => {
    render(<NotesPanel state={buildState("page_09")} transition={null} />);

    const link = screen.getByRole("link", {
      name: "UE Shader Code Library（官方文档）",
    });

    expect(link).toHaveAttribute(
      "href",
      "https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/RenderCore/FShaderCodeLibrary",
    );
  });

  it("renders page14 API/file panel with rec file plus CreatePSO and BindPSO API classes", () => {
    render(<NotesPanel state={buildState("page_14")} transition={null} />);

    expect(screen.getByText("涉及 API / 文件")).toBeInTheDocument();
    expect(screen.getByText(".rec.upipelinecache")).toBeInTheDocument();
    expect(screen.getByText("CreatePSO类")).toBeInTheDocument();
    expect(screen.getByText("BindPSO类")).toBeInTheDocument();
    expect(screen.queryByText("UE PSO")).not.toBeInTheDocument();
    expect(screen.queryByText("Gfx PSO")).not.toBeInTheDocument();
  });

  it("renders page15 API/file panel with only rec.upipelinecache", () => {
    render(<NotesPanel state={buildState("page_15")} transition={null} />);

    expect(screen.getByText("涉及 API / 文件")).toBeInTheDocument();
    expect(screen.getByText(".rec.upipelinecache")).toBeInTheDocument();
    expect(screen.queryByText("Phone")).not.toBeInTheDocument();
    expect(screen.queryByText("Computer")).not.toBeInTheDocument();
  });

  it("renders page17 API/file panel without Build in the list", () => {
    render(<NotesPanel state={buildState("page_17")} transition={null} />);

    expect(screen.getByText("涉及 API / 文件")).toBeInTheDocument();
    expect(screen.getByText("所有历史版本的稳定UE PSO")).toBeInTheDocument();
    expect(screen.getByText("当前版本Cook出来的双向映射")).toBeInTheDocument();
    expect(screen.getByText("当前包体可以用作预编译的UE PSO")).toBeInTheDocument();
    expect(screen.queryByText("Build")).not.toBeInTheDocument();
  });

  it("renders page17 with the new hash-vs-stable-key objective fact", () => {
    const {container} = render(
      <NotesPanel state={buildState("page_17")} transition={null} />,
    );

    const objectiveFactItems = Array.from(
      container.querySelectorAll(".notes-point-item--objective-facts"),
    );
    const objectiveFactCopies = Array.from(
      container.querySelectorAll(".notes-point-copy--objective-facts"),
    );

    expect(objectiveFactCopies.at(-1)?.textContent).toBe(
      "Hash 跨版本不稳定，ShaderStableKey 跨版本稳定",
    );
    expect(objectiveFactItems.at(-1)?.getAttribute("data-fact-state")).toBe("new");
    expect(
      screen.getByText("Hash", {
        selector: ".notes-inline-emphasis--unstable",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("ShaderStableKey", {
        selector: ".notes-inline-emphasis--stable-key",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("不稳定", {
        selector: ".notes-inline-emphasis--unstable",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("稳定", {
        selector: ".notes-inline-emphasis--stable-key",
      }),
    ).toBeInTheDocument();
  });

  it("renders page18 API/file panel with all file nodes but no Phone or Closed Loop labels", () => {
    render(<NotesPanel state={buildState("page_18")} transition={null} />);

    const apiPanel = screen.getByLabelText("涉及 API / 文件");
    const apiLabels = Array.from(
      apiPanel.querySelectorAll<HTMLElement>(".notes-api-label"),
    )
      .map((item) => item.textContent?.trim());

    expect(apiLabels).toEqual([
      ".ushaderbytecode",
      ".scl.csv",
      ".rec.upipelinecache",
      "stablepc.csv",
      "stable.upipelinecache",
    ]);
    expect(screen.queryByText("Phone")).not.toBeInTheDocument();
    expect(screen.queryByText("Closed Loop")).not.toBeInTheDocument();
  });

  it("renders page19 with the new local-binary objective fact", () => {
    render(<NotesPanel state={buildState("page_19")} transition={null} />);

    expect(
      getByTextContent(
        "编译后的 PSO 可写入本地 binary，后续直接 Load",
      ),
    ).toBeInTheDocument();
    expect(
      getByTextContent("本地 binary 强依赖 OS / 驱动 / 芯片，不能稳定分发"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("写入", {
        selector: ".notes-inline-emphasis--local-binary",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("binary", {
        selector: ".notes-inline-emphasis--local-binary",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Load", {
        selector: ".notes-inline-emphasis--local-binary",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("OS / 驱动 / 芯片", {
        selector: ".notes-inline-emphasis--driver-runtime",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("不能稳定分发", {
        selector: ".notes-inline-emphasis--driver-runtime",
      }),
    ).toBeInTheDocument();
  });

  it("renders page19 API/file panel with BinaryFileCache", () => {
    render(<NotesPanel state={buildState("page_19")} transition={null} />);

    expect(screen.getByText("涉及 API / 文件")).toBeInTheDocument();
    expect(screen.getByText("UE PSO")).toBeInTheDocument();
    expect(screen.getByText("GfxPSO")).toBeInTheDocument();
    expect(screen.getByText("GPU")).toBeInTheDocument();
    expect(screen.getByText("Program Binary")).toBeInTheDocument();
    expect(screen.getByText("Pipeline Cache")).toBeInTheDocument();
    expect(screen.getByText("Binary Archive")).toBeInTheDocument();
    expect(screen.getByText("BinaryFileCache")).toBeInTheDocument();
  });

  it("does not render the API/file panel for page09_img", () => {
    render(<NotesPanel state={buildState("page_09_img")} transition={null} />);

    expect(screen.queryByText("涉及 API / 文件")).not.toBeInTheDocument();
    expect(screen.queryByText("InlineShaderCode")).not.toBeInTheDocument();
    expect(screen.queryByText("SharedShaderCode")).not.toBeInTheDocument();
    expect(screen.queryByText(".uexp 对比")).not.toBeInTheDocument();
    expect(screen.queryByText("ShaderArchive")).not.toBeInTheDocument();
  });

  it("does not render the API/file panel for page18_img", () => {
    render(<NotesPanel state={buildState("page_18_img")} transition={null} />);

    expect(screen.queryByText("涉及 API / 文件")).not.toBeInTheDocument();
    expect(screen.queryByText("PSO预编译解决高峰")).not.toBeInTheDocument();
    expect(screen.queryByText("峰值平滑")).not.toBeInTheDocument();
    expect(screen.queryByText("证据页")).not.toBeInTheDocument();
  });

  it("does not render the API/file panel for page10", () => {
    render(<NotesPanel state={buildState("page_10")} transition={null} />);

    expect(screen.queryByText("涉及 API / 文件")).not.toBeInTheDocument();
    expect(screen.queryByText("Material")).not.toBeInTheDocument();
    expect(screen.queryByText("Cooked ShaderCode")).not.toBeInTheDocument();
    expect(screen.queryByText("ShaderLibrary")).not.toBeInTheDocument();
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
    const apiLabels = Array.from(
      container.querySelectorAll(".notes-api-label"),
    ).map((node) => node.textContent);

    expect(objectiveFactCopies.at(-1)?.textContent).toBe(
      "由于②，PSO 只能从真机收集真实使用条目，所以测试环境必须跑收集循环",
    );
    expect(objectiveFactItems.at(-1)?.getAttribute("data-fact-state")).toBe("new");
    expect(objectiveFactBadges.slice(0, 4)).toEqual(["1", "2", "3", "4"]);
    expect(apiLabels).toEqual([".ushaderbytecode"]);
    expect(
      screen.getByText("真机", {
        selector: ".notes-inline-emphasis--runtime-loop",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("收集循环", {
        selector: ".notes-inline-emphasis--runtime-loop",
      }),
    ).toBeInTheDocument();
  });

  it("renders page18 with the shortened closed-loop objective fact", () => {
    render(<NotesPanel state={buildState("page_18")} transition={null} />);

    expect(
      getByTextContent("PSO 手机闭环：真机采集 -> Expand -> Build -> 给真机预编译"),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText("PSO", {selector: ".notes-inline-emphasis--pso"}).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByText("真机采集", {
        selector: ".notes-inline-emphasis--runtime-loop",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Expand", {
        selector: ".notes-inline-emphasis--runtime-loop",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Build", {
        selector: ".notes-inline-emphasis--runtime-loop",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("预编译", {
        selector: ".notes-inline-emphasis--runtime-loop",
      }),
    ).toBeInTheDocument();
  });

  it("renders page29_data with the driver/compiler realization fact highlighted", () => {
    render(<NotesPanel state={buildState("page_29_data")} transition={null} />);

    expect(
      getByTextContent("PSO 信息能否兑现优化，取决于驱动 / 编译器"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("兑现优化", {
        selector: ".notes-inline-emphasis--driver-runtime",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("驱动 / 编译器", {
        selector: ".notes-inline-emphasis--driver-runtime",
      }),
    ).toBeInTheDocument();
  });

  it("glows the page22 sidebar objective facts that are referenced by the rebuttal table", () => {
    const {container} = render(
      <NotesPanel state={buildState("page_22")} transition={null} />,
    );

    const objectiveFactItems = Array.from(
      container.querySelectorAll<HTMLElement>(".notes-point-item--objective-facts"),
    );

    const highlightedIndices = objectiveFactItems
      .filter((item) => item.getAttribute("data-fact-highlighted") === "true")
      .map((item) =>
        item.querySelector<HTMLElement>(".notes-point-bullet")?.getAttribute("data-fact-index"),
      );
    const dimmedIndices = objectiveFactItems
      .filter((item) => item.getAttribute("data-fact-highlighted") === "false")
      .map((item) =>
        item.querySelector<HTMLElement>(".notes-point-bullet")?.getAttribute("data-fact-index"),
      );

    expect(highlightedIndices).toEqual(["2", "5", "6", "8", "9", "10", "11", "12", "13"]);
    expect(dimmedIndices).toEqual(["1", "3", "4", "7"]);
    expect(
      objectiveFactItems.every((item) => item.getAttribute("data-fact-state") === "stable"),
    ).toBe(true);
  });

  it("renders page13 with only .ushaderbytecode in the API/file list", () => {
    const {container} = render(
      <NotesPanel state={buildState("page_13")} transition={null} />,
    );

    const apiLabels = Array.from(
      container.querySelectorAll(".notes-api-label"),
    ).map((node) => node.textContent);

    expect(apiLabels).toEqual([".ushaderbytecode"]);
  });

  it("does not render the API/file panel for page13_img", () => {
    render(<NotesPanel state={buildState("page_13_img")} transition={null} />);

    expect(screen.queryByText("涉及 API / 文件")).not.toBeInTheDocument();
    expect(screen.queryByText("PSO-卡顿")).not.toBeInTheDocument();
    expect(screen.queryByText("运行时抖动")).not.toBeInTheDocument();
    expect(screen.queryByText("证据页")).not.toBeInTheDocument();
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

  it("renders straight divider elements between later objective facts", () => {
    const {container} = render(
      <NotesPanel state={buildState("page_03")} transition={null} />,
    );

    const objectiveFactItems = Array.from(
      container.querySelectorAll(".notes-point-item--objective-facts"),
    );
    const dividers = Array.from(
      container.querySelectorAll(".notes-point-divider--objective-facts"),
    );
    const separators = Array.from(
      container.querySelectorAll(".notes-point-separator--objective-facts"),
    );

    expect(objectiveFactItems).toHaveLength(3);
    expect(dividers).toHaveLength(2);
    expect(separators).toHaveLength(2);
    expect(objectiveFactItems[0]?.querySelector(".notes-point-divider--objective-facts")).toBeNull();
    expect(objectiveFactItems[1]?.previousElementSibling).toBe(separators[0]);
    expect(objectiveFactItems[2]?.previousElementSibling).toBe(separators[1]);
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

  it("shows page31 inside the epilogue session with the new local page count", () => {
    render(<NotesPanel state={buildState("page_31")} transition={null} />);

    expect(screen.getByText("Session 6 · 后记")).toBeInTheDocument();
    expect(screen.getByText("第 1 / 3 页")).toBeInTheDocument();
  });

  it("renders the page16 ShaderStableKey sample table in the notes column", () => {
    const {container} = render(
      <NotesPanel state={buildState("page_16")} transition={null} />,
    );
    const apiLabels = Array.from(
      container.querySelectorAll(".notes-api-label"),
    ).map((node) => node.textContent);

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
    expect(apiLabels).toEqual(["手机包收集到的UE PSO", "同版本 Cook 双向映射", "stablepc.csv"]);
    expect(screen.queryByText("Expand")).not.toBeInTheDocument();
  });

  it("does not render the ShaderStableKey sample table for page15", () => {
    render(<NotesPanel state={buildState("page_15")} transition={null} />);

    expect(screen.queryByText("ShaderStableKey 样例")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Material /Game/MyActor/MyMaterial.MyMaterial"),
    ).not.toBeInTheDocument();
  });
});
