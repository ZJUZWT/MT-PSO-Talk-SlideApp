import type {VariantId} from "../../storyboard-data/pso-workbench-types";
import type {Box} from "../primitives/diagramTypes";
import {
  boxBottom,
  boxCenterX,
  boxCenterY,
  boxRight,
  clamp01,
  easeInOutCubic,
  easeInOutQuint,
  easeOutQuint,
  hexToRgbaColor,
  mix,
  mixBox,
  mixRgba,
  polylinePath,
  resolveLinearSegmentProgress,
  resolveSegmentProgress,
  resolveWindowProgress,
  scalePointAround,
  horizontalPath,
  verticalPath,
} from "../geometry/geometry";
import {
  PAGE2_LEFT_BOX,
  PAGE2_CENTER_BOX,
  PAGE2_RIGHT_BOX,
  PAGE3_LEFT_BOX,
  PAGE3_CENTER_BOX,
  PAGE3_RIGHT_BOX,
  PAGE3_SHADER_CODE_BOX,
  PAGE3_SHADER_BINARY_BOX,
  PAGE3_PROGRAM_BOX,
  PAGE3_DEPTH_BOX,
  PAGE3_BLEND_BOX,
  PAGE4_DESCRIPTION_BOX,
  PAGE4_PSO_BOX,
  PAGE5_MESH_BOX,
  PAGE5_MATERIAL_BOX,
  PAGE5_COOKED_BOX,
  PAGE5_BINARY_BOX,
  PAGE6_MATERIAL_BOX,
  PAGE6_UASSET_FRAME,
  PAGE6_PLATFORM_TABLE_BOX,
  PAGE6_RESOURCE_BOX,
  PAGE6_RESOURCE_TOP_BOX,
  PAGE6_RESOURCE_BOTTOM_BOX,
  PAGE6_RESOURCE_TABLE_BOX,
  PAGE6_SHADERMAP_BOX,
  PAGE6_SHADER_TOP_BOX,
  PAGE6_SHADER_BOTTOM_BOX,
  PAGE6_SHADER_TABLE_BOX,
  PAGE6_COOKED_BOX,
  PAGE7_MATERIAL_BOX,
  PAGE7_RESOURCE_BOX,
  PAGE7_RESOURCE_TOP_BOX,
  PAGE7_RESOURCE_BOTTOM_BOX,
  PAGE7_SHADERMAP_BOX,
  PAGE7_SHADER_TOP_BOX,
  PAGE7_SHADER_BOTTOM_BOX,
  PAGE7_FSHADER_BOX,
  PAGE7_RESOURCE_INDEX_BOX,
  PAGE7_RESOURCE_CODE_BOX,
  PAGE7_INLINE_RESOURCE_BOX,
  PAGE7_INLINE_CODE_BOX,
  PAGE7_COOKED_BOX,
  PAGE7_INLINE_ARCHIVE_BOX,
  PAGE7_CACHE_BOX,
  PAGE8_UASSET_FRAME,
  PAGE8_MATERIAL_BOX,
  PAGE8_RESOURCE_BOX,
  PAGE8_SHADERMAP_BOX,
  PAGE8_FSHADER_BOX,
  PAGE8_INLINE_RESOURCE_BOX,
  PAGE8_RESOURCE_CODE_BOX,
  PAGE8_COOKED_BOX,
  PAGE8_PSO_BOX,
  PAGE8_LIBRARY_BOX,
  PAGE8_SHARED_RESOURCE_BOX,
  PAGE8_SHADERMAP_INDEX_BOX,
  PAGE8_MATERIAL_A_BOX,
  PAGE8_MATERIAL_B_BOX,
  PAGE8_MATERIAL_C_BOX,
  PAGE9_UASSET_FRAME,
  PAGE9_LIBRARY_BOX,
  PAGE9_MATERIAL_A_BOX,
  PAGE9_MATERIAL_B_BOX,
  PAGE9_MATERIAL_C_BOX,
  PAGE9_SHADERMAP_ENTRIES_BOX,
  PAGE9_HASHES_BOX,
  PAGE9_CODE_BOX,
  PAGE_01_FRAME,
  PAGE_02_FRAME,
  PAGE_03_FRAME,
  PAGE_04_FRAME,
  PAGE_05_FRAME,
  PAGE_06_FRAME,
  PAGE_07_FRAME,
  PAGE_08_FRAME,
  PAGE_09_FRAME,
  VIEWBOX,
} from "../pages/page-layout-constants";

const VARIANT_THEME: Record<VariantId, {accent: string; accentSoft: string}> = {
  "bus-clean": {
    accent: "#c66f4c",
    accentSoft: "rgba(198, 111, 76, 0.12)",
  },
  "bus-wide": {
    accent: "#a56d4f",
    accentSoft: "rgba(165, 109, 79, 0.12)",
  },
  "shared-focus": {
    accent: "#b85f3c",
    accentSoft: "rgba(184, 95, 60, 0.12)",
  },
};

const PIXEL_GRID_SIZE = 60;

