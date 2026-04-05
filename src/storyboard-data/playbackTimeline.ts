type PlaybackFrameInput = {
  fromFrame: number;
  toFrame: number;
  durationMs: number;
  elapsedMs: number;
};

type PlaybackDurationInput = {
  fromFrame: number;
  toFrame: number;
  fps: number;
  durationScale: number;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export function resolvePlaybackProgress(input: {
  durationMs: number;
  elapsedMs: number;
}) {
  if (input.durationMs <= 0) {
    return 1;
  }

  return clamp01(input.elapsedMs / input.durationMs);
}

export function resolvePlaybackFrame(input: PlaybackFrameInput) {
  if (input.durationMs <= 0 || input.fromFrame === input.toFrame) {
    return input.toFrame;
  }

  const progress = resolvePlaybackProgress({
    durationMs: input.durationMs,
    elapsedMs: input.elapsedMs,
  });

  return input.fromFrame + (input.toFrame - input.fromFrame) * progress;
}

export function resolvePlaybackDurationMs(input: PlaybackDurationInput) {
  const frameDistance = Math.abs(input.toFrame - input.fromFrame);

  if (frameDistance === 0 || input.fps <= 0) {
    return 0;
  }

  return (frameDistance / input.fps) * 1000 * input.durationScale;
}
