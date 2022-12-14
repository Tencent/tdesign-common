import dayjs from 'dayjs';
import { extractTimeFormat } from './utils';
import log from '../log';

type DateValue = string | number | Date;

export const TIME_FORMAT = 'HH:mm:ss';

// 统一解析日期格式字符串成 Dayjs 对象
export function parseToDayjs(
  value: string | Date | number,
  format: string,
  timeOfDay?: string
) {
  if (value === '') return dayjs();

  let dateText = value;
  // format week
  if (/[w|W]/g.test(format)) {
    if (typeof dateText !== 'string') {
      dateText = dayjs(dateText).format(format) as string;
    }

    const yearStr = dateText.split(/[-/.\s]/)[0];
    const weekStr = dateText.split(/[-/.\s]/)[1];
    const weekFormatStr = format.split(/[-/.\s]/)[1];
    const firstWeek = dayjs(yearStr, 'YYYY').startOf('year');
    for (let i = 0; i <= 52; i += 1) {
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
    if (typeof dateText !== 'string') {
      dateText = dayjs(dateText).format(format) as string;
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
  const result = dayjs(dateText, format).isValid()
    ? dayjs(dateText, format)
    : dayjs(dateText);

  // 兼容数据异常情况
  if (!result.isValid()) {
    log.error('DatePicker', `Check whether the format、value format is valid.\n value: '${value}', format: '${format}'`);
    return dayjs();
  }

  return result;
}

// 格式化 range
function formatRange({
  newDate,
  format,
  targetFormat,
  autoSwap,
}: {
  newDate: any;
  format: string;
  targetFormat?: string;
  autoSwap?: boolean;
}) {
  if (!newDate || !Array.isArray(newDate)) return [];

  let dayjsDateList = newDate.map((d) => d && parseToDayjs(d, format));

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
      `Check whether the value、format、valueType format is valid.\nformat: '${format}' value: '${newDate}' valueType: '${targetFormat}'`
    );
    return [];
  }

  // valueType = 'time-stamp' 返回时间戳
  if (targetFormat === 'time-stamp') return dayjsDateList.map((da) => da && da.toDate().getTime());
  // valueType = 'Date' 返回时间对象
  if (targetFormat === 'Date') return dayjsDateList.map((da) => da && da.toDate());

  return dayjsDateList.map((da) => da && da.format(targetFormat || format));
}

// 格式化单选
function formatSingle({
  newDate,
  format,
  targetFormat,
}: {
  newDate: any;
  format: string;
  targetFormat?: string;
}) {
  if (!newDate) return '';

  const dayJsDate = parseToDayjs(newDate, format);

  // 格式化失败提示
  if (!dayJsDate.isValid()) {
    log.error(
      'DatePicker',
      `Check whether the format、value format is valid.\nformat: '${format}' value: '${newDate}'`
    );
    return '';
  }

  // valueType = 'time-stamp' 返回时间戳
  if (targetFormat === 'time-stamp') return dayJsDate.toDate().getTime();
  // valueType = 'Date' 返回时间对象
  if (targetFormat === 'Date') return dayJsDate.toDate();

  return dayJsDate.format(targetFormat || format);
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

// 日期格式化
export function formatDate(
  newDate: DateValue | DateValue[],
  {
    format,
    targetFormat,
    autoSwap,
  }: { format: string; targetFormat?: string; autoSwap?: boolean }
) {
  let result;

  if (Array.isArray(newDate)) {
    result = formatRange({ newDate, format, targetFormat, autoSwap });
  } else {
    result = formatSingle({ newDate, format, targetFormat });
  }

  return result;
}

// 格式化时间
export function formatTime(value: DateValue | DateValue[], timeFormat: string) {
  let result;

  if (Array.isArray(value)) {
    result = value.map((v) => dayjs(v || new Date(new Date().setHours(0, 0, 0, 0))).format(timeFormat));
  } else {
    result = dayjs((value || new Date(new Date().setHours(0, 0, 0, 0)))).format(timeFormat);
  }

  return result;
}

// 根据不同 mode 给出格式化默认值
export function getDefaultFormat({
  mode = 'date',
  format,
  valueType,
  enableTimePicker,
}: {
  mode?: string;
  format?: string;
  valueType?: string;
  enableTimePicker?: boolean;
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
      format: format || 'YYYY-wo',
      valueType: valueType || format || 'YYYY-wo',
      timeFormat: TIME_FORMAT,
    };
  }
  if (mode === 'date') {
    return {
      format: format || `YYYY-MM-DD${enableTimePicker ? ' HH:mm:ss' : ''}`,
      valueType: valueType || format || `YYYY-MM-DD${enableTimePicker ? ' HH:mm:ss' : ''}`,
      timeFormat: extractTimeFormat(format || `YYYY-MM-DD${enableTimePicker ? ' HH:mm:ss' : ''}`) || TIME_FORMAT,
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
