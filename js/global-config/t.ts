import { isFunction, isString } from 'lodash-es';

/**
 * 复数规则判断函数
 * @param count 数量
 * @returns 返回复数形式的索引 (0: zero/none, 1: one, 2: other/many)
 */
function getPluralIndex(count: number): number {
  if (count === 0) return 0; // no items
  if (count === 1) return 1; // one item
  return 2; // multiple items
}

/**
 * @see https://github.com/Tencent/tdesign-vue-next/blob/develop/packages/components/config-provider/hooks/useConfig.ts#L48
 * 自定义 t function 可能依赖特定库函数，例如 tdesign-vue-next 中使用了 vue 的 h 函数
 * 因此交由各个类库自行实现
 */

/**
 * 国际化函数，支持复数处理和变量替换
 *
 * 示例用法：
 * 1. 基本变量替换：
 *    t('Hello {name}', { name: 'World' }) // => 'Hello World'
 *
 * 2. 复数处理：
 *    t('no apples | one apple | {count} apples', { count: 0 }) // => 'no apples'
 *    t('no apples | one apple | {count} apples', { count: 1 }) // => 'one apple'
 *    t('no apples | one apple | {count} apples', { count: 5 }) // => '5 apples'
 *
 * 3. 复合使用：
 *    t('no items found | found {count} item | found {count} items', { count: 3 }) // => 'found 3 items'
 *
 * @param pattern 文本模式，可以是字符串、函数或其他类型
 * @param args 参数列表
 * @returns 处理后的文本
 */
export const t = function t<T>(pattern: T, ...args: any[]) {
  const [data] = args;

  if (isString(pattern)) {
    let text = pattern as string;

    // 处理复数形式：支持 "no items | one item | {count} items" 格式
    if (text.includes('|')) {
      const pluralParts = text.split('|').map((part) => part.trim());

      // 如果数据中包含 count 字段，则使用复数处理
      if (data && typeof data.count === 'number') {
        const pluralIndex = getPluralIndex(data.count);

        // 根据复数索引选择对应的文本
        if (pluralIndex < pluralParts.length) {
          text = pluralParts[pluralIndex];
        } else {
          // 如果索引超出范围，使用最后一个选项
          text = pluralParts[pluralParts.length - 1];
        }
      } else {
        // 如果没有 count 字段，默认使用第一个选项
        const [firstPart] = pluralParts;
        text = firstPart;
      }
    }

    // 处理变量替换：{key} 格式
    if (data) {
      const regular = /\{\s*([\w-]+)\s*\}/g;
      text = text.replace(regular, (match, key) => {
        if (data && Object.prototype.hasOwnProperty.call(data, key)) {
          return String(data[key]);
        }
        return match; // 如果找不到对应的键，保留原始占位符
      });
    }

    return text as any;
  }

  // 如果不是字符串或函数，返回空字符串
  return '';
};
