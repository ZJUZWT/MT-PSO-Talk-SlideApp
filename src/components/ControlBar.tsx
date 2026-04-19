import type {ChangeEvent, ReactNode} from "react";
import {resolveRemotionStepFrame} from "../remotion/embed";
import type {WorkbenchState} from "../state/useWorkbenchState";

type ControlBarProps = {
  state: WorkbenchState;
  collapsed: boolean;
  debugFrame: number | null;
  maxDebugFrame: number;
  motionPresetId: string;
  motionOptions: Array<{id: string; label: string}>;
  onDebugFrameChange: (debugFrame: number | null) => void;
  onDebugFrameStep: (delta: number) => void;
  onMotionPresetChange: (motionPresetId: string) => void;
  onToggleCollapsed: () => void;
};

type SelectFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
};

function SelectField({
  id,
  label,
  value,
  onChange,
  children,
}: SelectFieldProps) {
  return (
    <div className="control-card">
      <label htmlFor={id}>{label}</label>
      <div className="control-select-shell">
        <select
          id={id}
          className="control-select-input"
          value={value}
          onChange={onChange}
        >
          {children}
        </select>
        <span className="control-select-icon" aria-hidden="true">
          <svg viewBox="0 0 12 8" focusable="false">
            <path
              d="M1.25 1.25 6 6l4.75-4.75"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.6"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}

export function ControlBar({
  state,
  collapsed,
  debugFrame,
  maxDebugFrame,
  motionPresetId,
  motionOptions,
  onDebugFrameChange,
  onDebugFrameStep,
  onMotionPresetChange,
  onToggleCollapsed,
}: ControlBarProps) {
  const currentStepBaseFrame = resolveRemotionStepFrame(state.stepId);

  const handleVariantChange = (event: ChangeEvent<HTMLSelectElement>) => {
    state.setVariantId(event.target.value as WorkbenchState["variantId"]);
  };

  const handleStepChange = (event: ChangeEvent<HTMLSelectElement>) => {
    state.setStepId(event.target.value as WorkbenchState["stepId"]);
  };

  const handleMotionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onMotionPresetChange(event.target.value);
  };

  const handleDebugFrameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value.trim();

    if (nextValue === "") {
      onDebugFrameChange(null);
      return;
    }

    const parsed = Number.parseInt(nextValue, 10);

    if (!Number.isFinite(parsed) || parsed < 0) {
      return;
    }

    onDebugFrameChange(Math.min(parsed, maxDebugFrame));
  };

  const activeMotionLabel =
    motionOptions.find((option) => option.id === motionPresetId)?.label ?? "1x";
  const activeFrameSummary =
    debugFrame === null ? "" : ` · Frame ${debugFrame}`;

  return (
    <section
      className="control-rail"
      aria-label="Workbench controls"
      data-collapsed={collapsed ? "true" : "false"}
    >
      <div className="control-rail-header">
        <button
          type="button"
          className="control-toggle"
          aria-expanded={!collapsed}
          aria-controls="workbench-controls-panel"
          onClick={onToggleCollapsed}
        >
          {collapsed ? "Show controls" : "Hide controls"}
        </button>
        <p className="control-summary" aria-live="polite">
          {state.activeVariant.label} · {state.stepId} · {state.currentStep.label} · {state.aspectRatio} · Motion {activeMotionLabel}
          {activeFrameSummary}
        </p>
      </div>

      {!collapsed ? (
        <div className="control-bar" id="workbench-controls-panel">
          <SelectField
            id="variant"
            label="Variant"
            value={state.variantId}
            onChange={handleVariantChange}
          >
            {state.variantOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </SelectField>

          <SelectField
            id="step"
            label="Step"
            value={state.stepId}
            onChange={handleStepChange}
          >
            {state.steps.map((step) => (
              <option
                key={step.id}
                value={step.id}
                disabled={!state.supportedStepIds.includes(step.id)}
              >
                {step.id} · {step.label}
              </option>
            ))}
          </SelectField>

          <SelectField
            id="aspect"
            label="Aspect"
            value={state.aspectRatio}
            onChange={() => undefined}
          >
            <option value="16:9">16:9</option>
          </SelectField>

          <SelectField
            id="motion"
            label="Motion"
            value={motionPresetId}
            onChange={handleMotionChange}
          >
            {motionOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </SelectField>

          <div className="control-card">
            <label htmlFor="debug-frame">Debug Frame</label>
            <div className="control-debug-row">
              <input
                id="debug-frame"
                aria-label="Debug Frame"
                className="control-text-input"
                type="number"
                min="0"
                max={String(maxDebugFrame)}
                placeholder={String(currentStepBaseFrame)}
                value={debugFrame === null ? "" : String(debugFrame)}
                onChange={handleDebugFrameChange}
              />
              <button
                type="button"
                className="control-step-button"
                aria-label="Previous frame"
                onClick={() => onDebugFrameStep(-1)}
              >
                -1
              </button>
              <button
                type="button"
                className="control-step-button"
                aria-label="Next frame"
                onClick={() => onDebugFrameStep(1)}
              >
                +1
              </button>
            </div>
            <p className="control-card-caption">
              Current page base frame {currentStepBaseFrame} / max {maxDebugFrame}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
