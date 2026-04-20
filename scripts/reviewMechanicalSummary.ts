import {runPage19PlusReview} from "../src/review/page19PlusReview";
import {buildMechanicalReviewSummary} from "../src/review/reviewMechanicalSummary";
import {parseReviewSlidesArgs} from "../src/review/reviewSlidesCli";

async function main() {
  const args = parseReviewSlidesArgs(process.argv.slice(2));
  const summary = await runPage19PlusReview({
    fromStepId: args.fromStepId,
    outputDir: args.outputDir,
  });

  console.log(
    JSON.stringify(buildMechanicalReviewSummary(summary), null, 2),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
