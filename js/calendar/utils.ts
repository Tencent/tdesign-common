import dayjs from 'dayjs';

import type { CalendarRange, CalendarValue } from './types';
import { MIN_YEAR } from './consts';

/**
 * 根据当前时间创建一个默认日期
 * @returns 当前日期的dayjs对象
 */
export const createDefaultCurDate = (): dayjs.Dayjs => dayjs(dayjs().format('YYYY-MM-DD'));

/**
 * 处理`range`参数输入值并生成日历范围
 * @param range 用于设置日历的年月份显示范围，[范围开始，范围结束]
 * @returns 处理完成的日历范围
 */
export const handleRange = (range?: Array<CalendarValue>): { from: CalendarValue; to: CalendarValue } | null => {
  // 检查范围边界
  const parseRangeBoundary = (value: CalendarRange['from'] | CalendarRange['to'] | null | undefined) => {
    if (value === undefined || value === null) {
      return null;
    }
    const parsed = dayjs(value);
    if (!parsed.isValid()) {
      return null;
    }
    return {
      parsed, // dayjs 对象
      original: value as CalendarRange['from'] | CalendarRange['to'], // 原始值
    };
  };

  if (!range || range.length < 2) {
    return null;
  }
  const [v1, v2] = range;
  const start = parseRangeBoundary(v1);
  const end = parseRangeBoundary(v2);

  if (!start && !end) {
    return null;
  }

  // 未指定边界上/下限时使用默认值
  const fallback = (edge: 'from' | 'to'): { parsed: dayjs.Dayjs; original: string } => {
    let fallbackParsed = dayjs(MIN_YEAR);
    if (edge === 'to') {
      fallbackParsed = createDefaultCurDate();
    }
    return {
      parsed: fallbackParsed,
      original: fallbackParsed.format('YYYY-MM-DD'),
    };
  };

  let fromBoundary = start ?? fallback('from');
  let toBoundary = end ?? fallback('to');

  if (fromBoundary.parsed.isAfter(toBoundary.parsed)) {
    [fromBoundary, toBoundary] = [toBoundary, fromBoundary]; // 当前一项日期大于后一项时交换两值以确保边界逻辑正确
  }

  return {
    from: fromBoundary.original,
    to: toBoundary.original,
  };
};
