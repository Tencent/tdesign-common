---
title: Descriptions 描述
description: 一般用于详情页的信息展示。
isComponent: true
usage: { title: '', description: '' }
spline: layout
---

### 基础

{{ base }}

### 边框

{{ bordered	}}

### 标签引号

{{ colon }}

### 模式
- `fixed`: 使用固定表格布局算法。此模式下，每列的宽度按以下方式确定：
  - 使用显示设定的列宽度
  - 否则，使用第一行中显示设定的的单元格宽度作为对应列的宽度
  - 否则，均分剩余宽度

- `auto`: 使用自动表格布局算法。表格及其单元格的宽度会根据内容进行调整。

{{ mode }}

### 布局方式

{{ layout }}

### 自定义列数量

{{ column }}

### 自定义样式

{{ custom-style }}

### 嵌套使用

{{ nest }}