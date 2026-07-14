import { describe, it, expect } from 'vitest';
import { extractTimeFormat, formatTime } from '../../../js/date-picker/format';

describe('utils', () => {
  describe(' extractTimeFormat', () => {
    it('YYYY-MM-DD HH:mm:ss', () => {
      const res = extractTimeFormat('YYYY-MM-DD HH:mm:ss');
      expect(res).toBe('HH:mm:ss');
    });

    it('YYYY-MM-DD HH时mm分ss秒', () => {
      const res = extractTimeFormat('YYYY-MM-DD HH时mm分ss秒');
      expect(res).toBe('HH时mm分ss秒');
    });

    it('YYYY-MM-DD HH时mm分ss秒SSS毫秒', () => {
      const res = extractTimeFormat('YYYY-MM-DD HH时mm分ss秒SSS毫秒');
      expect(res).toBe('HH时mm分ss秒SSS毫秒');
    });
  });
  describe('formatTime', () => {
    it('valid date time value, return time value of datetime', () => {
      const res = formatTime('2025-08-26 10:24:24', 'YYYY-MM-DD HH:mm:ss', 'HH:mm:ss');
      expect(res).toBe('10:24:24');
    });

    it('valid date time value, format and defaultTime, return time value of datetime', () => {
      const res = formatTime('2025-08-26 10:24:24', 'YYYY-MM-DD HH:mm:ss', 'HH:mm:ss', '00:00:00');
      expect(res).toBe('10:24:24');
    });

    it('valid array type date time value and format, return time value of datetime', () => {
      const res = formatTime(['2025-08-26 10:24:24', '2025-08-26 10:24:24'], 'YYYY-MM-DD HH:mm:ss', 'HH:mm:ss', [
        '00:00:00',
        '23:59:59',
      ]);
      expect(res).toEqual(['10:24:24', '10:24:24']);
    });

    it('invalid date time value and defaultTime, return defaultTime', () => {
      const res = formatTime('2025-08-26', 'YYYY-MM-DD HH:mm:ss', 'HH:mm:ss', '00:00:00');
      expect(res).toBe('00:00:00');
    });

    it('invalid array type date time value, return time value of datetime', () => {
      const res = formatTime(['2025-08-26', '2025-08-26'], 'YYYY-MM-DD HH:mm:ss', 'HH:mm:ss', ['00:00:00', '23:59:59']);
      expect(res).toEqual(['00:00:00', '23:59:59']);
    });
  });
});
