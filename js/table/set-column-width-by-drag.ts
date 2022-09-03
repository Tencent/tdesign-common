import isNumber from 'lodash/isNumber';
import { BaseTableCol } from './types';

const findAllChildren = <T extends BaseTableCol<T>>(col: T): T[] => {
  const loopQue: T[] = [];
  const result: T[] = [];
  if (col.children) {
    col.children.forEach((child: T) => loopQue.push(child));
    while (loopQue.length) {
      const child = loopQue.shift();
      if (!child.children || !child.children.length) {
        result.push(child);
      } else {
        child.children.forEach((child: T) => loopQue.push(child));
      }
    }
  }
  return result;
};

export default function setThWidthListByColumnDrag<T extends BaseTableCol<T>>(
  dragCol: T,
  dragWidth: number,
  effectCol: T,
  options: {
    getThWidthList: () => { [colKey: string]: number },
    DEFAULT_MIN_WIDTH: number
  },
  callback: (widthMap: { [colKey: string]: number }, colKeys: string[]) => void
): void {
  const { getThWidthList, DEFAULT_MIN_WIDTH } = options;
  const thWidthList = getThWidthList();

  // 检测是否有多级表头
  const dragChildrenCols = findAllChildren(dragCol);
  const effectChildrenCols = findAllChildren(effectCol);

  // 获取列 width 属性
  const getColWidth = (col: T) => {
    return isNumber(col.width) ? col.width : parseFloat(col.width);
  }

  // 获取列 minWidth 属性
  const getColMinWidth = (col: T) => {
    return isNumber(col.minWidth) ? col.minWidth : parseFloat(col.minWidth);
  }

  // 若有
  if (dragChildrenCols.length || effectChildrenCols.length) {
    let oldWidth = 0;
    let oldEffectWidth = 0;
    const notCalculateCols: string[] = [];
    let effectColsMinWidth = 0;
    const updateMap: { [key: string]: number } = {};

    // 将没有多级表头的列添加到列表中方便后续计算
    if (!dragChildrenCols.length) {
      dragChildrenCols.push(dragCol);
    }

    if (!effectChildrenCols.length) {
      effectChildrenCols.push(effectCol);
    }

    // 根据多级表头的叶节点计算实际宽度（拖动列）
    dragChildrenCols.forEach((child) => {
      oldWidth += thWidthList[child.colKey] || getColWidth(child);
      notCalculateCols.push(child.colKey);
    });

    // 根据多级表头的叶节点计算实际宽度（受影响的列）
    effectChildrenCols.forEach((child) => {
      oldEffectWidth += thWidthList[child.colKey] || getColWidth(child);
      notCalculateCols.push(child.colKey);
      effectColsMinWidth += Math.max(child.resize?.minWidth || DEFAULT_MIN_WIDTH, getColMinWidth(child) || DEFAULT_MIN_WIDTH);
    });

    // 按比例划分新宽度（拖动列）
    dragChildrenCols.forEach((child) => {
      updateMap[child.colKey] = (thWidthList[child.colKey] / oldWidth) * dragWidth;
    });

    // 按比例划分新宽度（受影响的列）
    const remainWidth = Math.max(
      effectColsMinWidth,
      oldWidth + oldEffectWidth - dragWidth,
      Math.max(getColMinWidth(effectCol) || DEFAULT_MIN_WIDTH, effectCol.resize?.minWidth || DEFAULT_MIN_WIDTH),
    );
    effectChildrenCols.forEach((child) => {
      updateMap[child.colKey] = Math.max(
        child.resize?.minWidth || DEFAULT_MIN_WIDTH,
        getColMinWidth(child) || DEFAULT_MIN_WIDTH,
        (thWidthList[child.colKey] / oldEffectWidth) * remainWidth,
      );
    });

    // 更新各列宽度
    callback(updateMap, notCalculateCols);
  } else {
    const oldWidth = thWidthList[dragCol.colKey] || getColWidth(dragCol);
    const oldEffectWidth = thWidthList[effectCol.colKey] || getColWidth(effectCol);

    callback({
      [dragCol.colKey]: dragWidth,
      [effectCol.colKey]: Math.max(
        effectCol.resize?.minWidth || DEFAULT_MIN_WIDTH,
        getColMinWidth(effectCol) || DEFAULT_MIN_WIDTH,
        oldWidth + oldEffectWidth - dragWidth,
      ),
    }, [dragCol.colKey, effectCol.colKey]);
  }
}
