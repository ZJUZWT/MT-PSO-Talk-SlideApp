import type {Box, RgbaColor} from "../primitives/diagramTypes";

export function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function mix(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

export function mixRgba(from: RgbaColor, to: RgbaColor, progress: number) {
  const r = Math.round(mix(from.r, to.r, progress));
  const g = Math.round(mix(from.g, to.g, progress));
  const b = Math.round(mix(from.b, to.b, progress));
  const a = Math.round(mix(from.a, to.a, progress) * 1000) / 1000;

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function hexToRgbaColor(hex: string, alpha = 1): RgbaColor {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;

  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
    a: alpha,
  };
}

export function easeInOutCubic(value: number) {
  if (value < 0.5) {
    return 4 * value * value * value;
  }

  return 1 - Math.pow(-2 * value + 2, 3) / 2;
}

export function easeInOutQuint(value: number) {
  if (value < 0.5) {
    return 16 * Math.pow(value, 5);
  }

  return 1 - Math.pow(-2 * value + 2, 5) / 2;
}

export function easeOutQuint(value: number) {
  return 1 - Math.pow(1 - value, 5);
}

export function resolveSegmentProgress(
  frame: number,
  fromFrame: number,
  toFrame: number,
) {
  const distance = Math.max(1, toFrame - fromFrame);
  const rawProgress = clamp01((frame - fromFrame) / distance);

  return easeInOutCubic(rawProgress);
}

export function resolveLinearSegmentProgress(
  frame: number,
  fromFrame: number,
  toFrame: number,
) {
  const distance = Math.max(1, toFrame - fromFrame);

  return clamp01((frame - fromFrame) / distance);
}

export function resolveWindowProgress(
  progress: number,
  start: number,
  end: number,
  easing: (value: number) => number = (value) => value,
) {
  const windowSize = Math.max(0.0001, end - start);

  return easing(clamp01((progress - start) / windowSize));
}

export function mixBox(fromBox: Box, toBox: Box, progress: number): Box {
  return {
    x: mix(fromBox.x, toBox.x, progress),
    y: mix(fromBox.y, toBox.y, progress),
    width: mix(fromBox.width, toBox.width, progress),
    height: mix(fromBox.height, toBox.height, progress),
    radius: mix(fromBox.radius, toBox.radius, progress),
  };
}

export function horizontalPath(startX: number, endX: number, y: number) {
  return `M ${startX} ${y} L ${endX} ${y}`;
}

export function verticalPath(x: number, startY: number, endY: number) {
  return `M ${x} ${startY} L ${x} ${endY}`;
}

export function polylinePath(points: Array<{x: number; y: number}>) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

export function boxCenterX(box: Box) {
  return box.x + box.width / 2;
}

export function boxCenterY(box: Box) {
  return box.y + box.height / 2;
}

export function boxBottom(box: Box) {
  return box.y + box.height;
}

export function boxRight(box: Box) {
  return box.x + box.width;
}

export function scalePointAround(input: {
  x: number;
  y: number;
  originX: number;
  originY: number;
  targetX: number;
  targetY: number;
  scale: number;
}) {
  return {
    x: input.targetX + input.scale * (input.x - input.originX),
    y: input.targetY + input.scale * (input.y - input.originY),
  };
}

export function bandCenters(
  startY: number,
  endY: number,
  count: number,
  offset = 0,
) {
  if (count <= 0) {
    return [];
  }

  const cellHeight = (endY - startY) / count;

  return Array.from({length: count}, (_, index) =>
    Math.round(startY + cellHeight * (index + 0.5) + offset),
  );
}

export function bandBoundaries(startY: number, endY: number, count: number) {
  if (count <= 1) {
    return [];
  }

  const cellHeight = (endY - startY) / count;

  return Array.from({length: count - 1}, (_, index) =>
    Math.round(startY + cellHeight * (index + 1)),
  );
}
