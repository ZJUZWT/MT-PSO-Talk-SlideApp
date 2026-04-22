import {describe, expect, it} from "vitest";
import {masterStoryboard} from "../storyboard-data/pso-storyboard";
import {DEFAULT_STEP_ID} from "../state/useWorkbenchState";

describe("masterStoryboard", () => {
  it("locks the canonical reset step order", () => {
    expect(masterStoryboard.steps.map((step) => step.id)).toEqual([
      "page_00",
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
      "page_29_data",
      "page_30",
      "page_31",
      "page_32",
      "page_33",
    ]);
  });

  it("opens on the new opening question page and keeps it in session 1", () => {
    expect(DEFAULT_STEP_ID).toBe("page_00");
    expect(
      masterStoryboard.sessions?.find((session) => session.id === "s1-foundation")
        ?.stepIds,
    ).toEqual([
      "page_00",
      "page_01",
      "page_02",
      "page_03",
      "page_04",
      "page_04_data",
    ]);
  });

  it("keeps page 00 image-led with one aligned after image and two focused prompts", () => {
    const page00 = masterStoryboard.steps.find((step) => step.id === "page_00");

    expect(page00).toBeDefined();
    expect(page00?.caption).toContain("PSO Cache 前 / 后");
    expect(page00?.keyPoints).toContain(
      "去掉画布内 `开场` 标题，把视觉重心直接交给放大的 `PSO Cache 前` 主图。",
    );
    expect(page00?.keyPoints).toContain(
      "底部只保留 1 张 `PSO Cache 后` 结果图，并让它和主图左右齐边。",
    );
    expect(page00?.keyPoints).toContain(
      "右侧不再保留 3 个泛问题，而是只问两件事：单帧高峰从何而来、预热着色器在干什么。",
    );
    expect(page00?.manuscript).toContain("匹配的单帧高峰从何而来");
    expect(page00?.manuscript).toContain("预热着色器到底是在干什么");
    expect(page00?.manuscript).toContain("左右齐边");
    expect(page00?.manuscript).not.toContain("stablepc.csv");
  });

  it("keeps session 4 through the player-facing delivery handoff", () => {
    expect(
      masterStoryboard.sessions?.find((session) => session.id === "s4-stable-precompile")
        ?.stepIds,
    ).toEqual(["page_16", "page_17", "page_18", "page_18_img", "page_19", "page_21"]);
    expect(
      masterStoryboard.sessions?.find((session) => session.id === "s5-awareness-bridge")
        ?.stepIds,
    ).toEqual([
      "page_22",
      "page_24",
      "page_25",
      "page_26",
      "page_27",
      "page_28",
      "page_29",
      "page_29_data",
      "page_30",
    ]);
    expect(
      masterStoryboard.sessions?.find((session) => session.id === "s6-optimization-notes")
        ?.stepIds,
    ).toEqual(["page_31", "page_32", "page_33"]);
  });

  it("describes page 14 as a UE-PSO record to Gfx-PSO runtime-object explanation page", () => {
    const page14 = masterStoryboard.steps.find((step) => step.id === "page_14");

    expect(page14).toBeDefined();
    expect(page14?.caption).toContain("UE 侧记录");
    expect(page14?.caption).toContain("GPU 不是二者之间的转换器");
    expect(page14?.keyPoints).toContain(
      "UE PSO 是引擎侧记录 / 描述，Gfx PSO 是 RHI / driver 侧运行时对象。",
    );
    expect(page14?.apiHighlights).toEqual([
      ".rec.upipelinecache",
      "CreatePSO类",
      "BindPSO类",
    ]);
    expect(page14?.manuscript).toContain("UE PSO");
    expect(page14?.manuscript).toContain("Gfx PSO");
    expect(page14?.manuscript).toContain("GPU 不是把 `UE PSO` 变成 `Gfx PSO` 的转换器");
    expect(page14?.manuscript).not.toContain("stablepc.csv");
  });

  it("restores page11 collection premise and shortens page18 closed-loop fact", () => {
    const page11 = masterStoryboard.steps.find((step) => step.id === "page_11");
    const page18 = masterStoryboard.steps.find((step) => step.id === "page_18");

    expect(page11).toBeDefined();
    expect(page11?.objectiveFacts).toContain(
      "由于②，PSO只能从真机上面收集到真实被使用的条目，而我们需要在测试环境跑收集循环。",
    );
    expect(page11?.apiHighlights).toEqual([".ushaderbytecode"]);
    expect(page11?.manuscript).toContain(".ushaderbytecode");

    expect(page18).toBeDefined();
    expect(page18?.objectiveFacts).toContain(
      "PSO收集闭环：Phone采集，Computer经Expand / Build，再回到Phone。",
    );
  });

  it("marks only the still-retired late-tail placeholders as hidden in navigation", () => {
    const stepById = new Map(masterStoryboard.steps.map((step) => [step.id, step]));

    expect(stepById.get("page_21")?.hiddenInNavigation).not.toBe(true);
    expect(stepById.get("page_25")?.hiddenInNavigation).toBe(true);
    expect(stepById.get("page_27")?.hiddenInNavigation).toBe(true);
    expect(stepById.get("page_30")?.hiddenInNavigation).not.toBe(true);
    expect(stepById.get("page_22")?.hiddenInNavigation).not.toBe(true);
    expect(stepById.get("page_26")?.hiddenInNavigation).not.toBe(true);
    expect(stepById.get("page_28")?.hiddenInNavigation).not.toBe(true);
    expect(stepById.get("page_29_data")?.hiddenInNavigation).not.toBe(true);
    expect(stepById.get("page_31")?.hiddenInNavigation).not.toBe(true);
  });

  it("exposes formula-first guidance, raw-to-binary OpenGL, Vulkan PSO packaging, then the split expand/build loop chapter after SharedCode", () => {
    const pageById = new Map(masterStoryboard.steps.map((step) => [step.id, step]));
    const requireStep = (id: string) => {
      const step = pageById.get(id);
      expect(step).toBeDefined();
      return step!;
    };

    const page00 = requireStep("page_00");
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
    const page29Data = requireStep("page_29_data");
    const page30 = requireStep("page_30");
    const page31 = requireStep("page_31");
    const page32 = requireStep("page_32");
    const page33 = requireStep("page_33");

    expect(page00.label).toContain("开场");
    expect(page00.label).toBe("开场");
    expect(page00.caption).toContain("PSO Cache 前 / 后");
    expect(page00.objectiveFacts).toContain(
      "启动游戏必经之路——着色器编译",
    );
    expect(page00.keyPoints).toContain(
      "去掉画布内 `开场` 标题，把视觉重心直接交给放大的 `PSO Cache 前` 主图。",
    );
    expect(page00.keyPoints).toContain(
      "底部只保留 1 张 `PSO Cache 后` 结果图，并让它和主图左右齐边。",
    );
    expect(page00.keyPoints).toContain(
      "右侧不再保留 3 个泛问题，而是只问两件事：单帧高峰从何而来、预热着色器在干什么。",
    );
    expect(page00.manuscript).toContain("匹配的单帧高峰从何而来");
    expect(page00.manuscript).toContain("预热着色器到底是在干什么");
    expect(page00.manuscript).toContain("PSO Cache 前");
    expect(page00.manuscript).toContain("PSO Cache 后");
    expect(page00.manuscript).toContain("左右齐边");
    expect(page01.label).toContain("抽象函数");
    expect(page01.caption).toContain("最小骨架");
    expect(page01.keyPoints).toContain(
      "后面会提到的预编译着色器，也可以先理解成这条主轴的一次前置准备。",
    );
    expect(page02.label).toContain("渲染语义");
    expect(page02.objectiveFacts).toContain("PSO 的状态组合空间呈指数级增长");
    expect(page02.manuscript).toContain("VertexData");
    expect(page02.manuscript).toContain("GPU");
    expect(page02.manuscript).toContain("像素");
    expect(page03.label).toContain("OpenGL");
    expect(page03.caption).toContain("Raw");
    expect(page03.objectiveFacts).toContain("OpenGL 无 PSO，只有 Program");
    expect(page03.manuscript).toContain("Raw ShaderCode");
    expect(page03.manuscript).toContain("Binary ShaderCode");
    expect(page03.manuscript).toContain("glCompileShader()");
    expect(page03.manuscript).toContain("glBlendFunc()");
    expect(page04.label).toContain("Vulkan");
    expect(page04.caption).toContain("SPIR-V");
    expect(page04.objectiveFacts).toContain("Vulkan / Metal 有 PSO可以深度优化");
    expect(page04.manuscript).toContain("SPIR-V");
    expect(page04.manuscript).toContain("Description");
    expect(page04.manuscript).toContain("PSO");
    expect(page04.manuscript).toContain("vkCreateGraphicsPipelines()");
    expect(page04.manuscript).toContain("vkCmdBindPipeline()");
    expect(page04Data.label).toContain("数据页");
    expect(page04Data.manuscript).toContain("Min/Max/Avg");
    expect(page04Data.manuscript).toContain("glCompileShader");
    expect(page04Data.manuscript).toContain("glLinkProgram");
    expect(page04Data.manuscript).toContain("CreateGfxPipeline");
    expect(page04Data.manuscript).toContain("x2");
    expect(page04Data.manuscript).toContain("BindProgramPipeline");
    expect(page04Data.manuscript).toContain("BindGfxPipeline");
    expect(page04Data.objectiveFacts).toContain("Shader的Compile、Link耗时极高");
    expect(page05.label).toContain("UE Cook");
    expect(page05.manuscript).toContain("Mesh");
    expect(page05.manuscript).toContain("Material");
    expect(page05.manuscript).toContain("Cooked ShaderCode");
    expect(page05.manuscript).toContain("VertexData");
    expect(page05.objectiveFacts).toContain("UE PSO 以 ShaderHash 为索引定位对应的 ShaderCode");
    expect(page06.label).toContain("UE 分层");
    expect(page06.caption).toContain("区分");
    expect(page06.manuscript).toContain("ShaderPlatform");
    expect(page06.manuscript).toContain("FeatureLevel");
    expect(page06.manuscript).toContain("QualityLevel");
    expect(page06.manuscript).toContain("ShaderType");
    expect(page06.manuscript).toContain("VertexFactory");
    expect(page06.manuscript).toContain("Permutation");
    expect(page06.manuscript).toContain("UMaterial");
    expect(page06.manuscript).toContain("FMaterialResource");
    expect(page06.manuscript).toContain("FMaterialShaderMap");
    expect(page06.objectiveFacts).toContain("Inline模式下ShaderCode由资产自身持有");
    expect(page06.manuscript).toContain("Inline模式下ShaderCode由资产自身持有");
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
    expect(page09.label).toContain("提供全局表进行Hash索引");
    expect(page09.objectiveFacts).toContain(
      "Shared模式下ShaderCode由全局资产持有，含全局索引，Material共享",
    );
    expect(page09.manuscript).toContain("SharedCode");
    expect(page09.manuscript).toContain(
      "Shared模式下ShaderCode由全局资产持有，含全局索引，Material共享",
    );
    expect(page09.manuscript).toContain("ShaderHashTable");
    expect(page09.manuscript).toContain("LibraryShaderIndex");
    expect(page09.manuscript).toContain("PSO");
    expect(page10.label).toContain("ShaderLibrary");
    expect(page10.manuscript).toContain("第五页");
    expect(page10.manuscript).toContain("ShaderLibrary");
    expect(page10.manuscript).not.toContain(".ushaderbytecode");
    expect(page10.manuscript).not.toContain(".scl.csv");
    expect(page10.manuscript).not.toContain("手机");
    expect(page09Img.label).toContain("统一存放ShaderCode减少重复消耗");
    expect(page09Img.manuscript).toContain("InlineShaderCode");
    expect(page09Img.manuscript).toContain("SharedShaderCode");
    expect(page09Img.manuscript).toContain(".uexp");
    expect(page09Img.manuscript).toContain("ShaderMapHash");
    expect(page11.label).toContain("测试环境收集回路");
    expect(page11.objectiveFacts).toContain(
      "由于②，PSO只能从真机上面收集到真实被使用的条目，而我们需要在测试环境跑收集循环。",
    );
    expect(page11.manuscript).toContain("Computer");
    expect(page11.manuscript).toContain("Phone");
    expect(page11.manuscript).toContain(".ushaderbytecode");
    expect(page11.manuscript).toContain(
      "由于②，PSO只能从真机上面收集到真实被使用的条目，而我们需要在测试环境跑收集循环。",
    );
    expect(page11.manuscript).not.toContain(".scl.csv");
    expect(page12.label).toContain("Cook产出ShaderLibrary");
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
    expect(page15Img.apiHighlights).toEqual([".rec.upipelinecache"]);
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
    expect(page17.objectiveFacts).toContain(
      "Hash版本间不稳定，ShaderStableKey版本间稳定",
    );
    expect(page15.notesDataTable).toBeUndefined();
    expect(page18.label).toContain("闭环");
    expect(page18.objectiveFacts).toContain(
      "PSO收集闭环：Phone采集，Computer经Expand / Build，再回到Phone。",
    );
    expect(page18.manuscript).toContain("stable.upipelinecache");
    expect(page18.manuscript).toContain("PSO收集循环");
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
    expect(page19.manuscript).toContain("GfxPSO");
    expect(page19.manuscript).toContain("Program Binary");
    expect(page19.manuscript).toContain("Pipeline Cache");
    expect(page19.manuscript).toContain("Binary Archive");
    expect(page19.manuscript).toContain("functions.data");
    expect(page19.manuscript).toContain("binary / cache");
    expect(page19.manuscript).toContain("旧缓存失效");
    expect(page19.manuscript).toContain("Binary Archive 2");
    expect(page19.apiHighlights).toContain("BinaryFileCache");
    expect(page19.objectiveFacts).toContain(
      "编译后的 PSO 可缓存成本地 binary，后续直接 Load。",
    );
    expect(page19.objectiveFacts).toContain(
      "本地 binary 强依赖 OS / 驱动 / 芯片，不能稳定分发。",
    );
    expect(page19.manuscript).toContain("构建机上能用的本地二进制");
    expect(page21.label).toContain("玩家视角");
    expect(page21.caption).toContain("stable.upipelinecache");
    expect(page21.caption).toContain("ShaderLibrary");
    expect(page21.manuscript).toContain("stable.upipelinecache");
    expect(page21.manuscript).toContain("ShaderLibrary");
    expect(page21.manuscript).toContain(".ushaderbytecode");
    expect(page21.manuscript).toContain("compile / link / cook");
    expect(page21.manuscript).toContain("外网玩家");
    expect(page21.notes).toContain("删掉蓝色 `cook` 支线");
    expect(page22.label).toContain("我的理解");
    expect(page22.caption).toContain("五连反证表");
    expect(page22.manuscript).toContain("不打开 `SharedShaderCode`");
    expect(page22.manuscript).not.toContain("A1");
    expect(page22.manuscript).not.toContain("A2");
    expect(page22.manuscript).toContain("构建机构建的二进制");
    expect(page22.manuscript).toContain("`.rec.upipelinecache`");
    expect(page22.notes).toContain("发光");
    expect(page22.notes).toContain("不再补");
    expect(page22.manuscript).toContain("不会消失");
    expect(page22.manuscript).toContain("只会转移");
    expect(page24.label).toContain("资源过重");
    expect(page24.manuscript).toContain("减体积");
    expect(page24.manuscript).toContain("LZ4");
    expect(page24.manuscript).toContain("zstd");
    expect(page24.manuscript).toContain("Oodle Leviathan");
    expect(page24.manuscript).toContain("LRU + mmap");
    expect(page24.manuscript).toContain("虚拟内存");
    expect(page24.manuscript).toContain("虚拟化");
    expect(page25.label).toContain("改存储位置");
    expect(page25.label).toContain("保留页");
    expect(page25.manuscript).toContain("LRU");
    expect(page25.manuscript).toContain("mmap");
    expect(page25.manuscript).toContain("SQL");
    expect(page26.label).toContain("编译过慢");
    expect(page26.manuscript).toContain("Game UsageMask");
    expect(page26.manuscript).toContain("Compile UsageMask");
    expect(page26.manuscript).toContain("地图 A");
    expect(page26.manuscript).toContain("地图 B 被下载");
    expect(page26.manuscript).toContain("分集合");
    expect(page26.manuscript).toContain("并行化");
    expect(page26.manuscript).toContain("SIMD");
    expect(page26.manuscript).toContain("GPU");
    expect(page27.label).toContain("改执行方式");
    expect(page27.label).toContain("保留页");
    expect(page27.manuscript).toContain("SIMD");
    expect(page27.manuscript).toContain("GPU");
    expect(page27.manuscript).toContain("warp divergence");
    expect(page28.label).toContain("平台差异的表象");
    expect(page28.manuscript).toContain("OpenGL");
    expect(page28.manuscript).toContain("iOS");
    expect(page28.manuscript).toContain("平台差异");
    expect(page29.label).toContain("治理证据");
    expect(page29.manuscript).toContain("VertexDescriptor");
    expect(page29.manuscript).toContain("LocalVertexFactory");
    expect(page29.manuscript).toContain("NUM_MATERIAL_TEXCOORDS_VERTEX = 2");
    expect(page29.manuscript).toContain("1 个 UV");
    expect(page29.manuscript).toContain("2 个 UV");
    expect(page29.manuscript).toContain("同一个Material作用于不同的Mesh也会产生不同的PSO");
    expect(page29Data.label).toContain("PSO驱动层");
    expect(page29Data.manuscript).toContain("loop=10");
    expect(page29Data.manuscript).toContain("loop=5000");
    expect(page29Data.manuscript).toContain("RTX 3080");
    expect(page29Data.manuscript).toContain("Adreno");
    expect(page29Data.manuscript).toContain("blendAtt.colorWriteMask = 0");
    expect(page29Data.manuscript).toContain("桌面驱动");
    expect(page29Data.manuscript).toContain("移动端驱动");
    expect(page30.label).toContain("PSO 延伸阅读");
    expect(page30.manuscript).toContain("PSO Precaching for Unreal Engine");
    expect(page30.manuscript).toContain("PSO 小实验");
    expect(page30.manuscript).toContain("UE项目优化：PSO Cache");
    expect(page30.manuscript).toContain("Mesa");
    expect(page31.label).toContain("先看真实结果");
    expect(page31.manuscript).toContain("Hook");
    expect(page31.manuscript).toContain("workflow_gate.py");
    expect(page31.manuscript).toContain("front Edge probe");
    expect(page31.manuscript).toContain("browser-api capture");
    expect(page31.manuscript).toContain("blind critics");
    expect(page31.manuscript).toContain("review:mechanical");
    expect(page31.manuscript).toContain("通过");
    expect(page31.manuscript).toContain("继续改");
    expect(page32.label).toContain("反馈系统");
    expect(page32.manuscript).toContain("loss + back propagation");
    expect(page32.manuscript).toContain("feedback system");
    expect(page32.manuscript).toContain("从具体问题往上抽象");
    expect(page32.manuscript).toContain("Input / f(x) / Output");
    expect(page32.manuscript).toContain("看似无用");
    expect(page33.label).toContain("逍遥游");
    expect(page33.manuscript).not.toContain("PSO 小实验");
    expect(page33.manuscript).not.toContain("PSO Precaching for Unreal Engine");
    expect(page33.manuscript).not.toContain("Mesa 开源驱动");
    expect(page33.manuscript).toContain("今子有大树");
    expect(page33.manuscript).toContain("无何有之乡");
    expect(page33.manuscript).toContain("安所困苦哉");
    expect(page33.manuscript).toContain("银河帝国");
    expect(page33.manuscript).not.toContain("弗里德里希·恩格斯");
    expect(page33.manuscript).toContain("人类高质量思政课");
    expect(page33.manuscript).toContain("星际拓荒");
    expect(page33.manuscript).toContain("Type Help");
  });
});
