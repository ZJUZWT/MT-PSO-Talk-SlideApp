import {toBlob} from "html-to-image";

export type ClipboardWriter = {
  write?: (items: ClipboardItem[]) => Promise<void> | void;
} | null;

export type ClipboardItemConstructorLike = new (
  items: Record<string, Blob>,
) => ClipboardItem;

type WriteClipboardDeps = {
  clipboard?: ClipboardWriter;
  ClipboardItemCtor?: ClipboardItemConstructorLike | undefined;
};

export type CaptureScope = "page" | "stage";

export type FetchLike = (
  input: string,
  init?: RequestInit,
) => Promise<{ok: boolean}>;

export async function tryWriteImageBlobToClipboard(
  blob: Blob,
  deps: WriteClipboardDeps = {},
) {
  const clipboard = deps.clipboard ?? navigator.clipboard;
  const ClipboardItemCtor =
    deps.ClipboardItemCtor ?? (typeof ClipboardItem !== "undefined" ? ClipboardItem : undefined);

  if (!clipboard?.write || !ClipboardItemCtor) {
    return false;
  }

  const clipboardItem = new ClipboardItemCtor({
    [blob.type || "image/png"]: blob,
  });

  await clipboard.write([clipboardItem]);
  return true;
}

export function downloadImageBlob(blob: Blob, fileName: string) {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName;
  anchor.rel = "noopener";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

export type CaptureResult = "copied" | "downloaded" | "failed";

type CaptureElementOptions = {
  element: HTMLElement;
  fileName: string;
  backgroundColor?: string;
};

type PostImageBlobOptions = {
  fetchImpl?: FetchLike;
  postUrl: string;
  scope: CaptureScope;
  sourceUrl: string;
  targetId: string;
};

export async function captureElementToBlob(
  element: HTMLElement,
  backgroundColor = "#fcf9f3",
) {
  const imageBlob = await toBlob(element, {
    cacheBust: true,
    backgroundColor,
    pixelRatio: Math.max(2, window.devicePixelRatio || 1),
    filter: (node) => {
      return !(
        node instanceof HTMLElement && node.dataset.captureIgnore === "true"
      );
    },
  });

  if (!imageBlob) {
    throw new Error("Capture returned no image data");
  }

  return imageBlob;
}

export async function postImageBlobToEndpoint(
  blob: Blob,
  {
    fetchImpl = (input, init) => fetch(input, init),
    postUrl,
    scope,
    sourceUrl,
    targetId,
  }: PostImageBlobOptions,
) {
  const endpoint = new URL(postUrl);
  endpoint.searchParams.set("scope", scope);
  endpoint.searchParams.set("sourceUrl", sourceUrl);

  const response = await fetchImpl(endpoint.toString(), {
    body: blob,
    headers: {
      "Content-Type": blob.type || "image/png",
      "X-Slide-Capture-Target": targetId,
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Capture post failed for ${scope}`);
  }
}

export async function captureElementToClipboardOrDownload({
  element,
  fileName,
  backgroundColor = "#fcf9f3",
}: CaptureElementOptions): Promise<CaptureResult> {
  let imageBlob: Blob | null = null;

  try {
    imageBlob = await captureElementToBlob(element, backgroundColor);

    if (await tryWriteImageBlobToClipboard(imageBlob)) {
      return "copied";
    }

    downloadImageBlob(imageBlob, fileName);
    return "downloaded";
  } catch {
    if (imageBlob) {
      downloadImageBlob(imageBlob, fileName);
      return "downloaded";
    }

    return "failed";
  }
}
