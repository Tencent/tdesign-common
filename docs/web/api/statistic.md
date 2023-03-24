---
title: Statistic 数值显示
description: 突出展示某个或某组数字、带描述的统计类数据。
isComponent: true
usage: { title: '', description: '' }
spline: data
---

### 基础用法

当需要突出某个或某组数字或展示带描述的统计类数据时使用。

{{ base }}

### 前缀后缀/自定义

通过 prefix 和 suffix 插槽可以添加前后缀。通过 styleValue 可以自定义数值显示的样式。

{{ slot }}

### 数值动画

通过 `animatio`  可以开启数值动画。使用 `start`属性可以控制动画开始时刻。
如果有特殊需求时也可以通过ref获取实例，调用`startUp`进行控制。

{{ animation }}

### 加载中

通过 `loading` 可以控制数值的加载状态。

{{ loading }}

### 计时组件

倒计时组件。可以通过 `now` 来传入 `Date.now()`，用于修复初始值显示的小误差问题。

{{ countdown }}
