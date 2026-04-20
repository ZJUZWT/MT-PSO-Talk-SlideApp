import type {
  GeometryEntity,
  GeometrySketchDefinition,
  SketchNode,
} from "../render/geometry-sketch-types";
import {
  resolveGeometryContainerIds,
  shouldAuditGeometryNodeTypography,
} from "../render/geometryText";

export type BrowserGeometryTextProbeNode = {
  nodeId: string;
  label: string;
  fontSizePx: number;
  lineCount: number;
  topPaddingPx: number;
  rightPaddingPx: number;
  bottomPaddingPx: number;
  leftPaddingPx: number;
  tightestPaddingPx: number;
  textBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  nodeBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export type BrowserGeometryEntityProbeEntity = {
  entityId: string;
  kind: GeometryEntity["kind"];
  label: string;
  bounds: Bounds;
  textBounds?: Bounds;
};

export type BrowserGeometryTextProbe = {
  sketchId?: string;
  stepId?: string;
  sourceUrl?: string;
  probeNodeId?: string;
  nodes: BrowserGeometryTextProbeNode[];
  entities?: BrowserGeometryEntityProbeEntity[];
};

type CollectBrowserGeometryTextProbeArgs = {
  root: ParentNode;
  sketch: GeometrySketchDefinition;
  probeNodeId?: string;
};

type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function roundMetric(value: number) {
  return Number(value.toFixed(1));
}

function parseNumericAttribute(
  element: Element,
  attributeName: string,
  fallback = 0,
) {
  const rawValue = element.getAttribute(attributeName);
  const parsedValue = Number(rawValue);

  return Number.isFinite(parsedValue) ? parsedValue : fallback;
}

function resolveNodeBounds(nodeElement: Element): Bounds | null {
  const explicitBox = nodeElement.querySelector('[data-geometry-node-box="1"]');

  if (explicitBox && typeof (explicitBox as SVGGraphicsElement).getBBox === "function") {
    const bbox = (explicitBox as SVGGraphicsElement).getBBox();
    return {
      x: roundMetric(bbox.x),
      y: roundMetric(bbox.y),
      width: roundMetric(bbox.width),
      height: roundMetric(bbox.height),
    };
  }

  const rect = nodeElement.querySelector("rect");

  if (rect) {
    return {
      x: parseNumericAttribute(rect, "x"),
      y: parseNumericAttribute(rect, "y"),
      width: parseNumericAttribute(rect, "width"),
      height: parseNumericAttribute(rect, "height"),
    };
  }

  const circle = nodeElement.querySelector("circle");

  if (circle) {
    const cx = parseNumericAttribute(circle, "cx");
    const cy = parseNumericAttribute(circle, "cy");
    const radius = parseNumericAttribute(circle, "r");

    return {
      x: cx - radius,
      y: cy - radius,
      width: radius * 2,
      height: radius * 2,
    };
  }

  return null;
}

function resolveElementBounds(element: Element): Bounds | null {
  if (typeof (element as SVGGraphicsElement).getBBox === "function") {
    const bbox = (element as SVGGraphicsElement).getBBox();
    if (bbox.width > 0 || bbox.height > 0) {
      return {
        x: roundMetric(bbox.x),
        y: roundMetric(bbox.y),
        width: roundMetric(bbox.width),
        height: roundMetric(bbox.height),
      };
    }
  }

  return resolveNodeBounds(element);
}

function unionTextBounds(textElements: SVGGraphicsElement[]) {
  const measuredBounds = textElements
    .map((element) => {
      const bbox = element.getBBox();

      return {
        x: bbox.x,
        y: bbox.y,
        width: bbox.width,
        height: bbox.height,
      };
    })
    .filter((bbox) => bbox.width > 0 || bbox.height > 0);

  if (measuredBounds.length === 0) {
    return null;
  }

  const left = Math.min(...measuredBounds.map((bbox) => bbox.x));
  const top = Math.min(...measuredBounds.map((bbox) => bbox.y));
  const right = Math.max(
    ...measuredBounds.map((bbox) => bbox.x + bbox.width),
  );
  const bottom = Math.max(
    ...measuredBounds.map((bbox) => bbox.y + bbox.height),
  );

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
}

function resolveRenderedFontSize(textElements: SVGGraphicsElement[]) {
  if (textElements.length === 0) {
    return 0;
  }
  const sizes = textElements
    .map((textElement) => {
      const attributeValue = Number(textElement.getAttribute("font-size"));
      if (Number.isFinite(attributeValue) && attributeValue > 0) {
        return attributeValue;
      }

      if (typeof window === "undefined") {
        return 0;
      }

      const computedValue = Number.parseFloat(window.getComputedStyle(textElement).fontSize);
      return Number.isFinite(computedValue) ? computedValue : 0;
    })
    .filter((value) => value > 0);

  if (sizes.length === 0) {
    return 0;
  }

  return roundMetric(Math.min(...sizes));
}

function shouldMeasureNode(
  node: SketchNode,
  containerIds: Set<string>,
  probeNodeId?: string,
) {
  if (probeNodeId) {
    return node.id === probeNodeId;
  }

  if (!shouldAuditGeometryNodeTypography(node)) {
    return false;
  }

  return !containerIds.has(node.id) || node.label.trim().length > 0;
}

function isMeasurableTextElement(
  element: Element,
): element is SVGGraphicsElement {
  return typeof (element as SVGGraphicsElement).getBBox === "function";
}

function toGeometryEntity(node: SketchNode): GeometryEntity {
  return {
    id: node.id,
    kind: node.renderStyle === "textOnly" ? "text" : "card",
    label: node.label,
    parentId: node.containerId,
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height,
    tone: node.tone,
    shape: node.shape,
    renderStyle: node.renderStyle,
    textRotationDeg: node.textRotationDeg,
    labelLines: node.labelLines,
    textRuns: node.textRuns,
    fontSizeOverride: node.fontSizeOverride,
    fontWeightOverride: node.fontWeightOverride,
    textStrokeWidth: node.textStrokeWidth,
    textColorOverride: node.textColorOverride,
  };
}

function resolveProbeEntities(sketch: GeometrySketchDefinition) {
  if (sketch.entities && sketch.entities.length > 0) {
    return sketch.entities;
  }

  return sketch.nodes.map(toGeometryEntity);
}

export function collectBrowserGeometryTextProbe({
  root,
  sketch,
  probeNodeId,
}: CollectBrowserGeometryTextProbeArgs): BrowserGeometryTextProbe {
  const containerIds = resolveGeometryContainerIds(sketch);
  const nodes = sketch.nodes
    .filter((node) => shouldMeasureNode(node, containerIds, probeNodeId))
    .flatMap((node) => {
      const nodeElement = root.querySelector(
        `[data-node-id="${node.id}"], [data-geometry-node-id="${node.id}"]`,
      );

      if (!nodeElement) {
        return [];
      }

      const nodeBounds = resolveNodeBounds(nodeElement);
      if (!nodeBounds) {
        return [];
      }

      const textElements = Array.from(
        nodeElement.querySelectorAll('[data-geometry-node-text="1"], text'),
      ).filter(isMeasurableTextElement);

      if (textElements.length === 0) {
        return [];
      }

      const textBounds = unionTextBounds(textElements);
      if (!textBounds) {
        return [];
      }

      const leftPaddingPx = roundMetric(textBounds.x - nodeBounds.x);
      const rightPaddingPx = roundMetric(
        nodeBounds.x + nodeBounds.width - (textBounds.x + textBounds.width),
      );
      const topPaddingPx = roundMetric(textBounds.y - nodeBounds.y);
      const bottomPaddingPx = roundMetric(
        nodeBounds.y + nodeBounds.height - (textBounds.y + textBounds.height),
      );

      return [
        {
          nodeId: node.id,
          label: node.label,
          fontSizePx: resolveRenderedFontSize(textElements),
          lineCount: textElements.length,
          topPaddingPx,
          rightPaddingPx,
          bottomPaddingPx,
          leftPaddingPx,
          tightestPaddingPx: roundMetric(
            Math.min(topPaddingPx, rightPaddingPx, bottomPaddingPx, leftPaddingPx),
          ),
          textBounds: {
            x: roundMetric(textBounds.x),
            y: roundMetric(textBounds.y),
            width: roundMetric(textBounds.width),
            height: roundMetric(textBounds.height),
          },
          nodeBounds: {
            x: roundMetric(nodeBounds.x),
            y: roundMetric(nodeBounds.y),
            width: roundMetric(nodeBounds.width),
            height: roundMetric(nodeBounds.height),
          },
        },
      ];
    });
  const entities = resolveProbeEntities(sketch).flatMap((entity) => {
    const entityElement = root.querySelector(
      [
        `[data-geometry-entity-id="${entity.id}"]`,
        `[data-geometry-node-id="${entity.id}"]`,
        `[data-node-id="${entity.id}"]`,
      ].join(", "),
    );

    if (!entityElement) {
      return [];
    }

    const bounds = resolveElementBounds(entityElement);
    if (!bounds) {
      return [];
    }

    const textElements = Array.from(
      entityElement.querySelectorAll('[data-geometry-node-text="1"], text'),
    ).filter(isMeasurableTextElement);
    const entityIsTextElement =
      entityElement.tagName.toLowerCase() === "text" && isMeasurableTextElement(entityElement);

    if (entityIsTextElement) {
      textElements.unshift(entityElement as SVGGraphicsElement);
    }

    const textBounds = unionTextBounds(textElements);

    return [
      {
        entityId: entity.id,
        kind: entity.kind,
        label: entity.label ?? "",
        bounds,
        ...(textBounds
          ? {
              textBounds: {
                x: roundMetric(textBounds.x),
                y: roundMetric(textBounds.y),
                width: roundMetric(textBounds.width),
                height: roundMetric(textBounds.height),
              },
            }
          : {}),
      },
    ];
  });

  return {
    sketchId: sketch.id,
    probeNodeId,
    nodes,
    entities,
  };
}
