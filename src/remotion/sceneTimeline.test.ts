import {describe, expect, it} from "vitest";
import {resolveRemotionStepFrame} from "./embed";
import {
  REMOTION_STEP_SEQUENCE,
  resolveRemotionSceneWindow,
} from "./sceneTimeline";

describe("remotion timeline", () => {
  it("extends the canonical step sequence through page 33", () => {
    expect(REMOTION_STEP_SEQUENCE).toEqual([
      "page_00",
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
      "page_24",
      "page_25",
      "page_26",
      "page_27",
      "page_28",
      "page_29",
      "page_30",
      "page_31",
      "page_32",
      "page_33",
    ]);
  });

  it("assigns the new opening anchors before the existing deck frames", () => {
    expect(resolveRemotionStepFrame("page_00")).toBe(18);
    expect(resolveRemotionStepFrame("page_01")).toBe(108);
    expect(resolveRemotionStepFrame("page_02")).toBe(198);
  });

  it("keeps the later order intact while shifting anchors one opening window later", () => {
    expect(resolveRemotionStepFrame("page_04")).toBe(378);
    expect(resolveRemotionStepFrame("page_04_data")).toBe(438);
    expect(resolveRemotionStepFrame("page_05")).toBe(582);
    expect(resolveRemotionStepFrame("page_06")).toBe(672);
    expect(resolveRemotionStepFrame("page_07")).toBe(762);
    expect(resolveRemotionStepFrame("page_08")).toBe(852);
    expect(resolveRemotionStepFrame("page_09")).toBe(942);
    expect(resolveRemotionStepFrame("page_09_img")).toBe(1002);
    expect(resolveRemotionStepFrame("page_10")).toBe(1254);
    expect(resolveRemotionStepFrame("page_11")).toBe(1344);
    expect(resolveRemotionStepFrame("page_12")).toBe(1451);
    expect(resolveRemotionStepFrame("page_13")).toBe(1558);
    expect(resolveRemotionStepFrame("page_14")).toBe(1665);
    expect(resolveRemotionStepFrame("page_13_img")).toBe(1725);
    expect(resolveRemotionStepFrame("page_15_img")).toBe(1785);
    expect(resolveRemotionStepFrame("page_15")).toBe(1890);
    expect(resolveRemotionStepFrame("page_16")).toBe(1997);
    expect(resolveRemotionStepFrame("page_17")).toBe(2129);
    expect(resolveRemotionStepFrame("page_18")).toBe(2236);
    expect(resolveRemotionStepFrame("page_18_img")).toBe(2296);
    expect(resolveRemotionStepFrame("page_19")).toBe(2404);
    expect(resolveRemotionStepFrame("page_21")).toBe(2479);
    expect(resolveRemotionStepFrame("page_22")).toBe(2550);
    expect(resolveRemotionStepFrame("page_24")).toBe(2621);
    expect(resolveRemotionStepFrame("page_25")).toBe(2692);
    expect(resolveRemotionStepFrame("page_26")).toBe(2763);
    expect(resolveRemotionStepFrame("page_27")).toBe(2834);
    expect(resolveRemotionStepFrame("page_28")).toBe(2912);
    expect(resolveRemotionStepFrame("page_29")).toBe(2992);
    expect(resolveRemotionStepFrame("page_30")).toBe(3063);
    expect(resolveRemotionStepFrame("page_31")).toBe(3134);
    expect(resolveRemotionStepFrame("page_32")).toBe(3205);
    expect(resolveRemotionStepFrame("page_33")).toBe(3285);
  });

  it("builds scene windows for the new opening handoff before the existing loop segment", () => {
    expect(resolveRemotionSceneWindow(12)).toMatchObject({
      fromStepId: "page_00",
      toStepId: "page_00",
    });
    expect(resolveRemotionSceneWindow(40)).toMatchObject({
      fromStepId: "page_00",
      toStepId: "page_01",
    });
    expect(resolveRemotionSceneWindow(150)).toMatchObject({
      fromStepId: "page_01",
      toStepId: "page_02",
    });
    expect(resolveRemotionSceneWindow(450)).toMatchObject({
      fromStepId: "page_04_data",
      toStepId: "page_05",
    });
    expect(resolveRemotionSceneWindow(717)).toMatchObject({
      fromStepId: "page_06",
      toStepId: "page_07",
    });
    expect(resolveRemotionSceneWindow(897)).toMatchObject({
      fromStepId: "page_08",
      toStepId: "page_09",
    });
    expect(resolveRemotionSceneWindow(980)).toMatchObject({
      fromStepId: "page_09",
      toStepId: "page_09_img",
    });
    expect(resolveRemotionSceneWindow(1038)).toMatchObject({
      fromStepId: "page_09_img",
      toStepId: "page_10",
    });
    expect(resolveRemotionSceneWindow(1300)).toMatchObject({
      fromStepId: "page_10",
      toStepId: "page_11",
    });
    expect(resolveRemotionSceneWindow(1504)).toMatchObject({
      fromStepId: "page_12",
      toStepId: "page_13",
    });
    expect(resolveRemotionSceneWindow(1611)).toMatchObject({
      fromStepId: "page_13",
      toStepId: "page_14",
    });
    expect(resolveRemotionSceneWindow(1695)).toMatchObject({
      fromStepId: "page_14",
      toStepId: "page_13_img",
    });
    expect(resolveRemotionSceneWindow(1755)).toMatchObject({
      fromStepId: "page_13_img",
      toStepId: "page_15_img",
    });
    expect(resolveRemotionSceneWindow(1845)).toMatchObject({
      fromStepId: "page_15_img",
      toStepId: "page_15",
    });
    expect(resolveRemotionSceneWindow(1930)).toMatchObject({
      fromStepId: "page_15",
      toStepId: "page_16",
    });
    expect(resolveRemotionSceneWindow(2037)).toMatchObject({
      fromStepId: "page_16",
      toStepId: "page_17",
    });
    expect(resolveRemotionSceneWindow(2144)).toMatchObject({
      fromStepId: "page_17",
      toStepId: "page_18",
    });
    expect(resolveRemotionSceneWindow(2258)).toMatchObject({
      fromStepId: "page_18",
      toStepId: "page_18_img",
    });
    expect(resolveRemotionSceneWindow(2353)).toMatchObject({
      fromStepId: "page_18_img",
      toStepId: "page_19",
    });
    expect(resolveRemotionSceneWindow(2459)).toMatchObject({
      fromStepId: "page_19",
      toStepId: "page_21",
    });
    expect(resolveRemotionSceneWindow(2478)).toMatchObject({
      fromStepId: "page_19",
      toStepId: "page_21",
    });
    expect(resolveRemotionSceneWindow(2544)).toMatchObject({
      fromStepId: "page_21",
      toStepId: "page_22",
    });
    expect(resolveRemotionSceneWindow(2616)).toMatchObject({
      fromStepId: "page_22",
      toStepId: "page_24",
    });
    expect(resolveRemotionSceneWindow(2687)).toMatchObject({
      fromStepId: "page_24",
      toStepId: "page_25",
    });
    expect(resolveRemotionSceneWindow(2758)).toMatchObject({
      fromStepId: "page_25",
      toStepId: "page_26",
    });
    expect(resolveRemotionSceneWindow(2829)).toMatchObject({
      fromStepId: "page_26",
      toStepId: "page_27",
    });
    expect(resolveRemotionSceneWindow(2900)).toMatchObject({
      fromStepId: "page_27",
      toStepId: "page_28",
    });
    expect(resolveRemotionSceneWindow(2960)).toMatchObject({
      fromStepId: "page_28",
      toStepId: "page_29",
    });
    expect(resolveRemotionSceneWindow(3040)).toMatchObject({
      fromStepId: "page_29",
      toStepId: "page_30",
    });
    expect(resolveRemotionSceneWindow(3090)).toMatchObject({
      fromStepId: "page_30",
      toStepId: "page_31",
    });
    expect(resolveRemotionSceneWindow(3170)).toMatchObject({
      fromStepId: "page_31",
      toStepId: "page_32",
    });
    expect(resolveRemotionSceneWindow(3250)).toMatchObject({
      fromStepId: "page_32",
      toStepId: "page_33",
    });
  });

  it("keeps enough total duration for a settled page 33 hold", () => {
    expect(resolveRemotionStepFrame("page_33")).toBeLessThan(3500);
    expect(resolveRemotionStepFrame("page_33")).toBeGreaterThan(
      resolveRemotionStepFrame("page_32"),
    );
  });
});
