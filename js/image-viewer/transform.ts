import { positiveAdd, positiveSubtract } from '../input-number/number';
import type { ZoomOptions, ZoomResult, TranslateOffset } from './types';

// ==================== 视口检测 ====================

/**
 * 检测图片是否超出视口（容器）边界
 * @param container 外层容器元素
 * @param modalBox 图片包裹元素
 */
export const isImageExceedsViewport = (container: HTMLElement, modalBox: HTMLElement): boolean => {
  const containerRect = container.getBoundingClientRect();
  const modalRect = modalBox.getBoundingClientRect();
  return (
    modalRect.left < containerRect.left ||
    modalRect.right > containerRect.right ||
    modalRect.top < containerRect.top ||
    modalRect.bottom > containerRect.bottom
  );
};

// ==================== 镜像 ====================

/** 镜像默认值（未镜像） */
export const MIRROR_DEFAULT = 1;

/** 切换镜像状态：1 → -1，-1 → 1 */
export const toggleMirror = (current: number): number => (current > 0 ? -1 : 1);

// ==================== 旋转 ====================

/** 每次旋转的角度（逆时针 90°） */
export const ROTATE_DEG = -90;

/**
 * 计算最短路径归零的旋转补偿值
 * 用于 resetRotate 场景：避免 CSS transition 时图片"倒转一大圈"
 *
 * @param currentDeg 当前累计旋转角度
 * @returns 需要减去的补偿值（rotate.value -= 返回值 即可归零）
 *
 * @example
 * // currentDeg = -270 → return 90（-270 - 90 = -360 ≡ 0°）
 * // currentDeg = -180 → return -180（-180 - (-180) = 0）
 * // currentDeg = 0 → return 0（无需旋转）
 */
export function calcResetRotation(currentDeg: number): number {
  const degreeToRotate = currentDeg % 360;
  if (degreeToRotate === 0) return 0;
  // 找最短方向旋转回 0°
  return Math.abs(degreeToRotate) > 180 ? (degreeToRotate + 360) % 360 : degreeToRotate;
}

// ==================== 缩放 ====================

/** 将缩放值限制在 [min, max] 范围内 */
export function clampScale(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * 计算放大后的新 scale 值（使用精确浮点数加法）
 * @returns clamp 后的新 scale 值
 */
export function calcZoomInScale(oldScale: number, step: number, min: number, max: number): number {
  return clampScale(positiveAdd(oldScale, step), min, max);
}

/**
 * 计算缩小后的新 scale 值（使用精确浮点数减法）
 * @returns clamp 后的新 scale 值
 */
export function calcZoomOutScale(oldScale: number, step: number, min: number, max: number): number {
  return clampScale(positiveSubtract(oldScale, step), min, max);
}

/**
 * 计算缩放后的位移补偿
 * 公式：newTranslate = scaleRatio * T + (1 - scaleRatio) * Z
 * 其中 Z 为缩放中心，T 为当前位移，scaleRatio = newScale / oldScale
 */
export function calculateTranslateOffset(
  oldScale: number,
  newScale: number,
  options?: ZoomOptions
): TranslateOffset | undefined {
  if (options?.mouseOffsetX == null || options?.mouseOffsetY == null) {
    return undefined;
  }

  const scaleRatio = newScale / oldScale;
  const { translateX = 0, translateY = 0 } = options?.currentTranslate ?? {};
  const { mouseOffsetX, mouseOffsetY } = options;

  return {
    translateX: scaleRatio * translateX + (1 - scaleRatio) * mouseOffsetX,
    translateY: scaleRatio * translateY + (1 - scaleRatio) * mouseOffsetY,
  };
}

/**
 * 执行一次 zoom in 并计算位移补偿
 * @returns { newScale, zoomResult }
 */
export function zoomIn(
  oldScale: number,
  step: number,
  min: number,
  max: number,
  options?: ZoomOptions
): { newScale: number; zoomResult: ZoomResult } {
  const newScale = calcZoomInScale(oldScale, step, min, max);
  return {
    newScale,
    zoomResult: { newTranslate: calculateTranslateOffset(oldScale, newScale, options) },
  };
}

/**
 * 执行一次 zoom out 并计算位移补偿
 * @returns { newScale, zoomResult }
 */
export function zoomOut(
  oldScale: number,
  step: number,
  min: number,
  max: number,
  options?: ZoomOptions
): { newScale: number; zoomResult: ZoomResult } {
  const newScale = calcZoomOutScale(oldScale, step, min, max);
  return {
    newScale,
    zoomResult: { newTranslate: calculateTranslateOffset(oldScale, newScale, options) },
  };
}
