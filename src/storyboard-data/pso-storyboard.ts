import type {Storyboard} from "./pso-workbench-types";

export const masterStoryboard: Storyboard = {
  storyId: "storyboard-reset",
  title: "新动画剧本",
  summary:
    "Pages 01-08 establish the minimal formula model, concretize it into VertexData -> GPU -> Pixels, move from OpenGL compilation into a Vulkan PSO view, bridge into the UE asset cook flow, then zoom into InlineCode, PSO cache hash indirection, and the necessity of SharedCode.",
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
        "把 Raw ShaderCode 先 compile 成 Binary ShaderCode，再经过 link 得到 Program；这一组还可以提前缓存成可复用产物，最后和状态一起喂给 GPU。",
      notes:
        "第三页不是抛弃第二页，而是把第二页整组往下压，给上方让出 OpenGL 配置带。这里左边最重要的是 Raw ShaderCode 经由 glCompileShader() 变成 Binary ShaderCode，再通过 glLinkProgram() 组织成 Program，随后还可以用 glGetProgramBinary() 把这一组取回做缓存；最后由 glUseProgram() 往下启用。右边的 Depth、Blend 继续通过 Graphics API 调用往下配置到 GPU。",
      focusTarget: "OpenGL",
      timingHint:
        "先让底部三段整体下移，再显出上方配置层，最后停在 GPU 被多条上方配置线汇入的终态。",
      intro:
        "现在开始把“GPU 自己算”这个中间节点拆开，看到 OpenGL 里它其实还要接收编译结果和状态配置。",
      manuscript:
        "第二页里我们只看到 VertexData 进入 GPU，最后吐出 Pixels。到了第三页，这条底部主轴整体下移，GPU 被放大，上方分成两组 OpenGL 来源。左边是 Raw ShaderCode 先通过 glCompileShader() 变成 Binary ShaderCode，再由多个 shader 一起经 glLinkProgram() 组织成 Program；这一整组还可以通过 glGetProgramBinary() 取回成可复用缓存，最后再用 glUseProgram() 往下启用。右边则是 Depth 和 Blend 分别通过 glDepthFunc() 与 glBlendFunc() 直接往下配置到 GPU。",
      apiListTitle: "Graphics API",
      apiList: [
        {id: 1, label: "glCompileShader()"},
        {id: 2, label: "glUseProgram()"},
        {id: 3, label: "glDepthFunc()"},
        {id: 4, label: "glBlendFunc()"},
        {id: 5, label: "glLinkProgram()"},
        {id: 6, label: "glGetProgramBinary()"},
      ],
      focusColorKey: "opengl",
    },
    {
      id: "page_04",
      label: "Vulkan",
      caption:
        "把 Raw ShaderCode 更早整理成 SPIR-V ShaderCode，再连同状态先收进 Description 和 PSO；这一组还能通过缓存数据复用，运行时只保留更少的高亮调用。",
      notes:
        "第四页继承第三页的底部主轴和上方输入分区，不重画结构，而是在保持 Raw ShaderCode -> SPIR-V ShaderCode 这条 Vulkan shader 路径的同时，把 SPIR-V、Depth、Blend 先收进一份 Description，再由 create 过程生成 PSO。这个预处理区还能通过 vkGetPipelineCacheData() 取回缓存；真正高亮的只剩下运行时那一条绑定线。",
      focusTarget: "PSO",
      timingHint:
        "先保留第三页的空间记忆，把左侧 shader 产物改写成 SPIR-V，再让三条直达 GPU 的调用缩回到 Description，接着生成 PSO，最后只保留一条橙色 PSO -> GPU 通道。",
      intro:
        "Vulkan 的关键变化不只是 shader 形态更稳定，还在于上方配置会先被显式组织成可以复用和绑定的对象。",
      manuscript:
        "到了第四页，第三页上方那套结构没有消失，但它的语义变了。左边不再强调 Binary ShaderCode，而是从 Raw ShaderCode 先得到 SPIR-V ShaderCode。接下来，SPIR-V ShaderCode 不再和 Depth、Blend 一样各自直接高亮敲到 GPU 上，而是先一起进入一份 Description。然后这份 Description 通过 vkCreateGraphicsPipelines() 创建出正确的 PSO；这套预处理结果还可以通过 vkGetPipelineCacheData() 取回缓存。到了运行时，真正高亮的一步只剩下 vkCmdBindPipeline()。也就是说，Vulkan 既强调更早拿到稳定的 shader 产物，也强调把这些状态预先收拢成 PSO，减少面向 GPU 的分散调用。",
      apiListTitle: "Graphics API",
      apiList: [
        {id: 1, label: "vkCreateGraphicsPipelines()"},
        {id: 2, label: "vkCmdBindPipeline()"},
        {id: 3, label: "vkGetPipelineCacheData()"},
      ],
      focusColorKey: "vulkan",
    },
    {
      id: "page_05",
      label: "UE Asset Cook",
      caption:
        "把实际资产接进来：Mesh 生成 VertexData，Material 经过 cook 变成 Cooked ShaderCode，再继续整理成 Binary ShaderCode。",
      notes:
        "这一页是慢慢过渡到 UE 的关键。先不要把 PSO 那些中间层重新塞回来，而是回到更干净的主轴：资产先变成运行时真正要喂给 GPU 的东西。Mesh 对应 VertexData，Material 先产出 Cooked ShaderCode，再继续落到 Binary ShaderCode，然后送向 GPU。",
      focusTarget: "Cook",
      timingHint:
        "让 Vulkan 页里偏技术产物的视角，平滑过渡到 UE 里的资产视角，同时保持 GPU 和 Pixels 的位置稳定。",
      intro:
        "到了 UE 语境，大家更容易接触到的不是 raw shader 文件本身，而是 Material 和 Mesh 这些资产入口。",
      manuscript:
        "第五页先不急着讲 PSO，而是先把实际资产接进来。Mesh 会整理出运行时要用的 VertexData；Material 会在 cook 过程中先产出 Cooked ShaderCode，再进一步整理成 Binary ShaderCode，最后再送向 GPU。也就是说，这一页本质上是把前面的 shader 与输入语义，翻译成 UE 更常见的资产来源，同时把 shader 产物的语义补全。",
      focusColorKey: "ue",
    },
    {
      id: "page_06",
      label: "InlineCode 内部结构",
      caption:
        "从 Material 到 FMaterialResource，再到 FShaderMap 与 InlineCode blob，把第五页那个问号真正放大开来看。",
      notes:
        "第六页不是另起炉灶，而是把第五页 Material -> Cooked ShaderCode 那一小段放大。重点不是 GPU，而是 UE 内部存储链路：一个 Material 会派生出 FMaterialResource，里面挂着 FShaderMap；InlineCode 模式下，真正的 shader code 会跟着这个 ShaderMap 一起被塞进 uasset 包里。",
      focusTarget: "InlineCode",
      timingHint:
        "从第五页问号位置做局部放大，把原来的资产链条淡出成背景，再在放大画布里展开 Material、FMaterialResource、FShaderMap、InlineCode 这一串。",
      intro:
        "如果只停在 Cooked ShaderCode 这个名字上，观众还是不知道 UE 里究竟是谁在持有这些 code。",
      manuscript:
        "把第五页 Material 到 Cooked ShaderCode 之间那个问号放大以后，能看到更具体的 UE 结构。一个 Material 在 cook 时不会直接变成 ready-to-bind 的 PSO，而是先展开成多个 FMaterialResource；每个 FMaterialResource 又持有自己的 FShaderMap。到了 InlineCode 模式，这个 FShaderMap 对应的 code 和 metadata 会一起内联进 uasset，所以你可以把它理解成“每个材质资源都带着自己那份 InlineCode blob”。这就是最直观、也最容易理解的起点。",
      focusColorKey: "ue",
    },
    {
      id: "page_07",
      label: "PSO cache 为什么只存 Hash",
      caption:
        "把 PSO cache 放到同一个放大视角里，就能看清它记录的是 Hash、key 和 metadata，而不是整份 ShaderCode。",
      notes:
        "第七页延续第六页的放大画布，不要换坐标系。左边还是 InlineCode 那条链，右边引入 PSO cache。视觉重点是把“代码存储”和“PSO 记录”明确分开：PSO cache 只记 Hash、key、metadata，用来索引与重建，并不把完整 ShaderCode 再复制一份进去。",
      focusTarget: "PSO cache",
      timingHint:
        "保留第六页骨架，只在右侧长出 PSO cache 盒子和 Hash 索引线，让观众感受到这是同一张图上的新解释层。",
      intro:
        "理解了 InlineCode 的归属之后，下一步就要解释一个常见误区：为什么 PSO cache 文件里看到的主要是 Hash。",
      manuscript:
        "PSO cache 的职责不是替代 shader 存储层，而是记录“这个 PSO 组合需要哪些 shader、状态和查找线索”。所以在这一层里，更重要的是 Hash、key 和 metadata，而不是把整份 ShaderCode 再抄一遍。这样做的好处是 cache 文件更轻，也更稳定；它只负责描述和索引，真正的 ShaderCode 仍然待在原来的存储体系里。问题也随之出现了：如果运行时只拿到 Hash，要去哪里反查真正的 code？",
      focusColorKey: "page_04",
    },
    {
      id: "page_08",
      label: "SharedCode 为什么成为必需",
      caption:
        "当 PSO 预编译只拿到 Hash 时，就必须有一套全局 SharedCode / ShaderArchive 来完成反查、去重和复用。",
      notes:
        "第八页延续第七页结构，不推翻第六页，而是让多个 Material / ShaderMap 汇到同一个 SharedCode Library。重点要讲清两件事：第一，InlineCode 会让相同 shader code 分散在很多资产里；第二，PSO 预编译只有 Hash，没有一个全局 ShaderArchive 就没法反查，也没法高效去重。",
      focusTarget: "SharedCode",
      timingHint:
        "让第六页那块 InlineCode blob 平滑演化成 SharedCode Library，同时从上方接入多个来源，形成“集中存储、全局索引”的感觉。",
      intro:
        "这时候 SharedCode 就不是锦上添花，而是被 PSO 预编译和跨资产复用共同逼出来的基础设施。",
      manuscript:
        "一旦系统进入 PSO 预编译阶段，运行时拿到的往往只是 Hash，而不是现成的 ShaderCode blob。InlineCode 模式下，这些 code 分散在各个 uasset 里，既重复存储，也没有一套全局 Hash -> ShaderCode 的反查路径。于是 SharedCode 变成必需：把大量重复的 ShaderCode 统一收进 SharedCode Library 或 ShaderArchive，前面只保留 ResourceHash、ShaderHash 这类索引。这样既能去重，也能让 PSO 根据 Hash 找回真正的 code，完成预编译与复用。",
      focusColorKey: "shared",
    },
  ],
};
