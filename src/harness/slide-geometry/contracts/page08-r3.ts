import {
  PAGE8_COOKED_BOX,
  PAGE8_FSHADER_BOX,
  PAGE8_INLINE_RESOURCE_BOX,
  PAGE8_MATERIAL_BOX,
  PAGE8_RESOURCE_BOX,
  PAGE8_RESOURCE_CODE_BOX,
  PAGE8_SHADERMAP_BOX,
  PAGE8_UASSET_FRAME,
} from "../../../remotion/pages/page-layout-constants";
import type {GeometrySketchDefinition} from "../render/geometry-sketch-types";

type Rect = {x: number; y: number; width: number; height: number};

const STAGE = {
  viewportCenterX: 640,
  viewportCenterY: 360,
  centerX: 640,
  centerY: 308,
  scale: 1.06,
};

function stageX(x: number) {
  return STAGE.viewportCenterX + (x - STAGE.centerX) * STAGE.scale;
}

function stageY(y: number) {
  return STAGE.viewportCenterY + (y - STAGE.centerY) * STAGE.scale;
}

function stagePoint(point: {x: number; y: number}) {
  return {
    x: stageX(point.x),
    y: stageY(point.y),
  };
}

function stageBox(box: Rect): Rect {
  return {
    x: stageX(box.x),
    y: stageY(box.y),
    width: box.width * STAGE.scale,
    height: box.height * STAGE.scale,
  };
}

function cx(box: Rect) {
  return box.x + box.width / 2;
}

function cy(box: Rect) {
  return box.y + box.height / 2;
}

function right(box: Rect) {
  return box.x + box.width;
}

function bottom(box: Rect) {
  return box.y + box.height;
}

const UASSET_BOX = stageBox(PAGE8_UASSET_FRAME);
const MATERIAL_BOX = stageBox(PAGE8_MATERIAL_BOX);
const RESOURCE_BOX = stageBox(PAGE8_RESOURCE_BOX);
const SHADERMAP_BOX = stageBox(PAGE8_SHADERMAP_BOX);
const FSHADER_BOX = stageBox(PAGE8_FSHADER_BOX);
const INLINE_RESOURCE_BOX = stageBox(PAGE8_INLINE_RESOURCE_BOX);
const RESOURCE_CODE_BOX = stageBox(PAGE8_RESOURCE_CODE_BOX);
const COOKED_BOX = stageBox(PAGE8_COOKED_BOX);

const RESOURCE_INDEX_LOCAL = {
  x: PAGE8_FSHADER_BOX.x + PAGE8_FSHADER_BOX.width / 2 - 84,
  y: PAGE8_FSHADER_BOX.y + PAGE8_FSHADER_BOX.height * 0.75 - 15,
  width: 168,
  height: 30,
};
const RESOURCE_INDEX_BOX = stageBox(RESOURCE_INDEX_LOCAL);

const LOOKUP_PILL_WIDTH = PAGE8_RESOURCE_CODE_BOX.width - 52;
const LOOKUP_PILL_HEIGHT = 50;
const LOOKUP_DIVIDER_Y = PAGE8_RESOURCE_CODE_BOX.y + 68;
const LOOKUP_PILL_GAP = 8;
const LOOKUP_TOP_GAP =
  (PAGE8_RESOURCE_CODE_BOX.height -
    (LOOKUP_DIVIDER_Y - PAGE8_RESOURCE_CODE_BOX.y) -
    LOOKUP_PILL_HEIGHT * 2 -
    LOOKUP_PILL_GAP) /
  2;

const ENTRIES_LOCAL = {
  x: PAGE8_RESOURCE_CODE_BOX.x + (PAGE8_RESOURCE_CODE_BOX.width - LOOKUP_PILL_WIDTH) / 2,
  y: LOOKUP_DIVIDER_Y + LOOKUP_TOP_GAP,
  width: LOOKUP_PILL_WIDTH,
  height: LOOKUP_PILL_HEIGHT,
};
const HASHES_LOCAL = {
  x: ENTRIES_LOCAL.x,
  y: ENTRIES_LOCAL.y + LOOKUP_PILL_HEIGHT + LOOKUP_PILL_GAP,
  width: LOOKUP_PILL_WIDTH,
  height: LOOKUP_PILL_HEIGHT,
};
const ENTRIES_BOX = stageBox(ENTRIES_LOCAL);
const HASHES_BOX = stageBox(HASHES_LOCAL);

