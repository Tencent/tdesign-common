/** 普通数相关方法 */
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import {
  compareNumber,
  formatENumber,
  largeNumberToFixed,
  isInputNumber,
  largeNumberAdd,
  largeNumberSubtract,
} from './large-number';
import log from '../log';

export * from './large-number';

export type NumberType = number | string;

// 小于最大值，才允许继续添加
export function canAddNumber(
  num: NumberType,
  max: NumberType,
  largeNumber = false
): boolean {
  if (!num && num !== 0) return true;
  if (largeNumber && isString(num)) {
    return compareNumber(num, max, largeNumber) < 0;
  }
  return num < max;
}

// 大于最小值，才允许继续减少
export function canReduceNumber(
  num: NumberType,
  min: NumberType,
  largeNumber = false
): boolean {
  if (!num && num !== 0) return true;
  if (largeNumber && isString(num)) {
    return compareNumber(num, min, largeNumber) > 0;
  }
  return num > min;
}

/**
 * 格式化数字，如：2e3 转换为 2000
 * 如果不是数字，则不允许输入
 * decimalPlaces 小数点处理
 */
export function formatToNumber(
  num: string,
  extra?: {
    decimalPlaces?: number;
    largeNumber?: boolean;
  }
): string | number {
  if (num === undefined || num === null || num === '') return num;
  if (num === '-') return 0;
  if (num[num.length - 1] === '.') {
    return extra?.largeNumber ? num.slice(0, -1) : Number(num.slice(0, -1));
  }
  const isLargeNumber = extra?.largeNumber && isString(num);
  let newNumber: string | number = num;
  if ((isString(num) && num.includes('e')) || isNumber(num)) {
    newNumber = isLargeNumber ? formatENumber(num) : Number(num);
  }
  if (extra?.decimalPlaces !== undefined) {
    newNumber = largeNumberToFixed(
      newNumber,
      extra.decimalPlaces,
      extra.largeNumber
    );
  }
  const val = isLargeNumber || extra?.decimalPlaces !== undefined
    ? newNumber
    : Number(newNumber);
  if (String(val) === 'NaN') return undefined;
  return val;
}

/**
 * 将数字控制在 max 和 min 之间
 */
export function putInRangeNumber(
  val: NumberType,
  params: {
    max?: NumberType;
    min?: NumberType;
    lastValue?: NumberType;
    largeNumber?: boolean;
  }
) {
  if (val === '') return undefined;
  const { max, min, lastValue, largeNumber } = params;
  if (!isInputNumber(val)) return lastValue;
  if (largeNumber && (isString(max) || max === Infinity) && (isString(min) || min === -Infinity)) {
    if (compareNumber(max, val, largeNumber) < 0) return max;
    if (compareNumber(min, val, largeNumber) > 0) return min;
    return val;
  }
  return Math.max(Number(min), Math.min(Number(max), Number(val)));
}

/**
 * 仅支持正数，小数加法精度处理，小数部分和整数部分分开处理
 */
export function positiveAdd(num1: number, num2: number): number {
  if (!num1 || !num2) return (num1 || 0) + (num2 || 0);
  const r1 = num1.toString().split('.')[1]?.length || 0;
  const r2 = num2.toString().split('.')[1]?.length || 0;
  // 整数不存在精度问题，直接返回
  if (!r1 || !r2) return num1 + num2;
  let newNumber1 = num1;
  let newNumber2 = num2;
  const diff = Math.abs(r1 - r2);
  const digit = 10 ** Math.max(r1, r2);
  if (diff > 0) {
    const cm = 10 ** diff;
    if (r1 > r2) {
      newNumber1 = Number(num1.toString().replace('.', ''));
      newNumber2 = Number(num2.toString().replace('.', '')) * cm;
    } else {
      newNumber1 = Number(num1.toString().replace('.', '')) * cm;
      newNumber2 = Number(num2.toString().replace('.', ''));
    }
  } else {
    newNumber1 = Number(num1.toString().replace('.', ''));
    newNumber2 = Number(num2.toString().replace('.', ''));
  }
  return (newNumber1 + newNumber2) / digit;
}

/**
 * 正数，小数减法精度处理，小数部分和整数部分分开处理
 */
