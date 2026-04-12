import {REMOTION_PLAYER_CONFIG} from "../../../remotion/embed";
import type {
  GeometrySketchDefinition,
  SketchEdge,
  SketchNode,
  SketchPoint,
} from "../render/geometry-sketch-types";
import {
  collectGeometryTextOverflows,
  resolveGeometryContainerIds,
  resolveGeometryTextLayout,
  resolveGeometryTextPadding,
  shouldAuditGeometryNodeTypography,
} from "../render/geometryText";

export type GeometryMetrics = {
  overlapCount: number;
  crossingCount: number;
  nodePierceCount: number;
  badEndpointCount: number;
  primaryLineBendCount: number;
  avoidableBendCount: number;
  edgeOverlapCount: number;
  hookTurnCount: number;
  shortSegmentCount: number;
  detourEdgeCount: number;
  maxDetourRatio: number;
  offCenterAnchorCount: number;
  cornerAnchorCount: number;
  textOverflowCount: number;
  maxTextOverflowPx: number;
  minRenderedFontPx: number;
  minNodeGap: number;
  minMargin: number;
  topMargin: number;
  rightMargin: number;
  bottomMargin: number;
  leftMargin: number;
  minSideClearance: number;
  crampedNodeCount: number;
  minInternalPadding: number;
  minInternalTopPadding: number;
  minInternalRightPadding: number;
  minInternalBottomPadding: number;
  minInternalLeftPadding: number;
  crampedInternalNodeCount: number;
  leftRightMassDelta: number;
};

export type NodeDirectionalClearance = {
  nodeId: string;
  label: string;
  top: number;
  right: number;
  bottom: number;
  left: number;
  tightest: number;
};

export type NodeInternalPadding = {
  nodeId: string;
  label: string;
  top: number;
  right: number;
  bottom: number;
  left: number;
  tightest: number;
};

export type GeometryEdgeAnchorMetric = {
  edgeId: string;
  fromNodeId?: string;
  fromLabel?: string;
  fromSide: string;
  fromOffsetPx: number;
  fromOffsetAbsPx: number;
  fromCenterRatio: number;
  fromIsCorner: boolean;
  toNodeId?: string;
  toLabel?: string;
  toSide: string;
  toOffsetPx: number;
  toOffsetAbsPx: number;
  toCenterRatio: number;
  toIsCorner: boolean;
};

export type GeometryEdgeRouteMetric = {
  edgeId: string;
  bendCount: number;
  avoidableBend: boolean;
  crossingCount: number;
  overlapCount: number;
  nodePierceCount: number;
  badEndpointCount: number;
  shortSegmentCount: number;
  minSegmentLength: number;
  hookTurnCount: number;
  detourRatio: number;
  nonOrthogonalSegmentCount: number;
  routeLength: number;
  idealLength: number;
};

type Rect = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
};

type Segment = {
  from: SketchPoint;
  to: SketchPoint;
  orientation: "horizontal" | "vertical" | "other";
};

const EPSILON = 0.0001;

function toRect(node: SketchNode): Rect {
  return {
    left: node.x,
    right: node.x + node.width,
    top: node.y,
    bottom: node.y + node.height,
    width: node.width,
    height: node.height,
  };
}

function isPointJunction(node: SketchNode) {
  const normalizedLabel = node.label.trim();

  if (
    node.shape === "circle" &&
    node.width <= 40 &&
    node.height <= 40 &&
    (normalizedLabel.length === 0 || normalizedLabel === "+" || normalizedLabel === "×")
  ) {
    return true;
  }

  if (
    normalizedLabel.length === 0 &&
    node.shape === "circle" &&
    node.width <= 20 &&
    node.height <= 20
  ) {
    return true;
  }

  return (
    normalizedLabel.length === 0 &&
    node.width <= 12 &&
    node.height <= 12
  );
}

function isOverlap(a: Rect, b: Rect) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function isAncestor(
  ancestorId: string,
  node: SketchNode,
  nodeMap: Map<string, SketchNode>,
) {
  let currentId = node.containerId;

  while (currentId) {
    if (currentId === ancestorId) {
      return true;
    }

    currentId = nodeMap.get(currentId)?.containerId;
  }

  return false;
}

