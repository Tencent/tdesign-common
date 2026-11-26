---
title: Split 分割面板
description: 分割面板用于将区域划分为多个可调整尺寸的面板，适用于工作台、编辑器和复杂信息布局。
isComponent: true
usage: { title: '', description: '' }
spline: layout
---

### 基础分割面板

通过拖拽面板之间的分割条，可以调整相邻面板的尺寸。

{{ base }}

### 分割方向

分割面板支持水平排列和垂直排列两种方向。

{{ direction }}

### 尺寸与拖拽约束

通过 `defaultSize` 设置初始尺寸，通过 `min`、`max` 和 `resizable` 控制面板的拖拽范围及是否允许调整。

{{ limit }}

### 延迟渲染

开启 `lazy` 后，拖拽过程中仅移动分割条，结束拖拽时再更新面板尺寸，适用于面板内容渲染成本较高的场景。

{{ lazy }}

### 实例方法

通过组件实例提供的 `getSizes`、`setSizes` 和 `reset` 方法读取或调整面板尺寸。

{{ instance }}
