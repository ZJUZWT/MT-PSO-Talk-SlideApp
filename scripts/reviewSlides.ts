import {parseReviewSlidesArgs} from "../src/review/reviewSlidesCli";
import {runPage19PlusReview} from "../src/review/page19PlusReview";

function printSummary(summary: Awaited<ReturnType<typeof runPage19PlusReview>>) {
  console.log(`Review scope: ${summary.fromStepId} -> ${summary.stepIds.at(-1)}`);
  console.log(`Pages reviewed: ${summary.pages.length}`);
  console.log(`Transitions reviewed: ${summary.transitions.length}`);

  const okPages = summary.pages.filter((entry) => entry.status === "ok").length;
  const missingSketches = summary.pages.filter(
    (entry) => entry.status === "missing_sketch",
  ).length;
  const okTransitions = summary.transitions.filter(
    (entry) => entry.status === "ok",
  ).length;
  const missingWorkloads = summary.transitions.filter(
    (entry) => entry.status === "missing_workload",
  ).length;
  const probeIssues = summary.transitions.filter(
    (entry) => entry.status === "probe_error" || entry.status === "probe_not_requested",
  ).length;

  console.log(`Geometry: ${okPages} ok, ${missingSketches} missing_sketch`);
  console.log(
    `Timing: ${okTransitions} ok, ${missingWorkloads} missing_workload, ${probeIssues} probe_issue`,
  );
}

async function main() {
  const args = parseReviewSlidesArgs(process.argv.slice(2));
  const summary = await runPage19PlusReview({
    fromStepId: args.fromStepId,
    outputDir: args.outputDir,
  });
  printSummary(summary);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 0;
});
