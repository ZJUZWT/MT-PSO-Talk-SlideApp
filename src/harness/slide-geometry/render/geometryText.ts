import type {
  GeometrySketchDefinition,
  SketchNode,
  SketchNodeTone,
} from "./geometry-sketch-types";

export const PPT_MIN_READABLE_FONT_PT = 18;
export const PX_PER_PT = 96 / 72;
export const PPT_MIN_READABLE_FONT_PX = Number(
  (PPT_MIN_READABLE_FONT_PT * PX_PER_PT).toFixed(0),
);
export const PPT_COMFORT_BODY_FONT_PX = 26;
export const PPT_COMFORT_RECEIVER_FONT_PX = 30;
export const PPT_COMFORT_RECEIVER_TITLE_FONT_PX = 32;
export const GEOMETRY_TEXT_FONT_FAMILY =
  '"Avenir Next", "Helvetica Neue", "Segoe UI", sans-serif';

export type GeometryTextOverflow = {
  nodeId: string;
  label: string;
  overflowPx: number;
  estimatedWidthPx: number;
  availableWidthPx: number;
};

export type GeometryTextLayout = {
  lines: string[];
  fontSize: number;
  lineHeight: number;
  blockHeightPx: number;
  overflowPx: number;
  estimatedWidthPx: number;
  availableWidthPx: number;
  availableHeightPx: number;
};

export type GeometryTextPadding = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  tightest: number;
  blockWidthPx: number;
  blockHeightPx: number;
};

const CONTAINER_LABEL_LEFT_PADDING_PX = 28;
const CONTAINER_LABEL_CENTER_Y_PX = 38;
let cachedMeasureContext: CanvasRenderingContext2D | null | undefined;

function hasVisibleGeometryLabel(label: string) {
  return label.trim().length > 0;
}

export function shouldAuditGeometryNodeTypography(node: SketchNode) {
  if (!hasVisibleGeometryLabel(node.label)) {
    return false;
  }

  return !(
    node.shape === "circle" &&
    /^[+*/x-]$/i.test(node.label.trim())
  );
}

function estimateCharacterWidthEm(character: string) {
  if (character === " ") {
    return 0.28;
  }

  if (character === "_" || character === "-") {
    return 0.35;
  }

  if (/[A-Z]/.test(character)) {
    return 0.58;
  }

  if (/[a-z]/.test(character)) {
    return 0.45;
  }

  if (/[0-9]/.test(character)) {
    return 0.48;
  }

  return 0.5;
}

function estimateSingleLineTextWidth(label: string, fontSize: number) {
  return Array.from(label).reduce(
    (sum, character) => sum + estimateCharacterWidthEm(character) * fontSize,
    0,
  );
}

function splitLabelTokens(label: string) {
  if (label.includes(" ")) {
    return {
      tokens: label.split(/\s+/).filter(Boolean),
      joiner: " ",
    };
  }

  if (label.includes("_")) {
    const parts = label.split("_");

    return {
      tokens: parts
        .map((part, index) =>
          index < parts.length - 1 ? `${part}_` : part,
        )
        .filter(Boolean),
      joiner: "",
    };
  }

  const camelTokens = label.match(/[A-Z]+(?![a-z])|[A-Z]?[a-z]+|[0-9]+/g);

  if (camelTokens && camelTokens.join("") === label) {
    return {
      tokens: camelTokens,
      joiner: "",
    };
  }

  return {
    tokens: [label],
    joiner: "",
  };
}

function joinLineTokens(tokens: string[], joiner: string) {
  return tokens.join(joiner).trim();
}

function partitionTokensIntoLines(
  tokens: string[],
  lineCount: number,
  joiner: string,
  startIndex = 0,
): string[][] {
  if (lineCount === 1) {
    return [[joinLineTokens(tokens.slice(startIndex), joiner)]];
  }

  const partitions: string[][] = [];
  const remainingLines = lineCount - 1;
  const maxBreakIndex = tokens.length - remainingLines;

  for (let index = startIndex + 1; index <= maxBreakIndex; index += 1) {
    const head = joinLineTokens(tokens.slice(startIndex, index), joiner);
    const tails = partitionTokensIntoLines(tokens, remainingLines, joiner, index);

    for (const tail of tails) {
      partitions.push([head, ...tail]);
    }
  }

  return partitions;
}

export function resolveGeometryContainerIds(
  sketch: GeometrySketchDefinition,
): Set<string> {
  return new Set(
    sketch.nodes
      .filter((node) =>
        sketch.nodes.some((candidate) => candidate.containerId === node.id),
      )
      .map((node) => node.id),
  );
}

export function resolveContainerLabelFontSize(tone: SketchNodeTone = "default") {
  return tone === "receiver"
    ? PPT_COMFORT_RECEIVER_TITLE_FONT_PX
    : PPT_COMFORT_BODY_FONT_PX;
}

export function resolveLeafLabelFontSize(node: SketchNode) {
  return node.tone === "receiver"
    ? PPT_COMFORT_RECEIVER_FONT_PX
    : PPT_COMFORT_BODY_FONT_PX;
}

