import {describe, expect, it} from "vitest";
import {page09R1Sketch} from "../contracts/page09-r1";
import {page14R1Sketch} from "../contracts/page14-r1";
import {page15R1Sketch} from "../contracts/page15-r1";
import type {GeometrySketchDefinition} from "../render/geometry-sketch-types";
import type {BrowserGeometryTextProbe} from "./browserGeometryTextProbe";
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
    expect(artifact.metrics.edgeOverlapCount).toBe(0);
    expect(artifact.metrics.hookTurnCount).toBe(0);
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
    expect(artifact.scores.primaryLineClarity).toBeGreaterThanOrEqual(6);
    expect(artifact.mechanicalScore).toBeGreaterThanOrEqual(6);
    expect(artifact.verdict).toBe("Open the layout before critic pass");
    expect(artifact.topFixes).toHaveLength(3);
    expect(artifact.topFixes[0]).not.toContain("overflow");
    expect(artifact.edgeRouteMetrics.length).toBe(page09R1Sketch.edges.length);
  });

  it("builds fact-bound review artifacts for the loop sketch pages", () => {
    const expectations = [
      {
        sketchId: "page10-r1",
        receiverPlane: "Phone / Runtime",
        primaryLine:
          "Computer(Material) --cook--> split -> .ushaderbytecode + .scl.csv -> Phone(Runtime)",
        expectedCrossingCount: 0,
      },
      {
        sketchId: "page11-r1",
        receiverPlane: "Cook split staging",
        primaryLine: "Computer -> A -> .ushaderbytecode / .scl.csv",
        expectedCrossingCount: 0,
      },
      {
        sketchId: "page12-r1",
        receiverPlane: "Phone runtime landing",
        primaryLine: ".ushaderbytecode -> Phone",
        expectedCrossingCount: 0,
      },
      {
        sketchId: "page13-r1",
        receiverPlane: "Phone return arc",
        primaryLine: "Phone -> rec.upipelinecache -> Computer",
        expectedCrossingCount: 0,
      },
      {
        sketchId: "page14-r1",
        receiverPlane: "Computer expand and stable merge",
        primaryLine:
          "Computer -> stablepc.csv + .scl.csv -> B -> stable.upipelinecache",
        expectedCrossingCount: 0,
      },
      {
        sketchId: "page15-r1",
        receiverPlane:
          "Computer lower-left source, Phone lower-right runtime sink, stable band across the middle",
        primaryLine:
          "Computer -> split A -> .scl.csv / .ushaderbytecode -> Phone, plus Computer/.scl.csv -> expand merge -> stablepc.csv -> merge B -> stable.upipelinecache -> Phone",
        expectedCrossingCount: 0,
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
      expect(artifact.metrics.crossingCount).toBe(expectation.expectedCrossingCount);
      expect(artifact.metrics.minRenderedFontPx).toBeGreaterThanOrEqual(18);
    }
  });

  it("exposes per-node rendered font sizes so node review can score typography directly", () => {
    const artifact = buildGeometryReviewArtifact(page15R1Sketch);
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
    expect(stableUpipe?.renderedFontPx).toBeGreaterThanOrEqual(26);
    expect(artifact.metrics.minRenderedFontPx).toBeGreaterThanOrEqual(26);
    expect(artifact.metrics.minInternalPadding).toBeGreaterThan(0);
    expect(mergeNode).toBeUndefined();
  });

  it("includes minimum internal text padding in the fact layer", () => {
    const artifact = buildGeometryReviewArtifact(page15R1Sketch);

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
    const artifact = buildGeometryReviewArtifact(page15R1Sketch);
    const stableUpipe = artifact.nodeTextMetrics.find(
      (nodeMetric) => nodeMetric.nodeId === "stable-upipe",
    );

    expect(stableUpipe?.tightestPaddingPx).toBeGreaterThanOrEqual(8);
    expect(artifact.metrics.minInternalPadding).toBeGreaterThanOrEqual(8);
  });

  it("exposes edge anchor offsets so script scoring can cite line centering discipline", () => {
    const artifact = buildGeometryReviewArtifact(page14R1Sketch);
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

  it("exposes per-edge route weirdness so script scoring can cite hooks and detours directly", () => {
    const artifact = buildGeometryReviewArtifact(page15R1Sketch);
    const stableToPhone = artifact.edgeRouteMetrics.find(
      (metric) => metric.edgeId === "stableupipe-to-phone",
    );

    expect(stableToPhone).toMatchObject({
      edgeId: "stableupipe-to-phone",
      bendCount: expect.any(Number),
      detourRatio: expect.any(Number),
      shortSegmentCount: expect.any(Number),
    });
    expect(artifact.facts).toEqual(
      expect.arrayContaining([
        {
          label: "Worst route weirdness",
          value: expect.any(String),
        },
      ]),
    );
  });

  it("prefers real browser text probe data over sketch-estimated text fit", async () => {
    const {findFormalPageReviewSketchByStepId} = await import(
      "../../../review/formalPageReviewRegistry"
    );
    const page21 = findFormalPageReviewSketchByStepId("page_21");

    expect(page21).toBeDefined();

    const browserTextProbe: BrowserGeometryTextProbe = {
      sketchId: "formal-page21",
      nodes: [
        {
          nodeId: "left-card",
          label: "什么时候会失效？",
          fontSizePx: 17.5,
          lineCount: 5,
          topPaddingPx: 14.2,
          rightPaddingPx: -56.1,
          bottomPaddingPx: 163.1,
          leftPaddingPx: 22,
          tightestPaddingPx: -56.1,
          textBounds: {
            x: 126,
            y: 160.2,
            width: 602.1,
            height: 224.7,
          },
          nodeBounds: {
            x: 104,
            y: 146,
            width: 568,
            height: 402,
          },
        },
      ],
    };

    const artifact = buildGeometryReviewArtifact(page21!, {
      browserTextProbe,
    });
    const leadCard = artifact.nodeTextMetrics.find(
      (nodeMetric) => nodeMetric.nodeId === "left-card",
    );

    expect(leadCard).toMatchObject({
      nodeId: "left-card",
      lineCount: 5,
      overflowPx: 56.1,
      tightestPaddingPx: -56.1,
    });
    expect(artifact.metrics.textOverflowCount).toBe(1);
    expect(artifact.metrics.maxTextOverflowPx).toBe(56.1);
    expect(artifact.scores.blockerOpen).toBe(true);
    expect(artifact.verdict).toBe("Fit overflowing labels before critic pass");
  });

  it("uses real browser entity bounds when computing tree collisions", () => {
    const sketch: GeometrySketchDefinition = {
      id: "tree-browser-probe",
      label: "Tree Browser Probe",
      stepId: "page_31",
      contract: {
        pageGoal: "Browser truth drives overlap",
        receiverPlane: "Loop card",
        primaryLine: "Browser -> Metrics",
        keepStable: "None",
        newChange: "Entity bounds",
        doNot: "None",
      },
      entities: [
        {
          id: "loop-card",
          kind: "container",
          label: "Loop Card",
          x: 120,
          y: 120,
          width: 420,
          height: 180,
        },
        {
          id: "browser-caption",
          kind: "text",
          label: "Browser Caption",
          parentId: "loop-card",
          x: 150,
          y: 180,
          width: 80,
          height: 24,
        },
        {
          id: "metrics-node",
          kind: "card",
          label: "Metrics",
          parentId: "loop-card",
          x: 280,
          y: 176,
          width: 88,
          height: 32,
        },
      ],
      nodes: [],
      edges: [],
    };
    const browserTextProbe: BrowserGeometryTextProbe = {
      sketchId: "tree-browser-probe",
      nodes: [],
      entities: [
        {
          entityId: "loop-card",
          kind: "container",
          label: "Loop Card",
          bounds: {
            x: 120,
            y: 120,
            width: 420,
            height: 180,
          },
        },
        {
          entityId: "browser-caption",
          kind: "text",
          label: "Browser Caption",
          bounds: {
            x: 150,
            y: 180,
            width: 170,
            height: 24,
          },
        },
        {
          entityId: "metrics-node",
          kind: "card",
          label: "Metrics",
          bounds: {
            x: 280,
            y: 176,
            width: 88,
            height: 32,
          },
        },
      ],
    };

    const artifact = buildGeometryReviewArtifact(sketch, {
      browserTextProbe,
    });

    expect(artifact.metrics.siblingOverlapCount).toBe(1);
    expect(artifact.metrics.overlapCount).toBe(1);
    expect(artifact.metrics.maxSiblingOverlapArea).toBeGreaterThan(0);
    expect(artifact.scores.blockerOpen).toBe(true);
    expect(artifact.verdict).toBe("Remove layout overlaps before critic pass");
  });

  it("surfaces parent containment overflow in the review verdict", () => {
    const sketch: GeometrySketchDefinition = {
      id: "tree-containment-probe",
      label: "Tree Containment Probe",
      stepId: "page_31",
      contract: {
        pageGoal: "Containment overflow opens blocker",
        receiverPlane: "Loop card",
        primaryLine: "Containment -> Verdict",
        keepStable: "None",
        newChange: "Containment metrics",
        doNot: "None",
      },
      entities: [
        {
          id: "loop-card",
          kind: "container",
          label: "Loop Card",
          x: 120,
          y: 120,
          width: 260,
          height: 120,
        },
        {
          id: "escaped-child",
          kind: "card",
          label: "",
          parentId: "loop-card",
          x: 320,
          y: 156,
          width: 100,
          height: 48,
        },
      ],
      nodes: [],
      edges: [],
    };

    const artifact = buildGeometryReviewArtifact(sketch);

    expect(artifact.metrics.childOutOfBoundsCount).toBe(1);
    expect(artifact.scores.blockerOpen).toBe(true);
    expect(artifact.verdict).toBe(
      "Keep children inside parent containers before critic pass",
    );
  });
});
