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
    expect(screen.getByText("ShaderCode")).toBeInTheDocument();
    expect(screen.getByText("ShaderBinary")).toBeInTheDocument();
    expect(screen.getByText("Depth")).toBeInTheDocument();
    expect(screen.getByText("Blend")).toBeInTheDocument();
    expect(container.querySelectorAll("circle").length).toBeGreaterThan(6);
  });

  it("renders page 04 as a Vulkan PSO layer with one highlighted API call", () => {
    mockFrame = 126;
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const visibleOrangeBadges = Array.from(
      container.querySelectorAll('circle[stroke="#d06b44"]'),
    ).filter((node) => opacityOf(node.closest("g")) > 0);

    expect(screen.getByText("PSO")).toBeInTheDocument();
    expect(screen.getByText("ShaderCode")).toBeInTheDocument();
    expect(screen.getByText("ShaderBinary")).toBeInTheDocument();
    expect(screen.getByText("Depth")).toBeInTheDocument();
    expect(screen.getByText("Blend")).toBeInTheDocument();
    expect(visibleOrangeBadges.length).toBe(1);
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
    const shaderCodeGroup = findTextNodes(midContainer, "ShaderCode")[0]?.closest("g");
    const midLine = midContainer.querySelector('path[stroke="#d06b44"][stroke-width="3.2"]');

    unmount();
    mockFrame = 90;
    const {container: finalContainer} = render(<MyComposition variantId="bus-clean" />);
    const finalLine = finalContainer.querySelector('path[stroke="#d06b44"][stroke-width="3.2"]');

    expect(opacityOf(shaderCodeGroup)).toBeGreaterThan(0);
    expect(opacityOf(shaderCodeGroup)).toBeLessThan(1);
    expect(midLine?.getAttribute("d")).not.toBe(finalLine?.getAttribute("d"));
  });

  it("keeps page 03 -> page 04 in a real mid-transition state with PSO still fading in", () => {
    mockFrame = 108;
    const {container: midContainer, unmount} = render(<MyComposition variantId="bus-clean" />);
    const midPsoGroup = findTextNodes(midContainer, "PSO")[0]?.closest("g");

    unmount();
    mockFrame = 126;
    const {container: finalContainer} = render(<MyComposition variantId="bus-clean" />);
    const finalPsoGroup = findTextNodes(finalContainer, "PSO")[0]?.closest("g");

    expect(opacityOf(midPsoGroup)).toBeGreaterThan(0);
    expect(opacityOf(midPsoGroup)).toBeLessThan(1);
    expect(opacityOf(finalPsoGroup)).toBe(1);
  });

  it("retracts the three vertical GPU-call lines during page 03 -> page 04 instead of only fading them", () => {
    mockFrame = 108;
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const morphingShafts = Array.from(
      container.querySelectorAll('path[stroke-width="3.2"]'),
    ).map((node) => node.getAttribute("d"));

    expect(morphingShafts).not.toContain("M 530 186 L 530 374");
    expect(morphingShafts).not.toContain("M 670 186 L 670 374");
    expect(morphingShafts).not.toContain("M 780 186 L 780 374");
    expect(
      morphingShafts.some((value) => value?.startsWith("M 530 186 L 530 ")),
    ).toBe(true);
    expect(
      morphingShafts.some((value) => value?.startsWith("M 670 186 L 670 ")),
    ).toBe(true);
    expect(
      morphingShafts.some((value) => value?.startsWith("M 780 186 L 780 ")),
    ).toBe(true);
  });

  it("keeps the three page 03 -> page 04 vertical routes as single morphing lines instead of overlaying a second gray set", () => {
    mockFrame = 108;
    const {container} = render(<MyComposition variantId="bus-clean" />);
    const morphingVerticalShafts = Array.from(
      container.querySelectorAll('path[stroke-width="3.2"]'),
    ).filter((node) => {
      const d = node.getAttribute("d");
      return (
        d?.startsWith("M 530 186 L 530 ") ||
        d?.startsWith("M 670 186 L 670 ") ||
        d?.startsWith("M 780 186 L 780 ")
      );
    });
    const grayVerticalShafts = Array.from(
      container.querySelectorAll('path[stroke="rgba(76, 90, 102, 0.72)"][stroke-width="3"]'),
    ).filter((node) => {
      const d = node.getAttribute("d");
      return (
        d?.startsWith("M 530 186 L 530 ") ||
        d?.startsWith("M 670 186 L 670 ") ||
        d?.startsWith("M 780 186 L 780 ")
      );
    });

    expect(morphingVerticalShafts.length).toBe(3);
    expect(grayVerticalShafts.length).toBe(0);
    morphingVerticalShafts.forEach((node) => {
      expect(node.getAttribute("stroke")).not.toBe("#d06b44");
      expect(node.getAttribute("stroke")).not.toBe("rgba(76, 90, 102, 0.72)");
    });
  });
});
