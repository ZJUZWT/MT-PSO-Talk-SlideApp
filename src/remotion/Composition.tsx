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
const PAGE_06_FRAME = resolveRemotionStepFrame("page_06");
const PAGE_07_FRAME = resolveRemotionStepFrame("page_07");
const PAGE_08_FRAME = resolveRemotionStepFrame("page_08");

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
const PAGE3_PROGRAM_BOX: Box = {
  x: 528,
  y: 244,
  width: 152,
  height: 52,
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
const PAGE5_BINARY_BOX: Box = {
  x: 566,
  y: 252,
  width: 200,
  height: 76,
  radius: 20,
};
const PAGE6_ZOOM_PANEL: Box = {
  x: 156,
  y: 92,
  width: 968,
  height: 500,
  radius: 36,
};
const PAGE6_MATERIAL_BOX: Box = {
  x: 120,
  y: 232,
  width: 188,
  height: 74,
  radius: 20,
};
const PAGE6_UASSET_FRAME: Box = {
  x: 96,
  y: 56,
  width: 1050,
  height: 500,
  radius: 30,
};
const PAGE6_PLATFORM_TABLE_BOX: Box = {
  x: 104,
  y: 334,
  width: 220,
  height: 106,
  radius: 18,
};
const PAGE6_RESOURCE_BOX: Box = {
  x: 388,
  y: 232,
  width: 244,
  height: 74,
  radius: 20,
};
const PAGE6_RESOURCE_TOP_BOX: Box = {
  x: 404,
  y: 204,
  width: 244,
  height: 62,
  radius: 20,
};
const PAGE6_RESOURCE_BOTTOM_BOX: Box = {
  x: 396,
  y: 218,
  width: 244,
  height: 62,
  radius: 20,
};
const PAGE6_RESOURCE_TABLE_BOX: Box = {
  x: 382,
  y: 334,
  width: 256,
  height: 98,
  radius: 18,
};
const PAGE6_SHADERMAP_BOX: Box = {
  x: 716,
  y: 232,
  width: 188,
  height: 74,
  radius: 20,
};
const PAGE6_SHADER_TOP_BOX: Box = {
  x: 732,
  y: 204,
  width: 188,
  height: 62,
  radius: 20,
};
const PAGE6_SHADER_BOTTOM_BOX: Box = {
  x: 724,
  y: 218,
  width: 188,
  height: 62,
  radius: 20,
};
const PAGE6_SHADER_TABLE_BOX: Box = {
  x: 682,
  y: 334,
  width: 264,
  height: 98,
  radius: 18,
};
const PAGE6_FSHADER_BOX: Box = {
  x: 848,
  y: 232,
  width: 100,
  height: 74,
  radius: 20,
};
const PAGE6_FSHADER_TOP_BOX: Box = {
  x: 862,
  y: 204,
  width: 100,
  height: 62,
  radius: 20,
};
const PAGE6_FSHADER_BOTTOM_BOX: Box = {
  x: 855,
  y: 218,
  width: 100,
  height: 62,
  radius: 20,
};
const PAGE6_INLINE_BOX: Box = {
  x: 1000,
  y: 232,
  width: 128,
  height: 74,
  radius: 20,
};
const PAGE7_CACHE_BOX: Box = {
  x: 1136,
  y: 190,
  width: 118,
  height: 176,
  radius: 24,
};
const PAGE8_LIBRARY_BOX: Box = {
  x: 707,
  y: 273,
  width: 320,
  height: 120,
  radius: 26,
};
const PAGE8_MATERIAL_A_BOX: Box = {
  x: 427,
  y: 173,
  width: 170,
  height: 58,
  radius: 18,
};
const PAGE8_MATERIAL_B_BOX: Box = {
  x: 427,
  y: 263,
  width: 170,
  height: 58,
  radius: 18,
};
const PAGE8_MATERIAL_C_BOX: Box = {
  x: 427,
  y: 353,
  width: 170,
  height: 58,
  radius: 18,
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

function hexToRgbaColor(hex: string, alpha = 1): RgbaColor {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;

  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
    a: alpha,
  };
}

function easeInOutCubic(value: number) {
  if (value < 0.5) {
    return 4 * value * value * value;
  }

  return 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function easeInOutQuint(value: number) {
  if (value < 0.5) {
    return 16 * Math.pow(value, 5);
  }

  return 1 - Math.pow(-2 * value + 2, 5) / 2;
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

function boxRight(box: Box) {
  return box.x + box.width;
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
  const boxTone = tone === "asset" ? "asset" : "default";

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
        data-tone={boxTone}
      />
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
  testId,
}: {
  x: number;
  y: number;
  id: number;
  stroke: string;
  fill?: string;
  radius?: number;
  opacity?: number;
  testId?: string;
}) {
  return (
    <g opacity={opacity} data-testid={testId}>
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

function CalloutBadge({
  x,
  y,
  label,
  stroke,
  fill = "rgba(255, 251, 246, 0.98)",
  radius = 13,
  opacity = 1,
  testId,
}: {
  x: number;
  y: number;
  label: string;
  stroke: string;
  fill?: string;
  radius?: number;
  opacity?: number;
  testId?: string;
}) {
  return (
    <g opacity={opacity} data-testid={testId}>
      <circle cx={x} cy={y} r={radius} fill={fill} stroke={stroke} strokeWidth="2.2" />
      <text
        x={x}
        y={y + 1}
        fill={stroke}
        fontSize="16"
        fontWeight="820"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {label}
      </text>
    </g>
  );
}

function ArrowLabelPill({
  x,
  y,
  width,
  height,
  label,
  stroke,
  fill = "rgba(255, 251, 246, 0.96)",
  textFill = "#22303d",
  fontSize = 14.5,
  fontWeight = 720,
  opacity = 1,
  testId,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  stroke: string;
  fill?: string;
  textFill?: string;
  fontSize?: number;
  fontWeight?: number;
  opacity?: number;
  testId?: string;
}) {
  return (
    <g opacity={opacity} data-testid={testId}>
      <rect
        x={x - width / 2}
        y={y - height / 2}
        width={width}
        height={height}
        rx={height / 2}
        fill={fill}
        stroke={stroke}
        strokeWidth="1.8"
      />
      <text
        x={x}
        y={y + 0.5}
        fill={textFill}
        fontSize={fontSize}
        fontWeight={fontWeight}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {label}
      </text>
    </g>
  );
}

function DiagramInfoTable({
  box,
  segments,
  stroke,
  operatorFill = stroke,
  fill = "rgba(255, 255, 255, 0.9)",
  opacity = 1,
  testId,
  headerFontSize = 14.2,
  noteFontSize = 12.8,
  headerLineGap = 15,
  noteLineGap = 14,
}: {
  box: Box;
  segments: Array<{
    width: number;
    label: string | string[];
    note?: string | string[];
    kind?: "value" | "operator";
  }>;
  stroke: string;
  operatorFill?: string;
  fill?: string;
  opacity?: number;
  testId?: string;
  headerFontSize?: number;
  noteFontSize?: number;
  headerLineGap?: number;
  noteLineGap?: number;
}) {
  const headerY = box.y + 24;
  const noteY = box.y + 68;
  const dividerY = box.y + 47;
  let cursorX = box.x;

  return (
    <g opacity={opacity} data-testid={testId}>
      <rect
        x={box.x}
        y={box.y}
        width={box.width}
        height={box.height}
        rx={box.radius}
        fill={fill}
        stroke={stroke}
        strokeWidth="1.7"
      />
      <path
        d={horizontalPath(box.x + 12, box.x + box.width - 12, dividerY)}
        fill="none"
        stroke="rgba(76, 90, 102, 0.18)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {segments.map((segment, index) => {
        const cellCenterX = cursorX + segment.width / 2;
        const cellStartX = cursorX;
        const noteLines = Array.isArray(segment.note)
          ? segment.note
          : segment.note
            ? [segment.note]
            : [];
        cursorX += segment.width;

        return (
          <g key={`${cellStartX}-${segment.width}-${index}`}>
            {index > 0 ? (
              <path
                d={verticalPath(cellStartX, box.y + 14, boxBottom(box) - 14)}
                fill="none"
                stroke="rgba(76, 90, 102, 0.16)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            ) : null}

            {segment.kind === "operator" ? (
              <text
                x={cellCenterX}
                y={boxCenterY(box) + 1}
                fill={operatorFill}
                fontSize="20"
                fontWeight="760"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {Array.isArray(segment.label) ? segment.label.join("") : segment.label}
              </text>
            ) : (
              <>
                <StackedLabel
                  x={cellCenterX}
                  y={headerY}
                  lines={Array.isArray(segment.label) ? segment.label : [segment.label]}
                  fontSize={headerFontSize}
                  fontWeight={780}
                  lineGap={headerLineGap}
                />
                {segment.note ? (
                  <>
                    {noteLines.length > 1
                      ? noteLines.slice(0, -1).map((_, rowIndex) => {
                          const startY =
                            noteY - ((noteLines.length - 1) * noteLineGap) / 2;
                          const guideY = startY + rowIndex * noteLineGap + noteLineGap / 2;

                          return (
                            <path
                              key={`note-guide-${rowIndex}`}
                              data-testid={
                                testId
                                  ? `${testId}-note-row-guide-${index}-${rowIndex}`
                                  : undefined
                              }
                              d={horizontalPath(cellStartX + 14, cellStartX + segment.width - 14, guideY)}
                              fill="none"
                              stroke="rgba(76, 90, 102, 0.12)"
                              strokeWidth="1"
                              strokeLinecap="round"
                            />
                          );
                        })
                      : null}
                    <StackedLabel
                      x={cellCenterX}
                      y={noteY}
                      lines={noteLines}
                      fontSize={noteFontSize}
                      fontWeight={690}
                      lineGap={noteLineGap}
                      fill="rgba(76, 90, 102, 0.82)"
                    />
                  </>
                ) : null}
              </>
            )}
          </g>
        );
      })}
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
  dashArray,
}: {
  d: string;
  stroke: string;
  opacity: number;
  shaftWidth?: number;
  underlayWidth?: number;
  underlayOpacity?: number;
  dashArray?: string;
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
        strokeDasharray={dashArray}
      />
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={shaftWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
        strokeDasharray={dashArray}
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
  direction: "right" | "down" | "left";
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

  if (direction === "left") {
    return (
      <>
        <path
          d={`M ${tipX + headStart} ${tipY - half} L ${tipX} ${tipY}`}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={opacity}
        />
        <path
          d={`M ${tipX + headStart} ${tipY + half} L ${tipX} ${tipY}`}
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
  testId,
  dashArray,
}: {
  d: string;
  stroke: string;
  opacity: number;
  tipX: number;
  tipY: number;
  direction: "right" | "down" | "left";
  shaftWidth?: number;
  underlayWidth?: number;
  underlayOpacity?: number;
  headSize?: number;
  testId?: string;
  dashArray?: string;
}) {
  return (
    <g data-testid={testId}>
      <ArrowPath
        d={d}
        stroke={stroke}
        opacity={opacity}
        shaftWidth={shaftWidth}
        underlayWidth={underlayWidth}
        underlayOpacity={underlayOpacity}
        dashArray={dashArray}
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
    </g>
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
  const PAGE5_SPINE_SHIFT = 100;
  const page12Progress = resolveSegmentProgress(frame, PAGE_01_FRAME, PAGE_02_FRAME);
  const page23Progress = resolveSegmentProgress(frame, PAGE_02_FRAME, PAGE_03_FRAME);
  const page34Progress = resolveSegmentProgress(frame, PAGE_03_FRAME, PAGE_04_FRAME);
  const page45Progress = resolveSegmentProgress(frame, PAGE_04_FRAME, PAGE_05_FRAME);
  const page56Progress = resolveSegmentProgress(frame, PAGE_05_FRAME, PAGE_06_FRAME);
  const page67Progress = resolveSegmentProgress(frame, PAGE_06_FRAME, PAGE_07_FRAME);
  const page78Progress = resolveSegmentProgress(frame, PAGE_07_FRAME, PAGE_08_FRAME);
  const settledPage12Progress = frame >= PAGE_02_FRAME ? 1 : page12Progress;
  const settledPage23Progress = frame <= PAGE_02_FRAME ? 0 : page23Progress;
  const settledPage34Progress = frame <= PAGE_03_FRAME ? 0 : page34Progress;
  const settledPage45Progress = frame <= PAGE_04_FRAME ? 0 : page45Progress;
  const settledPage56Progress = frame <= PAGE_05_FRAME ? 0 : frame >= PAGE_06_FRAME ? 1 : page56Progress;
  const settledPage67Progress = frame <= PAGE_06_FRAME ? 0 : frame >= PAGE_07_FRAME ? 1 : page67Progress;
  const settledPage78Progress = frame <= PAGE_07_FRAME ? 0 : frame >= PAGE_08_FRAME ? 1 : page78Progress;
  const theme = VARIANT_THEME[variantId];

  const neutralFill = "rgba(255, 251, 246, 0.98)";
  const focusFill = "rgba(248, 236, 226, 0.98)";
  const assetFill = "rgba(231, 242, 233, 0.98)";
  const assetStroke = "rgba(104, 140, 114, 0.86)";
  const nodeStroke = "rgba(34, 48, 61, 0.78)";
  const wireStroke = "rgba(76, 90, 102, 0.72)";
  const apiStroke = "#d06b44";
  const neutralFillColor = {r: 255, g: 251, b: 246, a: 0.98};
  const focusFillColor = {r: 248, g: 236, b: 226, a: 0.98};
  const assetFillColor = {r: 231, g: 242, b: 233, a: 0.98};
  const wireStrokeColor = {r: 76, g: 90, b: 102, a: 0.72};
  const apiStrokeColor = {r: 208, g: 107, b: 68, a: 1};
  const nodeStrokeColor = {r: 34, g: 48, b: 61, a: 0.78};
  const assetStrokeColor = {r: 104, g: 140, b: 114, a: 0.86};
  const accentStrokeColor = hexToRgbaColor(theme.accent, 1);

  const page34SpineShift = mix(0, 28, settledPage34Progress);
  const page45SpineShift = mix(0, PAGE5_SPINE_SHIFT, settledPage45Progress);
  const mixedLeftBox = mixBox(PAGE2_LEFT_BOX, PAGE3_LEFT_BOX, settledPage23Progress);
  const mixedCenterBox = mixBox(PAGE2_CENTER_BOX, PAGE3_CENTER_BOX, settledPage23Progress);
  const mixedRightBox = mixBox(PAGE2_RIGHT_BOX, PAGE3_RIGHT_BOX, settledPage23Progress);
  const leftBox = {
    ...mixedLeftBox,
    x: mixedLeftBox.x + page45SpineShift,
    y: mixedLeftBox.y + page34SpineShift,
  };
  const centerBox = {
    ...mixedCenterBox,
    x: mixedCenterBox.x + page45SpineShift,
    y: mixedCenterBox.y + page34SpineShift,
  };
  const rightBox = {
    ...mixedRightBox,
    x: mixedRightBox.x + page45SpineShift,
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
  const page3StateShiftX = 24;
  const binaryTargetX =
    centerBox.x + gpuQuarterStep - PAGE3_SHADER_BINARY_BOX.width / 2;
  const depthTargetX =
    binaryTargetX + PAGE3_SHADER_BINARY_BOX.width + upperBandGap + page3StateShiftX;
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
  const page4StateNodeOpacity = upperNodeOpacity * clamp01(1 - settledPage45Progress / 0.72);
  const page4UpperLineOpacity =
    upperLineOpacity * clamp01(1 - settledPage45Progress / 0.72);
  const page4MiddleFade = clamp01(1 - settledPage45Progress / 0.52);
  const page4DescriptionOpacity = descriptionOpacity * page4MiddleFade;
  const page4PsoOpacity = psoOpacity * page4MiddleFade;
  const page4CreateOpacity = createOpacity * page4MiddleFade;
  const page4PsoBindOpacity = psoBindOpacity * page4MiddleFade;
  const page5CookMoveProgress = easeInOutCubic(
    clamp01((settledPage45Progress - 0.12) / 0.5),
  );
  const upperBandBottomY = Math.max(
    boxBottom(shaderBinaryBox),
    boxBottom(depthBox),
    boxBottom(blendBox),
  );
  const page3ProgramOpacity =
    upperNodeOpacity * clamp01(1 - settledPage34Progress / 0.34);
  const page3ProgramLineOpacity =
    upperLineOpacity * clamp01(1 - settledPage34Progress / 0.3);
  const page3ProgramScale = mix(0.9, 1, easeInOutCubic(page3ProgramOpacity));
  const page3ProgramBox = {
    ...PAGE3_PROGRAM_BOX,
    x: shaderBinaryCenterX - PAGE3_PROGRAM_BOX.width / 2,
    y: upperBandBottomY + (gpuTopY - upperBandBottomY - PAGE3_PROGRAM_BOX.height) / 2,
  };
  const page3WorkflowFrameOpacity =
    upperNodeOpacity * clamp01(1 - settledPage34Progress / 0.28);
  const page3WorkflowFrameBox = {
    x: shaderCodeBox.x - 22,
    y: shaderCodeBox.y - 18,
    width:
      Math.max(page3ProgramBox.x + page3ProgramBox.width, shaderBinaryBox.x + shaderBinaryBox.width) -
      (shaderCodeBox.x - 22) +
      22,
    height: boxBottom(page3ProgramBox) - (shaderCodeBox.y - 18) + 18,
  };
  const page3WorkflowFrameBadgeX = page3WorkflowFrameBox.x + 18;
  const page3WorkflowFrameBadgeY =
    page3WorkflowFrameBox.y + page3WorkflowFrameBox.height - 18;
  const page3ProgramCenterX = boxCenterX(page3ProgramBox);
  const page3ProgramCenterY = boxCenterY(page3ProgramBox);
  const page3ProgramTipY = page3ProgramBox.y - 10;
  const page3UseProgramStartY = boxBottom(page3ProgramBox) + 10;
  const page3LinkStartY = boxBottom(shaderBinaryBox) + upperLineNodeGap;
  const page3LinkLeftX = shaderBinaryBox.x + shaderBinaryBox.width * 0.3;
  const page3LinkRightX = shaderBinaryBox.x + shaderBinaryBox.width * 0.7;
  const page3LinkEndY = page3ProgramTipY;
  const page34VerticalMorphProgress = easeInOutCubic(
    clamp01(settledPage34Progress / 0.34),
  );
  const layerGap =
    (gpuTopY - upperBandBottomY - PAGE4_DESCRIPTION_BOX.height - PAGE4_PSO_BOX.height) / 3;
  const descriptionBox = {
    ...PAGE4_DESCRIPTION_BOX,
    x: PAGE4_DESCRIPTION_BOX.x + page45SpineShift,
    y: upperBandBottomY + layerGap,
  };
  const descriptionCenterX = boxCenterX(descriptionBox);
  const descriptionCenterY = boxCenterY(descriptionBox);
  const descriptionTipY = descriptionBox.y - 14;
  const psoBox = {
    ...PAGE4_PSO_BOX,
    x: PAGE4_PSO_BOX.x + page45SpineShift,
    y: descriptionBox.y + descriptionBox.height + layerGap,
  };
  const psoCenterX = boxCenterX(psoBox);
  const psoCenterY = boxCenterY(psoBox);
  const psoTipY = psoBox.y - 14;
  const page4WorkflowFrameOpacity =
    Math.max(page4DescriptionOpacity, page4PsoOpacity) * clamp01(1 - settledPage45Progress / 0.4);
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
  const page5LabelMorphProgress = easeInOutCubic(
    clamp01((settledPage45Progress - 0.08) / 0.72),
  );
  const page5VertexRetainProgress = easeInOutCubic(
    clamp01(settledPage45Progress / 0.76),
  );
  const page5VertexIconOpacity = mix(newShapeOpacity, 1, page5VertexRetainProgress);
  const page5VertexIconScale = mix(newShapeScale, 1, page5VertexRetainProgress);
  const page5VertexIconY = axisY;
  const page5MeshBox = {
    ...PAGE5_MESH_BOX,
    x:
      leftBox.x -
      (centerBox.x - (leftBox.x + leftBox.width)) -
      PAGE5_MESH_BOX.width,
    y: axisY - PAGE5_MESH_BOX.height / 2,
  };
  const page5MaterialTargetBox = {
    ...PAGE5_MATERIAL_BOX,
    x: page5MeshBox.x + page5MeshBox.width / 2 - PAGE5_MATERIAL_BOX.width / 2,
    y: boxCenterY(shaderCodeBox) - PAGE5_MATERIAL_BOX.height / 2,
  };
  const page5CookedTargetBox = {
    ...PAGE5_COOKED_BOX,
    x: shaderBinaryCenterX - PAGE5_COOKED_BOX.width / 2,
    y: boxCenterY(shaderBinaryBox) - PAGE5_COOKED_BOX.height / 2,
  };
  const page5MaterialBox = mixBox(
    shaderCodeBox,
    page5MaterialTargetBox,
    page5CookMoveProgress,
  );
  const page5CookedBox = mixBox(
    shaderBinaryBox,
    page5CookedTargetBox,
    page5CookMoveProgress,
  );
  const page5BinaryGap =
    (gpuTopY - boxBottom(page5CookedBox) - PAGE5_BINARY_BOX.height) / 2;
  const page5BinaryTargetBox = {
    ...PAGE5_BINARY_BOX,
    x: boxCenterX(page5CookedBox) - PAGE5_BINARY_BOX.width / 2,
    y: boxBottom(page5CookedBox) + page5BinaryGap,
  };
  const page5MeshCenterX = boxCenterX(page5MeshBox);
  const page5MeshCenterY = boxCenterY(page5MeshBox);
  const page5MeshToVertexStartX = page5MeshBox.x + page5MeshBox.width + arrowStartGap;
  const page5MeshToVertexEndX = leftBox.x - arrowEndGap;
  const page5CookedToGpuEndY = gpuTopY - 12;
  const page5BinaryOpacity = clamp01((settledPage45Progress - 0.26) / 0.22);
  const page5BinaryScale = mix(0.9, 1, easeInOutCubic(page5BinaryOpacity));
  const sharedUpperLeftBox = mixBox(shaderCodeBox, page5MaterialTargetBox, page5CookMoveProgress);
  const sharedUpperRightBox = mixBox(
    shaderBinaryBox,
    page5CookedTargetBox,
    page5CookMoveProgress,
  );
  const page4WorkflowFrameBox = {
    x: Math.min(
      sharedUpperLeftBox.x,
      sharedUpperRightBox.x,
      depthBox.x,
      blendBox.x,
      descriptionBox.x,
      psoBox.x,
    ) - 22,
    y: Math.min(
      sharedUpperLeftBox.y,
      sharedUpperRightBox.y,
      depthBox.y,
      blendBox.y,
      descriptionBox.y,
      psoBox.y,
    ) - 18,
    width:
      Math.max(
        sharedUpperLeftBox.x + sharedUpperLeftBox.width,
        sharedUpperRightBox.x + sharedUpperRightBox.width,
        depthBox.x + depthBox.width,
        blendBox.x + blendBox.width,
        descriptionBox.x + descriptionBox.width,
        psoBox.x + psoBox.width,
      ) -
      (Math.min(
        sharedUpperLeftBox.x,
        sharedUpperRightBox.x,
        depthBox.x,
        blendBox.x,
        descriptionBox.x,
        psoBox.x,
      ) - 22) +
      22,
    height:
      Math.max(
        boxBottom(sharedUpperLeftBox),
        boxBottom(sharedUpperRightBox),
        boxBottom(depthBox),
        boxBottom(blendBox),
        boxBottom(descriptionBox),
        boxBottom(psoBox),
      ) -
      (Math.min(
        sharedUpperLeftBox.y,
        sharedUpperRightBox.y,
        depthBox.y,
        blendBox.y,
        descriptionBox.y,
        psoBox.y,
      ) - 18) +
      18,
  };
  const page4WorkflowFrameBadgeX = page4WorkflowFrameBox.x + 18;
  const page4WorkflowFrameBadgeY =
    page4WorkflowFrameBox.y + page4WorkflowFrameBox.height - 18;
  const sharedUpperLeftCenterX = boxCenterX(sharedUpperLeftBox);
  const sharedUpperLeftCenterY = boxCenterY(sharedUpperLeftBox);
  const sharedUpperRightCenterX = boxCenterX(sharedUpperRightBox);
  const sharedUpperRightCenterY = boxCenterY(sharedUpperRightBox);
  const sharedUpperNodeOpacity = upperNodeOpacity;
  const sharedUpperLeftFill = mixRgba(
    neutralFillColor,
    assetFillColor,
    page5LabelMorphProgress,
  );
  const sharedUpperLeftStroke = mixRgba(
    nodeStrokeColor,
    assetStrokeColor,
    page5LabelMorphProgress,
  );
  const sharedUpperRightFill = mixRgba(
    neutralFillColor,
    focusFillColor,
    page5LabelMorphProgress,
  );
  const sharedUpperRightStroke = mixRgba(
    nodeStrokeColor,
    accentStrokeColor,
    page5LabelMorphProgress,
  );
  const sharedUpperHorizontalOpacity = clamp01(
    Math.max(page4RelationOpacity, page5ArrowOpacity),
  );
  const sharedUpperHorizontalStroke = mixRgba(
    wireStrokeColor,
    assetStrokeColor,
    page5LabelMorphProgress,
  );
  const sharedUpperHorizontalStartX = sharedUpperLeftBox.x + sharedUpperLeftBox.width + 12;
  const sharedUpperHorizontalEndX = sharedUpperRightBox.x - 12;
  const sharedUpperHorizontalY = mix(
    shaderLineY,
    sharedUpperLeftCenterY,
    page5CookMoveProgress,
  );
  const sharedUpperVerticalOpacity = clamp01(
    Math.max(page4UpperLineOpacity, page5ArrowOpacity),
  );
  const sharedUpperVerticalStroke =
    settledPage34Progress <= 0
      ? apiStroke
      : settledPage45Progress > 0
      ? mixRgba(wireStrokeColor, assetStrokeColor, page5LabelMorphProgress)
      : verticalMorphStroke;
  const sharedUpperVerticalPage34StartY = mix(
    page3UseProgramStartY,
    binaryLineStartY,
    page34VerticalMorphProgress,
  );
  const sharedUpperVerticalStartY = mix(
    sharedUpperVerticalPage34StartY,
    boxBottom(sharedUpperRightBox) + 10,
    page5CookMoveProgress,
  );
  const sharedUpperVerticalEndY = mix(
    verticalMorphEndY,
    page5BinaryTargetBox.y - 10,
    page5CookMoveProgress,
  );
  const page5BinaryCenterX = boxCenterX(page5BinaryTargetBox);
  const page5BinaryCenterY = boxCenterY(page5BinaryTargetBox);
  const page5CookedToBinaryStartY = boxBottom(sharedUpperRightBox) + 10;
  const page5BinaryToGpuStartY = boxBottom(page5BinaryTargetBox) + 10;
  const page5QuestionBaseOpacity = clamp01((settledPage45Progress - 0.5) / 0.18);
  const page5QuestionX = mix(
    sharedUpperHorizontalStartX,
    sharedUpperHorizontalEndX,
    0.54,
  );
  const page5QuestionY = sharedUpperHorizontalY - 24;

  const cameraViewportCenterX = VIEWBOX.width / 2;
  const cameraViewportCenterY = VIEWBOX.height / 2;
  const page56QuestionMoveProgress = easeInOutQuint(clamp01(settledPage56Progress / 0.76));
  const page56QuestionFadeProgress = clamp01((settledPage56Progress - 0.8) / 0.12);
  const page5QuestionOpacity =
    page5QuestionBaseOpacity * (1 - easeInOutCubic(page56QuestionFadeProgress));
  const page56QuestionCenterX = mix(
    page5QuestionX,
    cameraViewportCenterX,
    page56QuestionMoveProgress,
  );
  const page56QuestionCenterY = mix(
    page5QuestionY,
    cameraViewportCenterY,
    page56QuestionMoveProgress,
  );
  const page56QuestionScale = mix(
    1,
    1.24,
    easeInOutCubic(page56QuestionMoveProgress),
  );
  const page56SettledScale = 1;
  const page7ReadingScale = 1.82;
  const page8ReadingScale = 1.68;
  const page56ZoomScale = page56SettledScale;
  const page67ZoomScale = mix(page56ZoomScale, page7ReadingScale, settledPage67Progress);
  const zoomScale = mix(page67ZoomScale, page8ReadingScale, settledPage78Progress);
  const page6FocusX = cameraViewportCenterX;
  const page6FocusY = cameraViewportCenterY;
  const page7FocusX = 820;
  const page7FocusY = 258;
  const page8FocusX = 760;
  const page8FocusY = 286;
  const page56FocusX = page6FocusX;
  const page56FocusY = page6FocusY;
  const page67FocusX = mix(page56FocusX, page7FocusX, settledPage67Progress);
  const page67FocusY = mix(page56FocusY, page7FocusY, settledPage67Progress);
  const zoomFocusX = mix(page67FocusX, page8FocusX, settledPage78Progress);
  const zoomFocusY = mix(page67FocusY, page8FocusY, settledPage78Progress);
  const page56BaseWorldOpacity = 1 - easeInOutCubic(clamp01(settledPage56Progress / 0.54));
  const page6StageProgress = easeInOutCubic(clamp01((settledPage56Progress - 0.78) / 0.22));
  const page6StageOpacity = page6StageProgress;
  const page6StageScale = mix(0.56, 1.06, page6StageProgress);
  const page6LowerBandBottomY = Math.max(
    boxBottom(PAGE6_RESOURCE_TABLE_BOX),
    boxBottom(PAGE6_SHADER_TABLE_BOX),
    boxBottom(PAGE6_INLINE_BOX),
  );
  const page6VisibleLeftX = Math.min(PAGE6_MATERIAL_BOX.x, PAGE6_UASSET_FRAME.x);
  const page6VisibleRightX = Math.max(boxRight(PAGE6_UASSET_FRAME), boxRight(PAGE6_INLINE_BOX));
  const page6VisibleBottomY = Math.max(boxBottom(PAGE6_UASSET_FRAME), page6LowerBandBottomY);
  const page6StageCenterX = mix(
    (page6VisibleLeftX + page6VisibleRightX) / 2,
    cameraViewportCenterX,
    settledPage67Progress,
  );
  const page6StageCenterY = mix(
    (PAGE6_UASSET_FRAME.y + page6VisibleBottomY) / 2,
    cameraViewportCenterY,
    settledPage67Progress,
  );
  const page6ChainOpacity = 1 - clamp01((settledPage78Progress - 0.08) / 0.44);
  const page6FrameOpacity = page6ChainOpacity;
  const page6NodeOpacity = page6ChainOpacity;
  const page6NodeScale = 1;
  const page6MetaOpacity = page6ChainOpacity;
  const page6MaterialCenterX = boxCenterX(PAGE6_MATERIAL_BOX);
  const page6MaterialCenterY = boxCenterY(PAGE6_MATERIAL_BOX);
  const page6ResourceCenterY = boxCenterY(PAGE6_RESOURCE_BOX);
  const page6ShaderMapCenterX = boxCenterX(PAGE6_SHADERMAP_BOX);
  const page6ShaderMapCenterY = boxCenterY(PAGE6_SHADERMAP_BOX);
  const page6MaterialArrowStartX = boxRight(PAGE6_MATERIAL_BOX) + 14;
  const page6MaterialArrowEndX = PAGE6_RESOURCE_BOX.x - 18;
  const page6ResourceArrowStartX = boxRight(PAGE6_RESOURCE_BOX) + 18;
  const page6ResourceArrowEndX = PAGE6_SHADERMAP_BOX.x - 18;
  const page6ShaderArrowStartX = boxRight(PAGE6_SHADERMAP_BOX) + 6;
  const page6ShaderArrowEndX = PAGE6_FSHADER_BOX.x - 6;
  const page6FShaderCenterX = boxCenterX(PAGE6_FSHADER_BOX);
  const page6FShaderCenterY = boxCenterY(PAGE6_FSHADER_BOX);
  const page6FShaderToInlineStartX = boxRight(PAGE6_FSHADER_BOX) + 6;
  const page6FShaderToInlineEndX = PAGE6_INLINE_BOX.x - 6;
  const page6MaterialArrowY = boxCenterY(PAGE6_MATERIAL_BOX);
  const page6PlatformLinkX = page6MaterialCenterX;
  const page6PlatformLinkTopY = boxBottom(PAGE6_MATERIAL_BOX) + 12;
  const page6PlatformLinkBottomY = PAGE6_PLATFORM_TABLE_BOX.y - 12;
  const page6InlineBaseBox = mixBox(PAGE6_INLINE_BOX, PAGE8_LIBRARY_BOX, settledPage78Progress);
  const page6InlineCenterX = boxCenterX(page6InlineBaseBox);
  const page6InlineCenterY = boxCenterY(page6InlineBaseBox);
  const page6InlineStroke = mixRgba(
    accentStrokeColor,
    accentStrokeColor,
    settledPage78Progress,
  );
  const page7CacheOpacity = clamp01((settledPage67Progress - 0.12) / 0.22);
  const page7CacheScale = mix(0.9, 1, easeInOutCubic(page7CacheOpacity));
  const page7CacheCenterX = boxCenterX(PAGE7_CACHE_BOX);
  const page7CacheCenterY = boxCenterY(PAGE7_CACHE_BOX);
  const page7HashArrowOpacity = clamp01((settledPage67Progress - 0.24) / 0.22);
  const page7HashArrowY = boxCenterY(PAGE6_INLINE_BOX);
  const page8SourceOpacity = clamp01((settledPage78Progress - 0.18) / 0.24);
  const page8SourceScale = mix(0.92, 1, easeInOutCubic(page8SourceOpacity));
  const page8MaterialBusX = 474;
  const page8MaterialBusTopY = boxCenterY(PAGE8_MATERIAL_A_BOX);
  const page8MaterialBusBottomY = boxCenterY(PAGE8_MATERIAL_C_BOX);
  const page8MaterialBusMidY = boxCenterY(PAGE8_MATERIAL_B_BOX);
  const page8LibraryCenterX = boxCenterX(PAGE8_LIBRARY_BOX);
  const page8LibraryCenterY = boxCenterY(PAGE8_LIBRARY_BOX);
  const page8LookupArrowOpacity = clamp01((settledPage78Progress - 0.28) / 0.24);

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
            cy={page5VertexIconY}
            opacity={page5VertexIconOpacity}
            scale={page5VertexIconScale}
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
                opacity={sharedUpperNodeOpacity}
                transform={`translate(${sharedUpperLeftCenterX} ${sharedUpperLeftCenterY}) scale(${upperNodeScale}) translate(${-sharedUpperLeftCenterX} ${-sharedUpperLeftCenterY})`}
              >
                <StageBox
                  box={sharedUpperLeftBox}
                  fill={sharedUpperLeftFill}
                  stroke={sharedUpperLeftStroke}
                />
                {page5LabelMorphProgress < 0.999 ? (
                  <StackedLabel
                    x={sharedUpperLeftCenterX}
                    y={sharedUpperLeftCenterY + 2}
                    lines={["Raw", "ShaderCode"]}
                    opacity={1 - page5LabelMorphProgress}
                    fontSize={22}
                    fontWeight={680}
                    lineGap={23}
                  />
                ) : null}
                {page5LabelMorphProgress > 0.001 ? (
                  <text
                    x={sharedUpperLeftCenterX}
                    y={sharedUpperLeftCenterY + 3}
                    fill="#22303d"
                    fontSize="24"
                    fontWeight="720"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    opacity={page5LabelMorphProgress}
                  >
                    Material
                  </text>
                ) : null}
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
                opacity={sharedUpperNodeOpacity}
                transform={`translate(${sharedUpperRightCenterX} ${sharedUpperRightCenterY}) scale(${upperNodeScale}) translate(${-sharedUpperRightCenterX} ${-sharedUpperRightCenterY})`}
              >
                <StageBox
                  box={sharedUpperRightBox}
                  fill={sharedUpperRightFill}
                  stroke={sharedUpperRightStroke}
                />
                {shaderArtifactLabelProgress < 0.999 ? (
                  <StackedLabel
                    x={sharedUpperRightCenterX}
                    y={sharedUpperRightCenterY + 2}
                    lines={["Binary", "ShaderCode"]}
                    opacity={1 - shaderArtifactLabelProgress}
                    fontSize={21}
                    fontWeight={700}
                    lineGap={22}
                  />
                ) : null}
                {shaderArtifactLabelProgress > 0.001 && page5LabelMorphProgress < 0.999 ? (
                  <StackedLabel
                    x={sharedUpperRightCenterX}
                    y={sharedUpperRightCenterY + 2}
                    lines={["SPIR-V", "ShaderCode"]}
                    opacity={shaderArtifactLabelProgress * (1 - page5LabelMorphProgress)}
                    fontSize={21}
                    fontWeight={760}
                    lineGap={22}
                  />
                ) : null}
                {page5LabelMorphProgress > 0.001 ? (
                  <StackedLabel
                    x={sharedUpperRightCenterX}
                    y={sharedUpperRightCenterY + 2}
                    lines={["Cooked", "ShaderCode"]}
                    opacity={page5LabelMorphProgress}
                    fontSize={22}
                    fontWeight={760}
                    lineGap={23}
                  />
                ) : null}
              </g>

              {settledPage34Progress > 0 && sharedUpperHorizontalOpacity > 0 ? (
                <>
                  <StrokeArrow
                    testId="shared-upper-horizontal-arrow"
                    d={horizontalPath(
                      sharedUpperHorizontalStartX,
                      sharedUpperHorizontalEndX,
                      sharedUpperHorizontalY,
                    )}
                    stroke={sharedUpperHorizontalStroke}
                    opacity={sharedUpperHorizontalOpacity}
                    tipX={sharedUpperHorizontalEndX}
                    tipY={sharedUpperHorizontalY}
                    direction="right"
                    shaftWidth={3}
                    underlayWidth={5.6}
                    underlayOpacity={0.12}
                    headSize={9}
                  />
                </>
              ) : null}

              {page3ProgramOpacity > 0.001 ? (
                <g
                  opacity={page3ProgramOpacity}
                  transform={`translate(${page3ProgramCenterX} ${page3ProgramCenterY}) scale(${page3ProgramScale}) translate(${-page3ProgramCenterX} ${-page3ProgramCenterY})`}
                >
                  <StageBox
                    box={page3ProgramBox}
                    fill={focusFill}
                    stroke={theme.accent}
                    strokeWidth={2.8}
                    label="Program"
                    labelSize={24}
                    labelWeight={720}
                  />
                </g>
              ) : null}

              {page3WorkflowFrameOpacity > 0.001 ? (
                <g
                  data-testid="page3-program-workflow-frame"
                  opacity={page3WorkflowFrameOpacity}
                >
                  <rect
                    x={page3WorkflowFrameBox.x}
                    y={page3WorkflowFrameBox.y}
                    width={page3WorkflowFrameBox.width}
                    height={page3WorkflowFrameBox.height}
                    rx="24"
                    fill="rgba(255, 251, 246, 0.04)"
                    stroke={apiStroke}
                    strokeWidth="2.4"
                    strokeDasharray="10 8"
                  />
                </g>
              ) : null}

              {page3ProgramLineOpacity > 0.001 ? (
                <>
                  <StrokeArrow
                    testId="page3-linkprogram-input-left"
                    d={verticalPath(page3LinkLeftX, page3LinkStartY, page3LinkEndY)}
                    stroke={apiStroke}
                    opacity={page3ProgramLineOpacity}
                    tipX={page3LinkLeftX}
                    tipY={page3LinkEndY}
                    direction="down"
                    shaftWidth={3}
                    underlayWidth={5.6}
                    underlayOpacity={0.12}
                    headSize={9}
                    dashArray="7 7"
                  />
                  <StrokeArrow
                    testId="page3-linkprogram-input-right"
                    d={verticalPath(page3LinkRightX, page3LinkStartY, page3LinkEndY)}
                    stroke={apiStroke}
                    opacity={page3ProgramLineOpacity}
                    tipX={page3LinkRightX}
                    tipY={page3LinkEndY}
                    direction="down"
                    shaftWidth={3}
                    underlayWidth={5.6}
                    underlayOpacity={0.12}
                    headSize={9}
                    dashArray="7 7"
                  />
                  <ApiBadge
                    testId="page3-linkprogram-badge"
                    x={(page3LinkLeftX + page3LinkRightX) / 2}
                    y={mix(page3LinkStartY, page3LinkEndY, 0.5)}
                    id={5}
                    stroke={apiStroke}
                    opacity={page3ProgramLineOpacity}
                  />
                  <ApiBadge
                    testId="page3-getprogrambinary-badge"
                    x={page3WorkflowFrameBadgeX}
                    y={page3WorkflowFrameBadgeY}
                    id={6}
                    stroke={apiStroke}
                    opacity={page3WorkflowFrameOpacity}
                  />
                </>
              ) : null}

              <g
                opacity={page4StateNodeOpacity}
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
                opacity={page4StateNodeOpacity}
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

              {settledPage23Progress > 0 && sharedUpperVerticalOpacity > 0 ? (
                <g
                  data-testid={settledPage45Progress > 0 ? "page5-cooked-to-binary-arrow" : undefined}
                >
                  <StrokeArrow
                    testId="shared-upper-vertical-arrow"
                    d={verticalPath(
                      sharedUpperRightCenterX,
                      sharedUpperVerticalStartY,
                      sharedUpperVerticalEndY,
                    )}
                    stroke={sharedUpperVerticalStroke}
                  opacity={sharedUpperVerticalOpacity}
                  tipX={sharedUpperRightCenterX}
                  tipY={sharedUpperVerticalEndY}
                  direction="down"
                  shaftWidth={3}
                  underlayWidth={5.6}
                  underlayOpacity={0.12}
                  headSize={9}
                />
                  <ApiBadge
                    testId={
                      settledPage34Progress <= 0.001
                        ? "page3-useprogram-badge"
                        : "shared-upper-vertical-badge"
                    }
                    x={sharedUpperRightCenterX - 18}
                    y={mix(sharedUpperVerticalStartY, sharedUpperVerticalEndY, 0.44)}
                    id={2}
                    stroke={apiStroke}
                    opacity={verticalBadgeOpacity}
                  />
                </g>
              ) : null}

              {settledPage34Progress > 0 && page4MiddleFade > 0 ? (
                <>
                  {page4WorkflowFrameOpacity > 0.001 ? (
                    <g
                      data-testid="page4-pso-workflow-frame"
                      opacity={page4WorkflowFrameOpacity}
                    >
                      <rect
                        x={page4WorkflowFrameBox.x}
                        y={page4WorkflowFrameBox.y}
                        width={page4WorkflowFrameBox.width}
                        height={page4WorkflowFrameBox.height}
                        rx="24"
                        fill="rgba(255, 251, 246, 0.04)"
                        stroke={apiStroke}
                        strokeWidth="2.4"
                        strokeDasharray="10 8"
                      />
                      <ApiBadge
                        testId="page4-getpipelinecachedata-badge"
                        x={page4WorkflowFrameBadgeX}
                        y={page4WorkflowFrameBadgeY}
                        id={3}
                        stroke={apiStroke}
                        opacity={page4WorkflowFrameOpacity}
                      />
                    </g>
                  ) : null}

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
                  <g
                    opacity={page5BinaryOpacity}
                    transform={`translate(${page5BinaryCenterX} ${page5BinaryCenterY}) scale(${page5BinaryScale}) translate(${-page5BinaryCenterX} ${-page5BinaryCenterY})`}
                  >
                    <StageBox
                      box={page5BinaryTargetBox}
                      fill={focusFill}
                      stroke={theme.accent}
                      strokeWidth={2.8}
                    />
                    <StackedLabel
                      x={page5BinaryCenterX}
                      y={page5BinaryCenterY + 2}
                      lines={["Binary", "ShaderCode"]}
                      fontSize={22}
                      fontWeight={760}
                      lineGap={23}
                    />
                  </g>

                  <StrokeArrow
                    testId="page5-binary-to-gpu-arrow"
                    d={verticalPath(page5BinaryCenterX, page5BinaryToGpuStartY, page5CookedToGpuEndY)}
                    stroke={apiStroke}
                    opacity={page5ArrowOpacity}
                    tipX={page5BinaryCenterX}
                    tipY={page5CookedToGpuEndY}
                    direction="down"
                    shaftWidth={3}
                    underlayWidth={5.6}
                    underlayOpacity={0.12}
                    headSize={9}
                  />

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

                  <StrokeArrow
                    testId="page5-mesh-arrow"
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
                </>
              ) : null}
            </>
          ) : null}
          </g>

              {page5QuestionOpacity > 0.001 ? (
                <g
                  opacity={page5QuestionOpacity}
                  transform={`translate(${page56QuestionCenterX} ${page56QuestionCenterY}) scale(${page56QuestionScale}) translate(${-page56QuestionCenterX} ${-page56QuestionCenterY})`}
                >
                  <CalloutBadge
                    testId="page5-question-badge"
                    x={page56QuestionCenterX}
                    y={page56QuestionCenterY}
                    label="?"
                    stroke={apiStroke}
                    fill="rgba(255, 248, 242, 0.98)"
                    opacity={1}
                  />
                </g>
              ) : null}

              {page6StageOpacity > 0.001 ? (
                <g
                  data-testid="page6-stage-group"
                  opacity={page6StageOpacity}
                  transform={`translate(${cameraViewportCenterX} ${cameraViewportCenterY}) scale(${page6StageScale}) translate(${-page6StageCenterX} ${-page6StageCenterY})`}
                >
              {page6NodeOpacity > 0.001 ? (
                <g
                  opacity={page6NodeOpacity}
                  transform={`translate(${page6MaterialCenterX} ${page6MaterialCenterY}) scale(${page6NodeScale}) translate(${-page6MaterialCenterX} ${-page6MaterialCenterY})`}
                >
                  <StageBox
                    box={PAGE6_MATERIAL_BOX}
                    fill={assetFill}
                    stroke={assetStroke}
                    strokeWidth={2.8}
                    tone="asset"
                    label="Material"
                    labelSize={24}
                    labelWeight={720}
                  />
                </g>
              ) : null}

              {page6FrameOpacity > 0.001 ? (
                <g opacity={page6FrameOpacity}>
                  <rect
                    data-testid="page6-uasset-frame"
                    x={PAGE6_UASSET_FRAME.x}
                    y={PAGE6_UASSET_FRAME.y}
                    width={PAGE6_UASSET_FRAME.width}
                    height={PAGE6_UASSET_FRAME.height}
                    rx={PAGE6_UASSET_FRAME.radius}
                    fill="none"
                    stroke="rgba(76, 90, 102, 0.14)"
                    strokeWidth="2"
                  />
                  <text
                    x={PAGE6_UASSET_FRAME.x + 22}
                    y={PAGE6_UASSET_FRAME.y + 26}
                    fill="rgba(76, 90, 102, 0.68)"
                    fontSize="17"
                    fontWeight="680"
                  >
                    uasset
                  </text>
                </g>
              ) : null}

              {page6NodeOpacity > 0.001 ? (
                <g opacity={page6NodeOpacity}>
                  <path
                    data-testid="page6-material-platform-link"
                    d={verticalPath(
                      page6PlatformLinkX,
                      page6PlatformLinkTopY,
                      page6PlatformLinkBottomY,
                    )}
                    fill="none"
                    stroke={assetStroke}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    opacity={page6MetaOpacity * 0.9}
                  />
                  <StrokeArrow
                    testId="page6-material-to-resource-arrow"
                    d={horizontalPath(
                      page6MaterialArrowStartX,
                      page6MaterialArrowEndX,
                      page6MaterialArrowY,
                    )}
                    stroke={assetStroke}
                    opacity={page6NodeOpacity}
                    tipX={page6MaterialArrowEndX}
                    tipY={page6MaterialArrowY}
                    direction="right"
                    shaftWidth={3}
                    underlayWidth={5.8}
                    underlayOpacity={0.1}
                    headSize={9}
                  />
                </g>
              ) : null}

              {page6MetaOpacity > 0.001 ? (
                <DiagramInfoTable
                  testId="page6-platform-table"
                  box={PAGE6_PLATFORM_TABLE_BOX}
                  stroke="rgba(104, 140, 114, 0.28)"
                  operatorFill="rgba(104, 140, 114, 0.6)"
                  fill="rgba(255, 255, 255, 0.94)"
                  opacity={page6MetaOpacity}
                  headerFontSize={13.4}
                  noteFontSize={12.8}
                  noteLineGap={12}
                  segments={[
                    {
                      width: PAGE6_PLATFORM_TABLE_BOX.width,
                      label: "ShaderPlatform",
                      note: ["OpenGL ES", "Vulkan", "Metal"],
                    },
                  ]}
                />
              ) : null}

              {[
                {box: PAGE6_RESOURCE_TOP_BOX, opacity: page6NodeOpacity * 0.16, strokeWidth: 2},
                {box: PAGE6_RESOURCE_BOTTOM_BOX, opacity: page6NodeOpacity * 0.2, strokeWidth: 2},
                {box: PAGE6_RESOURCE_BOX, opacity: page6NodeOpacity, strokeWidth: 2.8},
              ].map(({box, opacity, strokeWidth}, index) => {
                const centerX = boxCenterX(box);
                const centerY = boxCenterY(box);
                const isPrimary = box === PAGE6_RESOURCE_BOX;

                return (
                  <g
                    key={`page6-resource-${index}`}
                    data-testid="page6-resource-card"
                    opacity={opacity}
                    transform={`translate(${centerX} ${centerY}) scale(${page6NodeScale}) translate(${-centerX} ${-centerY})`}
                  >
                    <StageBox
                      box={box}
                      fill={neutralFill}
                      stroke={nodeStroke}
                      strokeWidth={strokeWidth}
                    />
                    {isPrimary ? (
                      <text
                        x={centerX}
                        y={centerY + 3}
                        fill="#22303d"
                        fontSize="18"
                        fontWeight="720"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        FMaterialResource
                      </text>
                    ) : null}
                  </g>
                );
              })}

              {page6MetaOpacity > 0.001 ? (
                <DiagramInfoTable
                  testId="page6-resource-selector-table"
                  box={PAGE6_RESOURCE_TABLE_BOX}
                  stroke="rgba(104, 140, 114, 0.28)"
                  operatorFill="rgba(104, 140, 114, 0.6)"
                  fill="rgba(255, 255, 255, 0.92)"
                  opacity={page6MetaOpacity}
                  segments={[
                    {
                      width: 108,
                      label: "FeatureLevel",
                      note: ["ES3_1", "SM5"],
                    },
                    {
                      width: 40,
                      label: "×",
                      kind: "operator",
                    },
                    {
                      width: 108,
                      label: "QualityLevel",
                      note: ["Low", "High"],
                    },
                  ]}
                />
              ) : null}

              {page6NodeOpacity > 0.001 ? (
                <StrokeArrow
                  testId="page6-resource-to-shadermap-arrow"
                  d={horizontalPath(
                    page6ResourceArrowStartX,
                    page6ResourceArrowEndX,
                    page6ResourceCenterY,
                  )}
                  stroke={wireStroke}
                  opacity={page6NodeOpacity}
                  tipX={page6ResourceArrowEndX}
                  tipY={page6ResourceCenterY}
                  direction="right"
                  shaftWidth={3}
                  underlayWidth={5.6}
                  underlayOpacity={0.1}
                  headSize={9}
                />
              ) : null}

              <g
                opacity={page6NodeOpacity}
                transform={`translate(${page6ShaderMapCenterX} ${page6ShaderMapCenterY}) scale(${page6NodeScale}) translate(${-page6ShaderMapCenterX} ${-page6ShaderMapCenterY})`}
              >
                {[
                  {box: PAGE6_SHADER_TOP_BOX, opacity: page6NodeOpacity * 0.16, strokeWidth: 2},
                  {box: PAGE6_SHADER_BOTTOM_BOX, opacity: page6NodeOpacity * 0.2, strokeWidth: 2},
                  {box: PAGE6_SHADERMAP_BOX, opacity: page6NodeOpacity, strokeWidth: 2.8},
                ].map(({box, opacity, strokeWidth}, index) => {
                  const centerX = boxCenterX(box);
                  const centerY = boxCenterY(box);
                  const isPrimary = box === PAGE6_SHADERMAP_BOX;

                  return (
                    <g
                      key={`page6-shadermap-${index}`}
                      data-testid="page6-shadermap-card"
                      opacity={opacity}
                      transform={`translate(${centerX} ${centerY}) scale(${page6NodeScale}) translate(${-centerX} ${-centerY})`}
                    >
                      <StageBox
                        box={box}
                        fill={neutralFill}
                        stroke={nodeStroke}
                        strokeWidth={strokeWidth}
                      />
                      {isPrimary ? (
                        <text
                          x={centerX}
                          y={centerY + 2}
                          fill="#22303d"
                          fontSize="19.5"
                          fontWeight="720"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          FShaderMap
                        </text>
                      ) : null}
                    </g>
                  );
                })}
              </g>

              {page6MetaOpacity > 0.001 ? (
                <DiagramInfoTable
                  testId="page6-shadermap-selector-table"
                  box={PAGE6_SHADER_TABLE_BOX}
                  stroke="rgba(76, 90, 102, 0.22)"
                  operatorFill="rgba(76, 90, 102, 0.5)"
                  fill="rgba(255, 255, 255, 0.92)"
                  opacity={page6MetaOpacity}
                  segments={[
                    {
                      width: 88,
                      label: "ShaderType",
                      note: ["BasePassPS", "DepthVS"],
                    },
                    {
                      width: 88,
                      label: "VertexFactory",
                      note: ["LocalVF", "SkinVF"],
                    },
                    {
                      width: 88,
                      label: "Permutation",
                      note: ["Sky=1", "VT=0"],
                    },
                  ]}
                />
              ) : null}

              {page6NodeOpacity > 0.001 ? (
                <StrokeArrow
                  testId="page6-shadermap-to-inline-arrow"
                  d={horizontalPath(
                    page6ShaderArrowStartX,
                    page6ShaderArrowEndX,
                    page6ShaderMapCenterY,
                  )}
                  stroke={wireStroke}
                  opacity={page6NodeOpacity}
                  tipX={page6ShaderArrowEndX}
                  tipY={page6ShaderMapCenterY}
                  direction="right"
                  shaftWidth={3}
                  underlayWidth={5.6}
                  underlayOpacity={0.1}
                  headSize={9}
                />
              ) : null}

              <g
                opacity={page6NodeOpacity}
                transform={`translate(${page6FShaderCenterX} ${page6FShaderCenterY}) scale(${page6NodeScale}) translate(${-page6FShaderCenterX} ${-page6FShaderCenterY})`}
              >
                {[
                  {box: PAGE6_FSHADER_TOP_BOX, opacity: page6NodeOpacity * 0.16, strokeWidth: 2},
                  {box: PAGE6_FSHADER_BOTTOM_BOX, opacity: page6NodeOpacity * 0.2, strokeWidth: 2},
                  {box: PAGE6_FSHADER_BOX, opacity: page6NodeOpacity, strokeWidth: 2.8},
                ].map(({box, opacity, strokeWidth}, index) => {
                  const centerX = boxCenterX(box);
                  const centerY = boxCenterY(box);
                  const isPrimary = box === PAGE6_FSHADER_BOX;

                  return (
                    <g
                      key={`page6-fshader-${index}`}
                      data-testid="page6-fshader-card"
                      opacity={opacity}
                      transform={`translate(${centerX} ${centerY}) scale(${page6NodeScale}) translate(${-centerX} ${-centerY})`}
                    >
                      <StageBox
                        box={box}
                        fill={neutralFill}
                        stroke={nodeStroke}
                        strokeWidth={strokeWidth}
                      />
                      {isPrimary ? (
                        <text
                          x={centerX}
                          y={centerY + 2}
                          fill="#22303d"
                          fontSize="17"
                          fontWeight="720"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          FShader
                        </text>
                      ) : null}
                    </g>
                  );
                })}
              </g>

              {page6NodeOpacity > 0.001 ? (
                <StrokeArrow
                  testId="page6-fshader-to-inline-arrow"
                  d={horizontalPath(
                    page6FShaderToInlineStartX,
                    page6FShaderToInlineEndX,
                    page6FShaderCenterY,
                  )}
                  stroke={wireStroke}
                  opacity={page6NodeOpacity}
                  tipX={page6FShaderToInlineEndX}
                  tipY={page6FShaderCenterY}
                  direction="right"
                  shaftWidth={3}
                  underlayWidth={5.6}
                  underlayOpacity={0.1}
                  headSize={9}
                />
              ) : null}

              <g
                data-testid={page8SourceOpacity > 0.001 ? "page8-shared-library-box" : undefined}
                opacity={Math.max(page6NodeOpacity, page8SourceOpacity)}
                transform={`translate(${page6InlineCenterX} ${page6InlineCenterY}) scale(${mix(page6NodeScale, 1, settledPage78Progress)}) translate(${-page6InlineCenterX} ${-page6InlineCenterY})`}
              >
                <StageBox
                  box={page6InlineBaseBox}
                  fill={focusFill}
                  stroke={page6InlineStroke}
                  strokeWidth={3}
                />
                {page6ChainOpacity > 0.001 ? (
                  <StackedLabel
                    x={page6InlineCenterX}
                    y={page6InlineCenterY + 2}
                    lines={["ShaderCode"]}
                    opacity={page6ChainOpacity}
                    fontSize={18.5}
                    fontWeight={760}
                    lineGap={22}
                  />
                ) : null}
                {page8SourceOpacity > 0.001 ? (
                  <>
                    <StackedLabel
                      x={page6InlineCenterX}
                      y={page6InlineCenterY - 8}
                      lines={["SharedCode", "Library"]}
                      opacity={page8SourceOpacity}
                      fontSize={24}
                      fontWeight={780}
                      lineGap={24}
                    />
                    <text
                      x={page6InlineCenterX}
                      y={page6InlineCenterY + 34}
                      fill="rgba(34, 48, 61, 0.72)"
                      fontSize="18"
                      fontWeight="680"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      opacity={page8SourceOpacity}
                    >
                      ShaderArchive
                    </text>
                  </>
                ) : null}
              </g>
              </g>
              ) : null}

              {page7CacheOpacity > 0.001 ? (
                <g
                  data-testid="page7-cache-box"
                  opacity={page7CacheOpacity}
                  transform={`translate(${page7CacheCenterX} ${page7CacheCenterY}) scale(${page7CacheScale}) translate(${-page7CacheCenterX} ${-page7CacheCenterY})`}
                >
                  <StageBox
                    box={PAGE7_CACHE_BOX}
                    fill={neutralFill}
                    stroke={nodeStroke}
                    strokeWidth={2.8}
                  />
                  <text
                    x={page7CacheCenterX}
                    y={PAGE7_CACHE_BOX.y + 34}
                    fill="#22303d"
                    fontSize="22"
                    fontWeight="760"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    PSO Cache
                  </text>
                  <text
                    x={page7CacheCenterX}
                    y={PAGE7_CACHE_BOX.y + 76}
                    fill={apiStroke}
                    fontSize="18"
                    fontWeight="760"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    Hash
                  </text>
                  <text
                    x={page7CacheCenterX}
                    y={PAGE7_CACHE_BOX.y + 104}
                    fill="rgba(34, 48, 61, 0.76)"
                    fontSize="17"
                    fontWeight="680"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    key
                  </text>
                  <text
                    x={page7CacheCenterX}
                    y={PAGE7_CACHE_BOX.y + 132}
                    fill="rgba(34, 48, 61, 0.76)"
                    fontSize="17"
                    fontWeight="680"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    metadata
                  </text>
                </g>
              ) : null}

              {page7HashArrowOpacity > 0.001 && page8LookupArrowOpacity < 0.999 ? (
                <StrokeArrow
                  testId="page7-hash-link-arrow"
                  d={horizontalPath(
                    boxRight(page6InlineBaseBox),
                    PAGE7_CACHE_BOX.x,
                    page7HashArrowY,
                  )}
                  stroke={apiStroke}
                  opacity={page7HashArrowOpacity * (1 - page8LookupArrowOpacity)}
                  tipX={PAGE7_CACHE_BOX.x}
                  tipY={page7HashArrowY}
                  direction="right"
                  shaftWidth={3.1}
                  underlayWidth={5.8}
                  underlayOpacity={0.12}
                  headSize={9}
                />
              ) : null}

              {page8SourceOpacity > 0.001 ? (
                <>
                  {[
                    {box: PAGE8_MATERIAL_A_BOX, label: "Material A"},
                    {box: PAGE8_MATERIAL_B_BOX, label: "Material B"},
                    {box: PAGE8_MATERIAL_C_BOX, label: "Material C"},
                  ].map(({box, label}) => {
                    const centerX = boxCenterX(box);
                    const centerY = boxCenterY(box);

                    return (
                      <g
                        key={label}
                        opacity={page8SourceOpacity}
                        transform={`translate(${centerX} ${centerY}) scale(${page8SourceScale}) translate(${-centerX} ${-centerY})`}
                      >
                        <StageBox
                          box={box}
                          fill={assetFill}
                          stroke={assetStroke}
                          strokeWidth={2.6}
                          tone="asset"
                          label={label}
                          labelSize={20}
                          labelWeight={720}
                        />
                      </g>
                    );
                  })}

                  <g opacity={page8SourceOpacity}>
                    <ArrowPath
                      d={verticalPath(page8MaterialBusX, page8MaterialBusTopY, page8MaterialBusBottomY)}
                      stroke={assetStroke}
                      opacity={page8SourceOpacity}
                      shaftWidth={3}
                      underlayWidth={5.6}
                      underlayOpacity={0.08}
                    />
                    {[PAGE8_MATERIAL_A_BOX, PAGE8_MATERIAL_B_BOX, PAGE8_MATERIAL_C_BOX].map(
                      (box, index) => (
                        <ArrowPath
                          key={`${box.x}-${box.y}-${index}`}
                          d={horizontalPath(
                            boxRight(box) + 12,
                            page8MaterialBusX,
                            boxCenterY(box),
                          )}
                          stroke={assetStroke}
                          opacity={page8SourceOpacity}
                          shaftWidth={3}
                          underlayWidth={5.6}
                          underlayOpacity={0.08}
                        />
                      ),
                    )}
                  </g>

                  <StrokeArrow
                    testId="page8-material-bus-arrow"
                    d={horizontalPath(
                      page8MaterialBusX,
                      PAGE8_LIBRARY_BOX.x - 14,
                      page8MaterialBusMidY,
                    )}
                    stroke={assetStroke}
                    opacity={page8SourceOpacity}
                    tipX={PAGE8_LIBRARY_BOX.x - 14}
                    tipY={page8MaterialBusMidY}
                    direction="right"
                    shaftWidth={3}
                    underlayWidth={5.8}
                    underlayOpacity={0.1}
                    headSize={9}
                  />
                </>
              ) : null}

              {page8LookupArrowOpacity > 0.001 ? (
                <StrokeArrow
                  testId="page8-cache-lookup-arrow"
                  d={horizontalPath(
                    PAGE7_CACHE_BOX.x,
                    boxRight(PAGE8_LIBRARY_BOX),
                    page8MaterialBusMidY,
                  )}
                  stroke={apiStroke}
                  opacity={page8LookupArrowOpacity}
                  tipX={boxRight(PAGE8_LIBRARY_BOX)}
                  tipY={page8MaterialBusMidY}
                  direction="left"
                  shaftWidth={3.2}
                  underlayWidth={6}
                  underlayOpacity={0.12}
                  headSize={10}
                />
              ) : null}
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
