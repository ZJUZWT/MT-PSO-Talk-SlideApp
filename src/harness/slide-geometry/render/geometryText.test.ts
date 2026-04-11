import {afterEach, describe, expect, it, vi} from "vitest";
import {
  resolveGeometryTextLayout,
  resolveGeometryTextPadding,
} from "./geometryText";

describe("geometryText", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses canvas text metrics when real font measurement is available", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
      ((contextId: string) => {
        if (contextId !== "2d") {
          return null;
        }

        return {
          font: "",
          measureText: () => ({
            width: 120,
            actualBoundingBoxLeft: 4,
            actualBoundingBoxRight: 116,
            actualBoundingBoxAscent: 12,
            actualBoundingBoxDescent: 4,
          }),
        } as unknown as CanvasRenderingContext2D;
      }) as typeof HTMLCanvasElement.prototype.getContext,
    );

    const node = {
      id: "stable-upipe",
      label: "stable.upipelinecache",
      x: 0,
      y: 0,
      width: 200,
      height: 60,
      fontSizeOverride: 20,
    };

    const layout = resolveGeometryTextLayout(node, false);
    const padding = resolveGeometryTextPadding(node, false);

    expect(layout.estimatedWidthPx).toBe(120);
    expect(layout.blockHeightPx).toBe(16);
    expect(padding.left).toBe(40);
    expect(padding.right).toBe(40);
    expect(padding.top).toBe(22);
    expect(padding.bottom).toBe(22);
  });
});
