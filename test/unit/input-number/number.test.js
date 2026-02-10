import { describe, it, expect, vi } from 'vitest';
import {
  add,
  subtract,
  formatThousandths,
  canInputNumber,
  canSetValue,
  formatUnCompleteNumber,
  canAddNumber,
  canReduceNumber,
  putInRangeNumber,
  getStepValue,
  getMaxOrMinValidateResult,
  positiveAdd,
  positiveSubtract,
} from '../../../js/input-number/number';

describe('add', () => {
  it('0.1 + 0.2', () => {
    expect(add(0.1, 0.2)).toBe(0.3);
  });

  it('0.45 + 0.12', () => {
    expect(add(0.45, 0.12)).toBe(0.57);
  });

  it('0.141423 + 0.242134', () => {
    expect(add(0.141423, 0.242134)).toBe(0.383557);
  });

  it('999.999999 + 8888.8888888', () => {
    expect(add(999.999999, 8888.8888888)).toBe(9888.8888878);
  });

  it('3 + 0.1', () => {
    expect(add(3, 0.1)).toBe(3.1);
  });

  it('-1 + 0.766', () => {
    expect(add(-1, 0.766)).toBe(-0.234);
  });

  it('-0.766 + 1', () => {
    expect(add(-0.766, 1)).toBe(0.234);
  });

  it('-1 + (-0.766)', () => {
    expect(add(-1, -0.766)).toBe(-1.766);
  });

  it('1 + 0.766', () => {
    expect(add(1, 0.766)).toBe(1.766);
  });

  it('1 + (-0.766)', () => {
    expect(add(1, -0.766)).toBe(0.234);
  });

  it('0 + (-0.766)', () => {
    expect(add(0, -0.766)).toBe(-0.766);
  });
});

describe('subtract', () => {
  it('0.1 - 0.2', () => {
    expect(subtract(0.1, 0.2)).toBe(-0.1);
  });

  it('0.3 - 0.1', () => {
    expect(subtract(0.3, 0.1)).toBe(0.2);
  });

  it('0.141423 - 0.242134', () => {
    expect(subtract(0.141423, 0.242134)).toBe(-0.100711);
  });

  it('999.999999 - 8888.8888888', () => {
    expect(subtract(999.999999, 8888.8888888)).toBe(-7888.8888898);
  });

  it('3 - 0.1', () => {
    expect(subtract(3, 0.1)).toBe(2.9);
  });

  it('1 - 0.766', () => {
    expect(subtract(1, 0.766)).toBe(0.234);
  });

  it('-1 - 0.766', () => {
    expect(subtract(-1, 0.766)).toBe(-1.766);
  });

  it('1 - (-0.766)', () => {
    expect(subtract(1, -0.766)).toBe(1.766);
  });

  it('-1 - (-0.766)', () => {
    expect(subtract(-1, -0.766)).toBe(-0.234);
  });
});

describe('formatThousandths', () => {
  it('111,222,000', () => {
    expect(formatThousandths('111,222,000')).toBe('111222000');
  });

  it('111.,000.1', () => {
    expect(formatThousandths('111.,000.1')).toBe('111.,000.1');
  });
});

