import { compareLargeNumber } from '../../../js/input-number/index';

/**
 * 仅支持正整数
 */
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

  it('4241234, 41234534', () => {
    expect(compareLargeNumber('4241234', '41234534')).toBe(-1);
  });
});
