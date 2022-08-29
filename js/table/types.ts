export interface BaseTableCol<T> {
  children?: T[],
  colKey?: string,
  resize?: { [attr: string]: any },
  width?: number | string
}