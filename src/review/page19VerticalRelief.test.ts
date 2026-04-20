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

    expect(artifact.metrics.minRenderedFontPx).toBeGreaterThanOrEqual(17);
    expect(artifact.metrics.minInternalPadding).toBeGreaterThanOrEqual(10);
    expect(artifact.metrics.topMargin).toBeLessThan(160);
    expect(artifact.metrics.bottomMargin).toBeLessThan(160);
  });

  it("keeps the UE subtree inside stable while reducing the right-heavy imbalance", () => {
    const artifact = buildGeometryReviewArtifact(page19R1Sketch);

    expect(artifact.metrics.childOutOfBoundsCount).toBe(0);
    expect(artifact.metrics.minNodeGap).toBeGreaterThanOrEqual(32);
    expect(artifact.metrics.leftRightMassDelta).toBeLessThanOrEqual(0.21);
  });
});
