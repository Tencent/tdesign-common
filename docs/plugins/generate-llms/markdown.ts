import type { FrontmatterResult } from './types';

/**
 * 拆分 title：'Button 按钮' -> { title: 'Button', subtitle: '按钮' }。
 * 仅当能拆成「英文/拉丁开头 + 空格 + 中文副标题」时才拆分（兼容 'Button 按钮' 等），
 * 纯中文标题（如 '气泡提示'）或不含中文副标题的场景整体作为 title，避免误拆。
 */
export function splitTitle(title: string): { title: string; subtitle: string } {
  const trimmed = (title || '').trim();
  if (!trimmed) return { title: '', subtitle: '' };
  // 需前段以英文字母开头、后段包含中文，才视为「英文 中文」组合
  const match = trimmed.match(/^([A-Za-z][A-Za-z0-9\s-]*?)\s+([^\s].*)$/);
  if (match && /[\u4e00-\u9fa5]/.test(match[2])) {
    return { title: match[1].trim(), subtitle: match[2].trim() };
  }
  return { title: trimmed, subtitle: '' };
}

/**
 * 解析 Markdown 的 frontmatter（--- 包裹的简单 key: value 格式）。
 * 替代 gray-matter，避免引入额外依赖。
 */
export function parseFrontmatter(raw: string): FrontmatterResult {
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

/**
 * 移除站点专用说明块：渲染框架支持情况 / 版本提示 / Tips blockquote / 预览链接。
 * 通过 tag 计数处理嵌套元素，从而整块移除。
 */
export function removeSiteBlocks(body: string): string {
  const blockTags = ['div', 'blockquote'];
  let result = body;

  blockTags.forEach((tag) => {
    const openRe = new RegExp(`<${tag}\\b[^>]*>`, 'g');
    let match = openRe.exec(result);
    while (match) {
      const openTag = match[0];
      const isTarget =
        (tag === 'div' &&
          /(background:\s*#ecf2fe|background-color:\s*#ecf2fe|background:\s*#d9e1ff|background-color:\s*#d9e1ff)/.test(
            openTag
          )) ||
        (tag === 'blockquote' && /background-color:\s*#/.test(openTag)) ||
        /渲染框架支持情况|该组件于|Tips:|预览效果/.test(openTag);

      let removed = false;
      if (isTarget) {
        let depth = 0;
        const tokenRe = new RegExp(`</?${tag}(?:\\s[^>]*)?>`, 'g');
        tokenRe.lastIndex = match.index;
        let token = tokenRe.exec(result);
        while (token) {
          if (token[0].startsWith(`</${tag}`)) {
            depth -= 1;
            if (depth === 0) {
              const end = token.index + token[0].length;
              result = result.slice(0, match.index) + result.slice(end);
              removed = true;
              break;
            }
          } else {
            depth += 1;
          }
          token = tokenRe.exec(result);
        }
      }

      if (removed) {
        openRe.lastIndex = match.index;
      } else {
        openRe.lastIndex = match.index + match[0].length;
      }
      match = openRe.exec(result);
    }
  });
  return result;
}

/**
 * 将站点专用的「在开发者工具中预览效果」链接转换为 Markdown 链接。
 */
export function convertPreviewLink(body: string): string {
  return body.replace(
    /<a\s+href="(https:\/\/developers\.weixin\.qq\.com\/s\/[^"]+)"[^>]*>[^<]*<\/a>/g,
    (_m, url: string) => `> [在微信开发者工具中预览效果](${url})`
  );
}

/**
 * 将站点专用的 Tips blockquote（小程序调试提示）转换为 Markdown 引用块。
 */
export function convertTipsBlock(body: string): string {
  return body.replace(/<blockquote\b[^>]*>\s*<p>([\s\S]*?)<\/p>\s*<\/blockquote>/g, (_m, text: string) =>
    text
      .split(/<br\s*\/?>|\n/)
      .map((line) => line.replace(/<[^>]+>/g, '').trim())
      .filter(Boolean)
      .map((line) => `> ${line}`)
      .join('\n')
  );
}

/**
 * 提取字符串中的全部顶层 `<div ...>...</div>` 块内容（含嵌套），
 * 按 tag 计数正确处理嵌套 div，避免非贪婪匹配截断嵌套内容。
 */
function extractChildDivBlocks(html: string): string[] {
  const blocks: string[] = [];
  const tokenRe = /<\/?div(?:\s[^>]*)?>/g;
  let depth = 0;
  let start = -1;
  let token = tokenRe.exec(html);
  while (token) {
    if (token[0].startsWith('</div')) {
      depth -= 1;
      if (depth === 0 && start !== -1) {
        blocks.push(html.slice(start, token.index));
        start = -1;
      }
    } else {
      if (depth === 0) {
        start = token.index + token[0].length;
      }
      depth += 1;
    }
    token = tokenRe.exec(html);
  }
  return blocks;
}

/**
 * 将站点顶部的说明块（版本上线提示 / 渲染框架支持情况）转换为 Markdown 引用块。
 */
