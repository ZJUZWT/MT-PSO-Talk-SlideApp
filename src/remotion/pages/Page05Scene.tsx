import {boxRight, horizontalPath, verticalPath} from "../geometry/geometry";
import type {SceneModel} from "../model/scene-model-types";
import {CalloutBadge, StageBox, StackedLabel, StrokeArrow} from "../primitives/diagramPrimitives";

const PAGE5_UE_PSO_BOX = {
  width: 430,
  height: 302,
  radius: 24,
};
const PAGE5_UE_PSO_RIGHT_MARGIN = 54;
const PAGE5_UE_PSO_GAP = 78;
const PAGE5_UE_PSO_SHADER_BOX = {
  xInset: 16,
  yInset: 36,
  height: 40,
  radius: 15,
};
const PAGE5_UE_PSO_TITLE_Y = 24;
const PAGE5_UE_PSO_META_ITEMS = [
  {
    label: "UsageMask",
    x: 16,
    y: 92,
    width: 194,
    height: 28,
    radius: 12,
    fontSize: 13.6,
    accent: true,
  },
  {
    label: "BindCount",
    x: 220,
    y: 92,
    width: 194,
    height: 28,
    radius: 12,
    fontSize: 13.4,
    accent: false,
  },
] as const;
const PAGE5_UE_PSO_STATE_BOXES = [
  {
    lines: ["FVertexDeclaration", "ElementList"],
    x: 16,
    y: 128,
    width: 194,
    height: 56,
    radius: 16,
    accent: true,
    fontSize: 14.2,
    lineGap: 14,
  },
  {
    lines: ["FGraphicsPipeline", "RenderTargetsInfo"],
    x: 220,
    y: 128,
    width: 194,
    height: 56,
    radius: 16,
    accent: false,
    fontSize: 13.2,
    lineGap: 14,
  },
  {
    lines: ["FDepthStencilState", "InitializerRHI"],
    x: 16,
    y: 192,
    width: 194,
    height: 56,
    radius: 16,
    accent: false,
    fontSize: 13.4,
    lineGap: 14,
  },
  {
    lines: ["FBlendStateInitializerRHI", "FRasterizerStateInitializerRHI"],
    x: 220,
    y: 192,
    width: 194,
    height: 56,
    radius: 16,
    accent: false,
    fontSize: 10.9,
    lineGap: 13,
  },
  {
    lines: ["EPrimitiveType / NumSamples", "FRHIRenderPassInfo"],
    x: 16,
    y: 256,
    width: 398,
    height: 40,
    radius: 14,
    accent: false,
    fontSize: 12.8,
    lineGap: 13,
  },
] as const;

