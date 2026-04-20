import {describe, expect, it} from "vitest";
import type {GeometrySketchDefinition} from "../render/geometry-sketch-types";
import {page14ContractR1Sketch} from "../contracts/page14-contract-r1";
import {collectBrowserGeometryTextProbe} from "./browserGeometryTextProbe";

function createSvgRect(
  x: number,
  y: number,
  width: number,
  height: number,
): DOMRect {
  return {
    x,
    y,
    width,
    height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    toJSON: () => ({}),
  } as DOMRect;
}

describe("collectBrowserGeometryTextProbe", () => {
  it("measures real svg text padding from browser bbox output", () => {
    document.body.innerHTML = `
      <svg>
        <g data-node-id="stable-upipe">
          <rect x="856" y="318" width="204" height="84"></rect>
          <text font-size="28">stable.</text>
          <text font-size="28">upipelinecache</text>
        </g>
      </svg>
    `;

    const textNodes = Array.from(document.querySelectorAll("text"));
    const firstLine = textNodes[0] as SVGGraphicsElement | undefined;
    const secondLine = textNodes[1] as SVGGraphicsElement | undefined;

    if (!firstLine || !secondLine) {
      throw new Error("Expected probe fixture text nodes");
    }

    firstLine.getBBox = () => createSvgRect(869.6, 330.8, 176.8, 22.1);
    secondLine.getBBox = () => createSvgRect(872.7, 362.2, 170.5, 22.1);

    const probe = collectBrowserGeometryTextProbe({
      probeNodeId: "stable-upipe",
      root: document,
      sketch: page14ContractR1Sketch,
    });
    const stableUpipe = probe.nodes[0];

    expect(probe.nodes).toHaveLength(1);
    expect(stableUpipe).toMatchObject({
      nodeId: "stable-upipe",
      fontSizePx: 28,
      lineCount: 2,
      topPaddingPx: 12.8,
      rightPaddingPx: 13.6,
      bottomPaddingPx: 17.7,
      leftPaddingPx: 13.6,
      tightestPaddingPx: 12.8,
    });
  });

  it("collects entity bounds for explicit tree entities", () => {
    const sketch: GeometrySketchDefinition = {
      id: "entity-probe-sketch",
      label: "Entity Probe Sketch",
      stepId: "page_31",
      contract: {
        pageGoal: "Probe entity bounds",
        receiverPlane: "Loop card",
        primaryLine: "Probe -> Bounds",
        keepStable: "None",
        newChange: "Entity bbox",
        doNot: "None",
      },
      entities: [
        {
          id: "loop-card",
          kind: "container",
          label: "Loop Card",
          x: 100,
          y: 120,
          width: 240,
          height: 80,
        },
        {
          id: "loop-caption",
          kind: "text",
          label: "Loop Caption",
          parentId: "loop-card",
          x: 110,
          y: 140,
          width: 160,
          height: 24,
        },
      ],
      nodes: [],
      edges: [],
    };

    document.body.innerHTML = `
      <svg>
        <g data-geometry-entity-id="loop-card">
          <rect x="100" y="120" width="240" height="80"></rect>
        </g>
        <text data-geometry-entity-id="loop-caption" font-size="24">Loop fact</text>
      </svg>
    `;

    const caption = document.querySelector(
      '[data-geometry-entity-id="loop-caption"]',
    ) as SVGGraphicsElement | null;
    if (!caption) {
      throw new Error("Expected loop caption entity");
    }

    caption.getBBox = () => createSvgRect(110, 140, 160, 24);

    const probe = collectBrowserGeometryTextProbe({
      root: document,
      sketch,
    });

    expect((probe as Record<string, unknown>).entities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entityId: "loop-card",
          kind: "container",
          bounds: {
            x: 100,
            y: 120,
            width: 240,
            height: 80,
          },
        }),
        expect.objectContaining({
          entityId: "loop-caption",
          kind: "text",
          bounds: {
            x: 110,
            y: 140,
            width: 160,
            height: 24,
          },
        }),
      ]),
    );
  });
});
