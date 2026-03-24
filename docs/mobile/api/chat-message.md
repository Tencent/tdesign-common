---
title: ChatMessage 对话消息体
description: 用于在聊天对话中显示单个消息项。它可以展示用户的头像、昵称、时间、聊天内容，支持多种消息状态和样式变体。
isComponent: true
usage: { title: '', description: '' }
spline: ai
---

### 基础类型

{{ base }}

### 可配置昵称、头像、对齐方式

{{ configure }}

### 配置消息属性

支持`avatar`，`name`，`datetime`，`content`插槽自定义，`content`插槽使用建议：渲染聊天消息统一用 `t-chat-content`；仅在需要"单独使用 Markdown 组件"时使用 `t-chat-markdown`。也支持别的 markdown 渲染组件，选择其他 markdown 渲染库由用户自行安装。

{{ content }}

### 加载状态

{{ status }}

### 出错状态

{{ error }}

### 气泡样式

{{ style }}
