import type {StoryStepId} from "../../../storyboard-data/pso-workbench-types";

export type SlideLogicPrimitiveKind =
  | "node"
  | "junction"
  | "container"
  | "edge-label";

export type SlideLogicPrimitive = {
  id: string;
  kind: SlideLogicPrimitiveKind;
  label: string;
  contains?: string[];
};

export type SlideLogicEdge = {
  id: string;
  from: string;
  to: string;
  labelRef?: string;
  entersContainerId?: string;
  note?: string;
};

export type SlideLogicContract = {
  id: string;
  stepId: StoryStepId;
  title: string;
  intent: string;
  mermaid: string;
  primitives: SlideLogicPrimitive[];
  edges: SlideLogicEdge[];
};

export const page10R1LogicContract: SlideLogicContract = {
  id: "page10-r1-logic",
  stepId: "page_10",
  title: "Page 10 logic contract",
  intent:
    "Model page10 as one cook-split bridge where cook is an edge label, the split happens at an empty junction, and Runtime is a container that owns the runtime pipeline.",
  mermaid: `flowchart LR
    material["Material"] -->|"cook"| cook_split((" "))
    cook_split --> shaderbytecode[".shaderbytecode"]
    cook_split --> scl_csv[".scl.csv"]

    shaderbytecode --> runtime
    scl_csv --> runtime

    subgraph runtime["Runtime"]
      vertexdata["VertexData"] --> gpu["GPU"] --> pixels["Pixels"]
    end`,
  primitives: [
    {id: "material", kind: "node", label: "Material"},
    {id: "cook", kind: "edge-label", label: "cook"},
    {id: "cook-split", kind: "junction", label: "cook split"},
    {id: "shaderbytecode", kind: "node", label: ".shaderbytecode"},
    {id: "scl-csv", kind: "node", label: ".scl.csv"},
    {
      id: "runtime",
      kind: "container",
      label: "Runtime",
      contains: ["vertexdata", "gpu", "pixels"],
    },
    {id: "vertexdata", kind: "node", label: "VertexData"},
    {id: "gpu", kind: "node", label: "GPU"},
    {id: "pixels", kind: "node", label: "Pixels"},
  ],
  edges: [
    {
      id: "material-to-cook-split",
      from: "material",
      to: "cook-split",
      labelRef: "cook",
      note: "cook is attached to the edge, not represented as a box node",
    },
    {
      id: "cook-split-to-shaderbytecode",
      from: "cook-split",
      to: "shaderbytecode",
    },
    {
      id: "cook-split-to-scl-csv",
      from: "cook-split",
      to: "scl-csv",
    },
    {
      id: "shaderbytecode-to-runtime",
      from: "shaderbytecode",
      to: "runtime",
      entersContainerId: "runtime",
      note: "This line targets the Runtime container, not one leaf node inside it",
    },
    {
      id: "scl-csv-to-runtime",
      from: "scl-csv",
      to: "runtime",
      entersContainerId: "runtime",
      note: "This line targets the Runtime container, not one leaf node inside it",
    },
    {
      id: "vertexdata-to-gpu",
      from: "vertexdata",
      to: "gpu",
      entersContainerId: "runtime",
    },
    {
      id: "gpu-to-pixels",
      from: "gpu",
      to: "pixels",
      entersContainerId: "runtime",
    },
  ],
};
