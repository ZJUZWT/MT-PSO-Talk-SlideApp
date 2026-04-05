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
    ]);
  });

  it("exposes formula-first guidance, raw-to-binary OpenGL, Vulkan PSO packaging, then the UE asset cook bridge", () => {
    const page01 = masterStoryboard.steps[0];
    const page02 = masterStoryboard.steps[1];
    const page03 = masterStoryboard.steps[2];
    const page04 = masterStoryboard.steps[3];
    const page05 = masterStoryboard.steps[4];

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
  });
});
