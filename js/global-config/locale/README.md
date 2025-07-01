# 国际化函数 t 使用说明

## 概述

`t` 函数是一个支持复数处理和变量替换的国际化函数，特别适用于处理不同数量下的文本显示问题。

## 功能特性

1. **基本变量替换**：支持 `{key}` 格式的变量替换
2. **复数处理**：支持 `choice1 | choice2 | choice3` 格式的复数选择
3. **复合使用**：可以同时使用复数处理和变量替换
4. **函数支持**：保持对原有函数类型的兼容

## 复数规则

- `count = 0`：使用第一个选项（无项目）
- `count = 1`：使用第二个选项（单个项目）
- `count > 1`：使用第三个选项（多个项目）

## 使用示例

### 1. 基本变量替换

```ts
import { t } from './t';

// 简单变量替换
t('Hello {name}', { name: 'World' });
// 输出: "Hello World"

// 多个变量
t('User {id}: {username}', { id: 123, username: 'alice' });
// 输出: "User 123: alice"
```

### 2. 复数处理

```typescript
// 苹果数量示例
t('no apples | one apple | {count} apples', { count: 0 });
// 输出: "no apples"

t('no apples | one apple | {count} apples', { count: 1 });
// 输出: "one apple"

t('no apples | one apple | {count} apples', { count: 5 });
// 输出: "5 apples"
```

### 3. 复合使用（推荐）

```typescript
// 搜索结果示例
t('no items found | found {count} item | found {count} items', { count: 0 });
// 输出: "no items found"

t('no items found | found {count} item | found {count} items', { count: 1 });
// 输出: "found 1 item"

t('no items found | found {count} item | found {count} items', { count: 10 });
// 输出: "found 10 items"
```

### 4. 实际应用场景

```typescript
// 消息通知
t('no messages | {count} message | {count} messages', { count: notifications.length });

// 文件上传
t('no files selected | {count} file selected | {count} files selected', { count: selectedFiles.length });

// 购物车
t('cart is empty | {count} item in cart | {count} items in cart', { count: cartItems.length });

// 评论数量
t('no comments | {count} comment | {count} comments', { count: commentCount });
```

### 5. 边界情况处理

```typescript
// 纯文本（无变量无复数）
t('simple text');
// 输出: "simple text"

// 缺失变量
t('text with {missing} variable', {});
// 输出: "text with {missing} variable" (保留占位符)

// 无 count 的复数格式
t('no data | one item | many items');
// 输出: "no data" (默认第一个选项)
```

## 在语言包中的应用

在现有的语言包中，可以这样使用：

```typescript
// en_US.ts
export default {
  pagination: {
    total: 'no items | 1 item | {count} items',
  },
};
```
