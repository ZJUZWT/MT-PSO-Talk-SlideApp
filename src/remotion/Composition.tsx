import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import type {VariantId} from "../storyboard-data/pso-workbench-types";
import type {RemotionWorkbenchProps} from "./embed";
import {computeSceneModel} from "./model/computeSceneModel";
import {Page01Scene} from "./pages/Page01Scene";
import {Page02Scene} from "./pages/Page02Scene";
import {Page03Scene} from "./pages/Page03Scene";
import {Page04Scene} from "./pages/Page04Scene";
import {Page05Scene} from "./pages/Page05Scene";
import {Page06Scene} from "./pages/Page06Scene";
import {Page07Scene} from "./pages/Page07Scene";
import {Page08Scene} from "./pages/Page08Scene";
import {Page09Scene} from "./pages/Page09Scene";
import {Page10Scene} from "./pages/Page10Scene";
import {easeInOutCubic, mix, resolveWindowProgress} from "./geometry/geometry";
import {VIEWBOX} from "./pages/page-layout-constants";

type SceneSvgProps = {
  frame: number;
  variantId?: VariantId;
};

export const SceneSvg: React.FC<SceneSvgProps> = ({
  frame,
  variantId = "bus-clean",
}) => {
  const scene = computeSceneModel(frame, variantId);
  const {
    cameraViewportCenterX,
    cameraViewportCenterY,
    page56BaseWorldOpacity,
    page6StageCenterX,
    page6StageCenterY,
    page6StageOpacity,
    page6StageScale,
    settledPage910Progress,
    zoomFocusX,
    zoomFocusY,
    zoomScale,
  } = scene;
  const page910LegacyFade =
    settledPage910Progress <= 0
      ? 1
      : settledPage910Progress >= 0.28
        ? 0
        : 1 - settledPage910Progress / 0.28;
  const page910LegacyShrinkProgress = resolveWindowProgress(
    settledPage910Progress,
    0,
    0.08,
    easeInOutCubic,
  );
  const page910LegacyScale = mix(1, 0.84, page910LegacyShrinkProgress);
  return (
    <AbsoluteFill
      style={{
        background: "transparent",
        fontFamily: '"Avenir Next", "Helvetica Neue", sans-serif',
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
        }}
      >
        <svg
          viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Storyboard morph"
          style={{width: "100%", height: "100%", display: "block"}}
        >
          <g
            data-testid="page56-camera-group"
            opacity={1}
            transform={`translate(${cameraViewportCenterX} ${cameraViewportCenterY}) scale(${zoomScale}) translate(${-zoomFocusX} ${-zoomFocusY})`}
          >
            <g data-testid="page56-base-world" opacity={page56BaseWorldOpacity}>
              <Page01Scene scene={scene} />
              <Page02Scene scene={scene} />
              <Page03Scene scene={scene} />
              <Page04Scene scene={scene} />
              <Page05Scene scene={scene} />
            </g>

              <g
                data-testid="page910-legacy-world"
                transform={`translate(${cameraViewportCenterX} ${cameraViewportCenterY}) scale(${page910LegacyScale}) translate(${-cameraViewportCenterX} ${-cameraViewportCenterY})`}
              >
                {page6StageOpacity > 0.001 ? (
                  <g
                    data-testid="page6-stage-group"
                    opacity={page6StageOpacity * page910LegacyFade}
                    transform={`translate(${cameraViewportCenterX} ${cameraViewportCenterY}) scale(${page6StageScale}) translate(${-page6StageCenterX} ${-page6StageCenterY})`}
                  >
                    <Page06Scene scene={scene} />
                    <Page07Scene scene={scene} />
                    <Page09Scene scene={scene} />
                  </g>
                ) : null}

                <g opacity={page910LegacyFade}>
                  <Page08Scene scene={scene} />
                </g>
              </g>
              <Page10Scene scene={scene} />
          </g>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

export const MyComposition: React.FC<RemotionWorkbenchProps> = ({
  variantId = "bus-clean",
}) => {
  const frame = useCurrentFrame();

  return <SceneSvg frame={frame} variantId={variantId} />;
};
