import type {ReactNode} from "react";
import {
  clamp01,
  easeInOutCubic,
  easeOutQuint,
  horizontalPath,
  mix,
  mixBox,
  resolveWindowProgress,
  verticalPath,
} from "../geometry/geometry";
import type {SceneModel} from "../model/scene-model-types";
import {Page01Scene} from "./Page01Scene";
import {Page02Scene} from "./Page02Scene";
import {
  ArrowLabelPill,
  CalloutBadge,
  PixelGrid,
  StageBox,
  StackedLabel,
  StrokeArrow,
  VertexTriangles,
} from "../primitives/diagramPrimitives";

const COMPUTER_BOX = {x: 52, y: 291, width: 202, height: 110, radius: 28};
const COMPUTER_VISUAL_TOP_Y = COMPUTER_BOX.y;
const COMPUTER_VISUAL_BOTTOM_Y = COMPUTER_BOX.y + COMPUTER_BOX.height + 28;
const COMPUTER_VISUAL_CENTER_Y =
  (COMPUTER_VISUAL_TOP_Y + COMPUTER_VISUAL_BOTTOM_Y) / 2;
const BYTECODE_BOX = {x: 494, y: 542, width: 292, height: 76, radius: 22};
const SCL_BOX = {x: 235, y: 426, width: 190, height: 66, radius: 20};
const STABLE_PC_BOX = {x: 398, y: 313, width: 206, height: 66, radius: 20};
const STABLE_UPIPE_BOX = {x: 780, y: 291, width: 200, height: 110, radius: 24};
const REC_BOX = {x: 456, y: 104, width: 296, height: 66, radius: 20};
const RETURN_CORRIDOR_Y = REC_BOX.y - 24;
const PHONE_BOX = {
  x: 1040,
  y: COMPUTER_VISUAL_CENTER_Y - 206,
  width: 188,
  height: 412,
  radius: 46,
};
const RUNTIME_LABEL_Y = PHONE_BOX.y + 54;
const PHONE_VERTEX_CENTER = {x: PHONE_BOX.x + PHONE_BOX.width / 2, y: PHONE_BOX.y + 132};
const PHONE_GPU = {x: PHONE_BOX.x + PHONE_BOX.width / 2, y: PHONE_BOX.y + 244};
const PHONE_PIXELS = {x: PHONE_BOX.x + PHONE_BOX.width / 2 - 30, y: PHONE_BOX.y + 318};
const PHONE_VERTEX_BRIDGE_BOX = {
  x: PHONE_VERTEX_CENTER.x - 74,
  y: PHONE_VERTEX_CENTER.y - 44,
  width: 148,
  height: 88,
  radius: 24,
};
const PHONE_GPU_BRIDGE_BOX = {
  x: PHONE_GPU.x - 88,
  y: PHONE_GPU.y - 44,
  width: 176,
  height: 88,
  radius: 24,
};
const PHONE_PIXELS_BRIDGE_BOX = {
  x: PHONE_BOX.x + PHONE_BOX.width / 2 - 72,
  y: PHONE_PIXELS.y - 32,
  width: 144,
  height: 96,
  radius: 24,
};
const SPLIT_CENTER = {x: 330, y: 580};
const PAGE15_EXPAND_MERGE_CENTER = {x: 330, y: 346};
const PAGE15_MERGE_CENTER = {x: 690, y: 346};
const LOOP_PAGE11_FRAME = 546;
const LOOP_PAGE12_FRAME = 600;
const LOOP_PAGE13_FRAME = 654;
const LOOP_PAGE14_FRAME = 708;
const LOOP_PAGE15_FRAME = 798;
const LOOP_PAGE16_FRAME = 852;
const LOOP_PAGE17_FRAME = 942;
const LOOP_PAGE18_FRAME = 1032;
const LOOP_PAGE19_FRAME = 1086;
const LOOP_PAGE20_FRAME = 1176;
const LOOP_PAGE21_FRAME = 1266;
const LOOP_PAGE22_FRAME = 1356;
const LOOP_PAGE23_FRAME = 1446;
const LOOP_PAGE24_FRAME = 1536;
const PLACEHOLDER_BOARD = {x: 148, y: 104, width: 984, height: 512, radius: 36};
const PLACEHOLDER_PAGE16_CARD_1 = {x: 190, y: 220, width: 250, height: 124, radius: 22};
const PLACEHOLDER_PAGE16_CARD_2 = {x: 500, y: 220, width: 250, height: 124, radius: 22};
const PLACEHOLDER_PAGE16_CARD_3 = {x: 190, y: 382, width: 250, height: 124, radius: 22};
const PLACEHOLDER_PAGE16_CARD_4 = {x: 500, y: 382, width: 320, height: 124, radius: 22};
const PLACEHOLDER_PAGE16_FOOTER = {x: 860, y: 220, width: 190, height: 286, radius: 22};
const PLACEHOLDER_PAGE18_LEFT = {x: 186, y: 228, width: 246, height: 214, radius: 24};
const PLACEHOLDER_PAGE18_CENTER = {x: 492, y: 228, width: 298, height: 214, radius: 24};
const PLACEHOLDER_PAGE18_RIGHT = {x: 850, y: 228, width: 220, height: 214, radius: 24};
const PLACEHOLDER_PAGE18_FOOTER = {x: 240, y: 488, width: 780, height: 74, radius: 24};
const PAGE16_REC_TARGET_BOX = {x: 120, y: 272, width: 320, height: 104, radius: 24};
const PAGE16_SCL_TARGET_BOX = {x: 510, y: 100, width: 280, height: 84, radius: 22};
const PAGE16_STABLE_PC_TARGET_BOX = {
  x: 860,
  y: 272,
  width: 320,
  height: 104,
  radius: 24,
};
const PAGE16_EXPAND_CENTER = {x: 650, y: 324};
const PAGE16_EXAMPLE_CARD = {x: 100, y: 400, width: 560, height: 220, radius: 22};
const PAGE16_EXAMPLE_HASH_CENTER = {x: 236, y: 534};
const PAGE16_EXAMPLE_BRANCH_X = 390;
const PAGE16_EXAMPLE_KEY1_CENTER = {x: 560, y: 504};
const PAGE16_EXAMPLE_KEY2_CENTER = {x: 560, y: 564};
const PAGE17_STABLE_PC_TARGET_BOX = {
  x: 120,
  y: 272,
  width: 320,
  height: 104,
  radius: 24,
};
const PAGE17_SCL_TARGET_BOX = {x: 510, y: 100, width: 280, height: 84, radius: 22};
const PAGE17_BUILD_CENTER = {x: 650, y: 324};
const PAGE17_STABLE_UPIPE_TARGET_BOX = {
  x: 860,
  y: 266,
  width: 320,
  height: 116,
  radius: 24,
};
const PAGE17_EXAMPLE_CARD = {x: 100, y: 400, width: 1080, height: 220, radius: 22};
const PAGE17_KEY1_CENTER = {x: 754, y: 508};
const PAGE17_KEY2_CENTER = {x: 754, y: 556};
const PAGE17_HASHA_CENTER = {x: 1004, y: 508};
const PAGE17_HASHB_CENTER = {x: 1004, y: 556};
const PAGE19_STABLE_TARGET_BOX = {
  x: 470,
  y: 132,
  width: 340,
  height: 104,
  radius: 26,
};
const PAGE19_PRECOMPILE_BOX = {x: 534, y: 312, width: 212, height: 70, radius: 20};
const PAGE19_BYTECODE_TARGET_BOX = {
  x: 452,
  y: 500,
  width: 376,
  height: 90,
  radius: 24,
};
const PAGE19_TAKEAWAY_BOX = {x: 220, y: 604, width: 840, height: 34, radius: 14};
const PAGE19_OPENGL_BOX = {x: 150, y: 266, width: 316, height: 170, radius: 26};
const PAGE19_METAL_BOX = {x: 814, y: 266, width: 316, height: 170, radius: 26};
const PAGE1920_MEMORY_START_BOX = {x: 775, y: 168, width: 320, height: 392, radius: 30};
const PAGE1920_MEMORY_END_BOX = {x: 195, y: 168, width: 320, height: 392, radius: 30};
const PAGE1920_MEMORY_ROW_WIDTH = 258;
const PAGE1920_MEMORY_ROW_HEIGHT = 66;
const PAGE1920_MEMORY_ROW_RADIUS = 16;
const PAGE1920_MEMORY_ROW_LEFT_INSET = 31;
const PAGE1920_MEMORY_ROW_TOP_INSET = 75;
const PAGE1920_MEMORY_ROW_GAP = 36;

function centerX(box: {x: number; width: number}) {
  return box.x + box.width / 2;
}

function centerY(box: {y: number; height: number}) {
  return box.y + box.height / 2;
}

function right(box: {x: number; width: number}) {
  return box.x + box.width;
}

function bottom(box: {y: number; height: number}) {
  return box.y + box.height;
}

function boxFromCenter(
  center: {x: number; y: number},
  width: number,
  height: number,
  radius: number,
) {
  return {
    x: center.x - width / 2,
    y: center.y - height / 2,
    width,
    height,
    radius,
  };
}

function page1920MemoryRowBox(memoryBox: {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
}, rowIndex: number) {
  return {
    x: memoryBox.x + PAGE1920_MEMORY_ROW_LEFT_INSET,
    y:
      memoryBox.y +
      PAGE1920_MEMORY_ROW_TOP_INSET +
      rowIndex * (PAGE1920_MEMORY_ROW_HEIGHT + PAGE1920_MEMORY_ROW_GAP),
    width: PAGE1920_MEMORY_ROW_WIDTH,
    height: PAGE1920_MEMORY_ROW_HEIGHT,
    radius: PAGE1920_MEMORY_ROW_RADIUS,
  };
}

function page1920MemoryRows(memoryBox: {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
}) {
  return {
    gl: page1920MemoryRowBox(memoryBox, 0),
    vk: page1920MemoryRowBox(memoryBox, 1),
    mt: page1920MemoryRowBox(memoryBox, 2),
  };
}

function settledSegmentProgress(frame: number, fromFrame: number, toFrame: number) {
  if (frame <= fromFrame) {
    return 0;
  }

  if (frame >= toFrame) {
    return 1;
  }

  return (frame - fromFrame) / Math.max(1, toFrame - fromFrame);
}

function mixPoint(
  from: {x: number; y: number},
  to: {x: number; y: number},
  progress: number,
) {
  return {
    x: mix(from.x, to.x, progress),
    y: mix(from.y, to.y, progress),
  };
}

function distanceBetweenPoints(
  left: {x: number; y: number},
  rightPoint: {x: number; y: number},
) {
  return Math.hypot(rightPoint.x - left.x, rightPoint.y - left.y);
}

function pointsAreCollinear(
  previous: {x: number; y: number},
  current: {x: number; y: number},
  next: {x: number; y: number},
) {
  const ax = current.x - previous.x;
  const ay = current.y - previous.y;
  const bx = next.x - current.x;
  const by = next.y - current.y;

  return Math.abs(ax * by - ay * bx) <= 0.001;
}

function movePointToward(
  from: {x: number; y: number},
  to: {x: number; y: number},
  distance: number,
) {
  const total = distanceBetweenPoints(from, to);

  if (total === 0) {
    return {x: from.x, y: from.y};
  }

  const ratio = distance / total;

  return {
    x: from.x + (to.x - from.x) * ratio,
    y: from.y + (to.y - from.y) * ratio,
  };
}

function roundedPolylinePath(
  points: Array<{x: number; y: number}>,
  maxCornerRadius = 18,
) {
  if (points.length === 0) {
    return "";
  }

  if (points.length === 1) {
    return `M ${points[0]!.x} ${points[0]!.y}`;
  }

  const commands = [`M ${points[0]!.x} ${points[0]!.y}`];

  for (let index = 1; index < points.length - 1; index += 1) {
    const previous = points[index - 1]!;
    const current = points[index]!;
    const next = points[index + 1]!;

    if (pointsAreCollinear(previous, current, next)) {
      commands.push(`L ${current.x} ${current.y}`);
      continue;
    }

    const incomingLength = distanceBetweenPoints(previous, current);
    const outgoingLength = distanceBetweenPoints(current, next);
    const cornerRadius = Math.min(
      maxCornerRadius,
      incomingLength / 2,
      outgoingLength / 2,
    );

    if (cornerRadius < 0.5) {
      commands.push(`L ${current.x} ${current.y}`);
      continue;
    }

    const cornerStart = movePointToward(current, previous, cornerRadius);
    const cornerEnd = movePointToward(current, next, cornerRadius);

    commands.push(`L ${cornerStart.x} ${cornerStart.y}`);
    commands.push(`Q ${current.x} ${current.y} ${cornerEnd.x} ${cornerEnd.y}`);
  }

  commands.push(`L ${points[points.length - 1]!.x} ${points[points.length - 1]!.y}`);

  return commands.join(" ");
}

function polylineLength(points: Array<{x: number; y: number}>) {
  let length = 0;

  for (let index = 1; index < points.length; index += 1) {
    length += distanceBetweenPoints(points[index - 1]!, points[index]!);
  }

  return length;
}

function revealDashArray(
  points: Array<{x: number; y: number}>,
  progress: number,
) {
  const total = Math.max(1, polylineLength(points));
  const visible = Math.max(0.001, total * Math.max(0, Math.min(1, progress)));

  return `${visible} ${total + 240}`;
}

function revealHeadOpacity(progress: number, opacity: number) {
  return opacity * resolveWindowProgress(progress, 0.82, 1, easeOutQuint);
}

function emphasizeWidth(base: number, focus: number) {
  return mix(base, base + 1.8, easeInOutCubic(focus));
}

function mergeTowardBoxTransform(
  sourceBox: {x: number; y: number; width: number; height: number},
  targetBox: {x: number; y: number; width: number; height: number},
  progress: number,
  endScale = 0.46,
) {
  const eased = easeInOutCubic(progress);
  const sourceCenter = {x: centerX(sourceBox), y: centerY(sourceBox)};
  const targetCenter = {x: centerX(targetBox), y: centerY(targetBox)};
  const pullX = mix(0, targetCenter.x - sourceCenter.x, eased);
  const pullY = mix(0, targetCenter.y - sourceCenter.y, eased);
  const scale = mix(1, endScale, eased);

  return `translate(${sourceCenter.x + pullX} ${sourceCenter.y + pullY}) scale(${scale}) translate(${-sourceCenter.x} ${-sourceCenter.y})`;
}

function mergeTowardBoxMetrics(
  sourceBox: {x: number; y: number; width: number; height: number},
  targetBox: {x: number; y: number; width: number; height: number},
  progress: number,
  endScale = 0.46,
) {
  const eased = easeInOutCubic(progress);
  const sourceCenter = {x: centerX(sourceBox), y: centerY(sourceBox)};
  const targetCenter = {x: centerX(targetBox), y: centerY(targetBox)};
  const center = {
    x: mix(sourceCenter.x, targetCenter.x, eased),
    y: mix(sourceCenter.y, targetCenter.y, eased),
  };
  const scale = mix(1, endScale, eased);
  const width = sourceBox.width * scale;
  const height = sourceBox.height * scale;

  return {
    center,
    scale,
    width,
    height,
    x: center.x - width / 2,
    y: center.y - height / 2,
    right: center.x + width / 2,
    bottom: center.y + height / 2,
  };
}

function ComputerDevice({
  scene,
  opacity,
  scale,
  showLabel,
}: {
  scene: SceneModel;
  opacity: number;
  scale: number;
  showLabel: boolean;
}) {
  return (
    <g
      opacity={opacity}
      transform={`translate(${centerX(COMPUTER_BOX)} ${centerY(COMPUTER_BOX)}) scale(${scale}) translate(${-centerX(COMPUTER_BOX)} ${-centerY(COMPUTER_BOX)})`}
    >
      <rect
        x={COMPUTER_BOX.x + 30}
        y={COMPUTER_BOX.y}
        width={COMPUTER_BOX.width}
        height={COMPUTER_BOX.height}
        rx={COMPUTER_BOX.radius}
        fill="rgba(255, 255, 255, 0)"
        stroke="none"
      />
      <rect
        x={COMPUTER_BOX.x + 20}
        y={bottom(COMPUTER_BOX) + 14}
        width={COMPUTER_BOX.width - 40}
        height="14"
        rx="7"
        fill="rgba(34, 48, 61, 0.14)"
      />
      <rect
        x={centerX(COMPUTER_BOX) - 17}
        y={bottom(COMPUTER_BOX) - 2}
        width="34"
        height="24"
        rx="9"
        fill="rgba(34, 48, 61, 0.14)"
      />
      <StageBox
        box={COMPUTER_BOX}
        fill="rgba(247, 242, 234, 0.98)"
        stroke={scene.nodeStroke}
        strokeWidth={3}
        label={showLabel ? "Computer" : undefined}
        labelSize={25}
        labelWeight={760}
      />
    </g>
  );
}

