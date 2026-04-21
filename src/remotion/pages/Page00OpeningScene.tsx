import {easeInOutCubic, mix} from "../geometry/geometry";
import {resolveRemotionPublicAssetHref} from "../publicAssetPath";

const IMAGE_COLUMN_X = 120;
const IMAGE_COLUMN_WIDTH = 760;
const RIGHT_LABEL_X = 930;
const LABEL_FONT_SIZE = 24;

const TOP_HALF_CROP = "xMidYMin slice";
const IMAGE_STEPS = [
  {
    label: "PSO Cache启用前",
    box: {x: IMAGE_COLUMN_X, y: 60, width: IMAGE_COLUMN_WIDTH, height: 176, radius: 18},
    href: "/supplement/pso-stutter.png",
    clipId: "page00-before-image-clip",
    imageTestId: "page00-before-image",
    preserveAspectRatio: TOP_HALF_CROP,
  },
  {
    label: "编译着色器",
    box: {x: IMAGE_COLUMN_X, y: 296, width: IMAGE_COLUMN_WIDTH, height: 128, radius: 18},
    href: "/supplement/pso-compile-shader.png",
    clipId: "page00-compile-image-clip",
    imageTestId: "page00-compile-image",
    preserveAspectRatio: "xMidYMid meet",
  },
  {
    label: "PSO Cache启用后",
    box: {x: IMAGE_COLUMN_X, y: 484, width: IMAGE_COLUMN_WIDTH, height: 176, radius: 18},
    href: "/supplement/pso-precompile-smooth-peak.png",
    clipId: "page00-after-image-clip",
    imageTestId: "page00-after-image",
    preserveAspectRatio: TOP_HALF_CROP,
  },
] as const;

export function Page00OpeningScene({opacity}: {opacity: number}) {
  if (opacity <= 0.001) {
    return null;
  }

  const reveal = easeInOutCubic(opacity);
  const scale = mix(0.985, 1, reveal);

  return (
    <g
      opacity={opacity}
      transform={`translate(640 360) scale(${scale}) translate(-640 -360)`}
    >
      {IMAGE_STEPS.map((step) => (
        <g key={step.imageTestId}>
          <OpeningImage
            box={step.box}
            href={step.href}
            clipId={step.clipId}
            imageTestId={step.imageTestId}
            preserveAspectRatio={step.preserveAspectRatio}
          />
          <text
            x={RIGHT_LABEL_X}
            y={step.box.y + step.box.height / 2}
            fill="#c66f4c"
            fontSize={LABEL_FONT_SIZE}
            fontWeight="820"
            textAnchor="start"
            dominantBaseline="middle"
          >
            {step.label}
          </text>
        </g>
      ))}
    </g>
  );
}

function OpeningImage({
  box,
  href,
  clipId,
  imageTestId,
  preserveAspectRatio,
}: {
  box: {x: number; y: number; width: number; height: number; radius: number};
  href: string;
  clipId: string;
  imageTestId: string;
  preserveAspectRatio?: string;
}) {
  const resolvedHref = resolveRemotionPublicAssetHref(href);

  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <rect
            x={box.x}
            y={box.y}
            width={box.width}
            height={box.height}
            rx={box.radius}
            ry={box.radius}
          />
        </clipPath>
      </defs>
      <image
        data-testid={imageTestId}
        href={resolvedHref}
        x={box.x}
        y={box.y}
        width={box.width}
        height={box.height}
        preserveAspectRatio={preserveAspectRatio ?? "xMidYMid meet"}
        clipPath={`url(#${clipId})`}
      />
    </g>
  );
}
