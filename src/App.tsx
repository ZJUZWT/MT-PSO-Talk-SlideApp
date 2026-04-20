import type {CSSProperties} from "react";
import {useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {
  isGeometrySketchId,
  resolveGeometrySketch,
} from "./harness/slide-geometry/registry/sketchRegistry";
import {collectBrowserGeometryTextProbe} from "./harness/slide-geometry/review/browserGeometryTextProbe";
import {buildGeometryReviewArtifact} from "./harness/slide-geometry/review/geometryReviewArtifact";
import {CaptureClipboardButton} from "./components/CaptureClipboardButton";
import {ControlBar} from "./components/ControlBar";
import {NotesPanel} from "./components/NotesPanel";
import {ProgressBubbles} from "./components/ProgressBubbles";
import {ReviewHud} from "./components/ReviewHud";
import {resolveGeometryReviewSurface} from "./review/geometryReviewSurface";
import {StageFrame} from "./components/StageFrame";
import {REMOTION_PLAYER_CONFIG, resolveRemotionStepFrame} from "./remotion/embed";
import {
  captureElementToBlob,
  postImageBlobToEndpoint,
  type CaptureScope,
} from "./utils/captureImage";
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
  captureEnabled: boolean;
  capturePostUrl: string | null;
  captureScope: CaptureScope;
  captureTransport: "post" | null;
  controlsCollapsed: boolean;
  debugFrame: number | null;
  mode: "story" | "sketch";
  motionPresetId: MotionPresetId;
  probeNodeId: string | null;
  probeType: "geometry-text" | null;
  reviewMode: boolean;
  sketchId: string | null;
  surface: "workbench";
  stepId: typeof DEFAULT_STEP_ID;
  variantId: typeof DEFAULT_VARIANT_ID;
};

type StepNavigationMode = "animate" | "instant";

function isMotionPresetId(value: string | null | undefined): value is MotionPresetId {
  return MOTION_PRESETS.some((preset) => preset.id === value);
}

function parseBooleanFlag(value: string | null): boolean {
  return value === "1" || value === "true";
}

