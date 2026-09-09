import type { FrontmatterResult } from './types';

/**
 * 拆分 title：'Button 按钮' -> { title: 'Button', subtitle: '按钮' }
 */
export function splitTitle(title: string): { title: string; subtitle: string } {
  const trimmed = (title || '').trim();
  const match = trimmed.match(/^(.+?)\s+(.+)$/);
  if (match) return { title: match[1].trim(), subtitle: match[2].trim() };
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
    const converted = [...inner.matchAll(/<div\b[^>]*>([\s\S]*?)<\/div>/g)]
      .map((m) =>
        m[1]
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
