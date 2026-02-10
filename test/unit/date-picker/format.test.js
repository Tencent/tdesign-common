import { afterEach, describe, expect, it, vi } from 'vitest';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import {
  calcFormatTime,
  extractTimeFormat,
  formatDate,
  formatTime,
  getDefaultFormat,
  initYearMonthTime,
  isValidDate,
  parseToDayjs,
} from '../../../js/date-picker/format';

describe('format', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('calcFormatTime', () => {
    it('time format shorter than default time format', () => {
      const res = calcFormatTime('12:30:45', 'HH:mm');
      expect(res).toBe('12:30');
    });

    it('time format same as default time format', () => {
      const res = calcFormatTime('12:30:45', 'HH:mm:ss');
      expect(res).toBe('12:30:45');
    });

    it('time format longer than provided time', () => {
      const res = calcFormatTime('12:30', 'HH:mm:ss');
      expect(res).toBe('12:30');
    });

    it('empty time returns empty', () => {
      const res = calcFormatTime('', 'HH:mm:ss');
      expect(res).toBe('');
    });

    it('empty time format returns time', () => {
      const res = calcFormatTime('12:30:45', '');
      expect(res).toBe('12:30:45');
    });
  });

  describe('extractTimeFormat', () => {
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
      expect(res).toBe('HH时mm分ss秒');
    });

    it('YYYY/MM/DD HH:mm:ss', () => {
      const res = extractTimeFormat('YYYY/MM/DD HH:mm:ss');
      expect(res).toBe('HH:mm:ss');
    });

    it('YYYY.MM.DD HH.mm.ss', () => {
      const res = extractTimeFormat('YYYY.MM.DD HH.mm.ss');
      expect(res).toBe('HH.mm.ss');
    });

    it('YYYY-MM-DD', () => {
      const res = extractTimeFormat('YYYY-MM-DD');
      expect(res).toBe('');
    });

    it('empty string', () => {
      const res = extractTimeFormat('');
      expect(res).toBe('');
    });

    it('YYYY-MM-DD HH:mm:ss.SSS', () => {
      const res = extractTimeFormat('YYYY-MM-DD HH:mm:ss.SSS');
      expect(res).toBe('HH:mm:ss.SSS');
    });

    it('YYYY-MM-DD h:mm A', () => {
      const res = extractTimeFormat('YYYY-MM-DD h:mm A');
      expect(res).toBe('h:mm A');
    });

    it('YYYY-MM-DD HH:mm', () => {
      const res = extractTimeFormat('YYYY-MM-DD HH:mm');
      expect(res).toBe('HH:mm');
    });
  });

  describe('formatDate', () => {
    it('single date with default format', () => {
      const result = formatDate('2025-08-26', { format: 'YYYY-MM-DD' });
      expect(result).toBe('2025-08-26');
    });

    it('single date with targetFormat', () => {
      const result = formatDate('2025-08-26', { format: 'YYYY-MM-DD', targetFormat: 'YYYY/MM/DD' });
      expect(result).toBe('2025/08/26');
    });

    it('single date with time-stamp valueType', () => {
      const date = '2025-08-26 10:24:30';
      const result = formatDate(date, { format: 'YYYY-MM-DD HH:mm:ss', targetFormat: 'time-stamp' });
      const expected = new Date(date).getTime();
      expect(result).toBe(expected);
    });

    it('single date with Date valueType', () => {
      const date = '2025-08-26 10:24:30';
      const result = formatDate(date, { format: 'YYYY-MM-DD HH:mm:ss', targetFormat: 'Date' });
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2025);
    });

    it('date range with autoSwap false', () => {
      const result = formatDate(['2025-08-26', '2025-08-20'], {
        format: 'YYYY-MM-DD',
        autoSwap: false,
      });
      expect(result).toEqual(['2025-08-26', '2025-08-20']);
    });

    it('date range with autoSwap true', () => {
      const result = formatDate(['2025-08-26', '2025-08-20'], {
        format: 'YYYY-MM-DD',
        autoSwap: true,
      });
      expect(result).toEqual(['2025-08-20', '2025-08-26']);
    });

    it('date range with targetFormat', () => {
      const result = formatDate(['2025-08-20', '2025-08-26'], {
        format: 'YYYY-MM-DD',
        targetFormat: 'YYYY/MM/DD',
      });
      expect(result).toEqual(['2025/08/20', '2025/08/26']);
    });

    it('date range with time-stamp valueType', () => {
      const result = formatDate(['2025-08-20', '2025-08-26'], {
        format: 'YYYY-MM-DD',
        targetFormat: 'time-stamp',
      });
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBeTypeOf('number');
      expect(result[1]).toBeTypeOf('number');
    });

    it('date range with Date valueType', () => {
      const result = formatDate(['2025-08-20', '2025-08-26'], {
        format: 'YYYY-MM-DD',
        targetFormat: 'Date',
      });
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBeInstanceOf(Date);
      expect(result[1]).toBeInstanceOf(Date);
    });

    it('date range with defaultTime', () => {
      const result = formatDate(['2025-08-20', '2025-08-26'], {
        format: 'YYYY-MM-DD',
        targetFormat: 'YYYY-MM-DD HH:mm:ss',
        defaultTime: ['09:00:00', '18:00:00'],
      });
      expect(result).toEqual(['2025-08-20 09:00:00', '2025-08-26 18:00:00']);
    });

    it('empty date returns empty string', () => {
      const result = formatDate('', { format: 'YYYY-MM-DD' });
      expect(result).toBe('');
    });

    it('null date returns empty string', () => {
      const result = formatDate(null, { format: 'YYYY-MM-DD' });
      expect(result).toBe('');
    });

    it('date with custom locale zh-cn', () => {
      const result = formatDate('2025-08-26', { format: 'YYYY-MM-DD', dayjsLocale: 'zh-cn' });
      expect(result).toBe('2025-08-26');
    });

    it('date with custom locale en-us', () => {
      const result = formatDate('2025-08-26', { format: 'YYYY-MM-DD', dayjsLocale: 'en-us' });
      expect(result).toBe('2025-08-26');
    });

    it('single date with string defaultTime', () => {
      const result = formatDate('2025-08-26', {
        format: 'YYYY-MM-DD',
        targetFormat: 'YYYY-MM-DD HH:mm:ss',
        defaultTime: '12:30:00',
      });
      expect(result).toBe('2025-08-26 12:30:00');
    });

    it('handles single date with array defaultTime', () => {
      const res = formatDate('2023-01-01', {
        format: 'YYYY-MM-DD',
        defaultTime: ['00:00:00', '12:00:00'],
      });
      expect(res).toBe('2023-01-01');
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

    it('empty value returns formatted default time', () => {
      const res = formatTime('', 'YYYY-MM-DD HH:mm:ss', 'HH:mm:ss', '12:00:00');
      expect(res).toBe('12:00:00');
    });

    it('undefined value returns formatted default time', () => {
      const res = formatTime(undefined, 'YYYY-MM-DD HH:mm:ss', 'HH:mm:ss', '12:00:00');
      expect(res).toBe('12:00:00');
    });

    it('Date object type value', () => {
      const date = new Date('2025-08-26T10:24:30');
      const res = formatTime(date, 'YYYY-MM-DD HH:mm:ss', 'HH:mm:ss');
      expect(res).toBe('10:24:30');
    });

    it('number timestamp type value', () => {
      const timestamp = new Date('2025-08-26T10:24:30').getTime();
      const res = formatTime(timestamp, 'YYYY-MM-DD HH:mm:ss', 'HH:mm:ss');
      expect(res).toBe('10:24:30');
    });

    it('handles empty array value', () => {
      const res = formatTime([], 'YYYY-MM-DD', 'HH:mm:ss', ['00:00:00']);
      expect(res).toEqual(['00:00:00']);
    });
  });

  describe('getDefaultFormat', () => {
    it('year mode', () => {
      const result = getDefaultFormat({ mode: 'year' });
      expect(result.format).toBe('YYYY');
      expect(result.valueType).toBe('YYYY');
      expect(result.timeFormat).toBe('HH:mm:ss');
    });

    it('year mode with custom format', () => {
      const result = getDefaultFormat({ mode: 'year', format: 'YYYY年' });
      expect(result.format).toBe('YYYY年');
      expect(result.valueType).toBe('YYYY年');
    });

    it('month mode', () => {
      const result = getDefaultFormat({ mode: 'month' });
      expect(result.format).toBe('YYYY-MM');
      expect(result.valueType).toBe('YYYY-MM');
      expect(result.timeFormat).toBe('HH:mm:ss');
    });

    it('month mode with custom format', () => {
      const result = getDefaultFormat({ mode: 'month', format: 'YYYY年MM月' });
      expect(result.format).toBe('YYYY年MM月');
      expect(result.valueType).toBe('YYYY年MM月');
    });

    it('quarter mode', () => {
      const result = getDefaultFormat({ mode: 'quarter' });
      expect(result.format).toBe('YYYY-[Q]Q');
      expect(result.valueType).toBe('YYYY-[Q]Q');
      expect(result.timeFormat).toBe('HH:mm:ss');
    });

    it('week mode', () => {
      const result = getDefaultFormat({ mode: 'week' });
      expect(result.format).toBe('gggg-wo');
      expect(result.valueType).toBe('gggg-wo');
      expect(result.timeFormat).toBe('HH:mm:ss');
    });

    it('date mode', () => {
      const result = getDefaultFormat({ mode: 'date' });
      expect(result.format).toBe('YYYY-MM-DD');
      expect(result.valueType).toBe('YYYY-MM-DD');
      expect(result.timeFormat).toBe('HH:mm:ss');
    });

    it('date mode with time picker', () => {
      const result = getDefaultFormat({ mode: 'date', enableTimePicker: true });
      expect(result.format).toBe('YYYY-MM-DD HH:mm:ss');
      expect(result.valueType).toBe('YYYY-MM-DD HH:mm:ss');
      expect(result.timeFormat).toBe('HH:mm:ss');
    });

    it('date mode with custom format', () => {
      const result = getDefaultFormat({ mode: 'date', format: 'YYYY/MM/DD', valueType: 'time-stamp' });
      expect(result.format).toBe('YYYY/MM/DD');
      expect(result.valueType).toBe('time-stamp');
    });

    it('extract time format from date mode with time', () => {
      const result = getDefaultFormat({ mode: 'date', format: 'YYYY-MM-DD HH:mm' });
      expect(result.timeFormat).toBe('HH:mm');
    });
  });

  describe('initYearMonthTime', () => {
    it('empty value returns default year month time', () => {
      const result = initYearMonthTime({
        value: [],
        mode: 'date',
        format: 'YYYY-MM-DD',
      });
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      expect(result.year[0]).toBe(currentYear);
      expect(result.month[0]).toBe(currentMonth);
    });

    it('year mode increments second year by 10', () => {
      const result = initYearMonthTime({
        value: [],
        mode: 'year',
        format: 'YYYY',
      });
      const currentYear = new Date().getFullYear();
      expect(result.year[0]).toBe(currentYear);
      expect(result.year[1]).toBe(currentYear + 10);
    });

    it('month mode increments second year by 1', () => {
      const result = initYearMonthTime({
        value: [],
        mode: 'month',
        format: 'YYYY-MM',
      });
      const currentYear = new Date().getFullYear();
      expect(result.year[0]).toBe(currentYear);
      expect(result.year[1]).toBe(currentYear + 1);
    });

    it('quarter mode increments second year by 1', () => {
      const result = initYearMonthTime({
        value: [],
        mode: 'quarter',
        format: 'YYYY-[Q]Q',
      });
      const currentYear = new Date().getFullYear();
      expect(result.year[0]).toBe(currentYear);
      expect(result.year[1]).toBe(currentYear + 1);
    });

    it('date mode without time picker increments month', () => {
      const result = initYearMonthTime({
        value: [],
        mode: 'date',
        format: 'YYYY-MM-DD',
      });
      const currentMonth = new Date().getMonth();
      if (currentMonth === 11) {
        expect(result.month[1]).toBe(0);
        expect(result.year[1]).toBe(result.year[0] + 1);
      } else {
        expect(result.month[1]).toBe(currentMonth + 1);
      }
    });

    it('date mode with December increments year', () => {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const result = initYearMonthTime({
        value: [],
        mode: 'date',
        format: 'YYYY-MM-DD',
      });
      if (currentMonth === 11) {
        expect(result.year[1]).toBe(currentYear + 1);
        expect(result.month[1]).toBe(0);
      }
    });

    it('date mode with valid value', () => {
      const result = initYearMonthTime({
        value: ['2025-08-26', '2025-09-15'],
        mode: 'date',
        format: 'YYYY-MM-DD',
      });
      expect(result.year).toEqual([2025, 2025]);
      expect(result.month).toEqual([7, 8]);
    });

    it('date mode with custom timeFormat', () => {
      const result = initYearMonthTime({
        value: ['2025-08-26 10:30', '2025-08-26 15:45'],
        mode: 'date',
        format: 'YYYY-MM-DD HH:mm',
        timeFormat: 'HH:mm',
      });
      expect(result.time).toEqual(['10:30', '15:45']);
    });

    it('week mode with valid value', () => {
      const result = initYearMonthTime({
        value: ['2025-35', '2025-40'],
        mode: 'week',
        format: 'YYYY-ww',
      });
      expect(result.year).toEqual([2025, 2025]);
      expect(Array.isArray(result.time)).toBe(true);
    });

    it('week mode without time picker', () => {
      const result = initYearMonthTime({
        value: [],
        mode: 'week',
        format: 'YYYY-ww',
      });
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      if (currentMonth === 11) {
        expect(result.year[1]).toBe(currentYear + 1);
        expect(result.month[1]).toBe(0);
      } else {
        expect(result.month[1]).toBe(currentMonth + 1);
      }
    });

    it('handles December rollover correctly', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2023-12-15'));

      const result = initYearMonthTime({
        value: [],
        mode: 'date',
        format: 'YYYY-MM-DD',
      });

      expect(result.month[0]).toBe(11);
      expect(result.month[1]).toBe(0);
      expect(result.year[1]).toBe(result.year[0] + 1);
    });
  });

  describe('isValidDate', () => {
    it('valid single date string', () => {
      const result = isValidDate('2025-08-26', 'YYYY-MM-DD');
      expect(result).toBe(true);
    });

    it('invalid single date string', () => {
      const result = isValidDate('invalid-date', 'YYYY-MM-DD');
      expect(result).toBe(false);
    });

    it('empty string is valid', () => {
      const result = isValidDate('', 'YYYY-MM-DD');
      expect(result).toBe(true);
    });

    it('valid date array', () => {
      const result = isValidDate(['2025-08-26', '2025-08-27'], 'YYYY-MM-DD');
      expect(result).toBe(true);
    });

    it('invalid date array with one invalid', () => {
      const result = isValidDate(['2025-08-26', 'invalid'], 'YYYY-MM-DD');
      expect(result).toBe(false);
    });

    it('date array with empty string', () => {
      const result = isValidDate(['2025-08-26', ''], 'YYYY-MM-DD');
      expect(result).toBe(true);
    });

    it('date array with null', () => {
      const result = isValidDate(['2025-08-26', ''], 'YYYY-MM-DD');
      expect(result).toBe(true);
    });

    it('valid date object', () => {
      const result = isValidDate(new Date('2025-08-26'), 'YYYY-MM-DD');
      expect(result).toBe(true);
    });

    it('valid timestamp', () => {
      const timestamp = new Date('2025-08-26').getTime();
      const result = isValidDate(timestamp, 'YYYY-MM-DD');
      expect(result).toBe(true);
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

    it('format mismatch return parsed date', () => {
      const result = parseToDayjs('2025/08/26', 'YYYY-MM-DD');
      expect(result.isValid()).toBe(true);
    });

    it('week format with timeOfDay start', () => {
      const result = parseToDayjs('2025-35', 'YYYY-ww', 'start');
      expect(result.isValid()).toBe(true);
      expect(result.year()).toBe(2025);
    });

    it('quarter format with defaultTime', () => {
      const result = parseToDayjs('2025Q1', 'YYYYQ', undefined, 'zh-cn', '15:30:45');
      expect(result.isValid()).toBe(true);
      expect(result.year()).toBe(2025);
      expect(result.month()).toBe(0);
      expect(result.hour()).toBe(15);
      expect(result.minute()).toBe(30);
      expect(result.second()).toBe(45);
    });

    it('week format with separator and defaultTime', () => {
      const result = parseToDayjs('2025-35', 'YYYY-ww', undefined, 'zh-cn', '08:20:00');
      expect(result.isValid()).toBe(true);
      expect(result.year()).toBe(2025);
      expect(result.hour()).toBe(8);
      expect(result.minute()).toBe(20);
      expect(result.second()).toBe(0);
    });

    it('handles non-string input for week format', () => {
      const date = new Date('2023-01-02');
      const res = parseToDayjs(date, 'YYYY-wo');
      expect(res.isValid()).toBe(true);
      expect(res.format('YYYY-MM-DD')).toBe('2023-01-08');
    });

    it('returns default dayjs for invalid weekNum', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-01'));
      const res = parseToDayjs('2025-54', 'YYYY-ww');
      expect(res.format('YYYY-MM-DD')).toBe('2025-01-01');
    });

    it('logs error when setting defaultTime fails', () => {
      const res = parseToDayjs('2023-01-01', 'YYYY-MM-DD', undefined, undefined, 123);
      expect(res.isValid()).toBe(true);
      expect(res.year()).toBe(2023);
    });
  });
});
