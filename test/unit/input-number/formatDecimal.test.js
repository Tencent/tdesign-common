import { formatDecimal, decimalPlacesToFixedNum } from '../../../js/input-number/large-number';

describe('formatDecimal', () => {
  it('1, 0, true', () => {
    expect(formatDecimal(1, 0, true)).toBe('1');
  });

  it('1, 0, false', () => {
    expect(formatDecimal(1, 0, false)).toBe('1');
  });

  it('1.5, 0, true', () => {
    expect(formatDecimal(1.5, 0, true)).toBe('2');
  });

  it('1.5, 0, false', () => {
    expect(formatDecimal(1.5, 0, false)).toBe('1');
  });

  it('1.3456, 2, true', () => {
    expect(formatDecimal(1.3456, 2, true)).toBe('1.35');
  });

  it('1.3456, 2, false', () => {
    expect(formatDecimal(1.3456, 2, false)).toBe('1.34');
  });

  it('1.3, 2, false', () => {
    expect(formatDecimal(1.3, 2, false)).toBe('1.30');
  });
});

describe('decimalPlacesToFixedNum', () => {
  it('1.3456, 2, true', () => {
    expect(decimalPlacesToFixedNum(1.3456, 2)).toBe('1.35');
  });

  it('1.3456, 2, false', () => {
    expect(decimalPlacesToFixedNum(1.3456, { places: 2, enableRound: false })).toBe('1.34');
  });
});
