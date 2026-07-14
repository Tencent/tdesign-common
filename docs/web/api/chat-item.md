---
title: ChatItem 对话单元
description: ChatItem 用于在聊天对话中显示单个 item。它可以展示用户的头像、昵称、时间、聊天内容。AI 聊天场景下提供模型切换提示，如果消息仍在发送过程中，它还可以显示一个 loading 效果。
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

- 通过`avatar`可以调整头像，通过`name`可以调整昵称，通过`datetime`可以调整日期时间
- 通过`content`可以调整内容，可支持 markdown 原文返回，可通过`t-chat-content`组件传入`content`属性渲染 markdown，也支持别的 markdown 渲染组件，选择其他 markdown 渲染库由用户自行选择安装
- 通过`actions`可以调整操作按钮内容
- 当 role 为`assistant`时一般是不显示操作按钮的，所以很多场景下，针对 AI 助手回复的自定义内容，`t-chat-item`组件可以根据角色 role 去区分

{{ chat-item-slot }}
