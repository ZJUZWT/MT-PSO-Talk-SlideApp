import type {CSSProperties} from "react";
import {useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {CaptureClipboardButton} from "./components/CaptureClipboardButton";
import {ControlBar} from "./components/ControlBar";
import {NotesPanel} from "./components/NotesPanel";
import {ProgressBubbles} from "./components/ProgressBubbles";
import {ReviewHud} from "./components/ReviewHud";
import {StageFrame} from "./components/StageFrame";
import {
  DEFAULT_STEP_ID,
  DEFAULT_VARIANT_ID,
  isStoryStepId,
  isVariantId,
  useWorkbenchState,
} from "./state/useWorkbenchState";

const MOTION_PRESETS = [
  {id: "quarter", label: "0.25x", durationScale: 4},
  {id: "half", label: "0.5x", durationScale: 2},
  {id: "normal", label: "1x", durationScale: 1},
  {id: "fast", label: "1.5x", durationScale: 0.72},
] as const;

type MotionPresetId = (typeof MOTION_PRESETS)[number]["id"];
const DEFAULT_MOTION_PRESET_ID: MotionPresetId = "normal";
const NOTES_TRANSITION_BASE_MS = 300;
const NOTES_BASELINE_SPEED_FACTOR = 0.5;
const RAIL_FRAME_HEIGHT_PX = 104;
const RAIL_SPEED_FACTOR = 0.5;
const PANEL_LAYOUT = {
  notesColumnMin: "22rem",
  notesColumnMax: "30rem",
  stageColumnFr: "0.94fr",
} as const;

type InitialWorkbenchQuery = {
  controlsCollapsed: boolean;
  motionPresetId: MotionPresetId;
  reviewMode: boolean;
  stepId: typeof DEFAULT_STEP_ID;
  variantId: typeof DEFAULT_VARIANT_ID;
};

function isMotionPresetId(value: string | null | undefined): value is MotionPresetId {
  return MOTION_PRESETS.some((preset) => preset.id === value);
}

function parseBooleanFlag(value: string | null): boolean {
  return value === "1" || value === "true";
}

function parseInitialWorkbenchQuery(): InitialWorkbenchQuery {
  if (typeof window === "undefined") {
    return {
      controlsCollapsed: true,
      motionPresetId: DEFAULT_MOTION_PRESET_ID,
      reviewMode: false,
      stepId: DEFAULT_STEP_ID,
      variantId: DEFAULT_VARIANT_ID,
    };
  }

  const params = new URLSearchParams(window.location.search);
  const stepParam = params.get("step");
  const variantParam = params.get("variant");
  const motionParam = params.get("motion");

  return {
    controlsCollapsed: !parseBooleanFlag(params.get("controls")),
    motionPresetId: isMotionPresetId(motionParam)
      ? motionParam
      : DEFAULT_MOTION_PRESET_ID,
    reviewMode: parseBooleanFlag(params.get("review")),
    stepId: isStoryStepId(stepParam) ? stepParam : DEFAULT_STEP_ID,
    variantId: isVariantId(variantParam) ? variantParam : DEFAULT_VARIANT_ID,
  };
}

function shouldIgnoreKeyboardNavigation(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest(
      'input, textarea, select, button, [contenteditable="true"], [role="textbox"]',
    ),
  );
}

