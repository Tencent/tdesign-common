---
title: ChatMessage 对话消息体
description: 用于在聊天对话中显示单个消息项。它可以展示用户的头像、昵称、时间、聊天内容，支持多种消息状态和样式变体。
isComponent: true
usage: { title: '', description: '' }
spline: ai
---

## 基础样式

### 气泡样式

对话消息气泡样式，分为基础、线框、文字，默认为文字

{{ chat-message-base }}

### 可配置角色，头像，昵称，位置

{{ configure }}

### 消息状态

{{ status }}

## 消息内容渲染

### 内置支持的几种消息内容

通过配置 `message type`属性，可以渲染内置的几种消息内容：**文件附件列表**、**思考过程**、**搜索结果**、**建议问题**、**Markdown 格式内容**、**图片**, 通过`chatContentProps`属性来配置对应类型的属性
{{ content }}

### 消息内容自定义

可以通过 `植入插槽content插槽` 的方式实现，以下是自定义渲染`图表`组件的例子：
{{ custom }}

### 消息操作栏

消息底部操作栏，通过`植入插槽 actionbar`的方式实现，可以直接使用`ChatActionBar`组件，也可以完全自定义实现
{{ action }}
