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

describe("progress rail session color styles", () => {
  it("defines per-session palette variables on the rail shells", () => {
    expect(
      readRuleBlock('.progress-step-shell[data-session-color="session-1"]'),
    ).toMatch(/--session-dot-fill:\s*rgba\(126,\s*160,\s*201,\s*0\.62\);/);
    expect(
      readRuleBlock('.progress-step-shell[data-session-color="session-4"]'),
    ).toMatch(/--session-dot-fill:\s*rgba\(218,\s*156,\s*130,\s*0\.62\);/);
    expect(
      readRuleBlock('.progress-step-shell[data-session-color="session-4"]'),
    ).toMatch(/--session-pill-active-bg:\s*rgba\(198,\s*111,\s*76,\s*0\.18\);/);
    expect(
      readRuleBlock('.progress-step-shell[data-session-color="session-6"]'),
    ).toMatch(/--session-pill-border:\s*rgba\(122,\s*94,\s*154,\s*0\.22\);/);
  });

  it("renders dots as flatter circular gradients without raised shadows", () => {
    expect(readRuleBlock(".progress-bubble-dot")).toMatch(
      /background:\s*linear-gradient\(\s*135deg,/,
    );
    expect(readRuleBlock(".progress-bubble-dot")).toMatch(
      /rgba\(255,\s*255,\s*255,\s*0\.78\)\s*0%/,
    );
    expect(readRuleBlock(".progress-bubble-dot")).toMatch(
      /rgba\(255,\s*255,\s*255,\s*0\.72\)\s*10%/,
    );
    expect(readRuleBlock(".progress-bubble-dot")).toMatch(
      /border:\s*1px solid var\(--session-dot-border\);/,
    );
    expect(readRuleBlock(".progress-bubble-dot")).toMatch(
      /overflow:\s*hidden;/,
    );
    expect(readRuleBlock(".progress-bubble-dot")).not.toMatch(
      /box-shadow:\s*inset 0 1px 0 rgba\(255,\s*255,\s*255,\s*0\.68\);/,
    );
    expect(readRuleBlock(".progress-bubble-dot")).not.toMatch(
      /box-shadow:\s*0 2px 6px rgba\(54,\s*47,\s*38,\s*0\.06\);/,
    );
  });

  it("routes expanded pills through the lighter session variables", () => {
    expect(readRuleBlock('.progress-bubble[data-compact="false"]')).toMatch(
      /background:\s*var\(--session-pill-bg\);/,
    );
    expect(readRuleBlock('.progress-bubble[data-state="current"][data-compact="false"]')).toMatch(
      /background:\s*var\(--session-pill-active-bg\);/,
    );
  });
});
