import {resolveRemotionStepFrame} from "../embed";
import {clamp01, easeInOutCubic, mix} from "../geometry/geometry";
import {VIEWBOX} from "./page-layout-constants";

const PAGE04_FRAME = resolveRemotionStepFrame("page_04");
const PAGE04_DATA_FRAME = resolveRemotionStepFrame("page_04_data");
const PAGE05_FRAME = resolveRemotionStepFrame("page_05");
const LEGACY_PAGE45_REPLAY_FRAMES = 120;
const LEGACY_PAGE05_REPLAY_FRAME = PAGE04_FRAME + LEGACY_PAGE45_REPLAY_FRAMES;

export type Page04DataOverlayState = {
  overlayOpacity: number;
  baseOpacity: number;
  sceneFrame: number;
  scale: number;
};

type Page04DataRow = {
  key: string;
  group: "OpenGL" | "Vulkan";
  label: string;
  api: string;
  min: string;
  max: string;
  avg: string;
  avgIsHighCost?: boolean;
  apiNote?: string;
};

export function resolvePage04DataOverlayState(
  frame: number,
): Page04DataOverlayState | null {
  if (frame < PAGE04_FRAME || frame >= PAGE05_FRAME) {
    return null;
  }

  const enterStartFrame = PAGE04_FRAME;
  const enterEndFrame = PAGE04_DATA_FRAME;
  const replayFrames = LEGACY_PAGE45_REPLAY_FRAMES;
  const exitFrames = 6;
  const replayStartFrame = Math.max(enterEndFrame, PAGE05_FRAME - replayFrames);
  const exitStartFrame = Math.max(enterEndFrame, replayStartFrame - exitFrames);

  if (frame <= enterEndFrame) {
    const enter = clamp01(
      (frame - enterStartFrame) / Math.max(1, enterEndFrame - enterStartFrame),
    );
    return {
      overlayOpacity: enter,
      baseOpacity: 1 - enter,
      sceneFrame: PAGE04_FRAME,
      scale: mix(0.985, 1, easeInOutCubic(enter)),
    };
  }

  if (frame < exitStartFrame) {
    return {
      overlayOpacity: 1,
      baseOpacity: 0,
      sceneFrame: PAGE04_FRAME,
      scale: 1,
    };
  }

  if (frame < replayStartFrame) {
    const leave = clamp01(
      (frame - exitStartFrame) / Math.max(1, replayStartFrame - exitStartFrame),
    );
    return {
      overlayOpacity: 1 - leave,
      baseOpacity: leave,
      sceneFrame: PAGE04_FRAME,
      scale: 1,
    };
  }

  const replay = clamp01(
    (frame - replayStartFrame) / Math.max(1, PAGE05_FRAME - replayStartFrame),
  );
  return {
    overlayOpacity: 0,
    baseOpacity: 1,
    sceneFrame: mix(PAGE04_FRAME, LEGACY_PAGE05_REPLAY_FRAME, replay),
    scale: 1,
  };
}

