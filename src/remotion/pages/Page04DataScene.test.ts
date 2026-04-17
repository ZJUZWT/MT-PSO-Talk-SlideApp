import {describe, expect, it} from "vitest";
import {resolvePage04DataOverlayState} from "./Page04DataScene";

describe("resolvePage04DataOverlayState", () => {
  it("returns null outside the table insertion window", () => {
    expect(resolvePage04DataOverlayState(125)).toBeNull();
    expect(resolvePage04DataOverlayState(198)).toBeNull();
  });

  it("lands page_04_data anchor on a fully visible table", () => {
    const state = resolvePage04DataOverlayState(144);

    expect(state).not.toBeNull();
    expect(state?.overlayOpacity).toBe(1);
    expect(state?.baseOpacity).toBe(0);
    expect(state?.sceneFrame).toBe(126);
  });

  it("fades the data overlay in while keeping the base scene on page_04", () => {
    const state = resolvePage04DataOverlayState(140);

    expect(state).not.toBeNull();
    expect(state?.overlayOpacity ?? 0).toBeGreaterThan(0.7);
    expect(state?.overlayOpacity ?? 0).toBeLessThan(1);
    expect(state?.baseOpacity ?? 1).toBeGreaterThan(0);
    expect(state?.baseOpacity ?? 1).toBeLessThan(0.3);
    expect(state?.sceneFrame).toBe(126);
  });

  it("replays the original page_04 -> page_05 scene after overlay fade-out", () => {
    const nearReplayStart = resolvePage04DataOverlayState(162);
    const replayEnd = resolvePage04DataOverlayState(197);

    expect(nearReplayStart).not.toBeNull();
    expect(nearReplayStart?.overlayOpacity).toBe(0);
    expect(nearReplayStart?.baseOpacity).toBe(1);
    expect(nearReplayStart?.sceneFrame).toBe(126);
    expect(replayEnd?.sceneFrame ?? 0).toBeGreaterThan(nearReplayStart?.sceneFrame ?? 0);
    expect(replayEnd?.sceneFrame ?? 999).toBeLessThan(198);

    expect(replayEnd?.overlayOpacity).toBe(0);
    expect(replayEnd?.baseOpacity).toBe(1);
    expect(replayEnd?.sceneFrame ?? 0).toBeLessThanOrEqual(198);
  });
});
