import {mix} from "../geometry/geometry";
import type {SceneModel} from "../model/scene-model-types";
import {PixelGrid, VertexTriangles} from "../primitives/diagramPrimitives";

export function Page02Scene({scene}: {scene: SceneModel}) {
  const {
    centerCenterX,
    centerTextY,
    newLabelOpacity,
    newLabelScale,
    newShapeOpacity,
    newShapeScale,
    page5VertexIconOpacity,
    page5VertexIconScale,
    page5VertexIconY,
    pixelGridX,
    pixelGridY,
    settledPage23Progress,
  } = scene;

  return (
    <>
      <VertexTriangles
        cx={scene.leftCenterX}
        cy={page5VertexIconY}
        opacity={page5VertexIconOpacity}
        scale={page5VertexIconScale}
      />

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
