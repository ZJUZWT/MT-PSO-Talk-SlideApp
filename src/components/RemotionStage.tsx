import {useEffect, useMemo, useRef, useState} from "react";
import type {StoryStepId, VariantId} from "../storyboard-data/pso-workbench-types";
import {SceneSvg} from "../remotion/Composition";
import {resolveRemotionStepFrame} from "../remotion/embed";
import {resolvePlaybackFrame} from "../storyboard-data/playbackTimeline";

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
    const frameDistance = Math.abs(targetFrame - lastAppliedFrameRef.current);

    if (frameDistance === 0) {
      return 0;
    }

    const baseDurationMs = Math.max(320, Math.min(440, frameDistance * 12));

    return Math.max(120, Math.round(baseDurationMs * motionDurationScale));
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
