import {PAGE9_UASSET_FRAME} from "../../../remotion/pages/page-layout-constants";
import type {GeometrySketchDefinition} from "../render/geometry-sketch-types";

const UASSET_BOX = {
  x: PAGE9_UASSET_FRAME.x - 12,
  y: 122,
  width: PAGE9_UASSET_FRAME.width + 24,
  height: 418,
};

const LIBRARY_BOX = {
  x: 620,
  y: 120,
  width: 612,
  height: 420,
};

const MATERIAL_BOX = {
  x: 72,
  y: 156,
  width: 210,
  height: 66,
};

const RESOURCE_BOX = {
  x: 72,
  y: 266,
  width: 210,
  height: 66,
};

const SHADERMAP_BOX = {
  x: 72,
  y: 376,
  width: 210,
  height: 66,
};

const FSHADER_BOX = {
  x: 312,
  y: 156,
  width: 242,
  height: 124,
};

const RESOURCE_INDEX_BOX = {
  x: 350,
  y: 236,
  width: 184,
  height: 44,
};

const SHARED_RESOURCE_BOX = {
  x: 296,
  y: 364,
  width: 280,
  height: 140,
};

const SHADERMAP_INDEX_BOX = {
  x: 344,
  y: 408,
  width: 202,
  height: 42,
};

const MATERIAL_A_BOX = {
  x: 654,
  y: 42,
  width: 170,
  height: 44,
};

const MATERIAL_B_BOX = {
  x: 862,
  y: 42,
  width: 170,
  height: 44,
};

const MATERIAL_C_BOX = {
  x: 1070,
  y: 42,
  width: 170,
  height: 44,
};

const LOOKUP_FORMULA_BOX = {
  x: 652,
  y: 224,
  width: 196,
  height: 68,
};

const LIBRARY_INDEX_BOX = {
  x: 878,
  y: 224,
  width: 332,
  height: 72,
};

const ENTRIES_BOX = {
  x: 666,
  y: 338,
  width: 174,
  height: 180,
};

const HASHES_BOX = {
  x: 890,
  y: 338,
  width: 176,
  height: 180,
};

const CODE_BOX = {
  x: 1106,
  y: 332,
  width: 116,
  height: 90,
};

const BLOB_BOX = {
  x: 1106,
  y: 452,
  width: 116,
  height: 70,
};

const PSO_BOX = {
  x: 156,
  y: 578,
  width: 954,
  height: 78,
};

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

export const page09R2Sketch: GeometrySketchDefinition = {
  id: "page09-r2",
  label: "SharedCode page09 mirror sketch r2",
  stepId: "page_09",
  contract: {
    pageGoal:
      "Mirror formal page09 as a single convergence page where runtime index and PSO hash paths meet at LibraryShaderIndex.",
    receiverPlane: "SharedCode Library",
    primaryLine:
      "ResourceIndex + ShaderMapIndex / VS+PS Hash -> LibraryShaderIndex -> ShaderEntries -> Cooked ShaderCode",
    keepStable:
      "Keep page09 as one page and preserve the PSO cache hash route as a co-main path.",
    newChange:
      "Increase library-side spacing, raise readability of hash/code lanes, and clean anchor centering on key lines.",
    doNot:
      "Do not split into two pages and do not weaken the PSO hash branch significance.",
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
      id: "shadermap-to-shared",
      from: {x: right(SHADERMAP_BOX), y: cy(SHADERMAP_BOX)},
      to: {x: SHARED_RESOURCE_BOX.x, y: cy(SHARED_RESOURCE_BOX)},
      waypoints: [
        {x: right(SHADERMAP_BOX) + 30, y: cy(SHADERMAP_BOX)},
        {x: right(SHADERMAP_BOX) + 30, y: cy(SHARED_RESOURCE_BOX)},
      ],
      tone: "support",
      arrowEnd: true,
    },
    {
      id: "resourceindex-to-lookup",
      from: {x: right(RESOURCE_INDEX_BOX), y: cy(RESOURCE_INDEX_BOX)},
      to: {x: LOOKUP_FORMULA_BOX.x, y: cy(LOOKUP_FORMULA_BOX)},
      tone: "primary",
      dashed: true,
      arrowEnd: true,
    },
    {
      id: "shadermapindex-to-entries",
      from: {x: right(SHADERMAP_INDEX_BOX), y: cy(SHADERMAP_INDEX_BOX)},
      to: {x: ENTRIES_BOX.x, y: cy(ENTRIES_BOX)},
      waypoints: [{x: 620, y: cy(SHADERMAP_INDEX_BOX)}, {x: 620, y: cy(ENTRIES_BOX)}],
      tone: "primary",
      dashed: true,
      arrowEnd: true,
    },
    {
      id: "entries-to-lookup",
      from: {x: cx(ENTRIES_BOX), y: ENTRIES_BOX.y},
      to: {x: cx(LOOKUP_FORMULA_BOX), y: bottom(LOOKUP_FORMULA_BOX)},
      tone: "support",
      arrowEnd: true,
    },
    {
      id: "lookup-to-library-index",
      from: {x: right(LOOKUP_FORMULA_BOX), y: cy(LOOKUP_FORMULA_BOX)},
      to: {x: LIBRARY_INDEX_BOX.x, y: cy(LIBRARY_INDEX_BOX)},
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "pso-to-hash",
      from: {x: cx(HASHES_BOX), y: PSO_BOX.y},
      to: {x: cx(HASHES_BOX), y: bottom(HASHES_BOX)},
      tone: "primary",
      dashed: true,
      arrowEnd: true,
    },
    {
      id: "hash-to-library-index",
      from: {x: cx(HASHES_BOX), y: HASHES_BOX.y},
      to: {x: cx(HASHES_BOX), y: bottom(LIBRARY_INDEX_BOX)},
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "library-index-to-code",
      from: {x: cx(CODE_BOX), y: bottom(LIBRARY_INDEX_BOX)},
      to: {x: cx(CODE_BOX), y: CODE_BOX.y},
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "code-to-blob",
      from: {x: cx(CODE_BOX), y: bottom(CODE_BOX)},
      to: {x: cx(BLOB_BOX), y: BLOB_BOX.y},
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "material-a-to-library",
      from: {x: cx(MATERIAL_A_BOX), y: bottom(MATERIAL_A_BOX)},
      to: {x: cx(MATERIAL_A_BOX), y: LIBRARY_BOX.y},
      tone: "support",
      arrowEnd: true,
    },
    {
      id: "material-b-to-library",
      from: {x: cx(MATERIAL_B_BOX), y: bottom(MATERIAL_B_BOX)},
      to: {x: cx(MATERIAL_B_BOX), y: LIBRARY_BOX.y},
      tone: "support",
      arrowEnd: true,
    },
    {
      id: "material-c-to-library",
      from: {x: cx(MATERIAL_C_BOX), y: bottom(MATERIAL_C_BOX)},
      to: {x: cx(MATERIAL_C_BOX), y: LIBRARY_BOX.y},
      tone: "support",
      arrowEnd: true,
    },
  ],
};
