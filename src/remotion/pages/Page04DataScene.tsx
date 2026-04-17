import {resolveRemotionStepFrame} from "../embed";
import {clamp01, easeInOutCubic, mix} from "../geometry/geometry";
import {VIEWBOX} from "./page-layout-constants";

const PAGE04_FRAME = resolveRemotionStepFrame("page_04");
const PAGE04_DATA_FRAME = resolveRemotionStepFrame("page_04_data");
const PAGE05_FRAME = resolveRemotionStepFrame("page_05");

export type Page04DataOverlayState = {
  overlayOpacity: number;
  baseOpacity: number;
  sceneFrame: number;
  scale: number;
};

export function resolvePage04DataOverlayState(
  frame: number,
): Page04DataOverlayState | null {
  if (frame < PAGE04_FRAME || frame >= PAGE05_FRAME) {
    return null;
  }

  const enterStartFrame = PAGE04_FRAME;
  const enterEndFrame = PAGE04_DATA_FRAME;
  const replayFrames = 36;
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
    sceneFrame: mix(PAGE04_FRAME, PAGE05_FRAME, easeInOutCubic(replay)),
    scale: 1,
  };
}

export function Page04DataScene({frame}: {frame: number}) {
  const progress = resolvePage04DataOverlayState(frame);
  if (!progress) {
    return null;
  }

  const {overlayOpacity, scale} = progress;
  const table = {x: 80, y: 194, width: 1120, height: 404};
  const headerHeight = 74;
  const rowCount = 4;
  const rowHeight = (table.height - headerHeight) / rowCount;
  const colApi = table.x + 450;
  const colMin = table.x + 750;
  const colMax = table.x + 970;
  const headerY = table.y + headerHeight;
  const rowCenter = (index: number) => headerY + rowHeight * index + rowHeight / 2;
  const rows = [
    {
      api: "Link (glLinkProgram)",
      min: "1.059 / 0.125",
      max: "30.576 / 66.751",
      avg: "7.572 / 13.722",
    },
    {
      api: "Create (CreateGfxPipeline)",
      min: "0.052 / 0.089",
      max: "59.581 / 122.600",
      avg: "13.968 / 23.243",
    },
    {
      api: "Bind (BindProgramPipeline)",
      min: "0.000 / 0.000",
      max: "1.293 / 0.757",
      avg: "0.003 / 0.004",
    },
    {
      api: "Bind (BindGfxPipeline)",
      min: "0.000 / 0.000",
      max: "0.472 / 0.583",
      avg: "0.001 / 0.004",
    },
  ] as const;

  return (
    <g
      data-testid="page4-data-overlay"
      opacity={overlayOpacity}
      transform={`translate(${VIEWBOX.width / 2} ${VIEWBOX.height / 2}) scale(${scale}) translate(${-VIEWBOX.width / 2} ${-VIEWBOX.height / 2})`}
    >
      <text
        x={table.x}
        y={92}
        fill="#22303d"
        fontSize="52"
        fontWeight="800"
        dominantBaseline="middle"
      >
        OpenGL / Vulkan 耗时对比表
      </text>
      <text
        x={table.x}
        y={132}
        fill="#556474"
        fontSize="20"
        fontWeight="640"
        dominantBaseline="middle"
      >
        指标单位：ms，单元格格式为 Nubia / Pixel 7
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
        return (
          <line
            key={`row-line-${idx}`}
            x1={table.x}
            y1={y}
            x2={table.x + table.width}
            y2={y}
            stroke="rgba(34, 48, 61, 0.28)"
            strokeWidth="1.6"
          />
        );
      })}

      <text
        x={table.x + (colApi - table.x) / 2}
        y={table.y + 37}
        fill="#22303d"
        fontSize="24"
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
        fontSize="24"
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
        fontSize="24"
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
        fontSize="24"
        fontWeight="780"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        Avg (N/P)
      </text>
      {rows.map((row, idx) => {
        const y = rowCenter(idx);
        return (
          <g key={row.api}>
            <text
              x={table.x + 16}
              y={y}
              fill="#344454"
              fontSize="20"
              fontWeight="730"
              dominantBaseline="middle"
            >
              {row.api}
            </text>
            <text
              x={colApi + 16}
              y={y}
              fill="#6f3f27"
              fontSize="20"
              fontWeight="760"
              dominantBaseline="middle"
            >
              {row.min}
            </text>
            <text
              x={colMin + 16}
              y={y}
              fill="#6f3f27"
              fontSize="20"
              fontWeight="760"
              dominantBaseline="middle"
            >
              {row.max}
            </text>
            <text
              x={colMax + 16}
              y={y}
              fill="#6f3f27"
              fontSize="20"
              fontWeight="760"
              dominantBaseline="middle"
            >
              {row.avg}
            </text>
          </g>
        );
      })}

      <text
        x={table.x}
        y={648}
        fill="#5d6d7d"
        fontSize="20"
        fontWeight="640"
        dominantBaseline="middle"
      >
        数据来源：Supplement/耗时Insight/MinePSO_耗时对比分析
      </text>
    </g>
  );
}
