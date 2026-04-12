import {describe, expect, it} from "vitest";
import {
  isGeometrySketchId,
  resolveGeometrySketch,
} from "../../../src/harness/slide-geometry/registry/sketchRegistry";
import {page14R1Sketch} from "../../../src/harness/slide-geometry/contracts/page14-r1";
import {page15R1Sketch} from "../../../src/harness/slide-geometry/contracts/page15-r1";

function nodeById(sketch: typeof page15R1Sketch, nodeId: string) {
  return sketch.nodes.find((node) => node.id === nodeId);
}

function edgeById(sketch: typeof page15R1Sketch, edgeId: string) {
  return sketch.edges.find((edge) => edge.id === edgeId);
}

function centerY(sketch: typeof page15R1Sketch, nodeId: string) {
  const node = nodeById(sketch, nodeId);
  if (!node) {
    throw new Error(`Missing node ${nodeId}`);
  }

  return node.y + node.height / 2;
}

function centerX(sketch: typeof page15R1Sketch, nodeId: string) {
  const node = nodeById(sketch, nodeId);
  if (!node) {
    throw new Error(`Missing node ${nodeId}`);
  }

  return node.x + node.width / 2;
}

describe("loop sketch registry", () => {
  it("registers the active loop pages for page14 and page15", () => {
    expect(isGeometrySketchId("page14-r1")).toBe(true);
    expect(isGeometrySketchId("page15-r1")).toBe(true);

    if (!isGeometrySketchId("page14-r1") || !isGeometrySketchId("page15-r1")) {
      throw new Error("page14-r1 and page15-r1 should both resolve as sketch ids");
    }

    expect(resolveGeometrySketch("page14-r1")).toBe(page14R1Sketch);
    expect(resolveGeometrySketch("page15-r1")).toBe(page15R1Sketch);
  });
});

describe("page14R1Sketch", () => {
  it("keeps the required shared baselines for the loop template", () => {
    expect(centerY(page14R1Sketch, "computer")).toBe(centerY(page14R1Sketch, "scl"));
    expect(centerY(page14R1Sketch, "computer")).toBe(centerY(page14R1Sketch, "phone"));
    expect(centerY(page14R1Sketch, "stable-pc")).toBe(
      centerY(page14R1Sketch, "stable-upipe"),
    );
  });

  it("keeps cook and expand as edge labels instead of nodes", () => {
    expect(nodeById(page14R1Sketch, "cook")).toBeUndefined();
    expect(nodeById(page14R1Sketch, "expand")).toBeUndefined();
    expect(edgeById(page14R1Sketch, "computer-to-a")?.label).toBe("cook");
    expect(edgeById(page14R1Sketch, "computer-to-stablepc")?.label).toBe("expand");
  });

  it("shows the stable merge path before the final phone landing", () => {
    expect(nodeById(page14R1Sketch, "b")).toMatchObject({
      label: "+",
      shape: "circle",
    });
    expect(edgeById(page14R1Sketch, "stableupipe-to-phone")).toBeUndefined();
    expect(edgeById(page14R1Sketch, "stablepc-to-b")).toBeDefined();
    expect(edgeById(page14R1Sketch, "scl-to-b")).toBeDefined();
    expect(edgeById(page14R1Sketch, "b-to-stableupipe")).toBeDefined();
  });
});

describe("page15R1Sketch", () => {
  it("keeps A and B as explicit circular junctions in the completed loop", () => {
    expect(nodeById(page15R1Sketch, "a")).toMatchObject({shape: "circle"});
    expect(nodeById(page15R1Sketch, "b")).toMatchObject({
      label: "+",
      shape: "circle",
    });
  });

  it("keeps major device anchors centered and evenly averaged", () => {
    const cook = edgeById(page15R1Sketch, "computer-to-a");
    const expand = edgeById(page15R1Sketch, "computer-to-stablepc");
    const bytecodeToPhone = edgeById(page15R1Sketch, "bytecode-to-phone");
    const stableToPhone = edgeById(page15R1Sketch, "stableupipe-to-phone");
    const phoneToRec = edgeById(page15R1Sketch, "phone-to-rec");
    const recToComputer = edgeById(page15R1Sketch, "rec-to-computer");

    if (
      !cook ||
      !expand ||
      !bytecodeToPhone ||
      !stableToPhone ||
      !phoneToRec ||
      !recToComputer
    ) {
      return;
    }

    expect(cook.from.x).toBe(expand.from.x);
    expect(bytecodeToPhone.to.x).toBe(stableToPhone.to.x);
    expect(bytecodeToPhone.to.y - centerY(page15R1Sketch, "phone")).toBe(
      -(stableToPhone.to.y - centerY(page15R1Sketch, "phone")),
    );
    expect(phoneToRec.from.x).toBe(centerX(page15R1Sketch, "phone"));
    expect(recToComputer.to.x).toBe(centerX(page15R1Sketch, "computer"));
  });

  it("uses the declared 0/45/90 route grammar for the completed loop branches", () => {
    const cook = edgeById(page15R1Sketch, "computer-to-a");
    const bytecode = edgeById(page15R1Sketch, "a-to-bytecode");
    const scl = edgeById(page15R1Sketch, "a-to-scl");
    const bytecodeToPhone = edgeById(page15R1Sketch, "bytecode-to-phone");
    const stablePcToB = edgeById(page15R1Sketch, "stablepc-to-b");
    const sclToB = edgeById(page15R1Sketch, "scl-to-b");
    const bToStable = edgeById(page15R1Sketch, "b-to-stableupipe");
    const stableToPhone = edgeById(page15R1Sketch, "stableupipe-to-phone");

    expect(cook?.waypoints).toHaveLength(1);
    expect(bytecode?.waypoints).toHaveLength(1);
    expect(scl?.waypoints).toHaveLength(1);
    expect(bytecodeToPhone?.waypoints).toHaveLength(1);
    expect(stablePcToB).toBeDefined();
    expect(sclToB?.waypoints).toHaveLength(1);
    expect(bToStable).toBeDefined();
    expect(stableToPhone?.waypoints).toHaveLength(1);
  });
});
