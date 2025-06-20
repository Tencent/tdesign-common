/**
 * 用正则实现模板字符串功能
 * @param str 模板字符串
 * @param vars 取值的对象
 * @returns 替换后的字符串
 */
type varsValue = string | number | string[]; // name(String)、min、max（Number），enums(string[])
export function template<T extends Record<string, varsValue>>(
  str: string,
  vars: T
): string {
  return str.replace(/\${(.*?)}/g, (_, prop: string) => {
    const value = vars[prop.trim()];
    if (Array.isArray(value)) return value.join(',');

    return value === 0 ? '0' : String(value || '');
  });
}
