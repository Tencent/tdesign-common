import { isString, isNull, isUndefined, isNumber, isArray } from 'lodash-es';

export function omit(obj: Record<string, any>, fields: string[]) {
  const shallowCopy = {
    ...obj,
  };
  for (let i = 0; i < fields.length; i++) {
    const key = fields[i];
    delete shallowCopy[key];
  }
  return shallowCopy;
}

export function getValidAttrs<T extends Record<string, any>>(obj: T): Partial<T> {
  const newObj: Partial<T> = {};

  Object.keys(obj).forEach((key) => {
    if (!isUndefined(obj[key]) || isNull(obj[key])) {
      newObj[key as keyof T] = obj[key];
    }
  });

  return newObj;
}

export function removeEmptyAttrs<T extends Record<string, any>>(obj: T): Partial<T> {
  const newObj: Partial<T> = {};

  Object.keys(obj).forEach((key) => {
    if (!isUndefined(obj[key]) || isNull(obj[key])) {
      newObj[key as keyof T] = obj[key];
    }
  });

  return newObj;
}

export function getTabElementByValue(tabs: [] = [], value: string): object {
  const [result] = tabs.filter((item) => {
    const { id } = item as any;
    return id === value;
  });
  return result || null;
}

export function firstUpperCase(str: string): string {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (char: string) => char.toUpperCase());
}

export type Gradients = { [percent: string]: string };
export type FromTo = { from: string; to: string };
export type LinearGradient = { direction?: string } & (Gradients | FromTo);
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
  const {
    from, to, direction = 'to right', ...rest
  } = color;
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
 *
 * @returns 获取 ie 浏览器版本
 */
export function getIEVersion() {
  if (typeof navigator === 'undefined' || !navigator) return Number.MAX_SAFE_INTEGER;

  const { userAgent } = navigator;
  // 判断是否IE<11浏览器
  const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1;
  // 判断是否IE11浏览器
  const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
  if (isIE) {
    const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
    const match = userAgent.match(reIE);
    if (!match) return -1;
    const fIEVersion = parseFloat(match[1]);
    return fIEVersion < 7 ? 6 : fIEVersion;
  }
  if (isIE11) {
    // IE11
    return 11;
  }
  // 不是ie浏览器
  return Number.MAX_SAFE_INTEGER;
}

/**
 * Safari Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15
 * FireFox Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/114.0
 * Chrome Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36
 * Chrome 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.3
 * 搜狗 Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36 SE 2.X MetaSr 1.
 * 360 Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6045.9 Safari/537.36 QIHU 360EE
 */
export function getFlexGapPolyFill() {
  if (typeof navigator === 'undefined' || !navigator) return false;
  const ua = navigator.userAgent;
  const chromeMatch = ua.match(/AppleWebKit.+Chrome\/(.+) Safari\/.+/i);
  if (Number(chromeMatch?.[1]?.split('.')[0]) < 100) return true;
  const safariMatch = ua.match(/AppleWebKit.+Version\/(.+) Safari\/.+/i);
  if (Number(safariMatch?.[1]?.split('.')[0]) < 12) return true;
  const ieVersion = getIEVersion();
  if (ieVersion <= 11) return true;
  const fireFoxMatch = ua.match(/Firefox\/(.+)/i);
  if (Number(fireFoxMatch?.[1]?.split('.')[0]) < 100) return true;
  return false;
}

/**
 * 计算字符串字符的长度并可以截取字符串。
 * @param str 传入字符串
 * @param maxCharacter 规定最大字符串长度
 * @returns 当没有传入maxCharacter时返回字符串字符长度，当传入maxCharacter时返回截取之后的字符串和长度。
 */
export function getCharacterLength(str: string): number;
export function getCharacterLength(str: string, maxCharacter?: number): { length: number; characters: string }
export function getCharacterLength(str: string, maxCharacter?: number) {
  const hasMaxCharacter = isNumber(maxCharacter);
  if (!str || str.length === 0) {
    if (hasMaxCharacter) {
      return {
        length: 0,
        characters: str,
      };
    }
    return 0;
  }
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    let currentStringLength = 0;
    if (str.charCodeAt(i) > 127) {
      currentStringLength = 2;
    } else {
      currentStringLength = 1;
    }
    if (hasMaxCharacter && len + currentStringLength > maxCharacter) {
      return {
        length: len,
        characters: str.slice(0, i),
      };
    }
    len += currentStringLength;
  }
  if (hasMaxCharacter) {
    return {
      length: len,
      characters: str,
    };
  }
  return len;
}

/**
 * 返回 Unicode 字符长度
 * '👨'.length === 2
 * getUnicodeLength('👨') === 1
 * @param str
 * @returns {number}
 */
export function getUnicodeLength(str?: string): number {
  return [...(str ?? '')].length;
}

/**
 * 修正 Unicode 最大字符长度
 * '👨👨👨'.slice(0, 2) === '👨'
 * limitUnicodeMaxLength('👨👨👨', 2) === '👨👨'
 * @param str
 * @param maxLength
 * @param oldStr
 * @returns {string}
 */
export function limitUnicodeMaxLength(
  str?: string,
  maxLength?: number,
  oldStr?: string
): string {
  // 旧字符满足字数要求则返回
  if ([...(oldStr ?? '')].slice().length === maxLength) return oldStr || '';
  return [...(str ?? '')].slice(0, maxLength).join('');
}

/**
 * 兼容样式中支持number/string类型的传值 得出最后的结果。
 * @param param number或string类型的可用于样式上的值
 * @returns 可使用的样式值。
 */
export function pxCompat(param: string | number) {
  return isNumber(param) ? `${param}px` : param;
}

/**
 * 计算dom元素盒模型尺寸
 * @param targetElement 需要计算盒模型尺寸的元素
 * @returns 计算出各维度尺寸。
 */
const DOM_STYLE_PROPS = [
  'padding-top',
  'padding-bottom',
  'padding-left',
  'padding-right',
  'font-family',
  'font-weight',
  'font-size',
  'font-variant',
  'text-rendering',
  'text-transform',
  'width',
  'text-indent',
  'border-width',
  'box-sizing',
  'line-height',
  'letter-spacing',
];

export function calculateNodeSize(targetElement: HTMLElement) {
  if (typeof window === 'undefined') {
    return {
      paddingSize: 0,
      borderSize: 0,
      boxSizing: 0,
      sizingStyle: '',
    };
  }

  const style = window.getComputedStyle(targetElement);

  const boxSizing = style.getPropertyValue('box-sizing')
    || style.getPropertyValue('-moz-box-sizing')
    || style.getPropertyValue('-webkit-box-sizing');

  const paddingSize = (
    parseFloat(style.getPropertyValue('padding-bottom'))
    + parseFloat(style.getPropertyValue('padding-top'))
  );

  const borderSize = (
    parseFloat(style.getPropertyValue('border-bottom-width'))
    + parseFloat(style.getPropertyValue('border-top-width'))
  );

  const sizingStyle = DOM_STYLE_PROPS
    .map((name) => `${name}:${style.getPropertyValue(name)}`)
    .join(';');

  return {
    paddingSize, borderSize, boxSizing, sizingStyle,
  };
}
