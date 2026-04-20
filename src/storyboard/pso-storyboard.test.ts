import {describe, expect, it} from "vitest";
import {masterStoryboard} from "../storyboard-data/pso-storyboard";

describe("masterStoryboard", () => {
  it("locks the canonical reset step order", () => {
    expect(masterStoryboard.steps.map((step) => step.id)).toEqual([
      "page_01",
      "page_02",
      "page_03",
      "page_04",
      "page_04_data",
      "page_05",
      "page_06",
      "page_07",
      "page_08",
      "page_09",
      "page_09_img",
      "page_10",
      "page_11",
      "page_12",
      "page_13",
      "page_14",
      "page_13_img",
      "page_15_img",
      "page_15",
      "page_16",
      "page_17",
      "page_18",
      "page_18_img",
      "page_19",
      "page_21",
      "page_22",
      "page_24",
      "page_25",
      "page_26",
      "page_27",
      "page_28",
      "page_29",
      "page_30",
      "page_31",
      "page_32",
      "page_33",
    ]);
  });

  it("keeps session 4 focused on expand / build / merged precompile in one step", () => {
    expect(
      masterStoryboard.sessions?.find((session) => session.id === "s4-stable-precompile")
        ?.stepIds,
    ).toEqual(["page_16", "page_17", "page_18", "page_18_img", "page_19"]);
  });

  it("exposes formula-first guidance, raw-to-binary OpenGL, Vulkan PSO packaging, then the split expand/build loop chapter after SharedCode", () => {
    const pageById = new Map(masterStoryboard.steps.map((step) => [step.id, step]));
    const requireStep = (id: string) => {
      const step = pageById.get(id);
      expect(step).toBeDefined();
      return step!;
    };

    const page01 = requireStep("page_01");
    const page02 = requireStep("page_02");
    const page03 = requireStep("page_03");
    const page04 = requireStep("page_04");
    const page04Data = requireStep("page_04_data");
    const page05 = requireStep("page_05");
    const page06 = requireStep("page_06");
    const page07 = requireStep("page_07");
    const page08 = requireStep("page_08");
    const page09 = requireStep("page_09");
    const page09Img = requireStep("page_09_img");
    const page10 = requireStep("page_10");
    const page11 = requireStep("page_11");
    const page12 = requireStep("page_12");
    const page13 = requireStep("page_13");
    const page13Img = requireStep("page_13_img");
    const page14 = requireStep("page_14");
    const page15 = requireStep("page_15");
    const page15Img = requireStep("page_15_img");
    const page16 = requireStep("page_16");
    const page17 = requireStep("page_17");
    const page18 = requireStep("page_18");
    const page18Img = requireStep("page_18_img");
    const page19 = requireStep("page_19");
    const page21 = requireStep("page_21");
    const page22 = requireStep("page_22");
    const page24 = requireStep("page_24");
    const page25 = requireStep("page_25");
    const page26 = requireStep("page_26");
    const page27 = requireStep("page_27");
    const page28 = requireStep("page_28");
    const page29 = requireStep("page_29");
    const page30 = requireStep("page_30");
    const page31 = requireStep("page_31");
    const page32 = requireStep("page_32");
    const page33 = requireStep("page_33");

    expect(page01.label).toContain("最小模型");
    expect(page01.caption).toContain("最小骨架");
    expect(page01.keyPoints).toContain(
      "后面会提到的预编译着色器，也可以先理解成这条主轴的一次前置准备。",
    );
    expect(page02.label).toContain("渲染语义");
    expect(page02.manuscript).toContain("VertexData");
    expect(page02.manuscript).toContain("GPU");
    expect(page02.manuscript).toContain("像素");
    expect(page03.label).toContain("OpenGL");
    expect(page03.caption).toContain("Raw");
    expect(page03.manuscript).toContain("Raw ShaderCode");
    expect(page03.manuscript).toContain("Binary ShaderCode");
    expect(page03.manuscript).toContain("glCompileShader()");
    expect(page03.manuscript).toContain("glBlendFunc()");
    expect(page04.label).toContain("Vulkan");
    expect(page04.caption).toContain("SPIR-V");
    expect(page04.manuscript).toContain("SPIR-V");
    expect(page04.manuscript).toContain("Description");
    expect(page04.manuscript).toContain("PSO");
    expect(page04.manuscript).toContain("vkCreateGraphicsPipelines()");
    expect(page04.manuscript).toContain("vkCmdBindPipeline()");
    expect(page04Data.label).toContain("数据页");
    expect(page04Data.manuscript).toContain("Min/Max/Avg");
    expect(page04Data.manuscript).toContain("glLinkProgram");
    expect(page04Data.manuscript).toContain("CreateGfxPipeline");
    expect(page04Data.manuscript).toContain("BindProgramPipeline");
    expect(page04Data.manuscript).toContain("BindGfxPipeline");
    expect(page05.label).toContain("UE Cook");
    expect(page05.manuscript).toContain("Mesh");
    expect(page05.manuscript).toContain("Material");
    expect(page05.manuscript).toContain("Cooked ShaderCode");
    expect(page05.manuscript).toContain("VertexData");
    expect(page06.label).toContain("UE 分层");
    expect(page06.caption).toContain("区分");
    expect(page06.manuscript).toContain("ShaderPlatform");
    expect(page06.manuscript).toContain("FeatureLevel");
    expect(page06.manuscript).toContain("QualityLevel");
    expect(page06.manuscript).toContain("ShaderType");
    expect(page06.manuscript).toContain("VertexFactory");
    expect(page06.manuscript).toContain("Permutation");
    expect(page06.manuscript).toContain("FMaterialResource");
    expect(page06.manuscript).toContain("FMaterialShaderMap");
    expect(page07.label).toContain("InlineCode");
    expect(page07.caption).toContain("ResourceIndex");
    expect(page07.manuscript).toContain("ResourceIndex");
    expect(page07.manuscript).toContain("FShaderMapResource_InlineCode");
    expect(page07.manuscript).toContain("FShaderMapResourceCode");
    expect(page07.manuscript).toContain("ShaderEntries[Index]");
    expect(page07.manuscript).toContain("ShaderHashes[Index]");
    expect(page08.label).toContain("PSO Cache");
    expect(page08.manuscript).toContain("PSO");
    expect(page08.manuscript).toContain("Hash");
    expect(page08.manuscript).toContain("metadata");
    expect(page08.manuscript).toContain("ShaderCode");
    expect(page09.label).toContain("SharedCode");
    expect(page09.manuscript).toContain("SharedCode");
    expect(page09.manuscript).toContain("ShaderHashTable");
    expect(page09.manuscript).toContain("LibraryShaderIndex");
    expect(page09.manuscript).toContain("PSO");
    expect(page10.label).toContain("ShaderLibrary");
    expect(page10.manuscript).toContain("第五页");
    expect(page10.manuscript).toContain("ShaderLibrary");
    expect(page10.manuscript).not.toContain(".ushaderbytecode");
    expect(page10.manuscript).not.toContain(".scl.csv");
    expect(page10.manuscript).not.toContain("手机");
    expect(page09Img.label).toContain("证据");
    expect(page09Img.manuscript).toContain("InlineShaderCode");
    expect(page09Img.manuscript).toContain("SharedShaderCode");
    expect(page09Img.manuscript).toContain(".uexp");
    expect(page09Img.manuscript).toContain("ShaderMapHash");
    expect(page11.label).toContain("Computer / Phone");
    expect(page11.manuscript).toContain("Computer");
    expect(page11.manuscript).toContain("Phone");
    expect(page11.manuscript).toContain(".ushaderbytecode");
    expect(page11.manuscript).not.toContain(".scl.csv");
    expect(page12.label).toContain("首次 Cook");
    expect(page12.manuscript).toContain(".scl.csv");
    expect(page12.manuscript).toContain("cook");
    expect(page13.label).toContain("运行侧接入");
    expect(page13.manuscript).toContain(".ushaderbytecode");
    expect(page13.manuscript).toContain("手机");
    expect(page13.manuscript).not.toContain(".rec.upipelinecache");
    expect(page13Img.label).toContain("插页证据");
    expect(page13Img.manuscript).toContain("卡顿");
    expect(page14.label).toContain("运行时采集");
    expect(page14.manuscript).toContain(".rec.upipelinecache");
    expect(page14.manuscript).toContain("OpenGL");
    expect(page14.manuscript).toContain("Metal");
    expect(page14.manuscript).not.toContain("stablepc.csv");
    expect(page15.label).toContain("回传");
    expect(page15.manuscript).toContain(".rec.upipelinecache");
    expect(page15.manuscript).toContain("回程");
    expect(page15.manuscript).not.toContain("stablepc.csv");
    expect(page15Img.label).toContain("插页证据");
    expect(page15Img.manuscript).toContain(".rec.upipelinecache");
    expect(page16.label).toContain("Expand");
    expect(page16.manuscript).toContain("rec.upipelinecache");
    expect(page16.manuscript).toContain("历史");
    expect(page16.manuscript).toContain("scl.csv");
    expect(page16.manuscript).toContain("stablepc.csv");
    expect(page16.manuscript).toContain("expand");
    expect(page16.manuscript).toContain("stable");
    expect(page16.notesDataTable?.title).toBe("ShaderStableKey 样例");
    expect(page16.notesDataTable?.rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Asset",
          value: "Material /Game/MyActor/MyMaterial.MyMaterial",
        }),
        expect.objectContaining({
          label: "VFType",
          value: "FLocalVertexFactory",
        }),
      ]),
    );
    expect(page17.label).toContain("Build");
    expect(page17.manuscript).toContain("当前");
    expect(page17.manuscript).toContain("scl.csv");
    expect(page17.manuscript).toContain("stablepc.csv");
    expect(page17.manuscript).toContain("stable.upipelinecache");
    expect(page17.manuscript).toContain("build");
    expect(page15.notesDataTable).toBeUndefined();
    expect(page18.label).toContain("闭环");
    expect(page18.manuscript).toContain("stable.upipelinecache");
    expect(page18.manuscript).toContain("闭合");
    expect(page18.manuscript).toContain("手机");
    expect(page18Img.label).toContain("插页证据");
    expect(page18Img.manuscript).toContain("高峰");
    expect(page19.label).toContain("预编译");
    expect(page19.manuscript).toContain("stable.upipelinecache");
    expect(page19.manuscript).toContain("UE PSO");
    expect(page19.manuscript).not.toContain("UE PSO x N");
    expect(page19.manuscript).toContain("VertexData");
    expect(page19.manuscript).toContain("Pixels");
    expect(page19.manuscript).toContain("PSO 1");
    expect(page19.manuscript).toContain("内存中 PSO");
    expect(page19.manuscript).toContain("Program Binary");
    expect(page19.manuscript).toContain("Pipeline Cache");
    expect(page19.manuscript).toContain("Binary Archive");
    expect(page19.manuscript).toContain("functions.data");
    expect(page21.label).toContain("缓存有效性");
    expect(page21.manuscript).toContain("stable.upipelinecache");
    expect(page21.manuscript).toContain("驱动");
    expect(page21.manuscript).toContain("芯片");
    expect(page21.manuscript).toContain("失效");
    expect(page21.manuscript).toContain("Permute");
    expect(page21.manuscript).toContain("OpenGL");
    expect(page22.label).toContain("我的理解");
    expect(page22.manuscript).toContain("PSO 是对象");
    expect(page22.manuscript).toContain("PSO Cache");
    expect(page22.manuscript).toContain("不会消失");
    expect(page22.manuscript).toContain("只会转移");
    expect(page24.label).toContain("改资源形态");
    expect(page24.manuscript).toContain("压缩");
    expect(page24.manuscript).toContain("Precompute");
    expect(page24.manuscript).toContain("Algorithm");
    expect(page24.manuscript).toContain("PCA");
    expect(page24.manuscript).toContain("模型");
    expect(page25.label).toContain("改存储位置");
    expect(page25.manuscript).toContain("LRU");
    expect(page25.manuscript).toContain("mmap");
    expect(page25.manuscript).toContain("SQL");
    expect(page26.label).toContain("改发生时机");
    expect(page26.manuscript).toContain("Game UsageMask");
    expect(page26.manuscript).toContain("Compile UsageMask");
    expect(page26.manuscript).toContain("地图 A");
    expect(page26.manuscript).toContain("地图 B 被下载");
    expect(page26.manuscript).toContain("不是为了造出两套 PSO");
    expect(page26.manuscript).toContain("仍然只有一种 `UsageMask` 表达");
    expect(page27.label).toContain("改执行方式");
    expect(page27.manuscript).toContain("SIMD");
    expect(page27.manuscript).toContain("GPU");
    expect(page27.manuscript).toContain("warp divergence");
    expect(page28.label).toContain("平台差异的表象");
    expect(page28.manuscript).toContain("OpenGL");
    expect(page28.manuscript).toContain("iOS");
    expect(page28.manuscript).toContain("平台差异");
    expect(page29.label).toContain("平台差异的来源");
    expect(page29.manuscript).toContain("VertexDescriptor");
    expect(page29.manuscript).toContain("ATTRIBUTE4");
    expect(page29.manuscript).toContain("LocalVertexFactory");
    expect(page30.label).toContain("前置治理决定上限");
    expect(page30.manuscript).toContain("RenderDoc");
    expect(page30.manuscript).toContain("color buffer");
    expect(page30.manuscript).toContain("前置治理");
    expect(page31.label).toContain("自动回环");
    expect(page31.manuscript).toContain("geometryReviewArtifact");
    expect(page31.manuscript).toContain("geometryMetrics");
    expect(page31.manuscript).toContain("geometryScorePolicy");
    expect(page31.manuscript).toContain("hook");
    expect(page31.manuscript).toContain("workflow_gate.py");
    expect(page31.manuscript).toContain("Microsoft Edge");
    expect(page31.manuscript).toContain("review:mechanical");
    expect(page31.manuscript).toContain("真实数据");
    expect(page32.label).toContain("延伸阅读");
    expect(page32.manuscript).toContain("PSO 小实验");
    expect(page32.manuscript).toContain("PSO Precaching for Unreal Engine");
    expect(page32.manuscript).toContain("Mesa 开源驱动");
    expect(page32.manuscript).toContain("银河帝国");
    expect(page32.manuscript).toContain("艾萨克·阿西莫夫");
    expect(page32.manuscript).toContain("反杜林论");
    expect(page32.manuscript).toContain("弗里德里希·恩格斯");
    expect(page32.manuscript).toContain("马克思主义哲学");
    expect(page32.manuscript).toContain("星际拓荒");
    expect(page32.manuscript).toContain("Type Help");
    expect(page33.label).toContain("逍遥游");
    expect(page33.manuscript).toContain("今子有大树");
    expect(page33.manuscript).toContain("无何有之乡");
    expect(page33.manuscript).toContain("安所困苦哉");
  });
});
