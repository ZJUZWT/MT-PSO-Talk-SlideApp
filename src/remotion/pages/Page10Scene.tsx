import {
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
const REC_BOX = {x: 518, y: 92, width: 296, height: 66, radius: 20};
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
  emphasized = false,
}: {
  box: {x: number; y: number; width: number; height: number; radius: number};
  scene: SceneModel;
  opacity: number;
  label?: string;
  lines?: string[];
  emphasized?: boolean;
}) {
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
          fontSize={26}
          fontWeight={760}
          lineGap={28}
        />
      ) : label ? (
        <text
          x={centerX(box)}
          y={centerY(box) + 2}
          fill="#22303d"
          fontSize="26"
          fontWeight="760"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

export function Page10Scene({scene}: {scene: SceneModel}) {
  const introProgress = scene.settledPage910Progress ?? 0;
  const page11Reveal = scene.settledPage1011Progress ?? 0;
  const page12Reveal = scene.settledPage1112Progress ?? 0;
  const page13Reveal = scene.settledPage1213Progress ?? 0;
  const page14Reveal = scene.settledPage1314Progress ?? 0;
  const page15Reveal = scene.settledPage1415Progress ?? 0;

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
  const stableBuildReveal = resolveWindowProgress(page15Reveal, 0.08, 0.56, easeInOutCubic);
  const stableReturnReveal = resolveWindowProgress(page15Reveal, 0.5, 0.9, easeInOutCubic);
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
  const page11BridgeVisible = stageContentReveal > 0.001;
  const page11BridgeOpacity = stageContentReveal;
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
  const page13Focus = page13Reveal * (1 - page14Reveal);
  const page14Focus = page14Reveal * (1 - page15Reveal);
  const page15Focus = page15Reveal;

  const computerScalePhase12 = mix(1, 1.08, easeInOutCubic(page12Reveal));
  const computerScalePhase13 = mix(computerScalePhase12, 0.94, easeInOutCubic(page13Reveal));
  const computerScalePhase14 = mix(computerScalePhase13, 0.92, easeInOutCubic(page14Reveal));
  const computerScale = mix(computerScalePhase14, 1.08, easeInOutCubic(stableBuildReveal));

  const phoneScalePhase12 = mix(1, 0.92, easeInOutCubic(page12Reveal));
  const phoneScalePhase13 = mix(phoneScalePhase12, 1.08, easeInOutCubic(page13Reveal));
  const phoneScalePhase14 = mix(phoneScalePhase13, 1.12, easeInOutCubic(page14Reveal));
  const phoneScale = mix(phoneScalePhase14, 1.1, easeInOutCubic(stableReturnReveal));

  const baseNodeOpacity = stageContentReveal;
  const bytecodeBaseOpacity = 0;
  const page15ContextFade = mix(1, 0.74, easeInOutCubic(page15Reveal));
  const sclNodeOpacity = stageContentReveal * page12Reveal * page15ContextFade;
  const cookEdgeOpacity = stageContentReveal * page12Reveal * page15ContextFade;
  const bytecodeToPhoneOpacity =
    stageContentReveal *
    page13Reveal *
    mix(1, 0.82, easeInOutCubic(page15Reveal));
  const recOpacity =
    stageContentReveal *
    page14Reveal *
    mix(1, 0.92, easeInOutCubic(page15Reveal));
  const stableOpacity = stageContentReveal * stableBuildReveal;
  const stableToPhoneOpacity = stageContentReveal * stableReturnReveal;
  const showDeviceLabels = false;
  const phoneContentOpacity = 0;
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
        <g>
          <ComputerDevice
            scene={scene}
            opacity={deviceReveal}
            scale={computerScale}
            showLabel={showDeviceLabels}
          />
          <PhoneDevice
            scene={scene}
            opacity={deviceReveal}
            scale={phoneScale}
            landingFocus={page13Focus}
            stableFocus={page15Focus}
            showDeviceLabel={showDeviceLabels}
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

          {recOpacity > 0.001 ? (
            <>
              <ArtifactNode
                box={REC_BOX}
                scene={scene}
                opacity={recOpacity}
                label="rec.upipelinecache"
                emphasized={page14Focus > 0.2}
              />
              <StrokeArrow
                testId="page14-phone-to-rec-arrow"
                d={roundedPolylinePath([
                  {x: centerX(PHONE_BOX), y: PHONE_BOX.y - 8},
                  {x: centerX(PHONE_BOX), y: centerY(REC_BOX)},
                  {x: right(REC_BOX) + 12, y: centerY(REC_BOX)},
                ])}
                stroke={scene.apiStroke}
                opacity={recOpacity}
                tipX={right(REC_BOX) + 12}
                tipY={centerY(REC_BOX)}
                direction="left"
                shaftWidth={emphasizeWidth(3.2, page14Focus)}
                underlayWidth={5.8}
                headSize={9}
              />
              <StrokeArrow
                d={roundedPolylinePath([
                  {x: REC_BOX.x - 12, y: centerY(REC_BOX)},
                  {x: centerX(COMPUTER_BOX), y: centerY(REC_BOX)},
                  {x: centerX(COMPUTER_BOX), y: COMPUTER_BOX.y - 8},
                ])}
                stroke={scene.apiStroke}
                opacity={recOpacity}
                tipX={centerX(COMPUTER_BOX)}
                tipY={COMPUTER_BOX.y - 8}
                direction="down"
                shaftWidth={emphasizeWidth(3.2, page14Focus)}
                underlayWidth={5.8}
                headSize={9}
              />
            </>
          ) : null}

          {stableOpacity > 0.001 ? (
            <>
              <ArtifactNode
                box={STABLE_PC_BOX}
                scene={scene}
                opacity={stableOpacity}
                label="stablepc.csv"
                emphasized={page15Focus > 0.2}
              />
              <ArtifactNode
                box={STABLE_UPIPE_BOX}
                scene={scene}
                opacity={stableOpacity}
                lines={["stable.", "upipelinecache"]}
                emphasized={page15Focus > 0.2}
              />
              <g opacity={stableOpacity}>
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
                d={roundedPolylinePath([
                  {x: right(COMPUTER_BOX) + 18, y: PAGE15_EXPAND_MERGE_CENTER.y},
                  {x: PAGE15_EXPAND_MERGE_CENTER.x - 18, y: PAGE15_EXPAND_MERGE_CENTER.y},
                ])}
                stroke={scene.apiStroke}
                opacity={stableOpacity}
                tipX={PAGE15_EXPAND_MERGE_CENTER.x - 18}
                tipY={PAGE15_EXPAND_MERGE_CENTER.y}
                direction="right"
                shaftWidth={emphasizeWidth(3.2, page15Focus)}
                underlayWidth={5.8}
                headSize={9}
              />
              <text
                x={
                  (PAGE15_EXPAND_MERGE_CENTER.x + 18 + (STABLE_PC_BOX.x - 10)) / 2
                }
                y={PAGE15_EXPAND_MERGE_CENTER.y - 24}
                fill={scene.apiStroke}
                fontSize="24"
                fontWeight="760"
                textAnchor="middle"
                opacity={stableOpacity}
              >
                expand
              </text>
              <StrokeArrow
                testId="page15-expand-merge-to-stablepc-arrow"
                d={roundedPolylinePath([
                  {x: PAGE15_EXPAND_MERGE_CENTER.x + 18, y: PAGE15_EXPAND_MERGE_CENTER.y},
                  {x: STABLE_PC_BOX.x - 10, y: centerY(STABLE_PC_BOX)},
                ])}
                stroke={scene.apiStroke}
                opacity={stableOpacity}
                tipX={STABLE_PC_BOX.x - 10}
                tipY={centerY(STABLE_PC_BOX)}
                direction="right"
                shaftWidth={emphasizeWidth(3.2, page15Focus)}
                underlayWidth={5.8}
                headSize={9}
              />
              <StrokeArrow
                testId="page15-scl-to-expand-merge-arrow"
                d={roundedPolylinePath([
                  {x: centerX(SCL_BOX), y: SCL_BOX.y - 10},
                  {x: PAGE15_EXPAND_MERGE_CENTER.x, y: PAGE15_EXPAND_MERGE_CENTER.y + 18},
                ])}
                stroke={scene.apiStroke}
                opacity={stableOpacity}
                tipX={PAGE15_EXPAND_MERGE_CENTER.x}
                tipY={PAGE15_EXPAND_MERGE_CENTER.y + 18}
                direction="up"
                shaftWidth={emphasizeWidth(3.2, page15Focus)}
                underlayWidth={5.8}
                headSize={9}
              />
              <StrokeArrow
                d={roundedPolylinePath([
                  {x: right(STABLE_PC_BOX) + 10, y: PAGE15_MERGE_CENTER.y},
                  {x: PAGE15_MERGE_CENTER.x - 20, y: PAGE15_MERGE_CENTER.y},
                ])}
                stroke={scene.apiStroke}
                opacity={stableOpacity}
                tipX={PAGE15_MERGE_CENTER.x - 20}
                tipY={PAGE15_MERGE_CENTER.y}
                direction="right"
                shaftWidth={emphasizeWidth(3.2, page15Focus)}
                underlayWidth={5.8}
                headSize={9}
              />
              <StrokeArrow
                testId="page15-scl-to-merge-arrow"
                d={roundedPolylinePath([
                  {x: right(SCL_BOX) + 10, y: centerY(SCL_BOX)},
                  {x: PAGE15_MERGE_CENTER.x, y: centerY(SCL_BOX)},
                  {x: PAGE15_MERGE_CENTER.x, y: PAGE15_MERGE_CENTER.y + 18},
                ])}
                stroke={scene.apiStroke}
                opacity={stableOpacity}
                tipX={PAGE15_MERGE_CENTER.x}
                tipY={PAGE15_MERGE_CENTER.y + 18}
                direction="up"
                shaftWidth={emphasizeWidth(3.2, page15Focus)}
                underlayWidth={5.8}
                headSize={9}
              />
              <StrokeArrow
                testId="page15-merge-to-stable-arrow"
                d={roundedPolylinePath([
                  {x: PAGE15_MERGE_CENTER.x + 20, y: PAGE15_MERGE_CENTER.y},
                  {x: STABLE_UPIPE_BOX.x - 10, y: centerY(STABLE_UPIPE_BOX)},
                ])}
                stroke={scene.apiStroke}
                opacity={stableOpacity}
                tipX={STABLE_UPIPE_BOX.x - 10}
                tipY={centerY(STABLE_UPIPE_BOX)}
                direction="right"
                shaftWidth={emphasizeWidth(3.2, page15Focus)}
                underlayWidth={5.8}
                headSize={9}
              />
            </>
          ) : null}

          {stableToPhoneOpacity > 0.001 ? (
            <StrokeArrow
              testId="page15-stable-to-phone-arrow"
              d={roundedPolylinePath([
                {x: right(STABLE_UPIPE_BOX) + 10, y: centerY(STABLE_UPIPE_BOX)},
                {x: PHONE_BOX.x - 10, y: centerY(STABLE_UPIPE_BOX)},
              ])}
              stroke={scene.apiStroke}
              opacity={stableToPhoneOpacity}
              tipX={PHONE_BOX.x - 10}
              tipY={centerY(STABLE_UPIPE_BOX)}
              direction="right"
              shaftWidth={emphasizeWidth(3.2, page15Focus)}
              underlayWidth={5.8}
              headSize={9}
            />
          ) : null}
        </g>
      ) : null}
    </>
  );
}
