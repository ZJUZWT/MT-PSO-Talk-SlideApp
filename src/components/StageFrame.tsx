import type {WorkbenchState} from "../state/useWorkbenchState";
import {RemotionStage} from "./RemotionStage";

type StageFrameProps = {
  state: WorkbenchState;
  motionDurationScale: number;
};

export function StageFrame({state, motionDurationScale}: StageFrameProps) {
  const shouldShowKicker = state.currentStep.focusTarget !== state.currentStep.label;

  return (
    <section className="stage-frame" aria-label="Animation stage">
      <header className="stage-heading">
        {shouldShowKicker ? (
          <p className="stage-kicker">{state.currentStep.focusTarget}</p>
        ) : null}
        <h1 className="stage-title">{state.currentStep.label}</h1>
        <p className="stage-caption">{state.currentStep.caption}</p>
      </header>

      <RemotionStage
        motionDurationScale={motionDurationScale}
        variantId={state.variantId}
        stepId={state.stepId}
      />
    </section>
  );
}
