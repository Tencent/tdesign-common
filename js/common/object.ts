import { isFunction, isObject, isUndefined, isNull } from 'lodash-es';

const { hasOwnProperty } = Object.prototype;

export const hasOwn = <T extends object>(val: T, key: string | symbol | number): key is keyof T =>
  hasOwnProperty.call(val, key);

export const getPropertyValFromObj = <T extends object>(
  val: T,
  key: string | symbol | number
): T[keyof T] | undefined => (hasOwn(val, key) ? val[key] : undefined);

const objectToString: typeof Object.prototype.toString = Object.prototype.toString;
const toTypeString = (value: unknown): string => objectToString.call(value);

export const isPlainObject = <T extends object>(val: unknown): val is T => toTypeString(val) === '[object Object]';

export const isPromise = <T = any>(val: unknown): val is Promise<T> =>
  (isObject(val) || isFunction(val)) && isFunction((val as any).then) && isFunction((val as any).catch);

export function omit(obj: Record<string, any>, fields: string[]) {
  const shallowCopy = { ...obj };
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
