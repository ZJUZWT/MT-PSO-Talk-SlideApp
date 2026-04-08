import type {RefObject} from "react";
import {useEffect, useRef, useState} from "react";
import {
  captureElementToClipboardOrDownload,
  type CaptureResult,
} from "../utils/captureImage";

type CaptureClipboardButtonProps = {
  stepId: string;
  targetRef: RefObject<HTMLElement | null>;
  ariaLabel?: string;
  buttonText?: string;
  title?: string;
  variant?: "fab" | "inline";
};

type CaptureState = "idle" | "capturing" | CaptureResult;

const CAPTURE_STATUS_COPY: Record<Exclude<CaptureState, "idle" | "capturing">, string> = {
  copied: "已复制到剪切板",
  downloaded: "已下载 PNG",
  failed: "截图失败",
};

function createCaptureFileName(stepId: string) {
  return `slideapp-${stepId}-${Date.now()}.png`;
}

export function CaptureClipboardButton({
  stepId,
  targetRef,
  ariaLabel = "复制当前页面截图",
  buttonText = "!",
  title,
  variant = "fab",
}: CaptureClipboardButtonProps) {
  const [captureState, setCaptureState] = useState<CaptureState>("idle");
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const queueReset = () => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = window.setTimeout(() => {
      setCaptureState("idle");
      resetTimerRef.current = null;
    }, 1800);
  };

  const handleCapture = async () => {
    const captureTarget = targetRef.current;

    if (!captureTarget || captureState === "capturing") {
      return;
    }

    setCaptureState("capturing");
    const nextState = await captureElementToClipboardOrDownload({
      element: captureTarget,
      fileName: createCaptureFileName(stepId),
    });

    setCaptureState(nextState);
    queueReset();
  };

  const statusCopy =
    captureState === "idle" || captureState === "capturing"
      ? null
      : CAPTURE_STATUS_COPY[captureState];

  return (
    <div
      className={
        variant === "inline" ? "capture-inline-shell" : "capture-fab-shell"
      }
      data-capture-ignore="true"
      data-state={captureState}
      data-variant={variant}
    >
      <button
        type="button"
        className={variant === "inline" ? "capture-inline-button" : "capture-fab"}
        aria-label={ariaLabel}
        title={title ?? ariaLabel}
        onClick={handleCapture}
        disabled={captureState === "capturing"}
      >
        {buttonText}
      </button>
      <p
        className={
          variant === "inline" ? "capture-inline-status" : "capture-fab-status"
        }
        aria-live="polite"
      >
        {captureState === "capturing" ? "正在截图…" : statusCopy}
      </p>
    </div>
  );
}
