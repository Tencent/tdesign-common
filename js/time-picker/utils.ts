import dayjs from 'dayjs';

// 判断是否输入的值是合法的timepicker的值
export function validateInputValue(value: string, format: string) {
  return dayjs(value, format).isValid();
}

// 转换输入值为标准格式的timepicker的值
export function formatInputValue(value: string, format: string) {
  return dayjs(value, format).format(format);
}
