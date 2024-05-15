import dayjs from 'dayjs';
import dayJsIsBetween from 'dayjs/plugin/isBetween';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import localeData from 'dayjs/plugin/localeData';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(localeData);
dayjs.extend(quarterOfYear);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(dayJsIsBetween);

// 判断是否输入的值是合法的timepicker的值
export function validateInputValue(value: string, format: string) {
  return dayjs(value, format).format(format) === value;
}

// 转换输入值为标准格式的timepicker的值
export function formatInputValue(value: string, format: string) {
  return dayjs(value, format).format(format);
}

// 计算最接近的时间点
export function closestLookup(
  availableArr: Array<any>,
  calcVal: number,
  step: number
) {
  if (step <= 1) return calcVal;
  return availableArr.sort(
    (a, b) => Math.abs(calcVal + 1 - a) - Math.abs(calcVal + 1 - b)
  )[0];
}
