import {mix, verticalPath} from "../geometry/geometry";
import type {SceneModel} from "../model/scene-model-types";
import {ApiBadge, StageBox, StrokeArrow} from "../primitives/diagramPrimitives";

export function Page04Scene({scene}: {scene: SceneModel}) {
  const {
    apiStroke,
    blendBox,
    blendCenterX,
    blendLineStartY,
    descriptionBox,
    descriptionCenterX,
    descriptionCenterY,
    descriptionScale,
    depthBox,
    depthCenterX,
    depthLineStartY,
    focusFill,
    neutralFill,
    nodeStroke,
    page4CreateOpacity,
    page4DescriptionOpacity,
    page4MiddleFade,
    page4PsoBindOpacity,
    page4PsoOpacity,
    page4StateNodeOpacity,
    page4UpperLineOpacity,
    page4WorkflowFrameBadgeX,
    page4WorkflowFrameBadgeY,
    page4WorkflowFrameBox,
    page4WorkflowFrameOpacity,
    psoBindEndY,
    psoBindStartY,
    psoBox,
    psoCenterX,
    psoCenterY,
    psoScale,
    psoTipY,
    theme,
    upperNodeScale,
    verticalBadgeOpacity,
    verticalMorphEndY,
    verticalMorphStroke,
    descriptionToPsoStartY,
    settledPage34Progress,
  } = scene;

  return (
    <>
      <g
        opacity={page4StateNodeOpacity}
        transform={`translate(${depthCenterX} ${scene.depthBox.y + scene.depthBox.height / 2}) scale(${upperNodeScale}) translate(${-depthCenterX} ${-(scene.depthBox.y + scene.depthBox.height / 2)})`}
      >
        <StageBox
          box={depthBox}
          fill={neutralFill}
          stroke={nodeStroke}
          label="Depth"
          labelSize={22}
        />
      </g>

      <g
        opacity={page4StateNodeOpacity}
        transform={`translate(${blendCenterX} ${blendBox.y + blendBox.height / 2}) scale(${upperNodeScale}) translate(${-blendCenterX} ${-(blendBox.y + blendBox.height / 2)})`}
      >
        <StageBox
          box={blendBox}
          fill={neutralFill}
          stroke={nodeStroke}
          label="Blend"
          labelSize={22}
        />
      </g>

      {page4UpperLineOpacity > 0 ? (
        <>
          <StrokeArrow
            d={verticalPath(depthCenterX, depthLineStartY, verticalMorphEndY)}
            stroke={verticalMorphStroke}
            opacity={page4UpperLineOpacity}
            tipX={depthCenterX}
            tipY={verticalMorphEndY}
            direction="down"
            shaftWidth={3.2}
            underlayWidth={6}
            underlayOpacity={0.12}
            headSize={10}
          />
          <ApiBadge
            x={depthCenterX - 18}
            y={mix(depthLineStartY, verticalMorphEndY, 0.44)}
            id={3}
            stroke={apiStroke}
            opacity={verticalBadgeOpacity}
          />
          <StrokeArrow
            d={verticalPath(blendCenterX, blendLineStartY, verticalMorphEndY)}
            stroke={verticalMorphStroke}
            opacity={page4UpperLineOpacity}
            tipX={blendCenterX}
            tipY={verticalMorphEndY}
            direction="down"
            shaftWidth={3.2}
            underlayWidth={6}
            underlayOpacity={0.12}
            headSize={10}
          />
          <ApiBadge
            x={blendCenterX + 18}
            y={mix(blendLineStartY, verticalMorphEndY, 0.44)}
            id={4}
            stroke={apiStroke}
            opacity={verticalBadgeOpacity}
          />
        </>
      ) : null}

      {settledPage34Progress > 0 && page4MiddleFade > 0 ? (
        <>
          {page4WorkflowFrameOpacity > 0.001 ? (
            <g data-testid="page4-pso-workflow-frame" opacity={page4WorkflowFrameOpacity}>
              <rect
                x={page4WorkflowFrameBox.x}
                y={page4WorkflowFrameBox.y}
                width={page4WorkflowFrameBox.width}
                height={page4WorkflowFrameBox.height}
                rx="24"
                fill="rgba(255, 251, 246, 0.04)"
                stroke={apiStroke}
                strokeWidth="2.4"
                strokeDasharray="10 8"
              />
              <ApiBadge
                testId="page4-getpipelinecachedata-badge"
                x={page4WorkflowFrameBadgeX}
                y={page4WorkflowFrameBadgeY}
                id={3}
                stroke={apiStroke}
                opacity={page4WorkflowFrameOpacity}
              />
            </g>
          ) : null}

          <g
            opacity={page4DescriptionOpacity}
            transform={`translate(${descriptionCenterX} ${descriptionCenterY}) scale(${descriptionScale}) translate(${-descriptionCenterX} ${-descriptionCenterY})`}
          >
            <StageBox
              box={descriptionBox}
              fill={neutralFill}
              stroke={nodeStroke}
              strokeWidth={2.8}
              label="Description"
              labelSize={23}
              labelWeight={700}
            />
          </g>

          <StrokeArrow
            d={verticalPath(psoCenterX, descriptionToPsoStartY, psoTipY)}
            stroke={apiStroke}
            opacity={page4CreateOpacity}
            tipX={psoCenterX}
            tipY={psoTipY}
            direction="down"
            shaftWidth={3.2}
            underlayWidth={6}
            underlayOpacity={0.12}
            headSize={10}
          />
          <ApiBadge
            x={psoCenterX - 18}
            y={mix(descriptionToPsoStartY, psoTipY, 0.44)}
            id={1}
            stroke={apiStroke}
            opacity={page4CreateOpacity}
          />

          <g
            opacity={page4PsoOpacity}
            transform={`translate(${psoCenterX} ${psoCenterY}) scale(${psoScale}) translate(${-psoCenterX} ${-psoCenterY})`}
          >
            <StageBox
              box={psoBox}
              fill={focusFill}
              stroke={theme.accent}
              strokeWidth={3}
              label="PSO"
              labelSize={30}
              labelWeight={760}
            />
          </g>

          <StrokeArrow
            d={verticalPath(psoCenterX, psoBindStartY, psoBindEndY)}
            stroke={apiStroke}
            opacity={page4PsoBindOpacity}
            tipX={psoCenterX}
            tipY={psoBindEndY}
            direction="down"
            shaftWidth={3.2}
            underlayWidth={6}
            underlayOpacity={0.12}
            headSize={10}
          />
          <ApiBadge
            x={psoCenterX - 18}
            y={mix(psoBindStartY, psoBindEndY, 0.44)}
            id={2}
            stroke={apiStroke}
            opacity={page4PsoBindOpacity}
          />
        </>
      ) : null}
    </>
  );
}
