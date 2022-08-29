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
      const defaultWidth = isNumber(child.width) ? child.width : parseFloat(child.width);
      oldWidth += thWidthList[child.colKey] || defaultWidth;
      notCalculateCols.push(child.colKey);
    });

    // 根据多级表头的叶节点计算实际宽度（受影响的列）
    effectChildrenCols.forEach((child) => {
      const defaultWidth = isNumber(child.width) ? child.width : parseFloat(child.width);
      oldEffectWidth += thWidthList[child.colKey] || defaultWidth;
      notCalculateCols.push(child.colKey);
      effectColsMinWidth += child.resize?.minWidth || DEFAULT_MIN_WIDTH;
    });

    // 按比例划分新宽度（拖动列）
    dragChildrenCols.forEach((child) => {
      updateMap[child.colKey] = (thWidthList[child.colKey] / oldWidth) * dragWidth;
    });

    // 按比例划分新宽度（受影响的列）
    const remainWidth = Math.max(
      effectColsMinWidth,
      oldWidth + oldEffectWidth - dragWidth,
      effectCol.resize?.minWidth || DEFAULT_MIN_WIDTH,
    );
    effectChildrenCols.forEach((child) => {
      updateMap[child.colKey] = Math.max(
        child.resize?.minWidth || DEFAULT_MIN_WIDTH,
        (thWidthList[child.colKey] / oldEffectWidth) * remainWidth,
      );
    });

    // 更新各列宽度
    callback(updateMap, notCalculateCols);
  } else {
    const colWidth = isNumber(dragCol.width) ? dragCol.width : parseFloat(dragCol.width);
    const effectWidth = isNumber(effectCol.width) ? effectCol.width : parseFloat(effectCol.width);
    const oldWidth = thWidthList[dragCol.colKey] || colWidth;
    const oldEffectWidth = thWidthList[effectCol.colKey] || effectWidth;

    callback({
      [dragCol.colKey]: dragWidth,
      [effectCol.colKey]: Math.max(
        effectCol.resize?.minWidth || DEFAULT_MIN_WIDTH,
        oldWidth + oldEffectWidth - dragWidth,
      ),
    }, [dragCol.colKey, effectCol.colKey]);
  }
}
