import type {
  GeometrySketchDefinition,
  SketchNodeTone,
} from "./geometry-sketch-types";
import {
  GEOMETRY_TEXT_FONT_FAMILY,
  resolveGeometryContainerIds,
  resolveGeometryTextLayout,
  resolveGeometryTextWeight,
} from "./geometryText";

type GeometrySketchSceneProps = {
  sketch: GeometrySketchDefinition;
};

const NODE_TONES: Record<
  SketchNodeTone,
  {fill: string; stroke: string; text: string}
> = {
  default: {
    fill: "rgba(255, 251, 246, 0.98)",
    stroke: "rgba(63, 77, 89, 0.74)",
    text: "#22303d",
  },
  receiver: {
    fill: "rgba(247, 239, 229, 0.98)",
    stroke: "#c77046",
    text: "#22303d",
  },
  muted: {
    fill: "rgba(250, 248, 243, 0.98)",
    stroke: "rgba(126, 139, 151, 0.5)",
    text: "rgba(34, 48, 61, 0.84)",
  },
};

function distanceBetweenPoints(
  left: {x: number; y: number},
  right: {x: number; y: number},
) {
  return Math.hypot(right.x - left.x, right.y - left.y);
}

function pointsAreCollinear(
  previous: {x: number; y: number},
  current: {x: number; y: number},
  next: {x: number; y: number},
) {
  const ax = current.x - previous.x;
  const ay = current.y - previous.y;
  const bx = next.x - current.x;
  const by = next.y - current.y;

  return Math.abs(ax * by - ay * bx) <= 0.001;
}

function movePointToward(
  from: {x: number; y: number},
  to: {x: number; y: number},
  distance: number,
) {
  const total = distanceBetweenPoints(from, to);

  if (total === 0) {
    return {x: from.x, y: from.y};
  }

  const ratio = distance / total;

  return {
    x: Number((from.x + (to.x - from.x) * ratio).toFixed(1)),
    y: Number((from.y + (to.y - from.y) * ratio).toFixed(1)),
  };
}

function pointsToRoundedPath(
  from: {x: number; y: number},
  to: {x: number; y: number},
  waypoints: Array<{x: number; y: number}> = [],
  maxCornerRadius = 18,
) {
  const points = [from, ...waypoints, to];

  if (points.length === 0) {
    return "";
  }

  if (points.length === 1) {
    return `M ${points[0]!.x} ${points[0]!.y}`;
  }

  const commands = [`M ${points[0]!.x} ${points[0]!.y}`];

  for (let index = 1; index < points.length - 1; index += 1) {
    const previous = points[index - 1]!;
    const current = points[index]!;
    const next = points[index + 1]!;

    if (pointsAreCollinear(previous, current, next)) {
      commands.push(`L ${current.x} ${current.y}`);
      continue;
    }

    const incomingLength = distanceBetweenPoints(previous, current);
    const outgoingLength = distanceBetweenPoints(current, next);
    const cornerRadius = Math.min(
      maxCornerRadius,
      incomingLength / 2,
      outgoingLength / 2,
    );

    if (cornerRadius < 0.5) {
      commands.push(`L ${current.x} ${current.y}`);
      continue;
    }

    const cornerStart = movePointToward(current, previous, cornerRadius);
    const cornerEnd = movePointToward(current, next, cornerRadius);

    commands.push(`L ${cornerStart.x} ${cornerStart.y}`);
    commands.push(`Q ${current.x} ${current.y} ${cornerEnd.x} ${cornerEnd.y}`);
  }

  commands.push(`L ${points[points.length - 1]!.x} ${points[points.length - 1]!.y}`);

  return commands.join(" ");
}

function resolveEdgeLabelPoint(edge: GeometrySketchDefinition["edges"][number]) {
  if (edge.labelPoint) {
    return edge.labelPoint;
  }

  const points = [edge.from, ...(edge.waypoints ?? []), edge.to];
  if (points.length < 2) {
    return edge.from;
  }

  const first = points[0]!;
  const second = points[1]!;

  return {
    x: (first.x + second.x) / 2,
    y: (first.y + second.y) / 2,
  };
}

