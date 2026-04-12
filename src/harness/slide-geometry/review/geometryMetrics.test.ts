import {describe, expect, it} from "vitest";
import type {GeometrySketchDefinition} from "../render/geometry-sketch-types";
import {
  collectEdgeAnchorMetrics,
  collectEdgeRouteMetrics,
  collectGeometryMetrics,
  collectNodeInternalPaddings,
  collectNodeDirectionalClearances,
} from "./geometryMetrics";
import {scoreGeometryMetrics} from "./geometryScorePolicy";

function makeSketch(
  overrides: Partial<GeometrySketchDefinition> = {},
): GeometrySketchDefinition {
  return {
    id: "test-sketch",
    label: "Test Sketch",
    stepId: "page_09",
    contract: {
      pageGoal: "Test page goal",
      receiverPlane: "Receiver",
      primaryLine: "A -> Receiver",
      keepStable: "None",
      newChange: "None",
      doNot: "None",
    },
    nodes: [
      {id: "a", label: "A", x: 100, y: 100, width: 120, height: 80},
      {id: "b", label: "B", x: 320, y: 100, width: 120, height: 80},
      {
        id: "receiver",
        label: "Receiver",
        x: 760,
        y: 180,
        width: 260,
        height: 150,
        tone: "receiver",
      },
    ],
    edges: [
      {
        id: "primary",
        from: {x: 220, y: 60},
        to: {x: 760, y: 60},
        tone: "primary",
      },
    ],
    ...overrides,
  };
}

