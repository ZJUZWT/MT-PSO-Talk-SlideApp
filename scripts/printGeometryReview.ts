import {
  isGeometrySketchId,
  resolveGeometrySketch,
} from "../src/harness/slide-geometry/registry/sketchRegistry";
import {buildGeometryReviewArtifact} from "../src/harness/slide-geometry/review/geometryReviewArtifact";
import {buildGeometryReviewSummary} from "../src/review/geometryReviewSummary";

function printSketchReview(sketchId: string) {
  if (!isGeometrySketchId(sketchId)) {
    throw new Error(`Unknown sketch id: ${sketchId}`);
  }

  const sketch = resolveGeometrySketch(sketchId);
  const artifact = buildGeometryReviewArtifact(sketch);
  const output = buildGeometryReviewSummary({
    sketchId,
    stepId: sketch.stepId,
    label: sketch.label,
    artifact,
  });

  console.log(JSON.stringify(output, null, 2));
}

const sketchIds = process.argv.slice(2);
if (sketchIds.length === 0) {
  console.error("Usage: vite-node scripts/printGeometryReview.ts <sketch-id> [<sketch-id> ...]");
  process.exit(1);
}

for (const sketchId of sketchIds) {
  printSketchReview(sketchId);
}
