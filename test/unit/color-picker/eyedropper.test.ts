import { describe, it, expect, vi, afterEach } from 'vitest';
import { isEyedropperSupported, openEyedropper } from '../../../js/color-picker/eyedropper';
import type { EyeDropper } from '../../../js/color-picker/eyedropper';

// 构造一个可被 `new` 调用、且返回带 open 方法实例的 EyeDropper 桩
const stubEyeDropper = (open: EyeDropper['open']) => {
  function MockEyeDropper() {
    return { open };
  }
  vi.stubGlobal('EyeDropper', MockEyeDropper);
};

describe('eyedropper', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('isEyedropperSupported', () => {
    it('当 EyeDropper 不存在时应返回 false', () => {
      // 测试环境默认不存在 EyeDropper
      expect(isEyedropperSupported()).toBe(false);
    });

    it('当 EyeDropper 不是函数时应返回 false', () => {
      vi.stubGlobal('EyeDropper', { open: () => {} });
      expect(isEyedropperSupported()).toBe(false);
    });

    it('当 EyeDropper 是构造函数时应返回 true', () => {
      stubEyeDropper(async () => ({ sRGBHex: '#000000' }));
      expect(isEyedropperSupported()).toBe(true);
    });
  });

  describe('openEyedropper', () => {
    it('不支持时应抛出错误', async () => {
      // 测试环境默认不支持
      await expect(openEyedropper()).rejects.toThrow();
    });

    it('支持时应返回吸取到的 sRGBHex', async () => {
      const open = vi.fn().mockResolvedValue({ sRGBHex: '#1a2b3c' });
      stubEyeDropper(open);
      await expect(openEyedropper()).resolves.toBe('#1a2b3c');
      expect(open).toHaveBeenCalledWith(undefined);
    });

    it('传入 signal 时应透传给 open', async () => {
      const open = vi.fn().mockResolvedValue({ sRGBHex: '#000000' });
      stubEyeDropper(open);
      const controller = new AbortController();
      await openEyedropper(controller.signal);
      expect(open).toHaveBeenCalledWith({ signal: controller.signal });
    });

    it('open 抛出时应向后抛出', async () => {
      const open = vi.fn().mockRejectedValue(new Error('用户取消'));
      stubEyeDropper(open);
      await expect(openEyedropper()).rejects.toThrow('用户取消');
    });
  });
});
