import { isString } from 'lodash-es';
import dayjs from 'dayjs';
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import log from '../log';

type DateValue = string | number | Date;

dayjs.extend(isoWeeksInYear);
dayjs.extend(isLeapYear);
dayjs.extend(customParseFormat);

export const TIME_FORMAT = 'HH:mm:ss';

// extract time format from a completed date format 'YYYY-MM-DD HH:mm' -> 'HH:mm'
export function extractTimeFormat(dateFormat: string = '') {
  return dateFormat.replace(/\W?Y{2,4}|\W?D{1,2}|\W?Do|\W?d{1,4}|\W?M{1,4}|\W?y{2,4}/g, '').trim();
}

// 统一解析日期格式字符串成 Dayjs 对象
export function parseToDayjs(value: string | Date | number, format: string, timeOfDay?: string, dayjsLocale?: string) {
  if (value === '' || value === null) return dayjs();

  let dateText = value;
  // format week
  if (/[w|W]/g.test(format)) {
    if (!isString(dateText)) {
      dateText = dayjs(dateText)
        .locale(dayjsLocale || 'zh-cn')
        .format(format) as string;
    }

    const yearStr = dateText.split(/[-/.\s]/)[0];
    const weekStr = dateText.split(/[-/.\s]/)[1];
    const weekFormatStr = format.split(/[-/.\s]/)[1];

    let firstWeek = dayjs(yearStr, 'YYYY')
      .locale(dayjsLocale || 'zh-cn')
      .startOf('year');
    // 第一周ISO定义: 本年度第一个星期四所在的星期
    // 如果第一年第一天在星期四后, 直接跳到下一周, 下一周必定是第一周
    // 否则本周即为第一周
    if (firstWeek.day() > 4 || firstWeek.day() === 0) firstWeek = firstWeek.add(1, 'week');

    // 一年有52或者53周, 引入IsoWeeksInYear辅助查询
    const weekCounts = dayjs(yearStr, 'YYYY')
      .locale(dayjsLocale || 'zh-cn')
      .isoWeeksInYear();
    for (let i = 0; i <= weekCounts; i += 1) {
      let nextWeek = firstWeek.add(i, 'week');
      // 重置为周的第一天
      if (timeOfDay === 'start') nextWeek = nextWeek.subtract(5, 'day');
      if (nextWeek.format(weekFormatStr) === weekStr) {
        return nextWeek;
      }
    }
  }

  // format quarter
  if (/Q/g.test(format)) {
    if (!isString(dateText)) {
      dateText = dayjs(dateText)
        .locale(dayjsLocale || 'zh-cn')
        .format(format) as string;
    }

    const yearStr = dateText.split(/[-/.\s]/)[0];
    const quarterStr = dateText.split(/[-/.\s]/)[1];
    const quarterFormatStr = format.split(/[-/.\s]/)[1];
    const firstQuarter = dayjs(yearStr, 'YYYY').startOf('year');
    for (let i = 0; i < 4; i += 1) {
      const nextQuarter = firstQuarter.add(i, 'quarter');
      if (nextQuarter.format(quarterFormatStr) === quarterStr) {
        return nextQuarter;
      }
    }
  }

  // 兼容数据格式不标准场景 YYYY-MM-D
  const result = dayjs(dateText, format).isValid() ? dayjs(dateText, format) : dayjs(dateText);

  // 兼容数据异常情况
  if (!result.isValid()) {
    log.error(
      'DatePicker',
      `Check whether the format、value format is valid.\n value: '${value}', format: '${format}'`
    );
    return dayjs();
  }

  return result;
}

/**
 * @description: 格式化单个日期值 - 通用处理
 * @param {Object} params - 参数对象
 * @param {string | number | Date} params.newDate - 输入的日期值
 * @param {string} params.format - 默认日期格式
 * @param {string} [params.dayjsLocale="zh-cn"] - dayjs 语言环境
 * @param {Function} formatter - 格式化函数，接受 dayjs 对象和格式，返回格式化结果
 * @returns {string | number | Date} 格式化后的日期值
 */
function formatDateSingle({
  newDate,
  format,
  dayjsLocale = 'zh-cn',
  formatter,
}: {
  newDate: string | number | Date;
  format: string;
  dayjsLocale?: string;
  formatter: (dayjsObj: any, format: string) => string | number | Date;
}): string | number | Date {
  if (newDate == null || newDate === '') return '';

  const parsedDate = parseToDayjs(newDate, format).locale(dayjsLocale);

  // 格式化失败提示
  if (!parsedDate.isValid()) {
    log.error(
      'DatePicker',
      `Check whether the format、value format is valid.\nformat: '${format}', value: '${newDate}'`
    );
    return '';
  }

  return formatter(parsedDate, format);
}

