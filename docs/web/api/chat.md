---
title: Chat
description: 用于AI聊天或者普通聊天。
isComponent: true
usage: { title: '', description: '' }
spline: data
---

### 基础问答

chat最基本的组件，包括头像、作者、时间、聊天内容，输入框，适用于各种需要进行聊天的场景。
chat布局采用flex翻转布局flex-direction: column-reverse;，实现新消息自动滚动到底部，所以新消息数据要存在消息列表的头部，即数组的第一个元素，可以使用数组的unshift() 方法向数组的开头添加一个或更多元素

{{ base }}

### 自定义问答
包括头像、作者、时间、聊天内容，操作按钮，支持各个模块插槽扩展。注意聊天文本必须通过t-chat-content传入content属性，role字段表示角色，有user、assistant，error，modelchange，当role为assistant时一般是不显示操作按钮的，所以t-chat-item组件的action的插槽需要自己去写条件判断

{{ chat-item-slot }}

### 流式与非流式

{{ sse }}
### chat输入框自定义

chat输入框插槽扩展。支持输入框的发送按钮扩展，输入框上方的功能选项扩展

{{ prompt-input }}
### markdown格式聊天

可对回复内容进行相关操作的组件，适用于需要自定义操作列的场景。

{{ markdown }}
### hunyuan大模型最佳实践

内置混元api服务。可通过传入model模型:hunyuan|hunyuan-13B|hunyuan-lite|hunyuan-vision，apiKey参数，直接调用hunyuan的api流式接口服务

{{ chat-ai }}

### AI助手可拖拽

{{ chat-drag }}

