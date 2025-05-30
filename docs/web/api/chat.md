---
title: Chat
description: 用于 ChatBot 对话或者普通对话场景的组件。
isComponent: true
usage: { title: "", description: "" }
spline: ai
---

### 基础问答

- chat 最基本的组件，包括头像、作者、时间、聊天内容，输入框，适用于各种需要进行聊天的场景。
  属性`reverse`置为 true 倒序渲染，布局采用 flex 翻转布局`flex-direction: column-reverse;`，实现新消息自动滚动到底部，所以新消息数据要存在消息列表的头部，即数组的第一个元素，可以使用数组的 unshift() 方法向数组的开头添加一个或更多新数据
- 如果不想用倒序渲染，请将`reverse`置为 false，可以使用数组的 push() 方法向数组的尾部添加一个或更多新数据，通过 ref 调用 chat 组件的实例方法`scrollToBottom`实现滚动到底部

{{ base }}

### 自定义

- 通过`avatar`可以调整头像，通过`name`可以调整昵称，通过`datetime`可以调整日期时间，通过`content`可以调整聊天内容，通过`actions` 可以调整操作按钮，通过`footer` 可以调整 chat 的底部内容。

{{ chat-footer-slot }}

### 流式与非流式

{{ sse }}

### AI 助手可拖拽

搭配`Dialog`非模态类对话框对话框组件

{{ chat-drag }}

### AI 助手悬窗

搭配`Drawer` 抽屉组件

{{ chat-drawer }}
