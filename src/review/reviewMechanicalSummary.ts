import type {
  Page19PlusReviewSummary,
  ReviewPageEntry,
  ReviewTransitionEntry,
} from "./page19PlusReview";
import type {GeometryReviewSummary} from "./geometryReviewSummary";

export type MechanicalReviewBlockerPage = {
  stepId: string;
  reviewSource: string;
  sketchId: string;
  mechanicalScore: string;
  verdict: string;
  topFixes: string[];
};

export type MechanicalReviewPageResult =
  | {
      stepId: string;
      status: "ok";
      reviewSource: string;
      sketchId: string;
      mechanicalScore: string;
      verdict: string;
      blockerOpen: boolean;
      topFixes: string[];
      threeLayerReview: GeometryReviewSummary["threeLayerReview"];
    }
  | {
      stepId: string;
      status: "missing_sketch";
    };

export type MechanicalReviewSummary = {
  from_step_id: string;
  reviewed_page_count: number;
  transition_count: number;
  has_blocker_pages: boolean;
  blocker_pages: MechanicalReviewBlockerPage[];
  page_results: MechanicalReviewPageResult[];
  timing_summary: {
    ok_count: number;
    missing_workload_count: number;
    probe_issue_count: number;
    verdict_counts: Record<string, number>;
  };
};

function toPageResult(entry: ReviewPageEntry): MechanicalReviewPageResult {
  if (entry.status !== "ok") {
    return {
      stepId: entry.stepId,
      status: "missing_sketch",
    };
  }

  return {
    stepId: entry.stepId,
    status: "ok",
    reviewSource: entry.reviewSource,
    sketchId: entry.sketchId,
    mechanicalScore: entry.summary.mechanicalScore,
    verdict: entry.summary.verdict,
    blockerOpen: entry.summary.scoreBands.blockerOpen,
    topFixes: entry.summary.topFixes.slice(0, 3),
    threeLayerReview: entry.summary.threeLayerReview,
  };
}

function collectTimingVerdicts(
  transitions: ReviewTransitionEntry[],
): Record<string, number> {
  return transitions.reduce<Record<string, number>>((counts, entry) => {
    if (entry.status !== "ok") {
      return counts;
    }

    const verdict = entry.timing.verdict;
    counts[verdict] = (counts[verdict] ?? 0) + 1;
    return counts;
  }, {});
}

export function buildMechanicalReviewSummary(
  summary: Page19PlusReviewSummary,
): MechanicalReviewSummary {
  const pageResults = summary.pages.map(toPageResult);
  const blockerPages = pageResults
    .filter((entry): entry is Extract<MechanicalReviewPageResult, {status: "ok"}> =>
      entry.status === "ok" && entry.blockerOpen,
    )
    .map((entry) => ({
      stepId: entry.stepId,
      reviewSource: entry.reviewSource,
      sketchId: entry.sketchId,
      mechanicalScore: entry.mechanicalScore,
      verdict: entry.verdict,
      topFixes: entry.topFixes,
    }));

  return {
    from_step_id: summary.fromStepId,
    reviewed_page_count: summary.pages.length,
    transition_count: summary.transitions.length,
    has_blocker_pages: blockerPages.length > 0,
    blocker_pages: blockerPages,
    page_results: pageResults,
    timing_summary: {
      ok_count: summary.transitions.filter((entry) => entry.status === "ok").length,
      missing_workload_count: summary.transitions.filter(
        (entry) => entry.status === "missing_workload",
      ).length,
      probe_issue_count: summary.transitions.filter(
        (entry) => entry.status === "probe_error" || entry.status === "probe_not_requested",
      ).length,
      verdict_counts: collectTimingVerdicts(summary.transitions),
    },
  };
}
