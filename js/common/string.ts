import { isNumber } from 'lodash-es';

/**
 * 用正则实现模板字符串功能
 */
export function template<T extends Record<string, string>>(str: string, vars: T): string {
  return str.replace(/\${(.*?)}/g, (_, prop: string) => vars[prop.trim()] ?? '');
}

/**
 * 首字母大写
 */
export function firstUpperCase(str: string): string {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (char: string) => char.toUpperCase());
}

/**
 * 计算字符串字符的长度并可以截取字符串
 */
export function getCharacterLength(str: string): number;
export function getCharacterLength(str: string, maxCharacter?: number): { length: number; characters: string };
export function getCharacterLength(str: string, maxCharacter?: number) {
  const hasMaxCharacter = isNumber(maxCharacter);
  if (!str || str.length === 0) {
    if (hasMaxCharacter) {
      return { length: 0, characters: str };
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
      return { length: len, characters: str.slice(0, i) };
    }
    len += currentStringLength;
  }
  if (hasMaxCharacter) {
    return { length: len, characters: str };
  }
  return len;
}

/**
 * 返回 Unicode 字符长度
 */
export function getUnicodeLength(str?: string): number {
  return [...(str ?? '')].length;
}

/**
 * 修正 Unicode 最大字符长度
 */
export function limitUnicodeMaxLength(str?: string, maxLength?: number, oldStr?: string): string {
  if ([...(oldStr ?? '')].slice().length === maxLength) return oldStr || '';
  return [...(str ?? '')].slice(0, maxLength).join('');
}
