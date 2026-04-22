import React from "react";
import {cleanup, render, screen} from "@testing-library/react";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

let mockFrame = 18;

vi.mock("remotion", () => ({
  AbsoluteFill: ({
    children,
    style,
  }: {
    children: React.ReactNode;
    style?: React.CSSProperties;
  }) => (
    <div data-testid="absolute-fill" style={style}>
      {children}
    </div>
  ),
  useCurrentFrame: () => mockFrame,
}));

import {MyComposition} from "./Composition";
import {resolveRemotionStepFrame} from "./embed";
import {computeSceneModel} from "./model/computeSceneModel";
import {REMOTION_STEP_SEQUENCE} from "./sceneTimeline";

const LEGACY_STEP_FRAME_MAP = {
  page_00: 0,
  page_01: 18,
  page_02: 54,
  page_03: 90,
  page_04: 126,
  page_04_data: 144,
  page_05: 198,
  page_06: 270,
  page_07: 306,
  page_08: 342,
  page_09: 378,
  page_09_img: 444,
  page_10: 510,
  page_11: 582,
  page_12: 636,
  page_13: 690,
  page_14: 744,
  page_13_img: 798,
  page_15_img: 852,
  page_15: 906,
  page_16: 996,
  page_17: 1086,
  page_18: 1176,
  page_18_img: 1230,
  page_19: 1284,
  page_20: 1374,
  page_21: 1464,
  page_22: 1554,
  page_24: 1734,
  page_25: 1824,
  page_26: 1914,
  page_27: 2004,
  page_28: 2094,
  page_29: 2184,
  page_29_data: 2230,
  page_30: 2274,
  page_31: 2364,
  page_32: 2454,
  page_33: 2544,
} as const;
const LOOP_CLOUD_STROKE = "rgba(118, 163, 207, 0.94)";

function remapLegacyFrame(legacyFrame: number) {
  const safeLegacyFrame = Math.max(0, Math.round(legacyFrame));
  const firstStep = REMOTION_STEP_SEQUENCE[0];
  const firstLegacyFrame = LEGACY_STEP_FRAME_MAP[firstStep];

  if (safeLegacyFrame <= firstLegacyFrame) {
    return safeLegacyFrame;
  }

  for (let index = 0; index < REMOTION_STEP_SEQUENCE.length - 1; index += 1) {
    const fromStep = REMOTION_STEP_SEQUENCE[index]!;
    const toStep = REMOTION_STEP_SEQUENCE[index + 1]!;
    const fromLegacy = LEGACY_STEP_FRAME_MAP[fromStep];
    const toLegacy = LEGACY_STEP_FRAME_MAP[toStep];

    if (safeLegacyFrame <= toLegacy) {
      const progress =
        (safeLegacyFrame - fromLegacy) / Math.max(1, toLegacy - fromLegacy);
      const fromFrame = resolveRemotionStepFrame(fromStep);
      const toFrame = resolveRemotionStepFrame(toStep);

      return Math.round(fromFrame + progress * (toFrame - fromFrame));
    }
  }

  const lastStep = REMOTION_STEP_SEQUENCE[REMOTION_STEP_SEQUENCE.length - 1]!;
  const lastLegacyFrame = LEGACY_STEP_FRAME_MAP[lastStep];
  const lastFrame = resolveRemotionStepFrame(lastStep);
  const trailingOffset = safeLegacyFrame - lastLegacyFrame;

  return Math.max(0, Math.round(lastFrame + trailingOffset));
}

function setLegacyFrame(legacyFrame: number) {
  mockFrame = remapLegacyFrame(legacyFrame);
}

function setStepFrame(stepId: keyof typeof LEGACY_STEP_FRAME_MAP, offset = 0) {
  mockFrame = resolveRemotionStepFrame(stepId) + offset;
}

function normalizeText(value: string | null | undefined) {
  return (value ?? "").replace(/\s+/g, "");
}

function opacityOf(node: Element | null) {
  return Number(node?.getAttribute("opacity") ?? "1");
}

function effectiveOpacity(node: Element | null) {
  let current: Element | null = node;
  let opacity = 1;

  while (current) {
    const localOpacity = current.getAttribute("opacity");

    if (localOpacity !== null) {
      opacity *= Number(localOpacity);
    }

    current = current.parentElement;
  }

  return opacity;
}

function findVisibleLegacyLoopNodes(container: Element) {
  return [
    ...findSvgTextNodesByContent(container, "rec.upipelinecache"),
    ...findSvgTextNodesByContent(container, "stablepc.csv"),
    ...findSvgTextNodesByContent(container, ".scl.csv"),
    ...findSvgTextNodesByContent(container, ".ushaderbytecode"),
    ...findSvgTextNodesByContent(container, "expand"),
    ...findSvgTextNodesByContent(container, "cook"),
  ].filter((node) => effectiveOpacity(node) > 0.08);
}

function findTextNodes(container: HTMLElement, label: string) {
  const normalizedLabel = normalizeText(label);

  return Array.from(container.querySelectorAll("text")).filter(
    (node) => normalizeText(node.textContent) === normalizedLabel,
  );
}

function findSvgTextNodesByContent(container: HTMLElement, label: string) {
  const normalizedLabel = normalizeText(label);

  return Array.from(container.querySelectorAll("text")).filter(
    (node) => normalizeText(node.textContent) === normalizedLabel,
  );
}

function findBoxGroupByLabel(container: HTMLElement, label: string) {
  const start = findTextNodes(container, label)[0];
  let current = start?.closest("g") ?? null;

  while (current && !current.querySelector("rect")) {
    current = current.parentElement?.closest("g") ?? null;
  }

  return current;
}

function findVisibleBoxGroupByLabel(
  container: HTMLElement,
  label: string,
  minOpacity = 0.16,
) {
  const start = findTextNodes(container, label).find(
    (node) => effectiveOpacity(node) > minOpacity,
  );
  let current = start?.closest("g") ?? null;

  while (current && !current.querySelector("rect")) {
    current = current.parentElement?.closest("g") ?? null;
  }

  return current;
}

function findVisibleUmaterialGroup(container: HTMLElement, minOpacity = 0.16) {
  return (
    findVisibleBoxGroupByLabel(container, "UMaterial", minOpacity) ??
    findVisibleBoxGroupByLabel(container, "Material", minOpacity)
  );
}

function findVisibleUmaterialLabel(container: HTMLElement, minOpacity = 0.16) {
  return (
    findTextNodes(container, "UMaterial").find(
      (node) => effectiveOpacity(node) > minOpacity,
    ) ??
    findTextNodes(container, "Material").find(
      (node) => effectiveOpacity(node) > minOpacity,
    )
  );
}

function parseLeadingTranslate(transform: string | null | undefined) {
  const match = transform?.match(/translate\(([-\d.]+) ([-\d.]+)\)/);

  if (!match) {
    return null;
  }

  return {
    x: Number(match[1]),
    y: Number(match[2]),
  };
}

function parseTrailingTranslate(transform: string | null | undefined) {
  const matches = Array.from(
    transform?.matchAll(/translate\(([-\d.]+) ([-\d.]+)\)/g) ?? [],
  );
  const lastMatch = matches.at(-1);

  if (!lastMatch) {
    return null;
  }

  return {
    x: Number(lastMatch[1]),
    y: Number(lastMatch[2]),
  };
}

function rectCenterX(rect: Element | null | undefined) {
  return Number(rect?.getAttribute("x")) + Number(rect?.getAttribute("width")) / 2;
}

function rectCenterY(rect: Element | null | undefined) {
  return Number(rect?.getAttribute("y")) + Number(rect?.getAttribute("height")) / 2;
}

function boxCenter(box: {x: number; y: number; width: number; height: number}) {
  return {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
  };
}

function textX(node: Element | null | undefined) {
  return Number(node?.getAttribute("x"));
}

function textY(node: Element | null | undefined) {
  return Number(node?.getAttribute("y"));
}

function fontSizeOf(node: Element | null | undefined) {
  return Number(node?.getAttribute("font-size"));
}

function fontWeightOf(node: Element | null | undefined) {
  return Number(node?.getAttribute("font-weight"));
}

function rectMetrics(rect: Element | null | undefined) {
  const x = Number(rect?.getAttribute("x"));
  const y = Number(rect?.getAttribute("y"));
  const width = Number(rect?.getAttribute("width"));
  const height = Number(rect?.getAttribute("height"));

  return {
    x,
    y,
    width,
    height,
    right: x + width,
    bottom: y + height,
  };
}

function maxRectBottom(group: Element | null | undefined) {
  return Math.max(
    ...Array.from(group?.querySelectorAll("rect") ?? []).map(
      (rect) => rectMetrics(rect).bottom,
    ),
  );
}

function minRectTop(group: Element | null | undefined) {
  return Math.min(
    ...Array.from(group?.querySelectorAll("rect") ?? []).map(
      (rect) => rectMetrics(rect).y,
    ),
  );
}

function findRectByBox(container: HTMLElement, box: {x: number; y: number; width: number; height: number}, tolerance = 2) {
  return Array.from(container.querySelectorAll("rect")).find((rect) => {
    const metrics = rectMetrics(rect);

    return (
      Math.abs(metrics.x - box.x) <= tolerance &&
      Math.abs(metrics.y - box.y) <= tolerance &&
      Math.abs(metrics.width - box.width) <= tolerance &&
      Math.abs(metrics.height - box.height) <= tolerance
    );
  }) ?? null;
}

function parseScale(transform: string | null | undefined) {
  const match = transform?.match(/scale\(([-\d.]+)\)/);

  return match ? Number(match[1]) : null;
}

function projectPointThroughGroup(
  group: Element | null | undefined,
  point: {x: number; y: number},
) {
  const transform = group?.getAttribute("transform");
  const leading = parseLeadingTranslate(transform);
  const trailing = parseTrailingTranslate(transform);
  const scale = parseScale(transform) ?? 1;

  if (!leading || !trailing) {
    return point;
  }

  return {
    x: leading.x + scale * (point.x + trailing.x),
    y: leading.y + scale * (point.y + trailing.y),
  };
}

function strokeWidthSignature(group: Element | null | undefined) {
  return Array.from(group?.querySelectorAll("path") ?? [])
    .map((node) => Number(node.getAttribute("stroke-width")))
    .filter((value) => Number.isFinite(value))
    .join(",");
}

function strokePalette(group: Element | null | undefined) {
  return Array.from(group?.querySelectorAll("path") ?? [])
    .map((node) => node.getAttribute("stroke"))
    .filter((value): value is string => Boolean(value))
    .filter((value, index, values) => values.indexOf(value) === index)
    .join(",");
}

function dashSignature(group: Element | null | undefined) {
  return Array.from(group?.querySelectorAll("path") ?? [])
    .map((node) => node.getAttribute("stroke-dasharray"))
    .filter((value): value is string => Boolean(value))
    .filter((value, index, values) => values.indexOf(value) === index)
    .join(",");
}

function parseVerticalPathX(group: Element | null | undefined) {
  const d = group?.querySelector("path")?.getAttribute("d");
  const match = d?.match(/M ([-\d.]+) [-\d.]+ L \1 [-\d.]+/);

  return match ? Number(match[1]) : null;
}

function parseSimplePathLength(group: Element | null | undefined) {
  const d = group?.querySelector("path")?.getAttribute("d");
  const match = d?.match(/M ([-\d.]+) ([-\d.]+) L ([-\d.]+) ([-\d.]+)/);

  if (!match) {
    return null;
  }

  const x1 = Number(match[1]);
  const y1 = Number(match[2]);
  const x2 = Number(match[3]);
  const y2 = Number(match[4]);

  return Math.hypot(x2 - x1, y2 - y1);
}

function parseSimplePathPoints(group: Element | null | undefined) {
  const d = group?.querySelector("path")?.getAttribute("d");
  const match = d?.match(/M ([-\d.]+) ([-\d.]+) L ([-\d.]+) ([-\d.]+)/);

  if (!match) {
    return null;
  }

  return {
    x1: Number(match[1]),
    y1: Number(match[2]),
    x2: Number(match[3]),
    y2: Number(match[4]),
  };
}

function parsePathPoints(path: Element | null | undefined) {
  const d = path?.getAttribute("d");
  const match = d?.match(/M ([-\d.]+) ([-\d.]+) L ([-\d.]+) ([-\d.]+)/);

  if (!match) {
    return null;
  }

  return {
    x1: Number(match[1]),
    y1: Number(match[2]),
    x2: Number(match[3]),
    y2: Number(match[4]),
  };
}

function parsePolylineVertices(group: Element | null | undefined) {
  const d = group?.querySelector("path")?.getAttribute("d") ?? "";

  return Array.from(d.matchAll(/[ML] ([-\d.]+) ([-\d.]+)/g)).map((match) => ({
    x: Number(match[1]),
    y: Number(match[2]),
  }));
}

function horizontalDividerY(group: Element | null | undefined, role: string, index = 0) {
  const path = Array.from(group?.querySelectorAll(`path[data-role="${role}"]`) ?? [])[index];
  const points = parsePathPoints(path);

  return points ? (points.y1 + points.y2) / 2 : NaN;
}

