import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import type {VariantId} from "../storyboard-data/pso-workbench-types";
import type {RemotionWorkbenchProps} from "./embed";
import {resolveRemotionStepFrame} from "./embed";

const VIEWBOX = {width: 1280, height: 720};

const VARIANT_THEME: Record<VariantId, {accent: string; accentSoft: string}> = {
  "bus-clean": {
    accent: "#c66f4c",
    accentSoft: "rgba(198, 111, 76, 0.12)",
  },
  "bus-wide": {
    accent: "#a56d4f",
    accentSoft: "rgba(165, 109, 79, 0.12)",
  },
  "shared-focus": {
    accent: "#b85f3c",
    accentSoft: "rgba(184, 95, 60, 0.12)",
  },
};

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
};

type RgbaColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

const PAGE_01_FRAME = resolveRemotionStepFrame("page_01");
const PAGE_02_FRAME = resolveRemotionStepFrame("page_02");
const PAGE_03_FRAME = resolveRemotionStepFrame("page_03");
const PAGE_04_FRAME = resolveRemotionStepFrame("page_04");
const PAGE_05_FRAME = resolveRemotionStepFrame("page_05");

const PAGE2_LEFT_BOX: Box = {x: 210, y: 316, width: 150, height: 88, radius: 20};
const PAGE2_CENTER_BOX: Box = {x: 480, y: 304, width: 320, height: 112, radius: 24};
const PAGE2_RIGHT_BOX: Box = {x: 920, y: 316, width: 150, height: 88, radius: 20};

const PAGE3_LEFT_BOX: Box = {x: 210, y: 424, width: 150, height: 88, radius: 20};
const PAGE3_CENTER_BOX: Box = {x: 420, y: 402, width: 440, height: 126, radius: 28};
const PAGE3_RIGHT_BOX: Box = {x: 920, y: 424, width: 150, height: 88, radius: 20};

const PAGE3_SHADER_CODE_BOX: Box = {
  x: 286,
  y: 134,
  width: 156,
  height: 54,
  radius: 18,
};
const PAGE3_SHADER_BINARY_BOX: Box = {
  x: 536,
  y: 134,
  width: 152,
  height: 54,
  radius: 18,
};
const PAGE3_DEPTH_BOX: Box = {
  x: 700,
  y: 134,
  width: 92,
  height: 54,
  radius: 18,
};
const PAGE3_BLEND_BOX: Box = {
  x: 814,
  y: 134,
  width: 92,
  height: 54,
  radius: 18,
};
const PAGE4_DESCRIPTION_BOX: Box = {
  x: 460,
  y: 0,
  width: 360,
  height: 44,
  radius: 18,
};
const PAGE4_PSO_BOX: Box = {
  x: 460,
  y: 0,
  width: 360,
  height: 52,
  radius: 20,
};
const PAGE5_MESH_BOX: Box = {
  x: 150,
  y: 138,
  width: 112,
  height: 58,
  radius: 18,
};
const PAGE5_MATERIAL_BOX: Box = {
  x: 336,
  y: 138,
  width: 140,
  height: 58,
  radius: 18,
};
const PAGE5_COOKED_BOX: Box = {
  x: 566,
  y: 128,
  width: 200,
  height: 76,
  radius: 20,
};

const PIXEL_GRID_SIZE = 60;
const PIXEL_CELL_SIZE = 12;
const PIXEL_STEP = 16;
const PIXEL_COLORS = [
  "#d16e4a",
  "#ddb38f",
  "#8d9ab0",
  "#f0d8c6",
  "#e6bf9f",
  "#d16e4a",
  "#d7c1af",
  "#8d9ab0",
  "#d7c1af",
  "#f0d8c6",
  "#d16e4a",
  "#ddb38f",
  "#8d9ab0",
  "#d7c1af",
  "#e6bf9f",
  "#d16e4a",
] as const;


