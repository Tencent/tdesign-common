import { describe, expect, it, vi } from 'vitest';
import { t } from '../../../js/global-config/t';

describe('国际化函数 t', () => {
  describe('基本变量替换', () => {
    it('应该正确替换单个变量', () => {
      expect(t('Hello {name}', { name: 'World' })).toBe('Hello World');
    });

    it('应该正确替换多个变量', () => {
      expect(t('User {id}: {username}', { id: 123, username: 'alice' })).toBe('User 123: alice');
    });

    it('应该正确处理变量名包含连字符', () => {
      expect(t('Hello {user-name}', { 'user-name': 'John' })).toBe('Hello John');
    });

    it('应该正确处理变量周围有空格', () => {
      expect(t('Hello { name }', { name: 'World' })).toBe('Hello World');
    });

    it('当变量不存在时应该保留原始占位符', () => {
      expect(t('text with {missing} variable', {})).toBe('text with {missing} variable');
    });

    it('当没有传入数据时应该保留原始占位符', () => {
      expect(t('Hello {name}')).toBe('Hello {name}');
    });

    it('应该将变量值转换为字符串', () => {
      expect(t('Number: {num}', { num: 42 })).toBe('Number: 42');
      expect(t('Boolean: {flag}', { flag: true })).toBe('Boolean: true');
    });
  });

  describe('复数处理', () => {
    it('当 count = 0 时应该使用第一个选项', () => {
      expect(t('no apples | one apple | {count} apples', 0)).toBe('no apples');
    });

    it('当 count = 1 时应该使用第二个选项', () => {
      expect(t('no apples | one apple | {count} apples', 1)).toBe('one apple');
    });

    it('当 count > 1 时应该使用第三个选项', () => {
      expect(t('no apples | one apple | {count} apples', 5)).toBe('5 apples');
      expect(t('no apples | one apple | {count} apples', 100)).toBe('100 apples');
    });

    it('当没有 count 字段时应该使用第一个选项', () => {
      expect(t('no data | one item | many items')).toBe('no data');
      expect(t('no data | one item | many items', {})).toBe('no data');
    });

    it('当复数选项数量不足时应该使用最后一个选项', () => {
      expect(t('zero | many', 0)).toBe('zero');
      expect(t('zero | many', 1)).toBe('many');
      expect(t('zero | many', 5)).toBe('many');
    });

    it('应该正确处理复数选项前后的空格', () => {
      expect(t(' no items |  one item  | many items ', 0)).toBe('no items');
      expect(t(' no items |  one item  | many items ', 1)).toBe('one item');
      expect(t(' no items |  one item  | many items ', 5)).toBe('many items');
    });
  });

  describe('复合使用（复数 + 变量替换）', () => {
    it('应该正确处理复数选择和变量替换的组合', () => {
      expect(t('no items found | found {count} item | found {count} items', 0)).toBe('no items found');
      expect(t('no items found | found {count} item | found {count} items', 1, { count: 1 })).toBe('found 1 item');
      expect(t('no items found | found {count} item | found {count} items', 3, { count: 3 })).toBe('found 3 items');
    });

    it('应该正确处理只传入 count 的情况', () => {
      expect(t('no items | one item | {count} items', 0)).toBe('no items');
      expect(t('no items | one item | {count} items', 1)).toBe('one item');
      expect(t('no items | one item | {count} items', 5)).toBe('5 items');
      expect(t('no items | one item | items', 5)).toBe('items');
    });

    it('应该正确处理包含其他变量的复数文本', () => {
      expect(t('no {type} | one {type} ({count}) | {count} {type}s', 0, { type: 'file' })).toBe('no file');
      expect(t('no {type} | one {type} ({count}) | {count} {type}s', 1, { count: 1, type: 'file' })).toBe(
        'one file (1)'
      );
      expect(t('no {type} | one {type} ({count}) | {count} {type}s', 5, { count: 5, type: 'file' })).toBe('5 files');
    });
  });

  describe('纯文本处理', () => {
    it('应该直接返回纯文本', () => {
      expect(t('simple text')).toBe('simple text');
      expect(t('Hello World')).toBe('Hello World');
    });

    it('应该处理空字符串', () => {
      expect(t('')).toBe('');
    });
  });

  describe('边界情况和错误处理', () => {
    it('应该处理 null 和 undefined', () => {
      expect(t(null as any)).toBe('');
      expect(t(undefined as any)).toBe('');
    });

    it('应该处理数字类型', () => {
      expect(t(123 as any)).toBe('');
    });

    it('应该处理布尔类型', () => {
      expect(t(true as any)).toBe('');
      expect(t(false as any)).toBe('');
    });

    it('应该处理对象类型', () => {
      expect(t({} as any)).toBe('');
      expect(t({ key: 'value' } as any)).toBe('');
    });

    it('应该处理数组类型', () => {
      expect(t([] as any)).toBe('');
      expect(t(['item'] as any)).toBe('');
    });

    it('应该处理复杂的变量名', () => {
      expect(t('Hello {user_name}', { user_name: 'John' })).toBe('Hello John'); // 下划线支持
      expect(t('Hello {user-name}', { 'user-name': 'John' })).toBe('Hello John'); // 连字符支持
      expect(t('Hello {userName}', { userName: 'John' })).toBe('Hello John'); // 驼峰支持
    });
  });

  describe('实际应用场景', () => {
    it('搜索结果场景', () => {
      const pattern =
        'Search "{result}". Found no items. | Search "{result}". Found 1 item. | Search "{result}". Found {count} items.';
      const getSearchResultText = (count: number, result: string) => t(pattern, count, { count, result });

      expect(getSearchResultText(0, 'apple')).toBe('Search "apple". Found no items.');
      expect(getSearchResultText(1, 'apple')).toBe('Search "apple". Found 1 item.');
      expect(getSearchResultText(5, 'apple')).toBe('Search "apple". Found 5 items.');
    });
  });
});
