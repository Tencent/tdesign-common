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

{{ glass }}

通过 `effect="glass"` 启用液态玻璃材质，建议与 `shape="round"` 配合使用。不支持增强效果时，组件会保留可读、可交互的半透明 fallback。原有 `theme="tag"` 悬浮标签栏保留既有布局，并使用半透明的逐项选中背景；使用 `theme="capsule"` 可启用共享移动胶囊选中态。

### 03 自定义

#### 自定义样式

{{ custom }}