describe('canInputNumber', () => {
  it('normal number empty', () => {
    expect(canInputNumber('')).toBe(true);
    expect(canInputNumber('0')).toBe(true);
    expect(canInputNumber('00')).toBe(false);
    expect(canInputNumber(undefined)).toBe(true);
    expect(canInputNumber(null)).toBe(true);
  });

  it('normal number can only have one minus signal', () => {
    expect(canInputNumber('3o3')).toBe(false);
    expect(canInputNumber('--3')).toBe(false);
    expect(canInputNumber('-3')).toBe(true);
    expect(canInputNumber('3-')).toBe(false);
  });

  it('normal number: count of . can not be over than 1', () => {
    expect(canInputNumber('1.3')).toBe(true);
    expect(canInputNumber('-1.3')).toBe(true);
    expect(canInputNumber('1.3.')).toBe(false);
    expect(canInputNumber('.1.3')).toBe(false);
    expect(canInputNumber('.1.3.')).toBe(false);
    expect(canInputNumber('1.2e.')).toBe(false);
    expect(canInputNumber('1.2E.')).toBe(false);
  });

  it('normal number: number letters are allowed', () => {
    expect(canInputNumber('-')).toBe(true);
    expect(canInputNumber('1.3e')).toBe(true);
    expect(canInputNumber('1.22+')).toBe(false);
    expect(canInputNumber('1.22-')).toBe(false);
    expect(canInputNumber('+1.22+')).toBe(false);
    expect(canInputNumber('+1.22-')).toBe(false);
    expect(canInputNumber('-1.22+')).toBe(false);
    expect(canInputNumber('-1.22-')).toBe(false);
    expect(canInputNumber('+1.22+++')).toBe(false);
    expect(canInputNumber('1.23E')).toBe(true);
    expect(canInputNumber('1.23E+')).toBe(true);
    expect(canInputNumber('1.23E+08')).toBe(true);
    expect(canInputNumber('+1.23E+08')).toBe(true);
    expect(canInputNumber('+1.23E-08')).toBe(true);
    expect(canInputNumber('1.23E++')).toBe(false);
    expect(canInputNumber('+1.23E++')).toBe(false);
    expect(canInputNumber('+1.23E--')).toBe(false);
    expect(canInputNumber('1.23E++08')).toBe(false);
    expect(canInputNumber('1.23E-')).toBe(true);
    expect(canInputNumber('1.23E-02')).toBe(true);
    expect(canInputNumber('-1.23E+02')).toBe(true);
    expect(canInputNumber('-1.23E-02')).toBe(true);
    expect(canInputNumber('1.23E--')).toBe(false);
    expect(canInputNumber('-1.23E--')).toBe(false);
    expect(canInputNumber('-1.23E++')).toBe(false);
    expect(canInputNumber('1.23E--02')).toBe(false);
    expect(canInputNumber('2e')).toBe(true);
    expect(canInputNumber('2e3')).toBe(true);
    expect(canInputNumber('2e.')).toBe(false);
    expect(canInputNumber('1.')).toBe(true);
    expect(canInputNumber('1.2E')).toBe(true);
    expect(canInputNumber('--')).toBe(false);
    expect(canInputNumber('e')).toBe(false);
    expect(canInputNumber('ee')).toBe(false);
  });

  it('包含空格应该返回 false', () => {
    expect(canInputNumber('1 2')).toBe(false);
    expect(canInputNumber(' 12')).toBe(false);
    expect(canInputNumber('12 ')).toBe(false);
    expect(canInputNumber('1 2.3')).toBe(false);
  });

  it('e 前面没有数字应该返回 false', () => {
    expect(canInputNumber('e10')).toBe(false);
    expect(canInputNumber('E10')).toBe(false);
    expect(canInputNumber('e+10')).toBe(false);
    expect(canInputNumber('E-10')).toBe(false);
  });

  it('多个点应该返回 false', () => {
    expect(canInputNumber('1.2.3.4')).toBe(false);
  });

  it('最后一个字符既不是数字也不是特殊字符应该返回 false', () => {
    expect(canInputNumber('12a')).toBe(false);
    expect(canInputNumber('12b')).toBe(false);
    expect(canInputNumber('1.2x')).toBe(false);
  });

  it('largeNumber 模式下有效数字应该返回 true', () => {
    expect(canInputNumber('99999999999999999999', true)).toBe(true);
    expect(canInputNumber('99999999999999999999.99999999999999999999', true)).toBe(true);
  });

  it('largeNumber 模式下无效数字应该返回 false', () => {
    expect(canInputNumber('99999999999999999999a', true)).toBe(false);
  });
});

it('canSetValue', () => {
  expect(canSetValue('2', 1)).toBe(true);
  expect(canSetValue('2', 1)).toBe(true);
  expect(canSetValue('2.0', 2)).toBe(false);
  expect(canSetValue('2.00', 2)).toBe(false);
  expect(canSetValue('2.3e', 2.3)).toBe(false);
  expect(canSetValue('2.3e10', 2.3)).toBe(true);
});

