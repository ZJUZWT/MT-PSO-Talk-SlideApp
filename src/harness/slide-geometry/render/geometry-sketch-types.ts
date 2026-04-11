import type {StoryStepId} from "../../../storyboard-data/pso-workbench-types";

export type SketchContract = {
  pageGoal: string;
  receiverPlane: string;
  primaryLine: string;
  keepStable: string;
  newChange: string;
  doNot: string;
};

export type SketchNodeTone = "default" | "receiver" | "muted";
export type SketchNodeShape = "roundedRect" | "circle";

export type SketchNode = {
  id: string;
  label: string;
  containerId?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  tone?: SketchNodeTone;
  shape?: SketchNodeShape;
  renderStyle?: "default" | "outline" | "textOnly";
  textRotationDeg?: number;
  labelLines?: string[];
  fontSizeOverride?: number;
  fontWeightOverride?: number;
  textStrokeWidth?: number;
  textColorOverride?: string;
};

export type SketchPoint = {
  x: number;
  y: number;
};

export type SketchEdgeTone = "primary" | "support" | "proof";

export type SketchEdge = {
  id: string;
  from: SketchPoint;
  to: SketchPoint;
  waypoints?: SketchPoint[];
  tone?: SketchEdgeTone;
  dashed?: boolean;
  label?: string;
  labelPoint?: SketchPoint;
  opacity?: number;
  colorOverride?: string;
  strokeWidthOverride?: number;
  arrowStart?: boolean;
  arrowEnd?: boolean;
};

export type GeometrySketchDefinition = {
  id: string;
  label: string;
  stepId: StoryStepId;
  contract: SketchContract;
  nodes: SketchNode[];
  edges: SketchEdge[];
  referenceImage?: {
    src: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    opacity?: number;
    preserveAspectRatio?: string;
  };
};