function renderExplicitTextRuns(
  node: GeometrySketchDefinition["nodes"][number],
  tone: {text: string},
  isContainer: boolean,
) {
  return (node.textRuns ?? [])
    .filter((run) => run.text.trim().length > 0)
    .map((run, index) => (
      <text
        key={`${node.id}-run-${index}`}
        x={node.x + run.x}
        y={node.y + run.y}
        textAnchor={run.textAnchor ?? "start"}
        dominantBaseline={run.dominantBaseline ?? "middle"}
        fill={run.textColor ?? node.textColorOverride ?? tone.text}
        fontFamily={GEOMETRY_TEXT_FONT_FAMILY}
        fontSize={run.fontSize}
        fontWeight={run.fontWeight ?? resolveGeometryTextWeight(node, isContainer)}
        paintOrder="stroke fill"
        stroke="none"
      >
        {run.text}
      </text>
    ));
}

function renderLeafNode(node: GeometrySketchDefinition["nodes"][number]) {
  const tone = NODE_TONES[node.tone ?? "default"];
  const centerX = node.x + node.width / 2;
  const centerY = node.y + node.height / 2;
  const radius = Math.min(node.width, node.height) / 2;
  const textLayout = resolveGeometryTextLayout(node, false);
  const outlineMode = node.renderStyle === "outline";
  const textOnlyMode = node.renderStyle === "textOnly";
  const circleMode = node.shape === "circle";
  const explicitTextRuns = renderExplicitTextRuns(node, tone, false);
  const textGroup =
    explicitTextRuns.length > 0 ? (
      <>{explicitTextRuns}</>
    ) : (
      <>
        {textLayout.lines.map((line, index) => (
          <text
            key={`${node.id}-line-${index}`}
            x={centerX}
            y={
              centerY +
              (index - (textLayout.lines.length - 1) / 2) * textLayout.lineHeight
            }
            textAnchor="middle"
            dominantBaseline="middle"
            fill={node.textColorOverride ?? tone.text}
            fontFamily={GEOMETRY_TEXT_FONT_FAMILY}
            fontSize={node.fontSizeOverride ?? textLayout.fontSize}
            fontWeight={resolveGeometryTextWeight(node, false)}
            paintOrder="stroke fill"
            stroke={textOnlyMode ? "rgba(252, 249, 243, 0.98)" : "none"}
            strokeWidth={textOnlyMode ? (node.textStrokeWidth ?? 9) : undefined}
            strokeLinejoin="round"
          >
            {line}
          </text>
        ))}
      </>
    );

  return (
    <g
      key={node.id}
      data-node-id={node.id}
      data-node-shape={circleMode ? "circle" : "roundedRect"}
    >
      {textOnlyMode ? null : (
        circleMode ? (
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill={outlineMode ? "rgba(255, 255, 255, 0.001)" : tone.fill}
            stroke={tone.stroke}
            strokeWidth={outlineMode ? "2.8" : node.tone === "receiver" ? "3" : "2.2"}
          />
        ) : (
          <rect
            x={node.x}
            y={node.y}
            width={node.width}
            height={node.height}
            rx="18"
            fill={outlineMode ? "rgba(255, 255, 255, 0.001)" : tone.fill}
            stroke={tone.stroke}
            strokeWidth={outlineMode ? "2.8" : node.tone === "receiver" ? "3" : "2.2"}
          />
        )
      )}
      <g
        transform={
          node.textRotationDeg
            ? `rotate(${node.textRotationDeg} ${centerX} ${centerY})`
            : undefined
        }
      >
        {textGroup}
      </g>
    </g>
  );
}

