/**
 * EyeDropper API 封装，提供吸色功能支持
 *
 * 规范参考：https://developer.mozilla.org/zh-CN/docs/Web/API/EyeDropper
 */

declare class EyeDropper {
  open(options?: { signal?: AbortSignal }): Promise<{ sRGBHex: string }>;
}

declare global {
  interface Window {
    EyeDropper?: typeof EyeDropper;
  }
}

/**
 * 检测当前浏览器是否支持 EyeDropper API
 */
export const isEyeDropperSupported = (): boolean => typeof window !== 'undefined' && 'EyeDropper' in window;

/**
 * 打开吸色工具，让用户从屏幕上取色
 * @returns 返回选中颜色的十六进制字符串（如 `#rrggbb`），用户取消或不支持时返回 null
 */
export const openEyeDropper = async (): Promise<string | null> => {
  if (!isEyeDropperSupported()) return null;
  try {
    const eyeDropper = new window.EyeDropper!();
    const result = await eyeDropper.open();
    return result.sRGBHex;
  } catch {
    // 用户取消（AbortError）或其他异常均返回 null
    return null;
  }
};
