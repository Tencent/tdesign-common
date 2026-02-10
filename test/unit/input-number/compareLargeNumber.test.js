import { describe, it, expect, vi } from 'vitest';
import {
  compareNumber,
  compareLargeNumber,
  isInputNumber,
  formatENumber,
  removeInvalidZero,
} from '../../../js/input-number/large-number';

describe('compareNumber', () => {
  it('number 2, string 2', () => {
    expect(compareNumber('2', 2)).toBe(0);
  });
  it('string 1234567891234567890, string 1234567891234567891', () => {
    expect(compareNumber('1234567891234567890', '1234567891234567891')).toBe(-1);
  });

  it('string 1234567891234567890, number 1234567891234567891', () => {
    expect(compareNumber('1234567891234567890', 1234567891234567891)).toBe(-1);
  });

  it('number 1234567891234567891, string 1234567891234567890', () => {
    expect(compareNumber(1234567891234567891, '1234567891234567890')).toBe(1);
  });

  it('number 1234567891234567891, string 1234567891234567890', () => {
    expect(compareNumber(1234567891234567891, '1234567891234567890')).toBe(1);
  });

  it('Infinity, 1234567891234567890', () => {
    expect(compareNumber(Infinity, '1234567891234567890')).toBe(1);
  });

  it('Infinity, Infinity', () => {
    expect(compareNumber(Infinity, Infinity)).toBe(0);
  });

  it('-Infinity, -1234567891234567890', () => {
    expect(compareNumber(-Infinity, -1234567891234567890)).toBe(-1);
  });
});

describe('compareLargeNumber', () => {
  it('0.1, 0.2', () => {
    expect(compareLargeNumber('0.1', '0.2')).toBe(-1);
  });

  it('0.2, 0.1', () => {
    expect(compareLargeNumber('0.2', '0.1')).toBe(1);
  });

  it('0.8, 0.80000', () => {
    expect(compareLargeNumber('0.8', '0.80000')).toBe(0);
  });

  it('0.88888888, 0.111', () => {
    expect(compareLargeNumber('0.88888888', '0.111')).toBe(1);
  });

  it('1, 2', () => {
    expect(compareLargeNumber('1', '2')).toBe(-1);
  });

  it('001, 1', () => {
    expect(compareLargeNumber('001', '1')).toBe(0);
  });

  it('0.01, 1', () => {
    expect(compareLargeNumber('0.01', '1')).toBe(-1);
  });

  it('00, 0', () => {
    expect(compareLargeNumber('00', '0')).toBe(0);
  });

  it('0, 0', () => {
    expect(compareLargeNumber('0', '0')).toBe(0);
  });

  it('2134, 888', () => {
    expect(compareLargeNumber('2134', '888')).toBe(1);
  });

  it('2.134, 88.8', () => {
    expect(compareLargeNumber('2.134', '88.8')).toBe(-1);
  });

  it('-2, -1', () => {
    expect(compareLargeNumber('-2', '-1')).toBe(-1);
  });

  it('-1, -2', () => {
    expect(compareLargeNumber('-1', '-2')).toBe(1);
  });

  it('-2, -2', () => {
    expect(compareLargeNumber('-2', '-2')).toBe(0);
  });

  it('4241234, 41234534', () => {
    expect(compareLargeNumber('4241234', '41234534')).toBe(-1);
  });
});

describe('isInputNumber', () => {
  it('0', () => {
    expect(isInputNumber('0')).toBe(true);
  });

  it('4241234', () => {
    expect(isInputNumber('4241234')).toBe(true);
  });

  it('2e3 is equal 15', () => {
    expect(isInputNumber('2e3')).toBe(true);
  });

  it('-100', () => {
    expect(isInputNumber('-100')).toBe(true);
  });

  it('-100.41234', () => {
    expect(isInputNumber('-100.41234')).toBe(true);
  });

  it('-100.41dweqd234', () => {
    expect(isInputNumber('-100.412dqwed34')).toBe(false);
  });
});

describe('formatENumber', () => {
  it('2e3', () => {
    expect(formatENumber('2e3')).toBe('2000');
  });

  it('999992e3', () => {
    expect(formatENumber('999992e3')).toBe('999992000');
  });

  it('0.2e3', () => {
    expect(formatENumber('0.2e3')).toBe('200');
  });

  it('0.1234e1', () => {
    expect(formatENumber('0.1234e1')).toBe('1.234');
  });

  it('0.123e3', () => {
    expect(formatENumber('0.123e3')).toBe('123');
  });

  it('0.8975527383412673418', () => {
    expect(formatENumber('0.8975527383412673418')).toBe('0.8975527383412673418');
  });
});

describe('removeInvalidZero', () => {
  it('应该返回 0', () => {
    expect(removeInvalidZero('0')).toBe('0');
  });

  it('应该去除前导零', () => {
    expect(removeInvalidZero('001')).toBe('1');
    expect(removeInvalidZero('00012')).toBe('12');
    expect(removeInvalidZero('000100')).toBe('100');
  });

  it('decimal=true 时应该去除末尾零', () => {
    expect(removeInvalidZero('100', true)).toBe('1');
    expect(removeInvalidZero('1200', true)).toBe('12');
    expect(removeInvalidZero('123000', true)).toBe('123');
  });

  it('decimal=false 时应该去除前导零', () => {
    expect(removeInvalidZero('100', false)).toBe('100');
    expect(removeInvalidZero('1200', false)).toBe('1200');
  });

  it('num 为 0 且 decimal 为 true 时应该返回空字符串', () => {
    expect(removeInvalidZero('0', true)).toBe('');
  });

  it('空字符串应该返回空字符串', () => {
    expect(removeInvalidZero('', true)).toBe('');
  });

  it('包含小数点时应该记录错误并返回原值', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(removeInvalidZero('12.34')).toBe('12.34');
    expect(removeInvalidZero('0.123', true)).toBe('0.123');
    spy.mockRestore();
  });
});
