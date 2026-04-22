import type {Storyboard} from "./pso-workbench-types";

export const masterStoryboard: Storyboard = {
  storyId: "storyboard-reset",
  title: "新动画剧本",
  summary:
    "Page 00 opens on one image-led evidence page that frames the whole talk with one enlarged runtime stutter image, one aligned after sample below it, and two focused prompt questions on the side. Pages 01-09 then establish the minimal formula model, concretize it into VertexData -> GPU -> Pixels, move from OpenGL compilation into a Vulkan PSO view, insert a dedicated data checkpoint page between Vulkan and UE Cook, then bridge into the UE asset cook flow and split the UE shader-code zoom into ownership layers and runtime InlineCode lookup before moving into PSO cache hash indirection and the necessity of SharedCode. Pages 10-21 then flash back to the page 05 cook question, replay that old question as a `? -> !` beat, merge `Material + CookedShaderCode` into `ShaderLibrary`, land the computer/phone loop stage, insert dedicated full-screen supplement image pages at runtime stutter, rec capture, and precompile peak smoothing checkpoints, and finally cut back to the player-facing delivery view where `stable.upipelinecache + ShaderLibrary` point directly into the runtime phone. Pages 22-30 act as the PSO tail section, summarizing the PSO / PSO Cache boundary and extending into optimization, governance, platform notes, and the standalone reading page. Pages 31-33 become an epilogue that covers the live project harness, a feedback-system bridge, and a standalone final page combining the `《逍遥游》` quote with the remaining recommendations.",
  sessions: [
    {
      id: "s1-foundation",
      label: "Session 1 · 抽象模型到图形 API",
      stepIds: ["page_00", "page_01", "page_02", "page_03", "page_04", "page_04_data"],
    },
    {
      id: "s2-ue-shader",
      label: "Session 2 · UE Shader 资产与 SharedCode",
      stepIds: [
        "page_05",
        "page_06",
        "page_07",
        "page_08",
        "page_09",
        "page_09_img",
        "page_10",
      ],
    },
    {
      id: "s3-runtime-loop",
      label: "Session 3 · 运行时收集与回传闭环",
      stepIds: [
        "page_11",
        "page_12",
        "page_13",
        "page_14",
        "page_13_img",
        "page_15_img",
        "page_15",
      ],
    },
    {
      id: "s4-stable-precompile",
      label: "Session 4 · Expand / Build / 预编译",
      stepIds: ["page_16", "page_17", "page_18", "page_18_img", "page_19", "page_21"],
    },
    {
      id: "s5-awareness-bridge",
      label: "Session 5 · PSO 的尾声",
      stepIds: [
        "page_22",
        "page_24",
        "page_25",
        "page_26",
        "page_27",
        "page_28",
        "page_29",
        "page_29_data",
        "page_30",
      ],
    },
    {
      id: "s6-optimization-notes",
      label: "Session 6 · 后记",
      stepIds: ["page_31", "page_32", "page_33"],
    },
  ],
  steps: [
    {
      id: "page_00",
      label: "开场",
      caption:
        "先把 `PSO Cache 前 / 后` 的两张关键图对齐摆出来，右侧只保留 2 个真正要追问的问题。",
      objectiveFacts: ["启动游戏必经之路——着色器编译"],
      keyPoints: [
        "去掉画布内 `开场` 标题，把视觉重心直接交给放大的 `PSO Cache 前` 主图。",
        "底部只保留 1 张 `PSO Cache 后` 结果图，并让它和主图左右齐边。",
        "右侧不再保留 3 个泛问题，而是只问两件事：单帧高峰从何而来、预热着色器在干什么。",
      ],
      notes:
        "page_00 现在进一步收窄成看图优先的开场结构。画布内不再额外写 `开场` 标题，左边直接给一张更大的 `PSO Cache 前` 卡顿证据图；底部 `PSO Cache 后` 只保留 1 张结果图，并让它与主图左右齐边；右边不再堆 3 个泛问题，只保留 2 个真正贴着图片看的追问。观众先被前后图抓住，再带着两个问题进入后文。",
      focusTarget: "开场",
      timingHint:
        "第一页静态停留，再整体淡出到 `Input -> f(x) -> Output` 的最小模型，不做中间闪回。",
      intro:
        "在开始讲最小模型之前，先把 `PSO Cache 前 / 后` 的关键对照摆平，让观众先盯住证据。",
      manuscript:
        "先不要急着进入公式。这一页先把 `PSO Cache 前` 的卡顿现场放大，再把唯一保留的 `PSO Cache 后` 结果图贴着主图下方左右齐边，让观众先把前后差异看清楚。右边不再摆 3 个泛化问题，而是只保留两个真正贴着图片去问的问题：跟这个图片相比，匹配的单帧高峰从何而来？预热着色器到底是在干什么？这一页的职责不是解释完答案，而是把后面整段讲解真正要追的两件事钉住。",
      focusColorKey: "shared",
    },
    {
      id: "page_01",
      label: "抽象函数",
      caption: "从输入经过一个函数得到输出，这是后续所有框架演化前的最小骨架。",
      keyPoints: [
        "先让观众记住 Input -> f(x) -> Output 这条基础主轴。",
        "后续所有 API 与工程结构，都是这条主轴的展开。",
        "后面会提到的预编译着色器，也可以先理解成这条主轴的一次前置准备。",
      ],
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
      label: "把函数原型映射到渲染语义",
      caption:
        "把抽象的 f(x) 具体化成 GPU，把输入和输出换成渲染语义，再补一个最小的 Pipeline State 入口和一张左上角 PSO 预告卡。",
      objectiveFacts: ["PSO 的状态组合空间呈指数级增长"],
      keyPoints: [
        "Input 对应 VertexData，f(x) 对应 GPU，Output 对应 Pixels。",
        "三段位置保持不变，只替换语义，建立空间连续性。",
        "这一页在 GPU 上方补一个从上到下进入 GPU 的 `Pipeline State`，并在实线上先用 `GfxAPI设置` 统称。",
        "再在左上角挂一张缩略 `PSO = Shader + State` 卡，提前埋下“状态里到底装了什么”的钩子。",
      ],
      notes:
        "这一页不是跳到全新构图，而是在第一页三个固定槽位里完成演化。左边变成 VertexData 图形，中间变成 GPU，右边变成 4x4 像素输出；同时在 GPU 上方补一个最小的 `Pipeline State` 节点，并用一条写着 `GfxAPI设置` 的实线自上而下接进 GPU。然后再把缩略 `PSO = Shader + State` 预告卡挂到左上角空白带里，只轻量点一下 state 里会收很多维度，不压住下方节点，也不把第三页那些 OpenGL 细节提前讲散。",
      focusTarget: "GPU",
      timingHint: "让三处位置保持稳定，只让内容和轮廓形变。",
      intro:
        "现在开始把公式里的抽象变量替换成图形渲染里的真实角色。",
      manuscript:
        "第一页我们只说 Input 经过 f(x) 变成 Output。到了这一页，Input 更具体地变成 VertexData，f(x) 更具体地变成 GPU，而 Output 也不再是抽象结果，而是最终的像素块。同时我先补一个最轻量的状态入口：GPU 上方放一个 `Pipeline State`，再用写着 `GfxAPI设置` 的实线往下接到 GPU。接着在左上角空白带里挂一张缩略 `PSO = Shader + State` 卡，让听众先知道“除了 shader，本身还有一整套 state 也会进来”，而且 `Depth / Stencil Test`、`Blend / Rasterizer State` 这些名词也先露个面。这样第二页先建立“除了数据，还有状态要喂给 GPU”这件事；到了第三页，再把这个总称继续展开成 OpenGL 里的实际配置层。",
      focusColorKey: "page_02",
    },
    {
      id: "page_03",
      label: "OpenGL：运行时组装 Program",
      caption:
        "把 Raw ShaderCode 先 compile 成 Binary ShaderCode，再经过 link 得到 Program；这一页只讲结构和调用链。",
      objectiveFacts: ["OpenGL 无 PSO，只有 Program"],
      keyPoints: [
        "Shader 在运行时经历 compile -> link -> use 的链路。",
        "Depth/Blend 等状态调用与 Program 一起汇入 GPU。",
        "平均耗时数据独立放到下一页，避免主图拥挤。",
      ],
      notes:
        "第三页不是抛弃第二页，而是把第二页整组往下压，并把第二页那个总称式的 `Pipeline State / GfxAPI设置` 继续展开成真正的 OpenGL 配置带。这里左边最重要的是 Raw ShaderCode 经由 glCompileShader() 变成 Binary ShaderCode，再通过 glLinkProgram() 组织成 Program，随后还可以用 glGetProgramBinary() 把这一组取回做缓存；最后由 glUseProgram() 往下启用。右边的 Depth、Blend 继续通过 Graphics API 调用往下配置到 GPU。",
      focusTarget: "OpenGL",
      timingHint:
        "先让底部三段整体下移，再显出上方配置层，最后停在 GPU 被多条上方配置线汇入的终态。",
      intro:
        "现在开始把\"GPU 自己算\"这个中间节点拆开，看到 OpenGL 里它其实还要接收编译结果和状态配置。",
      manuscript:
        "第二页里我们先看到 VertexData 进入 GPU，最后吐出 Pixels；同时只给了一个总称式的 `Pipeline State`，让观众知道上面还有状态入口。到了第三页，这条底部主轴整体下移，GPU 被放大，上方分成两组 OpenGL 来源。左边是 Raw ShaderCode 先通过 glCompileShader() 变成 Binary ShaderCode，再由多个 shader 一起经 glLinkProgram() 组织成 Program；这一整组还可以通过 glGetProgramBinary() 取回成可复用缓存，最后再用 glUseProgram() 往下启用。右边则是 Depth 和 Blend 分别通过 glDepthFunc() 与 glBlendFunc() 直接往下配置到 GPU。",
      apiListTitle: "Graphics API",
      apiList: [
        {id: 1, label: "glCompileShader()"},
        {id: 2, label: "glUseProgram()"},
        {id: 3, label: "glDepthFunc()"},
        {id: 4, label: "glBlendFunc()"},
        {id: 5, label: "glLinkProgram()"},
        {id: 6, label: "glGetProgramBinary()"},
      ],
      relatedLinks: [
        {
          label: "glCompileShader 官方参考",
          url: "https://registry.khronos.org/OpenGL-Refpages/gl4/html/glCompileShader.xhtml",
        },
        {
          label: "glLinkProgram 官方参考",
          url: "https://registry.khronos.org/OpenGL-Refpages/gl4/html/glLinkProgram.xhtml",
        },
        {
          label: "OpenGL Wiki：单阶段 / 多阶段 Program 混用",
          url: "https://wikis.khronos.org/opengl/Shader_Compilation#Mixing_a_single-_and_a_multi-stage_program",
        },
      ],
      focusColorKey: "opengl",
    },
    {
      id: "page_04",
      label: "Vulkan：预组装 PSO",
      caption:
        "把 Raw ShaderCode 更早整理成 SPIR-V ShaderCode，再连同状态先收进 Description 和 PSO；保持结构主线干净。",
      objectiveFacts: ["Vulkan / Metal 有 PSO可以深度优化"],
      keyPoints: [
        "SPIR-V 与状态先进入 Description，再创建 PSO。",
        "运行时从“多调用”变成“以绑定 PSO 为主”的路径。",
        "下一页再独立展示平均耗时数据。",
      ],
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
      relatedLinks: [
        {
          label: "vkCreateGraphicsPipelines 官方参考",
          url: "https://registry.khronos.org/vulkan/specs/1.3-extensions/man/html/vkCreateGraphicsPipelines.html",
        },
        {
          label: "vkCmdBindPipeline 官方参考",
          url: "https://registry.khronos.org/vulkan/specs/1.3-extensions/man/html/vkCmdBindPipeline.html",
        },
      ],
      focusColorKey: "vulkan",
    },
    {
      id: "page_04_data",
      label: "数据页：OpenGL / Vulkan 平均耗时",
      caption:
        "在进入 UE Cook 前单独停一页，用一张纯表格展示 Link/Create/Bind 的 Min/Max/Avg 对比。",
      objectiveFacts: ["Shader的Compile、Link耗时极高"],
      keyPoints: [
        "列结构固定为 Min / Max / Avg（单元格格式 Nubia / Pixel 7）。",
        "行结构覆盖 Compile / Link / Create / Bind（GL 与 VK 两类 Bind 都显示）。",
        "glCompileShader 的 Avg 按 VS + FS 双编译显示为 x2 口径。",
      ],
      notes:
        "这一页是纯数据插页，和补充图片页采用同一类过渡思路：先淡入数据表，结束前淡出，再进入 page_05 的资产主线。",
      focusTarget: "平均耗时",
      timingHint:
        "固定背景结构，数据卡片淡入淡出，不引入额外连线或节点移动。",
      intro:
        "先给观众一个数据锚点，再切到 UE Cook 主线。",
      manuscript:
        "第四页和第五页之间增加一个纯数据页。这里不再讲结构，只展示一张表：列是 Min/Max/Avg，行覆盖 Compile（glCompileShader）、Link（glLinkProgram）、Create（CreateGfxPipeline）以及 Bind（BindProgramPipeline / BindGfxPipeline）。单元格统一用 Nubia/Pixel 7 双值表达，并给 glCompileShader、glLinkProgram、CreateGfxPipeline 这三项高耗时 Avg 加红色标记。其中 glCompileShader 的 Avg 按 VS / FS 双编译以 x2 口径显示，帮助观众在同一页先读出分布范围与平均值，再切回 UE Cook 主线。",
      focusColorKey: "shared",
    },
    {
      id: "page_05",
      label: "UE Cook：资产进入渲染主线",
      objectiveFacts: ["UE PSO 以 ShaderHash 为索引定位对应的 ShaderCode"],
      caption:
        "把实际资产接进来：Mesh 生成 VertexData，Material 经过 cook 变成 Cooked ShaderCode，再继续整理成 Binary ShaderCode；右上角直接复用前面那张结构卡，但标题改成居中的 `UE PSO = Shaders+States+？`，中间拆成两个小框 `UsageMask` / `BindCount`。",
      keyPoints: [
        "Mesh 对应 VertexData，Material 对应 Shader 产物。",
        "Cooked ShaderCode 是连接资产语义与运行语义的关键桥梁。",
        "右上角保持和前面同构的结构卡，标题居中，顶部写 `VertexShader Hash / PixelShader Hash`，中间用两个小框承接 `UsageMask` / `BindCount`，下面 state 框继续落成 Enum / Struct 名字。",
      ],
      notes:
        "这一页是慢慢过渡到 UE 的关键。先不要把 PSO 那些中间层重新塞回主舞台，而是回到更干净的主轴：资产先变成运行时真正要喂给 GPU 的东西。Mesh 对应 VertexData，Material 先产出 Cooked ShaderCode，再继续落到 Binary ShaderCode，然后送向 GPU。右上角不再贴另一种风格的代码卡，而是直接复用前面那张结构卡的版式，但标题改成居中的 `UE PSO = Shaders+States+？`：顶部写 `VertexShader Hash / PixelShader Hash`，中间把 `UsageMask`、`BindCount` 恢复成两个与下方两列状态对齐的小框，下面尽量直接落成 `Struct / Enum` 名字，其中 `UsageMask` 要更显眼一点。",
      focusTarget: "Cook",
      timingHint:
        "让 Vulkan 页里偏技术产物的视角，平滑过渡到 UE 里的资产视角，同时保持 GPU 和 Pixels 的位置稳定。",
      intro:
        "到了 UE 语境，大家更容易接触到的不是 raw shader 文件本身，而是 Material 和 Mesh 这些资产入口。",
      manuscript:
        "第五页先不急着把 PSO 当成主角讲满，而是先把实际资产接进来。Mesh 会整理出运行时要用的 VertexData；Material 会在 cook 过程中先产出 Cooked ShaderCode，再进一步整理成 Binary ShaderCode，最后再送向 GPU。与此同时，右上角直接放一张和前面同构的结构卡，但标题改成居中的 `UE PSO = Shaders+States+？`：顶部 shader 框写成 `VertexShader Hash / PixelShader Hash`，中间把 `UsageMask`、`BindCount` 恢复成两个与下方两列状态对齐的小框，重点先让观众看到 UE 这里确实存在 `UsageMask` 这一层使用侧信息；下面 5 个状态框尽量直接落成 UE 里的名字，比如 `FVertexDeclarationElementList`、`FGraphicsPipelineRenderTargetsInfo`、`FDepthStencilStateInitializerRHI`、`FBlendStateInitializerRHI / FRasterizerStateInitializerRHI`、`EPrimitiveType / NumSamples / FRHIRenderPassInfo`。这样观众看到的是同一种结构语言，只是语义从“抽象的 PSO 组成”切到“UE PSO 里具体会落什么”，而且会先意识到除了 shader 和 states，UE 侧还额外挂着一些使用侧信息。",
      focusColorKey: "ue",
    },
    {
      id: "page_06",
      label: "UE 分层：区分因素落在哪一层",
      caption:
        "先不急着讲 code 存储，而是先回答 shader 的区分因素分别落在哪一层：Platform 在 UMaterial，FeatureLevel / QualityLevel 在 Resource，ShaderType / VertexFactory / Permutation 在 ShaderMap。",
      keyPoints: [
        "不同维度的区分因素落在不同层级，不是同层混放。",
        "Inline模式下ShaderCode由资产自身持有。",
        "先讲清分层职责，再讲运行时如何取 code。",
      ],
      objectiveFacts: ["Inline模式下ShaderCode由资产自身持有"],
      notes:
        "第六页是拆页后的第一张，只负责讲清楚区分因素到底落在哪一层。左侧保留三张 selector 表：ShaderPlatform、FeatureLevel / QualityLevel、ShaderType / VertexFactory / Permutation；右侧保留 UMaterial -> FMaterialResource -> FMaterialShaderMap 这一条主链。同时补一句基础事实：Inline模式下ShaderCode由资产自身持有。这里不展开 InlineCode 存储细节，只给一个很弱的后续锚点，让观众先建立“哪一层负责区分什么”的认知。",
      focusTarget: "InlineCode",
      timingHint:
        "从第五页问号位置放大以后，先让左侧两串结构成为主体：三张 selector 表和 UMaterial / FMaterialResource / FMaterialShaderMap 一一对齐，右侧 InlineCode 只保留弱锚点，不展开细节。",
      intro:
        "真正进入 InlineCode 之前，先把一个更基础的问题讲透：shader 到底是在 UE 的哪一层被区分开的。",
      manuscript:
        "把第五页 Material 到 Cooked ShaderCode 之间那个问号放大以后，第一步先不要急着钻进 code 存储，而是先看区分因素落在哪一层。ShaderPlatform 决定的是目标图形平台，所以它在 UMaterial 这一层就已经分开；FeatureLevel 和 QualityLevel 决定的是具体资源展开方式，所以它们落在 FMaterialResource 这一层；而 ShaderType、VertexFactory、Permutation 这些真正决定某个 shader 变体的组合键，则落在 FMaterialShaderMap 这一层。同时先补一个很关键的事实：Inline模式下ShaderCode由资产自身持有。第六页的目标只有一个：让观众先建立“不同维度的区分发生在不同层级”这个空间认知，后面再去看运行时如何真正拿到 InlineCode。",
      focusColorKey: "ue",
    },
    {
      id: "page_07",
      label: "InlineCode：运行时如何命中 ShaderCode",
      caption:
        "把左侧的分层提示全部退场，只保留最小锚点，然后把 FShaderMapResource_InlineCode 放大成主角，顺着 ResourceIndex 看它如何命中 ShaderEntries[Index] 并拿到 ShaderCode。",
      keyPoints: [
        "主路径是 ResourceIndex -> ShaderEntries[Index] -> ShaderCode。",
        "Hash 是旁路元数据，不是运行时取 code 的主链。",
      ],
      notes:
        "第七页是拆页后的第二张。左侧三张 selector 表和阴影卡片全部清掉，只保留最小必要锚点：FMaterialShaderMap、FShader、ResourceIndex。腾出来的空间全部让给右侧，重点放大 FShaderMapResource_InlineCode，在其中展开 FShaderMapResourceCode、ShaderEntries[Index]、ShaderHashes[Index] 和 Cooked ShaderCode。强调主链是 Index 驱动拿 code，而 Hash 是旁路元数据。",
      focusTarget: "PSO cache",
      timingHint:
        "延续第六页的主骨架，让左侧分层提示退场、右侧存储块接管舞台。FShaderMapResource_InlineCode 从弱锚点演化成主焦点，内部结构和 Cooked ShaderCode 在这一页真正展开。",
      intro:
        "分层归属看明白之后，下一步才有必要回答一个更细的问题：运行时最终是怎么沿着索引拿到 code 的。",
      manuscript:
        "到了第七页，左边那些负责解释区分层级的辅助结构都先退场，只留下最小运行时锚点。真正要看的，是 FShader 手里先拿到一个局部 ResourceIndex，然后顺着这个 Index 进入 FShaderMapResource_InlineCode，再进一步进入 FShaderMapResourceCode。这里的 ShaderEntries[Index] 才是命中真正 Cooked ShaderCode 的主路径。ShaderHashes[Index] 也跟着存在，但它在这一页更像旁路元数据，不是运行时拿 code 的主链。也就是说，InlineCode 模式最关键的理解是：真正的 code lookup，本质上是 Index 驱动，而不是 Hash 驱动。",
      focusColorKey: "page_04",
    },
    {
      id: "page_08",
      label: "PSO Cache：为什么只存 Hash",
      caption:
        "上方先点出 Material 的 Cooked ShaderCode 仍然跟着资产走；下方再长出 PSO Cache，让 VS/PS Hash 只对齐到 ShaderHashes[Index]。",
      keyPoints: [
        "Code 仍分散在资产侧，PSO Cache 记录的是组合元数据。",
        "PSO 的 shader 信息来自 ShaderHashes[Index]，不是直接存 ShaderCode。",
      ],
      notes:
        "第八页延续第七页的放大画布，不换坐标系。上方先用一个外部 Material 指回 Cooked ShaderCode，说明 InlineCode 下 code 仍然跟着各个资产走，并没有被共享到一个全局库里。下方再长出一个 PSO 结构表格（VS Hash、PS Hash、BlendState、DepthStencilState、RasterizerState、RT Format），连线必须从第七页的 ShaderHashes[Index] 那个位置长出来，而不是误导成从主 runtime chain 直接下去。这样就能把两个问题放在同一页上：code 还散落在各个 uasset 里，而 PSO 手里拿到的又只是 Hash。",
      focusTarget: "PSO cache",
      timingHint:
        "保留第七页骨架，下方长出 PSO 结构表格和从 ShaderHashes[Index] 延伸出来的连线，让观众感受到这是同一张图上的新解释层。",
      intro:
        "理解了 InlineCode 的 lookup 之后，下一步就要解释一个常见误区：为什么 PSO cache 文件里看到的主要是 Hash。",
      manuscript:
        "这一页其实同时在交代两个约束。第一个约束在上面：InlineCode 模式下，Cooked ShaderCode 还是跟着各个 Material 资产走的，它没有被抽出来做共享存储，所以 code 仍然散落在不同的 uasset 里。第二个约束在下面：PSO cache 的职责不是替代 shader 存储层，而是记录一个 PSO 组合需要哪些 shader 和状态，它本质上是 metadata。下方这个表格就是 PSO 的数据结构：VS Hash、PS Hash 加上 BlendState、DepthStencilState 这些管线状态描述。注意看红色连线，这里接的是 ShaderHashes[Index] 这一支，不是上面那条 ResourceIndex 驱动的运行时取 code 主链。也就是说，PSO 里存的是 shader Hash，不是 ShaderCode 本身。两个约束叠在一起，问题就出来了：code 没有共享出来，而 PSO 手里又只有 Hash，预编译时就没有一条简单直接的 Hash -> Code 反查路径。",
      focusColorKey: "page_04",
    },
    {
      id: "page_09",
      label: "提供全局表进行Hash索引",
      caption:
        "SharedCode 的关键不是一句 GlobalIndex，而是两层索引：ShaderMapIndex + ResourceIndex 先得到 LibraryShaderIndex，再用 ShaderEntries[LibraryShaderIndex] 的 Offset/Size 取出真正 code；PSO 的 Hash 也通过 ShaderHashTable 命中同一个 LibraryShaderIndex。",
      keyPoints: [
        "SharedCode 用 LibraryShaderIndex 把运行链与 Hash 反查链汇合。",
        "Shared模式下ShaderCode由全局资产持有，含全局索引，Material共享。",
        "两层索引解决“去重”和“PSO 反查 code”两个问题。",
      ],
      objectiveFacts: ["Shared模式下ShaderCode由全局资产持有，含全局索引，Material共享"],
      relatedLinks: [
        {
          label: "UE Shader Code Library（官方文档）",
          url: "https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/RenderCore/FShaderCodeLibrary",
        },
      ],
      notes:
        "第八页延续第七页结构。split 节点从 FShaderMapResource_InlineCode 变成 FShaderMapResource_SharedCode，并新增 ShaderMapIndex。这里先补一句基础事实：Shared模式下ShaderCode由全局资产持有，含全局索引，Material共享。主路径变成：ShaderMapEntries[ShaderMapIndex] 先给出 ShaderIndicesOffset，再和 ResourceIndex 组合，查 ShaderIndices[ShaderIndicesOffset + ResourceIndex]，得到 LibraryShaderIndex。随后通过 ShaderEntries[LibraryShaderIndex] 里的 Offset/Size，在大二进制里切出 code。PSO 的 Hash 侧边分支则走 ShaderHashTable[Hash] 命中同一个 LibraryShaderIndex，再复用同一段下游流程。",
      focusTarget: "SharedCode",
      timingHint:
        "让第六页的 InlineCode 存储块平滑演化成 SharedCode Library，把 ShaderMapIndex / ResourceIndex 两条线都接入索引转换节点，再让 Hash 分支汇合到同一个 LibraryShaderIndex。",
      intro:
        "这时候 SharedCode 就不是锦上添花，而是被去重和 PSO 预编译共同逼出来的基础设施。",
      manuscript:
        "两个问题同时出现。第一是去重：100 个材质用同一个 BasePass VS，InlineCode 下会存 100 份，包体膨胀。第二是 PSO 反查：预编译时只拿到 Hash，InlineCode 下 code 散落在各个 uasset 里，没有全局接口。SharedCode 把这两件事同时收口，同时也先建立一个基础事实：Shared模式下ShaderCode由全局资产持有，含全局索引，Material共享。主路径先从 ShaderMapEntries[ShaderMapIndex] 拿到 ShaderIndicesOffset，再与 ResourceIndex 组合，查 ShaderIndices[ShaderIndicesOffset + ResourceIndex]，得到 LibraryShaderIndex。随后用 ShaderEntries[LibraryShaderIndex] 的 Offset/Size，从 ShaderArchive 的大二进制切出 ShaderCode。PSO 侧边分支也不是直接拿 code，而是先走 ShaderHashTable[Hash] 命中同一个 LibraryShaderIndex，再复用上面的 Offset/Size 读取流程。这样 Hash 分支和运行时主链在 LibraryShaderIndex 汇合，SharedCode 才真正成为 PSO 预编译可闭环的基础设施。",
      focusColorKey: "shared",
    },
    {
      id: "page_09_img",
      label: "统一存放ShaderCode减少重复消耗",
      caption:
        "插入一页实测证据图：对比 InlineShaderCode 与 SharedShaderCode 的 cook 结果，给 `page_09 -> page_10` 转场补一个“为什么值得做”的数据锚点。",
      keyPoints: [
        "证据页采用整页图展示，不在图内重复顶部标题。",
        "先图后回退，再进入原 `page_09 -> page_10` 主动画。",
      ],
      notes:
        "这个插页固定放在 page09 与 page10 之间：进入时图片淡入、page09 淡出；退出时图片淡出、page09 淡入；之后再播放原本的 page09 -> page10 动画，避免压缩原有节奏。页顶额外补一组真实样例说明：`M = 母材质`、`M-I1 / M-I2 = 两个相同的 Material Instance`；注释压成一行小字，说明两个实例都改了同一个 Static Bool，避免 UE 优化掉而不保存对应 ShaderCode。顶部说明字重整体放轻，上下两排证据卡的竖向留白也重新压回更平衡的状态。",
      focusTarget: "Evidence",
      timingHint:
        "把插页单独拆成一个 step，先完成证据展示，再恢复 page09 并进入原有主线过渡。",
      intro:
        "在进入 page10 的回调答案页前，先用一页证据把“Shared 的收益”讲清楚。",
      manuscript:
        "这一页只做证据展示。我们把 InlineShaderCode 和 SharedShaderCode 的 cook 结果放在同一页对比：材质侧 `.uexp` 在 Shared 下明显变小，同时 ShaderArchive 承担了共享代码承载；再补一组 hash 复用证据，说明同参数实例会复用同一套 ShaderMapHash。顶部 legend 现在改成两行主说明：第一行 `M = 母材质`，第二行 `M-I1 / M-I2 = 两个相同的 Material Instance`；下面再用一行更小的注释补充：这两个实例都额外改了同一个 `Static Bool`，不然 UE 可能会优化掉，不保存对应 ShaderCode。整组字重也比前一版更轻，避免压得太黑；上下两排证据卡的竖向留白一起重排，读起来更顺。讲完后不直接硬切 page10，而是先把证据页淡出、把 page09 SharedCode 画面淡回，再开始原本 page09 到 page10 的回调动画。",
      focusColorKey: "shared",
    },
    {
      id: "page_10",
      label: "回到旧问题：ShaderLibrary 从何而来",
      caption:
        "这一页只做回调：先回退到第五页的旧问题，重播 `? -> !`，再把 `Material / CookedShaderCode` 收成 `ShaderLibrary`，不提前展开后面的电脑 / 手机舞台。",
      keyPoints: [
        "先回到第五页语义，再完成 ? -> ! 的答案转换。",
        "Material 与 Cooked ShaderCode 在这一页收成 ShaderLibrary。",
      ],
      notes:
        "第十页先不要急着露出整个 loop template。观众需要先从 SharedCode 回拉到第五页，重新看到那个 cook 问号；然后问号变成感叹号，`Material` 和 `CookedShaderCode` 再被收成一个新的 `ShaderLibrary`。电脑、手机、`.ushaderbytecode`、`.scl.csv` 和闭环路径都整体后移一页。",
      focusTarget: "ShaderLibrary",
      timingHint:
        "先收缩成问号，再恢复第五页，然后做一次有弹性的 `? -> !` answer beat，最后把 `Material / CookedShaderCode` 收成 `ShaderLibrary`。",
      intro:
        "SharedCode 回答的是全局 code 如何被组织；接下来先别急着讲运行端的全景，而是先回到第五页，把那个旧问题正式回答成 `ShaderLibrary`。",
      manuscript:
        "第十页先故意回到第五页，让观众重新看到 UE Asset Cook 那个旧问题。过渡先收缩成一个问号，然后第五页的结构重新恢复出来。接着问号被收紧、上冲，最后变成一个感叹号，表示答案开始明确了。再往后，原来的 `Material` 和 `CookedShaderCode` 不再维持成两段，而是被收成一个新的 `ShaderLibrary`。也就是说，这一页的目标不是提前展开后面那套新舞台，而是先把第五页那个旧问题正式回答掉，让后面整章整体延后一页再开始。",
      focusColorKey: "ue",
    },
    {
      id: "page_11",
      label: "测试环境收集回路",
      caption:
        "这一页先把新的母版展开出来，并说明为什么必须跑测试环境收集循环。",
      keyPoints: [
        "先建立 Computer 与 Phone 的稳定空间母版。",
        "ShaderLibrary 开始落成 .ushaderbytecode 这条主中轴。",
        "由于②，PSO 只能从真机收集真实被使用的条目，测试环境需要跑收集循环。",
      ],
      objectiveFacts: [
        "由于②，PSO 只能从真机收集真实使用条目，所以测试环境必须跑收集循环",
      ],
      apiHighlights: [".ushaderbytecode"],
      notes:
        "第十一页才让电脑 / 手机双极布局整体落位。这里先不要出现 `cook` 分叉，也不要出现 `.scl.csv`，只是把新的空间母版建立起来，让观众看见后面几页会在什么舞台上继续讲。同时把这一章的收集前提说透：由于②，PSO只能从真机上面收集到真实被使用的条目，而我们需要在测试环境跑收集循环。",
      focusTarget: "Base Stage",
      timingHint:
        "让 callback 页退场，再把 `Computer`、`Phone` 和 `.ushaderbytecode` 平稳拉出，建立后续所有叙事的固定底板。",
      intro:
        "第十页已经把旧问题回答成 `ShaderLibrary`，现在才开始真正展开新章节的母版。",
      manuscript:
        "第十一页先把新的母版真正摆出来。左边是 `Computer`，右边是 `Phone`，而第十页里刚刚被回答出来的 `ShaderLibrary`，这时候开始落成中间那条 `.ushaderbytecode`。这一页除了建立空间锚点，还要补一句收集前提：由于②，PSO只能从真机上面收集到真实被使用的条目，而我们需要在测试环境跑收集循环。也就是说，后面的 Computer / Phone 舞台不是抽象示意，而是为了让这套真实采集闭环成立。",
      focusColorKey: "ue",
    },
    {
      id: "page_12",
      label: "Cook产出ShaderLibrary",
      caption:
        "基础舞台已经就位之后，这一页才把首次 `cook` 讲清：电脑侧分叉，补出另一份设计文件 `.scl.csv(.shk)`。",
      keyPoints: [
        "首次 cook 产出只有 .ushaderbytecode 和 .scl.csv(.shk)。",
        "这一页只讲电脑侧分叉，不提前进入手机运行侧。",
      ],
      apiHighlights: ["cook", ".ushaderbytecode", ".scl.csv(.shk)"],
      notes:
        "第十二页先不要让文件去碰 `Phone`。这一页只做一件事，就是把电脑侧 `cook` 的分叉补全，让观众从“先有 `.ushaderbytecode`”进入“原来另一份设计文件写作 `.scl.csv(.shk)`”。",
      focusTarget: "Cook Split",
      timingHint:
        "保持第十一页的舞台不动，只在电脑侧长出 `cook` 主线和 `.scl.csv(.shk)`，避免把后面的运行时线抢到这一页来讲。",
      intro:
        "基础舞台已经建立好了，接下来先把首次 cook 的完整输出关系补齐。",
      manuscript:
        "到了第十二页，新的信息仍然先留在电脑侧。`cook` 这条主线现在才被明确画出来，并且在电脑侧分出另一份产物：除了已经出现的 `.ushaderbytecode` 之外，还要补出写作 `.scl.csv(.shk)` 的设计文件。这样观众会先记住：首次 cook 不是一个模糊的大黑盒，而是会把不同职责的文件拆成两支。",
      focusColorKey: "shared",
    },
    {
      id: "page_13",
      label: "运行侧接入：.ushaderbytecode 进入 Phone",
      caption:
        "两份文件关系讲清之后，这一页才第一次把 `.ushaderbytecode` 真正接到手机运行时。",
      keyPoints: [
        "Phone 首次吃进 .ushaderbytecode，运行侧正式落地。",
        "本页不引入回传与 stable 流程，控制信息密度。",
      ],
      apiHighlights: [".ushaderbytecode"],
      notes:
        "第十三页让 `Phone` 成为主角，但仍然不要出现回流或 stable。这里只新增第一条真正进入运行端的线路，让 `.ushaderbytecode` 先跨过去。",
      focusTarget: ".ushaderbytecode",
      timingHint:
        "先放大 `Phone`，再只长出 `.ushaderbytecode -> Phone` 这一条线，避免这页信息过载。",
      intro:
        "电脑侧的首次 cook 已经拆清楚了，下一步再回答哪一份最先进入运行端。",
      manuscript:
        "第十三页先把 `Phone` 放大。新增的只有一条真正跨过去的落地线：`.ushaderbytecode` 现在明确进入手机运行时。也就是说，到了这一页，`Phone` 不再只是一个未来终点，而是第一次真正吃进 shader 相关产物，整章的运行端语义才开始落地。",
      focusColorKey: "ue",
    },
    {
      id: "page_14",
      label: "运行时采集：PSO 记录如何形成",
      caption:
        "这一页先停一下，不改主拓扑，只解释手机侧运行时会同时遇到 UE 侧记录与图形后端对象，而且 GPU 不是二者之间的转换器。",
      keyPoints: [
        "UE PSO 是引擎侧记录 / 描述，Gfx PSO 是 RHI / driver 侧运行时对象。",
        "Phone 运行时把 UE PSO 这一层的 ShaderHash 与 State 沉淀为 .rec.upipelinecache。",
        "OpenGL 与 Metal 的显式程度不同，导致记录规模不同。",
      ],
      apiHighlights: [
        ".rec.upipelinecache",
        "CreatePSO类",
        "BindPSO类",
      ],
      notes:
        "第十四页是插入式说明页，不去抢第十三页和后续回流页的拓扑职责。画面重点放在三件事：`Phone` 不只是吃进 `.ushaderbytecode`，它还会把 UE 侧 `ShaderHash + State` 这份记录写成 `.rec.upipelinecache`；这份 UE 记录会在运行时 create / resolve 到图形后端的 `Gfx PSO`；最后再用 `OpenGL` 对比 `Metal` / 现代显式 API，解释为什么显式 API 往往会暴露更多管线状态组合。",
      focusTarget: "Runtime Collection",
      timingHint:
        "先把第十三页作为背景记忆板轻轻缩退，再把这张说明页整体浮上来。退出时先收回说明页，再恢复主线继续进入真正的回传页。",
      intro:
        "在真正把回流线画出来之前，先补一句观众此时最容易追问的问题：手机侧到底在收集什么。",
      manuscript:
        "第十四页不急着把 `.rec.upipelinecache` 直接送回电脑，而是先停下来解释：`Phone` 在吃进 `.ushaderbytecode` 之后，并不是只负责运行，它同时会遇到两层东西。第一层是引擎侧的 `UE PSO`，本质上是 `ShaderHash + State` 这类记录 / 描述；第二层是运行时真正 bind / use 的 `Gfx PSO`，它更像 RHI / driver 侧对象或编译结果。GPU 不是把 `UE PSO` 变成 `Gfx PSO` 的转换器，GPU 是后面消费 `Gfx PSO` 的执行端。`.rec.upipelinecache` 记录的是前面那层 UE 侧信息，而不是把 driver 对象原样落盘。这一页还顺带解释为什么不同 API 看到的记录数量会不同：`OpenGL` 有更多状态是隐式或由驱动代管的，所以 record 往往更少；`Metal` 以及其他更现代、更显式的图形 API，会把更多管线组合明确暴露出来，因此更容易看到更多组合记录。也就是说，`.rec.upipelinecache` 的出现不是凭空多出一份文件，而是运行时观测被沉淀下来的结果。",
      focusColorKey: "shared",
    },
    {
      id: "page_13_img",
      label: "插页证据：运行时卡顿现场",
      caption:
        "独立插入一页全屏证据图，只讲“为什么要做 PSO 这套前置流程”。",
      keyPoints: [
        "这一页不讲新结构，只给观众一个直观痛点锚点。",
        "切出时图片淡出，再衔接下一张 rec 证据图。",
      ],
      notes:
        "这是第一张补充证据插页，位置固定在 page14 和 page15 之间。目的不是加信息密度，而是先把“卡顿痛点”视觉化。",
      focusTarget: "Stutter Evidence",
      timingHint:
        "本页只保留整页图片。进入淡入，退出淡出，然后继续主线。",
      intro:
        "先讲完 page14 采集机制，再给第一张痛点证据图。",
      manuscript:
        "这一页是证据插页。我们先不加新节点，只看一张运行时卡顿现场图：目的是把“为什么需要 PSO cache 前置流程”直观地钉在观众脑子里。看完后不直接跳回流程，而是再接一张 rec 实物图，最后再回到 page15 的回传路径。",
      focusColorKey: "shared",
    },
    {
      id: "page_15_img",
      label: "插页证据：rec 文件样例",
      caption:
        "第二张独立插页，继续放在 page14 和 page15 之间，用于展示 rec 文件实物。",
      keyPoints: [
        "证明“收集”不是抽象动作，而是真的落成文件。",
        "两张证据图播完后再进入 page15 回传页。",
      ],
      apiHighlights: [".rec.upipelinecache"],
      notes:
        "第二张补充证据插页，位置放在 page14 与 page15 之间。用于强化“收集结果可落盘、可回传”的可信度。",
      focusTarget: "rec Evidence",
      timingHint:
        "整页图片展示，切出淡出后直接进入 page15 回传页。",
      intro:
        "卡顿图之后紧接 rec 实物图，让观众把“痛点 -> 采集产物”连起来。",
      manuscript:
        "这页只做一件事：展示 `.rec.upipelinecache` 的实物证据。我们前面已经讲了收集与回传路径，现在用一张图把它落到真实文件层，帮助观众把“运行时观测 -> 文件化结果”建立成稳定记忆。",
      focusColorKey: "shared",
    },
    {
      id: "page_15",
      label: "回传开始：.rec.upipelinecache 回到电脑",
      caption:
        "保持手机放大，再从它身上长出回传腿：运行时开始把 `.rec.upipelinecache` 往电脑侧送。",
      keyPoints: [
        "流程从“单向下发”转为“包含回流”的闭环雏形。",
        "本页重点是 Phone -> rec -> Computer 的回程路径。",
      ],
      apiHighlights: [".rec.upipelinecache"],
      notes:
        "这页接在两张证据图之后，正式回到主拓扑。`Phone` 仍然是主角，只在顶部长出 `.rec.upipelinecache`，并且让它沿着回程路径往电脑侧回送。",
      focusTarget: ".rec.upipelinecache",
      timingHint:
        "保持手机侧高亮，新增 `Phone -> rec -> Computer` 这一圈回传路径，让观众第一次读到真正的回流。",
      intro:
        "痛点和收集产物都看过后，回到主线回答：运行时结果如何送回电脑侧。",
      manuscript:
        "第十五页继续让手机侧保持主角，但语义发生了变化。`Phone` 不再只是接收 `.ushaderbytecode`，它还会在运行时把收集到的结果整理成 `.rec.upipelinecache`，并沿着回程路径送回电脑侧。到这里，PSO 这套流程终于不再是单向分发，而是第一次出现完整的回流半圈。",
      focusColorKey: "shared",
    },
    {
      id: "page_16",
      label: "Expand：把旧 Hash 提升为 StableKey",
      caption:
        "这一页先只解释 expand，不急着讲 build：重点是为什么手机包收集到的 UE PSO 不能直接拿到当前版本使用，必须先借助和 UE PSO 同版本 Cook 出来的双向映射提升成 stable 语义。",
      keyPoints: [
        "手机包收集到的 UE PSO 不是跨版本稳定身份，必须先翻译回 StableKey 语义。",
        "expand 用和 UE PSO 同版本 Cook 出来的双向映射，把 UE PSO 记录提升成 stablepc.csv。",
        "画面右下角直接把问题写出来：为什么不直接用 `rec.upipelinecache`，还要 `expand`？",
      ],
      apiHighlights: ["手机包收集到的UE PSO", "同版本 Cook 双向映射", "stablepc.csv"],
      relatedLinks: [
        {
          label: "Unreal PSO Caches（官方文档）",
          url: "https://dev.epicgames.com/documentation/en-us/unreal-engine/optimizing-rendering-with-pso-caches-in-unreal-engine",
        },
      ],
      notesDataTable: {
        title: "ShaderStableKey 样例",
        rows: [
          {
            label: "Asset",
            value: "Material /Game/MyActor/MyMaterial.MyMaterial",
          },
          {
            label: "ShaderType",
            value: "TMobileBasePassVSFNoLightMapPolicyHDRLinear64",
          },
          {
            label: "ShaderClass",
            value: "MeshMaterial",
          },
          {
            label: "MaterialDomain",
            value: "MD_Surface",
          },
          {
            label: "FeatureLevel",
            value: "ES3_1",
          },
          {
            label: "QualityLevel",
            value: "Num",
          },
          {
            label: "TargetFrequency",
            value: "SF_Vertex",
          },
          {
            label: "TargetPlatform",
            value: "GLSL_ES3_1_ANDROID",
          },
          {
            label: "VFType",
            value: "FLocalVertexFactory",
          },
          {
            label: "PermutationId",
            value: "Perm_0",
          },
          {
            label: "PipelineHash",
            value: "0000000000000000000000000000000000000000",
          },
          {
            label: "KeyHash",
            value: "1318167498",
          },
          {
            label: "OutputHash",
            value: "770BF39593DD7BE95F23F2C8AF5D759BD6F8A1D3",
          },
        ],
      },
      notes:
        "第十六页是 expand 专用说明页。观众此时最容易困惑的是：既然手机包已经把 `UE PSO` 那层 `ShaderHash + State` 收进了 `rec.upipelinecache`，为什么还需要再找一份映射？这一页要明确回答：Hash 不是跨版本稳定身份，只有和这份 UE PSO 同版本 Cook 出来的双向映射，才能把旧 Hash 提升回 StableKey 视角。并且这里的 stable 指的是语义稳定，不是编译结果或 hash 本身稳定。画面右下角会把这句问题直接写出来，帮助观众把注意力锁在“为什么不能直接用旧 rec”上。",
      focusTarget: "Expand",
      timingHint:
        "沿用占位插页的统一进入退出语法，让回传页缩成背景板，再把 `手机包收集到的UE PSO`、`和UE PSO同版本Cook出来的双向映射`、`stablepc.csv` 和一个简化例子浮上来。",
      intro:
        "手机把回流记录送回电脑之后，第一个真正需要解释的问题不是 build，而是为什么电脑侧必须先做一次 expand。",
      manuscript:
        "第十六页先只讲 expand。画面右下角会先直接把问题摆出来：为什么不直接用 `rec.upipelinecache`，还要 expand？因为手机包收集到的 `UE PSO` 里虽然已经有 `ShaderHash + State`，但 `ShaderHash` 本身不是跨版本稳定身份。只要 shader 代码生成、共享方式或者编译结果变了，旧 Hash 就可能失效。所以电脑侧必须拿和这份 UE PSO 同版本 Cook 出来的双向映射，把旧 `ShaderHash` 重新翻译回 `ShaderStableKey` 视角，再和原来的状态一起整理成 `stablepc.csv`。这里的 stable 指的是语义稳定，不是 hash 稳定。比如旧版本里两个 `StableKey` 可能恰好落到同一个旧 `ShaderHash`，运行时只记到一条 Hash 记录；expand 之后，这条记录会重新展开成两个 `StableKey + State` 组合。也就是说，expand 的意义不是重命名文件，而是把手机包收集到的 UE PSO 观察提升回跨版本还能理解的 stable 语义。",
      focusColorKey: "shared",
    },
    {
      id: "page_17",
      label: "Build：把 StableKey 映射回当前 Hash",
      caption:
        "这一页再单独解释 build：所有历史版本的稳定 UE PSO 还不能直接拿来运行，必须再结合当前版本 Cook 出来的双向映射，重新落成当前包体可以用作预编译的 UE PSO。",
      keyPoints: [
        "stablepc.csv 这一层代表所有历史版本的稳定 UE PSO。",
        "build 使用当前版本 Cook 出来的双向映射完成 StableKey -> Hash 映射。",
        "stable.upipelinecache 这一层要被读成当前包体可以用作预编译的 UE PSO。",
      ],
      objectiveFacts: ["Hash 跨版本不稳定，ShaderStableKey 跨版本稳定"],
      apiHighlights: [
        "所有历史版本的稳定UE PSO",
        "当前版本Cook出来的双向映射",
        "当前包体可以用作预编译的UE PSO",
      ],
      relatedLinks: [
        {
          label: "Pipeline Cache 概览（Khronos）",
          url: "https://www.khronos.org/opengl/wiki/Program_Binary",
        },
      ],
      notes:
        "第十七页是 build 专用说明页。这里必须强调：`stablepc.csv` 上面那层语义，代表的是所有历史版本沉淀下来的稳定 UE PSO；而 `.scl.csv` 这次已经不是历史版本那份，而是当前版本 Cook 出来的双向映射。`build` 的职责，是把这些稳定语义重新投影回当前版本的 `ShaderHash + State`，形成当前包体可以用作预编译的 UE PSO，也就是 `stable.upipelinecache`。",
      focusTarget: "Build",
      timingHint:
        "保持 onepage 轻量图解，只讲“所有历史版本的稳定 UE PSO + 当前版本 Cook 双向映射 -> 当前包体可预编译 UE PSO”，并在底部给出稳定键重新映射成当前 hash 的例子。",
      intro:
        "expand 把旧 hash 提升成 stable 语义之后，还差最后一步：怎么把这些 stable 语义重新落回当前版本。",
      manuscript:
        "第十七页只讲 build。expand 结束之后，电脑侧手里已经有 `stablepc.csv`，里面是 `ShaderStableKey + State`；这一层要把它读成所有历史版本沉淀下来的稳定 UE PSO。但这仍然不是当前版本运行时能直接消费的格式，所以还需要拿当前版本 Cook 出来的双向映射，也就是当前版本的 `scl.csv`，把 `StableKey` 再映射回当前版本的 `ShaderHash`，最终生成 `stable.upipelinecache`。而 `stable.upipelinecache` 这一层，则要被读成当前包体可以用作预编译的 UE PSO。比如第十六页里 expand 得到了两条 `StableKey + State`，而当前版本的 `scl.csv` 可能会把它们重新映射成两个新的 `ShaderHash`；这样 build 出来的就会是两条当前版本可用的 PSO 记录。也就是说，build 不是重复 expand，而是把稳定语义重新装配成当前版本真正能拿来预编译和加载的缓存表达。",
      focusColorKey: "shared",
    },
    {
      id: "page_18",
      label: "闭环落地：stable.upipelinecache 回到手机",
      caption:
        "说明页讲完之后，回到主流程舞台，把 `stable.upipelinecache` 真正接回手机侧，让收集、构建、再使用完整闭合。",
      objectiveFacts: [
        "PSO 手机闭环：真机采集 -> Expand -> Build -> 给真机预编译",
      ],
      keyPoints: [
        "expand + build 的结果回到 Phone，闭环真正完成。",
        "这一页只做主舞台收束，不再新增概念层。",
      ],
      apiHighlights: [
        ".ushaderbytecode",
        ".scl.csv",
        ".rec.upipelinecache",
        "stablepc.csv",
        "stable.upipelinecache",
      ],
      notes:
        "第十八页不再是 onepage 说明，而是主舞台闭环页。观众已经在 page16 和 page17 分别理解了 expand 与 build，所以这一页只需要把 stable band 和 `stable.upipelinecache -> 手机` 压回主舞台，读成完整闭合即可。",
      focusTarget: "Closed Loop",
      timingHint:
        "先恢复 page15 的回流主舞台，再长出 stable band 和 `stable -> 手机` 那一笔，让闭环在同一页收束完成。",
      intro:
        "现在 expand 和 build 都解释清楚了，终于可以回到主流程，把稳定产物真正送回手机使用。",
      manuscript:
        "第十八页回到主流程舞台。手机送回来的 `.rec.upipelinecache` 已经在电脑侧经过 expand 整理成 `stablepc.csv`，又经过 build 变成 `stable.upipelinecache`。现在这一份 stable 产物终于再次回到手机侧继续使用。这样一来，PSO收集循环也就被压成一句完整的话：Phone采集`.rec.upipelinecache`，Computer经Expand / Build生成`stable.upipelinecache`，再回到Phone。也就是说，手机负责运行与收集，电脑负责把旧 Hash 提升成 stable 语义，再把 stable 语义落回当前版本，最后 stable 结果重新喂回手机。PSO 的收集、构建、使用，到这里才真正闭合。",
      focusColorKey: "shared",
    },
    {
      id: "page_18_img",
      label: "插页证据：预编译平滑高峰",
      caption:
        "在进入预编译细节前，先给一页结果图：前置后高峰被平滑。",
      keyPoints: [
        "先看结果，再讲机制，降低后续理解门槛。",
        "本页是视觉证据，不新增结构节点。",
      ],
      notes:
        "第三张补充证据插页。位置放在闭环完成后、预编译章节前，用于建立“这套流程值得做”的结果导向认知。",
      focusTarget: "Peak Smoothing Evidence",
      timingHint:
        "整页图片淡入，退出淡出后切到 page19 进入预编译流程解释。",
      intro:
        "闭环讲完，先看结果图，再进入预编译分解。",
      manuscript:
        "这页给出“预编译解决高峰”的结果证据。目的是先让听众看见收益，再进入 page19 去讲 stable 缓存如何一路在 UE 内部收口成 GfxPSO，向上驱动 GPU，并继续映射到各个 API 的本地 binary / cache 表达。这样观众会更容易接受后面的机制细节。",
      focusColorKey: "shared",
    },
    {
      id: "page_19",
      label: "预编译：stable 缓存进入本地 PSO",
      caption:
        "主图继续讲 stable.upipelinecache 如何在 UE 内部落成 `GfxPSO`，并向上驱动顶部横排的 `VertexData / GPU / Pixels`；右侧再对照不同 API 的 binary / cache 形态与落盘缓存。",
      keyPoints: [
        "输入来自 stable.upipelinecache。",
        "UE PSO 先在内存中收口成 `GfxPSO`，再向上驱动 `VertexData / GPU / Pixels` 这一排运行链。",
        "OpenGL / Vulkan / Metal 在 API binary/cache 与本地缓存态的载体不同。",
        "binary instability 不再塞进一条细长横条，而是拆成 3 条 note 分开讲失效来源。",
        "Metal Binary Archive 2 先当作待验证分支，不先讲成确定答案。",
      ],
      objectiveFacts: [
        "编译后的 PSO 可写入本地 binary，后续直接 Load",
        "本地 binary 强依赖 OS / 驱动 / 芯片，不能稳定分发",
      ],
      apiHighlights: [
        "stable.upipelinecache",
        "UE PSO",
        "GfxPSO",
        "GPU",
        "Program Binary",
        "Pipeline Cache",
        "Binary Archive",
        "BinaryFileCache",
        "functions.data",
      ],
      notes:
        "第十九页现在是主承载页：左侧 `stable.upipelinecache` 仍然在容器内展开成 `UE PSO` 子树，但主脊柱改成 `stable.upipelinecache -> GfxPSO -> GPU`，其中 `VertexData / GPU / Pixels` 横排放在上方，`GfxPSO` 从下方向上接入 GPU。右侧继续并列展开 OpenGL / Vulkan / Metal 三行 binary / cache 节点，并用三条水平虚线分别指向磁盘中的 `Program Binary Cache`、`VulkanPSO.cache` 与 `BinaryArchive / functions.data`；原来的细长 summary 改成主图下方 3 条 note，避免字体过挤。",
      focusTarget: "Precompile",
      timingHint:
        "让 page18 缩退后先拉出合并主链，保留一小段停留，再把 page21 作为下一段 awareness page 淡入，不再单独插入 page20。",
      relatedLinks: [
        {
          label: "知乎：Program Binary / 预编译缓存",
          url: "https://zhuanlan.zhihu.com/p/587988966",
        },
      ],
      intro:
        "闭环成立后，直接把预编译主图和 binary instability 压进同一页：既讲 stable 缓存怎么落到本地 PSO，也把“为什么旧缓存会失效”拆成 3 个清楚 note。",
      manuscript:
        "第十九页现在把两层意思压进同一页。第一层还是主图：左边的 `stable.upipelinecache` 先在引擎侧展开成 `UE PSO`，组内再用 `PSO 1 / PSO 2 / PSO ...` 表示批次对象，随后不再直接讲成一根竖着的 GPU 脊柱，而是先在内存里收口成一个 `GfxPSO`，再由 `GfxPSO` 从下方向上驱动顶部横排的 `VertexData -> GPU -> Pixels`。这样观众会先看清“内存中的 PSO 到底是什么”，再看它如何进入实际执行链。接着同一页继续把三种 API 的持久化差异并列画出来：OpenGL 节点里写 `Program Binary`，Vulkan 节点里写 `Pipeline Cache`，Metal 节点里保留 `Binary Archive / 系统管理` 这条主线，同时把 `Binary Archive 2` 先打个问号，提醒自己这条线在社区讨论里评价并不稳定，暂时不要讲成确定答案。它们继续分别落到磁盘里的 `Program Binary Cache`、`VulkanPSO.cache` 和 `BinaryArchive / functions.data`。第二层不再是一条细长 summary，而是主图下方 3 条 note：`Shader / State`、`codegen / 映射`、`OS / Driver / GPU / API`。这 3 条 note 一起说明同一件事：本地 binary / cache 只是某次组合的落盘形态，不是稳定接口；任何一层变化，都可能让旧缓存失效。所以构建机上能用的本地二进制，并不能被当成稳定产物直接分发到大量玩家机器上复用。",
      focusColorKey: "shared",
    },
    {
      id: "page_21",
      label: "玩家视角：直接拿到预构建结果",
      caption:
        "从复杂的 cook / cache 展开退回玩家视角：左边只保留 `stable.upipelinecache` 与 `ShaderLibrary` 两份结果，直接指向放大的手机。",
      keyPoints: [
        "先从 page19 的复杂树状结构退回玩家视角，只留下真正随包发到玩家端的两份结果。",
        "上方卡片直接写 `stable.upipelinecache`，表示玩家拿到的是预构建好的 PSO 结果。",
        "下方卡片直接写 `ShaderLibrary`，并补 `.ushaderbytecode` 作为它在包体里的主要承载。",
        "顶部这 3 个 node 和 2 条输入 edge 要直接复用 page18 还原阶段的 shared carrier，一路 morph 到最终落位，不能重新 fade in 一套副本。",
        "两张卡上下对称同时指向放大的手机，表示玩家运行时消费的是结果，而不是现场再做 cook。",
        "这一页的结论不是“绝不再卡”，而是把最重的整理工作尽量前移，运行时更不容易卡顿。",
      ],
      apiHighlights: ["stable.upipelinecache", "ShaderLibrary", ".ushaderbytecode", "Phone", "Player Runtime"],
      notes:
        "这一页不再沿用 summary 板，而是回到 page18 的电脑/手机主舞台语法，但最终会删掉蓝色 `cook` 支线，只保留两份直接发给玩家的结果资产与一个更大的手机终端；过渡上先完整恢复带蓝色 `cook / rec / stable` 闭环的 page18 主舞台，停一拍，再把旧舞台左移退场。当前节奏专门做成“更快回到 page18、外层板按两倍速度更快淡入、完整还原后明确停留，再开始左移退出”，避免旧舞台只出现几帧就离开。注意：最终保留下来的 `stable.upipelinecache`、`ShaderLibrary`、`Phone` 与两条输入线，必须复用还原阶段的同一批 shared carrier 做形变，不允许额外生成 callback duplicate。",
      focusTarget: "玩家视角",
      timingHint:
        "让 page19 的复杂主图先更快淡出，同时把 page21 外层板的淡入按两倍速度提速，完整恢复带蓝色 `cook / rec / stable` 闭环的 page18 主舞台并明确停留一段，再把旧舞台左移退场，最后由同一批 shared carrier 继续 morph 成两张结果卡和放大的手机；新增这一页后，总时长应该增加，不能压缩 page19 原来的退场节奏。",
      goalDetail:
        "这里要强调的是玩家直接拿到结果资产，而不是把 `cook / expand / build` 的过程再次带到运行时。",
      intro:
        "进入概念总结之前，先切回玩家视角，看看最终真正被下发到设备上的是什么。",
      manuscript:
        "第二十一页把镜头从 `page_19` 的复杂主图里抽出来，先完整回到 `page_18` 的主舞台，让观众重新看见蓝色 `cook / rec / stable` 闭环、电脑、手机和两份直达手机的结果资产，而且要停一拍，确认这真的是旧舞台被还原了。接着再把这整组旧舞台整体向左移走，正式切到更接近玩家实际感知的一层。这里顶部保留下来的 `stable.upipelinecache`、`ShaderLibrary`、`Phone` 和两条输入线，不是重新 fade in 出来的一套新图，而是沿用还原阶段已经出现的同一批 shared carrier 一路 morph 到最终落位。最终落下来的画面里，左边不再保留 `cook / expand / build` 那些整理过程，而是只剩下两份真正会被打进包、发到设备上的结果资产。上面那张卡直接写 `stable.upipelinecache`，表示预构建好的 PSO 结果；下面那张卡直接写 `ShaderLibrary`，并补一句 `.ushaderbytecode`，提醒观众它在包体里的主要承载。两张卡上下对称同时指向一个往左移并放大的手机，表示外网玩家拿到的是这些已经准备好的结果，再进入运行时，自然就比“现场 compile / link / cook”更不容易卡顿。这一页不是要承诺卡顿从此绝迹，而是把“玩家看到的是结果资产，而不是后台整理过程”这件事钉清楚，然后再进入下一页对 `PSO` 和 `PSO Cache` 的概念总结。",
      focusColorKey: "shared",
    },
    {
      id: "page_22",
      label: "我的理解：PSO 与 PSO Cache",
      caption:
        "把前文收成一张五连反证表：左边写“别这么干”，中间只写客观事实编号，右边写硬后果，让 SharedShaderCode、预编译、分发、采集和 Expand / Build 串成一条递进链。",
      keyPoints: [
        "左列不再讲抽象定义，而是直接摆 5 个“不能这么做”的头铁选项。",
        "中列不再保留 `A1 / A2` 这种额外代号，也不再重复写事实句，只保留真实累计客观事实编号：`6 / 8`、`5`、`12 / 13`、`2 / 9`、`10 / 11`。",
        "中列整体收窄，左右两列放大，左右文案字号同步抬高；中列事实圈和左侧 NotesPanel 里被这页用到的累计事实编号都做发光命中态。",
        "右列对应写反着做的后果：反查不到 ShaderCode、编译高峰甩给玩家、构建机二进制不能稳定分发、PSO 数量起飞、新包 Hash 对不上旧 rec。",
      ],
      highlightedObjectiveFactIds: [2, 5, 6, 8, 9, 10, 11, 12, 13],
      apiHighlights: [
        "SharedCode",
        "ShaderLibrary",
        ".rec.upipelinecache",
        "stable.upipelinecache",
        "PSO / PSO Cache",
      ],
      notes:
        "这一页不再是“主链三步回顾板”，而是收成一张更狠一点的反证表。顶部 `前文收束` 也被去掉，画面只剩三列主体。左边统一写“非要这么干？”这类短语，中间不再出现 `A1 / A2` 这种看起来像临时代号的标记，也不重复写事实句，而是只保留真实累计客观事实编号：第 1 行 `6 / 8`，第 2 行 `5`，第 3 行 `12 / 13`，第 4 行 `2 / 9`，第 5 行 `10 / 11`；同时把中列整体收窄、左右两列放大，左右两个间距里继续保留从上到下的箭头，把 5 行递进方向直接压在版式里。右边继续把硬后果直接写出来，左右文案字号也一起抬高。SharedShaderCode 被放到第 1 行，作为整套系统的源头开关；后面 4 行再顺着预编译、二进制分发、cook 全量统计、旧 rec 直接复用一路递进。除了中列事实圈以外，左侧 NotesPanel 里被这页用到的累计事实编号也一起发光，帮助观众把“侧栏编号”和“中列编号”读成同一套依据。footer 下方继续保留 `样本 B` 图作为例子，但不再补 `样本 B` 这行字，让整页收束停在 tradeoff 本句本身。",
      focusTarget: "Bridge Summary",
      timingHint:
        "从 page21 的玩家视角页推入后，整板三列一起落位，观众按从左到右、从上到下的顺序读完 5 行递进反证；footer 单独在底部收束，不再追加样本图。",
      intro:
        "玩家拿到的结果讲清后，先别急着进入策略页，先用一页反证表把前面的约束和代价重新锁死。",
      manuscript:
        "第二十二页不再把前文收成一条散文式主链，而是直接做成 5 行递进的反证表。第 1 行先回答源头开关：如果不打开 `SharedShaderCode`，那 `UE PSO` 手里就只有 `ShaderHash`，收集结果也很难在下一次靠 Hash 反查到真正的 `ShaderCode`。中列不再自造编号，而是直接复用左侧 NotesPanel 的累计客观事实序号：第 1 行用 `6 / 8` 回答源头开关，第 2 行用 `5` 回答为什么不能放弃预编译，第 3 行用 `12 / 13` 反驳直接分发构建机构建的二进制，第 4 行用 `2 / 9` 说明为什么不能在 cook 时一把梭算完，第 5 行用 `10 / 11` 收口为什么新包不能直接吃上一个版本的 `.rec.upipelinecache`。版式上把中列收窄，给左右两列让出更多宽度，左右文案字号也一起放大；中列事实圈继续做发光命中态，同时左侧 NotesPanel 里被这页实际用到的累计事实编号也一起发光，帮助观众把“侧栏编号”和“中列编号”看成同一套依据。右列继续把这些编号对应的硬后果直接写出来，而且不再手动硬拆成两行：反查不到 ShaderCode、编译高峰原封不动甩给玩家、构建机上能用但玩家机器上不一定能用、PSO 指数膨胀数量直接起飞、新包里的 Hash 和旧包可能早就对不上了。整页最后只保留一句结论：`PSO 的成本不会消失，只会转移。`footer 下方继续保留那张 `样本 B` 图，但不再显示 `样本 B` 字样，让收束停在 tradeoff 本句和图例本身。",
      focusColorKey: "shared",
    },
    {
      id: "page_24",
      label: "工程策略总览：包体 / 内存",
      caption:
        "这页改成正式双栏：左半明确写成 `ShaderCode` 压缩，右半明确写成 UE 中 PSO 的 `LRU + mmap` 策略。",
      keyPoints: [
        "外边距继续向内压：实际几何从 `110 / 84 / 60 / 84` 收到约 `58 / 44 / 40 / 44`，让 page24 更满。",
        "左半改成更直接的 `ShaderCode` 压缩矩阵：去掉 `算法 / 压缩比 / 平台数据` 总头，每条算法行自己补 `(压缩/)解压` 提示，并整体上提。",
        "右半变成更清楚的 UE 中 PSO 策略骨架：标题放大，补上 `驻留层 / 换出 / 回填 / 映射 / 载体` 的层次条，并把底部方法条加宽加高。",
        "左侧每条压缩行继续保留 `Windows / macOS / Android / iOS` 独立 pill，但去掉外层平台套框，并把平台时间改成右对齐；右侧继续保留 `LRU + mmap` 的驻留、换出、回填、外存载体关系。",
        "这一页不再夹带 `UsageMask`、并行或解释性 prose。",
      ],
      apiHighlights: ["LZ4", "zstd", "Oodle Leviathan", "LRU + mmap", "SQL", "file", "KV / spill"],
      notes:
        "这页继续作为“包体 / 内存”宿主页，但这次不只是把语义写死，而是把空间也真正吃满：左边是更直接的 `ShaderCode` 压缩矩阵，算法行自己说明 `(压缩/)解压`，4 组平台数据只保留独立 pill 且数值右对齐；右边是分层后的 UE 中 PSO `LRU + mmap` 策略骨架，page25 再把方法条进一步展开。",
      focusTarget: "Strategy Merge",
      timingHint:
        "左侧 `ShaderCode` 压缩数据板先落位，右侧 `LRU + mmap` 主图随后落位，底部三张方法条和 footer 最后补入。",
      intro:
        "边界讲清之后，先把“包体 / 内存”这两条更像资源压力的办法收成一页。",
      manuscript:
        "第二十四页现在收成一个更正式、更明确、也更满的双栏图。左半只看包体，而且直接写明这是 `ShaderCode` 压缩：上面放大 `包体` 标题，下面直接摆 `LZ4`、`zstd`、`Oodle Leviathan` 三组压缩矩阵；原先那条 `算法 / 压缩比 / 平台数据` 总头被拿掉，改成每条算法名旁边自己补 `(压缩/)解压` 提示，表示压缩这一步未必总是存在；四组 `Windows / macOS / Android / iOS` 平台数据只保留各自胶囊，数值改成右对齐，读起来更利落。右半只看内存，而且直接写明这是 UE 中 PSO 的 `LRU + mmap` 策略：上面放大 `内存` 标题并补 `UE 中 PSO：LRU + mmap`，再加一条 `驻留层 / 换出 / 回填 / 映射 / 载体` 结构条，中间把高频常驻、可替换缓存、映射视图 / 虚拟内存、文件 / SQL / KV 和“换出 / 按需回填”关系做成更完整的策略骨架，底部三张方法条也一起加宽加高。这样这页就明确变成“左边是更直接的 ShaderCode 压缩矩阵，右边是 UE 里 PSO 的内存策略骨架”，同时也提前把 page25 要展开的方法骨架埋好。",
      focusColorKey: "shared",
    },
    {
      id: "page_25",
      hiddenInNavigation: true,
      label: "改存储位置：让 IO 承担空间压力（保留页）",
      caption:
        "这页暂时保留给动画连续性；核心信息已经被 page24 吸收成“`LRU + mmap` 负责内存，`SQL` 只是可选载体”。",
      keyPoints: [
        "左侧用 PSO 里的 `LRU + mmap` 说明：不是所有内容都必须一直常驻内存。",
        "右侧明确拆成 `Replacement Policy`、`Reload / Mapping`、`Storage Carrier` 三块。",
      ],
      apiHighlights: ["LRU", "Clock", "Pin", "mmap", "paging", "SQL"],
      notes:
        "这一页不删 timeline，但语义上已经退居二线，主要承担过渡，不再是第一次承载存储策略的宿主页。",
      focusTarget: "Cache Strategy",
      timingHint:
        "左侧热冷分层与磁盘映射先显出，再从右侧依次补三组概念卡。",
      intro:
        "第二种常见做法不是改资源本身，而是改它放在哪里。",
      manuscript:
        "第二十五页用 `LRU + mmap` 来讲“改存储位置”。PSO 里真正落地的并不是某一个神奇算法，而是两件事一起做：先决定谁该留在内存，谁该换出去；再决定换出去以后如何被重新映射回来。`LRU`、`Clock`、`Pin` 这些属于 `Replacement Policy`，`mmap`、`paging` 属于 `Reload / Mapping`，而外存本身还可以是 `file`、`SQL` 或其他存储载体。我们这次只是用了其中一种组合。",
      focusColorKey: "shared",
    },
    {
      id: "page_26",
      label: "预编译优化：减少集合 + 提升吞吐",
      caption:
        "这页把两条都放进来，但不把它们讲成同一内容：`UsageMask` 负责减少要编译的集合，并行负责提升编译吞吐。",
      keyPoints: [
        "左侧路径还是事件优先：当前在地图 A，地图 B 下载完成，于是开始编译地图 B 的 PSO。",
        "这条左路径用 `Game UsageMask = A`、`Compile UsageMask = A + B` 去减少要编译的集合。",
        "右侧路径补并行：`任务独立`、`纯 CPU 计算` 时，可以直接拆 worker 提升吞吐。",
        "两个不是同一个内容，但都在优化预编译速度。",
      ],
      apiHighlights: [
        "Game UsageMask",
        "Compile UsageMask",
        "Per-Map Compile",
        "任务独立",
        "纯 CPU 计算",
        "Worker",
        "Throughput",
      ],
      notes:
        "这一页不要把 `UsageMask` 和并行讲成同一种机制。左边先收缩集合，右边再提升吞吐；两条路径只是在同一个目标下被放到一页。",
      focusTarget: "Compile Acceleration",
      timingHint:
        "左列先显事件链和 `Game = A / Compile = A + B`，右列再显并行前提和 worker 吞吐示意。",
      intro:
        "第三组策略开始进入“编译速度”本身：一条路减集合，一条路提吞吐。",
      manuscript:
        "第二十六页现在把两条“预编译速度优化”放进同一页，但要明确讲清：它们不是一个内容。左侧还是 `UsageMask` 路径，而且仍然坚持先从事件讲起：当前玩家在地图 A，这时地图 B 被下载完成，我们就希望立刻启动地图 B 对应的 PSO 编译。于是同一时刻会出现两个视角：站在当前游戏视角，`Game UsageMask = A`；站在编译调度视角，`Compile UsageMask = A + B`。这条路的本质，是先把“要编什么”收缩到更小的集合。右侧则是另一条完全不同的路：并行。这里强调的不是两套内容，而是另一种执行策略；只要任务独立、重复，而且主要还是纯 CPU 计算，就可以直接拆成多个 worker 去提升吞吐。所以这一页的重点不是把两件事讲成一个名词，而是把“减少集合”和“提升吞吐”并列起来：前者决定少编什么，后者决定怎样更快编完。",
      focusColorKey: "shared",
    },
    {
      id: "page_27",
      hiddenInNavigation: true,
      label: "改执行方式：并行化批处理任务（保留页）",
      caption:
        "这页暂时保留给动画连续性；核心信息已经前移到 page26，作为“提升编译吞吐”的另一条路径。",
      keyPoints: [
        "预编译任务批量、重复、规则、可拆，因此天然适合并行。",
        "这一页同时给出适用特征和注意事项：同步成本、共享状态、任务粒度、warp divergence、bank conflict。",
      ],
      apiHighlights: ["SIMD", "Thread", "GPU", "warp divergence", "bank conflict"],
      notes:
        "并行页不删 timeline，但语义上已经退居二线，主要承担过渡，不再是第一次承载并行判断的宿主页；并行现在先在 page26 和 UsageMask 并列出现。",
      focusTarget: "State Source",
      timingHint:
        "单线程队列先出现，再展开多 worker、SIMD、GPU 的并行谱系。",
      intro:
        "第四种思路是最工程化的一种：业务不变，但执行方式变了。",
      manuscript:
        "第二十七页讲的是 `SIMD`、线程并行和 `GPU` 并行。PSO 预编译这类任务往往很呆板，却很适合被拆开，因为它们通常相互独立、规则清楚、没有复杂顺序约束。真正要提醒的是并行的代价：同步成本、共享状态、任务粒度，以及更底层一点的 `warp divergence` 和 `bank conflict`。所以并行不是换业务逻辑，而是换执行方式。",
      focusColorKey: "shared",
    },
    {
      id: "page_28",
      label: "平台差异的表象：同样内容，未必落成同一组 PSO",
      caption:
        "平台差异是真实存在的，因此 PSO 数量并不是一个完全平台无关的问题。",
      keyPoints: [
        "左侧两张真实截图先不点平台名字，让观众先看出“同样内容，结果不同”。",
        "右侧把 `PSO = Shader + State` 拆开，说明 state 里本来就会收很多维度。",
      ],
      apiHighlights: ["截图 A", "截图 B", "PSO State", "Vertex Decl"],
      notes:
        "左侧上下堆两张匿名样本图，右侧放 `PSO = Shader + State` 结构卡，最后用底栏收口。",
      focusTarget: "Platform Delta",
      timingHint:
        "两张截图先淡入，右侧 state 结构卡后补，不做背景切换。",
      intro:
        "前面讲的是后置优化，接下来切到更高一层的治理问题。",
      manuscript:
        "第二十八页先不急着把 `OpenGL`、`iOS / Metal` 这些平台名字写在画面里，而是把两张真实截图放在一起，让观众自己先看出平台差异。接着右边补一张 `PSO = Shader + State` 的结构卡，强调 PSO 不是只有 shader；`Vertex Decl / Input Layout`、`Render Targets`、`Depth / Stencil`、`Blend / Rasterizer`、`Primitive / Samples / Pass` 这些 state 维度，本来就都可能进入 PSO。这样一来，观众更容易接受：同样的业务内容，在不同平台上未必会落成同一组 PSO。",
      focusColorKey: "shared",
    },
    {
      id: "page_29",
      label: "治理证据合页：代码 + IA 截图",
      caption:
        "把 page29 和 page30 压成一页：上面放两段代码，下面直接放对应 IA 截图，去掉 tab，把根因和证据放在同一眼里。",
      keyPoints: [
        "上中统一给出共享编译参数：`NUM_MATERIAL_TEXCOORDS_VERTEX = 2`。",
        "左右代码块改成等宽、居中的拉长版，并给关键 token 做轻量语法高亮；右上代码正文额外内缩一档。",
        "上半区用 `VertexDescriptor` 和 `LocalVertexFactory.ush` 的代码说明输入侧根因。",
        "下半区不再把差异讲成两个编译参数，而是直接写成两个 Mesh 的输入差异：`1 个 UV / 2 个 UV`，且图片宽度与上方代码框严格一致。",
        "重点结论改成：同一个Material作用于不同的Mesh也会产生不同的PSO。",
      ],
      apiHighlights: [
        "VertexDescriptor",
        "LocalVertexFactory",
        "NUM_MATERIAL_TEXCOORDS_VERTEX = 2",
        "Mesh：1 个 UV",
        "Mesh：2 个 UV",
        "同一个Material作用于不同的Mesh也会产生不同的PSO",
      ],
      notes:
        "page29 现在成为治理证据宿主页；page30 暂时保留用于 motion continuity，但核心代码 + 证据已经合并到这一页。当前版式要求左右代码卡等宽居中，参数条、代码、IA 与 footer 形成稳定的纵向阅读带，右上代码正文需要更明显的内缩，图片标题也要比上一版更醒目。",
      focusTarget: "Governance Evidence",
      timingHint:
        "代码块先进入，随后在它们正下方补对应截图；不再先切到下一页才看 IA 证据。",
      intro:
        "现象讲完以后，不再把“根因代码页”和“治理证据页”拆开，而是直接压成一张合页。",
      manuscript:
        "第二十九页现在把原来的 page29 和 page30 合成一张治理证据合页。上半区仍然是两段代码：左边用 `VertexDescriptor / InitRHI` 说明 CPU 侧怎么定义输入布局，右边用 `LocalVertexFactory.ush` 里的 `FVertexFactoryInput` 说明 shader 输入会怎样接住这些 declaration。这一版把两块代码卡做成等宽、居中的拉长版，并只给关键词、宏和字符串做轻量语法高亮，让 `#if / ATTRIBUTE / TEXT(...)` 这些真正影响理解的 token 更容易扫到；其中右上代码正文会比左侧再多一档内缩，避免长行直接贴着卡片边缘。但这一次不再把左右差异讲成两套编译参数，而是在上中统一给出共享编译参数 `NUM_MATERIAL_TEXCOORDS_VERTEX = 2`。真正分叉的地方改成两张 IA 截图对应的 Mesh 输入差异：左边是 `1 个 UV`，右边是 `2 个 UV`，而且两张图的测量宽度会严格贴齐各自上方代码框，标题也比上一版更大。这样观众在同一眼里就能看到：同样的编译参数下，只要 Mesh 输入布局不同，代码里的 declaration 差异仍然会变成图里的 IA 差异。也就是说，同一个Material作用于不同的Mesh也会产生不同的PSO。",
      focusColorKey: "shared",
    },
    {
      id: "page_29_data",
      label: "PSO驱动层的激进优化",
      caption:
        "在进入工程延伸前单独停一页，用同一份 vert / frag 和 state 开关，解释 PSO 为什么值得前置。",
      objectiveFacts: [
        "PSO 信息能否兑现优化，取决于驱动 / 编译器",
      ],
      keyPoints: [
        "页内不再显示独立主标题；上方直接进入左右两块 `Vertex Shader / Fragment Shader`，第二排再落左右两块 state。",
        "代码区不再放 cpp 和参数说明；`Vertex Shader / Fragment Shader` 直接占满左上和右上，不再额外挂外层框；代码行保留真实缩进，并继续放大至少两档，再配轻量语法高亮。",
        "原本右上角那组 state 开关下移成第二排，左边直接写 `Vulkan PSO：构建时Shader对此已知`，右边直接写 `OpenGL / GLES runtime：构建时Shader对此无感知`；外层框和 API 对照标签都去掉，也不再保留灰色补充说明。",
        "PC / Android 两边都只保留 `loop=10` 与 `loop=5000` 两组极值，列名统一改成 `VK off / VK on`。",
        "双平台数据区都改成轻表格，表格直接吃满外层 node 宽度，表头上沿是一根直线；重点提示回收到各自 node 的右上角，PC 的 `VK off` 两个低耗时值改成绿色，明显的高耗时值改成橙色，`loop=5000` 行名保持黑色，同时把表格整体再往下压一点。",
      ],
      apiHighlights: [
        "Vertex Shader",
        "Fragment Shader",
        "第二排 State 开关",
        "PC（RTX 3080）",
        "Android（Adreno）",
        "Vulkan",
        "OpenGL",
        "GLES",
        "loop=10",
        "loop=5000",
      ],
      notes:
        "这是插在 page_29 和 page_30 之间的解释页：去掉页内主标题和大总结卡，也去掉 `测试 Shader / State 开关` 两个可见组标题、外层框与 API 对照标签；上半区改成更大的顶排两块 shader、第二排左右两个 state 开关，下半区保留轻表格化的双平台极值表，重点提示挂到各自卡片右上角，底部只留一条脚注。",
      focusTarget: "Driver Optimization",
      timingHint:
        "page_29 先淡出，代码卡、state 卡与双平台极值表整体淡入；结束后再整体淡出到 page_30，不做背景闪回。",
      intro:
        "如果继续追问“为什么 Vulkan 这类 API 要把这么多信息前置进 PSO”，这一页先给出同一份 shader 和 state 可见性。",
      manuscript:
        "第二十九页数据插页现在不再拿 cpp 和环境参数占空间，而是把测试前提直接收成顶排两块 shader。左边的大块是同一份 `Vertex Shader`：`uniform int loopCount` 驱动那段 heavy loop，最后把结果写进 `heavyColor`；右边的大块是极简 `Fragment Shader`，只做 `outColor = heavyColor;`。也就是说，这一页先把“参与测试的 shader 到底长什么样”讲清楚，而且 `vert / frag` 直接占领左上和右上，不再被可见组标题包一层；这次代码字号又继续放大了至少两档，配上保留真实缩进的轻量语法高亮，让 heavy loop 不用凑近也能读。第二排两块 state 现在也不再拆成标题 + 灰色解释，而是直接把结论并进顶行：左边写 `Vulkan PSO：构建时Shader对此已知`，下面接 `blendAtt.colorWriteMask = 0;`；右边写 `OpenGL / GLES runtime：构建时Shader对此无感知`，下面接 `glColorMask(GL_FALSE, ...)`。这里也不再额外挂 `API 对照` 标签，只让观众直接看 state 内容。下面两张表继续只保留 `loop=10` 和 `loop=5000` 两组极值，列名统一收成 `VK off / VK on`，下半区仍然维持轻表格，但表格本体直接吃满外层 node 宽度，表头上沿只留一根直线，不再单独挂圆角内框；表格整体再往下压一点，把原来底部多出来的空白吃回去，同时把重点提示收进各自卡片右上角。在 `PC（RTX 3080）` 上，右上角会直接点出 `VK off` 从 `0.0653ms` 到 `0.0645ms` 几乎没波动，而且这两个低耗时值会用绿色标出来；与之相对，`59.1658ms` 和 `32.0594ms` 这种明显高耗时值会改成橙色，`loop=5000` 行名则回到黑色，不再和高低耗时强调抢注意力。这说明当 PSO 把足够多的编译期信息提前交给桌面驱动时，桌面驱动确实可能做非常激进的优化。可是在 `Android（Adreno）` 上，右上角重点会收成一句 `loop=5000` 三列都贴近 `400ms`，并把 `400.7728ms / 400.7216ms / 402.2887ms` 这组三列高耗时也统一刷成橙色，说明移动端驱动并没有兑现同级别收益。也就是说，PSO 不是为了把 state 打包得更整齐，而是为了把更多编译期信息提前交给驱动；至于这些信息最终能不能变成真正的优化，还是取决于桌面驱动和移动端驱动到底实现到了什么程度。",
      focusColorKey: "shared",
    },
    {
      id: "page_30",
      label: "工程延伸",
      caption:
        "把原来混在推荐页左栏里的 PSO 工程资料整块抽出来，单独作为 PSO 段落的收束页。",
      keyPoints: [
        "这一页只保留 4 条 PSO 工程资料：Unreal Engine 官方 `PSO Precaching`、我的 `PSO 小实验`、查力鹏的 `UE项目优化：PSO Cache`，以及 `Mesa 开源驱动`。",
        "Mesa 也一起放进来，表达这页收的是 PSO 工程路径，而不是只收 Unreal 自己的资料。",
        "页面不再保留任何阅读卡或单条资料框；顶部页标题和介绍保留，正文直接纵向放 4 条链接和各自一句介绍。",
      ],
      apiHighlights: [
        "PSO Precaching for Unreal Engine",
        "PSO 小实验",
        "UE项目优化：PSO Cache",
        "Mesa",
      ],
      relatedLinks: [
        {
          label: "PSO Precaching for Unreal Engine",
          url: "https://dev.epicgames.com/documentation/unreal-engine/pso-precaching-for-unreal-engine",
        },
        {
          label: "PSO 小实验",
          url: "https://zhuanlan.zhihu.com/p/1935414815096021431",
        },
        {
          label: "UE项目优化：PSO Cache",
          url: "https://imzlp.com/posts/24336/",
        },
        {
          label: "Mesa 开源驱动",
          url: "https://gitlab.freedesktop.org/mesa/mesa",
        },
      ],
      notes:
        "这一页就是把原来 page32 左侧那整块工程资料单独抽出来，包括 Mesa；顶部页标题和介绍保留，正文本身不再保留阅读卡和单条资料框，后面的推荐页继续保留书、视频和游戏。",
      focusTarget: "PSO Reading",
      timingHint:
        "治理证据页淡出后，顶部页标题和正文这列资料整体淡入；这是新增页，所以后面页面锚点整体顺延，不压缩原有后续转场。",
      intro:
        "治理证据讲完以后，先把 PSO 这一段的工程资料单独留出来，再切去讲项目里的 harness。",
      manuscript:
        "第三十页不再承担治理结论保留页，而是把原来混在推荐页左栏里的 PSO 工程资料整块抽出来，单独作为一个 `工程延伸` 页。这里放 4 条工程路径：Unreal Engine 官方的 `PSO Precaching for Unreal Engine`、我的 `PSO 小实验`、查力鹏写的 `UE项目优化：PSO Cache`，以及 `Mesa 开源驱动` 仓库。Mesa 也一起放进来，是为了说明这页收的是 PSO 工程路径本身，不只是一条 Unreal 内部用法。视觉上顶部页标题和介绍继续保留，但正文这里不再保留阅读卡，也不再给每条资料单独挂框，而是直接纵向放 4 条链接和各自一句介绍。这样做以后，PSO 相关的工程资料先在这里收口，后面的推荐页就只保留书、视频和游戏。",
      focusColorKey: "shared",
    },
    {
      id: "page_31",
      label: "项目 Harness：先看真实结果，再决定停或继续",
      caption:
        "这一页把仓库里真实在跑的 harness 压成一个大圆环：Hook 进入以后，沿着圆环依次经过网页数据评分、网页图片评分、回执循环。",
      keyPoints: [
        "四个主节点改成挂在圆环四边：`Hook 进入`、`网页数据评分`、`网页图片评分`、`回执循环`。",
        "原来右侧 helper 卡拆开吸到圆环边上，分别点名 `workflow gate`、`front probe`、`browser capture`、`blind critics`。",
        "`通过则停止 / 不通过继续` 贴到回执这一侧，让观众一眼读出闭环决策。",
      ],
      apiHighlights: [
        "workflow_gate.py",
        "front Edge probe",
        "browser-api capture",
        "blind critics",
      ],
      notes:
        "这一页不再是左主右辅双卡，而是单大圆环主视觉；解释信息只作为贴边 token，避免抢掉主回环。",
      focusTarget: "Live Harness Ring",
      timingHint:
        "大圆环和四个主节点先立住，再让贴边 token 补齐真实评分抓手与停 / 继续规则。",
      intro:
        "如果继续追问“这些页面改完以后，到底怎么自动知道哪里还不对”，答案就在这一页这个更直观的圆环里。",
      manuscript:
        "第三十一页现在不再把 harness 画成左右两张说明卡，而是直接压成一个大圆环。圆环四边依次是 `Hook 进入`、`网页数据评分`、`网页图片评分`、`回执循环`，这样观众一眼就能把它读成一个真实在跑的闭环。然后再沿着圆环边上补四个真实抓手：`workflow gate` 负责把任务送进 loop，`front probe` 对应真实网页数据取数，`browser capture` 和 `blind critics` 对应真实截图与视觉复核。最后把 `通过则停止 / 不通过继续` 贴在回执这一侧，让闭环真正闭上。所以这一页的重点就是一句话：先看真实结果，再决定停或继续。",
      focusColorKey: "shared",
    },
    {
      id: "page_32",
      label: "反馈系统与人的学习",
      caption:
        "把 harness 往上抽象以后，不再是竖排四卡，而是借用第一页的 `Input -> f(x) -> Output` 骨架，作为这一段的抽象终点。",
      keyPoints: [
        "页面下半复用第一页的 `Input -> f(x) -> Output` 三盒骨架，并加一个整体框，作为抽象后的稳定系统落点。",
        "上半只保留 3 个竖向 pill：`harness`、`loss + back propagation`、`feedback system`，再从 `feedback system` 以弧线落到整个下半系统。",
        "`feedback system` 依旧向上回指 `harness`，让“反馈系统又回到具体系统”这件事留在图里。",
      ],
      notes:
        "这一页继续承担桥的职责，但视觉上明显更接近第一页，让观众感到这是又一次抽象压缩，而不是新增一套图例；`f(x)` 稍向左偏，让中轴弧线和下半主链更顺。",
      focusTarget: "Abstract Function Skeleton",
      timingHint:
        "从 page_31 轻淡入这一页，先给题眼，再让上半抽象链与下半 `Input -> f(x) -> Output` 骨架一起成立。",
      intro:
        "从这一页开始，不再继续解释 harness 本身，而是把它抽象回一个更基础、更熟悉的函数骨架。",
      manuscript:
        "第三十二页不再是 4 个竖排大卡，而是把第一页那个 `Input -> f(x) -> Output` 骨架重新拿回来，作为这一段抽象之后的落点。上面只留下 3 个竖向 pill：`harness`、`loss + back propagation`、`feedback system`。下面则用一个轻框把 `Input -> f(x) -> Output` 整体包起来，再让 `feedback system` 用一条向左下弯的弧线落到这个整体系统上，而不是只扎到 `f(x)` 一点。`f(x)` 本身也稍微往左偏，让左右主链更舒展、整页读起来更顺。同时 `feedback system` 还会向上回指 `harness`，表示这种抽象出来的反馈结构，又可以重新回到具体系统里。这样讲的时候，观众看到的不是一套新名词，而是“从具体问题往回推，最后又压回更高一层模型”的过程。",
      focusColorKey: "shared",
    },
    {
      id: "page_33",
      label: "最后一句与后续入口",
      caption:
        "上半只保留 4 行引句和尾注，下半改成左二中二维码右二的三栏入口。",
      keyPoints: [
        "上半用《庄子·逍遥游》引句做最后收束。",
        "不再单独写 `《逍遥游》` 这个页内题眼，只保留正文与尾注。",
        "下半去掉原来的两个大框和分类标题，只保留左右四个条目本身。",
        "中间新增主仓库直角二维码，指向 `https://github.com/ZJUZWT/MT-PSO-Talk`，微信扫码可直接打开网页。",
        "二维码与左右两边各 2 个条目一起略微下压，给上方引句留出更多呼吸空间；右列标题与副标题统一右对齐。",
      ],
      relatedLinks: [
        {
          label: "人类高质量思政课",
          url: "https://www.bilibili.com/video/BV1m7UkBDEeB?spm_id_from=333.788.videopod.sections",
        },
        {
          label: "星际拓荒（Outer Wilds）",
          url: "https://store.steampowered.com/app/753640/Outer_Wilds/",
        },
        {
          label: "Type Help",
          url: "https://william-rous.itch.io/type-help",
        },
      ],
      notes:
        "这一页重新回到单独终页：上半不再单独写 `《逍遥游》` 题眼，而是只留下 4 行引句与尾注做收束；下半不再使用左右两个推荐卡，而是改成左二中二维码右二的三栏入口；中间放主仓库直角二维码，左右四个条目继续保留轻简介，其中右列改成右对齐，并把整个下半区一起略微下压。",
      focusTarget: "Further Reading",
      timingHint:
        "延续前一页的停顿感，整页淡入即可；上半 4 行引句与尾注先成立，下半左右两列与中间二维码再稳稳落位。",
      intro:
        "最后再把引句和推荐入口重新拆回单独终页。",
      manuscript:
        "第三十三页重新承担全场最后一页。上半保留《庄子·逍遥游》的 4 行引句：`今子有大树，患其无用，何不树之于无何有之乡，广莫之野，彷徨乎无为其侧，逍遥乎寝卧其下。不夭斤斧，物无害者，无所可用，安所困苦哉！` 以及一句尾注，但不再额外单独写 `《逍遥游》` 这个页内题眼，让文本区更松一点。下半这次不再保留左右两个大框，也不再写 `书与视频`、`推荐游戏` 这种分类标题，而是直接改成左二中二维码右二的三栏入口。左边放 `《银河帝国》` 和 `人类高质量思政课`，右边放 `星际拓荒（Outer Wilds）` 和 `Type Help`，每个条目都继续保留一行轻简介；其中右列统一右对齐，左右两列再对称向中间收一点，同时把整个下半区略微下压，让上面的引句更从容。中间则放主仓库 `https://github.com/ZJUZWT/MT-PSO-Talk` 的直角二维码，观众用微信扫一扫就可以直接跳到网页。原来的 `《反杜林论》` 与 `重读资本论` 这次继续保持删掉，不再拉长推荐清单。这样最后一页既保留了一个更松弛的收束，也把“继续往下看”真正收成一个更干净的出口。",
      focusColorKey: "shared",
    },
  ],
};
