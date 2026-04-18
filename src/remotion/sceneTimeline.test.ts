import {describe, expect, it} from "vitest";
import {resolveRemotionStepFrame} from "./embed";
import {
  REMOTION_STEP_SEQUENCE,
  resolveRemotionSceneWindow,
} from "./sceneTimeline";

describe("remotion timeline", () => {
  it("extends the canonical step sequence through page 27", () => {
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
      "page_20",
      "page_21",
      "page_22",
      "page_23",
      "page_24",
      "page_25",
      "page_26",
      "page_27",
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
    expect(resolveRemotionStepFrame("page_10")).toBe(984);
    expect(resolveRemotionStepFrame("page_11")).toBe(1074);
    expect(resolveRemotionStepFrame("page_12")).toBe(1181);
    expect(resolveRemotionStepFrame("page_13")).toBe(1288);
    expect(resolveRemotionStepFrame("page_14")).toBe(1395);
    expect(resolveRemotionStepFrame("page_13_img")).toBe(1455);
    expect(resolveRemotionStepFrame("page_15_img")).toBe(1515);
    expect(resolveRemotionStepFrame("page_15")).toBe(1575);
    expect(resolveRemotionStepFrame("page_16")).toBe(1682);
    expect(resolveRemotionStepFrame("page_17")).toBe(1789);
    expect(resolveRemotionStepFrame("page_18")).toBe(1896);
    expect(resolveRemotionStepFrame("page_18_img")).toBe(1956);
    expect(resolveRemotionStepFrame("page_19")).toBe(2016);
    expect(resolveRemotionStepFrame("page_20")).toBe(2123);
    expect(resolveRemotionStepFrame("page_21")).toBe(2194);
    expect(resolveRemotionStepFrame("page_22")).toBe(2265);
    expect(resolveRemotionStepFrame("page_23")).toBe(2336);
    expect(resolveRemotionStepFrame("page_24")).toBe(2407);
    expect(resolveRemotionStepFrame("page_25")).toBe(2478);
    expect(resolveRemotionStepFrame("page_26")).toBe(2549);
    expect(resolveRemotionStepFrame("page_27")).toBe(2620);
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
    expect(resolveRemotionSceneWindow(918)).toMatchObject({
      fromStepId: "page_09",
      toStepId: "page_10",
    });
    expect(resolveRemotionSceneWindow(1234)).toMatchObject({
      fromStepId: "page_12",
      toStepId: "page_13",
    });
    expect(resolveRemotionSceneWindow(1341)).toMatchObject({
      fromStepId: "page_13",
      toStepId: "page_14",
    });
    expect(resolveRemotionSceneWindow(1425)).toMatchObject({
      fromStepId: "page_14",
      toStepId: "page_13_img",
    });
    expect(resolveRemotionSceneWindow(1485)).toMatchObject({
      fromStepId: "page_13_img",
      toStepId: "page_15_img",
    });
    expect(resolveRemotionSceneWindow(1545)).toMatchObject({
      fromStepId: "page_15_img",
      toStepId: "page_15",
    });
    expect(resolveRemotionSceneWindow(1628)).toMatchObject({
      fromStepId: "page_15",
      toStepId: "page_16",
    });
    expect(resolveRemotionSceneWindow(1735)).toMatchObject({
      fromStepId: "page_16",
      toStepId: "page_17",
    });
    expect(resolveRemotionSceneWindow(1842)).toMatchObject({
      fromStepId: "page_17",
      toStepId: "page_18",
    });
    expect(resolveRemotionSceneWindow(1926)).toMatchObject({
      fromStepId: "page_18",
      toStepId: "page_18_img",
    });
    expect(resolveRemotionSceneWindow(1986)).toMatchObject({
      fromStepId: "page_18_img",
      toStepId: "page_19",
    });
    expect(resolveRemotionSceneWindow(2069)).toMatchObject({
      fromStepId: "page_19",
      toStepId: "page_20",
    });
    expect(resolveRemotionSceneWindow(2158)).toMatchObject({
      fromStepId: "page_20",
      toStepId: "page_21",
    });
    expect(resolveRemotionSceneWindow(2229)).toMatchObject({
      fromStepId: "page_21",
      toStepId: "page_22",
    });
    expect(resolveRemotionSceneWindow(2300)).toMatchObject({
      fromStepId: "page_22",
      toStepId: "page_23",
    });
    expect(resolveRemotionSceneWindow(2371)).toMatchObject({
      fromStepId: "page_23",
      toStepId: "page_24",
    });
    expect(resolveRemotionSceneWindow(2442)).toMatchObject({
      fromStepId: "page_24",
      toStepId: "page_25",
    });
    expect(resolveRemotionSceneWindow(2513)).toMatchObject({
      fromStepId: "page_25",
      toStepId: "page_26",
    });
    expect(resolveRemotionSceneWindow(2584)).toMatchObject({
      fromStepId: "page_26",
      toStepId: "page_27",
    });
  });

  it("keeps enough total duration for a settled page 27 hold", () => {
    expect(resolveRemotionStepFrame("page_27")).toBeLessThan(2740);
    expect(resolveRemotionStepFrame("page_27")).toBeGreaterThan(
      resolveRemotionStepFrame("page_26"),
    );
  });
});
