/** 组件清单映射：slug -> 导出组件名列表 */
export type ComponentMap = Record<string, string[]>;

/** 站点平台，决定内置的组件清单映射 */
export type Platform = 'web' | 'mobile' | 'chat';

/**
 * 解析后的组件文档（各组件库解析后交给 common 的统一结果）。
 */
export interface ComponentDoc {
  /** 文件名，如 button */
  slug: string;
  /** 英文名，如 Button */
  title: string;
  /** 中文名，如 按钮 */
  subtitle: string;
  /** 描述 */
  description: string;
  /** spline 分类 */
  spline: string;
  /** 组件名（如 Button / Layout） */
  component: string;
  /** 生成后的正文内容（不含 frontmatter，已做站点清理与 demo 替换） */
  body: string;
}

/**
 * 组件文档解析器（由各组件库传入）。
 * 各组件库负责自身的文档读取、frontmatter 字段差异、站点 HTML 清理、demo 源码读取，
 * 最终返回统一的 ComponentDoc，供 common 编排渲染。
 */
export type ParseComponentDoc = (componentDir: string, slug: string) => Promise<ComponentDoc | null>;

/** 组件文档读取器（通用解析器构建时使用）：返回文档原文（含 frontmatter），无文档时返回 null */
export type ReadComponentDoc = (componentDir: string, slug: string) => Promise<string | null>;

/** demo 源码解析器：读取 _example/<demoName> 目录，返回代码块文本 */
export type ReadDemoCode = (componentDir: string, demoName: string) => string;

/** 判断是否为 demo 占位符（默认匹配组件目录下的 _example/<demoName>） */
export type IsDemoSlot = (componentDir: string, demoName: string) => boolean;

/** 正文清理变压器：按序执行，输入/输出均为正文 Markdown/HTML 字符串 */
export type BodyTransformer = (body: string, ctx?: { slug: string; componentDir: string }) => string;

/** frontmatter 解析结果（含提取的数据与剥离 frontmatter 后的正文） */
export interface FrontmatterResult {
  data: Record<string, string>;
  content: string;
}

/**
 * 通用文档解析器构建参数。
 * 用于组装「默认解析管道」：读取原文 -> 解析 frontmatter -> 替换 demo -> 站点清理。
 * 各组件库可按需覆盖其中任一环节。
 */
export interface ComponentDocParserOptions {
  /** 组件文档读取器（必传）：返回文档原文（含 frontmatter），无文档时返回 null */
  readComponentDoc: ReadComponentDoc;
  /** demo 源码解析器（必传）：替换 {{ demo }} 占位符 */
  readDemoCode: ReadDemoCode;
  /** 判断 demo 占位符，默认匹配组件目录下的 _example/<demoName> */
  isDemoSlot?: IsDemoSlot;
  /** 正文清理变压器（按序执行），默认使用内置 cleanSiteHtml（小程序站点清理） */
  transformers?: BodyTransformer[];
  /** frontmatter 标题字段，默认 'title' */
  titleKey?: string;
  /** frontmatter 描述字段，默认 'description' */
  descriptionKey?: string;
  /** frontmatter 分类字段，默认 'spline' */
  splineKey?: string;
  /** 组件清单映射，用于推导组件的导出组件名 */
  componentMap?: ComponentMap;
  /** 标题解析函数，默认用 splitTitle */
  parseTitle?: (rawTitle: string) => { title: string; subtitle: string };
}

/** 生成配置项 */
export interface GenerateLlmsOptions {
  /** 组件根目录（绝对路径），目录下含各组件目录与 _example/ */
  componentsRoot: string;
  /** 组件文档解析器（必传，由各组件库传入）：负责读取并解析单个组件文档，返回标准 ComponentDoc */
  parseComponentDoc: ParseComponentDoc;
  /** 产物输出目录（绝对路径），生成 <outputDir>/components/<slug>.md、<outputDir>/llms.txt 与 <outputDir>/llms-full.txt */
  outputDir: string;
  /** 站点平台，用于内置组件清单映射（web / mobile / chat），默认 `mobile` */
  platform?: Platform;
  /** 自定义组件清单映射，优先级高于 `platform`；用于补充不在 Map 中但有文档的组件目录 */
  componentMap?: ComponentMap;
  /**
   * 挂靠组件映射（规范 slug -> 实际承载文档的目录名）。
   * 部分仓库存在无独立目录的组件（如小程序 `layout` 文档挂靠在 `col` 目录、`typography` 挂靠在 `paragraph`），
   * 传入后按规范 slug 生成 `components/<slug>.md`（demo 占位符也从挂靠目录解析），挂靠目录本身不再重复生成。
   */
  docHostMap?: Record<string, string>;
  /** spline 分类标签映射（如 `{ base: '基础' }`），未覆盖的分类回退为内置标签或 spline 原值 */
  splineLabels?: Record<string, string>;
  /** llms.txt 索引标题 */
  siteTitle?: string;
  /** llms.txt 索引描述 */
  siteDescription?: string;
  /**
   * 站点产物部署基址（如 `https://static.tdesign.tencent.com/miniprogram`）。
   * 传入后 llms.txt 中的组件文档链接输出为绝对 URL（`<siteBaseUrl>/components/<slug>.md`），
   * 便于 LLM 在任意位置直接抓取；不传则保持相对链接 `./components/<slug>.md`。
   */
  siteBaseUrl?: string;
}
