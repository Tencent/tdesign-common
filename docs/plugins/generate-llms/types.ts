/** 组件清单映射：slug -> 导出组件名列表 */
export type ComponentMap = Record<string, string[]>;

/** 站点平台，决定内置的组件清单映射 */
export type Platform = 'web' | 'mobile' | 'chat';

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
  /** 组件根目录（绝对路径），目录下含各组件目录（README.md 或 <slug>.md）与 _example/ */
  componentsRoot: string;
  /**
   * 扁平文档目录（绝对路径，common 子仓，如 packages/common/docs/web/api）：
   * 非小程序仓库的组件文档统一读自该目录下的 <slug>.md（如 affix.md），优先级高于组件目录内文档
   */
  docsRoot?: string;
  /** 产物输出目录（绝对路径），生成 <outputDir>/llms/<slug>.md 与 <outputDir>/llms.txt */
  outputDir: string;
  /** 组件文档文件名，支持 `{slug}` 占位符：小程序仓库默认 `README.md`，其余仓库传 `'{slug}.md'` */
  docFilename?: string;
  /** 站点平台，用于内置组件清单映射（web / mobile / chat），默认 `mobile` */
  platform?: Platform;
  /** 自定义组件清单映射，优先级高于 `platform` */
  componentMap?: ComponentMap;
  /** llms.txt 索引标题 */
  siteTitle?: string;
  /** llms.txt 索引描述 */
  siteDescription?: string;
  /** demo 源码文件解析器：读取 _example/<demoName> 目录，返回代码块文本 */
  readDemoCode?: (componentDir: string, demoName: string) => string;
}
