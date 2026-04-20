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
    neutralFill,
    focusFill,
    wireStroke,
    page5VertexIconOpacity,
    page5VertexIconScale,
    page5VertexIconY,
    pixelGridX,
    pixelGridY,
    settledPage23Progress,
  } = scene;
  const gpuSlotOpacity = newLabelOpacity * (1 - settledPage23Progress);
  const gpuSlotScale = mix(0.88, 1, newLabelOpacity);
  const gpuSlotTopY = centerTextY - mix(82, 94, settledPage23Progress);
  const gpuSlotInsertY = centerTextY - mix(56, 68, settledPage23Progress) + 6;
  const gpuSlotAnchorY = (gpuSlotTopY + gpuSlotInsertY) / 2;
  const gpuSlotCenters = [-62, 0, 62].map((offset) => centerCenterX + offset);

  return (
    <>
      <VertexTriangles
        cx={scene.leftCenterX}
        cy={page5VertexIconY}
        opacity={page5VertexIconOpacity}
        scale={page5VertexIconScale}
      />

      {gpuSlotOpacity > 0.001 ? (
        <g
          opacity={gpuSlotOpacity}
          transform={`translate(${centerCenterX} ${gpuSlotAnchorY}) scale(${gpuSlotScale}) translate(${-centerCenterX} ${-gpuSlotAnchorY})`}
        >
          {gpuSlotCenters.map((slotCenterX, index) => (
            <g key={`page2-gpu-slot-${index}`} data-testid="page2-gpu-slot">
              <path
                d={`M ${slotCenterX - 12} ${gpuSlotInsertY} L ${slotCenterX - 12} ${gpuSlotTopY + 8} Q ${slotCenterX - 12} ${gpuSlotTopY} ${slotCenterX - 4} ${gpuSlotTopY} L ${slotCenterX + 4} ${gpuSlotTopY} Q ${slotCenterX + 12} ${gpuSlotTopY} ${slotCenterX + 12} ${gpuSlotTopY + 8} L ${slotCenterX + 12} ${gpuSlotInsertY}`}
                fill="none"
                stroke={wireStroke}
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.88}
              />
              <path
                d={`M ${slotCenterX - 12} ${gpuSlotInsertY} L ${slotCenterX - 12} ${gpuSlotTopY + 8} Q ${slotCenterX - 12} ${gpuSlotTopY} ${slotCenterX - 4} ${gpuSlotTopY} L ${slotCenterX + 4} ${gpuSlotTopY} Q ${slotCenterX + 12} ${gpuSlotTopY} ${slotCenterX + 12} ${gpuSlotTopY + 8} L ${slotCenterX + 12} ${gpuSlotInsertY}`}
                fill="none"
                stroke={neutralFill}
                strokeWidth={3.1}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.96}
              />
              <path
                d={`M ${slotCenterX - 8} ${gpuSlotInsertY - 1} L ${slotCenterX + 8} ${gpuSlotInsertY - 1}`}
                fill="none"
                stroke={focusFill}
                strokeWidth={2.2}
                strokeLinecap="round"
                opacity={0.9}
              />
            </g>
          ))}
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
