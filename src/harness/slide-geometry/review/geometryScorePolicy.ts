import type {GeometryMetrics} from "./geometryMetrics";

export type GeometryMetricScores = {
  blockerOpen: boolean;
  layoutDensity: number;
  balance: number;
  lineStraightness: number;
  crossingRisk: number;
  primaryLineClarity: number;
};

function clampScore(value: number) {
  return Math.max(0, Math.min(10, Math.round(value)));
}

function scoreLayoutDensity(metrics: GeometryMetrics) {
  if (metrics.overlapCount > 0) {
    return 2;
  }

  let score = 8;
  if (metrics.minNodeGap < 24) {
    score -= 4;
  } else if (metrics.minNodeGap < 48) {
    score -= 2;
  }

  if (metrics.minMargin < 24) {
    score -= 2;
  } else if (metrics.minMargin < 40) {
    score -= 1;
  }

  return clampScore(score);
}

function scoreBalance(metrics: GeometryMetrics) {
  if (metrics.leftRightMassDelta <= 0.08) {
    return 9;
  }
  if (metrics.leftRightMassDelta <= 0.18) {
    return 8;
  }
  if (metrics.leftRightMassDelta <= 0.3) {
    return 6;
  }
  return 4;
}

function scoreLineStraightness(metrics: GeometryMetrics) {
  return clampScore(10 - metrics.primaryLineBendCount * 2 - metrics.avoidableBendCount * 3);
}

function scoreCrossingRisk(metrics: GeometryMetrics) {
  if (metrics.overlapCount > 0) {
    return 2;
  }
  if (metrics.crossingCount > 0) {
    return 4;
  }
  return 9;
}

function scorePrimaryLineClarity(
  metrics: GeometryMetrics,
  lineStraightness: number,
  crossingRisk: number,
) {
  let score = Math.min(lineStraightness, crossingRisk);

  if (metrics.primaryLineBendCount > 1) {
    score -= 1;
  }

  return clampScore(score);
}

export function scoreGeometryMetrics(
  metrics: GeometryMetrics,
): GeometryMetricScores {
  const lineStraightness = scoreLineStraightness(metrics);
  const crossingRisk = scoreCrossingRisk(metrics);

  return {
    blockerOpen: metrics.overlapCount > 0 || metrics.crossingCount > 0,
    layoutDensity: scoreLayoutDensity(metrics),
    balance: scoreBalance(metrics),
    lineStraightness,
    crossingRisk,
    primaryLineClarity: scorePrimaryLineClarity(
      metrics,
      lineStraightness,
      crossingRisk,
    ),
  };
}
