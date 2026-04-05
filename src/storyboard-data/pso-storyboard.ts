import type {Storyboard} from "./pso-workbench-types";

export const masterStoryboard: Storyboard = {
  storyId: "storyboard-reset",
  title: "新动画剧本",
  summary:
    "Pages 01-03 establish the minimal formula model, concretize it into VertexData -> GPU -> Pixels, then open an upper configuration band that feeds the GPU from above.",
  steps: [
    {
      id: "page_01",
      label: "Input -> f(x) -> Output",
      caption: "从输入经过一个函数得到输出，这是后续所有框架演化前的最小骨架。",
      notes:
        "第一页保持静态终态，不做入场动画。观众先记住这条最简单的主轴，后面我们再往这条主轴上加结构。",
      focusTarget: "基础公式",
      timingHint: "静态停留，让观众先建立稳定的空间记忆。",
      intro:
        "这页不解释图形 API，只先建立最朴素的输入、变换、输出关系。",
      manuscript:
        "先把复杂系统压缩成一个函数模型：Input 进入，经过 f(x) 处理，最后得到 Output。后面的 OpenGL、Vulkan PSO、UE 结构，都是在这个最小骨架上逐步展开。",
      focusColorKey: "page_01",
    },
    {
      id: "page_02",
      label: "VertexData -> GPU -> Pixels",
      caption: "把抽象的 f(x) 具体化成 GPU，把输入和输出也换成更接近图形渲染语义的表达。",
      notes:
        "这一页不是跳到全新构图，而是在第一页三个固定槽位里完成演化。左边变成 VertexData 图形，中间变成 GPU，右边变成 4x4 像素输出。",
      focusTarget: "GPU",
      timingHint: "让三处位置保持稳定，只让内容和轮廓形变。",
      intro:
        "现在开始把公式里的抽象变量替换成图形渲染里的真实角色。",
      manuscript:
        "第一页我们只说 Input 经过 f(x) 变成 Output。到了这一页，Input 更具体地变成 VertexData，f(x) 更具体地变成 GPU，而 Output 也不再是抽象结果，而是最终的像素块。",
      focusColorKey: "page_02",
    },
    {
      id: "page_03",
      label: "OpenGL",
      caption:
        "保留底部 VertexData -> GPU -> Pixels 主轴，但整体下移，在 GPU 上方插入 Shader 编译链和状态配置层。",
      notes:
        "第三页不是抛弃第二页，而是把第二页整组往下压，给上方让出 OpenGL 配置带。GPU 进一步放大，左边出现 ShaderCode 到 ShaderBinary 的横向链路，右边的 Depth、Blend 通过带编号的 Graphics API 调用从上往下收口到 GPU。",
      focusTarget: "OpenGL",
      timingHint:
        "先让底部三段整体下移，再显出上方配置层，最后停在 GPU 被多条上方配置线汇入的终态。",
      intro:
        "现在开始把“GPU 自己算”这个中间节点拆开，看到 OpenGL 里它其实还要接收编译结果和状态配置。",
      manuscript:
        "第二页里我们只看到 VertexData 进入 GPU，最后吐出 Pixels。到了第三页，这条底部主轴整体下移，GPU 被放大，上方分成两组 OpenGL 来源。左边是 ShaderCode 通过 CompileShader() 变成 ShaderBinary，再用 SetShaderBinary() 送进 GPU；右边则是 Depth 和 Blend 分别通过 SetDepthState() 与 SetBlendState() 往下配置到 GPU。",
      apiListTitle: "Graphics API",
      apiList: [
        {id: 1, label: "CompileShader()"},
        {id: 2, label: "SetShaderBinary()"},
        {id: 3, label: "SetDepthState()"},
        {id: 4, label: "SetBlendState()"},
      ],
      focusColorKey: "opengl",
    },
  ],
};
