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

  it("uses the original slower pull-away timing for notes cards", () => {
    expect(
      readRuleBlock(
        '.notes-card-layer--outgoing[data-has-step="true"][data-stack-role="front"][data-motion-axis="vertical"][data-motion-direction="forward"],\n.notes-card-layer--outgoing[data-has-step="true"][data-stack-role="front"][data-motion-axis="vertical"][data-motion-direction="backward"]',
      ),
    ).toMatch(/notes-card-slide-away/);
    expect(
      readRuleBlock(
        '.notes-card-layer--outgoing[data-has-step="true"][data-stack-role="front"][data-motion-axis="vertical"][data-motion-direction="forward"],\n.notes-card-layer--outgoing[data-has-step="true"][data-stack-role="front"][data-motion-axis="vertical"][data-motion-direction="backward"]',
      ),
    ).toMatch(/cubic-bezier\(0\.55,\s*0\.055,\s*0\.675,\s*0\.19\)/);
  });

  it("keeps a dedicated heading band above the runtime canvas", () => {
    expect(readRuleBlock(".stage-frame")).toMatch(
      /grid-template-rows:\s*minmax\(var\(--stage-heading-height,\s*8\.75rem\),\s*auto\)\s+minmax\(0,\s*1fr\);/,
    );

    expect(readRuleBlock(".stage-heading")).toMatch(
      /min-block-size:\s*var\(--stage-heading-height,\s*8\.75rem\);/,
    );
  });

  it("keeps exactly one visible frame around the runtime canvas", () => {
    const stageRuntimeRule = readRuleBlock(".stage-runtime");

    expect(stageRuntimeRule).toMatch(/border:\s*1px solid rgba\(76,\s*90,\s*102,\s*0\.12\);/);
    expect(stageRuntimeRule).toMatch(/background:\s*linear-gradient\(/);
    expect(stageRuntimeRule).not.toMatch(/background:\s*transparent;/);
  });

  it("renders the notes-side Graphics API sample as a real orange line with an arrow tip", () => {
    const apiLineRule = readRuleBlock(".notes-api-line");
    const apiLineAfterRule = readRuleBlock(".notes-api-line::after");

    expect(apiLineRule).toMatch(/border-top:\s*3px solid var\(--accent\);/);
    expect(apiLineRule).toMatch(/width:\s*36px;/);
    expect(apiLineAfterRule).toMatch(/border-top:\s*3px solid var\(--accent\);/);
    expect(apiLineAfterRule).toMatch(/border-right:\s*3px solid var\(--accent\);/);
  });

  it("gives newly added objective facts a dedicated wave-glow treatment", () => {
    const freshFactRule = readRuleBlock(
      '.notes-point-item--objective-facts[data-fact-state="new"]',
    );
    const freshFactBeforeRule = readRuleBlock(
      '.notes-point-item--objective-facts[data-fact-state="new"]::before',
    );
    const freshFactAfterRule = readRuleBlock(
      '.notes-point-item--objective-facts[data-fact-state="new"]::after',
    );

    expect(freshFactRule).toMatch(/box-shadow:/);
    expect(freshFactRule).toMatch(/background:\s*linear-gradient\(/);
    expect(freshFactBeforeRule).toMatch(/animation:\s*notes-objective-fact-glow/);
    expect(freshFactBeforeRule).toMatch(/infinite/);
    expect(freshFactAfterRule).toMatch(/animation:\s*notes-objective-fact-sheen/);
    expect(freshFactAfterRule).toMatch(/infinite/);
    expect(appCss).toMatch(/@keyframes notes-objective-fact-glow/);
    expect(appCss).toMatch(/@keyframes notes-objective-fact-sheen/);
  });

  it("gives explicitly highlighted sidebar objective facts their own glow treatment", () => {
    const highlightedFactRule = readRuleBlock(
      '.notes-point-item--objective-facts[data-fact-highlighted="true"]',
    );
    const highlightedFactBeforeRule = readRuleBlock(
      '.notes-point-item--objective-facts[data-fact-highlighted="true"]::before',
    );
    const highlightedFactAfterRule = readRuleBlock(
      '.notes-point-item--objective-facts[data-fact-highlighted="true"]::after',
    );
    const highlightedFactBulletRule = readRuleBlock(
      '.notes-point-item--objective-facts[data-fact-highlighted="true"] .notes-point-bullet',
    );

    expect(highlightedFactRule).toMatch(/box-shadow:/);
    expect(highlightedFactRule).toMatch(/background:\s*linear-gradient\(/);
    expect(highlightedFactBeforeRule).toMatch(/animation:\s*notes-objective-fact-glow/);
    expect(highlightedFactAfterRule).toMatch(/animation:\s*notes-objective-fact-sheen/);
    expect(highlightedFactBulletRule).toMatch(/box-shadow:/);
  });

  it("renders objective-fact markers as numbered circular badges instead of tiny dots", () => {
    const factBadgeRule = readRuleBlock(".notes-point-bullet");

    expect(factBadgeRule).toMatch(/display:\s*inline-grid;/);
    expect(factBadgeRule).toMatch(/place-items:\s*center;/);
    expect(factBadgeRule).toMatch(/border:\s*2px solid var\(--accent\);/);
    expect(factBadgeRule).toMatch(/border-radius:\s*999px;/);
  });

  it("adds a separator line between later objective-fact rows for scanability", () => {
    const factListRule = readRuleBlock(".notes-point-list--objective-facts");
    const factSeparatorRule = readRuleBlock(".notes-point-separator--objective-facts");
    const factDividerRule = readRuleBlock(".notes-point-divider--objective-facts");

    expect(factListRule).toMatch(/gap:\s*0;/);
    expect(factSeparatorRule).toMatch(/min-height:\s*0\.52rem;/);
    expect(factSeparatorRule).toMatch(/align-items:\s*center;/);
    expect(factSeparatorRule).toMatch(/position:\s*relative;/);
    expect(factSeparatorRule).toMatch(/z-index:\s*1;/);
    expect(factSeparatorRule).toMatch(/background:\s*var\(--paper\);/);
    expect(factDividerRule).toMatch(/display:\s*block;/);
    expect(factDividerRule).toMatch(/inline-size:\s*100%;/);
    expect(factDividerRule).toMatch(/height:\s*1px;/);
    expect(factDividerRule).toMatch(/background:\s*rgba\(34,\s*48,\s*61,\s*0\.1\);/);
  });

});