function isContainerPair(
  a: SketchNode,
  b: SketchNode,
  nodeMap: Map<string, SketchNode>,
) {
  return isAncestor(a.id, b, nodeMap) || isAncestor(b.id, a, nodeMap);
}

function rectGap(a: Rect, b: Rect) {
  if (isOverlap(a, b)) {
    return 0;
  }

  const dx = Math.max(a.left - b.right, b.left - a.right, 0);
  const dy = Math.max(a.top - b.bottom, b.top - a.bottom, 0);

  return Math.hypot(dx, dy);
}

function edgePoints(edge: SketchEdge) {
  return [edge.from, ...(edge.waypoints ?? []), edge.to];
}

function rangesOverlap(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
) {
  return aStart < bEnd - EPSILON && aEnd > bStart + EPSILON;
}

function toSegments(edge: SketchEdge): Segment[] {
  const points = edgePoints(edge);
  const segments: Segment[] = [];

  for (let index = 0; index < points.length - 1; index += 1) {
    const from = points[index]!;
    const to = points[index + 1]!;

    let orientation: Segment["orientation"] = "other";
    if (from.x === to.x && from.y !== to.y) {
      orientation = "vertical";
    } else if (from.y === to.y && from.x !== to.x) {
      orientation = "horizontal";
    }

    segments.push({from, to, orientation});
  }

  return segments;
}

function segmentLength(segment: Segment) {
  return Math.hypot(segment.to.x - segment.from.x, segment.to.y - segment.from.y);
}

function segmentOverlapLength(a: Segment, b: Segment) {
  if (a.orientation !== b.orientation || a.orientation === "other") {
    return 0;
  }

  if (a.orientation === "horizontal") {
    if (Math.abs(a.from.y - b.from.y) > EPSILON) {
      return 0;
    }

    const overlapStart = Math.max(
      Math.min(a.from.x, a.to.x),
      Math.min(b.from.x, b.to.x),
    );
    const overlapEnd = Math.min(
      Math.max(a.from.x, a.to.x),
      Math.max(b.from.x, b.to.x),
    );

    return Math.max(0, overlapEnd - overlapStart);
  }

  if (Math.abs(a.from.x - b.from.x) > EPSILON) {
    return 0;
  }

  const overlapStart = Math.max(
    Math.min(a.from.y, a.to.y),
    Math.min(b.from.y, b.to.y),
  );
  const overlapEnd = Math.min(
    Math.max(a.from.y, a.to.y),
    Math.max(b.from.y, b.to.y),
  );

  return Math.max(0, overlapEnd - overlapStart);
}

function segmentOverlaps(a: Segment, b: Segment) {
  return segmentOverlapLength(a, b) > EPSILON;
}

function segmentCrosses(a: Segment, b: Segment) {
  const sharedEndpoints = [
    [a.from, b.from],
    [a.from, b.to],
    [a.to, b.from],
    [a.to, b.to],
  ].filter(([leftPoint, rightPoint]) =>
    pointEquals(leftPoint, rightPoint),
  );

  if (sharedEndpoints.length > 0) {
    return false;
  }

  const o1 = orientationValue(a.from, a.to, b.from);
  const o2 = orientationValue(a.from, a.to, b.to);
  const o3 = orientationValue(b.from, b.to, a.from);
  const o4 = orientationValue(b.from, b.to, a.to);

  if (
    hasOppositeSigns(o1, o2) &&
    hasOppositeSigns(o3, o4)
  ) {
    return true;
  }

  if (Math.abs(o1) <= EPSILON && isPointOnSegment(b.from, a)) {
    return true;
  }

  if (Math.abs(o2) <= EPSILON && isPointOnSegment(b.to, a)) {
    return true;
  }

  if (Math.abs(o3) <= EPSILON && isPointOnSegment(a.from, b)) {
    return true;
  }

  if (Math.abs(o4) <= EPSILON && isPointOnSegment(a.to, b)) {
    return true;
  }

  return false;
}

function bendCount(edge: SketchEdge) {
  const segments = toSegments(edge).filter((segment) => segment.orientation !== "other");
  let bends = 0;

  for (let index = 0; index < segments.length - 1; index += 1) {
    if (segments[index]!.orientation !== segments[index + 1]!.orientation) {
      bends += 1;
    }
  }

  return bends;
}

