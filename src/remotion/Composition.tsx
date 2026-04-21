import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import type {VariantId} from "../storyboard-data/pso-workbench-types";
import type {RemotionWorkbenchProps} from "./embed";
import {resolveRemotionStepFrame} from "./embed";
import {computeSceneModel} from "./model/computeSceneModel";
import {Page00OpeningScene} from "./pages/Page00OpeningScene";
import {Page01Scene} from "./pages/Page01Scene";
import {Page02Scene} from "./pages/Page02Scene";
import {Page03Scene} from "./pages/Page03Scene";
import {
  Page04DataScene,
  resolvePage04DataOverlayState,
} from "./pages/Page04DataScene";
import {Page04Scene} from "./pages/Page04Scene";
import {Page05Scene} from "./pages/Page05Scene";
import {Page06Scene} from "./pages/Page06Scene";
import {Page07Scene} from "./pages/Page07Scene";
import {Page08Scene} from "./pages/Page08Scene";
import {Page09Scene} from "./pages/Page09Scene";
import {Page10Scene} from "./pages/Page10Scene";
import {easeInOutCubic, mix, resolveWindowProgress} from "./geometry/geometry";
import {PAGE_00_FRAME, PAGE_01_FRAME, VIEWBOX} from "./pages/page-layout-constants";

type SceneSvgProps = {
  frame: number;
  variantId?: VariantId;
};

export const SceneSvg: React.FC<SceneSvgProps> = ({
  frame,
  variantId = "bus-clean",
}) => {
  const page04DataOverlayState = resolvePage04DataOverlayState(frame);
  const sceneFrame = page04DataOverlayState?.sceneFrame ?? frame;
  const baseSceneOpacity = page04DataOverlayState?.baseOpacity ?? 1;
  const scene = computeSceneModel(sceneFrame, variantId);
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
    (() => {
      const page09Frame = resolveRemotionStepFrame("page_09");
      const page09ImageFrame = resolveRemotionStepFrame("page_09_img");
      const page10Frame = resolveRemotionStepFrame("page_10");

      if (sceneFrame <= page09Frame) {
        return 1;
      }

      if (sceneFrame < page09ImageFrame) {
        const progress =
          (sceneFrame - page09Frame) /
          Math.max(1, page09ImageFrame - page09Frame);
        return 1 - resolveWindowProgress(progress, 0.06, 0.82, easeInOutCubic);
      }

      if (sceneFrame < page10Frame) {
        const progress =
          (sceneFrame - page09ImageFrame) /
          Math.max(1, page10Frame - page09ImageFrame);
        const restore = resolveWindowProgress(progress, 0.22, 0.46, easeInOutCubic);
        const fadeOut = resolveWindowProgress(progress, 0.46, 0.72, easeInOutCubic);

        return restore * (1 - fadeOut);
      }

      return settledPage910Progress <= 0
        ? 1
        : settledPage910Progress >= 0.28
          ? 0
          : 1 - settledPage910Progress / 0.28;
    })();
  const page910LegacyShrinkProgress = resolveWindowProgress(
    settledPage910Progress,
    0,
    0.08,
    easeInOutCubic,
  );
  const page910LegacyScale =
    (() => {
      const page09ImageFrame = resolveRemotionStepFrame("page_09_img");
      const page10Frame = resolveRemotionStepFrame("page_10");

      if (sceneFrame <= page09ImageFrame) {
        return 1;
      }

      if (sceneFrame < page10Frame) {
        const progress =
          (sceneFrame - page09ImageFrame) /
          Math.max(1, page10Frame - page09ImageFrame);
        const shrink = resolveWindowProgress(progress, 0.46, 0.74, easeInOutCubic);

        return mix(1, 0.84, shrink);
      }

      return mix(1, 0.84, page910LegacyShrinkProgress);
    })();
  const openingPageFadeProgress =
    sceneFrame <= PAGE_00_FRAME
      ? 0
      : sceneFrame >= PAGE_01_FRAME
        ? 1
        : (sceneFrame - PAGE_00_FRAME) / Math.max(1, PAGE_01_FRAME - PAGE_00_FRAME);
  const openingPageOpacity =
    sceneFrame <= PAGE_00_FRAME
      ? 1
      : sceneFrame >= PAGE_01_FRAME
        ? 0
        : 1 - resolveWindowProgress(openingPageFadeProgress, 0.06, 0.86, easeInOutCubic);
  const baseLayerOpacity = baseSceneOpacity * (1 - openingPageOpacity);

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
            <g data-testid="scene-base-layer" opacity={baseLayerOpacity}>
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
            </g>
            <Page00OpeningScene opacity={openingPageOpacity} />
            <Page04DataScene frame={frame} />
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
