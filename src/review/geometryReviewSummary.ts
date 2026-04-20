import type {GeometryReviewArtifact} from "../harness/slide-geometry/review/geometryReviewArtifact";

export type GeometryThreeLayerReview = {
  overallLayout: number;
  moduleStructure: number;
  nodeEdge: number;
};

export type GeometryNodeIssueRow = {
  nodeId: string;
  label: string;
  directionalTightestPx: number;
  internalTightestPx: number;
  fontPx: number;
  overflowPx: number;
};

export type GeometryEdgeIssueRow = {
  edgeId: string;
  routePenalty: number;
  bendCount: number;
  avoidableBend: boolean;
  shortSegmentCount: number;
  hookTurnCount: number;
  detourRatio: number;
  overlapCount: number;
  crossingCount: number;
  nodePierceCount: number;
  maxAnchorOffsetPx: number;
};

export type GeometryReviewSummary = {
  sketchId: string;
  stepId: string;
  label: string;
  threeLayerReview: {
    "整体布局 Review": string;
    "模块空间结构 Review": string;
    "单节点与单边 Review": string;
  };
  mechanicalScore: string;
  verdict: string;
  scoreBands: GeometryReviewArtifact["scores"];
  keyMetrics: {
    overlapCount: number;
    crossingCount: number;
    nodePierceCount: number;
    edgeOverlapCount: number;
    textOverflowCount: number;
    minRenderedFontPx: number;
    minNodeGap: number;
    minMargin: number;
    topMargin: number;
    rightMargin: number;
    bottomMargin: number;
    leftMargin: number;
    minInternalPadding: number;
    avoidableBendCount: number;
    hookTurnCount: number;
    shortSegmentCount: number;
    offCenterAnchorCount: number;
  };
  topFixes: string[];
  worstNodes: GeometryNodeIssueRow[];
  worstEdges: GeometryEdgeIssueRow[];
};

function round1(value: number) {
  return Number(value.toFixed(1));
}

export function deriveThreeLayerScores(
  artifact: GeometryReviewArtifact,
): GeometryThreeLayerReview {
  const {scores} = artifact;
  const overallLayout = round1(
    (scores.stageLayout + scores.layoutDensity + scores.balance) / 3,
  );
  const moduleStructure = round1(
    (scores.layoutDensity + scores.balance + scores.primaryLineClarity) / 3,
  );
  let nodeEdge = round1(
    (scores.lineStraightness + scores.crossingRisk + scores.primaryLineClarity) / 3,
  );

  if (scores.blockerOpen) {
    nodeEdge = Math.min(nodeEdge, 4.0);
  }

  return {
    overallLayout,
    moduleStructure,
    nodeEdge,
  };
}

export function buildNodeIssueRows(
  artifact: GeometryReviewArtifact,
): GeometryNodeIssueRow[] {
  const directionalByNode = new Map(
    artifact.nodeDirectionalClearances.map((row) => [row.nodeId, row]),
  );
  const textByNode = new Map(
    artifact.nodeTextMetrics.map((row) => [row.nodeId, row]),
  );

  const rows: GeometryNodeIssueRow[] = [];
  directionalByNode.forEach((directional, nodeId) => {
    const text = textByNode.get(nodeId);

    rows.push({
      nodeId,
      label: directional.label,
      directionalTightestPx: directional.tightest,
      internalTightestPx: text ? text.tightestPaddingPx : 999,
      fontPx: text ? text.renderedFontPx : 999,
      overflowPx: text ? text.overflowPx : 0,
    });
  });

  return rows.sort((left, right) => {
    const leftPenalty =
      (left.overflowPx > 0 ? 1000 : 0) +
      Math.max(0, 24 - left.directionalTightestPx) * 4 +
      Math.max(0, 8 - left.internalTightestPx) * 8 +
      Math.max(0, 20 - left.fontPx) * 3;
    const rightPenalty =
      (right.overflowPx > 0 ? 1000 : 0) +
      Math.max(0, 24 - right.directionalTightestPx) * 4 +
      Math.max(0, 8 - right.internalTightestPx) * 8 +
      Math.max(0, 20 - right.fontPx) * 3;

    return rightPenalty - leftPenalty;
  });
}

