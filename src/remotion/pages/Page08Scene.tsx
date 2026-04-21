import {boxBottom, boxCenterX, boxCenterY, polylinePath, verticalPath} from "../geometry/geometry";
import type {SceneModel} from "../model/scene-model-types";
import {CalloutBadge, StageBox, StrokeArrow} from "../primitives/diagramPrimitives";

export function Page08Scene({scene}: {scene: SceneModel}) {
  const {
    focusFill,
    issueStroke,
    neutralFill,
    nodeStroke,
    page7CacheCenterX,
    page7CacheCenterY,
    page7CacheOpacity,
    page7CacheScale,
    page8CookedArrowTargetGlobal,
    page8HashBadgeX,
    page8HashBadgeY,
    page8HashRefEndY,
    page8HashRefStartY,
    page8ProofCookedCueGlobalBox,
    page8ProofDividerGlobalX,
    page8ProofLabelGlobalCenterX,
    page8ProofMaterialGlobalBox,
    page8ProofMaterialGlobalCenter,
    page8ProofOpacity,
    page8ProofScale,
    page8PsoBox,
    page8PsoDividerX,
    page8PsoFieldSpecs,
    page8PsoHashArrowOpacity,
    page8PsHashFieldX,
    page8PsHashGlobalX,
    page8PsHashRefBendY,
    page8VsHashFieldX,
    page8VsHashGlobalX,
    page8VsHashRefBendY,
    page9ProofOpacity,
    page9VsHashLibraryTargetGlobal,
    page9PsHashLibraryTargetGlobal,
  } = scene;
  // Keep VS/PS proof lanes visually parallel and non-crossing on Step 10.
  const page9ProofLaneBaseY = Math.max(
    page9VsHashLibraryTargetGlobal.y,
    page9PsHashLibraryTargetGlobal.y,
  );
  const page9VsBridgeY = page9ProofLaneBaseY + 10;
  const page9PsBridgeY = page9ProofLaneBaseY + 30;

  return (
    <>
      {page8ProofOpacity > 0.001 ? (
        <>
          <g
            data-testid="page8-proof-material-box"
            opacity={page8ProofOpacity}
            transform={`translate(${page8ProofMaterialGlobalCenter.x} ${page8ProofMaterialGlobalCenter.y}) scale(${page8ProofScale}) translate(${-page8ProofMaterialGlobalCenter.x} ${-page8ProofMaterialGlobalCenter.y})`}
          >
            <StageBox
              box={page8ProofMaterialGlobalBox}
              fill={neutralFill}
              stroke={nodeStroke}
              strokeWidth={2.4}
            />
            <text
              x={page8ProofLabelGlobalCenterX}
              y={page8ProofMaterialGlobalCenter.y + 1}
              fill="#22303d"
              fontSize="21.2"
              fontWeight="750"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              Material
            </text>
            <path
              d={verticalPath(
                page8ProofDividerGlobalX,
                page8ProofMaterialGlobalBox.y + 10,
                boxBottom(page8ProofMaterialGlobalBox) - 10,
              )}
              fill="none"
              stroke="rgba(104, 140, 114, 0.16)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <g data-testid="page8-proof-cooked-cue">
              <rect
                x={page8ProofCookedCueGlobalBox.x}
                y={page8ProofCookedCueGlobalBox.y}
                width={page8ProofCookedCueGlobalBox.width}
                height={page8ProofCookedCueGlobalBox.height}
                rx={page8ProofCookedCueGlobalBox.radius}
                fill={focusFill}
                stroke="rgba(208, 107, 68, 0.54)"
                strokeWidth="1.6"
              />
              <text
                x={boxCenterX(page8ProofCookedCueGlobalBox)}
                y={boxCenterY(page8ProofCookedCueGlobalBox) + 0.5}
                fill="#a65f42"
                fontSize="15.2"
                fontWeight="760"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                Cooked ShaderCode
              </text>
            </g>
          </g>

          <StrokeArrow
            testId="page8-material-to-code-arrow"
            d={verticalPath(
              boxCenterX(page8ProofCookedCueGlobalBox),
              boxBottom(page8ProofMaterialGlobalBox) + 8,
              page8CookedArrowTargetGlobal.y,
            )}
            stroke={issueStroke}
            opacity={page8ProofOpacity}
            tipX={page8CookedArrowTargetGlobal.x}
            tipY={page8CookedArrowTargetGlobal.y}
            direction="down"
            shaftWidth={3.2}
            underlayWidth={5.8}
            underlayOpacity={0.1}
            headSize={9}
          />
          <CalloutBadge
            testId="page8-proof-badge-1"
            x={boxCenterX(page8ProofCookedCueGlobalBox) - 20}
            y={boxBottom(page8ProofMaterialGlobalBox) + 14}
            label="1"
            stroke={issueStroke}
            fill="rgba(255, 248, 242, 0.98)"
            opacity={page8ProofOpacity}
          />
        </>
      ) : null}

      {page7CacheOpacity > 0.001 ? (
        <g
          data-testid="page8-pso-box"
          opacity={page7CacheOpacity}
          transform={`translate(${page7CacheCenterX} ${page7CacheCenterY}) scale(${page7CacheScale}) translate(${-page7CacheCenterX} ${-page7CacheCenterY})`}
        >
          <rect
            x={page8PsoBox.x}
            y={page8PsoBox.y}
            width={page8PsoBox.width}
            height={page8PsoBox.height}
            rx={page8PsoBox.radius}
            fill={neutralFill}
            stroke={nodeStroke}
            strokeWidth={2.8}
          />
          <text
            x={page8PsoBox.x + 30}
            y={page7CacheCenterY + 1}
            fill="#22303d"
            fontSize="18.2"
            fontWeight="760"
            textAnchor="start"
            dominantBaseline="middle"
          >
            PSO Cache
          </text>
          <path
            d={verticalPath(
              page8PsoDividerX,
              page8PsoBox.y + 12,
              page8PsoBox.y + page8PsoBox.height - 12,
            )}
            fill="none"
            stroke="rgba(76, 90, 102, 0.18)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {page8PsoFieldSpecs.map(
            ({label, x, highlight, fontSize, fontWeight, textAnchor}) => (
              <text
                key={label}
                data-testid={`page8-pso-field-${label.replace(/[^\w]+/g, "-").toLowerCase()}`}
                x={x}
                y={page8PsoBox.y + page8PsoBox.height / 2 + 0.5}
                fill={highlight ? issueStroke : "rgba(34, 48, 61, 0.72)"}
                fontSize={String(fontSize)}
                fontWeight={String(fontWeight)}
                textAnchor={textAnchor}
                dominantBaseline="middle"
              >
                {label}
              </text>
            ),
          )}
        </g>
      ) : null}

      {page8PsoHashArrowOpacity > 0.001 ? (
        <>
          <g data-testid="page8-vs-hash-reference-arrow">
            <StrokeArrow
              d={polylinePath([
                {x: page8VsHashFieldX, y: page8HashRefStartY},
                {x: page8VsHashFieldX, y: page8VsHashRefBendY},
                {x: page8VsHashGlobalX, y: page8VsHashRefBendY},
                {x: page8VsHashGlobalX, y: page8HashRefEndY},
              ])}
              stroke={issueStroke}
              opacity={page8PsoHashArrowOpacity}
              tipX={page8VsHashGlobalX}
              tipY={page8HashRefEndY}
              direction="up"
              shaftWidth={2.8}
              underlayWidth={5}
              underlayOpacity={0.08}
              headSize={8}
              dashArray="10 8"
            />
          </g>
          <g data-testid="page8-ps-hash-reference-arrow">
            <StrokeArrow
              d={polylinePath([
                {x: page8PsHashFieldX, y: page8HashRefStartY},
                {x: page8PsHashFieldX, y: page8PsHashRefBendY},
                {x: page8PsHashGlobalX, y: page8PsHashRefBendY},
                {x: page8PsHashGlobalX, y: page8HashRefEndY},
              ])}
              stroke={issueStroke}
              opacity={page8PsoHashArrowOpacity}
              tipX={page8PsHashGlobalX}
              tipY={page8HashRefEndY}
              direction="up"
              shaftWidth={2.8}
              underlayWidth={5}
              underlayOpacity={0.08}
              headSize={8}
              dashArray="10 8"
            />
          </g>
          <CalloutBadge
            testId="page8-proof-badge-2"
            x={page8HashBadgeX}
            y={page8HashBadgeY}
            label="2"
            stroke={issueStroke}
            fill="rgba(255, 248, 242, 0.98)"
            opacity={page8PsoHashArrowOpacity}
          />
        </>
      ) : null}

      {page9ProofOpacity > 0.001 ? (
        <>
          <g data-testid="page9-vs-hash-proof-arrow">
            <StrokeArrow
              d={polylinePath([
                {x: page8VsHashFieldX, y: page8PsoBox.y},
                {x: page8VsHashFieldX, y: page9VsBridgeY},
                {x: page9VsHashLibraryTargetGlobal.x, y: page9VsBridgeY},
                {x: page9VsHashLibraryTargetGlobal.x, y: page9VsHashLibraryTargetGlobal.y},
              ])}
              stroke={issueStroke}
              opacity={page9ProofOpacity}
              tipX={page9VsHashLibraryTargetGlobal.x}
              tipY={page9VsHashLibraryTargetGlobal.y}
              direction="up"
              shaftWidth={2.8}
              underlayWidth={5}
              underlayOpacity={0.08}
              headSize={8}
              dashArray="10 8"
            />
          </g>
          <g data-testid="page9-ps-hash-proof-arrow">
            <StrokeArrow
              d={polylinePath([
                {x: page8PsHashFieldX, y: page8PsoBox.y},
                {x: page8PsHashFieldX, y: page9PsBridgeY},
                {x: page9PsHashLibraryTargetGlobal.x, y: page9PsBridgeY},
                {x: page9PsHashLibraryTargetGlobal.x, y: page9PsHashLibraryTargetGlobal.y},
              ])}
              stroke={issueStroke}
              opacity={page9ProofOpacity}
              tipX={page9PsHashLibraryTargetGlobal.x}
              tipY={page9PsHashLibraryTargetGlobal.y}
              direction="up"
              shaftWidth={2.8}
              underlayWidth={5}
              underlayOpacity={0.08}
              headSize={8}
              dashArray="10 8"
            />
          </g>
        </>
      ) : null}
    </>
  );
}
