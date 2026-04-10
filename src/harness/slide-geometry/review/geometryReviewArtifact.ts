import type {GeometrySketchDefinition} from "../render/geometry-sketch-types";
import type {GeometryMetrics} from "./geometryMetrics";
import {collectGeometryMetrics} from "./geometryMetrics";
import type {GeometryMetricScores} from "./geometryScorePolicy";
import {scoreGeometryMetrics} from "./geometryScorePolicy";

export type GeometryReviewFact = {
  label: string;
  value: string;
};

export type GeometryReviewArtifact = {
  facts: GeometryReviewFact[];
  metrics: GeometryMetrics;
  scores: GeometryMetricScores;
  mechanicalScore: number;
  verdict: string;
  topFixes: string[];
};

export const GEOMETRY_METRIC_META: Array<{
  id: keyof GeometryMetrics;
  label: string;
}> = [
  {id: "overlapCount", label: "Overlaps"},
  {id: "crossingCount", label: "Crossings"},
  {id: "primaryLineBendCount", label: "Primary line bends"},
  {id: "avoidableBendCount", label: "Avoidable bends"},
  {id: "minNodeGap", label: "Minimum node gap"},
  {id: "minMargin", label: "Minimum outer margin"},
  {id: "leftRightMassDelta", label: "Left-right mass delta"},
];

export const GEOMETRY_SCORE_META: Array<{
  id: keyof Omit<GeometryMetricScores, "blockerOpen">;
  label: string;
}> = [
  {id: "layoutDensity", label: "Layout density"},
  {id: "balance", label: "Balance"},
  {id: "lineStraightness", label: "Line straightness"},
  {id: "crossingRisk", label: "Crossing risk"},
  {id: "primaryLineClarity", label: "Primary line clarity"},
];

function clampPercentage(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function formatGeometryMetricValue(
  metricId: keyof GeometryMetrics,
  value: number,
) {
  if (metricId === "minNodeGap" || metricId === "minMargin") {
    return `${Math.round(value)}px`;
  }

  if (metricId === "leftRightMassDelta") {
    return clampPercentage(value);
  }

  return `${value}`;
}

function resolveMechanicalScore(scores: GeometryMetricScores) {
  const total =
    scores.layoutDensity +
    scores.balance +
    scores.lineStraightness +
    scores.crossingRisk +
    scores.primaryLineClarity;

  return Number((total / 5).toFixed(1));
}

function resolveVerdict(
  metrics: GeometryMetrics,
  scores: GeometryMetricScores,
) {
  if (scores.blockerOpen) {
    if (metrics.overlapCount > 0) {
      return "Remove layout overlaps before critic pass";
    }

    return "Remove line crossings before critic pass";
  }

  if (scores.lineStraightness < 6 || scores.primaryLineClarity < 6) {
    return "Clean the primary route before critic pass";
  }

  if (scores.layoutDensity < 7) {
    return "Open the layout before critic pass";
  }

  if (scores.balance < 7) {
    return "Rebalance the stage before critic pass";
  }

  return "Ready for blind critic pass";
}

function buildTopFixes(
  sketch: GeometrySketchDefinition,
  metrics: GeometryMetrics,
  scores: GeometryMetricScores,
) {
  const fixes: string[] = [];

  if (metrics.overlapCount > 0) {
    fixes.push(
      `Remove ${metrics.overlapCount} overlapping box pair${metrics.overlapCount === 1 ? "" : "s"} before tuning anything else.`,
    );
  }

  if (metrics.crossingCount > 0) {
    fixes.push(
      `Eliminate ${metrics.crossingCount} line crossing${metrics.crossingCount === 1 ? "" : "s"} so the route reads in one glance.`,
    );
  }

  if (metrics.primaryLineBendCount > 0 || metrics.avoidableBendCount > 0) {
    fixes.push(
      `Straighten the primary route: it currently spends ${metrics.primaryLineBendCount} bends and ${metrics.avoidableBendCount} avoidable bend${metrics.avoidableBendCount === 1 ? "" : "s"}.`,
    );
  }

  if (metrics.minNodeGap < 48) {
    fixes.push(
      `Open up the tightest node stack: the minimum node gap is ${Math.round(metrics.minNodeGap)}px, below the 48px comfort floor.`,
    );
  }

  if (metrics.minMargin < 40) {
    fixes.push(
      `Pull the composition inward: the minimum outer margin is ${Math.round(metrics.minMargin)}px, below the 40px safety floor.`,
    );
  }

  if (scores.balance < 7) {
    fixes.push(
      `Rebalance the left and right masses: the current delta is ${clampPercentage(metrics.leftRightMassDelta)}.`,
    );
  }

  if (fixes.length < 3) {
    fixes.push(
      `${sketch.contract.keepStable.replace(/\.$/, "")} while cleaning the route.`,
    );
  }

  if (fixes.length < 3) {
    fixes.push(sketch.contract.doNot);
  }

  return fixes.slice(0, 3);
}

export function buildGeometryReviewArtifact(
  sketch: GeometrySketchDefinition,
): GeometryReviewArtifact {
  const metrics = collectGeometryMetrics(sketch);
  const scores = scoreGeometryMetrics(metrics);

  return {
    facts: [
      {label: "Receiver plane", value: sketch.contract.receiverPlane},
      {label: "Primary line", value: sketch.contract.primaryLine},
      {label: "Node count", value: `${sketch.nodes.length}`},
      {label: "Edge count", value: `${sketch.edges.length}`},
    ],
    metrics,
    scores,
    mechanicalScore: resolveMechanicalScore(scores),
    verdict: resolveVerdict(metrics, scores),
    topFixes: buildTopFixes(sketch, metrics, scores),
  };
}
