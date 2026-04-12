import type {Storyboard} from "./pso-workbench-types";

export const masterStoryboard: Storyboard = {
  storyId: "storyboard-reset",
  title: "新动画剧本",
  summary:
    "Pages 01-09 establish the minimal formula model, concretize it into VertexData -> GPU -> Pixels, move from OpenGL compilation into a Vulkan PSO view, bridge into the UE asset cook flow, then split the UE shader-code zoom into ownership layers and runtime InlineCode lookup before moving into PSO cache hash indirection and the necessity of SharedCode. Pages 10-15 then flash back to the page 05 cook question, replay that old question as a `? -> !` beat, merge `Material + CookedShaderCode` into `ShaderLibrary`, delay the computer/phone loop by one full page, and compress the final stable build plus handoff into page 15.",
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
      label: "区分因素在哪一层",
      caption:
        "先不急着讲 code 存储，而是先回答 shader 的区分因素分别落在哪一层：Platform 在 Material，FeatureLevel / QualityLevel 在 Resource，ShaderType / VertexFactory / Permutation 在 ShaderMap。",
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
      label: "InlineCode 如何拿到 code",
      caption:
        "把左侧的分层提示全部退场，只保留最小锚点，然后把 FShaderMapResource_InlineCode 放大成主角，顺着 ResourceIndex 看它如何命中 ShaderEntries[Index] 并拿到 ShaderCode。",
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
      label: "PSO cache 为什么只存 Hash",
      caption:
        "上方先点出 Material 的 Cooked ShaderCode 仍然跟着资产走；下方再长出 PSO Cache，让 VS/PS Hash 只对齐到 ShaderHashes[Index]。",
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
      label: "SharedCode 为什么成为必需",
      caption:
        "SharedCode 的关键不是一句 GlobalIndex，而是两层索引：ShaderMapIndex + ResourceIndex 先得到 LibraryShaderIndex，再用 ShaderEntries[LibraryShaderIndex] 的 Offset/Size 取出真正 code；PSO 的 Hash 也通过 ShaderHashTable 命中同一个 LibraryShaderIndex。",
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
      label: "先回到第 5 页，再回答 ShaderLibrary",
      caption:
        "这一页只做回调：先回退到第五页的旧问题，重播 `? -> !`，再把 `Material / CookedShaderCode` 收成 `ShaderLibrary`，不提前展开后面的电脑 / 手机舞台。",
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
      label: "电脑和手机的基础舞台先落位",
      caption:
        "这一页才把新的母版正式展开：左边是 `Computer`，右边是 `Phone`，而第十页的 `ShaderLibrary` 开始落成中间那条 `.ushaderbytecode`。",
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
      label: "首次 Cook 再分出第二份 .scl.csv",
      caption:
        "基础舞台已经就位之后，这一页才把首次 `cook` 讲清：电脑侧分叉，补出第二份 `.scl.csv`。",
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
      label: "手机先吃进 .ushaderbytecode",
      caption:
        "两份文件关系讲清之后，这一页才第一次把 `.ushaderbytecode` 真正接到手机运行时。",
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
      label: "手机开始回传 .rec.upipelinecache",
      caption:
        "保持手机放大，再从它身上长出回传腿：运行时开始把 `.rec.upipelinecache` 往电脑侧送。",
      notes:
        "第十四页不要急着生成 stable 产物，而是先把闭环真正补上一半。`Phone` 仍然是主角，只在顶部长出 `.rec.upipelinecache`，并且让它沿着回程路径往电脑侧回送。",
      focusTarget: ".rec.upipelinecache",
      timingHint:
        "保持手机侧高亮，新增 `Phone -> rec -> Computer` 这一圈回传路径，让观众第一次读到真正的回流。",
      intro:
        "手机先吃进 bytecode 之后，接下来最重要的问题就是：运行时会不会把自己的收集结果送回来。",
      manuscript:
        "第十四页继续让手机侧保持主角，但语义发生了变化。`Phone` 不再只是接收 `.ushaderbytecode`，它还会在运行时把收集到的结果整理成 `.rec.upipelinecache`，并沿着回程路径送回电脑侧。到这里，PSO 这套流程终于不再是单向分发，而是第一次出现完整的回流半圈。",
      focusColorKey: "shared",
    },
    {
      id: "page_15",
      label: "电脑 expand，stable 再回到手机，闭环完成",
      caption:
        "最后把电脑侧的 `expand`、`stablepc.csv`、`stable.upipelinecache` 和回到手机的那一条线压进同一页，让收集、构建、再使用真正闭合。",
      notes:
        "因为整章整体后移一页，第十五页要把原来分开的“电脑侧 expand”与“stable 回到手机”压缩到同一拍里。先看电脑侧把 `.rec.upipelinecache` 和 `.scl.csv` 整理成 `stablepc.csv` 与 `stable.upipelinecache`，再看到 `stable.upipelinecache` 回到手机。",
      focusTarget: "Closed Loop",
      timingHint:
        "先让电脑侧 `expand` 和 stable band 长出来，再在同一页后半拍把 `stable.upipelinecache -> 手机` 那一笔补上。",
      intro:
        "只有当电脑把回流记录整理成 stable 产物，并且 stable 结果也真正回到手机侧，这套收集、构建、使用流程才算闭合完成。",
      manuscript:
        "到了第十五页，电脑侧终于承担起整理工作。手机送回来的 `.rec.upipelinecache` 会先进入 `expand` 过程，与前面已经出现过的 `.scl.csv` 一起整理出 `stablepc.csv` 和 `stable.upipelinecache`。然后这份 `stable.upipelinecache` 不会停在电脑侧，而是会再次回到手机继续使用。这样一来，手机负责运行与收集，电脑负责整理与稳定化，而稳定结果又重新喂回手机。PSO 的收集、构建、使用，到这里才真正形成一个闭合的完整流程。",
      focusColorKey: "shared",
    },
  ],
};
