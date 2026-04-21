import {describe, expect, it} from "vitest";

describe("review slides CLI args", () => {
  it("defaults to page_19 and the ignore review output folder", async () => {
    const mod = await import("./reviewSlidesCli");

    expect(mod.parseReviewSlidesArgs([])).toMatchObject({
      fromStepId: "page_19",
      outputDirSuffix: "/ignore/slide-review/page_19_plus",
    });
  });

  it("accepts explicit from and output-dir overrides", async () => {
    const mod = await import("./reviewSlidesCli");

    expect(
      mod.parseReviewSlidesArgs([
        "--from",
        "page_22",
        "--output-dir",
        "/tmp/custom-review",
      ]),
    ).toMatchObject({
      fromStepId: "page_22",
      outputDir: "/tmp/custom-review",
    });
  });
});
