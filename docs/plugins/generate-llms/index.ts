/* eslint-disable no-console */

import { promises, statSync } from 'fs';
import path from 'path';

import { parseFrontmatter, splitTitle, cleanSiteHtml, demoteHeadings } from './markdown';
import { SPLINE_LABELS, SPLINE_ORDER, getComponentMap } from './libs';
import type {
  ComponentDoc,
  ComponentDocParserOptions,
  GenerateLlmsOptions,
  IsDemoSlot,
  ParseComponentDoc,
} from './types';

export type {
  BodyTransformer,
  ComponentDoc,
  ComponentDocParserOptions,
  ComponentMap,
  FrontmatterResult,
  GenerateLlmsOptions,
  IsDemoSlot,
  ParseComponentDoc,
  Platform,
  ReadDemoCode,
  ReadComponentDoc,
} from './types';

// 重新导出通用解析与渲染工具，供各组件库复用
export {
  parseFrontmatter,
  splitTitle,
  cleanSiteHtml,
  stripSiteBlocks,
  convertTdCodeBlock,
  stripCoverageBadges,
  demoteHeadings,
} from './markdown';
export { SPLINE_LABELS, SPLINE_ORDER, getComponentMap } from './libs';

/** 判断 demo 目录是否存在（同步）。 */
function isDirectorySync(p: string): boolean {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
}

/**
 * 默认的 demo 占位符判断：匹配组件目录下的 `_example/<demoName>` 目录。
 */
export const defaultIsDemoSlot: IsDemoSlot = (componentDir, demoName) =>
  isDirectorySync(path.join(componentDir, '_example', demoName));

/** 默认的 demo 占位符正则（{{ demoName }}） */
export const DEMO_PLACEHOLDER_RE = /\{\{\s*([a-z0-9-]+)\s*\}\}/g;

/**
 * 替换正文中的 `{{ demo }}` 占位符为真实源码块。
 * 仅当存在对应 demo 目录时才替换，避免误伤 WXML 模板绑定（如 {{item}}/{{48}}）。
 */
function replaceDemoSlots(
  content: string,
  componentDir: string,
  readDemoCode: (componentDir: string, demoName: string) => string,
  isDemoSlot: IsDemoSlot = defaultIsDemoSlot
): string {
  return content.replace(DEMO_PLACEHOLDER_RE, (match, demoName: string) => {
    if (!isDemoSlot(componentDir, demoName)) return match;
    return readDemoCode(componentDir, demoName);
  });
}

/**
 * 组装「默认文档解析管道」：读取原文 -> 解析 frontmatter -> 替换 demo -> 清理正文。
 *
 * 这是通用解析方法所在：各组件库调用它构建自己的 `parseComponentDoc`，
 * 并可按需覆盖 demo 判断、正文清理变压器、frontmatter 字段等。
 */
export function createComponentDocParser(options: ComponentDocParserOptions): ParseComponentDoc {
  const {
    readComponentDoc,
    readDemoCode,
    isDemoSlot = defaultIsDemoSlot,
    transformers,
    titleKey = 'title',
    descriptionKey = 'description',
    splineKey = 'spline',
    componentMap,
    parseTitle = splitTitle,
  } = options;

  return async (componentDir, slug) => {
    const raw = await readComponentDoc(componentDir, slug);
    if (!raw) return null;

    const { data, content } = parseFrontmatter(raw);
    const rawTitle = data[titleKey];
    if (!rawTitle) return null;

    const { title: enTitle, subtitle } = parseTitle(rawTitle);
    // 组件名：优先取组件 Map 注册的导出名（首项），回退为英文 title
    const component = componentMap?.[slug]?.[0] || enTitle;

    // demo 占位符替换
    const demoResolved = replaceDemoSlots(content, componentDir, readDemoCode, isDemoSlot);
    // 正文清理：默认使用小程序站点清理，可通过 transformers 覆盖
    const body = (transformers ?? [cleanSiteHtml]).reduce(
      (block, transform) => transform(block, { slug, componentDir }),
      demoResolved
    );

    return {
      slug,
      title: enTitle,
      subtitle,
      description: data[descriptionKey] || '',
      spline: data[splineKey] || '',
      component,
      body,
    };
  };
}

