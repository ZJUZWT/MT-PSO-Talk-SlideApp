import type {GeometrySketchDefinition} from "../render/geometry-sketch-types";

const UASSET_BOX = {x: 52, y: 86, width: 862, height: 452};
const MATERIAL_BOX = {x: 84, y: 134, width: 216, height: 70};
const RESOURCE_BOX = {x: 84, y: 246, width: 216, height: 70};
const SHADERMAP_BOX = {x: 84, y: 358, width: 216, height: 70};
const FSHADER_BOX = {x: 330, y: 186, width: 240, height: 106};
const INLINE_RESOURCE_BOX = {x: 334, y: 302, width: 470, height: 198};
const RESOURCE_INDEX_BOX = {x: 606, y: 420, width: 172, height: 56};
const SHADER_ENTRIES_BOX = {x: 360, y: 338, width: 190, height: 70};
const SHADER_HASHES_BOX = {x: 584, y: 338, width: 190, height: 70};
const COOKED_CODE_BOX = {x: 934, y: 328, width: 266, height: 94};
const PROOF_BOX = {x: 934, y: 128, width: 212, height: 66};
const PSO_BOX = {x: 114, y: 548, width: 1052, height: 98};
const VS_FIELD_BOX = {x: 362, y: 576, width: 122, height: 40};
const PS_FIELD_BOX = {x: 508, y: 576, width: 122, height: 40};
const STATE_FIELD_BOX = {x: 654, y: 574, width: 458, height: 44};

function cx(box: {x: number; width: number}) {
  return box.x + box.width / 2;
}

function cy(box: {y: number; height: number}) {
  return box.y + box.height / 2;
}

function right(box: {x: number; width: number}) {
  return box.x + box.width;
}

function bottom(box: {y: number; height: number}) {
  return box.y + box.height;
}

