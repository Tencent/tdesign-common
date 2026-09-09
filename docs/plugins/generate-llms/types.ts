/** 组件清单映射：slug -> 导出组件名列表 */
export type ComponentMap = Record<string, string[]>;

/** 站点平台，决定内置的组件清单映射 */
export type Platform = 'web' | 'mobile' | 'chat';

/** 组件文档读取器：返回文档原文（含 frontmatter），无文档时返回 null */
export type ReadComponentDoc = (componentDir: string, slug: string) => Promise<string | null>;

/** 解析后的组件文档 */
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
  /** 生成后的正文内容（不含 frontmatter） */
  body: string;
}

/** 生成配置项 */
export interface GenerateLlmsOptions {
  /** 组件根目录（绝对路径），目录下含各组件目录与 _example/ */
  componentsRoot: string;
  /** 组件文档读取器（必传，由各组件库传入）：返回文档原文（含 frontmatter），无文档时返回 null */
  readComponentDoc: ReadComponentDoc;
  /** 产物输出目录（绝对路径），生成 <outputDir>/llms/<slug>.md 与 <outputDir>/llms.txt */
  outputDir: string;
  /** 站点平台，用于内置组件清单映射（web / mobile / chat），默认 `mobile` */
  platform?: Platform;
  /** 自定义组件清单映射，优先级高于 `platform` */
  componentMap?: ComponentMap;
  /** spline 分类标签映射（如 `{ base: '基础' }`），未覆盖的分类回退为内置标签或 spline 原值 */
  splineLabels?: Record<string, string>;
  /** llms.txt 索引标题 */
  siteTitle?: string;
  /** llms.txt 索引描述 */
  siteDescription?: string;
  /** demo 源码文件解析器（必传，由各组件库传入）：读取 _example/<demoName> 目录，返回代码块文本 */
  readDemoCode: (componentDir: string, demoName: string) => string;
}