/**
 * YAML 标量转义：若值含冒号 / 井号 / 引号 / 换行等特殊字符，则用双引号包裹并转义，
 * 避免破坏 frontmatter 结构。
 */
function yamlScalar(value: string): string {
  const v = value ?? '';
  if (/["'#:\n\r[\]{}]/.test(v)) {
    return `"${v.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r')}"`;
  }
  return v;
}

/**
 * 渲染单篇组件文档的 Markdown。
 */
export function renderComponentMarkdown(doc: ComponentDoc): string {
  const fm = [
    '---',
    `title: ${yamlScalar(doc.title)}`,
    `subtitle: ${yamlScalar(doc.subtitle)}`,
    `description: ${yamlScalar(doc.description)}`,
    `spline: ${yamlScalar(doc.spline)}`,
    `component: ${yamlScalar(doc.component)}`,
    '---',
    '',
  ].join('\n');
  return `${fm}\n${doc.body.trim()}\n`;
}

/**
 * 渲染 llms-full.txt 中单个组件的文档片段：
 * 以「## 组件名 中文副标题」标题开头，附 frontmatter 描述引用，随后为正文（标题整体降一级）。
 *
 * 与单篇 `components/<slug>.md` 不同，聚合文件内不输出 frontmatter ——
 * 多篇文档拼接后 YAML 原文会成为正文噪音（`---` 被渲染为分隔线，或与上一行组合成 setext 标题）。
 * 层级约定：分组 `#`、组件 `##`、组件内标题 `###` 起，避免分组与组件标题层级倒挂。
 */
export function renderComponentSection(doc: ComponentDoc): string {
  const heading = doc.subtitle ? `${doc.title} ${doc.subtitle}` : doc.title;
  const lines = [`## ${heading}`];
  if (doc.description) {
    lines.push('', `> ${doc.description}`);
  }
  lines.push('', demoteHeadings(doc.body.trim()));
  return lines.join('\n');
}

/**
 * 拼接组件文档链接：配置了 `siteBaseUrl` 时输出绝对链接（便于 LLM 在任意位置直接抓取），
 * 否则输出相对链接 `./components/<slug>.md`（相对 llms.txt 所在目录）。
 */
export function resolveDocUrl(slug: string, siteBaseUrl?: string): string {
  const rel = `components/${slug}.md`;
  const base = siteBaseUrl?.replace(/\/+$/, '');
  if (!base) return `./${rel}`;
  return `${base}/${rel}`;
}

function renderIndexLine(doc: ComponentDoc, siteBaseUrl?: string): string {
  const titleText = doc.subtitle ? `${doc.title} ${doc.subtitle}` : doc.title;
  return `- [${titleText}](${resolveDocUrl(doc.slug, siteBaseUrl)})：${doc.description}`;
}

/**
 * 渲染 llms.txt 索引：按 spline 分类分组，缺失 spline 的组件归入「其他」分组（排在末尾）。
 */
export function renderLlmsTxt(
  docs: ComponentDoc[],
  siteTitle: string,
  siteDescription: string,
  splineLabels: Record<string, string>,
  splineOrder: string[] = SPLINE_ORDER,
  siteBaseUrl?: string
): string {
  const groups = new Map<string, ComponentDoc[]>();
  docs.forEach((doc) => {
    const list = groups.get(doc.spline);
    if (list) list.push(doc);
    else groups.set(doc.spline, [doc]);
  });

  const knownSplines = splineOrder.filter((spline) => groups.has(spline));
  const extraSplines = [...groups.keys()]
    .filter((spline) => spline && !splineOrder.includes(spline))
    .sort((a, b) => a.localeCompare(b));
  const labelOf = (spline: string) => splineLabels[spline] || SPLINE_LABELS[spline] || spline;

  const lines = [`# ${siteTitle}`, '', `> ${siteDescription}`, ''];

  [...knownSplines, ...extraSplines].forEach((spline) => {
    lines.push(`## ${labelOf(spline)}`, '');
    (groups.get(spline) ?? []).forEach((doc) => lines.push(renderIndexLine(doc, siteBaseUrl)));
    lines.push('');
  });

  const ungrouped = groups.get('');
  if (ungrouped) {
    lines.push(`## ${labelOf('other')}`, '');
    ungrouped.forEach((doc) => lines.push(renderIndexLine(doc, siteBaseUrl)));
    lines.push('');
  }

  return `${lines.join('\n').trimEnd()}\n`;
}

/**
 * 渲染 llms-full.txt：聚合全部组件文档正文的完整版文件。
 *
 * 遵循 llms.txt 规范 —— `llms-full.txt` 供 LLM 一次性加载全部文档内容：
 * 头部为站点标题与描述，随后按 spline 聚合、逐组件拼接 `renderComponentSection`
 * 渲染的文档片段。层级约定：分组 `#`、组件 `##`、组件内标题 `###` 起。
 */
export function renderLlmsFullTxt(
  docs: ComponentDoc[],
  siteTitle: string,
  siteDescription: string,
  splineLabels: Record<string, string>,
  splineOrder: string[] = SPLINE_ORDER
): string {
  // 按 spline 分组有序渲染，缺失 spline 归入「其他」分组（排在末尾），与 llms.txt 保持一致
  const groups = new Map<string, ComponentDoc[]>();
  docs.forEach((doc) => {
    const list = groups.get(doc.spline);
    if (list) list.push(doc);
    else groups.set(doc.spline, [doc]);
  });

  const knownSplines = splineOrder.filter((spline) => groups.has(spline));
  const extraSplines = [...groups.keys()]
    .filter((spline) => spline && !splineOrder.includes(spline))
    .sort((a, b) => a.localeCompare(b));
  const labelOf = (spline: string) => splineLabels[spline] || SPLINE_LABELS[spline] || spline;

  const sections: string[] = [`# ${siteTitle}`, `> ${siteDescription}`];
  const orderedSplines = [...knownSplines, ...extraSplines];
  orderedSplines.forEach((spline) => {
    sections.push(`# ${labelOf(spline)}`);
    (groups.get(spline) ?? []).forEach((doc) => sections.push(renderComponentSection(doc)));
  });
  const ungrouped = groups.get('');
  if (ungrouped) {
    sections.push(`# ${labelOf('other')}`);
    ungrouped.forEach((doc) => sections.push(renderComponentSection(doc)));
  }

  return `${sections.join('\n\n')}\n`;
}

/**
 * 以构建日志样式打印产物清单：文件名对齐 + 体积（kB）。
 */
function logGeneratedFiles(entries: { relPath: string; content: string }[]): void {
  const width = Math.max(...entries.map((entry) => entry.relPath.length));
  entries.forEach((entry) => {
    const size = `${(Buffer.byteLength(entry.content, 'utf-8') / 1000).toFixed(2)} kB`;
    console.log(`${entry.relPath.padEnd(width + 2)}${size.padStart(10)}`);
  });
}

/**
 * 纯 JS 方法：为每个组件生成面向 LLM 的 Markdown 文档。
 *
 * 与 vite 解耦 —— 仅依赖文件系统，不引入任何构建工具类型。
 * 通用解析方法（frontmatter/demo/splitTitle/cleanSiteHtml 及渲染）均在 common 内，
 * 各组件库只需通过 `parseComponentDoc` 注入自身的解析器（读取文档、处理站点差异、解析 demo），
 * 返回统一的 ComponentDoc，由 common 编排落盘。
 * 产物：`<outputDir>/components/<slug>.md`（每个组件一份）+ `<outputDir>/llms.txt`（按 spline 分组的组件索引）
 *       + `<outputDir>/llms-full.txt`（聚合全部组件文档全文的完整版，供 LLM 一次性加载）。
 *
 * @param options 生成配置。需要显式传入 `componentsRoot`、`outputDir`、`parseComponentDoc`；
 *   组件清单默认按 `platform`（默认 `mobile`）取内置映射，用于补充不在 Map 中但有文档的组件目录。
 * @returns 生成的组件文档列表。
 */
export default async function generateLlmsDocs(options: GenerateLlmsOptions): Promise<ComponentDoc[]> {
  const {
    componentsRoot,
    outputDir,
    platform = 'mobile',
    componentMap = getComponentMap(platform),
    splineLabels = {},
    siteTitle = 'TDesign MiniProgram',
    siteDescription = 'TDesign 小程序端组件库的 LLM 友好文档索引。',
    siteBaseUrl,
    parseComponentDoc,
    docHostMap,
  } = options;

  const componentsDocDir = path.join(outputDir, 'components');

  console.log('\x1b[36m%s\x1b[0m', `>[generate-llms] 开始生成 LLM 文档（${platform}）...`);

  // 组件清单以 componentMap 的 key 为准（含挂靠组件 docHostMap 的 key），
  // 再补充不在两者中、且确实为目录（过滤文件与非目录项）的组件目录
  const allEntries = await promises.readdir(componentsRoot, { withFileTypes: true });
  // 挂靠目录反查表（目录名 -> 规范 slug）：无独立目录的组件（如 layout 文档挂靠在 col 目录）
  const hostToSlug = new Map(Object.entries(docHostMap ?? {}).map(([slug, host]) => [host, slug]));
  const mapKeys = [...new Set([...Object.keys(componentMap), ...Object.keys(docHostMap ?? {})])];
  // 挂靠目录不作为独立组件解析，避免同一文档按目录名重复生成一份
  const componentDirs = [
    ...mapKeys,
    ...allEntries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .filter((dir) => !mapKeys.includes(dir) && !hostToSlug.has(dir)),
  ];
  const docs: ComponentDoc[] = [];

  const parsedDocs = await Promise.all(
    componentDirs.map(async (slug) => {
      // 挂靠组件（如 layout 文档实际位于 col 目录）：从挂靠目录解析文档与 demo
      const componentDir = path.join(componentsRoot, docHostMap?.[slug] ?? slug);
      try {
        return await parseComponentDoc(componentDir, slug);
      } catch (err) {
        // 单个组件解析失败仅告警，不中断整体生成
        console.warn(`[generate-llms] 解析组件 ${slug} 失败，已跳过：`, err);
        return null;
      }
    })
  );
  parsedDocs.forEach((doc) => {
    if (doc) docs.push(doc);
  });

  docs.sort((a, b) => a.slug.localeCompare(b.slug));

  await promises.mkdir(componentsDocDir, { recursive: true });

  const docEntries = docs.map((doc) => ({
    relPath: `components/${doc.slug}.md`,
    absPath: path.join(componentsDocDir, `${doc.slug}.md`),
    content: renderComponentMarkdown(doc),
  }));
  const indexEntry = {
    relPath: 'llms.txt',
    absPath: path.join(outputDir, 'llms.txt'),
    content: renderLlmsTxt(docs, siteTitle, siteDescription, splineLabels, SPLINE_ORDER, siteBaseUrl),
  };
  const fullIndexEntry = {
    relPath: 'llms-full.txt',
    absPath: path.join(outputDir, 'llms-full.txt'),
    content: renderLlmsFullTxt(docs, siteTitle, siteDescription, splineLabels),
  };

  const outputEntries = [...docEntries, indexEntry, fullIndexEntry];
  await Promise.all(outputEntries.map((entry) => promises.writeFile(entry.absPath, entry.content)));

  logGeneratedFiles(outputEntries);
  console.log(
    '\x1b[32m%s\x1b[0m',
    `✓ [generate-llms] 共生成 ${docEntries.length} 个组件文档 + llms.txt + llms-full.txt`
  );

  return docs;
}