export const page08R2Sketch: GeometrySketchDefinition = {
  id: "page08-r2",
  label: "PSO hash indirection mirror sketch",
  stepId: "page_08",
  contract: {
    pageGoal:
      "Mirror page08 as one canvas that simultaneously shows asset-local cooked code and hash-only PSO records.",
    receiverPlane: "ShaderHashes[Index]",
    primaryLine:
      "PSO Cache(VS/PS hash) -> ShaderHashes[Index] while cooked code still stays in asset-side storage.",
    keepStable:
      "Keep the page07 spatial memory: left asset chain, center inline-resource area, right cooked-code area.",
    newChange:
      "Lift the bottom PSO band and clean hash-reference routing so no short hooks or clipped baseline remain.",
    doNot:
      "Do not imply PSO directly stores shader code, and do not collapse hash and code paths into one fake edge.",
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
      tone: "muted",
    },
    {
      id: "resource",
      label: "FMaterialResource",
      containerId: "uasset",
      x: RESOURCE_BOX.x,
      y: RESOURCE_BOX.y,
      width: RESOURCE_BOX.width,
      height: RESOURCE_BOX.height,
      tone: "muted",
    },
    {
      id: "shadermap",
      label: "FMaterialShaderMap",
      containerId: "uasset",
      x: SHADERMAP_BOX.x,
      y: SHADERMAP_BOX.y,
      width: SHADERMAP_BOX.width,
      height: SHADERMAP_BOX.height,
      tone: "muted",
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
      id: "shader-entries",
      label: "ShaderEntries[Index]",
      containerId: "inline-resource",
      x: SHADER_ENTRIES_BOX.x,
      y: SHADER_ENTRIES_BOX.y,
      width: SHADER_ENTRIES_BOX.width,
      height: SHADER_ENTRIES_BOX.height,
    },
    {
      id: "shader-hashes",
      label: "ShaderHashes[Index]",
      containerId: "inline-resource",
      x: SHADER_HASHES_BOX.x,
      y: SHADER_HASHES_BOX.y,
      width: SHADER_HASHES_BOX.width,
      height: SHADER_HASHES_BOX.height,
      tone: "receiver",
    },
    {
      id: "resource-index",
      label: "ResourceIndex",
      containerId: "inline-resource",
      x: RESOURCE_INDEX_BOX.x,
      y: RESOURCE_INDEX_BOX.y,
      width: RESOURCE_INDEX_BOX.width,
      height: RESOURCE_INDEX_BOX.height,
      tone: "muted",
    },
    {
      id: "proof",
      label: "Cooked ShaderCode stays with assets",
      x: PROOF_BOX.x,
      y: PROOF_BOX.y,
      width: PROOF_BOX.width,
      height: PROOF_BOX.height,
      tone: "muted",
      fontSizeOverride: 17,
    },
    {
      id: "cooked-code",
      label: "Cooked ShaderCode",
      x: COOKED_CODE_BOX.x,
      y: COOKED_CODE_BOX.y,
      width: COOKED_CODE_BOX.width,
      height: COOKED_CODE_BOX.height,
      tone: "receiver",
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
    {
      id: "pso-vs",
      label: "VS Hash",
      containerId: "pso-cache",
      x: VS_FIELD_BOX.x,
      y: VS_FIELD_BOX.y,
      width: VS_FIELD_BOX.width,
      height: VS_FIELD_BOX.height,
      tone: "default",
      fontSizeOverride: 18,
    },
    {
      id: "pso-ps",
      label: "PS Hash",
      containerId: "pso-cache",
      x: PS_FIELD_BOX.x,
      y: PS_FIELD_BOX.y,
      width: PS_FIELD_BOX.width,
      height: PS_FIELD_BOX.height,
      tone: "default",
      fontSizeOverride: 18,
    },
    {
      id: "pso-state",
      label: "Blend / Depth / Raster / RT",
      containerId: "pso-cache",
      x: STATE_FIELD_BOX.x,
      y: STATE_FIELD_BOX.y,
      width: STATE_FIELD_BOX.width,
      height: STATE_FIELD_BOX.height,
      tone: "muted",
      fontSizeOverride: 18,
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
      to: {x: INLINE_RESOURCE_BOX.x, y: cy(INLINE_RESOURCE_BOX)},
      waypoints: [
        {x: right(SHADERMAP_BOX) + 28, y: cy(SHADERMAP_BOX)},
        {x: right(SHADERMAP_BOX) + 28, y: cy(INLINE_RESOURCE_BOX)},
      ],
      tone: "support",
      arrowEnd: true,
    },
    {
      id: "fshader-to-resource-index",
      from: {x: right(FSHADER_BOX), y: cy(FSHADER_BOX)},
      to: {x: cx(RESOURCE_INDEX_BOX), y: RESOURCE_INDEX_BOX.y},
      waypoints: [
        {x: right(FSHADER_BOX) + 66, y: cy(FSHADER_BOX)},
        {x: right(FSHADER_BOX) + 66, y: RESOURCE_INDEX_BOX.y},
      ],
      tone: "support",
      arrowEnd: true,
    },
    {
      id: "resource-index-to-entries",
      from: {x: RESOURCE_INDEX_BOX.x, y: cy(RESOURCE_INDEX_BOX)},
      to: {x: right(SHADER_ENTRIES_BOX), y: cy(SHADER_ENTRIES_BOX)},
      waypoints: [
        {x: RESOURCE_INDEX_BOX.x - 42, y: cy(RESOURCE_INDEX_BOX)},
        {x: RESOURCE_INDEX_BOX.x - 42, y: cy(SHADER_ENTRIES_BOX)},
      ],
      tone: "primary",
      dashed: true,
      arrowEnd: true,
    },
    {
      id: "entries-to-cooked-code",
      from: {x: right(SHADER_ENTRIES_BOX), y: cy(SHADER_ENTRIES_BOX)},
      to: {x: COOKED_CODE_BOX.x, y: cy(COOKED_CODE_BOX)},
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "material-to-proof",
      from: {x: right(MATERIAL_BOX), y: cy(MATERIAL_BOX)},
      to: {x: PROOF_BOX.x, y: cy(PROOF_BOX)},
      waypoints: [{x: right(MATERIAL_BOX) + 104, y: cy(PROOF_BOX)}],
      tone: "support",
      dashed: true,
      arrowEnd: true,
    },
    {
      id: "proof-to-cooked-code",
      from: {x: cx(PROOF_BOX), y: bottom(PROOF_BOX)},
      to: {x: cx(COOKED_CODE_BOX), y: COOKED_CODE_BOX.y},
      tone: "support",
      dashed: true,
      arrowEnd: true,
    },
    {
      id: "pso-vs-to-hashes",
      from: {x: cx(VS_FIELD_BOX), y: VS_FIELD_BOX.y - 4},
      to: {x: SHADER_HASHES_BOX.x + SHADER_HASHES_BOX.width * 0.42, y: bottom(SHADER_HASHES_BOX)},
      waypoints: [
        {x: cx(VS_FIELD_BOX), y: PSO_BOX.y - 30},
        {x: SHADER_HASHES_BOX.x + SHADER_HASHES_BOX.width * 0.42, y: PSO_BOX.y - 30},
      ],
      tone: "primary",
      dashed: true,
      arrowEnd: true,
    },
    {
      id: "pso-ps-to-hashes",
      from: {x: cx(PS_FIELD_BOX), y: PS_FIELD_BOX.y - 4},
      to: {x: SHADER_HASHES_BOX.x + SHADER_HASHES_BOX.width * 0.62, y: bottom(SHADER_HASHES_BOX)},
      waypoints: [
        {x: cx(PS_FIELD_BOX), y: PSO_BOX.y - 52},
        {x: SHADER_HASHES_BOX.x + SHADER_HASHES_BOX.width * 0.62, y: PSO_BOX.y - 52},
      ],
      tone: "primary",
      dashed: true,
      arrowEnd: true,
    },
  ],
};
