---
title: ChatReasoning
description: 带思维链的markdown渲染。
isComponent: true
usage: { title: '', description: '' }
spline: ai
---

### 基础问答

带思维链的对大模型返回的markdown数据自动渲染。
- 通过`reasoning`属性配置思维链内容

{{ reasoning }}

### 自定义思维链

- 通过`collapsePanelProps`属性或者slot插槽可以调整折叠面板头内容，面板头的右侧区域，折叠面板内容折叠面板展开图标

{{ reasoning-custom }}

### AI助手可拖拽

- 搭配`Dialog`非模态类对话框对话框组件

{{ reasoning-drag }}

### AI助手悬窗

搭配`Drawer` 抽屉组件

{{ reasoning-drawer }}

