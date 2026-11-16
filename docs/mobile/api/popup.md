---
title: Popup 弹出层
description: 由其他控件触发，屏幕滑出或弹出一块自定义内容区域。
spline: message
isComponent: true
toc: false
---

### 01 组件类型

#### 基础弹出层

{{ base }}

### 02 组件示例

#### 应用示例

{{ with-title }}

{{ custom-close }}

### 03 嵌套弹窗

#### 多层 Popup 嵌套使用

{{ nested }}

## 宽屏适配

顶部和底部弹出层默认保持全宽。可通过可选参数 `maxWidth` 限制最大宽度并水平居中，适用于平板、折叠屏和横屏等场景。建议设置为 `600px`，窄屏下仍保持全宽。

`maxWidth` 支持数字（单位为 `px`）和 CSS 长度字符串。不传该参数时保留原有布局；设置为 `none` 时不限制宽度。该参数仅对顶部和底部弹出层生效，左侧、右侧和居中弹出层不受影响。

#### 自定义最大宽度

{{ max-width }}
