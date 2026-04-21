import {describe, expect, it} from "vitest";
import {page19R1Sketch} from "../harness/slide-geometry/contracts/page19-r1";
import {buildGeometryReviewArtifact} from "../harness/slide-geometry/review/geometryReviewArtifact";

describe("page_19 vertical relief harness goals", () => {
  it("lands the Vulkan disk route on the disk box boundary without piercing", () => {
    const artifact = buildGeometryReviewArtifact(page19R1Sketch);
    const vkRoute = artifact.edgeRouteMetrics.find(
      (metric) => metric.edgeId === "vk-to-disk",
    );
    const vkAnchor = artifact.edgeAnchorMetrics.find(
      (metric) => metric.edgeId === "vk-to-disk",
    );

    expect(artifact.metrics.nodePierceCount).toBe(0);
    expect(vkRoute).toMatchObject({
      edgeId: "vk-to-disk",
      nodePierceCount: 0,
      badEndpointCount: 0,
    });
    expect(vkAnchor).toMatchObject({
      edgeId: "vk-to-disk",
      toNodeId: "disk-vk",
      toSide: "left",
      toOffsetPx: 0,
    });
  });

  it("keeps typography budgets after the route cleanup", () => {
    const artifact = buildGeometryReviewArtifact(page19R1Sketch);

    expect(artifact.metrics.minRenderedFontPx).toBeGreaterThanOrEqual(12.5);
    expect(artifact.metrics.minInternalPadding).toBeGreaterThanOrEqual(6.5);
    expect(artifact.metrics.topMargin).toBeLessThan(110);
    expect(artifact.metrics.bottomMargin).toBeLessThan(60);
  });

  it("keeps the UE subtree inside stable while holding the new top-row layout in range", () => {
    const artifact = buildGeometryReviewArtifact(page19R1Sketch);
    const stableNode = page19R1Sketch.nodes.find((node) => node.id === "stable");
    const gfxNode = page19R1Sketch.nodes.find((node) => node.id === "gfx-pso");
    const diskNode = page19R1Sketch.nodes.find((node) => node.id === "disk-group");

    expect(artifact.metrics.childOutOfBoundsCount).toBe(0);
    expect(artifact.metrics.minNodeGap).toBeGreaterThanOrEqual(4);
    expect(stableNode).toBeDefined();
    expect(gfxNode).toBeDefined();
    expect(diskNode).toBeDefined();
    expect(Math.abs((stableNode?.width ?? 0) - (gfxNode?.width ?? 0))).toBeLessThanOrEqual(1);
    expect(Math.abs((gfxNode?.width ?? 0) - (diskNode?.width ?? 0))).toBeLessThanOrEqual(1);
    expect(Math.abs((gfxNode?.x ?? 0) + (gfxNode?.width ?? 0) / 2 - 640)).toBeLessThanOrEqual(1);
    expect(
      Math.abs((stableNode?.x ?? 0) - (1280 - (diskNode?.x ?? 0) - (diskNode?.width ?? 0))),
    ).toBeLessThanOrEqual(1);
    expect(
      Math.abs(
        (gfxNode?.x ?? 0) - ((stableNode?.x ?? 0) + (stableNode?.width ?? 0)) -
          ((diskNode?.x ?? 0) - ((gfxNode?.x ?? 0) + (gfxNode?.width ?? 0))),
      ),
    ).toBeLessThanOrEqual(1);
  });
});
