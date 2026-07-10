// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';

import { isEyeDropperSupported, openEyeDropper } from '../../../js/color-picker/eyedropper';

/**
 * 以指定的 open 实现 stub 全局 EyeDropper 构造器，返回其 mock 以便断言调用参数
 */
const stubEyeDropper = (impl: (options?: { signal?: AbortSignal }) => Promise<{ sRGBHex: string }>) => {
  const openMock = vi.fn(impl);
  vi.stubGlobal(
    'EyeDropper',
    class {
      open = openMock;
    }
  );
  return openMock;
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('isEyeDropperSupported', () => {
  it('returns false in environments without EyeDropper (SSR / old browsers)', () => {
    expect(isEyeDropperSupported()).toBe(false);
  });

  it('returns false when the EyeDropper global is not a constructor', () => {
    vi.stubGlobal('EyeDropper', {});
    expect(isEyeDropperSupported()).toBe(false);
  });

  it('returns true when EyeDropper is available', () => {
    stubEyeDropper(() => Promise.resolve({ sRGBHex: '#000000' }));
    expect(isEyeDropperSupported()).toBe(true);
  });
});

describe('openEyeDropper', () => {
  it('returns null when the API is unavailable', async () => {
    expect(await openEyeDropper()).toBeNull();
  });

  it('returns the picked color normalized to lowercase hex', async () => {
    // 规范未强制 sRGBHex 的大小写，这里用大写验证归一化
    stubEyeDropper(() => Promise.resolve({ sRGBHex: '#FF6600' }));
    expect(await openEyeDropper()).toBe('#ff6600');
  });

  it('passes the AbortSignal through to the native open()', async () => {
    const openMock = stubEyeDropper(() => Promise.resolve({ sRGBHex: '#123456' }));
    const controller = new AbortController();
    await openEyeDropper({ signal: controller.signal });
    expect(openMock).toHaveBeenCalledWith({ signal: controller.signal });
  });

  it('calls open() without options when no signal is provided', async () => {
    const openMock = stubEyeDropper(() => Promise.resolve({ sRGBHex: '#123456' }));
    await openEyeDropper();
    expect(openMock).toHaveBeenCalledWith(undefined);
  });

  it('returns null when the user cancels picking (AbortError)', async () => {
    stubEyeDropper(() => Promise.reject(new DOMException('The user canceled the selection.', 'AbortError')));
    expect(await openEyeDropper()).toBeNull();
  });

  it('returns null on unexpected native errors', async () => {
    stubEyeDropper(() => Promise.reject(new Error('unexpected')));
    expect(await openEyeDropper()).toBeNull();
  });
});
