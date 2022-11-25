type Placement = 'top' | 'bottom' | 'left' | 'right' | 'mouse';

const getPosition = (
  targetEle: HTMLElement,
  contentEle: HTMLElement,
  placement: Partial<Placement>,
  clientX?: Number,
): { left: number; top: number } => {
  const targetRect = targetEle.getBoundingClientRect() as DOMRect;
  const contentRect = contentEle.getBoundingClientRect() as DOMRect;

  const position = {
    top: document.documentElement.scrollTop,
    left: document.documentElement.scrollLeft,
  };

  if (targetRect && contentRect) {
    const dWidth = targetRect.width - contentRect.width;
    // eslint-disable-next-line default-case
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
        position.top += targetRect.top + targetRect.height + 8;
        break;
      // 后续有需要可以再扩展
    }
  }
  return position;
};

export default getPosition;