function isAvoidableBend(edge: SketchEdge) {
  return Boolean(
    edge.waypoints?.length &&
      (edge.from.x === edge.to.x || edge.from.y === edge.to.y),
  );
}

function routeLength(edge: SketchEdge) {
  return toSegments(edge).reduce((sum, segment) => sum + segmentLength(segment), 0);
}

function idealRouteLength(edge: SketchEdge) {
  const dx = Math.abs(edge.to.x - edge.from.x);
  const dy = Math.abs(edge.to.y - edge.from.y);
  const orthShortest = dx + dy;
  const straightShortest = Math.hypot(dx, dy);
  const hasOnlyOrthogonalSegments = toSegments(edge).every(
    (segment) => segment.orientation !== "other",
  );

  return hasOnlyOrthogonalSegments ? orthShortest : straightShortest;
}

function hookTurnCount(edge: SketchEdge) {
  const segments = toSegments(edge).filter((segment) => segment.orientation !== "other");
  let hooks = 0;

  for (let index = 0; index < segments.length - 2; index += 1) {
    const first = segments[index]!;
    const second = segments[index + 1]!;
    const third = segments[index + 2]!;
    const isHook =
      first.orientation === third.orientation &&
      first.orientation !== second.orientation;

    if (!isHook) {
      continue;
    }

    if (segmentLength(second) < 48) {
      hooks += 1;
    }
  }

  return hooks;
}

function pointEquals(a: SketchPoint, b: SketchPoint) {
  return Math.abs(a.x - b.x) <= EPSILON && Math.abs(a.y - b.y) <= EPSILON;
}

function orientationValue(a: SketchPoint, b: SketchPoint, c: SketchPoint) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

function hasOppositeSigns(a: number, b: number) {
  return (a > EPSILON && b < -EPSILON) || (a < -EPSILON && b > EPSILON);
}

function isPointOnSegment(point: SketchPoint, segment: Segment) {
  const minX = Math.min(segment.from.x, segment.to.x) - EPSILON;
  const maxX = Math.max(segment.from.x, segment.to.x) + EPSILON;
  const minY = Math.min(segment.from.y, segment.to.y) - EPSILON;
  const maxY = Math.max(segment.from.y, segment.to.y) + EPSILON;

  return (
    Math.abs(orientationValue(segment.from, segment.to, point)) <= EPSILON &&
    point.x >= minX &&
    point.x <= maxX &&
    point.y >= minY &&
    point.y <= maxY
  );
}

function isPointStrictlyInsideRect(point: SketchPoint, rect: Rect) {
  return (
    point.x > rect.left + EPSILON &&
    point.x < rect.right - EPSILON &&
    point.y > rect.top + EPSILON &&
    point.y < rect.bottom - EPSILON
  );
}

function isPointOnRect(point: SketchPoint, rect: Rect) {
  const withinX = point.x >= rect.left - EPSILON && point.x <= rect.right + EPSILON;
  const withinY = point.y >= rect.top - EPSILON && point.y <= rect.bottom + EPSILON;

  return withinX && withinY;
}

function clipSegmentToRect(segment: Segment, rect: Rect) {
  const dx = segment.to.x - segment.from.x;
  const dy = segment.to.y - segment.from.y;
  let t0 = 0;
  let t1 = 1;

  const clip = (p: number, q: number) => {
    if (Math.abs(p) <= EPSILON) {
      return q >= 0;
    }

    const ratio = q / p;
    if (p < 0) {
      if (ratio > t1) {
        return false;
      }
      if (ratio > t0) {
        t0 = ratio;
      }
    } else {
      if (ratio < t0) {
        return false;
      }
      if (ratio < t1) {
        t1 = ratio;
      }
    }

    return true;
  };

  if (
    !clip(-dx, segment.from.x - rect.left) ||
    !clip(dx, rect.right - segment.from.x) ||
    !clip(-dy, segment.from.y - rect.top) ||
    !clip(dy, rect.bottom - segment.from.y)
  ) {
    return null;
  }

  return {t0, t1};
}

