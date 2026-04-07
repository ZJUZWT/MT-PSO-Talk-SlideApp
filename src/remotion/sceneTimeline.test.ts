import {describe, expect, it} from "vitest";
import {resolveRemotionStepFrame} from "./embed";
import {
  REMOTION_STEP_SEQUENCE,
  resolveRemotionSceneWindow,
} from "./sceneTimeline";

describe("remotion timeline", () => {
  it("extends the canonical step sequence through page 09", () => {
    expect(REMOTION_STEP_SEQUENCE).toEqual([
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

  it("assigns frame anchors for the split shader zoom pages", () => {
    expect(resolveRemotionStepFrame("page_05")).toBe(162);
    expect(resolveRemotionStepFrame("page_06")).toBe(234);
    expect(resolveRemotionStepFrame("page_07")).toBe(270);
    expect(resolveRemotionStepFrame("page_08")).toBe(306);
    expect(resolveRemotionStepFrame("page_09")).toBe(342);
  });

  it("builds scene windows across the expanded zoom segment", () => {
    expect(resolveRemotionSceneWindow(252)).toMatchObject({
      fromStepId: "page_06",
      toStepId: "page_07",
    });
    expect(resolveRemotionSceneWindow(324)).toMatchObject({
      fromStepId: "page_08",
      toStepId: "page_09",
    });
    expect(resolveRemotionSceneWindow(360)).toMatchObject({
      fromStepId: "page_09",
      toStepId: "page_09",
      fromFrame: 342,
      toFrame: 342,
      progress: 1,
    });
  });

  it("keeps enough total duration for a settled page 09 hold", () => {
    expect(resolveRemotionStepFrame("page_09")).toBeLessThan(378);
    expect(resolveRemotionStepFrame("page_09")).toBeGreaterThan(resolveRemotionStepFrame("page_08"));
  });
});
