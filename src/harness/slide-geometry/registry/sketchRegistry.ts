import {page09R1Sketch} from "../contracts/page09-r1";
import type {GeometrySketchDefinition} from "../render/geometry-sketch-types";

const SKETCH_REGISTRY: Record<string, GeometrySketchDefinition> = {
  [page09R1Sketch.id]: page09R1Sketch,
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
