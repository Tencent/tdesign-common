---
title: Chat
description: 用于AI聊天或者普通聊天。
isComponent: true
usage: { title: '', description: '' }
spline: data
---

### 对话列表
包括头像、作者、时间、聊天内容，操作按钮，支持各个模块插槽扩展。注意聊天文本必须通过t-chat-text传入content属性

{{ chat-item-slot }}
### 基础问答

chat最基本的组件，包括头像、作者、时间、聊天内容，输入框，适用于各种需要进行聊天的场景。
chat布局采用flex翻转布局，实现新消息自动滚动到底部，所以新消息数据要存在消息列表的头部，即堆栈的顶部

{{ base }}
### 流式与非流式

{{ sse }}
### chat输入框插槽扩展

chat输入框插槽扩展。支持输入框的发送按钮扩展，输入框上方的功能选项扩展

{{ prompt-input }}
### markdown格式聊天

可对回复内容进行相关操作的组件，适用于需要自定义操作列的场景。

{{ operation }}



