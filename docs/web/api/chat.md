---
title: Chat
description: 用于AI聊天或者普通聊天。
isComponent: true
usage: { title: '', description: '' }
spline: ai
---

### 基础问答

- chat最基本的组件，包括头像、作者、时间、聊天内容，输入框，适用于各种需要进行聊天的场景。
属性`reverse`置为true倒序渲染，布局采用flex翻转布局`flex-direction: column-reverse;`，实现新消息自动滚动到底部，所以新消息数据要存在消息列表的头部，即数组的第一个元素，可以使用数组的unshift() 方法向数组的开头添加一个或更多新数据
- 如果不想用倒序渲染，请将`reverse`置为false，可以使用数组的push() 方法向数组的尾部添加一个或更多新数据，通过ref调用chat组件的实例方法`scrollToBottom`实现滚动到底部


{{ base }}

### 自定义底部
通过`footer` 可以调整chat的底部内容。

{{ chat-loading }}

### 流式与非流式

{{ sse }}

### AI助手可拖拽
搭配`Dialog`非模态类对话框对话框组件

{{ chat-drag }}

### AI助手悬窗
搭配`Drawer` 抽屉组件

{{ chat-drawer }}

