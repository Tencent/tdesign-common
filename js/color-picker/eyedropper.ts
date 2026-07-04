/**
 * ColorPicker Eyedropper (吸色器) 功能模块
 *
 * 使用浏览器原生 EyeDropper API 实现屏幕取色功能
 * 参考: https://developer.mozilla.org/zh-CN/docs/Web/API/EyeDropper
 */

/**
 * EyeDropper 回调函数类型
 */
export type EyeDropperCallback = (colorString: string) => void;

/**
 * EyeDropper 选项
 */
export interface EyeDropperOptions {
  /** 取色完成回调 */
  onSuccess?: EyeDropperCallback;
  /** 取色取消回调 */
  onCancel?: () => void;
  /** 发生错误回调 */
  onError?: (error: Error) => void;
}

/**
 * 检测浏览器是否支持 EyeDropper API
 *
 * @returns {boolean} 是否支持
 *
 * @example
 * ```ts
 * if (isEyeDropperSupported()) {
 *   // 可以使用吸色功能
 * }
 * ```
 */
export const isEyeDropperSupported = (): boolean => {
  return typeof window !== 'undefined' && 'EyeDropper' in window;
};

/**
 * 执行吸色操作
 *
 * @param options - 配置选项
 * @returns {Promise<string | null>} 返回选中的颜色值（hex 格式），用户取消则返回 null
 *
 * @example
 * ```ts
 * const color = await openEyeDropper({
 *   onSuccess: (color) => console.log('选中颜色:', color),
 *   onCancel: () => console.log('用户取消'),
 * });
 * ```
 */
export const openEyeDropper = async (options: EyeDropperOptions = {}): Promise<string | null> => {
  const { onSuccess, onCancel, onError } = options;

  // 检查是否支持 EyeDropper API
  if (!isEyeDropperSupported()) {
    const error = new Error('当前浏览器不支持 EyeDropper API。请使用 Chrome 95+、Edge 95+ 或更高版本浏览器。');
    onError?.(error);
    throw error;
  }

  try {
    // 创建 EyeDropper 实例
    const eyeDropper = new (window as any).EyeDropper();

    // 打开取色器并等待结果
    const result: { sRGBHex: string } = await eyeDropper.open();

    // 获取颜色值（返回 #RRGGBB 格式）
    const colorString = result?.sRGBHex;

    if (colorString) {
      try {
        onSuccess?.(colorString);
      } catch (callbackError) {
        // 回调函数的异常不应该影响取色结果
        console.warn('[Eyedropper] onSuccess 回调执行出错:', callbackError);
      }
      return colorString;
    }

    // 用户取消操作
    onCancel?.();
    return null;
  } catch (error: any) {
    // 用户按下 Escape 取消操作时，会抛出 AbortError
    if (error.name === 'AbortError') {
      onCancel?.();
      return null;
    }

    // 其他错误
    onError?.(error);
    throw error;
  }
};

/**
 * 创建可复用的 EyeDropper 实例管理器
 *
 * 用于需要多次调用吸色功能的场景，避免重复创建实例
 *
 * @example
 * ```ts
 * const dropper = createEyeDropperManager({
 *   onSuccess: (color) => updateColor(color),
 * });
 *
 * button.onclick = () => dropper.pick();
 * ```
 */
export const createEyeDropperManager = (options: EyeDropperOptions = {}) => {
  let isActive = false;

  return {
    /**
     * 是否正在取色中
     */
    get isActive(): boolean {
      return isActive;
    },

    /**
     * 开始取色
     */
    pick: async (): Promise<string | null> => {
      if (isActive) {
        return null;
      }

      isActive = true;
      try {
        const result = await openEyeDropper(options);
        return result;
      } finally {
        isActive = false;
      }
    },

    /**
     * 更新配置选项
     */
    updateOptions: (newOptions: Partial<EyeDropperOptions>) => {
      Object.assign(options, newOptions);
    },
  };
};

/**
 * EyeDropper API 类型声明
 */
declare global {
  interface Window {
    EyeDropper: new () => {
      open: () => Promise<{ sRGBHex: string }>;
    };
  }
}

export default openEyeDropper;
