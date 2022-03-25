import dayjs from 'dayjs';
import dayJsIsBetween from 'dayjs/plugin/isBetween';
import chunk from 'lodash/chunk';

dayjs.extend(dayJsIsBetween);

/**
 * 首字母大写
 * @param {String} str 目标字符串
 * @returns {String}
 */
export function firstUpperCase(str: string): string {
  if (!str) return str;
  return str[0].toUpperCase().concat(str.substring(1, str.length));
}

interface DateObj {
  year: number;
  month: number;
}

/**
 * 返回指定年、月的第一天日期
 * @param {Object} { year, month }
 * @returns {Date}
 */
function getFirstDayOfMonth({ year, month }: DateObj): Date {
  return new Date(year, month, 1);
}

/**
 * 返回指定年、月的天数
 * @param {Object} { year, month }
 * @returns {Number}
 */
function getDaysInMonth({ year, month }: DateObj): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * 返回指定年、月的最后一天日期
 * @param {Object} { year, month }
 * @returns {Date}
 */
function getLastDayOfMonth({ year, month }: DateObj): Date {
  return new Date(year, month, getDaysInMonth({ year, month }));
}

function isSameYear(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear();
}

function isSameMonth(date1: Date, date2: Date): boolean {
  return isSameYear(date1, date2) && date1.getMonth() === date2.getMonth();
}

function isSameDate(date1: Date, date2: Date): boolean {
  return isSameMonth(date1, date2) && date1.getDate() === date2.getDate();
}

/**
 * 是否是某法范围内的日期，精确到日
 * @param {Date} value 目标日期
 * @param {Object} { start, end } 范围
 * @returns {Boolean}
 */
function isBetween(
  value: Date,
  { start, end }: { start: Date; end: Date },
): boolean {
  const date = new Date(value.getFullYear(), value.getMonth(), value.getDate());

  const startTime = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endTime = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  return startTime <= date && endTime >= date;
}

/**
 * 比较两个日期对象的时间戳
 * @param {Date} date1 日期1
 * @param {Date} date2 日期2
 * @returns {Number} 返回 date1.getTime() - date2.getTime() 的差值
 */
function compareAsc(date1: { getTime: () => any }, date2: Date): number {
  const d1 = date1.getTime();
  const d2 = date2.getTime();

  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

/**
 * 比较两个 Date 是否是同一天 或则 同一月 或则 同一年
 * @param {Date} date1 比较的日期
 * @param {Date} date2 比较的日期
 * @param {String} type 比较类型，默认比较到『日』 date|month|year
 * @returns {Boolean}
 */
export function isSame(date1: Date, date2: Date, type = 'date'): boolean {
  const func = {
    isSameYear,
    isSameMonth,
    isSameDate,
  };
  return func[`isSame${firstUpperCase(type)}`](date1, date2);
}

export function outOfRanges(d: Date, min: any, max: any) {
  return (min && compareAsc(d, min) === -1) || (max && compareAsc(d, max) === 1);
}

/**
 * @returns {Date} 当天零点的日期对象
 */
export function getToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
}

/**
 * 返回日期对象的年、月、日、小时、分钟、秒、12小时制标识
 * @param {Date} date
 * @returns {Object}
 */
export function getDateObj(date: Date) {
  let tempDate = date;
  if (!(date instanceof Date)) {
    tempDate = getToday();
  }
  return {
    year: tempDate.getFullYear(),
    month: tempDate.getMonth(),
    date: tempDate.getDate(),
    hours: tempDate.getHours(),
    minutes: tempDate.getMinutes(),
    seconds: tempDate.getSeconds(),
    milliseconds: tempDate.getMilliseconds(),
    meridiem: tempDate.getHours() > 11 ? 'PM' : 'AM',
  };
}

/**
 * 设置日期对象的时间部分
 * @param {Date} date 日期
 * @param {Number} hours 小时
 * @param {Number} minutes 分钟
 * @param {Number} seconds 秒
 * @param {Number} milliseconds 毫秒
 * @returns {Date} 一个新的date
 */
