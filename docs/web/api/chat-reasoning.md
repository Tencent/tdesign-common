---
title: ChatReasoning
description: 带思维链的markdown渲染。deepseek-reasoner 是 DeepSeek 推出的推理模型。在输出最终回答之前，模型会先输出一段思维链内容，以提升最终答案的准确性。输出字段：reasoning_content：思维链内容，与 content 同级，content：最终回答内容。 详见DeepSeek官网文档。
isComponent: true
usage: { title: '', description: '' }
spline: ai
---

### 基础问答

- 通过`reasoning`属性配置思维链内容

{{ reasoning }}

### 自定义思维链

- 通过`collapsePanelProps`属性可以调整折叠面板头内容，面板头的右侧区域，折叠面板内容折叠面板展开图标

{{ reasoning-custom }}

### 自定义思维链

- 通过`header`插槽可以调整折叠面板头内容，
- 通过`headerRightContent`面板头的右侧区域，
- 通过`expandIcon`折叠面板内容折叠面板展开图标

{{ reasoning-custom-slot }}

### AI助手可拖拽

- 搭配`Dialog`非模态类对话框对话框组件

{{ reasoning-drag }}

### AI助手悬窗

搭配`Drawer` 抽屉组件

{{ reasoning-drawer }}

