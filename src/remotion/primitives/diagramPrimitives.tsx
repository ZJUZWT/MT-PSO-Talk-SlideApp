import type {Box} from "./diagramTypes";
import {
  bandBoundaries,
  bandCenters,
  boxBottom,
  boxCenterX,
  boxCenterY,
  boxRight,
  clamp01,
  easeInOutCubic,
  horizontalPath,
} from "../geometry/geometry";

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

export function VertexTriangles({
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

export function PixelGrid({
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
            transform={`translate(${cellCenterX} ${cellCenterY}) scale(${(0.38 + (1 - 0.38) * easedLocalProgress).toFixed(6)}) translate(${-cellCenterX} ${-cellCenterY})`}
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

export function StageBox({
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

export function StackedLabel({
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

export function TspanStackedLabel({
  x,
  y,
  lines,
  opacity = 1,
  fontSize = 22,
  fontWeight = 700,
  lineGap = 23,
  fill = "#22303d",
}: {
  x: number;
  y: number;
  lines: string[];
  opacity?: number;
  fontSize?: number;
  fontWeight?: number;
  lineGap?: number;
  fill?: string;
}) {
  const startY = y - ((lines.length - 1) * lineGap) / 2;

  return (
    <text
      x={x}
      y={startY}
      fill={fill}
      fontSize={fontSize}
      fontWeight={fontWeight}
      textAnchor="middle"
      dominantBaseline="middle"
      opacity={opacity}
    >
      {lines.map((line, index) => (
        <tspan key={`${line}-${index}`} x={x} dy={index === 0 ? 0 : lineGap}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

export function ApiBadge({
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

export function CalloutBadge({
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

export function ArrowLabelPill({
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

export function DiagramInfoTable({
  box,
  segments,
  stroke,
  operatorFill = stroke,
  fill = "rgba(255, 255, 255, 0.9)",
  opacity = 1,
  testId,
  headerFontSize = 14.2,
  noteFontSize = 12.8,
  headerInsetTop = 0,
  noteInsetBottom = 0,
  dividerOffsetY = 0,
  contentAlign = "start",
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
  dividerOffsetY?: number;
  headerInsetTop?: number;
  noteInsetBottom?: number;
  contentAlign?: "start" | "center";
}) {
  const dividerY = Math.round(boxCenterY(box) + dividerOffsetY);
  const segmentsWidth = segments.reduce((sum, segment) => sum + segment.width, 0);
  const contentOffsetX =
    contentAlign === "center" ? Math.max(0, (box.width - segmentsWidth) / 2) : 0;
  let cursorX = box.x + contentOffsetX;

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
        data-role="table-divider"
        d={horizontalPath(box.x + 6, box.x + box.width - 6, dividerY)}
        fill="none"
        stroke="rgba(76, 90, 102, 0.18)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {segments.map((segment, index) => {
        const cellCenterX = cursorX + segment.width / 2;
        const cellStartX = cursorX;
        const cellEndX = cellStartX + segment.width;
        const headerLines = Array.isArray(segment.label) ? segment.label : [segment.label];
        const noteLines = Array.isArray(segment.note)
          ? segment.note
          : segment.note
            ? [segment.note]
            : [];
        const headerCenters = bandCenters(box.y, dividerY, headerLines.length, headerInsetTop);
        const noteCenters = bandCenters(
          dividerY,
          boxBottom(box),
          noteLines.length,
          -noteInsetBottom,
        );
        const noteBoundaryYs = bandBoundaries(dividerY, boxBottom(box), noteLines.length);
        cursorX += segment.width;

        return (
          <g key={`${cellStartX}-${segment.width}-${index}`}>
            {index > 0 ? (
              <path
                data-role="segment-divider"
                d={`M ${cellStartX} ${box.y + 10} L ${cellStartX} ${boxBottom(box) - 10}`}
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
                {headerLines.map((line, lineIndex) => (
                  <text
                    key={`header-line-${line}-${lineIndex}`}
                    x={cellCenterX}
                    y={headerCenters[lineIndex]}
                    fill="#22303d"
                    fontSize={headerFontSize}
                    fontWeight="780"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {line}
                  </text>
                ))}
                {segment.note
                  ? noteBoundaryYs.map((guideY, rowIndex) => (
                      <path
                        key={`note-guide-${rowIndex}`}
                        data-role="note-row-divider"
                        data-testid={
                          testId ? `${testId}-note-row-guide-${index}-${rowIndex}` : undefined
                        }
                        d={horizontalPath(cellStartX + 10, cellEndX - 10, guideY)}
                        fill="none"
                        stroke="rgba(76, 90, 102, 0.12)"
                        strokeWidth="1"
                        strokeLinecap="round"
                      />
                    ))
                  : null}
                {segment.note
                  ? noteLines.map((line, lineIndex) => (
                      <text
                        key={`note-line-${line}-${lineIndex}`}
                        x={cellCenterX}
                        y={noteCenters[lineIndex]}
                        fill="rgba(76, 90, 102, 0.82)"
                        fontSize={noteFontSize}
                        fontWeight="690"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {line}
                      </text>
                    ))
                  : null}
              </>
            )}
          </g>
        );
      })}
    </g>
  );
}

export function ArrowPath({
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

export function ArrowHead({
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
  direction: "right" | "down" | "left" | "up";
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

  if (direction === "up") {
    return (
      <>
        <path
          d={`M ${tipX - half} ${tipY + headStart} L ${tipX} ${tipY}`}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={opacity}
        />
        <path
          d={`M ${tipX + half} ${tipY + headStart} L ${tipX} ${tipY}`}
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

export function StrokeArrow({
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
  direction: "right" | "down" | "left" | "up";
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
