export type BreakpointValue = number | Record<number, number>;

/**
 * 从断点配置中解析出匹配当前容器宽度的值。
 * @param width 当前容器宽度
 * @param value 固定数值或断点配置对象
 * @param fallback 兜底值
 */
export function resolveBreakpointValue(width: number, value: BreakpointValue | undefined, fallback: number): number {
  if (value === undefined || value === null) {
    return fallback;
  }
  if (typeof value === 'number') {
    return value;
  }

  const breakpoints = Object.keys(value)
    .map(Number)
    .sort((a, b) => a - b);

  if (breakpoints.length === 0) {
    return fallback;
  }

  // 从大到小找到第一个 <= width 的断点
  for (let i = breakpoints.length - 1; i >= 0; i--) {
    if (breakpoints[i] <= width) {
      return value[breakpoints[i]];
    }
  }

  // 没有任何断点 <= width，兜底使用最小断点的值
  return value[breakpoints[0]];
}