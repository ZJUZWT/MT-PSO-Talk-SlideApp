import type {GeometrySketchDefinition} from "../render/geometry-sketch-types";
import {
  resolveGeometryContainerIds,
  resolveGeometryTypographyMeasurement,
  shouldAuditGeometryNodeTypography,
} from "../render/geometryText";
import type {BrowserGeometryTextProbe} from "./browserGeometryTextProbe";
import type {
  GeometryEdgeAnchorMetric,
  GeometryEdgeRouteMetric,
  GeometryMetrics,
  NodeDirectionalClearance,
} from "./geometryMetrics";
import {
  collectEdgeAnchorMetrics,
  collectEdgeRouteMetrics,
  collectGeometryMetrics,
  collectNodeDirectionalClearances,
} from "./geometryMetrics";
import type {GeometryMetricScores} from "./geometryScorePolicy";
import {scoreGeometryMetrics} from "./geometryScorePolicy";

export type GeometryReviewFact = {
  label: string;
  value: string;
};

export type GeometryNodeTextMetric = {
  nodeId: string;
  label: string;
  renderedFontPx: number;
  renderedFontPt: number;
  lineCount: number;
  overflowPx: number;
  topPaddingPx: number;
  rightPaddingPx: number;
  bottomPaddingPx: number;
  leftPaddingPx: number;
  tightestPaddingPx: number;
};

export type GeometryReviewArtifact = {
  facts: GeometryReviewFact[];
  metrics: GeometryMetrics;
  nodeDirectionalClearances: NodeDirectionalClearance[];
  nodeTextMetrics: GeometryNodeTextMetric[];
  edgeAnchorMetrics: GeometryEdgeAnchorMetric[];
  edgeRouteMetrics: GeometryEdgeRouteMetric[];
  scores: GeometryMetricScores;
  mechanicalScore: number;
  verdict: string;
  topFixes: string[];
};

type BuildGeometryReviewArtifactOptions = {
  browserTextProbe?: BrowserGeometryTextProbe | null;
};

export const GEOMETRY_METRIC_META: Array<{
  id: keyof GeometryMetrics;
  label: string;
}> = [
  {id: "overlapCount", label: "Overlaps"},
  {id: "crossingCount", label: "Crossings"},
  {id: "nodePierceCount", label: "Node piercings"},
  {id: "badEndpointCount", label: "Bad endpoint anchors"},
  {id: "primaryLineBendCount", label: "Primary line bends"},
  {id: "avoidableBendCount", label: "Avoidable bends"},
  {id: "edgeOverlapCount", label: "Edge overlaps"},
  {id: "hookTurnCount", label: "Hook turns"},
  {id: "shortSegmentCount", label: "Short segments"},
  {id: "detourEdgeCount", label: "Detour edges"},
  {id: "maxDetourRatio", label: "Maximum detour ratio"},
  {id: "offCenterAnchorCount", label: "Off-center anchors"},
  {id: "cornerAnchorCount", label: "Corner anchors"},
  {id: "textOverflowCount", label: "Overflowing labels"},
  {id: "maxTextOverflowPx", label: "Maximum label overflow"},
  {id: "minRenderedFontPx", label: "Minimum rendered font"},
  {id: "minNodeGap", label: "Minimum node gap"},
  {id: "minMargin", label: "Minimum outer margin"},
  {id: "topMargin", label: "Top margin"},
  {id: "rightMargin", label: "Right margin"},
  {id: "bottomMargin", label: "Bottom margin"},
  {id: "leftMargin", label: "Left margin"},
  {id: "minSideClearance", label: "Minimum side clearance"},
  {id: "crampedNodeCount", label: "Cramped node count"},
  {id: "minInternalPadding", label: "Minimum internal padding"},
  {id: "minInternalTopPadding", label: "Minimum internal top padding"},
  {id: "minInternalRightPadding", label: "Minimum internal right padding"},
  {id: "minInternalBottomPadding", label: "Minimum internal bottom padding"},
  {id: "minInternalLeftPadding", label: "Minimum internal left padding"},
  {id: "crampedInternalNodeCount", label: "Cramped internal node count"},
  {id: "leftRightMassDelta", label: "Left-right mass delta"},
];

