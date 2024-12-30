import { describe, it, expect } from 'vitest';
import { largeNumberToFixed } from '../../../js/input-number/large-number';

/**
 * 仅支持正整数
 */
describe('largeNumberToFixed', () => {
  it('0', () => {
    expect(largeNumberToFixed('0')).toBe('0');
  });

  it('0.5', () => {
    expect(largeNumberToFixed('0.5')).toBe('1');
  });

  it('0.555', () => {
    expect(largeNumberToFixed('0.555', 2)).toBe('0.56');
  });

  it('0.999', () => {
    expect(largeNumberToFixed('0.999')).toBe('1');
  });

  it('12', () => {
    expect(largeNumberToFixed('12')).toBe('12');
  });

  it('12.999', () => {
    expect(largeNumberToFixed('12.999')).toBe('13');
  });

  it('12.566', () => {
    expect(largeNumberToFixed('12.566')).toBe('13');
  });

  it('12.566', () => {
    expect(largeNumberToFixed('12.566', 1)).toBe('12.6');
  });

  it('12', () => {
    expect(largeNumberToFixed('12', 1)).toBe('12.0');
  });

  it('12', () => {
    expect(largeNumberToFixed('12', 5)).toBe('12.00000');
  });

  it('12.1234', () => {
    expect(largeNumberToFixed('12.1234', 2)).toBe('12.12');
  });

  it('12.1567', () => {
    expect(largeNumberToFixed('12.1567', 2)).toBe('12.16');
  });

  it('20000000000000001.0', () => {
    expect(largeNumberToFixed('20000000000000001.0', 2, true)).toBe('20000000000000001.00');
  });

  it('1.087', () => {
    expect(largeNumberToFixed('1.087', 2, true)).toBe('1.09');
  });

  it('1.0095', () => {
    expect(largeNumberToFixed('1.0095', 3, true)).toBe('1.010');
  });

  it('0.996', () => {
    expect(largeNumberToFixed('0.996', 2, true)).toBe('1.00');
  });
  it('1.985', () => {
    expect(largeNumberToFixed('1.985', 2, true)).toBe('1.99');
    expect(largeNumberToFixed('1.985', 3, true)).toBe('1.985');
  });
  it('1.99', () => {
    expect(largeNumberToFixed('1.99', 1, true)).toBe('2.0');
  });
  it('{ enableRound: boolean; places: number; }', () => {
    expect(largeNumberToFixed('1', { places: 0, enableRound: false })).toBe('1');
    expect(largeNumberToFixed('1', { places: 0 })).toBe('1');
    expect(largeNumberToFixed('1', { places: 0, enableRound: false }, false)).toBe('1');
    expect(largeNumberToFixed('1', { places: 0 }, false)).toBe('1');
    expect(largeNumberToFixed('1.3456', { places: 1, enableRound: false })).toBe('1.3');
    expect(largeNumberToFixed('1.3456', { places: 2, enableRound: false })).toBe('1.34');
    expect(largeNumberToFixed('1.3456', { places: 1 })).toBe('1.3');
    expect(largeNumberToFixed('1.3456', { places: 2 })).toBe('1.35');
  });
});
