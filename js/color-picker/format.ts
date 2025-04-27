import Color from './color';
import { ALPHA_FORMAT_MAP, COLOR_FORMAT_INPUTS, FORMATS } from './constants';
import type { AlphaConvertibleFormat, BasicColorFormat, ColorFormat } from './types';

/**
 * 兜底处理用户传入的格式，例如：
 * - 传入 `RGB`， 但 `enableAlpha` ，则返回 `RGBA`
 */
export const initColorFormat = (format: ColorFormat, enableAlpha: boolean) => {
  if (enableAlpha && format in ALPHA_FORMAT_MAP) {
    return format in ALPHA_FORMAT_MAP ? ALPHA_FORMAT_MAP[format as AlphaConvertibleFormat] : format;
  }
  return format as BasicColorFormat;
};

/**
 * 获取不同格式的输入输出值
 * - encode：将字符串转换为单独的颜色值，例如 `{r: 255, g: 255, b: 255}`
 * - decode：获取完整的颜色字符串，例如 `rgb(255, 255, 255)`
 */
export const getColorFormatMap = (color: Color, type: 'encode' | 'decode') => {
  if (type === 'encode') {
    return {
      HSV: color.getHsva(),
      HSVA: color.getHsva(),
      HSL: color.getHsla(),
      HSLA: color.getHsla(),
      RGB: color.getRgba(),
      RGBA: color.getRgba(),
      CMYK: color.getCmyk(),
      CSS: {
        css: color.css,
      },
      HEX: {
        hex: color.hex,
      },
      HEX8: {
        hex: color.hex8, // 为了减少转换 hex8 的 key 也对应 hex
      },
    };
  }

  // decode
  return color.getFormatsColorMap();
};

/**
 * 获取下拉框的格式选项
 */
export const getColorFormatOptions = (enableAlpha: boolean) => (
  enableAlpha
    ? FORMATS.map((item) => (item in ALPHA_FORMAT_MAP ? ALPHA_FORMAT_MAP[item as AlphaConvertibleFormat] : item))
    : FORMATS
);

/**
 * 获取当前格式的输入框配置
 */
export const getColorFormatInputs = (
  format: ColorFormat = 'RGB',
  enableAlpha: boolean
) => {
  let finalFormat;

  /* 为了减少 `ALPHA_FORMAT_MAP` 中的重复代码
     `RGBA/HEX8/HSLA/HSVA` 会被转换为 `RGB/HEX/HSL/HSV` 后再匹配
     但在下一步会 push 一个代表透明度的输入框 */
  if (enableAlpha) {
    finalFormat = Object.keys(ALPHA_FORMAT_MAP).find(
      (key) => key in ALPHA_FORMAT_MAP && ALPHA_FORMAT_MAP[key as AlphaConvertibleFormat] === format
    ) || format;
  } else {
    finalFormat = format;
  }

  if (!COLOR_FORMAT_INPUTS[finalFormat as BasicColorFormat]) return [];

  const configs = [
    ...(COLOR_FORMAT_INPUTS[finalFormat as BasicColorFormat]),
  ];

  // CMYK 格式不支持透明度
  if (enableAlpha && format !== 'CMYK') {
    configs.push({
      type: 'inputNumber',
      key: 'a',
      min: 0,
      max: 100,
      format: (value: number) => `${value}%`,
      flex: 1.15,
    });
  }

  return configs;
};
