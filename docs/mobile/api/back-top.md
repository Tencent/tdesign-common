---
title: BackTop 返回顶部
description: 用于当页面过长往下滑动时，帮助用户快速回到顶部。
spline: base
isComponent: true
toc: false
---

### 基础用法

基础用法默认为白底圆形，固定在页面右下角，点击后返回页面顶部

{{ base }}

### 返回按钮形状

通过 theme 属性可以设置按钮形状，可选项有 `round` / `half-round` / `round-dark` / `half-round-dark`

通过 `text` 属性可以自定义按钮文案

通过 `icon` 属性可以自定义按钮 icon

{{ theme }}

#### 返回位置

通过 `target` 属性可以自定义页面滚动到某个元素

{{ target }}
