import {describe, expect, it} from "vitest";
import {
  isGeometrySketchId,
  resolveGeometrySketch,
} from "../../../src/harness/slide-geometry/registry/sketchRegistry";
import {page14ContractR1Logic} from "../../../src/harness/slide-geometry/contracts/page14-contract-r1.logic";
import {page14ContractR1Sketch} from "../../../src/harness/slide-geometry/contracts/page14-contract-r1";

function nodeById(nodeId: string) {
  return page14ContractR1Sketch.nodes.find((node) => node.id === nodeId);
}

function edgeById(edgeId: string) {
  return page14ContractR1Sketch.edges.find((edge) => edge.id === edgeId);
}

function centerY(nodeId: string) {
  const node = nodeById(nodeId);
  if (!node) {
    throw new Error(`Missing node ${nodeId}`);
  }

  return node.y + node.height / 2;
}

function centerX(nodeId: string) {
  const node = nodeById(nodeId);
  if (!node) {
    throw new Error(`Missing node ${nodeId}`);
  }

  return node.x + node.width / 2;
}

function top(nodeId: string) {
  const node = nodeById(nodeId);
  if (!node) {
    throw new Error(`Missing node ${nodeId}`);
  }

  return node.y;
}

function bottom(nodeId: string) {
  const node = nodeById(nodeId);
  if (!node) {
    throw new Error(`Missing node ${nodeId}`);
  }

  return node.y + node.height;
}

describe("page14ContractR1Logic", () => {
  it("keeps line labels and the split junction as explicit contract elements", () => {
    expect(page14ContractR1Logic.nodes.find((node) => node.id === "a")?.visualKind).toBe(
      "junction",
    );
    expect(page14ContractR1Logic.nodes.find((node) => node.id === "b")?.visualKind).toBe(
      "junction",
    );
    expect(
      page14ContractR1Logic.edges.find((edge) => edge.id === "computer-to-a")
        ?.segmentLabel,
    ).toBe("cook");
    expect(
      page14ContractR1Logic.edges.find((edge) => edge.id === "computer-to-stablepc")
        ?.segmentLabel,
    ).toBe("expand");
    expect(
      page14ContractR1Logic.edges.find((edge) => edge.id === "stablepc-to-stableupipe"),
    ).toBeUndefined();
    expect(
      page14ContractR1Logic.edges.find((edge) => edge.id === "scl-to-stableupipe"),
    ).toBeUndefined();
    expect(
      page14ContractR1Logic.edges.find((edge) => edge.id === "stablepc-to-b")?.to,
    ).toBe("b");
    expect(
      page14ContractR1Logic.edges.find((edge) => edge.id === "scl-to-b")?.to,
    ).toBe("b");
    expect(
      page14ContractR1Logic.edges.find((edge) => edge.id === "b-to-stableupipe")?.from,
    ).toBe("b");
  });
});

