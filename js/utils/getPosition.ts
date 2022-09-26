type Placement = 'top' | 'bottom' | 'left' | 'right';

const getPosition = (
  targetEle: HTMLElement,
  contentEle: HTMLElement,
  placement: Partial<Placement>
): { left: number; top: number } => {
  const targetRect = targetEle.getBoundingClientRect() as DOMRect;
  const contentRect = contentEle.getBoundingClientRect() as DOMRect;

  let position;
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
      default:
        position.top = document.documentElement.scrollTop;
        position.left = document.documentElement.scrollLeft;
      // 后续有需要可以再扩展
    }
  }
  return position;
};

export default getPosition;
