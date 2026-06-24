import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../../..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');

describe('captcha common component assets', () => {
  it('registers the web captcha style package entry', () => {
    expect(existsSync(resolve(root, 'style/web/components/captcha/_index.less'))).toBe(true);
    expect(existsSync(resolve(root, 'style/web/components/captcha/_var.less'))).toBe(true);
    expect(existsSync(resolve(root, 'style/web/components/captcha/_mixin.less'))).toBe(true);
    expect(read('style/web/components/_index.less')).toContain("@import './captcha/_index.less';");
  });

  it('registers the mobile captcha style package entry', () => {
    expect(existsSync(resolve(root, 'style/mobile/components/captcha/_index.less'))).toBe(true);
    expect(existsSync(resolve(root, 'style/mobile/components/captcha/_var.less'))).toBe(true);
    expect(existsSync(resolve(root, 'style/mobile/components/captcha/_mixin.less'))).toBe(true);
    expect(read('style/mobile/components/_index.less')).toContain("@import './captcha/_index.less';");
  });

  it('adds captcha to web docs and overview pages', () => {
    expect(existsSync(resolve(root, 'docs/web/api/captcha.md'))).toBe(true);
    expect(existsSync(resolve(root, 'docs/web/api/captcha.en-US.md'))).toBe(true);
  });

  it('adds captcha to mobile docs and overview pages', () => {
    expect(existsSync(resolve(root, 'docs/mobile/api/captcha.md'))).toBe(true);
    expect(existsSync(resolve(root, 'docs/mobile/api/captcha.en-US.md'))).toBe(true);
    expect(existsSync(resolve(root, 'docs/mobile/design/captcha.md'))).toBe(true);
  });

  it('aligns captcha docs with the component page tabs and overview asset convention', () => {
    const api = read('docs/web/api/captcha.md');
    const design = read('docs/web/design/captcha.md');
    const apiEn = read('docs/web/api/captcha.en-US.md');
    const designEn = read('docs/web/design/captcha.en-US.md');

    expect(api).toContain('isComponent: true');
    expect(api).toContain('spline: form');
    expect(api).toContain('{{ base }}');
    expect(api).toContain('{{ customImage }}');
    expect(api).toContain('{{ status }}');
    expect(api).toContain('{{ refresh }}');
    expect(api).toContain('{{ serverVerify }}');
    expect(apiEn).toContain('isComponent: true');
    expect(apiEn).toContain('spline: form');

    expect(design).toContain('### 何时使用');
    expect(design).toContain('### 常见用法');
    expect(design).toContain('### 推荐/慎用示例');
    expect(design).toContain('## 相似组件');
    expect(designEn).toContain('### When to use');
    expect(designEn).toContain('### Common usage');
    expect(designEn).toContain('### Recommended and discouraged usage');
    expect(designEn).toContain('## Similar components');
  });

  it('aligns mobile captcha docs with the mobile component page convention', () => {
    const api = read('docs/mobile/api/captcha.md');
    const design = read('docs/mobile/design/captcha.md');
    const apiEn = read('docs/mobile/api/captcha.en-US.md');

    expect(api).toContain('isComponent: true');
    expect(api).toContain('spline: form');
    expect(api).toContain('{{ base }}');
    expect(api).toContain('{{ customImage }}');
    expect(api).toContain('{{ status }}');
    expect(api).toContain('{{ refresh }}');
    expect(api).toContain('{{ serverVerify }}');
    expect(apiEn).toContain('isComponent: true');
    expect(apiEn).toContain('spline: form');

    expect(design).toContain('### 何时使用');
    expect(design).toContain('### 常见用法');
    expect(design).toContain('### 推荐/慎用示例');
    expect(design).toContain('### 相似组件');
  });

  it('does not add captcha overview entries before official thumbnails are available', () => {
    expect(read('docs/web/overview.md')).not.toContain('doc-captcha');
    expect(read('docs/web/overview.en-US.md')).not.toContain('doc-captcha');
    expect(read('docs/mobile/overview.md')).not.toContain('doc-captcha');
    expect(read('docs/mobile/overview.en-US.md')).not.toContain('doc-captcha');
  });

  it('exposes captcha component name and default locale text', () => {
    expect(read('js/components.ts')).toContain("captcha: ['Captcha']");
    expect(read('js/components.ts')).toMatch(/MOBILE_COMPONENT_MAP[\s\S]*captcha: \['Captcha'\]/);
    expect(read('js/global-config/locale/zh_CN.ts')).toContain('captcha: {');
    expect(read('js/global-config/locale/zh_CN.ts')).toContain("slideTipText: '拖动滑块完成拼图'");
    expect(read('js/global-config/locale/en_US.ts')).toContain("slideTipText: 'Slide to complete the puzzle'");
    expect(read('js/global-config/mobile/locale/zh_CN.ts')).toContain('captcha: {');
    expect(read('js/global-config/mobile/locale/zh_CN.ts')).toContain("slideTipText: '拖动滑块完成拼图'");
    expect(read('js/global-config/mobile/locale/en_US.ts')).toContain("slideTipText: 'Slide to complete the puzzle'");
  });

  it('styles real draggable puzzle image assets instead of drawing a fake CSS piece', () => {
    const style = read('style/web/components/captcha/_index.less');
    expect(style).toContain('--td-captcha-piece-image');
    expect(style).toContain('--td-captcha-piece-width');
    expect(style).toContain('--td-captcha-piece-height');
    expect(style).toContain('&__piece > img');
    expect(style).toContain('&__piece > canvas');
    expect(style).toContain('&__piece--strip');
    expect(style).toContain('box-shadow: none');
    expect(style).not.toContain('.captcha-puzzle-piece-shape');
    expect(style).not.toContain('background-position: var(--td-captcha-piece-bg-position');
  });

  it('separates the puzzle target position from the draggable piece position', () => {
    const style = read('style/web/components/captcha/_index.less');
    expect(style).toContain('--td-captcha-target-left');
    expect(style).toContain('--td-captcha-target-top');
  });

  it('keeps the mobile captcha style touch-friendly and driven by real puzzle assets', () => {
    const style = read('style/mobile/components/captcha/_index.less');
    expect(style).toContain('--td-captcha-piece-image');
    expect(style).toContain('--td-captcha-piece-width');
    expect(style).toContain('--td-captcha-piece-height');
    expect(style).toContain('&__piece > img');
    expect(style).toContain('&__piece > canvas');
    expect(style).toContain('&__piece--strip');
    expect(style).toContain('touch-action: none');
    expect(style).toContain('width: @captcha-width');
    expect(style).toContain('max-width: @captcha-max-width');
    expect(style).not.toContain('.captcha-puzzle-piece-shape');
  });

  it('keeps the mobile captcha visual treatment compact and touch-first', () => {
    const style = read('style/mobile/components/captcha/_index.less');
    const vars = read('style/mobile/components/captcha/_var.less');

    expect(style).toContain('max-width: @captcha-max-width');
    expect(style).toContain('user-select: none');
    expect(style).toContain('justify-content: flex-end');
    expect(style).toContain('box-shadow: none');
    expect(vars).toContain('@captcha-shadow: none');
    expect(vars).toContain('@captcha-slider-height: 44px');
    expect(vars).toContain('@captcha-handle-size: 44px');
    expect(vars).toContain('@captcha-handle-bg-color: @bg-color-container');
    expect(vars).toContain('@captcha-handle-color: @brand-color');
    expect(vars).toContain('@captcha-handle-border-radius: @radius-circle');
  });

  it('documents flexible challenge configuration as component logic rather than fixed styling', () => {
    const api = read('docs/web/api/captcha.md');
    const apiEn = read('docs/web/api/captcha.en-US.md');
    const design = read('docs/web/design/captcha.md');
    const mobileApi = read('docs/mobile/api/captcha.md');
    const mobileApiEn = read('docs/mobile/api/captcha.en-US.md');
    const mobileDesign = read('docs/mobile/design/captcha.md');

    expect(api).toContain('多个缺口');
    expect(api).toContain('误差阈值');
    expect(api).toContain('重复渲染 `.t-captcha__cutout` 和 `.t-captcha__piece`');
    expect(api).toContain('技术栈组件或服务端 challenge 数据');
    expect(apiEn).toContain('multiple cutouts');
    expect(apiEn).toContain('tolerance');
    expect(apiEn).toContain('rendering multiple `.t-captcha__cutout` and `.t-captcha__piece` nodes');
    expect(apiEn).toContain('framework component or server-side challenge data');
    expect(design).toContain('不要把缺口数量、通过误差或校验策略固化在样式层');
    expect(mobileApi).toContain('多个缺口');
    expect(mobileApi).toContain('误差阈值');
    expect(mobileApi).toContain('移动端触控');
    expect(mobileApiEn).toContain('multiple cutouts');
    expect(mobileApiEn).toContain('tolerance');
    expect(mobileApiEn).toContain('touch');
    expect(mobileDesign).toContain('不要把缺口数量、通过误差或校验策略固化在样式层');
  });
});
