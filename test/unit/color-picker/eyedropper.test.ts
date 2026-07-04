/**
 * ColorPicker Eyedropper (吸色器) 单元测试
 *
 * 测试基于浏览器原生 EyeDropper API 的吸色功能
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isEyeDropperSupported, openEyeDropper, createEyeDropperManager } from '../../../js/color-picker/eyedropper';

// ========== Mock EyeDropper API ==========
const mockOpen = vi.fn();

class MockEyeDropper {
  open = mockOpen;
}

describe('ColorPicker Eyedropper', () => {
  // 在 Node.js 环境（vitest）中模拟 window 对象
  beforeEach(() => {
    vi.clearAllMocks();
    mockOpen.mockReset();

    // 确保 window 对象存在（兼容 Node.js 测试环境）
    if (typeof window === 'undefined') {
      // @ts-ignore - 为测试环境提供 window
      global.window = {};
    }
  });

  afterEach(() => {
    // 清理 window 上的 EyeDropper
    if (typeof window !== 'undefined' && 'EyeDropper' in (window as any)) {
      delete (window as any).EyeDropper;
    }
  });

  // ========== isEyeDropperSupported() 测试 ==========

  describe('isEyeDropperSupported()', () => {
    it('当浏览器支持 EyeDropper API 时应返回 true', () => {
      (window as any).EyeDropper = MockEyeDropper;

      expect(isEyeDropperSupported()).toBe(true);
    });

    it('当浏览器不支持 EyeDropper API 时应返回 false', () => {
      // 确保 window 上没有 EyeDropper
      if ('EyeDropper' in (window as any)) {
        delete (window as any).EyeDropper;
      }

      expect(isEyeDropperSupported()).toBe(false);
    });

    it('在非浏览器环境（无 window）时应返回 false', () => {
      const originalWindow = global.window;
      // @ts-ignore - 故意移除 window 进行测试
      delete global.window;

      expect(isEyeDropperSupported()).toBe(false);

      global.window = originalWindow;
    });
  });

  // ========== openEyeDropper() 测试 ==========

  describe('openEyeDropper()', () => {
    beforeEach(() => {
      (window as any).EyeDropper = MockEyeDropper;
    });

    it('成功取色时应返回颜色值并调用 onSuccess 回调', async () => {
      const expectedColor = '#ff5722';
      mockOpen.mockResolvedValueOnce({ sRGBHex: expectedColor });

      const onSuccess = vi.fn();
      const onCancel = vi.fn();

      const result = await openEyeDropper({ onSuccess, onCancel });

      expect(result).toBe(expectedColor);
      expect(onSuccess).toHaveBeenCalledWith(expectedColor);
      expect(onCancel).not.toHaveBeenCalled();
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    it('用户取消操作（AbortError）时应返回 null 并调用 onCancel', async () => {
      const abortError = new Error('用户取消');
      abortError.name = 'AbortError';
      mockOpen.mockRejectedValueOnce(abortError);

      const onSuccess = vi.fn();
      const onCancel = vi.fn();

      const result = await openEyeDropper({ onSuccess, onCancel });

      expect(result).toBeNull();
      expect(onSuccess).not.toHaveBeenCalled();
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('浏览器不支持时应抛出错误并调用 onError', async () => {
      delete (window as any).EyeDropper;

      const onError = vi.fn();

      await expect(openEyeDropper({ onError })).rejects.toThrow('当前浏览器不支持 EyeDropper API');

      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });

    it('其他类型错误应抛出并调用 onError', async () => {
      const error = new Error('未知错误');
      mockOpen.mockRejectedValueOnce(error);

      const onError = vi.fn();

      await expect(openEyeDropper({ onError })).rejects.toThrow('未知错误');

      expect(onError).toHaveBeenCalledWith(error);
    });

    it('不传回调函数时也应正常工作', async () => {
      mockOpen.mockResolvedValueOnce({ sRGBHex: '#0052d9' });

      const result = await openEyeDropper();

      expect(result).toBe('#0052d9');
    });

    it('返回结果为空时应调用 onCancel', async () => {
      mockOpen.mockResolvedValueOnce({ sRGBHex: '' });

      const onSuccess = vi.fn();
      const onCancel = vi.fn();

      const result = await openEyeDropper({ onSuccess, onCancel });

      expect(result).toBeNull();
      expect(onSuccess).not.toHaveBeenCalled();
      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  // ========== createEyeDropperManager() 测试 ==========

  describe('createEyeDropperManager()', () => {
    beforeEach(() => {
      (window as any).EyeDropper = MockEyeDropper;
    });

    it('应创建一个管理器实例并包含正确的方法', () => {
      const manager = createEyeDropperManager();

      expect(manager).toHaveProperty('isActive');
      expect(manager).toHaveProperty('pick');
      expect(manager).toHaveProperty('updateOptions');
      expect(manager.isActive).toBe(false);
    });

    it('pick() 成功后应返回颜色值', async () => {
      mockOpen.mockResolvedValueOnce({ sRGBHex: '#e74c3c' });
      const manager = createEyeDropperManager();

      const result = await manager.pick();

      expect(result).toBe('#e74c3c');
      expect(manager.isActive).toBe(false);
    });

    it('pick() 执行期间 isActive 应为 true', async () => {
      let resolvePromise: (value: any) => void;
      mockOpen.mockReturnValueOnce(
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
      );

      const manager = createEyeDropperManager();
      const pickPromise = manager.pick();

      // 在 pick 执行过程中，isActive 应为 true
      expect(manager.isActive).toBe(true);

      // 完成异步操作
      resolvePromise!({ sRGBHex: '#3498db' });
      await pickPromise;

      // 完成后 isActive 应为 false
      expect(manager.isActive).toBe(false);
    });

    it('正在执行时再次调用 pick() 应返回 null', async () => {
      let resolvePromise: (value: any) => void;
      mockOpen.mockReturnValueOnce(
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
      );

      const manager = createEyeDropperManager();
      const firstPick = manager.pick();

      // 第一次 pick 还在执行中，第二次应该返回 null
      const secondResult = await manager.pick();
      expect(secondResult).toBeNull();

      // 完成第一次 pick
      resolvePromise!({ sRGBHex: '#9b59b6' });
      await firstPick;
    });

    it('updateOptions() 应更新配置选项', async () => {
      const onSuccess1 = vi.fn();
      const onSuccess2 = vi.fn();

      const manager = createEyeDropperManager({ onSuccess: onSuccess1 });

      // 更新选项
      manager.updateOptions({ onSuccess: onSuccess2 });

      mockOpen.mockResolvedValueOnce({ sRGBHex: '#1abc9c' });
      await manager.pick();

      // 应该使用更新后的回调
      expect(onSuccess1).not.toHaveBeenCalled();
      expect(onSuccess2).toHaveBeenCalledWith('#1abc9c');
    });

    it('pick() 取消操作后 isActive 应重置为 false', async () => {
      const abortError = new Error('Abort');
      abortError.name = 'AbortError';
      mockOpen.mockRejectedValueOnce(abortError);

      const manager = createEyeDropperManager();
      const result = await manager.pick();

      expect(result).toBeNull();
      expect(manager.isActive).toBe(false);
    });
  });

  // ========== 边界情况测试 ==========

  describe('边界情况处理', () => {
    it('多次快速调用 openEyeDropper 应各自独立', async () => {
      (window as any).EyeDropper = MockEyeDropper;

      mockOpen
        .mockResolvedValueOnce({ sRGBHex: '#red' })
        .mockResolvedValueOnce({ sRGBHex: '#blue' })
        .mockResolvedValueOnce({ sRGBHex: '#green' });

      const [result1, result2, result3] = await Promise.all([openEyeDropper(), openEyeDropper(), openEyeDropper()]);

      expect(result1).toBe('#red');
      expect(result2).toBe('#blue');
      expect(result3).toBe('#green');
      expect(mockOpen).toHaveBeenCalledTimes(3);
    });

    it('onSuccess 回调中抛出错误不应影响返回值', async () => {
      (window as any).EyeDropper = MockEyeDropper;
      mockOpen.mockResolvedValueOnce({ sRGBHex: '#f39c12' });

      const throwingCallback = vi.fn(() => {
        throw new Error('回调中的错误');
      });

      // 回调抛出错误不应该影响 Promise 结果
      const result = await openEyeDropper({
        onSuccess: throwingCallback,
      });

      expect(result).toBe('#f39c12');
      expect(throwingCallback).toThrow();
    });
  });
});
