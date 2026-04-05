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

function opacityOf(node: Element | null) {
  return Number(node?.getAttribute("opacity") ?? "1");
}

function findTextNodes(container: HTMLElement, label: string) {
  return Array.from(container.querySelectorAll("text")).filter(
    (node) => node.textContent === label,
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

function rectCenterX(rect: Element | null | undefined) {
  return Number(rect?.getAttribute("x")) + Number(rect?.getAttribute("width")) / 2;
}

function parseScale(transform: string | null | undefined) {
  const match = transform?.match(/scale\(([-\d.]+)\)/);

  return match ? Number(match[1]) : null;
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
    const badge2 = container.querySelector('[data-testid="shared-upper-vertical-badge"]');

    expect(screen.getAllByText("GPU").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Raw")).toBeInTheDocument();
    expect(screen.getAllByText("ShaderCode").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Binary")).toBeInTheDocument();
    expect(screen.getByText("Depth")).toBeInTheDocument();
    expect(screen.getByText("Blend")).toBeInTheDocument();
    expect(orangeArrows.length).toBeGreaterThanOrEqual(4);
    expect(badge2).not.toBeNull();
    expect(opacityOf(badge2)).toBeGreaterThan(0.9);
    expect(container.querySelectorAll("circle").length).toBeGreaterThan(6);
  });

  it("renders page 04 as a Vulkan PSO page that keeps the SPIR-V path and middle packaging layers", () => {
    mockFrame = 126;
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const visibleOrangeBadges = Array.from(
      container.querySelectorAll('circle[stroke="#d06b44"]'),
    ).filter((node) => opacityOf(node.closest("g")) > 0);

    expect(screen.getByText("Raw")).toBeInTheDocument();
    expect(screen.getByText("SPIR-V")).toBeInTheDocument();
    expect(screen.getAllByText("ShaderCode").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("Binary")).not.toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("PSO")).toBeInTheDocument();
    expect(screen.getByText("Depth")).toBeInTheDocument();
    expect(screen.getByText("Blend")).toBeInTheDocument();
    expect(visibleOrangeBadges.length).toBe(2);
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