export function setDateTime(date: Date, hours: number, minutes: number, seconds: number, milliseconds?: number): Date {
  return dayjs(date).hour(hours).minute(minutes).second(seconds).millisecond(milliseconds).toDate();
}

/**
 * 减少月份
 * @param {Date} date 起始日期
 * @param {Number} num 月份数
 * @returns {Date}
 */
export function subtractMonth(date: Date, num: number): Date {
  return dayjs(date).subtract(num, 'month').toDate();
}

/**
 * 增加月份
 * @param {Date} date 起始日期
 * @param {Number} num 月份数
 * @returns {Date}
 */
export function addMonth(date: Date, num: number): Date {
  return dayjs(date).add(num, 'month').toDate();
}

export type DateValue = string | Date | number;
export interface DisableDateObj { from?: string; to?: string; before?: string; after?: string }
export type DisableDate = Array<DateValue> | DisableDateObj | ((date: DateValue) => boolean);

export interface OptionsType {
  firstDayOfWeek: number;
  disableDate: DisableDate;
  minDate: Date;
  maxDate: Date;
  monthLocal?: string[];
}

export function getWeeks(
  { year, month }: { year: number; month: number },
  {
    firstDayOfWeek,
    disableDate = () => false,
    minDate,
    maxDate,
  }: OptionsType,
) {
  const prependDay = getFirstDayOfMonth({ year, month });
  const appendDay = getLastDayOfMonth({ year, month });
  const maxDays = getDaysInMonth({ year, month });
  const daysArr = [];
  let i = 1;
  const today = getToday();
  for (i; i <= maxDays; i++) {
    const currentDay = new Date(year, month, i);
    daysArr.push({
      text: i,
      active: false,
      value: currentDay,
      disabled: (typeof disableDate === 'function' && disableDate(currentDay)) || outOfRanges(currentDay, minDate, maxDate),
      now: isSame(today, currentDay),
      firstDayOfMonth: i === 1,
      lastDayOfMonth: i === maxDays,
      type: 'current-month',
    });
  }

  if (prependDay.getDay() !== firstDayOfWeek) {
    prependDay.setDate(0); // 上一月
    while (true) {
      daysArr.unshift({
        text: prependDay.getDate().toString(),
        active: false,
        value: new Date(prependDay),
        disabled: (typeof disableDate === 'function' && disableDate(prependDay)) || outOfRanges(prependDay, minDate, maxDate),
        additional: true, // 非当前月
        type: 'prev-month',
      });
      prependDay.setDate(prependDay.getDate() - 1);
      if (prependDay.getDay() === Math.abs(firstDayOfWeek + 6) % 7) break;
    }
  }

  const LEN = 42; // 显示6周
  while (daysArr.length < LEN) {
    appendDay.setDate(appendDay.getDate() + 1);
    daysArr.push({
      text: appendDay.getDate(),
      active: false,
      value: new Date(appendDay),
      disabled: (typeof disableDate === 'function' && disableDate(appendDay)) || outOfRanges(appendDay, minDate, maxDate),
      additional: true, // 非当前月
      type: 'next-month',
    });
  }

  return chunk(daysArr, 7);
}

export function getYears(
  year: number,
  {
    disableDate = () => false,
    minDate,
    maxDate,
  }: OptionsType,
) {
  const startYear = parseInt((year / 10).toString(), 10) * 10;
  const endYear = startYear + 9;

  const yearArr = [];

  const today = getToday();

  for (let i = startYear; i <= endYear; i++) {
    const date = new Date(i, 1);

    let disabledMonth = 0;
    let outOfRangeMonth = 0;

    for (let j = 0; j < 12; j++) {
      const d = new Date(i, j);
      if (typeof disableDate === 'function' && disableDate(d)) disabledMonth += 1;
      if (outOfRanges(d, minDate, maxDate)) outOfRangeMonth += 1;
    }

    yearArr.push({
      value: date,
      now: isSame(date, today, 'year'),
      disabled: disabledMonth === 12 || outOfRangeMonth === 12,
      active: false,
      text: `${date.getFullYear()}`,
    });
  }

  return chunk(yearArr, 3);
}

