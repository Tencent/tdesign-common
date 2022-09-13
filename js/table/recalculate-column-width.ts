import { BaseTableCol, ThMap } from './types';
import { getColWidthAttr } from './utils';

/**
 * 填充未设置width属性的列
 * @param columns 当前表格所有列
 * @param missingWidthCols 未设置width属性的列
 * @param thWidthList 列宽记录字典
 * @param tableLayout 表格布局
 * @param actualWidth 各列实际总列宽
 * @param tableWidth 表格总宽度
 */
const setMissingColumnWidth = <T extends BaseTableCol<T>>(
  columns: T[],
  missingWidthCols: T[],
  thWidthList: ThMap,
  tableLayout: string,
  actualWidth: number,
  tableWidth: number
) : void => {
  const thMap = thWidthList;
  // 当前列宽总宽度小于表宽，将剩余宽度平均分配给未指定宽度的列
  if (actualWidth < tableWidth) {
    let widthDiff = tableWidth - actualWidth;
    const remainCols: T[] = [];
    // 优先保证设置了minWidth的列满足最小宽度
    missingWidthCols.forEach((col) => {
      const minWidth = getColWidthAttr(col, 'minWidth');
      if (minWidth) {
        thMap[col.colKey] = minWidth;
        widthDiff -= minWidth;
      } else {
        remainCols.push(col);
      }
    });

    // 如果剩余宽度 > 0
    if (widthDiff > 0) {
      // 如果存在未设置minWidth的列，这些列均分剩余宽度
      if (remainCols.length) {
        const avgWidth = widthDiff / remainCols.length;
        remainCols.forEach((col) => {
          thMap[col.colKey] = avgWidth;
        });
      } else {
        // 否则所有列均分剩余宽度
        const avgWidth = widthDiff / missingWidthCols.length;
        missingWidthCols.forEach((col) => {
          thMap[col.colKey] += avgWidth;
        });
      }
    } else {
      // 剩余宽度 <= 0, 所有剩余列默认填充100px
      remainCols.forEach((col) => {
        thMap[col.colKey] = 100;
      });
    }
  } else if (tableLayout === 'fixed') {
    // 当前列表总宽度大于等于表宽，且当前排版模式为fixed，默认填充minWidth || 100px
    missingWidthCols.forEach((col) => {
      thMap[col.colKey] = getColWidthAttr(col, 'minWidth') || 100;
    });
  } else {
    // 当前列表总宽度大于等于表宽，且当前排版模式为aut
    // 默认填充minWidth || 100px，然后按比例重新分配各列宽度
    let extraWidth = 0;
    missingWidthCols.forEach((col) => {
      extraWidth += getColWidthAttr(col, 'minWidth') || 100;
    });
    const totalWidth = extraWidth + actualWidth;
    columns.forEach((col) => {
      if (!thMap[col.colKey]) {
        const colWidth = getColWidthAttr(col, 'minWidth') || 100;
        thMap[col.colKey] = (colWidth / totalWidth) * tableWidth;
      } else {
        thMap[col.colKey] = (thMap[col.colKey] / totalWidth) * tableWidth;
      }
    });
  }
};

/**
 * 设置所有列的宽度
 * @param columns 当前表格所有列
 * @param thWidthList 列宽记录字典
 * @param actualWidth 各列实际总列宽
 * @param tableWidth 表格总宽度
 * @param notCalculateWidthCols 不需要参与计算的列id
 */
const setNormalColumnWidth = <T extends BaseTableCol<T>>(
  columns: T[],
  thWidthList: ThMap,
  actualWidth: number,
  tableWidth: number,
  notCalculateWidthCols: string[]
) : void => {
  const thMap = thWidthList;
  columns.forEach((col) => {
    if (notCalculateWidthCols.includes(col.colKey)) return;
    thMap[col.colKey] = (thMap[col.colKey] / actualWidth) * tableWidth;
  });
};

/**
 * 表格未初始化时默认填充各列宽度
 * @param missingWidthCols 未设置width属性的列
 * @param thWidthList 列宽记录字典
 */
const setInitialColumnWidth = <T extends BaseTableCol<T>>(
  missingWidthCols: T[],
  thWidthList: { [colKey: string]: number },
) : void => {
  const thMap = thWidthList;
  // 表格宽度未初始化，默认填充minWidth || 100px
  missingWidthCols.forEach((col) => {
    thMap[col.colKey] = getColWidthAttr(col, 'minWidth') || 100;
  });
};

/**
 * 重新按规则分配各列宽度
 * @param columns 当前表格所有列
 * @param thWidthList 列宽记录字典
 * @param tableLayout 表格布局
 * @param tableElmWidth 表格宽度
 * @param notCalculateWidthCols 不需要参与计算的列
 * @param callback 回调函数
 */
export default function recalculateColumnWidth<T extends BaseTableCol<T>>(
  columns: T[],
  thWidthList: ThMap,
  tableLayout: string,
  tableElmWidth: number,
  notCalculateWidthCols: string[],
  callback: (widthMap: { [colKey: string]: number }) => void
): void {
  let actualWidth = 0;
  const missingWidthCols: T[] = [];
  const thMap: ThMap = {};

  // 计算现有列的列宽总和
  columns.forEach((col) => {
    if (!thWidthList[col.colKey]) {
      thMap[col.colKey] = getColWidthAttr(col, 'width');
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
      setMissingColumnWidth(
        columns,
        missingWidthCols,
        thMap,
        tableLayout,
        actualWidth,
        tableWidth
      );
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
        setNormalColumnWidth(
          columns,
          thMap,
          actualWidth,
          tableWidth,
          notCalculateWidthCols
        );
        needUpdate = true;
      }
    }
  } else {
    setInitialColumnWidth(missingWidthCols, thMap);
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
}