export function convertHeaderNoticeBlocks(body: string): string {
  const openRe = /<div\s+style="background:\s*#(?:ecf2fe|d9e1ff)[^"]*"[^>]*>/g;
  let result = body;
  let match = openRe.exec(result);
  while (match) {
    let depth = 0;
    const tokenRe = /<\/?div(?:\s[^>]*)?>/g;
    tokenRe.lastIndex = match.index;
    let token = tokenRe.exec(result);
    let end = -1;
    while (token) {
      if (token[0].startsWith('</div')) {
        depth -= 1;
        if (depth === 0) {
          end = token.index + token[0].length;
          break;
        }
      } else {
        depth += 1;
      }
      token = tokenRe.exec(result);
    }
    if (end === -1) break;

    const inner = result.slice(match.index + match[0].length, end);
    const converted = extractChildDivBlocks(inner)
      .map((block) =>
        block
          .replace(/<[^>]+>/g, '')
          .replace(/\s+/g, ' ')
          .trim()
      )
      .filter(Boolean)
      .map((line) => `> ${line}`)
      .join('\n');
    result = result.slice(0, match.index) + converted + result.slice(end);
    openRe.lastIndex = match.index;
    match = openRe.exec(result);
  }
  return result;
}

/**
 * 清理站点专用 HTML：转换为 Markdown 语义后，移除剩余站点专用 HTML 块。
 */
export function cleanSiteHtml(body: string): string {
  const converted = convertHeaderNoticeBlocks(convertTipsBlock(convertPreviewLink(body)));
  return removeSiteBlocks(converted).replace(
    /<a href="https:\/\/developers\.weixin\.qq\.com\/s\/[^"]*"[^>]*>[^<]*<\/a>/g,
    ''
  );
}

/**
 * 通用站点装饰块移除器：移除设计图块（`<div class="legend">`，可能含嵌套 div）、
 * 站点专用说明块等平台无关的 HTML 装饰，保留真实内容。
 * 可作为各仓库（web/mobile/flutter）的兜底 transformer。
 */
export const stripSiteBlocks: (body: string) => string = (body) => {
  let result = body;
  // 移除设计图块：<div class="legend">...</div>（flutter 设计文档常见，内部含嵌套 .item/.img）
  const legendRe = /<div\s+class="legend"[^>]*>/g;
  let lmatch = legendRe.exec(result);
  while (lmatch) {
    let depth = 0;
    const tokenRe = /<\/?div(?:\s[^>]*)?>/g;
    tokenRe.lastIndex = lmatch.index;
    let token = tokenRe.exec(result);
    let end = -1;
    while (token) {
      if (token[0].startsWith('</div')) {
        depth -= 1;
        if (depth === 0) {
          end = token.index + token[0].length;
          break;
        }
      } else {
        depth += 1;
      }
      token = tokenRe.exec(result);
    }
    if (end === -1) break;
    result = result.slice(0, lmatch.index) + result.slice(end);
    legendRe.lastIndex = lmatch.index;
    lmatch = legendRe.exec(result);
  }
  // 再移除站点专用说明块（渲染框架支持情况 / 版本提示 / Tips / 预览链接等）
  return removeSiteBlocks(result);
};

/**
 * 将站点专用的 `<td-code-block>` 代码块转换为标准 Markdown 代码块。
 * 匹配 flutter 文档中 `panel="Dart"` 的代码块结构：
 *   <td-code-block panel="Dart"><pre slot="Dart" lang="javascript">...</pre></td-code-block>
 * 提取代码内容并输出为 ```dart 代码块。
 *
 * 这是平台无关的通用 transformer，供各仓库按需注入。
 */
export function convertTdCodeBlock(body: string): string {
  // 匹配 <td-code-block panel="...">...</td-code-block>，提取内部 <pre> 内容
  return body.replace(/<td-code-block\b[^>]*>([\s\S]*?)<\/td-code-block>/g, (_match, inner: string) => {
    // 提取 <pre> 内的代码内容（可能有 <pre slot="Dart" lang="javascript"> 属性）
    const preMatch = inner.match(/<pre\b[^>]*>([\s\S]*?)<\/pre>/);
    if (preMatch) {
      const code = preMatch[1].replace(/^\n+/, '').replace(/\s+$/, '');
      return `\`\`\`dart\n${code}\n\`\`\``;
    }
    return inner;
  });
}

/**
 * 将正文中的 ATX 标题统一降一级（`##` -> `###`），跳过代码围栏内的行。
 * 用于 llms-full.txt 聚合场景：组件标题占 `##`，正文标题需要整体下移一级。
 */
export function demoteHeadings(body: string): string {
  let inFence = false;
  return body
    .split('\n')
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (!inFence && /^#{1,5}\s/.test(line)) {
        return `#${line}`;
      }
      return line;
    })
    .join('\n');
}

/**
 * 移除站点专用 coverages-badge 徽章块。
 * 匹配 flutter 文档开头常见的 <span class="coverages-badge">...</span> 装饰块。
 */
export function stripCoverageBadges(body: string): string {
  return body.replace(/<span\s+class="coverages-badge"[^>]*>[\s\S]*?<\/span>/g, '');
}
