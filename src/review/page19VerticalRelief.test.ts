import {describe, expect, it} from "vitest";
import {page19R1Sketch} from "../harness/slide-geometry/contracts/page19-r1";
import {buildGeometryReviewArtifact} from "../harness/slide-geometry/review/geometryReviewArtifact";

describe("page_19 vertical relief harness goals", () => {
  it("removes GPU pierce issues and improves tight typography budgets", () => {
    const artifact = buildGeometryReviewArtifact(page19R1Sketch);

    expect(artifact.metrics.nodePierceCount).toBe(0);
    expect(artifact.metrics.minRenderedFontPx).toBeGreaterThanOrEqual(17);
    expect(artifact.metrics.minInternalPadding).toBeGreaterThanOrEqual(10);
    expect(artifact.metrics.topMargin).toBeLessThan(160);
    expect(artifact.metrics.bottomMargin).toBeLessThan(160);
  });
});