function pointAt(segment: Segment, t: number): SketchPoint {
  return {
    x: segment.from.x + (segment.to.x - segment.from.x) * t,
    y: segment.from.y + (segment.to.y - segment.from.y) * t,
  };
}

function segmentPiercesRect(segment: Segment, rect: Rect) {
  const clipped = clipSegmentToRect(segment, rect);
  if (!clipped) {
    return false;
  }

  const {t0, t1} = clipped;
  if (t1 - t0 <= EPSILON) {
    return false;
  }

  const midpoint = pointAt(segment, (t0 + t1) / 2);
  return isPointStrictlyInsideRect(midpoint, rect);
}

function segmentHasBadEndpointAnchor(segment: Segment, rect: Rect) {
  if (!isPointOnRect(segment.to, rect) && !isPointOnRect(segment.from, rect)) {
    return false;
  }

  return segmentPiercesRect(segment, rect);
}

const ANCHOR_EPSILON = 0.001;

function pointTouchesNode(
  point: {x: number; y: number},
  node: GeometrySketchDefinition["nodes"][number],
) {
  return (
    point.x >= node.x - ANCHOR_EPSILON &&
    point.x <= node.x + node.width + ANCHOR_EPSILON &&
    point.y >= node.y - ANCHOR_EPSILON &&
    point.y <= node.y + node.height + ANCHOR_EPSILON
  );
}

function classifyAnchor(
  node: GeometrySketchDefinition["nodes"][number],
  point: {x: number; y: number},
) {
  const left = node.x;
  const right = node.x + node.width;
  const top = node.y;
  const bottom = node.y + node.height;
  const centerX = node.x + node.width / 2;
  const centerY = node.y + node.height / 2;
  const hitsLeft = Math.abs(point.x - left) <= ANCHOR_EPSILON;
  const hitsRight = Math.abs(point.x - right) <= ANCHOR_EPSILON;
  const hitsTop = Math.abs(point.y - top) <= ANCHOR_EPSILON;
  const hitsBottom = Math.abs(point.y - bottom) <= ANCHOR_EPSILON;
  const dx = Number((point.x - centerX).toFixed(1));
  const dy = Number((point.y - centerY).toFixed(1));

  if (
    Math.abs(dx) <= ANCHOR_EPSILON &&
    Math.abs(dy) <= ANCHOR_EPSILON &&
    node.width <= 24 &&
    node.height <= 24
  ) {
    return {
      side: "junction-center",
      offsetPx: 0,
      offsetAbsPx: 0,
      centerRatio: 0,
      isCorner: false,
    };
  }

  if ((hitsLeft || hitsRight) && (hitsTop || hitsBottom)) {
    const offsetPx = Math.abs(dy) <= Math.abs(dx) ? dy : dx;

    return {
      side: `${hitsTop ? "top" : "bottom"}-${hitsRight ? "right" : "left"}-corner`,
      offsetPx,
      offsetAbsPx: Math.abs(offsetPx),
      centerRatio: 1,
      isCorner: true,
    };
  }

  if (hitsLeft || hitsRight) {
    const halfSpan = Math.max(node.height / 2, 1);

    return {
      side: hitsRight ? "right" : "left",
      offsetPx: dy,
      offsetAbsPx: Math.abs(dy),
      centerRatio: Number((Math.abs(dy) / halfSpan).toFixed(3)),
      isCorner: false,
    };
  }

  if (hitsTop || hitsBottom) {
    const halfSpan = Math.max(node.width / 2, 1);

    return {
      side: hitsTop ? "top" : "bottom",
      offsetPx: dx,
      offsetAbsPx: Math.abs(dx),
      centerRatio: Number((Math.abs(dx) / halfSpan).toFixed(3)),
      isCorner: false,
    };
  }

  return {
    side: "interior",
    offsetPx: Math.abs(dx) >= Math.abs(dy) ? dx : dy,
    offsetAbsPx: Math.max(Math.abs(dx), Math.abs(dy)),
    centerRatio: 1,
    isCorner: false,
  };
}