export function buildEdgeIssueRows(
  artifact: GeometryReviewArtifact,
): GeometryEdgeIssueRow[] {
  const anchorByEdge = new Map<string, number>();
  artifact.edgeAnchorMetrics.forEach((row) => {
    const previous = anchorByEdge.get(row.edgeId) ?? 0;
    const maxOffset = Math.max(previous, row.fromOffsetAbsPx, row.toOffsetAbsPx);
    anchorByEdge.set(row.edgeId, maxOffset);
  });

  const rows: GeometryEdgeIssueRow[] = artifact.edgeRouteMetrics.map((route) => {
    const routePenalty =
      route.hookTurnCount * 4 +
      route.overlapCount * 4 +
      route.crossingCount * 4 +
      route.nodePierceCount * 4 +
      route.badEndpointCount * 3 +
      route.shortSegmentCount * 2 +
      (route.avoidableBend ? 2 : 0) +
      route.detourRatio * 10;

    return {
      edgeId: route.edgeId,
      routePenalty: Number(routePenalty.toFixed(2)),
      bendCount: route.bendCount,
      avoidableBend: route.avoidableBend,
      shortSegmentCount: route.shortSegmentCount,
      hookTurnCount: route.hookTurnCount,
      detourRatio: Number(route.detourRatio.toFixed(3)),
      overlapCount: route.overlapCount,
      crossingCount: route.crossingCount,
      nodePierceCount: route.nodePierceCount,
      maxAnchorOffsetPx: Number((anchorByEdge.get(route.edgeId) ?? 0).toFixed(1)),
    };
  });

  return rows.sort((left, right) => {
    const leftScore = left.routePenalty + left.maxAnchorOffsetPx * 0.15;
    const rightScore = right.routePenalty + right.maxAnchorOffsetPx * 0.15;
    return rightScore - leftScore;
  });
}

export function buildGeometryReviewSummary(args: {
  sketchId: string;
  stepId: string;
  label: string;
  artifact: GeometryReviewArtifact;
}): GeometryReviewSummary {
  const {artifact, label, sketchId, stepId} = args;
  const threeLayer = deriveThreeLayerScores(artifact);
  const nodeIssues = buildNodeIssueRows(artifact).slice(0, 10);
  const edgeIssues = buildEdgeIssueRows(artifact).slice(0, 10);

  return {
    sketchId,
    stepId,
    label,
    threeLayerReview: {
      "整体布局 Review": `${threeLayer.overallLayout}/10`,
      "模块空间结构 Review": `${threeLayer.moduleStructure}/10`,
      "单节点与单边 Review": `${threeLayer.nodeEdge}/10`,
    },
    mechanicalScore: `${artifact.mechanicalScore}/10`,
    verdict: artifact.verdict,
    scoreBands: artifact.scores,
    keyMetrics: {
      overlapCount: artifact.metrics.overlapCount,
      crossingCount: artifact.metrics.crossingCount,
      nodePierceCount: artifact.metrics.nodePierceCount,
      edgeOverlapCount: artifact.metrics.edgeOverlapCount,
      textOverflowCount: artifact.metrics.textOverflowCount,
      minRenderedFontPx: artifact.metrics.minRenderedFontPx,
      minNodeGap: artifact.metrics.minNodeGap,
      minMargin: artifact.metrics.minMargin,
      topMargin: artifact.metrics.topMargin,
      rightMargin: artifact.metrics.rightMargin,
      bottomMargin: artifact.metrics.bottomMargin,
      leftMargin: artifact.metrics.leftMargin,
      minInternalPadding: artifact.metrics.minInternalPadding,
      avoidableBendCount: artifact.metrics.avoidableBendCount,
      hookTurnCount: artifact.metrics.hookTurnCount,
      shortSegmentCount: artifact.metrics.shortSegmentCount,
      offCenterAnchorCount: artifact.metrics.offCenterAnchorCount,
    },
    topFixes: artifact.topFixes,
    worstNodes: nodeIssues,
    worstEdges: edgeIssues,
  };
}

export function buildGeometryReviewMarkdown(
  summary: GeometryReviewSummary,
): string {
  return [
    `# ${summary.stepId} Geometry Review`,
    "",
    `- Sketch: \`${summary.sketchId}\``,
    `- Label: ${summary.label}`,
    `- 整体布局 Review: ${summary.threeLayerReview["整体布局 Review"]}`,
    `- 模块空间结构 Review: ${summary.threeLayerReview["模块空间结构 Review"]}`,
    `- 单节点与单边 Review: ${summary.threeLayerReview["单节点与单边 Review"]}`,
    `- Mechanical Score: ${summary.mechanicalScore}`,
    `- Verdict: ${summary.verdict}`,
    "",
    "## Key Metrics",
    "",
    `- minRenderedFontPx: ${summary.keyMetrics.minRenderedFontPx}`,
    `- minInternalPadding: ${summary.keyMetrics.minInternalPadding}`,
    `- nodePierceCount: ${summary.keyMetrics.nodePierceCount}`,
    `- crossingCount: ${summary.keyMetrics.crossingCount}`,
    `- textOverflowCount: ${summary.keyMetrics.textOverflowCount}`,
    `- minMargin: ${summary.keyMetrics.minMargin}`,
    `- offCenterAnchorCount: ${summary.keyMetrics.offCenterAnchorCount}`,
    "",
    "## Top Fixes",
    "",
    ...summary.topFixes.map((fix) => `- ${fix}`),
  ].join("\n");
}
