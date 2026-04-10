import {REMOTION_PLAYER_CONFIG} from "../../../remotion/embed";
import type {
  GeometrySketchDefinition,
  SketchEdge,
  SketchNode,
  SketchPoint,
} from "../render/geometry-sketch-types";

export type GeometryMetrics = {
  overlapCount: number;
  crossingCount: number;
  primaryLineBendCount: number;
  avoidableBendCount: number;
  minNodeGap: number;
  minMargin: number;
  leftRightMassDelta: number;
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

function isOverlap(a: Rect, b: Rect) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function isContainerPair(a: SketchNode, b: SketchNode) {
  return a.containerId === b.id || b.containerId === a.id;
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

function segmentCrosses(a: Segment, b: Segment) {
  if (a.orientation === b.orientation) {
    return false;
  }

  const horizontal = a.orientation === "horizontal" ? a : b;
  const vertical = a.orientation === "vertical" ? a : b;

  if (horizontal.orientation !== "horizontal" || vertical.orientation !== "vertical") {
    return false;
  }

  const minX = Math.min(horizontal.from.x, horizontal.to.x);
  const maxX = Math.max(horizontal.from.x, horizontal.to.x);
  const minY = Math.min(vertical.from.y, vertical.to.y);
  const maxY = Math.max(vertical.from.y, vertical.to.y);
  const crossX = vertical.from.x;
  const crossY = horizontal.from.y;

  return crossX > minX && crossX < maxX && crossY > minY && crossY < maxY;
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
  const rects = sketch.nodes.map(toRect);
  let overlapCount = 0;
  let minNodeGap = Number.POSITIVE_INFINITY;

  for (let i = 0; i < rects.length; i += 1) {
    for (let j = i + 1; j < rects.length; j += 1) {
      if (isContainerPair(sketch.nodes[i]!, sketch.nodes[j]!)) {
        continue;
      }

      const gap = rectGap(rects[i]!, rects[j]!);
      if (gap === 0) {
        overlapCount += 1;
      }
      minNodeGap = Math.min(minNodeGap, gap);
    }
  }

  let crossingCount = 0;
  const edgeSegments = sketch.edges.map((edge) => ({
    edge,
    segments: toSegments(edge),
  }));

  for (let i = 0; i < edgeSegments.length; i += 1) {
    for (let j = i + 1; j < edgeSegments.length; j += 1) {
      for (const a of edgeSegments[i]!.segments) {
        for (const b of edgeSegments[j]!.segments) {
          if (segmentCrosses(a, b)) {
            crossingCount += 1;
          }
        }
      }
    }
  }

  const primaryEdges = sketch.edges.filter((edge) => edge.tone === "primary");

  return {
    overlapCount,
    crossingCount,
    primaryLineBendCount: primaryEdges.reduce((sum, edge) => sum + bendCount(edge), 0),
    avoidableBendCount: primaryEdges.filter(isAvoidableBend).length,
    minNodeGap: Number.isFinite(minNodeGap) ? minNodeGap : 0,
    minMargin: minMargin(sketch.nodes),
    leftRightMassDelta: leftRightMassDelta(sketch.nodes),
  };
}
