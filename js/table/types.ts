export interface BaseTableCol<T> {
  children?: T[],
  colKey?: string,
  resize?: { [attr: string]: any },
  width?: number | string,
  minWidth?: number | string,
}

export interface ThMap {
  [colKey: string]: number
}
