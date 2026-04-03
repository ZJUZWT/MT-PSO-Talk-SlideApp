import {readFileSync} from "node:fs";
import {join} from "node:path";
import {describe, expect, it} from "vitest";

const appCss = readFileSync(join(process.cwd(), "src", "app.css"), "utf8");

function readRuleBlock(selector: string) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = appCss.match(new RegExp(`${escapedSelector}\\s*\\{([\\s\\S]*?)\\n\\}`, "m"));

  expect(match, `Missing CSS rule for ${selector}`).not.toBeNull();

  return match?.[1] ?? "";
}

describe("app.css regressions", () => {
  it("lets the rail container show the active bubble glow", () => {
    expect(readRuleBlock(".progress-rail-window")).toMatch(/overflow:\s*visible;/);
  });

  it("avoids paint containment on animated notes card layers", () => {
    const notesCardLayerRule = readRuleBlock(".notes-card-layer");

    expect(notesCardLayerRule).not.toMatch(/contain:\s*layout paint;/);
    expect(notesCardLayerRule).toMatch(/contain:\s*layout;/);
  });

  it("widens the notes column through shell layout variables", () => {
    const workbenchMainRule = readRuleBlock(".workbench-main");

    expect(workbenchMainRule).toMatch(
      /grid-template-columns:\s*minmax\(var\(--notes-column-min,\s*22rem\),\s*var\(--notes-column-max,\s*30rem\)\)\s+minmax\(0,\s*var\(--stage-column-fr,\s*0\.94fr\)\);/,
    );
  });

  it("uses a slower ease-in pull-away curve for notes cards", () => {
    expect(
      readRuleBlock(
        '.notes-card-layer--outgoing[data-has-step="true"][data-stack-role="front"][data-motion-axis="vertical"][data-motion-direction="forward"],\n.notes-card-layer--outgoing[data-has-step="true"][data-stack-role="front"][data-motion-axis="vertical"][data-motion-direction="backward"]',
      ),
    ).toMatch(/cubic-bezier\(0\.55,\s*0\.055,\s*0\.675,\s*0\.19\)/);
  });
});
