import isNumber from 'lodash/isNumber';
import { BaseTableCol } from './types';

// 获取列属性
export default function getColWidthAttr<T extends BaseTableCol<T>>(col: T, attrKey: 'width' | 'minWidth') {
  const attr = col[attrKey];
  return isNumber(attr) ? attr : parseFloat(attr);
}
