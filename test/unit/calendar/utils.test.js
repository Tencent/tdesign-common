import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';
import { createDefaultCurDate, handleRange } from '../../../js/calendar/utils';

describe('utils', () => {
  describe('createDefaultCurDate', () => {
    it('返回当前日期的dayjs对象且日期格式为YYYY-MM-DD', () => {
      const result = createDefaultCurDate();
      expect(result).toBeDefined();
      expect(result.isValid()).toBe(true);
      const formatted = result.format('YYYY-MM-DD');
      const expected = dayjs().format('YYYY-MM-DD');
      expect(formatted).toBe(expected);
    });
  });

  describe('handleRange', () => {
    // 场景1: 传入非列表值/传入列表值少于两项/传入列表值的两项均非日期格式
    it('传入 undefined 返回 null', () => {
      const result = handleRange(undefined);
      expect(result).toBeNull();
    });

    it('传入 null 返回 null', () => {
      const result = handleRange(null);
      expect(result).toBeNull();
    });

    it('传入非列表值返回 null', () => {
      const result = handleRange('not-a-array');
      expect(result).toBeNull();
    });

    it('传入长度小于2的列表返回 null', () => {
      expect(handleRange([])).toBeNull();
      expect(handleRange(['2024-01-15'])).toBeNull();
    });

    it('传入长度为2且两项均非日期格式的列表返回 null', () => {
      expect(handleRange([null, undefined])).toBeNull();
      expect(handleRange(['abc', 'not-a-date'])).toBeNull();
    });

    // 场景2: 传入列表值的两项中有一项符合日期格式，另一项不符合
    it('传入第一项为非日期格式且第二项为日期的列表，第一项使用默认值处理', () => {
      const result = handleRange(['abc', '2024-01-15']);
      expect(result).not.toBeNull();
      expect(result.from).toBe('1970-01-01');
      expect(result.to).toBe('2024-01-15');
    });

    it('传入第一项为日期且第二项为非日期格式的列表，第二项使用默认值处理', () => {
      const result = handleRange(['2024-01-15', 'not-a-date']);
      const today = dayjs().format('YYYY-MM-DD');
      expect(result).not.toBeNull();
      expect(result.from).toBe('2024-01-15');
      expect(result.to).toBe(today);
    });

    // 场景3: 传入列表值的两项均符合日期格式
    it('传入两项均为日期列表且第一项日期早于第二项日期，原样返回', () => {
      const result = handleRange(['2024-01-15', '2024-12-31']);
      expect(result).not.toBeNull();
      expect(result.from).toBe('2024-01-15');
      expect(result.to).toBe('2024-12-31');
    });

    it('传入两项均为日期列表且第一项日期不早于第二项日期，交换两项后返回', () => {
      const result = handleRange(['2024-12-31', '2024-01-15']);
      expect(result).not.toBeNull();
      expect(result.from).toBe('2024-01-15');
      expect(result.to).toBe('2024-12-31');
    });

    it('处理传入两项为Date格式的列表', () => {
      const date1 = new Date('2024-01-15');
      const date2 = new Date('2024-12-31');
      const result = handleRange([date1, date2]);
      expect(result).not.toBeNull();
      expect(result.from).toBeInstanceOf(Date);
      expect(result.to).toBeInstanceOf(Date);
      expect(result.from.getTime()).toBe(new Date('2024-01-15').getTime());
      expect(result.to.getTime()).toBe(new Date('2024-12-31').getTime());
    });

    it('处理传入一项字符串格式日期另一项为Date格式的列表', () => {
      const date1 = new Date('2024-01-15');
      const result = handleRange([date1, '2024-12-31']);
      expect(result).not.toBeNull();
      // Date object is returned as-is, string is returned as string
      expect(result.from).toBeInstanceOf(Date);
      expect(result.to).toBe('2024-12-31');
      expect(result.from.getTime()).toBe(new Date('2024-01-15').getTime());
    });

    it('传入两项均为日期且处于同一天的列表，原样返回', () => {
      const result = handleRange(['2024-01-15', '2024-01-15']);
      expect(result).not.toBeNull();
      expect(result.from).toBe('2024-01-15');
      expect(result.to).toBe('2024-01-15');
    });
  });
});
