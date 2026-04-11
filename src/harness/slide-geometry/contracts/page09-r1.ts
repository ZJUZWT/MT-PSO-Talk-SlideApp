import {PAGE9_UASSET_FRAME} from "../../../remotion/pages/page-layout-constants";
import type {GeometrySketchDefinition} from "../render/geometry-sketch-types";

const UASSET_BOX = {
  x: PAGE9_UASSET_FRAME.x - 12,
  y: 122,
  width: PAGE9_UASSET_FRAME.width + 20,
  height: 422,
};

const LIBRARY_BOX = {
  x: 632,
  y: 122,
  width: 600,
  height: 422,
};

const MATERIAL_BOX = {
  x: 70,
  y: 158,
  width: 198,
  height: 68,
};

const RESOURCE_BOX = {
  x: 70,
  y: 272,
  width: 198,
  height: 68,
};

const SHADERMAP_BOX = {
  x: 70,
  y: 386,
  width: 198,
  height: 68,
};

const FSHADER_BOX = {
  x: 314,
  y: 160,
  width: 230,
  height: 116,
};

const RESOURCE_INDEX_BOX = {
  x: 342,
  y: 226,
  width: 180,
  height: 42,
};

const SHARED_RESOURCE_BOX = {
  x: 298,
  y: 388,
  width: 270,
  height: 118,
};

const SHADERMAP_INDEX_BOX = {
  x: 336,
  y: 460,
  width: 194,
  height: 40,
};

const MATERIAL_A_BOX = {
  x: 656,
  y: 40,
  width: 160,
  height: 44,
};

const MATERIAL_B_BOX = {
  x: 862,
  y: 40,
  width: 160,
  height: 44,
};

const MATERIAL_C_BOX = {
  x: 1068,
  y: 40,
  width: 160,
  height: 44,
};

const LOOKUP_FORMULA_BOX = {
  x: 650,
  y: 216,
  width: 188,
  height: 64,
};

const LIBRARY_INDEX_BOX = {
  x: 864,
  y: 216,
  width: 330,
  height: 68,
};

const ENTRIES_BOX = {
  x: 660,
  y: 324,
  width: 168,
  height: 180,
};

const HASHES_BOX = {
  x: 868,
  y: 324,
  width: 168,
  height: 180,
};

const CODE_BOX = {
  x: 1060,
  y: 320,
  width: 152,
  height: 84,
};

const BLOB_BOX = {
  x: 1060,
  y: 440,
  width: 152,
  height: 72,
};

const PSO_BOX = {
  x: 146,
  y: 608,
  width: 960,
  height: 72,
};

function boxCenterX(box: {x: number; width: number}) {
  return box.x + box.width / 2;
}

function boxCenterY(box: {y: number; height: number}) {
  return box.y + box.height / 2;
}

function boxRight(box: {x: number; width: number}) {
  return box.x + box.width;
}

function boxBottom(box: {y: number; height: number}) {
  return box.y + box.height;
}

