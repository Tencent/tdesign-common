import { describe, it, expect } from 'vitest';
import { getPickerCols } from '../../../js/time-picker/utils';

describe('utils', () => {
  describe(' getPickerCols', () => {
    it('h', () => {
      const res = getPickerCols('h');
      expect(res.length).toBe(1);
      expect(res[0]).toBe('hour');
    });

    it('m', () => {
      const res = getPickerCols('m');
      expect(res.length).toBe(1);
      expect(res[0]).toBe('minute');
    });

    it('s', () => {
      const res = getPickerCols('s');
      expect(res.length).toBe(1);
      expect(res[0]).toBe('second');
    });

    it('S', () => {
      const res = getPickerCols('s');
      expect(res.length).toBe(1);
      expect(res[0]).toBe('second');
    });

    it('hh', () => {
      const res = getPickerCols('hh');
      expect(res.length).toBe(1);
      expect(res[0]).toBe('hour');
    });

    it('HH', () => {
      const res = getPickerCols('HH');
      expect(res.length).toBe(1);
      expect(res[0]).toBe('hour');
    });
    it('hh:mm', () => {
      const res = getPickerCols('hh:mm');
      expect(res.length).toBe(2);
      expect(res[0]).toBe('hour');
      expect(res[1]).toBe('minute');
    });

    it('HH:mm', () => {
      const res = getPickerCols('HH:mm');
      expect(res.length).toBe(2);
      expect(res[0]).toBe('hour');
      expect(res[1]).toBe('minute');
    });

    it('HH时mm分', () => {
      const res = getPickerCols('HH时mm分');
      expect(res.length).toBe(2);
      expect(res[0]).toBe('hour');
      expect(res[1]).toBe('minute');
    });

    it('hh:mm', () => {
      const res = getPickerCols('hh:mm:ss');
      expect(res.length).toBe(3);
      expect(res[0]).toBe('hour');
      expect(res[1]).toBe('minute');
      expect(res[2]).toBe('second');
    });

    it('HH时mm分ss秒SSS毫秒', () => {
      const res = getPickerCols('HH时mm分ss秒SSS毫秒');
      expect(res.length).toBe(4);
      expect(res[0]).toBe('hour');
      expect(res[1]).toBe('minute');
      expect(res[2]).toBe('second');
      expect(res[3]).toBe('millisecond');
    });
  });
});
