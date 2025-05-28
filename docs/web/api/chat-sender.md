---
title: ChatSender
description: 用于 AI 聊天的输入框，可以扩展模型、多模态等能力。
isComponent: true
usage: { title: "", description: "" }
spline: ai
---

### 基础输入框

受控进行输入/发送等状态管理

{{ chat-sender-base }}

### 附件输入

支持选择附件及展示附件列表，受控进行文件数据管理，示例中模拟了文件上传流程

{{ chat-sender-attachments }}

### 输入框自定义

通过`prefix`,`suffix` 可以调整输入框左下角，右下角区域内容扩展。

{{ chat-sender-slot }}