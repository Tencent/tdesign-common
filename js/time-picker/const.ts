export const AM = 'AM';
export const PM = 'PM';
export const MERIDIEM_LIST = [AM, PM];

export const TIME_PICKER_EMPTY: Array<undefined> = [undefined, undefined];

export const EMPTY_VALUE = -1;

export enum EPickerCols {
  HOUR = 'hour',
  MINUTE = 'minute',
  SECOND = 'second',
  MERIDIEM = 'meridiem',
}

// RegExp
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