export function collectEdgeAnchorMetrics(
  sketch: GeometrySketchDefinition,
): GeometryEdgeAnchorMetric[] {
  const nodesByArea = [...sketch.nodes].sort(
    (leftNode, rightNode) => leftNode.width * leftNode.height - rightNode.width * rightNode.height,
  );

  return sketch.edges.map((edge) => {
    const fromNode = nodesByArea.find((node) => pointTouchesNode(edge.from, node));
    const toNode = nodesByArea.find((node) => pointTouchesNode(edge.to, node));
    const fromAnchor = fromNode
      ? classifyAnchor(fromNode, edge.from)
      : {
          side: "unattached",
          offsetPx: 0,
          offsetAbsPx: 0,
          centerRatio: 0,
          isCorner: false,
        };
    const toAnchor = toNode
      ? classifyAnchor(toNode, edge.to)
      : {
          side: "unattached",
          offsetPx: 0,
          offsetAbsPx: 0,
          centerRatio: 0,
          isCorner: false,
        };

    return {
      edgeId: edge.id,
      fromNodeId: fromNode?.id,
      fromLabel: fromNode?.label,
      fromSide: fromAnchor.side,
      fromOffsetPx: fromAnchor.offsetPx,
      fromOffsetAbsPx: fromAnchor.offsetAbsPx,
      fromCenterRatio: fromAnchor.centerRatio,
      fromIsCorner: fromAnchor.isCorner,
      toNodeId: toNode?.id,
      toLabel: toNode?.label,
      toSide: toAnchor.side,
      toOffsetPx: toAnchor.offsetPx,
      toOffsetAbsPx: toAnchor.offsetAbsPx,
      toCenterRatio: toAnchor.centerRatio,
      toIsCorner: toAnchor.isCorner,
    };
  });
}

export function collectEdgeRouteMetrics(
  sketch: GeometrySketchDefinition,
): GeometryEdgeRouteMetric[] {
  const containerIds = resolveGeometryContainerIds(sketch);
  const pierceRects = sketch.nodes
    .filter((node) => !containerIds.has(node.id) && !isPointJunction(node))
    .map(toRect);
  const edgeSegments = sketch.edges.map((edge) => ({
    edge,
    segments: toSegments(edge),
  }));
  const metricByEdgeId = new Map<string, GeometryEdgeRouteMetric>();

  for (const {edge, segments} of edgeSegments) {
    const lengths = segments.map(segmentLength).filter((length) => length > EPSILON);
    const actualRouteLength = routeLength(edge);
    const shortestRouteLength = idealRouteLength(edge);

    metricByEdgeId.set(edge.id, {
      edgeId: edge.id,
      bendCount: bendCount(edge),
      avoidableBend: isAvoidableBend(edge),
      crossingCount: 0,
      overlapCount: 0,
      nodePierceCount: 0,
      badEndpointCount: 0,
      shortSegmentCount: lengths.filter((length) => length < 36).length,
      minSegmentLength:
        lengths.length > 0 ? Number(Math.min(...lengths).toFixed(1)) : 0,
      hookTurnCount: hookTurnCount(edge),
      detourRatio:
        shortestRouteLength > EPSILON
          ? Number(
              Math.max(0, (actualRouteLength - shortestRouteLength) / shortestRouteLength).toFixed(3),
            )
          : 0,
      nonOrthogonalSegmentCount: segments.filter(
        (segment) => segment.orientation === "other",
      ).length,
      routeLength: Number(actualRouteLength.toFixed(1)),
      idealLength: Number(shortestRouteLength.toFixed(1)),
    });
  }

  for (let i = 0; i < edgeSegments.length; i += 1) {
    for (let j = i + 1; j < edgeSegments.length; j += 1) {
      for (const leftSegment of edgeSegments[i]!.segments) {
        for (const rightSegment of edgeSegments[j]!.segments) {
          if (segmentCrosses(leftSegment, rightSegment)) {
            metricByEdgeId.get(edgeSegments[i]!.edge.id)!.crossingCount += 1;
            metricByEdgeId.get(edgeSegments[j]!.edge.id)!.crossingCount += 1;
          }

          if (segmentOverlaps(leftSegment, rightSegment)) {
            metricByEdgeId.get(edgeSegments[i]!.edge.id)!.overlapCount += 1;
            metricByEdgeId.get(edgeSegments[j]!.edge.id)!.overlapCount += 1;
          }
        }
      }
    }
  }

  for (const {edge, segments} of edgeSegments) {
    const routeMetric = metricByEdgeId.get(edge.id)!;

    for (const rect of pierceRects) {
      for (const segment of segments) {
        if (segmentPiercesRect(segment, rect)) {
          routeMetric.nodePierceCount += 1;
        }
      }

      const firstSegment = segments[0];
      const lastSegment = segments[segments.length - 1];

      if (firstSegment && segmentHasBadEndpointAnchor(firstSegment, rect)) {
        routeMetric.badEndpointCount += 1;
      }

      if (
        lastSegment &&
        lastSegment !== firstSegment &&
        segmentHasBadEndpointAnchor(lastSegment, rect)
      ) {
        routeMetric.badEndpointCount += 1;
      }
    }
  }

  return sketch.edges.map((edge) => metricByEdgeId.get(edge.id)!);
}

