---
title: ChatList 对话列表
description: 用于展示对话或者普通对话场景的组件。
isComponent: true
usage: { title: '', description: '' }
spline: ai
---

### 基础问答

- chat 最基本的组件，包括头像、作者、时间、聊天内容，输入框，适用于各种需要进行聊天的场景。
- 支持新消息自动滚动到底部，自动检测用户滚动行为，当用户主动滚动时暂停自动滚动

{{ base }}

### 具名插槽

- 通过`avatar`可以调整头像，通过`name`可以调整昵称，通过`datetime`可以调整日期时间，通过`content`可以
  调整聊天内容，通过`actionbar` 可以调整操作按钮，通过`footer` 可以调整 chat 的底部内容。
- 每个插槽都提供 `{ item, index }` 参数，方便获取当前消息数据和索引

{{ chat-footer-slot }}

### 默认插槽

- 使用 `t-chat-list` 嵌套 `t-chat-message` 遍历聊天列表的方式，提供更灵活的消息渲染控制
- 通过默认插槽自定义整个聊天列表的渲染逻辑
- 支持结构化内容类型：`text`、`markdown`、`thinking` 等
- 灵活配置聊天气泡对齐方式
- 支持配置聊天气泡框样式：基础、线框、文字

{{ chat-with-message }}

### AI 助手可拖拽

搭配`Dialog`非模态类对话框对话框组件

{{ chat-drag }}

### AI 助手悬窗

搭配`Drawer` 抽屉组件

{{ chat-drawer }}