describe("geometryMetrics", () => {
  it("collects zero overlaps and zero crossings for a clean sketch", () => {
    const metrics = collectGeometryMetrics(makeSketch());

    expect(metrics.overlapCount).toBe(0);
    expect(metrics.crossingCount).toBe(0);
    expect(metrics.nodePierceCount).toBe(0);
    expect(metrics.badEndpointCount).toBe(0);
    expect(metrics.primaryLineBendCount).toBe(0);
    expect(metrics.avoidableBendCount).toBe(0);
    expect(metrics.edgeOverlapCount).toBe(0);
    expect(metrics.hookTurnCount).toBe(0);
    expect(metrics.shortSegmentCount).toBe(0);
    expect(metrics.detourEdgeCount).toBe(0);
    expect(metrics.maxDetourRatio).toBe(0);
    expect(metrics.offCenterAnchorCount).toBe(0);
    expect(metrics.cornerAnchorCount).toBe(0);
    expect(metrics.minNodeGap).toBeGreaterThan(0);
    expect(metrics.minMargin).toBeGreaterThan(0);
    expect(metrics.topMargin).toBe(60);
    expect(metrics.rightMargin).toBe(260);
    expect(metrics.bottomMargin).toBe(390);
    expect(metrics.leftMargin).toBe(100);
    expect(metrics.minSideClearance).toBe(100);
    expect(metrics.crampedNodeCount).toBe(0);
    expect((metrics as Record<string, unknown>).minRenderedFontPx).toBeGreaterThan(0);
  });

  it("detects overlapping boxes", () => {
    const metrics = collectGeometryMetrics(
      makeSketch({
        nodes: [
          {id: "a", label: "A", x: 100, y: 100, width: 160, height: 120},
          {id: "b", label: "B", x: 200, y: 140, width: 160, height: 120},
        ],
      }),
    );

    expect(metrics.overlapCount).toBe(1);
    expect(metrics.minNodeGap).toBe(0);
  });

  it("ignores intentional container-child overlap", () => {
    const metrics = collectGeometryMetrics(
      makeSketch({
        nodes: [
          {
            id: "container",
            label: "Container",
            x: 120,
            y: 120,
            width: 260,
            height: 180,
            tone: "receiver",
          },
          {
            id: "child",
            label: "Child",
            containerId: "container",
            x: 170,
            y: 170,
            width: 120,
            height: 60,
          },
          {id: "other", label: "Other", x: 520, y: 120, width: 120, height: 80},
        ],
      }),
    );

    expect(metrics.overlapCount).toBe(0);
  });

  it("ignores intentional container-descendant overlap", () => {
    const metrics = collectGeometryMetrics(
      makeSketch({
        nodes: [
          {
            id: "container",
            label: "Container",
            x: 120,
            y: 120,
            width: 320,
            height: 220,
            tone: "receiver",
          },
          {
            id: "child",
            label: "Child",
            containerId: "container",
            x: 180,
            y: 180,
            width: 180,
            height: 110,
          },
          {
            id: "grandchild",
            label: "Grandchild",
            containerId: "child",
            x: 220,
            y: 220,
            width: 100,
            height: 40,
          },
          {id: "other", label: "Other", x: 560, y: 140, width: 120, height: 80},
        ],
      }),
    );

    expect(metrics.overlapCount).toBe(0);
  });

  it("detects orthogonal edge crossings", () => {
    const metrics = collectGeometryMetrics(
      makeSketch({
        edges: [
          {
            id: "horizontal",
            from: {x: 260, y: 220},
            to: {x: 920, y: 220},
            tone: "primary",
          },
          {
            id: "vertical",
            from: {x: 640, y: 120},
            to: {x: 640, y: 460},
            tone: "support",
          },
        ],
      }),
    );

    expect(metrics.crossingCount).toBe(1);
  });

  it("detects diagonal edge crossings too", () => {
    const metrics = collectGeometryMetrics(
      makeSketch({
        edges: [
          {
            id: "diag-a",
            from: {x: 260, y: 180},
            to: {x: 760, y: 480},
            tone: "primary",
          },
          {
            id: "diag-b",
            from: {x: 760, y: 180},
            to: {x: 260, y: 480},
            tone: "support",
          },
        ],
      }),
    );

    expect(metrics.crossingCount).toBe(1);
  });

  it("detects when a line pierces through a node body", () => {
    const metrics = collectGeometryMetrics(
      makeSketch({
        nodes: [
          {id: "left", label: "Left", x: 120, y: 220, width: 140, height: 70},
          {id: "target", label: "Target", x: 520, y: 220, width: 180, height: 100},
        ],
        edges: [
          {
            id: "bad-approach",
            from: {x: 260, y: 120},
            to: {x: 700, y: 270},
            tone: "primary",
          },
        ],
      }),
    );

    expect(metrics.nodePierceCount).toBeGreaterThan(0);
    expect(metrics.badEndpointCount).toBeGreaterThan(0);
  });

  it("allows a clean side-aligned line to meet a node boundary", () => {
    const metrics = collectGeometryMetrics(
      makeSketch({
        nodes: [
          {id: "left", label: "Left", x: 120, y: 220, width: 140, height: 70},
          {id: "target", label: "Target", x: 520, y: 220, width: 180, height: 100},
        ],
        edges: [
          {
            id: "clean-approach",
            from: {x: 260, y: 270},
            to: {x: 520, y: 270},
            tone: "primary",
          },
        ],
      }),
    );

    expect(metrics.nodePierceCount).toBe(0);
    expect(metrics.badEndpointCount).toBe(0);
  });

  it("ignores micro junction markers in piercing metrics", () => {
    const metrics = collectGeometryMetrics(
      makeSketch({
        nodes: [
          {id: "junction", label: "", x: 360, y: 320, width: 8, height: 8},
          {id: "target", label: "Target", x: 520, y: 220, width: 180, height: 100},
        ],
        edges: [
          {
            id: "into-junction",
            from: {x: 220, y: 364},
            to: {x: 364, y: 324},
            tone: "primary",
          },
          {
            id: "from-junction",
            from: {x: 364, y: 324},
            to: {x: 520, y: 270},
            tone: "primary",
          },
        ],
      }),
    );

    expect(metrics.nodePierceCount).toBe(0);
    expect(metrics.badEndpointCount).toBe(0);
  });

  it("ignores compact circled-plus merge junctions in piercing metrics", () => {
    const metrics = collectGeometryMetrics(
      makeSketch({
        nodes: [
          {
            id: "merge",
            label: "+",
            x: 420,
            y: 240,
            width: 36,
            height: 36,
            shape: "circle",
          },
          {id: "left", label: "Left", x: 220, y: 210, width: 140, height: 58},
          {id: "right", label: "Right", x: 520, y: 210, width: 180, height: 80},
        ],
        edges: [
          {
            id: "left-to-merge",
            from: {x: 360, y: 239},
            to: {x: 420, y: 258},
            tone: "primary",
          },
          {
            id: "merge-to-right",
            from: {x: 456, y: 258},
            to: {x: 520, y: 258},
            tone: "primary",
          },
        ],
      }),
    );

    expect(metrics.nodePierceCount).toBe(0);
    expect(metrics.badEndpointCount).toBe(0);
  });

  it("counts primary bends and avoidable bends separately", () => {
    const metrics = collectGeometryMetrics(
      makeSketch({
        edges: [
          {
            id: "bent-primary",
            from: {x: 220, y: 140},
            to: {x: 520, y: 260},
            waypoints: [{x: 520, y: 140}],
            tone: "primary",
          },
          {
            id: "avoidable-primary",
            from: {x: 760, y: 260},
            to: {x: 760, y: 520},
            waypoints: [{x: 760, y: 380}],
            tone: "primary",
          },
        ],
      }),
    );

    expect(metrics.primaryLineBendCount).toBe(1);
    expect(metrics.avoidableBendCount).toBe(1);
  });

  it("detects overlapping edge lanes, short hooks, and detours on a routed edge", () => {
    const sketch = makeSketch({
      nodes: [
        {id: "left", label: "Left", x: 120, y: 300, width: 140, height: 80},
        {id: "right", label: "Right", x: 760, y: 300, width: 180, height: 100},
      ],
      edges: [
        {
          id: "hooked-primary",
          from: {x: 260, y: 340},
          to: {x: 760, y: 350},
          waypoints: [
            {x: 420, y: 340},
            {x: 420, y: 420},
            {x: 450, y: 420},
            {x: 450, y: 360},
            {x: 760, y: 360},
          ],
          tone: "primary",
        },
        {
          id: "overlapping-support",
          from: {x: 420, y: 340},
          to: {x: 420, y: 420},
          tone: "support",
        },
      ],
    });
    const metrics = collectGeometryMetrics(sketch);
    const routeMetrics = collectEdgeRouteMetrics(sketch);
    const hookedPrimary = routeMetrics.find((metric) => metric.edgeId === "hooked-primary");

    expect(metrics.edgeOverlapCount).toBeGreaterThan(0);
    expect(metrics.hookTurnCount).toBeGreaterThan(0);
    expect(metrics.shortSegmentCount).toBeGreaterThan(0);
    expect(metrics.detourEdgeCount).toBeGreaterThan(0);
    expect(metrics.maxDetourRatio).toBeGreaterThan(0.1);
    expect(hookedPrimary).toMatchObject({
      hookTurnCount: expect.any(Number),
      detourRatio: expect.any(Number),
      shortSegmentCount: expect.any(Number),
    });
    expect(hookedPrimary?.hookTurnCount).toBeGreaterThan(0);
  });

  it("tracks off-center and corner anchor penalties separately from hard piercing", () => {
    const sketch = makeSketch({
      nodes: [
        {id: "left", label: "Left", x: 120, y: 220, width: 160, height: 100},
        {id: "right", label: "Right", x: 560, y: 220, width: 200, height: 120},
      ],
      edges: [
        {
          id: "off-center",
          from: {x: 280, y: 248},
          to: {x: 560, y: 268},
          tone: "primary",
        },
        {
          id: "corner-stabbed",
          from: {x: 280, y: 220},
          to: {x: 560, y: 220},
          tone: "primary",
        },
      ],
    });
    const metrics = collectGeometryMetrics(sketch);
    const anchorMetrics = collectEdgeAnchorMetrics(sketch);
    const offCenter = anchorMetrics.find((metric) => metric.edgeId === "off-center");
    const cornerStabbed = anchorMetrics.find((metric) => metric.edgeId === "corner-stabbed");

    expect(metrics.offCenterAnchorCount).toBeGreaterThan(0);
    expect(metrics.cornerAnchorCount).toBeGreaterThan(0);
    expect(offCenter?.fromCenterRatio).toBeGreaterThan(0.35);
    expect(cornerStabbed?.fromIsCorner).toBe(true);
    expect(cornerStabbed?.toIsCorner).toBe(true);
  });

  it("detects label overflow inside a node", () => {
    const metrics = collectGeometryMetrics(
      makeSketch({
        nodes: [
          {
            id: "too-tight",
            label: "FShaderMapResource_SharedCode",
            x: 120,
            y: 120,
            width: 120,
            height: 24,
            tone: "receiver",
          },
          {id: "other", label: "Other", x: 520, y: 120, width: 120, height: 80},
        ],
      }),
    );

    expect((metrics as Record<string, unknown>).textOverflowCount).toBe(1);
    expect((metrics as Record<string, unknown>).maxTextOverflowPx).toBeGreaterThan(0);
  });

  it("fits a long container label before counting overflow when enough height exists", () => {
    const metrics = collectGeometryMetrics(
      makeSketch({
        nodes: [
          {
            id: "shared-resource",
            label: "FShaderMapResource_SharedCode",
            x: 120,
            y: 120,
            width: 270,
            height: 118,
            tone: "receiver",
          },
          {
            id: "child-pill",
            label: "ShaderMapIndex",
            containerId: "shared-resource",
            x: 158,
            y: 174,
            width: 194,
            height: 40,
          },
          {id: "other", label: "Other", x: 520, y: 120, width: 120, height: 80},
        ],
      }),
    );

    expect((metrics as Record<string, unknown>).textOverflowCount).toBe(0);
    expect((metrics as Record<string, unknown>).maxTextOverflowPx).toBe(0);
    expect((metrics as Record<string, unknown>).minRenderedFontPx).toBeGreaterThanOrEqual(24);
  });

  it("ignores empty-label junction nodes in text metrics", () => {
    const metrics = collectGeometryMetrics(
      makeSketch({
        nodes: [
          {id: "material", label: "Material", x: 120, y: 360, width: 180, height: 84},
          {id: "split", label: "", x: 360, y: 320, width: 20, height: 20},
          {id: "bytecode", label: ".shaderbytecode", x: 520, y: 220, width: 220, height: 68},
          {
            id: "runtime",
            label: "Runtime",
            x: 860,
            y: 180,
            width: 260,
            height: 260,
            tone: "receiver",
          },
        ],
      }),
    );

    expect((metrics as Record<string, unknown>).textOverflowCount).toBe(0);
    expect((metrics as Record<string, unknown>).maxTextOverflowPx).toBe(0);
    expect((metrics as Record<string, unknown>).minRenderedFontPx).toBeGreaterThanOrEqual(24);
  });

  it("collects directional clearances for each visible node", () => {
    const clearances = collectNodeDirectionalClearances(makeSketch());
    const a = clearances.find((clearance) => clearance.nodeId === "a");
    const b = clearances.find((clearance) => clearance.nodeId === "b");

    expect(a).toMatchObject({
      top: 100,
      left: 100,
      right: 100,
      tightest: 100,
    });
    expect(b).toMatchObject({
      top: 100,
      left: 100,
      tightest: 100,
    });
  });

  it("collects per-node internal text paddings on all four sides", () => {
    const paddings = collectNodeInternalPaddings(
      makeSketch({
        nodes: [
          {id: "leaf", label: "Leaf", x: 120, y: 120, width: 180, height: 84},
          {
            id: "container",
            label: "FShaderMapResource_SharedCode",
            x: 360,
            y: 120,
            width: 280,
            height: 140,
            tone: "receiver",
          },
          {
            id: "child",
            label: "ShaderMapIndex",
            containerId: "container",
            x: 410,
            y: 186,
            width: 180,
            height: 40,
          },
        ],
      }),
    );

    const leaf = paddings.find((padding) => padding.nodeId === "leaf");
    const container = paddings.find((padding) => padding.nodeId === "container");

    expect(leaf).toMatchObject({
      nodeId: "leaf",
      top: expect.any(Number),
      right: expect.any(Number),
      bottom: expect.any(Number),
      left: expect.any(Number),
      tightest: expect.any(Number),
    });
    expect(leaf?.left).toBeCloseTo(leaf?.right ?? 0, 1);
    expect(leaf?.top).toBeCloseTo(leaf?.bottom ?? 0, 1);

    expect(container).toMatchObject({
      nodeId: "container",
      left: 28,
      top: expect.any(Number),
      right: expect.any(Number),
      bottom: expect.any(Number),
      tightest: expect.any(Number),
    });
    expect(container?.tightest).toBeGreaterThan(0);
  });
});

