import {describe, expect, it} from "vitest";

describe("page_19+ timing probe normalization", () => {
  it("prefers the embedded markdown field when probe stdout is json", async () => {
    const mod = await import("./page19PlusReview");

    const normalized = mod.normalizeTimingProbeStdout(
      JSON.stringify({
        timingStandardEval: {verdict: "in_range"},
        markdown: "## normalized markdown",
      }),
    );

    expect(normalized.verdict).toBe("in_range");
    expect(normalized.markdown).toBe("## normalized markdown");
    expect(normalized.payload).toMatchObject({
      timingStandardEval: {verdict: "in_range"},
    });
  });
});
