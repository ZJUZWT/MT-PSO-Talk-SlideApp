# Slide Geometry Tests

这里专门放页面级合同测试，避免它们和长期常驻的 render/review 单测混在 `src/harness` 里。

- `page-contracts/`: 单页合同、单页逻辑、单页 acceptance 测试
- `src/harness/slide-geometry/render/*.test.tsx`: 渲染层常驻测试
- `src/harness/slide-geometry/review/*.test.ts`: metrics / artifact / probe 常驻测试

临时草图、试错稿、手绘镜像不应该继续留在这里；它们统一移出 live 路径。
