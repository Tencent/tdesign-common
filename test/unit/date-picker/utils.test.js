import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/zh-cn';
import { describe, it, expect } from 'vitest';
import { extractTimeFormat, formatDate } from '../../../js/date-picker/format';

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

  describe('when dayjsLocale is undefined, locale should be consistent with dayjs locale', () => {
    const dateDisplayFormat = 'MMM,YYYY';
    const testDate = '2025-04-22';

    it('zh-cn', () => {
      dayjs.locale('zh-cn');

      const res1 = formatDate('2025-04-22', {
        format: dateDisplayFormat,
        dayjsLocale: undefined,
      });
      const res2 = dayjs(testDate).format(dateDisplayFormat);

      expect(res1).toBe(res2);
    });

    it('en', () => {
      dayjs.locale('en');

      const res3 = formatDate('2025-04-22', {
        format: dateDisplayFormat,
        dayjsLocale: undefined,
      });
      const res4 = dayjs(testDate).format(dateDisplayFormat);
      expect(res3).toBe(res4);
    });
  });
});
