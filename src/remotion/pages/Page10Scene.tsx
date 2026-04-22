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
import {resolveRemotionPublicAssetHref} from "../publicAssetPath";
import {Page01Scene} from "./Page01Scene";
import {Page02Scene} from "./Page02Scene";
import {
  ArrowLabelPill,
  CalloutBadge,
  FramedImage,
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
const LOOP_PAGE21_FRAME = loopFrame("page_21");
const LOOP_PAGE22_FRAME = loopFrame("page_22");
const LOOP_PAGE24_FRAME = loopFrame("page_24");
const LOOP_PAGE26_FRAME = loopFrame("page_26");
const LOOP_PAGE28_FRAME = loopFrame("page_28");
const LOOP_PAGE29_FRAME = loopFrame("page_29");
const LOOP_PAGE29_DATA_FRAME = loopFrame("page_29_data");
const LOOP_PAGE30_FRAME = loopFrame("page_30");
const LOOP_PAGE31_FRAME = loopFrame("page_31");
const LOOP_PAGE32_FRAME = loopFrame("page_32");
const LOOP_PAGE33_FRAME = loopFrame("page_33");
const LOOP_CLOUD_STROKE = "rgba(118, 163, 207, 0.94)";
const PLACEHOLDER_BOARD = {x: 148, y: 104, width: 984, height: 512, radius: 36};
const PAGE14_UE_CENTER_X = 300;
const PAGE14_GFX_CENTER_X = 732;
const PAGE14_GPU_CENTER_X = 1072;
const LATE_INLINE_TITLE_REMOVAL_SHIFT_Y = -52;
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
const PAGE16_REC_TARGET_BOX = {x: 100, y: 272, width: 360, height: 104, radius: 24};
const PAGE16_SCL_TARGET_BOX = {x: 480, y: 100, width: 340, height: 84, radius: 22};
const PAGE16_STABLE_PC_TARGET_BOX = {
  x: 820,
  y: 272,
  width: 360,
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
  x: 100,
  y: 272,
  width: 360,
  height: 104,
  radius: 24,
};
const PAGE17_SCL_TARGET_BOX = {x: 480, y: 100, width: 340, height: 84, radius: 22};
const PAGE17_BUILD_CENTER = {x: 650, y: 324};
const PAGE17_STABLE_UPIPE_TARGET_BOX = {
  x: 820,
  y: 266,
  width: 360,
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
  {
    title: "Mesa 开源驱动",
    subtitle: "mesa / freedesktop.org / GitLab",
    href: "https://gitlab.freedesktop.org/mesa/mesa",
  },
] as const;
const PAGE29_DATA_PC_ROWS = [
  {
    id: "pc-row-1",
    loop: "loop=10",
    values: ["0.0653", "0.0801", "0.0614"] as const,
  },
  {
    id: "pc-row-2",
    loop: "loop=5000",
    values: ["0.0645", "59.1658", "32.0594"] as const,
  },
] as const;
const PAGE29_DATA_ANDROID_ROWS = [
  {
    id: "android-row-1",
    loop: "loop=10",
    values: ["3.3054", "0.8471", "3.3199"] as const,
  },
  {
    id: "android-row-2",
    loop: "loop=5000",
    values: ["400.7728", "400.7216", "402.2887"] as const,
  },
] as const;
type Page29ShaderTone = "plain" | "keyword" | "type" | "number" | "function" | "comment";
type Page29ShaderToken = {
  text: string;
  tone?: Page29ShaderTone;
};

const PAGE29_DATA_VERTEX_SHADER_LINES: readonly (readonly Page29ShaderToken[])[] = [
  [
    {text: "layout", tone: "keyword"},
    {text: "(location = "},
    {text: "0", tone: "number"},
    {text: ") "},
    {text: "in", tone: "keyword"},
    {text: " "},
    {text: "vec3", tone: "type"},
    {text: " inPos;"},
  ],
  [
    {text: "out", tone: "keyword"},
    {text: " "},
    {text: "vec4", tone: "type"},
    {text: " heavyColor;"},
  ],
  [
    {text: "uniform", tone: "keyword"},
    {text: " "},
    {text: "int", tone: "type"},
    {text: " loopCount;"},
  ],
  [
    {text: "void", tone: "keyword"},
    {text: " "},
    {text: "main", tone: "function"},
    {text: "() {"},
  ],
  [
    {text: "  "},
    {text: "vec4", tone: "type"},
    {text: " acc = "},
    {text: "vec4", tone: "type"},
    {text: "(inPos, "},
    {text: "1.0", tone: "number"},
    {text: ");"},
  ],
  [
    {text: "  "},
    {text: "for", tone: "keyword"},
    {text: " ("},
    {text: "int", tone: "type"},
    {text: " i = "},
    {text: "0", tone: "number"},
    {text: "; i < loopCount; ++i) {"},
  ],
  [
    {text: "    acc = "},
    {text: "sin", tone: "function"},
    {text: "(acc) * "},
    {text: "cos", tone: "function"},
    {text: "(acc);"},
    {text: " // heavy loop", tone: "comment"},
  ],
  [{text: "  }"}],
  [{text: "  heavyColor = acc;"}],
  [{text: "}"}],
] as const;
const PAGE29_DATA_FRAGMENT_SHADER_LINES: readonly (readonly Page29ShaderToken[])[] = [
  [
    {text: "in", tone: "keyword"},
    {text: " "},
    {text: "vec4", tone: "type"},
    {text: " heavyColor;"},
  ],
  [
    {text: "out", tone: "keyword"},
    {text: " "},
    {text: "vec4", tone: "type"},
    {text: " outColor;"},
  ],
  [
    {text: "void", tone: "keyword"},
    {text: " "},
    {text: "main", tone: "function"},
    {text: "() {"},
  ],
  [{text: "  outColor = heavyColor;"}],
  [{text: "}"}],
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
    title: "人类高质量思政课",
    subtitle: "沈枯燥 / 哔哩哔哩",
    href: "https://www.bilibili.com/video/BV1m7UkBDEeB?spm_id_from=333.788.videopod.sections",
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
const LIVE_HARNESS_SOURCE_TOKENS = [
  "workflow gate",
  "front probe",
  "browser capture",
  "blind critics",
] as const;
const LIVE_HARNESS_DECISION_TOKENS = [
  "通过则停止",
  "不通过继续",
] as const;
const PAGE32_BRIDGE_TITLE = "反馈系统与人的学习";
const PAGE32_ABSTRACTION_PILLS = [
  {id: "concept-harness", label: "harness", emphasized: true, labelFontSize: 28, width: 300},
  {
    id: "concept-loss",
    label: "loss + back propagation",
    emphasized: false,
    labelFontSize: 26,
    width: 420,
  },
  {
    id: "concept-feedback",
    label: "feedback system",
    emphasized: true,
    labelFontSize: 27,
    width: 332,
  },
] as const;
const PAGE32_BRIDGE_FOOTER =
  "从一个具体问题往回推时 也许会借到一些看似无用的东西";
const PARALLEL_NOTES = [
  "同步成本",
  "共享状态",
  "任务粒度",
  "warp divergence",
  "bank conflict",
] as const;
const PAGE17_EXAMPLE_CARD = {x: 100, y: 400, width: 1080, height: 220, radius: 22};
const PAGE17_KEY1_CENTER = {x: 754, y: 508};
const PAGE17_KEY2_CENTER = {x: 754, y: 556};
const PAGE17_HASHA_CENTER = {x: 1004, y: 508};
const PAGE17_HASHB_CENTER = {x: 1004, y: 556};
const PAGE19_TOP_ROW_Y = 78;
const PAGE19_STABLE_BOX = {
  x: 142,
  y: 206,
  width: 262,
  height: 228,
  radius: 30,
};
const PAGE19_VERTEX_BOX = {x: 402, y: 34, width: 88, height: 88, radius: 18};
const PAGE19_VERTEX_CENTER = {x: 446, y: 78};
const PAGE19_GPU_BOX = {
  x: 582,
  y: 38,
  width: 116,
  height: 80,
  radius: 18,
};
const PAGE19_GPU_LABEL_Y = 78;
const PAGE19_GPU_AXIS_X = 640;
const PAGE19_PIXEL_BOX = {x: 790, y: 40, width: 68, height: 76, radius: 16};
const PAGE19_GPU_PIXELS = {x: 794, y: 48};
const PAGE19_API_BOX = {
  x: 509,
  y: 206,
  width: 262,
  height: 228,
  radius: 32,
};
const PAGE19_DISK_BOX = {
  x: 876,
  y: 206,
  width: 262,
  height: 228,
  radius: 32,
};
const PAGE19_BINARY_NOTE_BOXES = [
  {x: 142, y: 500, width: 262, height: 78, radius: 20},
  {x: 509, y: 500, width: 262, height: 78, radius: 20},
  {x: 876, y: 500, width: 262, height: 78, radius: 20},
] as const;
const PAGE19_BINARY_ARCHIVE2_BADGE = {
  x: 924,
  y: 648,
  width: 166,
  height: 44,
  radius: 20,
};
const PAGE21_PSO_BOX = {x: 126, y: 208, width: 336, height: 88, radius: 24};
const PAGE21_SHADER_BOX = {x: 126, y: 424, width: 336, height: 88, radius: 24};
const PAGE21_FOOTER_BOX = {x: 158, y: 646, width: 948, height: 54, radius: 22};

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

function quadraticCurvePath(
  start: {x: number; y: number},
  control: {x: number; y: number},
  end: {x: number; y: number},
) {
  return `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`;
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

function resolvePage29ShaderToneFill(defaultFill: string, tone: Page29ShaderTone | undefined) {
  switch (tone) {
    case "keyword":
      return "#da7a41";
    case "type":
      return "#5878a6";
    case "number":
      return "#2f8a78";
    case "function":
      return "#b0623b";
    case "comment":
      return "rgba(92, 106, 118, 0.76)";
    default:
      return defaultFill;
  }
}

function renderPage29ShaderLine(
  line: readonly Page29ShaderToken[],
  defaultFill: string,
) {
  return line.map((token, tokenIndex) => (
    <tspan
      key={`${token.text}-${tokenIndex}`}
      fill={resolvePage29ShaderToneFill(defaultFill, token.tone)}
    >
      {token.text}
    </tspan>
  ));
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

function mixPointSeries(
  from: Array<{x: number; y: number}>,
  to: Array<{x: number; y: number}>,
  progress: number,
) {
  return from.map((point, index) => mixPoint(point, to[index] ?? to.at(-1) ?? point, progress));
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
        label={showLabel ? "构建机" : undefined}
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
  deviceLabel,
  deviceLabelOpacity = 1,
  showRuntimeLabel = true,
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
  deviceLabel?: string;
  deviceLabelOpacity?: number;
  showRuntimeLabel?: boolean;
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
            opacity={showDeviceLabel ? deviceLabelOpacity : 0}
          >
            {deviceLabel ?? "Phone"}
          </text>
          {showRuntimeLabel ? (
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
          ) : null}
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
  subLabel,
  lines,
  detail,
  geometryNodeId,
  geometryNodeLabel,
  labelFontSize = 26,
  subLabelFontSize,
  detailFontSize = 16,
  detailColor = "rgba(34, 48, 61, 0.74)",
  subLabelColor = "rgba(34, 48, 61, 0.68)",
  emphasized = false,
}: {
  box: {x: number; y: number; width: number; height: number; radius: number};
  scene: SceneModel;
  opacity: number;
  label?: string;
  subLabel?: string;
  lines?: string[];
  detail?: string;
  geometryNodeId?: string;
  geometryNodeLabel?: string;
  labelFontSize?: number;
  subLabelFontSize?: number;
  detailFontSize?: number;
  detailColor?: string;
  subLabelColor?: string;
  emphasized?: boolean;
}) {
  const hasDetail = Boolean(detail && !lines);
  const hasStackedDetail = Boolean(detail && lines);
  const hasSubtitle = Boolean(subLabel && label);
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
        <>
          <StackedLabel
            x={centerX(box)}
            y={centerY(box) + (hasStackedDetail ? -10 : 2)}
            lines={lines}
            fontSize={labelFontSize}
            fontWeight={760}
            lineGap={hasStackedDetail ? 23 : 28}
            markGeometryText={Boolean(geometryNodeId)}
          />
          {hasStackedDetail ? (
            <text
              x={centerX(box)}
              y={centerY(box) + 26}
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
      ) : label ? (
        <>
          <text
            x={centerX(box)}
            y={
              centerY(box) +
              (hasSubtitle && hasDetail ? -24 : hasSubtitle ? -12 : hasDetail ? -12 : 2)
            }
            fill="#22303d"
            fontSize={labelFontSize}
            fontWeight="760"
            textAnchor="middle"
            dominantBaseline="middle"
            data-geometry-node-text={geometryNodeId ? "1" : undefined}
          >
            {label}
          </text>
          {hasSubtitle ? (
            <text
              x={centerX(box)}
              y={centerY(box) + (hasDetail ? 2 : 16)}
              fill={subLabelColor}
              fontSize={subLabelFontSize ?? Math.max(labelFontSize - 2, 16)}
              fontWeight="720"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text={geometryNodeId ? "1" : undefined}
            >
              {subLabel}
            </text>
          ) : null}
          {hasDetail ? (
            <text
              x={centerX(box)}
              y={centerY(box) + (hasSubtitle ? 28 : 20)}
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
  box = {x: 164, y: 606, width: 948, height: 54, radius: 22},
}: {
  scene: SceneModel;
  text: string;
  opacity: number;
  geometryNodeId?: string;
  box?: {x: number; y: number; width: number; height: number; radius: number};
}) {
  const footerBox = box;

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
  const resolvedHref = resolveRemotionPublicAssetHref(href);
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
        href={resolvedHref}
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
  titleAlign = "start",
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
  titleAlign?: "start" | "center";
}) {
  const resolvedHref = resolveRemotionPublicAssetHref(href);
  const geometryBoxX = title ? box.x - 8 : box.x;
  const geometryBoxWidth = box.width + (title ? 16 : 0);
  const geometryBoxTop = title ? box.y - 40 : box.y;
  const geometryBoxHeight = box.height + (title ? 48 : 0);
  const titleX = titleAlign === "center" ? centerX(box) : box.x;
  const titleAnchor = titleAlign === "center" ? "middle" : "start";

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
          x={titleX}
          y={box.y - 18}
          fill={scene.apiStroke}
          fontSize={titleFontSize}
          fontWeight="820"
          textAnchor={titleAnchor}
          dominantBaseline="middle"
          data-geometry-node-text={geometryNodeId ? "1" : undefined}
        >
          {title}
        </text>
      ) : null}
      <image
        href={resolvedHref}
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

  const resolvedHref = resolveRemotionPublicAssetHref(href);
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
        href={resolvedHref}
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
  const leftBox = {x: 72, y: 136, width: 318, height: 258, radius: 24};
  const centerBox = {x: 410, y: 136, width: 462, height: 258, radius: 24};
  const rightBox = {x: 892, y: 136, width: 316, height: 258, radius: 24};
  const hashLeftBox = {x: 72, y: 424, width: 560, height: 156, radius: 24};
  const hashRightBox = {x: 648, y: 424, width: 560, height: 156, radius: 24};
  const noteCenterX = 640;

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

      <text
        x={noteCenterX}
        y={50}
        fill="rgba(34, 48, 61, 0.86)"
        fontSize="28"
        fontWeight="680"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        M = 母材质
      </text>
      <text
        x={noteCenterX}
        y={80}
        fill="rgba(34, 48, 61, 0.8)"
        fontSize="26"
        fontWeight="660"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        M-I1 / M-I2 = 两个相同的 Material Instance
      </text>
      <text
        x={noteCenterX}
        y={108}
        fill="rgba(34, 48, 61, 0.62)"
        fontSize="18"
        fontWeight="620"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        注：M-I1 / M-I2 都额外改了同一个 Static Bool，否则 UE 可能会优化掉，不保存对应 ShaderCode。
      </text>

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

      <g data-testid="page09-hash-opengl-box">
        <StageBox
          box={hashLeftBox}
          fill="rgba(255, 251, 246, 0.95)"
          stroke={scene.nodeStroke}
          strokeWidth={2.4}
        />
        <text
          x={hashLeftBox.x + 18}
          y={hashLeftBox.y + 34}
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
          y={hashLeftBox.y + 82}
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
          y={hashLeftBox.y + 122}
          fill="rgba(34, 48, 61, 0.74)"
          fontSize="18"
          fontWeight="700"
          textAnchor="start"
          dominantBaseline="middle"
        >
          M-I1 / M-I2 复用同一 Hash
        </text>
      </g>

      <g data-testid="page09-hash-vulkan-box">
        <StageBox
          box={hashRightBox}
          fill="rgba(255, 251, 246, 0.95)"
          stroke={scene.nodeStroke}
          strokeWidth={2.4}
        />
        <text
          x={hashRightBox.x + 18}
          y={hashRightBox.y + 34}
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
          y={hashRightBox.y + 82}
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
          y={hashRightBox.y + 122}
          fill="rgba(34, 48, 61, 0.74)"
          fontSize="18"
          fontWeight="700"
          textAnchor="start"
          dominantBaseline="middle"
        >
          共享模式命中同一套 Hash
        </text>
      </g>
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
  const uePsoBox = {
    x: PAGE14_UE_CENTER_X - 128,
    y: runtimeGpuY - 98,
    width: 256,
    height: 196,
    radius: 24,
  };
  const gfxPsoBox = {
    x: PAGE14_GFX_CENTER_X - 112,
    y: uePsoBox.y,
    width: 224,
    height: uePsoBox.height,
    radius: 24,
  };
  const recBox = {
    x: 148,
    y: uePsoBox.y - 196,
    width: 304,
    height: 88,
    radius: 22,
  };
  const ueToGfxPoints = [
    {x: right(uePsoBox) + 8, y: centerY(uePsoBox)},
    {x: gfxPsoBox.x - 8, y: centerY(gfxPsoBox)},
  ];
  const gfxToGpuPoints = [
    {x: right(gfxPsoBox) + 8, y: runtimeGpuY},
    {x: runtimeGpuX - 54, y: runtimeGpuY},
  ];
  const ueToRecPoints = [
    {x: centerX(uePsoBox), y: uePsoBox.y - 12},
    {x: centerX(uePsoBox), y: recBox.y + recBox.height + 24},
    {x: centerX(uePsoBox), y: recBox.y + recBox.height + 8},
  ];
  const recordLabelCenterX = centerX(uePsoBox) - 76;
  const createLabelCenterX = (ueToGfxPoints[0]!.x + ueToGfxPoints[1]!.x) / 2;
  const bindLabelCenterX = (gfxToGpuPoints[0]!.x + gfxToGpuPoints[1]!.x) / 2;

  return (
    <PlaceholderBoardShell opacity={opacity}>
      <g opacity={opacity * nodeReveal}>
        <StageBox
          box={uePsoBox}
          fill="rgba(248, 236, 226, 0.96)"
          stroke={scene.apiStroke}
          strokeWidth={3}
        />
        <text
          x={centerX(uePsoBox)}
          y={uePsoBox.y + 44}
          fill="#22303d"
          fontSize="30"
          fontWeight="790"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          UE PSO
        </text>
        <text
          x={centerX(uePsoBox)}
          y={uePsoBox.y + 92}
          fill="rgba(34, 48, 61, 0.78)"
          fontSize="24"
          fontWeight="730"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          ShaderHash + State
        </text>
        <text
          x={centerX(uePsoBox)}
          y={uePsoBox.y + 128}
          fill="rgba(34, 48, 61, 0.7)"
          fontSize="22"
          fontWeight="700"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          引擎侧记录 / 描述
        </text>
        <text
          x={centerX(uePsoBox)}
          y={uePsoBox.y + 158}
          fill="rgba(34, 48, 61, 0.62)"
          fontSize="20"
          fontWeight="680"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          BSS + State
        </text>
      </g>
      <g opacity={opacity * nodeReveal}>
        <StageBox
          box={gfxPsoBox}
          fill="rgba(255, 249, 243, 0.96)"
          stroke="rgba(92, 106, 118, 0.58)"
          strokeWidth={2.8}
        />
        <text
          x={centerX(gfxPsoBox)}
          y={gfxPsoBox.y + 44}
          fill="#22303d"
          fontSize="30"
          fontWeight="790"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          Gfx PSO
        </text>
        <text
          x={centerX(gfxPsoBox)}
          y={gfxPsoBox.y + 92}
          fill="rgba(34, 48, 61, 0.78)"
          fontSize="22"
          fontWeight="720"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          RHI / driver object
        </text>
        <text
          x={centerX(gfxPsoBox)}
          y={gfxPsoBox.y + 128}
          fill="rgba(34, 48, 61, 0.72)"
          fontSize="21"
          fontWeight="700"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          运行时对象 / 编译结果
        </text>
        <text
          x={centerX(gfxPsoBox)}
          y={gfxPsoBox.y + 158}
          fill="rgba(34, 48, 61, 0.6)"
          fontSize="19"
          fontWeight="680"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          create or hit
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
          fontSize="24"
          fontWeight="760"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          .rec.upipelinecache
        </text>
      </g>
      <StrokeArrow
        d={roundedPolylinePath(ueToGfxPoints)}
        stroke={scene.apiStroke}
        opacity={opacity * routeReveal}
        headOpacity={revealHeadOpacity(routeReveal, opacity * routeReveal)}
        tipX={gfxPsoBox.x - 8}
        tipY={centerY(gfxPsoBox)}
        direction="right"
        shaftWidth={4.4}
        underlayWidth={7.6}
        headSize={10.5}
        testId="page14-ue-to-gfx-arrow"
      />
      <StrokeArrow
        d={roundedPolylinePath(gfxToGpuPoints)}
        stroke={scene.apiStroke}
        opacity={opacity * routeReveal}
        headOpacity={revealHeadOpacity(routeReveal, opacity * routeReveal)}
        tipX={runtimeGpuX - 54}
        tipY={runtimeGpuY}
        direction="right"
        shaftWidth={4.6}
        underlayWidth={7.8}
        headSize={11}
        testId="page14-gfx-to-gpu-arrow"
      />
      <StrokeArrow
        d={roundedPolylinePath(ueToRecPoints)}
        stroke={LOOP_CLOUD_STROKE}
        opacity={opacity * routeReveal}
        headOpacity={revealHeadOpacity(routeReveal, opacity * routeReveal)}
        dashArray="12 10"
        tipX={centerX(uePsoBox)}
        tipY={recBox.y + recBox.height + 8}
        direction="up"
        shaftWidth={4.4}
        underlayWidth={7.6}
        headSize={11}
        testId="page14-ue-to-rec-arrow"
      />
      <ArrowLabelPill
        x={recordLabelCenterX}
        y={252}
        width={140}
        height={40}
        label="record / save"
        stroke="rgba(118, 163, 207, 0.48)"
        fill="rgba(255, 251, 246, 0.98)"
        fontSize={21}
        fontWeight={760}
        opacity={opacity * routeReveal}
        testId="page14-ue-to-rec-label"
      />
      <ArrowLabelPill
        x={createLabelCenterX}
        y={350}
        width={176}
        height={40}
        label="create / resolve"
        stroke="rgba(208, 107, 68, 0.42)"
        fill="rgba(255, 251, 246, 0.98)"
        fontSize={22}
        fontWeight={760}
        opacity={opacity * routeReveal}
        testId="page14-ue-to-gfx-label"
      />
      <ArrowLabelPill
        x={bindLabelCenterX}
        y={350}
        width={140}
        height={40}
        label="bind / use"
        stroke="rgba(208, 107, 68, 0.42)"
        fill="rgba(255, 251, 246, 0.98)"
        fontSize={22}
        fontWeight={760}
        opacity={opacity * routeReveal}
        testId="page14-gfx-to-gpu-label"
      />
      <text
        x={centerX(PLACEHOLDER_BOARD)}
        y={bottom(uePsoBox) + 48}
        fill="rgba(34, 48, 61, 0.74)"
        fontSize="22"
        fontWeight="720"
        textAnchor="middle"
        dominantBaseline="middle"
        opacity={opacity * nodeReveal}
      >
        UE PSO 记录描述；Gfx PSO 是运行时对象 / 编译结果
      </text>
      <text
        x={centerX(PLACEHOLDER_BOARD)}
        y={bottom(uePsoBox) + 88}
        fill="rgba(34, 48, 61, 0.7)"
        fontSize="20"
        fontWeight="700"
        textAnchor="middle"
        dominantBaseline="middle"
        opacity={opacity * nodeReveal}
      >
        注：Vulkan / Metal = BSS + State，OpenGL = BSS（无显式 State）
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
  const questionOpacity = sharedOpacity * (1 - handoff * 0.98);
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
        label="ShaderHash + State"
        subLabel="（历史版本）"
        detail="rec.upipelinecache"
        opacity={recOpacity}
        labelFontSize={20}
        subLabelFontSize={17.5}
        detailFontSize={15.5}
      />
      <ArtifactNode
        scene={scene}
        box={stablePcBox}
        label="ShaderStableKey + State"
        detail="stablepc.csv"
        opacity={sharedOpacity}
        labelFontSize={19.5}
        detailFontSize={15.5}
        emphasized
      />
      <text
        x={centerX(recBox)}
        y={recBox.y - 24}
        fill={scene.apiStroke}
        fontSize="18.5"
        fontWeight="760"
        textAnchor="middle"
        dominantBaseline="middle"
        opacity={sharedOpacity}
      >
        手机包收集到的UE PSO
      </text>
      <ArtifactNode
        scene={scene}
        box={sclBox}
        label="ShaderHash <-> ShaderStableKey"
        detail=".scl.csv"
        opacity={sharedOpacity}
        labelFontSize={18.5}
        detailFontSize={15}
      />
      <text
        x={centerX(sclBox)}
        y={sclBox.y - 34}
        fill={scene.apiStroke}
        fontSize="15.2"
        fontWeight="720"
        textAnchor="middle"
        dominantBaseline="middle"
        opacity={sharedOpacity}
      >
        和UE PSO同版本Cook出来的
      </text>
      <text
        x={centerX(sclBox)}
        y={sclBox.y - 14}
        fill={scene.apiStroke}
        fontSize="17.2"
        fontWeight="780"
        textAnchor="middle"
        dominantBaseline="middle"
        opacity={sharedOpacity}
      >
        双向映射
      </text>
      <CalloutBadge
        x={sharedCenter.x}
        y={sharedCenter.y}
        label="+"
        stroke={LOOP_CLOUD_STROKE}
        opacity={operationOpacity}
      />
      <StrokeArrow
        d={roundedPolylinePath(recToExpandPoints)}
        stroke={LOOP_CLOUD_STROKE}
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
        stroke={LOOP_CLOUD_STROKE}
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
        stroke={LOOP_CLOUD_STROKE}
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
        stroke={LOOP_CLOUD_STROKE}
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
        双向映射字典
      </text>
      <text
        x={right(sclBox) + 18}
        y={sclBox.y + 48}
        fill={scene.apiStroke}
        fontSize="17.5"
        fontWeight="760"
        textAnchor="start"
        dominantBaseline="middle"
        opacity={noteOpacity}
      >
        必须和 UE PSO 同版本 Cook 出来
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
      <text
        x={centerX(stablePcBox)}
        y={stablePcBox.y - 24}
        fill={scene.apiStroke}
        fontSize="18.2"
        fontWeight="760"
        textAnchor="middle"
        dominantBaseline="middle"
        opacity={sharedOpacity}
      >
        所有历史版本的稳定UE PSO
      </text>
      <ArtifactNode
        scene={scene}
        box={stablePcBox}
        label="ShaderStableKey + State"
        detail="stablepc.csv"
        opacity={sharedOpacity}
        labelFontSize={19.5}
        detailFontSize={15.5}
        emphasized
      />
      <text
        x={centerX(stableUpipeBox)}
        y={stableUpipeBox.y - 24}
        fill={scene.apiStroke}
        fontSize="17.6"
        fontWeight="760"
        textAnchor="middle"
        dominantBaseline="middle"
        opacity={opacity}
      >
        当前包体可以用作预编译的UE PSO
      </text>
      <ArtifactNode
        scene={scene}
        box={stableUpipeBox}
        label="ShaderHash + State"
        subLabel="（当前版本）"
        detail="stable.upipelinecache"
        opacity={opacity}
        labelFontSize={19}
        subLabelFontSize={17}
        detailFontSize={15}
        emphasized
      />
      <text
        x={centerX(currentSclBox)}
        y={currentSclBox.y - 24}
        fill={scene.apiStroke}
        fontSize="17.4"
        fontWeight="760"
        textAnchor="middle"
        dominantBaseline="middle"
        opacity={sharedOpacity}
      >
        当前版本Cook出来的双向映射
      </text>
      <ArtifactNode
        scene={scene}
        box={currentSclBox}
        label="ShaderHash <-> ShaderStableKey"
        detail=".scl.csv"
        opacity={sharedOpacity}
        labelFontSize={18.5}
        detailFontSize={15}
      />
      <CalloutBadge
        x={PAGE17_BUILD_CENTER.x}
        y={PAGE17_BUILD_CENTER.y}
        label="+"
        stroke={LOOP_CLOUD_STROKE}
        opacity={opacity}
      />
      <StrokeArrow
        d={roundedPolylinePath(stablePcToBuildPoints)}
        stroke={LOOP_CLOUD_STROKE}
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
        stroke={LOOP_CLOUD_STROKE}
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
        stroke={LOOP_CLOUD_STROKE}
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
        stroke={LOOP_CLOUD_STROKE}
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
  const SOFT_FILL = scene.focusFill;
  const TEXT = "#22303d";
  const groupReveal = resolveWindowProgress(entryProgress, 0.08, 0.44, easeOutQuint);
  const routeReveal = resolveWindowProgress(entryProgress, 0.2, 0.72, easeOutQuint);
  const diskReveal = resolveWindowProgress(entryProgress, 0.34, 0.84, easeOutQuint);
  const localOpacity = opacity;
  const leftBandOpacity = localOpacity * groupReveal;
  const gpuOpacity = localOpacity * resolveWindowProgress(entryProgress, 0.2, 0.56, easeOutQuint);
  const gfxOpacity = localOpacity * resolveWindowProgress(entryProgress, 0.26, 0.68, easeOutQuint);
  const diskOpacity = localOpacity * diskReveal;
  const summaryOpacity =
    localOpacity * resolveWindowProgress(entryProgress, 0.42, 0.9, easeOutQuint);

  const stableToGfxPoints = [
    {x: right(PAGE19_STABLE_BOX), y: centerY(PAGE19_API_BOX)},
    {x: PAGE19_API_BOX.x, y: centerY(PAGE19_API_BOX)},
  ];
  const vertexToGpuPoints = [
    {x: right(PAGE19_VERTEX_BOX), y: PAGE19_TOP_ROW_Y},
    {x: PAGE19_GPU_BOX.x, y: PAGE19_TOP_ROW_Y},
  ];
  const gpuToPixelsPoints = [
    {x: right(PAGE19_GPU_BOX), y: PAGE19_TOP_ROW_Y},
    {x: PAGE19_PIXEL_BOX.x, y: PAGE19_TOP_ROW_Y},
  ];
  const gfxToGpuPoints = [
    {x: centerX(PAGE19_API_BOX), y: PAGE19_API_BOX.y},
    {x: PAGE19_GPU_AXIS_X, y: bottom(PAGE19_GPU_BOX)},
  ];

  return (
    <PlaceholderBoardShell opacity={opacity}>
      <g opacity={localOpacity}>
        <g opacity={leftBandOpacity}>
          <g
            data-geometry-node-id="stable"
            data-geometry-node-label="stable.upipelinecache"
          >
            <StageBox
              box={PAGE19_STABLE_BOX}
              fill={SOFT_FILL}
              stroke={ACCENT}
              strokeWidth={3}
              markGeometryBox
            />
            <text
              x={centerX(PAGE19_STABLE_BOX)}
              y={centerY(PAGE19_STABLE_BOX) - 18}
              fill={TEXT}
              fontSize="38"
              fontWeight="820"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              UE PSO
            </text>
            <text
              x={centerX(PAGE19_STABLE_BOX)}
              y={centerY(PAGE19_STABLE_BOX) + 18}
              fill={TEXT}
              fontSize="17"
              fontWeight="760"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              stable.upipelinecache
            </text>
          </g>
        </g>

        <g opacity={gpuOpacity}>
          <g data-geometry-node-id="vertex-icon" data-geometry-node-label="VertexData icon">
            <g data-geometry-node-box="1">
              <rect
                x={PAGE19_VERTEX_BOX.x}
                y={PAGE19_VERTEX_BOX.y}
                width={PAGE19_VERTEX_BOX.width}
                height={PAGE19_VERTEX_BOX.height}
                rx={PAGE19_VERTEX_BOX.radius}
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
          </g>
          <g data-geometry-node-id="gpu" data-geometry-node-label="GPU">
            <g data-geometry-node-box="1">
              <rect
                x={PAGE19_GPU_BOX.x}
                y={PAGE19_GPU_BOX.y}
                width={PAGE19_GPU_BOX.width}
                height={PAGE19_GPU_BOX.height}
                rx={PAGE19_GPU_BOX.radius}
                fill="transparent"
                stroke="none"
              />
            </g>
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
          </g>
          <g data-geometry-node-id="pixel-icon" data-geometry-node-label="Pixels icon">
            <g data-geometry-node-box="1">
              <rect
                x={PAGE19_PIXEL_BOX.x}
                y={PAGE19_PIXEL_BOX.y}
                width={PAGE19_PIXEL_BOX.width}
                height={PAGE19_PIXEL_BOX.height}
                rx={PAGE19_PIXEL_BOX.radius}
                fill="transparent"
                stroke="none"
              />
            </g>
            <PixelGrid
              x={PAGE19_GPU_PIXELS.x}
              y={PAGE19_GPU_PIXELS.y}
              opacity={gpuOpacity}
              scale={1.08}
              revealProgress={1}
            />
          </g>
        </g>

        <g opacity={gfxOpacity}>
          <g data-geometry-node-id="gfx-pso" data-geometry-node-label="内存中GfxPSO">
            <StageBox
              box={PAGE19_API_BOX}
              fill={SOFT_FILL}
              stroke={ACCENT}
              strokeWidth={2.8}
              markGeometryBox
            />
            <text
              x={centerX(PAGE19_API_BOX)}
              y={centerY(PAGE19_API_BOX)}
              fill={TEXT}
              fontSize="30"
              fontWeight="800"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              内存中GfxPSO
            </text>
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
              y={centerY(PAGE19_DISK_BOX)}
              fill={TEXT}
              fontSize="31"
              fontWeight="780"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              硬盘中的 PSO
            </text>
          </g>
        </g>

        <g opacity={summaryOpacity}>
          {[
            {
              geometryNodeId: "binary-note-1",
              geometryNodeLabel: "Shader / State",
              box: PAGE19_BINARY_NOTE_BOXES[0],
              title: "Shader / State",
              detailA: "内容一变，旧缓存就可能不再匹配。",
              detailB: "binary / cache 不是稳定接口。",
            },
            {
              geometryNodeId: "binary-note-2",
              geometryNodeLabel: "codegen / 映射",
              box: PAGE19_BINARY_NOTE_BOXES[1],
              title: "codegen / 映射",
              detailA: "SharedCode / Hash / scl 一变，就要重建。",
              detailB: "旧 binary 只对应那次构建组合。",
            },
            {
              geometryNodeId: "binary-note-3",
              geometryNodeLabel: "OS / Driver / GPU / API",
              box: PAGE19_BINARY_NOTE_BOXES[2],
              title: "OS / Driver / GPU / API",
              detailA: "环境一变，本地 binary 也可能立刻失效。",
              detailB: "它只是某次平台组合的落盘形态。",
            },
          ].map((item, index) => (
            <g
              key={item.geometryNodeId}
              data-geometry-node-id={item.geometryNodeId}
              data-geometry-node-label={item.geometryNodeLabel}
            >
              <StageBox
                box={item.box}
                fill={index === 0 ? "rgba(255, 248, 240, 0.92)" : "rgba(255, 251, 246, 0.92)"}
                stroke={index === 0 ? scene.apiStroke : "rgba(92, 106, 118, 0.32)"}
                strokeWidth={index === 0 ? 2.1 : 1.8}
                markGeometryBox
              />
              <text
                x={item.box.x + 18}
                y={item.box.y + 20}
                fill={index === 0 ? scene.apiStroke : "#22303d"}
                fontSize={index === 2 ? "15" : "17"}
                fontWeight="820"
                textAnchor="start"
                dominantBaseline="middle"
                data-geometry-node-text="1"
              >
                {item.title}
              </text>
              <text
                x={item.box.x + 18}
                y={item.box.y + 43}
                fill="rgba(34, 48, 61, 0.8)"
                fontSize={index === 0 ? "13" : "12.5"}
                fontWeight="700"
                textAnchor="start"
                dominantBaseline="middle"
                data-geometry-node-text="1"
              >
                {item.detailA}
              </text>
              <text
                x={item.box.x + 18}
                y={item.box.y + 61}
                fill="rgba(34, 48, 61, 0.66)"
                fontSize="12.5"
                fontWeight="660"
                textAnchor="start"
                dominantBaseline="middle"
                data-geometry-node-text="1"
              >
                {item.detailB}
              </text>
            </g>
          ))}
          <g
            data-geometry-node-id="binary-archive2"
            data-geometry-node-label="Metal Binary Archive 2"
          >
            <StageBox
              box={PAGE19_BINARY_ARCHIVE2_BADGE}
              fill="rgba(248, 236, 226, 0.94)"
              stroke={scene.apiStroke}
              strokeWidth={2.1}
              markGeometryBox
            />
            <text
              x={centerX(PAGE19_BINARY_ARCHIVE2_BADGE)}
              y={PAGE19_BINARY_ARCHIVE2_BADGE.y + 13}
              fill={scene.apiStroke}
              fontSize="12.5"
              fontWeight="820"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              Metal
            </text>
            <text
              x={centerX(PAGE19_BINARY_ARCHIVE2_BADGE)}
              y={PAGE19_BINARY_ARCHIVE2_BADGE.y + 29}
              fill="#22303d"
              fontSize="14"
              fontWeight="800"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              Binary Archive 2 ?
            </text>
          </g>
        </g>

        <StrokeArrow
          d={horizontalPath(right(PAGE19_STABLE_BOX), PAGE19_API_BOX.x, centerY(PAGE19_API_BOX))}
          stroke={ACCENT}
          opacity={gfxOpacity}
          headOpacity={revealHeadOpacity(routeReveal, gfxOpacity)}
          dashArray={revealDashArray(stableToGfxPoints, routeReveal)}
          tipX={PAGE19_API_BOX.x}
          tipY={centerY(PAGE19_API_BOX)}
          direction="right"
          shaftWidth={3}
          underlayWidth={5.5}
          headSize={8}
        />
        <StrokeArrow
          d={horizontalPath(right(PAGE19_VERTEX_BOX), PAGE19_GPU_BOX.x, PAGE19_TOP_ROW_Y)}
          stroke={scene.wireStroke}
          opacity={gpuOpacity}
          headOpacity={revealHeadOpacity(routeReveal, gpuOpacity)}
          dashArray={revealDashArray(vertexToGpuPoints, routeReveal)}
          tipX={PAGE19_GPU_BOX.x}
          tipY={PAGE19_TOP_ROW_Y}
          direction="right"
          shaftWidth={3}
          underlayWidth={5.5}
          headSize={8}
        />
        <StrokeArrow
          d={horizontalPath(right(PAGE19_GPU_BOX), PAGE19_PIXEL_BOX.x, PAGE19_TOP_ROW_Y)}
          stroke={scene.wireStroke}
          opacity={gpuOpacity}
          headOpacity={revealHeadOpacity(routeReveal, gpuOpacity)}
          dashArray={revealDashArray(gpuToPixelsPoints, routeReveal)}
          tipX={PAGE19_PIXEL_BOX.x}
          tipY={PAGE19_TOP_ROW_Y}
          direction="right"
          shaftWidth={3}
          underlayWidth={5.5}
          headSize={8}
        />
        <StrokeArrow
          d={roundedPolylinePath(gfxToGpuPoints)}
          stroke={ACCENT}
          opacity={gfxOpacity}
          headOpacity={revealHeadOpacity(routeReveal, gfxOpacity)}
          dashArray={revealDashArray(gfxToGpuPoints, routeReveal)}
          tipX={PAGE19_GPU_AXIS_X}
          tipY={bottom(PAGE19_GPU_BOX)}
          direction="up"
          shaftWidth={3}
          underlayWidth={5.5}
          headSize={8}
        />
        <StrokeArrow
          d={horizontalPath(right(PAGE19_API_BOX), PAGE19_DISK_BOX.x, centerY(PAGE19_API_BOX))}
          stroke={scene.wireStroke}
          opacity={diskOpacity}
          headOpacity={revealHeadOpacity(routeReveal, diskOpacity)}
          dashArray="10 8"
          tipX={PAGE19_DISK_BOX.x}
          tipY={centerY(PAGE19_API_BOX)}
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
  const reveal = resolveWindowProgress(entryProgress, 0.02, 0.82, easeOutQuint);
  const panelReveal = resolveWindowProgress(opacity, 0, 0.5, easeOutQuint);
  const panelOpacity = panelReveal * reveal;
  const callbackRestore = resolveWindowProgress(entryProgress, 0.02, 0.1, easeOutQuint);
  const callbackStructureReveal = resolveWindowProgress(
    entryProgress,
    0.03,
    0.16,
    easeOutQuint,
  );
  const callbackExit = resolveWindowProgress(entryProgress, 0.8, 0.96, easeInOutCubic);
  const callbackStageOpacity = callbackRestore * (1 - callbackExit);
  const callbackStageShiftX =
    mix(96, 0, callbackRestore) + mix(0, -294, callbackExit);
  const sharedCarrierOpacity = panelOpacity * resolveWindowProgress(
    entryProgress,
    0.04,
    0.98,
    easeOutQuint,
  );
  const sharedMorphProgress = resolveWindowProgress(
    entryProgress,
    0.7,
    0.92,
    easeInOutCubic,
  );
  const sharedContentProgress = resolveWindowProgress(
    entryProgress,
    0.82,
    0.96,
    easeOutQuint,
  );
  const sharedRouteReveal = resolveWindowProgress(
    entryProgress,
    0.14,
    0.96,
    easeOutQuint,
  );
  const footerOpacity = resolveWindowProgress(entryProgress, 0.88, 0.99, easeOutQuint);
  return (
    <PlaceholderBoardShell opacity={panelOpacity}>
      <g transform={`translate(0 ${LATE_INLINE_TITLE_REMOVAL_SHIFT_Y})`}>
        <Page18RestoreCarrier
          scene={scene}
          opacity={callbackStageOpacity}
          reveal={callbackStructureReveal}
          shiftX={callbackStageShiftX}
          showSharedDeliveryElements={false}
        />
        <Page21SharedDeliveryLayer
          scene={scene}
          opacity={sharedCarrierOpacity}
          morphProgress={sharedMorphProgress}
          contentProgress={sharedContentProgress}
          routeReveal={sharedRouteReveal}
        />
        <LateFooterBar
          scene={scene}
          opacity={footerOpacity}
          geometryNodeId="footer"
          box={PAGE21_FOOTER_BOX}
          text="玩家拿到 stable.upipelinecache + ShaderLibrary 后，运行时更不容易卡顿。"
        />
      </g>
    </PlaceholderBoardShell>
  );
}

function Page18RestoreCarrier({
  scene,
  opacity,
  reveal,
  shiftX,
  showSharedDeliveryElements = true,
}: {
  scene: SceneModel;
  opacity: number;
  reveal: number;
  shiftX: number;
  showSharedDeliveryElements?: boolean;
}) {
  const stablePcBox = STABLE_PC_BOX;
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
  const stableExpandToMergePoints = [
    {x: right(COMPUTER_BOX) + 18, y: PAGE15_EXPAND_MERGE_CENTER.y},
    {x: PAGE15_EXPAND_MERGE_CENTER.x - 18, y: PAGE15_EXPAND_MERGE_CENTER.y},
  ];
  const stableExpandMergeToStablePcPoints = [
    {x: PAGE15_EXPAND_MERGE_CENTER.x + 18, y: PAGE15_EXPAND_MERGE_CENTER.y},
    {x: stablePcBox.x - 10, y: centerY(stablePcBox)},
  ];
  const sclToExpandMergePoints = [
    {x: centerX(SCL_BOX), y: SCL_BOX.y - 10},
    {x: PAGE15_EXPAND_MERGE_CENTER.x, y: PAGE15_EXPAND_MERGE_CENTER.y + 18},
  ];
  const stablePcToMergePoints = [
    {x: right(stablePcBox) + 10, y: centerY(stablePcBox)},
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
  const deviceReveal = resolveWindowProgress(reveal, 0.02, 0.16, easeOutQuint);
  const cookCarrierOpacity = resolveWindowProgress(reveal, 0.06, 0.22, easeOutQuint);
  const cookMainReveal = resolveWindowProgress(reveal, 0.08, 0.2, easeOutQuint);
  const cookBranchReveal = resolveWindowProgress(reveal, 0.12, 0.26, easeOutQuint);
  const bytecodeNodeOpacity = resolveWindowProgress(reveal, 0.14, 0.28, easeOutQuint);
  const bytecodeRouteOpacity = resolveWindowProgress(reveal, 0.18, 0.34, easeOutQuint);
  const bytecodeRouteReveal = resolveWindowProgress(reveal, 0.2, 0.36, easeOutQuint);
  const sclOpacity = resolveWindowProgress(reveal, 0.12, 0.24, easeOutQuint);
  const recOpacity = resolveWindowProgress(reveal, 0.28, 0.44, easeOutQuint);
  const recEdge1Reveal = resolveWindowProgress(reveal, 0.28, 0.42, easeOutQuint);
  const recEdge2Reveal = resolveWindowProgress(reveal, 0.32, 0.48, easeOutQuint);
  const stableNode1Opacity = resolveWindowProgress(reveal, 0.46, 0.58, easeOutQuint);
  const stableNode2Opacity = resolveWindowProgress(reveal, 0.52, 0.66, easeOutQuint);
  const stableNode3Opacity = resolveWindowProgress(reveal, 0.58, 0.72, easeOutQuint);
  const stableNode4Opacity = resolveWindowProgress(reveal, 0.64, 0.8, easeOutQuint);
  const stableEdge1Opacity = resolveWindowProgress(reveal, 0.46, 0.58, easeOutQuint);
  const stableEdge1Reveal = resolveWindowProgress(reveal, 0.46, 0.6, easeOutQuint);
  const stableEdge2Opacity = resolveWindowProgress(reveal, 0.52, 0.64, easeOutQuint);
  const stableEdge2Reveal = resolveWindowProgress(reveal, 0.52, 0.66, easeOutQuint);
  const stableSupportEdge1Opacity = resolveWindowProgress(
    reveal,
    0.54,
    0.68,
    easeOutQuint,
  );
  const stableSupportEdge1Reveal = resolveWindowProgress(
    reveal,
    0.54,
    0.7,
    easeOutQuint,
  );
  const stableEdge3Opacity = resolveWindowProgress(reveal, 0.6, 0.72, easeOutQuint);
  const stableEdge3Reveal = resolveWindowProgress(reveal, 0.6, 0.74, easeOutQuint);
  const stableSupportEdge2Opacity = resolveWindowProgress(
    reveal,
    0.62,
    0.76,
    easeOutQuint,
  );
  const stableSupportEdge2Reveal = resolveWindowProgress(
    reveal,
    0.62,
    0.78,
    easeOutQuint,
  );
  const stableEdge4Opacity = resolveWindowProgress(reveal, 0.68, 0.82, easeOutQuint);
  const stableEdge4Reveal = resolveWindowProgress(reveal, 0.68, 0.84, easeOutQuint);
  const stableToPhoneOpacity = resolveWindowProgress(reveal, 0.74, 0.88, easeOutQuint);
  const stableToPhoneReveal = resolveWindowProgress(reveal, 0.74, 0.9, easeOutQuint);
  const cookLabelOpacity = resolveWindowProgress(reveal, 0.1, 0.24, easeOutQuint);

  return (
    <g
      data-testid="page21-callback-stage"
      opacity={opacity}
      transform={`translate(${shiftX} 0)`}
    >
      <g data-testid="page21-callback-computer">
        <ComputerDevice
          scene={scene}
          opacity={0.82 * deviceReveal}
          scale={1}
          showLabel
        />
      </g>
      {showSharedDeliveryElements ? (
        <g data-testid="page21-callback-phone">
          <PhoneDevice
            scene={scene}
            opacity={deviceReveal}
            scale={1}
            landingFocus={0}
            stableFocus={0}
            showShell
            showDeviceLabel={false}
            showVertexLabel={false}
            showPixelsLabel={false}
            contentOpacity={0.92 * deviceReveal}
          />
        </g>
      ) : null}
      <ArtifactNode
        box={SCL_BOX}
        scene={scene}
        opacity={sclOpacity}
        label=".scl.csv"
        geometryNodeId="page21-callback-scl"
        geometryNodeLabel=".scl.csv"
      />
      {showSharedDeliveryElements ? (
        <ArtifactNode
          box={BYTECODE_BOX}
          scene={scene}
          opacity={bytecodeNodeOpacity}
          label=".ushaderbytecode"
          geometryNodeId="page21-callback-shader"
          geometryNodeLabel=".ushaderbytecode"
        />
      ) : null}
      <ArtifactNode
        box={REC_BOX}
        scene={scene}
        opacity={recOpacity}
        label="rec.upipelinecache"
        geometryNodeId="page21-callback-rec"
        geometryNodeLabel="rec.upipelinecache"
      />
      <ArtifactNode
        box={stablePcBox}
        scene={scene}
        opacity={stableNode2Opacity}
        label="stablepc.csv"
        geometryNodeId="page21-callback-stablepc"
        geometryNodeLabel="stablepc.csv"
      />
      {showSharedDeliveryElements ? (
        <ArtifactNode
          box={STABLE_UPIPE_BOX}
          scene={scene}
          opacity={stableNode4Opacity}
          lines={["stable.", "upipelinecache"]}
          geometryNodeId="page21-callback-pso"
          geometryNodeLabel="stable.upipelinecache"
        />
      ) : null}
      {cookCarrierOpacity > 0.001 ? (
        <>
          <circle
            cx={SPLIT_CENTER.x}
            cy={SPLIT_CENTER.y}
            r="8"
            fill="rgba(255, 251, 246, 0.98)"
            stroke={scene.nodeStroke}
            strokeWidth="2.2"
            opacity={cookCarrierOpacity}
          />
          <StrokeArrow
            testId="page21-callback-cook-arrow"
            d={roundedPolylinePath(cookToSplitPoints)}
            stroke={LOOP_CLOUD_STROKE}
            opacity={cookCarrierOpacity}
            headOpacity={revealHeadOpacity(cookMainReveal, cookCarrierOpacity)}
            dashArray={revealDashArray(cookToSplitPoints, cookMainReveal)}
            tipX={SPLIT_CENTER.x - 8}
            tipY={SPLIT_CENTER.y}
            direction="right"
            shaftWidth={3.2}
            underlayWidth={6}
            headSize={9}
          />
          <text
            x={(centerX(COMPUTER_BOX) + (SPLIT_CENTER.x - 8)) / 2}
            y={SPLIT_CENTER.y - 28}
            fill={LOOP_CLOUD_STROKE}
            fontSize="24"
            fontWeight="760"
            textAnchor="middle"
            opacity={cookLabelOpacity}
          >
            cook
          </text>
          <StrokeArrow
            testId="page21-callback-split-to-scl-arrow"
            d={roundedPolylinePath(splitToSclPoints)}
            stroke={LOOP_CLOUD_STROKE}
            opacity={cookCarrierOpacity}
            headOpacity={revealHeadOpacity(cookBranchReveal, cookCarrierOpacity)}
            dashArray={revealDashArray(splitToSclPoints, cookBranchReveal)}
            tipX={centerX(SCL_BOX)}
            tipY={SCL_BOX.y + SCL_BOX.height}
            direction="up"
            shaftWidth={3.2}
            underlayWidth={5.8}
            headSize={9}
          />
          <StrokeArrow
            testId="page21-callback-split-to-bytecode-arrow"
            d={roundedPolylinePath(splitToBytecodePoints)}
            stroke={LOOP_CLOUD_STROKE}
            opacity={cookCarrierOpacity}
            headOpacity={revealHeadOpacity(cookBranchReveal, cookCarrierOpacity)}
            dashArray={revealDashArray(splitToBytecodePoints, cookBranchReveal)}
            tipX={BYTECODE_BOX.x - 12}
            tipY={centerY(BYTECODE_BOX)}
            direction="right"
            shaftWidth={3.2}
            underlayWidth={5.8}
            headSize={9}
          />
        </>
      ) : null}
      {showSharedDeliveryElements ? (
        <StrokeArrow
          testId="page21-callback-shader-to-phone-arrow"
          d={roundedPolylinePath(bytecodeToPhonePoints)}
          stroke={scene.apiStroke}
          opacity={bytecodeRouteOpacity}
          headOpacity={revealHeadOpacity(bytecodeRouteReveal, bytecodeRouteOpacity)}
          dashArray={revealDashArray(bytecodeToPhonePoints, bytecodeRouteReveal)}
          tipX={PHONE_BOX.x - 10}
          tipY={PHONE_GPU.y + 76}
          direction="right"
          shaftWidth={3}
          underlayWidth={5.8}
          headSize={8}
        />
      ) : null}
      <StrokeArrow
        testId="page21-callback-phone-to-rec-arrow"
        d={roundedPolylinePath(recPhoneToRecPoints)}
        stroke={LOOP_CLOUD_STROKE}
        opacity={recOpacity}
        headOpacity={revealHeadOpacity(recEdge1Reveal, recOpacity)}
        dashArray={revealDashArray(recPhoneToRecPoints, recEdge1Reveal)}
        tipX={right(REC_BOX) + 12}
        tipY={centerY(REC_BOX)}
        direction="left"
        shaftWidth={3.2}
        underlayWidth={5.8}
        headSize={9}
      />
      <StrokeArrow
        testId="page21-callback-rec-to-computer-arrow"
        d={roundedPolylinePath(recToComputerPoints)}
        stroke={LOOP_CLOUD_STROKE}
        opacity={recOpacity}
        headOpacity={revealHeadOpacity(recEdge2Reveal, recOpacity)}
        dashArray={revealDashArray(recToComputerPoints, recEdge2Reveal)}
        tipX={centerX(COMPUTER_BOX)}
        tipY={COMPUTER_BOX.y - 8}
        direction="down"
        shaftWidth={3.2}
        underlayWidth={5.8}
        headSize={9}
      />
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
        testId="page21-callback-expand-to-merge-arrow"
        d={roundedPolylinePath(stableExpandToMergePoints)}
        stroke={LOOP_CLOUD_STROKE}
        opacity={stableEdge1Opacity}
        headOpacity={revealHeadOpacity(stableEdge1Reveal, stableEdge1Opacity)}
        dashArray={revealDashArray(stableExpandToMergePoints, stableEdge1Reveal)}
        tipX={PAGE15_EXPAND_MERGE_CENTER.x - 18}
        tipY={PAGE15_EXPAND_MERGE_CENTER.y}
        direction="right"
        shaftWidth={3.2}
        underlayWidth={5.8}
        headSize={9}
      />
      <text
        x={(PAGE15_EXPAND_MERGE_CENTER.x + 18 + (stablePcBox.x - 10)) / 2}
        y={PAGE15_EXPAND_MERGE_CENTER.y - 24}
        fill={LOOP_CLOUD_STROKE}
        fontSize="24"
        fontWeight="760"
        textAnchor="middle"
        opacity={stableNode1Opacity}
      >
        expand
      </text>
      <StrokeArrow
        testId="page21-callback-expand-merge-to-stablepc-arrow"
        d={roundedPolylinePath(stableExpandMergeToStablePcPoints)}
        stroke={LOOP_CLOUD_STROKE}
        opacity={stableEdge2Opacity}
        headOpacity={revealHeadOpacity(stableEdge2Reveal, stableEdge2Opacity)}
        dashArray={revealDashArray(
          stableExpandMergeToStablePcPoints,
          stableEdge2Reveal,
        )}
        tipX={stablePcBox.x - 10}
        tipY={centerY(stablePcBox)}
        direction="right"
        shaftWidth={3.2}
        underlayWidth={5.8}
        headSize={9}
      />
      <StrokeArrow
        testId="page21-callback-scl-to-expand-merge-arrow"
        d={roundedPolylinePath(sclToExpandMergePoints)}
        stroke={LOOP_CLOUD_STROKE}
        opacity={stableSupportEdge1Opacity}
        headOpacity={revealHeadOpacity(
          stableSupportEdge1Reveal,
          stableSupportEdge1Opacity,
        )}
        dashArray={revealDashArray(
          sclToExpandMergePoints,
          stableSupportEdge1Reveal,
        )}
        tipX={PAGE15_EXPAND_MERGE_CENTER.x}
        tipY={PAGE15_EXPAND_MERGE_CENTER.y + 18}
        direction="up"
        shaftWidth={3.2}
        underlayWidth={5.8}
        headSize={9}
      />
      <StrokeArrow
        testId="page21-callback-stablepc-to-merge-arrow"
        d={roundedPolylinePath(stablePcToMergePoints)}
        stroke={LOOP_CLOUD_STROKE}
        opacity={stableEdge3Opacity}
        headOpacity={revealHeadOpacity(stableEdge3Reveal, stableEdge3Opacity)}
        dashArray={revealDashArray(stablePcToMergePoints, stableEdge3Reveal)}
        tipX={PAGE15_MERGE_CENTER.x - 20}
        tipY={PAGE15_MERGE_CENTER.y}
        direction="right"
        shaftWidth={3.2}
        underlayWidth={5.8}
        headSize={9}
      />
      <StrokeArrow
        testId="page21-callback-scl-to-merge-arrow"
        d={roundedPolylinePath(sclToMergePoints)}
        stroke={LOOP_CLOUD_STROKE}
        opacity={stableSupportEdge2Opacity}
        headOpacity={revealHeadOpacity(
          stableSupportEdge2Reveal,
          stableSupportEdge2Opacity,
        )}
        dashArray={revealDashArray(sclToMergePoints, stableSupportEdge2Reveal)}
        tipX={PAGE15_MERGE_CENTER.x}
        tipY={PAGE15_MERGE_CENTER.y + 18}
        direction="up"
        shaftWidth={3.2}
        underlayWidth={5.8}
        headSize={9}
      />
      <StrokeArrow
        testId="page21-callback-merge-to-stable-arrow"
        d={roundedPolylinePath(mergeToStablePoints)}
        stroke={LOOP_CLOUD_STROKE}
        opacity={stableEdge4Opacity}
        headOpacity={revealHeadOpacity(stableEdge4Reveal, stableEdge4Opacity)}
        dashArray={revealDashArray(mergeToStablePoints, stableEdge4Reveal)}
        tipX={STABLE_UPIPE_BOX.x - 10}
        tipY={centerY(STABLE_UPIPE_BOX)}
        direction="right"
        shaftWidth={3.2}
        underlayWidth={5.8}
        headSize={9}
      />
      {showSharedDeliveryElements ? (
        <StrokeArrow
          testId="page21-callback-pso-to-phone-arrow"
          d={roundedPolylinePath(stableToPhonePoints)}
          stroke={scene.apiStroke}
          opacity={stableToPhoneOpacity}
          headOpacity={revealHeadOpacity(stableToPhoneReveal, stableToPhoneOpacity)}
          dashArray={revealDashArray(stableToPhonePoints, stableToPhoneReveal)}
          tipX={PHONE_BOX.x - 10}
          tipY={stableToPhoneY}
          direction="right"
          shaftWidth={3}
          underlayWidth={5.8}
          headSize={8}
        />
      ) : null}
    </g>
  );
}

function Page21SharedDeliveryLayer({
  scene,
  opacity,
  morphProgress,
  contentProgress,
  routeReveal,
}: {
  scene: SceneModel;
  opacity: number;
  morphProgress: number;
  contentProgress: number;
  routeReveal: number;
}) {
  const psoBox = mixBox(STABLE_UPIPE_BOX, PAGE21_PSO_BOX, morphProgress);
  const shaderBox = mixBox(BYTECODE_BOX, PAGE21_SHADER_BOX, morphProgress);
  const phoneScale = mix(1, 1.34, morphProgress);
  const phoneOffsetX = mix(0, -284, morphProgress);
  const phoneWidth = PHONE_BOX.width * phoneScale;
  const phoneHeight = PHONE_BOX.height * phoneScale;
  const phoneCenter = {
    x: centerX(PHONE_BOX) + phoneOffsetX,
    y: centerY(PHONE_BOX),
  };
  const phoneMetrics = {
    x: phoneCenter.x - phoneWidth / 2,
    y: phoneCenter.y - phoneHeight / 2,
    width: phoneWidth,
    height: phoneHeight,
  };
  const upperRoute = [
    {x: right(psoBox) + 10, y: centerY(psoBox)},
    {x: phoneMetrics.x - 12, y: centerY(psoBox)},
  ];
  const lowerRoute = [
    {x: right(shaderBox) + 10, y: centerY(shaderBox)},
    {x: phoneMetrics.x - 12, y: centerY(shaderBox)},
  ];
  const transitionOpacity = opacity;
  const oldContentOpacity = transitionOpacity * (1 - contentProgress);
  const newContentOpacity = transitionOpacity * contentProgress;
  const phoneLabelOpacity = resolveWindowProgress(contentProgress, 0.44, 1, easeOutQuint);
  const routeOpacity = transitionOpacity;

  return (
    <>
      <g data-testid="page21-pso-card">
        <ArtifactNode
          box={psoBox}
          scene={scene}
          opacity={oldContentOpacity}
          lines={["stable.", "upipelinecache"]}
          labelFontSize={26}
          emphasized
        />
        <ArtifactNode
          box={psoBox}
          scene={scene}
          opacity={newContentOpacity}
          label="stable.upipelinecache"
          detail="预构建 PSO"
          geometryNodeId="pso-card"
          geometryNodeLabel="stable.upipelinecache"
          labelFontSize={23}
          detailFontSize={17}
          emphasized
        />
      </g>
      <g data-testid="page21-shader-card">
        <ArtifactNode
          box={shaderBox}
          scene={scene}
          opacity={oldContentOpacity}
          label=".ushaderbytecode"
        />
        <ArtifactNode
          box={shaderBox}
          scene={scene}
          opacity={newContentOpacity}
          label="ShaderLibrary"
          detail=".ushaderbytecode"
          geometryNodeId="shader-card"
          geometryNodeLabel="ShaderLibrary"
          labelFontSize={27}
          detailFontSize={17}
          emphasized
        />
      </g>
      <g data-testid="page21-player-phone" opacity={transitionOpacity}>
        <PhoneDevice
          scene={scene}
          opacity={1}
          scale={phoneScale}
          landingFocus={0}
          stableFocus={0}
          offsetX={phoneOffsetX}
          showShell
          showDeviceLabel
          deviceLabel="玩家"
          deviceLabelOpacity={phoneLabelOpacity}
          showRuntimeLabel={false}
          showVertexLabel={false}
          showPixelsLabel={false}
          contentOpacity={1}
        />
      </g>
      <g opacity={routeOpacity}>
        <StrokeArrow
          testId="page21-pso-to-phone-arrow"
          d={roundedPolylinePath(upperRoute)}
          stroke={scene.apiStroke}
          opacity={routeOpacity}
          headOpacity={revealHeadOpacity(routeReveal, routeOpacity)}
          dashArray={revealDashArray(upperRoute, routeReveal)}
          tipX={upperRoute[upperRoute.length - 1]!.x}
          tipY={upperRoute[upperRoute.length - 1]!.y}
          direction="right"
          shaftWidth={3}
          underlayWidth={5.4}
          headSize={8}
        />
        <StrokeArrow
          testId="page21-shader-to-phone-arrow"
          d={roundedPolylinePath(lowerRoute)}
          stroke={scene.apiStroke}
          opacity={routeOpacity}
          headOpacity={revealHeadOpacity(routeReveal, routeOpacity)}
          dashArray={revealDashArray(lowerRoute, routeReveal)}
          tipX={lowerRoute[lowerRoute.length - 1]!.x}
          tipY={lowerRoute[lowerRoute.length - 1]!.y}
          direction="right"
          shaftWidth={3}
          underlayWidth={5.4}
          headSize={8}
        />
      </g>
    </>
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
  const leftColumn = {x: 60, y: 138, width: 396, height: 434, radius: 30};
  const factsColumn = {x: 480, y: 138, width: 320, height: 434, radius: 28};
  const rightColumn = {x: 824, y: 138, width: 396, height: 434, radius: 30};
  const rowStartY = leftColumn.y + 70;
  const rowGap = 12;
  const rowHeight = 62;
  const factBadgeRadius = 18;
  const factBadgeSpacing = 72;
  const factGlowOuterRadius = factBadgeRadius + 12;
  const factGlowInnerRadius = factBadgeRadius + 7;
  const rowCenters = Array.from({length: 5}, (_, index) =>
    rowStartY + rowHeight / 2 + index * (rowHeight + rowGap),
  );
  const rows = [
    {
      left: ["不打开 SharedShaderCode"],
      facts: [6, 8],
      right: ["PSO 收集了之后也没法应用到下一次；", "只有 Hash，根本没法反查 ShaderCode。"],
    },
    {
      left: ["不做 PSO 预编译"],
      facts: [5],
      right: ["编译高峰原封不动甩给玩家。"],
    },
    {
      left: ["直接分发构建机构建的二进制"],
      facts: [12, 13],
      right: ["构建机上能用，玩家机器上不一定能用。"],
    },
    {
      left: ["cook 时一把梭算完"],
      facts: [2, 9],
      right: ["PSO 指数膨胀，数量直接起飞。"],
    },
    {
      left: ["新包直接吃上一个版本的", ".rec.upipelinecache"],
      facts: [10, 11],
      right: ["新包里的 Hash，和旧包可能早就对不上了。"],
    },
  ] as const;
  const separatorY = rowCenters
    .slice(0, -1)
    .map((center) => center + rowHeight / 2 + rowGap / 2 - 1);
  const leftGapArrowX = (right(leftColumn) + factsColumn.x) / 2;
  const rightGapArrowX = (right(factsColumn) + rightColumn.x) / 2;
  const gapArrowTopY = rowCenters[0]! - 18;
  const gapArrowBottomY = rowCenters[rowCenters.length - 1]! + 18;
  const footerBox = {x: 204, y: 606, width: 872, height: 54, radius: 24};
  const sampleBStripBox = {x: 426, y: 674, width: 428, height: 72, radius: 18};

  return (
    <PlaceholderBoardShell opacity={panelOpacity}>
      <g transform={`translate(0 ${LATE_INLINE_TITLE_REMOVAL_SHIFT_Y})`}>
        <g
          opacity={panelOpacity}
          data-geometry-node-id="left-column"
          data-geometry-node-label="非要这么干？"
        >
          <g data-geometry-node-box="1">
            <StageBox
              box={leftColumn}
              fill="rgba(255, 248, 240, 0.94)"
              stroke={scene.apiStroke}
              strokeWidth={2.5}
            />
          </g>
          <text
            x={centerX(leftColumn)}
            y={leftColumn.y + 28}
            fill={scene.apiStroke}
            fontSize="24"
            fontWeight="820"
            textAnchor="middle"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            非要这么干？
          </text>
          {separatorY.map((y) => (
            <line
              key={`page22-left-separator-${y}`}
              x1={leftColumn.x + 18}
              y1={y}
              x2={right(leftColumn) - 18}
              y2={y}
              stroke="rgba(92, 106, 118, 0.18)"
              strokeWidth={1.2}
            />
          ))}
          {rows.map((row, index) => (
            <g key={`page22-left-row-${index}`}>
              {row.left.map((line, lineIndex) => (
                <text
                  key={`${line}-${lineIndex}`}
                  x={centerX(leftColumn)}
                  y={
                    row.left.length === 1
                      ? rowCenters[index]
                      : rowCenters[index] - 12 + lineIndex * 24
                  }
                  fill="#22303d"
                  fontSize="18.5"
                  fontWeight={lineIndex === 0 ? "820" : "760"}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  data-geometry-node-text="1"
                >
                  {line}
                </text>
              ))}
            </g>
          ))}
        </g>
        <StrokeArrow
          testId="page22-left-gap-arrow"
          d={verticalPath(leftGapArrowX, gapArrowTopY, gapArrowBottomY)}
          stroke="rgba(92, 106, 118, 0.62)"
          opacity={panelOpacity}
          headOpacity={panelOpacity}
          tipX={leftGapArrowX}
          tipY={gapArrowBottomY}
          direction="down"
          shaftWidth={2.4}
          underlayWidth={4.4}
          headSize={6.8}
        />
        <g
          opacity={panelOpacity}
          data-geometry-node-id="facts-column"
          data-geometry-node-label="事实链"
        >
          <g data-geometry-node-box="1">
            <StageBox
              box={factsColumn}
              fill="rgba(255, 255, 255, 0.92)"
              stroke="rgba(92, 106, 118, 0.34)"
              strokeWidth={2.2}
            />
          </g>
          <text
            x={centerX(factsColumn)}
            y={factsColumn.y + 28}
            fill={scene.apiStroke}
            fontSize="23"
            fontWeight="820"
            textAnchor="middle"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            事实
          </text>
          {separatorY.map((y) => (
            <line
              key={`page22-facts-separator-${y}`}
              x1={factsColumn.x + 18}
              y1={y}
              x2={right(factsColumn) - 18}
              y2={y}
              stroke="rgba(92, 106, 118, 0.18)"
              strokeWidth={1.2}
            />
          ))}
          {rows.map((row, index) => (
            <g key={`page22-fact-row-${index}`}>
              {row.facts.map((factId, factIndex) => {
                const badgeX =
                  centerX(factsColumn) +
                  (factIndex - (row.facts.length - 1) / 2) * factBadgeSpacing;
                const badgeY = rowCenters[index];

                return (
                  <g key={`page22-fact-row-${index}-${factId}`}>
                    <g
                      opacity={panelOpacity}
                      data-testid={`page22-fact-glow-row${index}-fact${factId}`}
                    >
                      <circle
                        cx={badgeX}
                        cy={badgeY}
                        r={factGlowOuterRadius}
                        fill="rgba(198, 111, 76, 0.10)"
                      />
                      <circle
                        cx={badgeX}
                        cy={badgeY}
                        r={factGlowInnerRadius}
                        fill="rgba(198, 111, 76, 0.18)"
                      />
                    </g>
                    <CalloutBadge
                      x={badgeX}
                      y={badgeY}
                      label={String(factId)}
                      stroke={scene.apiStroke}
                      fill="rgba(255, 248, 240, 0.98)"
                      radius={factBadgeRadius}
                      opacity={panelOpacity}
                      testId={`page22-fact-badge-row${index}-fact${factId}`}
                    />
                  </g>
                );
              })}
            </g>
          ))}
        </g>
        <StrokeArrow
          testId="page22-right-gap-arrow"
          d={verticalPath(rightGapArrowX, gapArrowTopY, gapArrowBottomY)}
          stroke="rgba(92, 106, 118, 0.62)"
          opacity={panelOpacity}
          headOpacity={panelOpacity}
          tipX={rightGapArrowX}
          tipY={gapArrowBottomY}
          direction="down"
          shaftWidth={2.4}
          underlayWidth={4.4}
          headSize={6.8}
        />
        <g
          opacity={panelOpacity}
          data-geometry-node-id="right-column"
          data-geometry-node-label="那就会这样"
        >
          <g data-geometry-node-box="1">
            <StageBox
              box={rightColumn}
              fill="rgba(249, 247, 244, 0.94)"
              stroke="rgba(92, 106, 118, 0.32)"
              strokeWidth={2.1}
            />
          </g>
          <text
            x={centerX(rightColumn)}
            y={rightColumn.y + 28}
            fill={scene.apiStroke}
            fontSize="24"
            fontWeight="820"
            textAnchor="middle"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            那就会这样
          </text>
          {separatorY.map((y) => (
            <line
              key={`page22-right-separator-${y}`}
              x1={rightColumn.x + 18}
              y1={y}
              x2={right(rightColumn) - 18}
              y2={y}
              stroke="rgba(92, 106, 118, 0.18)"
              strokeWidth={1.2}
            />
          ))}
          {rows.map((row, index) => (
            <g key={`page22-right-row-${index}`}>
              {row.right.map((line, lineIndex) => (
                <text
                  key={`${line}-${lineIndex}`}
                  x={centerX(rightColumn)}
                  y={
                    row.right.length === 1
                      ? rowCenters[index]
                      : rowCenters[index] - 12 + lineIndex * 24
                  }
                  fill="#22303d"
                  fontSize="17.5"
                  fontWeight={lineIndex === 0 ? "790" : "720"}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  data-geometry-node-text="1"
                >
                  {line}
                </text>
              ))}
            </g>
          ))}
        </g>
        <LateFooterBar
          scene={scene}
          opacity={panelOpacity}
          geometryNodeId="footer"
          text="PSO 的成本不会消失，只会转移。"
          box={footerBox}
        />
        <LateBareImage
          scene={scene}
          box={sampleBStripBox}
          href="/supplement/ogl-mtl/ios-compile-count.png"
          clipId="page22-sample-b-strip"
          opacity={panelOpacity}
          geometryNodeId="sample-b-strip"
          geometryNodeLabel="SampleBStrip"
          preserveAspectRatio="xMidYMid meet"
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
  const leftCard = {x: 44, y: 58, width: 520, height: 560, radius: 30};
  const rightCard = {x: 588, y: 58, width: 648, height: 560, radius: 30};
  const page24FooterBox = {x: 120, y: 628, width: 1040, height: 52, radius: 22};
  const packageRows = COMPRESSION_SUMMARY_ROWS.filter(
    (row) =>
      row.algorithm === "LZ4" ||
      row.algorithm === "zstd" ||
      row.algorithm === "Oodle Leviathan",
  );
  const packageRowBoxes = packageRows.map((_, index) => ({
    x: leftCard.x + 18,
    y: leftCard.y + 82 + index * 140,
    width: leftCard.width - 36,
    height: 132,
    radius: 24,
  }));
  const memoryHeaderBox = {
    x: rightCard.x + 24,
    y: rightCard.y + 72,
    width: rightCard.width - 48,
    height: 32,
    radius: 16,
  };
  const memoryBox = {
    x: rightCard.x + 28,
    y: rightCard.y + 128,
    width: 268,
    height: 248,
    radius: 24,
  };
  const diskBox = {
    x: rightCard.x + 352,
    y: rightCard.y + 128,
    width: 268,
    height: 248,
    radius: 24,
  };
  const flowLaneBox = {
    x: right(memoryBox) + 8,
    y: memoryBox.y + 30,
    width: diskBox.x - right(memoryBox) - 16,
    height: 188,
    radius: 22,
  };
  const memoryHotBox = {
    x: memoryBox.x + 18,
    y: memoryBox.y + 54,
    width: 232,
    height: 58,
    radius: 18,
  };
  const memorySwapBox = {
    x: memoryBox.x + 18,
    y: memoryBox.y + 132,
    width: 232,
    height: 78,
    radius: 18,
  };
  const diskMapBox = {
    x: diskBox.x + 18,
    y: diskBox.y + 54,
    width: 232,
    height: 58,
    radius: 18,
  };
  const diskCarrierBox = {
    x: diskBox.x + 18,
    y: diskBox.y + 132,
    width: 232,
    height: 78,
    radius: 18,
  };
  const memoryMethodCards = [
    {
      id: "memory-method-1",
      title: "选取策略",
      value: "LRU / Clock / Pin",
      x: rightCard.x + 24,
      width: 190,
      accent: true,
    },
    {
      id: "memory-method-2",
      title: "回填路径",
      value: "mmap / paging",
      x: rightCard.x + 229,
      width: 190,
      accent: false,
    },
    {
      id: "memory-method-3",
      title: "外存载体",
      value: "file / SQL / KV",
      x: rightCard.x + 434,
      width: 190,
      accent: false,
    },
  ] as const;

  return (
    <PlaceholderBoardShell opacity={panelOpacity}>
      <g transform={`translate(0 ${LATE_INLINE_TITLE_REMOVAL_SHIFT_Y})`}>
        <g
          data-geometry-node-id="left-card"
          data-geometry-node-label="Package"
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
            y={leftCard.y + 32}
            fill={scene.apiStroke}
            fontSize="31"
            fontWeight="840"
            textAnchor="start"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            包体
          </text>
          <text
            x={leftCard.x + 18}
            y={leftCard.y + 62}
            fill="rgba(34, 48, 61, 0.74)"
            fontSize="18"
            fontWeight="760"
            textAnchor="start"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            ShaderCode 压缩
          </text>
          {packageRows.map((row, index) => {
            const rowBox = packageRowBoxes[index];
            const rowNodeId = `package-row-${index + 1}`;
            const ratioBox = {
              x: right(rowBox) - 126,
              y: rowBox.y + 12,
              width: 108,
              height: 38,
              radius: 19,
            };
            const algorithmMetaX =
              row.algorithm === "Oodle Leviathan" ? rowBox.x + 230 : rowBox.x + 122;
            const platformPills = [
              {
                id: `${rowNodeId}-windows`,
                platform: "Windows",
                value: row.windows,
                label: `Windows ${row.windows}`,
                box: {
                  x: rowBox.x + 18,
                  y: rowBox.y + 58,
                  width: 216,
                  height: 28,
                  radius: 15,
                },
              },
              {
                id: `${rowNodeId}-macos`,
                platform: "macOS",
                value: row.macos,
                label: `macOS ${row.macos}`,
                box: {
                  x: rowBox.x + 250,
                  y: rowBox.y + 58,
                  width: 216,
                  height: 28,
                  radius: 15,
                },
              },
              {
                id: `${rowNodeId}-android`,
                platform: "Android",
                value: row.android,
                label: `Android ${row.android}`,
                box: {
                  x: rowBox.x + 18,
                  y: rowBox.y + 92,
                  width: 216,
                  height: 28,
                  radius: 15,
                },
              },
              {
                id: `${rowNodeId}-ios`,
                platform: "iOS",
                value: row.ios,
                label: `iOS ${row.ios}`,
                box: {
                  x: rowBox.x + 250,
                  y: rowBox.y + 92,
                  width: 216,
                  height: 28,
                  radius: 15,
                },
              },
            ] as const;

            return (
              <g
                key={row.algorithm}
                data-geometry-node-id={rowNodeId}
                data-geometry-node-label={row.algorithm}
              >
                <StageBox
                  box={rowBox}
                  fill={index === 0 ? "rgba(255, 248, 240, 0.96)" : "rgba(255, 251, 246, 0.95)"}
                  stroke={index === 0 ? scene.apiStroke : "rgba(92, 106, 118, 0.32)"}
                  strokeWidth={index === 0 ? 2.2 : 1.8}
                  markGeometryBox
                />
                <text
                  x={rowBox.x + 18}
                  y={rowBox.y + 34}
                  fill="#22303d"
                  fontSize={row.algorithm === "Oodle Leviathan" ? "19" : "20"}
                  fontWeight="820"
                  textAnchor="start"
                  dominantBaseline="middle"
                  data-geometry-node-text="1"
                >
                  {row.algorithm}
                </text>
                <text
                  x={algorithmMetaX}
                  y={rowBox.y + 34}
                  fill="rgba(92, 106, 118, 0.76)"
                  fontSize="13.4"
                  fontWeight="740"
                  textAnchor="start"
                  dominantBaseline="middle"
                  data-geometry-node-text="1"
                >
                  (压缩/)解压
                </text>
                <StageBox
                  box={ratioBox}
                  fill="rgba(248, 236, 226, 0.94)"
                  stroke={scene.apiStroke}
                  strokeWidth={1.8}
                />
                <text
                  x={centerX(ratioBox)}
                  y={centerY(ratioBox)}
                  fill={scene.apiStroke}
                  fontSize="19.5"
                  fontWeight="820"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  data-geometry-node-text="1"
                >
                  {row.ratio}
                </text>
                {platformPills.map((pill) => (
                  <g
                    key={pill.id}
                    data-geometry-node-id={pill.id}
                    data-geometry-node-label={pill.label}
                  >
                    <StageBox
                      box={pill.box}
                      fill="rgba(255, 255, 255, 0.92)"
                      stroke="rgba(92, 106, 118, 0.24)"
                      strokeWidth={1.4}
                      markGeometryBox
                    />
                    <text
                      x={pill.box.x + 14}
                      y={centerY(pill.box)}
                      fill="#22303d"
                      fontSize="13"
                      fontWeight="760"
                      textAnchor="start"
                      dominantBaseline="middle"
                      data-geometry-node-text="1"
                    >
                      {pill.platform}
                    </text>
                    <text
                      x={right(pill.box) - 14}
                      y={centerY(pill.box)}
                      fill="#22303d"
                      fontSize="13.2"
                      fontWeight="780"
                      textAnchor="end"
                      dominantBaseline="middle"
                      data-geometry-node-text="1"
                    >
                      {pill.value}
                    </text>
                  </g>
                ))}
              </g>
            );
          })}
        </g>
        <g
          data-geometry-node-id="right-card"
          data-geometry-node-label="Memory"
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
            y={rightCard.y + 32}
            fill={scene.apiStroke}
            fontSize="31"
            fontWeight="840"
            textAnchor="start"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            内存
          </text>
          <text
            x={rightCard.x + 18}
            y={rightCard.y + 62}
            fill="rgba(34, 48, 61, 0.74)"
            fontSize="18"
            fontWeight="760"
            textAnchor="start"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            UE 中 PSO：LRU + mmap
          </text>
          <StageBox
            box={memoryHeaderBox}
            fill="rgba(250, 243, 236, 0.9)"
            stroke="rgba(92, 106, 118, 0.18)"
            strokeWidth={1.4}
          />
          <text
            x={memoryHeaderBox.x + 92}
            y={centerY(memoryHeaderBox)}
            fill={scene.apiStroke}
            fontSize="13"
            fontWeight="780"
            textAnchor="middle"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            驻留层
          </text>
          <text
            x={centerX(memoryHeaderBox)}
            y={centerY(memoryHeaderBox)}
            fill={scene.apiStroke}
            fontSize="13"
            fontWeight="780"
            textAnchor="middle"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            换出 / 回填
          </text>
          <text
            x={right(memoryHeaderBox) - 100}
            y={centerY(memoryHeaderBox)}
            fill={scene.apiStroke}
            fontSize="13"
            fontWeight="780"
            textAnchor="middle"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            映射 / 载体
          </text>
          <g data-geometry-node-id="memory" data-geometry-node-label="Memory Residency">
            <StageBox
              box={memoryBox}
              fill="rgba(255, 248, 240, 0.9)"
              stroke={scene.apiStroke}
              strokeWidth={2.2}
              markGeometryBox
            />
            <text
              x={centerX(memoryBox)}
              y={memoryBox.y + 24}
              fill="#22303d"
              fontSize="19"
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
              fontSize="18.5"
              fontWeight="760"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              高频常驻
            </text>
            <text
              x={centerX(memorySwapBox)}
              y={centerY(memorySwapBox)}
              fill="#22303d"
              fontSize="18"
              fontWeight="740"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              可替换缓存
            </text>
          </g>
          <g data-geometry-node-id="disk" data-geometry-node-label="External IO">
            <StageBox
              box={diskBox}
              fill="rgba(249, 247, 244, 0.94)"
              stroke="rgba(92, 106, 118, 0.42)"
              strokeWidth={2}
              markGeometryBox
            />
            <text
              x={centerX(diskBox)}
              y={diskBox.y + 24}
              fill="#22303d"
              fontSize="19"
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
              fontSize="18"
              fontWeight="740"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              映射视图 / 虚拟内存
            </text>
            <text
              x={centerX(diskCarrierBox)}
              y={centerY(diskCarrierBox)}
              fill="#22303d"
              fontSize="18"
              fontWeight="740"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              文件 / SQL / KV
            </text>
          </g>
          <g data-geometry-node-id="flow-lane" data-geometry-node-label="Swap Lane">
            <StageBox
              box={flowLaneBox}
              fill="rgba(255, 251, 246, 0.92)"
              stroke="rgba(92, 106, 118, 0.24)"
              strokeWidth={1.6}
              markGeometryBox
            />
          </g>
          {memoryMethodCards.map((card) => (
            <g
              key={card.id}
              data-geometry-node-id={card.id}
              data-geometry-node-label={card.title}
            >
              <StageBox
                box={{
                  x: card.x,
                  y: rightCard.y + 414,
                  width: card.width,
                  height: 108,
                  radius: 24,
                }}
                fill={card.accent ? "rgba(248, 236, 226, 0.94)" : "rgba(255, 251, 246, 0.94)"}
                stroke={card.accent ? scene.apiStroke : "rgba(92, 106, 118, 0.32)"}
                strokeWidth={card.accent ? 2 : 1.7}
                markGeometryBox
              />
              <text
                x={card.x + 18}
                y={rightCard.y + 442}
                fill={card.accent ? scene.apiStroke : "#22303d"}
                fontSize="14.5"
                fontWeight="800"
                textAnchor="start"
                dominantBaseline="middle"
                data-geometry-node-text="1"
              >
                {card.title}
              </text>
              <text
                x={centerX({x: card.x, width: card.width})}
                y={rightCard.y + 486}
                fill="#22303d"
                fontSize={card.id === "memory-method-3" ? "15.5" : "16"}
                fontWeight="760"
                textAnchor="middle"
                dominantBaseline="middle"
                data-geometry-node-text="1"
              >
                {card.value}
              </text>
            </g>
          ))}
          <StrokeArrow
            d={horizontalPath(right(memoryBox) + 8, diskBox.x - 8, memoryBox.y + 92)}
            stroke={scene.apiStroke}
            opacity={panelOpacity}
            headOpacity={panelOpacity}
            tipX={diskBox.x - 8}
            tipY={memoryBox.y + 92}
            direction="right"
            shaftWidth={2.8}
            underlayWidth={5.2}
            headSize={7}
          />
          <StrokeArrow
            d={horizontalPath(right(memoryBox) + 8, diskBox.x - 8, memoryBox.y + 178)}
            stroke={scene.apiStroke}
            opacity={panelOpacity}
            headOpacity={panelOpacity}
            tipX={right(memoryBox) + 8}
            tipY={memoryBox.y + 178}
            direction="left"
            shaftWidth={2.8}
            underlayWidth={5.2}
            headSize={7}
          />
          <text
            x={centerX(flowLaneBox)}
            y={flowLaneBox.y + 52}
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
            x={centerX(flowLaneBox)}
            y={flowLaneBox.y + 134}
            fill="rgba(34, 48, 61, 0.7)"
            fontSize="15.5"
            fontWeight="720"
            textAnchor="middle"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            按需回填
          </text>
        </g>
        <LateFooterBar
          scene={scene}
          opacity={panelOpacity}
          geometryNodeId="footer"
          text="包体：ShaderCode 压缩；内存：UE 中 PSO 的 LRU + mmap。"
          box={page24FooterBox}
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
  const leftCard = {x: 84, y: 146, width: 556, height: 404, radius: 28};
  const rightCard = {x: 658, y: 146, width: 538, height: 404, radius: 28};
  const eventStrip = {x: leftCard.x + 24, y: leftCard.y + 58, width: 508, height: 84, radius: 22};
  const eventCurrentBox = {x: eventStrip.x + 16, y: eventStrip.y + 24, width: 124, height: 44, radius: 15};
  const eventDownloadBox = {x: eventStrip.x + 178, y: eventStrip.y + 24, width: 140, height: 44, radius: 15};
  const eventCompileBox = {x: eventStrip.x + 350, y: eventStrip.y + 24, width: 140, height: 44, radius: 15};
  const gameMaskBox = {x: leftCard.x + 24, y: leftCard.y + 168, width: 236, height: 124, radius: 22};
  const compileMaskBox = {x: leftCard.x + 280, y: leftCard.y + 168, width: 236, height: 124, radius: 22};
  const usageMaskNote = {x: leftCard.x + 24, y: leftCard.y + 316, width: 508, height: 74, radius: 18};
  const parallelSignalA = {x: rightCard.x + 24, y: rightCard.y + 66, width: 200, height: 50, radius: 18};
  const parallelSignalB = {x: rightCard.x + 244, y: rightCard.y + 66, width: 200, height: 50, radius: 18};
  const queueBox = {x: rightCard.x + 34, y: rightCard.y + 164, width: 124, height: 136, radius: 22};
  const workerBoxes = [
    {x: rightCard.x + 238, y: rightCard.y + 158, width: 110, height: 44, radius: 16},
    {x: rightCard.x + 238, y: rightCard.y + 210, width: 110, height: 44, radius: 16},
    {x: rightCard.x + 238, y: rightCard.y + 262, width: 110, height: 44, radius: 16},
  ];
  const throughputBox = {x: rightCard.x + 386, y: rightCard.y + 186, width: 132, height: 92, radius: 22};
  const parallelNote = {x: rightCard.x + 24, y: rightCard.y + 330, width: 490, height: 74, radius: 18};

  return (
    <PlaceholderBoardShell opacity={panelOpacity}>
      <g transform={`translate(0 ${LATE_INLINE_TITLE_REMOVAL_SHIFT_Y})`}>
        <g
          data-geometry-node-id="usage-mask-path"
          data-geometry-node-label="Reduce Compile Set"
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
            路径 1：减少编译集合
          </text>
          <text
            x={leftCard.x + 18}
            y={leftCard.y + 46}
            fill="rgba(34, 48, 61, 0.72)"
            fontSize="15"
            fontWeight="700"
            textAnchor="start"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            按地图触发 + UsageMask，让“该编什么”先收缩。
          </text>
          <g
            data-geometry-node-id="event-strip"
            data-geometry-node-label="Event Flow"
          >
            <StageBox
              box={eventStrip}
              fill="rgba(255, 248, 240, 0.86)"
              stroke="rgba(92, 106, 118, 0.28)"
              strokeWidth={1.9}
              markGeometryBox
            />
            <text
              x={eventStrip.x + 18}
              y={eventStrip.y + 18}
              fill={scene.apiStroke}
              fontSize="15.5"
              fontWeight="800"
              textAnchor="start"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              事件入口
            </text>
            {[
              {
                box: eventCurrentBox,
                lines: ["当前在", "地图 A"],
              },
              {
                box: eventDownloadBox,
                lines: ["地图 B", "下载完成"],
              },
              {
                box: eventCompileBox,
                lines: ["触发", "编译"],
              },
            ].map((item, index) => (
              <g key={`page26-event-${index}`}>
                <StageBox
                  box={item.box}
                  fill="rgba(255, 255, 255, 0.92)"
                  stroke={index === 2 ? scene.apiStroke : "rgba(92, 106, 118, 0.34)"}
                  strokeWidth={index === 2 ? 2.2 : 1.9}
                  markGeometryBox
                />
                {item.lines.map((line, lineIndex) => (
                  <text
                    key={`${line}-${lineIndex}`}
                    x={centerX(item.box)}
                    y={item.box.y + 15 + lineIndex * 14}
                    fill="#22303d"
                    fontSize={lineIndex === 0 ? "14" : "16"}
                    fontWeight={lineIndex === 0 ? "760" : "820"}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    data-geometry-node-text="1"
                  >
                    {line}
                  </text>
                ))}
              </g>
            ))}
            <StrokeArrow
              d={horizontalPath(right(eventCurrentBox) + 8, eventDownloadBox.x - 8, centerY(eventCurrentBox))}
              stroke="rgba(92, 106, 118, 0.76)"
              opacity={panelOpacity}
              headOpacity={panelOpacity}
              tipX={eventDownloadBox.x - 8}
              tipY={centerY(eventCurrentBox)}
              direction="right"
              shaftWidth={2.4}
              underlayWidth={4.2}
              headSize={6.2}
            />
            <StrokeArrow
              d={horizontalPath(right(eventDownloadBox) + 8, eventCompileBox.x - 8, centerY(eventDownloadBox))}
              stroke={scene.apiStroke}
              opacity={panelOpacity}
              headOpacity={panelOpacity}
              tipX={eventCompileBox.x - 8}
              tipY={centerY(eventDownloadBox)}
              direction="right"
              shaftWidth={2.5}
              underlayWidth={4.5}
              headSize={6.6}
            />
          </g>
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
              x={gameMaskBox.x + 20}
              y={gameMaskBox.y + 24}
              fill={scene.apiStroke}
              fontSize="14.5"
              fontWeight="800"
              textAnchor="start"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              当前游戏视角
            </text>
            <StackedLabel
              x={centerX(gameMaskBox)}
              y={gameMaskBox.y + 60}
              lines={["Game", "UsageMask = A"]}
              fontSize={17.5}
              fontWeight={820}
              lineGap={20}
              markGeometryText
            />
            <StackedLabel
              x={centerX(gameMaskBox)}
              y={gameMaskBox.y + 99}
              lines={["只保留当前游戏", "真的在用的集合"]}
              fontSize={13.5}
              fontWeight={700}
              lineGap={16}
              fill="rgba(34, 48, 61, 0.72)"
              markGeometryText
            />
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
              x={compileMaskBox.x + 20}
              y={compileMaskBox.y + 24}
              fill={scene.apiStroke}
              fontSize="14.5"
              fontWeight="800"
              textAnchor="start"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              编译调度视角
            </text>
            <StackedLabel
              x={centerX(compileMaskBox)}
              y={compileMaskBox.y + 60}
              lines={["Compile", "UsageMask = A + B"]}
              fontSize={17.5}
              fontWeight={820}
              lineGap={20}
              markGeometryText
            />
            <StackedLabel
              x={centerX(compileMaskBox)}
              y={compileMaskBox.y + 99}
              lines={["地图 B 下载完成后", "立刻把 B 加进调度"]}
              fontSize={13.5}
              fontWeight={700}
              lineGap={16}
              fill="rgba(34, 48, 61, 0.72)"
              markGeometryText
            />
          </g>
          <g
            data-geometry-node-id="usage-mask-note"
            data-geometry-node-label="UsageMask Note"
          >
            <StageBox
              box={usageMaskNote}
              fill="rgba(248, 236, 226, 0.92)"
              stroke={scene.apiStroke}
              strokeWidth={2}
              markGeometryBox
            />
            <text
              x={usageMaskNote.x + 18}
              y={usageMaskNote.y + 18}
              fill={scene.apiStroke}
              fontSize="14.5"
              fontWeight="760"
              textAnchor="start"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              UE 原生只有一套 UsageMask 语义；
            </text>
            <text
              x={usageMaskNote.x + 18}
              y={usageMaskNote.y + 38}
              fill="rgba(34, 48, 61, 0.76)"
              fontSize="13.5"
              fontWeight="700"
              textAnchor="start"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              这里拆的是调度，不是两套存储。
            </text>
            <text
              x={usageMaskNote.x + 18}
              y={usageMaskNote.y + 57}
              fill="rgba(34, 48, 61, 0.68)"
              fontSize="13"
              fontWeight="680"
              textAnchor="start"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              这条路优化的是“要编什么”，本质在减少编译集合。
            </text>
          </g>
        </g>
        <g
          data-geometry-node-id="parallel-path"
          data-geometry-node-label="Increase Throughput"
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
            路径 2：提升编译吞吐
          </text>
          <text
            x={rightCard.x + 18}
            y={rightCard.y + 46}
            fill="rgba(34, 48, 61, 0.72)"
            fontSize="15"
            fontWeight="700"
            textAnchor="start"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            并行改的是执行方式，让“同样要编的集合”更快跑完。
          </text>
          {[
            {
              box: parallelSignalA,
              id: "parallel-signal-a",
              title: "任务独立",
              detail: "批量、重复、可拆",
              accent: true,
            },
            {
              box: parallelSignalB,
              id: "parallel-signal-b",
              title: "纯 CPU 计算",
              detail: "最适合直接拆 worker",
              accent: false,
            },
          ].map((item) => (
            <g
              key={item.id}
              data-geometry-node-id={item.id}
              data-geometry-node-label={item.title}
            >
              <StageBox
                box={item.box}
                fill={item.accent ? "rgba(248, 236, 226, 0.94)" : "rgba(255, 251, 246, 0.94)"}
                stroke={item.accent ? scene.apiStroke : "rgba(92, 106, 118, 0.34)"}
                strokeWidth={item.accent ? 2.2 : 1.8}
                markGeometryBox
              />
              <text
                x={centerX(item.box)}
                y={item.box.y + 18}
                fill={item.accent ? scene.apiStroke : "#22303d"}
                fontSize="17"
                fontWeight="820"
                textAnchor="middle"
                dominantBaseline="middle"
                data-geometry-node-text="1"
              >
                {item.title}
              </text>
              <text
                x={centerX(item.box)}
                y={item.box.y + 34}
                fill="rgba(34, 48, 61, 0.68)"
                fontSize="13"
                fontWeight="660"
                textAnchor="middle"
                dominantBaseline="middle"
                data-geometry-node-text="1"
              >
                {item.detail}
              </text>
            </g>
          ))}
          <g data-geometry-node-id="parallel-queue" data-geometry-node-label="Queue">
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
              lines={["Task", "Queue"]}
              fontSize={24}
              fontWeight={780}
              lineGap={20}
              markGeometryText
            />
          </g>
          {workerBoxes.map((box, index) => (
            <g
              key={`parallel-worker-${index}`}
              data-geometry-node-id={`parallel-worker-${index + 1}`}
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
                fontSize="17"
                fontWeight="760"
                textAnchor="middle"
                dominantBaseline="middle"
                data-geometry-node-text="1"
              >
                {`Worker ${index + 1}`}
              </text>
            </g>
          ))}
          <g data-geometry-node-id="parallel-throughput" data-geometry-node-label="More Throughput">
            <StageBox
              box={throughputBox}
              fill="rgba(249, 247, 244, 0.94)"
              stroke="rgba(92, 106, 118, 0.4)"
              strokeWidth={2}
              markGeometryBox
            />
            <StackedLabel
              x={centerX(throughputBox)}
              y={centerY(throughputBox)}
              lines={["More", "Throughput"]}
              fontSize={17}
              fontWeight={780}
              lineGap={17}
              markGeometryText
            />
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
              key={`throughput-arrow-${box.x}-${box.y}`}
              d={horizontalPath(right(box) + 8, throughputBox.x - 8, centerY(box))}
              stroke="rgba(92, 106, 118, 0.74)"
              opacity={panelOpacity}
              headOpacity={panelOpacity}
              tipX={throughputBox.x - 8}
              tipY={centerY(box)}
              direction="right"
              shaftWidth={2.4}
              underlayWidth={4.4}
              headSize={6.4}
            />
          ))}
          <g
            data-geometry-node-id="parallel-note"
            data-geometry-node-label="Parallel Note"
          >
            <StageBox
              box={parallelNote}
              fill="rgba(255, 251, 246, 0.94)"
              stroke="rgba(92, 106, 118, 0.32)"
              strokeWidth={1.9}
              markGeometryBox
            />
            <text
              x={parallelNote.x + 18}
              y={parallelNote.y + 18}
              fill="#22303d"
              fontSize="14.5"
              fontWeight="760"
              textAnchor="start"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              并行改的是执行方式，
            </text>
            <text
              x={parallelNote.x + 18}
              y={parallelNote.y + 38}
              fill="rgba(34, 48, 61, 0.72)"
              fontSize="13.5"
              fontWeight="690"
              textAnchor="start"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              不是把 UsageMask 讲成另一个东西。
            </text>
            <text
              x={parallelNote.x + 18}
              y={parallelNote.y + 57}
              fill="rgba(34, 48, 61, 0.66)"
              fontSize="13"
              fontWeight="670"
              textAnchor="start"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              同样目标下，一条路减集合，一条路提吞吐。
            </text>
          </g>
        </g>
        <LateFooterBar
          scene={scene}
          opacity={panelOpacity}
          geometryNodeId="footer"
          text="UsageMask 减少集合，并行提升吞吐；两个不是同一个内容，但都在优化预编译速度。"
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
  geometryWidth = 520,
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
  geometryWidth?: number;
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
            width={geometryWidth}
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

function Page29DataPlatformCard({
  scene,
  box,
  title,
  focusNote,
  headerLabels,
  rows,
  opacity,
  geometryNodeId,
}: {
  scene: SceneModel;
  box: {x: number; y: number; width: number; height: number; radius: number};
  title: string;
  focusNote: string;
  headerLabels: readonly [string, string, string, string];
  rows: ReadonlyArray<{
    id: string;
    loop: string;
    values: readonly [string, string, string];
  }>;
  opacity: number;
  geometryNodeId: string;
}) {
  const headerHeight = 30;
  const rowHeight = 56;
  const tableInset = 16;
  const tableX = box.x;
  const tableWidth = box.width;
  const contentX = tableX + tableInset;
  const contentWidth = tableWidth - tableInset * 2;
  const loopWidth = 112;
  const valueWidth = (contentWidth - loopWidth) / 3;
  const tableY = box.y + 88;
  const tableHeight = headerHeight + rowHeight * rows.length;
  const borderStroke = "rgba(92, 106, 118, 0.24)";
  const dividerStroke = "rgba(92, 106, 118, 0.16)";
  const isPcCard = geometryNodeId === "pc-card";

  return (
    <g
      opacity={opacity}
      data-geometry-node-id={geometryNodeId}
      data-geometry-node-label={title}
    >
      <g data-geometry-node-box="1">
        <StageBox
          box={box}
          fill="rgba(255, 252, 247, 0.94)"
          stroke="rgba(92, 106, 118, 0.38)"
          strokeWidth={2}
        />
      </g>
      <text
        x={box.x + 18}
        y={box.y + 28}
        fill={scene.apiStroke}
        fontSize="23"
        fontWeight="820"
        textAnchor="start"
        dominantBaseline="middle"
        data-geometry-node-text="1"
      >
        {title}
      </text>
      <text
        x={box.x + 18}
        y={box.y + 58}
        fill={scene.apiStroke}
        fontSize="13.6"
        fontWeight="760"
        textAnchor="start"
        dominantBaseline="middle"
        data-geometry-node-text="1"
      >
        {focusNote}
      </text>
      <line
        x1={tableX}
        y1={tableY}
        x2={tableX + tableWidth}
        y2={tableY}
        stroke={borderStroke}
        strokeWidth="1.2"
      />
      {[headerHeight, headerHeight + rowHeight].map((offset) => (
        <line
          key={`${geometryNodeId}-h-${offset}`}
          x1={tableX}
          y1={tableY + offset}
          x2={tableX + tableWidth}
          y2={tableY + offset}
          stroke={dividerStroke}
          strokeWidth="1"
        />
      ))}
      <line
        x1={contentX + loopWidth}
        y1={tableY}
        x2={contentX + loopWidth}
        y2={tableY + tableHeight}
        stroke={dividerStroke}
        strokeWidth="1"
      />
      {headerLabels.map((label, index) => {
        const cellLeft = contentX + (index === 0 ? 0 : loopWidth + valueWidth * (index - 1));
        const cellWidth = index === 0 ? loopWidth : valueWidth;

        return (
          <text
            key={`${title}-${label}`}
            x={cellLeft + cellWidth / 2}
            y={tableY + headerHeight / 2 + 1}
            fill={index === 0 ? "rgba(34, 48, 61, 0.7)" : "rgba(34, 48, 61, 0.72)"}
            fontSize="15"
            fontWeight="760"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {label}
          </text>
        );
      })}
      {rows.map((row, rowIndex) => {
        const rowTop = tableY + headerHeight + rowIndex * rowHeight;
        const isPeakRow = rowIndex === rows.length - 1;

        return (
          <g
            key={row.id}
            data-geometry-node-id={row.id}
            data-geometry-node-label={row.loop}
          >
            <g data-geometry-node-box="1">
              <rect
                x={tableX}
                y={rowTop}
                width={tableWidth}
                height={rowHeight}
                rx="0"
                fill="transparent"
                stroke="none"
              />
            </g>
            <text
              x={contentX + loopWidth / 2}
              y={rowTop + rowHeight / 2 + 1}
              fill={isPeakRow ? scene.apiStroke : "#22303d"}
              fontSize="17"
              fontWeight="800"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              {row.loop}
            </text>
            {row.values.map((value, valueIndex) => {
              const cellX = contentX + loopWidth + valueWidth * valueIndex;
              const isStableFocusCell = isPcCard && valueIndex === 0;
              const isPcContrastCell = isPcCard && isPeakRow && valueIndex > 0;
              const isAndroidPeakCell = !isPcCard && isPeakRow;
              const cellTextColor =
                isStableFocusCell || isPcContrastCell || isAndroidPeakCell ? scene.apiStroke : "#22303d";
              const cellWeight = isStableFocusCell ? "830" : isPcContrastCell || isAndroidPeakCell ? "800" : "740";

              return (
                <g key={`${row.id}-${value}`}>
                  <text
                    x={cellX + valueWidth / 2}
                    y={rowTop + rowHeight / 2 + 1}
                    fill={cellTextColor}
                    fontSize="18"
                    fontWeight={cellWeight}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    data-geometry-node-text="1"
                  >
                    {value}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

function Page29DataShaderCard({
  scene,
  box,
  opacity,
}: {
  scene: SceneModel;
  box: {x: number; y: number; width: number; height: number; radius: number};
  opacity: number;
}) {
  const codeGap = 32;
  const columnWidth = (box.width - codeGap) / 2;
  const vertexBox = {x: box.x, y: box.y, width: columnWidth, height: box.height, radius: 20};
  const fragmentBox = {
    x: box.x + columnWidth + codeGap,
    y: box.y,
    width: columnWidth,
    height: box.height,
    radius: 20,
  };

  return (
    <g
      opacity={opacity}
      data-geometry-node-id="shader-card"
      data-geometry-node-label="测试 Shader"
    >
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
      <g data-geometry-node-id="vertex-code" data-geometry-node-label="Vertex Shader">
        <g data-geometry-node-box="1">
          <StageBox
            box={vertexBox}
            fill="rgba(249, 247, 244, 0.96)"
            stroke="rgba(92, 106, 118, 0.24)"
            strokeWidth={1.6}
          />
        </g>
        <text
          x={vertexBox.x + 16}
          y={vertexBox.y + 16}
          fill={scene.apiStroke}
          fontSize="17"
          fontWeight="820"
          textAnchor="start"
          dominantBaseline="middle"
          data-geometry-node-text="1"
        >
          Vertex Shader
        </text>
        {PAGE29_DATA_VERTEX_SHADER_LINES.map((line, index) => (
          <text
            key={`page29-vertex-${index}`}
            x={vertexBox.x + 16}
            y={vertexBox.y + 38 + index * 13.4}
            fill="#22303d"
            fontFamily="SFMono-Regular, Menlo, Consolas, monospace"
            fontSize="11.7"
            fontWeight={index < 4 ? "760" : "650"}
            textAnchor="start"
            dominantBaseline="middle"
            xmlSpace="preserve"
            data-geometry-node-text="1"
          >
            {renderPage29ShaderLine(line, "#22303d")}
          </text>
        ))}
      </g>
      <g data-geometry-node-id="fragment-code" data-geometry-node-label="Fragment Shader">
        <g data-geometry-node-box="1">
          <StageBox
            box={fragmentBox}
            fill="rgba(255, 249, 243, 0.94)"
            stroke="rgba(92, 106, 118, 0.22)"
            strokeWidth={1.6}
          />
        </g>
        <text
          x={fragmentBox.x + 16}
          y={fragmentBox.y + 16}
          fill={scene.apiStroke}
          fontSize="17"
          fontWeight="820"
          textAnchor="start"
          dominantBaseline="middle"
          data-geometry-node-text="1"
        >
          Fragment Shader
        </text>
        {PAGE29_DATA_FRAGMENT_SHADER_LINES.map((line, index) => (
          <text
            key={`page29-fragment-${index}`}
            x={fragmentBox.x + 14}
            y={fragmentBox.y + 38 + index * 13.4}
            fill="rgba(34, 48, 61, 0.8)"
            fontFamily="SFMono-Regular, Menlo, Consolas, monospace"
            fontSize="12"
            fontWeight={index < 3 ? "760" : "670"}
            textAnchor="start"
            dominantBaseline="middle"
            xmlSpace="preserve"
            data-geometry-node-text="1"
          >
            {renderPage29ShaderLine(line, "rgba(34, 48, 61, 0.8)")}
          </text>
        ))}
      </g>
    </g>
  );
}

function Page29DataStateCard({
  scene,
  box,
  opacity,
}: {
  scene: SceneModel;
  box: {x: number; y: number; width: number; height: number; radius: number};
  opacity: number;
}) {
  const columnGap = 32;
  const columnWidth = (box.width - columnGap) / 2;
  const vulkanRow = {x: box.x, y: box.y, width: columnWidth, height: box.height, radius: 18};
  const glRow = {
    x: box.x + columnWidth + columnGap,
    y: box.y,
    width: columnWidth,
    height: box.height,
    radius: 18,
  };

  return (
    <g
      opacity={opacity}
      data-geometry-node-id="state-card"
      data-geometry-node-label="State 开关"
    >
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
      <g
        data-geometry-node-id="state-vk"
        data-geometry-node-label="Vulkan PSO: build-time Shader visibility"
      >
        <g data-geometry-node-box="1">
          <StageBox
            box={vulkanRow}
            fill="rgba(255, 249, 242, 0.94)"
            stroke={scene.apiStroke}
            strokeWidth={1.6}
          />
        </g>
        <text
          x={vulkanRow.x + 14}
          y={vulkanRow.y + 23}
          fill={scene.apiStroke}
          fontSize="13.4"
          fontWeight="820"
          textAnchor="start"
          dominantBaseline="middle"
          data-geometry-node-text="1"
        >
          Vulkan PSO：构建时Shader对此已知
        </text>
        <text
          x={vulkanRow.x + 14}
          y={vulkanRow.y + 51}
          fill="#22303d"
          fontFamily="SFMono-Regular, Menlo, Consolas, monospace"
          fontSize="14"
          fontWeight="700"
          textAnchor="start"
          dominantBaseline="middle"
          data-geometry-node-text="1"
        >
          blendAtt.colorWriteMask = 0;
        </text>
      </g>
      <g
        data-geometry-node-id="state-gl"
        data-geometry-node-label="OpenGL GLES runtime: build-time Shader blind"
      >
        <g data-geometry-node-box="1">
          <StageBox
            box={glRow}
            fill="rgba(249, 247, 244, 0.96)"
            stroke="rgba(92, 106, 118, 0.24)"
            strokeWidth={1.6}
          />
        </g>
        <text
          x={glRow.x + 14}
          y={glRow.y + 23}
          fill={scene.apiStroke}
          fontSize="12.9"
          fontWeight="820"
          textAnchor="start"
          dominantBaseline="middle"
          data-geometry-node-text="1"
        >
          OpenGL / GLES runtime：构建时Shader对此无感知
        </text>
        <text
          x={glRow.x + 14}
          y={glRow.y + 51}
          fill="#22303d"
          fontFamily="SFMono-Regular, Menlo, Consolas, monospace"
          fontSize="13.2"
          fontWeight="700"
          textAnchor="start"
          dominantBaseline="middle"
          data-geometry-node-text="1"
        >
          glColorMask(GL_FALSE, GL_FALSE, GL_FALSE, GL_FALSE);
        </text>
      </g>
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
  const sampleAImage = {x: 96, y: 92, width: 500, height: 136, radius: 18};
  const sampleBImage = {x: 96, y: 252, width: 500, height: 136, radius: 18};
  const vertexBufferInset = {x: 96, y: 408, width: 500, height: 182, radius: 16};
  const vertexBufferBadge = {
    x: vertexBufferInset.x + 12,
    y: vertexBufferInset.y + 12,
    width: 104,
    height: 24,
    radius: 12,
  };
  const rightCard = {
    x: 608,
    y: 92,
    width: 574,
    height: vertexBufferInset.y + vertexBufferInset.height - 92,
    radius: 24,
  };
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
          opacity={panelOpacity}
          data-geometry-node-id="image-3"
          data-geometry-node-label="VertexBuffer"
        >
          <FramedImage
            box={vertexBufferInset}
            href="/supplement/VertexBuffer.png"
            clipId="page28-vertex-buffer"
            dataTestId="page28-vertex-buffer-image"
            markGeometryBox
          />
          <rect
            x={vertexBufferBadge.x}
            y={vertexBufferBadge.y}
            width={vertexBufferBadge.width}
            height={vertexBufferBadge.height}
            rx={vertexBufferBadge.radius}
            fill="rgba(255, 255, 255, 0.88)"
            stroke="rgba(92, 106, 118, 0.24)"
            strokeWidth="1"
          />
          <text
            x={vertexBufferBadge.x + vertexBufferBadge.width / 2}
            y={vertexBufferBadge.y + vertexBufferBadge.height / 2 + 0.5}
            fill={scene.apiStroke}
            fontSize="12.8"
            fontWeight="820"
            textAnchor="middle"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            VertexBuffer
          </text>
        </g>
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
  const compileParamBox = {x: 330, y: 116, width: 620, height: 42, radius: 16};
  const leftCode = {x: 72, y: 164, width: 520, height: 286, radius: 24};
  const rightCode = {x: 610, y: 164, width: 584, height: 286, radius: 24};
  const leftImage = {x: leftCode.x, y: 478, width: leftCode.width, height: 200, radius: 16};
  const rightImage = {
    x: rightCode.x,
    y: 478,
    width: rightCode.width,
    height: 208,
    radius: 16,
  };
  const footerBox = {x: 120, y: 700, width: 1040, height: 48, radius: 22};

  return (
    <PlaceholderBoardShell opacity={panelOpacity}>
      <g transform={`translate(0 ${LATE_INLINE_TITLE_REMOVAL_SHIFT_Y})`}>
        <MicroToken
          scene={scene}
          box={compileParamBox}
          label="编译参数：NUM_MATERIAL_TEXCOORDS_VERTEX = 2"
          opacity={panelOpacity}
          geometryNodeId="compile-param"
          fontSize={17}
          accent
        />
        <LateCodeCard
          scene={scene}
          box={leftCode}
          title="VertexDescriptor / InitRHI"
          lines={VERTEX_DESCRIPTOR_CODE_LINES}
          opacity={panelOpacity}
          geometryNodeId="left-code"
          titleFontSize={20}
          codeFontSize={15}
          lineHeight={19.2}
        />
        <LateCodeCard
          scene={scene}
          box={rightCode}
          title="LocalVertexFactory.ush"
          lines={LOCAL_VERTEX_FACTORY_CODE_LINES}
          opacity={panelOpacity}
          geometryNodeId="right-code"
          titleFontSize={20}
          codeFontSize={13.8}
          lineHeight={15.4}
        />
        <LateBareImage
          scene={scene}
          box={leftImage}
          title="Mesh：1 个 UV"
          href="/supplement/ogl-mtl/uv-stride4-ia.png"
          clipId="page29-uv4"
          opacity={panelOpacity}
          geometryNodeId="left-image"
          geometryNodeLabel="UVStride4IA"
          preserveAspectRatio="xMidYMid meet"
          titleFontSize={15.8}
          titleAlign="center"
        />
        <LateBareImage
          scene={scene}
          box={rightImage}
          title="Mesh：2 个 UV"
          href="/supplement/ogl-mtl/uv-stride8-ia.png"
          clipId="page29-uv8"
          opacity={panelOpacity}
          geometryNodeId="right-image"
          geometryNodeLabel="UVStride8IA"
          preserveAspectRatio="xMidYMid meet"
          titleFontSize={15.8}
          titleAlign="center"
        />
        <LateFooterBar
          scene={scene}
          opacity={panelOpacity}
          geometryNodeId="footer"
          text="同一个Material作用于不同的Mesh也会产生不同的PSO"
          box={footerBox}
        />
      </g>
    </PlaceholderBoardShell>
  );
}

function Page29DriverOptimizationPage({
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
  const shaderCard = {x: 72, y: 56, width: 1136, height: 178, radius: 28};
  const stateCard = {x: 72, y: 250, width: 1136, height: 78, radius: 28};
  const pcCard = {x: 72, y: 356, width: 552, height: 270, radius: 28};
  const androidCard = {x: 656, y: 356, width: 552, height: 270, radius: 28};
  const footerBox = {x: 72, y: 644, width: 1136, height: 36, radius: 18};

  return (
    <PlaceholderBoardShell opacity={panelOpacity}>
      <g>
        <Page29DataShaderCard scene={scene} box={shaderCard} opacity={panelOpacity} />
        <Page29DataStateCard scene={scene} box={stateCard} opacity={panelOpacity} />
        <Page29DataPlatformCard
          scene={scene}
          box={pcCard}
          title="PC（RTX 3080）"
          focusNote="重点：VK off = 0.0653 ms -> 0.0645 ms"
          headerLabels={["loop", "VK off", "VK on", "GL 0"]}
          rows={PAGE29_DATA_PC_ROWS}
          opacity={panelOpacity}
          geometryNodeId="pc-card"
        />
        <Page29DataPlatformCard
          scene={scene}
          box={androidCard}
          title="Android（Adreno）"
          focusNote="重点：loop=5000 时三列都已经贴近 400 ms"
          headerLabels={["loop", "VK off", "VK on", "GLES 0"]}
          rows={PAGE29_DATA_ANDROID_ROWS}
          opacity={panelOpacity}
          geometryNodeId="android-card"
        />
        <LateFooterBar
          scene={scene}
          opacity={panelOpacity}
          geometryNodeId="footer-note"
          text="同一份 heavy shader 下，NV 的 Vulkan mask=0 几乎不随 loop 波动；移动端驱动并没有兑现同级别的编译期优化。"
          box={footerBox}
        />
      </g>
    </PlaceholderBoardShell>
  );
}

function Page30PsoReadingPage({
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
  const readingCard = {x: 208, y: 148, width: 864, height: 446, radius: 30};
  const noteX = readingCard.x + 58;
  const linkX = readingCard.x + 58;
  const linkStartY = readingCard.y + 144;
  const linkStep = 76;

  return (
    <PlaceholderBoardShell opacity={panelOpacity}>
      <g transform={`translate(0 ${LATE_INLINE_TITLE_REMOVAL_SHIFT_Y})`}>
        <g
          data-geometry-node-id="reading-card"
          data-geometry-node-label="PSO Reading Card"
        >
          <StageBox
            box={readingCard}
            fill="rgba(255, 252, 247, 0.96)"
            stroke={scene.nodeStroke}
            strokeWidth={2.5}
            markGeometryBox
          />
          <text
            x={centerX(readingCard)}
            y={readingCard.y + 46}
            fill="rgba(214, 102, 48, 0.96)"
            fontSize="26"
            fontWeight="830"
            textAnchor="middle"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            工程延伸
          </text>
          <text
            x={noteX}
            y={readingCard.y + 86}
            fill="rgba(34, 48, 61, 0.68)"
            fontSize="17"
            fontWeight="680"
            textAnchor="start"
            dominantBaseline="middle"
            data-geometry-node-id="reading-note"
            data-geometry-node-label="PSO Reading Note"
            data-geometry-node-text="1"
          >
            把 PSO 这一段的工程资料单独留在这里，包括 Mesa。
          </text>
          {ENDING_ENGINEERING_LINKS.map((item, index) => (
            <EndingLinkItem
              key={item.title}
              x={linkX}
              y={linkStartY + index * linkStep}
              title={item.title}
              subtitle={item.subtitle}
              href={item.href}
              geometryNodeId={`reading-link-${index + 1}`}
              geometryWidth={756}
              titleFontSize={23}
              subtitleFontSize={16}
              subtitleOffset={25}
            />
          ))}
        </g>
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
  const ringOpacity = opacity * resolveWindowProgress(entryProgress, 0.08, 0.76, easeOutQuint);
  const helperOpacity = opacity * resolveWindowProgress(entryProgress, 0.18, 0.88, easeOutQuint);
  const ringCenter = {x: centerX(PLACEHOLDER_BOARD), y: 340};
  const outerRingRadius = 190;
  const innerRingRadius = 164;
  const hookBox = {x: 526, y: 166, width: 228, height: 74, radius: 24};
  const dataBox = {x: 844, y: 292, width: 212, height: 86, radius: 24};
  const imageBox = {x: 522, y: 452, width: 236, height: 86, radius: 24};
  const receiptBox = {x: 224, y: 292, width: 220, height: 86, radius: 24};
  const sourceTokens = [
    {
      id: "source-1",
      label: LIVE_HARNESS_SOURCE_TOKENS[0],
      box: {x: 520, y: 112, width: 236, height: 42, radius: 18},
      accent: true,
    },
    {
      id: "source-2",
      label: LIVE_HARNESS_SOURCE_TOKENS[1],
      box: {x: 906, y: 228, width: 180, height: 42, radius: 18},
      accent: false,
    },
    {
      id: "source-3",
      label: LIVE_HARNESS_SOURCE_TOKENS[2],
      box: {x: 480, y: 560, width: 320, height: 42, radius: 18},
      accent: false,
    },
    {
      id: "source-4",
      label: LIVE_HARNESS_SOURCE_TOKENS[3],
      box: {x: 146, y: 228, width: 194, height: 42, radius: 18},
      accent: false,
    },
  ] as const;
  const decisionTokens = [
    {
      id: "decision-1",
      label: LIVE_HARNESS_DECISION_TOKENS[0],
      box: {x: 126, y: 394, width: 196, height: 44, radius: 18},
    },
    {
      id: "decision-2",
      label: LIVE_HARNESS_DECISION_TOKENS[1],
      box: {x: 126, y: 446, width: 196, height: 44, radius: 18},
    },
  ] as const;

  return (
    <PlaceholderBoardShell opacity={panelOpacity}>
      <g transform={`translate(0 ${LATE_INLINE_TITLE_REMOVAL_SHIFT_Y})`}>
        <g opacity={ringOpacity * 0.96}>
          <circle
            cx={ringCenter.x}
            cy={ringCenter.y}
            r={outerRingRadius}
            fill="rgba(255, 255, 255, 0.88)"
            stroke="rgba(92, 106, 118, 0.2)"
            strokeWidth="2.4"
          />
          <circle
            cx={ringCenter.x}
            cy={ringCenter.y}
            r={innerRingRadius}
            fill="none"
            stroke="rgba(92, 106, 118, 0.16)"
            strokeWidth="44"
          />
          <circle
            cx={ringCenter.x}
            cy={ringCenter.y}
            r={innerRingRadius}
            fill="none"
            stroke="rgba(214, 102, 48, 0.18)"
            strokeWidth="12"
          />
        </g>
        <g opacity={ringOpacity}>
          <text
            x={ringCenter.x}
            y={296}
            fill={scene.apiStroke}
            fontSize="16"
            fontWeight="800"
            textAnchor="middle"
            dominantBaseline="middle"
            letterSpacing="0.12em"
          >
            LIVE HARNESS
          </text>
          <text
            x={ringCenter.x}
            y={332}
            fill="#22303d"
            fontSize="31"
            fontWeight="820"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            先看真实结果
          </text>
          <text
            x={ringCenter.x}
            y={372}
            fill="rgba(34, 48, 61, 0.72)"
            fontSize="24"
            fontWeight="760"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            再决定停或继续
          </text>
        </g>
        <ArtifactNode
          box={hookBox}
          scene={scene}
          opacity={ringOpacity}
          label="Hook"
          subLabel="进入"
          emphasized
          labelFontSize={27}
          subLabelFontSize={19}
          geometryNodeId="hook-node"
          geometryNodeLabel="Hook 进入"
        />
        <ArtifactNode
          box={dataBox}
          scene={scene}
          opacity={ringOpacity}
          label="网页数据评分"
          emphasized={false}
          labelFontSize={24}
          geometryNodeId="data-node"
          geometryNodeLabel="网页数据评分"
        />
        <ArtifactNode
          box={imageBox}
          scene={scene}
          opacity={ringOpacity}
          label="网页图片评分"
          emphasized={false}
          labelFontSize={24}
          geometryNodeId="image-node"
          geometryNodeLabel="网页图片评分"
        />
        <ArtifactNode
          box={receiptBox}
          scene={scene}
          opacity={ringOpacity}
          label="回执循环"
          emphasized
          labelFontSize={28}
          geometryNodeId="receipt-node"
          geometryNodeLabel="回执循环"
        />
        {sourceTokens.map(({id, label, box, accent}) => (
          <MicroToken
            key={id}
            scene={scene}
            box={box}
            label={label}
            opacity={helperOpacity}
            geometryNodeId={id}
            fontSize={label === "browser capture" ? 14.4 : 14.8}
            accent={accent}
          />
        ))}
        {decisionTokens.map(({id, label, box}) => (
          <MicroToken
            key={id}
            scene={scene}
            box={box}
            label={label}
            opacity={helperOpacity}
            geometryNodeId={id}
            fontSize={15}
            accent
          />
        ))}
        <StrokeArrow
          d={quadraticCurvePath(
            {x: right(hookBox) - 6, y: centerY(hookBox)},
            {x: 854, y: 188},
            {x: centerX(dataBox), y: dataBox.y - 10},
          )}
          stroke={scene.apiStroke}
          opacity={ringOpacity * 0.96}
          headOpacity={revealHeadOpacity(reveal, ringOpacity * 0.96)}
          tipX={centerX(dataBox)}
          tipY={dataBox.y - 10}
          direction="down"
          shaftWidth={3.2}
          underlayWidth={6}
          headSize={8.5}
        />
        <StrokeArrow
          d={quadraticCurvePath(
            {x: centerX(dataBox), y: bottom(dataBox) + 10},
            {x: 958, y: 486},
            {x: right(imageBox) + 10, y: centerY(imageBox)},
          )}
          stroke={scene.apiStroke}
          opacity={ringOpacity * 0.96}
          headOpacity={revealHeadOpacity(reveal, ringOpacity * 0.96)}
          tipX={right(imageBox) + 10}
          tipY={centerY(imageBox)}
          direction="left"
          shaftWidth={3.2}
          underlayWidth={6}
          headSize={8.5}
        />
        <StrokeArrow
          d={quadraticCurvePath(
            {x: imageBox.x - 10, y: centerY(imageBox)},
            {x: 386, y: 516},
            {x: centerX(receiptBox), y: bottom(receiptBox) + 10},
          )}
          stroke={scene.apiStroke}
          opacity={ringOpacity * 0.96}
          headOpacity={revealHeadOpacity(reveal, ringOpacity * 0.96)}
          tipX={centerX(receiptBox)}
          tipY={bottom(receiptBox) + 10}
          direction="up"
          shaftWidth={3.2}
          underlayWidth={6}
          headSize={8.5}
        />
        <StrokeArrow
          d={quadraticCurvePath(
            {x: centerX(receiptBox), y: receiptBox.y - 10},
            {x: 332, y: 182},
            {x: hookBox.x - 10, y: centerY(hookBox)},
          )}
          stroke={scene.apiStroke}
          opacity={ringOpacity * 0.96}
          headOpacity={revealHeadOpacity(reveal, ringOpacity * 0.96)}
          tipX={hookBox.x - 10}
          tipY={centerY(hookBox)}
          direction="right"
          shaftWidth={3.2}
          underlayWidth={6}
          headSize={8.5}
        />
      </g>
    </PlaceholderBoardShell>
  );
}

function Page32FeedbackBridgePage({
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
  const titleOpacity = opacity * resolveWindowProgress(entryProgress, 0.08, 0.38, easeOutQuint);
  const conceptOpacity = opacity * resolveWindowProgress(entryProgress, 0.14, 0.72, easeOutQuint);
  const modelOpacity = opacity * resolveWindowProgress(entryProgress, 0.22, 0.84, easeOutQuint);
  const footerOpacity = opacity * resolveWindowProgress(entryProgress, 0.54, 0.92, easeOutQuint);
  const center = centerX(PLACEHOLDER_BOARD);
  const titleBox = {x: 338, y: 112, width: 604, height: 52};
  const conceptBaseY = 174;
  const conceptGap = 72;
  const conceptCards = PAGE32_ABSTRACTION_PILLS.map((entry, index) => ({
    ...entry,
    box: {
      x: center - entry.width / 2,
      y: conceptBaseY + index * conceptGap,
      width: entry.width,
      height: 54,
      radius: 24,
    },
  }));
  const harnessCard = conceptCards[0]!;
  const lossCard = conceptCards[1]!;
  const feedbackCard = conceptCards[2]!;
  const modelInputBox = {x: 220, y: 432, width: 160, height: 88, radius: 20};
  const modelCenterBox = {x: 470, y: 418, width: 340, height: 116, radius: 24};
  const modelOutputBox = {x: 900, y: 432, width: 160, height: 88, radius: 20};
  const modelAxisY = centerY(modelInputBox);
  const loopLaneX = right(feedbackCard.box) + 94;
  const loopBackPoints = [
    {x: right(feedbackCard.box) + 10, y: centerY(feedbackCard.box)},
    {x: loopLaneX, y: centerY(feedbackCard.box)},
    {x: loopLaneX, y: centerY(harnessCard.box)},
    {x: right(harnessCard.box) + 10, y: centerY(harnessCard.box)},
  ];
  const footerBox = {x: 216, y: 620, width: 848, height: 38};

  return (
    <PlaceholderBoardShell opacity={panelOpacity}>
      <g transform="translate(0 -12)">
        <g
          data-geometry-node-id="bridge-title"
          data-geometry-node-label="Feedback Bridge Title"
        >
          <g data-geometry-node-box="1">
            <rect
              x={titleBox.x}
              y={titleBox.y}
              width={titleBox.width}
              height={titleBox.height}
              rx={10}
              fill="transparent"
              stroke="none"
            />
          </g>
          <text
            x={center}
            y={titleBox.y + titleBox.height / 2}
            fill="rgba(214, 102, 48, 0.96)"
            fontSize="34"
            fontWeight="830"
            textAnchor="middle"
            dominantBaseline="middle"
            data-geometry-node-text="1"
            opacity={titleOpacity}
          >
            {PAGE32_BRIDGE_TITLE}
          </text>
        </g>
        {conceptCards.map(({id, label, emphasized, labelFontSize, box}) => (
          <ArtifactNode
            key={id}
            box={box}
            scene={scene}
            opacity={conceptOpacity}
            label={label}
            emphasized={emphasized}
            labelFontSize={labelFontSize}
            geometryNodeId={id}
          />
        ))}
        <StrokeArrow
          d={verticalPath(centerX(harnessCard.box), bottom(harnessCard.box) + 8, lossCard.box.y - 8)}
          stroke={scene.apiStroke}
          opacity={conceptOpacity}
          headOpacity={revealHeadOpacity(reveal, conceptOpacity)}
          tipX={centerX(harnessCard.box)}
          tipY={lossCard.box.y - 8}
          direction="down"
          shaftWidth={3.1}
          underlayWidth={6}
          headSize={8.5}
        />
        <StrokeArrow
          d={verticalPath(centerX(lossCard.box), bottom(lossCard.box) + 8, feedbackCard.box.y - 8)}
          stroke={scene.apiStroke}
          opacity={conceptOpacity}
          headOpacity={revealHeadOpacity(reveal, conceptOpacity)}
          tipX={centerX(lossCard.box)}
          tipY={feedbackCard.box.y - 8}
          direction="down"
          shaftWidth={3.1}
          underlayWidth={6}
          headSize={8.5}
        />
        <StrokeArrow
          d={verticalPath(
            centerX(feedbackCard.box),
            bottom(feedbackCard.box) + 10,
            modelCenterBox.y - 10,
          )}
          stroke={scene.apiStroke}
          opacity={conceptOpacity}
          headOpacity={revealHeadOpacity(reveal, conceptOpacity)}
          tipX={centerX(feedbackCard.box)}
          tipY={modelCenterBox.y - 10}
          direction="down"
          shaftWidth={3.1}
          underlayWidth={6}
          headSize={8.5}
        />
        <StrokeArrow
          d={roundedPolylinePath(loopBackPoints, 0)}
          stroke="rgba(214, 102, 48, 0.68)"
          opacity={conceptOpacity * 0.92}
          headOpacity={revealHeadOpacity(reveal, conceptOpacity * 0.92)}
          tipX={right(harnessCard.box) + 10}
          tipY={centerY(harnessCard.box)}
          direction="left"
          shaftWidth={2.8}
          underlayWidth={5}
          headSize={8.5}
        />
        <g
          opacity={modelOpacity}
          data-geometry-node-id="model-input"
          data-geometry-node-label="Input"
        >
          <StageBox
            box={modelInputBox}
            fill="rgba(255, 251, 246, 0.98)"
            stroke={scene.nodeStroke}
            strokeWidth={2.8}
            markGeometryBox
          />
          <text
            x={centerX(modelInputBox)}
            y={modelAxisY + 4}
            fill="#22303d"
            fontSize="28"
            fontWeight="650"
            textAnchor="middle"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            Input
          </text>
        </g>
        <StrokeArrow
          d={horizontalPath(
            right(modelInputBox) + 24,
            modelCenterBox.x - 24,
            modelAxisY,
          )}
          stroke={scene.wireStroke}
          opacity={modelOpacity}
          headOpacity={revealHeadOpacity(reveal, modelOpacity)}
          tipX={modelCenterBox.x - 24}
          tipY={modelAxisY}
          direction="right"
          shaftWidth={3}
          underlayWidth={5.6}
          headSize={8.5}
        />
        <g
          opacity={modelOpacity}
          data-geometry-node-id="model-fx"
          data-geometry-node-label="f(x)"
        >
          <StageBox
            box={modelCenterBox}
            fill={scene.focusFill}
            stroke={scene.apiStroke}
            strokeWidth={3.2}
            markGeometryBox
          />
          <text
            x={centerX(modelCenterBox)}
            y={centerY(modelCenterBox) + 4}
            fill="#22303d"
            fontSize="36"
            fontWeight="700"
            letterSpacing="-0.04em"
            textAnchor="middle"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            f(x)
          </text>
        </g>
        <StrokeArrow
          d={horizontalPath(
            right(modelCenterBox) + 24,
            modelOutputBox.x - 24,
            modelAxisY,
          )}
          stroke={scene.wireStroke}
          opacity={modelOpacity}
          headOpacity={revealHeadOpacity(reveal, modelOpacity)}
          tipX={modelOutputBox.x - 24}
          tipY={modelAxisY}
          direction="right"
          shaftWidth={3}
          underlayWidth={5.6}
          headSize={8.5}
        />
        <g
          opacity={modelOpacity}
          data-geometry-node-id="model-output"
          data-geometry-node-label="Output"
        >
          <StageBox
            box={modelOutputBox}
            fill="rgba(255, 251, 246, 0.98)"
            stroke={scene.nodeStroke}
            strokeWidth={2.8}
            markGeometryBox
          />
          <text
            x={centerX(modelOutputBox)}
            y={modelAxisY + 4}
            fill="#22303d"
            fontSize="28"
            fontWeight="650"
            textAnchor="middle"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            Output
          </text>
        </g>
        <g
          data-geometry-node-id="bridge-footer"
          data-geometry-node-label="Feedback Bridge Footer"
        >
          <g data-geometry-node-box="1">
            <rect
              x={footerBox.x}
              y={footerBox.y}
              width={footerBox.width}
              height={footerBox.height}
              rx={8}
              fill="transparent"
              stroke="none"
            />
          </g>
          <text
            x={center}
            y={footerBox.y + footerBox.height / 2}
            fill="rgba(214, 102, 48, 0.96)"
            fontSize="29"
            fontWeight="800"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
              opacity={footerOpacity}
            >
            {PAGE32_BRIDGE_FOOTER}
          </text>
        </g>
      </g>
    </PlaceholderBoardShell>
  );
}

function Page33ReadingPage({
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
  const quoteOpacity = opacity * resolveWindowProgress(entryProgress, 0.08, 0.62, easeOutQuint);
  const linksOpacity = opacity * resolveWindowProgress(entryProgress, 0.42, 0.9, easeOutQuint);
  const quoteCenterX = centerX(PLACEHOLDER_BOARD);
  const quoteTitleBox = {x: 430, y: 110, width: 420, height: 48};
  const quoteLineStartY = 188;
  const quoteLineGap = 70;
  const quoteFooterBox = {x: 430, y: 430, width: 420, height: 44};
  const leftCard = {x: 84, y: 494, width: 510, height: 170, radius: 24};
  const rightCard = {x: 622, y: 494, width: 510, height: 170, radius: 24};
  const linkStartY = leftCard.y + 74;
  const linkStep = 62;

  return (
    <PlaceholderBoardShell opacity={panelOpacity}>
      <g transform="translate(0 -42)">
        <g
          data-geometry-node-id="quote-title"
          data-geometry-node-label="Closing Quote Title"
        >
          <g data-geometry-node-box="1">
            <rect
              x={quoteTitleBox.x}
              y={quoteTitleBox.y}
              width={quoteTitleBox.width}
              height={quoteTitleBox.height}
              rx={10}
              fill="transparent"
              stroke="none"
            />
          </g>
          <text
            x={quoteCenterX}
            y={quoteTitleBox.y + quoteTitleBox.height / 2}
            fill="rgba(214, 102, 48, 0.96)"
            fontSize="33"
            fontWeight="830"
            textAnchor="middle"
            dominantBaseline="middle"
            data-geometry-node-text="1"
            opacity={quoteOpacity}
          >
            《逍遥游》
          </text>
          {ZHUANGZI_CLOSING_LINES.map((line, index) => (
            <g
              key={line}
            >
              <g data-geometry-node-box="1">
                <rect
                  x={192}
                  y={quoteLineStartY + index * quoteLineGap - 30}
                  width={896}
                  height={60}
                  rx={10}
                  fill="transparent"
                  stroke="none"
                />
              </g>
              <text
                x={quoteCenterX}
                y={quoteLineStartY + index * quoteLineGap}
                fill="#22303d"
                fontSize={index < 2 ? "39" : "43"}
                fontWeight={index < 2 ? "730" : "790"}
                textAnchor="middle"
                dominantBaseline="middle"
                data-geometry-node-text="1"
                opacity={quoteOpacity}
              >
                {line}
              </text>
            </g>
          ))}
          <g
            data-geometry-node-id="quote-footer"
            data-geometry-node-label="Quote Footer"
          >
            <g data-geometry-node-box="1">
              <rect
                x={quoteFooterBox.x}
                y={quoteFooterBox.y}
                width={quoteFooterBox.width}
                height={quoteFooterBox.height}
                rx={8}
                fill="transparent"
                stroke="none"
              />
            </g>
            <text
              x={quoteCenterX}
              y={quoteFooterBox.y + quoteFooterBox.height / 2}
              fill="rgba(34, 48, 61, 0.64)"
              fontSize="21"
              fontWeight="640"
              textAnchor="middle"
              dominantBaseline="middle"
              data-geometry-node-text="1"
              opacity={quoteOpacity}
            >
              以此作为这次分享的最后一句。
            </text>
          </g>
        </g>
        <g
          data-geometry-node-id="left-links-card"
          data-geometry-node-label="Book And Video Reading"
        >
          <StageBox
            box={leftCard}
            fill="rgba(255, 252, 247, 0.96)"
            stroke={scene.nodeStroke}
            strokeWidth={2.2}
            markGeometryBox
          />
          <text
            x={leftCard.x + 30}
            y={leftCard.y + 28}
            fill="rgba(214, 102, 48, 0.96)"
            fontSize="22"
            fontWeight="830"
            textAnchor="start"
            dominantBaseline="middle"
            data-geometry-node-text="1"
            opacity={linksOpacity}
          >
            书与视频
          </text>
          <g opacity={linksOpacity}>
            {ENDING_CULTURE_LINKS.map((item, index) => (
              <EndingLinkItem
                key={item.title}
                x={leftCard.x + 30}
                y={linkStartY + index * linkStep}
                title={item.title}
                subtitle={item.subtitle}
                href={item.href}
              geometryNodeId={`left-link-${index + 1}`}
                geometryWidth={448}
                titleFontSize={22}
                subtitleFontSize={16}
                subtitleOffset={22}
              />
            ))}
          </g>
        </g>
        <g
          data-geometry-node-id="right-links-card"
          data-geometry-node-label="Game Reading"
        >
          <StageBox
            box={rightCard}
            fill="rgba(255, 252, 247, 0.96)"
            stroke={scene.nodeStroke}
            strokeWidth={2.2}
            markGeometryBox
          />
          <text
            x={rightCard.x + 30}
            y={rightCard.y + 28}
            fill="rgba(214, 102, 48, 0.96)"
            fontSize="22"
            fontWeight="830"
            textAnchor="start"
            dominantBaseline="middle"
            data-geometry-node-text="1"
            opacity={linksOpacity}
          >
            推荐游戏
          </text>
          <g opacity={linksOpacity}>
            {ENDING_GAME_LINKS.map((item, index) => (
              <EndingLinkItem
                key={item.title}
                x={rightCard.x + 30}
                y={linkStartY + index * linkStep}
                title={item.title}
                subtitle={item.subtitle}
                href={item.href}
              geometryNodeId={`right-link-${index + 1}`}
                geometryWidth={448}
                titleFontSize={22}
                subtitleFontSize={16}
                subtitleOffset={22}
              />
            ))}
          </g>
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
    LOOP_PAGE19_FRAME,
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
  const page26PlaceholderReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE24_FRAME,
    LOOP_PAGE26_FRAME,
  );
  const page28PlaceholderReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE26_FRAME,
    LOOP_PAGE28_FRAME,
  );
  const page29PlaceholderReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE28_FRAME,
    LOOP_PAGE29_FRAME,
  );
  const page29DataPlaceholderReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE29_FRAME,
    LOOP_PAGE29_DATA_FRAME,
  );
  const page30PlaceholderReveal = settledSegmentProgress(
    frame,
    LOOP_PAGE29_DATA_FRAME,
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
    0.02,
    0.82,
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
  const page26PlaceholderVisible = resolveWindowProgress(
    page26PlaceholderReveal,
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
  const page29DataPlaceholderVisible = resolveWindowProgress(
    page29DataPlaceholderReveal,
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
    0.9,
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
  const page21OverlayExit =
    1 - resolveWindowProgress(page22PlaceholderVisible, 0.02, 0.22, easeInOutCubic);
  const page21PlaceholderFocus = page21PlaceholderVisible * page21OverlayExit;
  const page22OverlayExit = 1 - page24PlaceholderVisible;
  const page24OverlayExit = 1 - page26PlaceholderVisible;
  const page26OverlayExit = 1 - page28PlaceholderVisible;
  const page28OverlayExit = 1 - page29PlaceholderVisible;
  const page29OverlayExit =
    1 - resolveWindowProgress(page29DataPlaceholderVisible, 0.02, 0.22, easeInOutCubic);
  const page29DataOverlayExit =
    1 - resolveWindowProgress(page30PlaceholderVisible, 0.02, 0.22, easeInOutCubic);
  const page30OverlayExit =
    1 - resolveWindowProgress(page31PlaceholderVisible, 0.02, 0.22, easeInOutCubic);
  const page31OverlayExit =
    1 - resolveWindowProgress(page32PlaceholderVisible, 0.02, 0.22, easeInOutCubic);
  const page32OverlayExit =
    1 - resolveWindowProgress(page33PlaceholderVisible, 0.02, 0.22, easeInOutCubic);
  const page13ImageOverlayExit =
    1 - resolveWindowProgress(page15ImageReveal, 0.08, 0.3, easeInOutCubic);
  const page15ImageOverlayExit =
    1 - resolveWindowProgress(page15Reveal, 0.02, 0.2, easeInOutCubic);
  const page18ImageOverlayExit =
    1 - resolveWindowProgress(page19PlaceholderVisible, 0.02, 0.22, easeInOutCubic);
  const page22PlaceholderFocus = page22PlaceholderVisible * page22OverlayExit;
  const page24PlaceholderFocus = page24PlaceholderVisible * page24OverlayExit;
  const page26PlaceholderFocus = page26PlaceholderVisible * page26OverlayExit;
  const page28PlaceholderFocus = page28PlaceholderVisible * page28OverlayExit;
  const page29PlaceholderFocus = page29PlaceholderVisible * page29OverlayExit;
  const page29DataPlaceholderFocus =
    page29DataPlaceholderVisible * page29DataOverlayExit;
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
  const page18Focus = page18Reveal * (1 - page18ImageVisible);
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
    page26PlaceholderFocus,
    page28PlaceholderFocus,
    page29PlaceholderFocus,
    page29DataPlaceholderFocus,
    page30PlaceholderFocus,
    page31PlaceholderFocus,
    page32PlaceholderFocus,
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
    page26PlaceholderVisible,
    page28PlaceholderVisible,
    page29PlaceholderVisible,
    page29DataPlaceholderVisible,
    page30PlaceholderVisible,
    page31PlaceholderVisible,
    page32PlaceholderVisible,
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
  const page14PhoneEmphasis = mix(1, 1.16, easeOutQuint(page14PlaceholderFocus));
  const page14PhoneOffsetX = mix(
    0,
    PAGE14_GPU_CENTER_X - PHONE_GPU.x,
    easeInOutCubic(page14PlaceholderFocus),
  );

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
              label=".scl.csv(.shk)"
              labelFontSize={20}
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
                stroke={LOOP_CLOUD_STROKE}
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
                fill={LOOP_CLOUD_STROKE}
                fontSize="24"
                fontWeight="760"
                textAnchor="middle"
                opacity={cookLabelOpacity}
              >
                cook
              </text>
              <StrokeArrow
                d={roundedPolylinePath(splitToSclPoints)}
                stroke={LOOP_CLOUD_STROKE}
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
                stroke={LOOP_CLOUD_STROKE}
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
              testId="page13-bytecode-to-phone-arrow"
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
                  stroke={LOOP_CLOUD_STROKE}
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
                  testId="page15-rec-to-computer-arrow"
                  d={roundedPolylinePath(recToComputerPoints)}
                  stroke={LOOP_CLOUD_STROKE}
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
                stroke={LOOP_CLOUD_STROKE}
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
                fill={LOOP_CLOUD_STROKE}
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
                stroke={LOOP_CLOUD_STROKE}
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
                stroke={LOOP_CLOUD_STROKE}
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
                stroke={LOOP_CLOUD_STROKE}
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
                stroke={LOOP_CLOUD_STROKE}
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
                stroke={LOOP_CLOUD_STROKE}
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
          entryProgress={page21PlaceholderVisible}
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
      {page26PlaceholderFocus > 0.001 ? (
        <Page26TimingPage
          scene={scene}
          opacity={page26PlaceholderFocus}
          entryProgress={page26PlaceholderReveal}
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
      {page29DataPlaceholderFocus > 0.001 ? (
        <Page29DriverOptimizationPage
          scene={scene}
          opacity={page29DataPlaceholderFocus}
          entryProgress={page29DataPlaceholderReveal}
        />
      ) : null}
      {page30PlaceholderFocus > 0.001 ? (
        <Page30PsoReadingPage
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
        <Page32FeedbackBridgePage
          scene={scene}
          opacity={page32PlaceholderFocus}
          entryProgress={page32PlaceholderReveal}
        />
      ) : null}
      {page33PlaceholderFocus > 0.001 ? (
        <Page33ReadingPage
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
