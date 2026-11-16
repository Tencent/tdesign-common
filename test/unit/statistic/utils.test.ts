import { describe, expect, it } from 'vitest';
import { getFormatValue } from '../../../js/statistic/utils';

// Statistic 的 value 没有默认值，不传时是 undefined，
// 直接调用 toLocaleString 会抛 TypeError 导致组件渲染崩溃（issue #3952）
describe('statistic getFormatValue', () => {
  it('returns an empty string when value is undefined', () => {
    expect(getFormatValue(undefined, 0, ',')).toBe('');
  });

  it('returns an empty string when value is null', () => {
    expect(getFormatValue(null as any, 0, ',')).toBe('');
  });

  it('formats a number with the separator', () => {
    expect(getFormatValue(1234567, 0, ',')).toBe('1,234,567');
  });

  it('respects decimalPlaces', () => {
    expect(getFormatValue(1.5, 2, ',')).toBe('1.50');
  });
});
