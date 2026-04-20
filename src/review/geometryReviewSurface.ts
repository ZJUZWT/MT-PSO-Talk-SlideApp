import type {StoryStepId} from "../storyboard-data/pso-workbench-types";
import type {GeometrySketchDefinition} from "../harness/slide-geometry/render/geometry-sketch-types";
import {
  findGeometrySketchByStepId,
  type GeometrySketchId,
  isGeometrySketchId,
  resolveGeometrySketch,
} from "../harness/slide-geometry/registry/sketchRegistry";
import {findFormalPageReviewSketchByStepId} from "./formalPageReviewRegistry";

export type GeometryReviewSurfaceSource = "formal" | "sketch";

export type GeometryReviewSurface = {
  reviewSource: GeometryReviewSurfaceSource;
  sketch: GeometrySketchDefinition;
};

export function findPreferredGeometryReviewSurfaceByStepId(
  stepId: StoryStepId,
): GeometryReviewSurface | null {
  const formalSketch = findFormalPageReviewSketchByStepId(stepId);
  if (formalSketch) {
    return {
      reviewSource: "formal",
      sketch: formalSketch,
    };
  }

  const sketch = findGeometrySketchByStepId(stepId);
  if (sketch) {
    return {
      reviewSource: "sketch",
      sketch,
    };
  }

  return null;
}

export function resolveGeometryReviewSurface(args: {
  stageMode: "story" | "sketch";
  sketchId?: string | null;
  stepId: StoryStepId;
}): GeometryReviewSurface | null {
  if (args.stageMode === "sketch" && isGeometrySketchId(args.sketchId)) {
    return {
      reviewSource: "sketch",
      sketch: resolveGeometrySketch(args.sketchId as GeometrySketchId),
    };
  }

  return findPreferredGeometryReviewSurfaceByStepId(args.stepId);
}