describe("page14ContractR1Sketch", () => {
  it("registers the contract-first sketch", () => {
    expect(isGeometrySketchId("page14-contract-r1")).toBe(true);
    if (!isGeometrySketchId("page14-contract-r1")) {
      throw new Error("page14-contract-r1 should resolve as sketch id");
    }

    expect(resolveGeometrySketch("page14-contract-r1")).toBe(
      page14ContractR1Sketch,
    );
  });

  it("keeps the required shared baselines", () => {
    expect(centerY("computer")).toBe(centerY("scl"));
    expect(centerY("computer")).toBe(centerY("phone"));
    expect(centerY("stable-pc")).toBe(centerY("stable-upipe"));
  });

  it("keeps cook and expand as edge labels instead of nodes", () => {
    expect(nodeById("cook")).toBeUndefined();
    expect(nodeById("expand")).toBeUndefined();
    expect(edgeById("computer-to-a")?.label).toBe("cook");
    expect(edgeById("computer-to-stablepc")?.label).toBe("expand");
  });

  it("renders B as a circular plus junction instead of a direct file node", () => {
    expect(nodeById("b")).toMatchObject({
      label: "+",
      shape: "circle",
    });
  });

  it("renders A as an explicit circular split junction so split and merge use one visual language", () => {
    expect(nodeById("a")).toMatchObject({
      shape: "circle",
    });
    expect(nodeById("a")?.width).toBeGreaterThanOrEqual(16);
    expect(nodeById("a")?.height).toBeGreaterThanOrEqual(16);
  });

  it("keeps major device anchors centered and evenly averaged", () => {
    const cook = edgeById("computer-to-a");
    const expand = edgeById("computer-to-stablepc");
    const bytecodeToPhone = edgeById("bytecode-to-phone");
    const stableToPhone = edgeById("stableupipe-to-phone");
    const phoneToRec = edgeById("phone-to-rec");
    const recToComputer = edgeById("rec-to-computer");

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
    expect(cook.from.y).toBeGreaterThan(top("computer"));
    expect(cook.from.y).toBeLessThan(bottom("computer"));
    expect(expand.from.y).toBeGreaterThan(top("computer"));
    expect(expand.from.y).toBeLessThan(bottom("computer"));
    expect(cook.from.y - centerY("computer")).toBe(
      -(expand.from.y - centerY("computer")),
    );

    expect(bytecodeToPhone.to.x).toBe(stableToPhone.to.x);
    expect(bytecodeToPhone.to.y - centerY("phone")).toBe(
      -(stableToPhone.to.y - centerY("phone")),
    );

    expect(phoneToRec.from.x).toBe(centerX("phone"));
    expect(recToComputer.to.x).toBe(centerX("computer"));
  });

  it("uses the declared 0/45/90 route grammar for the main branches", () => {
    const cook = edgeById("computer-to-a");
    const bytecode = edgeById("a-to-bytecode");
    const scl = edgeById("a-to-scl");
    const bytecodeToPhone = edgeById("bytecode-to-phone");
    const stablePcToB = edgeById("stablepc-to-b");
    const sclToB = edgeById("scl-to-b");
    const bToStable = edgeById("b-to-stableupipe");
    const stableToPhone = edgeById("stableupipe-to-phone");

    expect(cook?.waypoints).toHaveLength(1);
    expect(bytecode?.waypoints).toHaveLength(1);
    expect(scl?.waypoints).toHaveLength(1);
    expect(bytecodeToPhone?.waypoints).toHaveLength(1);
    expect(stablePcToB).toBeDefined();
    expect(sclToB?.waypoints).toHaveLength(1);
    expect(bToStable).toBeDefined();

    const [cookTurn] = cook?.waypoints ?? [];
    if (!cook || !cookTurn) {
      return;
    }

    expect(cookTurn.x - cook.from.x).toBe(cookTurn.y - cook.from.y);
    expect(cook.to.y).toBe(cookTurn.y);
    expect(cook.to.x).toBeGreaterThan(cookTurn.x);

    const [bytecodeTurn] = bytecode?.waypoints ?? [];
    if (!bytecode || !bytecodeTurn) {
      return;
    }

    expect(bytecodeTurn.x - bytecode.from.x).toBe(
      bytecodeTurn.y - bytecode.from.y,
    );
    expect(bytecode.to.y).toBe(bytecodeTurn.y);
    expect(bytecode.to.x).toBeGreaterThan(bytecodeTurn.x);

    const [sclTurn] = scl?.waypoints ?? [];
    if (!scl || !sclTurn) {
      return;
    }

    expect(sclTurn.x - scl.from.x).toBe(scl.from.y - sclTurn.y);
    expect(scl.to.y).toBe(sclTurn.y);
    expect(scl.to.x).toBeGreaterThan(sclTurn.x);

    if (!stablePcToB || !sclToB || !bToStable) {
      return;
    }

    expect(stablePcToB.waypoints ?? []).toHaveLength(0);
    expect(stablePcToB.from.y).toBe(stablePcToB.to.y);
    expect(stablePcToB.to.x).toBeGreaterThan(stablePcToB.from.x);

    const [sclToBTurn] = sclToB.waypoints ?? [];
    if (!sclToBTurn) {
      return;
    }

    expect(sclToBTurn.y).toBe(sclToB.from.y);
    expect(sclToB.to.x - sclToBTurn.x).toBe(
      sclToBTurn.y - sclToB.to.y,
    );
    expect(bToStable.waypoints ?? []).toHaveLength(0);
    expect(bToStable.from.y).toBe(bToStable.to.y);
    expect(bToStable.to.x).toBeGreaterThan(bToStable.from.x);

    const [phoneTurn] = bytecodeToPhone?.waypoints ?? [];
    if (!bytecodeToPhone || !phoneTurn) {
      return;
    }

    expect(phoneTurn.y).toBe(bytecodeToPhone.from.y);
    expect(bytecodeToPhone.to.x - phoneTurn.x).toBe(
      phoneTurn.y - bytecodeToPhone.to.y,
    );

    const [stableTurn] = stableToPhone?.waypoints ?? [];
    if (!stableToPhone || !stableTurn) {
      return;
    }

    expect(stableTurn.y).toBe(stableToPhone.from.y);
    expect(stableToPhone.to.x - stableTurn.x).toBe(
      stableToPhone.to.y - stableTurn.y,
    );
  });
});
