import {horizontalPath, mix, verticalPath} from "../geometry/geometry";
import type {SceneModel} from "../model/scene-model-types";
import {
  ApiBadge,
  StageBox,
  StackedLabel,
  StrokeArrow,
} from "../primitives/diagramPrimitives";

export function Page03Scene({scene}: {scene: SceneModel}) {
  const {
    apiStroke,
    focusFill,
    legacyUpperCallOpacity,
    neutralFill,
    page3LinkEndY,
    page3LinkLeftX,
    page3LinkRightX,
    page3LinkStartY,
    page3ProgramBox,
    page3ProgramCenterX,
    page3ProgramCenterY,
    page3ProgramLineOpacity,
    page3ProgramOpacity,
    page3ProgramScale,
    page3WorkflowFrameBadgeX,
    page3WorkflowFrameBadgeY,
    page3WorkflowFrameBox,
    page3WorkflowFrameOpacity,
    page5LabelMorphProgress,
    page7InlinePayloadScale,
    page7InlineRevealScale,
    page8SharedNodeOpacity,
    settledPage23Progress,
    settledPage34Progress,
    settledPage45Progress,
    shaderArtifactLabelProgress,
    shaderArrowTipX,
    shaderLineEndX,
    shaderLineStartX,
    shaderLineY,
    sharedUpperHorizontalEndX,
    sharedUpperHorizontalOpacity,
    sharedUpperHorizontalStartX,
    sharedUpperHorizontalStroke,
    sharedUpperHorizontalY,
    sharedUpperLeftBox,
    sharedUpperLeftCenterX,
    sharedUpperLeftCenterY,
    sharedUpperLeftFill,
    sharedUpperLeftStroke,
    sharedUpperNodeOpacity,
    sharedUpperRightBox,
    sharedUpperRightCenterX,
    sharedUpperRightCenterY,
    sharedUpperRightFill,
    sharedUpperRightStroke,
    sharedUpperVerticalEndY,
    sharedUpperVerticalOpacity,
    sharedUpperVerticalStartY,
    sharedUpperVerticalStroke,
    theme,
    upperLineProgress,
    upperNodeScale,
    verticalBadgeOpacity,
  } = scene;

  if (settledPage23Progress <= 0) {
    return null;
  }

  return (
    <>
      <g
        opacity={sharedUpperNodeOpacity}
        transform={`translate(${sharedUpperLeftCenterX} ${sharedUpperLeftCenterY}) scale(${upperNodeScale}) translate(${-sharedUpperLeftCenterX} ${-sharedUpperLeftCenterY})`}
      >
        <StageBox
          box={sharedUpperLeftBox}
          fill={sharedUpperLeftFill}
          stroke={sharedUpperLeftStroke}
        />
        {page5LabelMorphProgress < 0.999 ? (
          <StackedLabel
            x={sharedUpperLeftCenterX}
            y={sharedUpperLeftCenterY + 2}
            lines={["Raw", "ShaderCode"]}
            opacity={1 - page5LabelMorphProgress}
            fontSize={22}
            fontWeight={680}
            lineGap={23}
          />
        ) : null}
        {page5LabelMorphProgress > 0.001 ? (
          <text
            x={sharedUpperLeftCenterX}
            y={sharedUpperLeftCenterY + 3}
            fill="#22303d"
            fontSize="24"
            fontWeight="720"
            textAnchor="middle"
            dominantBaseline="middle"
            opacity={page5LabelMorphProgress}
          >
            Material
          </text>
        ) : null}
      </g>

      {legacyUpperCallOpacity > 0 ? (
        <>
          <StrokeArrow
            d={horizontalPath(shaderLineStartX, shaderArrowTipX, shaderLineY)}
            stroke={apiStroke}
            opacity={legacyUpperCallOpacity}
            tipX={shaderArrowTipX}
            tipY={shaderLineY}
            direction="right"
            shaftWidth={3.2}
            underlayWidth={6}
            underlayOpacity={0.12}
            headSize={10}
          />
          <ApiBadge
            x={mix(shaderLineStartX, (shaderLineStartX + shaderLineEndX) / 2, upperLineProgress)}
            y={shaderLineY - 18}
            id={1}
            stroke={apiStroke}
            opacity={legacyUpperCallOpacity}
          />
        </>
      ) : null}

      <g
        opacity={sharedUpperNodeOpacity}
        transform={`translate(${sharedUpperRightCenterX} ${sharedUpperRightCenterY}) scale(${upperNodeScale}) translate(${-sharedUpperRightCenterX} ${-sharedUpperRightCenterY})`}
      >
        <StageBox
          box={sharedUpperRightBox}
          fill={sharedUpperRightFill}
          stroke={sharedUpperRightStroke}
        />
        {shaderArtifactLabelProgress < 0.999 ? (
          <StackedLabel
            x={sharedUpperRightCenterX}
            y={sharedUpperRightCenterY + 2}
            lines={["Binary", "ShaderCode"]}
            opacity={1 - shaderArtifactLabelProgress}
            fontSize={21}
            fontWeight={700}
            lineGap={22}
          />
        ) : null}
        {shaderArtifactLabelProgress > 0.001 && page5LabelMorphProgress < 0.999 ? (
          <StackedLabel
            x={sharedUpperRightCenterX}
            y={sharedUpperRightCenterY + 2}
            lines={["SPIR-V", "ShaderCode"]}
            opacity={shaderArtifactLabelProgress * (1 - page5LabelMorphProgress)}
            fontSize={21}
            fontWeight={760}
            lineGap={22}
          />
        ) : null}
        {page5LabelMorphProgress > 0.001 ? (
          <StackedLabel
            x={sharedUpperRightCenterX}
            y={sharedUpperRightCenterY + 2}
            lines={["Cooked", "ShaderCode"]}
            opacity={page5LabelMorphProgress}
            fontSize={22}
            fontWeight={760}
            lineGap={23}
          />
        ) : null}
      </g>

      {settledPage34Progress > 0 && sharedUpperHorizontalOpacity > 0 ? (
        <StrokeArrow
          testId="shared-upper-horizontal-arrow"
          d={horizontalPath(
            sharedUpperHorizontalStartX,
            sharedUpperHorizontalEndX,
            sharedUpperHorizontalY,
          )}
          stroke={sharedUpperHorizontalStroke}
          opacity={sharedUpperHorizontalOpacity}
          tipX={sharedUpperHorizontalEndX}
          tipY={sharedUpperHorizontalY}
          direction="right"
          shaftWidth={3}
          underlayWidth={5.6}
          underlayOpacity={0.12}
          headSize={9}
        />
      ) : null}

      {page3ProgramOpacity > 0.001 ? (
        <g
          opacity={page3ProgramOpacity}
          transform={`translate(${page3ProgramCenterX} ${page3ProgramCenterY}) scale(${page3ProgramScale}) translate(${-page3ProgramCenterX} ${-page3ProgramCenterY})`}
        >
          <StageBox
            box={page3ProgramBox}
            fill={focusFill}
            stroke={theme.accent}
            strokeWidth={2.8}
            label="Program"
            labelSize={24}
            labelWeight={720}
          />
        </g>
      ) : null}

      {page3WorkflowFrameOpacity > 0.001 ? (
        <g data-testid="page3-program-workflow-frame" opacity={page3WorkflowFrameOpacity}>
          <rect
            x={page3WorkflowFrameBox.x}
            y={page3WorkflowFrameBox.y}
            width={page3WorkflowFrameBox.width}
            height={page3WorkflowFrameBox.height}
            rx="24"
            fill="rgba(255, 251, 246, 0.04)"
            stroke={apiStroke}
            strokeWidth="2.4"
            strokeDasharray="10 8"
          />
        </g>
      ) : null}

      {page3ProgramLineOpacity > 0.001 ? (
        <>
          <StrokeArrow
            testId="page3-linkprogram-input-left"
            d={verticalPath(page3LinkLeftX, page3LinkStartY, page3LinkEndY)}
            stroke={apiStroke}
            opacity={page3ProgramLineOpacity}
            tipX={page3LinkLeftX}
            tipY={page3LinkEndY}
            direction="down"
            shaftWidth={3}
            underlayWidth={5.6}
            underlayOpacity={0.12}
            headSize={9}
            dashArray="7 7"
          />
          <StrokeArrow
            testId="page3-linkprogram-input-right"
            d={verticalPath(page3LinkRightX, page3LinkStartY, page3LinkEndY)}
            stroke={apiStroke}
            opacity={page3ProgramLineOpacity}
            tipX={page3LinkRightX}
            tipY={page3LinkEndY}
            direction="down"
            shaftWidth={3}
            underlayWidth={5.6}
            underlayOpacity={0.12}
            headSize={9}
            dashArray="7 7"
          />
          <ApiBadge
            testId="page3-linkprogram-badge"
            x={(page3LinkLeftX + page3LinkRightX) / 2}
            y={mix(page3LinkStartY, page3LinkEndY, 0.5)}
            id={5}
            stroke={apiStroke}
            opacity={page3ProgramLineOpacity}
          />
          <ApiBadge
            testId="page3-getprogrambinary-badge"
            x={page3WorkflowFrameBadgeX}
            y={page3WorkflowFrameBadgeY}
            id={6}
            stroke={apiStroke}
            opacity={page3WorkflowFrameOpacity}
          />
        </>
      ) : null}

      {settledPage23Progress > 0 && sharedUpperVerticalOpacity > 0 ? (
        <g data-testid={settledPage45Progress > 0 ? "page5-cooked-to-binary-arrow" : undefined}>
          <StrokeArrow
            testId="shared-upper-vertical-arrow"
            d={verticalPath(
              sharedUpperRightCenterX,
              sharedUpperVerticalStartY,
              sharedUpperVerticalEndY,
            )}
            stroke={sharedUpperVerticalStroke}
            opacity={sharedUpperVerticalOpacity}
            tipX={sharedUpperRightCenterX}
            tipY={sharedUpperVerticalEndY}
            direction="down"
            shaftWidth={3}
            underlayWidth={5.6}
            underlayOpacity={0.12}
            headSize={9}
          />
          <ApiBadge
            testId={
              settledPage34Progress <= 0.001
                ? "page3-useprogram-badge"
                : "shared-upper-vertical-badge"
            }
            x={sharedUpperRightCenterX - 18}
            y={mix(sharedUpperVerticalStartY, sharedUpperVerticalEndY, 0.44)}
            id={2}
            stroke={apiStroke}
            opacity={verticalBadgeOpacity}
          />
        </g>
      ) : null}
    </>
  );
}
