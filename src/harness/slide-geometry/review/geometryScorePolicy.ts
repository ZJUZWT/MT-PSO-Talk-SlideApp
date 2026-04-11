import type {GeometryMetrics} from "./geometryMetrics";

export type GeometryMetricScores = {
  blockerOpen: boolean;
  stageLayout: number;
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
  if (metrics.overlapCount > 0 || metrics.textOverflowCount > 0) {
    return 2;
  }

  let score = 8;
  if (metrics.minNodeGap < 24) {
    score -= 4;
  } else if (metrics.minNodeGap < 36) {
    score -= 1;
  }

  if (metrics.minMargin < 24) {
    score -= 2;
  } else if (metrics.minMargin < 32) {
    score -= 1;
  }

  if (metrics.minSideClearance < 24) {
    score -= 2;
  } else if (metrics.minSideClearance < 40) {
    score -= 1;
  }

  if (metrics.crampedNodeCount >= 3) {
    score -= 1;
  }

  if (metrics.minInternalPadding < 6) {
    score -= 2;
  } else if (metrics.minInternalPadding < 10) {
    score -= 1;
  }

  if (metrics.crampedInternalNodeCount >= 2) {
    score -= 1;
  }

  return clampScore(score);
}

function scoreStageLayout(metrics: GeometryMetrics) {
  const stageWidth = 1280;
  const stageHeight = 720;
  const occupiedWidthRatio =
    (stageWidth - metrics.leftMargin - metrics.rightMargin) / stageWidth;
  const occupiedHeightRatio =
    (stageHeight - metrics.topMargin - metrics.bottomMargin) / stageHeight;
  const horizontalAsymmetry =
    Math.abs(metrics.leftMargin - metrics.rightMargin) / stageWidth;
  const verticalAsymmetry =
    Math.abs(metrics.topMargin - metrics.bottomMargin) / stageHeight;
  const horizontalMarginDeltaPx = Math.abs(metrics.leftMargin - metrics.rightMargin);
  const verticalMarginDeltaPx = Math.abs(metrics.topMargin - metrics.bottomMargin);

  let score = 10;

  if (occupiedWidthRatio < 0.65 || occupiedWidthRatio > 0.9) {
    score -= 1;
  }

  if (occupiedHeightRatio < 0.5 || occupiedHeightRatio > 0.64) {
    score -= 2;
  } else if (occupiedHeightRatio < 0.56) {
    score -= 1;
  }

  if (horizontalAsymmetry > 0.18) {
    score -= 2;
  } else if (horizontalAsymmetry > 0.1) {
    score -= 1;
  }

  if (horizontalMarginDeltaPx > 120) {
    score -= 2;
  } else if (horizontalMarginDeltaPx > 72) {
    score -= 1;
  }

  if (verticalAsymmetry > 0.22) {
    score -= 4;
  } else if (verticalAsymmetry > 0.14) {
    score -= 2;
  } else if (verticalAsymmetry > 0.08) {
    score -= 1;
  }

  if (verticalMarginDeltaPx > 120) {
    score -= 2;
  } else if (verticalMarginDeltaPx > 40) {
    score -= 1;
  }

  if (metrics.minMargin < 40) {
    score -= 1;
  } else if (metrics.minMargin < 56) {
    score -= 0.5;
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
  return clampScore(
    10 -
      metrics.primaryLineBendCount * 2 -
      metrics.avoidableBendCount * 3 -
      metrics.badEndpointCount * 2,
  );
}

function scoreCrossingRisk(metrics: GeometryMetrics) {
  if (metrics.overlapCount > 0) {
    return 2;
  }
  if (metrics.crossingCount > 0 || metrics.nodePierceCount > 0) {
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

  if (metrics.textOverflowCount > 0) {
    score = Math.min(score, 4);
  }

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
    blockerOpen:
      metrics.overlapCount > 0 ||
      metrics.crossingCount > 0 ||
      metrics.nodePierceCount > 0 ||
      metrics.textOverflowCount > 0,
    stageLayout: scoreStageLayout(metrics),
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
