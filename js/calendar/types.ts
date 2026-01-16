export type CalendarValue = string | Date;

/**
 * 日历的显示范围
 */
export interface CalendarRange {
  from: CalendarValue;
  to: CalendarValue;
}
