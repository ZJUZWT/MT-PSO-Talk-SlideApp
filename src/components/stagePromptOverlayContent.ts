import type {StoryStepId} from "../storyboard-data/pso-workbench-types";

export type StagePromptOverlayContent = {
  stepId: StoryStepId;
  lines: readonly string[];
  variant?: "default" | "shared-shader-wide";
};

const STAGE_PROMPT_OVERLAY_CONTENT: readonly StagePromptOverlayContent[] = [
  {
    stepId: "page_03",
    lines: ["Q: 为什么需要预编译着色器？不能运行时Compile、Link？"],
  },
  {
    stepId: "page_04",
    lines: ["Q: 为什么需要预编译着色器？不能运行时Compile、Link？"],
  },
  {
    stepId: "page_04_data",
    lines: ["A: Compile、Link 的复杂度很高"],
  },
  {
    stepId: "page_05",
    lines: ["Q: 为什么要开启", "Shared Shader Code 开关？"],
    variant: "shared-shader-wide",
  },
  {
    stepId: "page_06",
    lines: ["Q: 为什么要开启", "Shared Shader Code 开关？"],
    variant: "shared-shader-wide",
  },
  {
    stepId: "page_07",
    lines: ["Q: 为什么要开启", "Shared Shader Code 开关？"],
    variant: "shared-shader-wide",
  },
  {
    stepId: "page_08",
    lines: ["Q: 为什么要开启", "Shared Shader Code 开关？"],
    variant: "shared-shader-wide",
  },
  {
    stepId: "page_09",
    lines: ["A: 提供全局表", "进行Hash索引"],
  },
  {stepId: "page_09_img", lines: ["A: 统一存放ShaderCode", "减少重复消耗"]},
  {
    stepId: "page_16",
    lines: ["Q: 为什么不直接用 rec.upipelinecache，", "还要 expand 呢？"],
  },
  {stepId: "page_17", lines: ["A: 因为 Hash 不是跨版本稳定标识"]},
  {stepId: "page_28", lines: ["Q: 为什么不能cook直接输出PSOCache"]},
  {
    stepId: "page_18_img",
    lines: ["Q: 为什么许多游戏", "只需要第一次编译着色器，", "后面就不需要了呢？"],
  },
  {stepId: "page_19", lines: ["A: 可以将编译完毕的 binary", "提取出来放在本地。"]},
] as const;

export function resolveStagePromptOverlayContent(stepId: StoryStepId) {
  return STAGE_PROMPT_OVERLAY_CONTENT.find((item) => item.stepId === stepId) ?? null;
}