export function positiveSubtract(num1: number, num2: number): number {
  if (!num1 || !num2) return (num1 || 0) - (num2 || 0);
  const r1 = num1.toString().split('.')[1]?.length || 0;
  const r2 = num2.toString().split('.')[1]?.length || 0;
  const digit = 10 ** Math.max(r1, r2);
  const n = r1 >= r2 ? r1 : r2;
  return Number(((num1 * digit - num2 * digit) / digit).toFixed(n));
}

/**
 * 支持正数、负数、小数等全部数字的加法
 * -0.766 + 1       =>   1 - 0.766
 * -1 + (-0.766)    =>   - (1 + 0.766)
 * 1 + (-0.766)     =>   1 - 0.766
 * 1 + 0.766        =>   1 + 0.766
 */
export function add(num1: number, num2: number): number {
  if (num1 < 0 && num2 > 0) return positiveSubtract(num2, Math.abs(num1));
  if (num1 < 0 && num2 < 0) return positiveAdd(Math.abs(num1), Math.abs(num2)) * -1;
  if (num1 > 0 && num2 < 0) return positiveSubtract(num1, Math.abs(num2));
  return positiveAdd(num1, num2);
}

/**
 * 支持正数、负数、小数等全部数字的减法
 * -0.766 - 1       =>   - (1 + 0.766)
 * -1 - (-0.766)    =>   0.766 - 1
 * 1 - (-0.766)     =>   1 + 0.766
 * 1 - 0.766        =>   1 - 0.766
 */
export function subtract(num1: number, num2: number): number {
  if (num1 < 0 && num2 > 0) return positiveAdd(Math.abs(num1), num2) * -1;
  if (num1 < 0 && num2 < 0) return positiveSubtract(Math.abs(num2), Math.abs(num1));
  if (num1 > 0 && num2 < 0) return positiveAdd(num1, Math.abs(num2));
  return positiveSubtract(num1, num2);
}

export function getStepValue(p: {
  op: 'add' | 'reduce';
  step: NumberType;
  max?: NumberType;
  min?: NumberType;
  lastValue?: NumberType;
  largeNumber?: boolean;
}) {
  const { op, step, lastValue, max, min, largeNumber } = p;
  if (step <= 0) {
    log.error('InputNumber', 'step must be larger than 0.');
    return lastValue;
  }
  const tStep = isNumber(step) ? String(step) : step;
  let newVal;
  if (op === 'add') {
    if (largeNumber && isString(lastValue)) {
      newVal = largeNumberAdd(String(lastValue), String(tStep));
    } else {
      newVal = add(Number(lastValue || 0), Number(step));
    }
  } else if (op === 'reduce') {
    if (largeNumber && isString(lastValue)) {
      newVal = largeNumberSubtract(String(lastValue), String(tStep));
    } else {
      newVal = subtract(Number(lastValue || 0), Number(step));
    }
  }
  if (lastValue === undefined) {
    newVal = putInRangeNumber(newVal, { max, min, lastValue, largeNumber });
  }
  return largeNumber ? newVal : Number(newVal);
}

export type InputNumberErrorType =
  | 'exceed-maximum'
  | 'below-minimum'
  | undefined;

/**
 * 最大值和最小值校验
 */
export function getMaxOrMinValidateResult(p: {
  largeNumber: boolean;
  value: NumberType;
  max: NumberType;
  min: NumberType;
}): InputNumberErrorType {
  const { largeNumber, value, max, min } = p;
  if (largeNumber === undefined) return undefined;
  if (largeNumber && isNumber(value)) {
    log.warn('InputNumber', 'largeNumber value must be a string.');
  }
  let error: InputNumberErrorType;
  if (compareNumber(value, max, largeNumber) > 0) {
    error = 'exceed-maximum';
  } else if (compareNumber(value, min, largeNumber) < 0) {
    error = 'below-minimum';
  } else {
    error = undefined;
  }
  return error;
}

export const specialCode = ['-', '.', 'e', 'E'];

/**
 * 是否允许输入当前字符，输入字符校验
 */
export function canInputNumber(number: string, largeNumber: boolean) {
  if (!number && typeof number === 'string') return true;
  const isNumber = (largeNumber && isInputNumber(number)) || !Number.isNaN(Number(number));
  if (!isNumber && !['-', '.', 'e', 'E'].includes(number.slice(-1))) return false;
  // 只能出现一个点（.） 和 一个负号（-）
  if (String(number).match(/\./g)?.length > 1) return false;
  if (String(number).match(/-/g)?.length > 1) return false;
  return true;
}
