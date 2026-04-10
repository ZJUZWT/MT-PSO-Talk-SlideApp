import {describe, expect, it} from "vitest";
import type {GeometrySketchDefinition} from "../render/geometry-sketch-types";
import {collectGeometryMetrics} from "./geometryMetrics";
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
        from: {x: 220, y: 140},
        to: {x: 760, y: 140},
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
    expect(metrics.primaryLineBendCount).toBe(0);
    expect(metrics.avoidableBendCount).toBe(0);
    expect(metrics.minNodeGap).toBeGreaterThan(0);
    expect(metrics.minMargin).toBeGreaterThan(0);
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

    expect(scores.crossingRisk).toBeLessThanOrEqual(4);
    expect(scores.blockerOpen).toBe(true);
  });
});
