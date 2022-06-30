---
title: PullDownRefresh 下拉刷新
description: 用于快速刷新页面信息，刷新可以是整页刷新也可以是页面的局部刷新。
spline: base
isComponent: true
toc: false
---

### 基础用法

下拉刷新会触发refresh事件

{{ base }}

### 自定义文案和loading属性

通过loadingTexts属性可以自定义多个状态的文案，默认值为['下拉刷新', '松手刷新', '正在刷新', '刷新完成']

通过loadingBarHeight属性可以自定义下拉区域高度，默认为50px

通过maxBarHeight属性可以自定义最大下拉高度，默认为80px

通过loadingProps属性可以自定义loading图标的属性

{{ loading-texts }}

### 超时事件

通过refreshTimeout属性可以自定义加载超时时间，默认为3000ms。超时后会触发timeout事件，可传入回调函数

{{ timeout }}