describe('formatUnCompleteNumber', () => {
  it('formatUnCompleteNumber: empty number', () => {
    expect(formatUnCompleteNumber('-')).toBe(undefined);
    expect(formatUnCompleteNumber('e')).toBe(undefined);
    expect(formatUnCompleteNumber('')).toBe(undefined);
    expect(formatUnCompleteNumber(undefined)).toBe(undefined);
    expect(formatUnCompleteNumber(null)).toBe(undefined);
  });

  it('formatUnCompleteNumber: last unValid num', () => {
    expect(formatUnCompleteNumber('2.')).toBe(2);
    expect(formatUnCompleteNumber('2e')).toBe(2);
    expect(formatUnCompleteNumber('2-')).toBe(2);
    expect(formatUnCompleteNumber('2+')).toBe(2);
    expect(formatUnCompleteNumber('412784781243273894.', { largeNumber: true })).toBe('412784781243273894');
  });

  it('formatUnCompleteNumber: largeNumber formatENumber', () => {
    expect(formatUnCompleteNumber('12345e3', { largeNumber: true })).toBe('12345000');
  });

  it('formatUnCompleteNumber: decimalPlaces', () => {
    expect(formatUnCompleteNumber('123')).toBe(123);
    expect(formatUnCompleteNumber('2.1231234')).toBe(2.1231234);
    expect(formatUnCompleteNumber('2.1231234', { decimalPlaces: 2 })).toBe(2.12);
  });

  it('formatUnCompleteNumber: decimalPlaces, isToFixed', () => {
    expect(formatUnCompleteNumber('2.000', { decimalPlaces: 2 })).toBe(2);
    expect(formatUnCompleteNumber('2.000', { decimalPlaces: 2, isToFixed: true })).toBe('2.00');
  });
});

describe('canAddNumber', () => {
  it('空值应该返回 true', () => {
    expect(canAddNumber('', 10)).toBe(true);
    expect(canAddNumber(undefined, 10)).toBe(true);
    expect(canAddNumber(null, 10)).toBe(true);
  });

  it('num 为 0 时应该返回 true', () => {
    expect(canAddNumber(0, 10)).toBe(true);
  });

  it('普通数字小于 max 时应该返回 true', () => {
    expect(canAddNumber(5, 10)).toBe(true);
  });

  it('普通数字等于 max 时应该返回 false', () => {
    expect(canAddNumber(10, 10)).toBe(false);
  });

  it('普通数字大于 max 时应该返回 false', () => {
    expect(canAddNumber(15, 10)).toBe(false);
  });

  it('大数字小于 max 时应该返回 true', () => {
    expect(canAddNumber('9999999999999999999', '99999999999999999999', true)).toBe(true);
  });

  it('大数字字符串大于 max 时应该返回 false', () => {
    expect(canAddNumber('99999999999999999999', '9999999999999999999', true)).toBe(false);
  });
});

describe('canReduceNumber', () => {
  it('空值应该返回 true', () => {
    expect(canReduceNumber('', 10)).toBe(true);
    expect(canReduceNumber(undefined, 10)).toBe(true);
    expect(canReduceNumber(null, 10)).toBe(true);
  });

  it('num 为 0 且 min 也为 0 时应该返回 false', () => {
    expect(canReduceNumber(0, 0)).toBe(false);
  });

  it('num 为 0 且 min 为负数时应该返回 true', () => {
    expect(canReduceNumber(0, -10)).toBe(true);
  });

  it('普通数字大于 min 时应该返回 true', () => {
    expect(canReduceNumber(15, 10)).toBe(true);
  });

  it('普通数字等于 min 时应该返回 false', () => {
    expect(canReduceNumber(10, 10)).toBe(false);
  });

  it('普通数字小于 min 时应该返回 false', () => {
    expect(canReduceNumber(5, 10)).toBe(false);
  });

  it('大数字字符串大于 min 时应该返回 true', () => {
    expect(canReduceNumber('99999999999999999999', '9999999999999999999', true)).toBe(true);
  });

  it('大数字字符串小于 min 时应该返回 false', () => {
    expect(canReduceNumber('9999999999999999999', '99999999999999999999', true)).toBe(false);
  });
});

