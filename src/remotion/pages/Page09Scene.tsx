import {
  boxBottom,
  boxCenterX,
  boxCenterY,
  boxRight,
  clamp01,
  easeInOutCubic,
  horizontalPath,
  mixBox,
  polylinePath,
  verticalPath,
} from "../geometry/geometry";
import type {SceneModel} from "../model/scene-model-types";
import {
  PAGE9_CODE_BOX,
  PAGE9_FSHADER_BOX,
  PAGE9_HASHES_BOX,
  PAGE9_LIBRARY_BOX,
  PAGE9_MATERIAL_A_BOX,
  PAGE9_MATERIAL_B_BOX,
  PAGE9_MATERIAL_C_BOX,
  PAGE9_SHADERMAP_ENTRIES_BOX,
} from "./page-layout-constants";
import {
  ArrowLabelPill,
  StageBox,
  StrokeArrow,
} from "../primitives/diagramPrimitives";

export function Page09Scene({scene}: {scene: SceneModel}) {
  const {
    apiStroke,
    assetFill,
    assetStroke,
    issueStroke,
    page6FShaderBox,
    page6FShaderIndexPillWidth,
    page6InlineResourceBaseBox,
    page9LibraryOpacity,
    page9LookupOpacity,
    settledPage89Progress,
    wireStroke,
  } = scene;

  const materialOpacity = clamp01((settledPage89Progress - 0.18) / 0.18);
  const resourceIndexColor = assetStroke;
  const shaderMapIndexColor = apiStroke;
  const libraryShaderIndexColor = issueStroke;
  const fshaderMorphProgress = easeInOutCubic(clamp01(settledPage89Progress));
  const materialScale = 0.95 + easeInOutCubic(materialOpacity) * 0.05;
  const libraryScale = 0.965 + easeInOutCubic(page9LibraryOpacity) * 0.035;
  const fshaderBox = mixBox(page6FShaderBox, PAGE9_FSHADER_BOX, fshaderMorphProgress);
  const sharedLiftedBox = {
    ...page6InlineResourceBaseBox,
    x: page6InlineResourceBaseBox.x - 88,
    y: page6InlineResourceBaseBox.y + 102,
    width: page6InlineResourceBaseBox.width + 96,
    height: page6InlineResourceBaseBox.height + 8,
    radius: page6InlineResourceBaseBox.radius + 3,
  };
  const sharedBox = mixBox(
    page6InlineResourceBaseBox,
    sharedLiftedBox,
    settledPage89Progress,
  );

  const page9LookupExprBox = {
    x: PAGE9_SHADERMAP_ENTRIES_BOX.x,
    y: 204,
    width: PAGE9_SHADERMAP_ENTRIES_BOX.width,
    height: 60,
    radius: 16,
  };
  const page9LibraryIndexBox = {
    x: PAGE9_HASHES_BOX.x,
    y: 204,
    width: boxRight(PAGE9_CODE_BOX) - PAGE9_HASHES_BOX.x,
    height: 60,
    radius: 16,
  };
  const page9CodeSliceBox = {
    x: PAGE9_CODE_BOX.x,
    y: PAGE9_CODE_BOX.y + PAGE9_CODE_BOX.height + 8,
    width: PAGE9_CODE_BOX.width,
    height: 92,
    radius: 16,
  };
  const entriesDividerY = PAGE9_SHADERMAP_ENTRIES_BOX.y + 72;
  const entriesOffsetPillWidth = 150;
  const entriesOffsetPillHeight = 36;
  const entriesOffsetPillCenterY =
    (entriesDividerY + boxBottom(PAGE9_SHADERMAP_ENTRIES_BOX)) / 2;
  const codeDividerY = PAGE9_CODE_BOX.y + 40;
  const offsetSizePillHeight = 30;
  const offsetSizePillCenterY = (codeDividerY + boxBottom(PAGE9_CODE_BOX)) / 2;

  const libraryCenterX = boxCenterX(PAGE9_LIBRARY_BOX);
  const libraryCenterY = boxCenterY(PAGE9_LIBRARY_BOX);
  const fshaderPillCenterY = fshaderBox.y + fshaderBox.height * 0.75;
  const sharedIndexPillCenterY = sharedBox.y + 26;

  const fshaderBranchStartX =
    boxCenterX(fshaderBox) + page6FShaderIndexPillWidth / 2 + 6;
  const sharedIndexPillWidth = 192;
  const sharedBranchStartX = boxCenterX(sharedBox) + sharedIndexPillWidth / 2 + 6;
  const sharedBranchStartY = sharedIndexPillCenterY;
  const fshaderBranchLaneX = PAGE9_LIBRARY_BOX.x - 54;
  const lookupTargetX = page9LookupExprBox.x - 8;
  const lookupTargetY = boxCenterY(page9LookupExprBox);
  const entriesTargetX = PAGE9_SHADERMAP_ENTRIES_BOX.x - 8;
  const entriesTargetY = boxCenterY(PAGE9_SHADERMAP_ENTRIES_BOX);
  const materialCards = [
    {
      box: PAGE9_MATERIAL_C_BOX,
      label: "Material C",
      inletX: boxCenterX(PAGE9_LIBRARY_BOX) + 26,
    },
    {
      box: PAGE9_MATERIAL_B_BOX,
      label: "Material B",
      inletX: boxCenterX(PAGE9_LIBRARY_BOX),
    },
    {
      box: PAGE9_MATERIAL_A_BOX,
      label: "Material A",
      inletX: boxCenterX(PAGE9_LIBRARY_BOX) - 26,
    },
  ];

  const contentFill = "rgba(255, 255, 255, 0.96)";
  const contentWarmFill = "rgba(255, 253, 249, 0.98)";
  const contentIssueFill = "rgba(255, 247, 247, 0.98)";
  const contentStroke = "rgba(221, 202, 189, 0.92)";
  const dividerStroke = "rgba(76, 90, 102, 0.16)";

  return (
    <>
      {materialOpacity > 0.001 ? (
        <>
          {materialCards.map(({box, label}) => {
            const centerX = boxCenterX(box);
            const centerY = boxCenterY(box);

            return (
              <g
                key={label}
                opacity={materialOpacity}
                transform={`translate(${centerX} ${centerY}) scale(${materialScale}) translate(${-centerX} ${-centerY})`}
              >
                <StageBox
                  box={box}
                  fill={assetFill}
                  stroke={assetStroke}
                  strokeWidth={2.2}
                  tone="asset"
                  label={label}
                  labelSize={17.2}
                  labelWeight={710}
                />
              </g>
            );
          })}

          <g opacity={materialOpacity}>
            {materialCards.map(({box, label, inletX}) => (
                <StrokeArrow
                  key={`page9-material-stem-${label}`}
                  d={polylinePath([
                    {x: boxRight(box), y: boxCenterY(box)},
                    {x: inletX, y: boxCenterY(box)},
                    {x: inletX, y: PAGE9_LIBRARY_BOX.y},
                  ])}
                  stroke={assetStroke}
                  opacity={materialOpacity}
                  tipX={inletX}
                  tipY={PAGE9_LIBRARY_BOX.y}
                  direction="down"
                  shaftWidth={2.8}
                  underlayWidth={5}
                  underlayOpacity={0.08}
                  headSize={8}
                />
              ),
            )}
          </g>
        </>
      ) : null}

      {page9LibraryOpacity > 0.001 ? (
        <g
          data-testid="page9-shared-library-box"
          opacity={page9LibraryOpacity}
          transform={`translate(${libraryCenterX} ${libraryCenterY}) scale(${libraryScale}) translate(${-libraryCenterX} ${-libraryCenterY})`}
        >
          <rect
            x={PAGE9_LIBRARY_BOX.x}
            y={PAGE9_LIBRARY_BOX.y}
            width={PAGE9_LIBRARY_BOX.width}
            height={PAGE9_LIBRARY_BOX.height}
            rx={PAGE9_LIBRARY_BOX.radius}
            fill="rgba(255, 248, 242, 0.98)"
            stroke={apiStroke}
            strokeWidth={2.6}
          />
          <text
            x={PAGE9_LIBRARY_BOX.x + 38}
            y={PAGE9_LIBRARY_BOX.y + 40}
            fill={apiStroke}
            fontSize="17.2"
            fontWeight="800"
          >
            GLOBAL
          </text>
          <text
            x={PAGE9_LIBRARY_BOX.x + 38}
            y={PAGE9_LIBRARY_BOX.y + 82}
            fill="#22303d"
            fontSize="31.5"
            fontWeight="800"
          >
            SharedCode Library
          </text>
          <path
            d={horizontalPath(
              PAGE9_LIBRARY_BOX.x + 30,
              PAGE9_LIBRARY_BOX.x + PAGE9_LIBRARY_BOX.width - 30,
              PAGE9_LIBRARY_BOX.y + 104,
            )}
            fill="none"
            stroke="rgba(199, 112, 70, 0.18)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          <g data-testid="page9-shadermapentries-pill">
            <rect
              x={PAGE9_SHADERMAP_ENTRIES_BOX.x}
              y={PAGE9_SHADERMAP_ENTRIES_BOX.y}
              width={PAGE9_SHADERMAP_ENTRIES_BOX.width}
              height={PAGE9_SHADERMAP_ENTRIES_BOX.height}
              rx={PAGE9_SHADERMAP_ENTRIES_BOX.radius}
              fill={contentWarmFill}
              stroke="rgba(199, 112, 70, 0.5)"
              strokeWidth="1.6"
            />
            <text
              x={boxCenterX(PAGE9_SHADERMAP_ENTRIES_BOX)}
              y={PAGE9_SHADERMAP_ENTRIES_BOX.y + 34}
              fill="#22303d"
              fontSize="20.2"
              fontWeight="780"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              <tspan x={boxCenterX(PAGE9_SHADERMAP_ENTRIES_BOX)} dy="0">
                ShaderMap
              </tspan>
              <tspan x={boxCenterX(PAGE9_SHADERMAP_ENTRIES_BOX)} dy="22">
                Entries
              </tspan>
            </text>
            <path
              d={horizontalPath(
                PAGE9_SHADERMAP_ENTRIES_BOX.x + 22,
                boxRight(PAGE9_SHADERMAP_ENTRIES_BOX) - 22,
                entriesDividerY,
              )}
              fill="none"
              stroke={dividerStroke}
              strokeWidth="1.1"
              strokeLinecap="round"
            />
            <rect
              x={boxCenterX(PAGE9_SHADERMAP_ENTRIES_BOX) - entriesOffsetPillWidth / 2}
              y={entriesOffsetPillCenterY - entriesOffsetPillHeight / 2}
              width={entriesOffsetPillWidth}
              height={entriesOffsetPillHeight}
              rx={entriesOffsetPillHeight / 2}
              fill="rgba(255, 255, 255, 0.98)"
              stroke="rgba(199, 112, 70, 0.42)"
              strokeWidth="1.5"
            />
            <text
              x={boxCenterX(PAGE9_SHADERMAP_ENTRIES_BOX)}
              y={entriesOffsetPillCenterY}
              fill="#344252"
              fontSize="15.2"
              fontWeight="740"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              <tspan x={boxCenterX(PAGE9_SHADERMAP_ENTRIES_BOX)} dy="-7">
                ShaderIndices
              </tspan>
              <tspan x={boxCenterX(PAGE9_SHADERMAP_ENTRIES_BOX)} dy="16">
                Offset
              </tspan>
            </text>
          </g>

          <g data-testid="page9-shaderhashes-pill">
            <rect
              x={PAGE9_HASHES_BOX.x}
              y={PAGE9_HASHES_BOX.y}
              width={PAGE9_HASHES_BOX.width}
              height={PAGE9_HASHES_BOX.height}
              rx={PAGE9_HASHES_BOX.radius}
              fill={contentIssueFill}
              stroke="rgba(240, 91, 79, 0.92)"
              strokeWidth="1.7"
            />
            <text
              x={boxCenterX(PAGE9_HASHES_BOX)}
              y={PAGE9_HASHES_BOX.y + 34}
              fill="#ef3f34"
              fontSize="19.6"
              fontWeight="790"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              <tspan x={boxCenterX(PAGE9_HASHES_BOX)} dy="0">
                Shader
              </tspan>
              <tspan x={boxCenterX(PAGE9_HASHES_BOX)} dy="22">
                HashTable
              </tspan>
            </text>
            <path
              d={horizontalPath(
                PAGE9_HASHES_BOX.x + 22,
                boxRight(PAGE9_HASHES_BOX) - 22,
                PAGE9_HASHES_BOX.y + 72,
              )}
              fill="none"
              stroke="rgba(240, 91, 79, 0.18)"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </g>

          <g data-testid="page9-shadercode-pill">
            <rect
              x={PAGE9_CODE_BOX.x}
              y={PAGE9_CODE_BOX.y}
              width={PAGE9_CODE_BOX.width}
              height={PAGE9_CODE_BOX.height}
              rx={PAGE9_CODE_BOX.radius}
              fill={contentFill}
              stroke={contentStroke}
              strokeWidth="1.5"
            />
            <text
              x={boxCenterX(PAGE9_CODE_BOX)}
              y={PAGE9_CODE_BOX.y + 26}
              fill="#22303d"
              fontSize="19"
              fontWeight="770"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              ShaderEntries
            </text>
            <path
              d={horizontalPath(
                PAGE9_CODE_BOX.x + 20,
                boxRight(PAGE9_CODE_BOX) - 20,
                PAGE9_CODE_BOX.y + 40,
              )}
              fill="none"
              stroke={dividerStroke}
              strokeWidth="1.1"
              strokeLinecap="round"
            />
            <ArrowLabelPill
              x={boxCenterX(PAGE9_CODE_BOX)}
              y={offsetSizePillCenterY}
              width={154}
              height={offsetSizePillHeight}
              label="Offset / Size"
              stroke="rgba(149, 162, 175, 0.72)"
              fill="rgba(255, 255, 255, 0.98)"
              textFill="#344252"
              fontSize={16}
              fontWeight={720}
            />
          </g>

          <g data-testid="page9-shaderblob-pill">
            <rect
              x={page9CodeSliceBox.x}
              y={page9CodeSliceBox.y}
              width={page9CodeSliceBox.width}
              height={page9CodeSliceBox.height}
              rx={page9CodeSliceBox.radius}
              fill={contentFill}
              stroke={contentStroke}
              strokeWidth="1.5"
            />
            <text
              x={boxCenterX(page9CodeSliceBox)}
              y={boxCenterY(page9CodeSliceBox)}
              fill="#22303d"
              fontSize="18"
              fontWeight="760"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              <tspan x={boxCenterX(page9CodeSliceBox)} dy="-8">
                Cooked
              </tspan>
              <tspan x={boxCenterX(page9CodeSliceBox)} dy="18">
                ShaderCode
              </tspan>
            </text>
          </g>

          {page9LookupOpacity > 0.001 ? (
            <>
              <g data-testid="page9-lookup-formula" opacity={page9LookupOpacity}>
                <rect
                  x={page9LookupExprBox.x}
                  y={page9LookupExprBox.y}
                  width={page9LookupExprBox.width}
                  height={page9LookupExprBox.height}
                  rx={page9LookupExprBox.radius}
                  fill={contentWarmFill}
                  stroke="rgba(199, 112, 70, 0.56)"
                  strokeWidth="1.8"
                />
                <text
                  x={boxCenterX(page9LookupExprBox)}
                  y={boxCenterY(page9LookupExprBox) + 1}
                  fill="#22303d"
                  fontSize="19.2"
                  fontWeight="790"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  ShaderIndices
                </text>
                <StrokeArrow
                  testId="page9-shadermapentry-to-formula-arrow"
                  d={verticalPath(
                    boxCenterX(PAGE9_SHADERMAP_ENTRIES_BOX),
                    PAGE9_SHADERMAP_ENTRIES_BOX.y - 8,
                    boxBottom(page9LookupExprBox) + 4,
                  )}
                  stroke={shaderMapIndexColor}
                  opacity={page9LookupOpacity}
                  tipX={boxCenterX(page9LookupExprBox)}
                  tipY={boxBottom(page9LookupExprBox) + 4}
                  direction="up"
                  shaftWidth={2.6}
                  underlayWidth={4.6}
                  underlayOpacity={0.08}
                  headSize={8}
                />

                <StrokeArrow
                  testId="page9-formula-to-libraryindex-arrow"
                  d={horizontalPath(
                    boxRight(page9LookupExprBox) + 10,
                    page9LibraryIndexBox.x - 10,
                    boxCenterY(page9LookupExprBox),
                  )}
                  stroke={libraryShaderIndexColor}
                  opacity={page9LookupOpacity}
                  tipX={page9LibraryIndexBox.x - 10}
                  tipY={boxCenterY(page9LookupExprBox)}
                  direction="right"
                  shaftWidth={2.8}
                  underlayWidth={5}
                  underlayOpacity={0.08}
                  headSize={8}
                />

                <rect
                  x={page9LibraryIndexBox.x}
                  y={page9LibraryIndexBox.y}
                  width={page9LibraryIndexBox.width}
                  height={page9LibraryIndexBox.height}
                  rx={page9LibraryIndexBox.radius}
                  fill={contentIssueFill}
                  stroke={libraryShaderIndexColor}
                  strokeWidth={2.1}
                />
                <text
                  x={boxCenterX(page9LibraryIndexBox)}
                  y={boxCenterY(page9LibraryIndexBox) + 1}
                  fill={libraryShaderIndexColor}
                  fontSize="21.6"
                  fontWeight="810"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  LibraryShaderIndex
                </text>
              </g>

              <StrokeArrow
                testId="page9-hash-to-libraryindex-arrow"
                d={verticalPath(
                  boxCenterX(PAGE9_HASHES_BOX),
                  PAGE9_HASHES_BOX.y - 8,
                  boxBottom(page9LibraryIndexBox) + 4,
                )}
                stroke={libraryShaderIndexColor}
                opacity={page9LookupOpacity}
                tipX={boxCenterX(PAGE9_HASHES_BOX)}
                tipY={boxBottom(page9LibraryIndexBox) + 4}
                direction="up"
                shaftWidth={2.8}
                underlayWidth={5}
                underlayOpacity={0.08}
                headSize={8}
              />

              <StrokeArrow
                testId="page9-libraryindex-to-shaderentry-arrow"
                d={verticalPath(
                  boxCenterX(PAGE9_CODE_BOX),
                  boxBottom(page9LibraryIndexBox) + 6,
                  PAGE9_CODE_BOX.y - 8,
                )}
                stroke={libraryShaderIndexColor}
                opacity={page9LookupOpacity}
                tipX={boxCenterX(PAGE9_CODE_BOX)}
                tipY={PAGE9_CODE_BOX.y - 8}
                direction="down"
                shaftWidth={2.8}
                underlayWidth={5}
                underlayOpacity={0.08}
                headSize={8}
              />

              <StrokeArrow
                testId="page9-shaderentry-to-codeslice-arrow"
                d={verticalPath(
                  boxCenterX(PAGE9_CODE_BOX),
                  boxBottom(PAGE9_CODE_BOX) + 6,
                  page9CodeSliceBox.y - 6,
                )}
                stroke={wireStroke}
                opacity={page9LookupOpacity}
                tipX={boxCenterX(PAGE9_CODE_BOX)}
                tipY={page9CodeSliceBox.y - 6}
                direction="down"
                shaftWidth={2.7}
                underlayWidth={4.8}
                underlayOpacity={0.08}
                headSize={8}
              />
            </>
          ) : null}
        </g>
      ) : null}

      {page9LookupOpacity > 0.001 ? (
        <>
          <g data-testid="page9-fshader-lookup-branch">
            <StrokeArrow
              d={polylinePath([
                {x: fshaderBranchStartX, y: fshaderPillCenterY},
                {x: fshaderBranchLaneX, y: fshaderPillCenterY},
                {x: fshaderBranchLaneX, y: lookupTargetY},
                {x: lookupTargetX, y: lookupTargetY},
              ])}
              stroke={resourceIndexColor}
              opacity={page9LookupOpacity}
              tipX={lookupTargetX}
              tipY={lookupTargetY}
              direction="right"
              shaftWidth={3}
              underlayWidth={5.4}
              underlayOpacity={0.1}
              headSize={8}
              dashArray="9 7"
            />
          </g>

          <g data-testid="page9-shadermapindex-lookup-branch">
            <StrokeArrow
              d={horizontalPath(sharedBranchStartX, entriesTargetX, sharedBranchStartY)}
              stroke={shaderMapIndexColor}
              opacity={page9LookupOpacity}
              tipX={entriesTargetX}
              tipY={sharedBranchStartY}
              direction="right"
              shaftWidth={3}
              underlayWidth={5.4}
              underlayOpacity={0.1}
              headSize={8}
              dashArray="9 7"
            />
          </g>
        </>
      ) : null}
    </>
  );
}