export function Page05Scene({scene}: {scene: SceneModel}) {
  const {
    apiStroke,
    assetFill,
    assetStroke,
    axisY,
    focusFill,
    page5ArrowOpacity,
    page5AssetOpacity,
    page5AssetScale,
    page5BinaryCenterX,
    page5BinaryCenterY,
    page5BinaryOpacity,
    page5BinaryScale,
    page5BinaryTargetBox,
    page5BinaryToGpuStartY,
    page5CookedToGpuEndY,
    page5MeshBox,
    page5MeshCenterX,
    page5MeshCenterY,
    page5MeshToVertexEndX,
    page5MeshToVertexStartX,
    settledPage45Progress,
    theme,
    wireStroke,
    page5QuestionOpacity,
    page56QuestionCenterX,
    page56QuestionCenterY,
    page56QuestionScale,
    sharedUpperRightBox,
    sharedUpperRightCenterY,
  } = scene;
  const page5PsoOpacity = Math.max(0, Math.min(1, (settledPage45Progress - 0.34) / 0.2));
  const page5PsoScale = 0.94 + page5PsoOpacity * 0.06;
  const page5UePsoBox = {
    ...PAGE5_UE_PSO_BOX,
    x: Math.min(
      1280 - PAGE5_UE_PSO_RIGHT_MARGIN - PAGE5_UE_PSO_BOX.width,
      boxRight(sharedUpperRightBox) + PAGE5_UE_PSO_GAP,
    ),
    y: Math.max(34, sharedUpperRightCenterY - PAGE5_UE_PSO_BOX.height / 2),
  };
  const page5UePsoCenterX = page5UePsoBox.x + page5UePsoBox.width / 2;
  const page5UePsoCenterY = page5UePsoBox.y + page5UePsoBox.height / 2;
  const page5UePsoShaderBox = {
    x: page5UePsoBox.x + PAGE5_UE_PSO_SHADER_BOX.xInset,
    y: page5UePsoBox.y + PAGE5_UE_PSO_SHADER_BOX.yInset,
    width: page5UePsoBox.width - PAGE5_UE_PSO_SHADER_BOX.xInset * 2,
    height: PAGE5_UE_PSO_SHADER_BOX.height,
    radius: PAGE5_UE_PSO_SHADER_BOX.radius,
  };
  const page5UePsoArrowTipX = boxRight(sharedUpperRightBox) + 14;
  const page5UePsoArrowStartX = Math.max(page5UePsoBox.x + 34, page5UePsoArrowTipX + 86);
  const page5UePsoArrowY = sharedUpperRightCenterY;

  return (
    <>
      {settledPage45Progress > 0 ? (
        <>
          <g
            opacity={page5BinaryOpacity}
            transform={`translate(${page5BinaryCenterX} ${page5BinaryCenterY}) scale(${page5BinaryScale}) translate(${-page5BinaryCenterX} ${-page5BinaryCenterY})`}
          >
            <StageBox
              box={page5BinaryTargetBox}
              fill={focusFill}
              stroke={theme.accent}
              strokeWidth={2.8}
            />
            <StackedLabel
              x={page5BinaryCenterX}
              y={page5BinaryCenterY + 2}
              lines={["Binary", "ShaderCode"]}
              fontSize={22}
              fontWeight={760}
              lineGap={23}
            />
          </g>

          <StrokeArrow
            testId="page5-binary-to-gpu-arrow"
            d={verticalPath(page5BinaryCenterX, page5BinaryToGpuStartY, page5CookedToGpuEndY)}
            stroke={apiStroke}
            opacity={page5ArrowOpacity}
            tipX={page5BinaryCenterX}
            tipY={page5CookedToGpuEndY}
            direction="down"
            shaftWidth={3}
            underlayWidth={5.6}
            underlayOpacity={0.12}
            headSize={9}
          />

          <g
            opacity={page5AssetOpacity}
            transform={`translate(${page5MeshCenterX} ${page5MeshCenterY}) scale(${page5AssetScale}) translate(${-page5MeshCenterX} ${-page5MeshCenterY})`}
          >
            <StageBox
              box={page5MeshBox}
              fill={assetFill}
              stroke={assetStroke}
              strokeWidth={2.8}
              tone="asset"
              label="Mesh"
              labelSize={24}
              labelWeight={700}
            />
          </g>

          <StrokeArrow
            testId="page5-mesh-arrow"
            d={horizontalPath(page5MeshToVertexStartX, page5MeshToVertexEndX, axisY)}
            stroke={wireStroke}
            opacity={page5ArrowOpacity}
            tipX={page5MeshToVertexEndX}
            tipY={axisY}
            direction="right"
            shaftWidth={3}
            underlayWidth={5.6}
            underlayOpacity={0.12}
            headSize={9}
          />

          {page5PsoOpacity > 0.001 ? (
            <>
              <g
                data-testid="page5-page1-table-box"
                opacity={page5PsoOpacity}
                transform={`translate(${page5UePsoCenterX} ${page5UePsoCenterY}) scale(${page5PsoScale}) translate(${-page5UePsoCenterX} ${-page5UePsoCenterY})`}
              >
                <StageBox
                  box={page5UePsoBox}
                  fill="rgba(255, 255, 255, 0.92)"
                  stroke="rgba(92, 106, 118, 0.38)"
                  strokeWidth={2}
                />
                <text
                  x={page5UePsoCenterX}
                  y={page5UePsoBox.y + PAGE5_UE_PSO_TITLE_Y}
                  fill={theme.accent}
                  fontSize="18.5"
                  fontWeight="820"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  UE PSO = Shaders + States + ?
                </text>
                <StageBox
                  box={page5UePsoShaderBox}
                  fill="rgba(248, 236, 226, 0.94)"
                  stroke={theme.accent}
                  strokeWidth={2.2}
                />
                <text
                  x={page5UePsoShaderBox.x + page5UePsoShaderBox.width / 2}
                  y={page5UePsoShaderBox.y + page5UePsoShaderBox.height / 2 + 1}
                  fill={theme.accent}
                  fontSize="15"
                  fontWeight="780"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  VS Hash / PS Hash
                </text>
                {PAGE5_UE_PSO_META_ITEMS.map((item) => (
                  <g key={item.label}>
                    <StageBox
                      box={{
                        x: page5UePsoBox.x + item.x,
                        y: page5UePsoBox.y + item.y,
                        width: item.width,
                        height: item.height,
                        radius: item.radius,
                      }}
                      fill={
                        item.accent
                          ? "rgba(248, 236, 226, 0.94)"
                          : "rgba(255, 251, 246, 0.94)"
                      }
                      stroke={item.accent ? theme.accent : "rgba(92, 106, 118, 0.38)"}
                      strokeWidth={item.accent ? 2 : 1.8}
                    />
                    <text
                      x={page5UePsoBox.x + item.x + item.width / 2}
                      y={page5UePsoBox.y + item.y + item.height / 2 + 1}
                      fill={item.accent ? theme.accent : "rgba(34, 48, 61, 0.76)"}
                      fontSize={item.fontSize}
                      fontWeight="760"
                      letterSpacing="-0.01em"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {item.label}
                    </text>
                  </g>
                ))}
                {PAGE5_UE_PSO_STATE_BOXES.map((item) => (
                  <g key={item.lines.join("-")}>
                    <StageBox
                      box={{
                        x: page5UePsoBox.x + item.x,
                        y: page5UePsoBox.y + item.y,
                        width: item.width,
                        height: item.height,
                        radius: item.radius,
                      }}
                      fill={item.accent ? "rgba(248, 236, 226, 0.94)" : "rgba(255, 251, 246, 0.94)"}
                      stroke={item.accent ? theme.accent : "rgba(92, 106, 118, 0.38)"}
                      strokeWidth={item.accent ? 2.1 : 1.8}
                    />
                    {item.lines.map((line, lineIndex) => (
                      <text
                        key={`${item.lines.join("-")}-${line}`}
                        x={page5UePsoBox.x + item.x + item.width / 2}
                        y={
                          page5UePsoBox.y +
                          item.y +
                          item.height / 2 +
                          1 +
                          (lineIndex - (item.lines.length - 1) / 2) * item.lineGap
                        }
                        fill={item.accent ? theme.accent : "#22303d"}
                        fontSize={item.fontSize}
                        fontWeight="760"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {line}
                      </text>
                    ))}
                  </g>
                ))}
              </g>

              <StrokeArrow
                testId="page5-page1-table-dashed-link"
                d={horizontalPath(page5UePsoArrowStartX, page5UePsoArrowTipX, page5UePsoArrowY)}
                stroke={theme.accent}
                opacity={page5PsoOpacity * 0.9}
                tipX={page5UePsoArrowTipX}
                tipY={page5UePsoArrowY}
                direction="left"
                shaftWidth={2.6}
                underlayWidth={4.8}
                underlayOpacity={0.1}
                headSize={8}
                dashArray="8 7"
              />
            </>
          ) : null}
        </>
      ) : null}

      {page5QuestionOpacity > 0.001 ? (
        <g
          opacity={page5QuestionOpacity}
          transform={`translate(${page56QuestionCenterX} ${page56QuestionCenterY}) scale(${page56QuestionScale}) translate(${-page56QuestionCenterX} ${-page56QuestionCenterY})`}
        >
          <CalloutBadge
            testId="page5-question-badge"
            x={page56QuestionCenterX}
            y={page56QuestionCenterY}
            label="?"
            stroke={apiStroke}
            fill="rgba(255, 248, 242, 0.98)"
            opacity={1}
          />
        </g>
      ) : null}
    </>
  );
}
