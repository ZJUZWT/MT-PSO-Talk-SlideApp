import {describe, expect, it} from "vitest";
import {PAGE9_UASSET_FRAME} from "../../../src/remotion/pages/page-layout-constants";
import {page09R1Sketch} from "../../../src/harness/slide-geometry/contracts/page09-r1";

function nodeById(nodeId: string) {
  return page09R1Sketch.nodes.find((node) => node.id === nodeId);
}

function edgeById(edgeId: string) {
  return page09R1Sketch.edges.find((edge) => edge.id === edgeId);
}

describe("page09R1Sketch", () => {
  it("mirrors the formal dual-route topology for page09", () => {
    expect(nodeById("resource-index")?.containerId).toBe("fshader");
    expect(nodeById("shadermap-index")?.containerId).toBe("shared-resource");

    expect(nodeById("material-a")?.label).toBe("Material A");
    expect(nodeById("material-b")?.label).toBe("Material B");
    expect(nodeById("material-c")?.label).toBe("Material C");

    expect(nodeById("material-a")?.y).toBeLessThan(PAGE9_UASSET_FRAME.y);
    expect(nodeById("pso-cache")?.y).toBeGreaterThan(
      PAGE9_UASSET_FRAME.y + PAGE9_UASSET_FRAME.height,
    );

    expect(edgeById("resourceindex-to-lookup")?.tone).toBe("primary");
    expect(edgeById("shadermapindex-to-entries")?.tone).toBe("primary");
    expect(edgeById("pso-to-hash")?.tone).toBe("primary");
  });
});