export const page09R1Sketch: GeometrySketchDefinition = {
  id: "page09-r1",
  label: "SharedCode page09 mirror sketch",
  stepId: "page_09",
  contract: {
    pageGoal: "Mirror formal page09 as a single convergence page with two co-main routes into LibraryShaderIndex.",
    receiverPlane: "SharedCode Library",
    primaryLine:
      "ResourceIndex + ShaderMapIndex / VS+PS Hash -> LibraryShaderIndex -> ShaderEntries -> Cooked ShaderCode",
    keepStable: "Keep page09 as one page and preserve PSO Cache as a co-main route.",
    newChange: "Mirror the formal page with a top material band, left runtime indices, and a bottom PSO hash lane.",
    doNot: "Do not demote the PSO Cache path or merge the runtime indices into a fake summary node.",
  },
  nodes: [
    {
      id: "material-a",
      label: "Material A",
      x: MATERIAL_A_BOX.x,
      y: MATERIAL_A_BOX.y,
      width: MATERIAL_A_BOX.width,
      height: MATERIAL_A_BOX.height,
      tone: "muted",
    },
    {
      id: "material-b",
      label: "Material B",
      x: MATERIAL_B_BOX.x,
      y: MATERIAL_B_BOX.y,
      width: MATERIAL_B_BOX.width,
      height: MATERIAL_B_BOX.height,
      tone: "muted",
    },
    {
      id: "material-c",
      label: "Material C",
      x: MATERIAL_C_BOX.x,
      y: MATERIAL_C_BOX.y,
      width: MATERIAL_C_BOX.width,
      height: MATERIAL_C_BOX.height,
      tone: "muted",
    },
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
      id: "resource-index",
      label: "ResourceIndex",
      containerId: "fshader",
      x: RESOURCE_INDEX_BOX.x,
      y: RESOURCE_INDEX_BOX.y,
      width: RESOURCE_INDEX_BOX.width,
      height: RESOURCE_INDEX_BOX.height,
    },
    {
      id: "shared-resource",
      label: "FShaderMapResource_SharedCode",
      containerId: "uasset",
      x: SHARED_RESOURCE_BOX.x,
      y: SHARED_RESOURCE_BOX.y,
      width: SHARED_RESOURCE_BOX.width,
      height: SHARED_RESOURCE_BOX.height,
      tone: "receiver",
    },
    {
      id: "shadermap-index",
      label: "ShaderMapIndex",
      containerId: "shared-resource",
      x: SHADERMAP_INDEX_BOX.x,
      y: SHADERMAP_INDEX_BOX.y,
      width: SHADERMAP_INDEX_BOX.width,
      height: SHADERMAP_INDEX_BOX.height,
    },
    {
      id: "library",
      label: "SharedCode Library",
      x: LIBRARY_BOX.x,
      y: LIBRARY_BOX.y,
      width: LIBRARY_BOX.width,
      height: LIBRARY_BOX.height,
      tone: "receiver",
    },
    {
      id: "lookup-formula",
      label: "ShaderIndices",
      containerId: "library",
      x: LOOKUP_FORMULA_BOX.x,
      y: LOOKUP_FORMULA_BOX.y,
      width: LOOKUP_FORMULA_BOX.width,
      height: LOOKUP_FORMULA_BOX.height,
    },
    {
      id: "library-index",
      label: "LibraryShaderIndex",
      containerId: "library",
      x: LIBRARY_INDEX_BOX.x,
      y: LIBRARY_INDEX_BOX.y,
      width: LIBRARY_INDEX_BOX.width,
      height: LIBRARY_INDEX_BOX.height,
      tone: "receiver",
    },
    {
      id: "entries",
      label: "ShaderMapEntries",
      containerId: "library",
      x: ENTRIES_BOX.x,
      y: ENTRIES_BOX.y,
      width: ENTRIES_BOX.width,
      height: ENTRIES_BOX.height,
    },
    {
      id: "hashes",
      label: "ShaderHashTable",
      containerId: "library",
      x: HASHES_BOX.x,
      y: HASHES_BOX.y,
      width: HASHES_BOX.width,
      height: HASHES_BOX.height,
      tone: "muted",
    },
    {
      id: "code",
      label: "ShaderEntries",
      containerId: "library",
      x: CODE_BOX.x,
      y: CODE_BOX.y,
      width: CODE_BOX.width,
      height: CODE_BOX.height,
    },
    {
      id: "blob",
      label: "Cooked ShaderCode",
      containerId: "library",
      x: BLOB_BOX.x,
      y: BLOB_BOX.y,
      width: BLOB_BOX.width,
      height: BLOB_BOX.height,
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
      from: {x: boxCenterX(MATERIAL_BOX), y: boxBottom(MATERIAL_BOX)},
      to: {x: boxCenterX(RESOURCE_BOX), y: RESOURCE_BOX.y},
      tone: "support",
    },
    {
      id: "resource-to-shadermap",
      from: {x: boxCenterX(RESOURCE_BOX), y: boxBottom(RESOURCE_BOX)},
      to: {x: boxCenterX(SHADERMAP_BOX), y: SHADERMAP_BOX.y},
      tone: "support",
    },
    {
      id: "shadermap-to-shared",
      from: {x: boxRight(SHADERMAP_BOX), y: boxCenterY(SHADERMAP_BOX)},
      to: {x: SHARED_RESOURCE_BOX.x, y: boxCenterY(SHADERMAP_BOX)},
      tone: "support",
    },
    {
      id: "resourceindex-to-lookup",
      from: {x: boxRight(RESOURCE_INDEX_BOX), y: boxCenterY(RESOURCE_INDEX_BOX)},
      to: {x: LOOKUP_FORMULA_BOX.x, y: boxCenterY(LOOKUP_FORMULA_BOX)},
      tone: "primary",
      dashed: true,
    },
    {
      id: "shadermapindex-to-entries",
      from: {x: boxRight(SHADERMAP_INDEX_BOX), y: boxCenterY(SHADERMAP_INDEX_BOX)},
      to: {x: ENTRIES_BOX.x, y: boxCenterY(SHADERMAP_INDEX_BOX)},
      tone: "primary",
      dashed: true,
    },
    {
      id: "entries-to-lookup",
      from: {x: boxCenterX(ENTRIES_BOX), y: ENTRIES_BOX.y},
      to: {x: boxCenterX(LOOKUP_FORMULA_BOX), y: boxBottom(LOOKUP_FORMULA_BOX)},
      tone: "support",
    },
    {
      id: "lookup-to-library-index",
      from: {x: boxRight(LOOKUP_FORMULA_BOX), y: boxCenterY(LOOKUP_FORMULA_BOX)},
      to: {x: LIBRARY_INDEX_BOX.x, y: boxCenterY(LIBRARY_INDEX_BOX)},
      tone: "primary",
    },
    {
      id: "pso-to-hash",
      from: {x: boxCenterX(HASHES_BOX), y: PSO_BOX.y},
      to: {x: boxCenterX(HASHES_BOX), y: boxBottom(HASHES_BOX)},
      tone: "primary",
      dashed: true,
    },
    {
      id: "hash-to-library-index",
      from: {x: boxCenterX(HASHES_BOX), y: HASHES_BOX.y},
      to: {x: boxCenterX(HASHES_BOX), y: boxBottom(LIBRARY_INDEX_BOX)},
      tone: "primary",
    },
    {
      id: "library-index-to-code",
      from: {x: boxCenterX(CODE_BOX), y: boxBottom(LIBRARY_INDEX_BOX)},
      to: {x: boxCenterX(CODE_BOX), y: CODE_BOX.y},
      tone: "primary",
    },
    {
      id: "code-to-blob",
      from: {x: boxCenterX(CODE_BOX), y: boxBottom(CODE_BOX)},
      to: {x: boxCenterX(BLOB_BOX), y: BLOB_BOX.y},
      tone: "primary",
    },
    {
      id: "material-a-to-library",
      from: {x: boxCenterX(MATERIAL_A_BOX), y: boxBottom(MATERIAL_A_BOX)},
      to: {x: boxCenterX(MATERIAL_A_BOX), y: LIBRARY_BOX.y},
      tone: "support",
    },
    {
      id: "material-b-to-library",
      from: {x: boxCenterX(MATERIAL_B_BOX), y: boxBottom(MATERIAL_B_BOX)},
      to: {x: boxCenterX(MATERIAL_B_BOX), y: LIBRARY_BOX.y},
      tone: "support",
    },
    {
      id: "material-c-to-library",
      from: {x: boxCenterX(MATERIAL_C_BOX), y: boxBottom(MATERIAL_C_BOX)},
      to: {x: boxCenterX(MATERIAL_C_BOX), y: LIBRARY_BOX.y},
      tone: "support",
    },
  ],
};
