export const AM = 'am';
export const PM = 'pm';
export const MERIDIEM_LIST = [AM, PM];

export const TIME_PICKER_EMPTY: Array<undefined> = [undefined, undefined];

export const DEFAULT_STEPS = [1, 1, 1];
export const DEFAULT_FORMAT = 'HH:mm:ss';
export const EMPTY_VALUE = -1;

export enum EPickerCols {
  hour = 'hour',
  minute = 'minute',
  second = 'second',
  milliSecond = 'millisecond',
  meridiem = 'meridiem',
}

// RegExp
export const TIME_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;
// 上下午前置
export const PRE_MERIDIEM_FORMAT = /^(a|A)\s+?[h]{1,2}(:[m]{1,2}(:[s]{1,2})?)?$/;
// 上下午后置
export const POST_MERIDIEM_FORMAT = /^[h]{1,2}(:[m]{1,2}(:[s]{1,2})?)?(\s+(a|A))?$/;
// 12小时制
export const TWELVE_HOUR_FORMAT = /[h]{1}/;
// HH:mm
export const HM_FORMAT = /[hH]{1,2}:m{1,2}/;
// HH:mm:ss
export const HMS_FORMAT = /[hH]{1,2}:m{1,2}:s{1,2}/;
