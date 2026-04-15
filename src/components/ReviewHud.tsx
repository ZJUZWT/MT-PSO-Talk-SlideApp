import type {RefObject} from "react";
import {useMemo, useState} from "react";
import {
  GEOMETRY_METRIC_META,
  GEOMETRY_SCORE_META,
  buildGeometryReviewArtifact,
  formatGeometryMetricValue,
} from "../harness/slide-geometry/review/geometryReviewArtifact";
import type {WorkbenchState} from "../state/useWorkbenchState";
import {CaptureClipboardButton} from "./CaptureClipboardButton";

type ReviewHudProps = {
  sketchReviewArtifact?: ReturnType<typeof buildGeometryReviewArtifact> | null;
  stageTargetRef: RefObject<HTMLDivElement | null>;
  reviewUrl: string;
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
  const baseAverage = REVIEW_AXES.reduce((sum, axis) => sum + scores[axis.id], 0) / REVIEW_AXES.length;
  const blockerPenalty =
    scores.blocker <= 1 ? 2.2 : scores.blocker === 2 ? 1.4 : scores.blocker === 3 ? 0.6 : 0;
  const routingPenalty = scores.routing <= 1 ? 1.0 : scores.routing === 2 ? 0.5 : 0;
  const focusPenalty = scores.focus <= 1 ? 0.8 : 0;
  const penalized = Math.max(0, baseAverage - blockerPenalty - routingPenalty - focusPenalty);

  return penalized.toFixed(1);
}

function resolveReviewVerdict(scores: ReviewScores) {
  const averageScore = Number(formatReviewScore(scores));

  if (scores.blocker <= 1) {
    return "阻断项严重，必须先返工";
  }

  if (scores.blocker === 2 || scores.routing <= 2) {
    return "优先清理硬伤";
  }

  if (averageScore < 4) {
    return "继续迭代";
  }

  return "可以归档";
}

export function ReviewHud({
  sketchReviewArtifact,
  stageTargetRef,
  reviewUrl,
  state,
}: ReviewHudProps) {
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

      <label className="review-hud-field">
        <span className="review-hud-label">Review URL</span>
        <input
          aria-label="Review URL"
          className="review-hud-url"
          readOnly
          type="text"
          value={reviewUrl}
        />
      </label>

      {sketchReviewArtifact ? (
        <>
          <section className="review-detail-panel" aria-label="Sketch review facts">
            <p className="review-hud-summary-copy">Fact-bound sketch review</p>
            <div className="review-detail-grid">
              {sketchReviewArtifact.facts.map((fact) => (
                <div key={fact.label} className="review-detail-card">
                  <span className="review-score-label">{fact.label}</span>
                  <span className="review-detail-value">{fact.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="review-detail-panel" aria-label="Sketch review metrics">
            <p className="review-hud-summary-copy">Measured geometry</p>
            <div className="review-detail-grid">
              {GEOMETRY_METRIC_META.map((metric) => (
                <div key={metric.id} className="review-detail-card">
                  <span className="review-score-label">{metric.label}</span>
                  <span className="review-detail-value">
                    {formatGeometryMetricValue(
                      metric.id,
                      sketchReviewArtifact.metrics[metric.id],
                    )}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="review-detail-panel" aria-label="Sketch review scores">
            <p className="review-hud-summary-copy">Mechanical score bands</p>
            <div className="review-detail-grid">
              <div className="review-detail-card">
                <span className="review-score-label">Blockers open</span>
                <span className="review-detail-value">
                  {sketchReviewArtifact.scores.blockerOpen ? "Yes" : "No"}
                </span>
              </div>
              {GEOMETRY_SCORE_META.map((score) => (
                <div key={score.id} className="review-detail-card">
                  <span className="review-score-label">{score.label}</span>
                  <span className="review-detail-value">
                    {sketchReviewArtifact.scores[score.id]} / 10
                  </span>
                </div>
              ))}
            </div>
          </section>

          <div className="review-hud-summary">
            <p className="review-hud-summary-copy">Mechanical floor</p>
            <output className="review-hud-score" aria-label="Mechanical Score">
              {sketchReviewArtifact.mechanicalScore.toFixed(1)} / 10.0
            </output>
            <p className="review-hud-verdict">{sketchReviewArtifact.verdict}</p>
          </div>

          <section className="review-detail-panel" aria-label="Top next fixes">
            <p className="review-hud-summary-copy">Top next fixes</p>
            <ol className="review-fix-list">
              {sketchReviewArtifact.topFixes.map((fix) => (
                <li key={fix} className="review-fix-item">
                  {fix}
                </li>
              ))}
            </ol>
          </section>
        </>
      ) : (
        <>
          <section className="review-detail-panel" aria-label="Story review notice">
            <p className="review-hud-summary-copy">
              Story page review is still manual here. The formal continuity and module-structure audit has not been automated yet.
            </p>
          </section>

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
            <p className="review-hud-summary-copy">Rendered self-check / manual only</p>
            <output className="review-hud-score" aria-label="Review Score">
              {reviewScore} / 5.0
            </output>
            <p className="review-hud-verdict">{reviewVerdict}</p>
          </div>
        </>
      )}
    </aside>
  );
}