export const GEOMETRY_SCORE_META: Array<{
  id: keyof Omit<GeometryMetricScores, "blockerOpen">;
  label: string;
}> = [
  {id: "stageLayout", label: "Stage layout"},
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
  if (
    metricId === "minNodeGap" ||
    metricId === "minMargin" ||
    metricId === "topMargin" ||
    metricId === "rightMargin" ||
    metricId === "bottomMargin" ||
    metricId === "leftMargin" ||
    metricId === "maxTextOverflowPx" ||
    metricId === "minRenderedFontPx" ||
    metricId === "minInternalPadding" ||
    metricId === "minInternalTopPadding" ||
    metricId === "minInternalRightPadding" ||
    metricId === "minInternalBottomPadding" ||
    metricId === "minInternalLeftPadding"
  ) {
    return `${Math.round(value)}px`;
  }

  if (metricId === "leftRightMassDelta" || metricId === "maxDetourRatio") {
    return clampPercentage(value);
  }

  return `${value}`;
}

function resolveMechanicalScore(scores: GeometryMetricScores) {
  const total =
    scores.stageLayout +
    scores.layoutDensity +
    scores.balance +
    scores.lineStraightness +
    scores.crossingRisk +
    scores.primaryLineClarity;

  return Number((total / 6).toFixed(1));
}

