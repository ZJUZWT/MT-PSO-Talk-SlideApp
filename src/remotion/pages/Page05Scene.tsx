import {horizontalPath, verticalPath} from "../geometry/geometry";
import type {SceneModel} from "../model/scene-model-types";
import {CalloutBadge, StageBox, StackedLabel, StrokeArrow} from "../primitives/diagramPrimitives";

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
  } = scene;

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
