import {describe, expect, it} from "vitest";
import {masterStoryboard} from "../storyboard-data/pso-storyboard";

describe("masterStoryboard", () => {
  it("locks the canonical reset step order", () => {
    expect(masterStoryboard.steps.map((step) => step.id)).toEqual([
      "page_01",
      "page_02",
      "page_03",
      "page_04",
    ]);
  });

  it("exposes formula-first guidance, GPU concretization, OpenGL setup, and Vulkan PSO packaging", () => {
    const page01 = masterStoryboard.steps[0];
    const page02 = masterStoryboard.steps[1];
    const page03 = masterStoryboard.steps[2];
    const page04 = masterStoryboard.steps[3];

    expect(page01?.label).toBe("Input -> f(x) -> Output");
    expect(page01?.caption).toContain("最小骨架");
    expect(page02?.label).toBe("VertexData -> GPU -> Pixels");
    expect(page02?.caption).toContain("GPU");
    expect(page02?.manuscript).toContain("VertexData");
    expect(page03?.label).toBe("OpenGL");
    expect(page03?.caption).toContain("Shader");
    expect(page03?.manuscript).toContain("ShaderBinary");
    expect(page03?.manuscript).toContain("glCompileShader()");
    expect(page03?.manuscript).toContain("glBlendFunc()");
    expect(page04?.label).toBe("Vulkan PSO");
    expect(page04?.caption).toContain("PSO");
    expect(page04?.manuscript).toContain("PSO");
    expect(page04?.manuscript).toContain("vkCmdBindPipeline()");
  });
});
