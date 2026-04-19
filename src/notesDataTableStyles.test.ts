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

describe("notes data table typography", () => {
  it("uses larger and bolder typography for the page16 ShaderStableKey table", () => {
    const keyRule = readRuleBlock(".notes-data-key");
    const valueRule = readRuleBlock(".notes-data-value");

    expect(keyRule).toMatch(/font-size:\s*0\.95rem;/);
    expect(keyRule).toMatch(/font-weight:\s*800;/);
    expect(valueRule).toMatch(/font-size:\s*1\.02rem;/);
    expect(valueRule).toMatch(/font-weight:\s*700;/);
  });
});