function PhoneDevice({
  scene,
  opacity,
  scale,
  landingFocus,
  stableFocus,
  showDeviceLabel,
  showVertexLabel,
  showPixelsLabel,
  contentOpacity,
}: {
  scene: SceneModel;
  opacity: number;
  scale: number;
  landingFocus: number;
  stableFocus: number;
  showDeviceLabel: boolean;
  showVertexLabel: boolean;
  showPixelsLabel: boolean;
  contentOpacity: number;
}) {
  const runtimeOpacity = contentOpacity;
  const gpuScale = mix(1, 1.06, Math.max(landingFocus, stableFocus));

  return (
    <g
      transform={`translate(${centerX(PHONE_BOX)} ${centerY(PHONE_BOX)}) scale(${scale}) translate(${-centerX(PHONE_BOX)} ${-centerY(PHONE_BOX)})`}
    >
      <g data-testid="page10-phone-shell" opacity={opacity}>
        <rect
          x={PHONE_BOX.x}
          y={PHONE_BOX.y}
          width={PHONE_BOX.width}
          height={PHONE_BOX.height}
          rx={PHONE_BOX.radius}
          fill="rgba(255, 252, 247, 0.94)"
          stroke="rgba(34, 48, 61, 0.22)"
          strokeWidth="2.2"
        />
        <rect
          x={centerX(PHONE_BOX) - 28}
          y={PHONE_BOX.y + 16}
          width="56"
          height="7"
          rx="3.5"
          fill="rgba(34, 48, 61, 0.14)"
        />
        <text
          x={centerX(PHONE_BOX)}
          y={PHONE_BOX.y + 58}
          fill={scene.apiStroke}
          fontSize="24"
          fontWeight="760"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {showDeviceLabel ? "Phone" : ""}
        </text>
        <text
          x={centerX(PHONE_BOX)}
          y={RUNTIME_LABEL_Y}
          fill="rgba(34, 48, 61, 0.52)"
          fontSize="15"
          fontWeight="700"
          letterSpacing="0.06em"
          textAnchor="middle"
        >
          RUNTIME
        </text>
      </g>
      <g data-testid="page10-phone-runtime" opacity={runtimeOpacity}>
        <VertexTriangles
          cx={PHONE_VERTEX_CENTER.x}
          cy={PHONE_VERTEX_CENTER.y}
          opacity={0.9}
          scale={0.42}
        />
        {showVertexLabel ? (
          <text
            x={PHONE_VERTEX_CENTER.x}
            y={PHONE_VERTEX_CENTER.y + 40}
            fill="#22303d"
            fontSize="18"
            fontWeight="720"
            textAnchor="middle"
          >
            VertexData
          </text>
        ) : null}
        <g
          transform={`translate(${PHONE_GPU.x} ${PHONE_GPU.y}) scale(${gpuScale}) translate(${-PHONE_GPU.x} ${-PHONE_GPU.y})`}
        >
          <text
            x={PHONE_GPU.x}
            y={PHONE_GPU.y}
            fill="#22303d"
            fontSize="32"
            fontWeight="800"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            GPU
          </text>
        </g>
        <PixelGrid
          x={PHONE_PIXELS.x}
          y={PHONE_PIXELS.y}
          opacity={0.9}
          scale={0.88}
          revealProgress={1}
        />
        {showPixelsLabel ? (
          <text
            x={centerX(PHONE_BOX)}
            y={PHONE_PIXELS.y + 82}
            fill="#22303d"
            fontSize="18"
            fontWeight="720"
            textAnchor="middle"
          >
            Pixels
          </text>
        ) : null}
      </g>
      <StrokeArrow
        d={verticalPath(centerX(PHONE_BOX), PHONE_VERTEX_CENTER.y + 54, PHONE_GPU.y - 24)}
        stroke={scene.wireStroke}
        opacity={runtimeOpacity * 0.68}
        tipX={centerX(PHONE_BOX)}
        tipY={PHONE_GPU.y - 24}
        direction="down"
        shaftWidth={2.6}
        underlayWidth={4.6}
        headSize={8}
      />
      <StrokeArrow
        d={verticalPath(centerX(PHONE_BOX), PHONE_GPU.y + 24, PHONE_PIXELS.y - 10)}
        stroke={scene.wireStroke}
        opacity={runtimeOpacity * 0.68}
        tipX={centerX(PHONE_BOX)}
        tipY={PHONE_PIXELS.y - 10}
        direction="down"
        shaftWidth={2.6}
        underlayWidth={4.6}
        headSize={8}
      />
    </g>
  );
}

function ArtifactNode({
  box,
  scene,
  opacity,
  label,
  lines,
  detail,
  labelFontSize = 26,
  detailFontSize = 16,
  detailColor = "rgba(34, 48, 61, 0.74)",
  emphasized = false,
}: {
  box: {x: number; y: number; width: number; height: number; radius: number};
  scene: SceneModel;
  opacity: number;
  label?: string;
  lines?: string[];
  detail?: string;
  labelFontSize?: number;
  detailFontSize?: number;
  detailColor?: string;
  emphasized?: boolean;
}) {
  const hasDetail = Boolean(detail && !lines);

  return (
    <g opacity={opacity}>
      <StageBox
        box={box}
        fill={emphasized ? scene.focusFill : "rgba(255, 251, 246, 0.98)"}
        stroke={emphasized ? scene.apiStroke : scene.nodeStroke}
        strokeWidth={emphasized ? 3.2 : 2.7}
      />
      {lines ? (
        <StackedLabel
          x={centerX(box)}
          y={centerY(box) + 2}
          lines={lines}
          fontSize={labelFontSize}
          fontWeight={760}
          lineGap={28}
        />
      ) : label ? (
        <>
          <text
            x={centerX(box)}
            y={centerY(box) + (hasDetail ? -12 : 2)}
            fill="#22303d"
            fontSize={labelFontSize}
            fontWeight="760"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {label}
          </text>
          {hasDetail ? (
            <text
              x={centerX(box)}
              y={centerY(box) + 20}
              fill={detailColor}
              fontSize={detailFontSize}
              fontWeight="700"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {detail}
            </text>
          ) : null}
        </>
      ) : null}
    </g>
  );
}

function PlaceholderBoardShell({
  opacity,
  children,
}: {
  opacity: number;
  children: ReactNode;
}) {
  const boardScale = mix(0.94, 1, easeOutQuint(opacity));

  return (
    <g
      opacity={opacity}
      transform={`translate(${centerX(PLACEHOLDER_BOARD)} ${centerY(PLACEHOLDER_BOARD)}) scale(${boardScale}) translate(${-centerX(PLACEHOLDER_BOARD)} ${-centerY(PLACEHOLDER_BOARD)})`}
    >
      {children}
    </g>
  );
}

function FloatingCard({
  scene,
  box,
  title,
  lines,
  opacity,
  accent = false,
}: {
  scene: SceneModel;
  box: {x: number; y: number; width: number; height: number; radius: number};
  title: string;
  lines: string[];
  opacity: number;
  accent?: boolean;
}) {
  return (
    <g opacity={opacity}>
      <StageBox
        box={box}
        fill={accent ? "rgba(248, 236, 226, 0.96)" : "rgba(255, 251, 246, 0.94)"}
        stroke={accent ? scene.apiStroke : scene.nodeStroke}
        strokeWidth={accent ? 3 : 2.6}
      />
      <text
        x={centerX(box)}
        y={box.y + 32}
        fill={accent ? scene.apiStroke : "#22303d"}
        fontSize="22"
        fontWeight="780"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {title}
      </text>
      <StackedLabel
        x={centerX(box)}
        y={centerY(box) + 18}
        lines={lines}
        fontSize={20}
        fontWeight={700}
        lineGap={23}
      />
    </g>
  );
}

function FloatingPill({
  scene,
  box,
  label,
  opacity,
  accent = false,
}: {
  scene: SceneModel;
  box: {x: number; y: number; width: number; height: number; radius: number};
  label: string;
  opacity: number;
  accent?: boolean;
}) {
  return (
    <g opacity={opacity}>
      <StageBox
        box={box}
        fill={accent ? "rgba(248, 236, 226, 0.96)" : "rgba(255, 251, 246, 0.92)"}
        stroke={accent ? scene.apiStroke : scene.nodeStroke}
        strokeWidth={accent ? 2.8 : 2.4}
      />
      <text
        x={centerX(box)}
        y={centerY(box) + 1}
        fill={accent ? scene.apiStroke : "#22303d"}
        fontSize="20"
        fontWeight="760"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {label}
      </text>
    </g>
  );
}

function MicroToken({
  scene,
  box,
  label,
  opacity,
  accent = false,
}: {
  scene: SceneModel;
  box: {x: number; y: number; width: number; height: number; radius: number};
  label: string;
  opacity: number;
  accent?: boolean;
}) {
  return (
    <g opacity={opacity}>
      <StageBox
        box={box}
        fill={accent ? "rgba(248, 236, 226, 0.96)" : "rgba(255, 251, 246, 0.94)"}
        stroke={accent ? scene.apiStroke : "rgba(92, 106, 118, 0.46)"}
        strokeWidth={accent ? 2.4 : 1.9}
      />
      <text
        x={centerX(box)}
        y={centerY(box) + 1}
        fill={accent ? scene.apiStroke : "#22303d"}
        fontSize="18"
        fontWeight="760"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {label}
      </text>
    </g>
  );
}

function TinyTag({
  x,
  y,
  label,
  opacity,
  accent,
}: {
  x: number;
  y: number;
  label: string;
  opacity: number;
  accent: string;
}) {
  return (
    <text
      x={x}
      y={y}
      fill={accent}
      fontSize="16"
      fontWeight="800"
      letterSpacing="0.08em"
      textAnchor="start"
      dominantBaseline="middle"
      opacity={opacity}
    >
      {label}
    </text>
  );
}

