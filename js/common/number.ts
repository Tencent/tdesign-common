/**
 * @file
 * 缓动函数
 * 参考自: https://github.com/bameyrick/js-easing-functions/blob/master/src/index.ts
 */

export interface EasingFunction {
  (current: number, start: number, end: number, duration: number): number;
}

/**
 * 线性缓动
 */
export const linear: EasingFunction = (current, start, end, duration) => {
  const change = end - start;
  const offset = (change * current) / duration;
  return offset + start;
};

/**
 * 三次缓入缓出
 */
export const easeInOutCubic: EasingFunction = (current, start, end, duration) => {
  const change = (end - start) / 2;
  let time = current / (duration / 2);
  if (time < 1) {
    return change * time * time * time + start;
  }
  time -= 2;
  return change * (time * time * time + 2) + start;
};