function minMargin(nodes: SketchNode[]) {
  const topLevelNodes = nodes.filter((node) => !node.containerId);

  return Math.min(
    ...(topLevelNodes.length ? topLevelNodes : nodes).map((node) =>
      Math.min(
        node.x,
        node.y,
        REMOTION_PLAYER_CONFIG.compositionWidth - (node.x + node.width),
        REMOTION_PLAYER_CONFIG.compositionHeight - (node.y + node.height),
      ),
    ),
  );
}

function directionalMargins(sketch: GeometrySketchDefinition) {
  const xs: number[] = [];
  const ys: number[] = [];

  for (const node of sketch.nodes) {
    xs.push(node.x, node.x + node.width);
    ys.push(node.y, node.y + node.height);
  }

  for (const edge of sketch.edges) {
    for (const point of edgePoints(edge)) {
      xs.push(point.x);
      ys.push(point.y);
    }
  }

  if (xs.length === 0 || ys.length === 0) {
    return {
      topMargin: 0,
      rightMargin: 0,
      bottomMargin: 0,
      leftMargin: 0,
    };
  }

  const left = Math.min(...xs);
  const right = Math.max(...xs);
  const top = Math.min(...ys);
  const bottom = Math.max(...ys);

  return {
    topMargin: top,
    rightMargin: REMOTION_PLAYER_CONFIG.compositionWidth - right,
    bottomMargin: REMOTION_PLAYER_CONFIG.compositionHeight - bottom,
    leftMargin: left,
  };
}

export function collectNodeDirectionalClearances(
  sketch: GeometrySketchDefinition,
): NodeDirectionalClearance[] {
  const containerIds = resolveGeometryContainerIds(sketch);
  const nodes = sketch.nodes.filter((node) => !containerIds.has(node.id));

  return nodes.map((node) => {
    const rect = toRect(node);
    let top = rect.top;
    let right = REMOTION_PLAYER_CONFIG.compositionWidth - rect.right;
    let bottom = REMOTION_PLAYER_CONFIG.compositionHeight - rect.bottom;
    let left = rect.left;

    for (const other of nodes) {
      if (other.id === node.id) {
        continue;
      }

      const otherRect = toRect(other);

      if (
        otherRect.bottom <= rect.top &&
        rangesOverlap(rect.left, rect.right, otherRect.left, otherRect.right)
      ) {
        top = Math.min(top, rect.top - otherRect.bottom);
      }

      if (
        otherRect.left >= rect.right &&
        rangesOverlap(rect.top, rect.bottom, otherRect.top, otherRect.bottom)
      ) {
        right = Math.min(right, otherRect.left - rect.right);
      }

      if (
        otherRect.top >= rect.bottom &&
        rangesOverlap(rect.left, rect.right, otherRect.left, otherRect.right)
      ) {
        bottom = Math.min(bottom, otherRect.top - rect.bottom);
      }

      if (
        otherRect.right <= rect.left &&
        rangesOverlap(rect.top, rect.bottom, otherRect.top, otherRect.bottom)
      ) {
        left = Math.min(left, rect.left - otherRect.right);
      }
    }

    return {
      nodeId: node.id,
      label: node.label,
      top: Number(top.toFixed(1)),
      right: Number(right.toFixed(1)),
      bottom: Number(bottom.toFixed(1)),
      left: Number(left.toFixed(1)),
      tightest: Number(Math.min(top, right, bottom, left).toFixed(1)),
    };
  });
}

