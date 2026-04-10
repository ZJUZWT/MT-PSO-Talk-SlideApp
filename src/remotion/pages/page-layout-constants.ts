import {resolveRemotionStepFrame} from "../embed";
import type {Box} from "../primitives/diagramTypes";

export const VIEWBOX = {width: 1280, height: 720};

export const PAGE_01_FRAME = resolveRemotionStepFrame("page_01");
export const PAGE_02_FRAME = resolveRemotionStepFrame("page_02");
export const PAGE_03_FRAME = resolveRemotionStepFrame("page_03");
export const PAGE_04_FRAME = resolveRemotionStepFrame("page_04");
export const PAGE_05_FRAME = resolveRemotionStepFrame("page_05");
export const PAGE_06_FRAME = resolveRemotionStepFrame("page_06");
export const PAGE_07_FRAME = resolveRemotionStepFrame("page_07");
export const PAGE_08_FRAME = resolveRemotionStepFrame("page_08");
export const PAGE_09_FRAME = resolveRemotionStepFrame("page_09");

export const PAGE2_LEFT_BOX: Box = {x: 210, y: 316, width: 150, height: 88, radius: 20};
export const PAGE2_CENTER_BOX: Box = {x: 480, y: 304, width: 320, height: 112, radius: 24};
export const PAGE2_RIGHT_BOX: Box = {x: 920, y: 316, width: 150, height: 88, radius: 20};

export const PAGE3_LEFT_BOX: Box = {x: 210, y: 424, width: 150, height: 88, radius: 20};
export const PAGE3_CENTER_BOX: Box = {x: 420, y: 402, width: 440, height: 126, radius: 28};
export const PAGE3_RIGHT_BOX: Box = {x: 920, y: 424, width: 150, height: 88, radius: 20};

