---
title: TagInput 标签输入框
description: 定义：用于输入文本标签。
isComponent: true
spline: data
---

### 基础标签输入框

{{ base }}

### 不同状态的标签输入框

{{ status }}

### 不同主题的标签输入框

使用 `tagProps` 控制标签的所有属性。

{{ theme }}

### 有数量限制的标签输入框

使用 `max` 控制最大标签数量。

{{ max }}

### 可折叠过多标签的标签输入框

- `mincollapsedNum` 用于控制超出这个数量的标签折叠省略显示。
- `collapsedItems` 用于自定义折叠标签呈现方式。

{{ collapsed }}

### 可自定义标签的标签输入框

- `tag` 用于定义单个标签的内容
- `valueDispaly` 用于完全自定义全量标签内容

{{ custom-tag }}