function renderContainerNode(node: GeometrySketchDefinition["nodes"][number]) {
  const tone = NODE_TONES[node.tone ?? "default"];
  const textLayout = resolveGeometryTextLayout(node, true);
  const explicitTextRuns = renderExplicitTextRuns(node, tone, true);
  const titleCenterY = node.y + 38;
  const outlineMode = node.renderStyle === "outline";
  const titleBottomY =
    explicitTextRuns.length > 0
      ? Math.max(...(node.textRuns ?? []).map((run) => run.y))
      : titleCenterY +
        ((textLayout.lines.length - 1) / 2) * textLayout.lineHeight +
        textLayout.lineHeight / 2;
  const dividerY = Math.max(node.y + 62, titleBottomY + 14);

  return (
    <g key={node.id} data-node-id={node.id} data-node-role="container">
      <rect
        x={node.x}
        y={node.y}
        width={node.width}
        height={node.height}
        rx="30"
        fill={outlineMode ? "rgba(255, 255, 255, 0.001)" : tone.fill}
        stroke={tone.stroke}
        strokeWidth={outlineMode ? "2.8" : node.tone === "receiver" ? "3.2" : "2.1"}
      />
      {outlineMode ? null : (
        <path
          d={`M ${node.x + 28} ${dividerY} H ${node.x + node.width - 28}`}
          stroke={
            node.tone === "receiver"
              ? "rgba(199, 112, 70, 0.26)"
              : "rgba(76, 90, 102, 0.18)"
          }
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
      {explicitTextRuns.length > 0
        ? explicitTextRuns
        : textLayout.lines.map((line, index) => (
            <text
              key={`${node.id}-line-${index}`}
              x={node.x + 28}
              y={
                titleCenterY +
                (index - (textLayout.lines.length - 1) / 2) * textLayout.lineHeight
              }
              textAnchor="start"
              dominantBaseline="middle"
              fill={tone.text}
              fontFamily={GEOMETRY_TEXT_FONT_FAMILY}
              fontSize={textLayout.fontSize}
              fontWeight={resolveGeometryTextWeight(node, true)}
              letterSpacing={node.tone === "receiver" ? "-0.02em" : "0.01em"}
            >
              {line}
            </text>
          ))}
    </g>
  );
}

export function GeometrySketchScene({sketch}: GeometrySketchSceneProps) {
  const containerIds = resolveGeometryContainerIds(sketch);
  const containerNodes = sketch.nodes.filter((node) => containerIds.has(node.id));
  const leafNodes = sketch.nodes.filter((node) => !containerIds.has(node.id));
  const referenceImage = sketch.referenceImage;

  return (
    <div className="geometry-sketch-scene" data-testid="geometry-sketch-scene">
      <div className="geometry-sketch-badge">Geometry Sketch</div>
      <svg
        aria-label={`${sketch.label} sketch`}
        className="geometry-sketch-svg"
        viewBox="0 0 1280 720"
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
      >
        {referenceImage ? (
          <image
            data-testid="geometry-sketch-reference-image"
            href={referenceImage.src}
            x={referenceImage.x ?? 0}
            y={referenceImage.y ?? 0}
            width={referenceImage.width ?? 1280}
            height={referenceImage.height ?? 720}
            opacity={referenceImage.opacity ?? 1}
            preserveAspectRatio={
              referenceImage.preserveAspectRatio ?? "xMidYMid meet"
            }
          />
        ) : null}

        {containerNodes.map(renderContainerNode)}

        {sketch.edges.map((edge) => {
          const stroke =
            edge.colorOverride ??
            (edge.tone === "primary"
              ? "#c77046"
              : edge.tone === "proof"
                ? "#cf5e5e"
                : "rgba(76, 90, 102, 0.78)");
          const markerStartId = `geometry-arrow-start-${edge.id}`;
          const markerEndId = `geometry-arrow-end-${edge.id}`;

          return (
            <g key={edge.id} data-edge-id={edge.id}>
              {edge.arrowStart ? (
                <marker
                  id={markerStartId}
                  markerWidth="7"
                  markerHeight="7"
                  refX="1"
                  refY="3.5"
                  orient="auto-start-reverse"
                  markerUnits="userSpaceOnUse"
                >
                  <path d="M 7 0 L 0 3.5 L 7 7 z" fill={stroke} />
                </marker>
              ) : null}
              {edge.arrowEnd ? (
                <marker
                  id={markerEndId}
                  markerWidth="7"
                  markerHeight="7"
                  refX="6"
                  refY="3.5"
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  <path d="M 0 0 L 7 3.5 L 0 7 z" fill={stroke} />
                </marker>
              ) : null}
              <path
                data-edge-stroke="true"
                d={pointsToRoundedPath(edge.from, edge.to, edge.waypoints)}
                fill="none"
                stroke={stroke}
                strokeWidth={
                  edge.strokeWidthOverride ??
                  (edge.tone === "primary" ? "4" : "2.6")
                }
                opacity={edge.opacity ?? 1}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={edge.dashed ? "10 8" : undefined}
                markerStart={edge.arrowStart ? `url(#${markerStartId})` : undefined}
                markerEnd={edge.arrowEnd ? `url(#${markerEndId})` : undefined}
              />
              {edge.label ? (
                <text
                  x={resolveEdgeLabelPoint(edge).x}
                  y={resolveEdgeLabelPoint(edge).y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={stroke}
                  fontSize="24"
                  fontWeight="720"
                  letterSpacing="-0.01em"
                >
                  {edge.label}
                </text>
              ) : null}
            </g>
          );
        })}

        {leafNodes.map(renderLeafNode)}
      </svg>
    </div>
  );
}
