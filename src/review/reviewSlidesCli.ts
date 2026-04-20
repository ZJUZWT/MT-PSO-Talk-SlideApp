import {dirname, resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {REMOTION_STEP_SEQUENCE} from "../remotion/sceneTimeline";
import type {StoryStepId} from "../storyboard-data/pso-workbench-types";

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(CURRENT_DIR, "../../..");
const DEFAULT_OUTPUT_DIR_SUFFIX = "/ignore/slide-review/page_19_plus";

export type ReviewSlidesCliArgs = {
  fromStepId: StoryStepId;
  outputDir: string;
  outputDirSuffix: string;
  frontBrowserTextProbe: boolean;
};

export function parseReviewSlidesArgs(argv: string[]): ReviewSlidesCliArgs {
  let fromStepId: StoryStepId = "page_19";
  let outputDir = resolve(REPO_ROOT, `.${DEFAULT_OUTPUT_DIR_SUFFIX}`);
  let frontBrowserTextProbe = false;

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--from") {
      const next = argv[index + 1];
      if (!next || !REMOTION_STEP_SEQUENCE.includes(next as StoryStepId)) {
        throw new Error(`Unknown --from step: ${next ?? "<missing>"}`);
      }
      fromStepId = next as StoryStepId;
      index += 1;
      continue;
    }

    if (token === "--output-dir") {
      const next = argv[index + 1];
      if (!next) {
        throw new Error("Missing value for --output-dir");
      }
      outputDir = next;
      index += 1;
      continue;
    }

    if (token === "--front-browser-text-probe") {
      frontBrowserTextProbe = true;
    }
  }

  return {
    fromStepId,
    outputDir,
    outputDirSuffix: DEFAULT_OUTPUT_DIR_SUFFIX,
    frontBrowserTextProbe,
  };
}