export function App() {
  const captureTargetRef = useRef<HTMLDivElement | null>(null);
  const stageCaptureTargetRef = useRef<HTMLDivElement | null>(null);
  const initialQueryState = useMemo(() => parseInitialWorkbenchQuery(), []);
  const state = useWorkbenchState({
    stepId: initialQueryState.stepId,
    variantId: initialQueryState.variantId,
  });
  const [controlsCollapsed, setControlsCollapsed] = useState(
    initialQueryState.controlsCollapsed,
  );
  const [motionPresetId, setMotionPresetId] = useState<MotionPresetId>(
    initialQueryState.motionPresetId,
  );
  const [stepTransition, setStepTransition] = useState<{
    direction: "forward" | "backward";
    outgoingStepId: typeof state.stepId;
  } | null>(null);
  const [isReviewMode] = useState(initialQueryState.reviewMode);
  const settledStepIdRef = useRef(state.stepId);
  const latestTargetStepIdRef = useRef(state.stepId);
  const motionPreset = useMemo(
    () =>
      MOTION_PRESETS.find((preset) => preset.id === motionPresetId) ??
      MOTION_PRESETS[2],
    [motionPresetId],
  );
  const notesBaseMs = Math.round(
    NOTES_TRANSITION_BASE_MS / NOTES_BASELINE_SPEED_FACTOR,
  );
  const railDurationScale = 1 / RAIL_SPEED_FACTOR;
  const stepTransitionMs = Math.round(notesBaseMs * motionPreset.durationScale);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams();

    if (state.stepId !== DEFAULT_STEP_ID) {
      params.set("step", state.stepId);
    }

    if (state.variantId !== DEFAULT_VARIANT_ID) {
      params.set("variant", state.variantId);
    }

    if (motionPreset.id !== DEFAULT_MOTION_PRESET_ID) {
      params.set("motion", motionPreset.id);
    }

    if (!controlsCollapsed) {
      params.set("controls", "1");
    }

    if (isReviewMode) {
      params.set("review", "1");
    }

    const nextQuery = params.toString();
    const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", nextUrl);
  }, [
    controlsCollapsed,
    isReviewMode,
    motionPreset.id,
    state.stepId,
    state.variantId,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        shouldIgnoreKeyboardNavigation(event.target ?? document.activeElement)
      ) {
        return;
      }

      if (event.key === "[" || event.key === "]" || event.key === "0") {
        event.preventDefault();
        setMotionPresetId((current) => {
          if (event.key === "0") {
            return "normal";
          }

          const currentIndex = MOTION_PRESETS.findIndex(
            (preset) => preset.id === current,
          );
          const safeIndex = currentIndex === -1 ? 2 : currentIndex;
          const nextIndex =
            event.key === "["
              ? Math.max(0, safeIndex - 1)
              : Math.min(MOTION_PRESETS.length - 1, safeIndex + 1);

          return MOTION_PRESETS[nextIndex]?.id ?? current;
        });
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        state.goToPreviousStep();
      }

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        state.goToNextStep();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [state]);

  useLayoutEffect(() => {
    latestTargetStepIdRef.current = state.stepId;
    const settledStepId = settledStepIdRef.current;

    if (settledStepId === state.stepId) {
      setStepTransition(null);
      return;
    }

    const previousIndex = state.steps.findIndex((step) => step.id === settledStepId);
    const currentIndex = state.steps.findIndex((step) => step.id === state.stepId);

    setStepTransition({
      direction: currentIndex >= previousIndex ? "forward" : "backward",
      outgoingStepId: settledStepId,
    });

    const timeoutId = window.setTimeout(() => {
      settledStepIdRef.current = latestTargetStepIdRef.current;
      setStepTransition(null);
    }, stepTransitionMs + 36);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [state.stepId, state.steps, stepTransitionMs]);

  return (
    <div
      className="workbench-shell"
      ref={captureTargetRef}
      data-motion-preset={motionPreset.id}
      style={
        {
          "--motion-duration-scale": motionPreset.durationScale,
          "--notes-motion-ms": `${notesBaseMs}`,
          "--rail-frame-height": `${RAIL_FRAME_HEIGHT_PX}px`,
          "--rail-speed-factor": `${RAIL_SPEED_FACTOR}`,
          "--rail-duration-scale": `${railDurationScale}`,
          "--notes-column-min": PANEL_LAYOUT.notesColumnMin,
          "--notes-column-max": PANEL_LAYOUT.notesColumnMax,
          "--stage-column-fr": PANEL_LAYOUT.stageColumnFr,
        } as CSSProperties
      }
    >
      <div className="workbench-glow workbench-glow-left" />
      <div className="workbench-glow workbench-glow-right" />
      <ControlBar
        state={state}
        collapsed={controlsCollapsed}
        motionPresetId={motionPreset.id}
        motionOptions={MOTION_PRESETS.map(({id, label}) => ({id, label}))}
        onMotionPresetChange={(nextPresetId) => {
          setMotionPresetId(nextPresetId as MotionPresetId);
        }}
        onToggleCollapsed={() => {
          setControlsCollapsed((current) => !current);
        }}
      />
      <main className="workbench-main">
        <NotesPanel state={state} transition={stepTransition} />
        <StageFrame
          state={state}
          motionDurationScale={motionPreset.durationScale}
          runtimeRef={stageCaptureTargetRef}
        />
      </main>
      {isReviewMode ? (
        <ReviewHud stageTargetRef={stageCaptureTargetRef} state={state} />
      ) : null}
      <CaptureClipboardButton stepId={state.stepId} targetRef={captureTargetRef} />
      <ProgressBubbles state={state} transition={stepTransition} />
    </div>
  );
}
