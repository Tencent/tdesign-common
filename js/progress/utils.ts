import { isString, toUpper } from 'lodash-es';
import { MOBILE_CIRCLE_SIZE_PX } from './const';

/**
 * 获取环形进度条直径
 * @param size
 * @returns
 */
export const getDiameter = (size: string | number): number => {
  if (!size) return MOBILE_CIRCLE_SIZE_PX.DEFAULT;

  if (isString(size)) {
    const KEY = toUpper(size);
    if (KEY in MOBILE_CIRCLE_SIZE_PX) {
      return MOBILE_CIRCLE_SIZE_PX[KEY as keyof typeof MOBILE_CIRCLE_SIZE_PX];
    }
    return MOBILE_CIRCLE_SIZE_PX.DEFAULT;
  }

  return size;
};

// 获取环形进度条 环的宽度
export const getCircleStokeWidth = (strokeWidth: string | number, size: string | number): number => {
  if (!strokeWidth) {
    if (size === 'micro') {
      return 2;
    }
  }
  if (typeof strokeWidth !== 'number' || Number.isNaN(strokeWidth)) {
    return 6;
  }
  return strokeWidth;
};
