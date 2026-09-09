# generate-llms

为每个组件生成 LLM 友好的纯 Markdown 文档，便于 AI/LLM/RAG 场景直接消费。

## 设计思路

**通用解析方法放 common，各组件库处理自身文档差异，将解析结果交给 common 编排落盘。**

- **common（本插件）**：提供通用的解析方法与编排能力 —— `parseFrontmatter`、`splitTitle`、`cleanSiteHtml` 等
  通用解析工具，以及 `renderComponentMarkdown` / `renderLlmsTxt` 渲染函数和 `generateLlmsDocs` 编排器。
  还提供 `createComponentDocParser` 默认解析管道，供各组件库一键构建自己的解析器。
- **各组件库**：通过 `parseComponentDoc` 注入自身的组件文档解析器。负责文档读取、frontmatter 字段差异、
  站点 HTML 清理、demo 源码读取，最终返回统一的 `ComponentDoc` 交给 common。

## 使用

核心逻辑为**纯 JS 方法** `generateLlmsDocs`，与 vite 解耦（不引入任何构建工具类型）：

```ts
import { readFile } from 'fs/promises';
import generateLlmsDocs, { createComponentDocParser } from '<相对路径>/common-docs/plugins/generate-llms';

// 各组件库构建自己的解析器（通用解析管道 + 自身差异覆盖）
const parseComponentDoc = createComponentDocParser({
  // 组件文档读取器：各组件库自行实现（小程序读组件目录 README.md；其余仓库优先读 common 子仓扁平目录）
  readComponentDoc: async (componentDir, slug) => readFile(`${componentDir}/README.md`, 'utf-8'),
  // demo 源码解析器：各组件库按自身示例组织方式实现
  readDemoCode: (componentDir, demoName) => '<读取 demo 源码块>',
  // 可选：站点差异覆盖（小程序用默认 cleanSiteHtml；其余仓库传自定义 transformers 或空数组）
  transformers: [],
  componentMap,
});

await generateLlmsDocs({
  componentsRoot: '<组件根目录绝对路径>',
  outputDir: '<产物输出目录绝对路径>',
  platform: 'web', // 或 mobile / chat
  parseComponentDoc,
  siteTitle: 'TDesign MiniProgram',
  siteDescription: 'TDesign 小程序端组件库的 LLM 友好文档索引。',
});
```

各站点（miniprogram / miniprogram-chat / uniapp / uniapp-chat / vue-next / react / mobile-vue / flutter）
用 vite 插件薄封装该方法，在 `closeBundle` 钩子里调用，站点构建时自动落盘。

## 配置项

`generateLlmsDocs`：

- `componentsRoot`：组件根目录（绝对路径），目录下含各组件目录与 `_example/`，用于解析 demo 源码与组件目录内文档
- `parseComponentDoc`（必传，由各组件库传入）：组件文档解析器 `(componentDir, slug) => Promise<ComponentDoc | null>`，
  负责读取并解析单个组件文档，返回标准 `ComponentDoc`；文档查找顺序、frontmatter 字段、站点清理、demo 解析等差异由各组件库自行处理
- `outputDir`：产物输出目录（绝对路径），生成 `<outputDir>/llms/<slug>.md` 与 `<outputDir>/llms.txt`
- `platform`：站点平台（`web` / `mobile` / `chat`，默认 `mobile`），决定内置组件清单映射，用于补充不在 Map 中但有文档的组件目录
- `componentMap`：自定义组件清单映射（slug -> 导出组件名列表），优先级高于 `platform`
- `splineLabels`：spline 分类标签映射（如 `{ base: '基础' }`），未覆盖的分类回退为内置标签或 spline 原值
- `siteTitle` / `siteDescription`：`llms.txt` 索引标题与描述

`createComponentDocParser`（通用解析管道，供各组件库构建自身的 `parseComponentDoc`）：

- `readComponentDoc`（必传）：组件文档读取器，返回文档原文（含 frontmatter），无文档时返回 null
- `readDemoCode`（必传）：demo 源码解析器，替换 `{{ demo }}` 占位符
- `isDemoSlot`：判断 demo 占位符，默认匹配组件目录下的 `_example/<demoName>` 目录
- `transformers`：正文清理变压器（按序执行），默认使用内置 `cleanSiteHtml`（小程序站点清理）；其余仓库传空数组或自定义
- `titleKey` / `descriptionKey` / `splineKey`：frontmatter 字段名，默认 `title` / `description` / `spline`
- `componentMap`：组件清单映射，用于推导组件的导出组件名
- `parseTitle`：标题解析函数，默认 `splitTitle`

## 通用解析工具（common 导出，供各组件库复用）

- `parseFrontmatter(raw)`：解析 Markdown frontmatter，返回 `{ data, content }`
- `splitTitle(title)`：拆分 `'Button 按钮' -> { title, subtitle }`
- `cleanSiteHtml(body)`：清理小程序站点专用 HTML
- `renderComponentMarkdown(doc)`：渲染单篇组件文档 Markdown
- `renderLlmsTxt(docs, siteTitle, siteDescription, splineLabels, splineOrder?)`：渲染 llms.txt 索引
- `getComponentMap(platform)` / `SPLINE_ORDER` / `SPLINE_LABELS`：内置组件清单与 spline 分组配置

## 产物

- `<outputDir>/llms/<slug>.md`：每个组件一份文档（frontmatter + 正文）
- `<outputDir>/llms.txt`：组件索引（标题、描述、相对链接），按 spline 分类分组展示（基础/布局/导航/表单/数据展示/反馈/AI），
  缺失 spline 的组件归入「其他」分组（排在末尾）
