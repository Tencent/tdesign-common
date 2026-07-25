---
title: TabBar 底部标签栏
description: 用于在不同功能模块之间进行快速切换，位于页面底部。
spline: navigation
isComponent: true
toc: false
---

## 代码演示

### 01 组件类型

#### 纯文本标签栏

{{ text }}

#### 图标加文字标签栏

{{ base }}

#### 纯图标标签栏

{{ pure-icon }}

#### 双层级纯文本标签栏

{{ text-spread }}

### 02 组件样式

#### 弱选中标签栏

{{ badge-props }}

#### 悬浮胶囊标签栏

{{ round }}

#### 液态玻璃材质

通过 `effect="glass"` 启用液态玻璃材质。该效果不会改变 `shape`、固定定位、安全区或占位行为；不支持增强效果时自动保留可读的半透明背景、边框和阴影。

建议与 `shape="round"` 组合使用，以获得屏幕内缩的悬浮胶囊、紧凑的图标文字排布和同心选中态；`shape="normal"` 继续保留全宽矩形布局。

可通过 `--td-tab-bar-glass-bg-color`、`--td-tab-bar-glass-border-color` 和 `--td-tab-bar-glass-shadow` 调整稳定的材质样式；`--td-tab-bar-glass-fallback-blur` 控制 SVG 增强不可用时的高斯模糊半径。圆角 TabBar 的选中态胶囊由 `--td-tab-bar-selected-bg-color` 和 `--td-tab-bar-selected-bg-opacity` 控制，后者使用百分比。折射强度与纹理参数属于内部实现，不作为首版 API 提供。

### 03 自定义

#### 自定义样式

{{ custom }}