export const PAGE3_SHADER_CODE_BOX: Box = {
  x: 286,
  y: 134,
  width: 156,
  height: 54,
  radius: 18,
};
export const PAGE3_SHADER_BINARY_BOX: Box = {
  x: 536,
  y: 134,
  width: 152,
  height: 54,
  radius: 18,
};
export const PAGE3_PROGRAM_BOX: Box = {
  x: 528,
  y: 244,
  width: 152,
  height: 52,
  radius: 18,
};
export const PAGE3_DEPTH_BOX: Box = {
  x: 700,
  y: 134,
  width: 92,
  height: 54,
  radius: 18,
};
export const PAGE3_BLEND_BOX: Box = {
  x: 814,
  y: 134,
  width: 92,
  height: 54,
  radius: 18,
};
export const PAGE4_DESCRIPTION_BOX: Box = {
  x: 460,
  y: 0,
  width: 360,
  height: 44,
  radius: 18,
};
export const PAGE4_PSO_BOX: Box = {
  x: 460,
  y: 0,
  width: 360,
  height: 52,
  radius: 20,
};
export const PAGE5_MESH_BOX: Box = {
  x: 150,
  y: 138,
  width: 112,
  height: 58,
  radius: 18,
};
export const PAGE5_MATERIAL_BOX: Box = {
  x: 336,
  y: 138,
  width: 140,
  height: 58,
  radius: 18,
};
export const PAGE5_COOKED_BOX: Box = {
  x: 566,
  y: 128,
  width: 200,
  height: 76,
  radius: 20,
};
export const PAGE5_BINARY_BOX: Box = {
  x: 566,
  y: 252,
  width: 200,
  height: 76,
  radius: 20,
};
export const PAGE6_ZOOM_PANEL: Box = {
  x: 156,
  y: 92,
  width: 968,
  height: 500,
  radius: 36,
};
export const PAGE6_MATERIAL_BOX: Box = {
  x: 420,
  y: 94,
  width: 280,
  height: 92,
  radius: 20,
};
export const PAGE6_UASSET_FRAME: Box = {
  x: 60,
  y: 36,
  width: 1160,
  height: 540,
  radius: 30,
};
export const PAGE6_PLATFORM_TABLE_BOX: Box = {
  x: 66,
  y: 66,
  width: 336,
  height: 136,
  radius: 18,
};
export const PAGE6_RESOURCE_BOX: Box = {
  x: 420,
  y: 260,
  width: 280,
  height: 92,
  radius: 20,
};
export const PAGE6_RESOURCE_TOP_BOX: Box = {
  x: 436,
  y: 232,
  width: 280,
  height: 72,
  radius: 20,
};
export const PAGE6_RESOURCE_BOTTOM_BOX: Box = {
  x: 428,
  y: 246,
  width: 280,
  height: 72,
  radius: 20,
};
export const PAGE6_RESOURCE_TABLE_BOX: Box = {
  x: 66,
  y: 248,
  width: 336,
  height: 166,
  radius: 18,
};
export const PAGE6_SHADERMAP_BOX: Box = {
  x: 420,
  y: 426,
  width: 280,
  height: 92,
  radius: 20,
};
export const PAGE6_SHADER_TOP_BOX: Box = {
  x: 436,
  y: 396,
  width: 280,
  height: 74,
  radius: 20,
};
export const PAGE6_SHADER_BOTTOM_BOX: Box = {
  x: 428,
  y: 410,
  width: 280,
  height: 74,
  radius: 20,
};
export const PAGE6_SHADER_TABLE_BOX: Box = {
  x: 724,
  y: 172,
  width: 432,
  height: 220,
  radius: 18,
};
export const PAGE6_COOKED_BOX: Box = {
  x: 992,
  y: 426,
  width: 220,
  height: 92,
  radius: 22,
};
export const PAGE7_MATERIAL_BOX: Box = {
  x: 96,
  y: 94,
  width: 280,
  height: 92,
  radius: 20,
};
export const PAGE7_RESOURCE_BOX: Box = {
  x: 96,
  y: 260,
  width: 280,
  height: 92,
  radius: 20,
};
export const PAGE7_RESOURCE_TOP_BOX: Box = {
  x: 112,
  y: 230,
  width: 280,
  height: 72,
  radius: 20,
};
export const PAGE7_RESOURCE_BOTTOM_BOX: Box = {
  x: 104,
  y: 244,
  width: 280,
  height: 72,
  radius: 20,
};
export const PAGE7_SHADERMAP_BOX: Box = {
  x: 96,
  y: 426,
  width: 280,
  height: 92,
  radius: 20,
};
export const PAGE7_SHADER_TOP_BOX: Box = {
  x: 112,
  y: 396,
  width: 280,
  height: 74,
  radius: 20,
};
export const PAGE7_SHADER_BOTTOM_BOX: Box = {
  x: 104,
  y: 410,
  width: 280,
  height: 74,
  radius: 20,
};
export const PAGE7_FSHADER_BOX: Box = {
  x: 559,
  y: 96,
  width: 268,
  height: 108,
  radius: 20,
};
export const PAGE7_RESOURCE_INDEX_BOX: Box = {
  x: 626,
  y: 462,
  width: 158,
  height: 78,
  radius: 20,
};
export const PAGE7_RESOURCE_CODE_BOX: Box = {
  x: 483,
  y: 300,
  width: 416,
  height: 204,
  radius: 20,
};
export const PAGE7_INLINE_RESOURCE_BOX: Box = {
  x: 425,
  y: 242,
  width: 532,
  height: 286,
  radius: 28,
};
export const PAGE7_INLINE_CODE_BOX: Box = {
  x: 992,
  y: 380,
  width: 214,
  height: 92,
  radius: 22,
};
export const PAGE7_COOKED_BOX: Box = {
  x: 1008,
  y: 360,
  width: 184,
  height: 88,
  radius: 22,
};
export const PAGE7_INLINE_ARCHIVE_BOX: Box = {
  x: 812,
  y: 498,
  width: 220,
  height: 88,
  radius: 20,
};
export const PAGE7_CACHE_BOX: Box = {
  x: 36,
  y: 580,
  width: 1160,
  height: 100,
  radius: 22,
};
export const PAGE8_UASSET_FRAME: Box = {
  x: 60,
  y: 72,
  width: 1160,
  height: 472,
  radius: 30,
};
export const PAGE9_UASSET_FRAME: Box = {
  x: 60,
  y: 72,
  width: 500,
  height: 472,
  radius: 30,
};
export const PAGE8_MATERIAL_BOX: Box = {
  x: 76,
  y: 116,
  width: 220,
  height: 72,
  radius: 18,
};
export const PAGE8_RESOURCE_BOX: Box = {
  x: 76,
  y: 238,
  width: 220,
  height: 72,
  radius: 18,
};
export const PAGE8_SHADERMAP_BOX: Box = {
  x: 76,
  y: 360,
  width: 220,
  height: 72,
  radius: 18,
};
export const PAGE8_FSHADER_BOX: Box = {
  x: 506,
  y: 96,
  width: 268,
  height: 108,
  radius: 20,
};
export const PAGE8_INLINE_RESOURCE_BOX: Box = {
  x: 374,
  y: 242,
  width: 532,
  height: 286,
  radius: 28,
};
export const PAGE8_RESOURCE_CODE_BOX: Box = {
  x: 432,
  y: 300,
  width: 416,
  height: 204,
  radius: 20,
};
export const PAGE8_COOKED_BOX: Box = {
  x: 958,
  y: 360,
  width: 184,
  height: 88,
  radius: 22,
};
export const PAGE8_PSO_BOX: Box = {
  x: 170,
  y: 590,
  width: 940,
  height: 100,
  radius: 22,
};
export const PAGE8_LIBRARY_BOX: Box = {
  x: 1026,
  y: 244,
  width: 220,
  height: 176,
  radius: 26,
};
export const PAGE8_SHARED_RESOURCE_BOX: Box = {
  x: 318,
  y: 334,
  width: 214,
  height: 92,
  radius: 22,
};
export const PAGE9_SHARED_RESOURCE_BOX: Box = {
  x: 296,
  y: 348,
  width: 220,
  height: 96,
  radius: 24,
};
export const PAGE8_SHADERMAP_INDEX_BOX: Box = {
  x: 866,
  y: 508,
  width: 134,
  height: 44,
  radius: 16,
};
export const PAGE8_MATERIAL_A_BOX: Box = {
  x: 752,
  y: 164,
  width: 172,
  height: 56,
  radius: 18,
};
export const PAGE8_MATERIAL_B_BOX: Box = {
  x: 752,
  y: 252,
  width: 172,
  height: 56,
  radius: 18,
};
export const PAGE8_MATERIAL_C_BOX: Box = {
  x: 752,
  y: 340,
  width: 172,
  height: 56,
  radius: 18,
};
export const PAGE9_LIBRARY_BOX: Box = {
  x: 620,
  y: 72,
  width: 600,
  height: 472,
  radius: 32,
};
export const PAGE9_MATERIAL_A_BOX: Box = {
  x: 214,
  y: 16,
  width: 160,
  height: 40,
  radius: 12,
};
export const PAGE9_MATERIAL_B_BOX: Box = {
  x: 230,
  y: 6,
  width: 160,
  height: 40,
  radius: 12,
};
export const PAGE9_MATERIAL_C_BOX: Box = {
  x: 246,
  y: -2,
  width: 160,
  height: 40,
  radius: 12,
};
export const PAGE9_FSHADER_BOX: Box = {
  x: 284,
  y: 153,
  width: 256,
  height: 108,
  radius: 20,
};
export const PAGE9_SHADERMAP_ENTRIES_BOX: Box = {
  x: 644,
  y: 316,
  width: 160,
  height: 188,
  radius: 18,
};
export const PAGE9_HASHES_BOX: Box = {
  x: 846,
  y: 316,
  width: 160,
  height: 188,
  radius: 18,
};
export const PAGE9_CODE_BOX: Box = {
  x: 1022,
  y: 316,
  width: 166,
  height: 92,
  radius: 18,
};
