import isNumber from 'lodash/isNumber';
import { BaseTableCol } from './types';

export const recalculateColumnWidth = <T extends BaseTableCol<T>>(
  columns: T[],
  thWidthList: { [colKey: string]: number },
  tableLayout: string,
  tableElmWidth: number,
  notCalculateWidthCols: string[],
  callback: (widthMap: { [colKey: string]: number }) => void
): void => {
  let actualWidth = 0;
  const missingWidthCols: T[] = [];
  const thMap: { [colKey: string]: number } = {};

  // 计算现有列的列宽总和
  columns.forEach((col) => {
    if (!thWidthList[col.colKey]) {
      thMap[col.colKey] = isNumber(col.width) ? col.width : parseFloat(col.width);
    } else {
      thMap[col.colKey] = thWidthList[col.colKey];
    }
    const originWidth = thMap[col.colKey];
    if (originWidth) {
      actualWidth += originWidth;
    } else {
      missingWidthCols.push(col);
    }
  });

  let tableWidth = tableElmWidth;
  let needUpdate = false;
  // 表宽没有初始化时，默认给没有指定列宽的列指定宽度为100px
  if (tableWidth > 0) {
    // 存在没有指定列宽的列
    if (missingWidthCols.length) {
      // 当前列宽总宽度小于表宽，将剩余宽度平均分配给未指定宽度的列
      if (actualWidth < tableWidth) {
        const widthDiff = tableWidth - actualWidth;
        const avgWidth = widthDiff / missingWidthCols.length;
        missingWidthCols.forEach((col) => {
          thMap[col.colKey] = avgWidth;
        });
      } else if (tableLayout === 'fixed') {
        // 当前列表总宽度大于等于表宽，且当前排版模式为fixed，默认填充100px
        missingWidthCols.forEach((col) => {
          const originWidth = thMap[col.colKey] || 100;
          thMap[col.colKey] = isNumber(originWidth) ? originWidth : parseFloat(originWidth);
        });
      } else {
        // 当前列表总宽度大于等于表宽，且当前排版模式为auto，默认填充100px，然后按比例重新分配各列宽度
        const extraWidth = missingWidthCols.length * 100;
        const totalWidth = extraWidth + actualWidth;
        columns.forEach((col) => {
          if (!thMap[col.colKey]) {
            thMap[col.colKey] = (100 / totalWidth) * tableWidth;
          } else {
            thMap[col.colKey] = (thMap[col.colKey] / totalWidth) * tableWidth;
          }
        });
      }
      needUpdate = true;
    } else {
      // 所有列都已经指定宽度
      if (notCalculateWidthCols.length) {
        // 存在不允许重新计算宽度的列（一般是resize后的两列），这些列不参与后续计算
        let sum = 0;
        notCalculateWidthCols.forEach((colKey) => {
          sum += thMap[colKey];
        });
        actualWidth -= sum;
        tableWidth -= sum;
      }
      // 重新计算其他列的宽度，按表格剩余宽度进行按比例分配
      if (actualWidth !== tableWidth || notCalculateWidthCols.length) {
        columns.forEach((col) => {
          if (notCalculateWidthCols.includes(col.colKey)) return;
          thMap[col.colKey] = (thMap[col.colKey] / actualWidth) * tableWidth;
        });
        needUpdate = true;
      }
    }
  } else {
    // 表格宽度未初始化，默认填充100px
    missingWidthCols.forEach((col) => {
      const originWidth = thMap[col.colKey] || 100;
      thMap[col.colKey] = isNumber(originWidth) ? originWidth : parseFloat(originWidth);
    });

    needUpdate = true;
  }

  // 列宽转为整数
  if (needUpdate) {
    let addon = 0;
    Object.keys(thMap).forEach((key) => {
      const width = thMap[key];
      addon += width - Math.floor(width);
      thMap[key] = Math.floor(width) + (addon > 1 ? 1 : 0);
      if (addon > 1) {
        addon -= 1;
      }
    });
    if (addon > 0.5) {
      thMap[columns[0].colKey] += 1;
    }
  }

  // 回调处理
  callback(thMap);
};