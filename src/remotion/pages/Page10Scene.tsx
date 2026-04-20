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
import {resolveRemotionStepFrame} from "../embed";
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
const LOOP_FRAME_LEAD = 0;
const loopFrame = (stepId: Parameters<typeof resolveRemotionStepFrame>[0]) =>
  resolveRemotionStepFrame(stepId) - LOOP_FRAME_LEAD;
const LOOP_PAGE09_FRAME = loopFrame("page_09");
const LOOP_PAGE09_IMAGE_FRAME = loopFrame("page_09_img");
const LOOP_PAGE10_FRAME = loopFrame("page_10");
const LOOP_PAGE11_FRAME = loopFrame("page_11");
const LOOP_PAGE12_FRAME = loopFrame("page_12");
const LOOP_PAGE13_FRAME = loopFrame("page_13");
const LOOP_PAGE14_FRAME = loopFrame("page_14");
const LOOP_PAGE13_IMAGE_FRAME = loopFrame("page_13_img");
const LOOP_PAGE15_IMAGE_FRAME = loopFrame("page_15_img");
const LOOP_PAGE15_FRAME = loopFrame("page_15");
const LOOP_PAGE16_FRAME = loopFrame("page_16");
const LOOP_PAGE17_FRAME = loopFrame("page_17");
const LOOP_PAGE18_FRAME = loopFrame("page_18");
const LOOP_PAGE18_IMAGE_FRAME = loopFrame("page_18_img");
const LOOP_PAGE19_FRAME = loopFrame("page_19");
const LOOP_PAGE19_TO_PAGE21_HANDOFF_FRAME = LOOP_PAGE19_FRAME;
const LOOP_PAGE21_FRAME = loopFrame("page_21");
const LOOP_PAGE22_FRAME = loopFrame("page_22");
const LOOP_PAGE24_FRAME = loopFrame("page_24");
const LOOP_PAGE25_FRAME = loopFrame("page_25");
const LOOP_PAGE26_FRAME = loopFrame("page_26");
const LOOP_PAGE27_FRAME = loopFrame("page_27");
const LOOP_PAGE28_FRAME = loopFrame("page_28");
const LOOP_PAGE29_FRAME = loopFrame("page_29");
const LOOP_PAGE30_FRAME = loopFrame("page_30");
const LOOP_PAGE31_FRAME = loopFrame("page_31");
const LOOP_PAGE32_FRAME = loopFrame("page_32");
const LOOP_PAGE33_FRAME = loopFrame("page_33");
const PLACEHOLDER_BOARD = {x: 148, y: 104, width: 984, height: 512, radius: 36};
const LATE_INLINE_TITLE_REMOVAL_SHIFT_Y = -52;
const LATE_CLOSING_QUOTE_SHIFT_Y = -42;
const SUPPLEMENT_IMAGE_BOX = {x: 46, y: 36, width: 1188, height: 648, radius: 28};
const PAGE15_SUPPLEMENT_IMAGE_BOX = {x: 46, y: 52, width: 1188, height: 430, radius: 28};
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
const ENDING_ENGINEERING_LINKS = [
  {
    title: "PSO Precaching for Unreal Engine",
    subtitle: "Unreal Engine 官方文档 / dev.epicgames.com",
    href: "https://dev.epicgames.com/documentation/unreal-engine/pso-precaching-for-unreal-engine",
  },
  {
    title: "PSO 小实验",
    subtitle: "知乎专栏 / zhuanlan.zhihu.com",
    href: "https://zhuanlan.zhihu.com/p/1935414815096021431",
  },
  {
    title: "UE项目优化：PSO Cache",
    subtitle: "查力鹏 / imzlp.com",
    href: "https://imzlp.com/posts/24336/",
  },
] as const;
const ENDING_CULTURE_LINKS: ReadonlyArray<{
  title: string;
  subtitle: string;
  href?: string;
}> = [
  {
    title: "《银河帝国》",
    subtitle: "艾萨克·阿西莫夫",
  },
  {
    title: "《反杜林论》",
    subtitle: "弗里德里希·恩格斯",
  },
  {
    title: "马克思主义哲学",
    subtitle: "沈枯燥 / 哔哩哔哩",
    href: "https://www.bilibili.com/video/BV1m7UkBDEeB?spm_id_from=333.788.videopod.sections",
  },
  {
    title: "重读资本论",
    subtitle: "王德峰 / 哔哩哔哩",
    href: "https://www.bilibili.com/list/ml2680793867?oid=938973897&bvid=BV1wT4y1r78r",
  },
] as const;
const ENDING_GAME_LINKS = [
  {
    title: "星际拓荒",
    subtitle: "Outer Wilds / Mobius Digital / Steam",
    href: "https://store.steampowered.com/app/753640/Outer_Wilds/",
  },
  {
    title: "Type Help",
    subtitle: "William Rous / itch.io",
    href: "https://william-rous.itch.io/type-help",
  },
] as const;
const ZHUANGZI_CLOSING_LINES = [
  "今子有大树，患其无用，何不树之于无何有之乡，",
  "广莫之野，彷徨乎无为其侧，逍遥乎寝卧其下。",
  "不夭斤斧，物无害者，",
  "无所可用，安所困苦哉！",
] as const;
const COMPRESSION_SUMMARY_ROWS = [
  {
    algorithm: "Brotli",
    ratio: "25.43x",
    windows: "366.2 / 0.47",
    macos: "296.2 / 0.32",
    android: "1.34",
    ios: "0.37",
  },
  {
    algorithm: "LZ4",
    ratio: "15.59x",
    windows: "2.9 / 0.14",
    macos: "2.1 / 0.05",
    android: "0.26",
    ios: "0.04",
  },
  {
    algorithm: "Noop",
    ratio: "1.00x",
    windows: "0.4 / 0.08",
    macos: "0.6 / 0.03",
    android: "0.19",
    ios: "0.03",
  },
  {
    algorithm: "Oodle Kraken",
    ratio: "20.39x",
    windows: "1.4 / 0.17",
    macos: "1.6 / 0.14",
    android: "0.63",
    ios: "0.15",
  },
  {
    algorithm: "Oodle Leviathan",
    ratio: "27.00x",
    windows: "2.7 / 0.14",
    macos: "3.4 / 0.11",
    android: "0.47",
    ios: "0.11",
  },
  {
    algorithm: "Oodle Mermaid",
    ratio: "15.01x",
    windows: "1.6 / 0.16",
    macos: "1.8 / 0.14",
    android: "0.55",
    ios: "0.12",
  },
  {
    algorithm: "Oodle Selkie",
    ratio: "7.89x",
    windows: "1.4 / 0.15",
    macos: "1.5 / 0.08",
    android: "0.39",
    ios: "0.08",
  },
  {
    algorithm: "Snappy",
    ratio: "10.32x",
    windows: "1.1 / 0.33",
    macos: "0.8 / 0.13",
    android: "0.54",
    ios: "0.12",
  },
  {
    algorithm: "zlib",
    ratio: "21.46x",
    windows: "4.9 / 0.51",
    macos: "4.6 / 0.43",
    android: "1.45",
    ios: "0.43",
  },
  {
    algorithm: "zstd",
    ratio: "24.83x",
    windows: "77.3 / 0.31",
    macos: "34.9 / 0.12",
    android: "0.40",
    ios: "0.09",
  },
] as const;
const VERTEX_DESCRIPTOR_CODE_LINES = [
  "FString FVertexElement::ToString() const",
  "{",
  "  return FString::Printf(TEXT(\"<%u %u %u %u %u %u>\")",
  "    , uint32(StreamIndex), uint32(Offset), uint32(Type)",
  "    , uint32(AttributeIndex), uint32(Stride)",
  "    , uint32(bUseInstanceIndex));",
  "}",
  "struct FVertexFactoryInput",
  "void FLocalVertexFactory::InitRHI()",
] as const;
const LOCAL_VERTEX_FACTORY_CODE_LINES = [
  "struct FVertexFactoryInput",
  "{",
  "#if NUM_MATERIAL_TEXCOORDS_VERTEX > 1",
  "  float4 PackedTexCoords4[...] : ATTRIBUTE4;",
  "#endif",
  "#if NUM_MATERIAL_TEXCOORDS_VERTEX == 1",
  "  float2 PackedTexCoords2 : ATTRIBUTE4;",
  "#elif NUM_MATERIAL_TEXCOORDS_VERTEX == 3",
  "  float2 PackedTexCoords2 : ATTRIBUTE5;",
  "#elif NUM_MATERIAL_TEXCOORDS_VERTEX == 5",
  "  float2 PackedTexCoords2 : ATTRIBUTE6;",
  "#elif NUM_MATERIAL_TEXCOORDS_VERTEX == 7",
  "  float2 PackedTexCoords2 : ATTRIBUTE7;",
  "#endif",
  "}",
] as const;
const HARNESS_CHAIN_LABELS = [
  "geometryReviewArtifact",
  "geometryMetrics",
  "geometryScorePolicy",
] as const;
const HARNESS_FORMULA_LINES = [
  "node_move = clamp(180 + distancePx*0.95, 180, 960)",
  "edge_grow = clamp(140 + lengthPx*0.75, 140, 840)",
  "fade_in / fade_out = 220 ms",
  "allowedMaxSec = requiredSec * 1.35",
] as const;
const HARNESS_GATES = [
  "overlap = 0",
  "crossing = 0",
  "nodePierce = 0",
  "textOverflow = 0",
] as const;
const PARALLEL_NOTES = [
  "同步成本",
  "共享状态",
  "任务粒度",
  "warp divergence",
  "bank conflict",
] as const;
const STRATEGY_ALGORITHM_LINES = [
  "PCA 也是一种压缩",
  "模型把原过程压进参数里",
  "查表 / 预处理减少在线计算",
] as const;
const PAGE24_GDC_LINK_LABEL = "参考：GDC Vault / ML / Physics / Kolmogorov";
const PAGE24_GDC_LINK_URL =
  "https://www.gdcvault.com/play/1026713/Machine-Learning-Physics-Simulation-Kolmogorov";