/**
 * @description: 格式化日期 Range - 通用处理
 * @param {Object} params - 参数对象
 * @param {any[]} params.newDate - 输入的日期值数组
 * @param {string} params.format - 默认日期格式
 * @param {string} [params.dayjsLocale="zh-cn"] - dayjs 语言环境
 * @param {boolean} [params.autoSwap] - 是否自动交换顺序以保证结束时间大于开始时间
 * @param {Function} formatter - 格式化函数，接受 dayjs 对象和格式，返回格式化结果
 * @returns {Array<string | number | Date>} 格式化后的日期值数组
 */
function formatDateRange({
  newDate,
  format,
  dayjsLocale = 'zh-cn',
  autoSwap,
  formatter,
}: {
  newDate: any;
  format: string;
  dayjsLocale?: string;
  autoSwap?: boolean;
  formatter: (dayjsObj: any, format: string) => string | number | Date;
}): Array<string | number | Date> {
  if (!newDate || !Array.isArray(newDate)) return [];

  let dayjsDateList = newDate.map((d) => (d == null || d === '' ? null : parseToDayjs(d, format).locale(dayjsLocale)));

  // 保证后面的时间大于前面的时间
  if (
    autoSwap
    && dayjsDateList[0]
    && dayjsDateList[1]
    && dayjsDateList[0].toDate().getTime() > dayjsDateList[1].toDate().getTime()
  ) {
    // 数据兼容规则
    dayjsDateList = [dayjsDateList[1], dayjsDateList[0]];
  }

  // 格式化失败提示
  if (dayjsDateList.some((r) => r && !r.isValid())) {
    log.error(
      'DatePicker',
      `Check whether the value、format format is valid.\nformat: '${format}', value: '${newDate}'`
    );
    return [];
  }

  return dayjsDateList.map((da) => da && formatter(da, format));
}

/**
 * @description: Value 格式化日期 - 实际输出值
 * @param {DateValue | DateValue[]} newDate
 * @param {{ format: string; targetFormat?: string; dayjsLocale?: string; autoSwap?: boolean }} options
 *  当 targetFormat 不存在时，输出 format 格式化的值
 *  当 targetFormat = 'time-stamp' 时，输出时间戳
 *  当 targetFormat = 'Date' 时，输出 Date 对象
 * @return {string | number | Date | Array<string | number | Date>}
 */
export function formatValueDate(
  newDate: DateValue | DateValue[],
  {
    format,
    targetFormat,
    dayjsLocale = 'zh-cn',
    autoSwap,
  }: {
    format: string;
    targetFormat?: string;
    dayjsLocale?: string;
    autoSwap?: boolean;
  }
): string | number | Date | Array<string | number | Date> {
  const parseFormat = targetFormat && targetFormat !== 'time-stamp' && targetFormat !== 'Date' ? targetFormat : format;

  const valueFormatter = (da: any, fmt: string) => {
    // valueType = 'time-stamp' 返回时间戳
    if (targetFormat === 'time-stamp') return da.toDate().getTime();
    // valueType = 'Date' 返回时间对象
    if (targetFormat === 'Date') return da.toDate();
    return da.format(fmt);
  };

  if (Array.isArray(newDate)) {
    return formatDateRange({
      newDate,
      format: parseFormat,
      dayjsLocale,
      autoSwap,
      formatter: valueFormatter,
    });
  }
  return formatDateSingle({
    newDate,
    format: parseFormat,
    dayjsLocale,
    formatter: valueFormatter,
  });
}

/**
 * @description: Display 格式化日期 - 展示值
 * @param {DateValue | DateValue[]} newDate
 * @param {{ format: string; dayjsLocale?: string; autoSwap?: boolean }} options
 * @return {string | number | Date | Array<string | number | Date>}
 */
export function formatDisplayDate(
  newDate: DateValue | DateValue[],
  {
    format,
    dayjsLocale = 'zh-cn',
    autoSwap,
  }: {
    format: string;
    dayjsLocale?: string;
    autoSwap?: boolean;
  }
): string | number | Date | Array<string | number | Date> {
  if (Array.isArray(newDate)) {
    return formatDateRange({
      newDate,
      format,
      dayjsLocale,
      autoSwap,
      formatter: (da, fmt) => da.format(fmt),
    });
  }
  return formatDateSingle({
    newDate,
    format,
    dayjsLocale,
    formatter: (da, fmt) => da.format(fmt),
  });
}

// 检测日期是否合法
export function isValidDate(value: DateValue | DateValue[], format: string) {
  if (Array.isArray(value)) {
    return value.every((v) => {
      if (v === '') return true;
      return dayjs(v, format).isValid() || dayjs(v).isValid();
    });
  }

  if (value === '') return true;
  return dayjs(value, format).isValid() || dayjs(value).isValid();
}

