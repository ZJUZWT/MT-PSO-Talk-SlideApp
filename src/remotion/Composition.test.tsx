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

    expect(screen.getAllByText("GPU").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Raw")).toBeInTheDocument();
    expect(screen.getAllByText("ShaderCode").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Binary")).toBeInTheDocument();
    expect(screen.getByText("Depth")).toBeInTheDocument();
    expect(screen.getByText("Blend")).toBeInTheDocument();
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
    expect(screen.getByText("VertexData")).toBeInTheDocument();
    expect(screen.getByText("Cooked")).toBeInTheDocument();
    expect(screen.getAllByText("ShaderCode").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("GPU")).toBeInTheDocument();
    expect(screen.queryByText("PSO")).not.toBeInTheDocument();
    expect(screen.queryByText("Description")).not.toBeInTheDocument();
  });

  it("lays out page 05 with Mesh on the main-axis left side and a clean Material -> Cooked asset band", () => {
    mockFrame = 162;
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const meshGroup = findTextNodes(container, "Mesh")[0]?.closest("g");
    const materialGroup = findTextNodes(container, "Material")[0]?.closest("g");
    const cookedGroup = findTextNodes(container, "Cooked")[0]?.closest("g")?.parentElement;
    const gpuLabel = findTextNodes(container, "GPU")[0];
    const vertexLabel = findTextNodes(container, "VertexData")[0];
    const meshRect = meshGroup?.querySelector("rect");
    const materialRect = materialGroup?.querySelector("rect");
    const cookedRect = cookedGroup?.querySelector("rect");

    const meshX = Number(meshRect?.getAttribute("x"));
    const meshRight =
      Number(meshRect?.getAttribute("x")) + Number(meshRect?.getAttribute("width"));
    const meshCenterY =
      Number(meshRect?.getAttribute("y")) +
      Number(meshRect?.getAttribute("height")) / 2;
    const materialX = Number(materialRect?.getAttribute("x"));
    const materialRight =
      Number(materialRect?.getAttribute("x")) +
      Number(materialRect?.getAttribute("width"));
    const cookedX = Number(cookedRect?.getAttribute("x"));
    const materialToCookedGap = cookedX - materialRight;
    const cookedCenterX =
      Number(cookedRect?.getAttribute("x")) +
      Number(cookedRect?.getAttribute("width")) / 2;
    const gpuCenterX = Number(gpuLabel?.getAttribute("x"));
    const vertexCenterX = Number(vertexLabel?.getAttribute("x"));
    const vertexCenterY = Number(vertexLabel?.getAttribute("y"));

    expect(meshRight).toBeLessThan(meshX + 200);
    expect(meshRight).toBeLessThan(vertexCenterX - 90);
    expect(Math.abs(meshCenterY - vertexCenterY)).toBeLessThanOrEqual(12);
    expect(materialToCookedGap).toBeGreaterThanOrEqual(36);
    expect(Math.abs(cookedCenterX - gpuCenterX)).toBeLessThanOrEqual(12);
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
});
