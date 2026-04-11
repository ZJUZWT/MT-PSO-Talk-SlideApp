import {describe, expect, it} from "vitest";
import {page09R1Sketch} from "../contracts/page09-r1";
import {page14ContractR1Sketch} from "../contracts/page14-contract-r1";
import {
  isGeometrySketchId,
  resolveGeometrySketch,
} from "../registry/sketchRegistry";
import {buildGeometryReviewArtifact} from "./geometryReviewArtifact";

describe("geometryReviewArtifact", () => {
  it("builds a fact-bound review artifact for page09-r1", () => {
    const artifact = buildGeometryReviewArtifact(page09R1Sketch);

    expect(artifact.facts).toEqual(
      expect.arrayContaining([
        {label: "Receiver plane", value: "SharedCode Library"},
        {
          label: "Primary line",
          value:
            "ResourceIndex + ShaderMapIndex / VS+PS Hash -> LibraryShaderIndex -> ShaderEntries -> Cooked ShaderCode",
        },
      ]),
    );
    expect(artifact.metrics.overlapCount).toBe(0);
    expect(artifact.metrics.crossingCount).toBe(0);
    expect(artifact.metrics.avoidableBendCount).toBe(0);
    expect(artifact.metrics.minNodeGap).toBeGreaterThanOrEqual(24);
    expect(artifact.metrics.minMargin).toBeGreaterThanOrEqual(28);
    expect(artifact.facts).toEqual(
      expect.arrayContaining([
        {
          label: "Overflow labels",
          value: "None",
        },
        {
          label: "Minimum rendered font",
          value: expect.stringContaining(
            `${Math.round(artifact.metrics.minRenderedFontPx)}px`,
          ),
        },
      ]),
    );
    expect((artifact.metrics as Record<string, unknown>).textOverflowCount).toBe(0);
    expect((artifact.metrics as Record<string, unknown>).maxTextOverflowPx).toBe(0);
    expect((artifact.metrics as Record<string, unknown>).minRenderedFontPx).toBeGreaterThanOrEqual(24);
    expect(artifact.scores.blockerOpen).toBe(false);
    expect(artifact.scores.stageLayout).toBeGreaterThanOrEqual(6);
    expect(artifact.scores.lineStraightness).toBeGreaterThanOrEqual(7);
    expect(artifact.scores.primaryLineClarity).toBeGreaterThanOrEqual(7);
    expect(artifact.mechanicalScore).toBeGreaterThanOrEqual(6);
    expect(artifact.verdict).toBe("Open the layout before critic pass");
    expect(artifact.topFixes).toHaveLength(3);
    expect(artifact.topFixes[0]).not.toContain("overflow");
  });

  it("builds fact-bound review artifacts for the loop sketch pages", () => {
    const expectations = [
      {
        sketchId: "page10-r1",
        receiverPlane: "Phone / Runtime",
        primaryLine:
          "Computer(Material) --cook--> split -> .shaderbytecode + .scl.csv -> Phone(Runtime)",
      },
      {
        sketchId: "page11-r1",
        receiverPlane: "Runtime Frame",
        primaryLine: ".shaderbytecode + .scl.csv -> runtime frame",
      },
      {
        sketchId: "page12-r1",
        receiverPlane: ".rec.upipelinecache return leg",
        primaryLine: "runtime frame -> .rec.upipelinecache -> computer side",
      },
      {
        sketchId: "page13-r1",
        receiverPlane: "Stable Outputs",
        primaryLine: "computer side -> expand -> stablepc.csv + stable.upipelinecache",
      },
      {
        sketchId: "page14-contract-r1",
        receiverPlane: "Computer lower-left anchor to Phone lower-right anchor",
        primaryLine:
          "Computer -> A -> .ushaderbytecode / .scl.csv -> Phone, with stablepc.csv / .scl.csv converging through B before stable.upipelinecache",
      },
    ] as const;

    for (const expectation of expectations) {
      expect(isGeometrySketchId(expectation.sketchId)).toBe(true);
      if (!isGeometrySketchId(expectation.sketchId)) {
        continue;
      }

      const artifact = buildGeometryReviewArtifact(
        resolveGeometrySketch(expectation.sketchId),
      );

      expect(artifact.facts).toEqual(
        expect.arrayContaining([
          {label: "Receiver plane", value: expectation.receiverPlane},
          {label: "Primary line", value: expectation.primaryLine},
        ]),
      );
      expect(artifact.metrics.textOverflowCount).toBe(0);
      expect(artifact.metrics.crossingCount).toBe(0);
      expect(artifact.metrics.minRenderedFontPx).toBeGreaterThanOrEqual(18);
    }
  });

  it("exposes per-node rendered font sizes so node review can score typography directly", () => {
    const artifact = buildGeometryReviewArtifact(page14ContractR1Sketch);
    const stableUpipe = artifact.nodeTextMetrics.find(
      (nodeMetric) => nodeMetric.nodeId === "stable-upipe",
    );
    const mergeNode = artifact.nodeTextMetrics.find(
      (nodeMetric) => nodeMetric.nodeId === "b",
    );

    expect(stableUpipe).toMatchObject({
      nodeId: "stable-upipe",
      label: "stable.upipelinecache",
      renderedFontPx: expect.any(Number),
      renderedFontPt: expect.any(Number),
      topPaddingPx: expect.any(Number),
      rightPaddingPx: expect.any(Number),
      bottomPaddingPx: expect.any(Number),
      leftPaddingPx: expect.any(Number),
      tightestPaddingPx: expect.any(Number),
    });
    expect(stableUpipe?.renderedFontPx).toBeGreaterThanOrEqual(28);
    expect(artifact.metrics.minRenderedFontPx).toBeGreaterThanOrEqual(28);
    expect(artifact.metrics.minInternalPadding).toBeGreaterThan(0);
    expect(mergeNode).toBeUndefined();
  });

  it("includes minimum internal text padding in the fact layer", () => {
    const artifact = buildGeometryReviewArtifact(page14ContractR1Sketch);

    expect(artifact.facts).toEqual(
      expect.arrayContaining([
        {
          label: "Minimum internal padding",
          value: expect.stringContaining("px"),
        },
      ]),
    );
  });

  it("keeps stable upipelinecache off the box edge even after the font bump", () => {
    const artifact = buildGeometryReviewArtifact(page14ContractR1Sketch);
    const stableUpipe = artifact.nodeTextMetrics.find(
      (nodeMetric) => nodeMetric.nodeId === "stable-upipe",
    );

    expect(stableUpipe?.tightestPaddingPx).toBeGreaterThanOrEqual(8);
    expect(artifact.metrics.minInternalPadding).toBeGreaterThanOrEqual(8);
  });

  it("exposes edge anchor offsets so script scoring can cite line centering discipline", () => {
    const artifact = buildGeometryReviewArtifact(page14ContractR1Sketch);
    const phoneToRec = artifact.edgeAnchorMetrics.find(
      (metric) => metric.edgeId === "phone-to-rec",
    );
    const recToComputer = artifact.edgeAnchorMetrics.find(
      (metric) => metric.edgeId === "rec-to-computer",
    );

    expect(phoneToRec).toMatchObject({
      edgeId: "phone-to-rec",
      fromNodeId: "phone",
      fromSide: "top",
      fromOffsetPx: 0,
    });
    expect(recToComputer).toMatchObject({
      edgeId: "rec-to-computer",
      toNodeId: "computer",
      toSide: "top",
      toOffsetPx: 0,
    });
  });
});