function NotePanel({
  scene,
  box,
  title,
  lines,
  opacity,
  accent = false,
}: {
  scene: SceneModel;
  box: {x: number; y: number; width: number; height: number; radius: number};
  title: string;
  lines: string[];
  opacity: number;
  accent?: boolean;
}) {
  const titleColor = accent ? scene.apiStroke : "#22303d";
  const copyColor = accent ? "rgba(209, 110, 74, 0.92)" : "rgba(34, 48, 61, 0.82)";

  return (
    <g opacity={opacity}>
      <StageBox
        box={box}
        fill={accent ? "rgba(248, 236, 226, 0.9)" : "rgba(255, 251, 246, 0.9)"}
        stroke={accent ? scene.apiStroke : "rgba(92, 106, 118, 0.52)"}
        strokeWidth={accent ? 2.4 : 2}
      />
      <text
        x={box.x + 20}
        y={box.y + 26}
        fill={titleColor}
        fontSize="18"
        fontWeight="800"
        textAnchor="start"
        dominantBaseline="middle"
      >
        {title}
      </text>
      {lines.map((line, index) => (
        <text
          key={`${title}-${line}`}
          x={box.x + 20}
          y={box.y + 56 + index * 21}
          fill={copyColor}
          fontSize="16"
          fontWeight={index === 0 ? 720 : 680}
          textAnchor="start"
          dominantBaseline="middle"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function DotMeter({
  x,
  y,
  columns,
  rows = 1,
  opacity,
  accent,
}: {
  x: number;
  y: number;
  columns: number;
  rows?: number;
  opacity: number;
  accent: string;
}) {
  return (
    <g opacity={opacity}>
      {Array.from({length: rows * columns}).map((_, index) => {
        const col = index % columns;
        const row = Math.floor(index / columns);

        return (
          <circle
            key={`${x}-${y}-${index}`}
            cx={x + col * 18}
            cy={y + row * 18}
            r="5.2"
            fill={accent}
            opacity={0.34 + index * 0.06}
          />
        );
      })}
    </g>
  );
}

function Page14Placeholder({
  scene,
  opacity,
}: {
  scene: SceneModel;
  opacity: number;
}) {
  const drawReveal = resolveWindowProgress(opacity, 0.14, 0.5, easeOutQuint);
  const routeReveal = resolveWindowProgress(opacity, 0.34, 0.82, easeOutQuint);
  const drawBox = {x: 214, y: 318, width: 168, height: 58, radius: 20};
  const psoBox = {x: 424, y: 282, width: 464, height: 126, radius: 60};
  const recBox = {x: 930, y: 314, width: 206, height: 66, radius: 22};
  const innerBssBox = {x: 436, y: 326, width: 222, height: 52, radius: 24};
  const innerVsBox = {x: 446, y: 334, width: 96, height: 36, radius: 16};
  const innerPsBox = {x: 552, y: 334, width: 96, height: 36, radius: 16};
  const innerStateBox = {x: 704, y: 328, width: 136, height: 46, radius: 18};
  const drawToPsoPoints = [
    {x: right(drawBox) + 10, y: centerY(drawBox)},
    {x: psoBox.x - 12, y: centerY(psoBox)},
  ];
  const psoToRecPoints = [
    {x: right(psoBox) + 12, y: centerY(psoBox)},
    {x: recBox.x - 12, y: centerY(recBox)},
  ];

  return (
    <PlaceholderBoardShell opacity={opacity}>
      <text
        x={centerX(PLACEHOLDER_BOARD)}
        y="126"
        fill={scene.apiStroke}
        fontSize="34"
        fontWeight="800"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        Phone 如何收集 PSO
      </text>
      <FloatingPill
        scene={scene}
        box={drawBox}
        label="Draw"
        opacity={opacity}
      />
      <g opacity={opacity}>
        <StageBox
          box={psoBox}
          fill="rgba(255, 251, 246, 0.94)"
          stroke={scene.apiStroke}
          strokeWidth={3}
        />
        <text
          x={centerX(psoBox)}
          y={psoBox.y + 18}
          fill={scene.apiStroke}
          fontSize="20"
          fontWeight="780"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          PSO
        </text>
      </g>
      <g opacity={opacity}>
        <StageBox
          box={innerBssBox}
          fill="rgba(255, 247, 239, 0.96)"
          stroke="rgba(209, 110, 74, 0.42)"
          strokeWidth={2.2}
        />
        <text
          x={centerX(innerBssBox)}
          y={innerBssBox.y - 8}
          fill="rgba(34, 48, 61, 0.72)"
          fontSize="15"
          fontWeight="780"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          BSS
        </text>
      </g>
      <FloatingPill
        scene={scene}
        box={innerVsBox}
        label="VS Hash"
        opacity={opacity}
        accent
      />
      <FloatingPill
        scene={scene}
        box={innerPsBox}
        label="PS Hash"
        opacity={opacity}
        accent
      />
      <FloatingPill
        scene={scene}
        box={innerStateBox}
        label="State"
        opacity={opacity}
      />
      <g opacity={opacity}>
        <StageBox
          box={recBox}
          fill="rgba(248, 236, 226, 0.96)"
          stroke={scene.apiStroke}
          strokeWidth={3}
        />
        <text
          x={centerX(recBox)}
          y={centerY(recBox) + 1}
          fill={scene.apiStroke}
          fontSize="20"
          fontWeight="780"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          .rec.upipelinecache
        </text>
      </g>
      <text
        x={psoBox.x + 108}
        y={478}
        fill="rgba(34, 48, 61, 0.72)"
        fontSize="19"
        fontWeight="720"
        textAnchor="middle"
        dominantBaseline="middle"
        opacity={opacity}
      >
        OpenGL: BSS
      </text>
      <text
        x={psoBox.x + 342}
        y={478}
        fill={scene.apiStroke}
        fontSize="19"
        fontWeight="720"
        textAnchor="middle"
        dominantBaseline="middle"
        opacity={opacity}
      >
        Vulkan / Metal: BSS + State
      </text>
      <StrokeArrow
        d={roundedPolylinePath(drawToPsoPoints)}
        stroke={scene.apiStroke}
        opacity={opacity * drawReveal}
        headOpacity={revealHeadOpacity(drawReveal, opacity * drawReveal)}
        tipX={psoBox.x - 12}
        tipY={centerY(psoBox)}
        direction="right"
        shaftWidth={3.1}
        underlayWidth={5.6}
        headSize={9}
        testId="page14-draw-to-pso-arrow"
        dashArray="12 10"
      />
      <StrokeArrow
        d={roundedPolylinePath(psoToRecPoints)}
        stroke={scene.apiStroke}
        opacity={opacity * routeReveal}
        headOpacity={revealHeadOpacity(routeReveal, opacity * routeReveal)}
        dashArray={revealDashArray(psoToRecPoints, routeReveal)}
        tipX={recBox.x - 12}
        tipY={centerY(recBox)}
        direction="right"
        shaftWidth={3.1}
        underlayWidth={5.6}
        headSize={9}
        testId="page14-pso-to-rec-arrow"
      />
    </PlaceholderBoardShell>
  );
}

function Page16Placeholder({
  scene,
  opacity,
  entryProgress,
  handoffProgress,
}: {
  scene: SceneModel;
  opacity: number;
  entryProgress: number;
  handoffProgress: number;
}) {
  const intro = resolveWindowProgress(entryProgress, 0.04, 0.88, easeInOutCubic);
  const settle = easeOutQuint(intro);
  const routeReveal = resolveWindowProgress(entryProgress, 0.14, 0.68, easeOutQuint);
  const handoff = resolveWindowProgress(handoffProgress, 0.32, 0.5, easeInOutCubic);
  const sharedCenter = mixPoint(PAGE16_EXPAND_CENTER, PAGE17_BUILD_CENTER, handoff);
  const noteOpacity =
    opacity *
    resolveWindowProgress(entryProgress, 0.3, 0.94, easeOutQuint) *
    (1 - handoff);
  const sharedOpacity = opacity;
  const recOpacity = sharedOpacity * (1 - handoff * 0.98);
  const operationOpacity = sharedOpacity;
  const recBox = mixBox(REC_BOX, PAGE16_REC_TARGET_BOX, settle);
  const baseSclBox = mixBox(SCL_BOX, PAGE16_SCL_TARGET_BOX, settle);
  const sclBox = mixBox(baseSclBox, PAGE17_SCL_TARGET_BOX, handoff);
  const baseStablePcBox = mixBox(
    STABLE_PC_BOX,
    PAGE16_STABLE_PC_TARGET_BOX,
    settle,
  );
  const stablePcBox = mixBox(
    baseStablePcBox,
    PAGE17_STABLE_PC_TARGET_BOX,
    handoff,
  );
  const hashTokenBox = boxFromCenter(PAGE16_EXAMPLE_HASH_CENTER, 154, 40, 14);
  const key1Box = boxFromCenter(PAGE16_EXAMPLE_KEY1_CENTER, 154, 40, 14);
  const key2Box = boxFromCenter(PAGE16_EXAMPLE_KEY2_CENTER, 154, 40, 14);
  const recToExpandPoints = [
    {x: right(recBox) + 10, y: sharedCenter.y},
    {x: sharedCenter.x - 18, y: sharedCenter.y},
  ];
  const sclToExpandPoints = [
    {x: centerX(sclBox), y: bottom(sclBox) + 10},
    {x: centerX(sclBox), y: sharedCenter.y - 18},
  ];
  const expandToStablePcPoints = [
    {x: sharedCenter.x + 18, y: sharedCenter.y},
    {x: stablePcBox.x - 10, y: sharedCenter.y},
  ];
  const hashToKey1Points = [
    {x: right(hashTokenBox) + 10, y: centerY(hashTokenBox)},
    {x: PAGE16_EXAMPLE_BRANCH_X, y: centerY(hashTokenBox)},
    {x: PAGE16_EXAMPLE_BRANCH_X, y: centerY(key1Box)},
    {x: key1Box.x, y: centerY(key1Box)},
  ];
  const hashToKey2Points = [
    {x: right(hashTokenBox) + 10, y: centerY(hashTokenBox)},
    {x: PAGE16_EXAMPLE_BRANCH_X, y: centerY(hashTokenBox)},
    {x: PAGE16_EXAMPLE_BRANCH_X, y: centerY(key2Box)},
    {x: key2Box.x, y: centerY(key2Box)},
  ];
  return (
    <PlaceholderBoardShell opacity={opacity}>
      <ArtifactNode
        scene={scene}
        box={recBox}
        label="rec.upipelinecache"
        detail="ShaderHash + State (历史版本)"
        opacity={recOpacity}
        labelFontSize={24}
        detailFontSize={17}
      />
      <ArtifactNode
        scene={scene}
        box={stablePcBox}
        label="stablepc.csv"
        detail="ShaderStableKey + State"
        opacity={sharedOpacity}
        labelFontSize={24}
        detailFontSize={17}
        emphasized
      />
      <ArtifactNode
        scene={scene}
        box={sclBox}
        label=".scl.csv"
        detail="ShaderHash <-> ShaderStableKey"
        opacity={sharedOpacity}
        labelFontSize={24}
        detailFontSize={16}
      />
      <CalloutBadge
        x={sharedCenter.x}
        y={sharedCenter.y}
        label="+"
        stroke={scene.apiStroke}
        opacity={operationOpacity}
      />
      <StrokeArrow
        d={roundedPolylinePath(recToExpandPoints)}
        stroke={scene.apiStroke}
        opacity={recOpacity}
        headOpacity={revealHeadOpacity(routeReveal, recOpacity)}
        dashArray={revealDashArray(recToExpandPoints, routeReveal)}
        tipX={sharedCenter.x - 18}
        tipY={sharedCenter.y}
        direction="right"
        shaftWidth={3.1}
        underlayWidth={5.8}
        headSize={9}
        testId="page16-rec-to-expand-arrow"
      />
      <StrokeArrow
        d={roundedPolylinePath(sclToExpandPoints)}
        stroke={scene.apiStroke}
        opacity={sharedOpacity}
        headOpacity={revealHeadOpacity(routeReveal, sharedOpacity)}
        dashArray={revealDashArray(sclToExpandPoints, routeReveal)}
        tipX={sharedCenter.x}
        tipY={sharedCenter.y - 18}
        direction="down"
        shaftWidth={3.1}
        underlayWidth={5.8}
        headSize={9}
        testId="page16-scl-to-expand-arrow"
      />
      <StrokeArrow
        d={roundedPolylinePath(expandToStablePcPoints)}
        stroke={scene.apiStroke}
        opacity={operationOpacity}
        headOpacity={revealHeadOpacity(routeReveal, operationOpacity)}
        dashArray={revealDashArray(expandToStablePcPoints, routeReveal)}
        tipX={stablePcBox.x - 10}
        tipY={centerY(stablePcBox)}
        direction="right"
        shaftWidth={3.1}
        underlayWidth={5.8}
        headSize={9}
        testId="page16-expand-to-stablepc-arrow"
      />
      <ArrowLabelPill
        x={(sharedCenter.x + stablePcBox.x - 10) / 2 + 4}
        y={sharedCenter.y - 26}
        width={108}
        height={28}
        label="expand"
        stroke={scene.apiStroke}
        opacity={operationOpacity}
      />
      <text
        x={right(sclBox) + 18}
        y={sclBox.y + 20}
        fill="rgba(34, 48, 61, 0.74)"
        fontSize="20"
        fontWeight="740"
        textAnchor="start"
        dominantBaseline="middle"
        opacity={noteOpacity}
      >
        历史 .scl.csv
      </text>
      <text
        x={right(sclBox) + 18}
        y={sclBox.y + 48}
        fill={scene.apiStroke}
        fontSize="19"
        fontWeight="760"
        textAnchor="start"
        dominantBaseline="middle"
        opacity={noteOpacity}
      >
        必须与 rec.upipelinecache 同版本
      </text>
      <g opacity={noteOpacity}>
        <StageBox
          box={PAGE16_EXAMPLE_CARD}
          fill="rgba(255, 251, 246, 0.88)"
          stroke="rgba(92, 106, 118, 0.16)"
          strokeWidth={1.6}
        />
        <text
          x={PAGE16_EXAMPLE_CARD.x + 18}
          y={PAGE16_EXAMPLE_CARD.y + 18}
          fill="rgba(34, 48, 61, 0.62)"
          fontSize="16"
          fontWeight="800"
          letterSpacing="0.04em"
          textAnchor="start"
          dominantBaseline="middle"
        >
          Expand Example
        </text>
        <text
          x={PAGE16_EXAMPLE_CARD.x + 18}
          y={PAGE16_EXAMPLE_CARD.y + 46}
          fill="rgba(34, 48, 61, 0.74)"
          fontSize="15"
          fontWeight="760"
          textAnchor="start"
          dominantBaseline="middle"
        >
          Expand: 1 个 Hash_rec 映射到 2 个 StableKey
        </text>
      </g>
      <MicroToken
        scene={scene}
        box={hashTokenBox}
        label="Hash_rec"
        opacity={noteOpacity}
      />
      <MicroToken
        scene={scene}
        box={key1Box}
        label="StableKey_A"
        opacity={noteOpacity}
        accent
      />
      <MicroToken
        scene={scene}
        box={key2Box}
        label="StableKey_B"
        opacity={noteOpacity}
        accent
      />
      <StrokeArrow
        d={roundedPolylinePath(hashToKey1Points)}
        stroke={scene.wireStroke}
        opacity={noteOpacity}
        headOpacity={noteOpacity}
        dashArray={revealDashArray(hashToKey1Points, routeReveal)}
        tipX={key1Box.x}
        tipY={centerY(key1Box)}
        direction="right"
        shaftWidth={2.2}
        underlayWidth={4.2}
        headSize={7}
      />
      <StrokeArrow
        d={roundedPolylinePath(hashToKey2Points)}
        stroke={scene.wireStroke}
        opacity={noteOpacity}
        headOpacity={noteOpacity}
        dashArray={revealDashArray(hashToKey2Points, routeReveal)}
        tipX={key2Box.x}
        tipY={centerY(key2Box)}
        direction="right"
        shaftWidth={2.2}
        underlayWidth={4.2}
        headSize={7}
      />
    </PlaceholderBoardShell>
  );
}

function Page17Placeholder({
  scene,
  opacity,
  entryProgress,
}: {
  scene: SceneModel;
  opacity: number;
  entryProgress: number;
}) {
  const intro = resolveWindowProgress(entryProgress, 0.06, 0.9, easeInOutCubic);
  const settle = easeOutQuint(intro);
  const routeReveal = resolveWindowProgress(entryProgress, 0.16, 0.72, easeOutQuint);
  const annotationOpacity =
    opacity * resolveWindowProgress(entryProgress, 0.28, 0.94, easeOutQuint);
  const splitTravel = resolveWindowProgress(
    entryProgress,
    0.28,
    0.72,
    easeInOutCubic,
  );
  const sharedOpacity = opacity;
  const stablePcBox = mixBox(
    PAGE16_STABLE_PC_TARGET_BOX,
    PAGE17_STABLE_PC_TARGET_BOX,
    settle,
  );
  const currentSclBox = mixBox(PAGE16_SCL_TARGET_BOX, PAGE17_SCL_TARGET_BOX, settle);
  const stableUpipeBox = mixBox(
    boxFromCenter(PAGE17_BUILD_CENTER, 182, 64, 20),
    PAGE17_STABLE_UPIPE_TARGET_BOX,
    settle,
  );
  const splitExampleBox = {
    x: PAGE17_EXAMPLE_CARD.x + 24,
    y: PAGE17_EXAMPLE_CARD.y + 72,
    width: 500,
    height: 128,
    radius: 16,
  };
  const mergeExampleBox = {
    x: PAGE17_EXAMPLE_CARD.x + 556,
    y: PAGE17_EXAMPLE_CARD.y + 72,
    width: 500,
    height: 128,
    radius: 16,
  };
  const splitKey1Box = boxFromCenter(
    {x: splitExampleBox.x + 134, y: splitExampleBox.y + 42},
    152,
    38,
    12,
  );
  const splitKey2Box = boxFromCenter(
    {x: splitExampleBox.x + 134, y: splitExampleBox.y + 96},
    152,
    38,
    12,
  );
  const splitHashABox = boxFromCenter(
    {x: splitExampleBox.x + 374, y: splitExampleBox.y + 42},
    152,
    38,
    12,
  );
  const splitHashBBox = boxFromCenter(
    {x: splitExampleBox.x + 374, y: splitExampleBox.y + 96},
    152,
    38,
    12,
  );
  const mergeKey1Box = boxFromCenter(
    {x: mergeExampleBox.x + 134, y: mergeExampleBox.y + 42},
    152,
    38,
    12,
  );
  const mergeKey2Box = boxFromCenter(
    {x: mergeExampleBox.x + 134, y: mergeExampleBox.y + 96},
    152,
    38,
    12,
  );
  const mergeHashBox = boxFromCenter(
    {x: mergeExampleBox.x + 374, y: mergeExampleBox.y + 68},
    166,
    40,
    12,
  );
  const sourceKeyABox = boxFromCenter(PAGE16_EXAMPLE_KEY1_CENTER, 154, 40, 14);
  const sourceKeyBBox = boxFromCenter(PAGE16_EXAMPLE_KEY2_CENTER, 154, 40, 14);
  const splitKey1AnimatedBox = mixBox(sourceKeyABox, splitKey1Box, splitTravel);
  const splitKey2AnimatedBox = mixBox(sourceKeyBBox, splitKey2Box, splitTravel);
  const mergeKey1AnimatedBox = mixBox(sourceKeyABox, mergeKey1Box, splitTravel);
  const mergeKey2AnimatedBox = mixBox(sourceKeyBBox, mergeKey2Box, splitTravel);
  const stablePcToBuildPoints = [
    {x: right(stablePcBox) + 10, y: PAGE17_BUILD_CENTER.y},
    {x: PAGE17_BUILD_CENTER.x - 18, y: PAGE17_BUILD_CENTER.y},
  ];
  const sclToBuildPoints = [
    {x: centerX(currentSclBox), y: bottom(currentSclBox) + 10},
    {x: centerX(currentSclBox), y: PAGE17_BUILD_CENTER.y - 18},
  ];
  const buildToStablePoints = [
    {x: PAGE17_BUILD_CENTER.x + 18, y: PAGE17_BUILD_CENTER.y},
    {x: stableUpipeBox.x - 10, y: PAGE17_BUILD_CENTER.y},
  ];
  const splitKey1ToHashAPoints = [
    {x: right(splitKey1AnimatedBox) + 8, y: centerY(splitKey1AnimatedBox)},
    {x: splitHashABox.x, y: centerY(splitHashABox)},
  ];
  const splitKey2ToHashBPoints = [
    {x: right(splitKey2AnimatedBox) + 8, y: centerY(splitKey2AnimatedBox)},
    {x: splitHashBBox.x, y: centerY(splitHashBBox)},
  ];
  const mergeKey1ToHashPoints = [
    {x: right(mergeKey1AnimatedBox) + 8, y: centerY(mergeKey1AnimatedBox)},
    {x: mergeHashBox.x - 10, y: centerY(mergeKey1AnimatedBox)},
    {x: mergeHashBox.x - 10, y: centerY(mergeHashBox) - 9},
    {x: mergeHashBox.x, y: centerY(mergeHashBox) - 9},
  ];
  const mergeKey2ToHashPoints = [
    {x: right(mergeKey2AnimatedBox) + 8, y: centerY(mergeKey2AnimatedBox)},
    {x: mergeHashBox.x - 10, y: centerY(mergeKey2AnimatedBox)},
    {x: mergeHashBox.x - 10, y: centerY(mergeHashBox) + 9},
    {x: mergeHashBox.x, y: centerY(mergeHashBox) + 9},
  ];

  return (
    <PlaceholderBoardShell opacity={opacity}>
      <ArtifactNode
        scene={scene}
        box={stablePcBox}
        label="stablepc.csv"
        detail="ShaderStableKey + State"
        opacity={sharedOpacity}
        labelFontSize={24}
        detailFontSize={17}
        emphasized
      />
      <ArtifactNode
        scene={scene}
        box={stableUpipeBox}
        label="stable.upipelinecache"
        detail="ShaderHash + State (current)"
        opacity={opacity}
        labelFontSize={22}
        detailFontSize={16}
        emphasized
      />
      <ArtifactNode
        scene={scene}
        box={currentSclBox}
        label=".scl.csv"
        detail="ShaderHash <-> ShaderStableKey"
        opacity={sharedOpacity}
        labelFontSize={24}
        detailFontSize={16}
      />
      <CalloutBadge
        x={PAGE17_BUILD_CENTER.x}
        y={PAGE17_BUILD_CENTER.y}
        label="+"
        stroke={scene.apiStroke}
        opacity={opacity}
      />
      <StrokeArrow
        d={roundedPolylinePath(stablePcToBuildPoints)}
        stroke={scene.apiStroke}
        opacity={sharedOpacity}
        headOpacity={revealHeadOpacity(routeReveal, sharedOpacity)}
        dashArray={revealDashArray(stablePcToBuildPoints, routeReveal)}
        tipX={PAGE17_BUILD_CENTER.x - 18}
        tipY={PAGE17_BUILD_CENTER.y}
        direction="right"
        shaftWidth={3.1}
        underlayWidth={5.8}
        headSize={9}
        testId="page17-stablepc-to-build-arrow"
      />
      <StrokeArrow
        d={roundedPolylinePath(sclToBuildPoints)}
        stroke={scene.apiStroke}
        opacity={sharedOpacity}
        headOpacity={revealHeadOpacity(routeReveal, sharedOpacity)}
        dashArray={revealDashArray(sclToBuildPoints, routeReveal)}
        tipX={PAGE17_BUILD_CENTER.x}
        tipY={PAGE17_BUILD_CENTER.y - 18}
        direction="down"
        shaftWidth={3.1}
        underlayWidth={5.8}
        headSize={9}
        testId="page17-scl-to-build-arrow"
      />
      <StrokeArrow
        d={roundedPolylinePath(buildToStablePoints)}
        stroke={scene.apiStroke}
        opacity={opacity}
        headOpacity={revealHeadOpacity(routeReveal, opacity)}
        dashArray={revealDashArray(buildToStablePoints, routeReveal)}
        tipX={stableUpipeBox.x - 10}
        tipY={PAGE17_BUILD_CENTER.y}
        direction="right"
        shaftWidth={3.1}
        underlayWidth={5.8}
        headSize={9}
        testId="page17-build-to-stableupipe-arrow"
      />
      <ArrowLabelPill
        x={(PAGE17_BUILD_CENTER.x + stableUpipeBox.x - 10) / 2 + 4}
        y={PAGE17_BUILD_CENTER.y - 26}
        width={94}
        height={28}
        label="build"
        stroke={scene.apiStroke}
        opacity={opacity}
      />
      <text
        x={right(currentSclBox) + 18}
        y={currentSclBox.y + 20}
        fill="rgba(34, 48, 61, 0.74)"
        fontSize="20"
        fontWeight="740"
        textAnchor="start"
        dominantBaseline="middle"
        opacity={annotationOpacity}
      >
        当前 .scl.csv（新版本）
      </text>
      <text
        x={right(currentSclBox) + 18}
        y={currentSclBox.y + 48}
        fill={scene.apiStroke}
        fontSize="19"
        fontWeight="760"
        textAnchor="start"
        dominantBaseline="middle"
        opacity={annotationOpacity}
      >
        build 阶段使用该映射
      </text>
      <g opacity={annotationOpacity}>
        <StageBox
          box={PAGE17_EXAMPLE_CARD}
          fill="rgba(255, 251, 246, 0.9)"
          stroke="rgba(92, 106, 118, 0.16)"
          strokeWidth={1.6}
        />
        <text
          x={PAGE17_EXAMPLE_CARD.x + 18}
          y={PAGE17_EXAMPLE_CARD.y + 18}
          fill="rgba(34, 48, 61, 0.62)"
          fontSize="16"
          fontWeight="800"
          letterSpacing="0.04em"
          textAnchor="start"
          dominantBaseline="middle"
        >
          Build Examples
        </text>
        <StageBox
          box={splitExampleBox}
          fill="rgba(255, 251, 246, 0.94)"
          stroke="rgba(92, 106, 118, 0.18)"
          strokeWidth={1.4}
        />
        <StageBox
          box={mergeExampleBox}
          fill="rgba(255, 251, 246, 0.94)"
          stroke="rgba(92, 106, 118, 0.18)"
          strokeWidth={1.4}
        />
        <text
          x={splitExampleBox.x + 12}
          y={splitExampleBox.y + 14}
          fill="rgba(34, 48, 61, 0.66)"
          fontSize="12"
          fontWeight="780"
          textAnchor="start"
          dominantBaseline="middle"
        >
          A 分裂映射
        </text>
        <text
          x={mergeExampleBox.x + 12}
          y={mergeExampleBox.y + 14}
          fill="rgba(34, 48, 61, 0.66)"
          fontSize="12"
          fontWeight="780"
          textAnchor="start"
          dominantBaseline="middle"
        >
          B 合并映射
        </text>
      </g>
      <MicroToken
        scene={scene}
        box={splitKey1AnimatedBox}
        label="Key_A"
        opacity={annotationOpacity}
      />
      <MicroToken
        scene={scene}
        box={splitKey2AnimatedBox}
        label="Key_B"
        opacity={annotationOpacity}
      />
      <MicroToken
        scene={scene}
        box={splitHashABox}
        label="Hash_A"
        opacity={annotationOpacity}
        accent
      />
      <MicroToken
        scene={scene}
        box={splitHashBBox}
        label="Hash_B"
        opacity={annotationOpacity}
        accent
      />
      <StrokeArrow
        d={roundedPolylinePath(splitKey1ToHashAPoints)}
        stroke={scene.wireStroke}
        opacity={annotationOpacity}
        headOpacity={annotationOpacity}
        dashArray={revealDashArray(splitKey1ToHashAPoints, routeReveal)}
        tipX={splitHashABox.x}
        tipY={centerY(splitHashABox)}
        direction="right"
        shaftWidth={2.2}
        underlayWidth={4.2}
        headSize={7}
      />
      <StrokeArrow
        d={roundedPolylinePath(splitKey2ToHashBPoints)}
        stroke={scene.wireStroke}
        opacity={annotationOpacity}
        headOpacity={annotationOpacity}
        dashArray={revealDashArray(splitKey2ToHashBPoints, routeReveal)}
        tipX={splitHashBBox.x}
        tipY={centerY(splitHashBBox)}
        direction="right"
        shaftWidth={2.2}
        underlayWidth={4.2}
        headSize={7}
      />
      <MicroToken
        scene={scene}
        box={mergeKey1AnimatedBox}
        label="Key_A"
        opacity={annotationOpacity}
      />
      <MicroToken
        scene={scene}
        box={mergeKey2AnimatedBox}
        label="Key_B"
        opacity={annotationOpacity}
      />
      <MicroToken
        scene={scene}
        box={mergeHashBox}
        label="Hash_now"
        opacity={annotationOpacity}
        accent
      />
      <StrokeArrow
        d={roundedPolylinePath(mergeKey1ToHashPoints)}
        stroke={scene.wireStroke}
        opacity={annotationOpacity}
        headOpacity={annotationOpacity}
        dashArray={revealDashArray(mergeKey1ToHashPoints, routeReveal)}
        tipX={mergeHashBox.x}
        tipY={centerY(mergeHashBox) - 9}
        direction="right"
        shaftWidth={2.2}
        underlayWidth={4.2}
        headSize={7}
      />
      <StrokeArrow
        d={roundedPolylinePath(mergeKey2ToHashPoints)}
        stroke={scene.wireStroke}
        opacity={annotationOpacity}
        headOpacity={annotationOpacity}
        dashArray={revealDashArray(mergeKey2ToHashPoints, routeReveal)}
        tipX={mergeHashBox.x}
        tipY={centerY(mergeHashBox) + 9}
        direction="right"
        shaftWidth={2.2}
        underlayWidth={4.2}
        headSize={7}
      />
    </PlaceholderBoardShell>
  );
}

function Page19Placeholder({
  scene,
  opacity,
  entryProgress,
  exitProgress,
}: {
  scene: SceneModel;
  opacity: number;
  entryProgress: number;
  exitProgress: number;
}) {
  const ACCENT = scene.apiStroke;
  const NODE_STROKE = scene.nodeStroke;
  const CARD_FILL = scene.neutralFill;
  const SOFT_FILL = scene.focusFill;
  const TEXT = "#22303d";

  const routeReveal = resolveWindowProgress(entryProgress, 0.1, 0.8, easeOutQuint);
  const transitionT = clamp01(exitProgress);
  const sharedTravel = resolveWindowProgress(transitionT, 0.08, 0.92, easeInOutCubic);
  const leftLaneExit = resolveWindowProgress(transitionT, 0.16, 0.84, easeInOutCubic);
  const leftLaneShiftX = mix(0, -320, leftLaneExit);
  const sharedHandoff = resolveWindowProgress(transitionT, 0.46, 0.58, easeInOutCubic);
  const localOpacity = opacity;
  const leftLaneOpacity =
    localOpacity * (1 - resolveWindowProgress(transitionT, 0.62, 0.84, easeInOutCubic));
  const sharedOpacity = sharedHandoff < 0.5 ? localOpacity : 0;
  const bridgeOpacity =
    localOpacity * (1 - resolveWindowProgress(transitionT, 0.58, 0.8, easeInOutCubic));

  const baseCacheBox = {x: 185, y: 314, width: 300, height: 92, radius: 24};
  const basePrecompileBox = {x: 505, y: 314, width: 210, height: 92, radius: 22};
  const cacheBox = {...baseCacheBox, x: baseCacheBox.x + leftLaneShiftX};
  const precompileBox = {
    ...basePrecompileBox,
    x: basePrecompileBox.x + leftLaneShiftX,
  };
  const memoryBox = mixBox(
    PAGE1920_MEMORY_START_BOX,
    PAGE1920_MEMORY_END_BOX,
    sharedTravel,
  );
  const memoryRows = page1920MemoryRows(memoryBox);
  const memoryGlBox = memoryRows.gl;
  const memoryVkBox = memoryRows.vk;
  const memoryMtBox = memoryRows.mt;

  const cacheToPrecompilePoints = [
    {x: right(cacheBox) + 12, y: centerY(cacheBox)},
    {x: precompileBox.x - 12, y: centerY(precompileBox)},
  ];
  const precompileLeadX = right(precompileBox) + 12;
  const precompileToGlPoints = [
    {x: precompileLeadX, y: centerY(memoryGlBox)},
    {x: memoryBox.x - 12, y: centerY(memoryGlBox)},
  ];
  const precompileToVkPoints = [
    {x: precompileLeadX, y: centerY(memoryVkBox)},
    {x: memoryBox.x - 12, y: centerY(memoryVkBox)},
  ];
  const precompileToMtPoints = [
    {x: precompileLeadX, y: centerY(memoryMtBox)},
    {x: memoryBox.x - 12, y: centerY(memoryMtBox)},
  ];

  return (
    <PlaceholderBoardShell opacity={opacity}>
      <g opacity={localOpacity}>
        <g opacity={leftLaneOpacity}>
          <StageBox
            box={cacheBox}
            fill={CARD_FILL}
            stroke={ACCENT}
            strokeWidth={2.8}
          />
          <text
            x={centerX(cacheBox)}
            y={centerY(cacheBox)}
            fill={TEXT}
            fontSize="24"
            fontWeight="780"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            stable.upipelinecache
          </text>

          <StageBox
            box={precompileBox}
            fill={CARD_FILL}
            stroke={NODE_STROKE}
            strokeWidth={2.3}
          />
          <text
            x={centerX(precompileBox)}
            y={centerY(precompileBox)}
            fill={TEXT}
            fontSize="24"
            fontWeight="760"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            预编译
          </text>

          <StrokeArrow
            d={horizontalPath(
              right(cacheBox) + 12,
            precompileBox.x - 12,
            centerY(cacheBox),
          )}
            stroke={ACCENT}
            opacity={leftLaneOpacity}
            headOpacity={revealHeadOpacity(routeReveal, leftLaneOpacity)}
            dashArray={revealDashArray(cacheToPrecompilePoints, routeReveal)}
            tipX={precompileBox.x - 12}
            tipY={centerY(cacheBox)}
            direction="right"
            shaftWidth={2.8}
            underlayWidth={5}
            headSize={8}
          />
        </g>

        <g opacity={sharedOpacity}>
          <StageBox
            box={memoryBox}
            fill={SOFT_FILL}
            stroke={ACCENT}
            strokeWidth={3}
          />
          <text
            x={centerX(memoryBox)}
            y={memoryBox.y + 24}
            fill={TEXT}
            fontSize="26"
            fontWeight="780"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            内存中 PSO
          </text>

          <StageBox
            box={memoryGlBox}
            fill={CARD_FILL}
            stroke={NODE_STROKE}
            strokeWidth={2.4}
          />
          <text
            x={centerX(memoryGlBox)}
            y={centerY(memoryGlBox)}
            fill={TEXT}
            fontSize="20"
            fontWeight="760"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            OpenGL PSO
          </text>

          <StageBox
            box={memoryVkBox}
            fill={CARD_FILL}
            stroke={NODE_STROKE}
            strokeWidth={2.4}
          />
          <text
            x={centerX(memoryVkBox)}
            y={centerY(memoryVkBox)}
            fill={TEXT}
            fontSize="20"
            fontWeight="760"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            Vulkan PSO
          </text>

          <StageBox
            box={memoryMtBox}
            fill={CARD_FILL}
            stroke={NODE_STROKE}
            strokeWidth={2.4}
          />
          <text
            x={centerX(memoryMtBox)}
            y={centerY(memoryMtBox)}
            fill={TEXT}
            fontSize="20"
            fontWeight="780"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            Metal PSO
          </text>
        </g>

        <StrokeArrow
          d={horizontalPath(
            precompileLeadX,
            memoryBox.x - 12,
            centerY(memoryGlBox),
          )}
          stroke={ACCENT}
          opacity={bridgeOpacity}
          headOpacity={revealHeadOpacity(routeReveal, bridgeOpacity)}
          dashArray={revealDashArray(precompileToGlPoints, routeReveal)}
          tipX={memoryBox.x - 12}
          tipY={centerY(memoryGlBox)}
          direction="right"
          shaftWidth={2.5}
          underlayWidth={4.7}
          headSize={7}
        />
        <StrokeArrow
          d={horizontalPath(
            precompileLeadX,
            memoryBox.x - 12,
            centerY(memoryVkBox),
          )}
          stroke={ACCENT}
          opacity={bridgeOpacity}
          headOpacity={revealHeadOpacity(routeReveal, bridgeOpacity)}
          dashArray={revealDashArray(precompileToVkPoints, routeReveal)}
          tipX={memoryBox.x - 12}
          tipY={centerY(memoryVkBox)}
          direction="right"
          shaftWidth={2.5}
          underlayWidth={4.7}
          headSize={7}
        />
        <StrokeArrow
          d={horizontalPath(
            precompileLeadX,
            memoryBox.x - 12,
            centerY(memoryMtBox),
          )}
          stroke={ACCENT}
          opacity={bridgeOpacity}
          headOpacity={revealHeadOpacity(routeReveal, bridgeOpacity)}
          dashArray={revealDashArray(precompileToMtPoints, routeReveal)}
          tipX={memoryBox.x - 12}
          tipY={centerY(memoryMtBox)}
          direction="right"
          shaftWidth={2.5}
          underlayWidth={4.7}
          headSize={7}
        />
      </g>
    </PlaceholderBoardShell>
  );
}

function Page20Placeholder({
  scene,
  opacity,
  entryProgress,
}: {
  scene: SceneModel;
  opacity: number;
  entryProgress: number;
}) {
  const ACCENT = scene.apiStroke;
  const NODE_STROKE = scene.nodeStroke;
  const CARD_FILL = scene.neutralFill;
  const SOFT_FILL = scene.focusFill;
  const TEXT = "#22303d";

  const routeReveal = resolveWindowProgress(entryProgress, 0.12, 0.86, easeOutQuint);
  const transitionT = clamp01(entryProgress);
  const sharedTravel = resolveWindowProgress(transitionT, 0.08, 0.92, easeInOutCubic);
  const rightLaneEnter = resolveWindowProgress(transitionT, 0.18, 0.88, easeInOutCubic);
  const rightLaneShiftX = mix(420, 0, rightLaneEnter);
  const sharedHandoff = resolveWindowProgress(transitionT, 0.46, 0.58, easeInOutCubic);
  const localOpacity = opacity;
  const rightBandOpacity =
    localOpacity * resolveWindowProgress(transitionT, 0.54, 0.72, easeOutQuint);
  const sharedOpacity = sharedHandoff >= 0.5 ? localOpacity : 0;
  const invalidationOpacity =
    rightBandOpacity * resolveWindowProgress(transitionT, 0.66, 0.9, easeOutQuint);

  const memoryBox = mixBox(
    PAGE1920_MEMORY_START_BOX,
    PAGE1920_MEMORY_END_BOX,
    sharedTravel,
  );
  const memoryRows = page1920MemoryRows(memoryBox);
  const memoryGlBox = memoryRows.gl;
  const memoryVkBox = memoryRows.vk;
  const memoryMtBox = memoryRows.mt;
  const apiGlBox = {x: 595 + rightLaneShiftX, y: memoryGlBox.y, width: 200, height: 66, radius: 16};
  const apiVkBox = {x: 595 + rightLaneShiftX, y: memoryVkBox.y, width: 200, height: 66, radius: 16};
  const apiMtBox = {x: 595 + rightLaneShiftX, y: memoryMtBox.y, width: 200, height: 66, radius: 16};
  const fileGlBox = {x: 885 + rightLaneShiftX, y: memoryGlBox.y, width: 200, height: 66, radius: 16};
  const fileVkBox = {x: 885 + rightLaneShiftX, y: memoryVkBox.y, width: 200, height: 66, radius: 16};
  const fileMtBox = {x: 885 + rightLaneShiftX, y: memoryMtBox.y, width: 200, height: 66, radius: 16};
  const invalidationBox = {x: 170, y: 522, width: 940, height: 88, radius: 22};

  const glToApiPoints = [
    {x: right(memoryGlBox) + 12, y: centerY(memoryGlBox)},
    {x: apiGlBox.x - 12, y: centerY(apiGlBox)},
  ];
  const vkToApiPoints = [
    {x: right(memoryVkBox) + 12, y: centerY(memoryVkBox)},
    {x: apiVkBox.x - 12, y: centerY(apiVkBox)},
  ];
  const mtToApiPoints = [
    {x: right(memoryMtBox) + 12, y: centerY(memoryMtBox)},
    {x: apiMtBox.x - 12, y: centerY(apiMtBox)},
  ];
  const apiToGlFilePoints = [
    {x: right(apiGlBox) + 12, y: centerY(apiGlBox)},
    {x: fileGlBox.x - 12, y: centerY(fileGlBox)},
  ];
  const apiToVkFilePoints = [
    {x: right(apiVkBox) + 12, y: centerY(apiVkBox)},
    {x: fileVkBox.x - 12, y: centerY(fileVkBox)},
  ];
  const apiToMtFilePoints = [
    {x: right(apiMtBox) + 12, y: centerY(apiMtBox)},
    {x: fileMtBox.x - 12, y: centerY(fileMtBox)},
  ];

  return (
    <PlaceholderBoardShell opacity={opacity}>
      <g opacity={localOpacity}>
        <g opacity={sharedOpacity}>
          <StageBox
            box={memoryBox}
            fill={SOFT_FILL}
            stroke={ACCENT}
            strokeWidth={3}
          />
          <text
            x={centerX(memoryBox)}
            y={memoryBox.y + 24}
            fill={TEXT}
            fontSize="26"
            fontWeight="780"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            内存中 PSO
          </text>

          <StageBox
            box={memoryGlBox}
            fill={CARD_FILL}
            stroke={NODE_STROKE}
            strokeWidth={2.4}
          />
          <text
            x={centerX(memoryGlBox)}
            y={centerY(memoryGlBox)}
            fill={TEXT}
            fontSize="20"
            fontWeight="760"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            OpenGL PSO
          </text>

          <StageBox
            box={memoryVkBox}
            fill={CARD_FILL}
            stroke={NODE_STROKE}
            strokeWidth={2.4}
          />
          <text
            x={centerX(memoryVkBox)}
            y={centerY(memoryVkBox)}
            fill={TEXT}
            fontSize="20"
            fontWeight="760"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            Vulkan PSO
          </text>

          <StageBox
            box={memoryMtBox}
            fill={CARD_FILL}
            stroke={NODE_STROKE}
            strokeWidth={2.4}
          />
          <text
            x={centerX(memoryMtBox)}
            y={centerY(memoryMtBox)}
            fill={TEXT}
            fontSize="20"
            fontWeight="780"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            Metal PSO
          </text>
        </g>

        <g opacity={rightBandOpacity}>
          <StageBox
            box={apiGlBox}
            fill={CARD_FILL}
            stroke={NODE_STROKE}
            strokeWidth={2.2}
          />
          <text
            x={centerX(apiGlBox)}
            y={centerY(apiGlBox)}
            fill={TEXT}
            fontSize="20"
            fontWeight="760"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            ProgramBinary
          </text>

          <StageBox
            box={apiVkBox}
            fill={CARD_FILL}
            stroke={NODE_STROKE}
            strokeWidth={2.2}
          />
          <text
            x={centerX(apiVkBox)}
            y={centerY(apiVkBox)}
            fill={TEXT}
            fontSize="20"
            fontWeight="760"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            PipelineCache
          </text>

          <StageBox
            box={apiMtBox}
            fill={CARD_FILL}
            stroke={NODE_STROKE}
            strokeWidth={2.2}
          />
          <text
            x={centerX(apiMtBox)}
            y={centerY(apiMtBox)}
            fill={TEXT}
            fontSize="20"
            fontWeight="760"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            系统管理
          </text>

          <StageBox
            box={fileGlBox}
            fill={CARD_FILL}
            stroke={NODE_STROKE}
            strokeWidth={2.4}
          />
          <text
            x={centerX(fileGlBox)}
            y={centerY(fileGlBox)}
            fill={TEXT}
            fontSize="18"
            fontWeight="760"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            ProgramBinaryCache
          </text>

          <StageBox
            box={fileVkBox}
            fill={CARD_FILL}
            stroke={NODE_STROKE}
            strokeWidth={2.4}
          />
          <text
            x={centerX(fileVkBox)}
            y={centerY(fileVkBox)}
            fill={TEXT}
            fontSize="18"
            fontWeight="760"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            VulkanPSO.cache
          </text>

          <StageBox
            box={fileMtBox}
            fill={CARD_FILL}
            stroke={NODE_STROKE}
            strokeWidth={2.4}
          />
          <text
            x={centerX(fileMtBox)}
            y={centerY(fileMtBox)}
            fill={TEXT}
            fontSize="18"
            fontWeight="760"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            functions.data
          </text>

          <g opacity={invalidationOpacity}>
            <StageBox
              box={invalidationBox}
              fill="rgba(255, 244, 233, 0.96)"
              stroke={ACCENT}
              strokeWidth={2.6}
            />
            <text
              x={invalidationBox.x + 18}
              y={invalidationBox.y + 20}
              fill={ACCENT}
              fontSize="17"
              fontWeight="800"
              textAnchor="start"
              dominantBaseline="middle"
            >
              提示：本地 PSO 缓存可能失效
            </text>
            <text
              x={invalidationBox.x + 18}
              y={invalidationBox.y + 44}
              fill="rgba(34, 48, 61, 0.8)"
              fontSize="14"
              fontWeight="700"
              textAnchor="start"
              dominantBaseline="middle"
            >
              常见触发：OS 版本、GPU 驱动版本、芯片代际、图形 API/FeatureLevel、引擎或 Shader 格式版本变化。
            </text>
            <text
              x={invalidationBox.x + 18}
              y={invalidationBox.y + 66}
              fill="rgba(34, 48, 61, 0.8)"
              fontSize="14"
              fontWeight="700"
              textAnchor="start"
              dominantBaseline="middle"
            >
              失效表现：缓存命中下降后触发重新编译，或旧二进制在当前环境不可加载。
            </text>
          </g>

          <StrokeArrow
            d={horizontalPath(
              right(memoryGlBox) + 12,
              apiGlBox.x - 12,
              centerY(memoryGlBox),
            )}
            stroke={ACCENT}
            opacity={rightBandOpacity}
            headOpacity={revealHeadOpacity(routeReveal, rightBandOpacity)}
            dashArray={revealDashArray(glToApiPoints, routeReveal)}
            tipX={apiGlBox.x - 12}
            tipY={centerY(memoryGlBox)}
            direction="right"
            shaftWidth={2.8}
            underlayWidth={5}
            headSize={8}
          />
          <StrokeArrow
            d={horizontalPath(
              right(memoryVkBox) + 12,
              apiVkBox.x - 12,
              centerY(memoryVkBox),
            )}
            stroke={ACCENT}
            opacity={rightBandOpacity}
            headOpacity={revealHeadOpacity(routeReveal, rightBandOpacity)}
            dashArray={revealDashArray(vkToApiPoints, routeReveal)}
            tipX={apiVkBox.x - 12}
            tipY={centerY(memoryVkBox)}
            direction="right"
            shaftWidth={2.8}
            underlayWidth={5}
            headSize={8}
          />
          <StrokeArrow
            d={horizontalPath(
              right(memoryMtBox) + 12,
              apiMtBox.x - 12,
              centerY(memoryMtBox),
            )}
            stroke={ACCENT}
            opacity={rightBandOpacity}
            headOpacity={revealHeadOpacity(routeReveal, rightBandOpacity)}
            dashArray={revealDashArray(mtToApiPoints, routeReveal)}
            tipX={apiMtBox.x - 12}
            tipY={centerY(memoryMtBox)}
            direction="right"
            shaftWidth={2.8}
            underlayWidth={5}
            headSize={8}
          />
          <StrokeArrow
            d={horizontalPath(
              right(apiGlBox) + 12,
              fileGlBox.x - 12,
              centerY(apiGlBox),
            )}
            stroke={ACCENT}
            opacity={rightBandOpacity}
            headOpacity={revealHeadOpacity(routeReveal, rightBandOpacity)}
            dashArray={revealDashArray(apiToGlFilePoints, routeReveal)}
            tipX={fileGlBox.x - 12}
            tipY={centerY(apiGlBox)}
            direction="right"
            shaftWidth={2.8}
            underlayWidth={5}
            headSize={8}
          />
          <StrokeArrow
            d={horizontalPath(
              right(apiVkBox) + 12,
              fileVkBox.x - 12,
              centerY(apiVkBox),
            )}
            stroke={ACCENT}
            opacity={rightBandOpacity}
            headOpacity={revealHeadOpacity(routeReveal, rightBandOpacity)}
            dashArray={revealDashArray(apiToVkFilePoints, routeReveal)}
            tipX={fileVkBox.x - 12}
            tipY={centerY(apiVkBox)}
            direction="right"
            shaftWidth={2.8}
            underlayWidth={5}
            headSize={8}
          />
          <StrokeArrow
            d={horizontalPath(
              right(apiMtBox) + 12,
              fileMtBox.x - 12,
              centerY(apiMtBox),
            )}
            stroke={ACCENT}
            opacity={rightBandOpacity}
            headOpacity={revealHeadOpacity(routeReveal, rightBandOpacity)}
            dashArray={revealDashArray(apiToMtFilePoints, routeReveal)}
            tipX={fileMtBox.x - 12}
            tipY={centerY(apiMtBox)}
            direction="right"
            shaftWidth={2.8}
            underlayWidth={5}
            headSize={8}
          />
        </g>
      </g>
    </PlaceholderBoardShell>
  );
}

function Page21Placeholder({
  scene,
  opacity,
  entryProgress,
}: {
  scene: SceneModel;
  opacity: number;
  entryProgress: number;
}) {
  const routeReveal = resolveWindowProgress(entryProgress, 0.18, 0.84, easeOutQuint);
  const compressionBox = {x: 190, y: 302, width: 294, height: 94, radius: 24};
  const decompressBox = {x: 535, y: 302, width: 210, height: 94, radius: 24};
  const compileBox = {x: 798, y: 302, width: 294, height: 94, radius: 24};
  const ioPanel = {x: 236, y: 444, width: 330, height: 112, radius: 22};
  const cpuPanel = {x: 714, y: 444, width: 330, height: 112, radius: 22};
  const compressionToDecompress = [
    {x: right(compressionBox) + 12, y: centerY(compressionBox)},
    {x: decompressBox.x - 12, y: centerY(decompressBox)},
  ];
  const decompressToCompile = [
    {x: right(decompressBox) + 12, y: centerY(decompressBox)},
    {x: compileBox.x - 12, y: centerY(compileBox)},
  ];

  return (
    <PlaceholderBoardShell opacity={opacity}>
      <text
        x={centerX(PLACEHOLDER_BOARD)}
        y="126"
        fill={scene.apiStroke}
        fontSize="34"
        fontWeight="800"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        优化方向 1：Code 压缩取舍
      </text>
      <FloatingPill
        scene={scene}
        box={compressionBox}
        label="Compressed Code"
        opacity={opacity}
        accent
      />
      <FloatingPill
        scene={scene}
        box={decompressBox}
        label="Decompress"
        opacity={opacity}
      />
      <FloatingPill
        scene={scene}
        box={compileBox}
        label="Compile / Load"
        opacity={opacity}
        accent
      />
      <NotePanel
        scene={scene}
        box={ioPanel}
        title="+ IO / 包体收益"
        lines={["压缩后体积更小", "下载与磁盘压力下降"]}
        opacity={opacity}
      />
      <NotePanel
        scene={scene}
        box={cpuPanel}
        title="- CPU / 带宽成本"
        lines={["解压抢启动 CPU", "内存带宽会被占用"]}
        opacity={opacity}
        accent
      />
      <text
        x={centerX(PLACEHOLDER_BOARD)}
        y={600}
        fill="rgba(34, 48, 61, 0.72)"
        fontSize="20"
        fontWeight="720"
        textAnchor="middle"
        dominantBaseline="middle"
        opacity={opacity}
      >
        先看瓶颈：IO 还是 CPU，再决定要不要卸掉压缩
      </text>
      <StrokeArrow
        d={horizontalPath(
          right(compressionBox) + 12,
          decompressBox.x - 12,
          centerY(compressionBox),
        )}
        stroke={scene.apiStroke}
        opacity={opacity}
        headOpacity={revealHeadOpacity(routeReveal, opacity)}
        dashArray={revealDashArray(compressionToDecompress, routeReveal)}
        tipX={decompressBox.x - 12}
        tipY={centerY(compressionBox)}
        direction="right"
        shaftWidth={2.8}
        underlayWidth={5}
        headSize={8}
      />
      <StrokeArrow
        d={horizontalPath(
          right(decompressBox) + 12,
          compileBox.x - 12,
          centerY(decompressBox),
        )}
        stroke={scene.apiStroke}
        opacity={opacity}
        headOpacity={revealHeadOpacity(routeReveal, opacity)}
        dashArray={revealDashArray(decompressToCompile, routeReveal)}
        tipX={compileBox.x - 12}
        tipY={centerY(decompressBox)}
        direction="right"
        shaftWidth={2.8}
        underlayWidth={5}
        headSize={8}
      />
    </PlaceholderBoardShell>
  );
}

function Page22Placeholder({
  scene,
  opacity,
  entryProgress,
}: {
  scene: SceneModel;
  opacity: number;
  entryProgress: number;
}) {
  const routeReveal = resolveWindowProgress(entryProgress, 0.2, 0.86, easeOutQuint);
  const cacheCore = {x: 526, y: 292, width: 228, height: 96, radius: 24};
  const lruCard = {x: 210, y: 196, width: 262, height: 124, radius: 22};
  const lfuCard = {x: 210, y: 402, width: 262, height: 124, radius: 22};
  const mmapCard = {x: 808, y: 196, width: 262, height: 124, radius: 22};
  const ringCard = {x: 808, y: 402, width: 262, height: 124, radius: 22};
  const coreToLru = [
    {x: cacheCore.x - 10, y: centerY(cacheCore) - 18},
    {x: right(lruCard) + 10, y: centerY(lruCard)},
  ];
  const coreToLfu = [
    {x: cacheCore.x - 10, y: centerY(cacheCore) + 18},
    {x: right(lfuCard) + 10, y: centerY(lfuCard)},
  ];
  const coreToMmap = [
    {x: right(cacheCore) + 10, y: centerY(cacheCore) - 18},
    {x: mmapCard.x - 10, y: centerY(mmapCard)},
  ];
  const coreToRing = [
    {x: right(cacheCore) + 10, y: centerY(cacheCore) + 18},
    {x: ringCard.x - 10, y: centerY(ringCard)},
  ];

  return (
    <PlaceholderBoardShell opacity={opacity}>
      <text
        x={centerX(PLACEHOLDER_BOARD)}
        y="126"
        fill={scene.apiStroke}
        fontSize="34"
        fontWeight="800"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        优化方向 2：BCache 基础策略
      </text>
      <FloatingPill
        scene={scene}
        box={cacheCore}
        label="BCache"
        opacity={opacity}
        accent
      />
      <FloatingCard
        scene={scene}
        box={lruCard}
        title="LRU / LFU"
        lines={["决定热数据保留", "控制淘汰节奏"]}
        opacity={opacity}
      />
      <FloatingCard
        scene={scene}
        box={mmapCard}
        title="mmap"
        lines={["按需映射读取", "减少中间拷贝"]}
        opacity={opacity}
      />
      <FloatingCard
        scene={scene}
        box={lfuCard}
        title="Hit Model"
        lines={["命中率优先", "避免盲目扩容"]}
        opacity={opacity}
      />
      <FloatingCard
        scene={scene}
        box={ringCard}
        title="circular / ring"
        lines={["顺序写更友好", "回收与覆盖可控"]}
        opacity={opacity}
      />
      <text
        x={centerX(PLACEHOLDER_BOARD)}
        y={600}
        fill="rgba(34, 48, 61, 0.72)"
        fontSize="20"
        fontWeight="720"
        textAnchor="middle"
        dominantBaseline="middle"
        opacity={opacity}
      >
        本质：用空间换 IO，但要让策略匹配访问形态
      </text>
      <StrokeArrow
        d={roundedPolylinePath(coreToLru)}
        stroke={scene.apiStroke}
        opacity={opacity}
        headOpacity={revealHeadOpacity(routeReveal, opacity)}
        dashArray={revealDashArray(coreToLru, routeReveal)}
        tipX={right(lruCard) + 10}
        tipY={centerY(lruCard)}
        direction="left"
        shaftWidth={2.8}
        underlayWidth={5}
        headSize={8}
      />
      <StrokeArrow
        d={roundedPolylinePath(coreToLfu)}
        stroke={scene.apiStroke}
        opacity={opacity}
        headOpacity={revealHeadOpacity(routeReveal, opacity)}
        dashArray={revealDashArray(coreToLfu, routeReveal)}
        tipX={right(lfuCard) + 10}
        tipY={centerY(lfuCard)}
        direction="left"
        shaftWidth={2.8}
        underlayWidth={5}
        headSize={8}
      />
      <StrokeArrow
        d={roundedPolylinePath(coreToMmap)}
        stroke={scene.apiStroke}
        opacity={opacity}
        headOpacity={revealHeadOpacity(routeReveal, opacity)}
        dashArray={revealDashArray(coreToMmap, routeReveal)}
        tipX={mmapCard.x - 10}
        tipY={centerY(mmapCard)}
        direction="right"
        shaftWidth={2.8}
        underlayWidth={5}
        headSize={8}
      />
      <StrokeArrow
        d={roundedPolylinePath(coreToRing)}
        stroke={scene.apiStroke}
        opacity={opacity}
        headOpacity={revealHeadOpacity(routeReveal, opacity)}
        dashArray={revealDashArray(coreToRing, routeReveal)}
        tipX={ringCard.x - 10}
        tipY={centerY(ringCard)}
        direction="right"
        shaftWidth={2.8}
        underlayWidth={5}
        headSize={8}
      />
    </PlaceholderBoardShell>
  );
}

function Page23Placeholder({
  scene,
  opacity,
  entryProgress,
}: {
  scene: SceneModel;
  opacity: number;
  entryProgress: number;
}) {
  const routeReveal = resolveWindowProgress(entryProgress, 0.2, 0.88, easeOutQuint);
  const queueBox = {x: 164, y: 304, width: 252, height: 96, radius: 24};
  const workersBox = {x: 488, y: 188, width: 300, height: 124, radius: 24};
  const maskBox = {x: 488, y: 392, width: 300, height: 124, radius: 24};
  const outputBox = {x: 864, y: 304, width: 252, height: 96, radius: 24};
  const queueToWorkers = [
    {x: right(queueBox) + 10, y: centerY(queueBox) - 18},
    {x: workersBox.x - 12, y: centerY(workersBox)},
  ];
  const queueToMask = [
    {x: right(queueBox) + 10, y: centerY(queueBox) + 18},
    {x: maskBox.x - 12, y: centerY(maskBox)},
  ];
  const workersToOutput = [
    {x: right(workersBox) + 12, y: centerY(workersBox)},
    {x: outputBox.x - 12, y: centerY(outputBox) - 16},
  ];
  const maskToOutput = [
    {x: right(maskBox) + 12, y: centerY(maskBox)},
    {x: outputBox.x - 12, y: centerY(outputBox) + 16},
  ];

  return (
    <PlaceholderBoardShell opacity={opacity}>
      <text
        x={centerX(PLACEHOLDER_BOARD)}
        y="126"
        fill={scene.apiStroke}
        fontSize="34"
        fontWeight="800"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        优化方向 3：编译加速
      </text>
      <FloatingPill
        scene={scene}
        box={queueBox}
        label="Compile Queue"
        opacity={opacity}
      />
      <FloatingCard
        scene={scene}
        box={workersBox}
        title="Multi-thread"
        lines={["并行 worker 提升吞吐", "任务粒度要可控"]}
        opacity={opacity}
        accent
      />
      <FloatingCard
        scene={scene}
        box={maskBox}
        title="UsageMask"
        lines={["按使用场景分桶", "减少可编译集合"]}
        opacity={opacity}
      />
      <FloatingPill
        scene={scene}
        box={outputBox}
        label="Reduced Compile Set"
        opacity={opacity}
        accent
      />
      <text
        x={centerX(PLACEHOLDER_BOARD)}
        y={600}
        fill="rgba(34, 48, 61, 0.72)"
        fontSize="20"
        fontWeight="720"
        textAnchor="middle"
        dominantBaseline="middle"
        opacity={opacity}
      >
        先减集合，再并行，通常更稳
      </text>
      <StrokeArrow
        d={roundedPolylinePath(queueToWorkers)}
        stroke={scene.apiStroke}
        opacity={opacity}
        headOpacity={revealHeadOpacity(routeReveal, opacity)}
        dashArray={revealDashArray(queueToWorkers, routeReveal)}
        tipX={workersBox.x - 12}
        tipY={centerY(workersBox)}
        direction="right"
        shaftWidth={2.8}
        underlayWidth={5}
        headSize={8}
      />
      <StrokeArrow
        d={roundedPolylinePath(queueToMask)}
        stroke={scene.apiStroke}
        opacity={opacity}
        headOpacity={revealHeadOpacity(routeReveal, opacity)}
        dashArray={revealDashArray(queueToMask, routeReveal)}
        tipX={maskBox.x - 12}
        tipY={centerY(maskBox)}
        direction="right"
        shaftWidth={2.8}
        underlayWidth={5}
        headSize={8}
      />
      <StrokeArrow
        d={roundedPolylinePath(workersToOutput)}
        stroke={scene.apiStroke}
        opacity={opacity}
        headOpacity={revealHeadOpacity(routeReveal, opacity)}
        dashArray={revealDashArray(workersToOutput, routeReveal)}
        tipX={outputBox.x - 12}
        tipY={centerY(outputBox) - 16}
        direction="right"
        shaftWidth={2.8}
        underlayWidth={5}
        headSize={8}
      />
      <StrokeArrow
        d={roundedPolylinePath(maskToOutput)}
        stroke={scene.apiStroke}
        opacity={opacity}
        headOpacity={revealHeadOpacity(routeReveal, opacity)}
        dashArray={revealDashArray(maskToOutput, routeReveal)}
        tipX={outputBox.x - 12}
        tipY={centerY(outputBox) + 16}
        direction="right"
        shaftWidth={2.8}
        underlayWidth={5}
        headSize={8}
      />
    </PlaceholderBoardShell>
  );
}

function Page24Placeholder({
  scene,
  opacity,
  entryProgress,
}: {
  scene: SceneModel;
  opacity: number;
  entryProgress: number;
}) {
  const routeReveal = resolveWindowProgress(entryProgress, 0.2, 0.86, easeOutQuint);
  const openglCard = {x: 180, y: 180, width: 390, height: 348, radius: 26};
  const metalCard = {x: 710, y: 180, width: 390, height: 348, radius: 26};
  const stateBridge = {x: 580, y: 312, width: 120, height: 84, radius: 22};
  const takeaway = {x: 214, y: 560, width: 852, height: 54, radius: 18};
  const glToBridge = [
    {x: right(openglCard) + 12, y: centerY(openglCard)},
    {x: stateBridge.x - 12, y: centerY(stateBridge)},
  ];
  const bridgeToMetal = [
    {x: right(stateBridge) + 12, y: centerY(stateBridge)},
    {x: metalCard.x - 12, y: centerY(metalCard)},
  ];

  return (
    <PlaceholderBoardShell opacity={opacity}>
      <text
        x={centerX(PLACEHOLDER_BOARD)}
        y="126"
        fill={scene.apiStroke}
        fontSize="34"
        fontWeight="800"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        优化方向 4：Metal vs OpenGL 差异来源
      </text>
      <FloatingCard
        scene={scene}
        box={openglCard}
        title="OpenGL PSO"
        lines={[
          "更多驱动侧隐式状态",
          "统计口径常更收敛",
          "状态来源更偏运行期托管",
        ]}
        opacity={opacity}
      />
      <FloatingCard
        scene={scene}
        box={metalCard}
        title="Metal PSO"
        lines={[
          "更多显式状态组合",
          "状态变化更直接可见",
          "编译数量更受组合影响",
        ]}
        opacity={opacity}
        accent
      />
      <FloatingPill
        scene={scene}
        box={stateBridge}
        label="State Source"
        opacity={opacity}
        accent
      />
      <NotePanel
        scene={scene}
        box={takeaway}
        title="结论"
        lines={["差异来自状态来源与显式程度，而不是 API 的单一优劣判断。"]}
        opacity={opacity}
      />
      <StrokeArrow
        d={roundedPolylinePath(glToBridge)}
        stroke={scene.apiStroke}
        opacity={opacity}
        headOpacity={revealHeadOpacity(routeReveal, opacity)}
        dashArray={revealDashArray(glToBridge, routeReveal)}
        tipX={stateBridge.x - 12}
        tipY={centerY(stateBridge)}
        direction="right"
        shaftWidth={2.8}
        underlayWidth={5}
        headSize={8}
      />
      <StrokeArrow
        d={roundedPolylinePath(bridgeToMetal)}
        stroke={scene.apiStroke}
        opacity={opacity}
        headOpacity={revealHeadOpacity(routeReveal, opacity)}
        dashArray={revealDashArray(bridgeToMetal, routeReveal)}
        tipX={metalCard.x - 12}
        tipY={centerY(metalCard)}
        direction="right"
        shaftWidth={2.8}
        underlayWidth={5}
        headSize={8}
      />
    </PlaceholderBoardShell>
  );
}

export function Page10Scene({scene}: {scene: SceneModel}) {
  const frame = scene.frame;
  const introProgress = scene.settledPage910Progress ?? 0;
  const page11Reveal = scene.settledPage1011Progress ?? 0;
  const page12Reveal = scene.settledPage1112Progress ?? 0;
  const page13Reveal = scene.settledPage1213Progress ?? 0;
  const page14PlaceholderReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE13_FRAME,
    LOOP_PAGE14_FRAME,
  );
  const page15Reveal = settledSegmentProgress(
    frame,
    LOOP_PAGE14_FRAME,
    LOOP_PAGE15_FRAME,
  );
  const page16PlaceholderReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE15_FRAME,
    LOOP_PAGE16_FRAME,
  );
  const page17PlaceholderReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE16_FRAME,
    LOOP_PAGE17_FRAME,
  );
  const page18Reveal = settledSegmentProgress(
    frame,
    LOOP_PAGE17_FRAME,
    LOOP_PAGE18_FRAME,
  );
  const page19PlaceholderReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE18_FRAME,
    LOOP_PAGE19_FRAME,
  );
  const page20PlaceholderReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE19_FRAME,
    LOOP_PAGE20_FRAME,
  );
  const page21PlaceholderReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE20_FRAME,
    LOOP_PAGE21_FRAME,
  );
  const page22PlaceholderReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE21_FRAME,
    LOOP_PAGE22_FRAME,
  );
  const page23PlaceholderReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE22_FRAME,
    LOOP_PAGE23_FRAME,
  );
  const page24PlaceholderReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE23_FRAME,
    LOOP_PAGE24_FRAME,
  );
  const page14PlaceholderVisible = resolveWindowProgress(
    page14PlaceholderReveal,
    0.08,
    0.84,
    easeInOutCubic,
  );
  const page16PlaceholderVisible = resolveWindowProgress(
    page16PlaceholderReveal,
    0.08,
    0.82,
    easeInOutCubic,
  );
  const page17PlaceholderVisible = resolveWindowProgress(
    page17PlaceholderReveal,
    0.16,
    0.78,
    easeInOutCubic,
  );
  const page19PlaceholderVisible = resolveWindowProgress(
    page19PlaceholderReveal,
    0.22,
    0.86,
    easeInOutCubic,
  );
  const page20PlaceholderVisible = resolveWindowProgress(
    page20PlaceholderReveal,
    0.08,
    0.88,
    easeInOutCubic,
  );
  const page21PlaceholderVisible = resolveWindowProgress(
    page21PlaceholderReveal,
    0.08,
    0.88,
    easeInOutCubic,
  );
  const page22PlaceholderVisible = resolveWindowProgress(
    page22PlaceholderReveal,
    0.08,
    0.88,
    easeInOutCubic,
  );
  const page23PlaceholderVisible = resolveWindowProgress(
    page23PlaceholderReveal,
    0.08,
    0.88,
    easeInOutCubic,
  );
  const page24PlaceholderVisible = resolveWindowProgress(
    page24PlaceholderReveal,
    0.08,
    0.88,
    easeInOutCubic,
  );
  const page14OverlayExit = 1 - resolveWindowProgress(page15Reveal, 0, 0.12, easeInOutCubic);
  const page17CarrierVisible = page17PlaceholderVisible > 0.5 ? 1 : 0;
  const page16OverlayExit = 1 - page17CarrierVisible;
  const page17OverlayExit =
    1 - resolveWindowProgress(page18Reveal, 0.56, 0.9, easeInOutCubic);
  const page14PlaceholderFocus = page14PlaceholderVisible * page14OverlayExit;
  const page16PlaceholderFocus = page16PlaceholderVisible * page16OverlayExit;
  const page17PlaceholderFocus = page17CarrierVisible * page17OverlayExit;
  const page19PlaceholderFocus = page19PlaceholderVisible;
  const page20OverlayExit =
    1 - resolveWindowProgress(page21PlaceholderReveal, 0.08, 0.3, easeInOutCubic);
  const page21OverlayExit =
    1 - resolveWindowProgress(page22PlaceholderReveal, 0.08, 0.3, easeInOutCubic);
  const page22OverlayExit =
    1 - resolveWindowProgress(page23PlaceholderReveal, 0.08, 0.3, easeInOutCubic);
  const page23OverlayExit =
    1 - resolveWindowProgress(page24PlaceholderReveal, 0.08, 0.3, easeInOutCubic);
  const page20PlaceholderFocus = page20PlaceholderVisible * page20OverlayExit;
  const page21PlaceholderFocus = page21PlaceholderVisible * page21OverlayExit;
  const page22PlaceholderFocus = page22PlaceholderVisible * page22OverlayExit;
  const page23PlaceholderFocus = page23PlaceholderVisible * page23OverlayExit;
  const page24PlaceholderFocus = page24PlaceholderVisible;

  const callbackExit = resolveWindowProgress(page11Reveal, 0.1, 0.34, easeInOutCubic);
  const callbackOpacity = 1 - callbackExit;
  const recallReveal = resolveWindowProgress(introProgress, 0.3, 0.64, easeInOutCubic);
  const callbackMergeProgress = resolveWindowProgress(introProgress, 0.72, 0.98, easeInOutCubic);
  const callbackWorldOpacity = callbackOpacity * recallReveal;
  const callbackLegacyAssetFade = resolveWindowProgress(
    introProgress,
    0.985,
    1,
    easeInOutCubic,
  );
  const callbackLegacyAssetOpacity =
    callbackWorldOpacity * (1 - callbackLegacyAssetFade);
  const callbackShaderLibraryReveal = resolveWindowProgress(
    introProgress,
    0.74,
    0.9,
    easeOutQuint,
  );
  const callbackShaderLibraryOpacity =
    callbackOpacity * Math.max(callbackMergeProgress, callbackShaderLibraryReveal);
  const questionTravelProgress = resolveWindowProgress(
    introProgress,
    0.42,
    0.72,
    easeInOutCubic,
  );
  const questionOpacity =
    resolveWindowProgress(introProgress, 0.18, 0.32, easeOutQuint) *
    (1 - resolveWindowProgress(introProgress, 0.72, 0.82, easeInOutCubic));
  const answerOpacity =
    resolveWindowProgress(introProgress, 0.62, 0.72, easeOutQuint) *
    (1 - resolveWindowProgress(introProgress, 0.84, 0.92, easeInOutCubic));
  const deviceReveal = resolveWindowProgress(page11Reveal, 0.12, 0.42, easeInOutCubic);
  const stageContentReveal = page11Reveal > 0.001 ? 1 : 0;
  const stableBuildReveal = resolveWindowProgress(page18Reveal, 0.44, 0.72, easeInOutCubic);
  const stableReturnReveal = resolveWindowProgress(page18Reveal, 0.8, 0.98, easeInOutCubic);
  const answerScale = mix(
    0.88,
    1.16,
    easeOutQuint(resolveWindowProgress(introProgress, 0.62, 0.72)),
  );
  const questionScale = mix(1.18, 1.02, easeInOutCubic(questionTravelProgress));
  const callbackShaderLibraryBox = scene.sharedUpperRightBox;
  const callbackShaderLibraryScale = mix(
    0.9,
    1,
    easeOutQuint(callbackShaderLibraryReveal),
  );
  const callbackShaderLibraryTransform = `translate(${centerX(callbackShaderLibraryBox)} ${centerY(callbackShaderLibraryBox)}) scale(${callbackShaderLibraryScale}) translate(${-centerX(callbackShaderLibraryBox)} ${-centerY(callbackShaderLibraryBox)})`;
  const callbackRuntimeExit = resolveWindowProgress(
    page11Reveal,
    0.02,
    0.16,
    easeInOutCubic,
  );
  const callbackRuntimeOpacity = callbackWorldOpacity * (1 - callbackRuntimeExit);
  const page11BridgeProgress = resolveWindowProgress(page11Reveal, 0.02, 0.78);
  const page11BridgeBox = mixBox(
    callbackShaderLibraryBox,
    BYTECODE_BOX,
    page11BridgeProgress,
  );
  const page11BridgeExit = resolveWindowProgress(
    page14PlaceholderReveal,
    0.06,
    0.24,
    easeInOutCubic,
  );
  const page11BridgeOpacity = stageContentReveal * (1 - page11BridgeExit);
  const page11BridgeVisible = page11BridgeOpacity > 0.001;
  const page11BridgeShowsShaderLibrary = page11Reveal < 0.08;
  const page11BridgeShowsBytecode = page11Reveal >= 0.08;
  const callbackMaterialMetrics = mergeTowardBoxMetrics(
    scene.sharedUpperLeftBox,
    callbackShaderLibraryBox,
    callbackMergeProgress,
    0.42,
  );
  const callbackSourceLinkFade = resolveWindowProgress(
    callbackMergeProgress,
    0.45,
    0.95,
    easeInOutCubic,
  );
  const callbackSourceLinkOpacity =
    callbackLegacyAssetOpacity * (1 - callbackSourceLinkFade);
  const runtimeBridgeProgress = resolveWindowProgress(
    page11Reveal,
    0,
    0.8,
    easeInOutCubic,
  );
  const runtimeBridgeVisible = stageContentReveal > 0.001;
  const runtimeBridgeOpacity = stageContentReveal;
  const runtimeBridgeBoxVisible = page11Reveal > 0.001 && page11Reveal < 0.58;
  const runtimeBridgeBoxOpacity = runtimeBridgeBoxVisible ? 1 : 0;
  const runtimeBridgeLeftBox = mixBox(
    scene.leftBox,
    PHONE_VERTEX_BRIDGE_BOX,
    runtimeBridgeProgress,
  );
  const runtimeBridgeCenterBox = mixBox(
    scene.centerBox,
    PHONE_GPU_BRIDGE_BOX,
    runtimeBridgeProgress,
  );
  const runtimeBridgeRightBox = mixBox(
    scene.rightBox,
    PHONE_PIXELS_BRIDGE_BOX,
    runtimeBridgeProgress,
  );
  const runtimeVertexCenter = mixPoint(
    {x: scene.leftCenterX, y: scene.page5VertexIconY},
    PHONE_VERTEX_CENTER,
    runtimeBridgeProgress,
  );
  const runtimeGpuCenter = mixPoint(
    {x: scene.centerCenterX, y: scene.centerTextY},
    PHONE_GPU,
    runtimeBridgeProgress,
  );
  const runtimePixelsCenter = mixPoint(
    {x: scene.pixelGridX + 30, y: scene.pixelGridY + 30},
    {x: PHONE_PIXELS.x + 30, y: PHONE_PIXELS.y + 30},
    runtimeBridgeProgress,
  );
  const runtimeBridgeLinkLeftPoints = [
    mixPoint(
      {
        x: scene.leftBox.x + scene.leftBox.width + scene.arrowStartGap,
        y: scene.axisY,
      },
      {x: runtimeVertexCenter.x, y: runtimeVertexCenter.y + 28},
      runtimeBridgeProgress,
    ),
    mixPoint(
      {
        x:
          scene.leftBox.x +
          scene.leftBox.width +
          (scene.centerBox.x - (scene.leftBox.x + scene.leftBox.width)) / 2,
        y: scene.axisY,
      },
      {
        x: runtimeGpuCenter.x,
        y: (runtimeVertexCenter.y + 28 + (runtimeGpuCenter.y - 36)) / 2,
      },
      runtimeBridgeProgress,
    ),
    mixPoint(
      {x: scene.centerBox.x - scene.arrowEndGap, y: scene.axisY},
      {x: runtimeGpuCenter.x, y: runtimeGpuCenter.y - 36},
      runtimeBridgeProgress,
    ),
  ];
  const runtimeBridgeLinkRightPoints = [
    mixPoint(
      {
        x: scene.centerBox.x + scene.centerBox.width + scene.arrowStartGap,
        y: scene.axisY,
      },
      {x: runtimeGpuCenter.x, y: runtimeGpuCenter.y + 22},
      runtimeBridgeProgress,
    ),
    mixPoint(
      {
        x:
          scene.centerBox.x +
          scene.centerBox.width +
          (scene.rightBox.x - (scene.centerBox.x + scene.centerBox.width)) / 2,
        y: scene.axisY,
      },
      {
        x: runtimePixelsCenter.x,
        y: (runtimeGpuCenter.y + 22 + (runtimePixelsCenter.y - 38)) / 2,
      },
      runtimeBridgeProgress,
    ),
    mixPoint(
      {x: scene.rightBox.x - scene.arrowEndGap, y: scene.axisY},
      {x: runtimePixelsCenter.x, y: runtimePixelsCenter.y - 38},
      runtimeBridgeProgress,
    ),
  ];

  const page11Focus = page11Reveal * (1 - page12Reveal);
  const page12Focus = page12Reveal * (1 - page13Reveal);
  const page13Focus = page13Reveal * (1 - page14PlaceholderReveal);
  const page15Focus = page15Reveal * (1 - page16PlaceholderVisible);
  const page18Focus = page18Reveal * (1 - page19PlaceholderVisible);
  const placeholderFocus = Math.max(
    page14PlaceholderFocus,
    page16PlaceholderFocus,
    page17PlaceholderFocus,
    page19PlaceholderFocus,
    page20PlaceholderFocus,
    page21PlaceholderFocus,
    page22PlaceholderFocus,
    page23PlaceholderFocus,
    page24PlaceholderFocus,
  );
  const placeholderStageFade = resolveWindowProgress(
    placeholderFocus,
    0.72,
    0.98,
    easeInOutCubic,
  );
  const onepageHold = Math.max(
    page16PlaceholderFocus,
    page17PlaceholderFocus,
    page19PlaceholderFocus,
    page20PlaceholderFocus,
    page21PlaceholderFocus,
    page22PlaceholderFocus,
    page23PlaceholderFocus,
    page24PlaceholderFocus,
  );
  const onepageStageSuppression = resolveWindowProgress(
    onepageHold,
    0.001,
    0.12,
    easeInOutCubic,
  );
  const placeholderStageScale = mix(1, 0.94, placeholderStageFade);
  const placeholderStageOpacity =
    (1 - placeholderStageFade) * (1 - onepageStageSuppression);
  const placeholderStageTransform = `translate(640 360) scale(${placeholderStageScale}) translate(-640 -360)`;

  const computerScalePhase12 = mix(1, 1.08, easeInOutCubic(page12Reveal));
  const computerScalePhase13 = mix(computerScalePhase12, 0.94, easeInOutCubic(page13Reveal));
  const computerScalePhase15 = mix(computerScalePhase13, 0.92, easeInOutCubic(page15Reveal));
  const computerScale = mix(computerScalePhase15, 1.08, easeInOutCubic(stableBuildReveal));

  const phoneScalePhase12 = mix(1, 0.92, easeInOutCubic(page12Reveal));
  const phoneScalePhase13 = mix(phoneScalePhase12, 1.08, easeInOutCubic(page13Reveal));
  const phoneScalePhase15 = mix(phoneScalePhase13, 1.12, easeInOutCubic(page15Reveal));
  const phoneScale = mix(phoneScalePhase15, 1.1, easeInOutCubic(stableReturnReveal));

  const baseNodeOpacity = stageContentReveal;
  const page16HandoffIn = resolveWindowProgress(
    page16PlaceholderReveal,
    0.04,
    0.46,
    easeInOutCubic,
  );
  const page16HandoffOut = resolveWindowProgress(
    page17PlaceholderReveal,
    0.06,
    0.34,
    easeInOutCubic,
  );
  const page16SemanticHandoff = 1 - page16HandoffIn * (1 - page16HandoffOut);
  const bytecodeBaseOpacity =
    stageContentReveal *
    page13Reveal;
  const stableContextFade = 1;
  const sclNodeOpacity =
    stageContentReveal * page12Reveal * stableContextFade * page16SemanticHandoff;
  const cookEdgeOpacity =
    stageContentReveal * page12Reveal * stableContextFade;
  const bytecodeToPhoneOpacity =
    stageContentReveal *
    page13Reveal;
  const recRouteReveal = resolveWindowProgress(page15Reveal, 0.4, 0.92, easeOutQuint);
  const stableBandReveal = resolveWindowProgress(page18Reveal, 0.52, 0.78, easeOutQuint);
  const stableMergeReveal = resolveWindowProgress(page18Reveal, 0.68, 0.9, easeOutQuint);
  const stablePcStageReturnProgress = resolveWindowProgress(
    page18Reveal,
    0.42,
    0.9,
    easeInOutCubic,
  );
  const stableReturnRouteReveal = resolveWindowProgress(
    page18Reveal,
    0.88,
    0.98,
    easeOutQuint,
  );
  const recOpacity =
    stageContentReveal *
    recRouteReveal *
    page16SemanticHandoff;
  const recGeometryVisible =
    stageContentReveal > 0.001 &&
    (page14PlaceholderReveal > 0.001 || page15Reveal > 0.001);
  const recGeometryOpacity =
    page15Reveal > 0.001
      ? recOpacity
      : stageContentReveal * page14PlaceholderFocus * 0.001;
  const stableBandOpacity = stageContentReveal * stableBuildReveal;
  const stableMergeOpacity = stageContentReveal * stableMergeReveal;
  const stableToPhoneOpacity = stageContentReveal * stableReturnReveal;
  const stageStablePcBox = mixBox(
    PAGE17_STABLE_PC_TARGET_BOX,
    STABLE_PC_BOX,
    stablePcStageReturnProgress,
  );
  const recPhoneToRecPoints = [
    {x: centerX(PHONE_BOX), y: PHONE_BOX.y - 8},
    {x: centerX(PHONE_BOX), y: centerY(REC_BOX)},
    {x: right(REC_BOX) + 12, y: centerY(REC_BOX)},
  ];
  const recToComputerPoints = [
    {x: REC_BOX.x - 12, y: centerY(REC_BOX)},
    {x: centerX(COMPUTER_BOX), y: centerY(REC_BOX)},
    {x: centerX(COMPUTER_BOX), y: COMPUTER_BOX.y - 8},
  ];
  const stableExpandToMergePoints = [
    {x: right(COMPUTER_BOX) + 18, y: PAGE15_EXPAND_MERGE_CENTER.y},
    {x: PAGE15_EXPAND_MERGE_CENTER.x - 18, y: PAGE15_EXPAND_MERGE_CENTER.y},
  ];
  const stableExpandMergeToStablePcPoints = [
    {x: PAGE15_EXPAND_MERGE_CENTER.x + 18, y: PAGE15_EXPAND_MERGE_CENTER.y},
    {x: stageStablePcBox.x - 10, y: centerY(stageStablePcBox)},
  ];
  const sclToExpandMergePoints = [
    {x: centerX(SCL_BOX), y: SCL_BOX.y - 10},
    {x: PAGE15_EXPAND_MERGE_CENTER.x, y: PAGE15_EXPAND_MERGE_CENTER.y + 18},
  ];
  const stablePcToMergePoints = [
    {x: right(stageStablePcBox) + 10, y: centerY(stageStablePcBox)},
    {x: PAGE15_MERGE_CENTER.x - 20, y: PAGE15_MERGE_CENTER.y},
  ];
  const sclToMergePoints = [
    {x: right(SCL_BOX) + 10, y: centerY(SCL_BOX)},
    {x: PAGE15_MERGE_CENTER.x, y: centerY(SCL_BOX)},
    {x: PAGE15_MERGE_CENTER.x, y: PAGE15_MERGE_CENTER.y + 18},
  ];
  const mergeToStablePoints = [
    {x: PAGE15_MERGE_CENTER.x + 20, y: PAGE15_MERGE_CENTER.y},
    {x: STABLE_UPIPE_BOX.x - 10, y: centerY(STABLE_UPIPE_BOX)},
  ];
  const stableToPhonePoints = [
    {x: right(STABLE_UPIPE_BOX) + 10, y: bottom(STABLE_UPIPE_BOX) + 22},
    {x: PHONE_BOX.x - 10, y: bottom(STABLE_UPIPE_BOX) + 22},
  ];
  const showComputerLabel = page15Focus > 0.12 || page18Focus > 0.12;
  const showPhoneLabel = false;
  const phoneContentOpacity = stageContentReveal * page13Reveal;
  const callbackQuestionX = mix(
    scene.cameraViewportCenterX,
    scene.page5QuestionX,
    questionTravelProgress,
  );
  const callbackQuestionY = mix(
    scene.cameraViewportCenterY,
    scene.page5QuestionY,
    questionTravelProgress,
  );

  if (introProgress <= 0.001 && page11Reveal <= 0.001) {
    return null;
  }

  return (
    <>
      {callbackOpacity > 0.001 ? (
        <>
          <g opacity={callbackRuntimeOpacity}>
            <Page01Scene scene={scene} />
            <Page02Scene scene={scene} />
            <g
              transform={`translate(${scene.page5MeshCenterX} ${scene.page5MeshCenterY}) scale(${mix(0.96, 1, recallReveal)}) translate(${-scene.page5MeshCenterX} ${-scene.page5MeshCenterY})`}
            >
              <StageBox
                box={scene.page5MeshBox}
                fill={scene.assetFill}
                stroke={scene.assetStroke}
                strokeWidth={2.8}
                tone="asset"
                label="Mesh"
                labelSize={24}
                labelWeight={700}
              />
            </g>
            <StrokeArrow
              d={horizontalPath(
                scene.page5MeshToVertexStartX,
                scene.page5MeshToVertexEndX,
                scene.axisY,
              )}
              stroke={scene.wireStroke}
              opacity={callbackWorldOpacity}
              tipX={scene.page5MeshToVertexEndX}
              tipY={scene.axisY}
              direction="right"
              shaftWidth={3}
              underlayWidth={5.6}
              underlayOpacity={0.12}
              headSize={9}
            />
          </g>
          <g opacity={callbackLegacyAssetOpacity}>
            <g
              data-testid="page10-callback-material-merge-source"
              transform={mergeTowardBoxTransform(scene.sharedUpperLeftBox, callbackShaderLibraryBox, callbackMergeProgress, 0.42)}
            >
              <StageBox
                box={scene.sharedUpperLeftBox}
                fill={scene.assetFill}
                stroke={scene.assetStroke}
                strokeWidth={2.8}
                tone="asset"
                label="Material"
                labelSize={24}
                labelWeight={730}
              />
            </g>
            <g
              data-testid="page10-callback-cooked-merge-source"
              transform={mergeTowardBoxTransform(
                scene.sharedUpperRightBox,
                callbackShaderLibraryBox,
                callbackMergeProgress,
                0.42,
              )}
            >
              <StageBox
                box={scene.sharedUpperRightBox}
                fill={scene.focusFill}
                stroke={scene.theme.accent}
                strokeWidth={2.8}
              />
              <StackedLabel
                x={centerX(scene.sharedUpperRightBox)}
                y={centerY(scene.sharedUpperRightBox) + 2}
                lines={["Cooked", "ShaderCode"]}
                fontSize={21}
                fontWeight={760}
                lineGap={22}
              />
            </g>
            <StrokeArrow
              testId="page10-callback-material-link"
              d={horizontalPath(
                callbackMaterialMetrics.right + 10,
                callbackShaderLibraryBox.x - 10,
                callbackMaterialMetrics.center.y,
              )}
              stroke={scene.assetStroke}
              opacity={callbackSourceLinkOpacity}
              tipX={callbackShaderLibraryBox.x - 10}
              tipY={callbackMaterialMetrics.center.y}
              direction="right"
              shaftWidth={3}
              underlayWidth={5.6}
              underlayOpacity={0.12}
              headSize={9}
            />
            <StrokeArrow
              d={verticalPath(
                centerX(scene.sharedUpperRightBox),
                bottom(scene.sharedUpperRightBox) + 8,
                scene.page5BinaryTargetBox.y - 8,
              )}
              stroke={scene.assetStroke}
              opacity={callbackSourceLinkOpacity}
              tipX={centerX(scene.sharedUpperRightBox)}
              tipY={scene.page5BinaryTargetBox.y - 8}
              direction="down"
              shaftWidth={3}
              underlayWidth={5.6}
              underlayOpacity={0.12}
              headSize={9}
            />
          </g>
          <g opacity={callbackWorldOpacity}>
            <StageBox
              box={scene.page5BinaryTargetBox}
              fill={scene.focusFill}
              stroke={scene.theme.accent}
              strokeWidth={2.8}
            />
            <StackedLabel
              x={scene.page5BinaryCenterX}
              y={scene.page5BinaryCenterY + 2}
              lines={["Binary", "ShaderCode"]}
              fontSize={22}
              fontWeight={760}
              lineGap={23}
            />
            <StrokeArrow
              d={verticalPath(
                scene.page5BinaryCenterX,
                scene.page5BinaryToGpuStartY,
                scene.page5CookedToGpuEndY,
              )}
              stroke={scene.apiStroke}
              opacity={callbackWorldOpacity}
              tipX={scene.page5BinaryCenterX}
              tipY={scene.page5CookedToGpuEndY}
              direction="down"
              shaftWidth={3}
              underlayWidth={5.6}
              underlayOpacity={0.12}
              headSize={9}
            />
          </g>
          {callbackShaderLibraryOpacity > 0.001 && page11Reveal <= 0.001 ? (
            <g
              data-testid="page10-callback-shaderlibrary-target"
              opacity={callbackShaderLibraryOpacity}
              transform={callbackShaderLibraryTransform}
            >
              <StageBox
                box={callbackShaderLibraryBox}
                fill={scene.focusFill}
                stroke={scene.apiStroke}
                strokeWidth={3}
                label="ShaderLibrary"
                labelSize={24}
                labelWeight={780}
              />
              <StrokeArrow
                d={verticalPath(
                  centerX(callbackShaderLibraryBox),
                  bottom(callbackShaderLibraryBox) + 8,
                  scene.page5BinaryTargetBox.y - 8,
                )}
                stroke={scene.apiStroke}
                opacity={callbackShaderLibraryOpacity}
                tipX={centerX(callbackShaderLibraryBox)}
                tipY={scene.page5BinaryTargetBox.y - 8}
                direction="down"
                shaftWidth={3.2}
                underlayWidth={5.8}
                underlayOpacity={0.12}
                headSize={9}
              />
            </g>
          ) : null}
        </>
      ) : null}

      {page11BridgeOpacity > 0.001 ? (
        <g
          data-testid="page10-callback-shaderlibrary-target"
          opacity={page11BridgeOpacity}
        >
          <StageBox
            box={page11BridgeBox}
            fill={scene.focusFill}
            stroke={scene.apiStroke}
            strokeWidth={3}
          />
          {page11BridgeShowsShaderLibrary ? (
            <text
              x={centerX(page11BridgeBox)}
              y={centerY(page11BridgeBox) + 2}
              fill="#22303d"
              fontSize={mix(24, 22, page11BridgeProgress)}
              fontWeight="780"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              ShaderLibrary
            </text>
          ) : null}
          {page11BridgeShowsBytecode ? (
            <text
              x={centerX(page11BridgeBox)}
              y={centerY(page11BridgeBox) + 2}
              fill="#22303d"
              fontSize={mix(18, 26, page11BridgeProgress)}
              fontWeight="780"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              .ushaderbytecode
            </text>
          ) : null}
        </g>
      ) : null}

      {questionOpacity > 0.001 ? (
        <g
          opacity={questionOpacity}
          transform={`translate(${callbackQuestionX} ${callbackQuestionY}) scale(${questionScale}) translate(${-callbackQuestionX} ${-callbackQuestionY})`}
        >
          <CalloutBadge
            testId="page10-question-badge"
            x={callbackQuestionX}
            y={callbackQuestionY}
            label="?"
            stroke={scene.apiStroke}
            fill="rgba(255, 248, 242, 0.98)"
            radius={14}
          />
        </g>
      ) : null}

      {answerOpacity > 0.001 ? (
        <g
          opacity={answerOpacity}
          transform={`translate(${callbackQuestionX} ${callbackQuestionY}) scale(${answerScale}) translate(${-callbackQuestionX} ${-callbackQuestionY})`}
        >
          <CalloutBadge
            testId="page10-answer-badge"
            x={callbackQuestionX}
            y={callbackQuestionY}
            label="!"
            stroke={scene.apiStroke}
            fill="rgba(255, 248, 242, 0.98)"
            radius={16}
          />
        </g>
      ) : null}

      {stageContentReveal > 0.001 ? (
        <g opacity={placeholderStageOpacity} transform={placeholderStageTransform}>
          <ComputerDevice
            scene={scene}
            opacity={deviceReveal}
            scale={computerScale}
            showLabel={showComputerLabel}
          />
          <PhoneDevice
            scene={scene}
            opacity={deviceReveal}
            scale={phoneScale}
            landingFocus={page13Focus}
            stableFocus={page18Focus}
            showDeviceLabel={showPhoneLabel}
            showVertexLabel={false}
            showPixelsLabel={false}
            contentOpacity={phoneContentOpacity}
          />

          {runtimeBridgeOpacity > 0.001 ? (
            <g
              transform={`translate(${centerX(PHONE_BOX)} ${centerY(PHONE_BOX)}) scale(${phoneScale}) translate(${-centerX(PHONE_BOX)} ${-centerY(PHONE_BOX)})`}
            >
              <StrokeArrow
                testId="page10-runtime-bridge-link-left"
                d={roundedPolylinePath(runtimeBridgeLinkLeftPoints)}
                stroke={scene.wireStroke}
                opacity={runtimeBridgeOpacity}
                tipX={runtimeBridgeLinkLeftPoints[2]!.x}
                tipY={runtimeBridgeLinkLeftPoints[2]!.y}
                direction={runtimeBridgeProgress < 0.55 ? "right" : "down"}
                shaftWidth={3}
                underlayWidth={5.6}
                underlayOpacity={0.14}
                headSize={9}
              />
              <StrokeArrow
                testId="page10-runtime-bridge-link-right"
                d={roundedPolylinePath(runtimeBridgeLinkRightPoints)}
                stroke={scene.wireStroke}
                opacity={runtimeBridgeOpacity}
                tipX={runtimeBridgeLinkRightPoints[2]!.x}
                tipY={runtimeBridgeLinkRightPoints[2]!.y}
                direction={runtimeBridgeProgress < 0.55 ? "right" : "down"}
                shaftWidth={3}
                underlayWidth={5.6}
                underlayOpacity={0.14}
                headSize={9}
              />
              <g
                data-testid="page10-runtime-bridge-left"
                opacity={runtimeBridgeOpacity}
              >
                {runtimeBridgeBoxOpacity > 0.001 ? (
                  <StageBox
                    box={runtimeBridgeLeftBox}
                    fill={scene.neutralFill}
                    stroke={scene.nodeStroke}
                    strokeWidth={2.8}
                  />
                ) : null}
                <VertexTriangles
                  cx={runtimeVertexCenter.x}
                  cy={runtimeVertexCenter.y}
                  opacity={runtimeBridgeOpacity}
                  scale={mix(scene.page5VertexIconScale, 0.42, runtimeBridgeProgress)}
                />
              </g>
              <g
                data-testid="page10-runtime-bridge-center"
                opacity={runtimeBridgeOpacity}
              >
                {runtimeBridgeBoxOpacity > 0.001 ? (
                  <StageBox
                    box={runtimeBridgeCenterBox}
                    fill={scene.neutralFill}
                    stroke={scene.nodeStroke}
                    strokeWidth={2.8}
                  />
                ) : null}
                <text
                  x={runtimeGpuCenter.x}
                  y={runtimeGpuCenter.y}
                  fill="#22303d"
                  fontSize={mix(48, 32, runtimeBridgeProgress)}
                  fontWeight={mix(760, 800, runtimeBridgeProgress)}
                  letterSpacing="-0.06em"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  opacity={runtimeBridgeOpacity}
                >
                  GPU
                </text>
              </g>
              <g
                data-testid="page10-runtime-bridge-right"
                opacity={runtimeBridgeOpacity}
              >
                {runtimeBridgeBoxOpacity > 0.001 ? (
                  <StageBox
                    box={runtimeBridgeRightBox}
                    fill={scene.neutralFill}
                    stroke={scene.nodeStroke}
                    strokeWidth={2.8}
                  />
                ) : null}
                <PixelGrid
                  x={runtimePixelsCenter.x - 30}
                  y={runtimePixelsCenter.y - 30}
                  opacity={runtimeBridgeOpacity}
                  scale={mix(scene.newShapeScale, 0.88, runtimeBridgeProgress)}
                  revealProgress={1}
                />
              </g>
            </g>
          ) : null}

          {bytecodeBaseOpacity > 0.001 ? (
            <ArtifactNode
              box={BYTECODE_BOX}
              scene={scene}
              opacity={bytecodeBaseOpacity}
              label=".ushaderbytecode"
              emphasized={page11Focus > 0.2 || page13Focus > 0.2}
            />
          ) : null}
          {sclNodeOpacity > 0.001 ? (
            <ArtifactNode
              box={SCL_BOX}
              scene={scene}
              opacity={sclNodeOpacity}
              label=".scl.csv"
              emphasized={page12Focus > 0.2}
            />
          ) : null}

          {cookEdgeOpacity > 0.001 ? (
            <>
              <circle
                cx={SPLIT_CENTER.x}
                cy={SPLIT_CENTER.y}
                r="8"
                fill="rgba(255, 251, 246, 0.98)"
                stroke={scene.nodeStroke}
                strokeWidth="2.2"
                opacity={cookEdgeOpacity}
              />
              <StrokeArrow
                d={roundedPolylinePath([
                  {x: centerX(COMPUTER_BOX), y: bottom(COMPUTER_BOX) + 8},
                  {x: centerX(COMPUTER_BOX), y: SPLIT_CENTER.y},
                  {x: SPLIT_CENTER.x - 8, y: SPLIT_CENTER.y},
                ])}
                stroke={scene.apiStroke}
                opacity={cookEdgeOpacity}
                tipX={SPLIT_CENTER.x - 8}
                tipY={SPLIT_CENTER.y}
                direction="right"
                shaftWidth={emphasizeWidth(3.2, page12Focus)}
                underlayWidth={6}
                headSize={9}
              />
              <text
                x={(centerX(COMPUTER_BOX) + (SPLIT_CENTER.x - 8)) / 2}
                y={SPLIT_CENTER.y - 28}
                fill={scene.apiStroke}
                fontSize="24"
                fontWeight="760"
                textAnchor="middle"
                opacity={cookEdgeOpacity}
              >
                cook
              </text>
              <StrokeArrow
                d={roundedPolylinePath([
                  {x: SPLIT_CENTER.x, y: SPLIT_CENTER.y - 8},
                  {x: centerX(SCL_BOX), y: SCL_BOX.y + SCL_BOX.height},
                ])}
                stroke={scene.apiStroke}
                opacity={cookEdgeOpacity}
                tipX={centerX(SCL_BOX)}
                tipY={SCL_BOX.y + SCL_BOX.height}
                direction="up"
                shaftWidth={emphasizeWidth(3.2, page12Focus)}
                underlayWidth={5.8}
                headSize={9}
              />
              <StrokeArrow
                d={roundedPolylinePath([
                  {x: SPLIT_CENTER.x + 8, y: SPLIT_CENTER.y},
                  {x: BYTECODE_BOX.x - 12, y: centerY(BYTECODE_BOX)},
                ])}
                stroke={scene.apiStroke}
                opacity={cookEdgeOpacity}
                tipX={BYTECODE_BOX.x - 12}
                tipY={centerY(BYTECODE_BOX)}
                direction="right"
                shaftWidth={emphasizeWidth(3.2, page12Focus)}
                underlayWidth={5.8}
                headSize={9}
              />
            </>
          ) : null}

          {bytecodeToPhoneOpacity > 0.001 ? (
            <StrokeArrow
              d={roundedPolylinePath([
                {x: right(BYTECODE_BOX) + 12, y: centerY(BYTECODE_BOX)},
                {x: 920, y: centerY(BYTECODE_BOX)},
                {x: 920, y: PHONE_GPU.y + 76},
                {x: PHONE_BOX.x - 10, y: PHONE_GPU.y + 76},
              ])}
              stroke={scene.apiStroke}
              opacity={bytecodeToPhoneOpacity}
              tipX={PHONE_BOX.x - 10}
              tipY={PHONE_GPU.y + 76}
              direction="right"
              shaftWidth={emphasizeWidth(3.2, page13Focus)}
              underlayWidth={5.8}
              headSize={9}
            />
          ) : null}

          {recGeometryVisible ? (
            <>
              {recOpacity > 0.001 ? (
                <ArtifactNode
                  box={REC_BOX}
                  scene={scene}
                  opacity={recOpacity}
                  label="rec.upipelinecache"
                  emphasized={page15Focus > 0.2}
                />
              ) : null}
              <StrokeArrow
                testId="page14-phone-to-rec-arrow"
                d={roundedPolylinePath(recPhoneToRecPoints)}
                stroke={scene.apiStroke}
                opacity={recGeometryOpacity}
                headOpacity={revealHeadOpacity(recRouteReveal, recGeometryOpacity)}
                dashArray={revealDashArray(recPhoneToRecPoints, recRouteReveal)}
                tipX={right(REC_BOX) + 12}
                tipY={centerY(REC_BOX)}
                direction="left"
                shaftWidth={emphasizeWidth(3.2, page15Focus)}
                underlayWidth={5.8}
                headSize={9}
              />
              <StrokeArrow
                d={roundedPolylinePath(recToComputerPoints)}
                stroke={scene.apiStroke}
                opacity={recGeometryOpacity}
                headOpacity={revealHeadOpacity(recRouteReveal, recGeometryOpacity)}
                dashArray={revealDashArray(recToComputerPoints, recRouteReveal)}
                tipX={centerX(COMPUTER_BOX)}
                tipY={COMPUTER_BOX.y - 8}
                direction="down"
                shaftWidth={emphasizeWidth(3.2, page15Focus)}
                underlayWidth={5.8}
                headSize={9}
              />
            </>
          ) : null}

          {stableBandOpacity > 0.001 || stableMergeOpacity > 0.001 ? (
            <>
              {stableBandOpacity > 0.001 ? (
                <ArtifactNode
                  box={stageStablePcBox}
                  scene={scene}
                  opacity={stableBandOpacity}
                  label="stablepc.csv"
                  emphasized={page18Focus > 0.2}
                />
              ) : null}
              {stableMergeOpacity > 0.001 ? (
                <ArtifactNode
                  box={STABLE_UPIPE_BOX}
                  scene={scene}
                  opacity={stableMergeOpacity}
                  lines={["stable.", "upipelinecache"]}
                  emphasized={page18Focus > 0.2}
                />
              ) : null}
              <g opacity={stableBandOpacity}>
                <circle
                  cx={PAGE15_EXPAND_MERGE_CENTER.x}
                  cy={PAGE15_EXPAND_MERGE_CENTER.y}
                  r="18"
                  fill="rgba(255, 251, 246, 0.98)"
                  stroke={scene.nodeStroke}
                  strokeWidth="2.4"
                />
                <text
                  x={PAGE15_EXPAND_MERGE_CENTER.x}
                  y={PAGE15_EXPAND_MERGE_CENTER.y + 1}
                  fill="#22303d"
                  fontSize="22"
                  fontWeight="760"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  +
                </text>
              </g>
              <g opacity={stableMergeOpacity}>
                <circle
                  cx={PAGE15_MERGE_CENTER.x}
                  cy={PAGE15_MERGE_CENTER.y}
                  r="18"
                  fill="rgba(255, 251, 246, 0.98)"
                  stroke={scene.nodeStroke}
                  strokeWidth="2.4"
                />
                <text
                  x={PAGE15_MERGE_CENTER.x}
                  y={PAGE15_MERGE_CENTER.y + 1}
                  fill="#22303d"
                  fontSize="22"
                  fontWeight="760"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  +
                </text>
              </g>
              <StrokeArrow
                testId="page15-expand-to-merge-arrow"
                d={roundedPolylinePath(stableExpandToMergePoints)}
                stroke={scene.apiStroke}
                opacity={stableBandOpacity}
                headOpacity={revealHeadOpacity(stableBandReveal, stableBandOpacity)}
                dashArray={revealDashArray(stableExpandToMergePoints, stableBandReveal)}
                tipX={PAGE15_EXPAND_MERGE_CENTER.x - 18}
                tipY={PAGE15_EXPAND_MERGE_CENTER.y}
                direction="right"
                shaftWidth={emphasizeWidth(3.2, page18Focus)}
                underlayWidth={5.8}
                headSize={9}
              />
              <text
                x={
                  (PAGE15_EXPAND_MERGE_CENTER.x + 18 + (stageStablePcBox.x - 10)) / 2
                }
                y={PAGE15_EXPAND_MERGE_CENTER.y - 24}
                fill={scene.apiStroke}
                fontSize="24"
                fontWeight="760"
                textAnchor="middle"
                opacity={stableBandOpacity}
              >
                expand
              </text>
              <StrokeArrow
                testId="page15-expand-merge-to-stablepc-arrow"
                d={roundedPolylinePath(stableExpandMergeToStablePcPoints)}
                stroke={scene.apiStroke}
                opacity={stableBandOpacity}
                headOpacity={revealHeadOpacity(stableBandReveal, stableBandOpacity)}
                dashArray={revealDashArray(
                  stableExpandMergeToStablePcPoints,
                  stableBandReveal,
                )}
                tipX={stageStablePcBox.x - 10}
                tipY={centerY(stageStablePcBox)}
                direction="right"
                shaftWidth={emphasizeWidth(3.2, page18Focus)}
                underlayWidth={5.8}
                headSize={9}
              />
              <StrokeArrow
                testId="page15-scl-to-expand-merge-arrow"
                d={roundedPolylinePath(sclToExpandMergePoints)}
                stroke={scene.apiStroke}
                opacity={stableBandOpacity}
                headOpacity={revealHeadOpacity(stableBandReveal, stableBandOpacity)}
                dashArray={revealDashArray(sclToExpandMergePoints, stableBandReveal)}
                tipX={PAGE15_EXPAND_MERGE_CENTER.x}
                tipY={PAGE15_EXPAND_MERGE_CENTER.y + 18}
                direction="up"
                shaftWidth={emphasizeWidth(3.2, page18Focus)}
                underlayWidth={5.8}
                headSize={9}
              />
              <StrokeArrow
                d={roundedPolylinePath(stablePcToMergePoints)}
                stroke={scene.apiStroke}
                opacity={stableMergeOpacity}
                headOpacity={revealHeadOpacity(stableMergeReveal, stableMergeOpacity)}
                dashArray={revealDashArray(stablePcToMergePoints, stableMergeReveal)}
                tipX={PAGE15_MERGE_CENTER.x - 20}
                tipY={PAGE15_MERGE_CENTER.y}
                direction="right"
                shaftWidth={emphasizeWidth(3.2, page18Focus)}
                underlayWidth={5.8}
                headSize={9}
              />
              <StrokeArrow
                testId="page15-scl-to-merge-arrow"
                d={roundedPolylinePath(sclToMergePoints)}
                stroke={scene.apiStroke}
                opacity={stableMergeOpacity}
                headOpacity={revealHeadOpacity(stableMergeReveal, stableMergeOpacity)}
                dashArray={revealDashArray(sclToMergePoints, stableMergeReveal)}
                tipX={PAGE15_MERGE_CENTER.x}
                tipY={PAGE15_MERGE_CENTER.y + 18}
                direction="up"
                shaftWidth={emphasizeWidth(3.2, page18Focus)}
                underlayWidth={5.8}
                headSize={9}
              />
              <StrokeArrow
                testId="page15-merge-to-stable-arrow"
                d={roundedPolylinePath(mergeToStablePoints)}
                stroke={scene.apiStroke}
                opacity={stableMergeOpacity}
                headOpacity={revealHeadOpacity(stableMergeReveal, stableMergeOpacity)}
                dashArray={revealDashArray(mergeToStablePoints, stableMergeReveal)}
                tipX={STABLE_UPIPE_BOX.x - 10}
                tipY={centerY(STABLE_UPIPE_BOX)}
                direction="right"
                shaftWidth={emphasizeWidth(3.2, page18Focus)}
                underlayWidth={5.8}
                headSize={9}
              />
            </>
          ) : null}

          {stableToPhoneOpacity > 0.001 ? (
            <StrokeArrow
              testId="page15-stable-to-phone-arrow"
              d={roundedPolylinePath(stableToPhonePoints)}
              stroke={scene.apiStroke}
              opacity={stableToPhoneOpacity}
              headOpacity={revealHeadOpacity(
                stableReturnRouteReveal,
                stableToPhoneOpacity,
              )}
              dashArray={revealDashArray(stableToPhonePoints, stableReturnRouteReveal)}
              tipX={PHONE_BOX.x - 10}
              tipY={bottom(STABLE_UPIPE_BOX) + 22}
              direction="right"
              shaftWidth={emphasizeWidth(3.2, page18Focus)}
              underlayWidth={5.8}
              headSize={9}
            />
          ) : null}
        </g>
      ) : null}

      {page14PlaceholderFocus > 0.001 ? (
        <Page14Placeholder scene={scene} opacity={page14PlaceholderFocus} />
      ) : null}
      {page16PlaceholderFocus > 0.001 ? (
        <Page16Placeholder
          scene={scene}
          opacity={page16PlaceholderFocus}
          entryProgress={page16PlaceholderVisible}
          handoffProgress={page17PlaceholderReveal}
        />
      ) : null}
      {page17PlaceholderFocus > 0.001 ? (
        <Page17Placeholder
          scene={scene}
          opacity={page17PlaceholderFocus}
          entryProgress={page17PlaceholderVisible}
        />
      ) : null}
      {page19PlaceholderFocus > 0.001 ? (
        <Page19Placeholder
          scene={scene}
          opacity={page19PlaceholderFocus}
          entryProgress={page19PlaceholderVisible}
          exitProgress={page20PlaceholderReveal}
        />
      ) : null}
      {page20PlaceholderFocus > 0.001 ? (
        <Page20Placeholder
          scene={scene}
          opacity={page20PlaceholderFocus}
          entryProgress={page20PlaceholderReveal}
        />
      ) : null}
      {page21PlaceholderFocus > 0.001 ? (
        <Page21Placeholder
          scene={scene}
          opacity={page21PlaceholderFocus}
          entryProgress={page21PlaceholderReveal}
        />
      ) : null}
      {page22PlaceholderFocus > 0.001 ? (
        <Page22Placeholder
          scene={scene}
          opacity={page22PlaceholderFocus}
          entryProgress={page22PlaceholderReveal}
        />
      ) : null}
      {page23PlaceholderFocus > 0.001 ? (
        <Page23Placeholder
          scene={scene}
          opacity={page23PlaceholderFocus}
          entryProgress={page23PlaceholderReveal}
        />
      ) : null}
      {page24PlaceholderFocus > 0.001 ? (
        <Page24Placeholder
          scene={scene}
          opacity={page24PlaceholderFocus}
          entryProgress={page24PlaceholderReveal}
        />
      ) : null}
    </>
  );
}
