import type {CSSProperties} from "react";
import type {WorkbenchState} from "../state/useWorkbenchState";

type NotesPanelProps = {
  state: WorkbenchState;
  transition: {
    direction: "forward" | "backward";
    outgoingStepId: WorkbenchState["stepId"];
  } | null;
};

type SessionInfo = {
  id: string;
  label: string;
  stepIndex: number;
  stepCount: number;
};

function resolveSessionInfo(
  stepId: WorkbenchState["stepId"],
  sessions: WorkbenchState["sessions"],
): SessionInfo {
  for (const segment of sessions) {
    const index = segment.stepIds.indexOf(stepId);

    if (index !== -1) {
      return {
        id: segment.id,
        label: segment.label,
        stepIndex: index + 1,
        stepCount: segment.stepIds.length,
      };
    }
  }

  return {
    id: "s-unknown",
    label: "Session · 未分类",
    stepIndex: 1,
    stepCount: 1,
  };
}

function pickFirstClause(text: string) {
  const normalized = text.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return "";
  }

  const firstSentence = normalized.split(/[。！？!?]/)[0]?.trim() ?? "";
  if (firstSentence.length > 0 && firstSentence.length <= 80) {
    return firstSentence;
  }

  return normalized.slice(0, 80).trim();
}

function resolveKeyPoints(step: WorkbenchState["currentStep"]) {
  if (step.keyPoints && step.keyPoints.length > 0) {
    return step.keyPoints.slice(0, 4);
  }

  const candidates = [step.caption, step.intro, step.notes]
    .filter((entry): entry is string => Boolean(entry))
    .map((entry) => pickFirstClause(entry))
    .filter((entry) => entry.length > 0);

  return [...new Set(candidates)].slice(0, 3);
}

function resolveApiItems(step: WorkbenchState["currentStep"]) {
  if (step.apiList && step.apiList.length > 0) {
    return step.apiList;
  }

  if (step.apiHighlights && step.apiHighlights.length > 0) {
    return step.apiHighlights.map((label, index) => ({
      id: index + 1,
      label,
    }));
  }

  return [];
}

function resolveCodeTone(
  focusColorKey: WorkbenchState["currentStep"]["focusColorKey"],
  line: string,
) {
  const normalizedLine = line.toLowerCase();

  if (focusColorKey === "opengl") {
    if (normalizedLine.includes("shader") || normalizedLine.includes("program")) {
      return "focus";
    }

    if (normalizedLine.includes("depth") || normalizedLine.includes("blend")) {
      return "support";
    }
  }

  if (focusColorKey === "vulkan") {
    if (
      normalizedLine.includes("pipeline") ||
      normalizedLine.includes("shader") ||
      normalizedLine.includes("raster") ||
      normalizedLine.includes("blend")
    ) {
      return "focus";
    }
  }

  return "default";
}

function LegendChip({label, color}: {label: string; color: string}) {
  return (
    <li
      className="notes-legend-chip"
      style={{"--legend-color": `var(${color})`} as CSSProperties}
    >
      <span className="notes-legend-swatch" aria-hidden="true" />
      <span>{label}</span>
    </li>
  );
}

