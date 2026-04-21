import type {StoryStepId} from "../storyboard-data/pso-workbench-types";
import {resolveStagePromptOverlayContent} from "./stagePromptOverlayContent";

type StagePromptOverlayProps = {
  stepId: StoryStepId;
};

export function StagePromptOverlay({stepId}: StagePromptOverlayProps) {
  const content = resolveStagePromptOverlayContent(stepId);

  if (!content) {
    return null;
  }

  return (
    <aside
      className="stage-prompt-overlay"
      data-stage-prompt-step={stepId}
      data-stage-prompt-variant={content.variant ?? "default"}
      data-testid={`stage-prompt-overlay-${stepId}`}
      aria-label="页面问答提示"
    >
      {content.lines.map((line, index) => (
        <p
          key={`${stepId}-${line}-${index}`}
          className="stage-prompt-line"
          data-stage-prompt-emphasis={index === 0 ? "primary" : "secondary"}
        >
          {line}
        </p>
      ))}
    </aside>
  );
}
