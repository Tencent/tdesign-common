const getDomWidth = (dom: HTMLElement): number => dom?.offsetWidth || 0;
const getDomOffsetLeft = (dom: HTMLElement): number => dom?.offsetLeft || 0;

type scrollPosition = 'auto' | 'start' | 'center' | 'end';

export interface allElementDeps {
  activeTab?: HTMLElement;
  navsContainer?: HTMLElement;
  navsWrap?: HTMLElement;
  leftOperations?: HTMLElement;
  toLeftBtn?: HTMLElement;
  rightOperations?: HTMLElement;
  toRightBtn?: HTMLElement;
}

export function calculateOffset(depElement: allElementDeps, offset: number, scrollPosition: scrollPosition): number {
  // 计算当前 activeTab 应该滚动到的位置
  const { navsContainer, activeTab, rightOperations, leftOperations } = depElement;
  const tabWidth = getDomWidth(activeTab);
  const wrapWidth = getDomWidth(navsContainer);
  const tabOffset = getDomOffsetLeft(activeTab);
  const rightOperationsWidth = getDomWidth(rightOperations);
  const leftOperationsWidth = getDomWidth(leftOperations);

  if (scrollPosition === 'auto') {
    if (tabOffset - leftOperationsWidth < offset) {
      return tabOffset - leftOperationsWidth;
    } if (tabOffset + tabWidth > offset + wrapWidth - rightOperationsWidth) {
      return tabOffset + tabWidth - wrapWidth + rightOperationsWidth;
    }
  } else if (scrollPosition === 'start') {
    return tabOffset - leftOperationsWidth;
  } else if (scrollPosition === 'center') {
    return tabOffset + (tabWidth - wrapWidth) / 2;
  } else if (scrollPosition === 'end') {
    return tabOffset + tabWidth - wrapWidth + rightOperationsWidth;
  }
  return offset;
}

/**
 * 计算上一页或下一页偏移量
 * @param elements 计算时依赖的元素
 * @returns number
 */
export function calcPrevOrNextOffset(elements: allElementDeps, offset: number, action: 'next' | 'prev'): number {
  const { navsContainer, activeTab } = elements;
  const navsContainerWidth = getDomWidth(navsContainer);
  const activeTabWidth = getDomWidth(activeTab);
  if (action === 'next') {
    return offset + navsContainerWidth - activeTabWidth;
  }
  return offset - navsContainerWidth + activeTabWidth;
}

/**
 * 计算最大偏移量
 * @param elements 计算时依赖的元素
 * @returns number
 */
export function calcMaxOffset(elements: allElementDeps): number {
  const { navsWrap, navsContainer, rightOperations, toRightBtn } = elements;
  const wrapWidth = getDomWidth(navsWrap);
  const containerWidth = getDomWidth(navsContainer);
  const rightOperationsWidth = getDomWidth(rightOperations);
  const toRightBtnWidth = getDomWidth(toRightBtn);
  return wrapWidth - containerWidth + rightOperationsWidth - toRightBtnWidth;
}

/**
 * 计算合法偏移量
 * @param offset 偏移值
 * @param maxOffset 最大偏移值
 * @returns number
 */
export function calcValidOffset(offset: number, maxOffset: number): number {
  return Math.max(0, Math.min(offset, maxOffset));
}
