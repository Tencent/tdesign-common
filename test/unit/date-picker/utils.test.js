import { describe, it, expect } from 'vitest';
import {
  addMonth,
  covertToDate,
  extractTimeObj,
  firstUpperCase,
  flagActive,
  getDateObj,
  getMonths,
  getQuarters,
  getToday,
  getWeeks,
  getYears,
  isEnabledDate,
  isSame,
  outOfRanges,
  setDateTime,
  subtractMonth,
} from '../../../js/date-picker/utils';

describe('utils', () => {
  describe('addMonth', () => {
    it('should add months', () => {
      const date = new Date('2025-08-26');
      const result = addMonth(date, 3);
      expect(result.getMonth()).toBe(10);
      expect(result.getFullYear()).toBe(2025);
    });

    it('should handle year rollover', () => {
      const date = new Date('2025-11-26');
      const result = addMonth(date, 5);
      expect(result.getMonth()).toBe(3);
      expect(result.getFullYear()).toBe(2026);
    });

    it('should add one month', () => {
      const date = new Date('2025-08-26');
      const result = addMonth(date, 1);
      expect(result.getMonth()).toBe(8);
    });
  });

  describe('covertToDate', () => {
    it('should convert time-stamp to Date', () => {
      const result = covertToDate('1756166400000', 'time-stamp');
      expect(result).toBeInstanceOf(Date);
    });

    it('should convert formatted string to Date', () => {
      const result = covertToDate('2025-08-26', 'YYYY-MM-DD');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(7);
      expect(result.getDate()).toBe(26);
    });

    it('should handle datetime string', () => {
      const result = covertToDate('2025-08-26 10:30:45', 'YYYY-MM-DD HH:mm:ss');
      expect(result).toBeInstanceOf(Date);
      expect(result.getHours()).toBe(10);
      expect(result.getMinutes()).toBe(30);
      expect(result.getSeconds()).toBe(45);
    });
  });

  describe('extractTimeObj', () => {
    it('should extract time from PM format', () => {
      const result = extractTimeObj('pm 20:11:11:333');
      expect(result.hours).toBe(20);
      expect(result.minutes).toBe(11);
      expect(result.seconds).toBe(11);
      expect(result.milliseconds).toBe(333);
      expect(result.meridiem).toBe('pm');
    });

    it('should extract time from AM format', () => {
      const result = extractTimeObj('am 08:30:45');
      expect(result.hours).toBe(8);
      expect(result.minutes).toBe(30);
      expect(result.seconds).toBe(45);
      expect(result.meridiem).toBe('am');
    });

    it('should handle empty string', () => {
      const result = extractTimeObj('');
      expect(result.hours).toBe(0);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(0);
      expect(result.milliseconds).toBe(0);
    });

    it('should handle time without meridiem', () => {
      const result = extractTimeObj('15:30:45');
      expect(result.hours).toBe(15);
      expect(result.minutes).toBe(30);
      expect(result.seconds).toBe(45);
    });

    it('should handle hours and minutes only', () => {
      const result = extractTimeObj('15:30');
      expect(result.hours).toBe(15);
      expect(result.minutes).toBe(30);
      expect(result.seconds).toBe(0);
      expect(result.milliseconds).toBe(0);
    });

    it('should handle hours only', () => {
      const result = extractTimeObj('15');
      expect(result.hours).toBe(15);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(0);
    });

    it('should handle milliseconds', () => {
      const result = extractTimeObj('15:30:45:999');
      expect(result.milliseconds).toBe(999);
    });
  });

  describe('firstUpperCase', () => {
    it('should capitalize first letter', () => {
      expect(firstUpperCase('hello')).toBe('Hello');
    });

    it('should handle single character', () => {
      expect(firstUpperCase('a')).toBe('A');
    });

    it('should handle empty string', () => {
      expect(firstUpperCase('')).toBe('');
    });

    it('should handle string with special characters', () => {
      expect(firstUpperCase('123abc')).toBe('123abc');
    });
  });

  describe('flagActive', () => {
    it('should flag active date for single selection', () => {
      const data = getWeeks(
        { year: 2025, month: 7 },
        {
          firstDayOfWeek: 1,
          disableDate: () => false,
          minDate: undefined,
          maxDate: undefined,
        }
      );
      const start = new Date('2025-08-15');
      const result = flagActive(data, {
        start,
        end: null,
        hoverStart: null,
        hoverEnd: null,
        type: 'date',
        isRange: false,
        value: start,
      });
      expect(result.flat().some((d) => d.active && d.text === 15)).toBe(true);
    });

    it('should flag active dates for range selection', () => {
      const data = getWeeks(
        { year: 2025, month: 7 },
        {
          firstDayOfWeek: 1,
          disableDate: () => false,
          minDate: undefined,
          maxDate: undefined,
        }
      );
      const start = new Date('2025-08-10');
      const end = new Date('2025-08-20');
      const result = flagActive(data, { start, end, hoverStart: null, hoverEnd: null, type: 'date', isRange: true });
      expect(result.flat().some((d) => d.active && d.text === 10)).toBe(true);
      expect(result.flat().some((d) => d.active && d.text === 20)).toBe(true);
    });

    it('should highlight dates in range', () => {
      const data = getWeeks(
        { year: 2025, month: 7 },
        {
          firstDayOfWeek: 1,
          disableDate: () => false,
          minDate: undefined,
          maxDate: undefined,
        }
      );
      const start = new Date('2025-08-10');
      const end = new Date('2025-08-20');
      const result = flagActive(data, { start, end, hoverStart: null, hoverEnd: null, type: 'date', isRange: true });
      expect(result.flat().some((d) => d.highlight)).toBe(true);
    });

    it('should not flag additional dates', () => {
      const data = getWeeks(
        { year: 2025, month: 7 },
        {
          firstDayOfWeek: 1,
          disableDate: () => false,
          minDate: undefined,
          maxDate: undefined,
        }
      );
      const start = new Date('2025-08-15');
      const result = flagActive(data, {
        start,
        end: null,
        hoverStart: null,
        hoverEnd: null,
        type: 'date',
        isRange: false,
        value: start,
      });
      expect(result.flat().filter((d) => d.active && d.additional).length).toBe(0);
    });

    it('should handle hover highlight for range', () => {
      const data = getWeeks(
        { year: 2025, month: 7 },
        {
          firstDayOfWeek: 1,
          disableDate: () => false,
          minDate: undefined,
          maxDate: undefined,
        }
      );
      const hoverStart = new Date('2025-08-10');
      const hoverEnd = new Date('2025-08-15');
      const result = flagActive(data, { start: null, end: null, hoverStart, hoverEnd, type: 'date', isRange: true });
      expect(result.flat().some((d) => d.hoverHighlight)).toBe(true);
    });

    it('should return data unchanged for week type', () => {
      const data = getWeeks(
        { year: 2025, month: 7 },
        {
          firstDayOfWeek: 1,
          disableDate: () => false,
          minDate: undefined,
          maxDate: undefined,
        }
      );
      const result = flagActive(data, {
        start: null,
        end: null,
        hoverStart: null,
        hoverEnd: null,
        type: 'week',
        isRange: false,
      });
      expect(result).toEqual(data);
    });

    it('should handle multiple selection', () => {
      const data = getWeeks(
        { year: 2025, month: 7 },
        {
          firstDayOfWeek: 1,
          disableDate: () => false,
          minDate: undefined,
          maxDate: undefined,
        }
      );
      const value = [new Date('2025-08-10'), new Date('2025-08-15'), new Date('2025-08-20')];
      const result = flagActive(data, {
        start: null,
        end: null,
        hoverStart: null,
        hoverEnd: null,
        type: 'date',
        isRange: false,
        value,
        multiple: true,
      });
      const activeCount = result.flat().filter((d) => d.active).length;
      expect(activeCount).toBeGreaterThanOrEqual(3);
    });
  });

  describe('getDateObj', () => {
    it('should return date object properties', () => {
      const date = new Date('2025-08-26T10:30:45');
      const obj = getDateObj(date);
      expect(obj.year).toBe(2025);
      expect(obj.month).toBe(7);
      expect(obj.date).toBe(26);
      expect(obj.hours).toBe(10);
      expect(obj.minutes).toBe(30);
      expect(obj.seconds).toBe(45);
      expect(obj.milliseconds).toBe(0);
      expect(obj.meridiem).toBe('AM');
    });

    it('should handle PM time', () => {
      const date = new Date('2025-08-26T14:30:45');
      const obj = getDateObj(date);
      expect(obj.meridiem).toBe('PM');
    });

    it('should handle non-date input', () => {
      const obj = getDateObj(null);
      expect(obj.year).toBeTypeOf('number');
      expect(obj.month).toBeTypeOf('number');
      expect(obj.date).toBeTypeOf('number');
    });

    it('should handle milliseconds', () => {
      const date = new Date('2025-08-26T10:30:45.123');
      const obj = getDateObj(date);
      expect(obj.milliseconds).toBe(123);
    });
  });

  describe('getMonths', () => {
    it('should return 12 months', () => {
      const result = getMonths(2025, {
        disableDate: () => false,
        minDate: undefined,
        maxDate: undefined,
        monthLocal: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      });
      expect(result.length).toBe(4);
      expect(result.flat().length).toBe(12);
    });

    it('should mark current month', () => {
      const today = new Date();
      const result = getMonths(today.getFullYear(), {
        disableDate: () => false,
        minDate: undefined,
        maxDate: undefined,
        monthLocal: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      });
      expect(result.flat().some((d) => d.now)).toBe(true);
    });

    it('should disable dates within range', () => {
      const result = getMonths(2025, {
        disableDate: () => false,
        minDate: new Date('2025-03-01'),
        maxDate: new Date('2025-08-31'),
        monthLocal: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      });
      expect(result.flat().some((d) => d.disabled)).toBe(true);
    });

    it('should handle disableDate function', () => {
      const result = getMonths(2025, {
        disableDate: () => true,
        minDate: undefined,
        maxDate: undefined,
        monthLocal: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      });
      expect(result.flat().every((d) => d.disabled)).toBe(true);
    });
  });

  describe('getQuarters', () => {
    it('should return 4 quarters', () => {
      const result = getQuarters(2025, {
        disableDate: () => false,
        minDate: undefined,
        maxDate: undefined,
        quarterLocal: ['Q1', 'Q2', 'Q3', 'Q4'],
      });
      expect(result.length).toBe(1);
      expect(result[0].length).toBe(4);
      expect(result[0][0].text).toBe('Q1');
      expect(result[0][3].text).toBe('Q4');
    });

    it('should mark current quarter', () => {
      const today = new Date();
      const result = getQuarters(today.getFullYear(), {
        disableDate: () => false,
        minDate: undefined,
        maxDate: undefined,
        quarterLocal: ['Q1', 'Q2', 'Q3', 'Q4'],
      });
      expect(result.flat().some((d) => d.now)).toBe(true);
    });

    it('should disable dates within range', () => {
      const result = getQuarters(2025, {
        disableDate: () => false,
        minDate: new Date('2025-04-01'),
        maxDate: new Date('2025-09-30'),
        quarterLocal: ['Q1', 'Q2', 'Q3', 'Q4'],
      });
      expect(result.flat().some((d) => d.disabled)).toBe(true);
    });

    it('should handle disableDate function', () => {
      const result = getQuarters(2025, {
        disableDate: () => true,
        minDate: undefined,
        maxDate: undefined,
        quarterLocal: ['Q1', 'Q2', 'Q3', 'Q4'],
      });
      expect(result.flat().every((d) => d.disabled)).toBe(true);
    });
  });

  describe('getToday', () => {
    it('should return today with time set to 00:00:00', () => {
      const today = getToday();
      const now = new Date();
      expect(today.getFullYear()).toBe(now.getFullYear());
      expect(today.getMonth()).toBe(now.getMonth());
      expect(today.getDate()).toBe(now.getDate());
      expect(today.getHours()).toBe(0);
      expect(today.getMinutes()).toBe(0);
      expect(today.getSeconds()).toBe(0);
    });
  });

  describe('getWeeks', () => {
    it('should return 6 weeks of days', () => {
      const result = getWeeks(
        { year: 2025, month: 7 },
        {
          firstDayOfWeek: 1,
          disableDate: () => false,
          minDate: undefined,
          maxDate: undefined,
        }
      );
      expect(result.length).toBe(6);
      expect(result[0].length).toBe(7);
    });

    it('should show week of year when enabled', () => {
      const result = getWeeks(
        { year: 2025, month: 7 },
        {
          firstDayOfWeek: 1,
          disableDate: () => false,
          minDate: undefined,
          maxDate: undefined,
          showWeekOfYear: true,
        }
      );
      expect(result[0].length).toBe(8);
    });

    it('should disable dates within range', () => {
      const result = getWeeks(
        { year: 2025, month: 7 },
        {
          firstDayOfWeek: 1,
          disableDate: () => false,
          minDate: new Date('2025-08-15'),
          maxDate: new Date('2025-08-20'),
        }
      );
      expect(result.flat().some((d) => d.disabled && !d.additional)).toBe(true);
    });

    it('should handle disableDate function', () => {
      const result = getWeeks(
        { year: 2025, month: 7 },
        {
          firstDayOfWeek: 1,
          disableDate: (date) => date.getDate() === 10,
          minDate: undefined,
          maxDate: undefined,
        }
      );
      expect(result.flat().some((d) => d.disabled && d.text === 10)).toBe(true);
    });

    it('should include additional days from prev and next month', () => {
      const result = getWeeks(
        { year: 2025, month: 7 },
        {
          firstDayOfWeek: 0,
          disableDate: () => false,
          minDate: undefined,
          maxDate: undefined,
        }
      );
      expect(result.flat().some((d) => d.additional && d.type === 'prev-month')).toBe(true);
      expect(result.flat().some((d) => d.additional && d.type === 'next-month')).toBe(true);
    });

    it('should mark today', () => {
      const today = new Date();
      const result = getWeeks(
        { year: today.getFullYear(), month: today.getMonth() },
        {
          firstDayOfWeek: 1,
          disableDate: () => false,
          minDate: undefined,
          maxDate: undefined,
        }
      );
      expect(result.flat().some((d) => d.now)).toBe(true);
    });
  });

  describe('getYears', () => {
    it('should return 10 years', () => {
      const result = getYears(2025, {
        disableDate: () => false,
        minDate: undefined,
        maxDate: undefined,
      });
      expect(result.length).toBe(4);
      expect(result.flat().length).toBe(10);
      expect(result[0][0].text).toBe('2020');
      expect(result[0][2].text).toBe('2022');
    });

    it('should mark current year', () => {
      const currentYear = new Date().getFullYear();
      const result = getYears(currentYear, {
        disableDate: () => false,
        minDate: undefined,
        maxDate: undefined,
      });
      expect(result.flat().some((d) => d.now)).toBe(true);
    });

    it('should disable dates within range', () => {
      const result = getYears(2025, {
        disableDate: () => false,
        minDate: new Date('2025-01-01'),
        maxDate: new Date('2028-12-31'),
      });
      expect(result.flat().some((d) => d.disabled)).toBe(true);
    });

    it('should handle disableDate function', () => {
      const result = getYears(2025, {
        disableDate: () => true,
        minDate: undefined,
        maxDate: undefined,
      });
      expect(result.flat().every((d) => d.disabled)).toBe(true);
    });
  });

  describe('isEnabledDate', () => {
    it('should return true when no disableDate', () => {
      const result = isEnabledDate({
        value: new Date('2025-08-26'),
        disableDate: null,
        mode: 'date',
        format: 'YYYY-MM-DD',
      });
      expect(result).toBe(true);
    });

    it('should handle disableDate function', () => {
      const result = isEnabledDate({
        value: new Date('2025-08-26'),
        disableDate: (date) => date.getDate() === 26,
        mode: 'date',
        format: 'YYYY-MM-DD',
      });
      expect(result).toBe(false);
    });

    it('should handle disableDate array', () => {
      const date = new Date('2025-08-26T00:00:00');
      const result = isEnabledDate({
        value: date,
        disableDate: ['2025-08-26 00:00:00', '2025-08-27 00:00:00'],
        mode: 'date',
        format: 'YYYY-MM-DD HH:mm:ss',
      });
      expect(result).toBe(false);
    });

    it('should return true for date not in disableDate array', () => {
      const date = new Date('2025-08-25T00:00:00');
      const result = isEnabledDate({
        value: date,
        disableDate: ['2025-08-26 00:00:00', '2025-08-27 00:00:00'],
        mode: 'date',
        format: 'YYYY-MM-DD HH:mm:ss',
      });
      expect(result).toBe(true);
    });

    it('should handle disableDate object with from and to', () => {
      const result = isEnabledDate({
        value: new Date('2025-08-15'),
        disableDate: { from: '2025-08-10', to: '2025-08-20' },
        mode: 'date',
        format: 'YYYY-MM-DD',
      });
      expect(result).toBe(false);
    });

    it('should return true for date outside from-to range', () => {
      const result = isEnabledDate({
        value: new Date('2025-08-25'),
        disableDate: { from: '2025-08-10', to: '2025-08-20' },
        mode: 'date',
        format: 'YYYY-MM-DD',
      });
      expect(result).toBe(true);
    });

    it('should handle disableDate object with before', () => {
      const result = isEnabledDate({
        value: new Date('2025-08-05'),
        disableDate: { before: '2025-08-10' },
        mode: 'date',
        format: 'YYYY-MM-DD',
      });
      expect(result).toBe(false);
    });

    it('should handle disableDate object with after', () => {
      const result = isEnabledDate({
        value: new Date('2025-08-25'),
        disableDate: { after: '2025-08-20' },
        mode: 'date',
        format: 'YYYY-MM-DD',
      });
      expect(result).toBe(false);
    });

    it('should handle disableDate object with both before and after', () => {
      const result = isEnabledDate({
        value: new Date('2025-08-15'),
        disableDate: { before: '2025-08-10', after: '2025-08-20' },
        mode: 'date',
        format: 'YYYY-MM-DD',
      });
      expect(result).toBe(true);
    });

    it('should handle quarter mode with date mode checking', () => {
      const result = isEnabledDate({
        value: new Date('2025-04-15'),
        disableDate: (date) => date.getDate() === 15,
        mode: 'quarter',
        format: 'YYYY-[Q]Q',
      });
      expect(result).toBe(false);
    });
  });

  describe('isSame', () => {
    it('same date', () => {
      const date1 = new Date('2025-08-26');
      const date2 = new Date('2025-08-26');
      expect(isSame(date1, date2, 'date')).toBe(true);
    });

    it('different date', () => {
      const date1 = new Date('2025-08-26');
      const date2 = new Date('2025-08-27');
      expect(isSame(date1, date2, 'date')).toBe(false);
    });

    it('same month', () => {
      const date1 = new Date('2025-08-10');
      const date2 = new Date('2025-08-20');
      expect(isSame(date1, date2, 'month')).toBe(true);
    });

    it('different month', () => {
      const date1 = new Date('2025-08-10');
      const date2 = new Date('2025-09-20');
      expect(isSame(date1, date2, 'month')).toBe(false);
    });

    it('same year', () => {
      const date1 = new Date('2025-01-10');
      const date2 = new Date('2025-12-20');
      expect(isSame(date1, date2, 'year')).toBe(true);
    });

    it('different year', () => {
      const date1 = new Date('2025-08-10');
      const date2 = new Date('2026-08-20');
      expect(isSame(date1, date2, 'year')).toBe(false);
    });

    it('same quarter', () => {
      const date1 = new Date('2025-08-10');
      const date2 = new Date('2025-09-20');
      expect(isSame(date1, date2, 'quarter')).toBe(true);
    });

    it('different quarter', () => {
      const date1 = new Date('2025-08-10');
      const date2 = new Date('2025-10-20');
      expect(isSame(date1, date2, 'quarter')).toBe(false);
    });

    it('same week', () => {
      const date1 = new Date('2025-08-25');
      const date2 = new Date('2025-08-27');
      expect(isSame(date1, date2, 'week')).toBe(true);
    });

    it('different week', () => {
      const date1 = new Date('2025-08-25');
      const date2 = new Date('2025-09-01');
      expect(isSame(date1, date2, 'week')).toBe(false);
    });

    it('default type is date', () => {
      const date1 = new Date('2025-08-26');
      const date2 = new Date('2025-08-26');
      expect(isSame(date1, date2)).toBe(true);
    });
  });

  describe('outOfRanges', () => {
    it('date before min', () => {
      const date = new Date('2025-08-20');
      const min = new Date('2025-08-25');
      expect(outOfRanges(date, min, null)).toBe(true);
    });

    it('date after max', () => {
      const date = new Date('2025-08-30');
      const max = new Date('2025-08-25');
      expect(outOfRanges(date, null, max)).toBe(true);
    });

    it('date within range', () => {
      const date = new Date('2025-08-25');
      const min = new Date('2025-08-20');
      const max = new Date('2025-08-30');
      expect(outOfRanges(date, min, max)).toBe(false);
    });

    it('date equal to min', () => {
      const date = new Date('2025-08-25');
      const min = new Date('2025-08-25');
      expect(outOfRanges(date, min, null)).toBeFalsy();
    });

    it('date equal to max', () => {
      const date = new Date('2025-08-25');
      const max = new Date('2025-08-25');
      expect(outOfRanges(date, null, max)).toBeFalsy();
    });

    it('no min and max', () => {
      const date = new Date('2025-08-25');
      expect(outOfRanges(date, null, null)).toBeFalsy();
    });
  });

  describe('setDateTime', () => {
    it('should return new date object', () => {
      const date = new Date('2025-08-26');
      const result = setDateTime(date, 10, 30, 45);
      expect(result).toBeInstanceOf(Date);
      expect(result).not.toBe(date);
    });

    it('should set time on date', () => {
      const date = new Date('2025-08-26');
      const result = setDateTime(date, 10, 30, 45);
      expect(result).toBeInstanceOf(Date);
      expect(result.getHours()).toBe(10);
      expect(result.getMinutes()).toBe(30);
      expect(result.getSeconds()).toBe(45);
    });
  });

  describe('subtractMonth', () => {
    it('should subtract months', () => {
      const date = new Date('2025-08-26');
      const result = subtractMonth(date, 3);
      expect(result.getMonth()).toBe(4);
      expect(result.getFullYear()).toBe(2025);
    });

    it('should handle year rollover', () => {
      const date = new Date('2025-02-26');
      const result = subtractMonth(date, 5);
      expect(result.getMonth()).toBe(8);
      expect(result.getFullYear()).toBe(2024);
    });

    it('should subtract one month', () => {
      const date = new Date('2025-08-26');
      const result = subtractMonth(date, 1);
      expect(result.getMonth()).toBe(6);
    });
  });
});