const GOVERNANCE_DIMENSION_TOKENS = [
  "UV",
  "Vertex Decl",
  "Material",
  "Color Buffer",
] as const;
const PAGE17_EXAMPLE_CARD = {x: 100, y: 400, width: 1080, height: 220, radius: 22};
const PAGE17_KEY1_CENTER = {x: 754, y: 508};
const PAGE17_KEY2_CENTER = {x: 754, y: 556};
const PAGE17_HASHA_CENTER = {x: 1004, y: 508};
const PAGE17_HASHB_CENTER = {x: 1004, y: 556};
const PAGE19_MAIN_AXIS_Y = 360;
const PAGE19_STABLE_BOX = {x: 44, y: 302, width: 208, height: 116, radius: 26};
const PAGE19_UE_GROUP_BOX = {x: 280, y: 184, width: 192, height: 352, radius: 30};
const PAGE19_UE_ROW_1 = {x: 312, y: 270, width: 128, height: 48, radius: 16};
const PAGE19_UE_ROW_2 = {x: 312, y: 358, width: 128, height: 48, radius: 16};
const PAGE19_UE_ROW_3 = {x: 312, y: 446, width: 128, height: 48, radius: 16};
const PAGE19_GPU_AXIS_X = 582;
const PAGE19_VERTEX_CENTER = {x: 582, y: 200};
const PAGE19_GPU_LABEL_Y = 360;
const PAGE19_GPU_PIXELS = {x: 548, y: 458};
const PAGE19_MEMORY_BOX = {x: 688, y: 150, width: 272, height: 420, radius: 32};
const PAGE19_MEMORY_GL_BOX = {x: 712, y: 204, width: 224, height: 76, radius: 18};
const PAGE19_MEMORY_VK_BOX = {x: 712, y: 326, width: 224, height: 76, radius: 18};
const PAGE19_MEMORY_MT_BOX = {x: 712, y: 444, width: 224, height: 100, radius: 18};
const PAGE19_DISK_BOX = {x: 986, y: 150, width: 216, height: 420, radius: 32};
const PAGE19_DISK_GL_BOX = {x: 1008, y: 205, width: 172, height: 74, radius: 16};
const PAGE19_DISK_VK_BOX = {x: 1006, y: 327, width: 176, height: 74, radius: 16};
const PAGE19_DISK_MT_BOX = {x: 1008, y: 445, width: 172, height: 96, radius: 16};

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
  offsetX = 0,
  showShell = true,
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
  offsetX?: number;
  showShell?: boolean;
  showDeviceLabel: boolean;
  showVertexLabel: boolean;
  showPixelsLabel: boolean;
  contentOpacity: number;
}) {
  const runtimeOpacity = contentOpacity;
  const gpuScale = mix(1, 1.06, Math.max(landingFocus, stableFocus));

  return (
    <g
      transform={`translate(${offsetX} 0) translate(${centerX(PHONE_BOX)} ${centerY(PHONE_BOX)}) scale(${scale}) translate(${-centerX(PHONE_BOX)} ${-centerY(PHONE_BOX)})`}
    >
      {showShell ? (
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
      ) : null}
      <g data-testid="page10-phone-runtime" opacity={runtimeOpacity}>
        <VertexTriangles
          cx={PHONE_VERTEX_CENTER.x}
          cy={PHONE_VERTEX_CENTER.y}
          opacity={0.9}
          scale={0.46}
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
  geometryNodeId,
  geometryNodeLabel,
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
  geometryNodeId?: string;
  geometryNodeLabel?: string;
  labelFontSize?: number;
  detailFontSize?: number;
  detailColor?: string;
  emphasized?: boolean;
}) {
  const hasDetail = Boolean(detail && !lines);
  const resolvedGeometryLabel =
    geometryNodeLabel ?? label ?? lines?.join(" / ") ?? geometryNodeId;

  return (
    <g
      opacity={opacity}
      data-geometry-node-id={geometryNodeId}
      data-geometry-node-label={geometryNodeId ? resolvedGeometryLabel : undefined}
    >
      {geometryNodeId ? (
        <g data-geometry-node-box="1">
          <rect
            x={box.x}
            y={box.y}
            width={box.width}
            height={box.height}
            rx={box.radius}
            fill="transparent"
            stroke="none"
          />
        </g>
      ) : null}
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
          markGeometryText={Boolean(geometryNodeId)}
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
            data-geometry-node-text={geometryNodeId ? "1" : undefined}
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
              data-geometry-node-text={geometryNodeId ? "1" : undefined}
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

function LateBoardTitle({
  scene,
  title,
  subtitle,
  opacity,
}: {
  scene: SceneModel;
  title: string;
  subtitle?: string;
  opacity: number;
}) {
  return (
    <g opacity={opacity}>
      <text
        x={centerX(PLACEHOLDER_BOARD)}
        y="54"
        fill={scene.apiStroke}
        fontSize="35"
        fontWeight="820"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {title}
      </text>
      {subtitle ? (
        <text
          x={centerX(PLACEHOLDER_BOARD)}
          y="88"
          fill="rgba(34, 48, 61, 0.56)"
          fontSize="18"
          fontWeight="700"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {subtitle}
        </text>
      ) : null}
    </g>
  );
}

function LateInfoCard({
  scene,
  box,
  title,
  lines,
  opacity,
  geometryNodeId,
  accent = false,
  compact = false,
  titleFontSize = 18,
  bodyFontSize,
  lineGapOverride,
}: {
  scene: SceneModel;
  box: {x: number; y: number; width: number; height: number; radius: number};
  title: string;
  lines: readonly string[];
  opacity: number;
  geometryNodeId?: string;
  accent?: boolean;
  compact?: boolean;
  titleFontSize?: number;
  bodyFontSize?: number;
  lineGapOverride?: number;
}) {
  const lineGap = lineGapOverride ?? (compact ? 22 : 26);
  const fontSize = bodyFontSize ?? (compact ? 16 : 18);

  return (
    <g
      opacity={opacity}
      data-geometry-node-id={geometryNodeId}
      data-geometry-node-label={geometryNodeId ? title : undefined}
    >
      <g data-geometry-node-box={geometryNodeId ? "1" : undefined}>
        <StageBox
          box={box}
          fill={accent ? "rgba(248, 236, 226, 0.94)" : "rgba(255, 255, 255, 0.9)"}
          stroke={accent ? scene.apiStroke : "rgba(92, 106, 118, 0.42)"}
          strokeWidth={accent ? 2.8 : 2.1}
        />
      </g>
      <text
        x={box.x + 20}
        y={box.y + 26}
        fill={accent ? scene.apiStroke : "#22303d"}
        fontSize={titleFontSize}
        fontWeight="820"
        textAnchor="start"
        dominantBaseline="middle"
        data-geometry-node-text={geometryNodeId ? "1" : undefined}
      >
        {title}
      </text>
      {lines.map((line, index) => (
        <text
          key={`${title}-${line}-${index}`}
          x={box.x + 20}
          y={box.y + 58 + index * lineGap}
          fill="rgba(34, 48, 61, 0.82)"
          fontSize={fontSize}
          fontWeight={index === 0 ? "720" : "670"}
          textAnchor="start"
          dominantBaseline="middle"
          data-geometry-node-text={geometryNodeId ? "1" : undefined}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function LateFooterBar({
  scene,
  text,
  opacity,
  geometryNodeId,
}: {
  scene: SceneModel;
  text: string;
  opacity: number;
  geometryNodeId?: string;
}) {
  const footerBox = {x: 164, y: 606, width: 948, height: 54, radius: 22};

  return (
    <g
      opacity={opacity}
      data-geometry-node-id={geometryNodeId}
      data-geometry-node-label={geometryNodeId ? text : undefined}
    >
      <g data-geometry-node-box={geometryNodeId ? "1" : undefined}>
        <StageBox
          box={footerBox}
          fill="rgba(255, 248, 240, 0.92)"
          stroke="rgba(92, 106, 118, 0.24)"
          strokeWidth={1.8}
        />
      </g>
      <text
        x={centerX(footerBox)}
        y={centerY(footerBox)}
        fill="rgba(34, 48, 61, 0.76)"
        fontSize="20"
        fontWeight="700"
        textAnchor="middle"
        dominantBaseline="middle"
        data-geometry-node-text={geometryNodeId ? "1" : undefined}
      >
        {text}
      </text>
    </g>
  );
}

function LateLeadCard({
  scene,
  box,
  eyebrow,
  headline,
  bodyLines,
  opacity,
  geometryNodeId,
  accent = false,
  headlineFontSize = 31,
  bodyFontSize = 17.5,
  bodyLineGap = 25,
}: {
  scene: SceneModel;
  box: {x: number; y: number; width: number; height: number; radius: number};
  eyebrow: string;
  headline: string;
  bodyLines: readonly string[];
  opacity: number;
  geometryNodeId?: string;
  accent?: boolean;
  headlineFontSize?: number;
  bodyFontSize?: number;
  bodyLineGap?: number;
}) {
  const headlineY = box.y + 104;
  const bodyStartY = box.y + 178;

  return (
    <g
      opacity={opacity}
      data-geometry-node-id={geometryNodeId}
      data-geometry-node-label={geometryNodeId ? headline : undefined}
    >
      <g data-geometry-node-box={geometryNodeId ? "1" : undefined}>
        <StageBox
          box={box}
          fill={accent ? "rgba(255, 248, 240, 0.94)" : "rgba(255, 255, 255, 0.92)"}
          stroke={accent ? scene.apiStroke : "rgba(92, 106, 118, 0.4)"}
          strokeWidth={accent ? 2.5 : 2.1}
        />
      </g>
      <text
        x={box.x + 22}
        y={box.y + 28}
        fill={scene.apiStroke}
        fontSize="19"
        fontWeight="820"
        textAnchor="start"
        dominantBaseline="middle"
        data-geometry-node-text={geometryNodeId ? "1" : undefined}
      >
        {eyebrow}
      </text>
      <text
        x={box.x + 22}
        y={headlineY}
        fill="#22303d"
        fontSize={headlineFontSize}
        fontWeight="820"
        textAnchor="start"
        dominantBaseline="middle"
        data-geometry-node-text={geometryNodeId ? "1" : undefined}
      >
        {headline}
      </text>
      {bodyLines.map((line, index) => (
        <text
          key={`${eyebrow}-${line}-${index}`}
          x={box.x + 22}
          y={bodyStartY + index * bodyLineGap}
          fill="rgba(34, 48, 61, 0.78)"
          fontSize={bodyFontSize}
          fontWeight={index === 0 ? "740" : "680"}
          textAnchor="start"
          dominantBaseline="middle"
          data-geometry-node-text={geometryNodeId ? "1" : undefined}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function LateCodeCard({
  scene,
  box,
  title,
  lines,
  opacity,
  geometryNodeId,
  titleFontSize = 17,
  codeFontSize = 14,
  lineHeight = 19,
}: {
  scene: SceneModel;
  box: {x: number; y: number; width: number; height: number; radius: number};
  title: string;
  lines: readonly string[];
  opacity: number;
  geometryNodeId?: string;
  titleFontSize?: number;
  codeFontSize?: number;
  lineHeight?: number;
}) {
  return (
    <g
      opacity={opacity}
      data-geometry-node-id={geometryNodeId}
      data-geometry-node-label={geometryNodeId ? title : undefined}
    >
      <g data-geometry-node-box={geometryNodeId ? "1" : undefined}>
        <StageBox
          box={box}
          fill="rgba(249, 247, 244, 0.96)"
          stroke="rgba(92, 106, 118, 0.36)"
          strokeWidth={2}
        />
      </g>
      <text
        x={box.x + 18}
        y={box.y + 24}
        fill={scene.apiStroke}
        fontSize={titleFontSize}
        fontWeight="820"
        textAnchor="start"
        dominantBaseline="middle"
        data-geometry-node-text={geometryNodeId ? "1" : undefined}
      >
        {title}
      </text>
      {lines.map((line, index) => {
        const isAttributeLine = /ATTRIBUTE[4-7]/.test(line);
        return (
          <text
            key={`${title}-code-${index}`}
            x={box.x + 18}
            y={box.y + 54 + index * lineHeight}
            fill={isAttributeLine ? scene.apiStroke : "#22303d"}
            fontFamily="SFMono-Regular, Menlo, Consolas, monospace"
            fontSize={isAttributeLine ? `${codeFontSize + 0.5}` : `${codeFontSize}`}
            fontWeight={isAttributeLine ? "780" : "650"}
            textAnchor="start"
            dominantBaseline="middle"
            data-geometry-node-text={geometryNodeId ? "1" : undefined}
          >
            {line}
          </text>
        );
      })}
    </g>
  );
}

function LateImageCard({
  scene,
  box,
  title,
  href,
  clipId,
  opacity,
  preserveAspectRatio = "xMidYMid meet",
  titleOutside = false,
}: {
  scene: SceneModel;
  box: {x: number; y: number; width: number; height: number; radius: number};
  title: string;
  href: string;
  clipId: string;
  opacity: number;
  preserveAspectRatio?: string;
  titleOutside?: boolean;
}) {
  const inset = titleOutside ? 8 : 16;
  const imageBox = {
    x: box.x + inset,
    y: box.y + (titleOutside ? inset : 40),
    width: box.width - inset * 2,
    height: box.height - (titleOutside ? inset * 2 : 56),
    radius: Math.max(10, box.radius - 8),
  };

  return (
    <g opacity={opacity}>
      <defs>
        <clipPath id={clipId}>
          <rect
            x={imageBox.x}
            y={imageBox.y}
            width={imageBox.width}
            height={imageBox.height}
            rx={imageBox.radius}
          />
        </clipPath>
      </defs>
      <StageBox
        box={box}
        fill="rgba(255, 255, 255, 0.92)"
        stroke="rgba(92, 106, 118, 0.34)"
        strokeWidth={2}
      />
      {titleOutside ? (
        <text
          x={box.x}
          y={box.y - 16}
          fill={scene.apiStroke}
          fontSize="17"
          fontWeight="820"
          textAnchor="start"
          dominantBaseline="middle"
        >
          {title}
        </text>
      ) : (
        <text
          x={box.x + 18}
          y={box.y + 22}
          fill={scene.apiStroke}
          fontSize="17"
          fontWeight="820"
          textAnchor="start"
          dominantBaseline="middle"
        >
          {title}
        </text>
      )}
      <rect
        x={imageBox.x}
        y={imageBox.y}
        width={imageBox.width}
        height={imageBox.height}
        rx={imageBox.radius}
        fill="rgba(246, 242, 236, 0.96)"
      />
      <image
        href={href}
        x={imageBox.x}
        y={imageBox.y}
        width={imageBox.width}
        height={imageBox.height}
        preserveAspectRatio={preserveAspectRatio}
        clipPath={`url(#${clipId})`}
      />
    </g>
  );
}

function LateBareImage({
  scene,
  box,
  title,
  href,
  clipId,
  opacity,
  geometryNodeId,
  geometryNodeLabel,
  preserveAspectRatio = "xMidYMid meet",
  titleFontSize = 17,
}: {
  scene: SceneModel;
  box: {x: number; y: number; width: number; height: number; radius: number};
  title?: string;
  href: string;
  clipId: string;
  opacity: number;
  geometryNodeId?: string;
  geometryNodeLabel?: string;
  preserveAspectRatio?: string;
  titleFontSize?: number;
}) {
  const geometryBoxX = title ? box.x - 8 : box.x;
  const geometryBoxWidth = box.width + (title ? 16 : 0);
  const geometryBoxTop = title ? box.y - 40 : box.y;
  const geometryBoxHeight = box.height + (title ? 48 : 0);

  return (
    <g
      opacity={opacity}
      data-geometry-node-id={geometryNodeId}
      data-geometry-node-label={geometryNodeId ? (geometryNodeLabel ?? title ?? geometryNodeId) : undefined}
    >
      {geometryNodeId ? (
        <g data-geometry-node-box="1">
          <rect
            x={geometryBoxX}
            y={geometryBoxTop}
            width={geometryBoxWidth}
            height={geometryBoxHeight}
            rx={box.radius}
            fill="transparent"
            stroke="none"
          />
        </g>
      ) : null}
      <defs>
        <clipPath id={clipId}>
          <rect
            x={box.x}
            y={box.y}
            width={box.width}
            height={box.height}
            rx={box.radius}
          />
        </clipPath>
      </defs>
      {title ? (
        <text
          x={box.x}
          y={box.y - 18}
          fill={scene.apiStroke}
          fontSize={titleFontSize}
          fontWeight="820"
          textAnchor="start"
          dominantBaseline="middle"
          data-geometry-node-text={geometryNodeId ? "1" : undefined}
        >
          {title}
        </text>
      ) : null}
      <image
        href={href}
        x={box.x}
        y={box.y}
        width={box.width}
        height={box.height}
        preserveAspectRatio={preserveAspectRatio}
        clipPath={`url(#${clipId})`}
      />
    </g>
  );
}

function SupplementImageOverlay({
  scene,
  href,
  opacity,
  clipId,
  box = SUPPLEMENT_IMAGE_BOX,
  preserveAspectRatio = "xMidYMid slice",
  backgroundFill = "transparent",
  imageTestId,
}: {
  scene: SceneModel;
  href: string;
  opacity: number;
  clipId: string;
  box?: {x: number; y: number; width: number; height: number; radius: number};
  preserveAspectRatio?: string;
  backgroundFill?: string;
  imageTestId?: string;
}) {
  if (opacity <= 0.001) {
    return null;
  }

  const reveal = easeOutQuint(clamp01(opacity));
  const overlayScale = mix(0.97, 1, reveal);

  return (
    <g
      opacity={opacity}
      transform={`translate(${centerX(box)} ${centerY(box)}) scale(${overlayScale}) translate(${-centerX(box)} ${-centerY(box)})`}
    >
      <defs>
        <clipPath id={clipId}>
          <rect
            x={box.x}
            y={box.y}
            width={box.width}
            height={box.height}
            rx={box.radius}
            ry={box.radius}
          />
        </clipPath>
      </defs>
      {backgroundFill !== "transparent" ? (
        <rect
          x={box.x}
          y={box.y}
          width={box.width}
          height={box.height}
          rx={box.radius}
          ry={box.radius}
          fill={backgroundFill}
        />
      ) : null}
      <image
        data-testid={imageTestId}
        href={href}
        x={box.x}
        y={box.y}
        width={box.width}
        height={box.height}
        preserveAspectRatio={preserveAspectRatio}
        clipPath={`url(#${clipId})`}
      />
      <rect
        x={box.x}
        y={box.y}
        width={box.width}
        height={box.height}
        rx={box.radius}
        ry={box.radius}
        fill="none"
        stroke={scene.nodeStroke}
        strokeWidth={2.4}
      />
    </g>
  );
}

function Page09EvidenceNotes({
  scene,
  opacity,
}: {
  scene: SceneModel;
  opacity: number;
}) {
  if (opacity <= 0.001) {
    return null;
  }

  const reveal = easeOutQuint(clamp01(opacity));
  const scale = mix(0.975, 1, reveal);
  const leftBox = {x: 72, y: 96, width: 318, height: 258, radius: 24};
  const centerBox = {x: 410, y: 96, width: 462, height: 258, radius: 24};
  const rightBox = {x: 892, y: 96, width: 316, height: 258, radius: 24};
  const hashLeftBox = {x: 72, y: 382, width: 560, height: 236, radius: 24};
  const hashRightBox = {x: 648, y: 382, width: 560, height: 236, radius: 24};

  const centerRows = [
    {name: "M", inlineSize: "168K", sharedSize: "18K", diff: "-89%"},
    {name: "M-I1", inlineSize: "178K", sharedSize: "20K", diff: "-89%"},
    {name: "M-I2", inlineSize: "178K", sharedSize: "20K", diff: "-89%"},
  ];
  const centerArrowX = centerX(centerBox);
  const centerNumberGap = 40;
  const inlineRows = [
    {name: "M", size: "168K"},
    {name: "M-I1", size: "178K"},
    {name: "M-I2", size: "178K"},
  ];
  const sharedRows = [
    {name: "M", size: "18K"},
    {name: "M-I1", size: "20K"},
    {name: "M-I2", size: "20K"},
    {name: "GL Archive", size: "14.0M"},
    {name: "Vulkan Archive", size: "19.9M"},
  ];

  return (
    <g
      opacity={opacity}
      transform={`translate(640 360) scale(${scale}) translate(-640 -360)`}
    >
      <StageBox
        box={leftBox}
        fill="rgba(255, 251, 246, 0.95)"
        stroke={scene.nodeStroke}
        strokeWidth={2.4}
      />
      <StageBox
        box={centerBox}
        fill="rgba(255, 251, 246, 0.95)"
        stroke={scene.nodeStroke}
        strokeWidth={2.4}
      />
      <StageBox
        box={rightBox}
        fill="rgba(255, 251, 246, 0.95)"
        stroke={scene.nodeStroke}
        strokeWidth={2.4}
      />
      <StageBox
        box={hashLeftBox}
        fill="rgba(255, 251, 246, 0.95)"
        stroke={scene.nodeStroke}
        strokeWidth={2.4}
      />
      <StageBox
        box={hashRightBox}
        fill="rgba(255, 251, 246, 0.95)"
        stroke={scene.nodeStroke}
        strokeWidth={2.4}
      />

      <text
        x={leftBox.x + 18}
        y={leftBox.y + 26}
        fill={scene.apiStroke}
        fontSize="19"
        fontWeight="790"
        textAnchor="start"
        dominantBaseline="middle"
      >
        Inline（资产内）
      </text>
      {inlineRows.map((row, index) => (
        <text
          key={`inline-name-${row.name}`}
          x={leftBox.x + 18}
          y={leftBox.y + 84 + index * 52}
          fill="#22303d"
          fontSize="21"
          fontWeight="700"
          textAnchor="start"
          dominantBaseline="middle"
        >
          {row.name}
        </text>
      ))}
      {inlineRows.map((row, index) => (
        <text
          key={`inline-size-${row.name}`}
          x={leftBox.x + leftBox.width - 18}
          y={leftBox.y + 84 + index * 52}
          fill="#22303d"
          fontSize="21"
          fontWeight="700"
          textAnchor="end"
          dominantBaseline="middle"
        >
          {row.size}
        </text>
      ))}

      <text
        x={centerX(centerBox)}
        y={centerBox.y + 26}
        fill="#22303d"
        fontSize="19"
        fontWeight="790"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        .uexp 对比（M 系列）
      </text>
      <text
        x={centerX(centerBox)}
        y={centerBox.y + 54}
        fill="rgba(34, 48, 61, 0.72)"
        fontSize="16"
        fontWeight="700"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        M=Material，M-I*=Material Instance
      </text>
      {centerRows.map((row, index) => {
        const y = centerBox.y + 94 + index * 56;
        return (
          <g key={`center-row-${row.name}`}>
            <line
              x1={centerBox.x + 16}
              x2={centerBox.x + centerBox.width - 16}
              y1={y + 22}
              y2={y + 22}
              stroke="rgba(92, 106, 118, 0.24)"
              strokeWidth={1.2}
            />
            <text
              x={centerBox.x + 18}
              y={y}
              fill="#22303d"
              fontSize="20"
              fontWeight="760"
              textAnchor="start"
              dominantBaseline="middle"
            >
              {row.name}
            </text>
            <text
              x={centerArrowX - centerNumberGap}
              y={y}
              fill={scene.apiStroke}
              fontSize="22"
              fontWeight="780"
              textAnchor="end"
              dominantBaseline="middle"
            >
              {row.inlineSize}
            </text>
            <text
              x={centerArrowX}
              y={y}
              fill="rgba(92, 106, 118, 0.9)"
              fontSize="22"
              fontWeight="760"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              →
            </text>
            <text
              x={centerArrowX + centerNumberGap}
              y={y}
              fill="rgba(96, 154, 114, 0.98)"
              fontSize="22"
              fontWeight="780"
              textAnchor="start"
              dominantBaseline="middle"
            >
              {row.sharedSize}
            </text>
            <text
              x={centerBox.x + centerBox.width - 18}
              y={y}
              fill="rgba(96, 154, 114, 0.98)"
              fontSize="18"
              fontWeight="760"
              textAnchor="end"
              dominantBaseline="middle"
            >
              {row.diff}
            </text>
          </g>
        );
      })}

      <text
        x={rightBox.x + 18}
        y={rightBox.y + 26}
        fill="rgba(96, 154, 114, 0.98)"
        fontSize="19"
        fontWeight="790"
        textAnchor="start"
        dominantBaseline="middle"
      >
        Shared（共享库）
      </text>
      {sharedRows.map((row, index) => (
        <text
          key={`shared-name-${row.name}`}
          x={rightBox.x + 18}
          y={rightBox.y + 82 + index * 36}
          fill="#22303d"
          fontSize="19"
          fontWeight={index >= 3 ? "760" : "700"}
          textAnchor="start"
          dominantBaseline="middle"
        >
          {row.name}
        </text>
      ))}
      {sharedRows.map((row, index) => (
        <text
          key={`shared-size-${row.name}`}
          x={rightBox.x + rightBox.width - 18}
          y={rightBox.y + 82 + index * 36}
          fill="#22303d"
          fontSize="19"
          fontWeight={index >= 3 ? "760" : "700"}
          textAnchor="end"
          dominantBaseline="middle"
        >
          {row.size}
        </text>
      ))}

      <text
        x={hashLeftBox.x + 18}
        y={hashLeftBox.y + 28}
        fill={scene.apiStroke}
        fontSize="20"
        fontWeight="790"
        textAnchor="start"
        dominantBaseline="middle"
      >
        Hash 复用证据（OpenGL）
      </text>
      <text
        x={hashLeftBox.x + 18}
        y={hashLeftBox.y + 74}
        fill="#22303d"
        fontSize="24"
        fontWeight="760"
        textAnchor="start"
        dominantBaseline="middle"
      >
        BC10CB48...B4A6DB57
      </text>
      <text
        x={hashLeftBox.x + 18}
        y={hashLeftBox.y + 116}
        fill="rgba(34, 48, 61, 0.74)"
        fontSize="18"
        fontWeight="700"
        textAnchor="start"
        dominantBaseline="middle"
      >
        M-I1 / M-I2 复用同一 Hash
      </text>

      <text
        x={hashRightBox.x + 18}
        y={hashRightBox.y + 28}
        fill={scene.apiStroke}
        fontSize="20"
        fontWeight="790"
        textAnchor="start"
        dominantBaseline="middle"
      >
        Hash 复用证据（Vulkan）
      </text>
      <text
        x={hashRightBox.x + 18}
        y={hashRightBox.y + 74}
        fill="#22303d"
        fontSize="24"
        fontWeight="760"
        textAnchor="start"
        dominantBaseline="middle"
      >
        8DD283A7...E60A34B5
      </text>
      <text
        x={hashRightBox.x + 18}
        y={hashRightBox.y + 116}
        fill="rgba(34, 48, 61, 0.74)"
        fontSize="18"
        fontWeight="700"
        textAnchor="start"
        dominantBaseline="middle"
      >
        共享模式命中同一套 Hash
      </text>
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
  geometryNodeId,
  fontSize = 18,
  accent = false,
}: {
  scene: SceneModel;
  box: {x: number; y: number; width: number; height: number; radius: number};
  label: string;
  opacity: number;
  geometryNodeId?: string;
  fontSize?: number;
  accent?: boolean;
}) {
  return (
    <g
      opacity={opacity}
      data-geometry-node-id={geometryNodeId}
      data-geometry-node-label={geometryNodeId ? label : undefined}
    >
      {geometryNodeId ? (
        <g data-geometry-node-box="1">
          <rect
            x={box.x}
            y={box.y}
            width={box.width}
            height={box.height}
            rx={box.radius}
            fill="transparent"
            stroke="none"
          />
        </g>
      ) : null}
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
        fontSize={fontSize}
        fontWeight="760"
        textAnchor="middle"
        dominantBaseline="middle"
        data-geometry-node-text={geometryNodeId ? "1" : undefined}
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
  phoneOffsetX,
}: {
  scene: SceneModel;
  opacity: number;
  phoneOffsetX: number;
}) {
  const nodeReveal = resolveWindowProgress(opacity, 0.12, 0.54, easeOutQuint);
  const routeReveal = resolveWindowProgress(opacity, 0.34, 0.92, easeOutQuint);
  const runtimeGpuX = PHONE_GPU.x + phoneOffsetX;
  const runtimeGpuY = PHONE_GPU.y;
  const psoBox = {
    x: runtimeGpuX - 760,
    y: runtimeGpuY - 70,
    width: 360,
    height: 144,
    radius: 24,
  };
  const recBox = {
    x: psoBox.x + 12,
    y: psoBox.y - 162,
    width: 336,
    height: 72,
    radius: 22,
  };

  const psoToGpuPoints = [
    {x: right(psoBox) + 10, y: runtimeGpuY},
    {x: runtimeGpuX - 72, y: runtimeGpuY},
  ];
  const psoToRecPoints = [
    {x: centerX(psoBox), y: psoBox.y - 10},
    {x: centerX(psoBox), y: recBox.y + recBox.height + 10},
  ];

  return (
    <PlaceholderBoardShell opacity={opacity}>
      <g opacity={opacity * nodeReveal}>
        <StageBox
          box={psoBox}
          fill="rgba(248, 236, 226, 0.96)"
          stroke={scene.apiStroke}
          strokeWidth={3}
        />
        <text
          x={centerX(psoBox)}
          y={psoBox.y + 58}
          fill="#22303d"
          fontSize="20"
          fontWeight="760"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          PSO = BSS + State
        </text>
        <text
          x={centerX(psoBox)}
          y={psoBox.y + 100}
          fill="rgba(34, 48, 61, 0.78)"
          fontSize="18"
          fontWeight="730"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          BSS = VS Hash + PS Hash
        </text>
      </g>
      <g opacity={opacity * nodeReveal}>
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
      <StrokeArrow
        d={roundedPolylinePath(psoToGpuPoints)}
        stroke={scene.apiStroke}
        opacity={opacity * routeReveal}
        headOpacity={revealHeadOpacity(routeReveal, opacity * routeReveal)}
        tipX={runtimeGpuX - 72}
        tipY={runtimeGpuY}
        direction="right"
        shaftWidth={3}
        underlayWidth={5.5}
        headSize={8}
        testId="page14-draw-to-pso-arrow"
      />
      <StrokeArrow
        d={roundedPolylinePath(psoToRecPoints)}
        stroke={scene.apiStroke}
        opacity={opacity * routeReveal}
        headOpacity={revealHeadOpacity(routeReveal, opacity * routeReveal)}
        dashArray="12 10"
        tipX={centerX(psoBox)}
        tipY={recBox.y + recBox.height + 10}
        direction="up"
        shaftWidth={3.1}
        underlayWidth={5.6}
        headSize={9}
        testId="page14-pso-to-rec-arrow"
      />
      <text
        x={centerX(psoBox) + 74}
        y={(recBox.y + recBox.height + psoBox.y) / 2 - 6}
        fill="rgba(34, 48, 61, 0.72)"
        fontSize="16"
        fontWeight="720"
        textAnchor="middle"
        dominantBaseline="middle"
        opacity={opacity * routeReveal}
      >
        保存在本地
      </text>
      <text
        x={centerX(psoBox)}
        y={bottom(psoBox) + 38}
        fill="rgba(34, 48, 61, 0.7)"
        fontSize="16"
        fontWeight="700"
        textAnchor="middle"
        dominantBaseline="middle"
        opacity={opacity * nodeReveal}
      >
        注：Vulkan / Metal = BSS + State，OpenGL = BSS（无 State）
      </text>
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
      <text
        x={centerX(recBox)}
        y={recBox.y - 24}
        fill={scene.apiStroke}
        fontSize="20"
        fontWeight="760"
        textAnchor="middle"
        dominantBaseline="middle"
        opacity={sharedOpacity}
      >
        历史 runtime
      </text>
      <ArtifactNode
        scene={scene}
        box={sclBox}
        label=".scl.csv"
        detail="ShaderHash <-> ShaderStableKey"
        opacity={sharedOpacity}
        labelFontSize={24}
        detailFontSize={16}
      />
      <text
        x={centerX(sclBox)}
        y={sclBox.y - 22}
        fill={scene.apiStroke}
        fontSize="20"
        fontWeight="760"
        textAnchor="middle"
        dominantBaseline="middle"
        opacity={sharedOpacity}
      >
        历史映射
      </text>
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
        label="StableKey_A"
        opacity={annotationOpacity}
      />
      <MicroToken
        scene={scene}
        box={splitKey2AnimatedBox}
        label="StableKey_B"
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
        label="StableKey_A"
        opacity={annotationOpacity}
      />
      <MicroToken
        scene={scene}
        box={mergeKey2AnimatedBox}
        label="StableKey_B"
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
  const groupReveal = resolveWindowProgress(entryProgress, 0.08, 0.44, easeOutQuint);
  const routeReveal = resolveWindowProgress(entryProgress, 0.2, 0.72, easeOutQuint);
  const diskReveal = resolveWindowProgress(entryProgress, 0.34, 0.84, easeOutQuint);
  const localOpacity = opacity;
  const leftBandOpacity = localOpacity * groupReveal;
  const gpuOpacity =
    localOpacity * resolveWindowProgress(entryProgress, 0.22, 0.58, easeOutQuint);
  const memoryOpacity =
    localOpacity * resolveWindowProgress(entryProgress, 0.28, 0.64, easeOutQuint);
  const diskOpacity = localOpacity * diskReveal;

  const stableToUePoints = [
    {x: right(PAGE19_STABLE_BOX) + 12, y: PAGE19_MAIN_AXIS_Y},
    {x: PAGE19_UE_GROUP_BOX.x - 12, y: PAGE19_MAIN_AXIS_Y},
  ];
  const ueToGpuPoints = [
    {x: right(PAGE19_UE_GROUP_BOX) + 12, y: PAGE19_MAIN_AXIS_Y},
    {x: PAGE19_GPU_AXIS_X - 54, y: PAGE19_MAIN_AXIS_Y},
  ];
  const gpuVertexToTextPoints = [
    {x: PAGE19_GPU_AXIS_X, y: PAGE19_VERTEX_CENTER.y + 52},
    {x: PAGE19_GPU_AXIS_X, y: PAGE19_GPU_LABEL_Y - 32},
  ];
  const gpuTextToPixelsPoints = [
    {x: PAGE19_GPU_AXIS_X, y: PAGE19_GPU_LABEL_Y + 32},
    {x: PAGE19_GPU_AXIS_X, y: PAGE19_GPU_PIXELS.y - 12},
  ];
  const gpuToMemPoints = [
    {x: PAGE19_GPU_AXIS_X + 56, y: PAGE19_MAIN_AXIS_Y},
    {x: PAGE19_MEMORY_BOX.x - 12, y: PAGE19_MAIN_AXIS_Y},
  ];

  return (
    <PlaceholderBoardShell opacity={opacity}>
      <g opacity={localOpacity}>
        <g opacity={leftBandOpacity}>
          <ArtifactNode
            scene={scene}
            box={PAGE19_STABLE_BOX}
            lines={["stable.", "upipelinecache"]}
            opacity={leftBandOpacity}
            geometryNodeId="stable"
            geometryNodeLabel="stable.upipelinecache"
            labelFontSize={20}
            emphasized
          />

          <g data-geometry-node-id="ue-group" data-geometry-node-label="UE PSO">
            <StageBox
              box={PAGE19_UE_GROUP_BOX}
              fill={SOFT_FILL}
              stroke={ACCENT}
              strokeWidth={2.8}
              markGeometryBox
            />
            <text
              x={centerX(PAGE19_UE_GROUP_BOX)}
              y={PAGE19_UE_GROUP_BOX.y + 28}
              fill={TEXT}
              fontSize="31"
              fontWeight="780"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              UE PSO
            </text>
          </g>
          <g data-geometry-node-id="ue-1" data-geometry-node-label="PSO 1">
            <StageBox
              box={PAGE19_UE_ROW_1}
              fill={CARD_FILL}
              stroke={NODE_STROKE}
              strokeWidth={2.1}
              label="PSO 1"
              labelSize={23}
              labelWeight={760}
              markGeometryBox
              markGeometryText
            />
          </g>
          <g data-geometry-node-id="ue-2" data-geometry-node-label="PSO 2">
            <StageBox
              box={PAGE19_UE_ROW_2}
              fill={CARD_FILL}
              stroke={NODE_STROKE}
              strokeWidth={2.1}
              label="PSO 2"
              labelSize={23}
              labelWeight={760}
              markGeometryBox
              markGeometryText
            />
          </g>
          <g data-geometry-node-id="ue-3" data-geometry-node-label="PSO ...">
            <StageBox
              box={PAGE19_UE_ROW_3}
              fill={CARD_FILL}
              stroke={NODE_STROKE}
              strokeWidth={2.1}
              label="PSO ..."
              labelSize={23}
              labelWeight={760}
              markGeometryBox
              markGeometryText
            />
          </g>
        </g>

        <g opacity={gpuOpacity} data-geometry-node-id="gpu" data-geometry-node-label="GPU">
          <g data-geometry-node-box="1">
            <rect
              x={518}
              y={319}
              width={128}
              height={82}
              rx={18}
              fill="transparent"
              stroke="none"
            />
          </g>
          <VertexTriangles
            cx={PAGE19_VERTEX_CENTER.x}
            cy={PAGE19_VERTEX_CENTER.y}
            opacity={gpuOpacity}
            scale={0.62}
          />
          <text
            x={PAGE19_GPU_AXIS_X}
            y={PAGE19_GPU_LABEL_Y}
            fill={TEXT}
            fontSize="52"
            fontWeight="800"
            textAnchor="middle"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            GPU
          </text>
          <PixelGrid
            x={PAGE19_GPU_PIXELS.x}
            y={PAGE19_GPU_PIXELS.y}
            opacity={gpuOpacity}
            scale={1.08}
            revealProgress={1}
          />
        </g>

        <g opacity={memoryOpacity}>
          <g data-geometry-node-id="memory-group" data-geometry-node-label="内存中 PSO">
            <StageBox
              box={PAGE19_MEMORY_BOX}
              fill={SOFT_FILL}
              stroke={ACCENT}
              strokeWidth={2.8}
              markGeometryBox
            />
            <text
              x={centerX(PAGE19_MEMORY_BOX)}
              y={PAGE19_MEMORY_BOX.y + 28}
              fill={TEXT}
              fontSize="30"
              fontWeight="780"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              内存中 PSO
            </text>
          </g>

          <g data-geometry-node-id="mem-gl" data-geometry-node-label="OpenGL Program Binary">
            <StageBox
              box={PAGE19_MEMORY_GL_BOX}
              fill={CARD_FILL}
              stroke={NODE_STROKE}
              strokeWidth={2.1}
              markGeometryBox
            />
            <StackedLabel
              x={centerX(PAGE19_MEMORY_GL_BOX)}
              y={centerY(PAGE19_MEMORY_GL_BOX) + 1}
              lines={["OpenGL", "Program Binary"]}
              fontSize={22}
              fontWeight={760}
              lineGap={20}
              markGeometryText
            />
          </g>

          <g data-geometry-node-id="mem-vk" data-geometry-node-label="Vulkan Pipeline Cache">
            <StageBox
              box={PAGE19_MEMORY_VK_BOX}
              fill={CARD_FILL}
              stroke={NODE_STROKE}
              strokeWidth={2.1}
              markGeometryBox
            />
            <StackedLabel
              x={centerX(PAGE19_MEMORY_VK_BOX)}
              y={centerY(PAGE19_MEMORY_VK_BOX) + 1}
              lines={["Vulkan", "Pipeline Cache"]}
              fontSize={22}
              fontWeight={760}
              lineGap={20}
              markGeometryText
            />
          </g>

          <g data-geometry-node-id="mem-metal" data-geometry-node-label="Metal Binary Archive 系统管理">
            <StageBox
              box={PAGE19_MEMORY_MT_BOX}
              fill={CARD_FILL}
              stroke={NODE_STROKE}
              strokeWidth={2.1}
              markGeometryBox
            />
            <StackedLabel
              x={centerX(PAGE19_MEMORY_MT_BOX)}
              y={centerY(PAGE19_MEMORY_MT_BOX) + 1}
              lines={["Metal", "Binary Archive", "系统管理"]}
              fontSize={18}
              fontWeight={760}
              lineGap={16}
              markGeometryText
            />
          </g>
        </g>

        <g opacity={diskOpacity}>
          <g data-geometry-node-id="disk-group" data-geometry-node-label="硬盘中的 PSO">
            <StageBox
              box={PAGE19_DISK_BOX}
              fill={SOFT_FILL}
              stroke={ACCENT}
              strokeWidth={2.8}
              markGeometryBox
            />
            <text
              x={centerX(PAGE19_DISK_BOX)}
              y={PAGE19_DISK_BOX.y + 28}
              fill={TEXT}
              fontSize="28"
              fontWeight="780"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              硬盘中的 PSO
            </text>
          </g>
          <g data-geometry-node-id="disk-gl" data-geometry-node-label="Program Binary Cache">
            <StageBox
              box={PAGE19_DISK_GL_BOX}
              fill={CARD_FILL}
              stroke={NODE_STROKE}
              strokeWidth={2}
              markGeometryBox
            />
            <StackedLabel
              x={centerX(PAGE19_DISK_GL_BOX)}
              y={centerY(PAGE19_DISK_GL_BOX) + 1}
              lines={["Program Binary", "Cache"]}
              fontSize={20}
              fontWeight={760}
              lineGap={18}
              markGeometryText
            />
          </g>
          <g data-geometry-node-id="disk-vk" data-geometry-node-label="VulkanPSO.cache">
            <StageBox
              box={PAGE19_DISK_VK_BOX}
              fill={CARD_FILL}
              stroke={NODE_STROKE}
              strokeWidth={2}
              label="VulkanPSO.cache"
              labelSize={19}
              labelWeight={760}
              markGeometryBox
              markGeometryText
            />
          </g>
          <g data-geometry-node-id="disk-metal" data-geometry-node-label="BinaryArchive functions.data">
            <StageBox
              box={PAGE19_DISK_MT_BOX}
              fill={CARD_FILL}
              stroke={NODE_STROKE}
              strokeWidth={2}
              markGeometryBox
            />
            <StackedLabel
              x={centerX(PAGE19_DISK_MT_BOX)}
              y={centerY(PAGE19_DISK_MT_BOX) + 1}
              lines={["BinaryArchive", "functions.data"]}
              fontSize={18}
              fontWeight={760}
              lineGap={16}
              markGeometryText
            />
          </g>
        </g>

        <StrokeArrow
          d={horizontalPath(
            right(PAGE19_STABLE_BOX) + 12,
            PAGE19_UE_GROUP_BOX.x - 12,
            PAGE19_MAIN_AXIS_Y,
          )}
          stroke={ACCENT}
          opacity={leftBandOpacity}
          headOpacity={revealHeadOpacity(routeReveal, leftBandOpacity)}
          dashArray={revealDashArray(stableToUePoints, routeReveal)}
          tipX={PAGE19_UE_GROUP_BOX.x - 12}
          tipY={PAGE19_MAIN_AXIS_Y}
          direction="right"
          shaftWidth={3}
          underlayWidth={5.5}
          headSize={8}
        />
        <StrokeArrow
          d={horizontalPath(
            right(PAGE19_UE_GROUP_BOX) + 12,
            PAGE19_GPU_AXIS_X - 54,
            PAGE19_MAIN_AXIS_Y,
          )}
          stroke={ACCENT}
          opacity={gpuOpacity}
          headOpacity={revealHeadOpacity(routeReveal, gpuOpacity)}
          dashArray={revealDashArray(ueToGpuPoints, routeReveal)}
          tipX={PAGE19_GPU_AXIS_X - 54}
          tipY={PAGE19_MAIN_AXIS_Y}
          direction="right"
          shaftWidth={3}
          underlayWidth={5.5}
          headSize={8}
        />
        <StrokeArrow
          d={verticalPath(
            PAGE19_GPU_AXIS_X,
            PAGE19_VERTEX_CENTER.y + 52,
            PAGE19_GPU_LABEL_Y - 32,
          )}
          stroke={scene.wireStroke}
          opacity={gpuOpacity}
          headOpacity={revealHeadOpacity(routeReveal, gpuOpacity)}
          dashArray={revealDashArray(gpuVertexToTextPoints, routeReveal)}
          tipX={PAGE19_GPU_AXIS_X}
          tipY={PAGE19_GPU_LABEL_Y - 32}
          direction="down"
          shaftWidth={3}
          underlayWidth={5.5}
          headSize={8}
        />
        <StrokeArrow
          d={verticalPath(
            PAGE19_GPU_AXIS_X,
            PAGE19_GPU_LABEL_Y + 32,
            PAGE19_GPU_PIXELS.y - 12,
          )}
          stroke={scene.wireStroke}
          opacity={gpuOpacity}
          headOpacity={revealHeadOpacity(routeReveal, gpuOpacity)}
          dashArray={revealDashArray(gpuTextToPixelsPoints, routeReveal)}
          tipX={PAGE19_GPU_AXIS_X}
          tipY={PAGE19_GPU_PIXELS.y - 12}
          direction="down"
          shaftWidth={3}
          underlayWidth={5.5}
          headSize={8}
        />
        <StrokeArrow
          d={horizontalPath(
            PAGE19_GPU_AXIS_X + 56,
            PAGE19_MEMORY_BOX.x - 12,
            PAGE19_MAIN_AXIS_Y,
          )}
          stroke={ACCENT}
          opacity={memoryOpacity}
          headOpacity={revealHeadOpacity(routeReveal, memoryOpacity)}
          dashArray={revealDashArray(gpuToMemPoints, routeReveal)}
          tipX={PAGE19_MEMORY_BOX.x - 12}
          tipY={PAGE19_MAIN_AXIS_Y}
          direction="right"
          shaftWidth={3}
          underlayWidth={5.5}
          headSize={8}
        />
        <StrokeArrow
          d={horizontalPath(
            right(PAGE19_MEMORY_GL_BOX) + 8,
            PAGE19_DISK_GL_BOX.x - 8,
            centerY(PAGE19_MEMORY_GL_BOX),
          )}
          stroke={scene.wireStroke}
          opacity={diskOpacity}
          headOpacity={revealHeadOpacity(routeReveal, diskOpacity)}
          dashArray="10 8"
          tipX={PAGE19_DISK_GL_BOX.x - 8}
          tipY={centerY(PAGE19_MEMORY_GL_BOX)}
          direction="right"
          shaftWidth={2.4}
          underlayWidth={4.4}
          headSize={6.4}
        />
        <StrokeArrow
          d={horizontalPath(
            right(PAGE19_MEMORY_VK_BOX) + 8,
            PAGE19_DISK_VK_BOX.x - 8,
            centerY(PAGE19_MEMORY_VK_BOX),
          )}
          stroke={scene.wireStroke}
          opacity={diskOpacity}
          headOpacity={revealHeadOpacity(routeReveal, diskOpacity)}
          dashArray="10 8"
          tipX={PAGE19_DISK_VK_BOX.x - 8}
          tipY={centerY(PAGE19_MEMORY_VK_BOX)}
          direction="right"
          shaftWidth={2.4}
          underlayWidth={4.4}
          headSize={6.4}
        />
        <StrokeArrow
          d={horizontalPath(
            right(PAGE19_MEMORY_MT_BOX) + 8,
            PAGE19_DISK_MT_BOX.x - 8,
            centerY(PAGE19_MEMORY_MT_BOX),
          )}
          stroke={scene.wireStroke}
          opacity={diskOpacity}
          headOpacity={revealHeadOpacity(routeReveal, diskOpacity)}
          dashArray="10 8"
          tipX={PAGE19_DISK_MT_BOX.x - 8}
          tipY={centerY(PAGE19_MEMORY_MT_BOX)}
          direction="right"
          shaftWidth={2.4}
          underlayWidth={4.4}
          headSize={6.4}
        />
      </g>
    </PlaceholderBoardShell>
  );
}

function TextOnlyPlaceholder({
  scene,
  opacity,
  entryProgress,
  title,
  goalLines,
  bridgeLines,
  showTitle = true,
}: {
  scene: SceneModel;
  opacity: number;
  entryProgress: number;
  title: string;
  goalLines: string[];
  bridgeLines: string[];
  showTitle?: boolean;
}) {
  const reveal = resolveWindowProgress(entryProgress, 0.08, 0.9, easeOutQuint);
  const panelOpacity = opacity * reveal;
  const goalCard = {x: 172, y: 210, width: 936, height: 172, radius: 26};
  const bridgeCard = {x: 172, y: 408, width: 936, height: 178, radius: 26};

  return (
    <PlaceholderBoardShell opacity={panelOpacity}>
      {showTitle ? (
        <text
          x={centerX(PLACEHOLDER_BOARD)}
          y="126"
          fill={scene.apiStroke}
          fontSize="34"
          fontWeight="800"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {title}
        </text>
      ) : null}
      <FloatingCard
        scene={scene}
        box={goalCard}
        title="这一页讲什么"
        lines={goalLines}
        opacity={panelOpacity}
        accent
      />
      <NotePanel
        scene={scene}
        box={bridgeCard}
        title="和下一页怎么衔接"
        lines={bridgeLines}
        opacity={panelOpacity}
      />
    </PlaceholderBoardShell>
  );
}

function NarrativeTypesetPlaceholder({
  scene,
  opacity,
  entryProgress,
  kicker,
  bodyLines,
  footer,
}: {
  scene: SceneModel;
  opacity: number;
  entryProgress: number;
  kicker: string;
  bodyLines: string[];
  footer: string;
}) {
  const reveal = resolveWindowProgress(entryProgress, 0.08, 0.9, easeOutQuint);
  const panelOpacity = opacity * reveal;
  const contentBox = {x: 148, y: 170, width: 984, height: 434, radius: 30};
  const leftX = contentBox.x + 42;
  const bodyStartY = contentBox.y + 112;
  const bodyLineGap = 48;

  return (
    <PlaceholderBoardShell opacity={panelOpacity}>
      <StageBox
        box={contentBox}
        fill="rgba(255, 251, 246, 0.94)"
        stroke={scene.nodeStroke}
        strokeWidth={2.4}
      />
      <text
        x={leftX}
        y={contentBox.y + 48}
        fill="rgba(214, 102, 48, 0.96)"
        fontSize="19"
        fontWeight="830"
        textAnchor="start"
        dominantBaseline="middle"
      >
        {kicker}
      </text>
      {bodyLines.map((line, index) => (
        <text
          key={`narrative-line-${index}`}
          x={leftX}
          y={bodyStartY + index * bodyLineGap}
          fill="#22303d"
          fontSize="31"
          fontWeight={index === 0 ? "790" : "730"}
          textAnchor="start"
          dominantBaseline="middle"
        >
          {line}
        </text>
      ))}
      <line
        x1={leftX}
        y1={contentBox.y + contentBox.height - 92}
        x2={contentBox.x + contentBox.width - 42}
        y2={contentBox.y + contentBox.height - 92}
        stroke="rgba(92, 106, 118, 0.3)"
        strokeWidth={1.6}
      />
      <text
        x={leftX}
        y={contentBox.y + contentBox.height - 54}
        fill="rgba(34, 48, 61, 0.76)"
        fontSize="22"
        fontWeight="700"
        textAnchor="start"
        dominantBaseline="middle"
      >
        {footer}
      </text>
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
  const reveal = resolveWindowProgress(entryProgress, 0.08, 0.9, easeOutQuint);
  const panelOpacity = opacity * reveal;
  const leftCard = {x: 80, y: 146, width: 608, height: 402, radius: 28};
  const rightCard1 = {x: 712, y: 146, width: 432, height: 102, radius: 24};
  const rightCard2 = {x: 712, y: 296, width: 432, height: 102, radius: 24};
  const rightCard3 = {x: 712, y: 446, width: 432, height: 114, radius: 24};

  return (
    <PlaceholderBoardShell opacity={panelOpacity}>
      <g transform={`translate(0 ${LATE_INLINE_TITLE_REMOVAL_SHIFT_Y})`}>
        <LateLeadCard
          scene={scene}
          box={leftCard}
          eyebrow="PSO 缓存有效性边界"
          headline="什么时候会失效？"
          bodyLines={[
            "先问边界：PSO Cache 不是跨内容、跨版本、跨环境永久复用。",
            "Shader / PSO 描述、编译链、映射关系、驱动环境一变，",
            "旧缓存就可能失效。",
            "关键不是幻想永不失效，而是先分清复用边界和重建边界。",
          ]}
          opacity={panelOpacity}
          geometryNodeId="left-card"
          accent
          headlineFontSize={24}
          bodyFontSize={16.5}
          bodyLineGap={23}
        />
        <LateInfoCard
          scene={scene}
          box={rightCard1}
          title="内容 / 状态变了"
          lines={[
            "Shader、Permute、Vertex Layout、",
            "Render State 一变，就已经不是同一组 PSO。",
          ]}
          opacity={panelOpacity}
          geometryNodeId="right-1"
          compact
          accent
          bodyFontSize={16}
        />
        <LateInfoCard
          scene={scene}
          box={rightCard2}
          title="版本 / 构建变了"
          lines={[
            "SharedCode、codegen、Hash、scl 映射一变，",
            "旧缓存通常就要重新 expand / build。",
          ]}
          opacity={panelOpacity}
          geometryNodeId="right-2"
          compact
          bodyFontSize={16}
        />
        <LateInfoCard
          scene={scene}
          box={rightCard3}
          title="环境变了"
          lines={[
            "OS / Driver / GPU / API 一变，本地缓存就可能失效。",
            "各 API 的持久化边界本来就不同。",
          ]}
          opacity={panelOpacity}
          geometryNodeId="right-3"
          compact
          bodyFontSize={16}
          lineGapOverride={21}
        />
        <LateFooterBar
          scene={scene}
          opacity={panelOpacity}
          geometryNodeId="footer"
          text="缓存不是永不失效，而是把可复用边界和重建边界讲清楚。"
        />
      </g>
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
  const reveal = resolveWindowProgress(entryProgress, 0.08, 0.9, easeOutQuint);
  const panelOpacity = opacity * reveal;
  const leftCard = {x: 88, y: 146, width: 600, height: 402, radius: 28};
  const rightCard1 = {x: 712, y: 146, width: 424, height: 102, radius: 24};
  const rightCard2 = {x: 712, y: 296, width: 424, height: 102, radius: 24};
  const rightCard3 = {x: 712, y: 446, width: 424, height: 114, radius: 24};

  return (
    <PlaceholderBoardShell opacity={panelOpacity}>
      <g transform={`translate(0 ${LATE_INLINE_TITLE_REMOVAL_SHIFT_Y})`}>
        <LateLeadCard
          scene={scene}
          box={leftCard}
          eyebrow="核心判断"
          headline="预编译的 PSO 不会消失，只会转移。"
          bodyLines={[
            "它把运行时卡顿改写成启动成本与内存成本。",
            "page21 讲何时失效，page22 讲这套工程该怎么理解。",
            "所以 PSO Cache 不是对象本身，而是围绕对象做的工程安排。",
          ]}
          opacity={panelOpacity}
          geometryNodeId="left-card"
          accent
          headlineFontSize={27}
          bodyFontSize={17}
        />
        <LateInfoCard
          scene={scene}
          box={rightCard1}
          title="对象"
          lines={["PSO 是要被创建、绑定、命中的运行时对象。"]}
          opacity={panelOpacity}
          geometryNodeId="right-1"
          compact
          accent
          bodyFontSize={17}
        />
        <LateInfoCard
          scene={scene}
          box={rightCard2}
          title="方法"
          lines={["围绕 Shader / State 的收集、", "保存、预热方法。"]}
          opacity={panelOpacity}
          geometryNodeId="right-2"
          compact
          bodyFontSize={16}
          lineGapOverride={20}
        />
        <LateInfoCard
          scene={scene}
          box={rightCard3}
          title="工程取舍"
          lines={[
            "先换掉运行时尖峰，",
            "再回收首启和空间开销。",
          ]}
          opacity={panelOpacity}
          geometryNodeId="right-3"
          compact
          bodyFontSize={16.5}
          lineGapOverride={21}
        />
        <LateFooterBar
          scene={scene}
          opacity={panelOpacity}
          geometryNodeId="footer"
          text="PSO Cache 是工程方法，不是让代价凭空消失的魔法。"
        />
      </g>
    </PlaceholderBoardShell>
  );
}

function Page24StrategyPage({
  scene,
  opacity,
  entryProgress,
}: {
  scene: SceneModel;
  opacity: number;
  entryProgress: number;
}) {
  const reveal = resolveWindowProgress(entryProgress, 0.08, 0.9, easeOutQuint);
  const panelOpacity = opacity * reveal;
  const leftCard = {x: 98, y: 148, width: 748, height: 418, radius: 28};
  const rightCard1 = {x: 868, y: 148, width: 308, height: 126, radius: 24};
  const rightCard2 = {x: 868, y: 290, width: 308, height: 126, radius: 24};
  const rightCard3 = {x: 868, y: 432, width: 308, height: 140, radius: 24};
  const tableTop = leftCard.y + 82;
  const tableColumns = [
    {label: "算法", x: leftCard.x + 22},
    {label: "压缩率", x: leftCard.x + 188},
    {label: "Windows 压/解", x: leftCard.x + 294},
    {label: "macOS 压/解", x: leftCard.x + 458},
    {label: "Android 解", x: leftCard.x + 612},
    {label: "iOS 解", x: leftCard.x + 694},
  ] as const;

  return (
    <PlaceholderBoardShell opacity={panelOpacity}>
      <g transform={`translate(0 ${LATE_INLINE_TITLE_REMOVAL_SHIFT_Y})`}>
        <g
          data-geometry-node-id="table"
          data-geometry-node-label="Compression Table"
        >
          <StageBox
            box={leftCard}
            fill="rgba(255, 255, 255, 0.92)"
            stroke="rgba(92, 106, 118, 0.4)"
            strokeWidth={2.1}
            markGeometryBox
          />
          <text
            x={leftCard.x + 20}
            y={leftCard.y + 24}
            fill={scene.apiStroke}
            fontSize="20"
            fontWeight="820"
            textAnchor="start"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            release/results 聚合实测：10 种算法 / 4 平台 / pso_like
          </text>
          <text
            x={right(leftCard) - 20}
            y={leftCard.y + 24}
            fill="rgba(34, 48, 61, 0.56)"
            fontSize="14.5"
            fontWeight="760"
            textAnchor="end"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            单位：桌面 = 压/解(ms)；移动端 = 解压(ms)
          </text>
          {tableColumns.map((column) => (
            <text
              key={column.label}
              x={column.x}
              y={tableTop}
              fill="rgba(34, 48, 61, 0.56)"
              fontSize="14.5"
              fontWeight="760"
              textAnchor="start"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              {column.label}
            </text>
          ))}
          {COMPRESSION_SUMMARY_ROWS.map((row, index) => {
            const y = tableTop + 30 + index * 25.5;
            return (
              <g key={`${row.algorithm}-${index}`}>
                <line
                  x1={leftCard.x + 16}
                  y1={y + 14}
                  x2={right(leftCard) - 16}
                  y2={y + 14}
                  stroke="rgba(92, 106, 118, 0.12)"
                  strokeWidth={1}
                />
                <text
                  x={tableColumns[0].x}
                  y={y}
                  fill="#22303d"
                  fontSize="15.5"
                  fontWeight="760"
                  textAnchor="start"
                  dominantBaseline="middle"
                  data-geometry-node-text="1"
                >
                  {row.algorithm}
                </text>
                <text
                  x={tableColumns[1].x}
                  y={y}
                  fill="rgba(34, 48, 61, 0.76)"
                  fontSize="15"
                  fontWeight="680"
                  textAnchor="start"
                  dominantBaseline="middle"
                  data-geometry-node-text="1"
                >
                  {row.ratio}
                </text>
                <text
                  x={tableColumns[2].x}
                  y={y}
                  fill="rgba(34, 48, 61, 0.76)"
                  fontSize="15"
                  fontWeight="680"
                  textAnchor="start"
                  dominantBaseline="middle"
                  data-geometry-node-text="1"
                >
                  {row.windows}
                </text>
                <text
                  x={tableColumns[3].x}
                  y={y}
                  fill="rgba(34, 48, 61, 0.76)"
                  fontSize="15"
                  fontWeight="680"
                  textAnchor="start"
                  dominantBaseline="middle"
                  data-geometry-node-text="1"
                >
                  {row.macos}
                </text>
                <text
                  x={tableColumns[4].x}
                  y={y}
                  fill="rgba(34, 48, 61, 0.76)"
                  fontSize="15"
                  fontWeight="680"
                  textAnchor="start"
                  dominantBaseline="middle"
                  data-geometry-node-text="1"
                >
                  {row.android}
                </text>
                <text
                  x={tableColumns[5].x}
                  y={y}
                  fill="rgba(34, 48, 61, 0.76)"
                  fontSize="15"
                  fontWeight="680"
                  textAnchor="start"
                  dominantBaseline="middle"
                  data-geometry-node-text="1"
                >
                  {row.ios}
                </text>
              </g>
            );
          })}
          <text
            x={leftCard.x + 20}
            y={leftCard.y + 392}
            fill="rgba(34, 48, 61, 0.68)"
            fontSize="15.5"
            fontWeight="680"
            textAnchor="start"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            可以看到：压缩率高的算法并不一定压得快，但移动端解压通常仍然足够便宜。
          </text>
        </g>
        <LateInfoCard
          scene={scene}
          box={rightCard1}
          title="Compression"
          lines={["直接改资源形态", "体积更小，", "但解压和恢复要额外付时间。"]}
          opacity={panelOpacity}
          geometryNodeId="card-1"
          accent
          compact
          bodyFontSize={16}
          lineGapOverride={19}
        />
        <LateInfoCard
          scene={scene}
          box={rightCard2}
          title="Precompute / Preload"
          lines={["先占空间再换时间", "Lightmap、LUT、", "Precache 都属于这类。"]}
          opacity={panelOpacity}
          geometryNodeId="card-2"
          compact
          bodyFontSize={16}
          lineGapOverride={19}
        />
        <LateInfoCard
          scene={scene}
          box={rightCard3}
          title="Algorithm"
          lines={["改表示 / 改求解路径", ...STRATEGY_ALGORITHM_LINES]}
          opacity={panelOpacity}
          geometryNodeId="card-3"
          compact
          bodyFontSize={16}
          lineGapOverride={20}
        />
        <g
          data-geometry-node-id="link"
          data-geometry-node-label={PAGE24_GDC_LINK_LABEL}
        >
          <g data-geometry-node-box="1">
            <rect
              x={rightCard3.x + 16}
              y={576}
              width={360}
              height={26}
              rx={6}
              fill="transparent"
              stroke="none"
            />
          </g>
          <a href={PAGE24_GDC_LINK_URL} target="_blank" rel="noreferrer">
            <text
              x={rightCard3.x + 20}
              y={587}
              fill={scene.apiStroke}
              fontSize="14"
              fontWeight="760"
              textAnchor="start"
              dominantBaseline="middle"
              textDecoration="underline"
              data-geometry-node-text="1"
            >
              {PAGE24_GDC_LINK_LABEL}
            </text>
          </a>
        </g>
        <LateFooterBar
          scene={scene}
          opacity={panelOpacity}
          geometryNodeId="footer"
          text="优化未必是发明新算法，也可能只是把时间和空间重新分配了一次。"
        />
      </g>
    </PlaceholderBoardShell>
  );
}

function Page25StoragePage({
  scene,
  opacity,
  entryProgress,
}: {
  scene: SceneModel;
  opacity: number;
  entryProgress: number;
}) {
  const reveal = resolveWindowProgress(entryProgress, 0.08, 0.9, easeOutQuint);
  const panelOpacity = opacity * reveal;
  const leftCard = {x: 96, y: 146, width: 596, height: 402, radius: 28};
  const rightCard1 = {x: 720, y: 146, width: 408, height: 114, radius: 24};
  const rightCard2 = {x: 720, y: 280, width: 408, height: 114, radius: 24};
  const rightCard3 = {x: 720, y: 414, width: 408, height: 134, radius: 24};
  const memoryBox = {x: leftCard.x + 24, y: leftCard.y + 76, width: 252, height: 228, radius: 24};
  const diskBox = {x: leftCard.x + 320, y: leftCard.y + 76, width: 252, height: 228, radius: 24};
  const memoryHotBox = {x: memoryBox.x + 18, y: memoryBox.y + 54, width: 216, height: 52, radius: 18};
  const memorySwapBox = {x: memoryBox.x + 18, y: memoryBox.y + 122, width: 216, height: 74, radius: 18};
  const diskMapBox = {x: diskBox.x + 18, y: diskBox.y + 54, width: 216, height: 52, radius: 18};
  const diskCarrierBox = {x: diskBox.x + 18, y: diskBox.y + 122, width: 216, height: 74, radius: 18};

  return (
    <PlaceholderBoardShell opacity={panelOpacity}>
      <g transform={`translate(0 ${LATE_INLINE_TITLE_REMOVAL_SHIFT_Y})`}>
        <g
          data-geometry-node-id="left-card"
          data-geometry-node-label="Storage Strategy"
        >
          <StageBox
            box={leftCard}
            fill="rgba(255, 255, 255, 0.92)"
            stroke="rgba(92, 106, 118, 0.4)"
            strokeWidth={2.1}
            markGeometryBox
          />
          <text
            x={leftCard.x + 18}
            y={leftCard.y + 24}
            fill={scene.apiStroke}
            fontSize="20"
            fontWeight="820"
            textAnchor="start"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            PSO 内落地：选取逻辑 + 映射机制 + 外存载体
          </text>
          <g data-geometry-node-id="memory" data-geometry-node-label="Memory">
            <StageBox
              box={memoryBox}
              fill="rgba(255, 248, 240, 0.9)"
              stroke={scene.apiStroke}
              strokeWidth={2.2}
              markGeometryBox
            />
            <text
              x={centerX(memoryBox)}
              y={memoryBox.y + 22}
              fill="#22303d"
              fontSize="18"
              fontWeight="780"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              内存驻留区
            </text>
            <StageBox
              box={memoryHotBox}
              fill="rgba(248, 236, 226, 0.96)"
              stroke={scene.apiStroke}
              strokeWidth={2.4}
            />
            <StageBox
              box={memorySwapBox}
              fill="rgba(255, 251, 246, 0.94)"
              stroke="rgba(92, 106, 118, 0.42)"
              strokeWidth={1.9}
            />
            <text
              x={centerX(memoryHotBox)}
              y={centerY(memoryHotBox)}
              fill={scene.apiStroke}
              fontSize="18"
              fontWeight="760"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              高频常驻
            </text>
            <text
              x={centerX(memorySwapBox)}
              y={memorySwapBox.y + 24}
              fill="#22303d"
              fontSize="17"
              fontWeight="740"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              可替换缓存
            </text>
            <text
              x={centerX(memorySwapBox)}
              y={memorySwapBox.y + 46}
              fill="rgba(34, 48, 61, 0.7)"
              fontSize="14"
              fontWeight="650"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              谁该留下，谁该换出
            </text>
          </g>
          <g data-geometry-node-id="disk" data-geometry-node-label="IO">
            <StageBox
              box={diskBox}
              fill="rgba(249, 247, 244, 0.94)"
              stroke="rgba(92, 106, 118, 0.42)"
              strokeWidth={2}
              markGeometryBox
            />
            <text
              x={centerX(diskBox)}
              y={diskBox.y + 22}
              fill="#22303d"
              fontSize="18"
              fontWeight="780"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              外存 / IO
            </text>
            <StageBox
              box={diskMapBox}
              fill="rgba(255, 251, 246, 0.94)"
              stroke="rgba(92, 106, 118, 0.42)"
              strokeWidth={1.9}
            />
            <StageBox
              box={diskCarrierBox}
              fill="rgba(255, 251, 246, 0.94)"
              stroke="rgba(92, 106, 118, 0.42)"
              strokeWidth={1.9}
            />
            <text
              x={centerX(diskMapBox)}
              y={centerY(diskMapBox)}
              fill="#22303d"
              fontSize="17"
              fontWeight="740"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              映射视图 / 虚拟内存
            </text>
            <text
              x={centerX(diskCarrierBox)}
              y={diskCarrierBox.y + 24}
              fill="#22303d"
              fontSize="17"
              fontWeight="740"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              文件 / SQL / KV
            </text>
            <text
              x={centerX(diskCarrierBox)}
              y={diskCarrierBox.y + 46}
              fill="rgba(34, 48, 61, 0.7)"
              fontSize="14"
              fontWeight="650"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              外存只是承载面
            </text>
          </g>
          <StrokeArrow
            d={horizontalPath(right(memoryBox) + 12, diskBox.x - 12, memoryBox.y + 96)}
            stroke={scene.apiStroke}
            opacity={panelOpacity}
            headOpacity={panelOpacity}
            tipX={diskBox.x - 12}
            tipY={memoryBox.y + 96}
            direction="right"
            shaftWidth={2.8}
            underlayWidth={5.2}
            headSize={7}
          />
          <StrokeArrow
            d={horizontalPath(right(memoryBox) + 12, diskBox.x - 12, memoryBox.y + 170)}
            stroke={scene.apiStroke}
            opacity={panelOpacity}
            headOpacity={panelOpacity}
            tipX={right(memoryBox) + 12}
            tipY={memoryBox.y + 170}
            direction="left"
            shaftWidth={2.8}
            underlayWidth={5.2}
            headSize={7}
          />
          <text
            x={centerX(leftCard)}
            y={memoryBox.y + 78}
            fill="rgba(34, 48, 61, 0.7)"
            fontSize="15.5"
            fontWeight="720"
            textAnchor="middle"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            换出
          </text>
          <text
            x={centerX(leftCard)}
            y={memoryBox.y + 154}
            fill="rgba(34, 48, 61, 0.7)"
            fontSize="15.5"
            fontWeight="720"
            textAnchor="middle"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            按需回填
          </text>
          <text
            x={leftCard.x + 28}
            y={leftCard.y + 374}
            fill="rgba(34, 48, 61, 0.72)"
            fontSize="17"
            fontWeight="700"
            textAnchor="start"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            LRU 只是“谁先走”的规则；mmap / paging 才是“怎么回来”的路径。
          </text>
        </g>
        <LateInfoCard
          scene={scene}
          box={rightCard1}
          title="选取逻辑"
          lines={["LRU / Clock / Pin", "决定谁该留下，谁该转去外存。"]}
          opacity={panelOpacity}
          geometryNodeId="right-1"
          compact
          accent
          bodyFontSize={17}
        />
        <LateInfoCard
          scene={scene}
          box={rightCard2}
          title="映射机制"
          lines={["mmap / paging / 虚拟内存", "决定外存数据如何重新回到地址空间。"]}
          opacity={panelOpacity}
          geometryNodeId="right-2"
          compact
          bodyFontSize={17}
        />
        <LateInfoCard
          scene={scene}
          box={rightCard3}
          title="外存载体"
          lines={["file / SQL / KV / spill", "IO 只是承载面，关键看访问形态和回填成本。"]}
          opacity={panelOpacity}
          geometryNodeId="right-3"
          compact
          bodyFontSize={17}
        />
        <LateFooterBar
          scene={scene}
          opacity={panelOpacity}
          geometryNodeId="footer"
          text="IO 换空间不是单点技巧，而是一套“选取 + 回填 + 外存”的组合方法。"
        />
      </g>
    </PlaceholderBoardShell>
  );
}

function Page26TimingPage({
  scene,
  opacity,
  entryProgress,
}: {
  scene: SceneModel;
  opacity: number;
  entryProgress: number;
}) {
  const reveal = resolveWindowProgress(entryProgress, 0.08, 0.9, easeOutQuint);
  const panelOpacity = opacity * reveal;
  const leftCard = {x: 96, y: 146, width: 566, height: 402, radius: 28};
  const rightCard1 = {x: 690, y: 146, width: 426, height: 114, radius: 24};
  const rightCard2 = {x: 690, y: 280, width: 426, height: 114, radius: 24};
  const rightCard3 = {x: 690, y: 414, width: 426, height: 134, radius: 24};
  const gameMaskBox = {x: leftCard.x + 24, y: leftCard.y + 62, width: 228, height: 212, radius: 22};
  const compileMaskBox = {x: leftCard.x + 276, y: leftCard.y + 62, width: 266, height: 212, radius: 22};
  const compileBanner = {x: leftCard.x + 24, y: leftCard.y + 298, width: 518, height: 60, radius: 18};

  return (
    <PlaceholderBoardShell opacity={panelOpacity}>
      <g transform={`translate(0 ${LATE_INLINE_TITLE_REMOVAL_SHIFT_Y})`}>
        <g
          data-geometry-node-id="left-card"
          data-geometry-node-label="Mask Decouple"
        >
          <StageBox
            box={leftCard}
            fill="rgba(255, 255, 255, 0.92)"
            stroke="rgba(92, 106, 118, 0.4)"
            strokeWidth={2.1}
            markGeometryBox
          />
          <text
            x={leftCard.x + 18}
            y={leftCard.y + 24}
            fill={scene.apiStroke}
            fontSize="20"
            fontWeight="820"
            textAnchor="start"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            双 UsageMask：收集与编译解耦
          </text>
          <g
            data-geometry-node-id="game-mask"
            data-geometry-node-label="Game Mask"
          >
            <StageBox
              box={gameMaskBox}
              fill="rgba(255, 248, 240, 0.92)"
              stroke={scene.apiStroke}
              strokeWidth={2.2}
              markGeometryBox
            />
            <text
              x={centerX(gameMaskBox)}
              y={gameMaskBox.y + 24}
              fill="#22303d"
              fontSize="18"
              fontWeight="800"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              Game UsageMask
            </text>
            {[
              {label: "地图 A", game: "●", compile: "●"},
              {label: "地图 B", game: "·", compile: "●"},
            ].map((row, index) => {
              const y = gameMaskBox.y + 92 + index * 64;
              return (
                <g key={`mask-row-game-${row.label}`}>
                  <text
                    x={gameMaskBox.x + 168}
                    y={y}
                    fill={scene.apiStroke}
                    fontSize="28"
                    fontWeight="820"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    data-geometry-node-text="1"
                  >
                    {row.game}
                  </text>
                </g>
              );
            })}
          </g>
          <g
            data-geometry-node-id="compile-mask"
            data-geometry-node-label="Compile Mask"
          >
            <StageBox
              box={compileMaskBox}
              fill="rgba(249, 247, 244, 0.94)"
              stroke="rgba(92, 106, 118, 0.42)"
              strokeWidth={2.1}
              markGeometryBox
            />
            <text
              x={centerX(compileMaskBox)}
              y={compileMaskBox.y + 24}
              fill="#22303d"
              fontSize="18"
              fontWeight="800"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              Compile UsageMask
            </text>
            {[
              {label: "地图 A", game: "●", compile: "●"},
              {label: "地图 B", game: "·", compile: "●"},
            ].map((row, index) => {
              const y = gameMaskBox.y + 92 + index * 64;
              return (
                <g key={`mask-row-compile-${row.label}`}>
                  <text
                    x={compileMaskBox.x + 186}
                    y={y}
                    fill={scene.apiStroke}
                    fontSize="28"
                    fontWeight="820"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    data-geometry-node-text="1"
                  >
                    {row.compile}
                  </text>
                </g>
              );
            })}
          </g>
          {[
            {label: "地图 A", game: "●", compile: "●"},
            {label: "地图 B", game: "·", compile: "●"},
          ].map((row, index) => {
            const y = gameMaskBox.y + 92 + index * 64;
            return (
              <text
                key={`mask-row-label-${row.label}`}
                x={leftCard.x + 44}
                y={y}
                fill="#22303d"
                fontSize="20"
                fontWeight="760"
                textAnchor="start"
                dominantBaseline="middle"
                data-geometry-node-text="1"
              >
                {row.label}
              </text>
            );
          })}
          <g
            data-geometry-node-id="download-pill"
            data-geometry-node-label="Download Compile"
          >
            <StageBox
              box={compileBanner}
              fill="rgba(248, 236, 226, 0.92)"
              stroke={scene.apiStroke}
              strokeWidth={2}
              markGeometryBox
            />
            <text
              x={centerX(compileBanner)}
              y={centerY(compileBanner)}
              fill={scene.apiStroke}
              fontSize="18"
              fontWeight="760"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              下载资源 && 编译 可以并行隐藏
            </text>
          </g>
        </g>
        <LateInfoCard
          scene={scene}
          box={rightCard1}
          title="Lazy Load"
          lines={["延迟的是资源加载", "不用时不付成本，要用时再触发。"]}
          opacity={panelOpacity}
          geometryNodeId="right-1"
          compact
          accent
          bodyFontSize={17}
        />
        <LateInfoCard
          scene={scene}
          box={rightCard2}
          title="Streaming"
          lines={["延迟的是内容驻留", "世界分区或区域进入内存都属于这一类。"]}
          opacity={panelOpacity}
          geometryNodeId="right-2"
          compact
          bodyFontSize={17}
        />
        <LateInfoCard
          scene={scene}
          box={rightCard3}
          title="Deferred / Async Compile"
          lines={["延迟的是编译成本", "编译可能迟到，但不必和收集强绑定。"]}
          opacity={panelOpacity}
          geometryNodeId="right-3"
          compact
          bodyFontSize={17}
        />
        <LateFooterBar
          scene={scene}
          opacity={panelOpacity}
          geometryNodeId="footer"
          text="这里优化的不是“做不做”，而是“什么时候做”。"
        />
      </g>
    </PlaceholderBoardShell>
  );
}

function Page27ParallelPage({
  scene,
  opacity,
  entryProgress,
}: {
  scene: SceneModel;
  opacity: number;
  entryProgress: number;
}) {
  const reveal = resolveWindowProgress(entryProgress, 0.08, 0.9, easeOutQuint);
  const panelOpacity = opacity * reveal;
  const leftCard = {x: 94, y: 144, width: 604, height: 406, radius: 28};
  const rightTop = {x: 726, y: 144, width: 398, height: 158, radius: 24};
  const rightBottom = {x: 726, y: 322, width: 398, height: 228, radius: 24};
  const queueBox = {x: leftCard.x + 34, y: leftCard.y + 98, width: 148, height: 160, radius: 22};
  const workerBoxes = [
    {x: leftCard.x + 252, y: leftCard.y + 84, width: 128, height: 62, radius: 18},
    {x: leftCard.x + 252, y: leftCard.y + 160, width: 128, height: 62, radius: 18},
    {x: leftCard.x + 252, y: leftCard.y + 236, width: 128, height: 62, radius: 18},
  ];
  const doneBox = {x: leftCard.x + 438, y: leftCard.y + 126, width: 148, height: 126, radius: 22};
  const spectrumY = leftCard.y + 344;

  return (
    <PlaceholderBoardShell opacity={panelOpacity}>
      <g transform={`translate(0 ${LATE_INLINE_TITLE_REMOVAL_SHIFT_Y})`}>
        <g
          data-geometry-node-id="left-card"
          data-geometry-node-label="Parallel"
        >
          <StageBox
            box={leftCard}
            fill="rgba(255, 255, 255, 0.92)"
            stroke="rgba(92, 106, 118, 0.4)"
            strokeWidth={2.1}
            markGeometryBox
          />
          <text
            x={leftCard.x + 18}
            y={leftCard.y + 24}
            fill={scene.apiStroke}
            fontSize="20"
            fontWeight="820"
            textAnchor="start"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            预编译任务天然适合并行
          </text>
          <g data-geometry-node-id="queue" data-geometry-node-label="Queue">
            <StageBox
              box={queueBox}
              fill="rgba(255, 248, 240, 0.92)"
              stroke={scene.apiStroke}
              strokeWidth={2.2}
              markGeometryBox
            />
            <StackedLabel
              x={centerX(queueBox)}
              y={centerY(queueBox)}
              lines={["Single", "Queue"]}
              fontSize={24}
              fontWeight={780}
              lineGap={21}
              markGeometryText
            />
          </g>
          {workerBoxes.map((box, index) => (
            <g
              key={`worker-${index}`}
              data-geometry-node-id={`worker-${index + 1}`}
              data-geometry-node-label={`Worker${index + 1}`}
            >
              <StageBox
                box={box}
                fill="rgba(249, 247, 244, 0.94)"
                stroke="rgba(92, 106, 118, 0.4)"
                strokeWidth={2}
                markGeometryBox
              />
              <text
                x={centerX(box)}
                y={centerY(box)}
                fill="#22303d"
                fontSize="20"
                fontWeight="760"
                textAnchor="middle"
                dominantBaseline="middle"
                data-geometry-node-text="1"
              >
                {`Worker ${index + 1}`}
              </text>
            </g>
          ))}
          <g data-geometry-node-id="done" data-geometry-node-label="Done">
            <StageBox
              box={doneBox}
              fill="rgba(249, 247, 244, 0.94)"
              stroke="rgba(92, 106, 118, 0.4)"
              strokeWidth={2}
              markGeometryBox
            />
            <StackedLabel
              x={centerX(doneBox)}
              y={centerY(doneBox)}
              lines={["More", "Throughput"]}
              fontSize={20}
              fontWeight={780}
              lineGap={18}
              markGeometryText
            />
          </g>
        </g>
        {workerBoxes.map((box) => (
          <StrokeArrow
            key={`queue-arrow-${box.x}-${box.y}`}
            d={horizontalPath(right(queueBox) + 8, box.x - 8, centerY(box))}
            stroke={scene.apiStroke}
            opacity={panelOpacity}
            headOpacity={panelOpacity}
            tipX={box.x - 8}
            tipY={centerY(box)}
            direction="right"
            shaftWidth={2.5}
            underlayWidth={4.8}
            headSize={6.6}
          />
        ))}
        {workerBoxes.map((box) => (
          <StrokeArrow
            key={`done-arrow-${box.x}-${box.y}`}
            d={horizontalPath(right(box) + 8, doneBox.x - 8, centerY(box))}
            stroke="rgba(92, 106, 118, 0.74)"
            opacity={panelOpacity}
            headOpacity={panelOpacity}
            tipX={doneBox.x - 8}
            tipY={centerY(box)}
            direction="right"
            shaftWidth={2.4}
            underlayWidth={4.4}
            headSize={6.4}
          />
        ))}
        {["SIMD", "Thread", "GPU"].map((label, index) => {
          const box = {x: leftCard.x + 46 + index * 174, y: spectrumY, width: 136, height: 42, radius: 20};
          return <FloatingPill key={label} scene={scene} box={box} label={label} opacity={panelOpacity} accent={index === 1} />;
        })}
        <LateInfoCard
          scene={scene}
          box={rightTop}
          title="适用特征"
          lines={["独立", "重复", "规则", "可拆"]}
          opacity={panelOpacity}
          geometryNodeId="right-1"
          compact
          accent
          bodyFontSize={18}
          lineGapOverride={24}
        />
        <LateInfoCard
          scene={scene}
          box={rightBottom}
          title="注意事项"
          lines={PARALLEL_NOTES}
          opacity={panelOpacity}
          geometryNodeId="right-2"
          compact
          bodyFontSize={18}
          lineGapOverride={26}
        />
        <a href="https://zhuanlan.zhihu.com/p/384272799" target="_blank" rel="noreferrer">
          <text
            x={rightTop.x + 18}
            y={rightBottom.y + rightBottom.height - 18}
            fill={scene.apiStroke}
            fontSize="15"
            fontWeight="760"
            textAnchor="start"
            dominantBaseline="middle"
            textDecoration="underline"
          >
            CUDA 补充链接
          </text>
        </a>
        <LateFooterBar
          scene={scene}
          opacity={panelOpacity}
          geometryNodeId="footer"
          text="并行不是改业务逻辑，而是在合适的任务上换一种执行方式。"
        />
      </g>
    </PlaceholderBoardShell>
  );
}

function EndingLinkItem({
  x,
  y,
  title,
  subtitle,
  href,
  geometryNodeId,
  markGeometryText = false,
  titleFontSize = 24,
  subtitleFontSize = 17,
  subtitleOffset = 28,
}: {
  x: number;
  y: number;
  title: string;
  subtitle: string;
  href?: string;
  geometryNodeId?: string;
  markGeometryText?: boolean;
  titleFontSize?: number;
  subtitleFontSize?: number;
  subtitleOffset?: number;
}) {
  const titleNode = (
    <text
      x={x}
      y={y}
      fill="#21303d"
      fontSize={titleFontSize}
      fontWeight="780"
      textAnchor="start"
      dominantBaseline="middle"
      textDecoration={href ? "underline" : undefined}
      data-geometry-node-text={geometryNodeId || markGeometryText ? "1" : undefined}
    >
      {title}
    </text>
  );

  return (
    <g
      data-geometry-node-id={geometryNodeId}
      data-geometry-node-label={geometryNodeId ? title : undefined}
    >
      {geometryNodeId ? (
        <g data-geometry-node-box="1">
          <rect
            x={x - 4}
            y={y - Math.max(titleFontSize, subtitleFontSize)}
            width={520}
            height={subtitleOffset + subtitleFontSize + 8}
            rx={8}
            fill="transparent"
            stroke="none"
          />
        </g>
      ) : null}
      {href ? (
        <a href={href} target="_blank" rel="noreferrer">
          {titleNode}
        </a>
      ) : (
        titleNode
      )}
      <text
        x={x}
        y={y + subtitleOffset}
        fill="rgba(34, 48, 61, 0.72)"
        fontSize={subtitleFontSize}
        fontWeight="650"
        textAnchor="start"
        dominantBaseline="middle"
        data-geometry-node-text={geometryNodeId || markGeometryText ? "1" : undefined}
      >
        {subtitle}
      </text>
    </g>
  );
}

function Page28GovernanceSurfacePage({
  scene,
  opacity,
  entryProgress,
}: {
  scene: SceneModel;
  opacity: number;
  entryProgress: number;
}) {
  const reveal = resolveWindowProgress(entryProgress, 0.08, 0.9, easeOutQuint);
  const panelOpacity = opacity * reveal;
  const sampleAImage = {x: 96, y: 172, width: 500, height: 148, radius: 18};
  const sampleBImage = {x: 96, y: 348, width: 500, height: 148, radius: 18};
  const rightCard = {x: 608, y: 160, width: 574, height: 390, radius: 24};
  const shaderBox = {x: rightCard.x + 24, y: rightCard.y + 72, width: 526, height: 54, radius: 18};
  const stateBoxes = [
    {
      title: "Vertex Decl / Input Layout",
      detail: "输入布局、ATTRIBUTE、stride",
      box: {x: rightCard.x + 24, y: rightCard.y + 156, width: 258, height: 64, radius: 18},
      accent: true,
    },
    {
      title: "Render Targets / Formats",
      detail: "RT / color buffer / format",
      box: {x: rightCard.x + 292, y: rightCard.y + 156, width: 258, height: 64, radius: 18},
      accent: false,
    },
    {
      title: "Depth / Stencil",
      detail: "depth test / stencil state",
      box: {x: rightCard.x + 24, y: rightCard.y + 232, width: 258, height: 64, radius: 18},
      accent: false,
    },
    {
      title: "Blend / Rasterizer",
      detail: "blend mode / cull / fill mode",
      box: {x: rightCard.x + 292, y: rightCard.y + 232, width: 258, height: 64, radius: 18},
      accent: false,
    },
    {
      title: "Primitive / Samples / Pass",
      detail: "primitive type / MSAA / render pass",
      box: {x: rightCard.x + 24, y: rightCard.y + 308, width: 526, height: 64, radius: 18},
      accent: false,
    },
  ] as const;

  return (
    <PlaceholderBoardShell opacity={panelOpacity}>
      <g transform={`translate(0 ${LATE_INLINE_TITLE_REMOVAL_SHIFT_Y})`}>
        <LateBareImage
          scene={scene}
          box={sampleAImage}
          title="样本 A"
          href="/supplement/ogl-mtl/opengl-compile-count.png"
          clipId="page28-sample-a"
          opacity={panelOpacity}
          geometryNodeId="image-1"
          geometryNodeLabel="SampleA"
          preserveAspectRatio="xMidYMid meet"
          titleFontSize={17}
        />
        <LateBareImage
          scene={scene}
          box={sampleBImage}
          title="样本 B"
          href="/supplement/ogl-mtl/ios-compile-count.png"
          clipId="page28-sample-b"
          opacity={panelOpacity}
          geometryNodeId="image-2"
          geometryNodeLabel="SampleB"
          preserveAspectRatio="xMidYMid meet"
          titleFontSize={17}
        />
        <g
          data-geometry-node-id="right-card"
          data-geometry-node-label="PSOState"
        >
          <StageBox
            box={rightCard}
            fill="rgba(255, 255, 255, 0.92)"
            stroke="rgba(92, 106, 118, 0.38)"
            strokeWidth={2}
            markGeometryBox
          />
          <text
            x={rightCard.x + 22}
            y={rightCard.y + 26}
            fill={scene.apiStroke}
            fontSize="22"
            fontWeight="820"
            textAnchor="start"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            PSO = Shader + State
          </text>
          <text
            x={rightCard.x + 22}
            y={rightCard.y + 52}
            fill="rgba(34, 48, 61, 0.78)"
            fontSize="17.5"
            fontWeight="720"
            textAnchor="start"
            dominantBaseline="middle"
            data-geometry-node-text="1"
        >
          Shader / Function 只是其中一块，PSO 分叉还受整套 state 影响。
        </text>
          <g data-geometry-node-id="shader" data-geometry-node-label="Shader">
            <StageBox
              box={shaderBox}
              fill="rgba(248, 236, 226, 0.94)"
              stroke={scene.apiStroke}
              strokeWidth={2.4}
              markGeometryBox
            />
            <text
              x={centerX(shaderBox)}
              y={centerY(shaderBox)}
              fill={scene.apiStroke}
              fontSize="19"
              fontWeight="780"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              Shader / Program / Function
            </text>
          </g>
          <text
            x={rightCard.x + 24}
            y={rightCard.y + 138}
            fill="rgba(34, 48, 61, 0.72)"
            fontSize="16.5"
            fontWeight="720"
            textAnchor="start"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            State 里常见会收什么
          </text>
          {stateBoxes.map((item, index) => (
            <g
              key={item.title}
              data-geometry-node-id={`state-${index + 1}`}
              data-geometry-node-label={item.title}
            >
              <StageBox
                box={item.box}
                fill={item.accent ? "rgba(248, 236, 226, 0.94)" : "rgba(255, 251, 246, 0.94)"}
                stroke={item.accent ? scene.apiStroke : "rgba(92, 106, 118, 0.38)"}
                strokeWidth={item.accent ? 2.3 : 1.9}
                markGeometryBox
              />
              <text
                x={item.box.x + 16}
                y={item.box.y + 23}
                fill={item.accent ? scene.apiStroke : "#22303d"}
                fontSize="16.5"
                fontWeight="770"
                textAnchor="start"
                dominantBaseline="middle"
                data-geometry-node-text="1"
              >
                {item.title}
              </text>
              <text
                x={item.box.x + 16}
                y={item.box.y + 48}
                fill="rgba(34, 48, 61, 0.72)"
                fontSize="14.5"
                fontWeight="670"
                textAnchor="start"
                dominantBaseline="middle"
                data-geometry-node-text="1"
              >
                {item.detail}
              </text>
            </g>
          ))}
        </g>
        <LateFooterBar
          scene={scene}
          opacity={panelOpacity}
          geometryNodeId="footer"
          text="仅仅 state 里的这些维度，就足以让“同样内容”在不同平台上分叉成不同 PSO。"
        />
      </g>
    </PlaceholderBoardShell>
  );
}

function Page29GovernanceSourcePage({
  scene,
  opacity,
  entryProgress,
}: {
  scene: SceneModel;
  opacity: number;
  entryProgress: number;
}) {
  const reveal = resolveWindowProgress(entryProgress, 0.08, 0.92, easeOutQuint);
  const panelOpacity = opacity * reveal;
  const leftCode = {x: 88, y: 140, width: 504, height: 440, radius: 26};
  const rightCode = {x: 610, y: 140, width: 538, height: 440, radius: 26};

  return (
    <PlaceholderBoardShell opacity={panelOpacity}>
      <g transform={`translate(0 ${LATE_INLINE_TITLE_REMOVAL_SHIFT_Y})`}>
        <LateCodeCard
          scene={scene}
          box={leftCode}
          title="VertexDescriptor / InitRHI"
          lines={VERTEX_DESCRIPTOR_CODE_LINES}
          opacity={panelOpacity}
          geometryNodeId="left-code"
          titleFontSize={19}
          codeFontSize={15}
          lineHeight={25}
        />
        <LateCodeCard
          scene={scene}
          box={rightCode}
          title="LocalVertexFactory.ush"
          lines={LOCAL_VERTEX_FACTORY_CODE_LINES}
          opacity={panelOpacity}
          geometryNodeId="right-code"
          titleFontSize={19}
          codeFontSize={15.5}
          lineHeight={25}
        />
        {["ATTRIBUTE4", "ATTRIBUTE5", "ATTRIBUTE6", "ATTRIBUTE7"].map((label, index) => {
          const box = {x: 648 + index * 126, y: 552, width: 122, height: 38, radius: 19};
          return (
            <MicroToken
              key={label}
              scene={scene}
              box={box}
              label={label}
              opacity={panelOpacity}
              geometryNodeId={`token-${index + 4}`}
              fontSize={15.5}
              accent={index === 0}
            />
          );
        })}
        <LateFooterBar
          scene={scene}
          opacity={panelOpacity}
          geometryNodeId="footer"
          text="同一个 material，不代表同一个 PSO。"
        />
      </g>
    </PlaceholderBoardShell>
  );
}

function Page30GovernanceConclusionPage({
  scene,
  opacity,
  entryProgress,
}: {
  scene: SceneModel;
  opacity: number;
  entryProgress: number;
}) {
  const reveal = resolveWindowProgress(entryProgress, 0.08, 0.9, easeOutQuint);
  const panelOpacity = opacity * reveal;
  const leftImage = {x: 86, y: 144, width: 516, height: 292, radius: 18};
  const rightImage = {x: 678, y: 144, width: 516, height: 292, radius: 18};
  const noteCard = {x: 88, y: 458, width: 1104, height: 100, radius: 24};

  return (
    <PlaceholderBoardShell opacity={panelOpacity}>
      <g transform={`translate(0 ${LATE_INLINE_TITLE_REMOVAL_SHIFT_Y})`}>
        <LateBareImage
          scene={scene}
          box={leftImage}
          title={undefined}
          href="/supplement/ogl-mtl/uv-stride4-ia.png"
          clipId="page30-uv4"
          opacity={panelOpacity}
          preserveAspectRatio="xMidYMid meet"
          titleFontSize={18}
        />
        <LateBareImage
          scene={scene}
          box={rightImage}
          title={undefined}
          href="/supplement/ogl-mtl/uv-stride8-ia.png"
          clipId="page30-uv8"
          opacity={panelOpacity}
          preserveAspectRatio="xMidYMid meet"
          titleFontSize={18}
        />
        <LateInfoCard
          scene={scene}
          box={noteCard}
          title="治理结论"
          lines={[
            "只要 stride / declaration 改了，后面往往就不再是同一组 PSO。",
            "除了 UV / declaration，color buffer 等状态也会继续影响结果。",
          ]}
          opacity={panelOpacity}
          geometryNodeId="note"
          compact
          accent
          titleFontSize={21}
          bodyFontSize={17}
        />
        {GOVERNANCE_DIMENSION_TOKENS.map((label, index) => {
          const tokenBox = {
            x: noteCard.x + 18 + index * 270,
            y: 564,
            width: 202,
            height: 38,
            radius: 14,
          };
          return (
            <MicroToken
              key={`governance-dimension-${label}`}
              scene={scene}
              box={tokenBox}
              label={label}
              opacity={panelOpacity}
              geometryNodeId={["token-uv", "token-vd", "token-material", "token-color"][index]}
              fontSize={16}
              accent={index === 1}
            />
          );
        })}
        <LateFooterBar
          scene={scene}
          opacity={panelOpacity}
          geometryNodeId="footer"
          text="最好的优化不是后置补救，而是前面就把输入约束好。"
        />
      </g>
    </PlaceholderBoardShell>
  );
}

function Page31HarnessPage({
  scene,
  opacity,
  entryProgress,
}: {
  scene: SceneModel;
  opacity: number;
  entryProgress: number;
}) {
  const reveal = resolveWindowProgress(entryProgress, 0.08, 0.9, easeOutQuint);
  const panelOpacity = opacity * reveal;
  const leftCard = {x: 92, y: 138, width: 512, height: 418, radius: 28};
  const rightCard = {x: 634, y: 138, width: 528, height: 418, radius: 28};
  const chainBoxes = HARNESS_CHAIN_LABELS.map((label, index) => ({
    label,
    box: {x: leftCard.x + 34, y: leftCard.y + 72 + index * 108, width: 444, height: 60, radius: 20},
  }));

  return (
    <PlaceholderBoardShell opacity={panelOpacity}>
      <g transform={`translate(0 ${LATE_INLINE_TITLE_REMOVAL_SHIFT_Y})`}>
        <g
          data-geometry-node-id="left-card"
          data-geometry-node-label="Review Chain"
        >
          <StageBox
            box={leftCard}
            fill="rgba(255, 255, 255, 0.92)"
            stroke="rgba(92, 106, 118, 0.4)"
            strokeWidth={2.1}
            markGeometryBox
          />
          <text
            x={leftCard.x + 18}
            y={leftCard.y + 24}
            fill={scene.apiStroke}
            fontSize="20"
            fontWeight="820"
            textAnchor="start"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            评分链路
          </text>
          {chainBoxes.map(({label, box}, index) => (
            <g
              key={label}
              data-geometry-node-id={`chain-${index + 1}`}
              data-geometry-node-label={label}
            >
              <StageBox
                box={box}
                fill={index === 0 ? "rgba(248, 236, 226, 0.96)" : "rgba(249, 247, 244, 0.94)"}
                stroke={index === 0 ? scene.apiStroke : "rgba(92, 106, 118, 0.42)"}
                strokeWidth={index === 0 ? 2.3 : 2}
                markGeometryBox
              />
              <text
                x={centerX(box)}
                y={centerY(box)}
                fill={index === 0 ? scene.apiStroke : "#22303d"}
                fontSize="20"
                fontWeight="770"
                textAnchor="middle"
                dominantBaseline="middle"
                data-geometry-node-text="1"
              >
                {label}
              </text>
              {index < chainBoxes.length - 1 ? (
                <StrokeArrow
                  d={verticalPath(centerX(box), bottom(box) + 6, chainBoxes[index + 1]!.box.y - 8)}
                  stroke={scene.apiStroke}
                  opacity={panelOpacity}
                  headOpacity={panelOpacity}
                  tipX={centerX(box)}
                  tipY={chainBoxes[index + 1]!.box.y - 8}
                  direction="down"
                  shaftWidth={2.5}
                  underlayWidth={4.8}
                  headSize={6.8}
                />
              ) : null}
            </g>
          ))}
          <text
            x={leftCard.x + 34}
            y={leftCard.y + 382}
            fill="rgba(34, 48, 61, 0.72)"
            fontSize="17.5"
            fontWeight="700"
            textAnchor="start"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            三层 Review：整体布局 / 模块空间结构 / 单节点与单边
          </text>
        </g>
        <g
          data-geometry-node-id="right-card"
          data-geometry-node-label="Math Rules"
        >
          <StageBox
            box={rightCard}
            fill="rgba(255, 255, 255, 0.92)"
            stroke="rgba(92, 106, 118, 0.4)"
            strokeWidth={2.1}
            markGeometryBox
          />
          <text
            x={rightCard.x + 18}
            y={rightCard.y + 24}
            fill={scene.apiStroke}
            fontSize="20"
            fontWeight="820"
            textAnchor="start"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            数学约束
          </text>
          {HARNESS_FORMULA_LINES.map((line, index) => (
            <text
              key={line}
              x={rightCard.x + 18}
              y={rightCard.y + 74 + index * 38}
              fill="#22303d"
              fontFamily="SFMono-Regular, Menlo, Consolas, monospace"
              fontSize="16.5"
              fontWeight="680"
              textAnchor="start"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              {line}
            </text>
          ))}
        {HARNESS_GATES.map((label, index) => {
          const box = {
            x: rightCard.x + 22 + (index % 2) * 244,
            y: rightCard.y + 250 + Math.floor(index / 2) * 56,
            width: 220,
            height: 44,
            radius: 18,
          };
          return (
            <MicroToken
              key={label}
              scene={scene}
              box={box}
              label={label}
              opacity={panelOpacity}
              geometryNodeId={`gate-${index + 1}`}
              fontSize={17}
              accent={index === 0}
            />
          );
        })}
        </g>
        <LateFooterBar
          scene={scene}
          opacity={panelOpacity}
          geometryNodeId="footer"
          text="我们不是主观调图，而是先走数学约束，再做图像复核。"
        />
      </g>
    </PlaceholderBoardShell>
  );
}

function Page32ReadingPage({
  scene,
  opacity,
  entryProgress,
}: {
  scene: SceneModel;
  opacity: number;
  entryProgress: number;
}) {
  const reveal = resolveWindowProgress(entryProgress, 0.08, 0.9, easeOutQuint);
  const panelOpacity = opacity * reveal;
  const leftCard = {x: 84, y: 136, width: 504, height: 356, radius: 30};
  const rightCard = {x: 628, y: 136, width: 504, height: 356, radius: 30};
  const gameCard = {x: 84, y: 526, width: 1048, height: 116, radius: 24};

  return (
    <PlaceholderBoardShell opacity={panelOpacity}>
      <g transform={`translate(0 ${LATE_INLINE_TITLE_REMOVAL_SHIFT_Y})`}>
        <g
          data-geometry-node-id="left-card"
          data-geometry-node-label="Engineering Reading"
        >
          <StageBox
            box={leftCard}
            fill="rgba(255, 252, 247, 0.96)"
            stroke={scene.nodeStroke}
            strokeWidth={2.4}
            markGeometryBox
          />
          <text
            x={leftCard.x + 34}
            y={leftCard.y + 42}
            fill="rgba(214, 102, 48, 0.96)"
            fontSize="23"
            fontWeight="830"
            textAnchor="start"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            工程延伸
          </text>
          {ENDING_ENGINEERING_LINKS.map((item, index) => (
            <EndingLinkItem
              key={item.title}
              x={leftCard.x + 34}
              y={leftCard.y + 112 + index * 78}
              title={item.title}
              subtitle={item.subtitle}
              href={item.href}
              markGeometryText
              titleFontSize={22}
              subtitleFontSize={15.5}
              subtitleOffset={24}
            />
          ))}
        </g>
        <g
          data-geometry-node-id="right-card"
          data-geometry-node-label="Culture Reading"
        >
          <StageBox
            box={rightCard}
            fill="rgba(255, 252, 247, 0.96)"
            stroke={scene.nodeStroke}
            strokeWidth={2.4}
            markGeometryBox
          />
          <text
            x={rightCard.x + 34}
            y={rightCard.y + 42}
            fill="rgba(214, 102, 48, 0.96)"
            fontSize="23"
            fontWeight="830"
            textAnchor="start"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            书与视频
          </text>
          {ENDING_CULTURE_LINKS.map((item, index) => (
            <EndingLinkItem
              key={item.title}
              x={rightCard.x + 34}
              y={rightCard.y + 108 + index * 60}
              title={item.title}
              subtitle={item.subtitle}
              href={item.href}
              markGeometryText
              titleFontSize={21}
              subtitleFontSize={15.5}
              subtitleOffset={23}
            />
          ))}
        </g>
        <g
          data-geometry-node-id="game-card"
          data-geometry-node-label="Game Reading"
        >
          <StageBox
            box={gameCard}
            fill="rgba(255, 252, 247, 0.96)"
            stroke={scene.nodeStroke}
            strokeWidth={2.2}
            markGeometryBox
          />
          <text
            x={gameCard.x + 34}
            y={gameCard.y + 26}
            fill="rgba(214, 102, 48, 0.96)"
            fontSize="22"
            fontWeight="830"
            textAnchor="start"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            推荐游戏
          </text>
          <line
            x1={centerX(gameCard)}
            y1={gameCard.y + 20}
            x2={centerX(gameCard)}
            y2={gameCard.y + gameCard.height - 20}
            stroke="rgba(92, 106, 118, 0.26)"
            strokeWidth="1.6"
          />
          {ENDING_GAME_LINKS.map((item, index) => (
            <EndingLinkItem
              key={item.title}
              x={gameCard.x + 34 + index * 512}
              y={gameCard.y + 68}
              title={item.title}
              subtitle={item.subtitle}
              href={item.href}
              markGeometryText
              titleFontSize={20}
              subtitleFontSize={15}
              subtitleOffset={21}
            />
          ))}
        </g>
      </g>
    </PlaceholderBoardShell>
  );
}

function Page33QuotePage({
  scene,
  opacity,
  entryProgress,
}: {
  scene: SceneModel;
  opacity: number;
  entryProgress: number;
}) {
  const reveal = resolveWindowProgress(entryProgress, 0.12, 0.92, easeOutQuint);
  const panelOpacity = opacity * reveal;

  return (
    <PlaceholderBoardShell opacity={panelOpacity}>
      <g transform={`translate(0 ${LATE_CLOSING_QUOTE_SHIFT_Y})`}>
        <g data-geometry-node-id="quote" data-geometry-node-label="Closing Quote">
          <g data-geometry-node-box="1">
            <rect
              x={192}
              y={152}
              width={896}
              height={398}
              rx={24}
              fill="transparent"
              stroke="none"
            />
          </g>
          {ZHUANGZI_CLOSING_LINES.map((line, index) => (
            <text
              key={line}
              x={centerX(PLACEHOLDER_BOARD)}
              y={196 + index * 86}
              fill="#22303d"
              fontSize={index < 2 ? "39" : "43"}
              fontWeight={index < 2 ? "730" : "790"}
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              {line}
            </text>
          ))}
        </g>
        <g
          data-geometry-node-id="footer"
          data-geometry-node-label="Quote Footer"
        >
          <g data-geometry-node-box="1">
            <rect
              x={430}
              y={566}
              width={420}
              height={52}
              rx={12}
              fill="transparent"
              stroke="none"
            />
          </g>
          <text
            x={centerX(PLACEHOLDER_BOARD)}
            y="594"
            fill="rgba(34, 48, 61, 0.56)"
            fontSize="21"
            fontWeight="640"
            textAnchor="middle"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            以此作为这次分享的最后一句。
          </text>
        </g>
      </g>
    </PlaceholderBoardShell>
  );
}

export function Page10Scene({scene}: {scene: SceneModel}) {
  const frame = scene.frame;
  const page09ImageReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE09_FRAME,
    LOOP_PAGE09_IMAGE_FRAME,
  );
  const page10RawReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE09_IMAGE_FRAME,
    LOOP_PAGE10_FRAME,
  );
  const page10RestoreReveal = resolveWindowProgress(
    page10RawReveal,
    0.04,
    0.34,
    easeInOutCubic,
  );
  const introProgress = resolveWindowProgress(
    page10RawReveal,
    0.4,
    1,
    easeInOutCubic,
  );
  const page11Reveal = scene.settledPage1011Progress ?? 0;
  const page12Reveal = scene.settledPage1112Progress ?? 0;
  const page13Reveal = scene.settledPage1213Progress ?? 0;
  const page14PlaceholderReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE13_FRAME,
    LOOP_PAGE14_FRAME,
  );
  const page13ImageReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE14_FRAME,
    LOOP_PAGE13_IMAGE_FRAME,
  );
  const page15ImageReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE13_IMAGE_FRAME,
    LOOP_PAGE15_IMAGE_FRAME,
  );
  const page15Reveal = settledSegmentProgress(
    frame,
    LOOP_PAGE15_IMAGE_FRAME,
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
  const page18ImageReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE18_FRAME,
    LOOP_PAGE18_IMAGE_FRAME,
  );
  const page19PlaceholderReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE18_IMAGE_FRAME,
    LOOP_PAGE19_FRAME,
  );
  const page21PlaceholderReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE19_TO_PAGE21_HANDOFF_FRAME,
    LOOP_PAGE21_FRAME,
  );
  const page22PlaceholderReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE21_FRAME,
    LOOP_PAGE22_FRAME,
  );
  const page24PlaceholderReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE22_FRAME,
    LOOP_PAGE24_FRAME,
  );
  const page25PlaceholderReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE24_FRAME,
    LOOP_PAGE25_FRAME,
  );
  const page26PlaceholderReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE25_FRAME,
    LOOP_PAGE26_FRAME,
  );
  const page27PlaceholderReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE26_FRAME,
    LOOP_PAGE27_FRAME,
  );
  const page28PlaceholderReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE27_FRAME,
    LOOP_PAGE28_FRAME,
  );
  const page29PlaceholderReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE28_FRAME,
    LOOP_PAGE29_FRAME,
  );
  const page30PlaceholderReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE29_FRAME,
    LOOP_PAGE30_FRAME,
  );
  const page31PlaceholderReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE30_FRAME,
    LOOP_PAGE31_FRAME,
  );
  const page32PlaceholderReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE31_FRAME,
    LOOP_PAGE32_FRAME,
  );
  const page33PlaceholderReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE32_FRAME,
    LOOP_PAGE33_FRAME,
  );
  const page14PlaceholderVisible = resolveWindowProgress(
    page14PlaceholderReveal,
    0.08,
    0.84,
    easeInOutCubic,
  );
  const page13ImageVisible = resolveWindowProgress(
    page13ImageReveal,
    0.08,
    0.88,
    easeInOutCubic,
  );
  const page15ImageVisible = resolveWindowProgress(
    page15ImageReveal,
    0.08,
    0.88,
    easeInOutCubic,
  );
  const page18ImageVisible = resolveWindowProgress(
    page18ImageReveal,
    0.08,
    0.88,
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
  const page24PlaceholderVisible = resolveWindowProgress(
    page24PlaceholderReveal,
    0.08,
    0.88,
    easeInOutCubic,
  );
  const page25PlaceholderVisible = resolveWindowProgress(
    page25PlaceholderReveal,
    0.08,
    0.88,
    easeInOutCubic,
  );
  const page26PlaceholderVisible = resolveWindowProgress(
    page26PlaceholderReveal,
    0.08,
    0.88,
    easeInOutCubic,
  );
  const page27PlaceholderVisible = resolveWindowProgress(
    page27PlaceholderReveal,
    0.08,
    0.88,
    easeInOutCubic,
  );
  const page28PlaceholderVisible = resolveWindowProgress(
    page28PlaceholderReveal,
    0.08,
    0.88,
    easeInOutCubic,
  );
  const page29PlaceholderVisible = resolveWindowProgress(
    page29PlaceholderReveal,
    0.08,
    0.92,
    easeInOutCubic,
  );
  const page30PlaceholderVisible = resolveWindowProgress(
    page30PlaceholderReveal,
    0.08,
    0.9,
    easeInOutCubic,
  );
  const page31PlaceholderVisible = resolveWindowProgress(
    page31PlaceholderReveal,
    0.08,
    0.9,
    easeInOutCubic,
  );
  const page32PlaceholderVisible = resolveWindowProgress(
    page32PlaceholderReveal,
    0.08,
    0.9,
    easeInOutCubic,
  );
  const page33PlaceholderVisible = resolveWindowProgress(
    page33PlaceholderReveal,
    0.08,
    0.92,
    easeInOutCubic,
  );
  const page09ImageVisible = resolveWindowProgress(
    page09ImageReveal,
    0.08,
    0.88,
    easeInOutCubic,
  );
  const page09ImageExit =
    1 - resolveWindowProgress(page10RawReveal, 0.04, 0.32, easeInOutCubic);
  const page09ImageFocus = page09ImageVisible * page09ImageExit;
  const callbackImageSuppression = Math.max(
    1 - resolveWindowProgress(page09ImageReveal, 0.08, 0.32, easeInOutCubic),
    page10RestoreReveal,
  );
  const page14OverlayExit =
    1 - resolveWindowProgress(page13ImageReveal, 0.08, 0.3, easeInOutCubic);
  const page17CarrierVisible = page17PlaceholderVisible > 0.5 ? 1 : 0;
  const page16OverlayExit = 1 - page17CarrierVisible;
  const page17OverlayExit =
    1 - resolveWindowProgress(page18Reveal, 0.08, 0.3, easeInOutCubic);
  // Exit the outgoing placeholder only after the next one is materially visible.
  // Using reveal here creates a brief valley where neither card is strong enough
  // and the legacy loop stage flashes back through.
  const page19OverlayExit =
    1 - resolveWindowProgress(page21PlaceholderVisible, 0.02, 0.22, easeInOutCubic);
  const page14PlaceholderFocus = page14PlaceholderVisible * page14OverlayExit;
  const page16PlaceholderFocus = page16PlaceholderVisible * page16OverlayExit;
  const page17PlaceholderFocus = page17CarrierVisible * page17OverlayExit;
  const page19PlaceholderFocus = page19PlaceholderVisible * page19OverlayExit;
  const page21OverlayExit = 1 - page22PlaceholderVisible;
  const page22OverlayExit = 1 - page24PlaceholderVisible;
  const page24OverlayExit = 1 - page25PlaceholderVisible;
  const page25OverlayExit = 1 - page26PlaceholderVisible;
  const page26OverlayExit = 1 - page27PlaceholderVisible;
  const page27OverlayExit = 1 - page28PlaceholderVisible;
  const page28OverlayExit = 1 - page29PlaceholderVisible;
  const page29OverlayExit = 1 - page30PlaceholderVisible;
  const page30OverlayExit = 1 - page31PlaceholderVisible;
  const page31OverlayExit = 1 - page32PlaceholderVisible;
  const page32OverlayExit = 1 - page33PlaceholderVisible;
  const page13ImageOverlayExit =
    1 - resolveWindowProgress(page15ImageReveal, 0.08, 0.3, easeInOutCubic);
  const page15ImageOverlayExit =
    1 - resolveWindowProgress(page15Reveal, 0.02, 0.2, easeInOutCubic);
  const page18ImageOverlayExit =
    1 - resolveWindowProgress(page19PlaceholderVisible, 0.02, 0.22, easeInOutCubic);
  const page21PlaceholderFocus = page21PlaceholderVisible * page21OverlayExit;
  const page22PlaceholderFocus = page22PlaceholderVisible * page22OverlayExit;
  const page24PlaceholderFocus = page24PlaceholderVisible * page24OverlayExit;
  const page25PlaceholderFocus = page25PlaceholderVisible * page25OverlayExit;
  const page26PlaceholderFocus = page26PlaceholderVisible * page26OverlayExit;
  const page27PlaceholderFocus = page27PlaceholderVisible * page27OverlayExit;
  const page28PlaceholderFocus = page28PlaceholderVisible * page28OverlayExit;
  const page29PlaceholderFocus = page29PlaceholderVisible * page29OverlayExit;
  const page30PlaceholderFocus = page30PlaceholderVisible * page30OverlayExit;
  const page31PlaceholderFocus = page31PlaceholderVisible * page31OverlayExit;
  const page32PlaceholderFocus = page32PlaceholderVisible * page32OverlayExit;
  const page33PlaceholderFocus = page33PlaceholderVisible;
  const page13ImageFocus = page13ImageVisible * page13ImageOverlayExit;
  const page15ImageFocus = page15ImageVisible * page15ImageOverlayExit;
  const page18ImageFocus = page18ImageVisible * page18ImageOverlayExit;
  const imageDeckBackdropIn = resolveWindowProgress(
    page13ImageReveal,
    0.04,
    0.28,
    easeOutQuint,
  );
  const imageDeckBackdropOut =
    1 - resolveWindowProgress(page15Reveal, 0.02, 0.24, easeInOutCubic);
  const imageDeckBackdropOpacity = clamp01(imageDeckBackdropIn * imageDeckBackdropOut);
  const page15MainReveal = resolveWindowProgress(page15Reveal, 0.06, 0.92, easeInOutCubic);

  const callbackExit = resolveWindowProgress(page11Reveal, 0.1, 0.34, easeInOutCubic);
  const callbackOpacity = (1 - callbackExit) * callbackImageSuppression;
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
    (1 - resolveWindowProgress(introProgress, 0.72, 0.82, easeInOutCubic)) *
    callbackImageSuppression;
  const answerOpacity =
    resolveWindowProgress(introProgress, 0.62, 0.72, easeOutQuint) *
    (1 - resolveWindowProgress(introProgress, 0.84, 0.92, easeInOutCubic)) *
    callbackImageSuppression;
  const deviceReveal = resolveWindowProgress(page11Reveal, 0.12, 0.42, easeInOutCubic);
  const stageContentReveal = page11Reveal > 0.001 ? 1 : 0;
  const stableEdge1Reveal = resolveWindowProgress(
    page18Reveal,
    0.2,
    0.3,
    easeOutQuint,
  );
  const stableNode1Reveal = resolveWindowProgress(
    page18Reveal,
    0.32,
    0.4,
    easeInOutCubic,
  );
  const stableEdge2Reveal = resolveWindowProgress(
    page18Reveal,
    0.42,
    0.52,
    easeOutQuint,
  );
  const stableNode2Reveal = resolveWindowProgress(
    page18Reveal,
    0.54,
    0.62,
    easeInOutCubic,
  );
  const stableSupportEdge1Reveal = resolveWindowProgress(
    page18Reveal,
    0.36,
    0.56,
    easeOutQuint,
  );
  const stableEdge3Reveal = resolveWindowProgress(
    page18Reveal,
    0.64,
    0.74,
    easeOutQuint,
  );
  const stableNode3Reveal = resolveWindowProgress(
    page18Reveal,
    0.76,
    0.84,
    easeInOutCubic,
  );
  const stableSupportEdge2Reveal = resolveWindowProgress(
    page18Reveal,
    0.72,
    0.9,
    easeOutQuint,
  );
  const stableEdge4Reveal = resolveWindowProgress(
    page18Reveal,
    0.82,
    0.9,
    easeOutQuint,
  );
  const stableNode4Reveal = resolveWindowProgress(
    page18Reveal,
    0.91,
    0.95,
    easeInOutCubic,
  );
  const stableReturnReveal = resolveWindowProgress(
    page18Reveal,
    0.95,
    0.995,
    easeOutQuint,
  );
  const stableBuildReveal = stableNode2Reveal;
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
  const runtimeBridgeFadeOut = resolveWindowProgress(
    page13Reveal,
    0.02,
    0.22,
    easeInOutCubic,
  );
  const runtimeBridgeOpacity = stageContentReveal * (1 - runtimeBridgeFadeOut);
  const runtimeBridgeGpuFadeOut = resolveWindowProgress(
    page13Reveal,
    0.02,
    0.22,
    easeInOutCubic,
  );
  const runtimeBridgeGpuOpacity = runtimeBridgeOpacity * (1 - runtimeBridgeGpuFadeOut);
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
  const page15Focus = page15MainReveal * (1 - page16PlaceholderVisible);
  const page18Focus = page18Reveal * (1 - page18ImageReveal);
  const placeholderFocus = Math.max(
    imageDeckBackdropOpacity,
    page13ImageFocus,
    page15ImageFocus,
    page16PlaceholderFocus,
    page17PlaceholderFocus,
    page18ImageFocus,
    page19PlaceholderFocus,
    page21PlaceholderFocus,
    page22PlaceholderFocus,
    page24PlaceholderFocus,
    page25PlaceholderFocus,
    page26PlaceholderFocus,
    page27PlaceholderFocus,
    page28PlaceholderFocus,
    page29PlaceholderFocus,
    page30PlaceholderFocus,
    page31PlaceholderFocus,
    page32PlaceholderFocus,
    page33PlaceholderFocus,
  );
  const placeholderStageFade = resolveWindowProgress(
    placeholderFocus,
    0.72,
    0.98,
    easeInOutCubic,
  );
  const onepageHold = Math.max(
    imageDeckBackdropOpacity,
    page13ImageFocus,
    page15ImageFocus,
    page16PlaceholderFocus,
    page17PlaceholderFocus,
    page18ImageFocus,
    page19PlaceholderFocus,
    // Keep the legacy loop stage fully suppressed across the late one-page
    // placeholder chain, including the handoff valley between adjacent cards.
    page21PlaceholderVisible,
    page22PlaceholderVisible,
    page24PlaceholderVisible,
    page25PlaceholderVisible,
    page26PlaceholderVisible,
    page27PlaceholderVisible,
    page28PlaceholderVisible,
    page29PlaceholderVisible,
    page30PlaceholderVisible,
    page31PlaceholderVisible,
    page32PlaceholderVisible,
    page33PlaceholderVisible,
  );
  const onepageStageSuppression = resolveWindowProgress(
    onepageHold,
    0.001,
    0.12,
    easeInOutCubic,
  );
  const page15StageLift = resolveWindowProgress(
    page15Reveal,
    0.04,
    0.28,
    easeInOutCubic,
  );
  const page15StageLiftExit =
    1 - resolveWindowProgress(page16PlaceholderReveal, 0.02, 0.22, easeInOutCubic);
  const page15StageCarry = page15StageLift * page15StageLiftExit;
  const placeholderStageScale = mix(1, 0.94, placeholderStageFade);
  const placeholderStageOpacityBase =
    (1 - placeholderStageFade) * (1 - onepageStageSuppression);
  const placeholderStageOpacity = Math.max(
    placeholderStageOpacityBase,
    stageContentReveal * page15StageCarry * 0.9,
  );
  const placeholderStageTransform = `translate(640 360) scale(${placeholderStageScale}) translate(-640 -360)`;
  const page14LeftMute =
    1 - resolveWindowProgress(page14PlaceholderFocus, 0.02, 0.2, easeInOutCubic);

  const computerScalePhase12 = mix(1, 1.08, easeInOutCubic(page12Reveal));
  const computerScalePhase13 = mix(computerScalePhase12, 0.94, easeInOutCubic(page13Reveal));
  const computerScalePhase15 = mix(
    computerScalePhase13,
    0.92,
    easeInOutCubic(page15MainReveal),
  );
  const computerScale = mix(computerScalePhase15, 1.08, easeInOutCubic(stableBuildReveal));

  const phoneScalePhase12 = mix(1, 0.92, easeInOutCubic(page12Reveal));
  const phoneScalePhase13 = mix(phoneScalePhase12, 1.08, easeInOutCubic(page13Reveal));
  const phoneScalePhase15 = mix(
    phoneScalePhase13,
    1.12,
    easeInOutCubic(page15MainReveal),
  );
  const phoneScale = mix(phoneScalePhase15, 1.1, easeInOutCubic(stableReturnReveal));
  const page14PhoneEmphasis = mix(1, 1.08, easeOutQuint(page14PlaceholderFocus));
  const page14PhoneOffsetX = mix(0, -120, easeInOutCubic(page14PlaceholderFocus));

  const baseNodeOpacity = stageContentReveal * page14LeftMute;
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
  const bytecodeBaseOpacity = stageContentReveal * page13Reveal * page14LeftMute;
  const stableContextFade = 1;
  const sclNodeOpacity =
    stageContentReveal *
    page12Reveal *
    stableContextFade *
    page16SemanticHandoff *
    page14LeftMute;
  const cookCarrierOpacity = stageContentReveal * stableContextFade * page14LeftMute;
  const cookMainReveal = resolveWindowProgress(page12Reveal, 0.06, 0.62, easeOutQuint);
  const cookBranchReveal = resolveWindowProgress(page12Reveal, 0.34, 0.94, easeOutQuint);
  const cookSplitOpacity =
    cookCarrierOpacity * resolveWindowProgress(page12Reveal, 0.2, 0.5, easeOutQuint);
  const cookLabelOpacity =
    cookCarrierOpacity * resolveWindowProgress(page12Reveal, 0.24, 0.58, easeOutQuint);
  const bytecodeToPhoneRouteReveal = resolveWindowProgress(
    page13Reveal,
    0.14,
    0.9,
    easeOutQuint,
  );
  const bytecodeToPhoneCarrierOpacity =
    stageContentReveal *
    resolveWindowProgress(page13Reveal, 0.04, 0.2, easeInOutCubic) *
    page14LeftMute;
  const stablePcStageReturnProgress = resolveWindowProgress(
    page18Reveal,
    0.18,
    0.72,
    easeInOutCubic,
  );
  const stableReturnRouteReveal = resolveWindowProgress(
    page18Reveal,
    0.95,
    0.995,
    easeOutQuint,
  );
  const stableEdge1Opacity = stageContentReveal * stableEdge1Reveal;
  const stableNode1Opacity = stageContentReveal * stableNode1Reveal;
  const stableEdge2Opacity = stageContentReveal * stableEdge2Reveal;
  const stableNode2Opacity = stageContentReveal * stableNode2Reveal;
  const stableSupportEdge1Opacity = stageContentReveal * stableSupportEdge1Reveal;
  const stableEdge3Opacity = stageContentReveal * stableEdge3Reveal;
  const stableNode3Opacity = stageContentReveal * stableNode3Reveal;
  const stableSupportEdge2Opacity = stageContentReveal * stableSupportEdge2Reveal;
  const stableEdge4Opacity = stageContentReveal * stableEdge4Reveal;
  const stableNode4Opacity = stageContentReveal * stableNode4Reveal;
  const stableToPhoneOpacity = stageContentReveal * stableReturnReveal;
  const stageStablePcBox = mixBox(
    PAGE17_STABLE_PC_TARGET_BOX,
    STABLE_PC_BOX,
    stablePcStageReturnProgress,
  );
  const cookToSplitPoints = [
    {x: centerX(COMPUTER_BOX), y: bottom(COMPUTER_BOX) + 8},
    {x: centerX(COMPUTER_BOX), y: SPLIT_CENTER.y},
    {x: SPLIT_CENTER.x - 8, y: SPLIT_CENTER.y},
  ];
  const splitToSclPoints = [
    {x: SPLIT_CENTER.x, y: SPLIT_CENTER.y - 8},
    {x: centerX(SCL_BOX), y: SCL_BOX.y + SCL_BOX.height},
  ];
  const splitToBytecodePoints = [
    {x: SPLIT_CENTER.x + 8, y: SPLIT_CENTER.y},
    {x: BYTECODE_BOX.x - 12, y: centerY(BYTECODE_BOX)},
  ];
  const bytecodeToPhonePoints = [
    {x: right(BYTECODE_BOX) + 12, y: centerY(BYTECODE_BOX)},
    {x: 920, y: centerY(BYTECODE_BOX)},
    {x: 920, y: PHONE_GPU.y + 76},
    {x: PHONE_BOX.x - 10, y: PHONE_GPU.y + 76},
  ];
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
  const recPhoneToRecLength = polylineLength(recPhoneToRecPoints);
  const recToComputerLength = polylineLength(recToComputerPoints);
  const recEdge1DurationMs = Math.max(
    140,
    Math.min(840, 140 + recPhoneToRecLength * 0.75),
  );
  const recNodeDurationMs = 320;
  const recEdge2DurationMs = Math.max(
    140,
    Math.min(840, 140 + recToComputerLength * 0.75),
  );
  const recSequenceDurationMs =
    recEdge1DurationMs + recNodeDurationMs + recEdge2DurationMs;
  const recEdge1EndRatio = recEdge1DurationMs / recSequenceDurationMs;
  const recNodeEndRatio =
    (recEdge1DurationMs + recNodeDurationMs) / recSequenceDurationMs;
  const recSequenceProgress = resolveWindowProgress(
    page15Reveal,
    0.08,
    0.96,
    easeInOutCubic,
  );
  const recEdge1Reveal = resolveWindowProgress(
    recSequenceProgress,
    0,
    recEdge1EndRatio,
    easeOutQuint,
  );
  const recNodeReveal = resolveWindowProgress(
    recSequenceProgress,
    recEdge1EndRatio,
    recNodeEndRatio,
    easeInOutCubic,
  );
  const recEdge2Reveal = resolveWindowProgress(
    recSequenceProgress,
    recNodeEndRatio,
    1,
    easeOutQuint,
  );
  const recOpacity =
    stageContentReveal *
    recNodeReveal *
    page16SemanticHandoff;
  const recGeometryVisible =
    stageContentReveal > 0.001 &&
    (page14PlaceholderReveal > 0.001 || page15Reveal > 0.001);
  const recRouteCarrierOpacity =
    stageContentReveal *
    page16SemanticHandoff *
    resolveWindowProgress(recSequenceProgress, 0.01, 0.12, easeInOutCubic);
  const recGeometryOpacity =
    page15Reveal > 0.001
      ? recRouteCarrierOpacity
      : stageContentReveal * page14PlaceholderFocus * 0.001;
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
  const stableToPhoneY = centerY(STABLE_UPIPE_BOX);
  const stableToPhonePoints = [
    {x: right(STABLE_UPIPE_BOX) + 10, y: stableToPhoneY},
    {x: PHONE_BOX.x - 10, y: stableToPhoneY},
  ];
  const showComputerLabel = page15Focus > 0.12 || page18Focus > 0.12;
  const showPhoneLabel = false;
  const phoneContentOpacity =
    stageContentReveal * Math.max(page13Reveal, page14PlaceholderFocus);
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

  if (introProgress <= 0.001 && page11Reveal <= 0.001 && page09ImageFocus <= 0.001) {
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
            opacity={deviceReveal * page14LeftMute}
            scale={computerScale}
            showLabel={showComputerLabel}
          />
          <PhoneDevice
            scene={scene}
            opacity={deviceReveal}
            scale={phoneScale * page14PhoneEmphasis}
            landingFocus={page13Focus}
            stableFocus={page18Focus}
            offsetX={page14PhoneOffsetX}
            showShell={page14PlaceholderFocus < 0.001}
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
                  opacity={runtimeBridgeGpuOpacity}
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

          {cookCarrierOpacity > 0.001 && page12Reveal > 0.001 ? (
            <>
              <circle
                cx={SPLIT_CENTER.x}
                cy={SPLIT_CENTER.y}
                r="8"
                fill="rgba(255, 251, 246, 0.98)"
                stroke={scene.nodeStroke}
                strokeWidth="2.2"
                opacity={cookSplitOpacity}
              />
              <StrokeArrow
                d={roundedPolylinePath(cookToSplitPoints)}
                stroke={scene.apiStroke}
                opacity={cookCarrierOpacity}
                headOpacity={revealHeadOpacity(cookMainReveal, cookCarrierOpacity)}
                dashArray={revealDashArray(cookToSplitPoints, cookMainReveal)}
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
                opacity={cookLabelOpacity}
              >
                cook
              </text>
              <StrokeArrow
                d={roundedPolylinePath(splitToSclPoints)}
                stroke={scene.apiStroke}
                opacity={cookCarrierOpacity}
                headOpacity={revealHeadOpacity(cookBranchReveal, cookCarrierOpacity)}
                dashArray={revealDashArray(splitToSclPoints, cookBranchReveal)}
                tipX={centerX(SCL_BOX)}
                tipY={SCL_BOX.y + SCL_BOX.height}
                direction="up"
                shaftWidth={emphasizeWidth(3.2, page12Focus)}
                underlayWidth={5.8}
                headSize={9}
              />
              <StrokeArrow
                d={roundedPolylinePath(splitToBytecodePoints)}
                stroke={scene.apiStroke}
                opacity={cookCarrierOpacity}
                headOpacity={revealHeadOpacity(cookBranchReveal, cookCarrierOpacity)}
                dashArray={revealDashArray(splitToBytecodePoints, cookBranchReveal)}
                tipX={BYTECODE_BOX.x - 12}
                tipY={centerY(BYTECODE_BOX)}
                direction="right"
                shaftWidth={emphasizeWidth(3.2, page12Focus)}
                underlayWidth={5.8}
                headSize={9}
              />
            </>
          ) : null}

          {bytecodeToPhoneCarrierOpacity > 0.001 && page13Reveal > 0.001 ? (
            <StrokeArrow
              d={roundedPolylinePath(bytecodeToPhonePoints)}
              stroke={scene.apiStroke}
              opacity={bytecodeToPhoneCarrierOpacity}
              headOpacity={revealHeadOpacity(
                bytecodeToPhoneRouteReveal,
                bytecodeToPhoneCarrierOpacity,
              )}
              dashArray={revealDashArray(
                bytecodeToPhonePoints,
                bytecodeToPhoneRouteReveal,
              )}
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
              {recEdge1Reveal > 0.001 ? (
                <StrokeArrow
                  testId="page14-phone-to-rec-arrow"
                  d={roundedPolylinePath(recPhoneToRecPoints)}
                  stroke={scene.apiStroke}
                  opacity={recGeometryOpacity}
                  headOpacity={revealHeadOpacity(recEdge1Reveal, recGeometryOpacity)}
                  dashArray={revealDashArray(recPhoneToRecPoints, recEdge1Reveal)}
                  tipX={right(REC_BOX) + 12}
                  tipY={centerY(REC_BOX)}
                  direction="left"
                  shaftWidth={emphasizeWidth(3.2, page15Focus)}
                  underlayWidth={5.8}
                  headSize={9}
                />
              ) : null}
              {recEdge2Reveal > 0.001 ? (
                <StrokeArrow
                  d={roundedPolylinePath(recToComputerPoints)}
                  stroke={scene.apiStroke}
                  opacity={recGeometryOpacity}
                  headOpacity={revealHeadOpacity(recEdge2Reveal, recGeometryOpacity)}
                  dashArray={revealDashArray(recToComputerPoints, recEdge2Reveal)}
                  tipX={centerX(COMPUTER_BOX)}
                  tipY={COMPUTER_BOX.y - 8}
                  direction="down"
                  shaftWidth={emphasizeWidth(3.2, page15Focus)}
                  underlayWidth={5.8}
                  headSize={9}
                />
              ) : null}
            </>
          ) : null}

          {stableEdge1Opacity > 0.001 ||
          stableNode1Opacity > 0.001 ||
          stableEdge2Opacity > 0.001 ||
          stableNode2Opacity > 0.001 ||
          stableSupportEdge1Opacity > 0.001 ||
          stableEdge3Opacity > 0.001 ||
          stableNode3Opacity > 0.001 ||
          stableSupportEdge2Opacity > 0.001 ||
          stableEdge4Opacity > 0.001 ||
          stableNode4Opacity > 0.001 ? (
            <>
              {stableNode2Opacity > 0.001 ? (
                <ArtifactNode
                  box={stageStablePcBox}
                  scene={scene}
                  opacity={stableNode2Opacity}
                  label="stablepc.csv"
                  emphasized={page18Focus > 0.2}
                />
              ) : null}
              {stableNode4Opacity > 0.001 ? (
                <ArtifactNode
                  box={STABLE_UPIPE_BOX}
                  scene={scene}
                  opacity={stableNode4Opacity}
                  lines={["stable.", "upipelinecache"]}
                  emphasized={page18Focus > 0.2}
                />
              ) : null}
              <g opacity={stableNode1Opacity}>
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
              <g opacity={stableNode3Opacity}>
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
                opacity={stableEdge1Opacity}
                headOpacity={revealHeadOpacity(
                  stableEdge1Reveal,
                  stableEdge1Opacity,
                )}
                dashArray={revealDashArray(stableExpandToMergePoints, stableEdge1Reveal)}
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
                opacity={stableNode1Opacity}
              >
                expand
              </text>
              <StrokeArrow
                testId="page15-expand-merge-to-stablepc-arrow"
                d={roundedPolylinePath(stableExpandMergeToStablePcPoints)}
                stroke={scene.apiStroke}
                opacity={stableEdge2Opacity}
                headOpacity={revealHeadOpacity(
                  stableEdge2Reveal,
                  stableEdge2Opacity,
                )}
                dashArray={revealDashArray(
                  stableExpandMergeToStablePcPoints,
                  stableEdge2Reveal,
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
                opacity={stableSupportEdge1Opacity}
                headOpacity={revealHeadOpacity(
                  stableSupportEdge1Reveal,
                  stableSupportEdge1Opacity,
                )}
                dashArray={revealDashArray(sclToExpandMergePoints, stableSupportEdge1Reveal)}
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
                opacity={stableEdge3Opacity}
                headOpacity={revealHeadOpacity(
                  stableEdge3Reveal,
                  stableEdge3Opacity,
                )}
                dashArray={revealDashArray(stablePcToMergePoints, stableEdge3Reveal)}
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
                opacity={stableSupportEdge2Opacity}
                headOpacity={revealHeadOpacity(
                  stableSupportEdge2Reveal,
                  stableSupportEdge2Opacity,
                )}
                dashArray={revealDashArray(sclToMergePoints, stableSupportEdge2Reveal)}
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
                opacity={stableEdge4Opacity}
                headOpacity={revealHeadOpacity(
                  stableEdge4Reveal,
                  stableEdge4Opacity,
                )}
                dashArray={revealDashArray(mergeToStablePoints, stableEdge4Reveal)}
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
              tipY={stableToPhoneY}
              direction="right"
              shaftWidth={emphasizeWidth(3.2, page18Focus)}
              underlayWidth={5.8}
              headSize={9}
            />
          ) : null}
        </g>
      ) : null}

      {page14PlaceholderFocus > 0.001 ? (
        <Page14Placeholder
          scene={scene}
          opacity={page14PlaceholderFocus}
          phoneOffsetX={page14PhoneOffsetX}
        />
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
      {page24PlaceholderFocus > 0.001 ? (
        <Page24StrategyPage
          scene={scene}
          opacity={page24PlaceholderFocus}
          entryProgress={page24PlaceholderReveal}
        />
      ) : null}
      {page25PlaceholderFocus > 0.001 ? (
        <Page25StoragePage
          scene={scene}
          opacity={page25PlaceholderFocus}
          entryProgress={page25PlaceholderReveal}
        />
      ) : null}
      {page26PlaceholderFocus > 0.001 ? (
        <Page26TimingPage
          scene={scene}
          opacity={page26PlaceholderFocus}
          entryProgress={page26PlaceholderReveal}
        />
      ) : null}
      {page27PlaceholderFocus > 0.001 ? (
        <Page27ParallelPage
          scene={scene}
          opacity={page27PlaceholderFocus}
          entryProgress={page27PlaceholderReveal}
        />
      ) : null}
      {page28PlaceholderFocus > 0.001 ? (
        <Page28GovernanceSurfacePage
          scene={scene}
          opacity={page28PlaceholderFocus}
          entryProgress={page28PlaceholderReveal}
        />
      ) : null}
      {page29PlaceholderFocus > 0.001 ? (
        <Page29GovernanceSourcePage
          scene={scene}
          opacity={page29PlaceholderFocus}
          entryProgress={page29PlaceholderReveal}
        />
      ) : null}
      {page30PlaceholderFocus > 0.001 ? (
        <Page30GovernanceConclusionPage
          scene={scene}
          opacity={page30PlaceholderFocus}
          entryProgress={page30PlaceholderReveal}
        />
      ) : null}
      {page31PlaceholderFocus > 0.001 ? (
        <Page31HarnessPage
          scene={scene}
          opacity={page31PlaceholderFocus}
          entryProgress={page31PlaceholderReveal}
        />
      ) : null}
      {page32PlaceholderFocus > 0.001 ? (
        <Page32ReadingPage
          scene={scene}
          opacity={page32PlaceholderFocus}
          entryProgress={page32PlaceholderReveal}
        />
      ) : null}
      {page33PlaceholderFocus > 0.001 ? (
        <Page33QuotePage
          scene={scene}
          opacity={page33PlaceholderFocus}
          entryProgress={page33PlaceholderReveal}
        />
      ) : null}
      <Page09EvidenceNotes scene={scene} opacity={page09ImageFocus} />
      {imageDeckBackdropOpacity > 0.001 ? (
        <rect
          x="0"
          y="0"
          width="1280"
          height="720"
          fill="rgba(14, 16, 22, 0.9)"
          opacity={imageDeckBackdropOpacity}
        />
      ) : null}
      <SupplementImageOverlay
        scene={scene}
        href="/supplement/pso-stutter.png"
        clipId="supplement-stutter-clip"
        opacity={page13ImageFocus}
      />
      <SupplementImageOverlay
        scene={scene}
        href="/supplement/pso-rec-cache.png"
        clipId="supplement-rec-clip"
        opacity={page15ImageFocus}
        box={PAGE15_SUPPLEMENT_IMAGE_BOX}
        preserveAspectRatio="xMidYMid meet"
        backgroundFill="rgba(247, 243, 240, 0.98)"
        imageTestId="page15-supplement-image"
      />
      <SupplementImageOverlay
        scene={scene}
        href="/supplement/pso-precompile-smooth-peak.png"
        clipId="supplement-precompile-clip"
        opacity={page18ImageFocus}
      />
    </>
  );
}
