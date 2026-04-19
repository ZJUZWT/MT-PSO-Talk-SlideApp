import {
  boxBottom,
  boxCenterX,
  boxCenterY,
  boxRight,
  clamp01,
  easeInOutCubic,
  horizontalPath,
  mix,
  mixBox,
  mixRgba,
  polylinePath,
  verticalPath,
} from "../geometry/geometry";
import type {SceneModel} from "../model/scene-model-types";
import {
  ArrowLabelPill,
  StageBox,
  StrokeArrow,
} from "../primitives/diagramPrimitives";
import {PAGE9_FSHADER_BOX, PAGE9_SHARED_RESOURCE_BOX} from "./page-layout-constants";

export function Page07Scene({scene}: {scene: SceneModel}) {
  const {
    apiStroke,
    accentStrokeColor,
    assetStroke,
    focusFill,
    neutralFill,
    nodeStroke,
    nodeStrokeColor,
    page6EntriesPillCenterY,
    page6EntriesToCookedEndX,
    page6EntriesToCookedStartX,
    page6FShaderBox,
    page6FShaderCenterX,
    page6FShaderCenterY,
    page6FShaderDividerY,
    page6FShaderIndexPillCenterX,
    page6FShaderIndexPillCenterY,
    page6FShaderIndexPillHeight,
    page6FShaderIndexPillWidth,
    page6FShaderTitleSize,
    page6FShaderTitleY,
    page6FShaderToInlineCurrentEndY,
    page6FShaderToInlineStartY,
    page6FShaderToInlineX,
    page6HashesPillCenterY,
    page6InlineCodeBox,
    page6InlineResourceBaseBox,
    page6InlineResourceCenterX,
    page6InlineResourceCenterY,
    page6IndexLabelCenterX,
    page6IndexLabelCenterY,
    page6LookupDividerY,
    page6LookupPillHeight,
    page6LookupPillWidth,
    page6NodeScale,
    page6OwnershipLaneX,
    page6ResourceCodeBox,
    page6ResourceCodeCenterX,
    page6ResourceCodeCenterY,
    page6ResourceCenterY,
    page6ShaderArrowCurrentEndX,
    page6ShaderArrowStartX,
    page6ShaderMapBox,
    page6ShaderMapCenterX,
    page6ShaderMapCenterY,
    page7InlinePayloadLift,
    page7InlinePayloadScale,
    page7InlineRevealScale,
    page7LookupContentOpacity,
    page7LookupLineOpacity,
    page7LookupOuterOpacity,
    page8HashPillFill,
    page8HashPillStroke,
    page8SharedNodeOpacity,
    page9LibraryOpacity,
    settledPage89Progress,
    wireStroke,
  } = scene;
  const page89MorphProgress = easeInOutCubic(clamp01(settledPage89Progress));
  const page9LeftCarryOpacity = easeInOutCubic(
    clamp01((settledPage89Progress - 0.02) / 0.32),
  );
  const page8SharedCarryOpacity = page8SharedNodeOpacity * (1 - page9LibraryOpacity);
  const page7LineCarryOpacity =
    page7LookupLineOpacity * (1 - Math.min(1, settledPage89Progress / 0.2));
  const page7FShaderOpacity = Math.max(page7LineCarryOpacity, page9LeftCarryOpacity);
  const page7LookupBridgeOpacity = Math.max(page7LookupOuterOpacity, page9LeftCarryOpacity);
  const page7InlineResourceOpacity = Math.max(
    page7LookupOuterOpacity,
    page8SharedCarryOpacity,
    page9LeftCarryOpacity,
  );
  const page7InlineTitleOpacity =
    page7LookupOuterOpacity * (1 - clamp01((settledPage89Progress - 0.02) / 0.18));
  const page7SharedLabelOpacity = Math.max(page8SharedCarryOpacity, page9LeftCarryOpacity);
  const page7FShaderBox = mixBox(page6FShaderBox, PAGE9_FSHADER_BOX, page89MorphProgress);
  const page7FShaderCenterX = boxCenterX(page7FShaderBox);
  const page7FShaderCenterY = boxCenterY(page7FShaderBox);
  const page7FShaderTitleY = page7FShaderBox.y + page7FShaderBox.height * 0.285;
  const page7FShaderDividerY = page7FShaderBox.y + page7FShaderBox.height * 0.5;
  const page7FShaderIndexPillCenterY = page7FShaderBox.y + page7FShaderBox.height * 0.75;
  const page7FShaderToInlineStartY = boxBottom(page7FShaderBox) + 8;
  const page7FShaderTestId =
    settledPage89Progress > 0.72 ? "page9-fshader-card" : "page6-fshader-card";
  const page9BoxSwitchProgress = clamp01((settledPage89Progress - 0.72) / 0.28);
  const page9CarryMorphProgress = easeInOutCubic(page9BoxSwitchProgress);
  const page9LeftColumnEase = easeInOutCubic(
    clamp01((settledPage89Progress - 0.02) / 0.32),
  );
  const page9LeftColumnScale = 1 - 0.18 * page9LeftColumnEase;
  const page9LeftColumnShiftX = -24 * page9LeftColumnEase;
  const projectLeftLanePoint = (x: number, y: number) => ({
    x:
      page6OwnershipLaneX +
      page9LeftColumnShiftX +
      page9LeftColumnScale * (x - page6OwnershipLaneX),
    y:
      page6ResourceCenterY +
      page9LeftColumnScale * (y - page6ResourceCenterY),
  });
  const page7SharedRenderBox = mixBox(
    page6InlineResourceBaseBox,
    PAGE9_SHARED_RESOURCE_BOX,
    page9CarryMorphProgress,
  );
  const page7SharedCenterX = boxCenterX(page7SharedRenderBox);
  const page7SharedCenterY = boxCenterY(page7SharedRenderBox);
  const page7ShaderMapBridgeStartX = boxRight(page6ShaderMapBox);
  const page7ShaderMapBridgeStartY = mix(
    page6ShaderMapCenterY,
    boxBottom(page6ShaderMapBox) + 4,
    page89MorphProgress,
  );
  const page7ShaderMapBridgeEndY = mix(
    page6ShaderMapCenterY,
    boxCenterY(page7SharedRenderBox),
    page89MorphProgress,
  );
  const page7ShaderMapBridgeStubX = page7ShaderMapBridgeStartX + 20;
  const page7ShaderMapBridgeEndX = mix(
    page6ShaderArrowCurrentEndX,
    page7SharedRenderBox.x,
    page89MorphProgress,
  );
  const page7SharedTestId =
    settledPage89Progress > 0.72 ? "page9-shared-resource-box" : "page6-inline-resource-box";
  const page7BridgeTestId =
    settledPage89Progress > 0.72
      ? "page9-shadermap-to-sharedcode-arrow"
      : "page6-shadermap-to-inline-arrow";
  const page9SharedEntryX = page7SharedRenderBox.x;
  const page9SharedEntryY = boxBottom(page7SharedRenderBox) - 14;
  const page9SharedEntryPreX = page9SharedEntryX - 8;
  const page9LegacyBridgeStart = projectLeftLanePoint(
    boxRight(page6ShaderMapBox),
    page6ShaderMapCenterY,
  );
  const page9BottomBridgeStart = projectLeftLanePoint(
    page6ShaderMapCenterX,
    boxBottom(page6ShaderMapBox),
  );
  // Keep ShaderMap -> SharedCode as one continuous carrier during page8->page9
  // instead of fading between two unrelated edges.
  const page9BridgeMorphProgress = easeInOutCubic(
    clamp01((page9BoxSwitchProgress - 0.02) / 0.3),
  );
  const page9BridgeStartX = mix(
    page9LegacyBridgeStart.x,
    page9BottomBridgeStart.x,
    page9BridgeMorphProgress,
  );
  const page9BridgeStartY = mix(
    page9LegacyBridgeStart.y,
    page9BottomBridgeStart.y,
    page9BridgeMorphProgress,
  );
  const page9BridgeLaneY = mix(
    boxCenterY(page7SharedRenderBox) + 6,
    page9SharedEntryY,
    page9BridgeMorphProgress,
  );
  const page9BridgeOpacity =
    page7BridgeTestId === "page9-shadermap-to-sharedcode-arrow"
      ? page7LookupBridgeOpacity
      : 0;
  const page9BridgePath = polylinePath([
    {x: page9BridgeStartX, y: page9BridgeStartY},
    {x: page9BridgeStartX, y: page9BridgeLaneY},
    {x: page9SharedEntryPreX, y: page9BridgeLaneY},
    {x: page9SharedEntryX, y: page9BridgeLaneY},
  ]);
  const page7BridgePath = polylinePath([
    {x: page7ShaderMapBridgeStartX, y: page7ShaderMapBridgeStartY},
    {x: page7ShaderMapBridgeStubX, y: page7ShaderMapBridgeStartY},
    {x: page7ShaderMapBridgeStubX, y: page7ShaderMapBridgeEndY},
    {x: page7ShaderMapBridgeEndX, y: page7ShaderMapBridgeEndY},
  ]);
  const shaderMapBridgeArrow =
    page7BridgeTestId === "page9-shadermap-to-sharedcode-arrow" ? (
      page9BridgeOpacity > 0.001 ? (
        <StrokeArrow
          testId="page9-shadermap-to-sharedcode-arrow"
          d={page9BridgePath}
          stroke={wireStroke}
          opacity={page9BridgeOpacity}
          tipX={page9SharedEntryX}
          tipY={page9BridgeLaneY}
          direction="right"
          shaftWidth={3}
          underlayWidth={5.6}
          underlayOpacity={0.1}
          headSize={9}
        />
      ) : null
    ) : page7LookupBridgeOpacity > 0.001 ? (
      <StrokeArrow
        testId={page7BridgeTestId}
        d={page7BridgePath}
        stroke={wireStroke}
        opacity={page7LookupBridgeOpacity}
        tipX={page7ShaderMapBridgeEndX}
        tipY={page7ShaderMapBridgeEndY}
        direction="right"
        shaftWidth={3}
        underlayWidth={5.6}
        underlayOpacity={0.1}
        headSize={9}
      />
    ) : null;

  return (
    <>
      {page7FShaderOpacity > 0.001 ? (
        <g
          data-testid={page7FShaderTestId}
          opacity={page7FShaderOpacity}
          transform={`translate(${page7FShaderCenterX} ${page7FShaderCenterY}) scale(${page6NodeScale}) translate(${-page7FShaderCenterX} ${-page7FShaderCenterY})`}
        >
          <StageBox
            box={page7FShaderBox}
            fill={neutralFill}
            stroke={nodeStroke}
            strokeWidth={2.8}
          />
          <text
            x={page7FShaderCenterX}
            y={page7FShaderTitleY}
            fill="#22303d"
            fontSize={page6FShaderTitleSize}
            fontWeight="760"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            FShader
          </text>
          <path
            d={horizontalPath(
              page7FShaderBox.x + 20,
              boxRight(page7FShaderBox) - 20,
              page7FShaderDividerY,
            )}
            fill="none"
            stroke="rgba(76, 90, 102, 0.16)"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <ArrowLabelPill
            testId="page6-fshader-index-pill"
            x={page7FShaderCenterX}
            y={page7FShaderIndexPillCenterY}
            width={page6FShaderIndexPillWidth}
            height={page6FShaderIndexPillHeight}
            label="ResourceIndex"
            stroke={page9LeftCarryOpacity > 0.001 ? assetStroke : "rgba(76, 90, 102, 0.18)"}
            fill="rgba(255, 255, 255, 0.82)"
            textFill={page9LeftCarryOpacity > 0.001 ? assetStroke : "#4f6271"}
            fontSize={18.2}
            fontWeight={730}
          />
        </g>
      ) : null}

      {page7LineCarryOpacity > 0.001 ? (
        <>
          <StrokeArrow
            testId="page6-fshader-to-inline-arrow"
            d={verticalPath(
              page7FShaderCenterX,
              page7FShaderToInlineStartY,
              page6FShaderToInlineCurrentEndY,
            )}
            stroke={wireStroke}
            opacity={page7LineCarryOpacity}
            tipX={page7FShaderCenterX}
            tipY={page6FShaderToInlineCurrentEndY}
            direction="down"
            shaftWidth={3}
            underlayWidth={5.6}
            underlayOpacity={0.1}
            headSize={9}
          />
          <ArrowLabelPill
            testId="page6-index-label"
            x={page7FShaderCenterX + 42}
            y={page6IndexLabelCenterY}
            width={46}
            height={24}
            label="idx"
            stroke={wireStroke}
            fill="rgba(255, 251, 246, 0.96)"
            fontSize={14.2}
            fontWeight={760}
            opacity={page7LineCarryOpacity}
          />
        </>
      ) : null}

      {page7InlineResourceOpacity > 0.001 ? (
        <>
          <g
            data-testid={page7SharedTestId}
            opacity={page7InlineResourceOpacity}
            transform={`translate(${page7SharedCenterX} ${page7SharedCenterY}) scale(${mix(page7InlineRevealScale, 1.02, settledPage89Progress)}) translate(${-page7SharedCenterX} ${-page7SharedCenterY})`}
          >
            <StageBox
              box={page7SharedRenderBox}
              fill={focusFill}
              stroke={mixRgba(nodeStrokeColor, accentStrokeColor, settledPage89Progress)}
              strokeWidth={3}
            />
            {page7InlineTitleOpacity > 0.001 ? (
              <text
                x={page7SharedCenterX}
                y={page7SharedRenderBox.y + 34}
                fill="#22303d"
                fontSize="26.6"
                fontWeight={760}
                textAnchor="middle"
                dominantBaseline="middle"
                opacity={page7InlineTitleOpacity}
              >
                FShaderMapResource_InlineCode
              </text>
            ) : null}
            {page7SharedLabelOpacity > 0.001 ? (
              <>
                <g data-testid="page8-shared-resource-box" opacity={0} />
                <text
                  x={page7SharedCenterX}
                  y={page7SharedRenderBox.y + 34}
                  fill="#22303d"
                  fontSize="18.2"
                  fontWeight="730"
                  letterSpacing="-0.15px"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  opacity={page7SharedLabelOpacity}
                >
                  <tspan x={page7SharedCenterX} dy="-8">
                    FShaderMapResource_
                  </tspan>
                  <tspan x={page7SharedCenterX} dy="20">
                    SharedCode
                  </tspan>
                </text>
                {page9LeftCarryOpacity > 0.001 ? (
                  <ArrowLabelPill
                    x={page7SharedCenterX}
                    y={page7SharedRenderBox.y + 76}
                    width={192}
                    height={28}
                    label="ShaderMapIndex"
                    stroke={apiStroke}
                    fill="rgba(255, 253, 249, 0.96)"
                    textFill={apiStroke}
                    fontSize={17.2}
                    fontWeight={720}
                    opacity={page9LeftCarryOpacity}
                  />
                ) : null}
              </>
            ) : null}
          </g>

          {page7LookupContentOpacity > 0.001 ? (
            <>
              <g
                data-testid="page6-resource-code-box"
                opacity={page7LookupContentOpacity}
                transform={`translate(${page6ResourceCodeCenterX} ${page6ResourceCodeCenterY}) translate(0 ${page7InlinePayloadLift}) scale(${page7InlinePayloadScale}) translate(${-page6ResourceCodeCenterX} ${-page6ResourceCodeCenterY})`}
              >
                <StageBox
                  box={page6ResourceCodeBox}
                  fill={neutralFill}
                  stroke={nodeStroke}
                  strokeWidth={2.4}
                />
                <text
                  x={page6ResourceCodeCenterX}
                  y={page6ResourceCodeBox.y + 34}
                  fill="#22303d"
                  fontSize="24.5"
                  fontWeight={760}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  opacity={page7LookupContentOpacity}
                >
                  FShaderMapResourceCode
                </text>
                <path
                  d={horizontalPath(
                    page6ResourceCodeBox.x + 22,
                    boxRight(page6ResourceCodeBox) - 22,
                    page6LookupDividerY,
                  )}
                  fill="none"
                  stroke="rgba(76, 90, 102, 0.16)"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
                <ArrowLabelPill
                  testId="page6-entries-pill"
                  x={page6ResourceCodeCenterX}
                  y={page6EntriesPillCenterY}
                  width={page6LookupPillWidth}
                  height={page6LookupPillHeight}
                  label="ShaderEntries[idx]"
                  stroke="rgba(76, 90, 102, 0.18)"
                  fill="rgba(255, 255, 255, 0.78)"
                  textFill="#22303d"
                  fontSize={20.8}
                  fontWeight={740}
                  opacity={page7LookupContentOpacity}
                />
                <ArrowLabelPill
                  testId="page6-hashes-pill"
                  x={page6ResourceCodeCenterX}
                  y={page6HashesPillCenterY}
                  width={page6LookupPillWidth}
                  height={page6LookupPillHeight}
                  label="ShaderHashes[idx]"
                  stroke={page8HashPillStroke}
                  fill={page8HashPillFill}
                  textFill={page8HashPillStroke}
                  fontSize={20.8}
                  fontWeight={740}
                  opacity={page7LookupContentOpacity}
                />
              </g>
              <StrokeArrow
                testId="page6-entries-to-cooked-arrow"
                d={horizontalPath(
                  page6EntriesToCookedStartX,
                  page6EntriesToCookedEndX,
                  page6EntriesPillCenterY,
                )}
                stroke={wireStroke}
                opacity={page7LookupContentOpacity}
                tipX={page6EntriesToCookedEndX}
                tipY={page6EntriesPillCenterY}
                direction="right"
                shaftWidth={2.8}
                underlayWidth={5.2}
                underlayOpacity={0.08}
                headSize={8}
              />
            </>
          ) : null}

          {page7LookupContentOpacity > 0.001 ? (
            <g data-testid="page6-inline-code-box" opacity={0}>
              <rect
                x={page6InlineCodeBox.x}
                y={page6InlineCodeBox.y}
                width={page6InlineCodeBox.width}
                height={page6InlineCodeBox.height}
                rx={page6InlineCodeBox.radius}
                fill="none"
                stroke="none"
              />
            </g>
          ) : null}
        </>
      ) : null}

      {shaderMapBridgeArrow}
    </>
  );
}
