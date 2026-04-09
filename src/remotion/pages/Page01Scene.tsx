import {horizontalPath, mix} from "../geometry/geometry";
import type {SceneModel} from "../model/scene-model-types";
import {StageBox, StrokeArrow} from "../primitives/diagramPrimitives";

export function Page01Scene({scene}: {scene: SceneModel}) {
  const {
    arrowEndGap,
    arrowStartGap,
    axisY,
    centerBox,
    centerCenterX,
    centerTextY,
    focusFill,
    leftBox,
    leftCenterX,
    neutralFill,
    nodeStroke,
    oldCenterLabelOpacity,
    oldLabelOpacity,
    oldLabelScale,
    rightBox,
    rightCenterX,
    settledPage23Progress,
    settledPage34Progress,
    theme,
    wireStroke,
  } = scene;

  return (
    <>
      <StrokeArrow
        d={horizontalPath(
          leftBox.x + leftBox.width + arrowStartGap,
          centerBox.x - arrowEndGap,
          axisY,
        )}
        stroke={wireStroke}
        opacity={1}
        tipX={centerBox.x - arrowEndGap}
        tipY={axisY}
        direction="right"
        shaftWidth={3}
        underlayWidth={5.6}
        underlayOpacity={0.14}
        headSize={9}
      />
      <StrokeArrow
        d={horizontalPath(
          centerBox.x + centerBox.width + arrowStartGap,
          rightBox.x - arrowEndGap,
          axisY,
        )}
        stroke={wireStroke}
        opacity={1}
        tipX={rightBox.x - arrowEndGap}
        tipY={axisY}
        direction="right"
        shaftWidth={3}
        underlayWidth={5.6}
        underlayOpacity={0.14}
        headSize={9}
      />

      <StageBox box={leftBox} fill={neutralFill} stroke={nodeStroke} />
      <text
        x={leftCenterX}
        y={axisY + 4}
        fill="#22303d"
        fontSize="28"
        fontWeight="650"
        textAnchor="middle"
        dominantBaseline="middle"
        opacity={oldLabelOpacity}
        transform={`translate(${leftCenterX} ${axisY + 4}) scale(${oldLabelScale}) translate(${-leftCenterX} ${-(axisY + 4)})`}
      >
        Input
      </text>

      <StageBox
        box={centerBox}
        fill={focusFill}
        stroke={theme.accent}
        strokeWidth={mix(2.8, 3.2, settledPage23Progress)}
      />
      {settledPage34Progress > 0 ? (
        <g opacity={settledPage34Progress}>
          <StageBox
            box={centerBox}
            fill={neutralFill}
            stroke={nodeStroke}
            strokeWidth={2.8}
          />
        </g>
      ) : null}
      <text
        x={centerCenterX}
        y={centerTextY}
        fill="#22303d"
        fontSize="36"
        fontWeight="700"
        letterSpacing="-0.04em"
        textAnchor="middle"
        dominantBaseline="middle"
        opacity={oldCenterLabelOpacity}
        transform={`translate(${centerCenterX} ${centerTextY}) scale(${oldLabelScale}) translate(${-centerCenterX} ${-centerTextY})`}
      >
        f(x)
      </text>

      <StageBox box={rightBox} fill={neutralFill} stroke={nodeStroke} />
      <text
        x={rightCenterX}
        y={axisY + 4}
        fill="#22303d"
        fontSize="28"
        fontWeight="650"
        textAnchor="middle"
        dominantBaseline="middle"
        opacity={oldLabelOpacity}
        transform={`translate(${rightCenterX} ${axisY + 4}) scale(${oldLabelScale}) translate(${-rightCenterX} ${-(axisY + 4)})`}
      >
        Output
      </text>
    </>
  );
}
