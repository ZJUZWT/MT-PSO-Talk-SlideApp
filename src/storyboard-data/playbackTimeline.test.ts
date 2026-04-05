import {describe, expect, it} from "vitest";
import {
  resolvePlaybackDurationMs,
  resolvePlaybackFrame,
} from "./playbackTimeline";

describe("playbackTimeline", () => {
  it("matches 1x preview duration to the real 60fps frame span", () => {
    expect(
      resolvePlaybackDurationMs({
        fromFrame: 18,
        toFrame: 54,
        fps: 60,
        durationScale: 1,
      }),
    ).toBe(600);
  });

  it("preserves fractional in-between frames instead of rounding them away", () => {
    expect(
      resolvePlaybackFrame({
        fromFrame: 18,
        toFrame: 54,
        durationMs: 600,
        elapsedMs: 125,
      }),
    ).toBe(25.5);
  });
});
