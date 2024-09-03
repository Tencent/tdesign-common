import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { EPickerCols, TIME_FORMAT } from './const';

dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);

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

export function getPickerCols(format:string) {
  const renderCol: EPickerCols[] = [];
  const {
    meridiem, hour, minute, second, milliSecond,
  } = EPickerCols;
  const match = format.match(TIME_FORMAT);
  match.forEach((m) => {
    switch (m) {
      case 'H':
      case 'HH':
      case 'h':
      case 'hh':
        renderCol.push(hour);
        break;
      case 'a':
      case 'A':
        renderCol.push(meridiem);
        break;
      case 'm':
      case 'mm':
        renderCol.push(minute);
        break;
      case 's':
      case 'ss':
        renderCol.push(second);
        break;
      case 'SSS':
        renderCol.push(milliSecond);
        break;
      default:
        break;
    }
  });
  return renderCol;
}
