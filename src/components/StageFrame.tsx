import type {RefObject} from "react";
import type {GeometrySketchDefinition} from "../harness/slide-geometry/render/geometry-sketch-types";
import {GeometrySketchScene} from "../harness/slide-geometry/render/GeometrySketchScene";
import type {WorkbenchState} from "../state/useWorkbenchState";
import {RemotionStage} from "./RemotionStage";

type StageFrameProps = {
  state: WorkbenchState;
  motionDurationScale: number;
  runtimeRef?: RefObject<HTMLDivElement | null>;
  runtimeOnly?: boolean;
  sketchDefinition?: GeometrySketchDefinition | null;
};

export function StageFrame({
  state,
  motionDurationScale,
  runtimeRef,
  runtimeOnly = false,
  sketchDefinition,
}: StageFrameProps) {
  const shouldShowKicker = state.currentStep.focusTarget !== state.currentStep.label;
  const runtime = sketchDefinition ? (
    <div
      className="stage-runtime"
      ref={runtimeRef}
      data-stage-mode="sketch"
      data-sketch-id={sketchDefinition.id}
    >
      <GeometrySketchScene sketch={sketchDefinition} />
    </div>
  ) : (
    <RemotionStage
      motionDurationScale={motionDurationScale}
      runtimeRef={runtimeRef}
      variantId={state.variantId}
      stepId={state.stepId}
    />
  );

  if (runtimeOnly) {
    return runtime;
  }

  return (
    <section className="stage-frame" aria-label="Animation stage">
      <header className="stage-heading">
        {shouldShowKicker ? (
          <p className="stage-kicker">{state.currentStep.focusTarget}</p>
        ) : null}
        <h1 className="stage-title">{state.currentStep.label}</h1>
        <p className="stage-caption">{state.currentStep.caption}</p>
      </header>

      {runtime}
    </section>
  );
}
