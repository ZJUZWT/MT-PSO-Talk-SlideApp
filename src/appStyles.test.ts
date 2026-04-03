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
});
