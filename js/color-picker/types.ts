import { ALPHA_FORMAT_MAP, FORMATS } from './constants';

/**
 * 非透明色类型
 */
export type BasicColorFormat = (typeof FORMATS)[number];

/**
 * 支持转为透明格式的非透明色类型
 */
export type AlphaConvertibleFormat = keyof typeof ALPHA_FORMAT_MAP;

/**
 * 透明色类型
 */
export type AlphaColorFormat = (typeof ALPHA_FORMAT_MAP)[AlphaConvertibleFormat];

/**
 * 完整的颜色格式类型
 */
export type ColorFormat = BasicColorFormat | AlphaColorFormat;

/**
 * 不同颜色格式对应的输入框配置
 */
export interface ColorInputProp {
  key: string;
  min?: number;
  max?: number;
  type: 'input' | 'inputNumber';
  flex?: number;
  format?: Function;
}

declare global {
  interface Window {
    /**
     * 浏览器原生取色器（EyeDropper API）
     *
     * Chromium 95+ 支持，
     * Safari、Firefox 目前暂未完全支持。
     */
    EyeDropper?: new () => {
      /**
       * 打开系统取色器
       *
       * @param options 打开配置
       * @returns 用户选中的颜色结果
       */
      open(options?: EyeDropperOpenOptions): Promise<EyeDropperOpenResult>;
    };
  }
}

/**
 * EyeDropper 返回结果
 */
export interface EyeDropperOpenResult {
  /**
   * 选中的颜色（sRGB Hex 格式）
   * 例如：#409EFF
   */
  sRGBHex: string;
}

/**
 * EyeDropper 打开配置
 */
export interface EyeDropperOpenOptions {
  /**
   * 用于主动取消取色操作
   */
  signal?: AbortSignal;
}