export function Page04DataScene({frame}: {frame: number}) {
  const progress = resolvePage04DataOverlayState(frame);
  if (!progress) {
    return null;
  }

  const {overlayOpacity, scale} = progress;
  const rows: readonly Page04DataRow[] = [
    {
      key: "compile",
      group: "OpenGL",
      label: "Compile (glCompileShader)",
      api: "glCompileShader",
      min: "0.396 / 0.470",
      max: "19.797 / 85.457",
      avg: "7.262 / 15.350",
      avgIsHighCost: true,
      apiNote: "x2",
    },
    {
      key: "link",
      group: "OpenGL",
      label: "Link (glLinkProgram)",
      api: "glLinkProgram",
      min: "1.059 / 0.125",
      max: "30.576 / 66.751",
      avg: "7.572 / 13.722",
      avgIsHighCost: true,
    },
    {
      key: "bind-program",
      group: "OpenGL",
      label: "Bind (BindProgramPipeline)",
      api: "BindProgramPipeline",
      min: "0.000 / 0.000",
      max: "1.293 / 0.757",
      avg: "0.003 / 0.004",
    },
    {
      key: "create",
      group: "Vulkan",
      label: "Create (CreateGfxPipeline)",
      api: "CreateGfxPipeline",
      min: "0.052 / 0.089",
      max: "59.581 / 122.600",
      avg: "13.968 / 23.243",
      avgIsHighCost: true,
    },
    {
      key: "bind-pipeline",
      group: "Vulkan",
      label: "Bind (BindGfxPipeline)",
      api: "BindGfxPipeline",
      min: "0.000 / 0.000",
      max: "0.472 / 0.583",
      avg: "0.001 / 0.004",
    },
  ];
  const tableWidth = 1200;
  const table = {
    x: (VIEWBOX.width - tableWidth) / 2,
    y: 200,
    width: tableWidth,
    height: 456,
  };
  const apiColWidth = 500;
  const valueColWidth = (table.width - apiColWidth) / 3;
  const headerHeight = 74;
  const rowCount = rows.length;
  const rowHeight = (table.height - headerHeight) / rowCount;
  const colApi = table.x + apiColWidth;
  const colMin = colApi + valueColWidth;
  const colMax = colMin + valueColWidth;
  const headerY = table.y + headerHeight;
  const avgColumnRight = table.x + table.width;
  const rowCenter = (index: number) => headerY + rowHeight * index + rowHeight / 2;

  return (
    <g
      data-testid="page4-data-overlay"
      opacity={overlayOpacity}
      transform={`translate(${VIEWBOX.width / 2} ${VIEWBOX.height / 2}) scale(${scale}) translate(${-VIEWBOX.width / 2} ${-VIEWBOX.height / 2})`}
    >
      <text
        x={VIEWBOX.width / 2}
        y={54}
        fill="#22303d"
        fontSize="30"
        fontWeight="790"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        OpenGL / Vulkan 耗时对比表
      </text>
      <text
        x={VIEWBOX.width / 2}
        y={88}
        fill="#556474"
        fontSize="24"
        fontWeight="640"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        指标单位：ms，单元格格式为 Nubia / Pixel 7
      </text>
      <text
        x={VIEWBOX.width / 2}
        y={118}
        fill="#5d6d7d"
        fontSize="22"
        fontWeight="620"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        N = Nubia Z60 Ultra (Snapdragon 8 Gen 3)
      </text>
      <text
        x={VIEWBOX.width / 2}
        y={146}
        fill="#5d6d7d"
        fontSize="22"
        fontWeight="620"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        P = Pixel 7 (Google Tensor G2)
      </text>

      <line
        x1={table.x}
        y1={table.y}
        x2={table.x + table.width}
        y2={table.y}
        stroke="rgba(34, 48, 61, 0.46)"
        strokeWidth="2.2"
      />
      <line
        x1={table.x}
        y1={headerY}
        x2={table.x + table.width}
        y2={headerY}
        stroke="rgba(34, 48, 61, 0.44)"
        strokeWidth="2"
      />
      <line
        x1={table.x}
        y1={table.y + table.height}
        x2={table.x + table.width}
        y2={table.y + table.height}
        stroke="rgba(34, 48, 61, 0.46)"
        strokeWidth="2.2"
      />
      <line
        x1={colApi}
        y1={table.y}
        x2={colApi}
        y2={table.y + table.height}
        stroke="rgba(34, 48, 61, 0.4)"
        strokeWidth="1.8"
      />
      <line
        x1={colMin}
        y1={table.y}
        x2={colMin}
        y2={table.y + table.height}
        stroke="rgba(34, 48, 61, 0.4)"
        strokeWidth="1.8"
      />
      <line
        x1={colMax}
        y1={table.y}
        x2={colMax}
        y2={table.y + table.height}
        stroke="rgba(34, 48, 61, 0.4)"
        strokeWidth="1.8"
      />
      {rows.map((_, idx) => {
        if (idx === rows.length - 1) {
          return null;
        }
        const y = headerY + rowHeight * (idx + 1);
        const isGroupBreak = rows[idx].group !== rows[idx + 1].group;
        return (
          <line
            key={`row-line-${idx}`}
            x1={table.x}
            y1={y}
            x2={table.x + table.width}
            y2={y}
            stroke={isGroupBreak ? "rgba(34, 48, 61, 0.42)" : "rgba(34, 48, 61, 0.28)"}
            strokeWidth={isGroupBreak ? "2.2" : "1.6"}
          />
        );
      })}

      <text
        x={table.x + (colApi - table.x) / 2}
        y={table.y + 37}
        fill="#22303d"
        fontSize="28"
        fontWeight="780"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        API
      </text>
      <text
        x={colApi + (colMin - colApi) / 2}
        y={table.y + 37}
        fill="#22303d"
        fontSize="28"
        fontWeight="780"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        Min (N/P)
      </text>
      <text
        x={colMin + (colMax - colMin) / 2}
        y={table.y + 37}
        fill="#22303d"
        fontSize="28"
        fontWeight="780"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        Max (N/P)
      </text>
      <text
        x={colMax + (table.x + table.width - colMax) / 2}
        y={table.y + 37}
        fill="#22303d"
        fontSize="28"
        fontWeight="780"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        Avg (N/P)
      </text>
      {rows.map((row, idx) => {
        const y = rowCenter(idx);
        const rowColor = row.group === "OpenGL" ? "#3e5870" : "#6a3a25";
        const avgMarkerCx = avgColumnRight - 14;
        const apiNoteX = colApi - 16;
        return (
          <g key={row.key}>
            <text
              x={table.x + (colApi - table.x) / 2}
              y={y}
              fill={rowColor}
              fontSize="22"
              fontWeight="760"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {row.label}
            </text>
            {row.apiNote ? (
              <g data-testid="page4-data-compile-x2-note">
                <text
                  x={apiNoteX}
                  y={y}
                  fill={rowColor}
                  fontSize="22"
                  fontWeight="760"
                  textAnchor="end"
                  dominantBaseline="middle"
                >
                  {row.apiNote}
                </text>
              </g>
            ) : null}
            <text
              x={colApi + 16}
              y={y}
              fill="#6f3f27"
              fontSize="22"
              fontWeight="760"
              dominantBaseline="middle"
            >
              {row.min}
            </text>
            <text
              x={colMin + 16}
              y={y}
              fill="#6f3f27"
              fontSize="22"
              fontWeight="760"
              dominantBaseline="middle"
            >
              {row.max}
            </text>
            <text
              x={colMax + 16}
              y={y}
              fill="#6f3f27"
              fontSize="22"
              fontWeight="760"
              dominantBaseline="middle"
            >
              {row.avg}
            </text>
            {row.avgIsHighCost ? (
              <g data-testid="page4-data-high-cost-marker" data-row-key={row.key}>
                <circle
                  cx={avgMarkerCx}
                  cy={y}
                  r="10"
                  fill="rgba(255, 0, 0, 0.12)"
                  stroke="#ff0000"
                  strokeWidth="1.8"
                />
                <text
                  x={avgMarkerCx}
                  y={y}
                  fill="#ff0000"
                  fontSize="13"
                  fontWeight="820"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  !
                </text>
              </g>
            ) : null}
          </g>
        );
      })}

    </g>
  );
}
