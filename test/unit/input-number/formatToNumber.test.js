import { formatToNumber } from '../../../js/input-number/number';

describe('decimalPlaces', () => {
  it('decimalPlaces=0', () => {
    expect(formatToNumber('3.1415926', {
      decimalPlaces: 0
    })).toBe('3');
  });

  it('decimalPlaces=1', () => {
    expect(formatToNumber('3.1415926', {
      decimalPlaces: 1
    })).toBe('3.1');
  });

  it('decimalPlaces=4', () => {
    expect(formatToNumber('3.1415926', {
      decimalPlaces: 4
    })).toBe('3.1416');
  });
});