function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function mix(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function mixRgba(from: RgbaColor, to: RgbaColor, progress: number) {
  const r = Math.round(mix(from.r, to.r, progress));
  const g = Math.round(mix(from.g, to.g, progress));
  const b = Math.round(mix(from.b, to.b, progress));
  const a = Math.round(mix(from.a, to.a, progress) * 1000) / 1000;

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function easeInOutCubic(value: number) {
  if (value < 0.5) {
    return 4 * value * value * value;
  }

  return 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function resolveSegmentProgress(frame: number, fromFrame: number, toFrame: number) {
  const distance = Math.max(1, toFrame - fromFrame);
  const rawProgress = clamp01((frame - fromFrame) / distance);

  return easeInOutCubic(rawProgress);
}

function mixBox(fromBox: Box, toBox: Box, progress: number): Box {
  return {
    x: mix(fromBox.x, toBox.x, progress),
    y: mix(fromBox.y, toBox.y, progress),
    width: mix(fromBox.width, toBox.width, progress),
    height: mix(fromBox.height, toBox.height, progress),
    radius: mix(fromBox.radius, toBox.radius, progress),
  };
}

function horizontalPath(startX: number, endX: number, y: number) {
  return `M ${startX} ${y} L ${endX} ${y}`;
}

function verticalPath(x: number, startY: number, endY: number) {
  return `M ${x} ${startY} L ${x} ${endY}`;
}

function boxCenterX(box: Box) {
  return box.x + box.width / 2;
}

function boxCenterY(box: Box) {
  return box.y + box.height / 2;
}

function boxBottom(box: Box) {
  return box.y + box.height;
}

function VertexTriangles({
  cx,
  cy,
  opacity,
  scale,
}: {
  cx: number;
  cy: number;
  opacity: number;
  scale: number;
}) {
  const p1 = {x: cx - 56, y: cy + 22};
  const p2 = {x: cx - 12, y: cy - 28};
  const p3 = {x: cx + 22, y: cy + 20};
  const p4 = {x: cx + 60, y: cy - 4};

  return (
    <g
      opacity={opacity}
      data-testid="vertex-icon"
      transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`}
    >
      <path
        d={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${p4.x} ${p4.y}`}
        fill="none"
        stroke="rgba(34, 48, 61, 0.82)"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d={`M ${p1.x} ${p1.y} L ${p3.x} ${p3.y}`}
        fill="none"
        stroke="rgba(34, 48, 61, 0.82)"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d={`M ${p2.x} ${p2.y} L ${p4.x} ${p4.y}`}
        fill="none"
        stroke="rgba(34, 48, 61, 0.82)"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {[p1, p2, p3, p4].map((point, index) => (
        <circle
          key={`${point.x}-${point.y}-${index}`}
          cx={point.x}
          cy={point.y}
          r="5.2"
          fill="#22303d"
        />
      ))}
    </g>
  );
}

function PixelGrid({
  x,
  y,
  opacity,
  scale,
  revealProgress,
}: {
  x: number;
  y: number;
  opacity: number;
  scale: number;
  revealProgress: number;
}) {
  const centerX = x + PIXEL_GRID_SIZE / 2;
  const centerY = y + PIXEL_GRID_SIZE / 2;

  return (
    <g
      opacity={opacity}
      data-testid="pixel-grid"
      transform={`translate(${centerX} ${centerY}) scale(${scale}) translate(${-centerX} ${-centerY})`}
    >
      {PIXEL_COLORS.map((color, index) => {
        const row = Math.floor(index / 4);
        const col = index % 4;
        const cellX = x + col * PIXEL_STEP;
        const cellY = y + row * PIXEL_STEP;
        const cellCenterX = cellX + PIXEL_CELL_SIZE / 2;
        const cellCenterY = cellY + PIXEL_CELL_SIZE / 2;
        const localProgress = clamp01(revealProgress * 1.46 - index * 0.075);
        const easedLocalProgress = easeInOutCubic(localProgress);

        return (
          <rect
            key={`${color}-${index}`}
            x={cellX}
            y={cellY}
            width={PIXEL_CELL_SIZE}
            height={PIXEL_CELL_SIZE}
            rx="3"
            fill={color}
            stroke="rgba(34, 48, 61, 0.08)"
            strokeWidth="1"
            opacity={easedLocalProgress}
            transform={`translate(${cellCenterX} ${cellCenterY}) scale(${mix(0.38, 1, easedLocalProgress)}) translate(${-cellCenterX} ${-cellCenterY})`}
          />
        );
      })}
    </g>
  );
}

type StageBoxProps = {
  box: Box;
  fill: string;
  stroke: string;
  strokeWidth?: number;
  label?: string;
  labelOpacity?: number;
  labelSize?: number;
  labelWeight?: number;
  tone?: "default" | "asset";
};

function StageBox({
  box,
  fill,
  stroke,
  strokeWidth = 2.8,
  label,
  labelOpacity = 1,
  labelSize = 24,
  labelWeight = 650,
  tone = "default",
}: StageBoxProps) {
  const centerX = boxCenterX(box);
  const centerY = boxCenterY(box) + 3;

  return (
    <>
      <rect
        x={box.x}
        y={box.y}
        width={box.width}
        height={box.height}
        rx={box.radius}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      {tone === "asset" ? (
        <>
          <rect
            x={box.x + 16}
            y={box.y + 10}
            width={box.width - 32}
            height={10}
            rx="5"
            fill="rgba(132, 179, 144, 0.2)"
          />
          <rect
            x={box.x + 16}
            y={box.y + 24}
            width={44}
            height={6}
            rx="3"
            fill="rgba(98, 132, 108, 0.2)"
          />
        </>
      ) : null}
      {label ? (
        <text
          x={centerX}
          y={centerY}
          fill="#22303d"
          fontSize={labelSize}
          fontWeight={labelWeight}
          textAnchor="middle"
          dominantBaseline="middle"
          opacity={labelOpacity}
        >
          {label}
        </text>
      ) : null}
    </>
  );
}

function StackedLabel({
  x,
  y,
  lines,
  opacity = 1,
  fontSize = 22,
  fontWeight = 700,
  lineGap = 23,
  scale = 1,
  fill = "#22303d",
}: {
  x: number;
  y: number;
  lines: string[];
  opacity?: number;
  fontSize?: number;
  fontWeight?: number;
  lineGap?: number;
  scale?: number;
  fill?: string;
}) {
  const startY = y - ((lines.length - 1) * lineGap) / 2;

  return (
    <g
      opacity={opacity}
      transform={`translate(${x} ${y}) scale(${scale}) translate(${-x} ${-y})`}
    >
      {lines.map((line, index) => (
        <text
          key={`${line}-${index}`}
          x={x}
          y={startY + index * lineGap}
          fill={fill}
          fontSize={fontSize}
          fontWeight={fontWeight}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function ApiBadge({
  x,
  y,
  id,
  stroke,
  fill = "rgba(255, 251, 246, 0.98)",
  radius = 12,
  opacity = 1,
}: {
  x: number;
  y: number;
  id: number;
  stroke: string;
  fill?: string;
  radius?: number;
  opacity?: number;
}) {
  return (
    <g opacity={opacity}>
      <circle cx={x} cy={y} r={radius} fill={fill} stroke={stroke} strokeWidth="2" />
      <text
        x={x}
        y={y + 1}
        fill={stroke}
        fontSize={radius === 12 ? "14" : "15"}
        fontWeight="800"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {id}
      </text>
    </g>
  );
}

function ArrowPath({
  d,
  stroke,
  opacity,
  shaftWidth = 3.2,
  underlayWidth = 6,
  underlayOpacity = 0.12,
}: {
  d: string;
  stroke: string;
  opacity: number;
  shaftWidth?: number;
  underlayWidth?: number;
  underlayOpacity?: number;
}) {
  return (
    <>
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={underlayWidth}
        strokeLinecap="round"
        opacity={opacity * underlayOpacity}
      />
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={shaftWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
      />
    </>
  );
}

function ArrowHead({
  tipX,
  tipY,
  direction,
  stroke,
  opacity,
  size = 10,
  strokeWidth = 3.2,
}: {
  tipX: number;
  tipY: number;
  direction: "right" | "down";
  stroke: string;
  opacity: number;
  size?: number;
  strokeWidth?: number;
}) {
  const half = size * 0.55;
  const headStart = size - strokeWidth * 0.35;

  if (direction === "right") {
    return (
      <>
        <path
          d={`M ${tipX - headStart} ${tipY - half} L ${tipX} ${tipY}`}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={opacity}
        />
        <path
          d={`M ${tipX - headStart} ${tipY + half} L ${tipX} ${tipY}`}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={opacity}
        />
      </>
    );
  }

  return (
    <>
      <path
        d={`M ${tipX - half} ${tipY - headStart} L ${tipX} ${tipY}`}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
      />
      <path
        d={`M ${tipX + half} ${tipY - headStart} L ${tipX} ${tipY}`}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
      />
    </>
  );
}

function StrokeArrow({
  d,
  stroke,
  opacity,
  tipX,
  tipY,
  direction,
  shaftWidth = 3.2,
  underlayWidth = 6,
  underlayOpacity = 0.12,
  headSize = 10,
}: {
  d: string;
  stroke: string;
  opacity: number;
  tipX: number;
  tipY: number;
  direction: "right" | "down";
  shaftWidth?: number;
  underlayWidth?: number;
  underlayOpacity?: number;
  headSize?: number;
}) {
  return (
    <>
      <ArrowPath
        d={d}
        stroke={stroke}
        opacity={opacity}
        shaftWidth={shaftWidth}
        underlayWidth={underlayWidth}
        underlayOpacity={underlayOpacity}
      />
      <ArrowHead
        tipX={tipX}
        tipY={tipY}
        direction={direction}
        stroke={stroke}
        opacity={opacity}
        size={headSize}
        strokeWidth={shaftWidth}
      />
    </>
  );
}

type SceneSvgProps = {
  frame: number;
  variantId?: VariantId;
};

export const SceneSvg: React.FC<SceneSvgProps> = ({
  frame,
  variantId = "bus-clean",
}) => {
  const page12Progress = resolveSegmentProgress(frame, PAGE_01_FRAME, PAGE_02_FRAME);
  const page23Progress = resolveSegmentProgress(frame, PAGE_02_FRAME, PAGE_03_FRAME);
  const page34Progress = resolveSegmentProgress(frame, PAGE_03_FRAME, PAGE_04_FRAME);
  const page45Progress = resolveSegmentProgress(frame, PAGE_04_FRAME, PAGE_05_FRAME);
  const settledPage12Progress = frame >= PAGE_02_FRAME ? 1 : page12Progress;
  const settledPage23Progress = frame <= PAGE_02_FRAME ? 0 : page23Progress;
  const settledPage34Progress = frame <= PAGE_03_FRAME ? 0 : page34Progress;
  const settledPage45Progress = frame <= PAGE_04_FRAME ? 0 : page45Progress;
  const theme = VARIANT_THEME[variantId];

  const neutralFill = "rgba(255, 251, 246, 0.98)";
  const focusFill = "rgba(248, 236, 226, 0.98)";
  const assetFill = "rgba(231, 242, 233, 0.98)";
  const assetStroke = "rgba(104, 140, 114, 0.86)";
  const nodeStroke = "rgba(34, 48, 61, 0.78)";
  const wireStroke = "rgba(76, 90, 102, 0.72)";
  const apiStroke = "#d06b44";
  const wireStrokeColor = {r: 76, g: 90, b: 102, a: 0.72};
  const apiStrokeColor = {r: 208, g: 107, b: 68, a: 1};

  const page34SpineShift = mix(0, 28, settledPage34Progress);
  const mixedLeftBox = mixBox(PAGE2_LEFT_BOX, PAGE3_LEFT_BOX, settledPage23Progress);
  const mixedCenterBox = mixBox(PAGE2_CENTER_BOX, PAGE3_CENTER_BOX, settledPage23Progress);
  const mixedRightBox = mixBox(PAGE2_RIGHT_BOX, PAGE3_RIGHT_BOX, settledPage23Progress);
  const leftBox = {
    ...mixedLeftBox,
    y: mixedLeftBox.y + page34SpineShift,
  };
  const centerBox = {
    ...mixedCenterBox,
    y: mixedCenterBox.y + page34SpineShift,
  };
  const rightBox = {
    ...mixedRightBox,
    y: mixedRightBox.y + page34SpineShift,
  };

  const leftCenterX = boxCenterX(leftBox);
  const centerCenterX = boxCenterX(centerBox);
  const rightCenterX = boxCenterX(rightBox);
  const axisY = boxCenterY(leftBox);
  const centerTextY = boxCenterY(centerBox) + 4;
  const arrowStartGap = mix(24, 20, settledPage23Progress);
  const arrowEndGap = mix(24, 20, settledPage23Progress);

  const page12LabelFadeProgress = clamp01(settledPage12Progress / 0.58);
  const page12CenterLabelFadeProgress = clamp01(settledPage12Progress / 0.42);
  const page12ShapeRevealProgress = clamp01((settledPage12Progress - 0.16) / 0.42);
  const page12LabelRevealProgress = clamp01((settledPage12Progress - 0.3) / 0.42);
  const oldLabelOpacity = 1 - page12LabelFadeProgress;
  const oldCenterLabelOpacity = 1 - page12CenterLabelFadeProgress;
  const newShapeOpacity = page12ShapeRevealProgress;
  const newLabelOpacity = page12LabelRevealProgress;
  const oldLabelScale = mix(1, 0.9, page12LabelFadeProgress);
  const newShapeScale = mix(0.68, 1, easeInOutCubic(newShapeOpacity));
  const newLabelScale = mix(0.78, 1, easeInOutCubic(newLabelOpacity));

  const upperNodeOpacity = clamp01((settledPage23Progress - 0.28) / 0.38);
  const upperLineOpacity = clamp01((settledPage23Progress - 0.42) / 0.34);
  const upperNodeScale = mix(0.86, 1, easeInOutCubic(upperNodeOpacity));
  const upperLineProgress = clamp01((settledPage23Progress - 0.42) / 0.34);
  const upperLift = mix(-34, 0, easeInOutCubic(upperNodeOpacity));
  const page34UpperShift = mix(0, -24, settledPage34Progress);
  const upperBandGap = 18;
  const shaderCompileGap = 60;
  const gpuQuarterStep = centerBox.width / 4;
  const binaryTargetX =
    centerBox.x + gpuQuarterStep - PAGE3_SHADER_BINARY_BOX.width / 2;
  const depthTargetX = binaryTargetX + PAGE3_SHADER_BINARY_BOX.width + upperBandGap;
  const blendTargetX = depthTargetX + PAGE3_DEPTH_BOX.width + upperBandGap;
  const shaderCodeTargetX = leftCenterX - PAGE3_SHADER_CODE_BOX.width / 2;
  const upperLineNodeGap = 12;

  const shaderCodeBox = {
    ...PAGE3_SHADER_CODE_BOX,
    x: shaderCodeTargetX,
    y: PAGE3_SHADER_CODE_BOX.y + upperLift + page34UpperShift,
  };
  const shaderBinaryBox = {
    ...PAGE3_SHADER_BINARY_BOX,
    x: binaryTargetX,
    y: PAGE3_SHADER_BINARY_BOX.y + upperLift + page34UpperShift,
  };
  const depthBox = {
    ...PAGE3_DEPTH_BOX,
    x: depthTargetX,
    y: PAGE3_DEPTH_BOX.y + upperLift + page34UpperShift,
  };
  const blendBox = {
    ...PAGE3_BLEND_BOX,
    x: blendTargetX,
    y: PAGE3_BLEND_BOX.y + upperLift + page34UpperShift,
  };

  const gpuTopY = centerBox.y;
  const shaderCodeCenterX = boxCenterX(shaderCodeBox);
  const shaderBinaryCenterX = boxCenterX(shaderBinaryBox);
  const depthCenterX = boxCenterX(depthBox);
  const blendCenterX = boxCenterX(blendBox);
  const pixelGridX = rightCenterX - PIXEL_GRID_SIZE / 2;
  const pixelGridY = axisY - PIXEL_GRID_SIZE / 2;
  const shaderLineY = boxCenterY(shaderCodeBox);
  const shaderLineStartX = shaderCodeBox.x + shaderCodeBox.width + 12;
  const shaderLineEndX = shaderBinaryBox.x - 12;
  const shaderArrowTipX = mix(shaderLineStartX, shaderLineEndX, upperLineProgress);
  const binaryLineStartY = boxBottom(shaderBinaryBox) + upperLineNodeGap;
  const depthLineStartY = boxBottom(depthBox) + upperLineNodeGap;
  const blendLineStartY = boxBottom(blendBox) + upperLineNodeGap;
  const gpuArrowGap = 14;
  const apiArrowTipY = gpuTopY - gpuArrowGap;
  const binaryLineEndY = mix(binaryLineStartY, apiArrowTipY, upperLineProgress);
  const depthLineEndY = mix(depthLineStartY, apiArrowTipY, upperLineProgress);
  const blendLineEndY = mix(blendLineStartY, apiArrowTipY, upperLineProgress);
  const legacyRetractProgress = easeInOutCubic(
    clamp01((settledPage34Progress - 0.04) / 0.66),
  );
  const page4RelationOpacity = clamp01((settledPage34Progress - 0.18) / 0.24);
  const shaderArtifactLabelProgress = easeInOutCubic(
    clamp01((settledPage34Progress - 0.08) / 0.3),
  );
  const legacyUpperCallOpacity =
    upperLineOpacity * clamp01(1 - settledPage34Progress / 0.92);
  const descriptionOpacity = clamp01((settledPage34Progress - 0.12) / 0.26);
  const descriptionScale = mix(0.92, 1, easeInOutCubic(descriptionOpacity));
  const psoOpacity = clamp01((settledPage34Progress - 0.36) / 0.24);
  const psoScale = mix(0.9, 1, easeInOutCubic(psoOpacity));
  const createOpacity = clamp01((settledPage34Progress - 0.3) / 0.22);
  const psoBindOpacity = clamp01((settledPage34Progress - 0.5) / 0.18);
  const page4UpperNodeOpacity = upperNodeOpacity * clamp01(1 - settledPage45Progress / 0.78);
  const page4UpperLineOpacity =
    upperLineOpacity * clamp01(1 - settledPage45Progress / 0.72);
  const page4MiddleFade = clamp01(1 - settledPage45Progress / 0.52);
  const page4DescriptionOpacity = descriptionOpacity * page4MiddleFade;
  const page4PsoOpacity = psoOpacity * page4MiddleFade;
  const page4CreateOpacity = createOpacity * page4MiddleFade;
  const page4PsoBindOpacity = psoBindOpacity * page4MiddleFade;
  const upperBandBottomY = Math.max(
    boxBottom(shaderBinaryBox),
    boxBottom(depthBox),
    boxBottom(blendBox),
  );
  const layerGap =
    (gpuTopY - upperBandBottomY - PAGE4_DESCRIPTION_BOX.height - PAGE4_PSO_BOX.height) / 3;
  const descriptionBox = {
    ...PAGE4_DESCRIPTION_BOX,
    y: upperBandBottomY + layerGap,
  };
  const descriptionCenterX = boxCenterX(descriptionBox);
  const descriptionCenterY = boxCenterY(descriptionBox);
  const descriptionTipY = descriptionBox.y - 14;
  const psoBox = {
    ...PAGE4_PSO_BOX,
    y: descriptionBox.y + descriptionBox.height + layerGap,
  };
  const psoCenterX = boxCenterX(psoBox);
  const psoCenterY = boxCenterY(psoBox);
  const psoTipY = psoBox.y - 14;
  const descriptionToPsoStartY = boxBottom(descriptionBox) + 10;
  const psoBindStartY = boxBottom(psoBox) + 10;
  const psoBindEndY = gpuTopY - 12;
  const verticalMorphEndY = mix(apiArrowTipY, descriptionTipY, legacyRetractProgress);
  const verticalMorphStroke = mixRgba(
    apiStrokeColor,
    wireStrokeColor,
    easeInOutCubic(clamp01((settledPage34Progress - 0.24) / 0.5)),
  );
  const verticalBadgeOpacity =
    page4UpperLineOpacity * clamp01(1 - settledPage34Progress / 0.58);
  const page5AssetOpacity = clamp01((settledPage45Progress - 0.14) / 0.28);
  const page5AssetScale = mix(0.9, 1, easeInOutCubic(page5AssetOpacity));
  const page5ArrowOpacity = clamp01((settledPage45Progress - 0.24) / 0.24);
  const page5CookOpacity = clamp01((settledPage45Progress - 0.2) / 0.22);
  const page5VertexLabelOpacity = clamp01((settledPage45Progress - 0.2) / 0.24);
  const page5VertexIconOpacity = newShapeOpacity * clamp01(1 - settledPage45Progress / 0.84);
  const page5MeshBox = {
    ...PAGE5_MESH_BOX,
    x: leftBox.x - 24 - PAGE5_MESH_BOX.width,
    y: axisY - PAGE5_MESH_BOX.height / 2,
  };
  const page5CookedBox = {
    ...PAGE5_COOKED_BOX,
    x: centerCenterX - PAGE5_COOKED_BOX.width / 2,
  };
  const page5MaterialBox = {
    ...PAGE5_MATERIAL_BOX,
    x: page5CookedBox.x - 40 - PAGE5_MATERIAL_BOX.width,
  };
  const page5MeshCenterX = boxCenterX(page5MeshBox);
  const page5MeshCenterY = boxCenterY(page5MeshBox);
  const page5MaterialCenterX = boxCenterX(page5MaterialBox);
  const page5CookedCenterX = boxCenterX(page5CookedBox);
  const page5CookedCenterY = boxCenterY(page5CookedBox);
  const page5MeshToVertexStartX = page5MeshBox.x + page5MeshBox.width + 8;
  const page5MeshToVertexEndX = leftBox.x - 8;
  const page5MaterialToCookY = boxCenterY(page5MaterialBox);
  const page5MaterialToCookStartX = page5MaterialBox.x + page5MaterialBox.width + 8;
  const page5MaterialToCookEndX = page5CookedBox.x - 8;
  const page5CookedToGpuStartY = boxBottom(page5CookedBox) + 10;
  const page5CookedToGpuEndY = gpuTopY - 12;

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
          <StrokeArrow
            d={horizontalPath(
              leftBox.x + leftBox.width + arrowStartGap,
              centerBox.x - arrowEndGap,
              axisY,
            )}
            stroke={wireStroke}
            opacity={1}
            tipX={centerBox.x - arrowEndGap}
            tipY={axisY}
            direction="right"
            shaftWidth={3}
            underlayWidth={5.6}
            underlayOpacity={0.14}
            headSize={9}
          />
          <StrokeArrow
            d={horizontalPath(
              centerBox.x + centerBox.width + arrowStartGap,
              rightBox.x - arrowEndGap,
              axisY,
            )}
            stroke={wireStroke}
            opacity={1}
            tipX={rightBox.x - arrowEndGap}
            tipY={axisY}
            direction="right"
            shaftWidth={3}
            underlayWidth={5.6}
            underlayOpacity={0.14}
            headSize={9}
          />

          <StageBox box={leftBox} fill={neutralFill} stroke={nodeStroke} />
          <text
            x={leftCenterX}
            y={axisY + 4}
            fill="#22303d"
            fontSize="28"
            fontWeight="650"
            textAnchor="middle"
            dominantBaseline="middle"
            opacity={oldLabelOpacity}
            transform={`translate(${leftCenterX} ${axisY + 4}) scale(${oldLabelScale}) translate(${-leftCenterX} ${-(axisY + 4)})`}
          >
            Input
          </text>
          <VertexTriangles
            cx={leftCenterX}
            cy={axisY}
            opacity={page5VertexIconOpacity}
            scale={newShapeScale}
          />

          <StageBox
            box={centerBox}
            fill={focusFill}
            stroke={theme.accent}
            strokeWidth={mix(2.8, 3.2, settledPage23Progress)}
          />
          {settledPage34Progress > 0 ? (
            <g opacity={settledPage34Progress}>
              <StageBox
                box={centerBox}
                fill={neutralFill}
                stroke={nodeStroke}
                strokeWidth={2.8}
              />
            </g>
          ) : null}
          <text
            x={centerCenterX}
            y={centerTextY}
            fill="#22303d"
            fontSize="36"
            fontWeight="700"
            letterSpacing="-0.04em"
            textAnchor="middle"
            dominantBaseline="middle"
            opacity={oldCenterLabelOpacity}
            transform={`translate(${centerCenterX} ${centerTextY}) scale(${oldLabelScale}) translate(${-centerCenterX} ${-centerTextY})`}
          >
            f(x)
          </text>
          <text
            x={centerCenterX}
            y={centerTextY}
            fill="#22303d"
            fontSize={mix(44, 48, settledPage23Progress)}
            fontWeight={mix(750, 760, settledPage23Progress)}
            letterSpacing="-0.06em"
            textAnchor="middle"
            dominantBaseline="middle"
            opacity={newLabelOpacity}
            transform={`translate(${centerCenterX} ${centerTextY}) scale(${newLabelScale}) translate(${-centerCenterX} ${-centerTextY})`}
          >
            GPU
          </text>

          <StageBox box={rightBox} fill={neutralFill} stroke={nodeStroke} />
          <text
            x={rightCenterX}
            y={axisY + 4}
            fill="#22303d"
            fontSize="28"
            fontWeight="650"
            textAnchor="middle"
            dominantBaseline="middle"
            opacity={oldLabelOpacity}
            transform={`translate(${rightCenterX} ${axisY + 4}) scale(${oldLabelScale}) translate(${-rightCenterX} ${-(axisY + 4)})`}
          >
            Output
          </text>
          <PixelGrid
            x={pixelGridX}
            y={pixelGridY}
            opacity={newShapeOpacity}
            scale={newShapeScale}
            revealProgress={newShapeOpacity}
          />

          {settledPage23Progress > 0 ? (
            <>
              <g
                opacity={page4UpperNodeOpacity}
                transform={`translate(${shaderCodeCenterX} ${boxCenterY(shaderCodeBox)}) scale(${upperNodeScale}) translate(${-shaderCodeCenterX} ${-boxCenterY(shaderCodeBox)})`}
              >
                <StageBox
                  box={shaderCodeBox}
                  fill={neutralFill}
                  stroke={nodeStroke}
                />
                <StackedLabel
                  x={shaderCodeCenterX}
                  y={boxCenterY(shaderCodeBox) + 2}
                  lines={["Raw", "ShaderCode"]}
                  fontSize={22}
                  fontWeight={680}
                  lineGap={23}
                />
              </g>

              {legacyUpperCallOpacity > 0 ? (
                <>
                  <StrokeArrow
                    d={horizontalPath(shaderLineStartX, shaderArrowTipX, shaderLineY)}
                    stroke={apiStroke}
                    opacity={legacyUpperCallOpacity}
                    tipX={shaderArrowTipX}
                    tipY={shaderLineY}
                    direction="right"
                    shaftWidth={3.2}
                    underlayWidth={6}
                    underlayOpacity={0.12}
                    headSize={10}
                  />
                  <ApiBadge
                    x={mix(shaderLineStartX, (shaderLineStartX + shaderLineEndX) / 2, upperLineProgress)}
                    y={shaderLineY - 18}
                    id={1}
                    stroke={apiStroke}
                    opacity={legacyUpperCallOpacity}
                  />
                </>
              ) : null}

              <g
                opacity={page4UpperNodeOpacity}
                transform={`translate(${shaderBinaryCenterX} ${boxCenterY(shaderBinaryBox)}) scale(${upperNodeScale}) translate(${-shaderBinaryCenterX} ${-boxCenterY(shaderBinaryBox)})`}
              >
                <StageBox
                  box={shaderBinaryBox}
                  fill={neutralFill}
                  stroke={nodeStroke}
                />
                {shaderArtifactLabelProgress < 0.999 ? (
                  <StackedLabel
                    x={shaderBinaryCenterX}
                    y={boxCenterY(shaderBinaryBox) + 2}
                    lines={["Binary", "ShaderCode"]}
                    opacity={1 - shaderArtifactLabelProgress}
                    fontSize={21}
                    fontWeight={700}
                    lineGap={22}
                  />
                ) : null}
                {shaderArtifactLabelProgress > 0.001 ? (
                  <StackedLabel
                    x={shaderBinaryCenterX}
                    y={boxCenterY(shaderBinaryBox) + 2}
                    lines={["SPIR-V", "ShaderCode"]}
                    opacity={shaderArtifactLabelProgress}
                    fontSize={21}
                    fontWeight={760}
                    lineGap={22}
                  />
                ) : null}
              </g>

              <g
                opacity={page4UpperNodeOpacity}
                transform={`translate(${depthCenterX} ${boxCenterY(depthBox)}) scale(${upperNodeScale}) translate(${-depthCenterX} ${-boxCenterY(depthBox)})`}
              >
                <StageBox
                  box={depthBox}
                  fill={neutralFill}
                  stroke={nodeStroke}
                  label="Depth"
                  labelSize={22}
                />
              </g>

              <g
                opacity={page4UpperNodeOpacity}
                transform={`translate(${blendCenterX} ${boxCenterY(blendBox)}) scale(${upperNodeScale}) translate(${-blendCenterX} ${-boxCenterY(blendBox)})`}
              >
                <StageBox
                  box={blendBox}
                  fill={neutralFill}
                  stroke={nodeStroke}
                  label="Blend"
                  labelSize={22}
                />
              </g>

              {page4UpperLineOpacity > 0 ? (
                <>
                  <StrokeArrow
                    d={verticalPath(shaderBinaryCenterX, binaryLineStartY, verticalMorphEndY)}
                    stroke={verticalMorphStroke}
                    opacity={page4UpperLineOpacity}
                    tipX={shaderBinaryCenterX}
                    tipY={verticalMorphEndY}
                    direction="down"
                    shaftWidth={3.2}
                    underlayWidth={6}
                    underlayOpacity={0.12}
                    headSize={10}
                  />
                  <ApiBadge
                    x={shaderBinaryCenterX - 18}
                    y={mix(binaryLineStartY, verticalMorphEndY, 0.44)}
                    id={2}
                    stroke={apiStroke}
                    opacity={verticalBadgeOpacity}
                  />
                  <StrokeArrow
                    d={verticalPath(depthCenterX, depthLineStartY, verticalMorphEndY)}
                    stroke={verticalMorphStroke}
                    opacity={page4UpperLineOpacity}
                    tipX={depthCenterX}
                    tipY={verticalMorphEndY}
                    direction="down"
                    shaftWidth={3.2}
                    underlayWidth={6}
                    underlayOpacity={0.12}
                    headSize={10}
                  />
                  <ApiBadge
                    x={depthCenterX - 18}
                    y={mix(depthLineStartY, verticalMorphEndY, 0.44)}
                    id={3}
                    stroke={apiStroke}
                    opacity={verticalBadgeOpacity}
                  />
                  <StrokeArrow
                    d={verticalPath(blendCenterX, blendLineStartY, verticalMorphEndY)}
                    stroke={verticalMorphStroke}
                    opacity={page4UpperLineOpacity}
                    tipX={blendCenterX}
                    tipY={verticalMorphEndY}
                    direction="down"
                    shaftWidth={3.2}
                    underlayWidth={6}
                    underlayOpacity={0.12}
                    headSize={10}
                  />
                  <ApiBadge
                    x={blendCenterX + 18}
                    y={mix(blendLineStartY, verticalMorphEndY, 0.44)}
                    id={4}
                    stroke={apiStroke}
                    opacity={verticalBadgeOpacity}
                  />
                </>
              ) : null}

              {settledPage34Progress > 0 && page4MiddleFade > 0 ? (
                <>
                  <StrokeArrow
                    d={horizontalPath(shaderLineStartX, shaderLineEndX, shaderLineY)}
                    stroke={wireStroke}
                    opacity={page4RelationOpacity}
                    tipX={shaderLineEndX}
                    tipY={shaderLineY}
                    direction="right"
                    shaftWidth={3}
                    underlayWidth={5.6}
                    underlayOpacity={0.12}
                    headSize={9}
                  />

                  <g
                    opacity={page4DescriptionOpacity}
                    transform={`translate(${descriptionCenterX} ${descriptionCenterY}) scale(${descriptionScale}) translate(${-descriptionCenterX} ${-descriptionCenterY})`}
                  >
                    <StageBox
                      box={descriptionBox}
                      fill={neutralFill}
                      stroke={nodeStroke}
                      strokeWidth={2.8}
                      label="Description"
                      labelSize={23}
                      labelWeight={700}
                    />
                  </g>

                  <StrokeArrow
                    d={verticalPath(psoCenterX, descriptionToPsoStartY, psoTipY)}
                    stroke={apiStroke}
                    opacity={page4CreateOpacity}
                    tipX={psoCenterX}
                    tipY={psoTipY}
                    direction="down"
                    shaftWidth={3.2}
                    underlayWidth={6}
                    underlayOpacity={0.12}
                    headSize={10}
                  />
                  <ApiBadge
                    x={psoCenterX - 18}
                    y={mix(descriptionToPsoStartY, psoTipY, 0.44)}
                    id={1}
                    stroke={apiStroke}
                    opacity={page4CreateOpacity}
                  />

                  <g
                    opacity={page4PsoOpacity}
                    transform={`translate(${psoCenterX} ${psoCenterY}) scale(${psoScale}) translate(${-psoCenterX} ${-psoCenterY})`}
                  >
                    <StageBox
                      box={psoBox}
                      fill={focusFill}
                      stroke={theme.accent}
                      strokeWidth={3}
                      label="PSO"
                      labelSize={30}
                      labelWeight={760}
                    />
                  </g>

                  <StrokeArrow
                    d={verticalPath(psoCenterX, psoBindStartY, psoBindEndY)}
                    stroke={apiStroke}
                    opacity={page4PsoBindOpacity}
                    tipX={psoCenterX}
                    tipY={psoBindEndY}
                    direction="down"
                    shaftWidth={3.2}
                    underlayWidth={6}
                    underlayOpacity={0.12}
                    headSize={10}
                  />
                  <ApiBadge
                    x={psoCenterX - 18}
                    y={mix(psoBindStartY, psoBindEndY, 0.44)}
                    id={2}
                    stroke={apiStroke}
                    opacity={page4PsoBindOpacity}
                  />
                </>
              ) : null}

              {settledPage45Progress > 0 ? (
                <>
                  <text
                    x={leftCenterX}
                    y={axisY + 4}
                    fill="#22303d"
                    fontSize="24"
                    fontWeight="680"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    opacity={page5VertexLabelOpacity}
                  >
                    VertexData
                  </text>

                  <g
                    opacity={page5AssetOpacity}
                    transform={`translate(${page5MeshCenterX} ${page5MeshCenterY}) scale(${page5AssetScale}) translate(${-page5MeshCenterX} ${-page5MeshCenterY})`}
                  >
                    <StageBox
                      box={page5MeshBox}
                      fill={assetFill}
                      stroke={assetStroke}
                      strokeWidth={2.8}
                      tone="asset"
                      label="Mesh"
                      labelSize={24}
                      labelWeight={700}
                    />
                  </g>

                  <g
                    opacity={page5AssetOpacity}
                    transform={`translate(${page5MaterialCenterX} ${boxCenterY(page5MaterialBox)}) scale(${page5AssetScale}) translate(${-page5MaterialCenterX} ${-boxCenterY(page5MaterialBox)})`}
                  >
                    <StageBox
                      box={page5MaterialBox}
                      fill={assetFill}
                      stroke={assetStroke}
                      strokeWidth={2.8}
                      tone="asset"
                      label="Material"
                      labelSize={24}
                      labelWeight={700}
                    />
                  </g>

                  <g
                    opacity={page5CookOpacity}
                    transform={`translate(${page5CookedCenterX} ${page5CookedCenterY}) scale(${mix(0.9, 1, easeInOutCubic(page5CookOpacity))}) translate(${-page5CookedCenterX} ${-page5CookedCenterY})`}
                  >
                    <StageBox
                      box={page5CookedBox}
                      fill={focusFill}
                      stroke={theme.accent}
                      strokeWidth={3}
                    />
                    <StackedLabel
                      x={page5CookedCenterX}
                      y={page5CookedCenterY + 2}
                      lines={["Cooked", "ShaderCode"]}
                      fontSize={22}
                      fontWeight={760}
                      lineGap={23}
                    />
                  </g>

                  <StrokeArrow
                    d={horizontalPath(page5MeshToVertexStartX, page5MeshToVertexEndX, axisY)}
                    stroke={wireStroke}
                    opacity={page5ArrowOpacity}
                    tipX={page5MeshToVertexEndX}
                    tipY={axisY}
                    direction="right"
                    shaftWidth={3}
                    underlayWidth={5.6}
                    underlayOpacity={0.12}
                    headSize={9}
                  />
                  <StrokeArrow
                    d={horizontalPath(page5MaterialToCookStartX, page5MaterialToCookEndX, page5MaterialToCookY)}
                    stroke={theme.accent}
                    opacity={page5ArrowOpacity}
                    tipX={page5MaterialToCookEndX}
                    tipY={page5MaterialToCookY}
                    direction="right"
                    shaftWidth={3.2}
                    underlayWidth={6}
                    underlayOpacity={0.12}
                    headSize={10}
                  />
                  <StrokeArrow
                    d={verticalPath(page5CookedCenterX, page5CookedToGpuStartY, page5CookedToGpuEndY)}
                    stroke={theme.accent}
                    opacity={page5ArrowOpacity}
                    tipX={page5CookedCenterX}
                    tipY={page5CookedToGpuEndY}
                    direction="down"
                    shaftWidth={3.2}
                    underlayWidth={6}
                    underlayOpacity={0.12}
                    headSize={10}
                  />
                </>
              ) : null}
            </>
          ) : null}
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
