import type {StoryStepId} from "../../../storyboard-data/pso-workbench-types";

export type PageAssemblyNodeKind = "device" | "artifact" | "junction";

export type PageAssemblyNode = {
  id: string;
  label: string;
  semanticRole: string;
  visualKind: PageAssemblyNodeKind;
  anchorRegion: string;
  emphasis: "primary" | "secondary" | "support";
  alignmentConstraints: string[];
};

export type PageAssemblyEdge = {
  id: string;
  from: string;
  to: string;
  meaning: string;
  routeGrammar: string;
  maxBends: number;
  segmentLabel?: string;
  arrowStyle: string;
  siblingNote?: string;
};

export type PageAssemblyContract = {
  id: string;
  stepId: StoryStepId;
  title: string;
  pageGoal: string;
  visualPriority: string[];
  nodes: PageAssemblyNode[];
  edges: PageAssemblyEdge[];
  spatialConstraints: string[];
  elementStyles: string[];
  assemblyOrder: string[];
  acceptanceChecklist: string[];
};

export const page14ContractR1Logic: PageAssemblyContract = {
  id: "page14-contract-r1-logic",
  stepId: "page_14",
  title: "Page 14 contract-first loop",
  pageGoal:
    "Explain the PSO collection/build/use loop with Computer on the left, Phone on the right, two build-side output branches, one merge junction B on the stable path, and one runtime return loop.",
  visualPriority: [
    "Clockwise Computer -> Phone -> Computer loop reads first",
    "Cook branch and expand branch read second",
    "Artifact file names read third",
  ],
  nodes: [
    {
      id: "computer",
      label: "Computer",
      semanticRole: "cook/build machine",
      visualKind: "device",
      anchorRegion: "left lower-third",
      emphasis: "primary",
      alignmentConstraints: [
        "Shares one baseline with scl and phone",
      ],
    },
    {
      id: "phone",
      label: "Phone",
      semanticRole: "runtime/package machine",
      visualKind: "device",
      anchorRegion: "right lower-third",
      emphasis: "primary",
      alignmentConstraints: [
        "Shares one baseline with computer and scl",
      ],
    },
    {
      id: "a",
      label: "A",
      semanticRole: "cook split junction",
      visualKind: "junction",
      anchorRegion: "to the right and below computer",
      emphasis: "support",
      alignmentConstraints: [
        "Lower than the computer/scl/phone baseline",
      ],
    },
    {
      id: "bytecode",
      label: ".ushaderbytecode",
      semanticRole: "runtime shader artifact",
      visualKind: "artifact",
      anchorRegion: "middle-right lower lane",
      emphasis: "secondary",
      alignmentConstraints: [
        "Below scl",
      ],
    },
    {
      id: "scl",
      label: ".scl.csv",
      semanticRole: "material-side artifact",
      visualKind: "artifact",
      anchorRegion: "middle-right shared baseline",
      emphasis: "secondary",
      alignmentConstraints: [
        "Shares one baseline with computer and phone",
      ],
    },
    {
      id: "stable-pc",
      label: "stablepc.csv",
      semanticRole: "expand path artifact",
      visualKind: "artifact",
      anchorRegion: "upper middle lane",
      emphasis: "secondary",
      alignmentConstraints: [
        "Shares one baseline with stable-upipe",
      ],
    },
    {
      id: "b",
      label: "B",
      semanticRole: "stable merge junction",
      visualKind: "junction",
      anchorRegion: "between the middle lane and the upper stable lane",
      emphasis: "support",
      alignmentConstraints: [
        "Sits between scl and stable-upipe",
      ],
    },
    {
      id: "stable-upipe",
      label: "stable.upipelinecache",
      semanticRole: "stable cache artifact",
      visualKind: "artifact",
      anchorRegion: "upper right lane",
      emphasis: "secondary",
      alignmentConstraints: [
        "Shares one baseline with stable-pc",
      ],
    },
    {
      id: "rec",
      label: "rec.upipelinecache",
      semanticRole: "runtime return artifact",
      visualKind: "artifact",
      anchorRegion: "above and left of phone",
      emphasis: "secondary",
      alignmentConstraints: [
        "Above phone",
      ],
    },
  ],
  edges: [
    {
      id: "computer-to-a",
      from: "computer",
      to: "a",
      meaning: "cook output reaches split junction",
      routeGrammar: "exit lower-right, 45 down-right, then horizontal right",
      maxBends: 1,
      segmentLabel: "cook",
      arrowStyle: "single compact arrowhead",
      siblingNote: "Parent route of the two cook output branches",
    },
    {
      id: "a-to-bytecode",
      from: "a",
      to: "bytecode",
      meaning: "cook branch to shader bytecode artifact",
      routeGrammar: "45 down-right, then horizontal right",
      maxBends: 1,
      arrowStyle: "single compact arrowhead",
      siblingNote: "Lower sibling of the A split",
    },
    {
      id: "a-to-scl",
      from: "a",
      to: "scl",
      meaning: "cook branch to scl artifact",
      routeGrammar: "45 up-right, then horizontal right",
      maxBends: 1,
      arrowStyle: "single compact arrowhead",
      siblingNote: "Upper sibling of the A split",
    },
    {
      id: "bytecode-to-phone",
      from: "bytecode",
      to: "phone",
      meaning: "runtime consumes bytecode",
      routeGrammar: "horizontal right, then 45 up-right",
      maxBends: 1,
      arrowStyle: "single compact arrowhead",
    },
    {
      id: "computer-to-stablepc",
      from: "computer",
      to: "stable-pc",
      meaning: "expand path to stablepc artifact",
      routeGrammar: "exit upper-right, 45 up-right, then horizontal right",
      maxBends: 1,
      segmentLabel: "expand",
      arrowStyle: "single compact arrowhead",
    },
    {
      id: "scl-to-b",
      from: "scl",
      to: "b",
      meaning: "scl contributes to the stable merge junction",
      routeGrammar: "horizontal right, then 45 up-right",
      maxBends: 1,
      arrowStyle: "single compact arrowhead",
    },
    {
      id: "stablepc-to-b",
      from: "stable-pc",
      to: "b",
      meaning: "stablepc feeds the stable merge junction",
      routeGrammar: "horizontal right",
      maxBends: 0,
      arrowStyle: "single compact arrowhead",
    },
    {
      id: "b-to-stableupipe",
      from: "b",
      to: "stable-upipe",
      meaning: "the stable merge junction feeds stable upipelinecache",
      routeGrammar: "horizontal right",
      maxBends: 0,
      arrowStyle: "single compact arrowhead",
    },
    {
      id: "stableupipe-to-phone",
      from: "stable-upipe",
      to: "phone",
      meaning: "stable upipelinecache feeds runtime on Phone",
      routeGrammar: "horizontal right, then 45 down-right",
      maxBends: 1,
      arrowStyle: "single compact arrowhead",
    },
    {
      id: "phone-to-rec",
      from: "phone",
      to: "rec",
      meaning: "runtime collects rec.upipelinecache",
      routeGrammar: "vertical up, then horizontal left",
      maxBends: 1,
      arrowStyle: "single compact arrowhead",
    },
    {
      id: "rec-to-computer",
      from: "rec",
      to: "computer",
      meaning: "runtime record returns to build side",
      routeGrammar: "horizontal left, continue left, then vertical down",
      maxBends: 1,
      arrowStyle: "single compact arrowhead",
    },
  ],
  spatialConstraints: [
    "Computer, scl, and phone share one horizontal baseline.",
    "stable-pc and stable-upipe share one upper horizontal baseline.",
    "A is lower than the device baseline and to the right of Computer.",
    "B sits between scl and stable-upipe as the stable merge point.",
    "Bytecode sits below scl.",
    "stable-upipe sits left of Phone so it can route rightward into runtime.",
    "rec sits above phone and connects into the return loop.",
  ],
  elementStyles: [
    "Only 0/45/90 degree segments are allowed.",
    "cook and expand stay attached to line segments, not standalone nodes.",
    "A stays visually minor.",
    "B is a circled plus, not a file box.",
    "Arrowheads stay compact.",
    "No freeform or shaky routing is allowed.",
  ],
  assemblyOrder: [
    "Place Computer and Phone as the two lower anchors.",
    "Place scl on the shared lower baseline and bytecode below it.",
    "Place stable-pc and stable-upipe on the shared upper baseline.",
    "Place rec above phone, A below the lower baseline, and B between scl and stable-upipe.",
    "Route cook and expand branches before the return loop.",
    "Add the return loop last and verify all check items.",
  ],
  acceptanceChecklist: [
    "Computer is in the left lower-third and Phone is in the right lower-third.",
    "cook is an edge label on Computer -> A, not a node.",
    "expand is an edge label on Computer -> stablepc.csv, not a node.",
    "A is a junction, not a file node.",
    "B is a circled plus merge junction, not a file node.",
    "Computer, scl, and phone share one baseline.",
    "stable-pc and stable-upipe share one baseline.",
    "All routes use only 0/45/90 degree segments.",
    "stablepc -> B and scl -> B exist before B -> stable.upipelinecache.",
    "stable.upipelinecache -> Phone goes horizontal first, then 45 down-right.",
    "Phone -> rec -> Computer exists as the return loop.",
    "bytecode -> Phone goes horizontal first, then 45 up-right.",
  ],
};