describe('putInRangeNumber', () => {
  it('空字符串应该返回 undefined', () => {
    expect(putInRangeNumber('', { max: 10, min: 0 })).toBeUndefined();
  });

  it('无效数字应该返回 lastValue', () => {
    expect(putInRangeNumber('abc', { max: 10, min: 0, lastValue: 5 })).toBe(5);
    expect(putInRangeNumber('12x', { max: 10, min: 0, lastValue: 5 })).toBe(5);
  });

  it('值超过 max 应该返回 max', () => {
    expect(putInRangeNumber(15, { max: 10, min: 0 })).toBe(10);
  });

  it('值低于 min 应该返回 min', () => {
    expect(putInRangeNumber(5, { max: 20, min: 10 })).toBe(10);
  });

  it('值在范围内应该返回原值', () => {
    expect(putInRangeNumber(15, { max: 20, min: 10 })).toBe(15);
  });

  it('大数字超过 max 应该返回 max', () => {
    expect(putInRangeNumber('99999999999999999999', { max: '9999999999999999999', min: '0', largeNumber: true })).toBe(
      '9999999999999999999'
    );
  });

  it('大数字低于 min 应该返回 min', () => {
    expect(
      putInRangeNumber('9999999999999999999', {
        max: '99999999999999999999',
        min: '10000000000000000000',
        largeNumber: true,
      })
    ).toBe('10000000000000000000');
  });

  it('Infinity max 应该正常工作', () => {
    expect(putInRangeNumber(15, { max: Infinity, min: 0, largeNumber: true })).toBe(15);
  });

  it('-Infinity min 应该正常工作', () => {
    expect(putInRangeNumber(-15, { max: 0, min: -Infinity, largeNumber: true })).toBe(-15);
  });

  it('大数字在范围内应该返回原值', () => {
    expect(putInRangeNumber('5000000000000000000', { max: '9999999999999999999', min: '0', largeNumber: true })).toBe(
      '5000000000000000000'
    );
  });
});

describe('getStepValue', () => {
  it('step <= 0 应该返回 lastValue 并记录错误', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(getStepValue({ op: 'add', step: 0, max: 10, min: 0, lastValue: 5 })).toBe(5);
    expect(getStepValue({ op: 'reduce', step: -1, max: 10, min: 0, lastValue: 5 })).toBe(5);
    spy.mockRestore();
  });

  it('普通数字加法', () => {
    expect(getStepValue({ op: 'add', step: 1, max: 10, min: 0, lastValue: 5 })).toBe(6);
    expect(getStepValue({ op: 'add', step: 0.1, max: 10, min: 0, lastValue: 5 })).toBe(5.1);
  });

  it('普通数字减法', () => {
    expect(getStepValue({ op: 'reduce', step: 1, max: 10, min: 0, lastValue: 5 })).toBe(4);
    expect(getStepValue({ op: 'reduce', step: 0.1, max: 10, min: 0, lastValue: 5 })).toBe(4.9);
  });

  it('大数字加法', () => {
    expect(
      getStepValue({
        op: 'add',
        step: '1',
        max: '99999999999999999999',
        min: '0',
        lastValue: '9999999999999999999',
        largeNumber: true,
      })
    ).toBe('10000000000000000000');
  });

  it('大数字减法', () => {
    expect(
      getStepValue({
        op: 'reduce',
        step: '1',
        max: '99999999999999999999',
        min: '0',
        lastValue: '10000000000000000000',
        largeNumber: true,
      })
    ).toBe('9999999999999999999');
  });

  it('字符串 step 应该转换为数字', () => {
    expect(getStepValue({ op: 'add', step: '2', max: 10, min: 0, lastValue: 5 })).toBe(7);
  });

  it('lastValue 为 undefined 时应该使用 putInRangeNumber', () => {
    expect(getStepValue({ op: 'add', step: '5', max: 10, min: 0, lastValue: 8, largeNumber: false })).toBe(13);
    expect(getStepValue({ op: 'reduce', step: '5', max: 10, min: 0, lastValue: 2, largeNumber: false })).toBe(-3);
  });

  it('lastValue 为 undefined 且不设置范围应该返回 NaN', () => {
    expect(isNaN(getStepValue({ op: 'add', step: '5', lastValue: undefined }))).toBe(true);
    expect(isNaN(getStepValue({ op: 'reduce', step: '5', lastValue: undefined }))).toBe(true);
  });
});

