---
title: ChatItem
description: ChatItem 是一个vue组件，它在聊天对话中显示单个item。它可以展示用户的头像、昵称、时间、聊天内容。AI聊天场景下提供模型切换提示，如果消息仍在发送过程中，它还可以显示一个loading效果。
isComponent: true
usage: { title: '', description: '' }
spline: ai
---

### 聊天气泡框

聊天气泡框样式，基础、线框、文字，默认为文字

{{ bubble }}

### 模型切换
- `role`角色：用户、助手、错误、模型切换，可选项：`user/assistant/error/model-change/system`

{{ change-model-message }}

### 错误提示

{{ error-message }}

### 可配置头像，昵称，时间

{{ chat-avatar-name }}

### 自定义头像，昵称，时间，内容，操作按钮样式

- 通过`avatar`可以调整头像，通过`name`可以调整昵称，通过`datetime`可以调整日期时间， 通过`content`可以调整内容(注意`markdown`数据必须通过`t-chat-content`传入`content`属性)， 通过`actions`可以调整操作按钮内容。

- 当role为`assistant`时一般是不显示操作按钮的，所以很多场景下，针对AI助手回复的自定义内容，`t-chat-item`组件可以根据角色role去区分


{{ chat-item-slot }}



