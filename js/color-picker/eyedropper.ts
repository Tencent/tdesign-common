/**
 * 浏览器原生吸色能力（EyeDropper API）封装
 * https://developer.mozilla.org/zh-CN/docs/Web/API/EyeDropper
 *
 * EyeDropper API 目前仅在 Chromium 内核浏览器（Chrome 95+、Edge 95+）可用，
 * 因此对外提供能力探测方法 `isEyedropperSupported`，组件需先探测再决定是否渲染吸色按钮。
 */

/** EyeDropper 吸色结果 */
export interface EyeDropperResult {
  sRGBHex: string;
}

/** EyeDropper.open 的可选参数 */
export interface EyeDropperOpenOptions {
  signal?: AbortSignal;
}

/** EyeDropper 实例接口 */
export interface EyeDropper {
  open: (options?: EyeDropperOpenOptions) => Promise<EyeDropperResult>;
}

/** EyeDropper 构造函数 */
export interface EyeDropperConstructor {
  new (): EyeDropper;
}

/**
 * 获取全局的 EyeDropper 构造函数
 * 通过 globalThis 读取，兼容浏览器、Web Worker 与 Node 测试环境，
 * 同时避免与 lib.dom 内置类型声明产生冲突。
 * 仅当 `globalThis.EyeDropper` 为函数时才返回，避免非构造器值导致 `new` 抛出通用 TypeError。
 */
const getEyeDropperConstructor = (): EyeDropperConstructor | undefined => {
  // globalThis 在 ES2020+ 环境恒存在；对 IE11 等旧环境做兜底，避免 ReferenceError
  if (typeof globalThis === 'undefined') {
    return undefined;
  }
  const { EyeDropper } = globalThis as unknown as { EyeDropper?: unknown };
  return typeof EyeDropper === 'function' ? (EyeDropper as EyeDropperConstructor) : undefined;
};

/**
 * 判断当前环境是否支持吸色（EyeDropper API）
 * @returns
 */
export const isEyedropperSupported = (): boolean => getEyeDropperConstructor() !== undefined;

/**
 * 调用浏览器原生吸色能力，返回吸取到的颜色。
 *
 * reject 语义：不支持环境抛出 Error（"当前浏览器不支持吸色能力（EyeDropper API）"）；
 * 其余 reject 来自原生 EyeDropper（如用户取消、已有吸色会话进行中），原样透传，由调用方区分。
 * @param signal 可选的 AbortSignal，用于取消吸色
 * @returns sRGBHex 颜色字符串，例如 "#1a2b3c"
 */
export const openEyedropper = async (signal?: AbortSignal): Promise<string> => {
  const EyeDropperConstructor = getEyeDropperConstructor();
  if (!EyeDropperConstructor) {
    throw new Error('当前浏览器不支持吸色能力（EyeDropper API）');
  }
  const eyeDropper = new EyeDropperConstructor();
  const { sRGBHex } = await eyeDropper.open(signal ? { signal } : undefined);
  return sRGBHex;
};
