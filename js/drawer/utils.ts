type Placement = 'left' | 'right' | 'top' | 'bottom';

interface SizeDragLimit {
  max: number;
  min: number;
}

export function getSizeDraggable(
  sizeDraggable: boolean | SizeDragLimit,
  limit: { max: number; min: number }
) {
  if (typeof sizeDraggable === 'boolean') {
    return {
      allowSizeDraggable: sizeDraggable,
      max: limit.max,
      min: limit.min,
    };
  }

  return {
    allowSizeDraggable: true,
    max: sizeDraggable.max,
    min: sizeDraggable.min,
  };
}

type IOptions = {
  x: number;
  y: number;
  maxWidth: number;
  maxHeight: number;
  min: number;
  max: number;
};

// > min && < max
function calcSizeRange(size: number, min: number, max: number) {
  return Math.min(Math.max(size, min), max);
}

export function calcMoveSize(placement: Placement, opts: IOptions) {
  const { x, y, max, min, maxWidth, maxHeight } = opts;
  let moveSize: number | undefined;
  switch (placement) {
    case 'right':
      // |<---  x  --->|      |
      // |     maxWidth       |
      //               | size |  > min && < max
      moveSize = calcSizeRange(maxWidth - x, min, max);
      break;
    case 'left':
      // |<--  x -->|  |
      // x > min && < max
      moveSize = calcSizeRange(x, min, max);
      break;
    case 'top':
      // - - - - - - - -
      // |     y        |
      // |              |
      // - - - - - - - -
      //  > min && < max
      // moveSize = Math.min(Math.max(y, min), max);
      moveSize = calcSizeRange(y, min, max);
      break;
    case 'bottom':
      // - - - - - - - -
      // |     y        |
      // |              |  maxHeight
      // - - - - - - - -
      // |    size      |
      //  > min && < max
      moveSize = calcSizeRange(maxHeight - y, min, max);
      break;
    default:
      // 参数缺失直接返回
      return moveSize;
  }
  return moveSize;
}
