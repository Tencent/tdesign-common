---
title: Scrollbar 滚动条
description: 用自绘滚动条替代原生滚动条，可自定义显示时机、滑块尺寸与滚动步长。
isComponent: true
usage: { title: '', description: '' }
spline: layout
---

### 基本用法

通过 `container` 设置滚动容器的高度，内容超出容器后滚动条自动出现，拖动滑块或滚动滚轮即可查看全部内容。

{{ base }}

### 水平滚动

内容宽度超出容器时，出现水平滚动条。

{{ horizontal }}

### 尺寸控制

`container` 支持 `height`、`maxHeight`、`width`、`maxWidth`。设置为 `height` 时容器高度固定；设置为 `maxHeight` 时容器高度随内容自适应，内容超出后才出现滚动条。

{{ container }}

### 自适应尺寸

`autoresize` 控制容器尺寸是否随内容变化，默认开启；关闭后容器尺寸固定，内容不足时留白。

{{ autoresize }}

### 显示形式

`visibility` 控制滚动条的显示时机，可选 `hover`（悬浮显示）、`always`（常驻显示）、`hide`（始终隐藏）。`autoExpand` 控制悬浮或拖动滑块时轨道是否向外扩展，以增大交互热区。

{{ visibility }}

### 滚动步长

`step` 同时作用于方向键与滚轮。滚动容器需要设置 `tabindex` 才能被聚焦并响应键盘滚动。

{{ step }}

### 实例方法

组件实例提供 `scrollTo`、`scrollToEdge`、`getValues` 三个方法，分别用于滚动到指定坐标、滚动到某一边、获取滚动信息，其中 `left`、`top` 为滑块相对轨道的偏移量。

{{ methods }}

### 禁止滚动

`disabled` 为 `true` 时隐藏滚动条，滚轮、键盘与滑块均不可滚动。

{{ disabled }}
