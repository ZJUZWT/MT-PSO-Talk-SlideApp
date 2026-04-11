import {describe, expect, it} from "vitest";
import {page10R1Sketch} from "../../../src/harness/slide-geometry/contracts/page10-r1";

function nodeById(nodeId: string) {
  return page10R1Sketch.nodes.find((node) => node.id === nodeId);
}

function edgeById(edgeId: string) {
  return page10R1Sketch.edges.find((edge) => edge.id === edgeId);
}

describe("page10R1Sketch", () => {
  it("derives the geometry contract from the approved logic contract", () => {
    expect(nodeById("cook")).toBeUndefined();
    expect(nodeById("cook-split")?.label).toBe("");

    expect(nodeById("computer")?.label).toBe("Computer");
    expect(nodeById("material")?.containerId).toBe("computer");
    expect(nodeById("phone")?.label).toBe("Phone");
    expect(nodeById("runtime")?.containerId).toBe("phone");
    expect(nodeById("runtime")?.label).toBe("Runtime");
    expect(nodeById("vertexdata")?.containerId).toBe("runtime");
    expect(nodeById("gpu")?.containerId).toBe("runtime");
    expect(nodeById("pixels")?.containerId).toBe("runtime");

    expect(edgeById("material-to-cook-split")?.tone).toBe("primary");
    expect(edgeById("cook-split-to-shaderbytecode")?.tone).toBe("primary");
    expect(edgeById("cook-split-to-scl-csv")?.tone).toBe("primary");
    expect(edgeById("shaderbytecode-to-runtime")?.to).toEqual({
      x: expect.any(Number),
      y: expect.any(Number),
    });
    expect(edgeById("scl-csv-to-runtime")?.to).toEqual({
      x: expect.any(Number),
      y: expect.any(Number),
    });
  });

  it("keeps cook as an edge label and uses the approved 45-degree routing language", () => {
    const materialToSplit = edgeById("material-to-cook-split");
    const splitToBytecode = edgeById("cook-split-to-shaderbytecode");
    const splitToScl = edgeById("cook-split-to-scl-csv");

    expect(materialToSplit?.label).toBe("cook");
    expect(materialToSplit?.waypoints).toHaveLength(1);
    expect(materialToSplit?.waypoints?.[0]).toEqual({
      x: expect.any(Number),
      y: expect.any(Number),
    });

    const [diagonalTurn] = materialToSplit?.waypoints ?? [];
    if (!materialToSplit || !diagonalTurn) {
      return;
    }

    expect(diagonalTurn.x - materialToSplit.from.x).toBeGreaterThan(0);
    expect(diagonalTurn.y - materialToSplit.from.y).toBeGreaterThan(0);
    expect(diagonalTurn.x - materialToSplit.from.x).toBe(
      diagonalTurn.y - materialToSplit.from.y,
    );
    expect(materialToSplit.to.y).toBe(diagonalTurn.y);
    expect(materialToSplit.to.x).toBeGreaterThan(diagonalTurn.x);

    expect(splitToBytecode?.waypoints).toHaveLength(1);
    expect(splitToScl?.waypoints).toHaveLength(1);

    const [upperTurn] = splitToBytecode?.waypoints ?? [];
    const [lowerTurn] = splitToScl?.waypoints ?? [];
    if (!splitToBytecode || !splitToScl || !upperTurn || !lowerTurn) {
      return;
    }

    expect(upperTurn.x - splitToBytecode.from.x).toBeGreaterThan(0);
    expect(lowerTurn.x - splitToScl.from.x).toBeGreaterThan(0);
    expect(upperTurn.x - splitToBytecode.from.x).toBe(
      lowerTurn.x - splitToScl.from.x,
    );
    expect(splitToBytecode.from.y - upperTurn.y).toBeGreaterThan(0);
    expect(lowerTurn.y - splitToScl.from.y).toBeGreaterThan(0);
    expect(splitToBytecode.from.y - upperTurn.y).toBe(
      lowerTurn.y - splitToScl.from.y,
    );
    expect(splitToBytecode.to.y).toBe(upperTurn.y);
    expect(splitToScl.to.y).toBe(lowerTurn.y);
  });
});
