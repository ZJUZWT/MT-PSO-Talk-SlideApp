import type {RefObject} from "react";
import type {GeometrySketchDefinition} from "../harness/slide-geometry/render/geometry-sketch-types";
import {GeometrySketchScene} from "../harness/slide-geometry/render/GeometrySketchScene";
import type {WorkbenchState} from "../state/useWorkbenchState";
import {RemotionStage} from "./RemotionStage";
import {resolveStagePromptOverlayContent} from "./stagePromptOverlayContent";

type StageFrameProps = {
  debugFrame?: number | null;
  jumpToStepInstant?: boolean;
  state: WorkbenchState;
  motionDurationScale: number;
  runtimeRef?: RefObject<HTMLDivElement | null>;
  runtimeOnly?: boolean;
  sketchDefinition?: GeometrySketchDefinition | null;
};

function resolvePromptTitleText(lines: readonly string[]) {
  return lines
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .reduce((result, line, index) => {
      if (index === 0) {
        return line;
      }

      const previousChar = result.slice(-1);
      const startsWithAscii = /^[A-Za-z0-9(]/.test(line);
      const endsWithJoinPunctuation = /[，。！？：；、,.;!?]$/.test(previousChar);

      return `${result}${startsWithAscii && !endsWithJoinPunctuation ? " " : ""}${line}`;
    }, "");
}

export function StageFrame({
  debugFrame = null,
  jumpToStepInstant = false,
  state,
  motionDurationScale,
  runtimeRef,
  runtimeOnly = false,
  sketchDefinition,
}: StageFrameProps) {
  const promptOverlay = resolveStagePromptOverlayContent(state.stepId);
  const isPromptTitle = promptOverlay !== null;
  const shouldShowKicker =
    !isPromptTitle && state.currentStep.focusTarget !== state.currentStep.label;
  const shouldShowCaption = !isPromptTitle;
  const titleText = promptOverlay
    ? resolvePromptTitleText(promptOverlay.lines)
    : state.currentStep.label;
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
      debugFrame={debugFrame}
      jumpToStepInstant={jumpToStepInstant}
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
    <section
      className={`stage-frame${isPromptTitle ? " stage-frame--prompt" : ""}`}
      aria-label="Animation stage"
    >
      <header
        className={`stage-heading${isPromptTitle ? " stage-heading--prompt" : ""}`}
        data-stage-heading-mode={isPromptTitle ? "prompt" : "default"}
      >
        <div
          key={state.stepId}
          className="stage-heading-copy"
          data-stage-heading-copy-mode={isPromptTitle ? "prompt" : "default"}
        >
          {shouldShowKicker ? (
            <p className="stage-kicker">{state.currentStep.focusTarget}</p>
          ) : null}
          <h1
            className="stage-title"
            data-stage-title-variant={isPromptTitle ? "prompt" : "default"}
            aria-label={titleText}
          >
            <span className="stage-title-line">{titleText}</span>
          </h1>
          {isPromptTitle ? (
            <p className="stage-subtitle">{state.currentStep.label}</p>
          ) : null}
          {shouldShowCaption ? (
            <p
              className="stage-caption"
              data-stage-caption-variant={isPromptTitle ? "prompt" : "default"}
            >
              {state.currentStep.caption}
            </p>
          ) : null}
        </div>
      </header>

      {runtime}
    </section>
  );
}