function resolveVerdict(
  metrics: GeometryMetrics,
  scores: GeometryMetricScores,
) {
  if (scores.blockerOpen) {
    if (metrics.textOverflowCount > 0) {
      return "Fit overflowing labels before critic pass";
    }

    if (metrics.childOutOfBoundsCount > 0) {
      return "Keep children inside parent containers before critic pass";
    }

    if (metrics.overlapCount > 0) {
      return "Remove layout overlaps before critic pass";
    }

    if (metrics.nodePierceCount > 0) {
      return "Stop lines from piercing node bodies before critic pass";
    }

    return "Remove line crossings before critic pass";
  }

  if (scores.lineStraightness < 6 || scores.primaryLineClarity < 6) {
    return "Clean the primary route before critic pass";
  }

  if (scores.stageLayout < 7) {
    return "Reframe the stage before critic pass";
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
  edgeAnchorMetrics: GeometryEdgeAnchorMetric[],
  edgeRouteMetrics: GeometryEdgeRouteMetric[],
  nodeTextMetrics: GeometryNodeTextMetric[],
) {
  const textOverflows = nodeTextMetrics.filter((nodeMetric) => nodeMetric.overflowPx > 0);
  const fixes: string[] = [];
  const anchorIssues = edgeAnchorMetrics
    .flatMap((metric) => [
      {
        edgeId: metric.edgeId,
        endpoint: "from",
        nodeId: metric.fromNodeId,
        side: metric.fromSide,
        offsetAbsPx: metric.fromOffsetAbsPx,
        isCorner: metric.fromIsCorner,
      },
      {
        edgeId: metric.edgeId,
        endpoint: "to",
        nodeId: metric.toNodeId,
        side: metric.toSide,
        offsetAbsPx: metric.toOffsetAbsPx,
        isCorner: metric.toIsCorner,
      },
    ])
    .filter(
      (issue) =>
        issue.nodeId &&
        (issue.isCorner || issue.offsetAbsPx > 12),
    )
    .sort((left, right) => right.offsetAbsPx - left.offsetAbsPx);
  const routeIssues = edgeRouteMetrics
    .filter(
      (metric) =>
        metric.hookTurnCount > 0 ||
        metric.detourRatio > 0.12 ||
        metric.shortSegmentCount > 0 ||
        metric.overlapCount > 0,
    )
    .sort((leftMetric, rightMetric) => {
      const leftPenalty =
        leftMetric.hookTurnCount * 4 +
        leftMetric.overlapCount * 4 +
        leftMetric.shortSegmentCount * 2 +
        leftMetric.detourRatio * 10;
      const rightPenalty =
        rightMetric.hookTurnCount * 4 +
        rightMetric.overlapCount * 4 +
        rightMetric.shortSegmentCount * 2 +
        rightMetric.detourRatio * 10;

      return rightPenalty - leftPenalty;
    });

  if (metrics.textOverflowCount > 0) {
    const labels = textOverflows
      .slice(0, 2)
      .map((overflow) => overflow.label)
      .join(", ");
    fixes.push(
      `Fit ${metrics.textOverflowCount} overflowing label${metrics.textOverflowCount === 1 ? "" : "s"} before judging aesthetics; current blockers include ${labels}.`,
    );
  }

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

  if (metrics.edgeOverlapCount > 0) {
    fixes.push(
      `Separate ${metrics.edgeOverlapCount} overlapping line lane${metrics.edgeOverlapCount === 1 ? "" : "s"}; lines should not ride on the same channel unless the contract explicitly declares a shared carrier.`,
    );
  }

  if (metrics.nodePierceCount > 0) {
    fixes.push(
      `Repair ${metrics.nodePierceCount} line-to-node piercing${metrics.nodePierceCount === 1 ? "" : "s"}; some segments currently enter through a node body instead of landing cleanly on its boundary.`,
    );
  }

  if (metrics.badEndpointCount > 0) {
    fixes.push(
      `Clean ${metrics.badEndpointCount} bad endpoint anchor${metrics.badEndpointCount === 1 ? "" : "s"} so lines approach nodes from a believable side instead of stabbing through them.`,
    );
  }

  if (anchorIssues.length > 0) {
    const labels = anchorIssues
      .slice(0, 2)
      .map(
        (issue) =>
          `${issue.edgeId}:${issue.endpoint}->${issue.nodeId} ${issue.side} ${Math.round(issue.offsetAbsPx)}px`,
      )
      .join(", ");
    fixes.push(
      `Recenter edge anchors so exits and arrivals feel averaged instead of corner-stabbed; current worst anchors are ${labels}.`,
    );
  }

  if (routeIssues.length > 0) {
    const labels = routeIssues
      .slice(0, 2)
      .map(
        (metric) =>
          `${metric.edgeId} (hooks ${metric.hookTurnCount}, detour ${Math.round(
            metric.detourRatio * 100,
          )}%, short ${metric.shortSegmentCount})`,
      )
      .join(", ");
    fixes.push(
      `Remove awkward route twists and redundant detours; current worst edges are ${labels}.`,
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

  if (metrics.minInternalPadding < 10) {
    fixes.push(
      `Open the text breathing room inside nodes: the tightest internal padding is ${Math.round(metrics.minInternalPadding)}px, so some labels still sit too close to their box edge.`,
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

  if (scores.stageLayout < 7) {
    fixes.push(
      `Reframe the stage envelope: top ${Math.round(metrics.topMargin)}px, right ${Math.round(metrics.rightMargin)}px, bottom ${Math.round(metrics.bottomMargin)}px, left ${Math.round(metrics.leftMargin)}px.`,
    );
  }

  if (metrics.crampedNodeCount > 0) {
    fixes.push(
      `Open the cramped local pockets: ${metrics.crampedNodeCount} node${metrics.crampedNodeCount === 1 ? "" : "s"} currently have a tightest side clearance below 48px.`,
    );
  }

  if (fixes.length < 3) {
    fixes.push(
      `${sketch.contract.keepStable.replace(/\.$/, "")} while cleaning the route.`,
    );
  }

  if (fixes.length < 3) {
    fixes.push(sketch.contract.newChange.replace(/\.$/, ""));
  }

  if (fixes.length < 3) {
    fixes.push(sketch.contract.doNot);
  }

  return fixes.slice(0, 3);
}

function buildEstimatedNodeTextMetrics(
  sketch: GeometrySketchDefinition,
): GeometryNodeTextMetric[] {
  const containerIds = resolveGeometryContainerIds(sketch);

  return sketch.nodes
    .filter(shouldAuditGeometryNodeTypography)
    .map((node) => {
      const measurement = resolveGeometryTypographyMeasurement(
        node,
        containerIds.has(node.id),
      );
      const padding = measurement.padding;

      return {
        nodeId: node.id,
        label: node.label,
        renderedFontPx: Number(measurement.renderedFontPx.toFixed(1)),
        renderedFontPt: Number(((measurement.renderedFontPx * 72) / 96).toFixed(1)),
        lineCount: measurement.lineCount,
        overflowPx: measurement.overflowPx,
        topPaddingPx: padding.top,
        rightPaddingPx: padding.right,
        bottomPaddingPx: padding.bottom,
        leftPaddingPx: padding.left,
        tightestPaddingPx: padding.tightest,
      };
    });
}

function buildBrowserProbeNodeTextMetric(
  nodeMetric: BrowserGeometryTextProbe["nodes"][number],
): GeometryNodeTextMetric {
  const overflowPx = Number(
    Math.max(
      -nodeMetric.topPaddingPx,
      -nodeMetric.rightPaddingPx,
      -nodeMetric.bottomPaddingPx,
      -nodeMetric.leftPaddingPx,
      0,
    ).toFixed(1),
  );

  return {
    nodeId: nodeMetric.nodeId,
    label: nodeMetric.label,
    renderedFontPx: Number(nodeMetric.fontSizePx.toFixed(1)),
    renderedFontPt: Number(((nodeMetric.fontSizePx * 72) / 96).toFixed(1)),
    lineCount: nodeMetric.lineCount,
    overflowPx,
    topPaddingPx: nodeMetric.topPaddingPx,
    rightPaddingPx: nodeMetric.rightPaddingPx,
    bottomPaddingPx: nodeMetric.bottomPaddingPx,
    leftPaddingPx: nodeMetric.leftPaddingPx,
    tightestPaddingPx: nodeMetric.tightestPaddingPx,
  };
}

function resolveNodeTextMetrics(
  sketch: GeometrySketchDefinition,
  browserTextProbe?: BrowserGeometryTextProbe | null,
): GeometryNodeTextMetric[] {
  const estimatedMetrics = buildEstimatedNodeTextMetrics(sketch);
  const browserMetricsByNodeId = new Map(
    (browserTextProbe?.nodes ?? []).map((nodeMetric) => [
      nodeMetric.nodeId,
      buildBrowserProbeNodeTextMetric(nodeMetric),
    ]),
  );

  return estimatedMetrics
    .map((nodeMetric) => browserMetricsByNodeId.get(nodeMetric.nodeId) ?? nodeMetric)
    .sort((left, right) => left.renderedFontPx - right.renderedFontPx);
}

function summarizeNodeTextMetrics(
  nodeTextMetrics: GeometryNodeTextMetric[],
): Pick<
  GeometryMetrics,
  | "textOverflowCount"
  | "maxTextOverflowPx"
  | "minRenderedFontPx"
  | "minInternalPadding"
  | "minInternalTopPadding"
  | "minInternalRightPadding"
  | "minInternalBottomPadding"
  | "minInternalLeftPadding"
  | "crampedInternalNodeCount"
> {
  const overflowNodes = nodeTextMetrics.filter((nodeMetric) => nodeMetric.overflowPx > 0);
  const renderedFonts = nodeTextMetrics
    .map((nodeMetric) => nodeMetric.renderedFontPx)
    .filter((fontPx) => fontPx > 0);

  return {
    textOverflowCount: overflowNodes.length,
    maxTextOverflowPx: overflowNodes.reduce(
      (max, nodeMetric) => Math.max(max, nodeMetric.overflowPx),
      0,
    ),
    minRenderedFontPx:
      renderedFonts.length > 0 ? Math.min(...renderedFonts) : 0,
    minInternalPadding:
      nodeTextMetrics.length > 0
        ? Math.min(...nodeTextMetrics.map((nodeMetric) => nodeMetric.tightestPaddingPx))
        : 0,
    minInternalTopPadding:
      nodeTextMetrics.length > 0
        ? Math.min(...nodeTextMetrics.map((nodeMetric) => nodeMetric.topPaddingPx))
        : 0,
    minInternalRightPadding:
      nodeTextMetrics.length > 0
        ? Math.min(...nodeTextMetrics.map((nodeMetric) => nodeMetric.rightPaddingPx))
        : 0,
    minInternalBottomPadding:
      nodeTextMetrics.length > 0
        ? Math.min(...nodeTextMetrics.map((nodeMetric) => nodeMetric.bottomPaddingPx))
        : 0,
    minInternalLeftPadding:
      nodeTextMetrics.length > 0
        ? Math.min(...nodeTextMetrics.map((nodeMetric) => nodeMetric.leftPaddingPx))
        : 0,
    crampedInternalNodeCount: nodeTextMetrics.filter(
      (nodeMetric) => nodeMetric.tightestPaddingPx < 10,
    ).length,
  };
}

function resolveTextMeasurementSource(
  nodeTextMetrics: GeometryNodeTextMetric[],
  browserTextProbe?: BrowserGeometryTextProbe | null,
) {
  const matchedNodeCount = nodeTextMetrics.filter((nodeMetric) =>
    (browserTextProbe?.nodes ?? []).some(
      (probeNodeMetric) => probeNodeMetric.nodeId === nodeMetric.nodeId,
    ),
  ).length;

  if (matchedNodeCount <= 0) {
    return "Formula-only geometry estimate";
  }

  const fallbackNodeCount = Math.max(0, nodeTextMetrics.length - matchedNodeCount);
  if (fallbackNodeCount === 0) {
    return `Front browser probe (${matchedNodeCount} nodes)`;
  }

  return `Front browser probe (${matchedNodeCount} nodes) + formula fallback (${fallbackNodeCount} nodes)`;
}

export function buildGeometryReviewArtifact(
  sketch: GeometrySketchDefinition,
  options: BuildGeometryReviewArtifactOptions = {},
): GeometryReviewArtifact {
  const nodeTextMetrics = resolveNodeTextMetrics(sketch, options.browserTextProbe);
  const textOverflows = nodeTextMetrics.filter((nodeMetric) => nodeMetric.overflowPx > 0);
  const metrics = {
    ...collectGeometryMetrics(sketch, {
      browserTextProbe: options.browserTextProbe,
    }),
    ...summarizeNodeTextMetrics(nodeTextMetrics),
  };
  const nodeDirectionalClearances = collectNodeDirectionalClearances(sketch);
  const edgeAnchorMetrics = collectEdgeAnchorMetrics(sketch);
  const edgeRouteMetrics = collectEdgeRouteMetrics(sketch);
  const worstAnchors = edgeAnchorMetrics
    .flatMap((metric) => [
      {
        edgeId: metric.edgeId,
        endpoint: "from",
        nodeId: metric.fromNodeId,
        side: metric.fromSide,
        offsetAbsPx: metric.fromOffsetAbsPx,
        isCorner: metric.fromIsCorner,
      },
      {
        edgeId: metric.edgeId,
        endpoint: "to",
        nodeId: metric.toNodeId,
        side: metric.toSide,
        offsetAbsPx: metric.toOffsetAbsPx,
        isCorner: metric.toIsCorner,
      },
    ])
    .filter((anchor) => anchor.nodeId && (anchor.isCorner || anchor.offsetAbsPx > 0))
    .sort((left, right) => right.offsetAbsPx - left.offsetAbsPx)
    .slice(0, 3)
    .map(
      (anchor) =>
        `${anchor.edgeId}:${anchor.endpoint}->${anchor.nodeId} ${anchor.side} ${Math.round(anchor.offsetAbsPx)}px`,
    );
  const worstRouteIssues = edgeRouteMetrics
    .filter(
      (metric) =>
        metric.hookTurnCount > 0 ||
        metric.detourRatio > 0.12 ||
        metric.shortSegmentCount > 0 ||
        metric.overlapCount > 0,
    )
    .sort((leftMetric, rightMetric) => {
      const leftPenalty =
        leftMetric.hookTurnCount * 4 +
        leftMetric.overlapCount * 4 +
        leftMetric.shortSegmentCount * 2 +
        leftMetric.detourRatio * 10;
      const rightPenalty =
        rightMetric.hookTurnCount * 4 +
        rightMetric.overlapCount * 4 +
        rightMetric.shortSegmentCount * 2 +
        rightMetric.detourRatio * 10;

      return rightPenalty - leftPenalty;
    })
    .slice(0, 3)
    .map(
      (metric) =>
        `${metric.edgeId}: hooks ${metric.hookTurnCount}, detour ${Math.round(
          metric.detourRatio * 100,
        )}%, short ${metric.shortSegmentCount}`,
    );
  const scores = scoreGeometryMetrics(metrics);
  const crampedNodes = nodeDirectionalClearances
    .filter((clearance) => clearance.tightest < 48)
    .sort((left, right) => left.tightest - right.tightest)
    .slice(0, 3)
    .map((clearance) => `${clearance.nodeId}:${Math.round(clearance.tightest)}px`);

  return {
    facts: [
      {label: "Receiver plane", value: sketch.contract.receiverPlane},
      {label: "Primary line", value: sketch.contract.primaryLine},
      {
        label: "Text measurement source",
        value: resolveTextMeasurementSource(nodeTextMetrics, options.browserTextProbe),
      },
      {
        label: "Overflow labels",
        value:
          textOverflows.length > 0
            ? textOverflows.map((overflow) => overflow.label).join(", ")
            : "None",
      },
      {
        label: "Minimum rendered font",
        value: `${Math.round(metrics.minRenderedFontPx)}px (~${Math.round(
          (metrics.minRenderedFontPx * 72) / 96,
        )}pt)`,
      },
      {
        label: "Minimum internal padding",
        value: `${Math.round(metrics.minInternalPadding)}px (T ${Math.round(
          metrics.minInternalTopPadding,
        )} / R ${Math.round(metrics.minInternalRightPadding)} / B ${Math.round(
          metrics.minInternalBottomPadding,
        )} / L ${Math.round(metrics.minInternalLeftPadding)} px)`,
      },
      {
        label: "Directional margins",
        value: `T ${Math.round(metrics.topMargin)} / R ${Math.round(metrics.rightMargin)} / B ${Math.round(metrics.bottomMargin)} / L ${Math.round(metrics.leftMargin)} px`,
      },
      {
        label: "Cramped nodes",
        value: crampedNodes.length > 0 ? crampedNodes.join(", ") : "None",
      },
      {
        label: "Worst anchor offsets",
        value: worstAnchors.length > 0 ? worstAnchors.join(", ") : "None",
      },
      {
        label: "Worst route weirdness",
        value: worstRouteIssues.length > 0 ? worstRouteIssues.join(", ") : "None",
      },
      {label: "Node count", value: `${sketch.nodes.length}`},
      {label: "Edge count", value: `${sketch.edges.length}`},
    ],
    metrics,
    nodeDirectionalClearances,
    nodeTextMetrics,
    edgeAnchorMetrics,
    edgeRouteMetrics,
    scores,
    mechanicalScore: resolveMechanicalScore(scores),
      verdict: resolveVerdict(metrics, scores),
      topFixes: buildTopFixes(
        sketch,
        metrics,
        scores,
        edgeAnchorMetrics,
        edgeRouteMetrics,
        nodeTextMetrics,
      ),
  };
}