const PROOF_MATERIAL_BOX = {
  x: 795.92,
  y: 33.44,
  width: 392,
  height: 68,
};
const PROOF_CUE_BOX = {
  x: 980.6,
  y: 50.44,
  width: 188,
  height: 34,
};
const PSO_BOX = {
  x: 170,
  y: 638.16,
  width: 940,
  height: 100,
};

const VS_HASH_FIELD_X = 378;
const PS_HASH_FIELD_X = 515.6;
const HASH_REF_START_Y = 638.16;
const VS_HASH_REF_BEND_Y = 594.16;
const PS_HASH_REF_BEND_Y = 620.16;
const HASH_REF_END_Y = 552.92;
const VS_HASH_TARGET_X = 529.76;
const PS_HASH_TARGET_X = 750.24;

export const page08R3Sketch: GeometrySketchDefinition = {
  id: "page08-r3",
  label: "page08 formal-code mirror sketch",
  stepId: "page_08",
  contract: {
    pageGoal:
      "Mirror page08 from formal scene code: code stays with assets while PSO path carries hashes.",
    receiverPlane: "ShaderHashes[idx]",
    primaryLine:
      "ShaderEntries[idx] -> Cooked ShaderCode, and PSO VS/PS hash branches target ShaderHashes[idx]",
    keepStable:
      "Keep the formal stage geometry and preserve the partially visible bottom PSO band.",
    newChange:
      "This revision is a direct coordinate mirror from formal constants and compute formulas, not a redesign.",
    doNot:
      "Do not merge hash and code semantics into one path and do not convert this page into page09-style shared library.",
  },
  nodes: [
    {
      id: "uasset",
      label: "uasset",
      x: UASSET_BOX.x,
      y: UASSET_BOX.y,
      width: UASSET_BOX.width,
      height: UASSET_BOX.height,
      tone: "muted",
    },
    {
      id: "material",
      label: "Material",
      containerId: "uasset",
      x: MATERIAL_BOX.x,
      y: MATERIAL_BOX.y,
      width: MATERIAL_BOX.width,
      height: MATERIAL_BOX.height,
      tone: "receiver",
    },
    {
      id: "resource",
      label: "FMaterialResource",
      containerId: "uasset",
      x: RESOURCE_BOX.x,
      y: RESOURCE_BOX.y,
      width: RESOURCE_BOX.width,
      height: RESOURCE_BOX.height,
    },
    {
      id: "shadermap",
      label: "FMaterialShaderMap",
      containerId: "uasset",
      x: SHADERMAP_BOX.x,
      y: SHADERMAP_BOX.y,
      width: SHADERMAP_BOX.width,
      height: SHADERMAP_BOX.height,
    },
    {
      id: "fshader",
      label: "FShader",
      containerId: "uasset",
      x: FSHADER_BOX.x,
      y: FSHADER_BOX.y,
      width: FSHADER_BOX.width,
      height: FSHADER_BOX.height,
    },
    {
      id: "resource-index",
      label: "ResourceIndex",
      containerId: "fshader",
      x: RESOURCE_INDEX_BOX.x,
      y: RESOURCE_INDEX_BOX.y,
      width: RESOURCE_INDEX_BOX.width,
      height: RESOURCE_INDEX_BOX.height,
    },
    {
      id: "inline-resource",
      label: "FShaderMapResource_InlineCode",
      containerId: "uasset",
      x: INLINE_RESOURCE_BOX.x,
      y: INLINE_RESOURCE_BOX.y,
      width: INLINE_RESOURCE_BOX.width,
      height: INLINE_RESOURCE_BOX.height,
      tone: "receiver",
    },
    {
      id: "resource-code",
      label: "FShaderMapResourceCode",
      containerId: "inline-resource",
      x: RESOURCE_CODE_BOX.x,
      y: RESOURCE_CODE_BOX.y,
      width: RESOURCE_CODE_BOX.width,
      height: RESOURCE_CODE_BOX.height,
      tone: "muted",
    },
    {
      id: "entries",
      label: "ShaderEntries[idx]",
      containerId: "resource-code",
      x: ENTRIES_BOX.x,
      y: ENTRIES_BOX.y,
      width: ENTRIES_BOX.width,
      height: ENTRIES_BOX.height,
      fontSizeOverride: 20,
    },
    {
      id: "hashes",
      label: "ShaderHashes[idx]",
      containerId: "resource-code",
      x: HASHES_BOX.x,
      y: HASHES_BOX.y,
      width: HASHES_BOX.width,
      height: HASHES_BOX.height,
      tone: "receiver",
      fontSizeOverride: 20,
    },
    {
      id: "proof-material",
      label: "Material",
      x: PROOF_MATERIAL_BOX.x,
      y: PROOF_MATERIAL_BOX.y,
      width: PROOF_MATERIAL_BOX.width,
      height: PROOF_MATERIAL_BOX.height,
      tone: "receiver",
    },
    {
      id: "proof-cooked",
      label: "Cooked ShaderCode",
      containerId: "proof-material",
      x: PROOF_CUE_BOX.x,
      y: PROOF_CUE_BOX.y,
      width: PROOF_CUE_BOX.width,
      height: PROOF_CUE_BOX.height,
      tone: "default",
      fontSizeOverride: 18,
    },
    {
      id: "cooked-code",
      label: "Cooked ShaderCode",
      x: COOKED_BOX.x,
      y: COOKED_BOX.y,
      width: COOKED_BOX.width,
      height: COOKED_BOX.height,
    },
    {
      id: "pso-cache",
      label: "PSO Cache",
      x: PSO_BOX.x,
      y: PSO_BOX.y,
      width: PSO_BOX.width,
      height: PSO_BOX.height,
      tone: "muted",
    },
  ],
  edges: [
    {
      id: "material-to-resource",
      from: {x: cx(MATERIAL_BOX), y: bottom(MATERIAL_BOX)},
      to: {x: cx(RESOURCE_BOX), y: RESOURCE_BOX.y},
      tone: "support",
      arrowEnd: true,
    },
    {
      id: "resource-to-shadermap",
      from: {x: cx(RESOURCE_BOX), y: bottom(RESOURCE_BOX)},
      to: {x: cx(SHADERMAP_BOX), y: SHADERMAP_BOX.y},
      tone: "support",
      arrowEnd: true,
    },
    {
      id: "shadermap-to-inline",
      from: {x: right(SHADERMAP_BOX), y: cy(SHADERMAP_BOX)},
      to: {x: INLINE_RESOURCE_BOX.x, y: cy(SHADERMAP_BOX)},
      tone: "support",
      arrowEnd: true,
    },
    {
      id: "resource-index-to-entries",
      from: {x: cx(RESOURCE_INDEX_BOX), y: bottom(RESOURCE_INDEX_BOX) + 2},
      to: {x: cx(ENTRIES_BOX), y: ENTRIES_BOX.y - 2},
      tone: "support",
      dashed: true,
      arrowEnd: true,
    },
    {
      id: "entries-to-cooked",
      from: {x: right(ENTRIES_BOX), y: cy(ENTRIES_BOX)},
      to: {x: COOKED_BOX.x, y: cy(COOKED_BOX)},
      tone: "support",
      arrowEnd: true,
    },
    {
      id: "proof-to-cooked",
      from: {x: cx(PROOF_CUE_BOX), y: bottom(PROOF_MATERIAL_BOX) + 8},
      to: {x: cx(COOKED_BOX), y: COOKED_BOX.y - 8},
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "pso-vs-to-hashes",
      from: {x: VS_HASH_FIELD_X, y: HASH_REF_START_Y},
      to: {x: VS_HASH_TARGET_X, y: HASH_REF_END_Y},
      waypoints: [
        {x: VS_HASH_FIELD_X, y: VS_HASH_REF_BEND_Y},
        {x: VS_HASH_TARGET_X, y: VS_HASH_REF_BEND_Y},
      ],
      tone: "primary",
      dashed: true,
      arrowEnd: true,
    },
    {
      id: "pso-ps-to-hashes",
      from: {x: PS_HASH_FIELD_X, y: HASH_REF_START_Y},
      to: {x: PS_HASH_TARGET_X, y: HASH_REF_END_Y},
      waypoints: [
        {x: PS_HASH_FIELD_X, y: PS_HASH_REF_BEND_Y},
        {x: PS_HASH_TARGET_X, y: PS_HASH_REF_BEND_Y},
      ],
      tone: "primary",
      dashed: true,
      arrowEnd: true,
    },
  ],
};
