import {describe, expect, it} from "vitest";
import {masterStoryboard} from "../storyboard-data/pso-storyboard";

describe("masterStoryboard", () => {
  it("locks the canonical reset step order", () => {
    expect(masterStoryboard.steps.map((step) => step.id)).toEqual([
      "page_01",
      "page_02",
      "page_03",
    ]);
  });

  it("exposes formula-first guidance, GPU concretization, and upper-band GPU setup", () => {
    const page01 = masterStoryboard.steps[0];
    const page02 = masterStoryboard.steps[1];
    const page03 = masterStoryboard.steps[2];

    expect(page01?.label).toBe("Input -> f(x) -> Output");
    expect(page01?.caption).toContain("最小骨架");
    expect(page02?.label).toBe("VertexData -> GPU -> Pixels");
    expect(page02?.caption).toContain("GPU");
    expect(page02?.manuscript).toContain("VertexData");
    expect(page03?.label).toBe("OpenGL");
    expect(page03?.caption).toContain("Shader");
    expect(page03?.manuscript).toContain("ShaderBinary");
    expect(page03?.manuscript).toContain("CompileShader()");
    expect(page03?.manuscript).toContain("SetBlendState()");
  });
});