describe("MyComposition", () => {
  beforeEach(() => {
    setLegacyFrame(18);
  });

  afterEach(() => {
    cleanup();
  });

  it("renders page 01 as the minimal formula model", () => {
    const {container} = render(<MyComposition variantId="bus-clean" />);

    expect(screen.getByText("Input")).toBeInTheDocument();
    expect(screen.getByText("f(x)")).toBeInTheDocument();
    expect(screen.getByText("Output")).toBeInTheDocument();
    expect(
      Array.from(container.querySelectorAll("div")).some((node) =>
        node.getAttribute("style")?.includes("width: 1280px"),
      ),
    ).toBe(false);
  });

  it("renders page 00 as a three-step opening with a compile strip between the before and after screenshots", () => {
    setLegacyFrame(0);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const beforeImage = container.querySelector('[data-testid="page00-before-image"]');
    const compileImage = container.querySelector('[data-testid="page00-compile-image"]');
    const afterImage = container.querySelector('[data-testid="page00-after-image"]');

    expect(findSvgTextNodesByContent(container, "开场")[0]).toBeUndefined();
    expect(findSvgTextNodesByContent(container, "PSO Cache启用前")[0]).toBeDefined();
    expect(findSvgTextNodesByContent(container, "编译着色器")[0]).toBeDefined();
    expect(findSvgTextNodesByContent(container, "PSO Cache启用后")[0]).toBeDefined();
    expect(findSvgTextNodesByContent(container, "卡顿时")[0]).toBeUndefined();
    expect(findSvgTextNodesByContent(container, "卡顿消失后")[0]).toBeUndefined();
    expect(findSvgTextNodesByContent(container, "跟这个图片相比，")[0]).toBeUndefined();
    expect(findSvgTextNodesByContent(container, "匹配的单帧高峰从何而来？")[0]).toBeUndefined();
    expect(findSvgTextNodesByContent(container, "预热着色器到底是在干什么？")[0]).toBeUndefined();
    expect(findSvgTextNodesByContent(container, "为什么需要预编译着色器...")[0]).toBeUndefined();
    expect(container.querySelector('[data-testid="page00-question-card"]')).toBeNull();
    expect(container.querySelector('[data-testid="page00-prompt-list"]')).toBeNull();
    expect(beforeImage?.getAttribute("href")).toBe("/supplement/pso-stutter.png");
    expect(compileImage?.getAttribute("href")).toBe("/supplement/pso-compile-shader.png");
    expect(afterImage?.getAttribute("href")).toBe("/supplement/pso-precompile-smooth-peak.png");
    expect(compileImage?.getAttribute("x")).toBe(beforeImage?.getAttribute("x"));
    expect(afterImage?.getAttribute("x")).toBe(beforeImage?.getAttribute("x"));
    expect(compileImage?.getAttribute("width")).toBe(beforeImage?.getAttribute("width"));
    expect(afterImage?.getAttribute("width")).toBe(beforeImage?.getAttribute("width"));
    expect(beforeImage?.getAttribute("preserveAspectRatio")).toBe("xMidYMin slice");
    expect(compileImage?.getAttribute("preserveAspectRatio")).toBe("xMidYMid meet");
    expect(afterImage?.getAttribute("preserveAspectRatio")).toBe("xMidYMin slice");
    expect(Number(compileImage?.getAttribute("y"))).toBeGreaterThan(
      Number(beforeImage?.getAttribute("y")) + Number(beforeImage?.getAttribute("height")),
    );
    expect(Number(afterImage?.getAttribute("y"))).toBeGreaterThan(
      Number(compileImage?.getAttribute("y")) + Number(compileImage?.getAttribute("height")),
    );
    expect(findSvgTextNodesByContent(container, "样本 A")[0]).toBeUndefined();
    expect(findSvgTextNodesByContent(container, "样本 B")[0]).toBeUndefined();
  });

  it("hands off from page 00 to page 01 by fading the opening overlay and revealing the minimal model", () => {
    setLegacyFrame(0);
    const {container: openingContainer, unmount} = render(<MyComposition variantId="bus-clean" />);
    const openingInputNodes = findSvgTextNodesByContent(openingContainer, "Input").filter(
      (node) => effectiveOpacity(node) > 0.08,
    );

    expect(
      openingContainer.querySelector('[data-testid="page00-before-image"]'),
    ).not.toBeNull();
    expect(openingInputNodes.length).toBe(0);

    unmount();
    setLegacyFrame(18);
    const {container: page01Container} = render(<MyComposition variantId="bus-clean" />);
    const page01InputNodes = findSvgTextNodesByContent(page01Container, "Input").filter(
      (node) => effectiveOpacity(node) > 0.08,
    );
    const page01FxNodes = findSvgTextNodesByContent(page01Container, "f(x)").filter(
      (node) => effectiveOpacity(node) > 0.08,
    );

    expect(
      page01Container.querySelector('[data-testid="page00-before-image"]'),
    ).toBeNull();
    expect(page01InputNodes.length).toBeGreaterThanOrEqual(1);
    expect(page01FxNodes.length).toBeGreaterThanOrEqual(1);
  });

  it("renders page 02 as VertexData -> GPU -> pixels with a clean GPU silhouette", () => {
    setLegacyFrame(54);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const scene = computeSceneModel(remapLegacyFrame(54), "bus-clean");
    const pipelineArrow = container.querySelector('[data-testid="page2-pipeline-arrow"]');
    const pipelineState = container.querySelector('[data-testid="page2-pipeline-state"] rect');
    const pipelinePreviewCard = container.querySelector('[data-testid="page2-pso-preview-card"] rect');
    const vertexBufferInset = container.querySelector(
      '[data-testid="page2-vertex-buffer-image"] [data-geometry-node-box="1"]',
    );
    const vertexBufferImage = container.querySelector('[data-testid="page2-vertex-buffer-image"] image');

    expect(screen.getAllByText("GPU").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Pipeline State")).toBeInTheDocument();
    expect(screen.getByText("GfxAPI设置")).toBeInTheDocument();
    expect(screen.getByText("PSO = Shaders + States")).toBeInTheDocument();
    expect(screen.getByText("VS / FS / GS / ...")).toBeInTheDocument();
    expect(screen.getByText("Input Layout")).toBeInTheDocument();
    expect(screen.getByText("Depth / Stencil Test")).toBeInTheDocument();
    expect(screen.getByText("Blend / Rasterizer")).toBeInTheDocument();
    expect(screen.queryByText("State 里常见会收什么")).toBeNull();
    expect(screen.queryByText("Texture")).not.toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="vertex-icon"][opacity="1"]'),
    ).not.toBeNull();
    expect(
      container.querySelector('[data-testid="pixel-grid"][opacity="1"]'),
    ).not.toBeNull();
    expect(container.querySelector('[data-testid="page2-pipeline-state"]')).not.toBeNull();
    expect(pipelineArrow).not.toBeNull();
    expect(strokePalette(pipelineArrow)).toBe("#d06b44");
    expect(pipelineState?.getAttribute("stroke")).toBe("#d06b44");
    expect(pipelinePreviewCard).not.toBeNull();
    expect(rectMetrics(pipelinePreviewCard).x).toBeGreaterThanOrEqual(116);
    expect(rectMetrics(pipelinePreviewCard).y).toBeGreaterThanOrEqual(
      scene.centerBox.y + scene.centerBox.height + 8,
    );
    expect(rectMetrics(pipelinePreviewCard).width).toBeGreaterThanOrEqual(500);
    expect(rectMetrics(pipelinePreviewCard).height).toBeGreaterThanOrEqual(268);
    expect(rectMetrics(pipelinePreviewCard).right).toBeLessThanOrEqual(
      rectMetrics(vertexBufferInset).x - 60,
    );
    expect(rectMetrics(pipelinePreviewCard).bottom).toBeLessThanOrEqual(716);
    expect(vertexBufferImage?.getAttribute("href")).toBe("/supplement/VertexBuffer.png");
    expect(vertexBufferInset).not.toBeNull();
    expect(rectMetrics(vertexBufferInset).x + rectMetrics(vertexBufferInset).width / 2).toBeGreaterThan(
      scene.centerBox.x + scene.centerBox.width,
    );
    expect(rectMetrics(vertexBufferInset).bottom).toBeLessThanOrEqual(668);
    const lowerBandTop = scene.centerBox.y + scene.centerBox.height + 8;
    const lowerBandBottom = 720;
    const previewTopGap = rectMetrics(pipelinePreviewCard).y - lowerBandTop;
    const previewBottomGap = lowerBandBottom - rectMetrics(pipelinePreviewCard).bottom;
    const insetTopGap = rectMetrics(vertexBufferInset).y - lowerBandTop;
    const insetBottomGap = lowerBandBottom - rectMetrics(vertexBufferInset).bottom;
    expect(previewTopGap).toBe(14);
    expect(previewBottomGap).toBe(14);
    expect(insetTopGap).toBe(62);
    expect(insetBottomGap).toBe(62);
    expect(Math.abs(previewTopGap - previewBottomGap)).toBeLessThanOrEqual(1);
    expect(Math.abs(insetTopGap - insetBottomGap)).toBeLessThanOrEqual(1);
    expect(container.querySelectorAll('[data-testid="page2-gpu-slot"]').length).toBe(0);
    expect(
      Array.from(container.querySelectorAll("rect")).length,
    ).toBeGreaterThan(10);
  });

  it("keeps page 02 pipeline entry gaps balanced and the GfxAPI label readable", () => {
    setLegacyFrame(54);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const scene = computeSceneModel(remapLegacyFrame(54), "bus-clean");
    const pipelineArrow = container.querySelector('[data-testid="page2-pipeline-arrow"]');
    const pipelineArrowPoints = parseSimplePathPoints(pipelineArrow);
    const pipelineState = container.querySelector('[data-testid="page2-pipeline-state"] rect');
    const gfxApiLabel = container.querySelector('[data-testid="page2-gfxapi-label"]');

    expect(pipelineArrow).not.toBeNull();
    expect(pipelineArrowPoints).not.toBeNull();
    expect((pipelineArrowPoints?.y1 ?? 0) - rectMetrics(pipelineState).bottom).toBe(16);
    expect(scene.centerBox.y - (pipelineArrowPoints?.y2 ?? 0)).toBe(16);
    expect(fontSizeOf(gfxApiLabel)).toBe(22);
  });

  it("renders page 03 with a top configuration band and API-call legend", () => {
    setLegacyFrame(90);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const page2Scene = computeSceneModel(remapLegacyFrame(54), "bus-clean");
    const scene = computeSceneModel(remapLegacyFrame(90), "bus-clean");
    const programGroup = findBoxGroupByLabel(container, "Program");
    const compileArrow = container.querySelector('[data-testid="page3-compile-arrow"]');
    const compileBadge = container.querySelector('[data-testid="page3-compile-badge"]');
    const badge2 = container.querySelector('[data-testid="page3-useprogram-badge"]');
    const badge5 = container.querySelector('[data-testid="page3-linkprogram-badge"]');
    const badge6 = container.querySelector('[data-testid="page3-getprogrambinary-badge"]');
    const linkLeft = container.querySelector('[data-testid="page3-linkprogram-input-left"]');
    const linkRight = container.querySelector('[data-testid="page3-linkprogram-input-right"]');
    const workflowFrame = container.querySelector('[data-testid="page3-program-workflow-frame"]');
    const compileBadgeCircle = compileBadge?.querySelector("circle");
    const badge2Circle = badge2?.querySelector("circle");
    const badge5Circle = badge5?.querySelector("circle");
    const badge6Circle = badge6?.querySelector("circle");
    const workflowRect = workflowFrame?.querySelector("rect");
    const leftX = parseVerticalPathX(linkLeft);
    const rightX = parseVerticalPathX(linkRight);
    const gpuCarrierRect = findRectByBox(container, scene.centerBox);

    expect(screen.getAllByText("GPU").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Raw")).toBeInTheDocument();
    expect(screen.getAllByText("ShaderCode").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Binary")).toBeInTheDocument();
    expect(programGroup).toBeTruthy();
    expect(screen.getByText("Depth")).toBeInTheDocument();
    expect(screen.getByText("Blend")).toBeInTheDocument();
    expect(container.querySelectorAll('[data-testid="page2-gpu-slot"]').length).toBe(0);
    expect(compileArrow).not.toBeNull();
    expect(strokePalette(compileArrow)).toBe("#ff0000");
    expect(compileBadge).not.toBeNull();
    expect(opacityOf(compileBadge)).toBeGreaterThan(0.9);
    expect(compileBadgeCircle?.getAttribute("stroke")).toBe("#ff0000");
    expect(badge2).not.toBeNull();
    expect(opacityOf(badge2)).toBeGreaterThan(0.9);
    expect(badge2Circle?.getAttribute("stroke")).toBe("#d06b44");
    expect(badge5).not.toBeNull();
    expect(opacityOf(badge5)).toBeGreaterThan(0.9);
    expect(badge5Circle?.getAttribute("stroke")).toBe("#ff0000");
    expect(badge6).not.toBeNull();
    expect(opacityOf(badge6)).toBeGreaterThan(0.9);
    expect(badge6Circle?.getAttribute("stroke")).toBe("#d06b44");
    expect(dashSignature(linkLeft)).toBe("7 7");
    expect(dashSignature(linkRight)).toBe("7 7");
    expect(strokePalette(linkLeft)).toBe("#ff0000");
    expect(strokePalette(linkRight)).toBe("#ff0000");
    expect(workflowFrame?.querySelector("rect")?.getAttribute("stroke-dasharray")).toBe("10 8");
    expect(workflowRect?.getAttribute("stroke")).toBe("#d06b44");
    expect(Number(badge6Circle?.getAttribute("cx"))).toBeLessThanOrEqual(
      Number(workflowRect?.getAttribute("x")) + 36,
    );
    expect(Number(badge6Circle?.getAttribute("cy"))).toBeGreaterThanOrEqual(
      Number(workflowRect?.getAttribute("y")) + Number(workflowRect?.getAttribute("height")) - 36,
    );
    expect(Number(badge5Circle?.getAttribute("cx"))).toBeCloseTo(
      ((leftX ?? 0) + (rightX ?? 0)) / 2,
      0,
    );
    expect(scene.leftBox.y).toBeGreaterThan(page2Scene.leftBox.y);
    expect(scene.centerBox.y).toBeGreaterThan(page2Scene.centerBox.y);
    expect(scene.centerBox.width).toBeGreaterThan(page2Scene.centerBox.width);
    expect(scene.centerBox.height).toBeGreaterThan(page2Scene.centerBox.height);
    expect(scene.rightBox.y).toBeGreaterThan(page2Scene.rightBox.y);
    expect(scene.shaderCodeBox.x - rectMetrics(workflowRect).x).toBeLessThanOrEqual(40);
    expect(rectMetrics(workflowRect).y).toBeGreaterThanOrEqual(112);
    expect(rectMetrics(workflowRect).y).toBeLessThanOrEqual(120);
    expect(rectMetrics(gpuCarrierRect).y).toBeGreaterThanOrEqual(402);
    expect(Number(findBoxGroupByLabel(container, "Depth")?.querySelector("rect")?.getAttribute("x"))).toBeGreaterThan(640);
    expect(Number(findBoxGroupByLabel(container, "Blend")?.querySelector("rect")?.getAttribute("x"))).toBeGreaterThan(750);
    expect(container.querySelectorAll("circle").length).toBeGreaterThan(6);
  });

  it("renders page 04 as a Vulkan PSO page that keeps the SPIR-V path and middle packaging layers", () => {
    setLegacyFrame(126);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const visibleOrangeBadges = Array.from(
      container.querySelectorAll('circle[stroke="#d06b44"]'),
    ).filter((node) => opacityOf(node.closest("g")) > 0);
    const page4WorkflowFrame = container.querySelector('[data-testid="page4-pso-workflow-frame"]');
    const page4WorkflowBadge = container.querySelector(
      '[data-testid="page4-getpipelinecachedata-badge"]',
    );
    const page4CreateArrow = container.querySelector('[data-testid="page4-create-arrow"]');
    const page4CreateBadge = container.querySelector('[data-testid="page4-create-badge"]');
    const page4WorkflowRect = page4WorkflowFrame?.querySelector("rect");
    const page4CreateBadgeCircle = page4CreateBadge?.querySelector("circle");
    const page4WorkflowBadgeCircle = page4WorkflowBadge?.querySelector("circle");

    expect(screen.getByText("Raw")).toBeInTheDocument();
    expect(screen.getByText("SPIR-V")).toBeInTheDocument();
    expect(screen.getAllByText("ShaderCode").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("Binary")).not.toBeInTheDocument();
    expect(screen.queryByText("Program")).not.toBeInTheDocument();
    expect(container.querySelector('[data-testid="page3-program-workflow-frame"]')).toBeNull();
    expect(container.querySelector('[data-testid="page3-getprogrambinary-badge"]')).toBeNull();
    expect(page4WorkflowFrame).not.toBeNull();
    expect(page4WorkflowFrame?.querySelector("rect")?.getAttribute("stroke")).toBe("#d06b44");
    expect(page4WorkflowBadge).not.toBeNull();
    expect(opacityOf(page4WorkflowBadge)).toBeGreaterThan(0.9);
    expect(page4WorkflowBadge?.textContent).toContain("3");
    expect(page4CreateArrow).not.toBeNull();
    expect(strokePalette(page4CreateArrow)).toBe("#ff0000");
    expect(page4CreateBadge).not.toBeNull();
    expect(opacityOf(page4CreateBadge)).toBeGreaterThan(0.9);
    expect(page4CreateBadge?.textContent).toContain("1");
    expect(page4CreateBadgeCircle?.getAttribute("stroke")).toBe("#ff0000");
    expect(Number(page4WorkflowBadgeCircle?.getAttribute("cx"))).toBeLessThanOrEqual(
      Number(page4WorkflowRect?.getAttribute("x")) + 36,
    );
    expect(Number(page4WorkflowBadgeCircle?.getAttribute("cy"))).toBeGreaterThanOrEqual(
      Number(page4WorkflowRect?.getAttribute("y")) +
        Number(page4WorkflowRect?.getAttribute("height")) -
        36,
    );
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("PSO")).toBeInTheDocument();
    expect(screen.getByText("Depth")).toBeInTheDocument();
    expect(screen.getByText("Blend")).toBeInTheDocument();
    expect(visibleOrangeBadges.length).toBeGreaterThanOrEqual(2);
  });

  it("renders page 05 as the UE asset cook bridge with mesh and material assets feeding runtime inputs", () => {
    setLegacyFrame(162);
    render(<MyComposition variantId="bus-clean" />);

    expect(screen.getByText("Mesh")).toBeInTheDocument();
    expect(screen.getByText("Material")).toBeInTheDocument();
    expect(screen.queryByText("VertexData")).not.toBeInTheDocument();
    expect(screen.getByText("Cooked")).toBeInTheDocument();
    expect(screen.getByText("Binary")).toBeInTheDocument();
    expect(screen.getAllByText("ShaderCode").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("GPU")).toBeInTheDocument();
    expect(screen.queryByText("PSO")).not.toBeInTheDocument();
    expect(screen.queryByText("Description")).not.toBeInTheDocument();
  });

  it("routes page 05 shader artifacts as Cooked -> Binary -> GPU", () => {
    setLegacyFrame(162);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const cookedGroup = findBoxGroupByLabel(container, "Cooked");
    const binaryGroup = findBoxGroupByLabel(container, "Binary");
    const gpuText = findTextNodes(container, "GPU")[0];
    const cookedRect = cookedGroup?.querySelector("rect");
    const binaryRect = binaryGroup?.querySelector("rect");
    const cookedToBinaryArrow = container.querySelector(
      '[data-testid="page5-cooked-to-binary-arrow"]',
    );
    const binaryToGpuArrow = container.querySelector(
      '[data-testid="page5-binary-to-gpu-arrow"]',
    );

    expect(binaryGroup).toBeTruthy();
    expect(Math.abs(rectCenterX(binaryRect) - rectCenterX(cookedRect))).toBeLessThanOrEqual(2);
    expect(Number(binaryRect?.getAttribute("y"))).toBeGreaterThan(
      Number(cookedRect?.getAttribute("y")) + Number(cookedRect?.getAttribute("height")),
    );
    expect(Number(binaryRect?.getAttribute("y")) + Number(binaryRect?.getAttribute("height"))).toBeLessThan(
      Number(gpuText?.getAttribute("y")),
    );
    expect(cookedToBinaryArrow).not.toBeNull();
    expect(binaryToGpuArrow).not.toBeNull();
  });

  it("uses asset green for cook relations and API orange for the Binary -> GPU call on page 05", () => {
    setLegacyFrame(162);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const materialToCookedArrow = container.querySelector(
      '[data-testid="shared-upper-horizontal-arrow"]',
    );
    const cookedToBinaryArrow = container.querySelector(
      '[data-testid="shared-upper-vertical-arrow"]',
    );
    const binaryToGpuArrow = container.querySelector(
      '[data-testid="page5-binary-to-gpu-arrow"]',
    );

    expect(strokePalette(materialToCookedArrow)).toBe("rgba(104, 140, 114, 0.86)");
    expect(strokePalette(cookedToBinaryArrow)).toBe("rgba(104, 140, 114, 0.86)");
    expect(strokePalette(binaryToGpuArrow)).toBe("#d06b44");
  });

  it("adds a visible question hook on the page 05 Material -> Cooked relation", () => {
    setLegacyFrame(162);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const questionBadge = container.querySelector('[data-testid="page5-question-badge"]');

    expect(questionBadge).not.toBeNull();
    expect(opacityOf(questionBadge)).toBeGreaterThan(0.9);
    expect(questionBadge?.textContent).toContain("?");
  });

  it("renders page 06 as the v4 ownership layout with one left dashed relation and one short right dashed relation", () => {
    setLegacyFrame(234);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const stageGroup = container.querySelector('[data-testid="page6-stage-group"]');
    const materialGroup = findVisibleUmaterialGroup(container);
    const resourceGroup = findVisibleBoxGroupByLabel(container, "FMaterialResource");
    const shaderMapGroup = findVisibleBoxGroupByLabel(container, "FMaterialShaderMap");
    const cookedRect = container
      .querySelector('[data-testid="page6-cooked-code-box"]')
      ?.querySelector("rect");
    const materialRect = materialGroup?.querySelector("rect");
    const resourceRect = resourceGroup?.querySelector("rect");
    const shaderMapRect = shaderMapGroup?.querySelector("rect");
    const materialToResourceArrow = container.querySelector(
      '[data-testid="page6-material-to-resource-arrow"]',
    );
    const resourceToMapArrow = container.querySelector(
      '[data-testid="page6-resource-to-shadermap-arrow"]',
    );
    const shaderMapToCookedArrow = container.querySelector(
      '[data-testid="page6-shadermap-to-cooked-arrow"]',
    );
    const platformAttachmentLink = container.querySelector(
      '[data-testid="page6-platform-attachment-link"]',
    );
    const resourceAttachmentLink = container.querySelector(
      '[data-testid="page6-resource-attachment-link"]',
    );
    const platformResourceSpine = container.querySelector(
      '[data-testid="page6-platform-resource-spine"]',
    );
    const shaderSelectorLink = container.querySelector(
      '[data-testid="page6-shader-selector-attachment-link"]',
    );
    const platformResourceCross = container.querySelector(
      '[data-testid="page6-platform-resource-cross"]',
    );
    const uassetFrame = container.querySelector('[data-testid="page6-uasset-frame"]');
    const platformTableRect = container
      .querySelector('[data-testid="page6-platform-table"]')
      ?.querySelector("rect");
    const resourceTableRect = container
      .querySelector('[data-testid="page6-resource-selector-table"]')
      ?.querySelector("rect");
    const shaderTableRect = container
      .querySelector('[data-testid="page6-shadermap-selector-table"]')
      ?.querySelector("rect");
    const uassetLeft = Number(uassetFrame?.getAttribute("x"));
    const uassetTop = Number(uassetFrame?.getAttribute("y"));
    const uassetRight = uassetLeft + Number(uassetFrame?.getAttribute("width"));
    const materialLeft = Number(materialRect?.getAttribute("x"));
    const materialTop = Number(materialRect?.getAttribute("y"));
    const materialRight = materialLeft + Number(materialRect?.getAttribute("width"));
    const resourceTop = Number(resourceRect?.getAttribute("y"));
    const shaderMapLeft = Number(shaderMapRect?.getAttribute("x"));
    const shaderMapTop = Number(shaderMapRect?.getAttribute("y"));
    const platformRight = Number(platformTableRect?.getAttribute("x")) +
      Number(platformTableRect?.getAttribute("width"));
    const resourceTableRight = Number(resourceTableRect?.getAttribute("x")) +
      Number(resourceTableRect?.getAttribute("width"));
    const shaderTableMetrics = rectMetrics(shaderTableRect);
    const cookedMetrics = rectMetrics(cookedRect);
    const materialToResourcePoints = parseSimplePathPoints(materialToResourceArrow);
    const shaderMapToCookedPoints = parseSimplePathPoints(shaderMapToCookedArrow);
    const platformResourceSpinePoints = parseSimplePathPoints(platformResourceSpine);
    const crossMarkerPoints = parsePathPoints(platformResourceCross?.querySelector("path"));
    const shaderSelectorLinkPoints = parseSimplePathPoints(shaderSelectorLink);
    const stageScale = parseScale(stageGroup?.getAttribute("transform"));
    const stageAnchor = parseTrailingTranslate(stageGroup?.getAttribute("transform"));

    expect(stageGroup).not.toBeNull();
    expect(opacityOf(stageGroup)).toBeGreaterThan(0.96);
    expect((stageScale ?? 0)).toBeGreaterThan(1.04);
    expect((stageScale ?? 0)).toBeLessThanOrEqual(1.06);
    expect(stageAnchor).not.toBeNull();
    expect((stageAnchor?.x ?? 0)).toBeGreaterThanOrEqual(-700);
    expect((stageAnchor?.x ?? 0)).toBeLessThanOrEqual(-560);
    expect(Math.abs((stageAnchor?.y ?? 0) + 306)).toBeLessThanOrEqual(8);
    expect(screen.getAllByText("UMaterial").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("FMaterialResource").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("FMaterialShaderMap")).toBeInTheDocument();
    expect(screen.getAllByText("Cooked").length).toBeGreaterThanOrEqual(1);
    expect(
      findTextNodes(container, "FShader").some((node) => effectiveOpacity(node) > 0.16),
    ).toBe(false);
    expect(
      findTextNodes(container, "ResourceIndex = i").some(
        (node) => effectiveOpacity(node) > 0.16,
      ),
    ).toBe(false);
    expect(
      findTextNodes(container, "FShaderMapResourceCode").some(
        (node) => effectiveOpacity(node) > 0.16,
      ),
    ).toBe(false);
    expect(screen.queryByText("ShaderEntries[i]")).not.toBeInTheDocument();
    expect(screen.queryByText("ShaderHashes[i]")).not.toBeInTheDocument();
    expect(container.querySelector('[data-testid="page6-fshader-to-inline-arrow"]')).toBeNull();
    expect(container.querySelector('[data-testid="page6-entries-to-cooked-arrow"]')).toBeNull();
    expect(screen.getByText("ShaderPlatform")).toBeInTheDocument();
    expect(screen.getByText("uasset")).toBeInTheDocument();
    expect(screen.getByText("FeatureLevel")).toBeInTheDocument();
    expect(screen.getByText("QualityLevel")).toBeInTheDocument();
    expect(screen.getByText("ShaderType")).toBeInTheDocument();
    expect(screen.getByText("VertexFactory")).toBeInTheDocument();
    expect(screen.getByText("Permutation")).toBeInTheDocument();
    expect(screen.getByText("OpenGL ES")).toBeInTheDocument();
    expect(screen.getByText("Vulkan")).toBeInTheDocument();
    expect(screen.getByText("Metal")).toBeInTheDocument();
    expect(platformAttachmentLink).toBeNull();
    expect(resourceAttachmentLink).toBeNull();
    expect(platformResourceSpine).not.toBeNull();
    expect(shaderSelectorLink).not.toBeNull();
    expect(platformResourceCross).not.toBeNull();
    expect(container.querySelector('[data-testid="page6-platform-table"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="page6-resource-selector-table"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="page6-shadermap-selector-table"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="page6-cooked-code-box"]')).not.toBeNull();
    expect(uassetFrame?.getAttribute("fill")).toBe("rgba(231, 242, 233, 0.98)");
    expect(uassetFrame?.getAttribute("stroke")).toBe("rgba(104, 140, 114, 0.86)");
    expect(materialGroup).not.toBeNull();
    expect(resourceGroup).not.toBeNull();
    expect(shaderMapGroup).not.toBeNull();
    expect(materialLeft).toBeGreaterThanOrEqual(uassetLeft + 20);
    expect(materialTop).toBeGreaterThanOrEqual(uassetTop);
    expect(materialRight).toBeLessThanOrEqual(uassetRight);
    expect(Math.abs(rectCenterX(materialRect) - rectCenterX(resourceRect))).toBeLessThanOrEqual(2);
    expect(Math.abs(rectCenterX(resourceRect) - rectCenterX(shaderMapRect))).toBeLessThanOrEqual(2);
    expect(resourceTop).toBeGreaterThan(materialTop + 60);
    expect(shaderMapTop).toBeGreaterThan(resourceTop + 60);
    expect(strokePalette(platformResourceSpine)).toContain("#22303d");
    expect(dashSignature(platformResourceSpine)).toContain("10 8");
    expect(strokePalette(shaderSelectorLink)).toContain("rgba(76, 90, 102, 0.72)");
    expect(dashSignature(shaderSelectorLink)).toContain("10 8");
    expect(platformRight).toBeLessThan(materialLeft - 16);
    expect(resourceTableRight).toBeLessThan(materialLeft - 16);
    expect(platformResourceSpinePoints?.y1).toBe(platformResourceSpinePoints?.y2);
    expect(Math.abs((platformResourceSpinePoints?.x1 ?? 0) - rectCenterX(materialRect))).toBeLessThanOrEqual(2);
    expect(Math.abs((platformResourceSpinePoints?.y1 ?? 0) - (((materialToResourcePoints?.y1 ?? 0) + (materialToResourcePoints?.y2 ?? 0)) / 2))).toBeLessThanOrEqual(2);
    expect(platformResourceSpinePoints?.x2).toBeGreaterThan(rectCenterX(platformTableRect));
    expect(platformResourceSpinePoints?.x2).toBeLessThan(platformRight - 16);
    expect(platformResourceSpinePoints?.x2).toBeGreaterThan(
      Math.max(crossMarkerPoints?.x1 ?? 0, crossMarkerPoints?.x2 ?? 0) + 4,
    );
    expect(
      Math.abs(
        (platformResourceSpinePoints?.y2 ?? 0) -
          (platformResourceCross?.querySelector("path")
            ? (parsePathPoints(platformResourceCross?.querySelector("path"))?.y1 ?? 0)
            : 0),
      ),
    ).toBeLessThanOrEqual(10);
    expect(shaderTableMetrics.bottom).toBeLessThan((shaderMapToCookedPoints?.y1 ?? 0) - 10);
    expect(shaderTableMetrics.x).toBeGreaterThan(shaderMapLeft + 80);
    expect(shaderTableMetrics.right).toBeLessThan(cookedMetrics.right + 10);
    expect(Math.abs((shaderSelectorLinkPoints?.x1 ?? 0) - (((shaderMapToCookedPoints?.x1 ?? 0) + (shaderMapToCookedPoints?.x2 ?? 0)) / 2))).toBeLessThanOrEqual(2);
    expect(Math.abs((shaderSelectorLinkPoints?.x2 ?? 0) - ((shaderSelectorLinkPoints?.x1 ?? 0)))).toBeLessThanOrEqual(2);
    expect(Math.abs((shaderSelectorLinkPoints?.y1 ?? 0) - (shaderMapToCookedPoints?.y1 ?? 0))).toBeLessThanOrEqual(2);
    expect(Math.abs((shaderSelectorLinkPoints?.y2 ?? 0) - shaderTableMetrics.bottom)).toBeLessThanOrEqual(2);
    expect(parseSimplePathLength(materialToResourceArrow)).toBeGreaterThanOrEqual(20);
    expect(parseSimplePathLength(resourceToMapArrow)).toBeGreaterThanOrEqual(20);
    expect(parseSimplePathLength(shaderMapToCookedArrow)).toBeGreaterThanOrEqual(20);
    expect(screen.queryByText("PSO Cache")).not.toBeInTheDocument();
  });

  it("treats page 06 as an ownership slide before InlineCode storage is expanded", () => {
    setLegacyFrame(234);
    const {container} = render(<MyComposition variantId="bus-clean" />);

    expect(container.querySelector('[data-testid="page6-platform-table"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="page6-resource-selector-table"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="page6-shadermap-selector-table"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="page6-cooked-code-box"]')).not.toBeNull();
    expect(findTextNodes(container, "UMaterial").length).toBeGreaterThan(0);
    expect(findTextNodes(container, "FMaterialResource").length).toBeGreaterThan(0);
    expect(findTextNodes(container, "FMaterialShaderMap").length).toBeGreaterThan(0);
    expect(screen.queryByText("ShaderEntries[i]")).not.toBeInTheDocument();
    expect(screen.queryByText("ShaderHashes[i]")).not.toBeInTheDocument();
    expect(
      findTextNodes(container, "Cooked").some((node) => effectiveOpacity(node) > 0.16),
    ).toBe(true);
  });

  it("uses page 06 as a clean ownership page with one left relation mark and the shader selector floating above the shaderMap -> cooked span", () => {
    setLegacyFrame(234);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const platformTableRect = container
      .querySelector('[data-testid="page6-platform-table"]')
      ?.querySelector("rect");
    const resourceTableRect = container
      .querySelector('[data-testid="page6-resource-selector-table"]')
      ?.querySelector("rect");
    const shaderTableRect = container
      .querySelector('[data-testid="page6-shadermap-selector-table"]')
      ?.querySelector("rect");
    const materialRect = findVisibleUmaterialGroup(container)?.querySelector("rect");
    const shaderMapRect = findVisibleBoxGroupByLabel(container, "FMaterialShaderMap")?.querySelector("rect");
    const cookedRect = container
      .querySelector('[data-testid="page6-cooked-code-box"]')
      ?.querySelector("rect");
    const shaderMapToCookedArrow = container.querySelector(
      '[data-testid="page6-shadermap-to-cooked-arrow"]',
    );
    const shaderMapToCookedPoints = parseSimplePathPoints(shaderMapToCookedArrow);

    expect(Number(platformTableRect?.getAttribute("width"))).toBeGreaterThanOrEqual(320);
    expect(Number(resourceTableRect?.getAttribute("width"))).toBeGreaterThanOrEqual(320);
    expect(Number(shaderTableRect?.getAttribute("width"))).toBeGreaterThanOrEqual(352);
    expect(Number(materialRect?.getAttribute("width"))).toBeGreaterThanOrEqual(216);
    expect(Number(shaderMapRect?.getAttribute("width"))).toBeGreaterThanOrEqual(248);
    expect(Number(cookedRect?.getAttribute("width"))).toBeGreaterThanOrEqual(206);
    expect(Number(cookedRect?.getAttribute("x"))).toBeGreaterThanOrEqual(992);
    expect(container.querySelector('[data-testid="page6-inline-resource-box"]')).toBeNull();
    expect(container.querySelector('[data-testid="page6-resource-code-box"]')).toBeNull();
    expect(container.querySelector('[data-testid="page6-cooked-code-box"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="page6-fshader-card"]')).toBeNull();
    expect(Math.abs(rectCenterX(platformTableRect) - rectCenterX(resourceTableRect))).toBeLessThanOrEqual(2);
    expect(rectMetrics(shaderTableRect).bottom).toBeLessThan((shaderMapToCookedPoints?.y1 ?? 0) - 10);
    expect(rectCenterX(shaderTableRect)).toBeGreaterThan(rectCenterX(shaderMapRect) + 40);
    expect(rectCenterX(shaderTableRect)).toBeLessThan(rectCenterX(cookedRect) + 10);
  });

  it("keeps page 06 FL/QL labels visually centered inside a widened selector table", () => {
    setLegacyFrame(234);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const resourceTableRect = container
      .querySelector('[data-testid="page6-resource-selector-table"]')
      ?.querySelector("rect");
    const featureHeader = findTextNodes(container, "FeatureLevel")[0];
    const qualityHeader = findTextNodes(container, "QualityLevel")[0];
    const featureValue = findTextNodes(container, "ES3_1")[0];
    const qualityValue = findTextNodes(container, "Low")[0];
    const tableCenterX = rectCenterX(resourceTableRect);
    const headerCenterX = (textX(featureHeader) + textX(qualityHeader)) / 2;
    const valueCenterX = (textX(featureValue) + textX(qualityValue)) / 2;

    expect(Math.abs(headerCenterX - tableCenterX)).toBeLessThanOrEqual(4);
    expect(Math.abs(valueCenterX - tableCenterX)).toBeLessThanOrEqual(4);
    expect(textX(featureHeader)).toBeLessThan(tableCenterX);
    expect(textX(qualityHeader)).toBeGreaterThan(tableCenterX);
  });

  it("keeps page 06 platform header and each API name centered in its own table cell", () => {
    setLegacyFrame(234);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const platformTable = container.querySelector('[data-testid="page6-platform-table"]');
    const platformTableRect = platformTable?.querySelector("rect");
    const platformHeader = findTextNodes(container, "ShaderPlatform")[0];
    const openGl = findTextNodes(container, "OpenGL ES")[0];
    const vulkan = findTextNodes(container, "Vulkan")[0];
    const metal = findTextNodes(container, "Metal")[0];
    const dividerY = horizontalDividerY(platformTable, "table-divider");
    const firstRowDividerY = horizontalDividerY(platformTable, "note-row-divider", 0);
    const secondRowDividerY = horizontalDividerY(platformTable, "note-row-divider", 1);
    const metrics = rectMetrics(platformTableRect);
    const upperCellCenterY = (metrics.y + dividerY) / 2;

    expect(Math.abs(textY(platformHeader) - upperCellCenterY)).toBeLessThanOrEqual(2);
    expect(Math.abs(textY(openGl) - (dividerY + firstRowDividerY) / 2)).toBeLessThanOrEqual(2);
    expect(Math.abs(textY(vulkan) - (firstRowDividerY + secondRowDividerY) / 2)).toBeLessThanOrEqual(2);
    expect(Math.abs(textY(metal) - (secondRowDividerY + metrics.bottom) / 2)).toBeLessThanOrEqual(2);
  });

  it("keeps page 06 FL and QL headers centered in their header cells", () => {
    setLegacyFrame(234);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const resourceTable = container.querySelector('[data-testid="page6-resource-selector-table"]');
    const resourceTableRect = resourceTable?.querySelector("rect");
    const featureHeader = findTextNodes(container, "FeatureLevel")[0];
    const qualityHeader = findTextNodes(container, "QualityLevel")[0];
    const dividerY = horizontalDividerY(resourceTable, "table-divider");
    const upperBandCenterY = (rectMetrics(resourceTableRect).y + dividerY) / 2;

    expect(Math.abs(textY(featureHeader) - upperBandCenterY)).toBeLessThanOrEqual(2);
    expect(Math.abs(textY(qualityHeader) - upperBandCenterY)).toBeLessThanOrEqual(2);
  });

  it("keeps page 06 shader selector headers centered in their header cells", () => {
    setLegacyFrame(234);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const shaderTable = container.querySelector('[data-testid="page6-shadermap-selector-table"]');
    const shaderTableRect = shaderTable?.querySelector("rect");
    const shaderTypeHeader = findTextNodes(container, "ShaderType")[0];
    const vertexFactoryHeader = findTextNodes(container, "VertexFactory")[0];
    const permutationHeader = findTextNodes(container, "Permutation")[0];
    const dividerY = horizontalDividerY(shaderTable, "table-divider");
    const upperBandCenterY = (rectMetrics(shaderTableRect).y + dividerY) / 2;

    expect(Math.abs(textY(shaderTypeHeader) - upperBandCenterY)).toBeLessThanOrEqual(2);
    expect(Math.abs(textY(vertexFactoryHeader) - upperBandCenterY)).toBeLessThanOrEqual(2);
    expect(Math.abs(textY(permutationHeader) - upperBandCenterY)).toBeLessThanOrEqual(2);
  });

  it("keeps page 06 shader selector values centered in each lower cell row", () => {
    setLegacyFrame(234);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const shaderTable = container.querySelector('[data-testid="page6-shadermap-selector-table"]');
    const shaderTableRect = shaderTable?.querySelector("rect");
    const shaderTypeTop = findTextNodes(container, "BasePassPS")[0];
    const shaderTypeBottom = findTextNodes(container, "DepthVS")[0];
    const vertexFactoryTop = findTextNodes(container, "LocalVF")[0];
    const vertexFactoryBottom = findTextNodes(container, "SkinVF")[0];
    const permutationTop = findTextNodes(container, "Fog=On")[0];
    const permutationBottom = findTextNodes(container, "Lightmap=Off")[0];
    const dividerY = horizontalDividerY(shaderTable, "table-divider");
    const rowDividerY = horizontalDividerY(shaderTable, "note-row-divider");
    const bottomY = rectMetrics(shaderTableRect).bottom;

    expect(Math.abs(textY(shaderTypeTop) - (dividerY + rowDividerY) / 2)).toBeLessThanOrEqual(2);
    expect(Math.abs(textY(shaderTypeBottom) - (rowDividerY + bottomY) / 2)).toBeLessThanOrEqual(2);
    expect(Math.abs(textY(vertexFactoryTop) - (dividerY + rowDividerY) / 2)).toBeLessThanOrEqual(2);
    expect(Math.abs(textY(vertexFactoryBottom) - (rowDividerY + bottomY) / 2)).toBeLessThanOrEqual(2);
    expect(Math.abs(textY(permutationTop) - (dividerY + rowDividerY) / 2)).toBeLessThanOrEqual(2);
    expect(Math.abs(textY(permutationBottom) - (rowDividerY + bottomY) / 2)).toBeLessThanOrEqual(2);
  });

  it("keeps page 06 FL and QL values centered in their own lower cells", () => {
    setLegacyFrame(234);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const resourceTable = container.querySelector('[data-testid="page6-resource-selector-table"]');
    const resourceTableRect = resourceTable?.querySelector("rect");
    const featureTop = findTextNodes(container, "ES3_1")[0];
    const featureBottom = findTextNodes(container, "SM5")[0];
    const qualityTop = findTextNodes(container, "Low")[0];
    const qualityBottom = findTextNodes(container, "High")[0];
    const dividerY = horizontalDividerY(resourceTable, "table-divider");
    const rowDividerY = horizontalDividerY(resourceTable, "note-row-divider");
    const bottomY = rectMetrics(resourceTableRect).bottom;

    expect(Math.abs(textY(featureTop) - (dividerY + rowDividerY) / 2)).toBeLessThanOrEqual(2);
    expect(Math.abs(textY(featureBottom) - (rowDividerY + bottomY) / 2)).toBeLessThanOrEqual(2);
    expect(Math.abs(textY(qualityTop) - (dividerY + rowDividerY) / 2)).toBeLessThanOrEqual(2);
    expect(Math.abs(textY(qualityBottom) - (rowDividerY + bottomY) / 2)).toBeLessThanOrEqual(2);
  });

  it("gives page 06 more vertical breathing room on the left and balances the two main-axis arrow gaps", () => {
    setLegacyFrame(234);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const platformTableRect = container
      .querySelector('[data-testid="page6-platform-table"]')
      ?.querySelector("rect");
    const resourceTableRect = container
      .querySelector('[data-testid="page6-resource-selector-table"]')
      ?.querySelector("rect");
    const materialRect = findVisibleUmaterialGroup(container)?.querySelector("rect");
    const resourceRect = findVisibleBoxGroupByLabel(container, "FMaterialResource")?.querySelector("rect");
    const shaderMapRect = findVisibleBoxGroupByLabel(container, "FMaterialShaderMap")?.querySelector("rect");
    const crossGroup = container.querySelector('[data-testid="page6-platform-resource-cross"]');
    const crossPaths = crossGroup?.querySelectorAll("path") ?? [];
    const crossPath = crossPaths[0];
    const crossPoints = parseSimplePathPoints(crossPath?.parentElement?.matches("g") ? crossGroup : crossPath);
    const upperGap =
      Number(resourceRect?.getAttribute("y")) -
      (Number(materialRect?.getAttribute("y")) + Number(materialRect?.getAttribute("height")));
    const lowerGap =
      Number(shaderMapRect?.getAttribute("y")) -
      (Number(resourceRect?.getAttribute("y")) + Number(resourceRect?.getAttribute("height")));
    const leftTableGap =
      Number(resourceTableRect?.getAttribute("y")) -
      (Number(platformTableRect?.getAttribute("y")) + Number(platformTableRect?.getAttribute("height")));

    expect(leftTableGap).toBeGreaterThanOrEqual(44);
    expect(Math.abs(upperGap - lowerGap)).toBeLessThanOrEqual(18);
    expect((crossPoints?.y1 ?? 0)).toBeGreaterThan(
      Number(platformTableRect?.getAttribute("y")) + Number(platformTableRect?.getAttribute("height")) + 6,
    );
    expect((crossPoints?.y1 ?? 0)).toBeLessThan(
      Number(resourceTableRect?.getAttribute("y")) - 6,
    );
  });

  it("keeps page 06 shader selector board to the right of FMaterialResource and makes it taller for classroom readability", () => {
    setLegacyFrame(234);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const shaderTableRect = container
      .querySelector('[data-testid="page6-shadermap-selector-table"]')
      ?.querySelector("rect");
    const resourceRect = findVisibleBoxGroupByLabel(container, "FMaterialResource")?.querySelector("rect");

    expect(rectMetrics(shaderTableRect).x).toBeGreaterThanOrEqual(rectMetrics(resourceRect).right + 20);
    expect(Number(shaderTableRect?.getAttribute("height"))).toBeGreaterThanOrEqual(132);
  });

  it("restores page 06 material prominence and enlarges both selector columns before InlineCode expansion", () => {
    setLegacyFrame(234);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const uassetRect = container.querySelector('[data-testid="page6-uasset-frame"]');
    const materialRect = findVisibleUmaterialGroup(container)?.querySelector("rect");
    const resourceRect = findVisibleBoxGroupByLabel(container, "FMaterialResource")?.querySelector("rect");
    const shaderMapRect = findVisibleBoxGroupByLabel(container, "FMaterialShaderMap")?.querySelector("rect");
    const platformTableRect = container
      .querySelector('[data-testid="page6-platform-table"]')
      ?.querySelector("rect");
    const resourceTableRect = container
      .querySelector('[data-testid="page6-resource-selector-table"]')
      ?.querySelector("rect");
    const shaderTableRect = container
      .querySelector('[data-testid="page6-shadermap-selector-table"]')
      ?.querySelector("rect");
    const topMargin =
      Number(materialRect?.getAttribute("y")) - Number(uassetRect?.getAttribute("y"));
    const bottomMargin =
      Number(uassetRect?.getAttribute("y")) +
      Number(uassetRect?.getAttribute("height")) -
      (Number(shaderMapRect?.getAttribute("y")) + Number(shaderMapRect?.getAttribute("height")));

    expect(Number(materialRect?.getAttribute("height"))).toBeGreaterThanOrEqual(92);
    expect(Number(uassetRect?.getAttribute("height"))).toBeGreaterThanOrEqual(536);
    expect(Number(platformTableRect?.getAttribute("height"))).toBeGreaterThanOrEqual(136);
    expect(Number(resourceTableRect?.getAttribute("height"))).toBeGreaterThanOrEqual(144);
    expect(Number(shaderTableRect?.getAttribute("height"))).toBeGreaterThanOrEqual(204);
    expect(Number(materialRect?.getAttribute("y"))).toBeLessThanOrEqual(116);
    expect(Number(shaderTableRect?.getAttribute("y"))).toBeLessThanOrEqual(196);
    expect(Math.abs(Number(materialRect?.getAttribute("width")) - Number(resourceRect?.getAttribute("width")))).toBeLessThanOrEqual(4);
    expect(Math.abs(Number(resourceRect?.getAttribute("width")) - Number(shaderMapRect?.getAttribute("width")))).toBeLessThanOrEqual(4);
    expect(Math.abs(Number(materialRect?.getAttribute("height")) - Number(resourceRect?.getAttribute("height")))).toBeLessThanOrEqual(4);
    expect(Math.abs(Number(resourceRect?.getAttribute("height")) - Number(shaderMapRect?.getAttribute("height")))).toBeLessThanOrEqual(4);
    expect(Math.abs(topMargin - bottomMargin)).toBeLessThanOrEqual(18);
  });

  it("aligns the left dashed relation to the ownership spine center and enlarges table typography for PPT reading", () => {
    setLegacyFrame(234);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const platformResourceSpine = container.querySelector(
      '[data-testid="page6-platform-resource-spine"]',
    );
    const materialRect = findVisibleUmaterialGroup(container)?.querySelector("rect");
    const shaderPlatform = findTextNodes(container, "ShaderPlatform")[0];
    const featureLevel = findTextNodes(container, "FeatureLevel")[0];
    const basePass = findTextNodes(container, "BasePassPS")[0];
    const material = findTextNodes(container, "UMaterial")[0];
    const resource = findTextNodes(container, "FMaterialResource")[0];
    const shaderMap = findTextNodes(container, "FMaterialShaderMap")[0];
    const spinePoints = parseSimplePathPoints(platformResourceSpine);

    expect(Math.abs((spinePoints?.x1 ?? 0) - rectCenterX(materialRect))).toBeLessThanOrEqual(2);
    expect(fontSizeOf(shaderPlatform)).toBeGreaterThanOrEqual(18.5);
    expect(fontSizeOf(featureLevel)).toBeGreaterThanOrEqual(18);
    expect(fontSizeOf(basePass)).toBeGreaterThanOrEqual(19);
    expect(fontSizeOf(material)).toBeGreaterThanOrEqual(21);
    expect(Math.abs(fontSizeOf(material) - fontSizeOf(resource))).toBeLessThanOrEqual(0.5);
    expect(Math.abs(fontSizeOf(resource) - fontSizeOf(shaderMap))).toBeLessThanOrEqual(0.5);
  });

  it("keeps the page 06 uasset frame and both ownership columns centered on one slide axis", () => {
    setLegacyFrame(234);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const uassetRect = container.querySelector('[data-testid="page6-uasset-frame"]');
    const platformTableRect = container
      .querySelector('[data-testid="page6-platform-table"]')
      ?.querySelector("rect");
    const resourceTableRect = container
      .querySelector('[data-testid="page6-resource-selector-table"]')
      ?.querySelector("rect");
    const shaderTableRect = container
      .querySelector('[data-testid="page6-shadermap-selector-table"]')
      ?.querySelector("rect");
    const materialRect = findVisibleUmaterialGroup(container)?.querySelector("rect");
    const resourceRect = findVisibleBoxGroupByLabel(container, "FMaterialResource")?.querySelector("rect");
    const shaderMapRect = findVisibleBoxGroupByLabel(container, "FMaterialShaderMap")?.querySelector("rect");
    const cookedRect = container
      .querySelector('[data-testid="page6-cooked-code-box"]')
      ?.querySelector("rect");

    const uassetMetrics = rectMetrics(uassetRect);
    const leftColumnLeft = Math.min(
      rectMetrics(platformTableRect).x,
      rectMetrics(resourceTableRect).x,
    );
    const rightColumnRight = Math.max(
      rectMetrics(materialRect).right,
      rectMetrics(resourceRect).right,
      rectMetrics(shaderMapRect).right,
      rectMetrics(shaderTableRect).right,
      rectMetrics(cookedRect).right,
    );
    const compositionCenterX = (leftColumnLeft + rightColumnRight) / 2;
    const leftBreathingRoom = leftColumnLeft - uassetMetrics.x;
    const rightBreathingRoom = uassetMetrics.right - rightColumnRight;

    expect(Math.abs(rectCenterX(uassetRect) - 640)).toBeLessThanOrEqual(2);
    expect(Math.abs(compositionCenterX - rectCenterX(uassetRect))).toBeLessThanOrEqual(12);
    expect(Math.abs(leftBreathingRoom - rightBreathingRoom)).toBeLessThanOrEqual(20);
  });

  it("treats page 07 as the runtime InlineCode lookup slide before UE PSO appears", () => {
    setLegacyFrame(306);
    const {container} = render(<MyComposition variantId="bus-clean" />);

    expect(container.querySelector('[data-testid="page6-platform-table"]')).toBeNull();
    expect(container.querySelector('[data-testid="page6-resource-selector-table"]')).toBeNull();
    expect(container.querySelector('[data-testid="page6-shadermap-selector-table"]')).toBeNull();
    expect(container.querySelector('[data-testid="page6-cooked-code-box"]')).not.toBeNull();
    expect(screen.getByText("FShader")).toBeInTheDocument();
    expect(screen.getByText("ResourceIndex")).toBeInTheDocument();
    expect(screen.getByText("idx")).toBeInTheDocument();
    expect(screen.getByText("ShaderEntries[idx]")).toBeInTheDocument();
    expect(screen.getByText("ShaderHashes[idx]")).toBeInTheDocument();
    expect(screen.getAllByText("ShaderCode").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("UE PSO")).not.toBeInTheDocument();
  });

  it("compresses the page 07 left spine and reallocates the stage toward a larger ResourceCode payload", () => {
    setLegacyFrame(234);
    const {container: page6Container, unmount} = render(
      <MyComposition variantId="bus-clean" />,
    );
    const page6MaterialRect = findVisibleUmaterialGroup(page6Container)?.querySelector("rect");
    const page6ShaderMapRect = findVisibleBoxGroupByLabel(page6Container, "FMaterialShaderMap")?.querySelector("rect");

    unmount();
    setLegacyFrame(270);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const page7MaterialRect = findVisibleUmaterialGroup(container)?.querySelector("rect");
    const page7ShaderMapRect = findVisibleBoxGroupByLabel(container, "FMaterialShaderMap")?.querySelector("rect");
    const page7CookedRect = container
      .querySelector('[data-testid="page6-cooked-code-box"]')
      ?.querySelector("rect");
    const inlineResourceRect = container
      .querySelector('[data-testid="page6-inline-resource-box"]')
      ?.querySelector("rect");
    const resourceCodeRect = container
      .querySelector('[data-testid="page6-resource-code-box"]')
      ?.querySelector("rect");

    expect(
      Number(page7MaterialRect?.getAttribute("x")),
    ).toBeLessThan(Number(page6MaterialRect?.getAttribute("x")) - 80);
    expect(
      Number(page7ShaderMapRect?.getAttribute("x")),
    ).toBeLessThan(Number(page6ShaderMapRect?.getAttribute("x")) - 80);
    expect(Number(inlineResourceRect?.getAttribute("x"))).toBeGreaterThan(
      Number(page7ShaderMapRect?.getAttribute("x")) +
        Number(page7ShaderMapRect?.getAttribute("width")) +
        36,
    );
    expect(
      Number(page7CookedRect?.getAttribute("x")),
    ).toBeGreaterThan(
      Number(inlineResourceRect?.getAttribute("x")) +
        Number(inlineResourceRect?.getAttribute("width")) +
        24,
    );
    expect(Number(resourceCodeRect?.getAttribute("width"))).toBeGreaterThanOrEqual(360);
    expect(Number(resourceCodeRect?.getAttribute("height"))).toBeGreaterThanOrEqual(170);
  });

  it("models page 07 InlineCode access as ShaderMap ownership plus direct FShader lookup by idx", () => {
    setLegacyFrame(270);
    const {container} = render(<MyComposition variantId="bus-clean" />);

    expect(screen.getByText("FMaterialShaderMap")).toBeInTheDocument();
    expect(screen.queryByText("FShaderMap")).not.toBeInTheDocument();
    expect(container.querySelector('[data-testid="page6-platform-table"]')).toBeNull();
    expect(container.querySelector('[data-testid="page6-resource-selector-table"]')).toBeNull();
    expect(container.querySelector('[data-testid="page6-shadermap-selector-table"]')).toBeNull();
    expect(container.querySelectorAll('[data-testid="page6-fshader-card"]').length).toBe(1);
    expect(container.querySelector('[data-testid="page6-resource-index-box"]')).toBeNull();
    expect(
      container.querySelector('[data-testid="page6-shadermap-to-fshader-arrow"]'),
    ).toBeNull();
    expect(
      container.querySelector('[data-testid="page6-shadermap-to-inline-arrow"]'),
    ).not.toBeNull();
    expect(
      container.querySelector('[data-testid="page6-fshader-to-inline-arrow"]'),
    ).not.toBeNull();
    expect(
      container.querySelector('[data-testid="page6-entries-to-cooked-arrow"]'),
    ).not.toBeNull();
    expect(screen.getByText("ResourceIndex")).toBeInTheDocument();
    expect(screen.getByText("ShaderEntries[idx]")).toBeInTheDocument();
    expect(screen.getByText("ShaderHashes[idx]")).toBeInTheDocument();
  });

  it("starts page 07 InlineCode reveal with the lookup line before the receiver plane appears", () => {
    setLegacyFrame(246);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const earlyLookupArrow = container.querySelector(
      '[data-testid="page6-fshader-to-inline-arrow"]',
    );
    const earlyInlineBox = container.querySelector(
      '[data-testid="page6-inline-resource-box"]',
    );
    const earlyResourceCodeBox = container.querySelector(
      '[data-testid="page6-resource-code-box"]',
    );

    expect(earlyLookupArrow).not.toBeNull();
    expect(effectiveOpacity(earlyLookupArrow)).toBeGreaterThan(0.05);
    expect(Boolean(earlyInlineBox)).toBe(false);
    expect(Boolean(earlyResourceCodeBox)).toBe(false);
  });

  it("reveals the outer page 07 InlineCode receiver before the inner payload is inserted", () => {
    setLegacyFrame(248);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const midInlineBox = container.querySelector(
      '[data-testid="page6-inline-resource-box"]',
    );
    const midResourceCodeBox = container.querySelector(
      '[data-testid="page6-resource-code-box"]',
    );

    expect(midInlineBox).not.toBeNull();
    expect(effectiveOpacity(midInlineBox)).toBeGreaterThan(0.08);
    expect(Boolean(midResourceCodeBox)).toBe(false);
  });

  it("keeps the page 07 inner payload delayed until after the receiver plane has had time to settle", () => {
    setLegacyFrame(252);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const lateInlineBox = container.querySelector(
      '[data-testid="page6-inline-resource-box"]',
    );
    const lateResourceCodeBox = container.querySelector(
      '[data-testid="page6-resource-code-box"]',
    );

    expect(lateInlineBox).not.toBeNull();
    expect(effectiveOpacity(lateInlineBox)).toBeGreaterThan(0.12);
    expect(Boolean(lateResourceCodeBox)).toBe(false);
  });

  it("finishes the page 07 InlineCode reveal by inserting the inner payload rows after the receiver plane", () => {
    setLegacyFrame(258);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const lateResourceCodeBox = container.querySelector(
      '[data-testid="page6-resource-code-box"]',
    );
    const lateEntriesPill = container.querySelector('[data-testid="page6-entries-pill"]');
    const lateHashesPill = container.querySelector('[data-testid="page6-hashes-pill"]');

    expect(lateResourceCodeBox).not.toBeNull();
    expect(lateEntriesPill).not.toBeNull();
    expect(lateHashesPill).not.toBeNull();
    expect(effectiveOpacity(lateResourceCodeBox)).toBeGreaterThan(0.15);
  });

  it("adds horizontal row guides inside the page 06 selector tables", () => {
    setLegacyFrame(234);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const platformGuides = container.querySelectorAll(
      '[data-testid^="page6-platform-table-note-row-guide-"]',
    );
    const resourceGuides = container.querySelectorAll(
      '[data-testid^="page6-resource-selector-table-note-row-guide-"]',
    );
    const shaderGuides = container.querySelectorAll(
      '[data-testid^="page6-shadermap-selector-table-note-row-guide-"]',
    );

    expect(platformGuides.length).toBe(2);
    expect(resourceGuides.length).toBeGreaterThanOrEqual(2);
    expect(shaderGuides.length).toBeGreaterThanOrEqual(3);
  });

  it("adds tight two-layer shadow stacks behind page 06 resource and shaderMap cards", () => {
    setLegacyFrame(234);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const resourceCard = rectMetrics(
      container.querySelector('[data-testid="page6-resource-card"] rect'),
    );
    const shaderCard = rectMetrics(
      container.querySelector('[data-testid="page6-shadermap-card"] rect'),
    );
    const resourceShadows = Array.from(
      container.querySelectorAll('[data-testid^="page6-resource-shadow-"] rect'),
    ).map((node) => rectMetrics(node));
    const shaderShadows = Array.from(
      container.querySelectorAll('[data-testid^="page6-shadermap-shadow-"] rect'),
    ).map((node) => rectMetrics(node));

    expect(resourceShadows.length).toBe(2);
    expect(shaderShadows.length).toBe(2);

    resourceShadows.forEach((shadow) => {
      expect(shadow.width).toBeCloseTo(resourceCard.width, 1);
      expect(shadow.x).toBeGreaterThanOrEqual(resourceCard.x + 6);
      expect(shadow.x).toBeLessThanOrEqual(resourceCard.x + 18);
      expect(shadow.y).toBeLessThan(resourceCard.y);
      expect(resourceCard.y - shadow.y).toBeLessThanOrEqual(32);
    });

    shaderShadows.forEach((shadow) => {
      expect(shadow.width).toBeCloseTo(shaderCard.width, 1);
      expect(shadow.x).toBeGreaterThanOrEqual(shaderCard.x + 6);
      expect(shadow.x).toBeLessThanOrEqual(shaderCard.x + 18);
      expect(shadow.y).toBeLessThan(shaderCard.y);
      expect(shaderCard.y - shadow.y).toBeLessThanOrEqual(34);
    });
  });

  it("moves the question hook monotonically toward the center before it disappears", () => {
    const sampledFrames = [162, 186, 210];
    const sampledPositions = sampledFrames.map((frame) => {
      setLegacyFrame(frame);
      const {container, unmount} = render(<MyComposition variantId="bus-clean" />);
      const questionBadge = container.querySelector('[data-testid="page5-question-badge"]');
      const questionCircle = questionBadge?.querySelector("circle");
      unmount();

      return {
        x: Number(questionCircle?.getAttribute("cx")),
        y: Number(questionCircle?.getAttribute("cy")),
      };
    });

    expect(sampledPositions[1].x).toBeGreaterThan(sampledPositions[0].x);
    expect(sampledPositions[2].x).toBeGreaterThan(sampledPositions[1].x);
    expect(sampledPositions[1].y).toBeGreaterThan(sampledPositions[0].y);
    expect(sampledPositions[2].y).toBeGreaterThan(sampledPositions[1].y);
  });

  it("does not keep a full-screen dim overlay during the page 05 -> page 06 handoff", () => {
    setLegacyFrame(198);
    const {container} = render(<MyComposition variantId="bus-clean" />);

    expect(Boolean(container.querySelector('[data-testid="page56-world-dim"]'))).toBe(false);
  });

  it("reveals the page 06 stage as a monotonic center-scale animation", () => {
    const sampledFrames = [222, 228, 234];
    const sampledScales = sampledFrames.map((frame) => {
      setLegacyFrame(frame);
      const {container, unmount} = render(<MyComposition variantId="bus-clean" />);
      const stageGroup = container.querySelector('[data-testid="page6-stage-group"]');
      const scale = parseScale(stageGroup?.getAttribute("transform"));
      unmount();

      return scale ?? 0;
    });

    expect(sampledScales[1]).toBeGreaterThan(sampledScales[0]);
    expect(sampledScales[2]).toBeGreaterThan(sampledScales[1]);
  });

  it("shows the page 06 main chain before dashed guides and white boards appear", () => {
    setLegacyFrame(210);
    const {container} = render(<MyComposition variantId="bus-clean" />);

    expect(container.querySelector('[data-testid="page6-resource-card"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="page6-shadermap-card"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="page6-cooked-code-box"]')).not.toBeNull();
    expect(findTextNodes(container, "UMaterial").length).toBeGreaterThanOrEqual(1);
    expect(container.querySelector('[data-testid="page6-platform-resource-spine"]')).toBeNull();
    expect(
      container.querySelector('[data-testid="page6-shader-selector-attachment-link"]'),
    ).toBeNull();
    expect(container.querySelector('[data-testid="page6-platform-table"]')).toBeNull();
    expect(container.querySelector('[data-testid="page6-resource-selector-table"]')).toBeNull();
    expect(container.querySelector('[data-testid="page6-shadermap-selector-table"]')).toBeNull();
  });

  it("shows the page 06 dashed guides before the white boards expand in", () => {
    setLegacyFrame(216);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const dashedSpine = container.querySelector('[data-testid="page6-platform-resource-spine"]');
    const dashedShaderLink = container.querySelector(
      '[data-testid="page6-shader-selector-attachment-link"]',
    );

    expect(dashedSpine).not.toBeNull();
    expect(effectiveOpacity(dashedSpine)).toBeGreaterThanOrEqual(0.15);
    expect(dashedShaderLink).not.toBeNull();
    expect(effectiveOpacity(dashedShaderLink)).toBeGreaterThanOrEqual(0.15);
    expect(container.querySelector('[data-testid="page6-platform-table"]')).toBeNull();
    expect(container.querySelector('[data-testid="page6-resource-selector-table"]')).toBeNull();
    expect(container.querySelector('[data-testid="page6-shadermap-selector-table"]')).toBeNull();
  });

  it("begins the page 06 white board reveal gently after the dashed guides appear", () => {
    setLegacyFrame(222);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const platformTable = container.querySelector('[data-testid="page6-platform-table"]');
    const resourceTable = container.querySelector(
      '[data-testid="page6-resource-selector-table"]',
    );
    const shaderTable = container.querySelector(
      '[data-testid="page6-shadermap-selector-table"]',
    );

    expect(platformTable).not.toBeNull();
    expect(resourceTable).not.toBeNull();
    expect(shaderTable).not.toBeNull();
    expect(effectiveOpacity(platformTable)).toBeGreaterThan(0.02);
    expect(effectiveOpacity(platformTable)).toBeLessThan(0.38);
    expect(effectiveOpacity(resourceTable)).toBeGreaterThan(0.02);
    expect(effectiveOpacity(resourceTable)).toBeLessThan(0.38);
    expect(effectiveOpacity(shaderTable)).toBeGreaterThan(0.02);
    expect(effectiveOpacity(shaderTable)).toBeLessThan(0.38);
  });

  it("continues expanding the page 06 white boards across later frames instead of finishing in a flash", () => {
    setLegacyFrame(222);
    const {container: earlyContainer, unmount} = render(
      <MyComposition variantId="bus-clean" />,
    );
    const earlyPlatformOpacity = effectiveOpacity(
      earlyContainer.querySelector('[data-testid="page6-platform-table"]'),
    );
    const earlyResourceOpacity = effectiveOpacity(
      earlyContainer.querySelector('[data-testid="page6-resource-selector-table"]'),
    );
    const earlyShaderOpacity = effectiveOpacity(
      earlyContainer.querySelector('[data-testid="page6-shadermap-selector-table"]'),
    );
    unmount();

    setLegacyFrame(228);
    const {container: lateContainer} = render(<MyComposition variantId="bus-clean" />);
    const latePlatformOpacity = effectiveOpacity(
      lateContainer.querySelector('[data-testid="page6-platform-table"]'),
    );
    const lateResourceOpacity = effectiveOpacity(
      lateContainer.querySelector('[data-testid="page6-resource-selector-table"]'),
    );
    const lateShaderOpacity = effectiveOpacity(
      lateContainer.querySelector('[data-testid="page6-shadermap-selector-table"]'),
    );

    expect(latePlatformOpacity).toBeGreaterThan(earlyPlatformOpacity + 0.12);
    expect(lateResourceOpacity).toBeGreaterThan(earlyResourceOpacity + 0.12);
    expect(lateShaderOpacity).toBeGreaterThan(earlyShaderOpacity + 0.12);
  });

  it("keeps the page 06 -> page 07 stage vertically anchored instead of drifting upward", () => {
    const sampledFrames = [234, 252, 270];
    const sampledAnchorYs = sampledFrames.map((frame) => {
      setLegacyFrame(frame);
      const {container, unmount} = render(<MyComposition variantId="bus-clean" />);
      const stageGroup = container.querySelector('[data-testid="page6-stage-group"]');
      const trailingTranslate = parseTrailingTranslate(stageGroup?.getAttribute("transform"));
      unmount();

      return Math.abs(trailingTranslate?.y ?? 0);
    });

    expect(Math.max(...sampledAnchorYs) - Math.min(...sampledAnchorYs)).toBeLessThanOrEqual(4);
  });

  it("keeps page 07 with readable vertical and horizontal spans and de-emphasizes the old page 05 world", () => {
    setLegacyFrame(270);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const arrows = [
      container.querySelector('[data-testid="page6-material-to-resource-arrow"]'),
      container.querySelector('[data-testid="page6-resource-to-shadermap-arrow"]'),
      container.querySelector('[data-testid="page6-shadermap-to-inline-arrow"]'),
      container.querySelector('[data-testid="page6-fshader-to-inline-arrow"]'),
      container.querySelector('[data-testid="page6-entries-to-cooked-arrow"]'),
    ];
    const worldDim = container.querySelector('[data-testid="page56-world-dim"]');
    const baseWorld = container.querySelector('[data-testid="page56-base-world"]');

    for (const length of arrows.map((node) => parseSimplePathLength(node))) {
      expect(length ?? 0).toBeGreaterThanOrEqual(20);
    }
    expect(worldDim).toBeNull();
    expect(opacityOf(baseWorld)).toBeLessThanOrEqual(0.05);
  });

  it("treats the page 07 left ownership stack as a rigid translation of page 06 with unchanged card sizes", () => {
    setLegacyFrame(234);
    const {container: page6Container, unmount} = render(
      <MyComposition variantId="bus-clean" />,
    );
    const page6MaterialRect = findVisibleUmaterialGroup(page6Container)?.querySelector("rect");
    const page6ResourceRect = findVisibleBoxGroupByLabel(
      page6Container,
      "FMaterialResource",
    )?.querySelector("rect");
    const page6ShaderMapRect = findVisibleBoxGroupByLabel(
      page6Container,
      "FMaterialShaderMap",
    )?.querySelector("rect");
    unmount();

    setLegacyFrame(270);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const resourceShadowRects = Array.from(
      container.querySelectorAll('[data-testid^="page6-resource-shadow-"] rect'),
    );
    const shaderShadowRects = Array.from(
      container.querySelectorAll('[data-testid^="page6-shadermap-shadow-"] rect'),
    );
    const materialRect = findVisibleUmaterialGroup(container)?.querySelector("rect");
    const resourceRect = findVisibleBoxGroupByLabel(
      container,
      "FMaterialResource",
    )?.querySelector("rect");
    const shaderMapRect = findVisibleBoxGroupByLabel(
      container,
      "FMaterialShaderMap",
    )?.querySelector("rect");
    const materialLabel = findVisibleUmaterialLabel(container);
    const resourceLabel = findTextNodes(container, "FMaterialResource").find(
      (node) => effectiveOpacity(node) > 0.16,
    );
    const shaderMapLabel = findTextNodes(container, "FMaterialShaderMap").find(
      (node) => effectiveOpacity(node) > 0.16,
    );

    expect(container.querySelector('[data-testid="page6-platform-table"]')).toBeNull();
    expect(container.querySelector('[data-testid="page6-resource-selector-table"]')).toBeNull();
    expect(container.querySelector('[data-testid="page6-shadermap-selector-table"]')).toBeNull();
    expect(resourceShadowRects.length).toBe(0);
    expect(shaderShadowRects.length).toBe(0);
    expect(Number(materialRect?.getAttribute("width"))).toBe(
      Number(page6MaterialRect?.getAttribute("width")),
    );
    expect(Number(resourceRect?.getAttribute("width"))).toBe(
      Number(page6ResourceRect?.getAttribute("width")),
    );
    expect(Number(shaderMapRect?.getAttribute("width"))).toBe(
      Number(page6ShaderMapRect?.getAttribute("width")),
    );
    expect(Number(materialRect?.getAttribute("height"))).toBe(
      Number(page6MaterialRect?.getAttribute("height")),
    );
    expect(Number(resourceRect?.getAttribute("height"))).toBe(
      Number(page6ResourceRect?.getAttribute("height")),
    );
    expect(Number(shaderMapRect?.getAttribute("height"))).toBe(
      Number(page6ShaderMapRect?.getAttribute("height")),
    );
    expect(
      Number(materialRect?.getAttribute("x")) - Number(page6MaterialRect?.getAttribute("x")),
    ).toBe(
      Number(resourceRect?.getAttribute("x")) - Number(page6ResourceRect?.getAttribute("x")),
    );
    expect(
      Number(materialRect?.getAttribute("x")) - Number(page6MaterialRect?.getAttribute("x")),
    ).toBe(
      Number(shaderMapRect?.getAttribute("x")) - Number(page6ShaderMapRect?.getAttribute("x")),
    );
    expect(
      Number(materialRect?.getAttribute("y")) - Number(page6MaterialRect?.getAttribute("y")),
    ).toBe(
      Number(resourceRect?.getAttribute("y")) - Number(page6ResourceRect?.getAttribute("y")),
    );
    expect(
      Number(materialRect?.getAttribute("y")) - Number(page6MaterialRect?.getAttribute("y")),
    ).toBe(
      Number(shaderMapRect?.getAttribute("y")) - Number(page6ShaderMapRect?.getAttribute("y")),
    );
    expect(fontSizeOf(materialLabel)).toBe(fontSizeOf(resourceLabel));
    expect(fontSizeOf(materialLabel)).toBe(fontSizeOf(shaderMapLabel));
    expect(fontSizeOf(materialLabel)).toBe(23.5);
    expect(materialRect?.getAttribute("data-tone")).toBe("default");
  });

  it("keeps the page 07 inline details inserted between shaderMap and the anchored cooked-code box", () => {
    setLegacyFrame(270);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const shaderMapRect = findVisibleBoxGroupByLabel(container, "FMaterialShaderMap")?.querySelector("rect");
    const inlineResourceRect = container
      .querySelector('[data-testid="page6-inline-resource-box"]')
      ?.querySelector("rect");
    const resourceCodeRect = container
      .querySelector('[data-testid="page6-resource-code-box"]')
      ?.querySelector("rect");
    const shaderCodeRect = container
      .querySelector('[data-testid="page6-cooked-code-box"]')
      ?.querySelector("rect");
    const cookedArrow = container.querySelector(
      '[data-testid="page6-entries-to-cooked-arrow"]',
    );
    const fshaderArrow = container.querySelector(
      '[data-testid="page6-fshader-to-inline-arrow"]',
    );
    const fshaderRect = container
      .querySelector('[data-testid="page6-fshader-card"]')
      ?.querySelector("rect");
    const fshaderIndexPillRect = container
      .querySelector('[data-testid="page6-fshader-index-pill"]')
      ?.querySelector("rect");
    const idxLabelRect = container
      .querySelector('[data-testid="page6-index-label"]')
      ?.querySelector("rect");
    const inlineMetrics = rectMetrics(inlineResourceRect);
    const resourceMetrics = rectMetrics(resourceCodeRect);
    const shaderMetrics = rectMetrics(shaderCodeRect);
    const fshaderMetrics = rectMetrics(fshaderRect);
    const fshaderIndexPillMetrics = rectMetrics(fshaderIndexPillRect);
    const idxLabelMetrics = rectMetrics(idxLabelRect);
    const cookedArrowPoints = parseSimplePathPoints(cookedArrow);
    const fshaderArrowPoints = parseSimplePathPoints(fshaderArrow);
    const fshaderArrowX = parseVerticalPathX(fshaderArrow);

    expect(resourceMetrics.x).toBeGreaterThanOrEqual(inlineMetrics.x + 12);
    expect(resourceMetrics.right).toBeLessThanOrEqual(inlineMetrics.right - 12);
    expect(resourceMetrics.width).toBeGreaterThanOrEqual(360);
    expect(resourceMetrics.height).toBeGreaterThanOrEqual(170);
    expect(inlineMetrics.width).toBeGreaterThanOrEqual(500);
    expect(resourceMetrics.y).toBeGreaterThanOrEqual(inlineMetrics.y + 28);
    expect(resourceMetrics.bottom).toBeLessThanOrEqual(inlineMetrics.bottom - 12);
    expect(inlineMetrics.x).toBeGreaterThan(rectMetrics(shaderMapRect).right + 36);
    expect(shaderMetrics.x).toBeGreaterThan(inlineMetrics.right + 24);
    expect(shaderMetrics.x).toBeGreaterThan(resourceMetrics.right + 12);
    expect(fshaderMetrics.bottom).toBeLessThan(inlineMetrics.y - 16);
    expect(
      Math.abs(rectCenterX(fshaderRect) - rectCenterX(inlineResourceRect)),
    ).toBeLessThanOrEqual(36);
    expect(fshaderIndexPillMetrics.x).toBeGreaterThanOrEqual(fshaderMetrics.x + 18);
    expect(fshaderIndexPillMetrics.right).toBeLessThanOrEqual(fshaderMetrics.right - 18);
    expect(fshaderIndexPillMetrics.y).toBeGreaterThanOrEqual(fshaderMetrics.y + 34);
    expect(fshaderIndexPillMetrics.bottom).toBeLessThanOrEqual(fshaderMetrics.bottom - 12);
    expect(Math.abs(rectCenterX(idxLabelRect) - (fshaderArrowX ?? 0))).toBeGreaterThanOrEqual(14);
    expect(idxLabelMetrics.y).toBeGreaterThanOrEqual(fshaderMetrics.bottom);
    expect(Math.abs((cookedArrowPoints?.x1 ?? 0) - (resourceMetrics.right - 16))).toBeLessThanOrEqual(4);
    expect(cookedArrowPoints?.x2).toBeGreaterThan(cookedArrowPoints?.x1 ?? Infinity);
    expect(Math.abs((cookedArrowPoints?.y1 ?? 0) - (cookedArrowPoints?.y2 ?? 0))).toBeLessThanOrEqual(2);
    expect(Math.abs((fshaderArrowPoints?.x1 ?? 0) - (fshaderArrowPoints?.x2 ?? 0))).toBeLessThanOrEqual(2);
    expect(fshaderArrowPoints?.y2).toBeGreaterThan(fshaderArrowPoints?.y1 ?? Infinity);
    expect(screen.getByText("ShaderHashes[idx]")).toBeInTheDocument();
  });

  it("keeps the page 07 ShaderMap handoff arrow on a flat outgoing channel", () => {
    setLegacyFrame(270);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const shaderMapRect = findVisibleBoxGroupByLabel(
      container,
      "FMaterialShaderMap",
    )?.querySelector("rect");
    const shaderMapBridge = container.querySelector(
      '[data-testid="page6-shadermap-to-inline-arrow"]',
    );
    const bridgeVertices = parsePolylineVertices(shaderMapBridge);

    expect(bridgeVertices.length).toBeGreaterThanOrEqual(4);
    expect(Math.abs((bridgeVertices[0]?.x ?? 0) - rectMetrics(shaderMapRect).right)).toBeLessThanOrEqual(2);
    expect(Math.abs((bridgeVertices[0]?.y ?? 0) - rectCenterY(shaderMapRect))).toBeLessThanOrEqual(2);
    expect(Math.abs((bridgeVertices[0]?.y ?? 0) - (bridgeVertices[2]?.y ?? 0))).toBeLessThanOrEqual(2);
  });

  it("keeps the page 07 receiver and payload titles on one line for spacing control", () => {
    setLegacyFrame(270);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const inlineTitle = findSvgTextNodesByContent(
      container,
      "FShaderMapResource_InlineCode",
    )[0];
    const resourceCodeTitle = findSvgTextNodesByContent(
      container,
      "FShaderMapResourceCode",
    )[0];

    expect(inlineTitle).toBeTruthy();
    expect(inlineTitle?.querySelectorAll("tspan").length).toBe(0);
    expect(resourceCodeTitle).toBeTruthy();
    expect(resourceCodeTitle?.querySelectorAll("tspan").length).toBe(0);
  });

  it("uses balanced, presentation-sized row typography inside the page 07 InlineCode payload", () => {
    setLegacyFrame(270);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const inlineRect = container
      .querySelector('[data-testid="page6-inline-resource-box"]')
      ?.querySelector("rect");
    const resourceRect = container
      .querySelector('[data-testid="page6-resource-code-box"]')
      ?.querySelector("rect");
    const inlineTitle = findSvgTextNodesByContent(
      container,
      "FShaderMapResource_InlineCode",
    )[0];
    const resourceTitle = findSvgTextNodesByContent(
      container,
      "FShaderMapResourceCode",
    )[0];
    const resourceDivider = container.querySelector(
      '[data-testid="page6-resource-code-box"] path',
    );
    const resourceDividerPoints = parsePathPoints(resourceDivider);
    const entriesRect = container
      .querySelector('[data-testid="page6-entries-pill"]')
      ?.querySelector("rect");
    const entriesText = container
      .querySelector('[data-testid="page6-entries-pill"]')
      ?.querySelector("text");
    const hashesRect = container
      .querySelector('[data-testid="page6-hashes-pill"]')
      ?.querySelector("rect");
    const hashesText = container
      .querySelector('[data-testid="page6-hashes-pill"]')
      ?.querySelector("text");
    const resourceMetrics = rectMetrics(resourceRect);
    const inlineMetrics = rectMetrics(inlineRect);
    const dividerY = resourceDividerPoints ? (resourceDividerPoints.y1 + resourceDividerPoints.y2) / 2 : NaN;

    expect(fontSizeOf(inlineTitle)).toBeGreaterThanOrEqual(23);
    expect(fontSizeOf(resourceTitle)).toBeGreaterThanOrEqual(21);
    expect(fontSizeOf(entriesText)).toBe(fontSizeOf(hashesText));
    expect(Number(entriesRect?.getAttribute("height"))).toBe(
      Number(hashesRect?.getAttribute("height")),
    );
    expect(Math.abs((textY(resourceTitle) - resourceMetrics.y) - (dividerY - textY(resourceTitle)))).toBeLessThanOrEqual(4);
    expect(resourceMetrics.y - inlineMetrics.y).toBeLessThanOrEqual(68);
  });

  it("balances the page 07 visible content with near-symmetric left and right breathing room inside uasset", () => {
    setLegacyFrame(270);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const uassetMetrics = rectMetrics(container.querySelector('[data-testid="page6-uasset-frame"]'));
    const contentRects = [
      findVisibleUmaterialGroup(container)?.querySelector("rect"),
      findVisibleBoxGroupByLabel(container, "FMaterialResource")?.querySelector("rect"),
      findVisibleBoxGroupByLabel(container, "FMaterialShaderMap")?.querySelector("rect"),
      container.querySelector('[data-testid="page6-fshader-card"]')?.querySelector("rect"),
      container.querySelector('[data-testid="page6-inline-resource-box"]')?.querySelector("rect"),
      container.querySelector('[data-testid="page6-cooked-code-box"]')?.querySelector("rect"),
    ]
      .filter((node): node is Element => Boolean(node))
      .map((node) => rectMetrics(node));

    const contentLeft = Math.min(...contentRects.map((rect) => rect.x));
    const contentRight = Math.max(...contentRects.map((rect) => rect.right));
    const leftBreathingRoom = contentLeft - uassetMetrics.x;
    const rightBreathingRoom = uassetMetrics.right - contentRight;

    expect(Math.abs(leftBreathingRoom - rightBreathingRoom)).toBeLessThanOrEqual(8);
    expect(leftBreathingRoom).toBeGreaterThanOrEqual(20);
    expect(rightBreathingRoom).toBeGreaterThanOrEqual(20);
  });

  it("keeps page 06 platform and FL/QL tables on one lane while relocating shader selectors above the shaderMap -> cooked relation", () => {
    setLegacyFrame(234);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const platformTableRect = container
      .querySelector('[data-testid="page6-platform-table"]')
      ?.querySelector("rect");
    const resourceTableRect = container
      .querySelector('[data-testid="page6-resource-selector-table"]')
      ?.querySelector("rect");
    const shaderTableRect = container
      .querySelector('[data-testid="page6-shadermap-selector-table"]')
      ?.querySelector("rect");
    const shaderMapToCookedArrow = container.querySelector(
      '[data-testid="page6-shadermap-to-cooked-arrow"]',
    );
    const shaderMapToCookedPoints = parseSimplePathPoints(shaderMapToCookedArrow);

    expect(Number(platformTableRect?.getAttribute("width"))).toBeGreaterThanOrEqual(320);
    expect(Number(resourceTableRect?.getAttribute("width"))).toBeGreaterThanOrEqual(320);
    expect(Number(shaderTableRect?.getAttribute("width"))).toBeGreaterThanOrEqual(304);
    expect(Math.abs(rectCenterX(platformTableRect) - rectCenterX(resourceTableRect))).toBeLessThanOrEqual(2);
    expect(rectMetrics(shaderTableRect).bottom).toBeLessThan((shaderMapToCookedPoints?.y1 ?? 0) - 10);
  });

  it("keeps page 06 as one world by avoiding duplicate visible Material labels", () => {
    setLegacyFrame(234);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const visibleMaterialLabels = findTextNodes(container, "UMaterial").filter(
      (node) => effectiveOpacity(node) > 0.16,
    );

    expect(visibleMaterialLabels.length).toBe(1);
  });

  it("keeps page 06 labels readable without glyph compression hacks", () => {
    setLegacyFrame(234);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const resourceLabels = findTextNodes(container, "FMaterialResource");
    const shaderMapLabel = findTextNodes(container, "FMaterialShaderMap")[0];
    const shaderKeyLabels = [
      findTextNodes(container, "ShaderType")[0],
      findTextNodes(container, "VertexFactory")[0],
      findTextNodes(container, "Permutation")[0],
    ];

    expect(resourceLabels.length).toBeGreaterThanOrEqual(1);
    for (const node of resourceLabels) {
      expect(node.getAttribute("textLength")).toBeNull();
      expect(node.getAttribute("lengthAdjust")).toBeNull();
    }
    expect(shaderMapLabel?.getAttribute("textLength")).toBeNull();
    expect(shaderMapLabel?.getAttribute("lengthAdjust")).toBeNull();
    for (const node of shaderKeyLabels) {
      expect(node?.getAttribute("textLength")).toBeNull();
      expect(node?.getAttribute("lengthAdjust")).toBeNull();
    }
  });

  it("removes the page 05 question hook by the settled page 06 frame", () => {
    setLegacyFrame(234);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const questionBadge = container.querySelector('[data-testid="page5-question-badge"]');
    const visibleQuestionLabels = findTextNodes(container, "?").filter(
      (node) => effectiveOpacity(node) > 0.05,
    );

    expect(questionBadge).toBeNull();
    expect(visibleQuestionLabels.length).toBe(0);
  });

  it("renders page 08 with UE PSO table below the lookup slide showing Hash fields and state fields", () => {
    setLegacyFrame(306);
    const {container: page7Container} = render(<MyComposition variantId="bus-clean" />);
    const page7UassetRect = page7Container.querySelector('[data-testid="page6-uasset-frame"]');
    const page7FshaderRect = page7Container.querySelector('[data-testid="page6-fshader-card"] rect');
    const page7InlineRect = page7Container.querySelector(
      '[data-testid="page6-inline-resource-box"] rect',
    );
    cleanup();

    setLegacyFrame(342);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const cacheBox = container.querySelector('[data-testid="page8-pso-box"]');
    const materialProofBox = container.querySelector('[data-testid="page8-proof-material-box"]');
    const materialProofArrow = container.querySelector('[data-testid="page8-material-to-code-arrow"]');
    const psoVsHashArrow = container.querySelector('[data-testid="page8-vs-hash-reference-arrow"]');
    const psoPsHashArrow = container.querySelector('[data-testid="page8-ps-hash-reference-arrow"]');
    const badge1 = container.querySelector('[data-testid="page8-proof-badge-1"]');
    const badge2 = container.querySelector('[data-testid="page8-proof-badge-2"]');
    const badge2Circle = badge2?.querySelector("circle");
    const stageGroup = container.querySelector('[data-testid="page6-stage-group"]');
    const uassetRect = container.querySelector('[data-testid="page6-uasset-frame"]');
    const fshaderRect = container.querySelector('[data-testid="page6-fshader-card"] rect');
    const inlineRect = container.querySelector('[data-testid="page6-inline-resource-box"] rect');
    const resourceCodeRect = container.querySelector('[data-testid="page6-resource-code-box"] rect');
    const hashesRect = container
      .querySelector('[data-testid="page6-hashes-pill"]')
      ?.querySelector("rect");
    const entriesRect = container
      .querySelector('[data-testid="page6-entries-pill"]')
      ?.querySelector("rect");
    const psoLabel = screen.getByText("UE PSO");
    const psoVsHashVertices = parsePolylineVertices(psoVsHashArrow);
    const psoPsHashVertices = parsePolylineVertices(psoPsHashArrow);
    const vsHashField = container.querySelector('[data-testid="page8-pso-field-vs-hash"]');
    const psHashField = container.querySelector('[data-testid="page8-pso-field-ps-hash"]');
    const psoBlendField = container.querySelector('[data-testid="page8-pso-field-blend"]');
    const psoDepthField = container.querySelector('[data-testid="page8-pso-field-depth"]');
    const psoRtField = container.querySelector('[data-testid="page8-pso-field-rt"]');
    const psoEtcField = container.querySelector('[data-testid="page8-pso-field--"]');

    expect(cacheBox).not.toBeNull();
    expect(materialProofBox).not.toBeNull();
    expect(materialProofArrow).not.toBeNull();
    expect(psoVsHashArrow).not.toBeNull();
    expect(psoPsHashArrow).not.toBeNull();
    expect(badge1).not.toBeNull();
    expect(badge2).not.toBeNull();
    expect(resourceCodeRect).not.toBeNull();
    expect(hashesRect).not.toBeNull();
    expect(entriesRect).not.toBeNull();
    expect(screen.getByText("UE PSO")).toBeInTheDocument();
    expect(screen.getByText("ShaderHashes[idx]")).toBeInTheDocument();
    expect(screen.getByText("VS Hash")).toBeInTheDocument();
    expect(screen.getByText("PS Hash")).toBeInTheDocument();
    expect(fontSizeOf(vsHashField)).toBeGreaterThanOrEqual(22);
    expect(fontSizeOf(psoBlendField)).toBeGreaterThanOrEqual(20);
    expect(psoBlendField?.textContent).toBe("Blend");
    expect(psoDepthField?.textContent).toBe("Depth");
    expect(psoRtField?.textContent).toBe("RT");
    expect(psoEtcField?.textContent).toBe("...");
    expect(strokePalette(materialProofArrow)).toBe("#ff0000");
    expect(strokePalette(psoVsHashArrow)).toBe("#ff0000");
    expect(strokePalette(psoPsHashArrow)).toBe("#ff0000");
    expect(rectMetrics(uassetRect).height).toBeLessThan(rectMetrics(page7UassetRect).height - 40);
    expect(Math.abs(rectCenterX(fshaderRect) - rectCenterX(uassetRect))).toBeLessThanOrEqual(4);
    expect(Math.abs(rectCenterX(inlineRect) - rectCenterX(uassetRect))).toBeLessThanOrEqual(4);
    expect(Math.abs(rectCenterX(resourceCodeRect) - rectCenterX(uassetRect))).toBeLessThanOrEqual(4);
    expect(Math.abs(rectMetrics(fshaderRect).width - rectMetrics(page7FshaderRect).width)).toBeLessThanOrEqual(4);
    expect(Math.abs(rectMetrics(inlineRect).width - rectMetrics(page7InlineRect).width)).toBeLessThanOrEqual(4);
    expect(Math.abs(rectMetrics(inlineRect).height - rectMetrics(page7InlineRect).height)).toBeLessThanOrEqual(4);
    expect(rectMetrics(hashesRect).x).toBeGreaterThan(rectMetrics(resourceCodeRect).x + 8);
    expect(rectMetrics(hashesRect).right).toBeLessThan(rectMetrics(resourceCodeRect).right - 8);
    expect(rectMetrics(hashesRect).y).toBeGreaterThan(rectMetrics(entriesRect).bottom);
    expect(textX(psoLabel)).toBeGreaterThan(rectMetrics(cacheBox?.querySelector("rect")).x + 20);
    expect(textX(psoLabel)).toBeLessThan(rectMetrics(cacheBox?.querySelector("rect")).x + 120);
    expect(Math.abs(textY(psoLabel) - rectCenterY(cacheBox?.querySelector("rect")))).toBeLessThanOrEqual(2);
    expect(Math.abs((textX(psHashField) - textX(vsHashField)) - (textX(psoBlendField) - textX(psHashField)))).toBeLessThanOrEqual(2);
    expect(Math.abs((textX(psoDepthField) - textX(psoBlendField)) - (textX(psoRtField) - textX(psoDepthField)))).toBeLessThanOrEqual(2);
    expect(screen.getAllByText("ShaderCode").length).toBeGreaterThanOrEqual(1);
    expect(psoVsHashVertices).toHaveLength(4);
    expect(psoPsHashVertices).toHaveLength(4);
    const projectedUassetBottom = projectPointThroughGroup(stageGroup, {
      x: rectCenterX(uassetRect),
      y: rectMetrics(uassetRect).bottom,
    }).y;
    const projectedHashBottom = projectPointThroughGroup(stageGroup, {
      x: rectCenterX(hashesRect),
      y: rectMetrics(hashesRect).bottom,
    }).y;
    expect(rectMetrics(cacheBox?.querySelector("rect")).y).toBeGreaterThan(projectedUassetBottom + 12);
    expect(Math.abs((psoVsHashVertices[0]?.x ?? 0) - textX(vsHashField))).toBeLessThanOrEqual(1);
    expect(Math.abs((psoPsHashVertices[0]?.x ?? 0) - textX(psHashField))).toBeLessThanOrEqual(1);
    expect(Math.abs((psoVsHashVertices[0]?.y ?? 0) - rectMetrics(cacheBox?.querySelector("rect")).y)).toBeLessThanOrEqual(1);
    expect(Math.abs((psoPsHashVertices[0]?.y ?? 0) - rectMetrics(cacheBox?.querySelector("rect")).y)).toBeLessThanOrEqual(1);
    expect(Math.abs((psoVsHashVertices[1]?.x ?? 0) - (psoVsHashVertices[0]?.x ?? 0))).toBeLessThanOrEqual(1);
    expect(Math.abs((psoPsHashVertices[1]?.x ?? 0) - (psoPsHashVertices[0]?.x ?? 0))).toBeLessThanOrEqual(1);
    expect((psoVsHashVertices[1]?.y ?? 0)).toBeLessThan((psoPsHashVertices[1]?.y ?? 0) - 12);
    expect(Math.abs((psoVsHashVertices[1]?.y ?? 0) - (psoVsHashVertices[2]?.y ?? 0))).toBeLessThanOrEqual(1);
    expect(Math.abs((psoPsHashVertices[1]?.y ?? 0) - (psoPsHashVertices[2]?.y ?? 0))).toBeLessThanOrEqual(1);
    expect(Math.abs((psoVsHashVertices.at(-1)?.y ?? 0) - projectedHashBottom)).toBeLessThanOrEqual(1);
    expect(Math.abs((psoPsHashVertices.at(-1)?.y ?? 0) - projectedHashBottom)).toBeLessThanOrEqual(1);
    expect(Number(badge2Circle?.getAttribute("cy"))).toBeGreaterThan(
      projectedHashBottom + 12,
    );
    expect(Number(badge2Circle?.getAttribute("cy"))).toBeLessThan(
      rectMetrics(cacheBox?.querySelector("rect")).y - 4,
    );
  });

  it("keeps page 08 cooked shader code inside uasset while the external Material carries its own cooked cue", () => {
    setLegacyFrame(342);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const stageGroup = container.querySelector('[data-testid="page6-stage-group"]');
    const uassetRect = container.querySelector('[data-testid="page6-uasset-frame"]');
    const proofMaterialRect = container.querySelector('[data-testid="page8-proof-material-box"] rect');
    const proofCookedCueRect = container.querySelector('[data-testid="page8-proof-cooked-cue"] rect');
    const cookedRect = container.querySelector('[data-testid="page6-cooked-code-box"] rect');
    const projectedUassetTop = projectPointThroughGroup(stageGroup, {
      x: rectCenterX(uassetRect),
      y: rectMetrics(uassetRect).y,
    }).y;
    const projectedCookedCenter = projectPointThroughGroup(stageGroup, {
      x: rectCenterX(cookedRect),
      y: rectCenterY(cookedRect),
    });

    expect(proofMaterialRect).not.toBeNull();
    expect(proofCookedCueRect).not.toBeNull();
    expect(cookedRect).not.toBeNull();
    expect(screen.getByText("Material A")).toBeInTheDocument();
    expect(proofMaterialRect?.getAttribute("fill")).toBe("rgba(231, 242, 233, 0.98)");
    expect(proofMaterialRect?.getAttribute("stroke")).toBe("rgba(104, 140, 114, 0.86)");
    expect(rectMetrics(proofMaterialRect).width).toBeGreaterThanOrEqual(420);
    expect(rectMetrics(proofMaterialRect).height).toBeGreaterThanOrEqual(78);
    expect(rectMetrics(proofMaterialRect).bottom).toBeLessThan(projectedUassetTop);
    expect(Math.abs(rectCenterX(proofCookedCueRect) - projectedCookedCenter.x)).toBeLessThanOrEqual(2);
    expect(rectMetrics(cookedRect).x).toBeGreaterThan(rectMetrics(uassetRect).x + 24);
    expect(rectMetrics(cookedRect).right).toBeLessThan(rectMetrics(uassetRect).right - 24);
    expect(rectMetrics(cookedRect).bottom).toBeLessThan(rectMetrics(uassetRect).bottom - 24);
  });

  it("routes page 08 VS/PS hash fields back to ShaderHashes[idx] as dashed branch references from the UE PSO table", () => {
    setLegacyFrame(342);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const uassetRect = container.querySelector('[data-testid="page6-uasset-frame"]');
    const psoRect = container.querySelector('[data-testid="page8-pso-box"] rect');
    const vsRefArrow = container.querySelector('[data-testid="page8-vs-hash-reference-arrow"]');
    const psRefArrow = container.querySelector('[data-testid="page8-ps-hash-reference-arrow"]');
    const hashesRect = container.querySelector('[data-testid="page6-hashes-pill"] rect');
    const stageGroup = container.querySelector('[data-testid="page6-stage-group"]');
    const vsVertices = parsePolylineVertices(vsRefArrow);
    const psVertices = parsePolylineVertices(psRefArrow);
    const vsHashField = container.querySelector('[data-testid="page8-pso-field-vs-hash"]');
    const psHashField = container.querySelector('[data-testid="page8-pso-field-ps-hash"]');
    const projectedUassetBottom = projectPointThroughGroup(stageGroup, {
      x: rectCenterX(uassetRect),
      y: rectMetrics(uassetRect).bottom,
    }).y;
    const projectedVsAnchor = projectPointThroughGroup(stageGroup, {
      x: rectMetrics(hashesRect).x + 78,
      y: rectMetrics(hashesRect).bottom,
    });
    const projectedPsAnchor = projectPointThroughGroup(stageGroup, {
      x: rectMetrics(hashesRect).right - 78,
      y: rectMetrics(hashesRect).bottom,
    });

    expect(rectMetrics(psoRect).y).toBeGreaterThan(projectedUassetBottom + 12);
    expect(vsRefArrow).not.toBeNull();
    expect(psRefArrow).not.toBeNull();
    expect(dashSignature(vsRefArrow)).toContain("10 8");
    expect(dashSignature(psRefArrow)).toContain("10 8");
    expect(vsVertices).toHaveLength(4);
    expect(psVertices).toHaveLength(4);
    expect(Math.abs((vsVertices[0]?.x ?? 0) - textX(vsHashField))).toBeLessThanOrEqual(1);
    expect(Math.abs((psVertices[0]?.x ?? 0) - textX(psHashField))).toBeLessThanOrEqual(1);
    expect(Math.abs((vsVertices[0]?.y ?? 0) - rectMetrics(psoRect).y)).toBeLessThanOrEqual(1);
    expect(Math.abs((psVertices[0]?.y ?? 0) - rectMetrics(psoRect).y)).toBeLessThanOrEqual(1);
    expect(Math.abs((vsVertices[1]?.x ?? 0) - (vsVertices[0]?.x ?? 0))).toBeLessThanOrEqual(1);
    expect(Math.abs((psVertices[1]?.x ?? 0) - (psVertices[0]?.x ?? 0))).toBeLessThanOrEqual(1);
    expect((vsVertices[1]?.y ?? 0)).toBeLessThan((psVertices[1]?.y ?? 0) - 12);
    expect(Math.abs((vsVertices[1]?.y ?? 0) - (vsVertices[2]?.y ?? 0))).toBeLessThanOrEqual(1);
    expect(Math.abs((psVertices[1]?.y ?? 0) - (psVertices[2]?.y ?? 0))).toBeLessThanOrEqual(1);
    expect(Math.abs((vsVertices.at(-1)?.y ?? 0) - projectedVsAnchor.y)).toBeLessThanOrEqual(1);
    expect(Math.abs((psVertices.at(-1)?.y ?? 0) - projectedPsAnchor.y)).toBeLessThanOrEqual(1);
    expect(Math.abs((vsVertices.at(-1)?.x ?? 0) - projectedVsAnchor.x)).toBeLessThanOrEqual(1);
    expect(Math.abs((psVertices.at(-1)?.x ?? 0) - projectedPsAnchor.x)).toBeLessThanOrEqual(1);
  });

  it("projects page 08 external Material -> Cooked arrow tip through the stage transform before drawing outside the stage group", () => {
    setLegacyFrame(342);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const stageGroup = container.querySelector('[data-testid="page6-stage-group"]');
    const cookedRect = container.querySelector('[data-testid="page6-cooked-code-box"] rect');
    const materialArrow = container.querySelector('[data-testid="page8-material-to-code-arrow"]');
    const arrowPoints = parseSimplePathPoints(materialArrow);
    const projectedCookedTop = projectPointThroughGroup(stageGroup, {
      x: rectCenterX(cookedRect),
      y: rectMetrics(cookedRect).y - 10,
    });

    expect(arrowPoints).not.toBeNull();
    expect(Math.abs((arrowPoints?.x2 ?? 0) - projectedCookedTop.x)).toBeLessThanOrEqual(1);
    expect(Math.abs((arrowPoints?.y2 ?? 0) - projectedCookedTop.y)).toBeLessThanOrEqual(1);
  });

  it("keeps page 08 hash reference lines hidden until the UE PSO scale has essentially settled", () => {
    setLegacyFrame(324);
    const {container} = render(<MyComposition variantId="bus-clean" />);

    expect(container.querySelector('[data-testid="page8-pso-box"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="page8-vs-hash-reference-arrow"]')).toBeNull();
    expect(container.querySelector('[data-testid="page8-ps-hash-reference-arrow"]')).toBeNull();
  });

  it("keeps page 08 PSO Hash focus subordinate to the page 07 mainline by narrowing the cache and tucking VS/PS Hash under ShaderHashes[idx]", () => {
    setLegacyFrame(342);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const uassetRect = container.querySelector('[data-testid="page6-uasset-frame"]');
    const psoRect = container.querySelector('[data-testid="page8-pso-box"] rect');
    const vsHashField = container.querySelector('[data-testid="page8-pso-field-vs-hash"]');
    const psHashField = container.querySelector('[data-testid="page8-pso-field-ps-hash"]');
    const blendField = container.querySelector('[data-testid="page8-pso-field-blend"]');
    const depthField = container.querySelector('[data-testid="page8-pso-field-depth"]');
    const rtField = container.querySelector('[data-testid="page8-pso-field-rt"]');
    const etcField = container.querySelector('[data-testid="page8-pso-field--"]');
    const stageGroup = container.querySelector('[data-testid="page6-stage-group"]');
    const projectedUassetBottom = projectPointThroughGroup(stageGroup, {
      x: rectCenterX(uassetRect),
      y: rectMetrics(uassetRect).bottom,
    }).y;

    expect(rectMetrics(psoRect).width).toBeLessThanOrEqual(980);
    expect(rectMetrics(psoRect).x - rectMetrics(uassetRect).x).toBeGreaterThanOrEqual(110);
    expect(rectMetrics(uassetRect).right - rectMetrics(psoRect).right).toBeGreaterThanOrEqual(110);
    expect(rectMetrics(psoRect).y - projectedUassetBottom).toBeGreaterThanOrEqual(18);
    expect(Math.abs((textX(psHashField) - textX(vsHashField)) - (textX(blendField) - textX(psHashField)))).toBeLessThanOrEqual(2);
    expect(Math.abs((textX(depthField) - textX(blendField)) - (textX(rtField) - textX(depthField)))).toBeLessThanOrEqual(2);
    expect(Math.abs((textX(etcField) - textX(rtField)) - (textX(rtField) - textX(depthField)))).toBeLessThanOrEqual(2);
  });

  it("renders page 09 as a SharedCode solution page with a lookup rail while keeping the UE PSO band on the inherited bottom lane", () => {
    setLegacyFrame(342);
    const {container: page8Container} = render(<MyComposition variantId="bus-clean" />);
    const page8PsoRect = page8Container.querySelector('[data-testid="page8-pso-box"] rect');
    cleanup();

    setLegacyFrame(378);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const page9PsoRect = container.querySelector('[data-testid="page8-pso-box"] rect');
    const sharedLibrary = container.querySelector('[data-testid="page9-shared-library-box"]');
    const shaderMapEntries = container.querySelector('[data-testid="page9-shadermapentries-pill"]');
    const lookupFormula = container.querySelector('[data-testid="page9-lookup-formula"]');
    const shaderHashes = container.querySelector('[data-testid="page9-shaderhashes-pill"]');
    const shaderCode = container.querySelector('[data-testid="page9-shadercode-pill"]');
    const shaderBlob = container.querySelector('[data-testid="page9-shaderblob-pill"]');
    const uassetRect = container.querySelector('[data-testid="page6-uasset-frame"]');
    const sharedLibraryRect = sharedLibrary?.querySelector("rect");
    const shaderHashesRect = shaderHashes?.querySelector("rect");
    const shaderCodeRect = shaderCode?.querySelector("rect");
    const shaderBlobRect = shaderBlob?.querySelector("rect");
    const legacyInlineResourceBox = container.querySelector(
      '[data-testid="page6-inline-resource-box"]',
    );
    const fshaderCard = container.querySelector('[data-testid="page9-fshader-card"]');
    const fshaderRect = fshaderCard?.querySelector("rect");
    const sharedResourceBox = container.querySelector('[data-testid="page9-shared-resource-box"]');
    const sharedResourceRect = sharedResourceBox?.querySelector("rect");
    const shaderMapToSharedArrow = container.querySelector(
      '[data-testid="page9-shadermap-to-sharedcode-arrow"]',
    );
    const fshaderLookupBranch = container.querySelector(
      '[data-testid="page9-fshader-lookup-branch"]',
    );
    const shaderMapIndexLookupBranch = container.querySelector(
      '[data-testid="page9-shadermapindex-lookup-branch"]',
    );
    const hashToLibraryIndexArrow = container.querySelector(
      '[data-testid="page9-hash-to-libraryindex-arrow"]',
    );
    const libraryIndexToEntryArrow = container.querySelector(
      '[data-testid="page9-libraryindex-to-shaderentry-arrow"]',
    );
    const entryToSliceArrow = container.querySelector(
      '[data-testid="page9-shaderentry-to-codeslice-arrow"]',
    );
    const materialBus = container.querySelector('[data-testid="page8-material-bus-arrow"]');
    const cacheLookup = container.querySelector('[data-testid="page8-cache-lookup-arrow"]');
    const resourceLookupArrow = container.querySelector(
      '[data-testid="page8-resource-index-lookup-arrow"]',
    );
    const fshaderBranchVertices = parsePolylineVertices(fshaderLookupBranch);
    const shaderMapIndexBranchVertices = parsePolylineVertices(shaderMapIndexLookupBranch);

    expect(sharedLibrary).not.toBeNull();
    expect(shaderMapEntries).not.toBeNull();
    expect(lookupFormula).not.toBeNull();
    expect(shaderHashes).not.toBeNull();
    expect(shaderCode).not.toBeNull();
    expect(shaderBlob).not.toBeNull();
    expect(materialBus).toBeNull();
    expect(cacheLookup).toBeNull();
    expect(resourceLookupArrow).toBeNull();
    expect(screen.getByText("SharedCode Library")).toBeInTheDocument();
    expect(screen.getByText("FShader")).toBeInTheDocument();
    expect(screen.getAllByText("ShaderMapIndex").length).toBeGreaterThanOrEqual(1);
    expect(findTextNodes(container, "ShaderMapEntries").length).toBeGreaterThanOrEqual(1);
    expect(findTextNodes(container, "ShaderIndicesOffset").length).toBeGreaterThanOrEqual(1);
    expect(findTextNodes(container, "ShaderIndices").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("LibraryShaderIndex")).toBeInTheDocument();
    expect(findTextNodes(container, "ShaderHashTable").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("ShaderEntries")).toBeInTheDocument();
    expect(findTextNodes(container, "CookedShaderCode").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Material A")).toBeInTheDocument();
    expect(screen.getByText("Material B")).toBeInTheDocument();
    expect(screen.getByText("Material C")).toBeInTheDocument();
    expect(screen.getByText("UE PSO")).toBeInTheDocument();
    expect(screen.getByText("VS Hash")).toBeInTheDocument();
    expect(fshaderCard).not.toBeNull();
    expect(sharedResourceBox).not.toBeNull();
    expect(shaderMapToSharedArrow).not.toBeNull();
    expect(fshaderLookupBranch).not.toBeNull();
    expect(shaderMapIndexLookupBranch).not.toBeNull();
    expect(hashToLibraryIndexArrow).not.toBeNull();
    expect(libraryIndexToEntryArrow).not.toBeNull();
    expect(entryToSliceArrow).not.toBeNull();
    expect(legacyInlineResourceBox).toBeNull();
    expect(uassetRect).not.toBeNull();
    expect(Math.abs(rectMetrics(page9PsoRect).y - rectMetrics(page8PsoRect).y)).toBeLessThanOrEqual(2);
    expect(rectMetrics(fshaderRect).bottom).toBeLessThan(rectMetrics(sharedResourceRect).y);
    expect(rectMetrics(sharedLibraryRect).x - rectMetrics(sharedResourceRect).right).toBeGreaterThanOrEqual(70);
    expect(rectMetrics(sharedLibraryRect).x - rectMetrics(uassetRect).right).toBeGreaterThanOrEqual(56);
    expect(rectMetrics(sharedLibraryRect).bottom - rectMetrics(shaderBlobRect).bottom).toBeGreaterThanOrEqual(0);
    expect(findBoxGroupByLabel(container, "Material A")?.querySelector("rect")?.getAttribute("fill")).toBe(
      "rgba(231, 242, 233, 0.98)",
    );
    expect(findBoxGroupByLabel(container, "Material B")?.querySelector("rect")?.getAttribute("fill")).toBe(
      "rgba(231, 242, 233, 0.98)",
    );
    expect(findBoxGroupByLabel(container, "Material C")?.querySelector("rect")?.getAttribute("fill")).toBe(
      "rgba(231, 242, 233, 0.98)",
    );
    expect(Math.abs(rectMetrics(shaderHashesRect).y - rectMetrics(shaderCodeRect).y)).toBeLessThanOrEqual(2);
    expect(rectMetrics(shaderBlobRect).y - rectMetrics(shaderCodeRect).bottom).toBeGreaterThanOrEqual(8);
    expect((fshaderBranchVertices[0]?.x ?? 0)).toBeGreaterThan(rectCenterX(fshaderRect));
    expect((fshaderBranchVertices[2]?.x ?? 0)).toBeGreaterThan(rectMetrics(sharedResourceRect).right + 20);
    expect((shaderMapIndexBranchVertices[0]?.x ?? 0)).toBeGreaterThan(rectCenterX(sharedResourceRect));
    expect(rectMetrics(sharedResourceRect).width).toBeGreaterThanOrEqual(220);
    expect(rectMetrics(sharedResourceRect).width).toBeLessThanOrEqual(280);
  });

  it("keeps the page 09 SharedCode carry box lifted clear of the inherited PSO band", () => {
    setLegacyFrame(378);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const page9PsoRect = container.querySelector('[data-testid="page8-pso-box"] rect');
    const sharedResourceRect = container
      .querySelector('[data-testid="page9-shared-resource-box"]')
      ?.querySelector("rect");

    expect(rectMetrics(page9PsoRect).y - rectMetrics(sharedResourceRect).bottom).toBeGreaterThanOrEqual(84);
  });

  it("keeps the page 09 SharedCode carry box inside the uasset frame with a visible right breathing margin", () => {
    setLegacyFrame(378);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const uassetRect = container.querySelector('[data-testid="page6-uasset-frame"]');
    const sharedResourceRect = container
      .querySelector('[data-testid="page9-shared-resource-box"]')
      ?.querySelector("rect");

    expect(
      rectMetrics(uassetRect).right - rectMetrics(sharedResourceRect).right,
    ).toBeGreaterThanOrEqual(32);
  });

  it("drops the page 09 SharedCode carry box onto a lower band so the left handoff can turn under ShaderMap", () => {
    setLegacyFrame(378);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const sharedResourceRect = container
      .querySelector('[data-testid="page9-shared-resource-box"]')
      ?.querySelector("rect");

    expect(rectMetrics(sharedResourceRect).y).toBeGreaterThanOrEqual(368);
  });

  it("keeps the page 09 VS/PS proof lane from scraping directly under the SharedCode carry box", () => {
    setLegacyFrame(378);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const stageGroup = container.querySelector('[data-testid="page6-stage-group"]');
    const sharedResourceRect = container
      .querySelector('[data-testid="page9-shared-resource-box"]')
      ?.querySelector("rect");
    const vsProofVertices = parsePolylineVertices(
      container.querySelector('[data-testid="page9-vs-hash-proof-arrow"]'),
    );
    const projectedSharedBottom = projectPointThroughGroup(stageGroup, {
      x: rectCenterX(sharedResourceRect),
      y: rectMetrics(sharedResourceRect).bottom,
    }).y;

    expect((vsProofVertices[1]?.y ?? 0) - projectedSharedBottom).toBeGreaterThanOrEqual(18);
  });

  it("routes the page 09 ShaderMap handoff by dropping below ShaderMap before turning right into SharedCode", () => {
    setLegacyFrame(378);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const shaderMapGroup = findVisibleBoxGroupByLabel(
      container,
      "FMaterialShaderMap",
    );
    const shaderMapLaneGroup = shaderMapGroup?.parentElement;
    const shaderMapRect = shaderMapGroup?.querySelector("rect");
    const sharedResourceRect = container
      .querySelector('[data-testid="page9-shared-resource-box"]')
      ?.querySelector("rect");
    const shaderMapToSharedVertices = parsePolylineVertices(
      container.querySelector('[data-testid="page9-shadermap-to-sharedcode-arrow"]'),
    );
    const localShaderMapBottomCenter = projectPointThroughGroup(shaderMapGroup, {
      x: rectCenterX(shaderMapRect),
      y: rectMetrics(shaderMapRect).bottom,
    });
    const projectedShaderMapBottomCenter = projectPointThroughGroup(
      shaderMapLaneGroup,
      localShaderMapBottomCenter,
    );

    expect(shaderMapToSharedVertices.length).toBeGreaterThanOrEqual(4);
    expect(Math.abs((shaderMapToSharedVertices[0]?.x ?? 0) - projectedShaderMapBottomCenter.x)).toBeLessThanOrEqual(18);
    expect(Math.abs((shaderMapToSharedVertices[0]?.y ?? 0) - projectedShaderMapBottomCenter.y)).toBeLessThanOrEqual(2);
    expect(Math.abs((shaderMapToSharedVertices[1]?.x ?? 0) - (shaderMapToSharedVertices[0]?.x ?? 0))).toBeLessThanOrEqual(2);
    expect((shaderMapToSharedVertices[1]?.y ?? 0) - (shaderMapToSharedVertices[0]?.y ?? 0)).toBeGreaterThanOrEqual(14);
    expect(Math.abs((shaderMapToSharedVertices[2]?.y ?? 0) - (shaderMapToSharedVertices[1]?.y ?? 0))).toBeLessThanOrEqual(2);
    expect(Math.abs((shaderMapToSharedVertices.at(-1)?.y ?? 0) - (shaderMapToSharedVertices[1]?.y ?? 0))).toBeLessThanOrEqual(2);
    expect((shaderMapToSharedVertices.at(-1)?.x ?? 0)).toBeLessThanOrEqual(
      rectMetrics(sharedResourceRect).x + 2,
    );
  });

  it("starts the page 09 ShaderMapIndex lookup branch from the ShaderMapIndex pill on a flat horizontal lane", () => {
    setLegacyFrame(378);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const sharedResourceRect = container
      .querySelector('[data-testid="page9-shared-resource-box"]')
      ?.querySelector("rect");
    const shaderMapIndexLabel = findTextNodes(container, "ShaderMapIndex").find(
      (node) => effectiveOpacity(node) > 0.2,
    );
    const shaderMapIndexBranchVertices = parsePolylineVertices(
      container.querySelector('[data-testid="page9-shadermapindex-lookup-branch"]'),
    );

    expect(shaderMapIndexBranchVertices.length).toBeGreaterThanOrEqual(2);
    expect(Math.abs((shaderMapIndexBranchVertices[0]?.y ?? 0) - textY(shaderMapIndexLabel))).toBeLessThanOrEqual(3);
    expect((shaderMapIndexBranchVertices[0]?.y ?? 0)).toBeGreaterThan(rectCenterY(sharedResourceRect) + 16);
    expect(Math.abs((shaderMapIndexBranchVertices.at(-1)?.y ?? 0) - (shaderMapIndexBranchVertices[0]?.y ?? 0))).toBeLessThanOrEqual(2);
  });

  it("keeps the page 09 VS and PS proof endpoints aligned to their own left-right order on the hash table floor", () => {
    setLegacyFrame(378);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const vsProofVertices = parsePolylineVertices(
      container.querySelector('[data-testid="page9-vs-hash-proof-arrow"]'),
    );
    const psProofVertices = parsePolylineVertices(
      container.querySelector('[data-testid="page9-ps-hash-proof-arrow"]'),
    );

    expect((vsProofVertices[0]?.x ?? 0)).toBeLessThan((psProofVertices[0]?.x ?? 0));
    expect((vsProofVertices.at(-1)?.x ?? 0)).toBeLessThan((psProofVertices.at(-1)?.x ?? 0));
    expect((psProofVertices.at(-1)?.x ?? 0) - (vsProofVertices.at(-1)?.x ?? 0)).toBeGreaterThanOrEqual(40);
  });

  it("keeps page 09 diagram typography above the PPT readability floor", () => {
    setLegacyFrame(378);
    const {container} = render(<MyComposition variantId="bus-clean" />);

    const materialA = findTextNodes(container, "Material A")[0];
    const globalLabel = findTextNodes(container, "GLOBAL")[0];
    const fshaderTitle = findTextNodes(container, "FShader")[0];
    const resourceIndex = findTextNodes(container, "ResourceIndex")[0];
    const shaderMapIndexLabels = findTextNodes(container, "ShaderMapIndex");
    const sharedCodeTitle = findTextNodes(container, "FShaderMapResource_SharedCode")[0];
    const entriesLabel = findTextNodes(container, "ShaderMapEntries")[0];
    const entriesOffset = findTextNodes(container, "ShaderIndicesOffset")[0];
    const formulaNode = findTextNodes(container, "ShaderIndices")[0];
    const libraryIndexNode = findTextNodes(container, "LibraryShaderIndex")[0];
    const shaderHashesLabel = findTextNodes(container, "ShaderHashTable")[0];
    const shaderCodeLabel = findTextNodes(container, "ShaderEntries")[0];
    const offsetSize = findTextNodes(container, "Offset / Size")[0];
    const shaderSlice = findTextNodes(container, "CookedShaderCode")[0];

    expect(fontSizeOf(materialA)).toBeGreaterThanOrEqual(17);
    expect(fontSizeOf(globalLabel)).toBeGreaterThanOrEqual(16);
    expect(fontSizeOf(fshaderTitle)).toBeGreaterThanOrEqual(22);
    expect(fontSizeOf(resourceIndex)).toBeGreaterThanOrEqual(15);
    expect(Math.min(...shaderMapIndexLabels.map((node) => fontSizeOf(node)))).toBeGreaterThanOrEqual(15);
    expect(fontSizeOf(sharedCodeTitle)).toBeGreaterThanOrEqual(18);
    expect(fontSizeOf(entriesLabel)).toBeGreaterThanOrEqual(18);
    expect(fontSizeOf(entriesOffset)).toBeGreaterThanOrEqual(15);
    expect(fontSizeOf(formulaNode)).toBeGreaterThanOrEqual(16);
    expect(fontSizeOf(libraryIndexNode)).toBeGreaterThanOrEqual(20);
    expect(fontSizeOf(shaderHashesLabel)).toBeGreaterThanOrEqual(16.5);
    expect(fontSizeOf(shaderCodeLabel)).toBeGreaterThanOrEqual(16);
    expect(fontSizeOf(offsetSize)).toBeGreaterThanOrEqual(14);
    expect(fontSizeOf(shaderSlice)).toBeGreaterThanOrEqual(15.5);
  });

  it("moves the page 09_img Material and instance explanation into an outside note above the comparison cards", () => {
    setLegacyFrame(444);
    const {container} = render(<MyComposition variantId="bus-clean" />);

    const materialNote = findTextNodes(container, "M = 母材质")[0];
    const instanceNote = findTextNodes(
      container,
      "M-I1 / M-I2 = 两个相同的 Material Instance",
    )[0];
    const staticBoolNote = findTextNodes(
      container,
      "注：M-I1 / M-I2 都额外改了同一个 Static Bool，否则 UE 可能会优化掉，不保存对应 ShaderCode。",
    )[0];
    const centerTitle = findTextNodes(container, ".uexp 对比（M 系列）")[0];
    const openglHashBox = container.querySelector('[data-testid="page09-hash-opengl-box"] rect');
    const vulkanHashBox = container.querySelector('[data-testid="page09-hash-vulkan-box"] rect');
    const openglHashTitle = findTextNodes(container, "Hash 复用证据（OpenGL）")[0];
    const openglHashValue = findTextNodes(container, "BC10CB48...B4A6DB57")[0];
    const openglHashNote = findTextNodes(container, "M-I1 / M-I2 复用同一 Hash")[0];
    const vulkanHashTitle = findTextNodes(container, "Hash 复用证据（Vulkan）")[0];
    const vulkanHashNote = findTextNodes(container, "共享模式命中同一套 Hash")[0];
    const openglHashBoxY = Number(openglHashBox?.getAttribute("y"));
    const openglHashBoxBottom =
      openglHashBoxY + Number(openglHashBox?.getAttribute("height"));
    const vulkanHashBoxY = Number(vulkanHashBox?.getAttribute("y"));
    const vulkanHashBoxBottom =
      vulkanHashBoxY + Number(vulkanHashBox?.getAttribute("height"));

    expect(materialNote).toBeDefined();
    expect(instanceNote).toBeDefined();
    expect(staticBoolNote).toBeDefined();
    expect(textY(materialNote)).toBeLessThan(textY(centerTitle));
    expect(textY(instanceNote)).toBeLessThan(textY(centerTitle));
    expect(textY(staticBoolNote)).toBeLessThan(textY(centerTitle));
    expect(textY(materialNote)).toBeLessThan(textY(instanceNote));
    expect(textY(instanceNote)).toBeLessThan(textY(staticBoolNote));
    expect(Math.abs(textX(materialNote) - textX(centerTitle))).toBeLessThanOrEqual(2);
    expect(Math.abs(textX(instanceNote) - textX(centerTitle))).toBeLessThanOrEqual(2);
    expect(Math.abs(textX(staticBoolNote) - textX(centerTitle))).toBeLessThanOrEqual(2);
    expect(fontSizeOf(materialNote)).toBeGreaterThanOrEqual(26);
    expect(fontSizeOf(instanceNote)).toBeGreaterThanOrEqual(24);
    expect(fontSizeOf(staticBoolNote)).toBeLessThan(fontSizeOf(instanceNote));
    expect(fontSizeOf(staticBoolNote)).toBeLessThanOrEqual(20);
    expect(fontWeightOf(materialNote)).toBeLessThanOrEqual(700);
    expect(fontWeightOf(instanceNote)).toBeLessThanOrEqual(700);
    expect(fontWeightOf(staticBoolNote)).toBeLessThanOrEqual(640);
    expect(textY(centerTitle) - textY(staticBoolNote)).toBeGreaterThanOrEqual(24);
    expect(openglHashBox).toBeDefined();
    expect(vulkanHashBox).toBeDefined();
    expect(Number(openglHashBox?.getAttribute("height"))).toBeLessThanOrEqual(160);
    expect(Number(vulkanHashBox?.getAttribute("height"))).toBeLessThanOrEqual(160);
    expect(fontSizeOf(openglHashTitle)).toBe(20);
    expect(fontSizeOf(openglHashValue)).toBe(24);
    expect(fontSizeOf(openglHashNote)).toBe(18);
    expect(
      Math.abs((textY(openglHashTitle) - openglHashBoxY) - (openglHashBoxBottom - textY(openglHashNote))),
    ).toBeLessThanOrEqual(10);
    expect(
      Math.abs((textY(vulkanHashTitle) - vulkanHashBoxY) - (vulkanHashBoxBottom - textY(vulkanHashNote))),
    ).toBeLessThanOrEqual(10);
    expect(
      findTextNodes(container, "M = 母材质；M-I1 / M-I2 = 两个相同的 Material Instance").length,
    ).toBe(0);
    expect(findTextNodes(container, "注：M-I1 / M-I2 都额外改了同一个 Static Bool").length).toBe(0);
    expect(findTextNodes(container, "否则 UE 可能会优化掉，不保存对应 ShaderCode。").length).toBe(0);
    expect(findTextNodes(container, "M=Material，M-I*=Material Instance").length).toBe(0);
  });

  it("renders page 10 as a page-5 callback that settles on ShaderLibrary before the loop chapter starts", () => {
    setLegacyFrame(474);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const scene = computeSceneModel(474, "bus-clean");
    const visibleMaterial = findSvgTextNodesByContent(container, "Material").filter(
      (node) => effectiveOpacity(node) > 0.2,
    );
    const visibleCooked = findSvgTextNodesByContent(container, "Cooked").filter(
      (node) => effectiveOpacity(node) > 0.2,
    );
    const shaderLibraryTarget = container.querySelector(
      '[data-testid="page10-callback-shaderlibrary-target"]',
    );
    const shaderRect = shaderLibraryTarget?.querySelector("rect");
    const vertexCarrierRect = findRectByBox(container, scene.leftBox);
    const gpuCarrierRect = findRectByBox(container, scene.centerBox);
    const pixelsCarrierRect = findRectByBox(container, scene.rightBox);
    const shaderCenter = projectPointThroughGroup(shaderLibraryTarget, {
      x: rectCenterX(shaderRect),
      y: rectCenterY(shaderRect),
    });
    const cookedTargetCenter = boxCenter(scene.sharedUpperRightBox);

    expect(findSvgTextNodesByContent(container, "ShaderLibrary").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, "Binary").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, "GPU").length).toBeGreaterThanOrEqual(1);
    expect(vertexCarrierRect).not.toBeNull();
    expect(gpuCarrierRect).not.toBeNull();
    expect(pixelsCarrierRect).not.toBeNull();
    expect(Math.abs(shaderCenter.x - cookedTargetCenter.x)).toBeLessThanOrEqual(8);
    expect(Math.abs(shaderCenter.y - cookedTargetCenter.y)).toBeLessThanOrEqual(8);
    expect(visibleMaterial.length).toBe(0);
    expect(visibleCooked.length).toBe(0);
    expect(findSvgTextNodesByContent(container, ".ushaderbytecode").length).toBe(0);
    expect(findSvgTextNodesByContent(container, "构建机").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, "Phone").length).toBe(0);
    expect(findSvgTextNodesByContent(container, ".scl.csv").length).toBe(0);
    expect(findSvgTextNodesByContent(container, "UE5 formats").length).toBe(0);
    expect(findSvgTextNodesByContent(container, "rec.upipelinecache").length).toBe(0);
    expect(findSvgTextNodesByContent(container, "stablepc.csv").length).toBe(0);
    expect(container.querySelector('[data-testid="page10-answer-badge"]')).toBeNull();
  });

  it("shows a transient answer badge during the page 09 to page 10 transition", () => {
    setLegacyFrame(432);
    const {container} = render(<MyComposition variantId="bus-clean" />);

    expect(container.querySelector('[data-testid="page10-answer-badge"]')).not.toBeNull();
  });

  it("shrinks the legacy page-09 world before the page-10 callback settles", () => {
    setLegacyFrame(372);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const legacyWorld = container.querySelector('[data-testid="page910-legacy-world"]');
    const legacyScale = parseScale(legacyWorld?.getAttribute("transform"));

    expect(legacyWorld).not.toBeNull();
    expect(legacyScale).not.toBeNull();
    expect(legacyScale ?? 1).toBeLessThan(0.94);
  });

  it("pulls Material and CookedShaderCode into ShaderLibrary during the page-10 merge", () => {
    setLegacyFrame(444);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const scene = computeSceneModel(444, "bus-clean");
    const materialSource = container.querySelector(
      '[data-testid="page10-callback-material-merge-source"]',
    );
    const cookedSource = container.querySelector(
      '[data-testid="page10-callback-cooked-merge-source"]',
    );
    const materialLink = container.querySelector('[data-testid="page10-callback-material-link"]');
    const shaderLibraryTarget = container.querySelector(
      '[data-testid="page10-callback-shaderlibrary-target"]',
    );
    const materialRect = materialSource?.querySelector("rect");
    const cookedRect = cookedSource?.querySelector("rect");
    const shaderRect = shaderLibraryTarget?.querySelector("rect");
    const materialCenter = projectPointThroughGroup(materialSource, {
      x: rectCenterX(materialRect),
      y: rectCenterY(materialRect),
    });
    const cookedCenter = projectPointThroughGroup(cookedSource, {
      x: rectCenterX(cookedRect),
      y: rectCenterY(cookedRect),
    });
    const shaderCenter = projectPointThroughGroup(shaderLibraryTarget, {
      x: rectCenterX(shaderRect),
      y: rectCenterY(shaderRect),
    });
    const materialMergeScale = parseScale(materialSource?.getAttribute("transform"));
    const cookedMergeScale = parseScale(cookedSource?.getAttribute("transform"));
    const materialLinkPoints = parseSimplePathPoints(materialLink);
    const movedMaterialRight = materialCenter.x + (scene.sharedUpperLeftBox.width * (materialMergeScale ?? 1)) / 2;

    expect(materialSource).not.toBeNull();
    expect(cookedSource).not.toBeNull();
    expect(materialLink).not.toBeNull();
    expect(shaderLibraryTarget).not.toBeNull();
    expect(effectiveOpacity(materialSource)).toBeGreaterThan(0.16);
    expect(effectiveOpacity(cookedSource)).toBeGreaterThan(0.16);
    expect(effectiveOpacity(shaderLibraryTarget)).toBeGreaterThan(0.4);
    expect(materialMergeScale ?? 1).toBeLessThan(0.96);
    expect(cookedMergeScale ?? 1).toBeLessThan(0.96);
    expect(Math.abs((materialLinkPoints?.x1 ?? 0) - (movedMaterialRight + 10))).toBeLessThanOrEqual(12);
    expect(Math.abs(materialCenter.x - shaderCenter.x)).toBeLessThanOrEqual(140);
    expect(Math.abs(cookedCenter.x - shaderCenter.x)).toBeLessThanOrEqual(140);
    expect(Math.abs(materialCenter.y - shaderCenter.y)).toBeLessThanOrEqual(70);
    expect(Math.abs(cookedCenter.y - shaderCenter.y)).toBeLessThanOrEqual(70);
  });

  it("fades the old Material source link as the page-10 merge nearly finishes", () => {
    setLegacyFrame(444);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const materialSource = container.querySelector(
      '[data-testid="page10-callback-material-merge-source"]',
    );
    const materialLink = container.querySelector('[data-testid="page10-callback-material-link"]');
    const materialLinkPath = materialLink?.querySelector("path");

    expect(materialSource).not.toBeNull();
    expect(materialLink).not.toBeNull();
    expect(materialLinkPath).not.toBeNull();
    expect(effectiveOpacity(materialSource)).toBeGreaterThan(0.5);
    expect(effectiveOpacity(materialLinkPath)).toBeLessThan(0.35);
  });

  it("starts page 11 by morphing ShaderLibrary into .ushaderbytecode on the same traveling node", () => {
    setLegacyFrame(498);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const bytecodeGroup = findVisibleBoxGroupByLabel(container, ".ushaderbytecode");
    const bytecodeRect = bytecodeGroup?.querySelector("rect");

    expect(bytecodeGroup).not.toBeNull();
    expect(rectCenterY(bytecodeRect)).toBeLessThan(500);
    expect(Number(bytecodeRect?.getAttribute("width"))).toBeLessThan(280);
    expect(findSvgTextNodesByContent(container, "ShaderLibrary").filter(
      (node) => effectiveOpacity(node) > 0.2,
    ).length).toBe(0);
  });

  it("keeps ShaderLibrary visible through the first page-11 frames instead of blinking out", () => {
    setLegacyFrame(480);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const shaderBridge = container.querySelector(
      '[data-testid="page10-callback-shaderlibrary-target"]',
    );

    expect(shaderBridge).not.toBeNull();
    expect(effectiveOpacity(shaderBridge)).toBeGreaterThan(0.98);
  });

  it("bridges the three runtime nodes into the phone with matching node and edge motion", () => {
    setLegacyFrame(498);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const scene = computeSceneModel(498, "bus-clean");
    const leftBridge = container.querySelector('[data-testid="page10-runtime-bridge-left"]');
    const centerBridge = container.querySelector('[data-testid="page10-runtime-bridge-center"]');
    const rightBridge = container.querySelector('[data-testid="page10-runtime-bridge-right"]');
    const leftRect = leftBridge?.querySelector("rect");
    const centerRect = centerBridge?.querySelector("rect");
    const rightRect = rightBridge?.querySelector("rect");

    expect(leftBridge).not.toBeNull();
    expect(centerBridge).not.toBeNull();
    expect(rightBridge).not.toBeNull();
    expect(container.querySelector('[data-testid="page10-runtime-bridge-link-left"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="page10-runtime-bridge-link-right"]')).not.toBeNull();
    expect(effectiveOpacity(leftBridge)).toBeGreaterThan(0.98);
    expect(effectiveOpacity(centerBridge)).toBeGreaterThan(0.98);
    expect(effectiveOpacity(rightBridge)).toBeGreaterThan(0.98);
    expect(rectCenterX(leftRect)).toBeGreaterThan(scene.leftCenterX + 10);
    expect(rectCenterY(leftRect)).toBeLessThan(scene.axisY);
    expect(rectCenterX(centerRect)).toBeGreaterThan(scene.centerCenterX + 4);
    expect(rectCenterY(centerRect)).toBeLessThan(scene.centerTextY);
    expect(rectCenterX(rightRect)).toBeGreaterThan(scene.rightCenterX);
    expect(rectCenterY(rightRect)).toBeLessThanOrEqual(scene.axisY + 4);
  });

  it("fades in the device shell while keeping page-11 continuity on the shared bridge carriers", () => {
    setLegacyFrame(498);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const phoneShell = container.querySelector('[data-testid="page10-phone-shell"]');
    const phoneRuntime = container.querySelector('[data-testid="page10-phone-runtime"]');
    const bridgeLeft = container.querySelector('[data-testid="page10-runtime-bridge-left"]');
    const bridgeCenter = container.querySelector('[data-testid="page10-runtime-bridge-center"]');
    const bridgeRight = container.querySelector('[data-testid="page10-runtime-bridge-right"]');
    const bytecodeGroup = findVisibleBoxGroupByLabel(container, ".ushaderbytecode");

    expect(phoneShell).not.toBeNull();
    expect(phoneRuntime).not.toBeNull();
    expect(bridgeLeft).not.toBeNull();
    expect(bridgeCenter).not.toBeNull();
    expect(bridgeRight).not.toBeNull();
    expect(bytecodeGroup).not.toBeNull();
    expect(effectiveOpacity(phoneShell)).toBeGreaterThan(0.001);
    expect(effectiveOpacity(phoneShell)).toBeLessThan(0.8);
    expect(effectiveOpacity(phoneRuntime)).toBe(0);
    expect(effectiveOpacity(bridgeLeft)).toBeGreaterThan(0.98);
    expect(effectiveOpacity(bridgeCenter)).toBeGreaterThan(0.98);
    expect(effectiveOpacity(bridgeRight)).toBeGreaterThan(0.98);
    expect(effectiveOpacity(bytecodeGroup)).toBeGreaterThan(0.98);
  });

  it("reveals the computer-phone base stage on page 11 before the cook split begins", () => {
    setLegacyFrame(546);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const bridgeCenter = container.querySelector('[data-testid="page10-runtime-bridge-center"]');
    const bridgeLeftLink = container.querySelector('[data-testid="page10-runtime-bridge-link-left"]');
    const bridgeRightLink = container.querySelector('[data-testid="page10-runtime-bridge-link-right"]');
    const bytecodeGroup = findVisibleBoxGroupByLabel(container, ".ushaderbytecode");
    const computerRect = findRectByBox(container, {
      x: 82,
      y: 291,
      width: 202,
      height: 110,
    });
    const computerGroup = computerRect?.closest("g");
    const phoneRect = Array.from(
      container.querySelectorAll('[data-testid="page10-phone-shell"] rect'),
    ).find(
      (rect) =>
        Number(rect.getAttribute("width")) === 188 &&
        Number(rect.getAttribute("height")) === 412,
    );
    const phoneShell = container.querySelector('[data-testid="page10-phone-shell"]');
    const leftVertices = parsePolylineVertices(bridgeLeftLink);
    const rightVertices = parsePolylineVertices(bridgeRightLink);
    const leftSpan = Math.abs((leftVertices.at(-1)?.y ?? 0) - (leftVertices[0]?.y ?? 0));
    const rightSpan = Math.abs((rightVertices.at(-1)?.y ?? 0) - (rightVertices[0]?.y ?? 0));
    const computerCenterY = (minRectTop(computerGroup) + maxRectBottom(computerGroup)) / 2;
    const phoneCenterY = (minRectTop(phoneShell) + maxRectBottom(phoneShell)) / 2;

    expect(findSvgTextNodesByContent(container, "构建机").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, "Phone").length).toBe(0);
    expect(findSvgTextNodesByContent(container, "VertexData").length).toBe(0);
    expect(findSvgTextNodesByContent(container, "Pixels").length).toBe(0);
    expect(findSvgTextNodesByContent(container, "GPU").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, ".ushaderbytecode").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, "cook").length).toBe(0);
    expect(findSvgTextNodesByContent(container, ".scl.csv").length).toBe(0);
    expect(findSvgTextNodesByContent(container, "rec.upipelinecache").length).toBe(0);
    expect(bytecodeGroup).not.toBeNull();
    expect(bridgeCenter).not.toBeNull();
    expect(effectiveOpacity(bridgeCenter)).toBeGreaterThan(0.98);
    expect(computerRect).not.toBeNull();
    expect(computerGroup).not.toBeNull();
    expect(phoneRect).not.toBeNull();
    expect(phoneShell).not.toBeNull();
    expect(Math.abs(computerCenterY - phoneCenterY)).toBeLessThanOrEqual(2);
    expect(Math.abs(computerCenterY - 360)).toBeLessThanOrEqual(2);
    expect(Math.abs(phoneCenterY - 360)).toBeLessThanOrEqual(2);
    expect(leftVertices.length).toBeGreaterThanOrEqual(2);
    expect(rightVertices.length).toBeGreaterThanOrEqual(2);
    expect((leftVertices.at(-1)?.y ?? 0) - (leftVertices[0]?.y ?? 0)).toBeGreaterThan(0);
    expect((rightVertices.at(-1)?.y ?? 0) - (rightVertices[0]?.y ?? 0)).toBeGreaterThan(0);
    expect(leftSpan).toBeGreaterThanOrEqual(40);
    expect(rightSpan).toBeGreaterThanOrEqual(40);
  });

  it("reveals the cook split on page 12 and the bytecode landing on page 13", () => {
    setLegacyFrame(600);
    const {container: page12Container, unmount} = render(
      <MyComposition variantId="bus-clean" />,
    );

    expect(findSvgTextNodesByContent(page12Container, "cook").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page12Container, ".scl.csv").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page12Container, "Computer").length).toBe(0);
    expect(findSvgTextNodesByContent(page12Container, "Phone").length).toBe(0);
    expect(findSvgTextNodesByContent(page12Container, "rec.upipelinecache").length).toBe(0);

    unmount();
    setLegacyFrame(654);
    const {container: page13Container} = render(<MyComposition variantId="bus-clean" />);

    expect(findSvgTextNodesByContent(page13Container, ".ushaderbytecode").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page13Container, "Computer").length).toBe(0);
    expect(findSvgTextNodesByContent(page13Container, "Phone").length).toBe(0);
    expect(findSvgTextNodesByContent(page13Container, "rec.upipelinecache").length).toBe(0);
  });

  it("inserts placeholder explanation pages and shifts the old rec/stable beats forward", () => {
    setLegacyFrame(708);
    const {container: page14Container, unmount} = render(
      <MyComposition variantId="bus-clean" />,
    );

    expect(findSvgTextNodesByContent(page14Container, "UE PSO").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page14Container, "ShaderHash + State").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page14Container, "Gfx PSO").length).toBeGreaterThanOrEqual(1);
    expect(
      findSvgTextNodesByContent(page14Container, "运行时对象 / 编译结果").length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      findSvgTextNodesByContent(
        page14Container,
        "UE PSO 记录描述；Gfx PSO 是运行时对象 / 编译结果",
      ).length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      findSvgTextNodesByContent(
        page14Container,
        "注：Vulkan / Metal = BSS + State，OpenGL = BSS（无显式 State）",
      ).length,
    ).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page14Container, ".rec.upipelinecache").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page14Container, "stablepc.csv").length).toBe(0);
    expect(page14Container.querySelector('[data-testid="page14-ue-to-gfx-arrow"]')).not.toBeNull();
    expect(page14Container.querySelector('[data-testid="page14-gfx-to-gpu-arrow"]')).not.toBeNull();
    expect(page14Container.querySelector('[data-testid="page14-ue-to-rec-arrow"]')).not.toBeNull();

    unmount();
    setLegacyFrame(798);
    const {container: page15Container, unmount: unmount15} = render(
      <MyComposition variantId="bus-clean" />,
    );

    expect(findSvgTextNodesByContent(page15Container, "构建机").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page15Container, ".ushaderbytecode").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page15Container, "rec.upipelinecache").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page15Container, "stablepc.csv").length).toBe(0);

    unmount15();
    setLegacyFrame(852);
    const {container: page16Container, unmount: unmount16} = render(
      <MyComposition variantId="bus-clean" />,
    );

    expect(findSvgTextNodesByContent(page16Container, "expand").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page16Container, "rec.upipelinecache").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page16Container, ".scl.csv").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page16Container, "stablepc.csv").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page16Container, "H_old").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page16Container, "K1").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page16Container, "K2").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page16Container, "stable.upipelinecache").length).toBe(0);

    unmount16();
    setLegacyFrame(942);
    const {container: page17Container, unmount: unmount17} = render(
      <MyComposition variantId="bus-clean" />,
    );

    expect(findSvgTextNodesByContent(page17Container, "build").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page17Container, ".scl.csv").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page17Container, "stablepc.csv").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page17Container, "stable.").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page17Container, "upipelinecache").length).toBeGreaterThanOrEqual(1);
    expect(
      findSvgTextNodesByContent(page17Container, "所有历史版本的稳定UE PSO").length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      findSvgTextNodesByContent(page17Container, "当前版本Cook出来的双向映射").length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      findSvgTextNodesByContent(page17Container, "当前包体可以用作预编译的UE PSO").length,
    ).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page17Container, "K1").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page17Container, "K2").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page17Container, "H_a").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page17Container, "H_b").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page17Container, "expand").length).toBe(0);

    unmount17();
    setLegacyFrame(1032);
    const {container, unmount: unmount18} = render(<MyComposition variantId="bus-clean" />);

    expect(findSvgTextNodesByContent(container, "构建机").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, ".ushaderbytecode").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, "预编译如何发生").length).toBe(0);
    expect(findSvgTextNodesByContent(container, "stablepc.csv").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, "stable.").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, "expand").length).toBeGreaterThanOrEqual(1);

    unmount18();
    mockFrame = resolveRemotionStepFrame("page_19") + 60;
    const {container: page19Container} = render(<MyComposition variantId="bus-clean" />);

    expect(
      findSvgTextNodesByContent(page19Container, "stable.upipelinecache").some(
        (node) => effectiveOpacity(node) > 0.16,
      ),
    ).toBe(true);
    expect(
      findSvgTextNodesByContent(page19Container, "UE PSO").some(
        (node) => effectiveOpacity(node) > 0.16,
      ),
    ).toBe(true);
    expect(findSvgTextNodesByContent(page19Container, "UEPSO x N").length).toBe(0);
    expect(findSvgTextNodesByContent(page19Container, "GPU").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page19Container, "VertexData").length).toBe(0);
    expect(findSvgTextNodesByContent(page19Container, "Pixels").length).toBe(0);
    expect(findSvgTextNodesByContent(page19Container, "内存中GfxPSO").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page19Container, "硬盘中的 PSO").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page19Container, "PSO 1").length).toBe(0);
    expect(findSvgTextNodesByContent(page19Container, "PSO 2").length).toBe(0);
    expect(findSvgTextNodesByContent(page19Container, "PSO ...").length).toBe(0);
    expect(findSvgTextNodesByContent(page19Container, "OpenGL").length).toBe(0);
    expect(findSvgTextNodesByContent(page19Container, "Program Binary").length).toBe(0);
    expect(findSvgTextNodesByContent(page19Container, "Vulkan").length).toBe(0);
    expect(findSvgTextNodesByContent(page19Container, "Pipeline Cache").length).toBe(0);
    expect(findSvgTextNodesByContent(page19Container, "Metal").length).toBe(1);
    expect(findSvgTextNodesByContent(page19Container, "Binary Archive").length).toBe(0);
    expect(findSvgTextNodesByContent(page19Container, "系统管理").length).toBe(0);
    expect(findSvgTextNodesByContent(page19Container, "VulkanPSO.cache").length).toBe(0);
    expect(findSvgTextNodesByContent(page19Container, "functions.data").length).toBe(0);
    expect(findSvgTextNodesByContent(page19Container, "Precompile").length).toBe(0);
  });

  it("renders page 14 as a split UE-PSO and Gfx-PSO explanation board", () => {
    mockFrame = resolveRemotionStepFrame("page_14");
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const highestOpacityNode = (label: string) =>
      findSvgTextNodesByContent(container, label)
        .sort((left, right) => effectiveOpacity(right) - effectiveOpacity(left))[0];
    const nearestBoxRect = (node: Element | undefined) => {
      let current = node?.closest("g") ?? null;

      while (current && !current.querySelector("rect")) {
        current = current.parentElement?.closest("g") ?? null;
      }

      return current?.querySelector("rect") ?? null;
    };
    const ueLabel = highestOpacityNode("UE PSO");
    const gfxLabel = highestOpacityNode("Gfx PSO");
    const gpuLabel = highestOpacityNode("GPU");
    const recLabel = highestOpacityNode(".rec.upipelinecache");
    const recordLabel = highestOpacityNode("record / save");
    const createLabel = highestOpacityNode("create / resolve");
    const bindLabel = highestOpacityNode("bind / use");
    const ueRect = nearestBoxRect(ueLabel);
    const gfxRect = nearestBoxRect(gfxLabel);
    const recordRect = nearestBoxRect(recordLabel);
    const createRect = nearestBoxRect(createLabel);
    const bindRect = nearestBoxRect(bindLabel);
    const ueToGfxArrow = container.querySelector('[data-testid="page14-ue-to-gfx-arrow"]');
    const gfxToGpuArrow = container.querySelector('[data-testid="page14-gfx-to-gpu-arrow"]');
    const ueToRecArrow = container.querySelector('[data-testid="page14-ue-to-rec-arrow"]');
    const ueToRecVertices = parsePolylineVertices(ueToRecArrow);
    const ueToGfxPoints = parseSimplePathPoints(ueToGfxArrow);
    const gfxToGpuPoints = parseSimplePathPoints(gfxToGpuArrow);
    const phoneRuntimeRoot = gpuLabel
      ?.closest('[data-testid="page10-phone-runtime"]')
      ?.parentElement;
    const renderedGpuX =
      textX(gpuLabel) +
      (parseLeadingTranslate(phoneRuntimeRoot?.getAttribute("transform"))?.x ?? 0);

    expect(ueLabel).toBeDefined();
    expect(gfxLabel).toBeDefined();
    expect(gpuLabel).toBeDefined();
    expect(recLabel).toBeDefined();
    expect(recordLabel).toBeDefined();
    expect(createLabel).toBeDefined();
    expect(bindLabel).toBeDefined();
    expect(ueRect).not.toBeNull();
    expect(gfxRect).not.toBeNull();
    expect(recordRect).not.toBeNull();
    expect(createRect).not.toBeNull();
    expect(bindRect).not.toBeNull();
    expect(findSvgTextNodesByContent(container, "ShaderHash + State").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, "RHI / driver object").length).toBeGreaterThanOrEqual(1);
    expect(
      findSvgTextNodesByContent(container, "UE PSO 记录描述；Gfx PSO 是运行时对象 / 编译结果").length,
    ).toBeGreaterThanOrEqual(1);
    expect(fontSizeOf(ueLabel)).toBeGreaterThanOrEqual(20.5);
    expect(fontSizeOf(gfxLabel)).toBeGreaterThanOrEqual(20.5);
    expect(fontSizeOf(recLabel)).toBeGreaterThanOrEqual(18);
    expect(fontSizeOf(recordLabel)).toBeGreaterThanOrEqual(21);
    expect(fontSizeOf(createLabel)).toBeGreaterThanOrEqual(22);
    expect(fontSizeOf(bindLabel)).toBeGreaterThanOrEqual(22);
    expect(Math.abs(textX(recLabel) - textX(ueLabel))).toBeLessThanOrEqual(6);
    expect(Math.abs(rectCenterX(ueRect) - 300)).toBeLessThanOrEqual(6);
    expect(Math.abs(rectCenterX(gfxRect) - 732)).toBeLessThanOrEqual(6);
    expect(Math.abs(renderedGpuX - 1072)).toBeLessThanOrEqual(6);
    expect(Math.abs(rectCenterY(ueRect) - textY(gpuLabel))).toBeLessThanOrEqual(2);
    expect(Math.abs(rectCenterY(gfxRect) - textY(gpuLabel))).toBeLessThanOrEqual(2);
    expect(textX(gfxLabel) - textX(ueLabel)).toBeGreaterThanOrEqual(426);
    expect(rectMetrics(nearestBoxRect(recLabel)).width).toBeGreaterThanOrEqual(288);
    expect(Math.abs((ueToRecVertices[0]?.x ?? 0) - rectMetrics(recordRect).right)).toBeLessThanOrEqual(16);
    expect(
      Math.abs(textX(createLabel) - (((ueToGfxPoints?.x1 ?? 0) + (ueToGfxPoints?.x2 ?? 0)) / 2)),
    ).toBeLessThanOrEqual(8);
    expect(
      Math.abs(textX(bindLabel) - (((gfxToGpuPoints?.x1 ?? 0) + (gfxToGpuPoints?.x2 ?? 0)) / 2)),
    ).toBeLessThanOrEqual(8);
    expect((ueToGfxPoints?.y1 ?? 0) - rectMetrics(createRect).bottom).toBeLessThanOrEqual(40);
    expect((gfxToGpuPoints?.y1 ?? 0) - rectMetrics(bindRect).bottom).toBeLessThanOrEqual(40);
    expect((ueToRecVertices[0]?.y ?? 0) - rectMetrics(recordRect).bottom).toBeLessThanOrEqual(30);
    expect(rectMetrics(recordRect).right).toBeLessThanOrEqual(rectMetrics(createRect).x);
    expect(rectMetrics(recordRect).right).toBeLessThan(rectMetrics(createRect).x - 24);
    expect(ueToGfxArrow).not.toBeNull();
    expect(gfxToGpuArrow).not.toBeNull();
    expect(ueToRecArrow).not.toBeNull();
    expect(strokePalette(ueToGfxArrow)).toBe("#d06b44");
    expect(strokePalette(gfxToGpuArrow)).toBe("#d06b44");
    expect(strokePalette(ueToRecArrow)).toBe(LOOP_CLOUD_STROKE);
    expect(Math.abs((ueToGfxPoints?.y1 ?? 0) - textY(gpuLabel))).toBeLessThanOrEqual(2);
    expect(Math.abs((gfxToGpuPoints?.y1 ?? 0) - textY(gpuLabel))).toBeLessThanOrEqual(2);
    expect(Math.abs((ueToRecVertices[1]?.x ?? 0) - textX(ueLabel))).toBeLessThanOrEqual(72);
    expect(Math.abs((ueToRecVertices[2]?.x ?? 0) - textX(ueLabel))).toBeLessThanOrEqual(72);
    expect(parseSimplePathLength(ueToGfxArrow)).toBeGreaterThanOrEqual(120);
    expect(parseSimplePathLength(gfxToGpuArrow)).toBeGreaterThanOrEqual(156);
    expect(parseSimplePathLength(ueToRecArrow)).toBeGreaterThanOrEqual(70);
  });

  it("restores page 13 before page 15 starts growing the rec return route", () => {
    setLegacyFrame(726);
    const {container} = render(<MyComposition variantId="bus-clean" />);

    expect(findSvgTextNodesByContent(container, "Phone如何收集PSO").length).toBe(0);
    expect(findSvgTextNodesByContent(container, "Draw").length).toBe(0);
    expect(findSvgTextNodesByContent(container, "PSO").length).toBe(0);
    expect(findSvgTextNodesByContent(container, "rec.upipelinecache").length).toBe(0);
    expect(findSvgTextNodesByContent(container, ".ushaderbytecode").length).toBeGreaterThanOrEqual(1);
    expect(container.querySelector('[data-testid="page10-phone-shell"]')).not.toBeNull();
  });

  it("keeps the runtime svg free of the header-side prompt overlay copy", () => {
    mockFrame = resolveRemotionStepFrame("page_03");
    const {container} = render(<MyComposition variantId="bus-clean" />);

    expect(
      findSvgTextNodesByContent(container, "Q: 为什么需要预编译着色器？").some(
        (node) => effectiveOpacity(node) > 0.16,
      ),
    ).toBe(false);
    expect(container.querySelector('[data-testid^="slide-prompt-overlay-"]')).toBeNull();
  });

  it("separates the two phone ingress arrows from the cloud-blue loop arrows on pages 13 to 17", () => {
    mockFrame = resolveRemotionStepFrame("page_13") + 24;
    const {container: page13Container, unmount: unmount13} = render(
      <MyComposition variantId="bus-clean" />,
    );

    expect(
      strokePalette(page13Container.querySelector('[data-testid="page13-bytecode-to-phone-arrow"]')),
    ).toBe("#d06b44");

    unmount13();
    mockFrame = resolveRemotionStepFrame("page_16") + 24;
    const {container: page16Container, unmount: unmount16} = render(
      <MyComposition variantId="bus-clean" />,
    );

    expect(
      strokePalette(page16Container.querySelector('[data-testid="page16-rec-to-expand-arrow"]')),
    ).toBe(LOOP_CLOUD_STROKE);
    expect(
      strokePalette(page16Container.querySelector('[data-testid="page16-scl-to-expand-arrow"]')),
    ).toBe(LOOP_CLOUD_STROKE);
    expect(
      strokePalette(page16Container.querySelector('[data-testid="page16-expand-to-stablepc-arrow"]')),
    ).toBe(LOOP_CLOUD_STROKE);

    unmount16();
    mockFrame = resolveRemotionStepFrame("page_17") + 24;
    const {container: page17Container, unmount: unmount17} = render(
      <MyComposition variantId="bus-clean" />,
    );

    expect(
      strokePalette(page17Container.querySelector('[data-testid="page17-stablepc-to-build-arrow"]')),
    ).toBe(LOOP_CLOUD_STROKE);
    expect(
      strokePalette(page17Container.querySelector('[data-testid="page17-scl-to-build-arrow"]')),
    ).toBe(LOOP_CLOUD_STROKE);
    expect(
      strokePalette(page17Container.querySelector('[data-testid="page17-build-to-stableupipe-arrow"]')),
    ).toBe(LOOP_CLOUD_STROKE);

    unmount17();
    mockFrame = resolveRemotionStepFrame("page_18") + 24;
    const {container: page18Container} = render(<MyComposition variantId="bus-clean" />);

    expect(findSvgTextNodesByContent(page18Container, "构建机").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(page18Container, "Computer").length).toBe(0);
    expect(
      strokePalette(page18Container.querySelector('[data-testid="page14-phone-to-rec-arrow"]')),
    ).toBe(LOOP_CLOUD_STROKE);
    expect(
      strokePalette(page18Container.querySelector('[data-testid="page15-rec-to-computer-arrow"]')),
    ).toBe(LOOP_CLOUD_STROKE);
    expect(
      strokePalette(page18Container.querySelector('[data-testid="page15-merge-to-stable-arrow"]')),
    ).toBe(LOOP_CLOUD_STROKE);
    expect(
      strokePalette(page18Container.querySelector('[data-testid="page15-stable-to-phone-arrow"]')),
    ).toBe("#d06b44");
  });

  it("widens the page 16 and 17 top cards so semantic titles stay on one line and version tags drop below", () => {
    const highestOpacityNode = (container: HTMLElement, label: string) =>
      findSvgTextNodesByContent(container, label)
        .sort((left, right) => effectiveOpacity(right) - effectiveOpacity(left))[0];
    const nearestBoxRect = (node: Element | undefined) => {
      let current = node?.closest("g") ?? null;

      while (current && !current.querySelector("rect")) {
        current = current.parentElement?.closest("g") ?? null;
      }

      return current?.querySelector("rect") ?? null;
    };

    mockFrame = resolveRemotionStepFrame("page_16") + 24;
    const {container: page16Container, unmount: unmount16} = render(
      <MyComposition variantId="bus-clean" />,
    );

    const historyTitle = highestOpacityNode(page16Container, "ShaderHash + State");
    const historyVersion = highestOpacityNode(page16Container, "（历史版本）");
    const historyFile = highestOpacityNode(page16Container, "rec.upipelinecache");
    const stableTitle = highestOpacityNode(page16Container, "ShaderStableKey + State");
    const stableFile = highestOpacityNode(page16Container, "stablepc.csv");
    const mappingTitle = highestOpacityNode(page16Container, "ShaderHash <-> ShaderStableKey");
    const mappingFile = highestOpacityNode(page16Container, ".scl.csv");
    const historyRect = nearestBoxRect(historyTitle);
    const stableRect = nearestBoxRect(stableTitle);
    const mappingRect = nearestBoxRect(mappingTitle);

    expect(historyTitle).toBeDefined();
    expect(historyVersion).toBeDefined();
    expect(historyFile).toBeDefined();
    expect(stableTitle).toBeDefined();
    expect(stableFile).toBeDefined();
    expect(mappingTitle).toBeDefined();
    expect(mappingFile).toBeDefined();
    expect(historyRect).not.toBeNull();
    expect(stableRect).not.toBeNull();
    expect(mappingRect).not.toBeNull();
    expect(rectMetrics(historyRect).width).toBeGreaterThanOrEqual(344);
    expect(rectMetrics(stableRect).width).toBeGreaterThanOrEqual(344);
    expect(rectMetrics(mappingRect).width).toBeGreaterThanOrEqual(320);
    expect(textY(historyTitle)).toBeLessThan(textY(historyVersion));
    expect(textY(historyVersion)).toBeLessThan(textY(historyFile));
    expect(fontSizeOf(historyVersion)).toBeLessThan(fontSizeOf(historyTitle));
    expect(Math.abs(textX(historyTitle) - rectCenterX(historyRect))).toBeLessThanOrEqual(2);
    expect(Math.abs(textX(stableTitle) - rectCenterX(stableRect))).toBeLessThanOrEqual(2);
    expect(Math.abs(textX(mappingTitle) - rectCenterX(mappingRect))).toBeLessThanOrEqual(2);
    expect(findSvgTextNodesByContent(page16Container, "ShaderStableKey").length).toBe(0);
    expect(findSvgTextNodesByContent(page16Container, "ShaderHash <->").length).toBe(0);

    unmount16();
    mockFrame = resolveRemotionStepFrame("page_17") + 24;
    const {container: page17Container} = render(<MyComposition variantId="bus-clean" />);

    const currentTitle = highestOpacityNode(page17Container, "ShaderHash + State");
    const currentVersion = highestOpacityNode(page17Container, "（当前版本）");
    const currentFile = highestOpacityNode(page17Container, "stable.upipelinecache");
    const page17StableTitle = highestOpacityNode(page17Container, "ShaderStableKey + State");
    const page17StableFile = highestOpacityNode(page17Container, "stablepc.csv");
    const page17MappingTitle = highestOpacityNode(
      page17Container,
      "ShaderHash <-> ShaderStableKey",
    );
    const page17MappingFile = highestOpacityNode(page17Container, ".scl.csv");
    const currentRect = nearestBoxRect(currentTitle);
    const page17StableRect = nearestBoxRect(page17StableTitle);
    const page17MappingRect = nearestBoxRect(page17MappingTitle);

    expect(currentTitle).toBeDefined();
    expect(currentVersion).toBeDefined();
    expect(currentFile).toBeDefined();
    expect(page17StableTitle).toBeDefined();
    expect(page17StableFile).toBeDefined();
    expect(page17MappingTitle).toBeDefined();
    expect(page17MappingFile).toBeDefined();
    expect(currentRect).not.toBeNull();
    expect(page17StableRect).not.toBeNull();
    expect(page17MappingRect).not.toBeNull();
    expect(rectMetrics(currentRect).width).toBeGreaterThanOrEqual(344);
    expect(rectMetrics(page17StableRect).width).toBeGreaterThanOrEqual(344);
    expect(rectMetrics(page17MappingRect).width).toBeGreaterThanOrEqual(320);
    expect(textY(currentTitle)).toBeLessThan(textY(currentVersion));
    expect(textY(currentVersion)).toBeLessThan(textY(currentFile));
    expect(fontSizeOf(currentVersion)).toBeLessThan(fontSizeOf(currentTitle));
    expect(Math.abs(textX(currentTitle) - rectCenterX(currentRect))).toBeLessThanOrEqual(2);
    expect(Math.abs(textX(page17StableTitle) - rectCenterX(page17StableRect))).toBeLessThanOrEqual(2);
    expect(Math.abs(textX(page17MappingTitle) - rectCenterX(page17MappingRect))).toBeLessThanOrEqual(2);
    expect(findSvgTextNodesByContent(page17Container, "ShaderStableKey").length).toBe(0);
    expect(findSvgTextNodesByContent(page17Container, "ShaderHash <->").length).toBe(0);
  });

  it("renders merged page 19 as one centered precompile-to-cache diagram", () => {
    mockFrame = resolveRemotionStepFrame("page_19") + 8;
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const stableRect = container.querySelector('[data-geometry-node-id="stable"] rect');
    const gfxRect = container.querySelector('[data-geometry-node-id="gfx-pso"] rect');
    const diskRect = container.querySelector('[data-geometry-node-id="disk-group"] rect');
    const stableTitle = findSvgTextNodesByContent(container, "stable.upipelinecache").find(
      (node) => effectiveOpacity(node) > 0.16,
    );
    const uePsoLabel = findSvgTextNodesByContent(container, "UE PSO").find(
      (node) => effectiveOpacity(node) > 0.16,
    );
    const gpuLabels = findSvgTextNodesByContent(container, "GPU");
    const gfxTitle = findSvgTextNodesByContent(container, "内存中GfxPSO")[0];
    const diskTitle = findSvgTextNodesByContent(container, "硬盘中的 PSO")[0];
    const rawTextContent = Array.from(container.querySelectorAll("text")).map(
      (node) => node.textContent?.trim(),
    );

    expect(stableTitle).toBeDefined();
    expect(uePsoLabel).toBeDefined();
    expect(findSvgTextNodesByContent(container, "UE PSO x N").length).toBe(0);
    expect(rawTextContent).toContain("UE PSO");
    expect(findSvgTextNodesByContent(container, "GPU").length).toBeGreaterThanOrEqual(1);
    expect(container.querySelectorAll('[data-testid="vertex-icon"]').length).toBeGreaterThanOrEqual(1);
    expect(container.querySelectorAll('[data-testid="pixel-grid"]').length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, "VertexData").length).toBe(0);
    expect(findSvgTextNodesByContent(container, "Pixels").length).toBe(0);
    expect(findSvgTextNodesByContent(container, "PSO 1").length).toBe(0);
    expect(findSvgTextNodesByContent(container, "PSO 2").length).toBe(0);
    expect(findSvgTextNodesByContent(container, "PSO ...").length).toBe(0);
    expect(findSvgTextNodesByContent(container, "UE 1").length).toBe(0);
    expect(findSvgTextNodesByContent(container, "UE 2").length).toBe(0);
    expect(findSvgTextNodesByContent(container, "内存中GfxPSO").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, "OpenGL").length).toBe(0);
    expect(findSvgTextNodesByContent(container, "Program Binary").length).toBe(0);
    expect(findSvgTextNodesByContent(container, "Vulkan").length).toBe(0);
    expect(findSvgTextNodesByContent(container, "Pipeline Cache").length).toBe(0);
    expect(findSvgTextNodesByContent(container, "Metal").length).toBe(1);
    expect(findSvgTextNodesByContent(container, "Binary Archive").length).toBe(0);
    expect(findSvgTextNodesByContent(container, "系统管理").length).toBe(0);
    expect(findSvgTextNodesByContent(container, "硬盘中的 PSO").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, "VulkanPSO.cache").length).toBe(0);
    expect(findSvgTextNodesByContent(container, "functions.data").length).toBe(0);
    expect(findSvgTextNodesByContent(container, "Shader / State").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, "codegen / 映射").length).toBeGreaterThanOrEqual(1);
    expect(
      findSvgTextNodesByContent(container, "OS / Driver / GPU / API").length,
    ).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, "binary / cache 不是稳定接口。").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, "Binary Archive 2 ?").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, "Precompile").length).toBe(0);
    expect(Math.abs(rectMetrics(stableRect).width - rectMetrics(gfxRect).width)).toBeLessThanOrEqual(1);
    expect(Math.abs(rectMetrics(gfxRect).width - rectMetrics(diskRect).width)).toBeLessThanOrEqual(1);
    expect(
      Math.abs(rectMetrics(gfxRect).x + rectMetrics(gfxRect).width / 2 - 640),
    ).toBeLessThanOrEqual(1);
    expect(
      Math.abs(rectMetrics(stableRect).x - (1280 - rectMetrics(diskRect).right)),
    ).toBeLessThanOrEqual(1);
    expect(
      Math.abs(
        rectMetrics(gfxRect).x - rectMetrics(stableRect).right -
          (rectMetrics(diskRect).x - rectMetrics(gfxRect).right),
      ),
    ).toBeLessThanOrEqual(1);
    expect(rectMetrics(stableRect).height).toBeLessThanOrEqual(240);
    expect(rectMetrics(gfxRect).height).toBeLessThanOrEqual(240);
    expect(rectMetrics(diskRect).height).toBeLessThanOrEqual(240);
    expect(fontSizeOf(uePsoLabel)).toBeGreaterThanOrEqual(34);
    expect(fontSizeOf(stableTitle)).toBeGreaterThanOrEqual(16.5);
    expect(fontSizeOf(uePsoLabel)).toBeGreaterThan(fontSizeOf(stableTitle));
    expect(textY(uePsoLabel)).toBeLessThan(textY(stableTitle));
    expect(Math.max(...gpuLabels.map((node) => fontSizeOf(node)))).toBeGreaterThanOrEqual(52);
    expect(fontSizeOf(gfxTitle)).toBeGreaterThanOrEqual(30);
    expect(fontSizeOf(diskTitle)).toBeGreaterThanOrEqual(30);
  });

  it("keeps the page 18 image handoff from flashing back to the old loop stage", () => {
    const fromFrame = resolveRemotionStepFrame("page_18_img");
    const toFrame = resolveRemotionStepFrame("page_19");
    mockFrame = fromFrame + Math.round((toFrame - fromFrame) * 0.7);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const visiblePrecompileImage = Array.from(container.querySelectorAll("image")).filter(
      (node) =>
        node.getAttribute("href") === "/supplement/pso-precompile-smooth-peak.png" &&
        effectiveOpacity(node) > 0.08,
    );
    const visiblePage19Nodes = [
      ...findSvgTextNodesByContent(container, "stable.upipelinecache"),
      ...findSvgTextNodesByContent(container, "UE PSO"),
      ...findSvgTextNodesByContent(container, "内存中GfxPSO"),
    ].filter((node) => effectiveOpacity(node) > 0.08);

    expect(findVisibleLegacyLoopNodes(container).length).toBe(0);
    expect(visiblePrecompileImage.length + visiblePage19Nodes.length).toBeGreaterThan(0);
  });

  it("fully restores the page 18 blue-loop carrier before the page 21 player view takes over", () => {
    const fromFrame = resolveRemotionStepFrame("page_19");
    const toFrame = resolveRemotionStepFrame("page_21");
    mockFrame = fromFrame + Math.round((toFrame - fromFrame) * 0.3);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const callbackStage = container.querySelector('[data-testid="page21-callback-stage"]');
    const callbackShift = parseLeadingTranslate(callbackStage?.getAttribute("transform"));

    expect(callbackStage).not.toBeNull();
    expect(effectiveOpacity(callbackStage)).toBeGreaterThan(0.18);
    expect(Math.abs(callbackShift?.x ?? 999)).toBeLessThanOrEqual(24);
    expect(
      findSvgTextNodesByContent(container, "cook").filter(
        (node) => effectiveOpacity(node) > 0.08,
      ),
    ).toHaveLength(1);
    expect(
      findSvgTextNodesByContent(container, "rec.upipelinecache").filter(
        (node) => effectiveOpacity(node) > 0.08,
      ).length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      findSvgTextNodesByContent(container, "stablepc.csv").filter(
        (node) => effectiveOpacity(node) > 0.08,
      ).length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      strokePalette(container.querySelector('[data-testid="page21-callback-cook-arrow"]')),
    ).toBe(LOOP_CLOUD_STROKE);
    expect(
      strokePalette(
        container.querySelector('[data-testid="page21-callback-rec-to-computer-arrow"]'),
      ),
    ).toBe(LOOP_CLOUD_STROKE);
    expect(
      strokePalette(
        container.querySelector('[data-testid="page21-callback-merge-to-stable-arrow"]'),
      ),
    ).toBe(LOOP_CLOUD_STROKE);
    expect(container.querySelector('[data-testid="page21-callback-phone"]')).toBeNull();
    expect(container.querySelector('[data-geometry-node-id="page21-callback-pso"]')).toBeNull();
    expect(
      container.querySelector('[data-geometry-node-id="page21-callback-shader"]'),
    ).toBeNull();
    expect(container.querySelector('[data-testid="page21-pso-to-phone-arrow"]')).not.toBeNull();
    expect(
      container.querySelector('[data-testid="page21-shader-to-phone-arrow"]'),
    ).not.toBeNull();
    expect(
      effectiveOpacity(container.querySelector('[data-testid="page21-player-phone"]')),
    ).toBeGreaterThan(0.08);
  });

  it("holds the restored page 18 carrier before shifting it left out", () => {
    const fromFrame = resolveRemotionStepFrame("page_19");
    const toFrame = resolveRemotionStepFrame("page_21");
    const holdFrame = fromFrame + Math.round((toFrame - fromFrame) * 0.5);
    const exitFrame = fromFrame + Math.round((toFrame - fromFrame) * 0.58);

    mockFrame = holdFrame;
    const {container: holdContainer, unmount} = render(
      <MyComposition variantId="bus-clean" />,
    );
    const holdStage = holdContainer.querySelector('[data-testid="page21-callback-stage"]');
    const holdShift = parseLeadingTranslate(holdStage?.getAttribute("transform"));

    expect(effectiveOpacity(holdStage)).toBeGreaterThan(0.18);
    expect(Math.abs(holdShift?.x ?? 999)).toBeLessThanOrEqual(24);
    expect(findVisibleLegacyLoopNodes(holdContainer).length).toBeGreaterThanOrEqual(5);
    expect(holdContainer.querySelector('[data-testid="page21-callback-phone"]')).toBeNull();
    expect(
      effectiveOpacity(holdContainer.querySelector('[data-testid="page21-player-phone"]')),
    ).toBeGreaterThan(0.18);

    unmount();
    mockFrame = exitFrame;
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const callbackStage = container.querySelector('[data-testid="page21-callback-stage"]');
    const callbackShift = parseLeadingTranslate(callbackStage?.getAttribute("transform"));

    expect(container.querySelector('[data-testid="scene-base-layer"]')).not.toBeNull();
    expect(container.querySelectorAll("text, rect, image").length).toBeGreaterThan(0);
    expect(effectiveOpacity(callbackStage)).toBeGreaterThan(0.04);
    expect(callbackShift?.x).toBeLessThan(-90);
    expect(findVisibleLegacyLoopNodes(container).length).toBeGreaterThanOrEqual(4);
    expect(
      effectiveOpacity(container.querySelector('[data-testid="page21-player-phone"]')),
    ).toBeGreaterThan(0.18);
  });

  it("renders page 21 as a player-facing delivery page with two technical assets feeding the phone", () => {
    setLegacyFrame(1464);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const phoneTransformNode = container.querySelector('[data-testid="page21-player-phone"] > g');
    const phoneOffset = parseLeadingTranslate(phoneTransformNode?.getAttribute("transform"));
    const psoRouteVertices = parsePolylineVertices(
      container.querySelector('[data-testid="page21-pso-to-phone-arrow"]'),
    );
    const shaderRouteVertices = parsePolylineVertices(
      container.querySelector('[data-testid="page21-shader-to-phone-arrow"]'),
    );

    expect(findTextNodes(container, "stable.upipelinecache")[0]).toBeDefined();
    expect(findTextNodes(container, "ShaderLibrary")[0]).toBeDefined();
    expect(findTextNodes(container, ".ushaderbytecode")[0]).toBeDefined();
    expect(findTextNodes(container, "玩家")[0]).toBeDefined();
    expect(
      findTextNodes(
        container,
        "玩家拿到 stable.upipelinecache + ShaderLibrary 后，运行时更不容易卡顿。",
      )[0],
    ).toBeDefined();
    expect(container.querySelector('[data-testid="page21-pso-to-phone-arrow"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="page21-shader-to-phone-arrow"]')).not.toBeNull();
    expect(psoRouteVertices).toHaveLength(2);
    expect(shaderRouteVertices).toHaveLength(2);
    expect(Math.abs(psoRouteVertices[0]!.y - psoRouteVertices[1]!.y)).toBeLessThanOrEqual(1);
    expect(Math.abs(shaderRouteVertices[0]!.y - shaderRouteVertices[1]!.y)).toBeLessThanOrEqual(1);
    expect(phoneOffset?.x).toBeLessThan(-250);
    expect(
      effectiveOpacity(container.querySelector('[data-testid="page21-callback-stage"]')),
    ).toBeLessThan(0.02);
    expect(
      findSvgTextNodesByContent(container, "cook").filter(
        (node) => effectiveOpacity(node) > 0.08,
      ),
    ).toHaveLength(0);
    expect(findTextNodes(container, "什么时候会失效？")).toHaveLength(0);
  });

  it("renders page 22 as a five-step rebuttal table while keeping the PSO cost verdict", () => {
    setLegacyFrame(1554);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const leftRect = container.querySelector(
      '[data-geometry-node-id="left-column"] [data-geometry-node-box="1"] rect',
    );
    const factsRect = container.querySelector(
      '[data-geometry-node-id="facts-column"] [data-geometry-node-box="1"] rect',
    );
    const rightRect = container.querySelector(
      '[data-geometry-node-id="right-column"] [data-geometry-node-box="1"] rect',
    );
    const leftHeading = findTextNodes(container, "非要这么干？")[0];
    const factsHeading = findTextNodes(container, "事实")[0];
    const rightHeading = findTextNodes(container, "那就会这样")[0];
    const leftCopy = findTextNodes(container, "不打开 SharedShaderCode")[0];
    const rightCopy = findTextNodes(container, "构建机上能用，玩家机器上不一定能用。")[0];
    const sampleBImage = container.querySelector('[data-geometry-node-id="sample-b-strip"] image');
    const leftGapArrow = container.querySelector('[data-testid="page22-left-gap-arrow"]');
    const rightGapArrow = container.querySelector('[data-testid="page22-right-gap-arrow"]');
    const leftGapArrowPoints = parseSimplePathPoints(leftGapArrow);
    const rightGapArrowPoints = parseSimplePathPoints(rightGapArrow);
    const factBadges = [
      "page22-fact-badge-row0-fact6",
      "page22-fact-badge-row0-fact8",
      "page22-fact-badge-row1-fact5",
      "page22-fact-badge-row2-fact12",
      "page22-fact-badge-row2-fact13",
      "page22-fact-badge-row3-fact2",
      "page22-fact-badge-row3-fact9",
      "page22-fact-badge-row4-fact10",
      "page22-fact-badge-row4-fact11",
    ];
    const factGlows = [
      "page22-fact-glow-row0-fact6",
      "page22-fact-glow-row0-fact8",
      "page22-fact-glow-row1-fact5",
      "page22-fact-glow-row2-fact12",
      "page22-fact-glow-row2-fact13",
      "page22-fact-glow-row3-fact2",
      "page22-fact-glow-row3-fact9",
      "page22-fact-glow-row4-fact10",
      "page22-fact-glow-row4-fact11",
    ];

    expect(findTextNodes(container, "前文收束")).toHaveLength(0);
    expect(findTextNodes(container, "非要这么干？")[0]).toBeDefined();
    expect(findTextNodes(container, "事实")[0]).toBeDefined();
    expect(findTextNodes(container, "那就会这样")[0]).toBeDefined();
    expect(findTextNodes(container, "不打开 SharedShaderCode")[0]).toBeDefined();
    expect(findTextNodes(container, "01")).toHaveLength(0);
    expect(findTextNodes(container, "02")).toHaveLength(0);
    expect(findTextNodes(container, "03")).toHaveLength(0);
    expect(findTextNodes(container, "04")).toHaveLength(0);
    expect(findTextNodes(container, "05")).toHaveLength(0);
    expect(findTextNodes(container, "06")).toHaveLength(0);
    expect(findTextNodes(container, "07")).toHaveLength(0);
    expect(findTextNodes(container, "08")).toHaveLength(0);
    expect(factBadges).toHaveLength(9);
    for (const testId of factBadges) {
      expect(container.querySelector(`[data-testid="${testId}"]`)).not.toBeNull();
    }
    expect(findTextNodes(container, "UE PSO 存 ShaderHash 索引")).toHaveLength(0);
    expect(findTextNodes(container, "Shared 全局持有 ShaderCode / 索引")).toHaveLength(0);
    expect(
      findTextNodes(container, "PSO 收集了之后也没法应用到下一次；")[0],
    ).toBeDefined();
    expect(findTextNodes(container, "直接分发构建机构建的二进制")[0]).toBeDefined();
    expect(findTextNodes(container, "二进制强依赖")).toHaveLength(0);
    expect(findTextNodes(container, "OS / 驱动 / 芯片")).toHaveLength(0);
    expect(findTextNodes(container, "构建机上能用，玩家机器上不一定能用。")[0]).toBeDefined();
    expect(findTextNodes(container, ".rec.upipelinecache")[0]).toBeDefined();
    expect(findTextNodes(container, "Phone rec -> Expand / Build -> Phone stable")).toHaveLength(0);
    expect(findTextNodes(container, "新包里的 Hash，和旧包可能早就对不上了。")[0]).toBeDefined();
    expect(factGlows).toHaveLength(9);
    for (const testId of factGlows) {
      expect(container.querySelector(`[data-testid="${testId}"]`)).not.toBeNull();
    }
    expect(leftGapArrow).not.toBeNull();
    expect(rightGapArrow).not.toBeNull();
    expect(Math.abs((leftGapArrowPoints?.x1 ?? 0) - (leftGapArrowPoints?.x2 ?? 0))).toBeLessThanOrEqual(1);
    expect(Math.abs((rightGapArrowPoints?.x1 ?? 0) - (rightGapArrowPoints?.x2 ?? 0))).toBeLessThanOrEqual(1);
    expect(leftGapArrowPoints?.y2).toBeGreaterThan(leftGapArrowPoints?.y1 ?? Infinity);
    expect(rightGapArrowPoints?.y2).toBeGreaterThan(rightGapArrowPoints?.y1 ?? Infinity);
    expect(sampleBImage).not.toBeNull();
    expect(findTextNodes(container, "样本 B")).toHaveLength(0);
    expect(Number(leftRect?.getAttribute("width"))).toBe(Number(rightRect?.getAttribute("width")));
    expect(Number(leftRect?.getAttribute("width"))).toBeGreaterThan(
      Number(factsRect?.getAttribute("width")),
    );
    expect(Math.abs(Number(leftHeading?.getAttribute("x")) - rectCenterX(leftRect))).toBeLessThanOrEqual(1);
    expect(Math.abs(Number(factsHeading?.getAttribute("x")) - rectCenterX(factsRect))).toBeLessThanOrEqual(1);
    expect(Math.abs(Number(rightHeading?.getAttribute("x")) - rectCenterX(rightRect))).toBeLessThanOrEqual(1);
    expect(Number(leftCopy?.getAttribute("font-size"))).toBeGreaterThan(18);
    expect(Number(rightCopy?.getAttribute("font-size"))).toBeGreaterThan(17);
    expect(findTextNodes(container, "PSO 的成本不会消失，只会转移。")[0]).toBeDefined();
    expect(Number(sampleBImage?.getAttribute("width"))).toBe(428);
  });

  it("renders page 28 with a vertex-buffer inset below the anonymous sample pair", () => {
    setLegacyFrame(2094);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const sampleBImage = container.querySelector('[data-geometry-node-id="image-2"] image');
    const sampleBRect = container.querySelector(
      '[data-geometry-node-id="image-2"] [data-geometry-node-box="1"] rect',
    );
    const vertexBufferRect = container.querySelector(
      '[data-testid="page28-vertex-buffer-image"] [data-geometry-node-box="1"]',
    );
    const vertexBufferImage = container.querySelector('[data-testid="page28-vertex-buffer-image"] image');
    const rightCardRect = container.querySelector(
      '[data-geometry-node-id="right-card"] [data-geometry-node-box="1"]',
    );

    expect(vertexBufferImage?.getAttribute("href")).toBe("/supplement/VertexBuffer.png");
    expect(vertexBufferRect).not.toBeNull();
    expect(vertexBufferImage?.getAttribute("width")).toBe(sampleBImage?.getAttribute("width"));
    expect(rectMetrics(vertexBufferRect).y).toBeGreaterThan(rectMetrics(sampleBRect).bottom);
    expect(rectMetrics(vertexBufferRect).bottom).toBeLessThan(606);
    expect(Math.abs(rectMetrics(rightCardRect).bottom - rectMetrics(vertexBufferRect).bottom)).toBeLessThanOrEqual(4);
    expect(findTextNodes(container, "VertexBuffer")[0]).toBeDefined();
  });

  it("keeps page 28 free from visible loop-stage nodes behind the reading board", () => {
    setLegacyFrame(2094);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const visibleLegacyNodes = findVisibleLegacyLoopNodes(container);

    expect(visibleLegacyNodes.length).toBe(0);
  });

  it("keeps page 29 free from visible loop-stage nodes behind the closing quote", () => {
    setLegacyFrame(2184);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const visibleLegacyNodes = findVisibleLegacyLoopNodes(container);

    expect(visibleLegacyNodes.length).toBe(0);
  });

  it("keeps strategy placeholder handoffs free from visible loop-stage nodes", () => {
    for (const frame of [2528, 2600, 2670, 2724, 2795, 2866]) {
      mockFrame = frame;
      const {container, unmount} = render(<MyComposition variantId="bus-clean" />);
      const visibleLegacyNodes = findVisibleLegacyLoopNodes(container);

      expect(visibleLegacyNodes.length, `frame ${frame}`).toBe(0);
      unmount();
    }
  });

  it("keeps frame 2724 on placeholder content instead of blanking to the old loop stage", () => {
    mockFrame = 2724;
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const visiblePlaceholderHeadings = findSvgTextNodesByContent(container, "这一页讲什么").filter(
      (node) => effectiveOpacity(node) > 0.08,
    );
    const visibleBridgeHeadings = findSvgTextNodesByContent(container, "和下一页怎么衔接").filter(
      (node) => effectiveOpacity(node) > 0.08,
    );

    expect(visiblePlaceholderHeadings.length + visibleBridgeHeadings.length).toBeGreaterThan(0);
  });

  it("settles the old stable loop on page 18 after the inserted placeholder pages", () => {
    setLegacyFrame(1032);
    const {container} = render(<MyComposition variantId="bus-clean" />);

    expect(findSvgTextNodesByContent(container, "rec.upipelinecache").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, "stablepc.csv").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, "stable.").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, "upipelinecache").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, "expand").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, "构建机").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, "Phone").length).toBe(0);
    expect(
      Array.from(container.querySelectorAll("text")).filter(
        (node) => node.textContent?.trim() === "+",
      ).length,
    ).toBeGreaterThanOrEqual(2);
  });

  it("keeps the page 18 stable return path outside the stable.upipelinecache text lane", () => {
    setLegacyFrame(1032);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const stableLabel = findSvgTextNodesByContent(container, "stable.").find(
      (node) => effectiveOpacity(node) > 0.2,
    );
    let stableGroup = stableLabel?.closest("g") ?? null;

    while (stableGroup && !stableGroup.querySelector("rect")) {
      stableGroup = stableGroup.parentElement?.closest("g") ?? null;
    }

    const stableRect = stableGroup?.querySelector("rect");
    const stableMetrics = rectMetrics(stableRect);
    const stableToPhoneArrow = container.querySelector(
      '[data-testid="page15-stable-to-phone-arrow"]',
    );
    const stableToPhoneVertices = parsePolylineVertices(stableToPhoneArrow);
    const topmostStableToPhoneY = Math.min(
      ...stableToPhoneVertices.map((vertex) => vertex.y),
    );
    const rightmostStableToPhoneX = Math.max(
      ...stableToPhoneVertices.map((vertex) => vertex.x),
    );

    expect(stableRect).not.toBeNull();
    expect(stableToPhoneArrow).not.toBeNull();
    expect(stableToPhoneVertices.length).toBeGreaterThanOrEqual(2);
    expect(topmostStableToPhoneY).toBeGreaterThanOrEqual(stableMetrics.bottom + 6);
    expect(rightmostStableToPhoneX).toBeGreaterThanOrEqual(stableMetrics.right + 20);
  });

  it("keeps FShader as a translated continuation from page 08 into page 09 with only a bounded width retargeting", () => {
    setLegacyFrame(342);
    const {container: page8Container, unmount} = render(<MyComposition variantId="bus-clean" />);
    const page8FShaderCard = page8Container.querySelector('[data-testid="page6-fshader-card"]');
    const page8FShaderRect = page8FShaderCard?.querySelector("rect");
    const page8FShaderTitle = findTextNodes(page8Container, "FShader").find(
      (node) => effectiveOpacity(node) > 0.2,
    );
    const page8ResourceIndex = findTextNodes(page8Container, "ResourceIndex").find(
      (node) => effectiveOpacity(node) > 0.2,
    );

    unmount();
    setLegacyFrame(378);
    const {container: page9Container} = render(<MyComposition variantId="bus-clean" />);
    const page9FShaderCard = page9Container.querySelector('[data-testid="page9-fshader-card"]');
    const page9FShaderRect = page9FShaderCard?.querySelector("rect");
    const page9FShaderTitle = findTextNodes(page9Container, "FShader").find(
      (node) => effectiveOpacity(node) > 0.2,
    );
    const page9ResourceIndex = findTextNodes(page9Container, "ResourceIndex").find(
      (node) => effectiveOpacity(node) > 0.2,
    );

    expect(page8FShaderCard).not.toBeNull();
    expect(page9FShaderCard).not.toBeNull();
    expect(Math.abs(rectMetrics(page8FShaderRect).width - rectMetrics(page9FShaderRect).width)).toBeLessThanOrEqual(14);
    expect(Math.abs(rectMetrics(page8FShaderRect).height - rectMetrics(page9FShaderRect).height)).toBeLessThanOrEqual(4);
    expect(Math.abs(fontSizeOf(page8FShaderTitle) - fontSizeOf(page9FShaderTitle))).toBeLessThanOrEqual(1);
    expect(Math.abs(fontSizeOf(page8ResourceIndex) - fontSizeOf(page9ResourceIndex))).toBeLessThanOrEqual(1);
  });

  it("keeps pages 01-04 on the original spine and only shifts the runtime axis to the right for page 05", () => {
    setLegacyFrame(54);
    const {container: page2Container, unmount} = render(
      <MyComposition variantId="bus-clean" />,
    );
    const page2Vertex = page2Container.querySelector('[data-testid="vertex-icon"]');
    const page2VertexCenter = parseLeadingTranslate(page2Vertex?.getAttribute("transform"));
    const page2Gpu = findTextNodes(page2Container, "GPU")[0];

    unmount();
    setLegacyFrame(126);
    const {container: page4Container, unmount: unmountPage4} = render(
      <MyComposition variantId="bus-clean" />,
    );
    const page4Gpu = findTextNodes(page4Container, "GPU")[0];

    unmountPage4();
    setLegacyFrame(162);
    const {container: page5Container} = render(<MyComposition variantId="bus-clean" />);
    const page5Vertex = page5Container.querySelector('[data-testid="vertex-icon"]');
    const page5VertexCenter = parseLeadingTranslate(page5Vertex?.getAttribute("transform"));
    const page5Gpu = findTextNodes(page5Container, "GPU")[0];

    expect(page2VertexCenter?.x).toBe(285);
    expect(Number(page2Gpu?.getAttribute("x"))).toBe(640);
    expect(Number(page4Gpu?.getAttribute("x"))).toBe(640);
    expect(page5VertexCenter?.x).toBeGreaterThan(285);
    expect(Number(page5Gpu?.getAttribute("x"))).toBeGreaterThan(640);
  });

  it("lays out page 05 with Mesh on the main-axis left side and a clean Material -> Cooked asset band", () => {
    setLegacyFrame(162);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const meshGroup = findBoxGroupByLabel(container, "Mesh");
    const materialGroup = findBoxGroupByLabel(container, "Material");
    const cookedGroup = findBoxGroupByLabel(container, "Cooked");
    const vertexIcon = container.querySelector('[data-testid="vertex-icon"]');
    const meshRect = meshGroup?.querySelector("rect");
    const materialRect = materialGroup?.querySelector("rect");
    const cookedRect = cookedGroup?.querySelector("rect");
    const vertexCenter = parseLeadingTranslate(vertexIcon?.getAttribute("transform"));
    const sharedHorizontalArrow = container.querySelector(
      '[data-testid="shared-upper-horizontal-arrow"]',
    );
    const sharedVerticalArrow = container.querySelector(
      '[data-testid="shared-upper-vertical-arrow"]',
    );
    const meshArrow = container.querySelector('[data-testid="page5-mesh-arrow"]');

    const meshX = Number(meshRect?.getAttribute("x"));
    const meshRight = meshX + Number(meshRect?.getAttribute("width"));
    const meshCenterY =
      Number(meshRect?.getAttribute("y")) + Number(meshRect?.getAttribute("height")) / 2;
    const materialX = Number(materialRect?.getAttribute("x"));
    const materialRight = materialX + Number(materialRect?.getAttribute("width"));
    const materialCenterX = rectCenterX(materialRect);
    const cookedX = Number(cookedRect?.getAttribute("x"));
    const cookedCenterX = rectCenterX(cookedRect);
    const materialToCookedGap = cookedX - materialRight;
    const runtimeLeftX = (vertexCenter?.x ?? 0) - 75;
    const runtimeCenterX = Number(findTextNodes(container, "GPU")[0]?.getAttribute("x"));
    const runtimeCenterBoxX = runtimeCenterX - 220;
    const runtimeRawGap = runtimeCenterBoxX - ((vertexCenter?.x ?? 0) + 75);
    const meshRawGap = runtimeLeftX - meshRight;

    expect(meshRawGap).toBeGreaterThanOrEqual(44);
    expect(Math.abs(meshCenterY - (vertexCenter?.y ?? 0))).toBeLessThanOrEqual(12);
    expect(materialToCookedGap).toBeGreaterThanOrEqual(36);
    expect(Math.abs(materialCenterX - rectCenterX(meshRect))).toBeLessThanOrEqual(12);
    expect((vertexCenter?.x ?? 0)).toBeGreaterThanOrEqual(340);
    expect(cookedCenterX).toBeGreaterThan(materialCenterX + 120);
    expect(meshRawGap).toBe(runtimeRawGap);
    expect(strokeWidthSignature(sharedHorizontalArrow)).toBe(
      strokeWidthSignature(meshArrow),
    );
    expect(strokeWidthSignature(sharedVerticalArrow)).toBe(
      strokeWidthSignature(meshArrow),
    );
  });

  it("adds a top-right PSO card on page 05 that mirrors the earlier structure card with UE PSO fields", () => {
    mockFrame = resolveRemotionStepFrame("page_05");
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const cookedGroup = findBoxGroupByLabel(container, "Cooked");
    const cookedRect = cookedGroup?.querySelector("rect");
    const page5PsoCard = container.querySelector('[data-testid="page5-page1-table-box"] rect');
    const page5PsoLink = container.querySelector('[data-testid="page5-page1-table-dashed-link"]');
    const page5PsoLinkPoints = parseSimplePathPoints(page5PsoLink);
    const psoTitle = findTextNodes(container, "UE PSO = Shaders+States+？")[0];
    const usageMaskGroup = findBoxGroupByLabel(container, "UsageMask");
    const bindCountGroup = findBoxGroupByLabel(container, "BindCount");
    const usageMaskBox = usageMaskGroup?.querySelector("rect");
    const bindCountBox = bindCountGroup?.querySelector("rect");
    const usageMaskLabel = findTextNodes(container, "UsageMask")[0];
    const bindCountLabel = findTextNodes(container, "BindCount")[0];
    const vertexDeclLabel = findTextNodes(container, "FVertexDeclaration")[0];
    const graphicsPipelineLabel = findTextNodes(container, "FGraphicsPipeline")[0];

    expect(psoTitle).toBeDefined();
    expect(findTextNodes(container, "VertexShader Hash / PixelShader Hash").length).toBeGreaterThanOrEqual(1);
    expect(usageMaskLabel).toBeDefined();
    expect(bindCountLabel).toBeDefined();
    expect(usageMaskBox).not.toBeNull();
    expect(bindCountBox).not.toBeNull();
    expect(findTextNodes(container, "UE PSO 以 ShaderHash 为索引").length).toBe(0);
    expect(findTextNodes(container, "定位对应的 ShaderCode").length).toBe(0);
    expect(findTextNodes(container, "UsageMask / BindCount").length).toBe(0);
    expect(findTextNodes(container, "UE PSO 会存什么").length).toBe(0);
    expect(findTextNodes(container, "FVertexDeclaration").length).toBeGreaterThanOrEqual(1);
    expect(findTextNodes(container, "ElementList").length).toBeGreaterThanOrEqual(1);
    expect(findTextNodes(container, "FGraphicsPipeline").length).toBeGreaterThanOrEqual(1);
    expect(findTextNodes(container, "RenderTargetsInfo").length).toBeGreaterThanOrEqual(1);
    expect(findTextNodes(container, "FDepthStencilState").length).toBeGreaterThanOrEqual(1);
    expect(findTextNodes(container, "InitializerRHI").length).toBeGreaterThanOrEqual(1);
    expect(findTextNodes(container, "FBlendStateInitializerRHI").length).toBeGreaterThanOrEqual(1);
    expect(findTextNodes(container, "FRasterizerStateInitializerRHI").length).toBeGreaterThanOrEqual(1);
    expect(findTextNodes(container, "EPrimitiveType / NumSamples").length).toBeGreaterThanOrEqual(1);
    expect(findTextNodes(container, "FRHIRenderPassInfo").length).toBeGreaterThanOrEqual(1);
    expect(page5PsoCard).not.toBeNull();
    expect(page5PsoLink).not.toBeNull();
    expect(rectMetrics(page5PsoCard).x - rectMetrics(cookedRect).right).toBeGreaterThanOrEqual(56);
    expect(rectMetrics(page5PsoCard).right).toBeLessThanOrEqual(1228);
    expect(rectMetrics(page5PsoCard).y).toBeLessThan(rectMetrics(cookedRect).y - 20);
    expect(Math.abs(textX(psoTitle) - rectCenterX(page5PsoCard))).toBeLessThanOrEqual(2);
    expect(psoTitle?.getAttribute("text-anchor")).toBe("middle");
    expect(dashSignature(page5PsoLink)).toContain("8 7");
    expect(Math.abs((page5PsoLinkPoints?.y1 ?? 0) - rectCenterY(cookedRect))).toBeLessThanOrEqual(4);
    expect(Math.abs((page5PsoLinkPoints?.x2 ?? 0) - (rectMetrics(cookedRect).right + 14))).toBeLessThanOrEqual(2);
    expect((page5PsoLinkPoints?.x1 ?? 0)).toBeGreaterThanOrEqual(
      rectMetrics(cookedRect).right + 100,
    );
    expect(Math.abs(textX(usageMaskLabel) - textX(vertexDeclLabel))).toBeLessThanOrEqual(2);
    expect(Math.abs(textX(bindCountLabel) - textX(graphicsPipelineLabel))).toBeLessThanOrEqual(2);
    expect(rectMetrics(usageMaskBox).height).toBeGreaterThanOrEqual(28);
    expect(rectMetrics(bindCountBox).height).toBeGreaterThanOrEqual(28);
    expect(usageMaskBox?.getAttribute("stroke")).not.toBe(bindCountBox?.getAttribute("stroke"));
    expect(usageMaskBox?.getAttribute("fill")).not.toBe(bindCountBox?.getAttribute("fill"));
    expect(Math.abs((textX(graphicsPipelineLabel) - textX(vertexDeclLabel)) - 204)).toBeLessThanOrEqual(2);
  });

  it("uses a pale green asset treatment for UE asset nodes on page 05", () => {
    setLegacyFrame(162);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const meshGroup = findTextNodes(container, "Mesh")[0]?.closest("g");
    const materialGroup = findTextNodes(container, "Material")[0]?.closest("g");
    const meshRect = meshGroup?.querySelector("rect");
    const materialRect = materialGroup?.querySelector("rect");

    expect(meshRect?.getAttribute("fill")).toBe("rgba(231, 242, 233, 0.98)");
    expect(materialRect?.getAttribute("fill")).toBe("rgba(231, 242, 233, 0.98)");
  });

  it("keeps the VertexData icon visible on page 05 instead of reducing it to text only", () => {
    setLegacyFrame(54);
    const {container: page2Container, unmount} = render(
      <MyComposition variantId="bus-clean" />,
    );
    const page2VertexIcon = page2Container.querySelector('[data-testid="vertex-icon"]');
    const page2Scale = parseScale(page2VertexIcon?.getAttribute("transform"));

    unmount();
    setLegacyFrame(162);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const vertexIcon = container.querySelector('[data-testid="vertex-icon"]');

    expect(opacityOf(vertexIcon)).toBeGreaterThan(0.9);
    expect(parseScale(vertexIcon?.getAttribute("transform"))).toBe(page2Scale);
    expect(screen.queryByText("VertexData")).not.toBeInTheDocument();
  });

  it("renders Mesh and Material as clean asset boxes without decorative inner stripes", () => {
    setLegacyFrame(162);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const meshGroup = findBoxGroupByLabel(container, "Mesh");
    const materialGroup = findBoxGroupByLabel(container, "Material");

    expect(meshGroup?.querySelectorAll("rect")).toHaveLength(1);
    expect(materialGroup?.querySelectorAll("rect")).toHaveLength(1);
  });

  it("keeps page 01 -> page 02 in a real mid-transition state halfway through", () => {
    setLegacyFrame(36);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const inputLabels = findTextNodes(container, "Input");
    const vertexIcon = container.querySelector('[data-testid="vertex-icon"]');

    expect(inputLabels.length).toBeGreaterThan(0);
    expect(inputLabels.some((node) => opacityOf(node) > 0 && opacityOf(node) < 1)).toBe(true);
    expect(opacityOf(vertexIcon)).toBeGreaterThan(0);
    expect(opacityOf(vertexIcon)).toBeLessThan(1);
  });

  it("does not render a GPU pulse dot during the page 01 -> page 02 morph", () => {
    setLegacyFrame(36);
    const {container} = render(<MyComposition variantId="bus-clean" />);

    const pulseCircle = Array.from(container.querySelectorAll("circle")).find(
      (node) => node.getAttribute("fill") === "rgba(198, 111, 76, 0.12)",
    );

    expect(pulseCircle).toBeUndefined();
  });

  it("keeps page 01 -> page 02 continuous across the page 02 boundary", () => {
    setLegacyFrame(53);
    const {container: nearPage2Container, unmount} = render(
      <MyComposition variantId="bus-clean" />,
    );
    const nearPage2Vertex = nearPage2Container.querySelector(
      '[data-testid="vertex-icon"]',
    );
    const nearPage2Pixels = nearPage2Container.querySelector(
      '[data-testid="pixel-grid"]',
    );
    const nearPage2Gpu = findTextNodes(nearPage2Container, "GPU")[0];

    unmount();
    setLegacyFrame(54);
    const {container: page2Container} = render(<MyComposition variantId="bus-clean" />);
    const page2Vertex = page2Container.querySelector('[data-testid="vertex-icon"]');
    const page2Pixels = page2Container.querySelector('[data-testid="pixel-grid"]');
    const page2Gpu = findTextNodes(page2Container, "GPU")[0];

    expect(nearPage2Vertex?.getAttribute("transform")).toBe(
      page2Vertex?.getAttribute("transform"),
    );
    expect(nearPage2Pixels?.getAttribute("transform")).toBe(
      page2Pixels?.getAttribute("transform"),
    );
    expect(nearPage2Gpu?.getAttribute("font-size")).toBe(
      page2Gpu?.getAttribute("font-size"),
    );
    expect(opacityOf(nearPage2Gpu)).toBe(opacityOf(page2Gpu));
  });

  it("keeps page 02 -> page 03 upper band and API lines still animating halfway through", () => {
    setLegacyFrame(72);
    const {container: midContainer, unmount} = render(<MyComposition variantId="bus-clean" />);
    const shaderCodeLine = findTextNodes(midContainer, "ShaderCode")[0];
    const midLine = midContainer.querySelector('[data-testid="page3-compile-arrow"]');

    unmount();
    setLegacyFrame(90);
    const {container: finalContainer} = render(<MyComposition variantId="bus-clean" />);
    const finalLine = finalContainer.querySelector('[data-testid="page3-compile-arrow"]');

    expect(shaderCodeLine).toBeDefined();
    expect(strokePalette(midLine)).toBe("#ff0000");
    expect(strokePalette(finalLine)).toBe("#ff0000");
    expect(midLine?.querySelector("path")?.getAttribute("d")).not.toBe(
      finalLine?.querySelector("path")?.getAttribute("d"),
    );
  });

  it("keeps page 03 -> page 04 as a shader-artifact transition while PSO fades in", () => {
    setLegacyFrame(108);
    const {container: midContainer, unmount} = render(<MyComposition variantId="bus-clean" />);
    const midPsoGroup = findTextNodes(midContainer, "PSO")[0]?.closest("g");
    const midProgramArrow = midContainer.querySelector('[data-testid="page3-useprogram-arrow"]');
    const midSharedVerticalArrow = midContainer.querySelector(
      '[data-testid="shared-upper-vertical-arrow"]',
    );

    unmount();
    setLegacyFrame(126);
    const {container: page4Container} = render(<MyComposition variantId="bus-clean" />);
    const page4Spirv = findTextNodes(page4Container, "SPIR-V")[0];
    const finalPsoGroup = findTextNodes(page4Container, "PSO")[0]?.closest("g");
    const page4Description = findTextNodes(page4Container, "Description")[0];

    expect(page4Spirv).toBeDefined();
    expect(page4Description).toBeDefined();
    expect(opacityOf(midPsoGroup)).toBeGreaterThan(0);
    expect(opacityOf(midPsoGroup)).toBeLessThan(1);
    expect(midProgramArrow).toBeNull();
    expect(midSharedVerticalArrow).not.toBeNull();
    expect(opacityOf(finalPsoGroup)).toBe(1);
  });

  it("inserts a dedicated data checkpoint page between page 04 and page 05", () => {
    setLegacyFrame(150);
    const {container} = render(<MyComposition variantId="bus-clean" />);

    const dataOverlay = container.querySelector('[data-testid="page4-data-overlay"]');
    const sceneBaseLayer = container.querySelector('[data-testid="scene-base-layer"]');
    const dataTitle = findTextNodes(container, "OpenGL / Vulkan 耗时对比表")[0];
    const dataOpenGlRow = findTextNodes(
      container,
      "Link (glLinkProgram)",
    )[0];
    const dataVulkanRow = findTextNodes(
      container,
      "Create (CreateGfxPipeline)",
    )[0];
    const page5Material = findTextNodes(container, "Material")[0];
    const page5Cooked = findTextNodes(container, "Cooked")[0];

    expect(dataOverlay).not.toBeNull();
    expect(opacityOf(dataOverlay)).toBeGreaterThan(0);
    expect(sceneBaseLayer).not.toBeNull();
    expect(opacityOf(sceneBaseLayer)).toBeLessThan(0.5);
    expect(dataTitle).toBeDefined();
    expect(dataOpenGlRow).toBeDefined();
    expect(dataVulkanRow).toBeDefined();
    expect(page5Material).toBeUndefined();
    expect(page5Cooked).toBeUndefined();
  });

  it("highlights the expensive avg rows on page 04 data and annotates glCompileShader as x2", () => {
    setLegacyFrame(150);
    const {container} = render(<MyComposition variantId="bus-clean" />);

    const doubledCompileAvg = findTextNodes(container, "7.262 / 15.350")[0];
    const oldCompileAvg = findTextNodes(container, "3.631 / 7.675")[0];
    const compileX2Note = container.querySelector(
      '[data-testid="page4-data-compile-x2-note"]',
    );
    const compileX2Text = findTextNodes(container, "x2")[0];
    const compileRowLabel = findTextNodes(
      container,
      "Compile (glCompileShader)",
    )[0];
    const highCostMarkers = container.querySelectorAll(
      '[data-testid="page4-data-high-cost-marker"]',
    );

    expect(doubledCompileAvg).toBeDefined();
    expect(oldCompileAvg).toBeUndefined();
    expect(compileX2Note).not.toBeNull();
    expect(compileX2Note?.querySelector("rect")).toBeNull();
    expect(compileX2Text?.getAttribute("fill")).toBe(compileRowLabel?.getAttribute("fill"));
    expect(compileX2Text?.getAttribute("font-size")).toBe(
      compileRowLabel?.getAttribute("font-size"),
    );
    expect(highCostMarkers.length).toBe(3);
    highCostMarkers.forEach((marker) => {
      const circle = marker.querySelector("circle");
      const text = marker.querySelector("text");
      const circleCx = Number(circle?.getAttribute("cx"));
      const circleCy = Number(circle?.getAttribute("cy"));

      expect(circleCx).toBe(1226);
      expect(Number(text?.getAttribute("x"))).toBe(circleCx);
      expect(Number(text?.getAttribute("y"))).toBe(circleCy);
    });
  });

  it("renders page 24 as the package-and-memory strategy host", () => {
    setLegacyFrame(1734);
    const {container} = render(<MyComposition variantId="bus-clean" />);

    expect(findTextNodes(container, "包体")[0]).toBeDefined();
    expect(findTextNodes(container, "ShaderCode 压缩")[0]).toBeDefined();
    expect(findTextNodes(container, "内存")[0]).toBeDefined();
    expect(findTextNodes(container, "UE 中 PSO：LRU + mmap")[0]).toBeDefined();
    expect(findTextNodes(container, "LZ4")[0]).toBeDefined();
    expect(findTextNodes(container, "zstd")[0]).toBeDefined();
    expect(findTextNodes(container, "Oodle Leviathan")[0]).toBeDefined();
    expect(findTextNodes(container, "驻留层")[0]).toBeDefined();
    expect(findTextNodes(container, "换出 / 回填")[0]).toBeDefined();
    expect(findTextNodes(container, "映射 / 载体")[0]).toBeDefined();
    expect(findTextNodes(container, "选取策略")[0]).toBeDefined();
    expect(findTextNodes(container, "回填路径")[0]).toBeDefined();
    expect(findTextNodes(container, "外存载体")[0]).toBeDefined();
    expect(findTextNodes(container, "并行")[0]).toBeUndefined();
  });

  it("keeps page 24 as two expanded formal boards with a denser right-side strategy skeleton", () => {
    setLegacyFrame(1734);
    const {container} = render(<MyComposition variantId="bus-clean" />);

    const packageCardRect = container.querySelector(
      '[data-geometry-node-id="left-card"] rect[data-geometry-node-box="1"]',
    );
    const rightCardRect = container.querySelector(
      '[data-geometry-node-id="right-card"] rect[data-geometry-node-box="1"]',
    );
    const memoryRect = container.querySelector(
      '[data-geometry-node-id="memory"] rect[data-geometry-node-box="1"]',
    );
    const flowLaneRect = container.querySelector(
      '[data-geometry-node-id="flow-lane"] rect[data-geometry-node-box="1"]',
    );
    const diskRect = container.querySelector(
      '[data-geometry-node-id="disk"] rect[data-geometry-node-box="1"]',
    );

    expect(rectMetrics(packageCardRect).width).toBeGreaterThanOrEqual(520);
    expect(rectMetrics(rightCardRect).width).toBeGreaterThanOrEqual(648);
    expect(rectMetrics(packageCardRect).y).toBeLessThanOrEqual(60);
    expect(rectMetrics(rightCardRect).y).toBeLessThanOrEqual(60);
    expect(rectMetrics(memoryRect).width).toBeGreaterThanOrEqual(268);
    expect(rectMetrics(diskRect).width).toBeGreaterThanOrEqual(268);
    expect(rectMetrics(flowLaneRect).height).toBeGreaterThanOrEqual(188);
  });

  it("keeps page 24 details readable without falling back to old placeholder copy", () => {
    setLegacyFrame(1734);
    const {container} = render(<MyComposition variantId="bus-clean" />);

    const rowRect = container.querySelector(
      '[data-geometry-node-id="package-row-1"] rect[data-geometry-node-box="1"]',
    );
    const methodCard = container.querySelector(
      '[data-geometry-node-id="memory-method-1"] rect[data-geometry-node-box="1"]',
    );
    const footerRect = container.querySelector(
      '[data-geometry-node-id="footer"] g[data-geometry-node-box="1"] rect',
    );

    expect(rectMetrics(rowRect).height).toBeGreaterThanOrEqual(132);
    expect(rectMetrics(methodCard).width).toBeGreaterThanOrEqual(190);
    expect(rectMetrics(footerRect).width).toBeGreaterThanOrEqual(1040);
    expect(
      findTextNodes(container, "包体：ShaderCode 压缩；内存：UE 中 PSO 的 LRU + mmap。")[0],
    ).toBeDefined();
    expect(findTextNodes(container, "release/results 亮点摘录")[0]).toBeUndefined();
    expect(findTextNodes(container, "任务独立")[0]).toBeUndefined();
    expect(findTextNodes(container, "Algorithm")[0]).toBeUndefined();
  });

  it("keeps page 24 platform pills as explicit geometry nodes inside each package row", () => {
    setLegacyFrame(1734);
    const {container} = render(<MyComposition variantId="bus-clean" />);

    const rowRect = container.querySelector(
      '[data-geometry-node-id="package-row-1"] rect[data-geometry-node-box="1"]',
    );
    const windowsRect = container.querySelector(
      '[data-geometry-node-id="package-row-1-windows"] rect',
    );
    const macosRect = container.querySelector(
      '[data-geometry-node-id="package-row-1-macos"] rect',
    );
    const androidRect = container.querySelector(
      '[data-geometry-node-id="package-row-1-android"] rect',
    );
    const iosRect = container.querySelector(
      '[data-geometry-node-id="package-row-1-ios"] rect',
    );

    expect(windowsRect).not.toBeNull();
    expect(macosRect).not.toBeNull();
    expect(androidRect).not.toBeNull();
    expect(iosRect).not.toBeNull();
    expect(rectMetrics(windowsRect).bottom).toBeLessThanOrEqual(rectMetrics(rowRect).bottom);
    expect(rectMetrics(macosRect).bottom).toBeLessThanOrEqual(rectMetrics(rowRect).bottom);
    expect(rectMetrics(androidRect).bottom).toBeLessThanOrEqual(rectMetrics(rowRect).bottom);
    expect(rectMetrics(iosRect).bottom).toBeLessThanOrEqual(rectMetrics(rowRect).bottom);
  });

  it("renders page 26 as two parallel precompile-optimization paths", () => {
    setLegacyFrame(1914);
    const {container} = render(<MyComposition variantId="bus-clean" />);

    expect(findTextNodes(container, "路径 1：减少编译集合")[0]).toBeDefined();
    expect(findTextNodes(container, "Game")[0]).toBeDefined();
    expect(findTextNodes(container, "UsageMask = A")[0]).toBeDefined();
    expect(findTextNodes(container, "Compile")[0]).toBeDefined();
    expect(findTextNodes(container, "UsageMask = A + B")[0]).toBeDefined();
    expect(findTextNodes(container, "路径 2：提升编译吞吐")[0]).toBeDefined();
    expect(findTextNodes(container, "任务独立")[0]).toBeDefined();
    expect(findTextNodes(container, "纯 CPU 计算")[0]).toBeDefined();
    expect(
      findTextNodes(
        container,
        "UsageMask 减少集合，并行提升吞吐；两个不是同一个内容，但都在优化预编译速度。",
      )[0],
    ).toBeDefined();
  });

  it("keeps page 26 usage-mask and parallel content as separate columns", () => {
    setLegacyFrame(1914);
    const {container} = render(<MyComposition variantId="bus-clean" />);

    const usagePathRect = container.querySelector('[data-geometry-node-id="usage-mask-path"] rect');
    const parallelPathRect = container.querySelector('[data-geometry-node-id="parallel-path"] rect');
    const compileMaskRect = container.querySelector('[data-geometry-node-id="compile-mask"] rect');
    const queueRect = container.querySelector('[data-geometry-node-id="parallel-queue"] rect');

    expect(rectMetrics(parallelPathRect).x).toBeGreaterThan(rectMetrics(usagePathRect).right);
    expect(rectMetrics(queueRect).x).toBeGreaterThan(rectMetrics(compileMaskRect).right);
    expect(findTextNodes(container, "同样目标下，一条路减集合，一条路提吞吐。")[0]).toBeDefined();
  });

  it("renders page 29 as the merged code-plus-image governance page", () => {
    setLegacyFrame(2184);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const images = Array.from(container.querySelectorAll("image"));
    const leftTitle = findTextNodes(container, "VertexDescriptor / InitRHI")[0];
    const rightTitle = findTextNodes(container, "LocalVertexFactory.ush")[0];

    expect(leftTitle).toBeDefined();
    expect(rightTitle).toBeDefined();
    expect(findTextNodes(container, "NUM_MATERIAL_TEXCOORDS_VERTEX = 1")[0]).toBeDefined();
    expect(findTextNodes(container, "NUM_MATERIAL_TEXCOORDS_VERTEX = 2")[0]).toBeDefined();
    expect(
      findTextNodes(container, "同一个Material作用于不同的Mesh也会产生不同的PSO")[0],
    ).toBeDefined();
    expect(
      images.some((node) => node.getAttribute("href") === "/supplement/ogl-mtl/uv-stride4-ia.png"),
    ).toBe(true);
    expect(
      images.some((node) => node.getAttribute("href") === "/supplement/ogl-mtl/uv-stride8-ia.png"),
    ).toBe(true);
    expect(fontSizeOf(leftTitle)).toBeGreaterThanOrEqual(20);
    expect(fontSizeOf(rightTitle)).toBeGreaterThanOrEqual(20);
  });

  it("keeps page 29 images directly below their matching code cards", () => {
    setLegacyFrame(2184);
    const {container} = render(<MyComposition variantId="bus-clean" />);

    const leftCodeRect = container.querySelector(
      '[data-geometry-node-id="left-code"] [data-geometry-node-box="1"] rect',
    );
    const rightCodeRect = container.querySelector(
      '[data-geometry-node-id="right-code"] [data-geometry-node-box="1"] rect',
    );
    const leftImageRect = container.querySelector(
      '[data-geometry-node-id="left-image"] [data-geometry-node-box="1"] rect',
    );
    const rightImageRect = container.querySelector(
      '[data-geometry-node-id="right-image"] [data-geometry-node-box="1"] rect',
    );
    const leftImage = container.querySelector('[data-geometry-node-id="left-image"] image');
    const rightImage = container.querySelector('[data-geometry-node-id="right-image"] image');
    const leftImageTitle = findTextNodes(container, "NUM_MATERIAL_TEXCOORDS_VERTEX = 1")[0];
    const rightImageTitle = findTextNodes(container, "NUM_MATERIAL_TEXCOORDS_VERTEX = 2")[0];

    expect(Number(leftImage?.getAttribute("y"))).toBeGreaterThan(rectMetrics(leftCodeRect).bottom);
    expect(Number(rightImage?.getAttribute("y"))).toBeGreaterThan(rectMetrics(rightCodeRect).bottom);
    expect(rectMetrics(leftImageRect).x).toBe(rectMetrics(leftCodeRect).x - 8);
    expect(rectMetrics(rightImageRect).x).toBe(rectMetrics(rightCodeRect).x - 8);
    expect(rectMetrics(leftImageRect).width).toBe(rectMetrics(leftCodeRect).width + 16);
    expect(rectMetrics(rightImageRect).width).toBe(rectMetrics(rightCodeRect).width + 16);
    expect(Number(leftImage?.getAttribute("x"))).toBe(rectMetrics(leftCodeRect).x);
    expect(Number(rightImage?.getAttribute("x"))).toBe(rectMetrics(rightCodeRect).x);
    expect(Number(leftImageTitle?.getAttribute("x"))).toBe(
      rectMetrics(leftCodeRect).x + rectMetrics(leftCodeRect).width / 2,
    );
    expect(Number(rightImageTitle?.getAttribute("x"))).toBe(
      rectMetrics(rightCodeRect).x + rectMetrics(rightCodeRect).width / 2,
    );
    expect(leftImageTitle?.getAttribute("text-anchor")).toBe("middle");
    expect(rightImageTitle?.getAttribute("text-anchor")).toBe("middle");
  });

  it("renders page 30 as a standalone PSO engineering reading page", () => {
    setLegacyFrame(2274);
    const {container} = render(<MyComposition variantId="bus-clean" />);

    expect(findTextNodes(container, "工程延伸")[0]).toBeDefined();
    expect(findTextNodes(container, "PSO Precaching for Unreal Engine")[0]).toBeDefined();
    expect(findTextNodes(container, "PSO 小实验")[0]).toBeDefined();
    expect(findTextNodes(container, "UE项目优化：PSO Cache")[0]).toBeDefined();
    expect(findTextNodes(container, "Mesa 开源驱动")[0]).toBeDefined();
  });

  it("renders page 29_data as the code-plus-evidence page for PSO driver optimization", () => {
    setLegacyFrame(2230);
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const vertexLine = findTextNodes(container, "layout(location = 0) in vec3 inPos;")[0];
    const fragmentLine = findTextNodes(container, "out vec4 outColor;")[0];
    const stableLoop10 = findTextNodes(container, "0.0653")[0];
    const stableLoop5000 = findTextNodes(container, "0.0645")[0];
    const pcHighLoop5000VkOn = findTextNodes(container, "59.1658")[0];
    const pcHighLoop5000GlOff = findTextNodes(container, "32.0594")[0];
    const androidHighLoop5000VkOff = findTextNodes(container, "400.7728")[0];
    const androidHighLoop5000VkOn = findTextNodes(container, "400.7216")[0];
    const androidHighLoop5000GlesOff = findTextNodes(container, "402.2887")[0];
    const peakLoopLabel = findTextNodes(container, "loop=5000")[0];

    expect(findTextNodes(container, "PSO驱动层的激进优化")[0]).toBeUndefined();
    expect(findTextNodes(container, "原始数据表格 + 对比总结")[0]).toBeUndefined();
    expect(findTextNodes(container, "参数 / 环境")[0]).toBeUndefined();
    expect(findTextNodes(container, "测试 Shader")[0]).toBeUndefined();
    expect(findTextNodes(container, "Vertex Shader")[0]).toBeDefined();
    expect(findTextNodes(container, "Fragment Shader")[0]).toBeDefined();
    expect(vertexLine).toBeDefined();
    expect(fragmentLine).toBeDefined();
    expect(fontSizeOf(vertexLine)).toBeGreaterThanOrEqual(13.8);
    expect(fontSizeOf(fragmentLine)).toBeGreaterThanOrEqual(14);
    expect(findTextNodes(container, "State 开关 / 驱动可见性")[0]).toBeUndefined();
    expect(findTextNodes(container, "API 对照：Vulkan / OpenGL")[0]).toBeUndefined();
    expect(findTextNodes(container, "API 对照：Vulkan / GLES")[0]).toBeUndefined();
    expect(findTextNodes(container, "blendAtt.colorWriteMask = 0;")[0]).toBeDefined();
    expect(
      findTextNodes(container, "glColorMask(GL_FALSE, GL_FALSE, GL_FALSE, GL_FALSE);")[0],
    ).toBeDefined();
    expect(findTextNodes(container, "PC（RTX 3080）")[0]).toBeDefined();
    expect(findTextNodes(container, "Android（Adreno）")[0]).toBeDefined();
    expect(findTextNodes(container, "VK off")[0]).toBeDefined();
    expect(findTextNodes(container, "VK on")[0]).toBeDefined();
    expect(findTextNodes(container, "GL off")[0]).toBeDefined();
    expect(findTextNodes(container, "GLES off")[0]).toBeDefined();
    expect(findTextNodes(container, "GL 0")[0]).toBeUndefined();
    expect(findTextNodes(container, "GLES 0")[0]).toBeUndefined();
    expect(findTextNodes(container, "loop=10")[0]).toBeDefined();
    expect(peakLoopLabel).toBeDefined();
    expect(stableLoop10).toBeDefined();
    expect(stableLoop5000).toBeDefined();
    expect(stableLoop10?.getAttribute("fill")).toBe("#2f8a78");
    expect(stableLoop5000?.getAttribute("fill")).toBe("#2f8a78");
    expect(pcHighLoop5000VkOn?.getAttribute("fill")).toBe("#d06b44");
    expect(pcHighLoop5000GlOff?.getAttribute("fill")).toBe("#d06b44");
    expect(androidHighLoop5000VkOff?.getAttribute("fill")).toBe("#d06b44");
    expect(androidHighLoop5000VkOn?.getAttribute("fill")).toBe("#d06b44");
    expect(androidHighLoop5000GlesOff?.getAttribute("fill")).toBe("#d06b44");
    expect(peakLoopLabel?.getAttribute("fill")).toBe("#22303d");
    expect(
      findTextNodes(
        container,
        "同一份 heavy shader 下，NV 的 Vulkan mask=0 几乎不随 loop 波动；移动端驱动并没有兑现同级别的编译期优化。",
      )[0],
    ).toBeDefined();
  });

  it("renders page 31 as the live harness loop page", () => {
    setStepFrame("page_31");
    const {container} = render(<MyComposition variantId="bus-clean" />);

    expect(findTextNodes(container, "先看真实结果")[0]).toBeDefined();
    expect(findTextNodes(container, "再决定停或继续")[0]).toBeDefined();
    expect(findTextNodes(container, "Hook")[0]).toBeDefined();
    expect(findTextNodes(container, "进入")[0]).toBeDefined();
    expect(findTextNodes(container, "网页数据评分")[0]).toBeDefined();
    expect(findTextNodes(container, "网页图片评分")[0]).toBeDefined();
    expect(findTextNodes(container, "回执循环")[0]).toBeDefined();
    expect(findTextNodes(container, "workflow gate")[0]).toBeDefined();
    expect(findTextNodes(container, "browser capture")[0]).toBeDefined();
    expect(findTextNodes(container, "通过则停止")[0]).toBeDefined();
  });

  it("renders page 32 as the feedback bridge page", () => {
    setStepFrame("page_32", 42);
    const {container} = render(<MyComposition variantId="bus-clean" />);

    expect(findTextNodes(container, "反馈系统与人的学习")[0]).toBeDefined();
    expect(findTextNodes(container, "harness")[0]).toBeDefined();
    expect(findTextNodes(container, "loss + back propagation")[0]).toBeDefined();
    expect(findTextNodes(container, "feedback system")[0]).toBeDefined();
    expect(findTextNodes(container, "Input")[0]).toBeDefined();
    expect(findTextNodes(container, "f(x)")[0]).toBeDefined();
    expect(findTextNodes(container, "Output")[0]).toBeDefined();
    expect(
      findTextNodes(
        container,
        "从一个具体问题往回推时 也许会借到一些看似无用的东西",
      )[0],
    ).toBeDefined();
  });

  it("renders page 33 as the final quote-plus-recommendations ending page", () => {
    setStepFrame("page_33", 56);
    const {container} = render(<MyComposition variantId="bus-clean" />);

    expect(
      findTextNodes(container, "今子有大树，患其无用，何不树之于无何有之乡，")[0],
    ).toBeDefined();
    expect(findTextNodes(container, "书与视频")[0]).toBeDefined();
    expect(findTextNodes(container, "推荐游戏")[0]).toBeDefined();
    expect(findTextNodes(container, "PSO Precaching for Unreal Engine")[0]).toBeUndefined();
    expect(findTextNodes(container, "PSO 小实验")[0]).toBeUndefined();
    expect(findTextNodes(container, "《银河帝国》")[0]).toBeDefined();
    expect(findTextNodes(container, "《反杜林论》")[0]).toBeUndefined();
    expect(findTextNodes(container, "人类高质量思政课")[0]).toBeDefined();
    expect(findTextNodes(container, "重读资本论")[0]).toBeUndefined();
    expect(findTextNodes(container, "无所可用，安所困苦哉！")[0]).toBeDefined();
    expect(findTextNodes(container, "以此作为这次分享的最后一句。")[0]).toBeDefined();
  });
});
