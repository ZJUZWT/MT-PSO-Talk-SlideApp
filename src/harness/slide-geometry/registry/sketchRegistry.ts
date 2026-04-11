import {page09R1Sketch} from "../contracts/page09-r1";
import {page10R1Sketch} from "../contracts/page10-r1";
import {page11R1Sketch} from "../contracts/page11-r1";
import {page12R1Sketch} from "../contracts/page12-r1";
import {page13R1Sketch} from "../contracts/page13-r1";
import {page14ContractR1Sketch} from "../contracts/page14-contract-r1";
import type {GeometrySketchDefinition} from "../render/geometry-sketch-types";

const SKETCH_REGISTRY: Record<string, GeometrySketchDefinition> = {
  [page09R1Sketch.id]: page09R1Sketch,
  [page10R1Sketch.id]: page10R1Sketch,
  [page11R1Sketch.id]: page11R1Sketch,
  [page12R1Sketch.id]: page12R1Sketch,
  [page13R1Sketch.id]: page13R1Sketch,
  [page14ContractR1Sketch.id]: page14ContractR1Sketch,
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
