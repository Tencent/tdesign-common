import type { Color } from './color';

/**
 * EyeDropper API 状态
 */
export type EyeDropperStatus = 'not-supported' | 'supported' | 'opened' | 'closed';

/**
 * EyeDropper API 结果
 */
export interface EyeDropperResult {
  sRGBHex: string;
}

/**
 * EyeDropper API 选项
 */
export interface EyeDropperOption {
  signal?: AbortSignal;
}

/**
 * EyeDropper API 接口定义
 */
export interface EyeDropper {
  open(options?: EyeDropperOption): Promise<EyeDropperResult>;
  [Symbol.toStringTag]: 'EyeDropper';
}

/**
 * 检查浏览器是否支持 EyeDropper API
 */
export const isEyeDropperSupported = (): boolean => {
  return typeof window !== 'undefined' && 'EyeDropper' in window;
};

/**
 * 检查浏览器是否支持 input[type="color"] 元素
 */
export const isNativeColorPickerSupported = (): boolean => {
  if (typeof document === 'undefined') return false;
  const input = document.createElement('input');
  input.type = 'color';
  return input.type === 'color';
};

/**
 * NativeColorPicker 类 - 封装原生 color input 元素
 */
export class NativeColorPicker {
  private input: HTMLInputElement | null = null;
  private onChangeCallback: ((color: string) => void) | null = null;
  private onCloseCallback: (() => void) | null = null;

  constructor() {
    if (typeof document === 'undefined') {
      return;
    }
    this.input = document.createElement('input');
    this.input.type = 'color';
    this.input.style.position = 'fixed';
    this.input.style.left = '-9999px';
    this.input.style.top = '-9999px';
    this.input.style.opacity = '0';
    this.input.style.pointerEvents = 'none';
    document.body.appendChild(this.input);

    this.input.addEventListener('input', this.handleInput.bind(this));
    this.input.addEventListener('change', this.handleChange.bind(this));
  }

  /**
   * 处理 input 事件（实时选择时触发）
   */
  private handleInput = (e: Event): void => {
    const target = e.target as HTMLInputElement;
    if (this.onChangeCallback) {
      this.onChangeCallback(target.value);
    }
  };

  /**
   * 处理 change 事件（选择完成后触发）
   */
  private handleChange = (e: Event): void => {
    const target = e.target as HTMLInputElement;
    if (this.onCloseCallback) {
      this.onCloseCallback();
    }
    if (this.onChangeCallback) {
      this.onChangeCallback(target.value);
    }
  };

  /**
   * 打开颜色选择器
   * @param value 初始颜色值（可选）
   */
  open(value?: string): void {
    if (!this.input) return;

    if (value) {
      this.input.value = this.normalizeColorValue(value);
    }

    // 设置 focus 并触发点击来打开颜色选择器
    this.input.focus();
    this.input.click();
  }

  /**
   * 关闭颜色选择器
   */
  close(): void {
    // 原生 color input 没有 close 方法，需要通过 blur 来尝试关闭
    if (this.input) {
      this.input.blur();
    }
  }

  /**
   * 获取当前颜色值
   */
  getValue(): string {
    return this.input?.value || '#000000';
  }

  /**
   * 设置颜色值
   * @param value 颜色值
   */
  setValue(value: string): void {
    if (this.input) {
      this.input.value = this.normalizeColorValue(value);
    }
  }

  /**
   * 标准化颜色值为 7 位十六进制格式
   * @param color 颜色值
   */
  private normalizeColorValue(color: string): string {
    // 如果已经是有效的 7 位 hex 格式（#rrggbb）
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
      return color.toLowerCase();
    }

