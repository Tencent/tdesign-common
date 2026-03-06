---
title: ChatContent 对话正文
description: ChatContent 用于在聊天对话中渲染不同类型的聊天内容。它支持纯文本和Markdown格式的内容渲染，能够根据内容类型自动选择合适的渲染方式。
isComponent: true
usage: { title: '', description: '' }
spline: ai
---

### 基础用法

对大模型返回的 markdown 数据自动渲染。markdown 会内置调用 `t-chat-markdown` 渲染，同时可根据 role（user/assistant）切换样式。用户发送的消息保持默认格式显示，纯文本会做 HTML 转义并用 rich-text 渲染。

{{ base }}