describe("geometryScorePolicy", () => {
  it("caps crossing-related score when crossings remain", () => {
    const metrics = collectGeometryMetrics(
      makeSketch({
        edges: [
          {
            id: "horizontal",
            from: {x: 260, y: 220},
            to: {x: 920, y: 220},
            tone: "primary",
          },
          {
            id: "vertical",
            from: {x: 640, y: 120},
            to: {x: 640, y: 460},
            tone: "support",
          },
        ],
      }),
    );

    const scores = scoreGeometryMetrics(metrics);

    expect(scores.stageLayout).toBeGreaterThanOrEqual(0);
    expect(scores.crossingRisk).toBeLessThanOrEqual(4);
    expect(scores.blockerOpen).toBe(true);
  });

  it("penalizes stage layout when top and bottom margins are badly imbalanced", () => {
    const metrics = collectGeometryMetrics(
      makeSketch({
        nodes: [
          {id: "a", label: "A", x: 120, y: 480, width: 140, height: 80},
          {id: "b", label: "B", x: 340, y: 480, width: 140, height: 80},
          {
            id: "receiver",
            label: "Receiver",
            x: 860,
            y: 480,
            width: 220,
            height: 120,
            tone: "receiver",
          },
        ],
        edges: [
          {
            id: "primary",
            from: {x: 260, y: 520},
            to: {x: 860, y: 520},
            tone: "primary",
          },
        ],
      }),
    );

    const scores = scoreGeometryMetrics(metrics);

    expect(metrics.topMargin).toBe(480);
    expect(metrics.bottomMargin).toBe(120);
    expect(scores.stageLayout).toBeLessThanOrEqual(7);
  });

  it("penalizes stage layout when edge margins are visibly asymmetric in px even with acceptable occupancy", () => {
    const scores = scoreGeometryMetrics({
      overlapCount: 0,
      crossingCount: 0,
      nodePierceCount: 0,
      badEndpointCount: 0,
      primaryLineBendCount: 2,
      avoidableBendCount: 0,
      edgeOverlapCount: 0,
      hookTurnCount: 1,
      shortSegmentCount: 1,
      detourEdgeCount: 1,
      maxDetourRatio: 0.22,
      offCenterAnchorCount: 2,
      cornerAnchorCount: 0,
      textOverflowCount: 0,
      maxTextOverflowPx: 0,
      minRenderedFontPx: 26,
      minNodeGap: 16,
      minMargin: 32,
      topMargin: 194,
      rightMargin: 32,
      bottomMargin: 152,
      leftMargin: 132,
      minSideClearance: 16,
      crampedNodeCount: 5,
      leftRightMassDelta: 0.498,
    });

    expect(scores.stageLayout).toBeLessThanOrEqual(7);
  });

  it("penalizes density when several nodes have cramped side clearances", () => {
    const metrics = collectGeometryMetrics(
      makeSketch({
        nodes: [
          {id: "a", label: "A", x: 120, y: 120, width: 140, height: 80},
          {id: "b", label: "B", x: 286, y: 120, width: 140, height: 80},
          {id: "c", label: "C", x: 452, y: 120, width: 140, height: 80},
          {
            id: "receiver",
            label: "Receiver",
            x: 618,
            y: 120,
            width: 220,
            height: 120,
            tone: "receiver",
          },
        ],
      }),
    );

    const scores = scoreGeometryMetrics(metrics);

    expect(metrics.crampedNodeCount).toBeGreaterThanOrEqual(3);
    expect(scores.layoutDensity).toBeLessThanOrEqual(7);
  });

  it("penalizes density when node interior padding gets too tight", () => {
    const scores = scoreGeometryMetrics({
      overlapCount: 0,
      crossingCount: 0,
      nodePierceCount: 0,
      badEndpointCount: 0,
      primaryLineBendCount: 0,
      avoidableBendCount: 0,
      edgeOverlapCount: 0,
      hookTurnCount: 0,
      shortSegmentCount: 0,
      detourEdgeCount: 0,
      maxDetourRatio: 0,
      offCenterAnchorCount: 0,
      cornerAnchorCount: 0,
      textOverflowCount: 0,
      maxTextOverflowPx: 0,
      minRenderedFontPx: 28,
      minNodeGap: 48,
      minMargin: 80,
      topMargin: 120,
      rightMargin: 120,
      bottomMargin: 120,
      leftMargin: 120,
      minSideClearance: 64,
      crampedNodeCount: 0,
      minInternalPadding: 5,
      minInternalTopPadding: 6,
      minInternalRightPadding: 5,
      minInternalBottomPadding: 8,
      minInternalLeftPadding: 12,
      crampedInternalNodeCount: 2,
      leftRightMassDelta: 0.08,
    });

    expect(scores.layoutDensity).toBeLessThanOrEqual(7);
  });

  it("opens a blocker when text overflow remains", () => {
    const metrics = collectGeometryMetrics(
      makeSketch({
        nodes: [
          {
            id: "too-tight",
            label: "FShaderMapResource_SharedCode",
            x: 120,
            y: 120,
            width: 120,
            height: 24,
            tone: "receiver",
          },
          {id: "other", label: "Other", x: 520, y: 120, width: 120, height: 80},
        ],
      }),
    );

    const scores = scoreGeometryMetrics(metrics);

    expect(scores.blockerOpen).toBe(true);
  });
});
