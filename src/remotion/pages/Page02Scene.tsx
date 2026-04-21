import {clamp01, easeInOutCubic, mix, verticalPath} from "../geometry/geometry";
import type {SceneModel} from "../model/scene-model-types";
import {
  FramedImage,
  PixelGrid,
  StageBox,
  StrokeArrow,
  VertexTriangles,
} from "../primitives/diagramPrimitives";

export function Page02Scene({scene}: {scene: SceneModel}) {
  const {
    apiStroke,
    centerCenterX,
    centerTextY,
    focusFill,
    newLabelOpacity,
    newLabelScale,
    newShapeOpacity,
    newShapeScale,
    page5VertexIconOpacity,
    page5VertexIconScale,
    page5VertexIconY,
    pixelGridX,
    pixelGridY,
    settledPage12Progress,
    settledPage23Progress,
  } = scene;
  const pipelineEntryOpacity = clamp01((settledPage12Progress - 0.56) / 0.24);
  const pipelineExitOpacity = 1 - clamp01((settledPage23Progress - 0.14) / 0.18);
  const pipelineOpacity = pipelineEntryOpacity * pipelineExitOpacity;
  const pipelineLineOpacity =
    clamp01((settledPage12Progress - 0.64) / 0.16) *
    (1 - clamp01((settledPage23Progress - 0.2) / 0.16));
  const pipelineScale = mix(0.88, 1, easeInOutCubic(pipelineOpacity));
  const pipelineStatePreviewOpacity =
    clamp01((settledPage12Progress - 0.7) / 0.16) *
    (1 - clamp01((settledPage23Progress - 0.08) / 0.18));
  const pipelineStatePreviewScale = mix(
    0.92,
    1,
    easeInOutCubic(pipelineStatePreviewOpacity),
  );
  const pipelineBox = {
    x: centerCenterX - 122,
    y: centerTextY - 224,
    width: 244,
    height: 60,
    radius: 28,
  };
  const pipelineCenterY = pipelineBox.y + pipelineBox.height / 2;
  const pipelineArrowStartY = pipelineBox.y + pipelineBox.height + 12;
  const pipelineArrowEndY = centerTextY - 56;
  const pipelineLabelX = centerCenterX + 58;
  const pipelineLabelY = mix(pipelineArrowStartY, pipelineArrowEndY, 0.52);
  const lowerMediaTop = scene.centerBox.y + scene.centerBox.height + 8;
  const pipelineStatePreviewCard = {
    x: 52,
    y: lowerMediaTop,
    width: 446,
    height: 288,
    radius: 24,
  };
  const pipelineStatePreviewShaderBox = {
    x: pipelineStatePreviewCard.x + 16,
    y: pipelineStatePreviewCard.y + 36,
    width: pipelineStatePreviewCard.width - 32,
    height: 40,
    radius: 15,
  };
  const pipelineStatePreviewStateBoxes = [
    {
      label: "Vertex Decl / Input Layout",
      box: {
        x: pipelineStatePreviewCard.x + 16,
        y: pipelineStatePreviewCard.y + 112,
        width: 202,
        height: 56,
        radius: 16,
      },
      accent: true,
      fontSize: 13.2,
    },
    {
      label: "RT / Format",
      box: {
        x: pipelineStatePreviewCard.x + 228,
        y: pipelineStatePreviewCard.y + 112,
        width: 202,
        height: 56,
        radius: 16,
      },
      accent: false,
      fontSize: 14.2,
    },
    {
      label: "Depth / Stencil Test",
      box: {
        x: pipelineStatePreviewCard.x + 16,
        y: pipelineStatePreviewCard.y + 176,
        width: 202,
        height: 56,
        radius: 16,
      },
      accent: false,
      fontSize: 13.8,
    },
    {
      label: "Blend / Rasterizer State",
      box: {
        x: pipelineStatePreviewCard.x + 228,
        y: pipelineStatePreviewCard.y + 176,
        width: 202,
        height: 56,
        radius: 16,
      },
      accent: false,
      fontSize: 13,
    },
    {
      label: "Primitive / Samples / Pass",
      box: {
        x: pipelineStatePreviewCard.x + 16,
        y: pipelineStatePreviewCard.y + 240,
        width: pipelineStatePreviewCard.width - 32,
        height: 40,
        radius: 14,
      },
      accent: false,
      fontSize: 14.4,
    },
  ] as const;
  const pipelineStatePreviewCenterX =
    pipelineStatePreviewCard.x + pipelineStatePreviewCard.width / 2;
  const pipelineStatePreviewCenterY =
    pipelineStatePreviewCard.y + pipelineStatePreviewCard.height / 2;
  const vertexBufferInsetBox = {
    x: pipelineBox.x + pipelineBox.width + 20,
    y: lowerMediaTop + 4,
    width: 440,
    height: 160,
    radius: 14,
  };
  const vertexBufferInsetBadge = {
    x: vertexBufferInsetBox.x + 10,
    y: vertexBufferInsetBox.y + 10,
    width: 100,
    height: 22,
    radius: 11,
  };
  const vertexBufferInsetCenterX =
    vertexBufferInsetBox.x + vertexBufferInsetBox.width / 2;
  const vertexBufferInsetCenterY =
    vertexBufferInsetBox.y + vertexBufferInsetBox.height / 2;

  return (
    <>
      <VertexTriangles
        cx={scene.leftCenterX}
        cy={page5VertexIconY}
        opacity={page5VertexIconOpacity}
        scale={page5VertexIconScale}
      />

      {pipelineOpacity > 0.001 ? (
        <g
          data-testid="page2-pipeline-state"
          opacity={pipelineOpacity}
          transform={`translate(${centerCenterX} ${pipelineCenterY}) scale(${pipelineScale}) translate(${-centerCenterX} ${-pipelineCenterY})`}
        >
          <StageBox
            box={pipelineBox}
            fill={focusFill}
            stroke={apiStroke}
            strokeWidth={2.6}
            label="Pipeline State"
            labelSize={21}
            labelWeight={710}
          />
        </g>
      ) : null}

      {pipelineLineOpacity > 0.001 ? (
        <>
          <StrokeArrow
            testId="page2-pipeline-arrow"
            d={verticalPath(centerCenterX, pipelineArrowStartY, pipelineArrowEndY)}
            stroke={apiStroke}
            opacity={pipelineLineOpacity}
            tipX={centerCenterX}
            tipY={pipelineArrowEndY}
            direction="down"
            shaftWidth={3}
            underlayWidth={5.8}
            underlayOpacity={0.12}
            headSize={9}
          />
          <text
            x={pipelineLabelX}
            y={pipelineLabelY}
            fill={apiStroke}
            fontSize={18}
            fontWeight={700}
            letterSpacing="-0.02em"
            textAnchor="start"
            dominantBaseline="middle"
            opacity={pipelineLineOpacity}
            data-testid="page2-gfxapi-label"
          >
            GfxAPI设置
          </text>
        </>
      ) : null}

      {pipelineStatePreviewOpacity > 0.001 ? (
        <g
          data-testid="page2-pso-preview-card"
          opacity={pipelineStatePreviewOpacity}
          transform={`translate(${pipelineStatePreviewCenterX} ${pipelineStatePreviewCenterY}) scale(${pipelineStatePreviewScale}) translate(${-pipelineStatePreviewCenterX} ${-pipelineStatePreviewCenterY})`}
        >
          <g data-geometry-node-id="page2-pso-preview" data-geometry-node-label="PSOStatePreview">
            <StageBox
              box={pipelineStatePreviewCard}
              fill="rgba(255, 255, 255, 0.92)"
              stroke="rgba(92, 106, 118, 0.38)"
              strokeWidth={2}
              markGeometryBox
            />
            <text
              x={pipelineStatePreviewCard.x + 16}
              y={pipelineStatePreviewCard.y + 22}
              fill={apiStroke}
              fontSize="20"
              fontWeight="820"
              textAnchor="start"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              PSO = Shader + State
            </text>
            <g data-geometry-node-id="page2-pso-preview-shader" data-geometry-node-label="Shader">
              <StageBox
                box={pipelineStatePreviewShaderBox}
                fill="rgba(248, 236, 226, 0.94)"
                stroke={apiStroke}
                strokeWidth={2.2}
                markGeometryBox
              />
              <text
                x={pipelineStatePreviewShaderBox.x + pipelineStatePreviewShaderBox.width / 2}
                y={pipelineStatePreviewShaderBox.y + pipelineStatePreviewShaderBox.height / 2 + 1}
                fill={apiStroke}
                fontSize="15.6"
                fontWeight="780"
                textAnchor="middle"
                dominantBaseline="middle"
                data-geometry-node-text="1"
              >
                Shader / Program / Function
              </text>
            </g>
            <text
              x={pipelineStatePreviewCard.x + 16}
              y={pipelineStatePreviewCard.y + 92}
              fill="rgba(34, 48, 61, 0.72)"
              fontSize="14.4"
              fontWeight="720"
              textAnchor="start"
              dominantBaseline="middle"
              data-geometry-node-text="1"
            >
              State 里常见会收什么
            </text>
            {pipelineStatePreviewStateBoxes.map((item) => (
              <g key={item.label}>
                <StageBox
                  box={item.box}
                  fill={item.accent ? "rgba(248, 236, 226, 0.94)" : "rgba(255, 251, 246, 0.94)"}
                  stroke={item.accent ? apiStroke : "rgba(92, 106, 118, 0.38)"}
                  strokeWidth={item.accent ? 2.1 : 1.8}
                />
                <text
                  x={item.box.x + item.box.width / 2}
                  y={item.box.y + item.box.height / 2 + 0.5}
                  fill={item.accent ? apiStroke : "#22303d"}
                  fontSize={item.fontSize ?? 14}
                  fontWeight="760"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {item.label}
                </text>
              </g>
            ))}
          </g>
        </g>
      ) : null}

      {pipelineStatePreviewOpacity > 0.001 ? (
        <g
          data-geometry-node-id="page2-vertex-buffer-inset"
          data-geometry-node-label="VertexBuffer"
          opacity={pipelineStatePreviewOpacity}
          transform={`translate(${vertexBufferInsetCenterX} ${vertexBufferInsetCenterY}) scale(${pipelineStatePreviewScale}) translate(${-vertexBufferInsetCenterX} ${-vertexBufferInsetCenterY})`}
        >
          <FramedImage
            box={vertexBufferInsetBox}
            href="/supplement/VertexBuffer.png"
            clipId="page2-vertex-buffer-clip"
            dataTestId="page2-vertex-buffer-image"
            markGeometryBox
          />
          <rect
            x={vertexBufferInsetBadge.x}
            y={vertexBufferInsetBadge.y}
            width={vertexBufferInsetBadge.width}
            height={vertexBufferInsetBadge.height}
            rx={vertexBufferInsetBadge.radius}
            fill="rgba(255, 255, 255, 0.88)"
            stroke="rgba(92, 106, 118, 0.22)"
            strokeWidth="1"
          />
          <text
            x={vertexBufferInsetBadge.x + vertexBufferInsetBadge.width / 2}
            y={vertexBufferInsetBadge.y + vertexBufferInsetBadge.height / 2 + 0.5}
            fill={apiStroke}
            fontSize="12.5"
            fontWeight="820"
            textAnchor="middle"
            dominantBaseline="middle"
            data-geometry-node-text="1"
          >
            VertexBuffer
          </text>
        </g>
      ) : null}

      <text
        x={centerCenterX}
        y={centerTextY}
        fill="#22303d"
        fontSize={mix(44, 48, settledPage23Progress)}
        fontWeight={mix(750, 760, settledPage23Progress)}
        letterSpacing="-0.06em"
        textAnchor="middle"
        dominantBaseline="middle"
        opacity={newLabelOpacity}
        transform={`translate(${centerCenterX} ${centerTextY}) scale(${newLabelScale}) translate(${-centerCenterX} ${-centerTextY})`}
      >
        GPU
      </text>

      <PixelGrid
        x={pixelGridX}
        y={pixelGridY}
        opacity={newShapeOpacity}
        scale={newShapeScale}
        revealProgress={newShapeOpacity}
      />
    </>
  );
}