function parsePositiveInt(
  value: string | null,
  fallback: number,
) {
  const parsed = Number.parseInt(value ?? "", 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseDebugFrame(value: string | null): number | null {
  if (value === null || value.trim() === "") {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  const maxFrame = REMOTION_PLAYER_CONFIG.durationInFrames - 1;

  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return Math.min(parsed, maxFrame);
}

function parseCaptureScope(value: string | null): CaptureScope {
  return "page";
}

function parseInitialWorkbenchQuery(): InitialWorkbenchQuery {
  if (typeof window === "undefined") {
    return {
      captureEnabled: false,
      capturePostUrl: null,
      captureScope: "page",
      captureTransport: null,
      controlsCollapsed: true,
      debugFrame: null,
      mode: "story",
      motionPresetId: DEFAULT_MOTION_PRESET_ID,
      probeNodeId: null,
      probeType: null,
      reviewMode: false,
      sketchId: null,
      surface: "workbench",
      stepId: DEFAULT_STEP_ID,
      variantId: DEFAULT_VARIANT_ID,
    };
  }

  const params = new URLSearchParams(window.location.search);
  const stepParam = params.get("step");
  const variantParam = params.get("variant");
  const motionParam = params.get("motion");
  const sketchParam = params.get("sketch");
  const sketchMode =
    params.get("mode") === "sketch" && isGeometrySketchId(sketchParam);
  const initialSketch = sketchMode ? resolveGeometrySketch(sketchParam) : null;

  return {
    captureEnabled: parseBooleanFlag(params.get("capture")),
    capturePostUrl: params.get("capturePostUrl"),
    captureScope: parseCaptureScope(params.get("captureScope")),
    captureTransport: params.get("captureTransport") === "post" ? "post" : null,
    controlsCollapsed: !parseBooleanFlag(params.get("controls")),
    debugFrame: parseDebugFrame(params.get("debugFrame")),
    mode: sketchMode ? "sketch" : "story",
    motionPresetId: isMotionPresetId(motionParam)
      ? motionParam
      : DEFAULT_MOTION_PRESET_ID,
    probeNodeId: params.get("probeNodeId"),
    probeType: params.get("probe") === "geometry-text" ? "geometry-text" : null,
    reviewMode: parseBooleanFlag(params.get("review")),
    sketchId: initialSketch?.id ?? null,
    surface: "workbench",
    stepId: isStoryStepId(stepParam)
      ? stepParam
      : initialSketch?.stepId ?? DEFAULT_STEP_ID,
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
  const captureRequestHandledRef = useRef(false);
  const stageCaptureTargetRef = useRef<HTMLDivElement | null>(null);
  const initialQueryState = useMemo(() => parseInitialWorkbenchQuery(), []);
  const [isReviewMode] = useState(initialQueryState.reviewMode);
  const [geometryTextProbePayload, setGeometryTextProbePayload] = useState("");
  const stageMode = initialQueryState.mode;
  const sketchDefinition = useMemo(
    () =>
      initialQueryState.sketchId && isGeometrySketchId(initialQueryState.sketchId)
        ? resolveGeometrySketch(initialQueryState.sketchId)
        : null,
    [initialQueryState.sketchId],
  );
  const state = useWorkbenchState({
    stepId: initialQueryState.stepId,
    variantId: initialQueryState.variantId,
  });
  const [controlsCollapsed, setControlsCollapsed] = useState(
    initialQueryState.controlsCollapsed,
  );
  const [debugFrame, setDebugFrame] = useState<number | null>(
    initialQueryState.debugFrame,
  );
  const [motionPresetId, setMotionPresetId] = useState<MotionPresetId>(
    initialQueryState.motionPresetId,
  );
  const [stepNavigationMode, setStepNavigationMode] =
    useState<StepNavigationMode>("animate");
  const [stepTransition, setStepTransition] = useState<{
    direction: "forward" | "backward";
    outgoingStepId: typeof state.stepId;
  } | null>(null);
  const captureEnabled = initialQueryState.captureEnabled;
  const capturePostUrl = initialQueryState.capturePostUrl;
  const captureScope = initialQueryState.captureScope;
  const captureTransport = initialQueryState.captureTransport;
  const settledStepIdRef = useRef(state.stepId);
  const latestTargetStepIdRef = useRef(state.stepId);
  const motionPreset = useMemo(
    () =>
      MOTION_PRESETS.find((preset) => preset.id === motionPresetId) ??
      MOTION_PRESETS[2],
    [motionPresetId],
  );
  const activeReviewSurface = useMemo(
    () =>
      isReviewMode
        ? resolveGeometryReviewSurface({
            stageMode,
            sketchId: sketchDefinition?.id ?? null,
            stepId: state.stepId,
          })
        : null,
    [isReviewMode, sketchDefinition, stageMode, state.stepId],
  );
  const mechanicalReviewArtifact = useMemo(
    () =>
      activeReviewSurface
        ? buildGeometryReviewArtifact(activeReviewSurface.sketch)
        : null,
    [activeReviewSurface],
  );
  const notesBaseMs = Math.round(
    NOTES_TRANSITION_BASE_MS / NOTES_BASELINE_SPEED_FACTOR,
  );
  const railDurationScale = 1 / RAIL_SPEED_FACTOR;
  const stepTransitionMs = Math.round(notesBaseMs * motionPreset.durationScale);

  const navigateToStep = (
    stepId: typeof state.stepId,
    navigationMode: StepNavigationMode,
  ) => {
    if (stepId === state.stepId) {
      return;
    }

    setStepNavigationMode(navigationMode);
    state.setStepId(stepId);
  };

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

    if (stageMode === "sketch" && sketchDefinition) {
      params.set("mode", "sketch");
      params.set("sketch", sketchDefinition.id);
    }

    if (!controlsCollapsed) {
      params.set("controls", "1");
    }

    if (debugFrame !== null) {
      params.set("debugFrame", String(debugFrame));
    }

    if (isReviewMode) {
      params.set("review", "1");
    }

    const nextQuery = params.toString();
    const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", nextUrl);
  }, [
    controlsCollapsed,
    debugFrame,
    isReviewMode,
    motionPreset.id,
    sketchDefinition,
    state.stepId,
    state.variantId,
    stageMode,
  ]);

  const reviewUrl =
    typeof window === "undefined" ? "" : window.location.href;

  useEffect(() => {
    if (initialQueryState.probeType !== "geometry-text" || !sketchDefinition) {
      return;
    }

    let cancelled = false;

    const measureProbe = async () => {
      const fontDocument = document as Document & {
        fonts?: {
          ready?: Promise<unknown>;
        };
      };
      if (fontDocument.fonts?.ready) {
        await fontDocument.fonts.ready;
      }

      await new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => resolve());
      });

      const root = stageCaptureTargetRef.current ?? captureTargetRef.current;
      if (!root || cancelled) {
        return;
      }

      const probe = collectBrowserGeometryTextProbe({
        probeNodeId: initialQueryState.probeNodeId ?? undefined,
        root,
        sketch: sketchDefinition,
      });

      if (!cancelled) {
        setGeometryTextProbePayload(JSON.stringify(probe));
      }
    };

    void measureProbe();

    return () => {
      cancelled = true;
    };
  }, [
    initialQueryState.probeNodeId,
    initialQueryState.probeType,
    sketchDefinition,
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
        setStepNavigationMode("animate");
        state.goToPreviousStep();
      }

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        setStepNavigationMode("animate");
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

    if (stepNavigationMode === "instant") {
      settledStepIdRef.current = state.stepId;
      setStepTransition(null);
      setStepNavigationMode("animate");
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
  }, [state.stepId, state.steps, stepNavigationMode, stepTransitionMs]);

  useEffect(() => {
    if (!captureEnabled || captureTransport !== "post" || !capturePostUrl) {
      return;
    }

    if (captureRequestHandledRef.current) {
      return;
    }

    const target = captureTargetRef.current;
    const targetId = "workbench-shell";

    if (!target) {
      return;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(() => {
      void (async () => {
        try {
          const imageBlob = await captureElementToBlob(target);

          if (cancelled) {
            return;
          }

          await postImageBlobToEndpoint(imageBlob, {
            postUrl: capturePostUrl,
            scope: "page",
            sourceUrl: window.location.href,
            targetId,
          });

          if (!cancelled) {
            captureRequestHandledRef.current = true;
          }
        } catch {
          // Keep the page interactive even if automation capture fails.
        }
      })();
    }, 48);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [captureEnabled, capturePostUrl, captureScope, captureTransport]);

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
      {initialQueryState.probeType === "geometry-text" ? (
        <pre
          data-geometry-text-probe={geometryTextProbePayload ? "ready" : "pending"}
          style={{display: "none"}}
        >
          {geometryTextProbePayload}
        </pre>
      ) : null}
      <ControlBar
        state={state}
        collapsed={controlsCollapsed}
        motionPresetId={motionPreset.id}
        motionOptions={MOTION_PRESETS.map(({id, label}) => ({id, label}))}
        debugFrame={debugFrame}
        maxDebugFrame={REMOTION_PLAYER_CONFIG.durationInFrames - 1}
        onMotionPresetChange={(nextPresetId) => {
          setMotionPresetId(nextPresetId as MotionPresetId);
        }}
        onDebugFrameChange={(nextFrame) => {
          setDebugFrame(nextFrame);
        }}
        onDebugFrameStep={(delta) => {
          setDebugFrame((current) => {
            const baseFrame =
              current ?? resolveRemotionStepFrame(state.stepId);
            const maxFrame = REMOTION_PLAYER_CONFIG.durationInFrames - 1;
            const nextFrame = Math.max(0, Math.min(maxFrame, baseFrame + delta));

            return nextFrame;
          });
        }}
        onToggleCollapsed={() => {
          setControlsCollapsed((current) => !current);
        }}
      />
      <main className="workbench-main">
        <NotesPanel state={state} transition={stepTransition} />
        <StageFrame
          state={state}
          jumpToStepInstant={stepNavigationMode === "instant"}
          motionDurationScale={motionPreset.durationScale}
          runtimeRef={stageCaptureTargetRef}
          sketchDefinition={sketchDefinition}
          debugFrame={debugFrame}
        />
      </main>
      {isReviewMode ? (
        <ReviewHud
          captureTargetRef={captureTargetRef}
          mechanicalReviewArtifact={mechanicalReviewArtifact}
          reviewSource={activeReviewSurface?.reviewSource ?? null}
          reviewUrl={reviewUrl}
          state={state}
        />
      ) : null}
      <CaptureClipboardButton stepId={state.stepId} targetRef={captureTargetRef} />
      <ProgressBubbles
        state={state}
        transition={stepTransition}
        onStepJump={(stepId) => {
          navigateToStep(stepId, "instant");
        }}
      />
    </div>
  );
}
