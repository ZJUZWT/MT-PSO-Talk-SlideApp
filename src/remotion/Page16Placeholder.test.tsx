import {readFileSync} from "node:fs";
import {join} from "node:path";
import React from "react";
import {render} from "@testing-library/react";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

let mockFrame = 18;

vi.mock("remotion", () => ({
  AbsoluteFill: ({
    children,
    style,
  }: {
    children: React.ReactNode;
    style?: React.CSSProperties;
  }) => (
    <div data-testid="absolute-fill" style={style}>
      {children}
    </div>
  ),
  useCurrentFrame: () => mockFrame,
}));

import {MyComposition} from "./Composition";
import {resolveRemotionStepFrame} from "./embed";

const page10SceneSource = readFileSync(
  join(process.cwd(), "src", "remotion", "pages", "Page10Scene.tsx"),
  "utf8",
);

function setStepFrame(stepId: Parameters<typeof resolveRemotionStepFrame>[0]) {
  mockFrame = resolveRemotionStepFrame(stepId);
}

function normalizeText(value: string | null | undefined) {
  return (value ?? "").replace(/\s+/g, "");
}

function findSvgTextNodesByContent(container: HTMLElement, label: string) {
  const normalizedLabel = normalizeText(label);

  return Array.from(container.querySelectorAll("text")).filter(
    (node) => normalizeText(node.textContent) === normalizedLabel,
  );
}

describe("page16 placeholder cleanup", () => {
  beforeEach(() => {
    setStepFrame("page_16");
  });

  afterEach(() => {
    mockFrame = 18;
  });

  it("removes the old right-bottom StableKey placeholder box while keeping the expand page intact", () => {
    const {container} = render(<MyComposition variantId="bus-clean" />);

    expect(findSvgTextNodesByContent(container, "expand").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, "rec.upipelinecache").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, ".scl.csv").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, "stablepc.csv").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, "手机包收集到的UE PSO").length).toBeGreaterThanOrEqual(1);
    expect(
      findSvgTextNodesByContent(container, "和UE PSO同版本Cook出来的").length,
    ).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, "双向映射").length).toBeGreaterThanOrEqual(1);
    expect(findSvgTextNodesByContent(container, "ShaderStableKey 关键参数")).toHaveLength(0);
    expect(findSvgTextNodesByContent(container, "示例值（待补）")).toHaveLength(0);
  });

  it("keeps page 16 and page 17 top artifact cards function-first and filenames secondary", () => {
    expect(page10SceneSource).toContain('label="ShaderHash + State"');
    expect(page10SceneSource).toContain('subLabel="（历史版本）"');
    expect(page10SceneSource).toContain('detail="rec.upipelinecache"');
    expect(page10SceneSource).toContain('label="ShaderStableKey + State"');
    expect(page10SceneSource).toContain('detail="stablepc.csv"');
    expect(page10SceneSource).toContain('label="ShaderHash <-> ShaderStableKey"');
    expect(page10SceneSource).toContain('detail=".scl.csv"');
    expect(page10SceneSource).toContain('label="ShaderHash + State"');
    expect(page10SceneSource).toContain('subLabel="（当前版本）"');
    expect(page10SceneSource).toContain('detail="stable.upipelinecache"');
  });
});