describe('getMaxOrMinValidateResult', () => {
  it('value 为 undefined 应该返回 undefined', () => {
    expect(getMaxOrMinValidateResult({ largeNumber: false, value: undefined, max: 10, min: 0 })).toBeUndefined();
  });

  it('largeNumber 为 undefined 应该返回 undefined', () => {
    expect(getMaxOrMinValidateResult({ largeNumber: undefined, value: 5, max: 10, min: 0 })).toBeUndefined();
  });

  it('值超过 max 应该返回 exceed-maximum', () => {
    expect(getMaxOrMinValidateResult({ largeNumber: false, value: 15, max: 10, min: 0 })).toBe('exceed-maximum');
  });

  it('值低于 min 应该返回 below-minimum', () => {
    expect(getMaxOrMinValidateResult({ largeNumber: false, value: -5, max: 10, min: 0 })).toBe('below-minimum');
  });

  it('值在范围内应该返回 undefined', () => {
    expect(getMaxOrMinValidateResult({ largeNumber: false, value: 5, max: 10, min: 0 })).toBeUndefined();
  });

  it('大数字超过 max 应该返回 exceed-maximum', () => {
    expect(
      getMaxOrMinValidateResult({
        largeNumber: true,
        value: '99999999999999999999',
        max: '9999999999999999999',
        min: '0',
      })
    ).toBe('exceed-maximum');
  });

  it('大数字低于 min 应该返回 below-minimum', () => {
    expect(
      getMaxOrMinValidateResult({
        largeNumber: true,
        value: '9999999999999999999',
        max: '99999999999999999999',
        min: '10000000000000000000',
      })
    ).toBe('below-minimum');
  });

  it('大数字在范围内应该返回 undefined', () => {
    expect(
      getMaxOrMinValidateResult({
        largeNumber: true,
        value: '5000000000000000000',
        max: '9999999999999999999',
        min: '0',
      })
    ).toBeUndefined();
  });

  it('largeNumber 为 true 但 value 为 number 应该记录警告', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(getMaxOrMinValidateResult({ largeNumber: true, value: 5, max: 10, min: 0 })).toBeUndefined();
    spy.mockRestore();
  });
});

describe('positiveAdd', () => {
  it('0 + 0 应该返回 0', () => {
    expect(positiveAdd(0, 0)).toBe(0);
  });

  it('num1 为 0 应该返回 num2', () => {
    expect(positiveAdd(0, 5)).toBe(5);
  });

  it('num2 为 0 应该返回 num1', () => {
    expect(positiveAdd(5, 0)).toBe(5);
  });

  it('整数相加应该返回正确结果', () => {
    expect(positiveAdd(1, 2)).toBe(3);
    expect(positiveAdd(10, 20)).toBe(30);
  });

  it('相同小数位相加应该返回正确结果', () => {
    expect(positiveAdd(0.1, 0.2)).toBe(0.3);
    expect(positiveAdd(0.12, 0.34)).toBe(0.46);
  });

  it('不同小数位相加应该返回正确结果', () => {
    expect(positiveAdd(0.1, 0.12)).toBe(0.22);
    expect(positiveAdd(0.123, 0.1)).toBe(0.223);
    expect(positiveAdd(1.1, 0.01)).toBe(1.11);
  });

  it('大数相加应该返回正确结果', () => {
    expect(positiveAdd(999.999, 888.888)).toBe(1888.887);
  });
});

describe('positiveSubtract', () => {
  it('0 - 0 应该返回 0', () => {
    expect(positiveSubtract(0, 0)).toBe(0);
  });

  it('num1 为 0 应该返回 -num2', () => {
    expect(positiveSubtract(0, 5)).toBe(-5);
  });

  it('num2 为 0 应该返回 num1', () => {
    expect(positiveSubtract(5, 0)).toBe(5);
  });

  it('整数相减应该返回正确结果', () => {
    expect(positiveSubtract(3, 2)).toBe(1);
    expect(positiveSubtract(20, 10)).toBe(10);
  });

  it('相同小数位相减应该返回正确结果', () => {
    expect(positiveSubtract(0.3, 0.1)).toBe(0.2);
    expect(positiveSubtract(0.46, 0.12)).toBe(0.34);
  });

  it('不同小数位相减应该返回正确结果', () => {
    expect(positiveSubtract(0.22, 0.1)).toBe(0.12);
    expect(positiveSubtract(0.223, 0.123)).toBe(0.1);
    expect(positiveSubtract(1.11, 1.1)).toBe(0.01);
  });

  it('大数相减应该返回正确结果', () => {
    expect(positiveSubtract(999.999, 888.888)).toBe(111.111);
  });
});