function ApiListPanel({
  title,
  items,
}: {
  title: string;
  items: Array<{id: number; label: string}>;
}) {
  return (
    <section className="notes-api-panel" aria-label={title}>
      <p className="notes-api-title">{title}</p>
      <ul className="notes-api-list">
        {items.map((item) => (
          <li key={`${item.id}-${item.label}`} className="notes-api-item">
            <span className="notes-api-line" aria-hidden="true" />
            <span className="notes-api-badge" aria-hidden="true">
              {item.id}
            </span>
            <span className="notes-api-label">{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function NotesDataTable({
  title,
  rows,
}: {
  title: string;
  rows: Array<{label: string; value: string}>;
}) {
  return (
    <section className="notes-section notes-data-table-panel" aria-label={title}>
      <p className="notes-section-label">{title}</p>
      <dl className="notes-data-table">
        {rows.map((row) => (
          <div key={`${row.label}-${row.value}`} className="notes-data-row">
            <dt className="notes-data-key">{row.label}</dt>
            <dd className="notes-data-value">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function NotesCard({
  step,
  sessionInfo,
}: {
  step: WorkbenchState["currentStep"];
  sessionInfo: SessionInfo;
}) {
  const codeLines = step.codeSample?.split("\n") ?? [];
  const keyPoints = resolveKeyPoints(step);
  const apiItems = resolveApiItems(step);
  const relatedLinks = step.relatedLinks ?? [];

  return (
    <article className="notes-card">
      <div className="notes-header">
        <div className="notes-focus-pill">{step.focusTarget}</div>
      </div>

      <section className="notes-session" aria-label="当前 Session">
        <p className="notes-section-label">当前 Session</p>
        <p className="notes-session-title">{sessionInfo.label}</p>
        <p className="notes-session-copy">
          本节第 {sessionInfo.stepIndex} / {sessionInfo.stepCount} 页
        </p>
      </section>

      <div className="notes-heading-block">
        <p className="notes-caption">{step.caption}</p>
      </div>

      {keyPoints.length > 0 ? (
        <section className="notes-section">
          <p className="notes-section-label">本页重点</p>
          <ul className="notes-point-list">
            {keyPoints.map((point) => (
              <li key={`${step.id}-${point}`} className="notes-point-item">
                {point}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {apiItems.length > 0 ? (
        <ApiListPanel
          title={step.apiListTitle ?? "涉及 API / 文件"}
          items={apiItems}
        />
      ) : null}

      {step.notesDataTable ? (
        <NotesDataTable
          title={step.notesDataTable.title}
          rows={step.notesDataTable.rows}
        />
      ) : null}

      <section className="notes-section">
        <p className="notes-section-label">讲解目标</p>
        <p className="notes-section-copy">{step.timingHint}</p>
      </section>

      {relatedLinks.length > 0 ? (
        <section className="notes-section" aria-label="相关链接">
          <p className="notes-section-label">相关链接</p>
          <ul className="notes-link-list">
            {relatedLinks.map((link) => (
              <li key={`${step.id}-${link.url}`} className="notes-link-item">
                <a
                  className="notes-link-anchor"
                  href={link.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {codeLines.length > 0 ? (
        <section className="notes-code-panel" aria-label="Code sample">
          <div className="notes-code-header">
            <p className="notes-section-label">Code cue</p>
            {step.codeLegend?.length ? (
              <ul className="notes-legend" aria-label="Code legend">
                {step.codeLegend.map((entry) => (
                  <LegendChip
                    key={`${step.id}-${entry.label}`}
                    color={entry.color}
                    label={entry.label}
                  />
                ))}
              </ul>
            ) : null}
          </div>
          <pre className="notes-code-block">
            <code>
              {codeLines.map((line, index) => (
                <span
                  key={`${step.id}-${index}-${line}`}
                  className="notes-code-line"
                  data-tone={resolveCodeTone(step.focusColorKey, line)}
                >
                  {line}
                </span>
              ))}
            </code>
          </pre>
        </section>
      ) : null}
    </article>
  );
}

function NotesCardGhost() {
  return <div className="notes-card notes-card--ghost" aria-hidden="true" />;
}

export function NotesPanel({state, transition}: NotesPanelProps) {
  const outgoingStep = transition
    ? state.steps.find((step) => step.id === transition.outgoingStepId) ?? null
    : null;
  const suppressOutgoingStep = state.currentStep.id.endsWith("_img");
  const effectiveOutgoingStep = suppressOutgoingStep ? null : outgoingStep;
  const currentSessionInfo = resolveSessionInfo(state.currentStep.id, state.sessions);
  const outgoingSessionInfo = effectiveOutgoingStep
    ? resolveSessionInfo(effectiveOutgoingStep.id, state.sessions)
    : null;
  const currentStackRole = transition ? "back" : "front";
  const outgoingStackRole = transition ? "front" : "back";

  return (
    <section
      className="notes-panel"
      aria-label="Speaker notes"
      data-motion-direction={transition?.direction ?? "idle"}
    >
      <div className="notes-stack">
        <div
          className="notes-card-layer notes-card-layer--current"
          data-motion-axis="vertical"
          data-motion-direction="idle"
          data-step-id={state.currentStep.id}
          data-stack-role={currentStackRole}
          data-fade="off"
        >
          <NotesCard step={state.currentStep} sessionInfo={currentSessionInfo} />
        </div>

        <div
          className="notes-card-layer notes-card-layer--outgoing"
          data-motion-axis="vertical"
          data-motion-direction={transition?.direction ?? "idle"}
          data-step-id={effectiveOutgoingStep?.id}
          data-stack-role={outgoingStackRole}
          data-has-step={effectiveOutgoingStep ? "true" : "false"}
          data-fade="off"
          aria-hidden="true"
        >
          {effectiveOutgoingStep && outgoingSessionInfo ? (
            <NotesCard step={effectiveOutgoingStep} sessionInfo={outgoingSessionInfo} />
          ) : (
            <NotesCardGhost />
          )}
        </div>
      </div>
    </section>
  );
}
