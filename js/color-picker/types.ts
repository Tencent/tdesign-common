import { ALPHA_FORMAT_MAP, FORMATS } from './constants';

/**
 * 非透明色类型
 */
export type BasicColorFormat = typeof FORMATS[number];

/**
 * 支持转为透明格式的非透明色类型
 */
export type AlphaConvertibleFormat = keyof typeof ALPHA_FORMAT_MAP;

/**
 * 透明色类型
 */
export type AlphaColorFormat = typeof ALPHA_FORMAT_MAP[AlphaConvertibleFormat];

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
