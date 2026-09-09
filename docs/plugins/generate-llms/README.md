# generate-llms

为每个组件生成 LLM 友好的纯 Markdown 文档，便于 AI/LLM/RAG 场景直接消费。

## 数据源

- 组件文档（frontmatter 含 title/description/spline，正文含引入方式、代码演示、API 表格）：
  - 小程序仓库：全部在组件目录下的 `README.md`（默认）
  - 其余仓库：优先读 common 子仓扁平目录 `docsRoot` 下的 `<slug>.md`（如 `packages/common/docs/web/api/affix.md`），
    其次读组件目录下的 `<slug>.md`（如 `packages/components/affix/affix.md`，通过 `docFilename: '{slug}.md'` 配置）
- `{{ demo }}` 占位符替换为 `componentsRoot/<slug>/_example/` 目录下的真实源码块（解析器由各组件库通过 `readDemoCode` 传入）
- 站点专用 HTML（二维码、预览链接、提示块）会被转换为 Markdown 语义或移除

## 使用

核心逻辑为**纯 JS 方法** `generateLlmsDocs`，与 vite 解耦（不引入任何构建工具类型）：

```ts
import generateLlmsDocs from '<相对路径>/common-docs/plugins/generate-llms';

// 小程序仓库（默认读 README.md，demo 为 _example/<name>/index.{wxml,js,wxss,json} 四段代码块）
await generateLlmsDocs({
  componentsRoot: '<组件根目录绝对路径>',
  outputDir: '<产物输出目录绝对路径>',
  readDemoCode,
  siteTitle: 'TDesign MiniProgram',
  siteDescription: 'TDesign 小程序端组件库的 LLM 友好文档索引。',
});

// 其余仓库（文档读 common 子仓扁平目录，如 packages/common/docs/web/api/affix.md）
await generateLlmsDocs({
  componentsRoot: '<组件根目录绝对路径，用于读取 _example/ 演示源码>',
  docsRoot: '<仓库根目录>/packages/common/docs/web/api',
  outputDir: '<产物输出目录绝对路径>',
  platform: 'web',
  docFilename: '{slug}.md',
  readDemoCode,
});
```

各站点（miniprogram / miniprogram-chat / uniapp / uniapp-chat）用 vite 插件薄封装该纯方法，在 `closeBundle` 钩子里调用，站点构建时自动落盘。

## 配置项

- `componentsRoot`：组件根目录（绝对路径），目录下含各组件目录与 `_example/`，用于解析 demo 源码与组件目录内文档
- `docsRoot`：扁平文档目录（绝对路径，common 子仓，如 `packages/common/docs/web/api`），
  非小程序仓库传该配置，优先读取其下的 `<slug>.md`
- `outputDir`：产物输出目录（绝对路径），生成 `<outputDir>/llms/<slug>.md` 与 `<outputDir>/llms.txt`
- `platform`：站点平台（`web` / `mobile` / `chat`，默认 `mobile`），决定内置组件清单映射，无需外部传入
- `docFilename`：组件文档文件名，支持 `{slug}` 占位符，默认 `README.md`（小程序仓库）；其余仓库传 `'{slug}.md'`
- `componentMap`：自定义组件清单映射（slug -> 导出组件名列表），优先级高于 `platform`
- `siteTitle` / `siteDescription`：`llms.txt` 索引标题与描述
- `readDemoCode`（必传，由各组件库传入）：demo 源码解析器，读取 `_example/<demoName>/` 返回代码块文本；
  小程序组件库读取 `index.{wxml,js,wxss,json}` 四段代码块，uniapp 组件库读取 `index.vue` 输出 SFC 代码块

## 产物

- `<outputDir>/llms/<slug>.md`：每个组件一份文档（frontmatter + 正文）
- `<outputDir>/llms.txt`：组件索引（标题、描述、相对链接）
