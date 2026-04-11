import {render, screen} from "@testing-library/react";
import {describe, expect, it} from "vitest";
import {page10R1Sketch} from "../contracts/page10-r1";
import {page14ContractR1Sketch} from "../contracts/page14-contract-r1";
import type {GeometrySketchDefinition} from "./geometry-sketch-types";
import {GeometrySketchScene} from "./GeometrySketchScene";

describe("GeometrySketchScene", () => {
  it("renders edge labels for geometry contracts that attach text to a line", () => {
    render(<GeometrySketchScene sketch={page10R1Sketch} />);

    expect(screen.getByText("cook")).toBeInTheDocument();
  });

  it("renders a reference bitmap when the sketch mirrors a real drawing", () => {
    const mirroredSketch: GeometrySketchDefinition = {
      ...page14ContractR1Sketch,
      id: "fixture-reference-image",
      label: "Fixture reference image sketch",
      referenceImage: {
        src: "/ignore/fixture-reference.png",
      },
    };

    render(<GeometrySketchScene sketch={mirroredSketch} />);

    expect(
      screen.getByTestId("geometry-sketch-reference-image"),
    ).toBeInTheDocument();
  });

  it("renders circular merge junctions when a sketch node requests a circle shape", () => {
    const {container} = render(<GeometrySketchScene sketch={page14ContractR1Sketch} />);
    const mergeNode = container.querySelector('[data-node-id="b"]');

    expect(mergeNode?.querySelector("circle")).toBeInTheDocument();
    expect(mergeNode?.querySelectorAll("text")).toHaveLength(1);
    expect(mergeNode?.textContent).toContain("+");
  });

  it("renders bent edges as rounded SVG paths instead of sharp polylines", () => {
    const {container} = render(<GeometrySketchScene sketch={page14ContractR1Sketch} />);
    const cookEdge = container.querySelector('[data-edge-id="computer-to-a"] path[data-edge-stroke="true"]');

    expect(cookEdge).toBeInTheDocument();
    expect(cookEdge?.getAttribute("d")).toContain("Q");
    expect(
      container.querySelector('[data-edge-id="computer-to-a"] polyline'),
    ).not.toBeInTheDocument();
  });

  it("does not paint its own full-canvas background inside the host stage", () => {
    const {container} = render(<GeometrySketchScene sketch={page14ContractR1Sketch} />);

    expect(
      container.querySelectorAll('rect[x="0"][y="0"][width="1280"][height="720"]'),
    ).toHaveLength(0);
  });
});
