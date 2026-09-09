/* eslint-disable no-console */

import { promises, statSync } from 'fs';
import path from 'path';

import { cleanSiteHtml, splitTitle } from './markdown';
import { SPLINE_LABELS, SPLINE_ORDER, getComponentMap } from './libs';
import type { ComponentDoc, ComponentMap, GenerateLlmsOptions } from './types';

export type { ComponentDoc, ComponentMap, GenerateLlmsOptions, Platform, ReadComponentDoc } from './types';
export { cleanSiteHtml, splitTitle } from './markdown';

/**
 * 解析 Markdown 的 frontmatter（--- 包裹的简单 key: value 格式）。
 * 替代 gray-matter，避免引入额外依赖。
 */
function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const data: Record<string, string> = {};
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!match) return { data, content: raw };
  const fm = match[1];
  fm.split('\n').forEach((line) => {
    const kv = line.match(/^([a-zA-Z0-9_-]+)\s*:\s*(.*?)\s*$/);
    if (kv) {
      const [key, value] = kv.slice(1);
      data[key] = value;
    }
  });
  return { data, content: raw.slice(match[0].length) };
}

/** 判断 demo 目录是否存在（同步）。 */
function isDirectorySync(p: string): boolean {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
}

/**
 * 将组件 Markdown 文档解析为组件文档。
 */
function parseComponentReadme(
  componentDir: string,
  raw: string,
  componentMap: ComponentMap,
  readDemoCode: (componentDir: string, demoName: string) => string
): ComponentDoc | null {
  const { data, content } = parseFrontmatter(raw);
  const { title: rawTitle, description, spline } = data;

  if (!rawTitle) return null;

  const slug = path.basename(componentDir);
  const { title: enTitle, subtitle } = splitTitle(rawTitle);
  // 组件名：优先取组件 Map 注册的导出名（首项），回退为英文 title
  const component = componentMap[slug]?.[0] || enTitle;

  const body = cleanSiteHtml(
    content.replace(/\{\{\s*([a-z0-9-]+)\s*\}\}/g, (match, demoName: string) => {
      // 仅当存在对应 _example 目录时才视为 demo 占位符，避免误伤 WXML 模板绑定（如 {{item}}/{{48}}）
      if (!isDirectorySync(path.join(componentDir, '_example', demoName))) return match;
      return readDemoCode(componentDir, demoName);
    })
  );

  return {
    slug,
    title: enTitle,
    subtitle,
    description: description || '',
    spline: spline || '',
    component,
    body,
  };
}

/**
 * 渲染单篇组件文档的 Markdown。
 */
function renderComponentMarkdown(doc: ComponentDoc): string {
  const fm = [
    '---',
    `title: ${doc.title}`,
    `subtitle: ${doc.subtitle}`,
    `description: ${doc.description}`,
    `spline: ${doc.spline}`,
    `component: ${doc.component}`,
    '---',
    '',
  ].join('\n');
  return `${fm}${doc.body.trim()}\n`;
}

function renderIndexLine(doc: ComponentDoc): string {
  const titleText = doc.subtitle ? `${doc.title} ${doc.subtitle}` : doc.title;
  return `- [${titleText}](./llms/${doc.slug}.md)：${doc.description}`;
}

/**
 * 渲染 llms.txt 索引：按 spline 分类分组，缺失 spline 的组件归入「其他」分组（排在末尾）。
 */
