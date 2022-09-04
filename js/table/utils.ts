import isFunction from 'lodash/isFunction';
import isNumber from 'lodash/isNumber';
import { BaseTableCol } from './types';

export function isRowSelectedDisabled(
  selectColumn: { [key: string]: any },
  row: Record<string, any>,
  rowIndex: number,
): boolean {
  let disabled = isFunction(selectColumn.disabled) ? selectColumn.disabled({ row, rowIndex }) : selectColumn.disabled;
  if (selectColumn.checkProps) {
    if (isFunction(selectColumn.checkProps)) {
      disabled = disabled || selectColumn.checkProps({ row, rowIndex }).disabled;
    } else if (selectColumn.checkProps === 'object') {
      disabled = disabled || selectColumn.checkProps.disabled;
    }
  }
  return !!disabled;
}

// 获取列属性
export function getColWidthAttr<T extends BaseTableCol<T>>(col: T, attrKey: 'width' | 'minWidth') {
  const attr = col[attrKey];
  return isNumber(attr) ? attr : parseFloat(attr);
}
