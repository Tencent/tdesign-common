export function omit(obj: object, fields: string[]): object {
  const shallowCopy = {
    ...obj,
  };
  for (let i = 0; i < fields.length; i++) {
    const key = fields[i];
    delete shallowCopy[key];
  }
  return shallowCopy;
}

export function removeEmptyAttrs<T>(obj: T): Partial<T> {
  const newObj = {};

  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] !== 'undefined' || obj[key] === null) {
      newObj[key] = obj[key];
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
  if (typeof color === 'string') {
    return color;
  }
  if (Array.isArray(color)) {
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
    const tempArr = keys.map((key: any) => `${rest[key]} ${key}`);
    return `linear-gradient(${direction}, ${tempArr.join(',')})`;
  }
  return `linear-gradient(${direction}, ${from}, ${to})`;
}

/**
 *
 * @returns 获取 ie 浏览器版本
 */
export function getIEVersion() {
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
 * 计算字符串字符的长度并可以截取字符串。
 * @param str 传入字符串
 * @param maxCharacter 规定最大字符串长度
 * @returns 当没有传入maxCharacter时返回字符串字符长度，当传入maxCharacter时返回截取之后的字符串和长度。
 */
export function getCharacterLength(str: string, maxCharacter?: number) {
  const hasMaxCharacter = typeof maxCharacter === 'number';
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
    if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
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
  return typeof param === 'number' ? `${param}px` : param;
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
