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
    ]);
  });

  it("exposes formula-first guidance, raw-to-binary OpenGL, Vulkan PSO packaging, then the split UE shader-code zoom narrative", () => {
    const page01 = masterStoryboard.steps[0];
    const page02 = masterStoryboard.steps[1];
    const page03 = masterStoryboard.steps[2];
    const page04 = masterStoryboard.steps[3];
    const page05 = masterStoryboard.steps[4];
    const page06 = masterStoryboard.steps[5];
    const page07 = masterStoryboard.steps[6];
    const page08 = masterStoryboard.steps[7];
    const page09 = masterStoryboard.steps[8];

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
  });
});
