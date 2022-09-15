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

    const yearStr = dateText.split(/[-/.]/)[0];
    const weekStr = dateText.split(/[-/.]/)[1];
    const weekFormatStr = format.split(/[-/.]/)[1];
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

    const yearStr = dateText.split(/[-/.]/)[0];
    const quarterStr = dateText.split(/[-/.]/)[1];
    const quarterFormatStr = format.split(/[-/.]/)[1];
    const firstWeek = dayjs(yearStr, 'YYYY').startOf('year');
    for (let i = 0; i <= 52; i += 1) {
      const nextQuarter = firstWeek.add(i, 'quarter');
      if (nextQuarter.format(quarterFormatStr) === quarterStr) {
        return nextQuarter;
      }
    }
  }

  // 兼容数据格式不标准场景 YYYY-MM-D
  return dayjs(dateText, format).isValid()
    ? dayjs(dateText, format)
    : dayjs(dateText);
}

// 格式化 range
function formatRange({
  newDate,
  format,
}: {
  newDate: any;
  format: string;
}) {
  if (!newDate || !Array.isArray(newDate)) return [];

  let dayjsDateList = newDate.map((d) => d && parseToDayjs(d, format));

  // 保证后面的时间大于前面的时间
  if (
    dayjsDateList[0]
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
      `请检查 format、value 格式是否有效.\nformat: '${format}' value: '${newDate}'`
    );
    return [];
  }

  return dayjsDateList.map((da) => da && da.format(format));
}

// 格式化单选
function formatSingle({
  newDate,
  format,
}: {
  newDate: any;
  format: string;
}) {
  if (!newDate) return '';

  const dayJsDate = parseToDayjs(newDate, format);

  // 格式化失败提示
  if (!dayJsDate.isValid()) {
    log.error(
      'DatePicker',
      `请检查 format、value 格式是否有效.\nformat: '${format}' value: '${newDate}'`
    );
    return '';
  }

  return dayJsDate.format(format);
}

// 检测日期是否合法
export function isValidDate(value: DateValue | DateValue[], format: string) {
  if (Array.isArray(value)) {
    if (format === 'time-stamp') return value.every((v) => dayjs(v).isValid());
    return value.every((v) => dayjs(v, format).isValid() || dayjs(v).isValid());
  }

  if (format === 'time-stamp') return dayjs(value).isValid();
  return dayjs(value, format).isValid() || dayjs(value).isValid();
}

// 日期格式化
export function formatDate(
  newDate: DateValue | DateValue[],
  { format }: { format: string; }
) {
  let result;

  if (Array.isArray(newDate)) {
    result = formatRange({ newDate, format });
  } else {
    result = formatSingle({ newDate, format });
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
  enableTimePicker,
}: {
  mode?: string;
  format?: string;
  enableTimePicker?: boolean;
}) {
  if (mode === 'year') {
    return {
      format: format || 'YYYY',
      timeFormat: TIME_FORMAT,
    };
  }
  if (mode === 'month') {
    return {
      format: format || 'YYYY-MM',
      timeFormat: TIME_FORMAT,
    };
  }
  if (mode === 'quarter') {
    return {
      format: format || 'YYYY-[Q]Q',
      timeFormat: TIME_FORMAT,
    };
  }
  if (mode === 'week') {
    return {
      format: format || 'YYYY-wo',
      timeFormat: TIME_FORMAT,
    };
  }
  if (mode === 'date') {
    return {
      format: format || `YYYY-MM-DD${enableTimePicker ? ' HH:mm:ss' : ''}`,
      timeFormat: extractTimeFormat(format || `YYYY-MM-DD${enableTimePicker ? ' HH:mm:ss' : ''}`) || TIME_FORMAT,
    };
  }
  log.error('DatePicker', `Invalid mode: ${mode}`);
  return {};
}