    // 尝试解析并转换颜色值
    try {
      // 创建一个临时的 canvas 来转换颜色
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#000000';
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        const computedColor = ctx.fillStyle;
        // 转换 RGB 到 HEX
        const match = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (match) {
          const r = parseInt(match[1], 10).toString(16).padStart(2, '0');
          const g = parseInt(match[2], 10).toString(16).padStart(2, '0');
          const b = parseInt(match[3], 10).toString(16).padStart(2, '0');
          return `#${r}${g}${b}`;
        }
      }
    } catch {
      // 如果转换失败，返回默认黑色
    }

    return '#000000';
  }

  /**
   * 注册颜色变化回调（实时选择时触发）
   */
  onChange(callback: (color: string) => void): void {
    this.onChangeCallback = callback;
  }

  /**
   * 注册颜色选择器关闭回调
   */
  onClose(callback: () => void): void {
    this.onCloseCallback = callback;
  }

  /**
   * 销毁实例
   */
  destroy(): void {
    if (this.input) {
      this.input.removeEventListener('input', this.handleInput);
      this.input.removeEventListener('change', this.handleChange);
      this.input.parentNode?.removeChild(this.input);
      this.input = null;
    }
    this.onChangeCallback = null;
    this.onCloseCallback = null;
  }
}

/**
 * EyeDropper API 封装类
 */
export class EyeDropperAPI {
  private eyeDropper: EyeDropper | null = null;
  private status: EyeDropperStatus = 'not-supported';

  constructor() {
    if (isEyeDropperSupported()) {
      this.status = 'supported';
      this.eyeDropper = new (window as any).EyeDropper();
    }
  }

  /**
   * 打开 EyeDropper 并返回选择的颜色
   * @param options 选项
   * @returns 选择的颜色（7位十六进制格式）
   */
  async open(options?: EyeDropperOption): Promise<string> {
    if (!this.eyeDropper) {
      throw new Error('EyeDropper API is not supported');
    }

    this.status = 'opened';
    try {
      const result = await this.eyeDropper.open(options);
      this.status = 'closed';
      return result.sRGBHex;
    } catch (error) {
      this.status = 'closed';
      // 用户取消选择时会抛出 DOMException
      throw error;
    }
  }

  /**
   * 获取当前状态
   */
  getStatus(): EyeDropperStatus {
    return this.status;
  }

  /**
   * 检查是否支持
   */
  isSupported(): boolean {
    return this.eyeDropper !== null;
  }
}

/**
 * 获取支持的取色方式
 */
export type ColorPickerMode = 'native' | 'eyedropper' | 'none';

/**
 * 获取可用的取色模式
 * 优先使用 EyeDropper API，然后是原生 color input
 */
export const getAvailableColorPickerMode = (): ColorPickerMode => {
  if (isEyeDropperSupported()) {
    return 'eyedropper';
  }
  if (isNativeColorPickerSupported()) {
    return 'native';
  }
  return 'none';
};

/**
 * 创建取色器实例
 * 根据浏览器支持情况自动选择最佳方式
 */
export const createColorPicker = (): {
  picker: NativeColorPicker | EyeDropperAPI;
  mode: ColorPickerMode;
} => {
  if (isEyeDropperSupported()) {
    return {
      picker: new EyeDropperAPI(),
      mode: 'eyedropper',
    };
  }
  if (isNativeColorPickerSupported()) {
    return {
      picker: new NativeColorPicker(),
      mode: 'native',
    };
  }
  return {
    picker: null,
    mode: 'none',
  };
};

/**
 * 便捷函数：从屏幕取色
 * @param color 初始颜色（用于 native 模式）
 * @returns 选择的颜色或 null（用户取消）
 */
export const pickColor = async (color?: string): Promise<string | null> => {
  const mode = getAvailableColorPickerMode();

  if (mode === 'none') {
    return null;
  }

  if (mode === 'eyedropper') {
    const picker = new EyeDropperAPI();
    try {
      return await picker.open();
    } catch {
      return null;
    }
  }

  // native 模式需要用户交互触发
  return new Promise((resolve) => {
    const picker = new NativeColorPicker();
    picker.setValue(color || '#000000');
    picker.onClose(() => {
      resolve(picker.getValue());
      picker.destroy();
    });
    picker.onChange((newColor) => {
      resolve(newColor);
    });
    picker.open();
  });
};

export default {
  isEyeDropperSupported,
  isNativeColorPickerSupported,
  NativeColorPicker,
  EyeDropperAPI,
  createColorPicker,
  getAvailableColorPickerMode,
  pickColor,
};
