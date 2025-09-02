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

### 命名插槽

- 通过`avatar`可以调整头像，通过`name`可以调整昵称，通过`datetime`可以调整日期时间，通过`content`可以
调整聊天内容，通过`actionbar` 可以调整操作按钮，通过`footer` 可以调整 chat 的底部内容。
- 每个插槽都提供 `{ item, index }` 参数，方便获取当前消息数据和索引

{{ chat-footer-slot }}

### 默认插槽

- 使用 `t-chat` 嵌套 `t-chat-message` 遍历聊天列表的方式，提供更灵活的消息渲染控制
- 通过默认插槽自定义整个聊天列表的渲染逻辑
- 支持结构化内容类型：`text`、`markdown`、`thinking` 等
- 灵活配置聊天气泡对齐方式
- 支持配置聊天气泡框样式：基础、线框、文字


{{ chat-with-message }}

### 流式与非流式

{{ sse }}

### AI 助手可拖拽

搭配`Dialog`非模态类对话框对话框组件

{{ chat-drag }}

### AI 助手悬窗

搭配`Drawer` 抽屉组件

{{ chat-drawer }}
