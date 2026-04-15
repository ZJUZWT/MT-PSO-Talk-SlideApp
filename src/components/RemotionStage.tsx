import type {RefObject} from "react";
import {useEffect, useMemo, useRef, useState} from "react";
import type {StoryStepId, VariantId} from "../storyboard-data/pso-workbench-types";
import {SceneSvg} from "../remotion/Composition";
import {REMOTION_PLAYER_CONFIG, resolveRemotionStepFrame} from "../remotion/embed";
import {
  resolvePlaybackDurationMs,
  resolvePlaybackFrame,
} from "../storyboard-data/playbackTimeline";

type RemotionStageProps = {
  debugFrame?: number | null;
  jumpToStepInstant?: boolean;
  motionDurationScale: number;
  runtimeRef?: RefObject<HTMLDivElement | null>;
  stepId: StoryStepId;
  variantId: VariantId;
};

export function RemotionStage({
  debugFrame = null,
  jumpToStepInstant = false,
  motionDurationScale,
  runtimeRef,
  stepId,
  variantId,
}: RemotionStageProps) {
  const animationHandleRef = useRef<number | null>(null);
  const initialFrame = debugFrame ?? resolveRemotionStepFrame(stepId);
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

    if (debugFrame !== null) {
      stopAnimation();
      lastAppliedFrameRef.current = debugFrame;
      setCurrentFrame(debugFrame);
      setIsAnimating(false);

      return stopAnimation;
    }

    if (jumpToStepInstant) {
      stopAnimation();
      lastAppliedFrameRef.current = targetFrame;
      setCurrentFrame(targetFrame);
      setIsAnimating(false);

      return stopAnimation;
    }

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
    debugFrame,
    effectiveDurationMs,
    jumpToStepInstant,
    targetFrame,
    variantId,
  ]);

  return (
    <div
      className="stage-runtime"
      ref={runtimeRef}
      data-current-frame={currentFrame}
      data-debug-frame={debugFrame !== null ? String(debugFrame) : undefined}
      data-animating={isAnimating ? "true" : "false"}
      data-motion-scale={motionDurationScale}
    >
      <SceneSvg frame={currentFrame} variantId={variantId} />
    </div>
  );
}
