import {describe, expect, it} from "vitest";
import {masterStoryboard} from "../storyboard-data/pso-storyboard";

describe("masterStoryboard", () => {
  it("locks the canonical reset step order", () => {
    expect(masterStoryboard.steps.map((step) => step.id)).toEqual([
      "page_01",
      "page_02",
      "page_03",
      "page_04",
      "page_05",
      "page_06",
      "page_07",
      "page_08",
      "page_09",
      "page_10",
      "page_11",
      "page_12",
      "page_13",
      "page_14",
      "page_15",
      "page_16",
      "page_17",
      "page_18",
    ]);
  });

  it("exposes formula-first guidance, raw-to-binary OpenGL, Vulkan PSO packaging, then the placeholder-expanded loop chapter after SharedCode", () => {
    const page01 = masterStoryboard.steps[0];
    const page02 = masterStoryboard.steps[1];
    const page03 = masterStoryboard.steps[2];
    const page04 = masterStoryboard.steps[3];
    const page05 = masterStoryboard.steps[4];
    const page06 = masterStoryboard.steps[5];
    const page07 = masterStoryboard.steps[6];
    const page08 = masterStoryboard.steps[7];
    const page09 = masterStoryboard.steps[8];
    const page10 = masterStoryboard.steps[9];
    const page11 = masterStoryboard.steps[10];
    const page12 = masterStoryboard.steps[11];
    const page13 = masterStoryboard.steps[12];
    const page14 = masterStoryboard.steps[13];
    const page15 = masterStoryboard.steps[14];
    const page16 = masterStoryboard.steps[15];
    const page17 = masterStoryboard.steps[16];
    const page18 = masterStoryboard.steps[17];

    expect(page01?.label).toBe("Input -> f(x) -> Output");
    expect(page01?.caption).toContain("最小骨架");
    expect(page02?.label).toBe("VertexData -> GPU -> Pixels");
    expect(page02?.caption).toContain("GPU");
    expect(page02?.manuscript).toContain("VertexData");
    expect(page03?.label).toBe("OpenGL");
    expect(page03?.caption).toContain("Raw");
    expect(page03?.manuscript).toContain("Raw ShaderCode");
    expect(page03?.manuscript).toContain("Binary ShaderCode");
    expect(page03?.manuscript).toContain("glCompileShader()");
    expect(page03?.manuscript).toContain("glBlendFunc()");
    expect(page04?.label).toBe("Vulkan");
    expect(page04?.caption).toContain("SPIR-V");
    expect(page04?.manuscript).toContain("Raw ShaderCode");
    expect(page04?.manuscript).toContain("SPIR-V");
    expect(page04?.manuscript).toContain("SPIR-V ShaderCode");
    expect(page04?.manuscript).toContain("Description");
    expect(page04?.manuscript).toContain("PSO");
    expect(page04?.manuscript).toContain("vkCreateGraphicsPipelines()");
    expect(page04?.manuscript).toContain("vkCmdBindPipeline()");
    expect(page05?.label).toBe("UE Asset Cook");
    expect(page05?.manuscript).toContain("Mesh");
    expect(page05?.manuscript).toContain("Material");
    expect(page05?.manuscript).toContain("Cooked ShaderCode");
    expect(page05?.manuscript).toContain("VertexData");
    expect(page06?.label).toBe("区分因素在哪一层");
    expect(page06?.caption).toContain("区分");
    expect(page06?.manuscript).toContain("ShaderPlatform");
    expect(page06?.manuscript).toContain("FeatureLevel");
    expect(page06?.manuscript).toContain("QualityLevel");
    expect(page06?.manuscript).toContain("ShaderType");
    expect(page06?.manuscript).toContain("VertexFactory");
    expect(page06?.manuscript).toContain("Permutation");
    expect(page06?.manuscript).toContain("FMaterialResource");
    expect(page06?.manuscript).toContain("FMaterialShaderMap");
    expect(page07?.label).toBe("InlineCode 如何拿到 code");
    expect(page07?.caption).toContain("ResourceIndex");
    expect(page07?.manuscript).toContain("ResourceIndex");
    expect(page07?.manuscript).toContain("FShaderMapResource_InlineCode");
    expect(page07?.manuscript).toContain("FShaderMapResourceCode");
    expect(page07?.manuscript).toContain("ShaderEntries[Index]");
    expect(page07?.manuscript).toContain("ShaderHashes[Index]");
    expect(page08?.label).toBe("PSO cache 为什么只存 Hash");
    expect(page08?.manuscript).toContain("PSO cache");
    expect(page08?.manuscript).toContain("Hash");
    expect(page08?.manuscript).toContain("metadata");
    expect(page08?.manuscript).toContain("ShaderCode");
    expect(page09?.label).toBe("SharedCode 为什么成为必需");
    expect(page09?.manuscript).toContain("SharedCode");
    expect(page09?.manuscript).toContain("ShaderArchive");
    expect(page09?.manuscript).toContain("去重");
    expect(page09?.manuscript).toContain("PSO");
    expect(page10?.label).toBe("先回到第 5 页，再回答 ShaderLibrary");
    expect(page10?.manuscript).toContain("第五页");
    expect(page10?.manuscript).toContain("ShaderLibrary");
    expect(page10?.manuscript).not.toContain(".ushaderbytecode");
    expect(page10?.manuscript).not.toContain(".scl.csv");
    expect(page10?.manuscript).not.toContain("手机");
    expect(page11?.label).toBe("电脑和手机的基础舞台先落位");
    expect(page11?.manuscript).toContain("Computer");
    expect(page11?.manuscript).toContain("Phone");
    expect(page11?.manuscript).toContain(".ushaderbytecode");
    expect(page11?.manuscript).not.toContain(".scl.csv");
    expect(page12?.label).toBe("首次 Cook 再分出第二份 .scl.csv");
    expect(page11?.manuscript).toContain(".ushaderbytecode");
    expect(page12?.manuscript).toContain(".scl.csv");
    expect(page12?.manuscript).toContain("cook");
    expect(page13?.label).toBe("手机先吃进 .ushaderbytecode");
    expect(page13?.manuscript).toContain(".ushaderbytecode");
    expect(page13?.manuscript).toContain("手机");
    expect(page13?.manuscript).not.toContain(".rec.upipelinecache");
    expect(page14?.label).toBe("运行时如何收集 PSO");
    expect(page14?.manuscript).toContain(".ushaderbytecode");
    expect(page14?.manuscript).toContain(".rec.upipelinecache");
    expect(page14?.manuscript).toContain("OpenGL");
    expect(page14?.manuscript).toContain("Metal");
    expect(page14?.manuscript).not.toContain("stablepc.csv");
    expect(page15?.label).toBe("手机开始回传 .rec.upipelinecache");
    expect(page14?.manuscript).toContain(".rec.upipelinecache");
    expect(page15?.manuscript).toContain("回程");
    expect(page15?.manuscript).not.toContain("stablepc.csv");
    expect(page16?.label).toBe("expand / build 在做什么");
    expect(page16?.manuscript).toContain("rec.upipelinecache");
    expect(page16?.manuscript).toContain("scl.csv");
    expect(page16?.manuscript).toContain("stablepc.csv");
    expect(page16?.manuscript).toContain("stable.upipelinecache");
    expect(page16?.manuscript).toContain("expand");
    expect(page16?.manuscript).toContain("build");
    expect(page17?.label).toBe("电脑 expand，stable 再回到手机，闭环完成");
    expect(page17?.manuscript).toContain("stable.upipelinecache");
    expect(page17?.manuscript).toContain("闭合");
    expect(page17?.manuscript).toContain("expand");
    expect(page17?.manuscript).toContain("stablepc.csv");
    expect(page17?.manuscript).toContain("手机");
    expect(page18?.label).toBe("预编译怎么发生");
    expect(page18?.manuscript).toContain("stable.upipelinecache");
    expect(page18?.manuscript).toContain("预编译");
    expect(page18?.manuscript).toContain("OpenGL");
    expect(page18?.manuscript).toContain("Metal");
    expect(page18?.manuscript).toContain("编译");
  });
});