export function getMonths(year: number, params: OptionsType) {
  const {
    disableDate = () => false, minDate, maxDate, monthLocal,
  } = params;
  const MonthArr = [];
  const today = getToday();
  for (let i = 0; i <= 11; i++) {
    const date = new Date(year, i);
    let disabledDay = 0;
    let outOfRangeDay = 0;
    const daysInMonth = getDaysInMonth({ year, month: i });

    for (let j = 1; j <= daysInMonth; j++) {
      const d = new Date(year, i, j);
      if (typeof disableDate === 'function' && disableDate(d)) disabledDay += 1;
      if (outOfRanges(d, minDate, maxDate)) outOfRangeDay += 1;
    }

    MonthArr.push({
      value: date,
      now: isSame(date, today, 'month'),
      disabled: disabledDay === daysInMonth || outOfRangeDay === daysInMonth,
      active: false,
      text: monthLocal[date.getMonth()], // `${date.getMonth() + 1} ${monthText || '月'}`,
    });
  }

  return chunk(MonthArr, 3);
}

export interface DateTime {
  active: boolean;
  highlight: boolean;
  startOfRange: boolean;
  endOfRange: boolean;
  value: Date;
}

export function flagActive(data: any[], { ...args }: any) {
  const { start, end, type = 'date' } = args;

  if (!end) {
    return data.map((row: any[]) => row.map((item: DateTime) => {
      const _item = item;
      _item.active = isSame(item.value, start, type);
      return _item;
    }));
  }

  return data.map((row: any[]) => row.map((item: DateTime) => {
    const _item = item;
    const date = item.value;
    const isStart = isSame(start, date, type);
    const isEnd = isSame(end, date, type);
    _item.active = isStart || isEnd;
    _item.highlight = isBetween(date, { start, end });
    _item.startOfRange = isStart;
    _item.endOfRange = isEnd;
    return _item;
  }));
}

// extract time format from a completed date format 'YYYY-MM-DD HH:mm' -> 'HH:mm'
export function extractTimeFormat(dateFormat: string) {
  const res = dateFormat.match(/(a\s)?h{1,2}:m{1,2}(:s{1,2})?(\sa)?/i);
  if (!res) return null;
  return res[0];
}

/**
 * 日期是否可用
 * @param {Object} { value, disableDate, mode, format }
 * @returns {Boolean}
 */
export function isEnabledDate({
  value,
  disableDate,
  mode,
  format,
}: {
  value: Date;
  mode: 'year' | 'month' | 'date';
  format: string;
  disableDate: DisableDate;
}): boolean {
  if (!disableDate) return true;

  let isEnabled = true;
  // 值类型为 Function 则表示返回值为 true 的日期会被禁用
  if (typeof disableDate === 'function') {
    return !disableDate(value);
  }

  // 禁用日期，示例：['A', 'B'] 表示日期 A 和日期 B 会被禁用。
  if (Array.isArray(disableDate)) {
    const formatedDisabledDate = disableDate.map((item: string) => dayjs(item, format));
    const isIncludes = formatedDisabledDate.some(item => item.isSame(dayjs(value)));
    return !isIncludes;
  }

  // { from: 'A', to: 'B' } 表示在 A 到 B 之间的日期会被禁用。
  const { from, to, before, after } = disableDate;

  if (from && to) {
    const compareMin = dayjs(new Date(from));
    const compareMax = dayjs(new Date(to));

    return !dayjs(value).isBetween(compareMin, compareMax, mode, '[]');
  }

  const min = before ? new Date(before) : null;
  const max = after ? new Date(after) : null;

  // { before: 'A', after: 'B' } 表示在 A 之前和在 B 之后的日期都会被禁用。
  if (max && min) {
    const compareMin = dayjs(new Date(min));
    const compareMax = dayjs(new Date(max));

    isEnabled = dayjs(value).isBetween(compareMin, compareMax, mode, '[]');
  } else if (min) {
    const compareMin = dayjs(new Date(min));
    isEnabled = !dayjs(value).isBefore(compareMin, mode);
  } else if (max) {
    const compareMax = dayjs(new Date(max));
    isEnabled = !dayjs(value).isAfter(compareMax, mode);
  }
  return isEnabled;
}
