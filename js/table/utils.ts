import isFunction from 'lodash/isFunction';

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

