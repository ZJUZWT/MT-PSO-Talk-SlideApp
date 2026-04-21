import type {CSSProperties, ReactNode} from "react";
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

const OBJECTIVE_FACT_EMPHASIS = [
  {
    text: "着色器编译",
    className: "notes-inline-emphasis notes-inline-emphasis--precompile",
    appliesTo: (fact: string) => fact === "启动游戏必经之路——着色器编译",
  },
  {
    text: "指数级增长",
    className: "notes-inline-emphasis notes-inline-emphasis--exponential",
    appliesTo: (fact: string) => fact === "PSO 的状态组合空间呈指数级增长",
  },
  {
    text: "PSO",
    className: "notes-inline-emphasis notes-inline-emphasis--pso",
    appliesTo: (fact: string) =>
      fact === "OpenGL 无 PSO，只有 Program" || fact === "Vulkan / Metal 有 PSO可以深度优化",
  },
  {
    text: "Program",
    className: "notes-inline-emphasis notes-inline-emphasis--program",
    appliesTo: (fact: string) => fact === "OpenGL 无 PSO，只有 Program",
  },
  {
    text: "Compile",
    className: "notes-inline-emphasis notes-inline-emphasis--compile-link",
    appliesTo: (fact: string) => fact === "Shader的Compile、Link耗时极高",
  },
  {
    text: "Link",
    className: "notes-inline-emphasis notes-inline-emphasis--compile-link",
    appliesTo: (fact: string) => fact === "Shader的Compile、Link耗时极高",
  },
  {
    text: "极高",
    className: "notes-inline-emphasis notes-inline-emphasis--high-cost",
    appliesTo: (fact: string) => fact === "Shader的Compile、Link耗时极高",
  },
] as const;

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

function resolveObjectiveFacts(
  steps: WorkbenchState["steps"],
  currentStepId: WorkbenchState["currentStep"]["id"],
) {
  const currentIndex = steps.findIndex((step) => step.id === currentStepId);
  const scannedSteps = currentIndex === -1 ? steps : steps.slice(0, currentIndex + 1);

  return [...new Set(scannedSteps.flatMap((step) => step.objectiveFacts ?? []))];
}

function resolveNewObjectiveFacts(
  steps: WorkbenchState["steps"],
  currentStepId: WorkbenchState["currentStep"]["id"],
) {
  const currentIndex = steps.findIndex((step) => step.id === currentStepId);
  if (currentIndex <= 0) {
    return new Set(resolveObjectiveFacts(steps, currentStepId));
  }

  const previousStepId = steps[currentIndex - 1]?.id;
  if (!previousStepId || previousStepId === currentStepId) {
    return new Set<string>();
  }

  const currentFacts = resolveObjectiveFacts(steps, currentStepId);
  const previousFacts = new Set(resolveObjectiveFacts(steps, previousStepId));

  return new Set(currentFacts.filter((fact) => !previousFacts.has(fact)));
}

function renderObjectiveFact(fact: string) {
  const parts: ReactNode[] = [];
  let cursor = 0;

  while (cursor < fact.length) {
    let nextMatch:
      | {
          start: number;
          text: string;
          className: string;
        }
      | null = null;

    for (const token of OBJECTIVE_FACT_EMPHASIS) {
      if (token.appliesTo && !token.appliesTo(fact)) {
        continue;
      }

      const start = fact.indexOf(token.text, cursor);
      if (start === -1) {
        continue;
      }

      if (!nextMatch || start < nextMatch.start) {
        nextMatch = {
          start,
          text: token.text,
          className: token.className,
        };
      }
    }

    if (!nextMatch) {
      parts.push(fact.slice(cursor));
      break;
    }

    if (nextMatch.start > cursor) {
      parts.push(fact.slice(cursor, nextMatch.start));
    }

    parts.push(
      <span
        key={`${nextMatch.className}-${nextMatch.start}-${nextMatch.text}`}
        className={nextMatch.className}
      >
        {nextMatch.text}
      </span>,
    );
    cursor = nextMatch.start + nextMatch.text.length;
  }

  return parts;
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
  steps,
  sessionInfo,
  newObjectiveFacts,
}: {
  step: WorkbenchState["currentStep"];
  steps: WorkbenchState["steps"];
  sessionInfo: SessionInfo;
  newObjectiveFacts: ReadonlySet<string>;
}) {
  const codeLines = step.codeSample?.split("\n") ?? [];
  const objectiveFacts = resolveObjectiveFacts(steps, step.id);
  const apiItems = resolveApiItems(step);
  const relatedLinks = step.relatedLinks ?? [];

  return (
    <article className="notes-card">
      <section className="notes-session" aria-label="当前 Session">
        <div className="notes-session-row">
          <div className="notes-session-heading">
            <p className="notes-section-label notes-section-label--session">当前 Session</p>
            <p className="notes-session-title">{sessionInfo.label}</p>
          </div>
          <p className="notes-session-copy">
            第 {sessionInfo.stepIndex} / {sessionInfo.stepCount} 页
          </p>
        </div>
      </section>

      {objectiveFacts.length > 0 ? (
        <section className="notes-section notes-section--objective-facts">
          <p className="notes-section-label notes-section-label--objective-facts">
            客观事实
          </p>
          <ul className="notes-point-list notes-point-list--objective-facts">
            {objectiveFacts.map((fact, index) => {
              const factState = newObjectiveFacts.has(fact) ? "new" : "stable";

              return (
                <li
                  key={`${step.id}-${fact}`}
                  className="notes-point-item notes-point-item--objective-facts"
                  data-fact-state={factState}
                >
                  <span
                    className="notes-point-bullet"
                    data-testid="notes-point-bullet"
                    data-fact-index={index + 1}
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <span
                    className="notes-point-copy notes-point-copy--objective-facts"
                    data-fact-state={factState}
                  >
                    {renderObjectiveFact(fact)}
                  </span>
                </li>
              );
            })}
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
  const newObjectiveFacts = resolveNewObjectiveFacts(state.steps, state.currentStep.id);
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
          <NotesCard
            step={state.currentStep}
            steps={state.steps}
            sessionInfo={currentSessionInfo}
            newObjectiveFacts={newObjectiveFacts}
          />
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
            <NotesCard
              step={effectiveOutgoingStep}
              steps={state.steps}
              sessionInfo={outgoingSessionInfo}
              newObjectiveFacts={new Set<string>()}
            />
          ) : (
            <NotesCardGhost />
          )}
        </div>
      </div>
    </section>
  );
}
