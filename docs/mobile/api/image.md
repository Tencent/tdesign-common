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

#### 填充模式

通过 `fit` 属性可以设置图片填充模式，可选项有 `contain` | `cover` | `fill` | `none` | `scale-down`，效果与原生的 `object-fit` 属性一致

{{ fit }}

#### 图片位置

通过 `position` 属性可以设置图片位置，效果与原生的 `object-position` 属性一致

{{ position }}

#### 图片懒加载

通过lazy属性来开启图片懒加载

{{ lazy }}

### 加载中提示

Image 组件提供了默认的加载中提示，也支持通过 `loading` 插槽自定义提示内容

{{ loading }}

### 加载失败提示

Image 组件提供了默认的加载失败提示，也支持通过 `error` 插槽自定义提示内容

{{ error }}
