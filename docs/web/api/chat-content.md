---
title: ChatContent
description: 支持markdown渲染。
isComponent: true
usage: { title: '', description: '' }
spline: ai
---

### 默认聊天格式

对大模型返回的markdown数据自动渲染。
自定义复制功能需通过`copyCode`属性传入模版字符串可以定制复制按钮样式，复制功能由业务侧使用Clipboard库来实现。
{{ markdown }}

### 纯文本聊天

用户发送的消息保持默认格式显示，没有高亮效果

{{ text-message }}

