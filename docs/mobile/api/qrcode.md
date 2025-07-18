---
title: QRCode 二维码
description: 二维码能够将文本转换生成二维码的组件，支持自定义配色和 Logo 配置。
spline: base
isComponent: true
toc: false
---

### 基本用法

{{ base }}

### 带 Icon 的例子
带 Icon 的二维码。

{{ icon }}

### 不同的状态
可以通过 status 的值控制二维码的状态，提供了 active、expired、loading、scanned 四个值

{{ status }}

### 自定义状态渲染器
可以通过 statusRender 的值控制二维码不同状态的渲染逻辑。

{{ status-render }}


### 自定义渲染类型
通过设置 type 自定义渲染结果，提供 canvas 和 svg 两个选项。

{{ type }}

### 自定义颜色
通过设置 color 自定义二维码颜色，通过设置 bgColor 自定义背景颜色。

{{ color }}

### 自定义尺寸
自定义尺寸。

{{ size }}


### 下载二维码
下载二维码的简单实现。

{{ download }}

### 纠错比例
通过设置 level 调整不同的容错等级。

{{ level }}
