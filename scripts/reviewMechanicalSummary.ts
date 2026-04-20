import {runPage19PlusReview} from "../src/review/page19PlusReview";
import {collectFrontBrowserGeometryTextProbe} from "../src/review/frontBrowserGeometryTextProbe";
import {buildMechanicalReviewSummary} from "../src/review/reviewMechanicalSummary";
import {parseReviewSlidesArgs} from "../src/review/reviewSlidesCli";

async function main() {
  const args = parseReviewSlidesArgs(process.argv.slice(2));
  let cachedFrontBrowserProbe:
    | Awaited<ReturnType<typeof collectFrontBrowserGeometryTextProbe>>
    | undefined;
  const summary = await runPage19PlusReview({
    fromStepId: args.fromStepId,
    outputDir: args.outputDir,
    resolveBrowserTextProbe: args.frontBrowserTextProbe
      ? async ({stepId}) => {
          if (cachedFrontBrowserProbe === undefined) {
            cachedFrontBrowserProbe = await collectFrontBrowserGeometryTextProbe();
          }

          return cachedFrontBrowserProbe?.stepId === stepId
            ? cachedFrontBrowserProbe
            : null;
        }
      : undefined,
  });

  console.log(
    JSON.stringify(buildMechanicalReviewSummary(summary), null, 2),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
