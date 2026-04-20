import {describe, expect, it} from "vitest";
import {buildGeometryReviewArtifact} from "../../harness/slide-geometry/review/geometryReviewArtifact";
import {findFormalPageReviewSketchByStepId} from "../../review/formalPageReviewRegistry";

const expectations = [
  {stepId: "page_21", minStageLayout: 6, minMechanicalScore: 6.3},
  {stepId: "page_22", minStageLayout: 6, minMechanicalScore: 6.3},
  {stepId: "page_24", minStageLayout: 6, minMechanicalScore: 6.3},
  {stepId: "page_25", minStageLayout: 6, minMechanicalScore: 6.5},
  {stepId: "page_26", minStageLayout: 6, minMechanicalScore: 6.5},
  {stepId: "page_27", minStageLayout: 6, minMechanicalScore: 6.5},
  {stepId: "page_28", minStageLayout: 5.6, minMechanicalScore: 6.3},
  {stepId: "page_29", minStageLayout: 4.8, minMechanicalScore: 6},
  {stepId: "page_30", minStageLayout: 5, minMechanicalScore: 6},
  {stepId: "page_31", minStageLayout: 6, minMechanicalScore: 6.3},
  {stepId: "page_32", minStageLayout: 6, minMechanicalScore: 6.5},
  {stepId: "page_33", minStageLayout: 6.2, minMechanicalScore: 6},
] as const;

describe("late-tail geometry review", () => {
  expectations.forEach((entry) => {
    it(`${entry.stepId} stays within harness geometry budgets`, () => {
      const reviewSketch = findFormalPageReviewSketchByStepId(entry.stepId);

      expect(reviewSketch).toBeDefined();

      const artifact = buildGeometryReviewArtifact(reviewSketch!);

      expect(artifact.metrics.overlapCount).toBe(0);
      expect(artifact.metrics.crossingCount).toBe(0);
      expect(artifact.metrics.nodePierceCount).toBe(0);
      expect(artifact.metrics.textOverflowCount).toBe(0);
      expect(artifact.metrics.minMargin).toBeGreaterThanOrEqual(24);
      expect(artifact.scores.stageLayout).toBeGreaterThanOrEqual(entry.minStageLayout);
      expect(artifact.mechanicalScore).toBeGreaterThanOrEqual(entry.minMechanicalScore);
    });
  });
});
