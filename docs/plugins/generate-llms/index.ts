/* eslint-disable no-console */

import { promises, readFileSync, statSync } from 'fs';
import path from 'path';

import { cleanSiteHtml, splitTitle } from './markdown';
import { getComponentMap } from './libs';
import type { ComponentDoc, ComponentMap, GenerateLlmsOptions } from './types';

export type { ComponentDoc, ComponentMap, GenerateLlmsOptions, Platform } from './types';
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

/** 默认 demo 源码解析器：读取 _example/<demoName> 下的四段代码块（wxml/js/wxss/json）。 */
function readMiniProgramDemoCode(componentDir: string, demoName: string): string {
  const demoDir = path.join(componentDir, '_example', demoName);
  const fileOrder = ['index.wxml', 'index.js', 'index.wxss', 'index.json'];
  const sections: string[] = [];
  fileOrder.forEach((file) => {
    try {
      const content = readFileSync(path.join(demoDir, file), 'utf-8');
      // 忽略内容为空的文件（如部分示例的 index.wxss），避免生成空代码块
      if (!content.trim()) return;
      const lang = file.replace('index.', '');
      sections.push(`\`\`\`${lang}`, content, '```');
    } catch {
      // 忽略不存在的文件
    }
  });
  return sections.join('\n');
}

/**
 * 将 README 解析为组件文档。
 */
async function parseComponentReadme(
  componentDir: string,
  componentMap: ComponentMap,
  readDemoCode: (componentDir: string, demoName: string) => string
): Promise<ComponentDoc | null> {
  const readmePath = path.join(componentDir, 'README.md');
  const raw = await promises.readFile(readmePath, 'utf-8');
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

/**
 * 渲染 llms.txt 索引。
 */
function renderLlmsTxt(docs: ComponentDoc[], siteTitle: string, siteDescription: string): string {
  const lines = [`# ${siteTitle}`, '', `> ${siteDescription}`, ''];
  docs.forEach((doc) => {
    const titleText = doc.subtitle ? `${doc.title} ${doc.subtitle}` : doc.title;
    lines.push(`- [${titleText}](./llms/${doc.slug}.md)：${doc.description}`);
  });
  return `${lines.join('\n')}\n`;
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
 * 与 vite 解耦 —— 仅依赖文件系统与 gray-matter，不引入任何构建工具类型。
 * 数据源为组件目录下的 README.md（frontmatter + 正文），
 * `{{ demo }}` 占位符替换为 `_example/` 目录下的真实源码块。
 * 产物：`<outputDir>/llms/<slug>.md`（每个组件一份）+ `<outputDir>/llms.txt`（组件索引）。
 *
 * @param options 生成配置。需要显式传入 `componentsRoot` 与 `outputDir`；
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
    siteTitle = 'TDesign MiniProgram',
    siteDescription = 'TDesign 小程序端组件库的 LLM 友好文档索引。',
    readDemoCode = readMiniProgramDemoCode,
  } = options;

  const llmsDir = path.join(outputDir, 'llms');

  // 组件清单以 componentMap 的 key 为准，再补充不在 Map 中但有 README 的组件目录
  const allDirs = await promises.readdir(componentsRoot);
  const mapKeys = Object.keys(componentMap);
  const componentDirs = [...mapKeys, ...allDirs.filter((dir) => !mapKeys.includes(dir))];
  const docs: ComponentDoc[] = [];

  const parsedDocs = await Promise.all(
    componentDirs.map(async (dir) => {
      const componentDir = path.join(componentsRoot, dir);
      try {
        const stat = await promises.stat(componentDir).catch((): null => null);
        if (!stat || !stat.isDirectory()) return null;

        const hasReadme = await promises
          .access(path.join(componentDir, 'README.md'))
          .then(() => true)
          .catch(() => false);
        if (!hasReadme) return null;

        return await parseComponentReadme(componentDir, componentMap, readDemoCode);
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
    content: renderLlmsTxt(docs, siteTitle, siteDescription),
  };

  await Promise.all([...docEntries, indexEntry].map((entry) => promises.writeFile(entry.absPath, entry.content)));

  logGeneratedFiles([...docEntries, indexEntry]);
  console.log('\x1b[32m%s\x1b[0m', `✓ [generate-llms] 共生成 ${docEntries.length} 个组件文档 + 1 份 llms.txt 索引`);

  return docs;
}
