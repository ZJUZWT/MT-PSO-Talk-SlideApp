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

function textX(node: Element | null | undefined) {
  return Number(node?.getAttribute("x"));
}

function textY(node: Element | null | undefined) {
  return Number(node?.getAttribute("y"));
}

function fontSizeOf(node: Element | null | undefined) {
  return Number(node?.getAttribute("font-size"));
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
    mockFrame = 18;
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

  it("renders page 02 as VertexData -> GPU -> pixels without GPU inner chrome", () => {
    mockFrame = 54;
    const {container} = render(<MyComposition variantId="bus-clean" />);

    expect(screen.getAllByText("GPU").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("Texture")).not.toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="vertex-icon"][opacity="1"]'),
    ).not.toBeNull();
    expect(
      container.querySelector('[data-testid="pixel-grid"][opacity="1"]'),
    ).not.toBeNull();
    expect(
      Array.from(container.querySelectorAll("rect")).length,
    ).toBeGreaterThan(10);
  });

  it("renders page 03 with a top configuration band and API-call legend", () => {
    mockFrame = 90;
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const orangeArrows = Array.from(
      container.querySelectorAll('path[stroke="#d06b44"]'),
    ).filter((node) => {
      const width = Number(node.getAttribute("stroke-width"));

      return (
        width > 0 &&
        width <= 3.2 &&
        (opacityOf(node.closest("g")) > 0 || opacityOf(node) > 0)
      );
    });
    const programGroup = findBoxGroupByLabel(container, "Program");
    const badge2 = container.querySelector('[data-testid="page3-useprogram-badge"]');
    const badge5 = container.querySelector('[data-testid="page3-linkprogram-badge"]');
    const badge6 = container.querySelector('[data-testid="page3-getprogrambinary-badge"]');
    const linkLeft = container.querySelector('[data-testid="page3-linkprogram-input-left"]');
    const linkRight = container.querySelector('[data-testid="page3-linkprogram-input-right"]');
    const workflowFrame = container.querySelector('[data-testid="page3-program-workflow-frame"]');
    const badge5Circle = badge5?.querySelector("circle");
    const badge6Circle = badge6?.querySelector("circle");
    const workflowRect = workflowFrame?.querySelector("rect");
    const leftX = parseVerticalPathX(linkLeft);
    const rightX = parseVerticalPathX(linkRight);

    expect(screen.getAllByText("GPU").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Raw")).toBeInTheDocument();
    expect(screen.getAllByText("ShaderCode").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Binary")).toBeInTheDocument();
    expect(programGroup).toBeTruthy();
    expect(screen.getByText("Depth")).toBeInTheDocument();
    expect(screen.getByText("Blend")).toBeInTheDocument();
    expect(orangeArrows.length).toBeGreaterThanOrEqual(4);
    expect(badge2).not.toBeNull();
    expect(opacityOf(badge2)).toBeGreaterThan(0.9);
    expect(badge5).not.toBeNull();
    expect(opacityOf(badge5)).toBeGreaterThan(0.9);
    expect(badge6).not.toBeNull();
    expect(opacityOf(badge6)).toBeGreaterThan(0.9);
    expect(dashSignature(linkLeft)).toBe("7 7");
    expect(dashSignature(linkRight)).toBe("7 7");
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
    expect(Number(findBoxGroupByLabel(container, "Depth")?.querySelector("rect")?.getAttribute("x"))).toBeGreaterThan(640);
    expect(Number(findBoxGroupByLabel(container, "Blend")?.querySelector("rect")?.getAttribute("x"))).toBeGreaterThan(750);
    expect(container.querySelectorAll("circle").length).toBeGreaterThan(6);
  });

  it("renders page 04 as a Vulkan PSO page that keeps the SPIR-V path and middle packaging layers", () => {
    mockFrame = 126;
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const visibleOrangeBadges = Array.from(
      container.querySelectorAll('circle[stroke="#d06b44"]'),
    ).filter((node) => opacityOf(node.closest("g")) > 0);
    const page4WorkflowFrame = container.querySelector('[data-testid="page4-pso-workflow-frame"]');
    const page4WorkflowBadge = container.querySelector(
      '[data-testid="page4-getpipelinecachedata-badge"]',
    );
    const page4WorkflowRect = page4WorkflowFrame?.querySelector("rect");
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
    expect(visibleOrangeBadges.length).toBe(3);
  });

  it("renders page 05 as the UE asset cook bridge with mesh and material assets feeding runtime inputs", () => {
    mockFrame = 162;
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
    mockFrame = 162;
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
    mockFrame = 162;
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
    mockFrame = 162;
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const questionBadge = container.querySelector('[data-testid="page5-question-badge"]');

    expect(questionBadge).not.toBeNull();
    expect(opacityOf(questionBadge)).toBeGreaterThan(0.9);
    expect(questionBadge?.textContent).toContain("?");
  });

  it("renders page 06 as the v4 ownership layout with one left dashed relation and one short right dashed relation", () => {
    mockFrame = 234;
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const stageGroup = container.querySelector('[data-testid="page6-stage-group"]');
    const materialGroup = findVisibleBoxGroupByLabel(container, "Material");
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
    expect(screen.getAllByText("Material").length).toBeGreaterThanOrEqual(1);
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
    expect(uassetFrame?.getAttribute("fill")).toBe("none");
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
    mockFrame = 234;
    const {container} = render(<MyComposition variantId="bus-clean" />);

    expect(container.querySelector('[data-testid="page6-platform-table"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="page6-resource-selector-table"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="page6-shadermap-selector-table"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="page6-cooked-code-box"]')).not.toBeNull();
    expect(findTextNodes(container, "Material").length).toBeGreaterThan(0);
    expect(findTextNodes(container, "FMaterialResource").length).toBeGreaterThan(0);
    expect(findTextNodes(container, "FMaterialShaderMap").length).toBeGreaterThan(0);
    expect(screen.queryByText("ShaderEntries[i]")).not.toBeInTheDocument();
    expect(screen.queryByText("ShaderHashes[i]")).not.toBeInTheDocument();
    expect(
      findTextNodes(container, "Cooked").some((node) => effectiveOpacity(node) > 0.16),
    ).toBe(true);
  });

  it("uses page 06 as a clean ownership page with one left relation mark and the shader selector floating above the shaderMap -> cooked span", () => {
    mockFrame = 234;
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
    const materialRect = findVisibleBoxGroupByLabel(container, "Material")?.querySelector("rect");
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
    mockFrame = 234;
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
    mockFrame = 234;
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
    mockFrame = 234;
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
    mockFrame = 234;
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
    mockFrame = 234;
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
    mockFrame = 234;
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
    mockFrame = 234;
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const platformTableRect = container
      .querySelector('[data-testid="page6-platform-table"]')
      ?.querySelector("rect");
    const resourceTableRect = container
      .querySelector('[data-testid="page6-resource-selector-table"]')
      ?.querySelector("rect");
    const materialRect = findVisibleBoxGroupByLabel(container, "Material")?.querySelector("rect");
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
    mockFrame = 234;
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const shaderTableRect = container
      .querySelector('[data-testid="page6-shadermap-selector-table"]')
      ?.querySelector("rect");
    const resourceRect = findVisibleBoxGroupByLabel(container, "FMaterialResource")?.querySelector("rect");

    expect(rectMetrics(shaderTableRect).x).toBeGreaterThanOrEqual(rectMetrics(resourceRect).right + 20);
    expect(Number(shaderTableRect?.getAttribute("height"))).toBeGreaterThanOrEqual(132);
  });

  it("restores page 06 material prominence and enlarges both selector columns before InlineCode expansion", () => {
    mockFrame = 234;
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const uassetRect = container.querySelector('[data-testid="page6-uasset-frame"]');
    const materialRect = findVisibleBoxGroupByLabel(container, "Material")?.querySelector("rect");
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
    mockFrame = 234;
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const platformResourceSpine = container.querySelector(
      '[data-testid="page6-platform-resource-spine"]',
    );
    const materialRect = findVisibleBoxGroupByLabel(container, "Material")?.querySelector("rect");
    const shaderPlatform = findTextNodes(container, "ShaderPlatform")[0];
    const featureLevel = findTextNodes(container, "FeatureLevel")[0];
    const basePass = findTextNodes(container, "BasePassPS")[0];
    const material = findTextNodes(container, "Material")[0];
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
    mockFrame = 234;
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
    const materialRect = findVisibleBoxGroupByLabel(container, "Material")?.querySelector("rect");
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

  it("treats page 07 as the runtime InlineCode lookup slide before PSO Cache appears", () => {
    mockFrame = 270;
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
    expect(screen.queryByText("PSO Cache")).not.toBeInTheDocument();
  });

  it("compresses the page 07 left spine and reallocates the stage toward a larger ResourceCode payload", () => {
    mockFrame = 234;
    const {container: page6Container, unmount} = render(
      <MyComposition variantId="bus-clean" />,
    );
    const page6MaterialRect = findVisibleBoxGroupByLabel(page6Container, "Material")?.querySelector("rect");
    const page6ShaderMapRect = findVisibleBoxGroupByLabel(page6Container, "FMaterialShaderMap")?.querySelector("rect");

    unmount();
    mockFrame = 270;
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const page7MaterialRect = findVisibleBoxGroupByLabel(container, "Material")?.querySelector("rect");
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
    mockFrame = 270;
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
    mockFrame = 246;
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
    mockFrame = 248;
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
    mockFrame = 252;
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
    mockFrame = 258;
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
    mockFrame = 234;
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
    mockFrame = 234;
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
      mockFrame = frame;
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
    mockFrame = 198;
    const {container} = render(<MyComposition variantId="bus-clean" />);

    expect(Boolean(container.querySelector('[data-testid="page56-world-dim"]'))).toBe(false);
  });

  it("reveals the page 06 stage as a monotonic center-scale animation", () => {
    const sampledFrames = [222, 228, 234];
    const sampledScales = sampledFrames.map((frame) => {
      mockFrame = frame;
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
    mockFrame = 210;
    const {container} = render(<MyComposition variantId="bus-clean" />);

    expect(container.querySelector('[data-testid="page6-resource-card"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="page6-shadermap-card"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="page6-cooked-code-box"]')).not.toBeNull();
    expect(findTextNodes(container, "Material").length).toBeGreaterThanOrEqual(1);
    expect(container.querySelector('[data-testid="page6-platform-resource-spine"]')).toBeNull();
    expect(
      container.querySelector('[data-testid="page6-shader-selector-attachment-link"]'),
    ).toBeNull();
    expect(container.querySelector('[data-testid="page6-platform-table"]')).toBeNull();
    expect(container.querySelector('[data-testid="page6-resource-selector-table"]')).toBeNull();
    expect(container.querySelector('[data-testid="page6-shadermap-selector-table"]')).toBeNull();
  });

  it("shows the page 06 dashed guides before the white boards expand in", () => {
    mockFrame = 216;
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
    mockFrame = 222;
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
    mockFrame = 222;
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

    mockFrame = 228;
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
      mockFrame = frame;
      const {container, unmount} = render(<MyComposition variantId="bus-clean" />);
      const stageGroup = container.querySelector('[data-testid="page6-stage-group"]');
      const trailingTranslate = parseTrailingTranslate(stageGroup?.getAttribute("transform"));
      unmount();

      return Math.abs(trailingTranslate?.y ?? 0);
    });

    expect(Math.max(...sampledAnchorYs) - Math.min(...sampledAnchorYs)).toBeLessThanOrEqual(4);
  });

  it("keeps page 07 with readable vertical and horizontal spans and de-emphasizes the old page 05 world", () => {
    mockFrame = 270;
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
    mockFrame = 234;
    const {container: page6Container, unmount} = render(
      <MyComposition variantId="bus-clean" />,
    );
    const page6MaterialRect = findVisibleBoxGroupByLabel(
      page6Container,
      "Material",
    )?.querySelector("rect");
    const page6ResourceRect = findVisibleBoxGroupByLabel(
      page6Container,
      "FMaterialResource",
    )?.querySelector("rect");
    const page6ShaderMapRect = findVisibleBoxGroupByLabel(
      page6Container,
      "FMaterialShaderMap",
    )?.querySelector("rect");
    unmount();

    mockFrame = 270;
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const resourceShadowRects = Array.from(
      container.querySelectorAll('[data-testid^="page6-resource-shadow-"] rect'),
    );
    const shaderShadowRects = Array.from(
      container.querySelectorAll('[data-testid^="page6-shadermap-shadow-"] rect'),
    );
    const materialRect = findVisibleBoxGroupByLabel(container, "Material")?.querySelector("rect");
    const resourceRect = findVisibleBoxGroupByLabel(
      container,
      "FMaterialResource",
    )?.querySelector("rect");
    const shaderMapRect = findVisibleBoxGroupByLabel(
      container,
      "FMaterialShaderMap",
    )?.querySelector("rect");
    const materialLabel = findTextNodes(container, "Material").find(
      (node) => effectiveOpacity(node) > 0.16,
    );
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
    expect(materialRect?.getAttribute("data-tone")).toBe("asset");
  });

  it("keeps the page 07 inline details inserted between shaderMap and the anchored cooked-code box", () => {
    mockFrame = 270;
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

  it("keeps the page 07 receiver and payload titles on one line for spacing control", () => {
    mockFrame = 270;
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
    mockFrame = 270;
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
    mockFrame = 270;
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const uassetMetrics = rectMetrics(container.querySelector('[data-testid="page6-uasset-frame"]'));
    const contentRects = [
      findVisibleBoxGroupByLabel(container, "Material")?.querySelector("rect"),
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
    mockFrame = 234;
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
    mockFrame = 234;
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const visibleMaterialLabels = findTextNodes(container, "Material").filter(
      (node) => effectiveOpacity(node) > 0.16,
    );

    expect(visibleMaterialLabels.length).toBe(1);
  });

  it("keeps page 06 labels readable without glyph compression hacks", () => {
    mockFrame = 234;
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
    mockFrame = 234;
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const questionBadge = container.querySelector('[data-testid="page5-question-badge"]');
    const visibleQuestionLabels = findTextNodes(container, "?").filter(
      (node) => effectiveOpacity(node) > 0.05,
    );

    expect(questionBadge).toBeNull();
    expect(visibleQuestionLabels.length).toBe(0);
  });

  it("renders page 08 with PSO Cache table below the lookup slide showing Hash fields and state fields", () => {
    mockFrame = 270;
    const {container: page7Container} = render(<MyComposition variantId="bus-clean" />);
    const page7UassetRect = page7Container.querySelector('[data-testid="page6-uasset-frame"]');
    const page7FshaderRect = page7Container.querySelector('[data-testid="page6-fshader-card"] rect');
    const page7InlineRect = page7Container.querySelector(
      '[data-testid="page6-inline-resource-box"] rect',
    );
    cleanup();

    mockFrame = 306;
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
    const psoLabel = screen.getByText("PSO Cache");
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
    expect(screen.getByText("PSO Cache")).toBeInTheDocument();
    expect(screen.getByText("ShaderHashes[idx]")).toBeInTheDocument();
    expect(screen.getByText("VS Hash")).toBeInTheDocument();
    expect(screen.getByText("PS Hash")).toBeInTheDocument();
    expect(fontSizeOf(vsHashField)).toBeGreaterThanOrEqual(22);
    expect(fontSizeOf(psoBlendField)).toBeGreaterThanOrEqual(20);
    expect(psoBlendField?.textContent).toBe("Blend");
    expect(psoDepthField?.textContent).toBe("Depth");
    expect(psoRtField?.textContent).toBe("RT");
    expect(psoEtcField?.textContent).toBe("...!");
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
    mockFrame = 306;
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
    expect(rectMetrics(proofMaterialRect).bottom).toBeLessThan(projectedUassetTop);
    expect(Math.abs(rectCenterX(proofCookedCueRect) - projectedCookedCenter.x)).toBeLessThanOrEqual(2);
    expect(rectMetrics(cookedRect).x).toBeGreaterThan(rectMetrics(uassetRect).x + 24);
    expect(rectMetrics(cookedRect).right).toBeLessThan(rectMetrics(uassetRect).right - 24);
    expect(rectMetrics(cookedRect).bottom).toBeLessThan(rectMetrics(uassetRect).bottom - 24);
  });

  it("routes page 08 VS/PS hash fields back to ShaderHashes[idx] as dashed branch references from the PSO Cache", () => {
    mockFrame = 306;
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
    mockFrame = 306;
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

  it("keeps page 08 hash reference lines hidden until the PSO cache scale has essentially settled", () => {
    mockFrame = 288;
    const {container} = render(<MyComposition variantId="bus-clean" />);

    expect(container.querySelector('[data-testid="page8-pso-box"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="page8-vs-hash-reference-arrow"]')).toBeNull();
    expect(container.querySelector('[data-testid="page8-ps-hash-reference-arrow"]')).toBeNull();
  });

  it("keeps page 08 PSO Hash focus subordinate to the page 07 mainline by narrowing the cache and tucking VS/PS Hash under ShaderHashes[idx]", () => {
    mockFrame = 306;
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

  it("renders page 09 as a SharedCode solution page with a lookup rail while keeping the PSO cache on the inherited bottom band", () => {
    mockFrame = 306;
    const {container: page8Container} = render(<MyComposition variantId="bus-clean" />);
    const page8PsoRect = page8Container.querySelector('[data-testid="page8-pso-box"] rect');
    cleanup();

    mockFrame = 342;
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
    expect(screen.getByText("PSO Cache")).toBeInTheDocument();
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
    expect(Math.abs(rectMetrics(shaderHashesRect).y - rectMetrics(shaderCodeRect).y)).toBeLessThanOrEqual(2);
    expect(rectMetrics(shaderBlobRect).y - rectMetrics(shaderCodeRect).bottom).toBeGreaterThanOrEqual(8);
    expect((fshaderBranchVertices[0]?.x ?? 0)).toBeGreaterThan(rectCenterX(fshaderRect));
    expect((fshaderBranchVertices[2]?.x ?? 0)).toBeGreaterThan(rectMetrics(sharedResourceRect).right + 20);
    expect((shaderMapIndexBranchVertices[0]?.x ?? 0)).toBeGreaterThan(rectCenterX(sharedResourceRect));
  });

  it("keeps page 09 diagram typography above the PPT readability floor", () => {
    mockFrame = 342;
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

  it("keeps FShader as a translated continuation from page 08 into page 09 with only a bounded width retargeting", () => {
    mockFrame = 306;
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
    mockFrame = 342;
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
    mockFrame = 54;
    const {container: page2Container, unmount} = render(
      <MyComposition variantId="bus-clean" />,
    );
    const page2Vertex = page2Container.querySelector('[data-testid="vertex-icon"]');
    const page2VertexCenter = parseLeadingTranslate(page2Vertex?.getAttribute("transform"));
    const page2Gpu = findTextNodes(page2Container, "GPU")[0];

    unmount();
    mockFrame = 126;
    const {container: page4Container, unmount: unmountPage4} = render(
      <MyComposition variantId="bus-clean" />,
    );
    const page4Gpu = findTextNodes(page4Container, "GPU")[0];

    unmountPage4();
    mockFrame = 162;
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
    mockFrame = 162;
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

  it("uses a pale green asset treatment for UE asset nodes on page 05", () => {
    mockFrame = 162;
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const meshGroup = findTextNodes(container, "Mesh")[0]?.closest("g");
    const materialGroup = findTextNodes(container, "Material")[0]?.closest("g");
    const meshRect = meshGroup?.querySelector("rect");
    const materialRect = materialGroup?.querySelector("rect");

    expect(meshRect?.getAttribute("fill")).toBe("rgba(231, 242, 233, 0.98)");
    expect(materialRect?.getAttribute("fill")).toBe("rgba(231, 242, 233, 0.98)");
  });

  it("keeps the VertexData icon visible on page 05 instead of reducing it to text only", () => {
    mockFrame = 54;
    const {container: page2Container, unmount} = render(
      <MyComposition variantId="bus-clean" />,
    );
    const page2VertexIcon = page2Container.querySelector('[data-testid="vertex-icon"]');
    const page2Scale = parseScale(page2VertexIcon?.getAttribute("transform"));

    unmount();
    mockFrame = 162;
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const vertexIcon = container.querySelector('[data-testid="vertex-icon"]');

    expect(opacityOf(vertexIcon)).toBeGreaterThan(0.9);
    expect(parseScale(vertexIcon?.getAttribute("transform"))).toBe(page2Scale);
    expect(screen.queryByText("VertexData")).not.toBeInTheDocument();
  });

  it("renders Mesh and Material as clean asset boxes without decorative inner stripes", () => {
    mockFrame = 162;
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const meshGroup = findBoxGroupByLabel(container, "Mesh");
    const materialGroup = findBoxGroupByLabel(container, "Material");

    expect(meshGroup?.querySelectorAll("rect")).toHaveLength(1);
    expect(materialGroup?.querySelectorAll("rect")).toHaveLength(1);
  });

  it("keeps page 01 -> page 02 in a real mid-transition state halfway through", () => {
    mockFrame = 36;
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const inputLabels = findTextNodes(container, "Input");
    const vertexIcon = container.querySelector('[data-testid="vertex-icon"]');

    expect(inputLabels.length).toBeGreaterThan(0);
    expect(inputLabels.some((node) => opacityOf(node) > 0 && opacityOf(node) < 1)).toBe(true);
    expect(opacityOf(vertexIcon)).toBeGreaterThan(0);
    expect(opacityOf(vertexIcon)).toBeLessThan(1);
  });

  it("does not render a GPU pulse dot during the page 01 -> page 02 morph", () => {
    mockFrame = 36;
    const {container} = render(<MyComposition variantId="bus-clean" />);

    const pulseCircle = Array.from(container.querySelectorAll("circle")).find(
      (node) => node.getAttribute("fill") === "rgba(198, 111, 76, 0.12)",
    );

    expect(pulseCircle).toBeUndefined();
  });

  it("keeps page 01 -> page 02 continuous across the page 02 boundary", () => {
    mockFrame = 53;
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
    mockFrame = 54;
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
    mockFrame = 72;
    const {container: midContainer, unmount} = render(<MyComposition variantId="bus-clean" />);
    const shaderCodeLine = findTextNodes(midContainer, "ShaderCode")[0];
    const midLine = midContainer.querySelector('path[stroke="#d06b44"][stroke-width="3.2"]');

    unmount();
    mockFrame = 90;
    const {container: finalContainer} = render(<MyComposition variantId="bus-clean" />);
    const finalLine = finalContainer.querySelector('path[stroke="#d06b44"][stroke-width="3.2"]');

    expect(shaderCodeLine).toBeDefined();
    expect(midLine?.getAttribute("d")).not.toBe(finalLine?.getAttribute("d"));
  });

  it("keeps page 03 -> page 04 as a shader-artifact transition while PSO fades in", () => {
    mockFrame = 108;
    const {container: midContainer, unmount} = render(<MyComposition variantId="bus-clean" />);
    const midPsoGroup = findTextNodes(midContainer, "PSO")[0]?.closest("g");
    const midProgramArrow = midContainer.querySelector('[data-testid="page3-useprogram-arrow"]');
    const midSharedVerticalArrow = midContainer.querySelector(
      '[data-testid="shared-upper-vertical-arrow"]',
    );

    unmount();
    mockFrame = 126;
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

  it("keeps page 04 -> page 05 as a correspondence-based handoff instead of a static-position fade", () => {
    mockFrame = 144;
    const {container: midContainer, unmount} = render(
      <MyComposition variantId="bus-clean" />,
    );
    const midPsoGroup = findBoxGroupByLabel(midContainer, "PSO");
    const rawGroup = findBoxGroupByLabel(midContainer, "Raw");
    const materialGroup = findBoxGroupByLabel(midContainer, "Material");
    const spirvGroup = findBoxGroupByLabel(midContainer, "SPIR-V");
    const cookedGroup = findBoxGroupByLabel(midContainer, "Cooked");
    const midVertexIcon = midContainer.querySelector('[data-testid="vertex-icon"]');
    const sharedHorizontalArrow = midContainer.querySelector(
      '[data-testid="shared-upper-horizontal-arrow"]',
    );
    const sharedVerticalArrow = midContainer.querySelector(
      '[data-testid="shared-upper-vertical-arrow"]',
    );

    unmount();

    expect(opacityOf(midPsoGroup)).toBeGreaterThan(0);
    expect(opacityOf(midPsoGroup)).toBeLessThan(0.45);
    expect(opacityOf(midVertexIcon)).toBeGreaterThan(0.9);
    expect(rawGroup).toBeTruthy();
    expect(materialGroup).toBeTruthy();
    expect(spirvGroup).toBeTruthy();
    expect(cookedGroup).toBeTruthy();
    expect(rawGroup?.isSameNode(materialGroup ?? null)).toBe(true);
    expect(spirvGroup?.isSameNode(cookedGroup ?? null)).toBe(true);
    expect(sharedHorizontalArrow).not.toBeNull();
    expect(sharedVerticalArrow).not.toBeNull();
  });
});