export function computeSceneModel(frame: number, variantId: VariantId = "bus-clean") {
  const PAGE5_SPINE_SHIFT = 100;
  const page12Progress = resolveSegmentProgress(frame, PAGE_01_FRAME, PAGE_02_FRAME);
  const page23Progress = resolveSegmentProgress(frame, PAGE_02_FRAME, PAGE_03_FRAME);
  const page34Progress = resolveSegmentProgress(frame, PAGE_03_FRAME, PAGE_04_FRAME);
  const page45Progress = resolveSegmentProgress(frame, PAGE_04_FRAME, PAGE_05_FRAME);
  const page56Progress = resolveSegmentProgress(frame, PAGE_05_FRAME, PAGE_06_FRAME);
  const page67Progress = resolveSegmentProgress(frame, PAGE_06_FRAME, PAGE_07_FRAME);
  const page78Progress = resolveSegmentProgress(frame, PAGE_07_FRAME, PAGE_08_FRAME);
  const page89Progress = resolveSegmentProgress(frame, PAGE_08_FRAME, PAGE_09_FRAME);
  const page56LinearProgress = resolveLinearSegmentProgress(
    frame,
    PAGE_05_FRAME,
    PAGE_06_FRAME,
  );
  const page67LinearProgress = resolveLinearSegmentProgress(
    frame,
    PAGE_06_FRAME,
    PAGE_07_FRAME,
  );
  const settledPage12Progress = frame >= PAGE_02_FRAME ? 1 : page12Progress;
  const settledPage23Progress = frame <= PAGE_02_FRAME ? 0 : page23Progress;
  const settledPage34Progress = frame <= PAGE_03_FRAME ? 0 : page34Progress;
  const settledPage45Progress = frame <= PAGE_04_FRAME ? 0 : page45Progress;
  const settledPage56Progress = frame <= PAGE_05_FRAME ? 0 : frame >= PAGE_06_FRAME ? 1 : page56Progress;
  const settledPage67Progress = frame <= PAGE_06_FRAME ? 0 : frame >= PAGE_07_FRAME ? 1 : page67Progress;
  const settledPage78Progress = frame <= PAGE_07_FRAME ? 0 : frame >= PAGE_08_FRAME ? 1 : page78Progress;
  const settledPage89Progress = frame <= PAGE_08_FRAME ? 0 : frame >= PAGE_09_FRAME ? 1 : page89Progress;
  const theme = VARIANT_THEME[variantId];

  const neutralFill = "rgba(255, 251, 246, 0.98)";
  const focusFill = "rgba(248, 236, 226, 0.98)";
  const assetFill = "rgba(231, 242, 233, 0.98)";
  const assetStroke = "rgba(104, 140, 114, 0.86)";
  const nodeStroke = "rgba(34, 48, 61, 0.78)";
  const wireStroke = "rgba(76, 90, 102, 0.72)";
  const apiStroke = "#d06b44";
  const issueStroke = "#ff0000";
  const neutralFillColor = {r: 255, g: 251, b: 246, a: 0.98};
  const focusFillColor = {r: 248, g: 236, b: 226, a: 0.98};
  const assetFillColor = {r: 231, g: 242, b: 233, a: 0.98};
  const wireStrokeColor = {r: 76, g: 90, b: 102, a: 0.72};
  const apiStrokeColor = {r: 208, g: 107, b: 68, a: 1};
  const issueStrokeColor = hexToRgbaColor(issueStroke, 1);
  const nodeStrokeColor = {r: 34, g: 48, b: 61, a: 0.78};
  const assetStrokeColor = {r: 104, g: 140, b: 114, a: 0.86};
  const accentStrokeColor = hexToRgbaColor(theme.accent, 1);

  const page34SpineShift = mix(0, 28, settledPage34Progress);
  const page45SpineShift = mix(0, PAGE5_SPINE_SHIFT, settledPage45Progress);
  const mixedLeftBox = mixBox(PAGE2_LEFT_BOX, PAGE3_LEFT_BOX, settledPage23Progress);
  const mixedCenterBox = mixBox(PAGE2_CENTER_BOX, PAGE3_CENTER_BOX, settledPage23Progress);
  const mixedRightBox = mixBox(PAGE2_RIGHT_BOX, PAGE3_RIGHT_BOX, settledPage23Progress);
  const leftBox = {
    ...mixedLeftBox,
    x: mixedLeftBox.x + page45SpineShift,
    y: mixedLeftBox.y + page34SpineShift,
  };
  const centerBox = {
    ...mixedCenterBox,
    x: mixedCenterBox.x + page45SpineShift,
    y: mixedCenterBox.y + page34SpineShift,
  };
  const rightBox = {
    ...mixedRightBox,
    x: mixedRightBox.x + page45SpineShift,
    y: mixedRightBox.y + page34SpineShift,
  };

  const leftCenterX = boxCenterX(leftBox);
  const centerCenterX = boxCenterX(centerBox);
  const rightCenterX = boxCenterX(rightBox);
  const axisY = boxCenterY(leftBox);
  const centerTextY = boxCenterY(centerBox) + 4;
  const arrowStartGap = mix(24, 20, settledPage23Progress);
  const arrowEndGap = mix(24, 20, settledPage23Progress);

  const page12LabelFadeProgress = clamp01(settledPage12Progress / 0.58);
  const page12CenterLabelFadeProgress = clamp01(settledPage12Progress / 0.42);
  const page12ShapeRevealProgress = clamp01((settledPage12Progress - 0.16) / 0.42);
  const page12LabelRevealProgress = clamp01((settledPage12Progress - 0.3) / 0.42);
  const oldLabelOpacity = 1 - page12LabelFadeProgress;
  const oldCenterLabelOpacity = 1 - page12CenterLabelFadeProgress;
  const newShapeOpacity = page12ShapeRevealProgress;
  const newLabelOpacity = page12LabelRevealProgress;
  const oldLabelScale = mix(1, 0.9, page12LabelFadeProgress);
  const newShapeScale = mix(0.68, 1, easeInOutCubic(newShapeOpacity));
  const newLabelScale = mix(0.78, 1, easeInOutCubic(newLabelOpacity));

  const upperNodeOpacity = clamp01((settledPage23Progress - 0.28) / 0.38);
  const upperLineOpacity = clamp01((settledPage23Progress - 0.42) / 0.34);
  const upperNodeScale = mix(0.86, 1, easeInOutCubic(upperNodeOpacity));
  const upperLineProgress = clamp01((settledPage23Progress - 0.42) / 0.34);
  const upperLift = mix(-34, 0, easeInOutCubic(upperNodeOpacity));
  const page34UpperShift = mix(0, -24, settledPage34Progress);
  const upperBandGap = 18;
  const shaderCompileGap = 60;
  const gpuQuarterStep = centerBox.width / 4;
  const page3StateShiftX = 24;
  const binaryTargetX =
    centerBox.x + gpuQuarterStep - PAGE3_SHADER_BINARY_BOX.width / 2;
  const depthTargetX =
    binaryTargetX + PAGE3_SHADER_BINARY_BOX.width + upperBandGap + page3StateShiftX;
  const blendTargetX = depthTargetX + PAGE3_DEPTH_BOX.width + upperBandGap;
  const shaderCodeTargetX = leftCenterX - PAGE3_SHADER_CODE_BOX.width / 2;
  const upperLineNodeGap = 12;

  const shaderCodeBox = {
    ...PAGE3_SHADER_CODE_BOX,
    x: shaderCodeTargetX,
    y: PAGE3_SHADER_CODE_BOX.y + upperLift + page34UpperShift,
  };
  const shaderBinaryBox = {
    ...PAGE3_SHADER_BINARY_BOX,
    x: binaryTargetX,
    y: PAGE3_SHADER_BINARY_BOX.y + upperLift + page34UpperShift,
  };
  const depthBox = {
    ...PAGE3_DEPTH_BOX,
    x: depthTargetX,
    y: PAGE3_DEPTH_BOX.y + upperLift + page34UpperShift,
  };
  const blendBox = {
    ...PAGE3_BLEND_BOX,
    x: blendTargetX,
    y: PAGE3_BLEND_BOX.y + upperLift + page34UpperShift,
  };

  const gpuTopY = centerBox.y;
  const shaderCodeCenterX = boxCenterX(shaderCodeBox);
  const shaderBinaryCenterX = boxCenterX(shaderBinaryBox);
  const depthCenterX = boxCenterX(depthBox);
  const blendCenterX = boxCenterX(blendBox);
  const pixelGridX = rightCenterX - PIXEL_GRID_SIZE / 2;
  const pixelGridY = axisY - PIXEL_GRID_SIZE / 2;
  const shaderLineY = boxCenterY(shaderCodeBox);
  const shaderLineStartX = shaderCodeBox.x + shaderCodeBox.width + 12;
  const shaderLineEndX = shaderBinaryBox.x - 12;
  const shaderArrowTipX = mix(shaderLineStartX, shaderLineEndX, upperLineProgress);
  const binaryLineStartY = boxBottom(shaderBinaryBox) + upperLineNodeGap;
  const depthLineStartY = boxBottom(depthBox) + upperLineNodeGap;
  const blendLineStartY = boxBottom(blendBox) + upperLineNodeGap;
  const gpuArrowGap = 14;
  const apiArrowTipY = gpuTopY - gpuArrowGap;
  const binaryLineEndY = mix(binaryLineStartY, apiArrowTipY, upperLineProgress);
  const depthLineEndY = mix(depthLineStartY, apiArrowTipY, upperLineProgress);
  const blendLineEndY = mix(blendLineStartY, apiArrowTipY, upperLineProgress);
  const legacyRetractProgress = easeInOutCubic(
    clamp01((settledPage34Progress - 0.04) / 0.66),
  );
  const page4RelationOpacity = clamp01((settledPage34Progress - 0.18) / 0.24);
  const shaderArtifactLabelProgress = easeInOutCubic(
    clamp01((settledPage34Progress - 0.08) / 0.3),
  );
  const legacyUpperCallOpacity =
    upperLineOpacity * clamp01(1 - settledPage34Progress / 0.92);
  const descriptionOpacity = clamp01((settledPage34Progress - 0.12) / 0.26);
  const descriptionScale = mix(0.92, 1, easeInOutCubic(descriptionOpacity));
  const psoOpacity = clamp01((settledPage34Progress - 0.36) / 0.24);
  const psoScale = mix(0.9, 1, easeInOutCubic(psoOpacity));
  const createOpacity = clamp01((settledPage34Progress - 0.3) / 0.22);
  const psoBindOpacity = clamp01((settledPage34Progress - 0.5) / 0.18);
  const page4StateNodeOpacity = upperNodeOpacity * clamp01(1 - settledPage45Progress / 0.72);
  const page4UpperLineOpacity =
    upperLineOpacity * clamp01(1 - settledPage45Progress / 0.72);
  const page4MiddleFade = clamp01(1 - settledPage45Progress / 0.52);
  const page4DescriptionOpacity = descriptionOpacity * page4MiddleFade;
  const page4PsoOpacity = psoOpacity * page4MiddleFade;
  const page4CreateOpacity = createOpacity * page4MiddleFade;
  const page4PsoBindOpacity = psoBindOpacity * page4MiddleFade;
  const page5CookMoveProgress = easeInOutCubic(
    clamp01((settledPage45Progress - 0.12) / 0.5),
  );
  const upperBandBottomY = Math.max(
    boxBottom(shaderBinaryBox),
    boxBottom(depthBox),
    boxBottom(blendBox),
  );
  const page3ProgramOpacity =
    upperNodeOpacity * clamp01(1 - settledPage34Progress / 0.34);
  const page3ProgramLineOpacity =
    upperLineOpacity * clamp01(1 - settledPage34Progress / 0.3);
  const page3ProgramScale = mix(0.9, 1, easeInOutCubic(page3ProgramOpacity));
  const page3ProgramBox = {
    ...PAGE3_PROGRAM_BOX,
    x: shaderBinaryCenterX - PAGE3_PROGRAM_BOX.width / 2,
    y: upperBandBottomY + (gpuTopY - upperBandBottomY - PAGE3_PROGRAM_BOX.height) / 2,
  };
  const page3WorkflowFrameOpacity =
    upperNodeOpacity * clamp01(1 - settledPage34Progress / 0.28);
  const page3WorkflowFrameBox = {
    x: shaderCodeBox.x - 22,
    y: shaderCodeBox.y - 18,
    width:
      Math.max(page3ProgramBox.x + page3ProgramBox.width, shaderBinaryBox.x + shaderBinaryBox.width) -
      (shaderCodeBox.x - 22) +
      22,
    height: boxBottom(page3ProgramBox) - (shaderCodeBox.y - 18) + 18,
  };
  const page3WorkflowFrameBadgeX = page3WorkflowFrameBox.x + 18;
  const page3WorkflowFrameBadgeY =
    page3WorkflowFrameBox.y + page3WorkflowFrameBox.height - 18;
  const page3ProgramCenterX = boxCenterX(page3ProgramBox);
  const page3ProgramCenterY = boxCenterY(page3ProgramBox);
  const page3ProgramTipY = page3ProgramBox.y - 10;
  const page3UseProgramStartY = boxBottom(page3ProgramBox) + 10;
  const page3LinkStartY = boxBottom(shaderBinaryBox) + upperLineNodeGap;
  const page3LinkLeftX = shaderBinaryBox.x + shaderBinaryBox.width * 0.3;
  const page3LinkRightX = shaderBinaryBox.x + shaderBinaryBox.width * 0.7;
  const page3LinkEndY = page3ProgramTipY;
  const page34VerticalMorphProgress = easeInOutCubic(
    clamp01(settledPage34Progress / 0.34),
  );
  const layerGap =
    (gpuTopY - upperBandBottomY - PAGE4_DESCRIPTION_BOX.height - PAGE4_PSO_BOX.height) / 3;
  const descriptionBox = {
    ...PAGE4_DESCRIPTION_BOX,
    x: PAGE4_DESCRIPTION_BOX.x + page45SpineShift,
    y: upperBandBottomY + layerGap,
  };
  const descriptionCenterX = boxCenterX(descriptionBox);
  const descriptionCenterY = boxCenterY(descriptionBox);
  const descriptionTipY = descriptionBox.y - 14;
  const psoBox = {
    ...PAGE4_PSO_BOX,
    x: PAGE4_PSO_BOX.x + page45SpineShift,
    y: descriptionBox.y + descriptionBox.height + layerGap,
  };
  const psoCenterX = boxCenterX(psoBox);
  const psoCenterY = boxCenterY(psoBox);
  const psoTipY = psoBox.y - 14;
  const page4WorkflowFrameOpacity =
    Math.max(page4DescriptionOpacity, page4PsoOpacity) * clamp01(1 - settledPage45Progress / 0.4);
  const descriptionToPsoStartY = boxBottom(descriptionBox) + 10;
  const psoBindStartY = boxBottom(psoBox) + 10;
  const psoBindEndY = gpuTopY - 12;
  const verticalMorphEndY = mix(apiArrowTipY, descriptionTipY, legacyRetractProgress);
  const verticalMorphStroke = mixRgba(
    apiStrokeColor,
    wireStrokeColor,
    easeInOutCubic(clamp01((settledPage34Progress - 0.24) / 0.5)),
  );
  const verticalBadgeOpacity =
    page4UpperLineOpacity * clamp01(1 - settledPage34Progress / 0.58);
  const page5AssetOpacity = clamp01((settledPage45Progress - 0.14) / 0.28);
  const page5AssetScale = mix(0.9, 1, easeInOutCubic(page5AssetOpacity));
  const page5ArrowOpacity = clamp01((settledPage45Progress - 0.24) / 0.24);
  const page5LabelMorphProgress = easeInOutCubic(
    clamp01((settledPage45Progress - 0.08) / 0.72),
  );
  const page5VertexRetainProgress = easeInOutCubic(
    clamp01(settledPage45Progress / 0.76),
  );
  const page5VertexIconOpacity = mix(newShapeOpacity, 1, page5VertexRetainProgress);
  const page5VertexIconScale = mix(newShapeScale, 1, page5VertexRetainProgress);
  const page5VertexIconY = axisY;
  const page5MeshBox = {
    ...PAGE5_MESH_BOX,
    x:
      leftBox.x -
      (centerBox.x - (leftBox.x + leftBox.width)) -
      PAGE5_MESH_BOX.width,
    y: axisY - PAGE5_MESH_BOX.height / 2,
  };
  const page5MaterialTargetBox = {
    ...PAGE5_MATERIAL_BOX,
    x: page5MeshBox.x + page5MeshBox.width / 2 - PAGE5_MATERIAL_BOX.width / 2,
    y: boxCenterY(shaderCodeBox) - PAGE5_MATERIAL_BOX.height / 2,
  };
  const page5CookedTargetBox = {
    ...PAGE5_COOKED_BOX,
    x: shaderBinaryCenterX - PAGE5_COOKED_BOX.width / 2,
    y: boxCenterY(shaderBinaryBox) - PAGE5_COOKED_BOX.height / 2,
  };
  const page5MaterialBox = mixBox(
    shaderCodeBox,
    page5MaterialTargetBox,
    page5CookMoveProgress,
  );
  const page5CookedBox = mixBox(
    shaderBinaryBox,
    page5CookedTargetBox,
    page5CookMoveProgress,
  );
  const page5BinaryGap =
    (gpuTopY - boxBottom(page5CookedBox) - PAGE5_BINARY_BOX.height) / 2;
  const page5BinaryTargetBox = {
    ...PAGE5_BINARY_BOX,
    x: boxCenterX(page5CookedBox) - PAGE5_BINARY_BOX.width / 2,
    y: boxBottom(page5CookedBox) + page5BinaryGap,
  };
  const page5MeshCenterX = boxCenterX(page5MeshBox);
  const page5MeshCenterY = boxCenterY(page5MeshBox);
  const page5MeshToVertexStartX = page5MeshBox.x + page5MeshBox.width + arrowStartGap;
  const page5MeshToVertexEndX = leftBox.x - arrowEndGap;
  const page5CookedToGpuEndY = gpuTopY - 12;
  const page5BinaryOpacity = clamp01((settledPage45Progress - 0.26) / 0.22);
  const page5BinaryScale = mix(0.9, 1, easeInOutCubic(page5BinaryOpacity));
  const sharedUpperLeftBox = mixBox(shaderCodeBox, page5MaterialTargetBox, page5CookMoveProgress);
  const sharedUpperRightBox = mixBox(
    shaderBinaryBox,
    page5CookedTargetBox,
    page5CookMoveProgress,
  );
  const page4WorkflowFrameBox = {
    x: Math.min(
      sharedUpperLeftBox.x,
      sharedUpperRightBox.x,
      depthBox.x,
      blendBox.x,
      descriptionBox.x,
      psoBox.x,
    ) - 22,
    y: Math.min(
      sharedUpperLeftBox.y,
      sharedUpperRightBox.y,
      depthBox.y,
      blendBox.y,
      descriptionBox.y,
      psoBox.y,
    ) - 18,
    width:
      Math.max(
        sharedUpperLeftBox.x + sharedUpperLeftBox.width,
        sharedUpperRightBox.x + sharedUpperRightBox.width,
        depthBox.x + depthBox.width,
        blendBox.x + blendBox.width,
        descriptionBox.x + descriptionBox.width,
        psoBox.x + psoBox.width,
      ) -
      (Math.min(
        sharedUpperLeftBox.x,
        sharedUpperRightBox.x,
        depthBox.x,
        blendBox.x,
        descriptionBox.x,
        psoBox.x,
      ) - 22) +
      22,
    height:
      Math.max(
        boxBottom(sharedUpperLeftBox),
        boxBottom(sharedUpperRightBox),
        boxBottom(depthBox),
        boxBottom(blendBox),
        boxBottom(descriptionBox),
        boxBottom(psoBox),
      ) -
      (Math.min(
        sharedUpperLeftBox.y,
        sharedUpperRightBox.y,
        depthBox.y,
        blendBox.y,
        descriptionBox.y,
        psoBox.y,
      ) - 18) +
      18,
  };
  const page4WorkflowFrameBadgeX = page4WorkflowFrameBox.x + 18;
  const page4WorkflowFrameBadgeY =
    page4WorkflowFrameBox.y + page4WorkflowFrameBox.height - 18;
  const sharedUpperLeftCenterX = boxCenterX(sharedUpperLeftBox);
  const sharedUpperLeftCenterY = boxCenterY(sharedUpperLeftBox);
  const sharedUpperRightCenterX = boxCenterX(sharedUpperRightBox);
  const sharedUpperRightCenterY = boxCenterY(sharedUpperRightBox);
  const sharedUpperNodeOpacity = upperNodeOpacity;
  const sharedUpperLeftFill = mixRgba(
    neutralFillColor,
    assetFillColor,
    page5LabelMorphProgress,
  );
  const sharedUpperLeftStroke = mixRgba(
    nodeStrokeColor,
    assetStrokeColor,
    page5LabelMorphProgress,
  );
  const sharedUpperRightFill = mixRgba(
    neutralFillColor,
    focusFillColor,
    page5LabelMorphProgress,
  );
  const sharedUpperRightStroke = mixRgba(
    nodeStrokeColor,
    accentStrokeColor,
    page5LabelMorphProgress,
  );
  const sharedUpperHorizontalOpacity = clamp01(
    Math.max(page4RelationOpacity, page5ArrowOpacity),
  );
  const sharedUpperHorizontalStroke = mixRgba(
    wireStrokeColor,
    assetStrokeColor,
    page5LabelMorphProgress,
  );
  const sharedUpperHorizontalStartX = sharedUpperLeftBox.x + sharedUpperLeftBox.width + 12;
  const sharedUpperHorizontalEndX = sharedUpperRightBox.x - 12;
  const sharedUpperHorizontalY = mix(
    shaderLineY,
    sharedUpperLeftCenterY,
    page5CookMoveProgress,
  );
  const sharedUpperVerticalOpacity = clamp01(
    Math.max(page4UpperLineOpacity, page5ArrowOpacity),
  );
  const sharedUpperVerticalStroke =
    settledPage34Progress <= 0
      ? apiStroke
      : settledPage45Progress > 0
      ? mixRgba(wireStrokeColor, assetStrokeColor, page5LabelMorphProgress)
      : verticalMorphStroke;
  const sharedUpperVerticalPage34StartY = mix(
    page3UseProgramStartY,
    binaryLineStartY,
    page34VerticalMorphProgress,
  );
  const sharedUpperVerticalStartY = mix(
    sharedUpperVerticalPage34StartY,
    boxBottom(sharedUpperRightBox) + 10,
    page5CookMoveProgress,
  );
  const sharedUpperVerticalEndY = mix(
    verticalMorphEndY,
    page5BinaryTargetBox.y - 10,
    page5CookMoveProgress,
  );
  const page5BinaryCenterX = boxCenterX(page5BinaryTargetBox);
  const page5BinaryCenterY = boxCenterY(page5BinaryTargetBox);
  const page5CookedToBinaryStartY = boxBottom(sharedUpperRightBox) + 10;
  const page5BinaryToGpuStartY = boxBottom(page5BinaryTargetBox) + 10;
  const page5QuestionBaseOpacity = clamp01((settledPage45Progress - 0.5) / 0.18);
  const page5QuestionX = mix(
    sharedUpperHorizontalStartX,
    sharedUpperHorizontalEndX,
    0.54,
  );
  const page5QuestionY = sharedUpperHorizontalY - 24;

  const cameraViewportCenterX = VIEWBOX.width / 2;
  const cameraViewportCenterY = VIEWBOX.height / 2;
  const page56QuestionMoveProgress = easeInOutQuint(clamp01(settledPage56Progress / 0.76));
  const page56QuestionFadeProgress = clamp01((settledPage56Progress - 0.8) / 0.12);
  const page5QuestionOpacity =
    page5QuestionBaseOpacity * (1 - easeInOutCubic(page56QuestionFadeProgress));
  const page56QuestionCenterX = mix(
    page5QuestionX,
    cameraViewportCenterX,
    page56QuestionMoveProgress,
  );
  const page56QuestionCenterY = mix(
    page5QuestionY,
    cameraViewportCenterY,
    page56QuestionMoveProgress,
  );
  const page56QuestionScale = mix(
    1,
    1.24,
    easeInOutCubic(page56QuestionMoveProgress),
  );
  const page56SettledScale = 1;
  const page7ReadingScale = 1;
  const page8ReadingScale = 1;
  const page9ReadingScale = 1;
  const page56ZoomScale = page56SettledScale;
  const page67ZoomScale = mix(page56ZoomScale, page7ReadingScale, settledPage67Progress);
  const page78ZoomScale = mix(page67ZoomScale, page8ReadingScale, settledPage78Progress);
  const zoomScale = mix(page78ZoomScale, page9ReadingScale, settledPage89Progress);
  const page6FocusX = cameraViewportCenterX;
  const page6FocusY = cameraViewportCenterY;
  const page7FocusX = cameraViewportCenterX;
  const page7FocusY = cameraViewportCenterY;
  const page8FocusX = cameraViewportCenterX;
  const page8FocusY = cameraViewportCenterY;
  const page9FocusX = cameraViewportCenterX;
  const page9FocusY = cameraViewportCenterY;
  const page56FocusX = page6FocusX;
  const page56FocusY = page6FocusY;
  const page67FocusX = mix(page56FocusX, page7FocusX, settledPage67Progress);
  const page67FocusY = mix(page56FocusY, page7FocusY, settledPage67Progress);
  const page78FocusX = mix(page67FocusX, page8FocusX, settledPage78Progress);
  const page78FocusY = mix(page67FocusY, page8FocusY, settledPage78Progress);
  const zoomFocusX = mix(page78FocusX, page9FocusX, settledPage89Progress);
  const zoomFocusY = mix(page78FocusY, page9FocusY, settledPage89Progress);
  const page56BaseWorldOpacity = 1 - easeInOutCubic(clamp01(settledPage56Progress / 0.54));
  const page6StageProgress = resolveWindowProgress(
    page56LinearProgress,
    0.58,
    0.92,
    easeInOutCubic,
  );
  const page6StageOpacity = page6StageProgress;
  const page6StageScale = mix(0.56, 1.06, page6StageProgress);
  const page6DashedRevealProgress = resolveWindowProgress(
    page56LinearProgress,
    0.68,
    0.84,
    easeInOutCubic,
  );
  const page6BoardRevealProgress = resolveWindowProgress(
    page56LinearProgress,
    0.76,
    0.97,
    easeInOutCubic,
  );
  const page67ChainShiftProgress = settledPage67Progress;
  const page6OwnershipFocusOpacity = 1 - clamp01((settledPage67Progress - 0.08) / 0.28);
  const page7LookupLineProgress = resolveWindowProgress(
    page67LinearProgress,
    0.08,
    0.34,
    easeOutQuint,
  );
  const page7LookupOuterProgress = resolveWindowProgress(
    page67LinearProgress,
    0.38,
    0.72,
    easeOutQuint,
  );
  const page7LookupPayloadProgress = resolveWindowProgress(
    page67LinearProgress,
    0.58,
    0.92,
    easeOutQuint,
  );
  const page6ChainOpacity = 1 - clamp01((settledPage89Progress - 0.08) / 0.44);
  const page7LookupLineOpacity = page7LookupLineProgress * page6ChainOpacity;
  const page7LookupOuterOpacity = page7LookupOuterProgress * page6ChainOpacity;
  const page7LookupContentOpacity = page7LookupPayloadProgress * page6ChainOpacity;
  const page6FrameOpacity = page6ChainOpacity;
  const page6NodeOpacity = page6ChainOpacity;
  const page6NodeScale = 1;
  const page6MetaOpacity = page6ChainOpacity * page6OwnershipFocusOpacity;
  const page6DashedOpacity = page6MetaOpacity * page6DashedRevealProgress;
  const page6BoardOpacity = page6MetaOpacity * page6BoardRevealProgress;
  const page6BoardScale = mix(0.94, 1, page6BoardRevealProgress);
  const page7MaterialAnchorBox = mixBox(
    PAGE6_MATERIAL_BOX,
    PAGE7_MATERIAL_BOX,
    page67ChainShiftProgress,
  );
  const page6MaterialBox = mixBox(
    page7MaterialAnchorBox,
    PAGE8_MATERIAL_BOX,
    settledPage78Progress,
  );
  const page7ResourceAnchorBox = mixBox(
    PAGE6_RESOURCE_BOX,
    PAGE7_RESOURCE_BOX,
    page67ChainShiftProgress,
  );
  const page6ResourceBox = mixBox(
    page7ResourceAnchorBox,
    PAGE8_RESOURCE_BOX,
    settledPage78Progress,
  );
  const page6ResourceTopBox = mixBox(
    PAGE6_RESOURCE_TOP_BOX,
    PAGE7_RESOURCE_TOP_BOX,
    page67ChainShiftProgress,
  );
  const page6ResourceBottomBox = mixBox(
    PAGE6_RESOURCE_BOTTOM_BOX,
    PAGE7_RESOURCE_BOTTOM_BOX,
    page67ChainShiftProgress,
  );
  const page7ShaderMapAnchorBox = mixBox(
    PAGE6_SHADERMAP_BOX,
    PAGE7_SHADERMAP_BOX,
    page67ChainShiftProgress,
  );
  const page6ShaderMapBox = mixBox(
    page7ShaderMapAnchorBox,
    PAGE8_SHADERMAP_BOX,
    settledPage78Progress,
  );
  const page6ShaderTopBox = mixBox(
    PAGE6_SHADER_TOP_BOX,
    PAGE7_SHADER_TOP_BOX,
    page67ChainShiftProgress,
  );
  const page6ShaderBottomBox = mixBox(
    PAGE6_SHADER_BOTTOM_BOX,
    PAGE7_SHADER_BOTTOM_BOX,
    page67ChainShiftProgress,
  );
  const page6FShaderBox = mixBox(
    PAGE7_FSHADER_BOX,
    PAGE8_FSHADER_BOX,
    settledPage78Progress,
  );
  const page6ResourceCodeBox = mixBox(
    PAGE7_RESOURCE_CODE_BOX,
    PAGE8_RESOURCE_CODE_BOX,
    settledPage78Progress,
  );
  const page6InlineResourceBox = mixBox(
    PAGE7_INLINE_RESOURCE_BOX,
    PAGE8_INLINE_RESOURCE_BOX,
    settledPage78Progress,
  );
  const page6InlineCodeBox = PAGE7_INLINE_CODE_BOX;
  const page6InlineArchiveBox = PAGE7_INLINE_ARCHIVE_BOX;
  const page7CookedAnchorBox = mixBox(
    PAGE6_COOKED_BOX,
    PAGE7_COOKED_BOX,
    page67ChainShiftProgress,
  );
  const page6CookedBox = mixBox(
    page7CookedAnchorBox,
    PAGE8_COOKED_BOX,
    settledPage78Progress,
  );
  const page8TargetUassetFrame = mixBox(
    PAGE6_UASSET_FRAME,
    PAGE8_UASSET_FRAME,
    settledPage78Progress,
  );
  const page8ActiveUassetFrame = mixBox(
    page8TargetUassetFrame,
    PAGE9_UASSET_FRAME,
    settledPage89Progress,
  );
  const page6MaterialCenterX = boxCenterX(page6MaterialBox);
  const page6MaterialCenterY = boxCenterY(page6MaterialBox);
  const page6ResourceCenterX = boxCenterX(page6ResourceBox);
  const page6ResourceCenterY = boxCenterY(page6ResourceBox);
  const page6ShaderMapCenterX = boxCenterX(page6ShaderMapBox);
  const page6ShaderMapCenterY = boxCenterY(page6ShaderMapBox);
  const page6OwnershipLaneX = page6MaterialCenterX;
  const page6CookedCenterX = boxCenterX(page6CookedBox);
  const page6CookedCenterY = boxCenterY(page6CookedBox);
  const page6ShaderArrowStartX = boxRight(page6ShaderMapBox);
  const page6ShaderArrowEndX = page6InlineResourceBox.x;
  const page6CookedArrowEndX = page6CookedBox.x;
  const page6ShaderTableAnchorX = boxCenterX(PAGE6_SHADER_TABLE_BOX);
  const page6ShaderArrowMidX = (page6ShaderArrowStartX + page6CookedArrowEndX) / 2;
  const page6ShaderTableLinkStartY = page6ShaderMapCenterY;
  const page6ShaderTableLinkEndY = boxBottom(PAGE6_SHADER_TABLE_BOX);
  const page6CrossCenterX = boxCenterX(PAGE6_PLATFORM_TABLE_BOX);
  const page6CrossCenterY =
    (boxBottom(page6MaterialBox) + PAGE6_RESOURCE_BOX.y) / 2;
  const page6CrossHalf = 9;
  const page6LeftDashedLineStartX = page6OwnershipLaneX;
  const page6LeftDashedLineEndX = page6CrossCenterX + page6CrossHalf + 8;
  const page6LeftDashedLineCurrentEndX = mix(
    page6LeftDashedLineStartX,
    page6LeftDashedLineEndX,
    page6DashedRevealProgress,
  );
  const page6CurrentVisibleRightX = Math.max(
    boxRight(PAGE6_UASSET_FRAME),
    boxRight(page6CookedBox),
    boxRight(page6MaterialBox),
    boxRight(page6ResourceBox),
    boxRight(page6ShaderMapBox),
  );
  const page6CurrentVisibleBottomY = Math.max(
    boxBottom(PAGE6_UASSET_FRAME),
    boxBottom(page6CookedBox),
    boxBottom(page6ShaderMapBox),
  );
  const page7ExpandedVisibleRightX = Math.max(
    boxRight(PAGE6_UASSET_FRAME),
    boxRight(page6FShaderBox),
    boxRight(page6InlineResourceBox),
    boxRight(page6InlineCodeBox),
    boxRight(page6InlineArchiveBox),
  );
  const page7ExpandedVisibleBottomY = Math.max(
    boxBottom(PAGE6_UASSET_FRAME),
    boxBottom(page6InlineResourceBox),
    boxBottom(page6InlineCodeBox),
    boxBottom(page6FShaderBox),
    boxBottom(page6InlineArchiveBox),
  );
  const page6LowerBandBottomY = Math.max(
    boxBottom(PAGE6_PLATFORM_TABLE_BOX),
    boxBottom(PAGE6_RESOURCE_TABLE_BOX),
    boxBottom(PAGE6_SHADER_TABLE_BOX),
    boxBottom(page6MaterialBox),
    boxBottom(page6ResourceBox),
    boxBottom(page6ShaderMapBox),
  );
  const page6VisibleLeftX = Math.min(PAGE6_PLATFORM_TABLE_BOX.x, PAGE6_UASSET_FRAME.x);
  const page6VisibleRightX = mix(
    page6CurrentVisibleRightX,
    page7ExpandedVisibleRightX,
    settledPage67Progress,
  );
  const page6VisibleBottomY = mix(
    page6CurrentVisibleBottomY,
    page7ExpandedVisibleBottomY,
    settledPage67Progress,
  );
  const page6StageStableCenterY = mix(
    boxCenterY(PAGE6_UASSET_FRAME),
    boxCenterY(page8ActiveUassetFrame),
    settledPage78Progress,
  );
  const page6StageCenterX = mix(
    (page6VisibleLeftX + page6VisibleRightX) / 2,
    cameraViewportCenterX,
    settledPage67Progress,
  );
  const page6StageCenterY = page6StageStableCenterY;
  const page6MaterialArrowStartY = boxBottom(page6MaterialBox) + 14;
  const page6MaterialArrowEndY = page6ResourceBox.y - 14;
  const page6MaterialArrowMidY = (page6MaterialArrowStartY + page6MaterialArrowEndY) / 2;
  const page6ResourceArrowStartY = boxBottom(page6ResourceBox) + 14;
  const page6ResourceArrowEndY = page6ShaderMapBox.y - 14;
  const page6LeftCardLabelSize = mix(23.5, 21.2, settledPage78Progress);
  const page6FShaderCenterX = boxCenterX(page6FShaderBox);
  const page6FShaderCenterY = boxCenterY(page6FShaderBox);
  const page6FShaderTitleY = page6FShaderBox.y + page6FShaderBox.height * 0.285;
  const page6FShaderTitleSize = 29;
  const page6FShaderDividerY = page6FShaderBox.y + page6FShaderBox.height * 0.5;
  const page6FShaderIndexPillCenterX = page6FShaderCenterX;
  const page6FShaderIndexPillCenterY = page6FShaderBox.y + page6FShaderBox.height * 0.75;
  const page6FShaderIndexPillWidth = 168;
  const page6FShaderIndexPillHeight = 30;
  const page6ResourceIndexCenterY = page6FShaderIndexPillCenterY;
  const page6ResourceCodeCenterX = boxCenterX(page6ResourceCodeBox);
  const page6ResourceCodeCenterY = boxCenterY(page6ResourceCodeBox);
  const page6LookupPillWidth = page6ResourceCodeBox.width - 52;
  const page6LookupPillLeftX = page6ResourceCodeCenterX - page6LookupPillWidth / 2;
  const page6LookupPillRightX = page6LookupPillLeftX + page6LookupPillWidth;
  const page6LookupDividerY = page6ResourceCodeBox.y + 68;
  const page6LookupPillHeight = 50;
  const page6LookupPillGap = 8;
  const page6LookupTopGap =
    (page6ResourceCodeBox.height -
      (page6LookupDividerY - page6ResourceCodeBox.y) -
      page6LookupPillHeight * 2 -
      page6LookupPillGap) /
    2;
  const page6EntriesPillCenterY =
    page6LookupDividerY + page6LookupTopGap + page6LookupPillHeight / 2;
  const page6HashesPillCenterY =
    page6EntriesPillCenterY + page6LookupPillHeight + page6LookupPillGap;
  const page6FShaderToInlineX = page6FShaderCenterX;
  const page6FShaderToInlineStartY = boxBottom(page6FShaderBox) + 8;
  const page6FShaderToInlineEndY = page6InlineResourceBox.y - 8;
  const page6FShaderToInlineCurrentEndY = mix(
    page6FShaderToInlineStartY,
    page6FShaderToInlineEndY,
    page7LookupLineProgress,
  );
  const page6IndexLabelCenterX = page6FShaderToInlineX + 42;
  const page6IndexLabelCenterY = mix(
    page6FShaderToInlineStartY + 14,
    page6FShaderToInlineStartY + 18,
    page7LookupLineProgress,
  );
  const page6EntriesToCookedStartX = boxRight(page6ResourceCodeBox) - 18;
  const page6EntriesToCookedEndX = page6CookedBox.x - 12;
  const page6ShaderArrowCurrentEndX = mix(
    page6ShaderArrowStartX,
    page6ShaderArrowEndX,
    page7LookupOuterProgress,
  );
  const page6ShaderTableCurrentEndY = mix(
    page6ShaderTableLinkStartY,
    page6ShaderTableLinkEndY,
    page6DashedRevealProgress,
  );
  const page6PlatformTableCenterX = boxCenterX(PAGE6_PLATFORM_TABLE_BOX);
  const page6PlatformTableCenterY = boxCenterY(PAGE6_PLATFORM_TABLE_BOX);
  const page6ResourceTableCenterX = boxCenterX(PAGE6_RESOURCE_TABLE_BOX);
  const page6ResourceTableCenterY = boxCenterY(PAGE6_RESOURCE_TABLE_BOX);
  const page6ShaderTableCenterX = boxCenterX(PAGE6_SHADER_TABLE_BOX);
  const page6ShaderTableCenterY = boxCenterY(PAGE6_SHADER_TABLE_BOX);
  const page6InlineResourceBaseBox = mixBox(
    page6InlineResourceBox,
    PAGE8_SHARED_RESOURCE_BOX,
    settledPage89Progress,
  );
  const page6InlineResourceCenterX = boxCenterX(page6InlineResourceBaseBox);
  const page6InlineResourceCenterY = boxCenterY(page6InlineResourceBaseBox);
  const page6InlineArchiveBaseBox = mixBox(
    page6InlineArchiveBox,
    PAGE8_LIBRARY_BOX,
    settledPage89Progress,
  );
  const page6InlineArchiveCenterX = boxCenterX(page6InlineArchiveBaseBox);
  const page6InlineArchiveCenterY = boxCenterY(page6InlineArchiveBaseBox);
  const page8SharedNodeOpacity = clamp01((settledPage89Progress - 0.1) / 0.2);
  const page8ShaderMapIndexOpacity = clamp01((settledPage89Progress - 0.24) / 0.18);
  const page8ResourceLookupArrowOpacity = clamp01((settledPage89Progress - 0.3) / 0.2);
  const page6SpineOpacity = Math.max(page6NodeOpacity, page8SharedNodeOpacity);
  const page6FrameRetainedOpacity = Math.max(page6FrameOpacity, page8SharedNodeOpacity * 0.88);
  const page6CookedBridgeOpacity = page6SpineOpacity * (1 - page7LookupOuterProgress);
  const page7CacheOpacity = clamp01((settledPage78Progress - 0.12) / 0.22);
  const page7CacheScale = mix(0.9, 1, easeInOutCubic(page7CacheOpacity));
  const page8SourceOpacity = clamp01((settledPage89Progress - 0.18) / 0.24);
  const page8SourceScale = mix(0.92, 1, easeInOutCubic(page8SourceOpacity));
  const page8ProofOpacity =
    clamp01((settledPage78Progress - 0.28) / 0.2) * (1 - page8SourceOpacity);
  const page8ProofScale = mix(0.9, 1, easeInOutCubic(page8ProofOpacity));
  const page8ProofCueGap = 16;
  const page8ProofMaterialBox: Box = {
    x: page6CookedCenterX - 274,
    y: page8ActiveUassetFrame.y - 74,
    width: 392,
    height: 68,
    radius: 20,
  };
  const page8ProofCookedCueBox: Box = {
    x: page6CookedCenterX - 94,
    y: page8ProofMaterialBox.y + 17,
    width: 188,
    height: 34,
    radius: 16,
  };
  const page8ProofMaterialCenterX = boxCenterX(page8ProofMaterialBox);
  const page8ProofMaterialCenterY = boxCenterY(page8ProofMaterialBox);
  const projectPage6StagePoint = (x: number, y: number) =>
    scalePointAround({
      x,
      y,
      originX: page6StageCenterX,
      originY: page6StageCenterY,
      targetX: cameraViewportCenterX,
      targetY: cameraViewportCenterY,
      scale: page6StageScale,
    });
  const page8ProofMaterialGlobalCenter = projectPage6StagePoint(
    page8ProofMaterialCenterX,
    page8ProofMaterialCenterY,
  );
  const page8ProofCookedCueGlobalCenter = projectPage6StagePoint(
    boxCenterX(page8ProofCookedCueBox),
    boxCenterY(page8ProofCookedCueBox),
  );
  const page8ProofMaterialGlobalBox: Box = {
    ...page8ProofMaterialBox,
    x: page8ProofMaterialGlobalCenter.x - page8ProofMaterialBox.width / 2,
    y: page8ProofMaterialGlobalCenter.y - page8ProofMaterialBox.height / 2,
  };
  const page8ProofCookedCueGlobalBox: Box = {
    ...page8ProofCookedCueBox,
    x: page8ProofCookedCueGlobalCenter.x - page8ProofCookedCueBox.width / 2,
    y: page8ProofCookedCueGlobalCenter.y - page8ProofCookedCueBox.height / 2,
  };
  const page8ProofDividerGlobalX = page8ProofCookedCueGlobalBox.x - page8ProofCueGap / 2;
  const page8ProofLabelGlobalCenterX =
    (page8ProofMaterialGlobalBox.x + page8ProofDividerGlobalX) / 2;
  const page8HashAnchorInset = 78;
  const page8VsHashLocalX = page6LookupPillLeftX + page8HashAnchorInset;
  const page8PsHashLocalX = page6LookupPillRightX - page8HashAnchorInset;
  const page8HashBottomGlobalY = projectPage6StagePoint(
    page6ResourceCodeCenterX,
    page6HashesPillCenterY + page6LookupPillHeight / 2,
  ).y;
  const page8VsHashGlobalX = projectPage6StagePoint(
    page8VsHashLocalX,
    page6HashesPillCenterY + page6LookupPillHeight / 2,
  ).x;
  const page8PsHashGlobalX = projectPage6StagePoint(
    page8PsHashLocalX,
    page6HashesPillCenterY + page6LookupPillHeight / 2,
  ).x;
  const page8ProjectedUassetBottomY = projectPage6StagePoint(
    boxCenterX(page8TargetUassetFrame),
    boxBottom(page8TargetUassetFrame),
  ).y;
  const page8PsoTargetBox: Box = {
    ...PAGE8_PSO_BOX,
    y: page8ProjectedUassetBottomY + 28,
  };
  const page8PsoBox = mixBox(PAGE7_CACHE_BOX, page8PsoTargetBox, settledPage78Progress);
  const page7CacheCenterX = boxCenterX(page8PsoBox);
  const page7CacheCenterY = boxCenterY(page8PsoBox);
  const page8PsoDividerX = page8PsoBox.x + 152;
  const page8PsoFieldBandStartX = page8PsoDividerX + 56;
  const page8PsoFieldBandEndX = boxRight(page8PsoBox) - 44;
  const page8PsoFieldStep = (page8PsoFieldBandEndX - page8PsoFieldBandStartX) / 5;
  const page8PsoFieldXs = Array.from({length: 6}, (_, index) =>
    page8PsoFieldBandStartX + page8PsoFieldStep * index,
  );
  const page8VsHashFieldX = page8PsoFieldXs[0];
  const page8PsHashFieldX = page8PsoFieldXs[1];
  const page8PsoFieldSpecs = [
    {
      label: "VS Hash",
      x: page8VsHashFieldX,
      highlight: true,
      fontSize: 22,
      fontWeight: 780,
      textAnchor: "middle" as const,
    },
    {
      label: "PS Hash",
      x: page8PsHashFieldX,
      highlight: true,
      fontSize: 22,
      fontWeight: 780,
      textAnchor: "middle" as const,
    },
    {
      label: "Blend",
      x: page8PsoFieldXs[2],
      highlight: false,
      fontSize: 20.2,
      fontWeight: 720,
      textAnchor: "middle" as const,
    },
    {
      label: "Depth",
      x: page8PsoFieldXs[3],
      highlight: false,
      fontSize: 20.2,
      fontWeight: 720,
      textAnchor: "middle" as const,
    },
    {
      label: "RT",
      x: page8PsoFieldXs[4],
      highlight: false,
      fontSize: 20.2,
      fontWeight: 720,
      textAnchor: "middle" as const,
    },
    {
      label: "...!",
      x: page8PsoFieldXs[5],
      highlight: false,
      fontSize: 20.4,
      fontWeight: 760,
      textAnchor: "middle" as const,
    },
  ];
  const page8PsoHashArrowOpacity =
    clamp01((settledPage78Progress - 0.58) / 0.14) * (1 - page8SourceOpacity);
  const page8FieldAnchorDotY = page8PsoBox.y;
  const page8HashRefStartY = page8FieldAnchorDotY;
  const page8HashPillAnchorY = page8HashBottomGlobalY;
  const page8HashRefEndY = page8HashPillAnchorY;
  const page8VsHashRefBendY = page8PsoBox.y - 44;
  const page8PsHashRefBendY = page8PsoBox.y - 18;
  const page8HashBadgeX = (page8VsHashGlobalX + page8PsHashGlobalX) / 2;
  const page8HashBadgeY = (page8HashRefStartY + page8HashRefEndY) / 2 + 10;
  const page8CookedArrowTargetGlobal = projectPage6StagePoint(
    page6CookedCenterX,
    page6CookedBox.y - 10,
  );
  const page8LibraryLookupElbowGlobal = projectPage6StagePoint(
    PAGE8_LIBRARY_BOX.x - 68,
    PAGE8_LIBRARY_BOX.y + 138,
  );
  const page8LibraryLookupTargetGlobal = projectPage6StagePoint(
    PAGE8_LIBRARY_BOX.x - 12,
    PAGE8_LIBRARY_BOX.y + 138,
  );
  const page8MaterialBusX = 952;
  const page8MaterialBusTopY = boxCenterY(PAGE8_MATERIAL_A_BOX);
  const page8MaterialBusBottomY = boxCenterY(PAGE8_MATERIAL_C_BOX);
  const page8MaterialBusMidY = boxCenterY(PAGE8_MATERIAL_B_BOX);
  const page8LibraryCenterX = boxCenterX(PAGE8_LIBRARY_BOX);
  const page8LibraryCenterY = boxCenterY(PAGE8_LIBRARY_BOX);
  const page8LookupArrowOpacity = clamp01((settledPage89Progress - 0.28) / 0.24);
  const page9LibraryOpacity = clamp01((settledPage89Progress - 0.1) / 0.2);
  const page9LookupOpacity = clamp01((settledPage89Progress - 0.24) / 0.18);
  const page9ProofOpacity = clamp01((settledPage89Progress - 0.42) / 0.18);
  const page9VsHashLibraryTargetGlobal = projectPage6StagePoint(
    PAGE9_HASHES_BOX.x + 48,
    boxBottom(PAGE9_HASHES_BOX),
  );
  const page9PsHashLibraryTargetGlobal = projectPage6StagePoint(
    boxRight(PAGE9_HASHES_BOX) - 48,
    boxBottom(PAGE9_HASHES_BOX),
  );
  const page8HashFocusOpacity =
    clamp01((settledPage78Progress - 0.28) / 0.18) * (1 - page8SourceOpacity * 0.72);
  const page8HashPillStroke = mixRgba(apiStrokeColor, issueStrokeColor, page8HashFocusOpacity);
  const page8HashPillFill = mixRgba(
    {r: 255, g: 248, b: 242, a: 0.92},
    {r: 255, g: 242, b: 239, a: 0.98},
    page8HashFocusOpacity,
  );
  const page7InlineRevealScale = mix(0.956, 1, page7LookupOuterProgress);
  const page7InlinePayloadScale = mix(0.972, 1, page7LookupContentOpacity);
  const page7InlinePayloadLift = mix(12, 0, page7LookupContentOpacity);


  return {
    PAGE5_SPINE_SHIFT,
    page12Progress,
    page23Progress,
    page34Progress,
    page45Progress,
    page56Progress,
    page67Progress,
    page78Progress,
    page89Progress,
    page56LinearProgress,
    page67LinearProgress,
    settledPage12Progress,
    settledPage23Progress,
    settledPage34Progress,
    settledPage45Progress,
    settledPage56Progress,
    settledPage67Progress,
    settledPage78Progress,
    settledPage89Progress,
    theme,
    neutralFill,
    focusFill,
    assetFill,
    assetStroke,
    nodeStroke,
    wireStroke,
    apiStroke,
    issueStroke,
    neutralFillColor,
    focusFillColor,
    assetFillColor,
    wireStrokeColor,
    apiStrokeColor,
    issueStrokeColor,
    nodeStrokeColor,
    assetStrokeColor,
    accentStrokeColor,
    page34SpineShift,
    page45SpineShift,
    mixedLeftBox,
    mixedCenterBox,
    mixedRightBox,
    leftBox,
    centerBox,
    rightBox,
    leftCenterX,
    centerCenterX,
    rightCenterX,
    axisY,
    centerTextY,
    arrowStartGap,
    arrowEndGap,
    page12LabelFadeProgress,
    page12CenterLabelFadeProgress,
    page12ShapeRevealProgress,
    page12LabelRevealProgress,
    oldLabelOpacity,
    oldCenterLabelOpacity,
    newShapeOpacity,
    newLabelOpacity,
    oldLabelScale,
    newShapeScale,
    newLabelScale,
    upperNodeOpacity,
    upperLineOpacity,
    upperNodeScale,
    upperLineProgress,
    upperLift,
    page34UpperShift,
    upperBandGap,
    shaderCompileGap,
    gpuQuarterStep,
    page3StateShiftX,
    binaryTargetX,
    depthTargetX,
    blendTargetX,
    shaderCodeTargetX,
    upperLineNodeGap,
    shaderCodeBox,
    shaderBinaryBox,
    depthBox,
    blendBox,
    gpuTopY,
    shaderCodeCenterX,
    shaderBinaryCenterX,
    depthCenterX,
    blendCenterX,
    pixelGridX,
    pixelGridY,
    shaderLineY,
    shaderLineStartX,
    shaderLineEndX,
    shaderArrowTipX,
    binaryLineStartY,
    depthLineStartY,
    blendLineStartY,
    gpuArrowGap,
    apiArrowTipY,
    binaryLineEndY,
    depthLineEndY,
    blendLineEndY,
    legacyRetractProgress,
    page4RelationOpacity,
    shaderArtifactLabelProgress,
    legacyUpperCallOpacity,
    descriptionOpacity,
    descriptionScale,
    psoOpacity,
    psoScale,
    createOpacity,
    psoBindOpacity,
    page4StateNodeOpacity,
    page4UpperLineOpacity,
    page4MiddleFade,
    page4DescriptionOpacity,
    page4PsoOpacity,
    page4CreateOpacity,
    page4PsoBindOpacity,
    page5CookMoveProgress,
    upperBandBottomY,
    page3ProgramOpacity,
    page3ProgramLineOpacity,
    page3ProgramScale,
    page3ProgramBox,
    page3WorkflowFrameOpacity,
    page3WorkflowFrameBox,
    page3WorkflowFrameBadgeX,
    page3WorkflowFrameBadgeY,
    page3ProgramCenterX,
    page3ProgramCenterY,
    page3ProgramTipY,
    page3UseProgramStartY,
    page3LinkStartY,
    page3LinkLeftX,
    page3LinkRightX,
    page3LinkEndY,
    page34VerticalMorphProgress,
    layerGap,
    descriptionBox,
    descriptionCenterX,
    descriptionCenterY,
    descriptionTipY,
    psoBox,
    psoCenterX,
    psoCenterY,
    psoTipY,
    page4WorkflowFrameOpacity,
    descriptionToPsoStartY,
    psoBindStartY,
    psoBindEndY,
    verticalMorphEndY,
    verticalMorphStroke,
    verticalBadgeOpacity,
    page5AssetOpacity,
    page5AssetScale,
    page5ArrowOpacity,
    page5LabelMorphProgress,
    page5VertexRetainProgress,
    page5VertexIconOpacity,
    page5VertexIconScale,
    page5VertexIconY,
    page5MeshBox,
    page5MaterialTargetBox,
    page5CookedTargetBox,
    page5MaterialBox,
    page5CookedBox,
    page5BinaryGap,
    page5BinaryTargetBox,
    page5MeshCenterX,
    page5MeshCenterY,
    page5MeshToVertexStartX,
    page5MeshToVertexEndX,
    page5CookedToGpuEndY,
    page5BinaryOpacity,
    page5BinaryScale,
    sharedUpperLeftBox,
    sharedUpperRightBox,
    page4WorkflowFrameBox,
    page4WorkflowFrameBadgeX,
    page4WorkflowFrameBadgeY,
    sharedUpperLeftCenterX,
    sharedUpperLeftCenterY,
    sharedUpperRightCenterX,
    sharedUpperRightCenterY,
    sharedUpperNodeOpacity,
    sharedUpperLeftFill,
    sharedUpperLeftStroke,
    sharedUpperRightFill,
    sharedUpperRightStroke,
    sharedUpperHorizontalOpacity,
    sharedUpperHorizontalStroke,
    sharedUpperHorizontalStartX,
    sharedUpperHorizontalEndX,
    sharedUpperHorizontalY,
    sharedUpperVerticalOpacity,
    sharedUpperVerticalStroke,
    sharedUpperVerticalPage34StartY,
    sharedUpperVerticalStartY,
    sharedUpperVerticalEndY,
    page5BinaryCenterX,
    page5BinaryCenterY,
    page5CookedToBinaryStartY,
    page5BinaryToGpuStartY,
    page5QuestionBaseOpacity,
    page5QuestionX,
    page5QuestionY,
    cameraViewportCenterX,
    cameraViewportCenterY,
    page56QuestionMoveProgress,
    page56QuestionFadeProgress,
    page5QuestionOpacity,
    page56QuestionCenterX,
    page56QuestionCenterY,
    page56QuestionScale,
    page56SettledScale,
    page7ReadingScale,
    page8ReadingScale,
    page9ReadingScale,
    page56ZoomScale,
    page67ZoomScale,
    page78ZoomScale,
    zoomScale,
    page6FocusX,
    page6FocusY,
    page7FocusX,
    page7FocusY,
    page8FocusX,
    page8FocusY,
    page9FocusX,
    page9FocusY,
    page56FocusX,
    page56FocusY,
    page67FocusX,
    page67FocusY,
    page78FocusX,
    page78FocusY,
    zoomFocusX,
    zoomFocusY,
    page56BaseWorldOpacity,
    page6StageProgress,
    page6StageOpacity,
    page6StageScale,
    page6DashedRevealProgress,
    page6BoardRevealProgress,
    page67ChainShiftProgress,
    page6OwnershipFocusOpacity,
    page7LookupLineProgress,
    page7LookupOuterProgress,
    page7LookupPayloadProgress,
    page6ChainOpacity,
    page7LookupLineOpacity,
    page7LookupOuterOpacity,
    page7LookupContentOpacity,
    page6FrameOpacity,
    page6NodeOpacity,
    page6NodeScale,
    page6MetaOpacity,
    page6DashedOpacity,
    page6BoardOpacity,
    page6BoardScale,
    page7MaterialAnchorBox,
    page6MaterialBox,
    page7ResourceAnchorBox,
    page6ResourceBox,
    page6ResourceTopBox,
    page6ResourceBottomBox,
    page7ShaderMapAnchorBox,
    page6ShaderMapBox,
    page6ShaderTopBox,
    page6ShaderBottomBox,
    page6FShaderBox,
    page6ResourceCodeBox,
    page6InlineResourceBox,
    page6InlineCodeBox,
    page6InlineArchiveBox,
    page7CookedAnchorBox,
    page6CookedBox,
    page8ActiveUassetFrame,
    page6MaterialCenterX,
    page6MaterialCenterY,
    page6ResourceCenterX,
    page6ResourceCenterY,
    page6ShaderMapCenterX,
    page6ShaderMapCenterY,
    page6OwnershipLaneX,
    page6CookedCenterX,
    page6CookedCenterY,
    page6ShaderArrowStartX,
    page6ShaderArrowEndX,
    page6CookedArrowEndX,
    page6ShaderTableAnchorX,
    page6ShaderArrowMidX,
    page6ShaderTableLinkStartY,
    page6ShaderTableLinkEndY,
    page6CrossCenterX,
    page6CrossCenterY,
    page6CrossHalf,
    page6LeftDashedLineStartX,
    page6LeftDashedLineEndX,
    page6LeftDashedLineCurrentEndX,
    page6CurrentVisibleRightX,
    page6CurrentVisibleBottomY,
    page7ExpandedVisibleRightX,
    page7ExpandedVisibleBottomY,
    page6LowerBandBottomY,
    page6VisibleLeftX,
    page6VisibleRightX,
    page6VisibleBottomY,
    page6StageStableCenterY,
    page6StageCenterX,
    page6StageCenterY,
    page6MaterialArrowStartY,
    page6MaterialArrowEndY,
    page6MaterialArrowMidY,
    page6ResourceArrowStartY,
    page6ResourceArrowEndY,
    page6LeftCardLabelSize,
    page6FShaderCenterX,
    page6FShaderCenterY,
    page6FShaderTitleY,
    page6FShaderTitleSize,
    page6FShaderDividerY,
    page6FShaderIndexPillCenterX,
    page6FShaderIndexPillCenterY,
    page6FShaderIndexPillWidth,
    page6FShaderIndexPillHeight,
    page6ResourceIndexCenterY,
    page6ResourceCodeCenterX,
    page6ResourceCodeCenterY,
    page6LookupPillWidth,
    page6LookupPillLeftX,
    page6LookupPillRightX,
    page6LookupDividerY,
    page6LookupPillHeight,
    page6LookupPillGap,
    page6LookupTopGap,
    page6EntriesPillCenterY,
    page6HashesPillCenterY,
    page6FShaderToInlineX,
    page6FShaderToInlineStartY,
    page6FShaderToInlineEndY,
    page6FShaderToInlineCurrentEndY,
    page6IndexLabelCenterX,
    page6IndexLabelCenterY,
    page6EntriesToCookedStartX,
    page6EntriesToCookedEndX,
    page6ShaderArrowCurrentEndX,
    page6ShaderTableCurrentEndY,
    page6PlatformTableCenterX,
    page6PlatformTableCenterY,
    page6ResourceTableCenterX,
    page6ResourceTableCenterY,
    page6ShaderTableCenterX,
    page6ShaderTableCenterY,
    page6InlineResourceBaseBox,
    page6InlineResourceCenterX,
    page6InlineResourceCenterY,
    page6InlineArchiveBaseBox,
    page6InlineArchiveCenterX,
    page6InlineArchiveCenterY,
    page8SharedNodeOpacity,
    page8ShaderMapIndexOpacity,
    page8ResourceLookupArrowOpacity,
    page6SpineOpacity,
    page6FrameRetainedOpacity,
    page6CookedBridgeOpacity,
    page7CacheOpacity,
    page7CacheScale,
    page8SourceOpacity,
    page8SourceScale,
    page8ProofOpacity,
    page8ProofScale,
    page8ProofCueGap,
    page8ProofMaterialCenterX,
    page8ProofMaterialCenterY,
    projectPage6StagePoint,
    page8ProofMaterialGlobalCenter,
    page8ProofCookedCueGlobalCenter,
    page8ProofMaterialGlobalBox,
    page8ProofCookedCueGlobalBox,
    page8ProofDividerGlobalX,
    page8ProofLabelGlobalCenterX,
    page8HashAnchorInset,
    page8VsHashLocalX,
    page8PsHashLocalX,
    page8HashBottomGlobalY,
    page8VsHashGlobalX,
    page8PsHashGlobalX,
    page8ProjectedUassetBottomY,
    page8PsoBox,
    page7CacheCenterX,
    page7CacheCenterY,
    page8PsoDividerX,
    page8PsoFieldBandStartX,
    page8PsoFieldBandEndX,
    page8PsoFieldStep,
    page8PsoFieldXs,
    page8VsHashFieldX,
    page8PsHashFieldX,
    page8PsoFieldSpecs,
    page8PsoHashArrowOpacity,
    page8FieldAnchorDotY,
    page8HashRefStartY,
    page8HashPillAnchorY,
    page8HashRefEndY,
    page8VsHashRefBendY,
    page8PsHashRefBendY,
    page8HashBadgeX,
    page8HashBadgeY,
    page8CookedArrowTargetGlobal,
    page8LibraryLookupElbowGlobal,
    page8LibraryLookupTargetGlobal,
    page8MaterialBusX,
    page8MaterialBusTopY,
    page8MaterialBusBottomY,
    page8MaterialBusMidY,
    page8LibraryCenterX,
    page8LibraryCenterY,
    page8LookupArrowOpacity,
    page9LibraryOpacity,
    page9LookupOpacity,
    page9ProofOpacity,
    page9VsHashLibraryTargetGlobal,
    page9PsHashLibraryTargetGlobal,
    page8HashFocusOpacity,
    page8HashPillStroke,
    page8HashPillFill,
    page7InlineRevealScale,
    page7InlinePayloadScale,
    page7InlinePayloadLift,
  };
}