export function collectNodeInternalPaddings(
  sketch: GeometrySketchDefinition,
): NodeInternalPadding[] {
  const containerIds = resolveGeometryContainerIds(sketch);

  return sketch.nodes
    .filter(shouldAuditGeometryNodeTypography)
    .map((node) => {
      const padding = resolveGeometryTextPadding(node, containerIds.has(node.id));

      return {
        nodeId: node.id,
        label: node.label,
        top: padding.top,
        right: padding.right,
        bottom: padding.bottom,
        left: padding.left,
        tightest: padding.tightest,
      };
    })
    .sort((left, right) => left.tightest - right.tightest);
}

function leftRightMassDelta(nodes: SketchNode[]) {
  const weightedNodes = nodes.filter((node) => !node.containerId);
  const midpoint = REMOTION_PLAYER_CONFIG.compositionWidth / 2;
  let leftMass = 0;
  let rightMass = 0;

  for (const node of weightedNodes.length ? weightedNodes : nodes) {
    const area = node.width * node.height;
    const centerX = node.x + node.width / 2;

    if (centerX < midpoint) {
      leftMass += area;
    } else {
      rightMass += area;
    }
  }

  const totalMass = leftMass + rightMass;
  if (totalMass === 0) {
    return 0;
  }

  return Math.abs(leftMass - rightMass) / totalMass;
}

