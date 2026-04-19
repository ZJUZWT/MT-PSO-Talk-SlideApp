import {describe, expect, it} from "vitest";
import {resolveRemotionStepFrame} from "./embed";
import {
  REMOTION_STEP_SEQUENCE,
  resolveRemotionSceneWindow,
} from "./sceneTimeline";

describe("remotion timeline", () => {
  it("extends the canonical step sequence through page 29", () => {
    expect(REMOTION_STEP_SEQUENCE).toEqual([
      "page_01",
      "page_02",
      "page_03",
      "page_04",
      "page_04_data",
      "page_05",
      "page_06",
      "page_07",
      "page_08",
      "page_09",
      "page_09_img",
      "page_10",
      "page_11",
      "page_12",
      "page_13",
      "page_14",
      "page_13_img",
      "page_15_img",
      "page_15",
      "page_16",
      "page_17",
      "page_18",
      "page_18_img",
      "page_19",
      "page_21",
      "page_22",
      "page_23",
      "page_24",
      "page_25",
      "page_26",
      "page_27",
      "page_28",
      "page_29",
    ]);
  });

  it("assigns frame anchors for the placeholder-expanded loop chapter after SharedCode", () => {
    expect(resolveRemotionStepFrame("page_04")).toBe(288);
    expect(resolveRemotionStepFrame("page_04_data")).toBe(348);
    expect(resolveRemotionStepFrame("page_05")).toBe(492);
    expect(resolveRemotionStepFrame("page_06")).toBe(582);
    expect(resolveRemotionStepFrame("page_07")).toBe(672);
    expect(resolveRemotionStepFrame("page_08")).toBe(762);
    expect(resolveRemotionStepFrame("page_09")).toBe(852);
    expect(resolveRemotionStepFrame("page_09_img")).toBe(912);
    expect(resolveRemotionStepFrame("page_10")).toBe(1164);
    expect(resolveRemotionStepFrame("page_11")).toBe(1254);
    expect(resolveRemotionStepFrame("page_12")).toBe(1361);
    expect(resolveRemotionStepFrame("page_13")).toBe(1468);
    expect(resolveRemotionStepFrame("page_14")).toBe(1575);
    expect(resolveRemotionStepFrame("page_13_img")).toBe(1635);
    expect(resolveRemotionStepFrame("page_15_img")).toBe(1695);
    expect(resolveRemotionStepFrame("page_15")).toBe(1800);
    expect(resolveRemotionStepFrame("page_16")).toBe(1907);
    expect(resolveRemotionStepFrame("page_17")).toBe(2039);
    expect(resolveRemotionStepFrame("page_18")).toBe(2146);
    expect(resolveRemotionStepFrame("page_18_img")).toBe(2206);
    expect(resolveRemotionStepFrame("page_19")).toBe(2314);
    expect(resolveRemotionStepFrame("page_21")).toBe(2389);
    expect(resolveRemotionStepFrame("page_22")).toBe(2460);
    expect(resolveRemotionStepFrame("page_23")).toBe(2531);
    expect(resolveRemotionStepFrame("page_24")).toBe(2602);
    expect(resolveRemotionStepFrame("page_25")).toBe(2673);
    expect(resolveRemotionStepFrame("page_26")).toBe(2744);
    expect(resolveRemotionStepFrame("page_27")).toBe(2815);
    expect(resolveRemotionStepFrame("page_28")).toBe(2903);
    expect(resolveRemotionStepFrame("page_29")).toBe(2983);
  });

  it("builds scene windows across the placeholder-expanded loop segment", () => {
    expect(resolveRemotionSceneWindow(360)).toMatchObject({
      fromStepId: "page_04_data",
      toStepId: "page_05",
    });
    expect(resolveRemotionSceneWindow(627)).toMatchObject({
      fromStepId: "page_06",
      toStepId: "page_07",
    });
    expect(resolveRemotionSceneWindow(807)).toMatchObject({
      fromStepId: "page_08",
      toStepId: "page_09",
    });
    expect(resolveRemotionSceneWindow(890)).toMatchObject({
      fromStepId: "page_09",
      toStepId: "page_09_img",
    });
    expect(resolveRemotionSceneWindow(948)).toMatchObject({
      fromStepId: "page_09_img",
      toStepId: "page_10",
    });
    expect(resolveRemotionSceneWindow(1210)).toMatchObject({
      fromStepId: "page_10",
      toStepId: "page_11",
    });
    expect(resolveRemotionSceneWindow(1414)).toMatchObject({
      fromStepId: "page_12",
      toStepId: "page_13",
    });
    expect(resolveRemotionSceneWindow(1521)).toMatchObject({
      fromStepId: "page_13",
      toStepId: "page_14",
    });
    expect(resolveRemotionSceneWindow(1605)).toMatchObject({
      fromStepId: "page_14",
      toStepId: "page_13_img",
    });
    expect(resolveRemotionSceneWindow(1665)).toMatchObject({
      fromStepId: "page_13_img",
      toStepId: "page_15_img",
    });
    expect(resolveRemotionSceneWindow(1755)).toMatchObject({
      fromStepId: "page_15_img",
      toStepId: "page_15",
    });
    expect(resolveRemotionSceneWindow(1840)).toMatchObject({
      fromStepId: "page_15",
      toStepId: "page_16",
    });
    expect(resolveRemotionSceneWindow(1947)).toMatchObject({
      fromStepId: "page_16",
      toStepId: "page_17",
    });
    expect(resolveRemotionSceneWindow(2054)).toMatchObject({
      fromStepId: "page_17",
      toStepId: "page_18",
    });
    expect(resolveRemotionSceneWindow(2168)).toMatchObject({
      fromStepId: "page_18",
      toStepId: "page_18_img",
    });
    expect(resolveRemotionSceneWindow(2263)).toMatchObject({
      fromStepId: "page_18_img",
      toStepId: "page_19",
    });
    expect(resolveRemotionSceneWindow(2369)).toMatchObject({
      fromStepId: "page_19",
      toStepId: "page_21",
    });
    expect(resolveRemotionSceneWindow(2388)).toMatchObject({
      fromStepId: "page_19",
      toStepId: "page_21",
    });
    expect(resolveRemotionSceneWindow(2454)).toMatchObject({
      fromStepId: "page_21",
      toStepId: "page_22",
    });
    expect(resolveRemotionSceneWindow(2526)).toMatchObject({
      fromStepId: "page_22",
      toStepId: "page_23",
    });
    expect(resolveRemotionSceneWindow(2597)).toMatchObject({
      fromStepId: "page_23",
      toStepId: "page_24",
    });
    expect(resolveRemotionSceneWindow(2668)).toMatchObject({
      fromStepId: "page_24",
      toStepId: "page_25",
    });
    expect(resolveRemotionSceneWindow(2739)).toMatchObject({
      fromStepId: "page_25",
      toStepId: "page_26",
    });
    expect(resolveRemotionSceneWindow(2810)).toMatchObject({
      fromStepId: "page_26",
      toStepId: "page_27",
    });
    expect(resolveRemotionSceneWindow(2870)).toMatchObject({
      fromStepId: "page_27",
      toStepId: "page_28",
    });
    expect(resolveRemotionSceneWindow(2950)).toMatchObject({
      fromStepId: "page_28",
      toStepId: "page_29",
    });
  });

  it("keeps enough total duration for a settled page 29 hold", () => {
    expect(resolveRemotionStepFrame("page_29")).toBeLessThan(3135);
    expect(resolveRemotionStepFrame("page_29")).toBeGreaterThan(
      resolveRemotionStepFrame("page_28"),
    );
  });
});