// 对齐格式化时间
export function calcFormatTime(time: string, timeFormat: string) {
  if (time && timeFormat) {
    const timeArr = time.split(':');
    const timeFormatArr = timeFormat.split(':');
    return timeArr.slice(0, timeFormatArr.length).join(':');
  }
  return time;
}
// TODO 细化 value 类型
// 格式化时间
export function formatTime(value: any, format: string, timeFormat: string, defaultTime: string | string[]) {
  // 无论参数是不是数组，统一转成数组处理
  let result = Array.isArray(value) ? value : [value];
  // eslint-disable-next-line no-param-reassign
  defaultTime = Array.isArray(defaultTime) ? defaultTime : [defaultTime, defaultTime];
  result = result.map((v, i) => {
    // string格式需要用format去解析，其他诸如Date、time-stamp格式则直接dayjs
    if (v) {
      const formattedResult = dayjs(v, typeof v === 'string' ? format : undefined).format(timeFormat);
      return !dayjs(formattedResult, timeFormat).isValid() && defaultTime[i] ? defaultTime[i] : formattedResult;
    }
    return calcFormatTime(defaultTime[i], timeFormat);
  });

  result = result.length ? result : defaultTime.map((t) => calcFormatTime(t, timeFormat));
  // value是数组就输出数组，不是数组就输出第一个即可
  return Array.isArray(value) ? result : result?.[0];
}

// 根据不同 mode 给出格式化默认值
export function getDefaultFormat({
  mode = 'date',
  format,
  valueType,
  enableTimePicker,
  defaultTime,
}: {
  mode?: string;
  format?: string;
  valueType?: string;
  enableTimePicker?: boolean;
  defaultTime?: string | string[];
}) {
  if (mode === 'year') {
    return {
      format: format || 'YYYY',
      valueType: valueType || format || 'YYYY',
      timeFormat: TIME_FORMAT,
    };
  }
  if (mode === 'month') {
    return {
      format: format || 'YYYY-MM',
      valueType: valueType || format || 'YYYY-MM',
      timeFormat: TIME_FORMAT,
    };
  }
  if (mode === 'quarter') {
    return {
      format: format || 'YYYY-[Q]Q',
      valueType: valueType || format || 'YYYY-[Q]Q',
      timeFormat: TIME_FORMAT,
    };
  }
  if (mode === 'week') {
    return {
      format: format || 'gggg-wo',
      valueType: valueType || format || 'gggg-wo',
      timeFormat: TIME_FORMAT,
    };
  }
  if (mode === 'date') {
    const hasTime = enableTimePicker || !!defaultTime;

    return {
      format: format || `YYYY-MM-DD${hasTime ? ' HH:mm:ss' : ''}`,
      valueType: valueType || format || `YYYY-MM-DD${hasTime ? ' HH:mm:ss' : ''}`,
      timeFormat: extractTimeFormat(format || `YYYY-MM-DD${hasTime ? ' HH:mm:ss' : ''}`) || TIME_FORMAT,
    };
  }
  log.error('DatePicker', `Invalid mode: ${mode}`);
  return {};
}

// 初始化面板年份月份
export function initYearMonthTime({
  value,
  mode = 'date',
  format,
  timeFormat = 'HH:mm:ss',
  enableTimePicker,
}: {
  value: Array<any>;
  mode: string;
  format: string;
  timeFormat?: string;
  enableTimePicker?: boolean;
}) {
  const defaultYearMonthTime = {
    year: [dayjs().year(), dayjs().year()],
    month: [dayjs().month(), dayjs().month()],
    time: [dayjs().format(timeFormat), dayjs().format(timeFormat)],
  };
  if (mode === 'year') {
    defaultYearMonthTime.year[1] += 10;
  } else if (mode === 'month' || mode === 'quarter') {
    defaultYearMonthTime.year[1] += 1;
  } else if ((mode === 'date' || mode === 'week') && !enableTimePicker) {
    // 切换至下一年
    if (defaultYearMonthTime.month[0] === 11) {
      defaultYearMonthTime.year[1] += 1;
      defaultYearMonthTime.month[1] = 0;
    } else {
      defaultYearMonthTime.month[1] += 1;
    }
  }

  if (!value || !Array.isArray(value) || !value.length) {
    return defaultYearMonthTime;
  }

  return {
    year: value.map((v) => parseToDayjs(v, format).year()),
    month: value.map((v) => parseToDayjs(v, format).month()),
    time: value.map((v) => parseToDayjs(v, format).format(timeFormat)),
  };
}