export function resolveGeometryTextWeight(
  node: SketchNode,
  isContainer: boolean,
) {
  if (node.fontWeightOverride) {
    return node.fontWeightOverride;
  }

  if (node.renderStyle === "outline" || node.renderStyle === "textOnly") {
    return 760;
  }

  if (isContainer) {
    return node.tone === "receiver" ? 760 : 720;
  }

  return node.tone === "receiver" ? 760 : 680;
}

function getMeasureContext() {
  if (cachedMeasureContext !== undefined) {
    return cachedMeasureContext;
  }

  if (typeof document === "undefined") {
    cachedMeasureContext = null;
    return cachedMeasureContext;
  }

  const canvas = document.createElement("canvas");
  cachedMeasureContext = canvas.getContext("2d");

  return cachedMeasureContext;
}

function measureTextLine(
  line: string,
  fontSize: number,
  fontWeight: number,
) {
  const context = getMeasureContext();

  if (!context) {
    return null;
  }

  context.font = `${fontWeight} ${fontSize}px ${GEOMETRY_TEXT_FONT_FAMILY}`;
  const metrics = context.measureText(line);
  const width = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
  const measuredWidth = width > 0 ? width : metrics.width;
  const ascent =
    metrics.actualBoundingBoxAscent || metrics.fontBoundingBoxAscent || fontSize * 0.78;
  const descent =
    metrics.actualBoundingBoxDescent || metrics.fontBoundingBoxDescent || fontSize * 0.22;

  return {
    width: Number(measuredWidth.toFixed(1)),
    ascent: Number(ascent.toFixed(1)),
    descent: Number(descent.toFixed(1)),
  };
}

function resolveAvailableLabelWidth(node: SketchNode, isContainer: boolean) {
  return Math.max(0, node.width - (isContainer ? 44 : 20));
}

function resolveAvailableLabelHeight(node: SketchNode, isContainer: boolean) {
  if (isContainer) {
    return 60;
  }

  return Math.max(0, node.height - 8);
}

function buildTextLayout(
  node: SketchNode,
  lines: string[],
  baseFontSize: number,
  availableWidthPx: number,
  availableHeightPx: number,
  minFontSize: number,
  lineHeightFactor: number,
  isContainer: boolean,
  forcedFontSize?: number,
): GeometryTextLayout {
  const fontWeight = resolveGeometryTextWeight(node, isContainer);
  const baseMeasurements = lines.map((line) =>
    measureTextLine(line, baseFontSize, fontWeight),
  );
  const baseWidths = lines.map((line, index) =>
    baseMeasurements[index]?.width ?? estimateSingleLineTextWidth(line, baseFontSize),
  );
  const widestBaseWidth = Math.max(...baseWidths, 0);
  const widthScale =
    widestBaseWidth > 0 ? availableWidthPx / widestBaseWidth : 1;
  const fallbackBaseLineBoxHeight = baseFontSize;
  const measuredBaseLineBoxHeight = Math.max(
    ...baseMeasurements.map((measurement) =>
      measurement ? measurement.ascent + measurement.descent : 0,
    ),
    0,
  );
  const baseLineBoxHeight =
    measuredBaseLineBoxHeight > 0
      ? measuredBaseLineBoxHeight
      : fallbackBaseLineBoxHeight;
  const baseBlockHeight =
    lines.length > 0
      ? baseLineBoxHeight + (lines.length - 1) * baseFontSize * lineHeightFactor
      : 0;
  const heightScale =
    baseBlockHeight > 0 ? availableHeightPx / baseBlockHeight : 1;
  const desiredFontSize =
    baseFontSize * Math.min(widthScale, heightScale, 1);
  const fontSize =
    forcedFontSize ??
    Math.max(
      minFontSize,
      Number(desiredFontSize.toFixed(2)),
    );
  const lineHeight = Number((fontSize * lineHeightFactor).toFixed(2));
  const finalMeasurements = lines.map((line) =>
    measureTextLine(line, fontSize, fontWeight),
  );
  const estimatedWidthPx = Number(
    Math.max(
      ...lines.map((line, index) =>
        finalMeasurements[index]?.width ?? estimateSingleLineTextWidth(line, fontSize),
      ),
      0,
    ).toFixed(1),
  );
  const measuredFinalLineBoxHeight = Math.max(
    ...finalMeasurements.map((measurement) =>
      measurement ? measurement.ascent + measurement.descent : 0,
    ),
    0,
  );
  const finalLineBoxHeight =
    measuredFinalLineBoxHeight > 0 ? measuredFinalLineBoxHeight : fontSize;
  const blockHeightPx = Number(
    (
      lines.length > 0
        ? finalLineBoxHeight + (lines.length - 1) * lineHeight
        : 0
    ).toFixed(1),
  );
  const overflowPx = Math.max(
    estimatedWidthPx - availableWidthPx,
    blockHeightPx - availableHeightPx,
    0,
  );

  return {
    lines,
    fontSize,
    lineHeight,
    blockHeightPx,
    overflowPx: Number(overflowPx.toFixed(1)),
    estimatedWidthPx,
    availableWidthPx: Number(availableWidthPx.toFixed(1)),
    availableHeightPx: Number(availableHeightPx.toFixed(1)),
  };
}

