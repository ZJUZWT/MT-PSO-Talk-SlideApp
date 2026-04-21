import React from "react";
import {resolveRemotionStepFrame} from "../embed";
import {clamp01, easeInOutCubic} from "../geometry/geometry";
import type {SceneModel} from "../model/scene-model-types";
import {StageBox} from "../primitives/diagramPrimitives";
import type {Box} from "../primitives/diagramTypes";
import type {StoryStepId} from "../../storyboard-data/pso-workbench-types";
import {resolveStagePromptOverlayContent} from "../../components/stagePromptOverlayContent";
import {
  PAGE6_UASSET_FRAME,
  PAGE8_UASSET_FRAME,
  PAGE9_UASSET_FRAME,
  VIEWBOX,
} from "./page-layout-constants";

const VIEW_MARGIN = 18;
const CARD_RADIUS = 20;
const DEFAULT_FONT_SIZE = 18;
const DEFAULT_LINE_GAP = 24;
const CARD_RIGHT_MARGIN = 44;
const CARD_TOP = 74;
const FADE_FRAME_COUNT = 8;

const PAGE03_ANCHOR: Box = {x: 126, y: 88, width: 1028, height: 482, radius: 30};
const PAGE04_ANCHOR: Box = {x: 188, y: 88, width: 904, height: 512, radius: 30};
const PAGE05_ANCHOR: Box = {x: 156, y: 126, width: 910, height: 410, radius: 30};
const PAGE04_DATA_TABLE: Box = {x: 40, y: 200, width: 1200, height: 456, radius: 28};
const PLACEHOLDER_BOARD: Box = {x: 148, y: 104, width: 984, height: 512, radius: 36};
const SUPPLEMENT_IMAGE_BOX: Box = {x: 46, y: 36, width: 1188, height: 648, radius: 28};

type PromptOverlayConfig = {
  stepId: StoryStepId;
  endStepId: StoryStepId;
  anchor: Box;
  width: number;
  fontSize?: number;
  lineGap?: number;
  nudgeX?: number;
  nudgeY?: number;
  overlapX?: number;
  overlapY?: number;
};

const PROMPT_OVERLAY_CONFIGS: readonly PromptOverlayConfig[] = [
  {
    stepId: "page_03",
    endStepId: "page_04",
    anchor: PAGE03_ANCHOR,
    width: 312,
    nudgeX: 4,
  },
  {
    stepId: "page_04",
    endStepId: "page_04_data",
    anchor: PAGE04_ANCHOR,
    width: 312,
  },
  {
    stepId: "page_04_data",
    endStepId: "page_05",
    anchor: PAGE04_DATA_TABLE,
    width: 398,
    fontSize: 18,
    lineGap: 23,
    nudgeX: -6,
    nudgeY: -2,
  },
  {
    stepId: "page_05",
    endStepId: "page_06",
    anchor: PAGE05_ANCHOR,
    width: 318,
    nudgeX: 4,
  },
  {
    stepId: "page_06",
    endStepId: "page_07",
    anchor: PAGE6_UASSET_FRAME,
    width: 318,
  },
  {
    stepId: "page_07",
    endStepId: "page_08",
    anchor: PAGE6_UASSET_FRAME,
    width: 318,
  },
  {
    stepId: "page_08",
    endStepId: "page_09",
    anchor: PAGE8_UASSET_FRAME,
    width: 318,
  },
  {
    stepId: "page_09",
    endStepId: "page_09_img",
    anchor: PAGE9_UASSET_FRAME,
    width: 318,
    nudgeX: 120,
  },
  {
    stepId: "page_09_img",
    endStepId: "page_10",
    anchor: SUPPLEMENT_IMAGE_BOX,
    width: 270,
    nudgeX: -6,
  },
  {
    stepId: "page_16",
    endStepId: "page_17",
    anchor: PLACEHOLDER_BOARD,
    width: 366,
    fontSize: 19,
    lineGap: 25,
    nudgeX: -8,
    nudgeY: 6,
  },
  {
    stepId: "page_17",
    endStepId: "page_18",
    anchor: PLACEHOLDER_BOARD,
    width: 258,
    fontSize: 19,
    nudgeX: -12,
  },
  {
    stepId: "page_18_img",
    endStepId: "page_19",
    anchor: SUPPLEMENT_IMAGE_BOX,
    width: 338,
    fontSize: 19,
    lineGap: 24,
    nudgeX: -12,
  },
  {
    stepId: "page_19",
    endStepId: "page_21",
    anchor: PLACEHOLDER_BOARD,
    width: 334,
    fontSize: 19,
    lineGap: 25,
    nudgeX: 22,
    nudgeY: -2,
  },
] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function computeCardHeight(
  lines: readonly string[],
  fontSize: number,
  lineGap: number,
) {
  const bodyHeight = fontSize + (lines.length - 1) * lineGap;

  return Math.round(Math.max(74, 26 + bodyHeight + 24));
}

function computePromptBox(
  width: number,
  height: number,
): Box {
  const rawX = VIEWBOX.width - CARD_RIGHT_MARGIN - width;
  const rawY = CARD_TOP;
  const x = clamp(rawX, VIEW_MARGIN, VIEWBOX.width - VIEW_MARGIN - width);
  const y = clamp(rawY, VIEW_MARGIN, VIEWBOX.height - VIEW_MARGIN - height);

  return {x, y, width, height, radius: CARD_RADIUS};
}

function resolvePromptOverlay(frame: number) {
  return PROMPT_OVERLAY_CONFIGS.find((config) => {
    const startFrame = resolveRemotionStepFrame(config.stepId);
    const endFrame = resolveRemotionStepFrame(config.endStepId);

    return frame >= startFrame && frame < endFrame;
  });
}

function resolvePromptOpacity(frame: number, endFrame: number) {
  const leave = clamp01((endFrame - frame) / FADE_FRAME_COUNT);

  return easeInOutCubic(leave);
}

export function SlidePromptOverlay({
  frame,
  scene,
}: {
  frame: number;
  scene: SceneModel;
}) {
  const config = resolvePromptOverlay(frame);

  if (!config) {
    return null;
  }

  const content = resolveStagePromptOverlayContent(config.stepId);

  if (!content) {
    return null;
  }

  const endFrame = resolveRemotionStepFrame(config.endStepId);
  const opacity = resolvePromptOpacity(frame, endFrame);

  if (opacity <= 0.001) {
    return null;
  }

  const fontSize = config.fontSize ?? DEFAULT_FONT_SIZE;
  const lineGap = config.lineGap ?? DEFAULT_LINE_GAP;
  const box = computePromptBox(
    config.width,
    computeCardHeight(content.lines, fontSize, lineGap),
  );
  const textStartX = box.x + 18;
  const textStartY = box.y + 28;

  return (
    <g data-testid={`slide-prompt-overlay-${config.stepId}`} opacity={opacity}>
      <StageBox
        box={box}
        fill="rgba(255, 252, 247, 0.96)"
        stroke="rgba(86, 102, 116, 0.44)"
        strokeWidth={2.1}
      />
      {content.lines.map((line, index) => (
        <text
          key={`${config.stepId}-${line}-${index}`}
          x={textStartX}
          y={textStartY + index * lineGap}
          fill={index === 0 ? scene.apiStroke : "rgba(34, 48, 61, 0.84)"}
          fontSize={fontSize}
          fontWeight={index === 0 ? "790" : "730"}
          textAnchor="start"
          dominantBaseline="middle"
        >
          {line}
        </text>
      ))}
    </g>
  );
}
