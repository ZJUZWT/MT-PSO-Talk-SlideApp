import type {
  GeometrySketchDefinition,
  SketchNode,
  SketchNodeTone,
} from "./geometry-sketch-types";

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

function pointsToPolyline(
  from: {x: number; y: number},
  to: {x: number; y: number},
  waypoints: Array<{x: number; y: number}> = [],
) {
  return [from, ...waypoints, to].map((point) => `${point.x},${point.y}`).join(" ");
}

function resolveLeafFontSize(node: SketchNode) {
  if (node.label.length >= 24) {
    return 17;
  }

  if (node.label.length >= 18) {
    return 18.5;
  }

  return node.tone === "receiver" ? 25 : 20;
}

function renderLeafNode(node: SketchNode) {
  const tone = NODE_TONES[node.tone ?? "default"];
  const centerX = node.x + node.width / 2;
  const centerY = node.y + node.height / 2;

  return (
    <g key={node.id} data-node-id={node.id}>
      <rect
        x={node.x}
        y={node.y}
        width={node.width}
        height={node.height}
        rx="18"
        fill={tone.fill}
        stroke={tone.stroke}
        strokeWidth={node.tone === "receiver" ? "3" : "2.2"}
      />
      <text
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={tone.text}
        fontSize={resolveLeafFontSize(node)}
        fontWeight={node.tone === "receiver" ? "760" : "680"}
      >
        {node.label}
      </text>
    </g>
  );
}

function renderContainerNode(node: SketchNode) {
  const tone = NODE_TONES[node.tone ?? "default"];

  return (
    <g key={node.id} data-node-id={node.id} data-node-role="container">
      <rect
        x={node.x}
        y={node.y}
        width={node.width}
        height={node.height}
        rx="30"
        fill={tone.fill}
        stroke={tone.stroke}
        strokeWidth={node.tone === "receiver" ? "3.2" : "2.1"}
      />
      <path
        d={`M ${node.x + 28} ${node.y + 62} H ${node.x + node.width - 28}`}
        stroke={
          node.tone === "receiver"
            ? "rgba(199, 112, 70, 0.26)"
            : "rgba(76, 90, 102, 0.18)"
        }
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <text
        x={node.x + 28}
        y={node.y + 38}
        textAnchor="start"
        dominantBaseline="middle"
        fill={tone.text}
        fontSize={node.tone === "receiver" ? "24" : "18"}
        fontWeight={node.tone === "receiver" ? "760" : "720"}
        letterSpacing={node.tone === "receiver" ? "-0.02em" : "0.01em"}
      >
        {node.label}
      </text>
    </g>
  );
}

export function GeometrySketchScene({sketch}: GeometrySketchSceneProps) {
  const containerIds = new Set(
    sketch.nodes
      .filter((node) =>
        sketch.nodes.some((candidate) => candidate.containerId === node.id),
      )
      .map((node) => node.id),
  );
  const containerNodes = sketch.nodes.filter((node) => containerIds.has(node.id));
  const leafNodes = sketch.nodes.filter((node) => !containerIds.has(node.id));

  return (
    <div className="geometry-sketch-scene" data-testid="geometry-sketch-scene">
      <div className="geometry-sketch-badge">Geometry Sketch</div>
      <svg
        aria-label={`${sketch.label} sketch`}
        className="geometry-sketch-svg"
        viewBox="0 0 1280 720"
      >
        <defs>
          <linearGradient id="geometry-paper" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(198,111,76,0.05)" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="1280" height="720" fill="#fcf9f3" />
        <rect
          x="0"
          y="0"
          width="1280"
          height="720"
          fill="url(#geometry-paper)"
        />

        {containerNodes.map(renderContainerNode)}

        {sketch.edges.map((edge) => {
          const stroke =
            edge.tone === "primary"
              ? "#c77046"
              : edge.tone === "proof"
                ? "#cf5e5e"
                : "rgba(76, 90, 102, 0.78)";

          return (
            <polyline
              key={edge.id}
              points={pointsToPolyline(edge.from, edge.to, edge.waypoints)}
              fill="none"
              stroke={stroke}
              strokeWidth={edge.tone === "primary" ? "4" : "2.6"}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={edge.dashed ? "10 8" : undefined}
            />
          );
        })}

        {leafNodes.map(renderLeafNode)}
      </svg>
    </div>
  );
}