function renderLlmsTxt(
  docs: ComponentDoc[],
  siteTitle: string,
  siteDescription: string,
  splineLabels: Record<string, string>
): string {
  const groups = new Map<string, ComponentDoc[]>();
  docs.forEach((doc) => {
    const list = groups.get(doc.spline);
    if (list) list.push(doc);
    else groups.set(doc.spline, [doc]);
  });

  const knownSplines = SPLINE_ORDER.filter((spline) => groups.has(spline));
  const extraSplines = [...groups.keys()]
    .filter((spline) => spline && !SPLINE_ORDER.includes(spline))
    .sort((a, b) => a.localeCompare(b));
  const labelOf = (spline: string) => splineLabels[spline] || SPLINE_LABELS[spline] || spline;

  const lines = [`# ${siteTitle}`, '', `> ${siteDescription}`, ''];

  [...knownSplines, ...extraSplines].forEach((spline) => {
    lines.push(`## ${labelOf(spline)}`, '');
    (groups.get(spline) ?? []).forEach((doc) => lines.push(renderIndexLine(doc)));
    lines.push('');
  });

  const ungrouped = groups.get('');
  if (ungrouped) {
    lines.push(`## ${labelOf('other')}`, '');
    ungrouped.forEach((doc) => lines.push(renderIndexLine(doc)));
    lines.push('');
  }

  return `${lines.join('\n').trimEnd()}\n`;
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
 * 组件文档由 `readComponentDoc` 读取（由各组件库传入：小程序读组件目录 README.md，
 * 其余仓库可优先读 common 子仓扁平目录 `<slug>.md` 再回退组件目录内文档）。
 * `{{ demo }}` 占位符替换为 `componentsRoot/<slug>/_example/` 下的真实源码块（解析器由调用方传入）。
 * 产物：`<outputDir>/llms/<slug>.md`（每个组件一份）+ `<outputDir>/llms.txt`（按 spline 分组的组件索引）。
 *
 * @param options 生成配置。需要显式传入 `componentsRoot`、`outputDir`、`readComponentDoc` 与 `readDemoCode`；
 *   组件清单默认按 `platform`（默认 `mobile`）取内置映射，无需外部传入。
 * @returns 生成的组件文档列表。
 */
export default async function generateLlmsDocs(options: GenerateLlmsOptions): Promise<ComponentDoc[]> {
  const {
    componentsRoot,
    outputDir,
    platform = 'mobile',
    // 组件清单映射：默认按 platform 取内置映射（WEB/MOBILE/CHAT_COMPONENT_MAP），也可显式传入自定义清单覆盖
    componentMap = getComponentMap(platform),
    // spline 分类标签映射：默认取内置映射，可通过自定义配置覆盖或扩展
    splineLabels = {},
    siteTitle = 'TDesign MiniProgram',
    siteDescription = 'TDesign 小程序端组件库的 LLM 友好文档索引。',
    // 组件文档读取器：由各组件库传入（小程序读组件目录 README.md，其余仓库可优先读 common 子仓扁平目录）
    readComponentDoc,
    // demo 源码解析器：由各组件库按自身示例组织方式传入（小程序读 index.{wxml,js,wxss,json}，uniapp 读 index.vue）
    readDemoCode,
  } = options;

  const llmsDir = path.join(outputDir, 'llms');

  console.log('\x1b[36m%s\x1b[0m', `>[generate-llms] 开始生成 LLM 文档（${platform}）...`);

  // 组件清单以 componentMap 的 key 为准，再补充不在 Map 中但有组件文档的目录
  const allDirs = await promises.readdir(componentsRoot);
  const mapKeys = Object.keys(componentMap);
  const componentDirs = [...mapKeys, ...allDirs.filter((dir) => !mapKeys.includes(dir))];
  const docs: ComponentDoc[] = [];

  const parsedDocs = await Promise.all(
    componentDirs.map(async (dir) => {
      const componentDir = path.join(componentsRoot, dir);
      try {
        const raw = await readComponentDoc(componentDir, dir);
        if (!raw) return null;

        return parseComponentReadme(componentDir, raw, componentMap, readDemoCode);
      } catch (err) {
        // 单个组件解析失败仅告警，不中断整体生成
        console.warn(`[generate-llms] 解析组件 ${dir} 失败，已跳过：`, err);
        return null;
      }
    })
  );
  parsedDocs.forEach((doc) => {
    if (doc) docs.push(doc);
  });

  docs.sort((a, b) => a.slug.localeCompare(b.slug));

  await promises.mkdir(llmsDir, { recursive: true });

  const docEntries = docs.map((doc) => ({
    relPath: `llms/${doc.slug}.md`,
    absPath: path.join(llmsDir, `${doc.slug}.md`),
    content: renderComponentMarkdown(doc),
  }));
  const indexEntry = {
    relPath: 'llms.txt',
    absPath: path.join(outputDir, 'llms.txt'),
    content: renderLlmsTxt(docs, siteTitle, siteDescription, splineLabels),
  };

  await Promise.all([...docEntries, indexEntry].map((entry) => promises.writeFile(entry.absPath, entry.content)));

  logGeneratedFiles([...docEntries, indexEntry]);
  console.log('\x1b[32m%s\x1b[0m', `✓ [generate-llms] 共生成 ${docEntries.length} 个组件文档 + 1 份 llms.txt 索引`);

  return docs;
}
