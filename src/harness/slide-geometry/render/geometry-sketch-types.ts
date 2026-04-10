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

export type SketchNode = {
  id: string;
  label: string;
  containerId?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  tone?: SketchNodeTone;
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
};

export type GeometrySketchDefinition = {
  id: string;
  label: string;
  stepId: StoryStepId;
  contract: SketchContract;
  nodes: SketchNode[];
  edges: SketchEdge[];
};
