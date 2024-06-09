---
title: ChatItem
description: ChatItem 是一个vue组件，它在聊天对话中显示单个item。它可以展示用户的头像、昵称、时间、聊天内容。AI聊天场景下提供模型切换提示，如果消息仍在发送过程中，它还可以显示一个loading效果。
isComponent: true
usage: { title: '', description: '' }
spline: data
---

### 聊天气泡框

聊天气泡框样式，基础、线框、文字，默认为文字

{{ bubble }}

### 模型切换
- role角色：用户、助手、错误、模型切换，可选项：user/assistant/error/model-change

{{ change-model-message }}

### 错误提示

{{ error-message }}

### 自定义chatItem

- 包括头像、作者、时间、聊天内容，操作按钮，支持各个模块插槽扩展。注意聊天文本必须通过t-chat-content传入content属性

- 当role为assistant时一般是不显示操作按钮的，所以很多场景下，针对AI助手回复的自定义内容，t-chat-item组件需要根据角色role去区分

{{ chat-item-slot }}



