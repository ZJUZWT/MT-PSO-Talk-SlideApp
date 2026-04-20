import {execFile} from "node:child_process";
import {dirname, resolve} from "node:path";
import {promisify} from "node:util";
import {fileURLToPath} from "node:url";
import type {BrowserGeometryTextProbe} from "../harness/slide-geometry/review/browserGeometryTextProbe";

const execFileAsync = promisify(execFile);
const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(CURRENT_DIR, "../../..");
const FRONT_BROWSER_PROBE_SCRIPT = resolve(
  REPO_ROOT,
  "scripts/slide-geometry-harness/probe_front_browser_geometry_text.py",
);

export type FrontBrowserGeometryTextProbe = BrowserGeometryTextProbe & {
  stepId?: string | null;
  sourceUrl?: string;
};

export async function collectFrontBrowserGeometryTextProbe(): Promise<FrontBrowserGeometryTextProbe | null> {
  try {
    const {stdout} = await execFileAsync(
      "python3",
      [FRONT_BROWSER_PROBE_SCRIPT],
      {
        cwd: REPO_ROOT,
        maxBuffer: 1024 * 1024 * 8,
      },
    );
    const raw = stdout.trim();
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as FrontBrowserGeometryTextProbe;
  } catch {
    return null;
  }
}
