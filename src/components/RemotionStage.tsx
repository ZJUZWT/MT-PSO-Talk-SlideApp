import {useEffect, useMemo, useRef, useState} from "react";
import type {StoryStepId, VariantId} from "../storyboard-data/pso-workbench-types";
import {SceneSvg} from "../remotion/Composition";
import {REMOTION_PLAYER_CONFIG, resolveRemotionStepFrame} from "../remotion/embed";
import {
  resolvePlaybackDurationMs,
  resolvePlaybackFrame,
} from "../storyboard-data/playbackTimeline";

type RemotionStageProps = {
  motionDurationScale: number;
  stepId: StoryStepId;
  variantId: VariantId;
};

export function RemotionStage({
  motionDurationScale,
  stepId,
  variantId,
}: RemotionStageProps) {
  const animationHandleRef = useRef<number | null>(null);
  const initialFrame = resolveRemotionStepFrame(stepId);
  const lastAppliedFrameRef = useRef<number>(initialFrame);
  const [currentFrame, setCurrentFrame] = useState(initialFrame);
  const [isAnimating, setIsAnimating] = useState(false);
  const targetFrame = useMemo(() => resolveRemotionStepFrame(stepId), [stepId]);
  const effectiveDurationMs = useMemo(() => {
    return resolvePlaybackDurationMs({
      fromFrame: lastAppliedFrameRef.current,
      toFrame: targetFrame,
      fps: REMOTION_PLAYER_CONFIG.fps,
      durationScale: motionDurationScale,
    });
  }, [motionDurationScale, targetFrame]);

  useEffect(() => {
    const stopAnimation = () => {
      if (animationHandleRef.current !== null) {
        cancelAnimationFrame(animationHandleRef.current);
        animationHandleRef.current = null;
      }
    };

    const applyFrame = (frame: number) => {
      if (lastAppliedFrameRef.current === frame) {
        return;
      }

      lastAppliedFrameRef.current = frame;
      setCurrentFrame(frame);
    };

    stopAnimation();
    const fromFrame = lastAppliedFrameRef.current;
    setCurrentFrame(fromFrame);
    const shouldAnimate = fromFrame !== targetFrame;
    setIsAnimating(shouldAnimate);

    if (!shouldAnimate) {
      lastAppliedFrameRef.current = targetFrame;
      setCurrentFrame(targetFrame);
      setIsAnimating(false);
      return stopAnimation;
    }

    const startedAt = performance.now();

    const tick = (now: number) => {
      const elapsedMs = now - startedAt;
      const progress =
        effectiveDurationMs <= 0 ? 1 : Math.min(1, elapsedMs / effectiveDurationMs);
      const nextFrame = resolvePlaybackFrame({
        fromFrame,
        toFrame: targetFrame,
        durationMs: effectiveDurationMs,
        elapsedMs,
      });

      applyFrame(nextFrame);

      if (progress < 1) {
        animationHandleRef.current = requestAnimationFrame(tick);
        return;
      }

      animationHandleRef.current = null;
      lastAppliedFrameRef.current = targetFrame;
      setCurrentFrame(targetFrame);
      setIsAnimating(false);
    };

    animationHandleRef.current = requestAnimationFrame(tick);

    return stopAnimation;
  }, [
    effectiveDurationMs,
    targetFrame,
    variantId,
  ]);

  return (
    <div
      className="stage-runtime"
      data-current-frame={currentFrame}
      data-animating={isAnimating ? "true" : "false"}
      data-motion-scale={motionDurationScale}
    >
      <SceneSvg frame={currentFrame} variantId={variantId} />
    </div>
  );
}
