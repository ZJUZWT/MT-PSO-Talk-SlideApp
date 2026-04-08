import type {RefObject} from "react";
import {useMemo, useState} from "react";
import type {WorkbenchState} from "../state/useWorkbenchState";
import {CaptureClipboardButton} from "./CaptureClipboardButton";

type ReviewHudProps = {
  stageTargetRef: RefObject<HTMLDivElement | null>;
  state: WorkbenchState;
};

type ReviewAxisId = "blocker" | "routing" | "balance" | "focus";
type ReviewScores = Record<ReviewAxisId, number>;

const REVIEW_AXES: Array<{id: ReviewAxisId; label: string}> = [
  {id: "blocker", label: "Blocker"},
  {id: "routing", label: "Routing"},
  {id: "balance", label: "Balance"},
  {id: "focus", label: "Focus"},
];

const EMPTY_SCORES: ReviewScores = {
  blocker: 0,
  routing: 0,
  balance: 0,
  focus: 0,
};

function formatReviewScore(scores: ReviewScores) {
  const total = REVIEW_AXES.reduce((sum, axis) => sum + scores[axis.id], 0);

  return (total / REVIEW_AXES.length).toFixed(1);
}

function resolveReviewVerdict(scores: ReviewScores) {
  const averageScore = Number(formatReviewScore(scores));

  if (scores.blocker <= 2) {
    return "先清 blocker";
  }

  if (averageScore < 4) {
    return "继续迭代";
  }

  return "可以归档";
}

export function ReviewHud({stageTargetRef, state}: ReviewHudProps) {
  const [scoresByStep, setScoresByStep] = useState<
    Partial<Record<WorkbenchState["stepId"], ReviewScores>>
  >({});
  const currentStepIndex = state.steps.findIndex((step) => step.id === state.stepId);
  const activeScores = scoresByStep[state.stepId] ?? EMPTY_SCORES;
  const reviewScore = useMemo(() => {
    return formatReviewScore(activeScores);
  }, [activeScores]);
  const reviewVerdict = useMemo(() => {
    return resolveReviewVerdict(activeScores);
  }, [activeScores]);

  return (
    <aside
      className="review-hud"
      aria-label="Review HUD"
      data-capture-ignore="true"
    >
      <div className="review-hud-nav">
        <button
          type="button"
          className="review-hud-chip"
          onClick={state.goToPreviousStep}
          disabled={currentStepIndex <= 0}
        >
          Prev
        </button>

        <label className="review-hud-field">
          <span className="review-hud-label">Review Step</span>
          <select
            className="review-hud-select"
            aria-label="Review Step"
            value={state.stepId}
            onChange={(event) => {
              state.setStepId(event.target.value as WorkbenchState["stepId"]);
            }}
          >
            {state.steps.map((step) => (
              <option key={step.id} value={step.id}>
                {step.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className="review-hud-chip"
          onClick={state.goToNextStep}
          disabled={currentStepIndex >= state.steps.length - 1}
        >
          Next
        </button>
      </div>

      <CaptureClipboardButton
        ariaLabel="复制当前舞台截图"
        buttonText="复制当前舞台截图"
        stepId={state.stepId}
        targetRef={stageTargetRef}
        title="复制当前舞台截图"
        variant="inline"
      />

      <div className="review-score-grid">
        {REVIEW_AXES.map((axis) => (
          <label key={axis.id} className="review-score-field">
            <span className="review-score-label">{axis.label}</span>
            <select
              className="review-score-select"
              aria-label={axis.label}
              value={activeScores[axis.id]}
              onChange={(event) => {
                const nextValue = Number(event.target.value);

                setScoresByStep((current) => ({
                  ...current,
                  [state.stepId]: {
                    ...(current[state.stepId] ?? EMPTY_SCORES),
                    [axis.id]: nextValue,
                  },
                }));
              }}
            >
              {[0, 1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div className="review-hud-summary">
        <p className="review-hud-summary-copy">Rendered self-check</p>
        <output className="review-hud-score" aria-label="Review Score">
          {reviewScore} / 5.0
        </output>
        <p className="review-hud-verdict">{reviewVerdict}</p>
      </div>
    </aside>
  );
}
