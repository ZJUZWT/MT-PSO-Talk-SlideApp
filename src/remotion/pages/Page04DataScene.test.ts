import {describe, expect, it} from "vitest";
import {resolveRemotionStepFrame} from "../embed";
import {resolvePage04DataOverlayState} from "./Page04DataScene";

const PAGE04_FRAME = resolveRemotionStepFrame("page_04");
const PAGE04_DATA_FRAME = resolveRemotionStepFrame("page_04_data");
const PAGE05_FRAME = resolveRemotionStepFrame("page_05");

describe("resolvePage04DataOverlayState", () => {
  it("returns null outside the table insertion window", () => {
    expect(resolvePage04DataOverlayState(PAGE04_FRAME - 1)).toBeNull();
    expect(resolvePage04DataOverlayState(PAGE05_FRAME)).toBeNull();
  });

  it("lands page_04_data anchor on a fully visible table", () => {
    const state = resolvePage04DataOverlayState(PAGE04_DATA_FRAME);

    expect(state).not.toBeNull();
    expect(state?.overlayOpacity).toBe(1);
    expect(state?.baseOpacity).toBe(0);
    expect(state?.sceneFrame).toBe(PAGE04_FRAME);
  });

  it("fades the data overlay in while keeping the base scene on page_04", () => {
    const enterFrame = Math.max(
      PAGE04_FRAME + 1,
      PAGE04_FRAME + Math.floor((PAGE04_DATA_FRAME - PAGE04_FRAME) * 0.8),
    );
    const state = resolvePage04DataOverlayState(enterFrame);

    expect(state).not.toBeNull();
    expect(state?.overlayOpacity ?? 0).toBeGreaterThan(0.7);
    expect(state?.overlayOpacity ?? 0).toBeLessThan(1);
    expect(state?.baseOpacity ?? 1).toBeGreaterThan(0);
    expect(state?.baseOpacity ?? 1).toBeLessThan(0.3);
    expect(state?.sceneFrame).toBe(PAGE04_FRAME);
  });

  it("replays the original page_04 -> page_05 scene after overlay fade-out", () => {
    const replayStartFrame = Math.max(PAGE04_DATA_FRAME, PAGE05_FRAME - 36);
    const nearReplayStart = resolvePage04DataOverlayState(replayStartFrame + 1);
    const replayEnd = resolvePage04DataOverlayState(PAGE05_FRAME - 1);

    expect(nearReplayStart).not.toBeNull();
    expect(nearReplayStart?.overlayOpacity).toBe(0);
    expect(nearReplayStart?.baseOpacity).toBe(1);
    expect(nearReplayStart?.sceneFrame ?? 0).toBeGreaterThanOrEqual(PAGE04_FRAME);
    expect(replayEnd?.sceneFrame ?? 0).toBeGreaterThan(nearReplayStart?.sceneFrame ?? 0);
    expect(replayEnd?.sceneFrame ?? 999).toBeLessThan(PAGE05_FRAME);

    expect(replayEnd?.overlayOpacity).toBe(0);
    expect(replayEnd?.baseOpacity).toBe(1);
    expect(replayEnd?.sceneFrame ?? 0).toBeLessThanOrEqual(PAGE05_FRAME);
  });
});
