/**
 * 获取颜色token的色值
 * @example getColorTokenColor('--td-brand-color')
 * @returns string
 */
export const getColorTokenColor = (token: string): string => {
  if (typeof window === 'undefined') return '';
  const targetElement = document?.documentElement;
  const styles = getComputedStyle(targetElement);
  return styles.getPropertyValue(token).trim() ?? '';
};

export default getColorTokenColor;
