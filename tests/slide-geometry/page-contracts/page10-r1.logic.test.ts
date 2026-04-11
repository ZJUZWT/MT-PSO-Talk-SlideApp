import {describe, expect, it} from "vitest";
import {page10R1LogicContract} from "../../../src/harness/slide-geometry/contracts/page10-r1.logic";

function primitiveById(id: string) {
  return page10R1LogicContract.primitives.find((primitive) => primitive.id === id);
}

function edgeById(id: string) {
  return page10R1LogicContract.edges.find((edge) => edge.id === id);
}

describe("page10R1LogicContract", () => {
  it("treats cook as an edge label and not as a box node", () => {
    expect(primitiveById("cook")?.kind).toBe("edge-label");
    expect(
      page10R1LogicContract.primitives.some(
        (primitive) => primitive.kind === "node" && primitive.label === "cook",
      ),
    ).toBe(false);
    expect(edgeById("material-to-cook-split")?.labelRef).toBe("cook");
  });

  it("treats Runtime as a container around the runtime chain", () => {
    expect(primitiveById("runtime")?.kind).toBe("container");
    expect(primitiveById("runtime")?.contains).toEqual([
      "vertexdata",
      "gpu",
      "pixels",
    ]);

    expect(edgeById("shaderbytecode-to-runtime")?.to).toBe("runtime");
    expect(edgeById("scl-csv-to-runtime")?.to).toBe("runtime");
    expect(edgeById("vertexdata-to-gpu")?.entersContainerId).toBe("runtime");
    expect(edgeById("gpu-to-pixels")?.entersContainerId).toBe("runtime");
  });
});
