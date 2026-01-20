import { isString, isArray, isNumber } from 'lodash-es';

export type Gradients = { [percent: string]: string };
export type FromTo = { from: string; to: string };
export type LinearGradient = { direction?: string } & (Gradients | FromTo);

/**
 * 获取背景色
 */
export function getBackgroundColor(color: string | string[] | LinearGradient): string {
  if (isString(color)) {
    return color;
  }
  if (isArray(color)) {
    if (color[0] && color[0][0] === '#') {
      color.unshift('90deg');
    }
    return `linear-gradient( ${color.join(',')} )`;
  }
  const { from, to, direction = 'to right', ...rest } = color;
  let keys = Object.keys(rest);
  if (keys.length) {
    keys = keys.sort((a, b) => {
      const c = parseFloat(a.substr(0, a.length - 1)) - parseFloat(b.substr(0, b.length - 1));
      return c;
    });
    const tempArr = keys.map((key: any) => `${rest[key as keyof typeof rest]} ${key}`);
    return `linear-gradient(${direction}, ${tempArr.join(',')})`;
  }
  return `linear-gradient(${direction}, ${from}, ${to})`;
}

/**
 * 兼容样式中支持 number/string 类型的传值
 */
export function pxCompat(param: string | number): string {
  return isNumber(param) ? `${param}px` : param;
}
