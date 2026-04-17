import type {Storyboard} from "./pso-workbench-types";

export const masterStoryboard: Storyboard = {
  storyId: "storyboard-reset",
  title: "新动画剧本",
  summary:
    "Pages 01-09 establish the minimal formula model, concretize it into VertexData -> GPU -> Pixels, move from OpenGL compilation into a Vulkan PSO view, insert a dedicated data checkpoint page between Vulkan and UE Cook, then bridge into the UE asset cook flow and split the UE shader-code zoom into ownership layers and runtime InlineCode lookup before moving into PSO cache hash indirection and the necessity of SharedCode. Pages 10-20 then flash back to the page 05 cook question, replay that old question as a `? -> !` beat, merge `Material + CookedShaderCode` into `ShaderLibrary`, land the computer/phone loop stage, and insert dedicated full-screen supplement image pages at runtime stutter, rec capture, and precompile peak smoothing checkpoints. Pages 21-23 are awareness transition pages to summarize what was covered, emphasize why PSO cache is a runtime problem front-loading strategy, and anchor with Supplement evidence. Pages 24-27 then cover practical optimization placeholders: code compression tradeoff, cache strategy, compile acceleration, and API-state-source differences.",
  sessions: [
    {
      id: "s1-foundation",
      label: "Session 1 · 抽象模型到图形 API",
      stepIds: ["page_01", "page_02", "page_03", "page_04", "page_04_data"],
    },
    {
      id: "s2-ue-shader",
      label: "Session 2 · UE Shader 资产与 SharedCode",
      stepIds: ["page_05", "page_06", "page_07", "page_08", "page_09", "page_10"],
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
      stepIds: ["page_16", "page_17", "page_18", "page_18_img", "page_19", "page_20"],
    },
    {
      id: "s5-awareness-bridge",
      label: "Session 5 · 总结与风险认知",
      stepIds: ["page_21", "page_22", "page_23"],
    },
    {
      id: "s6-optimization-notes",
      label: "Session 6 · 预留优化方向",
      stepIds: ["page_24", "page_25", "page_26", "page_27"],
    },
  ],
  steps: [
    {
      id: "page_01",
      label: "渲染问题的最小模型",
      caption: "从输入经过一个函数得到输出，这是后续所有框架演化前的最小骨架。",
      keyPoints: [
        "先让观众记住 Input -> f(x) -> Output 这条基础主轴。",
        "后续所有 API 与工程结构，都是这条主轴的展开。",
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
      label: "把模型映射到渲染语义",
      caption: "把抽象的 f(x) 具体化成 GPU，把输入和输出也换成更接近图形渲染语义的表达。",
      keyPoints: [
        "Input 对应 VertexData，f(x) 对应 GPU，Output 对应 Pixels。",
        "三段位置保持不变，只替换语义，建立空间连续性。",
      ],
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
      label: "OpenGL：运行时组装 Program",
      caption:
        "把 Raw ShaderCode 先 compile 成 Binary ShaderCode，再经过 link 得到 Program；这一页只讲结构和调用链。",
      keyPoints: [
        "Shader 在运行时经历 compile -> link -> use 的链路。",
        "Depth/Blend 等状态调用与 Program 一起汇入 GPU。",
        "平均耗时数据独立放到下一页，避免主图拥挤。",
      ],
      notes:
        "第三页不是抛弃第二页，而是把第二页整组往下压，给上方让出 OpenGL 配置带。这里左边最重要的是 Raw ShaderCode 经由 glCompileShader() 变成 Binary ShaderCode，再通过 glLinkProgram() 组织成 Program，随后还可以用 glGetProgramBinary() 把这一组取回做缓存；最后由 glUseProgram() 往下启用。右边的 Depth、Blend 继续通过 Graphics API 调用往下配置到 GPU。",
      focusTarget: "OpenGL",
      timingHint:
        "先让底部三段整体下移，再显出上方配置层，最后停在 GPU 被多条上方配置线汇入的终态。",
      intro:
        "现在开始把\"GPU 自己算\"这个中间节点拆开，看到 OpenGL 里它其实还要接收编译结果和状态配置。",
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
      relatedLinks: [
        {
          label: "glCompileShader 官方参考",
          url: "https://registry.khronos.org/OpenGL-Refpages/gl4/html/glCompileShader.xhtml",
        },
        {
          label: "glLinkProgram 官方参考",
          url: "https://registry.khronos.org/OpenGL-Refpages/gl4/html/glLinkProgram.xhtml",
        },
      ],
      focusColorKey: "opengl",
    },
    {
      id: "page_04",
      label: "Vulkan：预组装 PSO",
      caption:
        "把 Raw ShaderCode 更早整理成 SPIR-V ShaderCode，再连同状态先收进 Description 和 PSO；保持结构主线干净。",
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
      keyPoints: [
        "列结构固定为 Min / Max / Avg（单元格格式 Nubia / Pixel 7）。",
        "行结构覆盖 Link、Create、Bind（GL 与 VK 两类 Bind 都显示）。",
        "这一页不再放卡片容器，直接表格直出。",
      ],
      notes:
        "这一页是纯数据插页，和补充图片页采用同一类过渡思路：先淡入数据表，结束前淡出，再进入 page_05 的资产主线。",
      focusTarget: "平均耗时",
      timingHint:
        "固定背景结构，数据卡片淡入淡出，不引入额外连线或节点移动。",
      intro:
        "先给观众一个数据锚点，再切到 UE Cook 主线。",
      manuscript:
        "第四页和第五页之间增加一个纯数据页。这里不再讲结构，只展示一张表：列是 Min/Max/Avg，行覆盖 Link（glLinkProgram）、Create（CreateGfxPipeline）以及 Bind（BindProgramPipeline / BindGfxPipeline）。单元格统一用 Nubia/Pixel 7 双值表达，帮助观众在同一页读出分布范围与平均值，再切回 UE Cook 主线。",
      focusColorKey: "shared",
    },
    {
      id: "page_05",
      label: "UE Cook：资产进入渲染主线",
      caption:
        "把实际资产接进来：Mesh 生成 VertexData，Material 经过 cook 变成 Cooked ShaderCode，再继续整理成 Binary ShaderCode。",
      keyPoints: [
        "Mesh 对应 VertexData，Material 对应 Shader 产物。",
        "Cooked ShaderCode 是连接资产语义与运行语义的关键桥梁。",
      ],
      apiHighlights: ["Mesh", "Material", "Cooked ShaderCode", "Binary ShaderCode"],
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
      label: "UE 分层：区分因素落在哪一层",
      caption:
        "先不急着讲 code 存储，而是先回答 shader 的区分因素分别落在哪一层：Platform 在 Material，FeatureLevel / QualityLevel 在 Resource，ShaderType / VertexFactory / Permutation 在 ShaderMap。",
      keyPoints: [
        "不同维度的区分因素落在不同层级，不是同层混放。",
        "先讲清分层职责，再讲运行时如何取 code。",
      ],
      apiHighlights: [
        "Material",
        "FMaterialResource",
        "FMaterialShaderMap",
        "ShaderPlatform / FeatureLevel / QualityLevel / Permutation",
      ],
      notes:
        "第六页是拆页后的第一张，只负责讲清楚区分因素到底落在哪一层。左侧保留三张 selector 表：ShaderPlatform、FeatureLevel / QualityLevel、ShaderType / VertexFactory / Permutation；右侧保留 Material -> FMaterialResource -> FMaterialShaderMap 这一条主链。这里不展开 InlineCode 存储细节，只给一个很弱的后续锚点，让观众先建立“哪一层负责区分什么”的认知。",
      focusTarget: "InlineCode",
      timingHint:
        "从第五页问号位置放大以后，先让左侧两串结构成为主体：三张 selector 表和 Material / FMaterialResource / FMaterialShaderMap 一一对齐，右侧 InlineCode 只保留弱锚点，不展开细节。",
      intro:
        "真正进入 InlineCode 之前，先把一个更基础的问题讲透：shader 到底是在 UE 的哪一层被区分开的。",
      manuscript:
        "把第五页 Material 到 Cooked ShaderCode 之间那个问号放大以后，第一步先不要急着钻进 code 存储，而是先看区分因素落在哪一层。ShaderPlatform 决定的是目标图形平台，所以它在 Material 这一层就已经分开；FeatureLevel 和 QualityLevel 决定的是具体资源展开方式，所以它们落在 FMaterialResource 这一层；而 ShaderType、VertexFactory、Permutation 这些真正决定某个 shader 变体的组合键，则落在 FMaterialShaderMap 这一层。第六页的目标只有一个：让观众先建立“不同维度的区分发生在不同层级”这个空间认知，后面再去看运行时如何真正拿到 InlineCode。",
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
      apiHighlights: [
        "FShaderMapResource_InlineCode",
        "FShaderMapResourceCode",
        "ShaderEntries[Index]",
        "ShaderHashes[Index]",
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
      apiHighlights: [
        "PSO Cache",
        "VS Hash / PS Hash",
        "BlendState / DepthStencilState / RasterizerState",
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
      label: "SharedCode：Hash 如何反查到 Code",
      caption:
        "SharedCode 的关键不是一句 GlobalIndex，而是两层索引：ShaderMapIndex + ResourceIndex 先得到 LibraryShaderIndex，再用 ShaderEntries[LibraryShaderIndex] 的 Offset/Size 取出真正 code；PSO 的 Hash 也通过 ShaderHashTable 命中同一个 LibraryShaderIndex。",
      keyPoints: [
        "SharedCode 用 LibraryShaderIndex 把运行链与 Hash 反查链汇合。",
        "两层索引解决“去重”和“PSO 反查 code”两个问题。",
      ],
      apiHighlights: [
        "ShaderMapEntries[ShaderMapIndex]",
        "ShaderIndicesOffset + ResourceIndex",
        "ShaderHashTable[Hash]",
        "ShaderEntries[LibraryShaderIndex]",
      ],
      relatedLinks: [
        {
          label: "UE Shader Code Library（官方文档）",
          url: "https://dev.epicgames.com/documentation/en-us/unreal-engine/shader-pipeline-cache-in-unreal-engine",
        },
      ],
      notes:
        "第八页延续第七页结构。split 节点从 FShaderMapResource_InlineCode 变成 FShaderMapResource_SharedCode，并新增 ShaderMapIndex。主路径变成：ShaderMapEntries[ShaderMapIndex] 先给出 ShaderIndicesOffset，再和 ResourceIndex 组合，查 ShaderIndices[ShaderIndicesOffset + ResourceIndex]，得到 LibraryShaderIndex。随后通过 ShaderEntries[LibraryShaderIndex] 里的 Offset/Size，在大二进制里切出 code。PSO 的 Hash 侧边分支则走 ShaderHashTable[Hash] 命中同一个 LibraryShaderIndex，再复用同一段下游流程。",
      focusTarget: "SharedCode",
      timingHint:
        "让第六页的 InlineCode 存储块平滑演化成 SharedCode Library，把 ShaderMapIndex / ResourceIndex 两条线都接入索引转换节点，再让 Hash 分支汇合到同一个 LibraryShaderIndex。",
      intro:
        "这时候 SharedCode 就不是锦上添花，而是被去重和 PSO 预编译共同逼出来的基础设施。",
      manuscript:
        "两个问题同时出现。第一是去重：100 个材质用同一个 BasePass VS，InlineCode 下会存 100 份，包体膨胀。第二是 PSO 反查：预编译时只拿到 Hash，InlineCode 下 code 散落在各个 uasset 里，没有全局接口。SharedCode 把这两件事同时收口。主路径先从 ShaderMapEntries[ShaderMapIndex] 拿到 ShaderIndicesOffset，再与 ResourceIndex 组合，查 ShaderIndices[ShaderIndicesOffset + ResourceIndex]，得到 LibraryShaderIndex。随后用 ShaderEntries[LibraryShaderIndex] 的 Offset/Size，从 ShaderArchive 的大二进制切出 ShaderCode。PSO 侧边分支也不是直接拿 code，而是先走 ShaderHashTable[Hash] 命中同一个 LibraryShaderIndex，再复用上面的 Offset/Size 读取流程。这样 Hash 分支和运行时主链在 LibraryShaderIndex 汇合，SharedCode 才真正成为 PSO 预编译可闭环的基础设施。",
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
      apiHighlights: ["Material", "Cooked ShaderCode", "ShaderLibrary"],
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
      label: "新舞台建立：Computer / Phone / .ushaderbytecode",
      caption:
        "这一页才把新的母版正式展开：左边是 `Computer`，右边是 `Phone`，而第十页的 `ShaderLibrary` 开始落成中间那条 `.ushaderbytecode`。",
      keyPoints: [
        "先建立 Computer 与 Phone 的稳定空间母版。",
        "ShaderLibrary 开始落成 .ushaderbytecode 这条主中轴。",
      ],
      apiHighlights: ["Computer", "Phone", ".ushaderbytecode", "ShaderLibrary"],
      notes:
        "第十一页才让电脑 / 手机双极布局整体落位。这里先不要出现 `cook` 分叉，也不要出现 `.scl.csv`，只是把新的空间母版建立起来，让观众看见后面几页会在什么舞台上继续讲。",
      focusTarget: "Base Stage",
      timingHint:
        "让 callback 页退场，再把 `Computer`、`Phone` 和 `.ushaderbytecode` 平稳拉出，建立后续所有叙事的固定底板。",
      intro:
        "第十页已经把旧问题回答成 `ShaderLibrary`，现在才开始真正展开新章节的母版。",
      manuscript:
        "第十一页先把新的母版真正摆出来。左边是 `Computer`，右边是 `Phone`，而第十页里刚刚被回答出来的 `ShaderLibrary`，这时候开始落成中间那条 `.ushaderbytecode`。这一页的任务不是继续加信息，而是让观众先记住新的空间锚点：之后的 cook、回流和 stable 化，都会在这套 `Computer / Phone` 的固定舞台里展开。",
      focusColorKey: "ue",
    },
    {
      id: "page_12",
      label: "首次 Cook 补齐：再产出 .scl.csv",
      caption:
        "基础舞台已经就位之后，这一页才把首次 `cook` 讲清：电脑侧分叉，补出第二份 `.scl.csv`。",
      keyPoints: [
        "首次 cook 产出不仅有 .ushaderbytecode，还会有 .scl.csv。",
        "这一页只讲电脑侧分叉，不提前进入手机运行侧。",
      ],
      apiHighlights: ["cook", ".ushaderbytecode", ".scl.csv"],
      notes:
        "第十二页先不要让文件去碰 `Phone`。这一页只做一件事，就是把电脑侧 `cook` 的分叉补全，让观众从“先有 `.ushaderbytecode`”进入“原来还会再分出一份 `.scl.csv`”。",
      focusTarget: "Cook Split",
      timingHint:
        "保持第十一页的舞台不动，只在电脑侧长出 `cook` 主线和 `.scl.csv`，避免把后面的运行时线抢到这一页来讲。",
      intro:
        "基础舞台已经建立好了，接下来先把首次 cook 的完整输出关系补齐。",
      manuscript:
        "到了第十二页，新的信息仍然先留在电脑侧。`cook` 这条主线现在才被明确画出来，并且在电脑侧分出第二份产物：除了已经出现的 `.ushaderbytecode` 之外，还要补出 `.scl.csv`。这样观众会先记住：首次 cook 不是一个模糊的大黑盒，而是会把不同职责的文件拆成两支。",
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
      apiHighlights: ["Phone Runtime", ".ushaderbytecode"],
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
        "这一页先停一下，不改主拓扑，只解释手机侧运行时到底记录了什么，以及为什么不同图形 API 会看到不同数量级的记录。",
      keyPoints: [
        "Phone 运行时把 ShaderHash 与 State 沉淀为 .rec.upipelinecache。",
        "OpenGL 与 Metal 的显式程度不同，导致记录规模不同。",
      ],
      apiHighlights: [
        ".rec.upipelinecache",
        "ShaderHash + State",
        "OpenGL",
        "Metal",
      ],
      notes:
        "第十四页是插入式说明页，不去抢第十三页和后续回流页的拓扑职责。画面重点放在两件事：`Phone` 不只是吃进 `.ushaderbytecode`，它还会把 Draw、ShaderHash、State 这些运行时观察收成 `.rec.upipelinecache`；同时用 `OpenGL` 对比 `Metal` / 现代显式 API，解释为什么显式 API 往往会暴露更多管线状态组合。",
      focusTarget: "Runtime Collection",
      timingHint:
        "先把第十三页作为背景记忆板轻轻缩退，再把这张说明页整体浮上来。退出时先收回说明页，再恢复主线继续进入真正的回传页。",
      intro:
        "在真正把回流线画出来之前，先补一句观众此时最容易追问的问题：手机侧到底在收集什么。",
      manuscript:
        "第十四页不急着把 `.rec.upipelinecache` 直接送回电脑，而是先停下来解释：`Phone` 在吃进 `.ushaderbytecode` 之后，并不是只负责运行，它还会把每次 draw 时实际命中的 `ShaderHash`、相关 `State` 以及运行时观察，逐步整理成 `.rec.upipelinecache`。这一页还顺带解释为什么不同 API 看到的记录数量会不同：`OpenGL` 有更多状态是隐式或由驱动代管的，所以 PSO-like record 往往更少；`Metal` 以及其他更现代、更显式的图形 API，会把更多管线组合明确暴露出来，因此更容易看到更多组合记录。也就是说，`.rec.upipelinecache` 的出现不是凭空多出一份文件，而是运行时观测被沉淀下来的结果。",
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
      apiHighlights: ["PSO-卡顿", "运行时抖动", "证据页"],
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
      apiHighlights: [".rec.upipelinecache", "Runtime Capture", "证据页"],
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
      apiHighlights: ["Phone", ".rec.upipelinecache", "Computer"],
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
        "这一页先只解释 expand，不急着讲 build：重点是为什么旧版本的 runtime 记录不能直接拿到当前版本使用，必须先借助历史 `scl.csv` 提升成 stable 语义。",
      keyPoints: [
        "Hash 不是跨版本稳定身份，必须先翻译回 StableKey 语义。",
        "expand 用历史 scl.csv，把 rec 记录提升成 stablepc.csv。",
      ],
      apiHighlights: ["历史 .rec.upipelinecache", "历史 .scl.csv", "stablepc.csv", "Expand"],
      relatedLinks: [
        {
          label: "Unreal PSO Caches（官方文档）",
          url: "https://dev.epicgames.com/documentation/en-us/unreal-engine/optimizing-rendering-with-pso-caches-in-unreal-engine",
        },
      ],
      notes:
        "第十六页是 expand 专用说明页。观众此时最容易困惑的是：既然 `rec.upipelinecache` 里已经有 `ShaderHash + State`，为什么还需要一份 `scl.csv`？这一页要明确回答：Hash 不是跨版本稳定身份，历史 `scl.csv` 才能把旧 Hash 提升回 StableKey 视角。并且这里的 stable 指的是语义稳定，不是编译结果或 hash 本身稳定。",
      focusTarget: "Expand",
      timingHint:
        "沿用占位插页的统一进入退出语法，让回传页缩成背景板，再把 `历史 rec.upipelinecache`、`历史 scl.csv`、`stablepc.csv` 和一个简化例子浮上来。",
      intro:
        "手机把回流记录送回电脑之后，第一个真正需要解释的问题不是 build，而是为什么电脑侧必须先做一次 expand。",
      manuscript:
        "第十六页先只讲 expand。`rec.upipelinecache` 里记录的是旧版本运行时真正看到的 `ShaderHash + State`，但 `ShaderHash` 本身不是跨版本稳定身份。只要 shader 代码生成、共享方式或者编译结果变了，旧 Hash 就可能失效。所以电脑侧必须拿历史版本的 `scl.csv`，把旧 `ShaderHash` 重新翻译回 `ShaderStableKey` 视角，再和原来的状态一起整理成 `stablepc.csv`。这里的 stable 指的是语义稳定，不是 hash 稳定。比如旧版本里两个 `StableKey` 可能恰好落到同一个旧 `ShaderHash`，运行时只记到一条 Hash 记录；expand 之后，这条记录会重新展开成两个 `StableKey + State` 组合。也就是说，expand 的意义不是重命名文件，而是把旧 runtime 观察提升回跨版本还能理解的 stable 语义。",
      focusColorKey: "shared",
    },
    {
      id: "page_17",
      label: "Build：把 StableKey 映射回当前 Hash",
      caption:
        "这一页再单独解释 build：stable 语义还不能直接拿来运行，必须再结合当前版本的 `scl.csv`，重新落回当前版本可用的 hash 世界。",
      keyPoints: [
        "build 使用“当前版本 scl.csv”完成 StableKey -> Hash 映射。",
        "stablepc.csv 经 build 产出 stable.upipelinecache 供当前版本使用。",
      ],
      apiHighlights: ["stablepc.csv", "当前 .scl.csv", "stable.upipelinecache", "Build"],
      relatedLinks: [
        {
          label: "Pipeline Cache 概览（Khronos）",
          url: "https://www.khronos.org/opengl/wiki/Program_Binary",
        },
      ],
      notes:
        "第十七页是 build 专用说明页。这里必须强调 `.scl.csv` 这次已经不是历史版本那份，而是当前版本的映射字典。`build` 的职责，是把 `stablepc.csv` 里的 `StableKey + State` 再投影回当前版本的 `ShaderHash + State`，形成真正可供当前包体消费的 `stable.upipelinecache`。",
      focusTarget: "Build",
      timingHint:
        "保持 onepage 轻量图解，只讲 `stablepc.csv + 当前 scl.csv -> stable.upipelinecache`，并在底部给出稳定键重新映射成当前 hash 的例子。",
      intro:
        "expand 把旧 hash 提升成 stable 语义之后，还差最后一步：怎么把这些 stable 语义重新落回当前版本。",
      manuscript:
        "第十七页只讲 build。expand 结束之后，电脑侧手里已经有 `stablepc.csv`，里面是 `ShaderStableKey + State`。但这仍然不是当前版本运行时能直接消费的格式，所以还需要拿当前版本的 `scl.csv`，把 `StableKey` 再映射回当前版本的 `ShaderHash`，最终生成 `stable.upipelinecache`。这一步的意义，是把 stable 语义重新落回当前版本。比如第十六页里 expand 得到了两条 `StableKey + State`，而当前版本的 `scl.csv` 可能会把它们重新映射成两个新的 `ShaderHash`；这样 build 出来的就会是两条当前版本可用的 PSO 记录。也就是说，build 不是重复 expand，而是把 stable 语义重新装配成当前版本真正能拿来预编译和加载的缓存表达。",
      focusColorKey: "shared",
    },
    {
      id: "page_18",
      label: "闭环落地：stable.upipelinecache 回到手机",
      caption:
        "说明页讲完之后，回到主流程舞台，把 `stable.upipelinecache` 真正接回手机侧，让收集、构建、再使用完整闭合。",
      keyPoints: [
        "expand + build 的结果回到 Phone，闭环真正完成。",
        "这一页只做主舞台收束，不再新增概念层。",
      ],
      apiHighlights: ["stable.upipelinecache", "Phone", "Closed Loop"],
      notes:
        "第十八页不再是 onepage 说明，而是主舞台闭环页。观众已经在 page16 和 page17 分别理解了 expand 与 build，所以这一页只需要把 stable band 和 `stable.upipelinecache -> 手机` 压回主舞台，读成完整闭合即可。",
      focusTarget: "Closed Loop",
      timingHint:
        "先恢复 page15 的回流主舞台，再长出 stable band 和 `stable -> 手机` 那一笔，让闭环在同一页收束完成。",
      intro:
        "现在 expand 和 build 都解释清楚了，终于可以回到主流程，把稳定产物真正送回手机使用。",
      manuscript:
        "第十八页回到主流程舞台。手机送回来的 `.rec.upipelinecache` 已经在电脑侧经过 expand 整理成 `stablepc.csv`，又经过 build 变成 `stable.upipelinecache`。现在这一份 stable 产物终于再次回到手机侧继续使用。这样一来，手机负责运行与收集，电脑负责把旧 Hash 提升成 stable 语义，再把 stable 语义落回当前版本，最后 stable 结果重新喂回手机。PSO 的收集、构建、使用，到这里才真正闭合。",
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
      apiHighlights: ["PSO预编译解决高峰", "峰值平滑", "证据页"],
      notes:
        "第三张补充证据插页。位置放在闭环完成后、预编译章节前，用于建立“这套流程值得做”的结果导向认知。",
      focusTarget: "Peak Smoothing Evidence",
      timingHint:
        "整页图片淡入，退出淡出后切到 page19 进入预编译流程解释。",
      intro:
        "闭环讲完，先看结果图，再进入预编译分解。",
      manuscript:
        "这页给出“预编译解决高峰”的结果证据。目的是先让听众看见收益，再进入 page19 去讲 stable 缓存如何进入内存 PSO、page20 再讲如何持久化。这样观众会更容易接受后面的机制细节。",
      focusColorKey: "shared",
    },
    {
      id: "page_19",
      label: "预编译：stable 缓存入内存 PSO",
      caption:
        "先讲第一段：stable.upipelinecache 被批次消费，转成 API 侧内存中 PSO。",
      keyPoints: [
        "输入来自 stable.upipelinecache。",
        "这一页只讲“进入内存 PSO”，先不展开持久化差异。",
      ],
      apiHighlights: ["stable.upipelinecache", "Precompile", "内存中 PSO"],
      notes:
        "第十九页只保留左半段流程图：`stable.upipelinecache -> 预编译 -> 内存中 PSO`。这页不塞 API 细节，不塞对比表，只建立输入到内存态的直线语义。",
      focusTarget: "Precompile",
      timingHint:
        "让 page18 缩退后，先拉出左半页，强调直线主链，不做复杂注释。",
      intro:
        "闭环成立后，先回答预编译第一问：稳定缓存如何进入运行时内存态。",
      manuscript:
        "第十九页把问题拆开。先只看第一段：`stable.upipelinecache` 进入预编译批次后，分别落到 API 侧的内存中 PSO。这一步解决的是“输入组织到内存对象”的转换，不讨论落盘，不讨论数量差异。画面上保持主链直线，避免视觉负担。",
      focusColorKey: "shared",
    },
    {
      id: "page_20",
      label: "预编译：内存 PSO 持久化",
      caption:
        "再讲第二段：内存中 PSO 如何落盘，以及 OpenGL / Vulkan / Metal 的持久化路径差异。",
      keyPoints: [
        "OpenGL / Vulkan 常见引擎侧导出路径更显式。",
        "Metal 多由系统管理，最终编译数量与行为统计常不同。",
        "本地缓存并非永久有效：OS / 驱动 / GPU 芯片代际 / 图形栈版本变化都可能触发失效。",
      ],
      apiHighlights: ["OpenGL", "Vulkan", "Metal", "ProgramBinaryCache", "VulkanPSO.cache", "functions.data"],
      relatedLinks: [
        {
          label: "Metal Pipeline State（Apple）",
          url: "https://developer.apple.com/documentation/metal/mtlrenderpipelinestate",
        },
      ],
      notes:
        "第二十页承接第十九页的 `内存中 PSO`，只画右半段：`内存中 PSO -> API 导出路径 -> 磁盘缓存`。采用三条平行直线，并在底部加一条“缓存失效条件”提示，不引入额外分支。",
      focusTarget: "Precompile Persist",
      timingHint:
        "从 page19 到 page20 采用横向推入，保留共享锚点语义，减少透明度闪烁。",
      intro:
        "第一段讲完了输入如何变成内存态，第二段补齐“如何持久化”和“为何数量不同”。",
      manuscript:
        "第二十页只做一件事：把第十九页的 `内存中 PSO` 往右继续推，得到三条 API 的持久化路径。OpenGL 对应 ProgramBinary 类缓存，Vulkan 对应 PipelineCache 类缓存，而 Metal 通常更多由系统托管。即使输入都来自稳定缓存，这三条路径的显式程度不同，最终统计到的预编译数量和命中行为也会不同。这里要加一个特别提示：本地缓存不是永久有效，操作系统版本、GPU 驱动版本、芯片代际、图形 API/FeatureLevel 或引擎 shader 格式版本发生变化时，都可能导致缓存失效。失效后常见表现是缓存命中下降并触发重新编译，或者旧二进制直接不可加载。",
      focusColorKey: "shared",
    },
    {
      id: "page_21",
      label: "我的理解：预编译成本转移",
      caption:
        "PSO 是对象，PSO Cache 是工程方法：用启动时间和内存空间，换运行时卡顿率。",
      keyPoints: [
        "PSO 是一个东西，PSO Cache 是一个工程方法。",
        "PSO Cache 本质是用启动时间 + 内存空间，换运行时卡顿率。",
        "它附属于 Shader，不是所有项目都必须启用；没有 PSO Cache 的项目也可能跑得很好。",
        "这套方法代价并不小，甚至常常比想象中更大。",
        "一句话记忆：预编译的 PSO 不会消失，只会转移。",
      ],
      apiHighlights: ["Material", "SharedCode", ".rec.upipelinecache", "stable.upipelinecache", "ProgramBinary/PipelineCache"],
      notes:
        "这页聚焦“概念澄清 + 代价意识”，不展开算法细节。让观众先知道 PSO Cache 不是免费午餐。",
      focusTarget: "Bridge Summary",
      timingHint:
        "从 page20 推入后先讲定义，再讲代价，最后落一句“不会消失，只会转移”。",
      intro:
        "在进入优化细节前，先把“PSO vs PSO Cache”这个概念边界彻底讲清。",
      manuscript:
        "第二十一页先讲清一个很关键的边界：PSO 是一个东西，PSO Cache 是一种工程方法。这个方法本质上并不是“把问题消灭”，而是把代价在时间维度上做重分配，用启动时间和内存空间去换运行时卡顿率。它附属于 Shader，不是所有项目都必须开启；没有 PSO Cache 的项目也可能运行得很好。反过来说，这个方法的代价不小，往往比直觉更大。把它放回主线里看，就是 Material/ShaderCode 进入 SharedCode，运行时收集后再生成 stable.upipelinecache。可以用一句话收束：预编译的 PSO 不会消失，只会转移。通常是从运行时卡顿，转移到首启等待。工程优先级通常也是先保运行时帧稳定，再看首次启动时长。",
      focusColorKey: "shared",
    },
    {
      id: "page_22",
      label: "PSO 本质提醒：缓存有效性依赖运行环境",
      caption:
        "进一步讲工程代价来源：收集策略、启动 Open 策略、API 状态模型差异，以及缓存失效边界。",
      keyPoints: [
        "运行时收集要“尽量少”又“尽量全”；如果暴力 Permute Shader State，数量会指数增长。",
        "启动时 Open 策略常见是一把 Load stable.upipelinecache，单次内存和时长压力都很大。",
        "OpenGL 没有完整管线状态（更多是 Shader 维度），与现代 API 的 PSO 结构假设不同。",
        "同时还要面对环境失效：操作系统/驱动/芯片变化会触发缓存失效。",
      ],
      apiHighlights: ["Permute Shader State", "stable.upipelinecache Open/Load", "OpenGL vs Modern API", "OS/Driver/GPU", "Cache Invalidation"],
      notes:
        "这页从“代价是怎么来的”切入，再回收“为什么要分桶管理缓存失效”。",
      focusTarget: "Cache Validity",
      timingHint:
        "先讲收集与启动阶段的压力，再补 OpenGL 与现代 API 差异，最后落到失效边界。",
      intro:
        "定义讲清后，下一步是让观众看到这套方法为什么在工程上“贵”。",
      manuscript:
        "第二十二页把成本来源拆开讲。第一层是运行时收集策略：PSO Cache 既要尽量少又要尽量全面，如果我们试图把 Shader State 全部 Permute 出来，数量会是指数级增长。第二层是启动时 Open 策略：引擎原生通常只在启动时 Load 一次 `stable.upipelinecache`，这会把内存压力和单次加载时长集中到首启窗口。第三层是 API 模型差异：OpenGL 没有完整管线状态，更多是 Shader 维度，而现代 API（如 Vulkan/Metal）对管线状态更显式，收集与命中形态天然不同。最后还要补边界：本地缓存本质是环境相关产物，操作系统、驱动、芯片和 API/FeatureLevel 变化都可能触发失效。也就是说，前置不等于消失，工程上仍然要做收集-构建-回灌，并按环境指纹分桶管理。",
      focusColorKey: "shared",
    },
    {
      id: "page_23",
      label: "补充证据：OpenGL / Vulkan 性能表",
      caption:
        "把 Supplement 里的多机型实测指标整理成一页表格，直接对比 OpenGL 与 Vulkan 的总量与热点差异。",
      keyPoints: [
        "数据源：Supplement/耗时Insight/MinePSO_耗时对比分析（Nubia Z60 Ultra + Pixel 7）。",
        "Nubia：OpenGL 0.795s / Vulkan 1.440s。",
        "Pixel 7：OpenGL 1.453s / Vulkan 2.526s。",
        "热点稳定落在 Link/Compile/Create Pipeline，表格用于承接最早的 OpenGL/Vulkan 结构图。",
      ],
      apiHighlights: [
        "Nubia Z60 Ultra",
        "Pixel 7",
        "OpenGL 0.795s / 1.453s",
        "Vulkan 1.440s / 2.526s",
        "CreateGfxPipeline",
      ],
      notes:
        "这页是纯证据表格页，建议先让观众扫“设备 + API + 总量”，再看每行热点构成。",
      focusTarget: "Evidence Anchor",
      timingHint:
        "先横向比较两台机器的总量，再纵向比较同机型 OpenGL vs Vulkan，最后回收“前置不是免费午餐”。",
      intro:
        "讲完方法和边界后，用一页实测表格把抽象概念落地。",
      manuscript:
        "第二十三页是实测表格页，不引入新概念。数据来自 Supplement 的 `MinePSO_耗时对比分析`：Nubia Z60 Ultra 上，OpenGL 总计 0.795s、Vulkan 总计 1.440s；Pixel 7 上，OpenGL 总计 1.453s、Vulkan 总计 2.526s。热点形态也一致落在 `glLinkProgram / glCompileShader` 与 `CreateGfxPipeline / CreateComputePipeline`。这页的作用是把最早那张 OpenGL/Vulkan 结构图，接到跨设备的真实测量数据上，让听众看到“结构差异会稳定落成不同的热点分布”。",
      focusColorKey: "shared",
    },
    {
      id: "page_24",
      label: "优化方向 1：卸掉 Code 压缩",
      caption:
        "先把压缩与解压链路单独拎出来：压缩省 IO，但解压吃 CPU 与带宽，是否保留应看瓶颈位置。",
      keyPoints: [
        "压缩收益主要在包体与 IO，解压成本主要在启动 CPU 路径。",
        "当 IO 已不再是瓶颈时，可评估“卸掉压缩”换取更短启动链路。",
      ],
      apiHighlights: ["Compressed Code", "Decompress", "Compile/Load"],
      notes:
        "这一页作为优化章节的第一张占位页，只回答一个问题：为什么我们要讨论“卸掉压缩”。不做绝对判断，强调这是瓶颈导向决策。",
      focusTarget: "Compression Tradeoff",
      timingHint:
        "由 page22 稳定落位后，左到右拉出 `Compressed -> Decompress -> Compile` 主轴，底部再补一条 `IO` 与 `CPU` 对冲结论条。",
      intro:
        "边界讲清之后，先从最直接的优化讨论开始：压缩到底要不要留。",
      manuscript:
        "第二十四页先不谈复杂实现，只看一件事：`Code 压缩`。压缩通常能降低包体与 IO 压力，但运行时必须付出解压成本，这部分会直接占用启动阶段的 CPU 与内存带宽。如果当前平台瓶颈已经从 IO 转到了 CPU，那么“继续压缩”反而可能拉长首帧路径。因此这一步不是默认开启或默认关闭，而是基于瓶颈画像做取舍。",
      focusColorKey: "shared",
    },
    {
      id: "page_25",
      label: "优化方向 2：BCache 基础策略",
      caption:
        "用一页讲清缓存的基础治理：LRU / LFU、mmap、circular/ring，本质是 IO 换空间。",
      keyPoints: [
        "缓存不是越大越好，核心是命中模型与介质特性匹配。",
        "LRU/LFU 决定淘汰，mmap 与 ring 决定读写路径与拷贝成本。",
      ],
      apiHighlights: ["BCache", "LRU", "LFU", "mmap", "ring"],
      notes:
        "这一页做策略占位，后续可把每个策略替换成项目里真实实现细节。现在先让观众理解“缓存调参是在做 IO/空间互换”。",
      focusTarget: "Cache Strategy",
      timingHint:
        "中心先出现 BCache，再从中心长出四个策略分支，最后底部落一句 `IO 换空间`。",
      intro:
        "如果要继续优化，第二层是缓存策略，而不是一味堆更多编译线程。",
      manuscript:
        "第二十五页把 BCache 的思路先固定：这是一次典型的 IO 与空间交换。`LRU/LFU` 决定热数据保留，`mmap` 影响大对象读取与拷贝成本，`circular/ring` 影响顺序写入与回收。真正有效的方案不是把所有策略都开到最大，而是让策略与数据访问形态一致。",
      focusColorKey: "shared",
    },
    {
      id: "page_26",
      label: "优化方向 3：编译加速",
      caption:
        "编译优化拆成两条线：多线程提升吞吐，UsageMask 缩小编译集合，组合后才更稳。",
      keyPoints: [
        "先减少待编译集合，再并行化执行，通常优于盲目加线程。",
        "UsageMask 让“能编的全部编”变成“按使用场景编”。",
      ],
      apiHighlights: ["Compile Queue", "Multi-thread", "UsageMask"],
      notes:
        "这一页的占位重点是把“并行”和“剪枝”放在同一张图里，防止后续讲述偏成单一线程优化。",
      focusTarget: "Compile Acceleration",
      timingHint:
        "左侧先给 baseline 编译队列，右上长出多线程 worker，右下长出 UsageMask 分桶，最后在右端汇合到 reduced compile set。",
      intro:
        "第三层优化进入编译流程本身：我们既要更快执行，也要编得更少。",
      manuscript:
        "第二十六页把编译加速拆成两件事。第一是并行：通过多线程队列提高吞吐；第二是剪枝：通过 UsageMask 过滤不该在当前阶段编译的内容。只做并行而不减集合，常常会把开销搬到线程调度与资源竞争上。更稳定的路径是先减集合、再并行执行。",
      focusColorKey: "shared",
    },
    {
      id: "page_27",
      label: "优化方向 4：Metal vs OpenGL 差异来源",
      caption:
        "把差异归因到“状态来源与显式程度”本身：不是谁绝对更优，而是模型不同导致统计行为不同。",
      keyPoints: [
        "OpenGL 更偏驱动侧隐式状态，Metal 更偏显式状态组合。",
        "编译数量与命中行为差异，核心来自状态来源路径差异。",
      ],
      apiHighlights: ["OpenGL PSO", "Metal PSO", "State Source"],
      notes:
        "最后一页占位用于收束差异来源，后续可继续补充平台实测数据与口径说明。",
      focusTarget: "State Source",
      timingHint:
        "双栏同时落位：左 OpenGL，右 Metal，中间先出现 state-source 桥，再落底部结论条收束。",
      intro:
        "最后把最容易误读的点说清：Metal 和 OpenGL 的差异，来自状态模型本身。",
      manuscript:
        "第二十七页不做价值判断，只做来源解释。OpenGL 的部分状态更偏驱动隐式管理，而 Metal 的状态组合更显式，因而在编译数量、缓存命中和观测统计上会呈现不同分布。也就是说，差异的根因是状态来源路径不同，而不是单一 API 的优劣标签。",
      focusColorKey: "shared",
    },
  ],
};
