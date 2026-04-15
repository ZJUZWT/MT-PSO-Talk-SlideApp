import {describe, expect, it} from "vitest";
import {resolveRemotionStepFrame} from "./embed";
import {
  REMOTION_STEP_SEQUENCE,
  resolveRemotionSceneWindow,
} from "./sceneTimeline";

describe("remotion timeline", () => {
  it("extends the canonical step sequence through page 24", () => {
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
      "page_19",
      "page_20",
      "page_21",
      "page_22",
      "page_23",
      "page_24",
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
    expect(resolveRemotionStepFrame("page_15")).toBe(798);
    expect(resolveRemotionStepFrame("page_16")).toBe(852);
    expect(resolveRemotionStepFrame("page_17")).toBe(942);
    expect(resolveRemotionStepFrame("page_18")).toBe(1032);
    expect(resolveRemotionStepFrame("page_19")).toBe(1086);
    expect(resolveRemotionStepFrame("page_20")).toBe(1176);
    expect(resolveRemotionStepFrame("page_21")).toBe(1266);
    expect(resolveRemotionStepFrame("page_22")).toBe(1356);
    expect(resolveRemotionStepFrame("page_23")).toBe(1446);
    expect(resolveRemotionStepFrame("page_24")).toBe(1536);
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
    expect(resolveRemotionSceneWindow(820)).toMatchObject({
      fromStepId: "page_15",
      toStepId: "page_16",
    });
    expect(resolveRemotionSceneWindow(900)).toMatchObject({
      fromStepId: "page_16",
      toStepId: "page_17",
    });
    expect(resolveRemotionSceneWindow(980)).toMatchObject({
      fromStepId: "page_17",
      toStepId: "page_18",
    });
    expect(resolveRemotionSceneWindow(1050)).toMatchObject({
      fromStepId: "page_18",
      toStepId: "page_19",
    });
    expect(resolveRemotionSceneWindow(1120)).toMatchObject({
      fromStepId: "page_19",
      toStepId: "page_20",
    });
    expect(resolveRemotionSceneWindow(1230)).toMatchObject({
      fromStepId: "page_20",
      toStepId: "page_21",
    });
    expect(resolveRemotionSceneWindow(1320)).toMatchObject({
      fromStepId: "page_21",
      toStepId: "page_22",
    });
    expect(resolveRemotionSceneWindow(1410)).toMatchObject({
      fromStepId: "page_22",
      toStepId: "page_23",
    });
    expect(resolveRemotionSceneWindow(1500)).toMatchObject({
      fromStepId: "page_23",
      toStepId: "page_24",
    });
  });

  it("keeps enough total duration for a settled page 24 hold", () => {
    expect(resolveRemotionStepFrame("page_24")).toBeLessThan(1596);
    expect(resolveRemotionStepFrame("page_24")).toBeGreaterThan(
      resolveRemotionStepFrame("page_23"),
    );
  });
});