export function collectGeometryMetrics(
  sketch: GeometrySketchDefinition,
): GeometryMetrics {
  const textOverflows = collectGeometryTextOverflows(sketch);
  const containerIds = resolveGeometryContainerIds(sketch);
  const nodeInternalPaddings = collectNodeInternalPaddings(sketch);
  const minRenderedFontPx = sketch.nodes.reduce((min, node) => {
    if (!shouldAuditGeometryNodeTypography(node)) {
      return min;
    }

    const layout = resolveGeometryTextLayout(node, containerIds.has(node.id));
    if (layout.fontSize <= 0) {
      return min;
    }

    return Math.min(min, layout.fontSize);
  }, Number.POSITIVE_INFINITY);
  const rects = sketch.nodes.map(toRect);
  const margins = directionalMargins(sketch);
  const nodeDirectionalClearances = collectNodeDirectionalClearances(sketch);
  const pierceRects = sketch.nodes
    .filter((node) => !containerIds.has(node.id) && !isPointJunction(node))
    .map(toRect);
  const edgeRouteMetrics = collectEdgeRouteMetrics(sketch);
  const edgeAnchorMetrics = collectEdgeAnchorMetrics(sketch);
  const nodeMap = new Map(sketch.nodes.map((node) => [node.id, node]));
  let overlapCount = 0;
  let minNodeGap = Number.POSITIVE_INFINITY;

  for (let i = 0; i < rects.length; i += 1) {
    for (let j = i + 1; j < rects.length; j += 1) {
      if (isContainerPair(sketch.nodes[i]!, sketch.nodes[j]!, nodeMap)) {
        continue;
      }

      const gap = rectGap(rects[i]!, rects[j]!);
      if (gap === 0) {
        overlapCount += 1;
      }
      minNodeGap = Math.min(minNodeGap, gap);
    }
  }
  const primaryEdges = sketch.edges.filter((edge) => edge.tone === "primary");
  const primaryEdgeIds = new Set(primaryEdges.map((edge) => edge.id));
  const primaryRouteMetrics = edgeRouteMetrics.filter((metric) =>
    primaryEdgeIds.has(metric.edgeId),
  );
  const primaryAnchorMetrics = edgeAnchorMetrics.filter((metric) =>
    primaryEdgeIds.has(metric.edgeId),
  );
  const centeredAnchorIssues = primaryAnchorMetrics.flatMap((metric) => [
    metric.fromNodeId &&
    metric.fromSide !== "junction-center" &&
    metric.fromSide !== "unattached" &&
    metric.fromCenterRatio > 0.35
      ? 1
      : 0,
    metric.toNodeId &&
    metric.toSide !== "junction-center" &&
    metric.toSide !== "unattached" &&
    metric.toCenterRatio > 0.35
      ? 1
      : 0,
  ]);
  const cornerAnchorIssues = primaryAnchorMetrics.flatMap((metric) => [
    metric.fromIsCorner ? 1 : 0,
    metric.toIsCorner ? 1 : 0,
  ]);

  return {
    overlapCount,
    crossingCount: edgeRouteMetrics.reduce(
      (sum, metric) => sum + metric.crossingCount,
      0,
    ) / 2,
    nodePierceCount: edgeRouteMetrics.reduce(
      (sum, metric) => sum + metric.nodePierceCount,
      0,
    ),
    badEndpointCount: edgeRouteMetrics.reduce(
      (sum, metric) => sum + metric.badEndpointCount,
      0,
    ),
    primaryLineBendCount: primaryEdges.reduce((sum, edge) => sum + bendCount(edge), 0),
    avoidableBendCount: primaryEdges.filter(isAvoidableBend).length,
    edgeOverlapCount:
      edgeRouteMetrics.reduce((sum, metric) => sum + metric.overlapCount, 0) / 2,
    hookTurnCount: primaryRouteMetrics.reduce(
      (sum, metric) => sum + metric.hookTurnCount,
      0,
    ),
    shortSegmentCount: primaryRouteMetrics.reduce(
      (sum, metric) => sum + metric.shortSegmentCount,
      0,
    ),
    detourEdgeCount: primaryRouteMetrics.filter(
      (metric) => metric.detourRatio > 0.12,
    ).length,
    maxDetourRatio:
      primaryRouteMetrics.length > 0
        ? Math.max(...primaryRouteMetrics.map((metric) => metric.detourRatio))
        : 0,
    offCenterAnchorCount: centeredAnchorIssues.reduce((sum, issue) => sum + issue, 0),
    cornerAnchorCount: cornerAnchorIssues.reduce((sum, issue) => sum + issue, 0),
    textOverflowCount: textOverflows.length,
    maxTextOverflowPx: textOverflows.reduce(
      (max, overflow) => Math.max(max, overflow.overflowPx),
      0,
    ),
    minRenderedFontPx: Number.isFinite(minRenderedFontPx) ? minRenderedFontPx : 0,
    minNodeGap: Number.isFinite(minNodeGap) ? minNodeGap : 0,
    minMargin: minMargin(sketch.nodes),
    topMargin: Number(margins.topMargin.toFixed(1)),
    rightMargin: Number(margins.rightMargin.toFixed(1)),
    bottomMargin: Number(margins.bottomMargin.toFixed(1)),
    leftMargin: Number(margins.leftMargin.toFixed(1)),
    minSideClearance:
      nodeDirectionalClearances.length > 0
        ? Math.min(...nodeDirectionalClearances.map((clearance) => clearance.tightest))
        : 0,
    crampedNodeCount: nodeDirectionalClearances.filter(
      (clearance) => clearance.tightest < 48,
    ).length,
    minInternalPadding:
      nodeInternalPaddings.length > 0
        ? Math.min(...nodeInternalPaddings.map((padding) => padding.tightest))
        : 0,
    minInternalTopPadding:
      nodeInternalPaddings.length > 0
        ? Math.min(...nodeInternalPaddings.map((padding) => padding.top))
        : 0,
    minInternalRightPadding:
      nodeInternalPaddings.length > 0
        ? Math.min(...nodeInternalPaddings.map((padding) => padding.right))
        : 0,
    minInternalBottomPadding:
      nodeInternalPaddings.length > 0
        ? Math.min(...nodeInternalPaddings.map((padding) => padding.bottom))
        : 0,
    minInternalLeftPadding:
      nodeInternalPaddings.length > 0
        ? Math.min(...nodeInternalPaddings.map((padding) => padding.left))
        : 0,
    crampedInternalNodeCount: nodeInternalPaddings.filter(
      (padding) => padding.tightest < 10,
    ).length,
    leftRightMassDelta: leftRightMassDelta(sketch.nodes),
  };
}