export function resolveGeometryTextLayout(
  node: SketchNode,
  isContainer: boolean,
): GeometryTextLayout {
  if (!hasVisibleGeometryLabel(node.label)) {
    return {
      lines: [],
      fontSize: 0,
      lineHeight: 0,
      blockHeightPx: 0,
      overflowPx: 0,
      estimatedWidthPx: 0,
      availableWidthPx: 0,
      availableHeightPx: 0,
    };
  }

  const baseFontSize = isContainer
    ? resolveContainerLabelFontSize(node.tone)
    : resolveLeafLabelFontSize(node);
  const availableWidthPx = resolveAvailableLabelWidth(node, isContainer);
  const availableHeightPx = resolveAvailableLabelHeight(node, isContainer);
  const minFontSize = PPT_MIN_READABLE_FONT_PX;
  const lineHeightFactor = isContainer ? 1.06 : 1.12;
  const candidateLines = node.labelLines
    ? [node.labelLines]
    : (() => {
        const {tokens, joiner} = splitLabelTokens(node.label);
        const lines: string[][] = [[node.label]];

        if (tokens.length > 1) {
          const maxLines = Math.min(3, tokens.length);

          for (let lineCount = 2; lineCount <= maxLines; lineCount += 1) {
            lines.push(...partitionTokensIntoLines(tokens, lineCount, joiner));
          }
        }

        return lines;
      })();
  const candidates = candidateLines.map((lines) =>
    buildTextLayout(
      node,
      lines,
      baseFontSize,
      availableWidthPx,
      availableHeightPx,
      minFontSize,
      lineHeightFactor,
      isContainer,
      node.fontSizeOverride,
    ),
  );

  return candidates.sort((left, right) => {
    if (left.overflowPx === 0 && right.overflowPx > 0) {
      return -1;
    }

    if (right.overflowPx === 0 && left.overflowPx > 0) {
      return 1;
    }

    if (left.overflowPx !== right.overflowPx) {
      return left.overflowPx - right.overflowPx;
    }

    if (left.fontSize !== right.fontSize) {
      return right.fontSize - left.fontSize;
    }

    return left.lines.length - right.lines.length;
  })[0]!;
}

export function resolveGeometryTextPadding(
  node: SketchNode,
  isContainer: boolean,
): GeometryTextPadding {
  const layout = resolveGeometryTextLayout(node, isContainer);

  if (layout.fontSize <= 0 || layout.lines.length === 0) {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      tightest: 0,
      blockWidthPx: 0,
      blockHeightPx: 0,
    };
  }

  const blockWidthPx = layout.estimatedWidthPx;
  const blockHeightPx = layout.blockHeightPx;
  const rawPadding = isContainer
    ? {
        left: CONTAINER_LABEL_LEFT_PADDING_PX,
        right: node.width - CONTAINER_LABEL_LEFT_PADDING_PX - blockWidthPx,
        top: CONTAINER_LABEL_CENTER_Y_PX - blockHeightPx / 2,
        bottom: node.height - (CONTAINER_LABEL_CENTER_Y_PX + blockHeightPx / 2),
      }
    : {
        left: (node.width - blockWidthPx) / 2,
        right: (node.width - blockWidthPx) / 2,
        top: (node.height - blockHeightPx) / 2,
        bottom: (node.height - blockHeightPx) / 2,
      };

  const top = Number(Math.max(0, rawPadding.top).toFixed(1));
  const right = Number(Math.max(0, rawPadding.right).toFixed(1));
  const bottom = Number(Math.max(0, rawPadding.bottom).toFixed(1));
  const left = Number(Math.max(0, rawPadding.left).toFixed(1));

  return {
    top,
    right,
    bottom,
    left,
    tightest: Number(Math.min(top, right, bottom, left).toFixed(1)),
    blockWidthPx,
    blockHeightPx,
  };
}

export function collectGeometryTextOverflows(
  sketch: GeometrySketchDefinition,
): GeometryTextOverflow[] {
  const containerIds = resolveGeometryContainerIds(sketch);

  return sketch.nodes
    .map((node) => {
      if (!shouldAuditGeometryNodeTypography(node)) {
        return null;
      }

      const isContainer = containerIds.has(node.id);
      const layout = resolveGeometryTextLayout(node, isContainer);
      const overflowPx = layout.overflowPx;

      if (overflowPx <= 0) {
        return null;
      }

      return {
        nodeId: node.id,
        label: node.label,
        overflowPx: Number(overflowPx.toFixed(1)),
        estimatedWidthPx: layout.estimatedWidthPx,
        availableWidthPx: layout.availableWidthPx,
      };
    })
    .filter((overflow): overflow is GeometryTextOverflow => overflow !== null);
}
