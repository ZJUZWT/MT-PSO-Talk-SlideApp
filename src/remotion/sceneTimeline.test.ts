import {describe, expect, it} from "vitest";
import {resolveRemotionStepFrame} from "./embed";
import {
  REMOTION_STEP_SEQUENCE,
  resolveRemotionSceneWindow,
} from "./sceneTimeline";

describe("remotion timeline", () => {
  it("extends the canonical step sequence through page 15", () => {
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
      "page_10",
      "page_11",
      "page_12",
      "page_13",
      "page_14",
      "page_15",
    ]);
  });

  it("assigns frame anchors for the loop pages after SharedCode", () => {
    expect(resolveRemotionStepFrame("page_05")).toBe(162);
    expect(resolveRemotionStepFrame("page_06")).toBe(234);
    expect(resolveRemotionStepFrame("page_07")).toBe(270);
    expect(resolveRemotionStepFrame("page_08")).toBe(306);
    expect(resolveRemotionStepFrame("page_09")).toBe(342);
    expect(resolveRemotionStepFrame("page_10")).toBe(474);
    expect(resolveRemotionStepFrame("page_11")).toBe(546);
    expect(resolveRemotionStepFrame("page_12")).toBe(600);
    expect(resolveRemotionStepFrame("page_13")).toBe(654);
    expect(resolveRemotionStepFrame("page_14")).toBe(708);
    expect(resolveRemotionStepFrame("page_15")).toBe(762);
  });

  it("builds scene windows across the SharedCode-to-loop segment", () => {
    expect(resolveRemotionSceneWindow(252)).toMatchObject({
      fromStepId: "page_06",
      toStepId: "page_07",
    });
    expect(resolveRemotionSceneWindow(324)).toMatchObject({
      fromStepId: "page_08",
      toStepId: "page_09",
    });
    expect(resolveRemotionSceneWindow(378)).toMatchObject({
      fromStepId: "page_09",
      toStepId: "page_10",
    });
    expect(resolveRemotionSceneWindow(620)).toMatchObject({
      fromStepId: "page_12",
      toStepId: "page_13",
    });
    expect(resolveRemotionSceneWindow(660)).toMatchObject({
      fromStepId: "page_13",
      toStepId: "page_14",
    });
    expect(resolveRemotionSceneWindow(720)).toMatchObject({
      fromStepId: "page_14",
      toStepId: "page_15",
    });
  });

  it("keeps enough total duration for a settled page 15 hold", () => {
    expect(resolveRemotionStepFrame("page_15")).toBeLessThan(792);
    expect(resolveRemotionStepFrame("page_15")).toBeGreaterThan(
      resolveRemotionStepFrame("page_14"),
    );
  });
});
