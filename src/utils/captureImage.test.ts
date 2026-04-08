import {describe, expect, it, vi} from "vitest";
import {tryWriteImageBlobToClipboard} from "./captureImage";

class ClipboardItemMock {
  readonly payload: Record<string, Blob>;

  constructor(payload: Record<string, Blob>) {
    this.payload = payload;
  }
}

describe("captureImage", () => {
  it("writes a PNG blob to the clipboard when image clipboard support exists", async () => {
    const writeMock = vi.fn();
    const blob = new Blob(["png"], {type: "image/png"});

    await expect(
      tryWriteImageBlobToClipboard(blob, {
        clipboard: {
          write: writeMock,
        },
        ClipboardItemCtor:
          ClipboardItemMock as unknown as new (items: Record<string, Blob>) => ClipboardItem,
      }),
    ).resolves.toBe(true);

    expect(writeMock).toHaveBeenCalledTimes(1);
    expect(writeMock).toHaveBeenCalledWith([
      expect.objectContaining({
        payload: {
          "image/png": blob,
        },
      }),
    ]);
  });

  it("returns false when the browser cannot write images to the clipboard", async () => {
    const blob = new Blob(["png"], {type: "image/png"});

    await expect(
      tryWriteImageBlobToClipboard(blob, {
        clipboard: null,
        ClipboardItemCtor: undefined,
      }),
    ).resolves.toBe(false);
  });
});
