import {clamp01, easeInOutCubic, horizontalPath, verticalPath} from "../geometry/geometry";
import type {SceneModel} from "../model/scene-model-types";
import {
  PAGE6_PLATFORM_TABLE_BOX,
  PAGE6_RESOURCE_TABLE_BOX,
  PAGE6_SHADER_TABLE_BOX,
} from "./page-layout-constants";
import {
  DiagramInfoTable,
  StackedLabel,
  StageBox,
  StrokeArrow,
} from "../primitives/diagramPrimitives";

export function Page06Scene({scene}: {scene: SceneModel}) {
  const {
    assetFill,
    assetStroke,
    focusFill,
    neutralFill,
    nodeStroke,
    page6BoardOpacity,
    page6BoardScale,
    page6CookedArrowEndX,
    page6CookedBox,
    page6CookedBridgeOpacity,
    page6CookedCenterX,
    page6CookedCenterY,
    page6CrossCenterX,
    page6CrossCenterY,
    page6CrossHalf,
    page6DashedOpacity,
    page6FrameRetainedOpacity,
    page6LeftCardLabelSize,
    page6LeftDashedLineCurrentEndX,
    page6LeftDashedLineStartX,
    page6MaterialArrowEndY,
    page6MaterialArrowMidY,
    page6MaterialArrowStartY,
    page6MaterialBox,
    page6MaterialCenterX,
    page6MaterialCenterY,
    page6NodeScale,
    page6OwnershipLaneX,
    page6PlatformTableCenterX,
    page6PlatformTableCenterY,
    page6ResourceArrowEndY,
    page6ResourceArrowStartY,
    page6ResourceBottomBox,
    page6ResourceBox,
    page6ResourceCenterX,
    page6ResourceCenterY,
    page6ResourceTableCenterX,
    page6ResourceTableCenterY,
    page6ResourceTopBox,
    page6ShaderArrowMidX,
    page6ShaderArrowStartX,
    page6ShaderMapBox,
    page6ShaderMapCenterX,
    page6ShaderMapCenterY,
    page6ShaderTableCenterX,
    page6ShaderTableCenterY,
    page6ShaderTableCurrentEndY,
    page6ShaderTableLinkStartY,
    page6ShaderTopBox,
    page6ShaderBottomBox,
    page6SpineOpacity,
    settledPage89Progress,
    page8ActiveUassetFrame,
    wireStroke,
  } = scene;
  const page9LeftColumnEase = easeInOutCubic(
    clamp01((settledPage89Progress - 0.02) / 0.32),
  );
  const page9LeftColumnScale = 1 - 0.18 * page9LeftColumnEase;
  const page9LeftColumnShiftX = -24 * page9LeftColumnEase;
  const leftLaneTransform = `translate(${page6OwnershipLaneX + page9LeftColumnShiftX} ${page6ResourceCenterY}) scale(${page9LeftColumnScale}) translate(${-page6OwnershipLaneX} ${-page6ResourceCenterY})`;
  const page6DisplayUassetFrame = {
    ...page8ActiveUassetFrame,
    y: page8ActiveUassetFrame.y - 12 * page9LeftColumnEase,
    height: page8ActiveUassetFrame.height + 12 * page9LeftColumnEase,
  };

  return (
    <>
      {page6SpineOpacity > 0.001 ? (
        <g transform={leftLaneTransform}>
          <g
            opacity={page6SpineOpacity}
            transform={`translate(${page6MaterialCenterX} ${page6MaterialCenterY}) scale(${page6NodeScale}) translate(${-page6MaterialCenterX} ${-page6MaterialCenterY})`}
          >
            <StageBox
              box={page6MaterialBox}
              fill={assetFill}
              stroke={assetStroke}
              strokeWidth={2.8}
              tone="asset"
              label="Material"
              labelSize={page6LeftCardLabelSize}
              labelWeight={720}
            />
          </g>
        </g>
      ) : null}

      {page6FrameRetainedOpacity > 0.001 ? (
        <g opacity={page6FrameRetainedOpacity}>
          <rect
            data-testid="page6-uasset-frame"
            x={page6DisplayUassetFrame.x}
            y={page6DisplayUassetFrame.y}
            width={page6DisplayUassetFrame.width}
            height={page6DisplayUassetFrame.height}
            rx={page6DisplayUassetFrame.radius}
            fill="none"
            stroke="rgba(76, 90, 102, 0.14)"
            strokeWidth="2"
          />
          <text
            x={page6DisplayUassetFrame.x + 22}
            y={page6DisplayUassetFrame.y + 26}
            fill="rgba(76, 90, 102, 0.68)"
            fontSize="17"
            fontWeight="680"
          >
            uasset
          </text>
        </g>
      ) : null}

      {page6DashedOpacity > 0.001 ? (
        <g opacity={page6DashedOpacity}>
          <StrokeArrow
            testId="page6-platform-resource-spine"
            d={horizontalPath(
              page6LeftDashedLineStartX,
              page6LeftDashedLineCurrentEndX,
              page6MaterialArrowMidY,
            )}
            stroke="#22303d"
            opacity={page6DashedOpacity}
            tipX={page6LeftDashedLineCurrentEndX}
            tipY={page6MaterialArrowMidY}
            direction="left"
            shaftWidth={2}
            underlayWidth={3.8}
            underlayOpacity={0.08}
            headSize={8}
            dashArray="10 8"
          />
          <g data-testid="page6-platform-resource-cross">
            <path
              d={`M ${page6CrossCenterX - page6CrossHalf} ${page6CrossCenterY - page6CrossHalf} L ${page6CrossCenterX + page6CrossHalf} ${page6CrossCenterY + page6CrossHalf}`}
              fill="none"
              stroke="#22303d"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d={`M ${page6CrossCenterX + page6CrossHalf} ${page6CrossCenterY - page6CrossHalf} L ${page6CrossCenterX - page6CrossHalf} ${page6CrossCenterY + page6CrossHalf}`}
              fill="none"
              stroke="#22303d"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        </g>
      ) : null}

      {page6SpineOpacity > 0.001 ? (
        <g transform={leftLaneTransform}>
          <StrokeArrow
            testId="page6-material-to-resource-arrow"
            d={verticalPath(
              page6OwnershipLaneX,
              page6MaterialArrowStartY,
              page6MaterialArrowEndY,
            )}
            stroke={assetStroke}
            opacity={page6SpineOpacity}
            tipX={page6OwnershipLaneX}
            tipY={page6MaterialArrowEndY}
            direction="down"
            shaftWidth={3}
            underlayWidth={5.8}
            underlayOpacity={0.1}
            headSize={9}
          />
        </g>
      ) : null}

      {page6BoardOpacity > 0.01 ? (
        <g
          opacity={page6BoardOpacity}
          transform={`translate(${page6PlatformTableCenterX} ${page6PlatformTableCenterY}) scale(${page6BoardScale}) translate(${-page6PlatformTableCenterX} ${-page6PlatformTableCenterY})`}
        >
          <DiagramInfoTable
            testId="page6-platform-table"
            box={PAGE6_PLATFORM_TABLE_BOX}
            stroke="rgba(104, 140, 114, 0.28)"
            operatorFill="rgba(104, 140, 114, 0.6)"
            fill="rgba(255, 255, 255, 0.94)"
            opacity={1}
            headerFontSize={20}
            noteFontSize={20.8}
            dividerOffsetY={-14}
            segments={[
              {
                width: PAGE6_PLATFORM_TABLE_BOX.width,
                label: "ShaderPlatform",
                note: ["OpenGL ES", "Vulkan", "Metal"],
              },
            ]}
          />
        </g>
      ) : null}

      {page6BoardOpacity > 0.01 ? (
        <g
          opacity={page6BoardOpacity}
          transform={`translate(${page6ResourceTableCenterX} ${page6ResourceTableCenterY}) scale(${page6BoardScale}) translate(${-page6ResourceTableCenterX} ${-page6ResourceTableCenterY})`}
        >
          <g data-testid="page6-resource-shadow-1" opacity={0.24}>
            <StageBox
              box={page6ResourceTopBox}
              fill="rgba(239, 243, 246, 0.96)"
              stroke="rgba(76, 90, 102, 0.18)"
              strokeWidth={2}
            />
          </g>
          <g data-testid="page6-resource-shadow-2" opacity={0.36}>
            <StageBox
              box={page6ResourceBottomBox}
              fill="rgba(244, 247, 249, 0.98)"
              stroke="rgba(76, 90, 102, 0.18)"
              strokeWidth={2.2}
            />
          </g>
        </g>
      ) : null}

      <g transform={leftLaneTransform}>
        <g
          data-testid="page6-resource-card"
          opacity={page6SpineOpacity}
          transform={`translate(${page6ResourceCenterX} ${page6ResourceCenterY}) scale(${page6NodeScale}) translate(${-page6ResourceCenterX} ${-page6ResourceCenterY})`}
        >
          <StageBox
            box={page6ResourceBox}
            fill={neutralFill}
            stroke={nodeStroke}
            strokeWidth={2.8}
          />
          <text
            x={page6ResourceCenterX}
            y={page6ResourceCenterY + 3}
            fill="#22303d"
            fontSize={page6LeftCardLabelSize}
            fontWeight="720"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            FMaterialResource
          </text>
        </g>
      </g>

      {page6BoardOpacity > 0.01 ? (
        <g
          opacity={page6BoardOpacity}
          transform={`translate(${page6ResourceTableCenterX} ${page6ResourceTableCenterY}) scale(${page6BoardScale}) translate(${-page6ResourceTableCenterX} ${-page6ResourceTableCenterY})`}
        >
          <DiagramInfoTable
            testId="page6-resource-selector-table"
            box={PAGE6_RESOURCE_TABLE_BOX}
            stroke="rgba(104, 140, 114, 0.28)"
            operatorFill="rgba(104, 140, 114, 0.6)"
            fill="rgba(255, 255, 255, 0.92)"
            opacity={1}
            headerFontSize={19.6}
            noteFontSize={20.4}
            dividerOffsetY={-10}
            contentAlign="center"
            segments={[
              {
                width: 168,
                label: "FeatureLevel",
                note: ["ES3_1", "SM5"],
              },
              {
                width: 168,
                label: "QualityLevel",
                note: ["Low", "High"],
              },
            ]}
          />
        </g>
      ) : null}

      {page6SpineOpacity > 0.001 ? (
        <g transform={leftLaneTransform}>
          <StrokeArrow
            testId="page6-resource-to-shadermap-arrow"
            d={verticalPath(
              page6OwnershipLaneX,
              page6ResourceArrowStartY,
              page6ResourceArrowEndY,
            )}
            stroke={wireStroke}
            opacity={page6SpineOpacity}
            tipX={page6OwnershipLaneX}
            tipY={page6ResourceArrowEndY}
            direction="down"
            shaftWidth={3}
            underlayWidth={5.6}
            underlayOpacity={0.1}
            headSize={9}
          />
        </g>
      ) : null}

      {page6BoardOpacity > 0.01 ? (
        <g
          opacity={page6BoardOpacity}
          transform={`translate(${page6ShaderTableCenterX} ${page6ShaderTableCenterY}) scale(${page6BoardScale}) translate(${-page6ShaderTableCenterX} ${-page6ShaderTableCenterY})`}
        >
          <g data-testid="page6-shadermap-shadow-1" opacity={0.24}>
            <StageBox
              box={page6ShaderTopBox}
              fill="rgba(239, 243, 246, 0.96)"
              stroke="rgba(76, 90, 102, 0.18)"
              strokeWidth={2}
            />
          </g>
          <g data-testid="page6-shadermap-shadow-2" opacity={0.36}>
            <StageBox
              box={page6ShaderBottomBox}
              fill="rgba(244, 247, 249, 0.98)"
              stroke="rgba(76, 90, 102, 0.18)"
              strokeWidth={2.2}
            />
          </g>
        </g>
      ) : null}

      <g transform={leftLaneTransform}>
        <g
          data-testid="page6-shadermap-card"
          opacity={page6SpineOpacity}
          transform={`translate(${page6ShaderMapCenterX} ${page6ShaderMapCenterY}) scale(${page6NodeScale}) translate(${-page6ShaderMapCenterX} ${-page6ShaderMapCenterY})`}
        >
          <StageBox
            box={page6ShaderMapBox}
            fill={neutralFill}
            stroke={nodeStroke}
            strokeWidth={2.8}
          />
          <text
            x={page6ShaderMapCenterX}
            y={page6ShaderMapCenterY + 2}
            fill="#22303d"
            fontSize={page6LeftCardLabelSize}
            fontWeight="720"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            FMaterialShaderMap
          </text>
        </g>
      </g>

      {page6SpineOpacity > 0.001 ? (
        <g data-testid="page6-cooked-code-box" opacity={page6SpineOpacity}>
          <StageBox
            box={page6CookedBox}
            fill={focusFill}
            stroke={nodeStroke}
            strokeWidth={2.6}
          />
          <StackedLabel
            x={page6CookedCenterX}
            y={page6CookedCenterY}
            lines={["Cooked", "ShaderCode"]}
            fontSize={23.5}
            fontWeight={760}
            lineGap={24}
          />
        </g>
      ) : null}

      {page6BoardOpacity > 0.01 ? (
        <g
          opacity={page6BoardOpacity}
          transform={`translate(${page6ShaderTableCenterX} ${page6ShaderTableCenterY}) scale(${page6BoardScale}) translate(${-page6ShaderTableCenterX} ${-page6ShaderTableCenterY})`}
        >
          <DiagramInfoTable
            testId="page6-shadermap-selector-table"
            box={PAGE6_SHADER_TABLE_BOX}
            stroke="rgba(76, 90, 102, 0.22)"
            operatorFill="rgba(76, 90, 102, 0.5)"
            fill="rgba(255, 255, 255, 0.92)"
            opacity={1}
            headerFontSize={19.6}
            noteFontSize={20.4}
            dividerOffsetY={-10}
            contentAlign="center"
            segments={[
              {
                width: 132,
                label: "ShaderType",
                note: ["BasePassPS", "DepthVS"],
              },
              {
                width: 168,
                label: "VertexFactory",
                note: ["LocalVF", "SkinVF"],
              },
              {
                width: 132,
                label: "Permutation",
                note: ["Fog=On", "Lightmap=Off"],
              },
            ]}
          />
        </g>
      ) : null}

      {page6DashedOpacity > 0.001 ? (
        <StrokeArrow
          testId="page6-shader-selector-attachment-link"
          d={verticalPath(
            page6ShaderArrowMidX,
            page6ShaderTableLinkStartY,
            page6ShaderTableCurrentEndY,
          )}
          stroke={wireStroke}
          opacity={page6DashedOpacity}
          tipX={page6ShaderArrowMidX}
          tipY={page6ShaderTableCurrentEndY}
          direction="up"
          shaftWidth={2.2}
          underlayWidth={4}
          underlayOpacity={0.08}
          headSize={8}
          dashArray="10 8"
        />
      ) : null}

      {page6CookedBridgeOpacity > 0.001 ? (
        <StrokeArrow
          testId="page6-shadermap-to-cooked-arrow"
          d={horizontalPath(
            page6ShaderArrowStartX,
            page6CookedArrowEndX,
            page6ShaderMapCenterY,
          )}
          stroke={wireStroke}
          opacity={page6CookedBridgeOpacity}
          tipX={page6CookedArrowEndX}
          tipY={page6ShaderMapCenterY}
          direction="right"
          shaftWidth={3}
          underlayWidth={5.6}
          underlayOpacity={0.1}
          headSize={9}
        />
      ) : null}
    </>
  );
}
