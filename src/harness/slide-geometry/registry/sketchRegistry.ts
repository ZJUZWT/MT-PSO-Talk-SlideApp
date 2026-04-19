import {page08R2Sketch} from "../contracts/page08-r2";
import {page08R3Sketch} from "../contracts/page08-r3";
import {page09R1Sketch} from "../contracts/page09-r1";
import {page09R2Sketch} from "../contracts/page09-r2";
import {page09R3Sketch} from "../contracts/page09-r3";
import {page10R1Sketch} from "../contracts/page10-r1";
import {page11R1Sketch} from "../contracts/page11-r1";
import {page12R1Sketch} from "../contracts/page12-r1";
import {page13R1Sketch} from "../contracts/page13-r1";
import {page14R1Sketch} from "../contracts/page14-r1";
import {page15R1Sketch} from "../contracts/page15-r1";
import type {GeometrySketchDefinition} from "../render/geometry-sketch-types";

const SKETCH_REGISTRY: Record<string, GeometrySketchDefinition> = {
  [page08R2Sketch.id]: page08R2Sketch,
  [page08R3Sketch.id]: page08R3Sketch,
  [page09R1Sketch.id]: page09R1Sketch,
  [page09R2Sketch.id]: page09R2Sketch,
  [page09R3Sketch.id]: page09R3Sketch,
  [page10R1Sketch.id]: page10R1Sketch,
  [page11R1Sketch.id]: page11R1Sketch,
  [page12R1Sketch.id]: page12R1Sketch,
  [page13R1Sketch.id]: page13R1Sketch,
  [page14R1Sketch.id]: page14R1Sketch,
  [page15R1Sketch.id]: page15R1Sketch,
};

export type GeometrySketchId = keyof typeof SKETCH_REGISTRY;

export function isGeometrySketchId(
  value: string | null | undefined,
): value is GeometrySketchId {
  return Boolean(value && value in SKETCH_REGISTRY);
}

export function resolveGeometrySketch(
  sketchId: GeometrySketchId,
): GeometrySketchDefinition {
  return SKETCH_REGISTRY[sketchId];
}
