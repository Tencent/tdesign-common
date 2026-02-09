import { describe, it, expect } from 'vitest';
import { extractTimeFormat, formatTime, parseToDayjs } from '../../../js/date-picker/format';

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

    it('YYYYMMDDHHmmss', () => {
      const res = extractTimeFormat('YYYYMMDDHHmmss');
      expect(res).toBe('HHmmss');
    });

    it('YYYY年MM月DD日HH时mm分ss秒', () => {
      const res = extractTimeFormat('YYYY年MM月DD日HH时mm分ss秒');
      expect(res).toBe('日HH时mm分ss秒');
    });

    it('YYYY/MM/DD HH:mm:ss', () => {
      const res = extractTimeFormat('YYYY/MM/DD HH:mm:ss');
      expect(res).toBe('HH:mm:ss');
    });

    it('YYYY.MM.DD HH.mm.ss', () => {
      const res = extractTimeFormat('YYYY.MM.DD HH.mm.ss');
      expect(res).toBe('HH.mm.ss');
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

    it('valid date time value with no separator format', () => {
      const res = formatTime('20250826102424', 'YYYYMMDDHHmmss', 'HHmmss');
      expect(res).toBe('102424');
    });

    it('valid array type date time value with no separator format', () => {
      const res = formatTime(['20250826102424', '20250826153059'], 'YYYYMMDDHHmmss', 'HHmmss');
      expect(res).toEqual(['102424', '153059']);
    });

    it('invalid date time value with no separator format and defaultTime', () => {
      const res = formatTime('20250826', 'YYYYMMDDHHmmss', 'HHmmss', '000000');
      expect(res).toBe('000000');
    });

    it('valid date time value with slash separator', () => {
      const res = formatTime('2025/08/26 10:24:24', 'YYYY/MM/DD HH:mm:ss', 'HH:mm:ss');
      expect(res).toBe('10:24:24');
    });

    it('valid date time value with dot separator', () => {
      const res = formatTime('2025.08.26 10.24.24', 'YYYY.MM.DD HH.mm.ss', 'HH.mm.ss');
      expect(res).toBe('10.24.24');
    });

    it('valid date time value with chinese separator', () => {
      const res = formatTime('2025年08月26日 10时24分24秒', 'YYYY年MM月DD日HH时mm分ss秒', 'HH时mm分ss秒');
      expect(res).toBe('10时24分24秒');
    });
  });

  describe('parseToDayjs', () => {
    it('basic date format YYYY-MM-DD', () => {
      const result = parseToDayjs('2025-08-26', 'YYYY-MM-DD');
      expect(result.isValid()).toBe(true);
      expect(result.format('YYYY-MM-DD')).toBe('2025-08-26');
    });

    it('date time format YYYY-MM-DD HH:mm:ss', () => {
      const result = parseToDayjs('2025-08-26 10:24:30', 'YYYY-MM-DD HH:mm:ss');
      expect(result.isValid()).toBe(true);
      expect(result.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-26 10:24:30');
    });

    it('date object type', () => {
      const date = new Date('2025-08-26T10:24:30');
      const result = parseToDayjs(date, 'YYYY-MM-DD HH:mm:ss');
      expect(result.isValid()).toBe(true);
      expect(result.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-26 10:24:30');
    });

    it('number timestamp type', () => {
      const timestamp = new Date('2025-08-26T10:24:30').getTime();
      const result = parseToDayjs(timestamp, 'YYYY-MM-DD HH:mm:ss');
      expect(result.isValid()).toBe(true);
      expect(result.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-26 10:24:30');
    });

    it('empty string return current date', () => {
      const result = parseToDayjs('', 'YYYY-MM-DD');
      expect(result.isValid()).toBe(true);
    });

    it('null return current date', () => {
      const result = parseToDayjs(null, 'YYYY-MM-DD');
      expect(result.isValid()).toBe(true);
    });

    it('week format with separator YYYY-ww', () => {
      const result = parseToDayjs('2025-35', 'YYYY-ww');
      expect(result.isValid()).toBe(true);
      expect(result.year()).toBe(2025);
    });

    it('week format without separator YYYYww', () => {
      const result = parseToDayjs('202535', 'YYYYww');
      expect(result.isValid()).toBe(true);
      expect(result.year()).toBe(2025);
    });

    it('quarter format with separator YYYY-[Q]Q', () => {
      const result = parseToDayjs('2025-Q1', 'YYYY-[Q]Q');
      expect(result.isValid()).toBe(true);
      expect(result.year()).toBe(2025);
      expect(result.month()).toBe(0);
    });

    it('quarter format without separator YYYYQ', () => {
      const result = parseToDayjs('2025Q1', 'YYYYQ');
      expect(result.isValid()).toBe(true);
      expect(result.year()).toBe(2025);
      expect(result.month()).toBe(0);
    });

    it('year format YYYY', () => {
      const result = parseToDayjs('2025', 'YYYY');
      expect(result.isValid()).toBe(true);
      expect(result.year()).toBe(2025);
    });

    it('month format YYYY-MM', () => {
      const result = parseToDayjs('2025-08', 'YYYY-MM');
      expect(result.isValid()).toBe(true);
      expect(result.year()).toBe(2025);
      expect(result.month()).toBe(7);
    });

    it('chinese format YYYY年MM月', () => {
      const result = parseToDayjs('2025年08月', 'YYYY年MM月');
      expect(result.isValid()).toBe(true);
      expect(result.year()).toBe(2025);
      expect(result.month()).toBe(7);
    });

    it('custom locale zh-cn', () => {
      const result = parseToDayjs('2025-08-26', 'YYYY-MM-DD', undefined, 'zh-cn');
      expect(result.isValid()).toBe(true);
      expect(result.locale('zh-cn').format('YYYY年MM月DD日')).toBe('2025年08月26日');
    });

    it('custom locale en-us', () => {
      const result = parseToDayjs('2025-08-26', 'YYYY-MM-DD', undefined, 'en-us');
      expect(result.isValid()).toBe(true);
      expect(result.locale('en-us').format('MM/DD/YYYY')).toBe('08/26/2025');
    });

    it('date format with defaultTime', () => {
      const result = parseToDayjs('2025-08-26', 'YYYY-MM-DD', undefined, 'zh-cn', '12:30:00');
      expect(result.isValid()).toBe(true);
      expect(result.hour()).toBe(12);
      expect(result.minute()).toBe(30);
      expect(result.second()).toBe(0);
    });

    it('date format without time and with defaultTime', () => {
      const result = parseToDayjs('2025-08-26', 'YYYY-MM-DD');
      expect(result.isValid()).toBe(true);
      expect(result.hour()).toBe(0);
      expect(result.minute()).toBe(0);
      expect(result.second()).toBe(0);
    });

    it('no separator format YYYYMMDD', () => {
      const result = parseToDayjs('20250826', 'YYYYMMDD');
      expect(result.isValid()).toBe(true);
      expect(result.format('YYYY-MM-DD')).toBe('2025-08-26');
    });

    it('slash separator format YYYY/MM/DD', () => {
      const result = parseToDayjs('2025/08/26', 'YYYY/MM/DD');
      expect(result.isValid()).toBe(true);
      expect(result.format('YYYY-MM-DD')).toBe('2025-08-26');
    });

    it('dot separator format YYYY.MM.DD', () => {
      const result = parseToDayjs('2025.08.26', 'YYYY.MM.DD');
      expect(result.isValid()).toBe(true);
      expect(result.format('YYYY-MM-DD')).toBe('2025-08-26');
    });

    it('invalid format return current date', () => {
      const result = parseToDayjs('invalid-date', 'YYYY-MM-DD');
      expect(result.isValid()).toBe(true);
    });

    it('format mismatch return parsed date', () => {
      const result = parseToDayjs('2025/08/26', 'YYYY-MM-DD');
      expect(result.isValid()).toBe(true);
    });
  });
});
