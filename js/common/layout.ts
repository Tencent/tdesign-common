type Placement = 'top' | 'bottom' | 'left' | 'right' | 'mouse';

/**
 * 获取元素定位位置
 */
export function getPosition(
  targetEle: HTMLElement,
  contentEle: HTMLElement,
  placement: Partial<Placement>,
  clientX?: Number,
  clientY?: Number
): { left: number; top: number } {
  const targetRect = targetEle.getBoundingClientRect() as DOMRect;
  const contentRect = contentEle.getBoundingClientRect() as DOMRect;

  const position = {
    top: document.documentElement.scrollTop,
    left: document.documentElement.scrollLeft,
  };

  if (targetRect && contentRect) {
    const dWidth = targetRect.width - contentRect.width;
    switch (placement) {
      case 'top':
        position.left += targetRect.left + dWidth / 2;
        position.top += targetRect.top - contentRect.height - 16;
        break;
      case 'bottom':
        position.left += targetRect.left + dWidth / 2;
        position.top += targetRect.top + targetRect.height;
        break;
      case 'mouse':
        position.left += Number(clientX);
        position.top += typeof clientY !== 'undefined' ? Number(clientY) + 16 : targetRect.top + targetRect.height + 8;
        break;
      default:
        break;
    }

    if (placement === 'mouse') {
      const edges = {
        top: document.documentElement.scrollTop,
        left: document.documentElement.scrollLeft,
        right: document.documentElement.scrollLeft + document.documentElement.clientWidth,
        bottom: document.documentElement.scrollTop + document.documentElement.clientHeight,
      };

      if (position.top > edges.bottom - contentRect.height) {
        position.top = document.documentElement.scrollTop + targetRect.top - contentRect.height - 8;
      }

      if (position.left > edges.right - contentRect.width) {
        position.left = edges.right - contentRect.width;
      }
    }
  }

  return position;
}

/**
 * 根据宽度计算响应式尺寸
 */
export function calcSize(width: number): string {
  let size = 'xs';
  if (width < 768) {
    size = 'xs';
  } else if (width >= 768 && width < 992) {
    size = 'sm';
  } else if (width >= 992 && width < 1200) {
    size = 'md';
  } else if (width >= 1200 && width < 1400) {
    size = 'lg';
  } else if (width >= 1400 && width < 1880) {
    size = 'xl';
  } else {
    size = 'xxl';
  }
  return size;
}
