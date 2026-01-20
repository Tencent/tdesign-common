/**
 * 判断是否为 Safari 浏览器
 */
export function isSafari(): boolean {
  if (typeof window === 'undefined' || !window?.navigator) return false;
  const ua = window.navigator.userAgent;
  return /Safari/.test(ua) && !/Chrome/.test(ua);
}
