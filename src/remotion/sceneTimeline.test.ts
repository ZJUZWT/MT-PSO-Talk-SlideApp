import {describe, expect, it} from "vitest";
import {resolveRemotionStepFrame} from "./embed";
import {
  REMOTION_STEP_SEQUENCE,
  resolveRemotionSceneWindow,
} from "./sceneTimeline";

describe("remotion timeline", () => {
  it("extends the canonical step sequence through page 18", () => {
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
      "page_16",
      "page_17",
      "page_18",
    ]);
  });

  it("assigns frame anchors for the placeholder-expanded loop chapter after SharedCode", () => {
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
    expect(resolveRemotionStepFrame("page_16")).toBe(816);
    expect(resolveRemotionStepFrame("page_17")).toBe(870);
    expect(resolveRemotionStepFrame("page_18")).toBe(924);
  });

  it("builds scene windows across the placeholder-expanded loop segment", () => {
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
    expect(resolveRemotionSceneWindow(780)).toMatchObject({
      fromStepId: "page_15",
      toStepId: "page_16",
    });
    expect(resolveRemotionSceneWindow(840)).toMatchObject({
      fromStepId: "page_16",
      toStepId: "page_17",
    });
    expect(resolveRemotionSceneWindow(900)).toMatchObject({
      fromStepId: "page_17",
      toStepId: "page_18",
    });
  });

  it("keeps enough total duration for a settled page 18 hold", () => {
    expect(resolveRemotionStepFrame("page_18")).toBeLessThan(954);
    expect(resolveRemotionStepFrame("page_18")).toBeGreaterThan(
      resolveRemotionStepFrame("page_17"),
    );
  });
});
