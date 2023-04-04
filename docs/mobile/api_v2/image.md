---
title: Image 图片
description: 增强版的img标签，提供多种图片填充方式，并且支持图片懒加载、加载中提示、加载失败提示。
spline: base
isComponent: true
toc: false
---

### 基础用法

基础用法和原生 img 标签一样，可以设置 `src`、`alt`、`class` 等原生属性

{{ base }}

### 图片形状

通过 `shape` 属性可以设置图片形状，可选项有 `circle` | `round` | `square`，分别代表圆形、圆角方形、方形

当图片长宽不相等时，无法使用 `circle` 展示一个完整圆形

{{ shape }}

### 组件状态

{{ status }}
