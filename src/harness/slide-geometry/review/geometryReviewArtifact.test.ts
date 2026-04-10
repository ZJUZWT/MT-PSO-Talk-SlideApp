import {describe, expect, it} from "vitest";
import {page09R1Sketch} from "../contracts/page09-r1";
import {buildGeometryReviewArtifact} from "./geometryReviewArtifact";

describe("geometryReviewArtifact", () => {
  it("builds a fact-bound review artifact for page09-r1", () => {
    const artifact = buildGeometryReviewArtifact(page09R1Sketch);

    expect(artifact.facts).toEqual(
      expect.arrayContaining([
        {label: "Receiver plane", value: "SharedCode Library"},
        {
          label: "Primary line",
          value: "FShader / ShaderMapIndex / Hash -> LibraryShaderIndex -> ShaderEntries -> Cooked ShaderCode",
        },
      ]),
    );
    expect(artifact.metrics.overlapCount).toBe(5);
    expect(artifact.metrics.minNodeGap).toBe(0);
    expect(artifact.metrics.minMargin).toBe(30);
    expect(artifact.scores.blockerOpen).toBe(true);
    expect(artifact.scores.lineStraightness).toBe(6);
    expect(artifact.scores.primaryLineClarity).toBe(1);
    expect(artifact.mechanicalScore).toBe(3.4);
    expect(artifact.verdict).toBe("Remove layout overlaps before critic pass");
    expect(artifact.topFixes).toHaveLength(3);
    expect(artifact.topFixes[0]).toContain("5 overlapping box pairs");
    expect(artifact.topFixes[1]).toContain("2 bends");
  });
});
