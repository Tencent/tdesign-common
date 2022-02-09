---
title: SwipeCell 滑动单元格
description: 用来包裹dom元素，实现左滑、或右滑弹出隐藏的操作按钮。
spline: base
isComponent: true
toc: false
---

### 通过直接传入内容或者使用 slot#content 来渲染

{{ content }}

### 是否启用滑动功能

{{ disabled }}

### 左侧菜单

{{ leftMenu }}

### 右侧菜单

{{ rightMenu }}

### 显示状态

{{ btns }}

### 点击事件

{{ event }}

### css 样式

- slot 里面的内容需要自己定义样式
- 当使用 slot 插入按钮时，插槽第一层包裹组件设置了 height: 100%, 但是第二层内容没有设置，为了实现垂直铺满的效果，需要手动设置 style="height:100%"
- 如果是使用 #right 和#left 属性传递按钮数组，可以使用 theme 快速指定菜单背景颜色，theme 取值为 t-button 组件的 theme 取值
