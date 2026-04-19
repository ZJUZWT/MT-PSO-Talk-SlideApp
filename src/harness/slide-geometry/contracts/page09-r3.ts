import {
  PAGE8_MATERIAL_BOX,
  PAGE8_RESOURCE_BOX,
  PAGE8_SHADERMAP_BOX,
  PAGE9_CODE_BOX,
  PAGE9_FSHADER_BOX,
  PAGE9_HASHES_BOX,
  PAGE9_LIBRARY_BOX,
  PAGE9_MATERIAL_A_BOX,
  PAGE9_MATERIAL_B_BOX,
  PAGE9_MATERIAL_C_BOX,
  PAGE9_SHARED_RESOURCE_BOX,
  PAGE9_SHADERMAP_ENTRIES_BOX,
  PAGE9_UASSET_FRAME,
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

const UASSET_BOX = stageBox(PAGE9_UASSET_FRAME);
const MATERIAL_BOX = stageBox(PAGE8_MATERIAL_BOX);
const RESOURCE_BOX = stageBox(PAGE8_RESOURCE_BOX);
const SHADERMAP_BOX = stageBox(PAGE8_SHADERMAP_BOX);
const FSHADER_BOX = stageBox(PAGE9_FSHADER_BOX);
const SHARED_RESOURCE_BOX = stageBox(PAGE9_SHARED_RESOURCE_BOX);
const LIBRARY_BOX = stageBox(PAGE9_LIBRARY_BOX);
const MATERIAL_A_BOX = stageBox(PAGE9_MATERIAL_A_BOX);
const MATERIAL_B_BOX = stageBox(PAGE9_MATERIAL_B_BOX);
const MATERIAL_C_BOX = stageBox(PAGE9_MATERIAL_C_BOX);

const RESOURCE_INDEX_LOCAL = {
  x: PAGE9_FSHADER_BOX.x + PAGE9_FSHADER_BOX.width / 2 - 84,
  y: PAGE9_FSHADER_BOX.y + PAGE9_FSHADER_BOX.height * 0.75 - 15,
  width: 168,
  height: 30,
};
const RESOURCE_INDEX_BOX = stageBox(RESOURCE_INDEX_LOCAL);

const SHADERMAP_INDEX_LOCAL = {
  x: PAGE9_SHARED_RESOURCE_BOX.x + (PAGE9_SHARED_RESOURCE_BOX.width - 192) / 2,
  y: PAGE9_SHARED_RESOURCE_BOX.y + 76 - 14,
  width: 192,
  height: 28,
};
const SHADERMAP_INDEX_BOX = stageBox(SHADERMAP_INDEX_LOCAL);

const LOOKUP_FORMULA_LOCAL = {
  x: PAGE9_SHADERMAP_ENTRIES_BOX.x,
  y: 204,
  width: PAGE9_SHADERMAP_ENTRIES_BOX.width,
  height: 60,
};
const LOOKUP_FORMULA_BOX = stageBox(LOOKUP_FORMULA_LOCAL);

const LIBRARY_INDEX_LOCAL = {
  x: PAGE9_HASHES_BOX.x,
  y: 204,
  width: PAGE9_CODE_BOX.x + PAGE9_CODE_BOX.width - PAGE9_HASHES_BOX.x,
  height: 60,
};
const LIBRARY_INDEX_BOX = stageBox(LIBRARY_INDEX_LOCAL);

const ENTRIES_BOX = stageBox(PAGE9_SHADERMAP_ENTRIES_BOX);
const HASHES_BOX = stageBox(PAGE9_HASHES_BOX);
const CODE_BOX = stageBox(PAGE9_CODE_BOX);

const CODE_SLICE_LOCAL = {
  x: PAGE9_CODE_BOX.x,
  y: PAGE9_CODE_BOX.y + PAGE9_CODE_BOX.height + 8,
  width: PAGE9_CODE_BOX.width,
  height: 92,
};
const CODE_SLICE_BOX = stageBox(CODE_SLICE_LOCAL);

const PSO_BOX = {
  x: 170,
  y: 638.16,
  width: 940,
  height: 100,
};

const VS_HASH_FIELD_X = 378;
const PS_HASH_FIELD_X = 515.6;
const HASH_REF_START_Y = 638.16;

const VS_HASH_TARGET = stagePoint({
  x: PAGE9_HASHES_BOX.x + 48,
  y: PAGE9_HASHES_BOX.y + PAGE9_HASHES_BOX.height,
});
const PS_HASH_TARGET = stagePoint({
  x: PAGE9_HASHES_BOX.x + PAGE9_HASHES_BOX.width - 48,
  y: PAGE9_HASHES_BOX.y + PAGE9_HASHES_BOX.height,
});
const VS_HASH_REF_BEND_Y = VS_HASH_TARGET.y + 28;
const PS_HASH_REF_BEND_Y = PS_HASH_TARGET.y + 14;

const PAGE9_LEFT_COLUMN_SCALE = 0.82;
const PAGE9_LEFT_COLUMN_SHIFT_X = -24;
const PAGE6_OWNERSHIP_LANE_X = PAGE8_MATERIAL_BOX.x + PAGE8_MATERIAL_BOX.width / 2;
const PAGE6_RESOURCE_CENTER_Y = PAGE8_RESOURCE_BOX.y + PAGE8_RESOURCE_BOX.height / 2;

function projectLeftLanePointLocal(point: {x: number; y: number}) {
  return {
    x:
      PAGE6_OWNERSHIP_LANE_X +
      PAGE9_LEFT_COLUMN_SHIFT_X +
      PAGE9_LEFT_COLUMN_SCALE * (point.x - PAGE6_OWNERSHIP_LANE_X),
    y:
      PAGE6_RESOURCE_CENTER_Y +
      PAGE9_LEFT_COLUMN_SCALE * (point.y - PAGE6_RESOURCE_CENTER_Y),
  };
}

const SHADERMAP_BOTTOM_ENTRY_LOCAL = projectLeftLanePointLocal({
  x: PAGE8_SHADERMAP_BOX.x + PAGE8_SHADERMAP_BOX.width / 2,
  y: PAGE8_SHADERMAP_BOX.y + PAGE8_SHADERMAP_BOX.height,
});
const SHARED_ENTRY_LOCAL = {
  x: PAGE9_SHARED_RESOURCE_BOX.x,
  y: PAGE9_SHARED_RESOURCE_BOX.y + PAGE9_SHARED_RESOURCE_BOX.height - 14,
};
const SHARED_ENTRY_PRE_LOCAL = {
  x: SHARED_ENTRY_LOCAL.x - 8,
  y: SHARED_ENTRY_LOCAL.y,
};

const FSHADER_BRANCH_START_LOCAL = {
  x: PAGE9_FSHADER_BOX.x + PAGE9_FSHADER_BOX.width / 2 + 84 + 6,
  y: PAGE9_FSHADER_BOX.y + PAGE9_FSHADER_BOX.height * 0.75,
};
const FSHADER_BRANCH_LANE_X_LOCAL = PAGE9_LIBRARY_BOX.x - 54;
const LOOKUP_TARGET_LOCAL = {
  x: LOOKUP_FORMULA_LOCAL.x - 8,
  y: LOOKUP_FORMULA_LOCAL.y + LOOKUP_FORMULA_LOCAL.height / 2,
};

const SHADERMAP_BRANCH_START_LOCAL = {
  x: PAGE9_SHARED_RESOURCE_BOX.x + PAGE9_SHARED_RESOURCE_BOX.width / 2 + 96 + 6,
  y: PAGE9_SHARED_RESOURCE_BOX.y + 76,
};
const ENTRIES_BRANCH_TARGET_X_LOCAL = PAGE9_SHADERMAP_ENTRIES_BOX.x - 8;

const ENTRIES_TO_LOOKUP_FROM_LOCAL = {
  x: PAGE9_SHADERMAP_ENTRIES_BOX.x + PAGE9_SHADERMAP_ENTRIES_BOX.width / 2,
  y: PAGE9_SHADERMAP_ENTRIES_BOX.y - 8,
};
const ENTRIES_TO_LOOKUP_TO_LOCAL = {
  x: LOOKUP_FORMULA_LOCAL.x + LOOKUP_FORMULA_LOCAL.width / 2,
  y: LOOKUP_FORMULA_LOCAL.y + LOOKUP_FORMULA_LOCAL.height + 4,
};

const LOOKUP_TO_LIBRARY_FROM_LOCAL = {
  x: LOOKUP_FORMULA_LOCAL.x + LOOKUP_FORMULA_LOCAL.width + 10,
  y: LOOKUP_FORMULA_LOCAL.y + LOOKUP_FORMULA_LOCAL.height / 2,
};
const LOOKUP_TO_LIBRARY_TO_LOCAL = {
  x: LIBRARY_INDEX_LOCAL.x - 10,
  y: LOOKUP_TO_LIBRARY_FROM_LOCAL.y,
};

const HASH_TO_LIBRARY_FROM_LOCAL = {
  x: PAGE9_HASHES_BOX.x + PAGE9_HASHES_BOX.width / 2,
  y: PAGE9_HASHES_BOX.y - 8,
};
const HASH_TO_LIBRARY_TO_LOCAL = {
  x: HASH_TO_LIBRARY_FROM_LOCAL.x,
  y: LIBRARY_INDEX_LOCAL.y + LIBRARY_INDEX_LOCAL.height + 4,
};

const LIBRARY_TO_CODE_FROM_LOCAL = {
  x: PAGE9_CODE_BOX.x + PAGE9_CODE_BOX.width / 2,
  y: LIBRARY_INDEX_LOCAL.y + LIBRARY_INDEX_LOCAL.height + 6,
};
const LIBRARY_TO_CODE_TO_LOCAL = {
  x: LIBRARY_TO_CODE_FROM_LOCAL.x,
  y: PAGE9_CODE_BOX.y - 8,
};

const CODE_TO_SLICE_FROM_LOCAL = {
  x: PAGE9_CODE_BOX.x + PAGE9_CODE_BOX.width / 2,
  y: PAGE9_CODE_BOX.y + PAGE9_CODE_BOX.height + 6,
};
const CODE_TO_SLICE_TO_LOCAL = {
  x: CODE_TO_SLICE_FROM_LOCAL.x,
  y: CODE_SLICE_LOCAL.y - 6,
};

const MATERIAL_CARD_DEFS = [
  {box: PAGE9_MATERIAL_C_BOX, inletX: PAGE9_LIBRARY_BOX.x + PAGE9_LIBRARY_BOX.width / 2 + 26},
  {box: PAGE9_MATERIAL_B_BOX, inletX: PAGE9_LIBRARY_BOX.x + PAGE9_LIBRARY_BOX.width / 2},
  {box: PAGE9_MATERIAL_A_BOX, inletX: PAGE9_LIBRARY_BOX.x + PAGE9_LIBRARY_BOX.width / 2 - 26},
];

export const page09R3Sketch: GeometrySketchDefinition = {
  id: "page09-r3",
  label: "page09 formal-code mirror sketch",
  stepId: "page_09",
  contract: {
    pageGoal:
      "Mirror formal page09 exactly: SharedCode Library converges runtime indices and PSO hash proof into one receiver index.",
    receiverPlane: "LibraryShaderIndex in SharedCode Library",
    primaryLine:
      "ResourceIndex + ShaderMapIndex + (VS/PS hash proof) -> LibraryShaderIndex -> ShaderEntries -> Cooked ShaderCode.",
    keepStable:
      "Keep formal page09 memory: left uasset chain, right global library, top material stems, and bottom PSO partial band.",
    newChange:
      "This revision is coordinate-derived from formal constants and transition formulas with stage projection, not manual redraw.",
    doNot:
      "Do not split page09 and do not replace the formal hash-proof branch with ad-hoc direct links.",
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
      tone: "default",
      fontSizeOverride: 20,
    },
    {
      id: "shared-resource",
      labelLines: ["FShaderMapResource_", "SharedCode"],
      label: "FShaderMapResource_SharedCode",
      containerId: "uasset",
      x: SHARED_RESOURCE_BOX.x,
      y: SHARED_RESOURCE_BOX.y,
      width: SHARED_RESOURCE_BOX.width,
      height: SHARED_RESOURCE_BOX.height,
      tone: "receiver",
      fontSizeOverride: 18,
    },
    {
      id: "shadermap-index",
      label: "ShaderMapIndex",
      containerId: "shared-resource",
      x: SHADERMAP_INDEX_BOX.x,
      y: SHADERMAP_INDEX_BOX.y,
      width: SHADERMAP_INDEX_BOX.width,
      height: SHADERMAP_INDEX_BOX.height,
      tone: "default",
      fontSizeOverride: 19,
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
      fontSizeOverride: 20,
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
      fontSizeOverride: 23,
    },
    {
      id: "entries",
      labelLines: ["ShaderMap", "Entries"],
      label: "ShaderMap Entries",
      containerId: "library",
      x: ENTRIES_BOX.x,
      y: ENTRIES_BOX.y,
      width: ENTRIES_BOX.width,
      height: ENTRIES_BOX.height,
      fontSizeOverride: 21,
    },
    {
      id: "hashes",
      labelLines: ["Shader", "HashTable"],
      label: "Shader HashTable",
      containerId: "library",
      x: HASHES_BOX.x,
      y: HASHES_BOX.y,
      width: HASHES_BOX.width,
      height: HASHES_BOX.height,
      tone: "muted",
      fontSizeOverride: 20,
    },
    {
      id: "code",
      label: "ShaderEntries",
      containerId: "library",
      x: CODE_BOX.x,
      y: CODE_BOX.y,
      width: CODE_BOX.width,
      height: CODE_BOX.height,
      fontSizeOverride: 18,
    },
    {
      id: "blob",
      labelLines: ["Cooked", "ShaderCode"],
      label: "Cooked ShaderCode",
      containerId: "library",
      x: CODE_SLICE_BOX.x,
      y: CODE_SLICE_BOX.y,
      width: CODE_SLICE_BOX.width,
      height: CODE_SLICE_BOX.height,
      fontSizeOverride: 18,
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
      from: stagePoint(SHADERMAP_BOTTOM_ENTRY_LOCAL),
      to: stagePoint(SHARED_ENTRY_LOCAL),
      waypoints: [stagePoint({x: SHADERMAP_BOTTOM_ENTRY_LOCAL.x, y: SHARED_ENTRY_LOCAL.y}), stagePoint(SHARED_ENTRY_PRE_LOCAL)],
      tone: "support",
      arrowEnd: true,
    },
    {
      id: "resourceindex-to-lookup",
      from: stagePoint(FSHADER_BRANCH_START_LOCAL),
      to: stagePoint(LOOKUP_TARGET_LOCAL),
      waypoints: [
        stagePoint({x: FSHADER_BRANCH_LANE_X_LOCAL, y: FSHADER_BRANCH_START_LOCAL.y}),
        stagePoint({x: FSHADER_BRANCH_LANE_X_LOCAL, y: LOOKUP_TARGET_LOCAL.y}),
      ],
      tone: "primary",
      dashed: true,
      arrowEnd: true,
    },
    {
      id: "shadermapindex-to-entries",
      from: stagePoint(SHADERMAP_BRANCH_START_LOCAL),
      to: stagePoint({
        x: ENTRIES_BRANCH_TARGET_X_LOCAL,
        y: SHADERMAP_BRANCH_START_LOCAL.y,
      }),
      tone: "primary",
      dashed: true,
      arrowEnd: true,
    },
    {
      id: "entries-to-lookup",
      from: stagePoint(ENTRIES_TO_LOOKUP_FROM_LOCAL),
      to: stagePoint(ENTRIES_TO_LOOKUP_TO_LOCAL),
      tone: "support",
      arrowEnd: true,
    },
    {
      id: "lookup-to-library-index",
      from: stagePoint(LOOKUP_TO_LIBRARY_FROM_LOCAL),
      to: stagePoint(LOOKUP_TO_LIBRARY_TO_LOCAL),
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "hash-to-library-index",
      from: stagePoint(HASH_TO_LIBRARY_FROM_LOCAL),
      to: stagePoint(HASH_TO_LIBRARY_TO_LOCAL),
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "library-index-to-code",
      from: stagePoint(LIBRARY_TO_CODE_FROM_LOCAL),
      to: stagePoint(LIBRARY_TO_CODE_TO_LOCAL),
      tone: "primary",
      arrowEnd: true,
    },
    {
      id: "code-to-blob",
      from: stagePoint(CODE_TO_SLICE_FROM_LOCAL),
      to: stagePoint(CODE_TO_SLICE_TO_LOCAL),
      tone: "support",
      arrowEnd: true,
    },
    {
      id: "pso-vs-to-library-hash",
      from: {x: VS_HASH_FIELD_X, y: HASH_REF_START_Y},
      to: VS_HASH_TARGET,
      waypoints: [
        {x: VS_HASH_FIELD_X, y: VS_HASH_REF_BEND_Y},
        {x: VS_HASH_TARGET.x, y: VS_HASH_REF_BEND_Y},
      ],
      tone: "primary",
      dashed: true,
      arrowEnd: true,
    },
    {
      id: "pso-ps-to-library-hash",
      from: {x: PS_HASH_FIELD_X, y: HASH_REF_START_Y},
      to: PS_HASH_TARGET,
      waypoints: [
        {x: PS_HASH_FIELD_X, y: PS_HASH_REF_BEND_Y},
        {x: PS_HASH_TARGET.x, y: PS_HASH_REF_BEND_Y},
      ],
      tone: "primary",
      dashed: true,
      arrowEnd: true,
    },
    ...MATERIAL_CARD_DEFS.map((entry, index) => {
      const start = stagePoint({
        x: entry.box.x + entry.box.width,
        y: entry.box.y + entry.box.height / 2,
      });
      const elbow = stagePoint({x: entry.inletX, y: entry.box.y + entry.box.height / 2});
      const end = stagePoint({x: entry.inletX, y: PAGE9_LIBRARY_BOX.y});
      return {
        id: `material-${index + 1}-to-library`,
        from: start,
        to: end,
        waypoints: [elbow],
        tone: "support" as const,
        arrowEnd: true,
      };
    }),
  ],
};
