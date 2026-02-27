---
title: ChatEngine 对话引擎
description: 智能体对话底层逻辑引擎，提供灵活的 Hook API 用于深度定制。
isComponent: true
spline: navigation
---

## 阅读指引

ChatEngine 是一个底层对话引擎（Headless Core），提供灵活的 Hook API 用于深度定制。支持自定义 UI 结构、消息处理和 AG-UI 协议，适合构建复杂智能体应用，如工具调用、多步骤任务规划、状态流式传输等场景，相比 Chatbot 组件提供了更高的灵活性，适合需要**深度定制 UI 结构和消息处理流程**的场景。Chatbot 组件本身也是基于 ChatEngine 构建的 (ChatEngine + Preset UI)。

建议按以下路径循序渐进阅读:

1. **快速开始** - 了解 useChat Hook 的基本用法，组合组件构建对话界面的方法
2. **基础用法** - 掌握数据处理、消息管理、UI 定制、生命周期、自定义渲染等主要功能
3. **AG-UI 协议** - 学习 AG-UI 协议的使用和高级特性（工具调用、状态订阅等）

> 💡 **示例说明**：所有示例都基于 Mock SSE 服务，可以打开浏览器开发者工具（F12），切换到 Network（网络）标签，查看接口的请求和响应数据，了解数据格式。

## 快速开始

最简单的示例，使用 `useChat` Hook 创建对话引擎，组合 `ChatList`、`ChatMessage`、`ChatSender` 组件构建对话界面。

{{ basic }}

## 基础用法

### 初始化消息

使用 `defaultMessages` 设置静态初始化消息，或通过 `chatEngine.setMessages` 动态加载历史消息。
{{ initial-messages }}

### 数据处理

`chatServiceConfig` 是 ChatEngine 的核心配置，控制着与后端的通信和数据处理，是连接前端组件和后端服务的桥梁。作用包括

- **请求配置** (endpoint、onRequest 设置请求头、请求参数)
- **数据转换** (onMessage：将后端数据转换为组件所需格式)
- **生命周期回调** (onStart、onComplete、onError、onAbort)。

根据后端服务协议的不同，又有两种配置方式：

- **自定义协议**：当后端使用自定义数据格式时，往往不能按照前端组件的要求来输出，这时需要通过 `onMessage` 进行数据转换。
- **AG-UI 协议**：当后端服务符合 [AG-UI 协议] 时，只需设置 `protocol: 'agui'`，无需编写 `onMessage` 进行数据转换，大大简化了接入流程。详见下方 [AG-UI 协议] 章节。

这部分的配置用法与 Chatbot 中一致，示例可以参考 [Chatbot 数据处理] 章节。

### 实例方法

通过 `chatEngine` 调用[各种方法](#chatengine-实例方法)控制组件行为（消息设置、发送管理等）。
{{ instance-methods }}

### 自定义渲染

使用**动态插槽机制**实现自定义渲染，包括自定义`内容渲染`、自定义`操作栏`、自定义`输入区域`。

- **自定义内容渲染**：如果需要自定义消息内容的渲染方式，可以按照以下步骤实现：
  - 1. 扩展类型：通过 TypeScript 声明自定义内容类型
  - 2. 解析数据：在 `onMessage` 中返回自定义类型的数据结构
  - 3. 监听变化：通过 `onMessageChange` 监听消息变化并同步到本地状态
  - 4. 植入插槽：循环 `messages` 数组，使用 `slot = ${content.type}-${index}` 属性来渲染自定义组件

- **自定义操作栏**：如果组件库内置的 [`ChatActionbar`]不能满足需求，可以通过 `slot='actionbar'` 属性来渲染自定义组件。

- **自定义输入区域**：如果需要自定义ChatSender输入区，可用插槽详见[ChatSender插槽]

{{ custom-content }}

### 综合示例

在了解了以上各个基础属性的用法后，这里给出一个完整的示例，展示如何在生产实践中综合使用多个功能：初始消息、消息配置、数据转换、请求配置、实例方法和自定义插槽。

{{ comprehensive }}

## Headless 事件总线

ChatEngine 内置了事件总线（EventBus），支持在无 UI 场景下进行事件分发，适用于日志监控、跨组件通信、外部系统集成等场景。[支持的事件类型]
{{ headless-eventbus }}

## AG-UI 协议

[AG-UI（Agent-User Interface)](https://docs.ag-ui.com/introduction) 是一个专为 AI Agent 与前端应用交互设计的轻量级协议，专注于实时交互、状态流式传输和人机协作。ChatEngine 内置了对 AG-UI 协议的支持，可以**无缝集成符合 AG-UI 标准的后端服务**。

### 基础用法

开启 AG-UI 协议支持（`protocol: 'agui'`），组件会自动解析标准事件类型（如 `TEXT_MESSAGE_*`、`THINKING_*`、`TOOL_CALL_*`、`ACTIVITY_*`、`STATE_*` 等）。使用`AGUIAdapter.convertHistoryMessages`方法即可实现符合[`AGUIHistoryMessage`](https://github.com/TDesignOteam/tdesign-web-components/blob/develop/src/chat-engine/adapters/agui/types.ts)数据结构的历史消息回填。

{{ agui-basic }}

### 工具调用

AG-UI 协议支持通过 `TOOL_CALL_*` 事件让 AI Agent 调用前端工具组件，实现人机协作。

> **协议兼容性说明**：`useAgentToolcall` 和 `ToolCallRenderer` 本身是协议无关的，它们只依赖 [ToolCall 数据结构](#toolcall-对象结构)，不关心数据来源。AG-UI 协议的优势在于自动化（后端直接输出标准 `TOOL_CALL_*` 事件），普通协议需要在 `onMessage` 中手动将后端数据转换为 `ToolCall` 结构。通过适配器可以降低手动转换的复杂度。

#### 核心 Hook 与组件

ChatEngine 围绕工具调用提供了几个核心 Hook，它们各司其职，协同工作：

- **`useAgentToolcall` Hook**：注册工具配置（元数据、参数、UI 组件），相比传统的自定义渲染方式，提供了高度内聚的配置、统一的 API 接口、完整的类型安全和更好的可移植性。详见 API 下方[常见问题]
- **`ToolCallRenderer` 组件**：工具调用的统一渲染器，负责根据工具名称查找对应的配置，解析参数，管理状态并渲染注册的 UI 组件。使用时只需传入 `toolCall` 对象即可自动完成渲染

#### 使用流程

1. 使用 `useAgentToolcall` 注册工具配置（元数据、参数、UI 组件）
2. 在消息渲染时使用 `ToolCallRenderer` 组件渲染工具调用
3. `ToolCallRenderer` 自动查找配置、解析参数、管理状态、渲染 UI

#### 基础示例

一个模拟图片生成助手的 Agent，展示工具调用和状态订阅的核心用法：

- **工具注册**：使用 `useAgentToolcall` 注册 `generate_image` 工具
- **状态订阅**：使用注入的 `agentState` 参数来订阅图片生成进度（preparing → generating → completed/failed）
- **进度展示**：实时显示生成进度条和状态信息
- **结果呈现**：生成完成后展示图片
- **推荐问题**：通过返回`toolcallName: 'suggestion'`，可以无缝对接内置的推荐问题组件

{{ agui-toolcall }}

### 工具状态订阅

在 AG-UI 协议中，除了工具组件内部需要展示状态，有时我们还需要在**对话组件外部的 UI**（如页面顶部的进度条、侧边栏的任务列表等）中订阅和展示工具执行状态。Agent 服务是通在工具调用过程中增加`STATE_SNAPSHOT` 和 `STATE_DELTA` 事件来实现状态变更、快照的流式传输。

为了方便旁路 UI 组件订阅状态，可以使用 `useAgentState` 来获取状态数据，实时渲染任务执行进度和状态信息。比如要在页面顶部显示当前任务的执行进度，不在对话流中展示， 可以这样实现。

```javascript
// 外部进度面板组件
const GlobalProgressBar: React.FC = () => {
  // 使用 useAgentState 订阅状态
  const { stateMap, currentStateKey } = useAgentState();

  /* 后端通过 STATE_SNAPSHOT 和 STATE_DELTA 事件推送状态数据，模拟数据如下：
  //
  // STATE_SNAPSHOT（初始快照）：
  // data: {"type":"STATE_SNAPSHOT","snapshot":{"task_xxx":{"progress":0,"message":"准备开始规划...","items":[]}}}
  //
  // STATE_DELTA（增量更新，使用 JSON Patch 格式）：
  // data: {"type":"STATE_DELTA","delta":[
  //   {"op":"replace","path":"/task_xxx/progress","value":20},
  //   {"op":"replace","path":"/task_xxx/message","value":"分析目的地信息"},
  //   {"op":"replace","path":"/task_xxx/items","value":[{"label":"分析目的地信息","status":"running"}]}
  // ]}
  */

  // useAgentState 内部会自动处理这些事件，将 snapshot 和 delta 合并到 stateMap 中

  // 获取当前任务状态
  const currentState = currentStateKey ? stateMap[currentStateKey] : null;

  // items 数组包含任务的各个步骤信息
  // 每个 item 包含：label（步骤名称）、status（状态：running/completed/failed）
  const items = currentState?.items || [];
  const completedCount = items.filter((item: any) => item.status === 'completed').length;

  return (
    <div>
      <div>进度：{completedCount}/{items.length}</div>
      {items.map((item: any, index: number) => (
        <div key={index}>
          {item.label} - {item.status}
        </div>
      ))}
    </div>
  );
};
```

当多个外部组件需要访问同一份状态时，使用 Provider 模式。通过使用 `AgentStateProvider` + `useAgentStateContext` 来共享状态

完整示例请参考下方 [综合示例](#综合示例) 演示。

### Activity 事件

AG-UI 协议支持通过 `ACTIVITY_*` 事件展示动态内容组件（如实时图表、进度条等）。Activity 专注于**纯展示场景**，通过 `ACTIVITY_SNAPSHOT` 初始化数据，`ACTIVITY_DELTA` 增量更新。

- **`useAgentActivity`**：注册 Activity 配置（类型、UI 组件）
- **`ActivityRenderer`**：根据 `activityType` 自动匹配并渲染组件
- **事件流程**：`ACTIVITY_SNAPSHOT` → `ACTIVITY_DELTA` → `ACTIVITY_DELTA`...

{{ agui-activity }}

### 综合示例

模拟一个完整的**旅游规划 Agent 场景**，演示了如何使用 AG-UI 协议构建复杂的**多步骤任务规划**应用。先收集用户偏好（Human-in-the-Loop），然后根据用户提交的偏好依次执行：查询天气、展示规划步骤的工具调用，同时展示实时数据（如股票图表、进度条等 Activity），最后总结生成最终计划

**核心特性：**

- **完整事件体系**：展示 AG-UI 协议的所有事件类型，包括 `TEXT_MESSAGE_*`、`THINKING_*`、`TOOL_CALL_*`、`ACTIVITY_*`、`STATE_*` 等
- **多步骤流程**：支持分步骤执行复杂任务（如旅游规划）
- **状态流式传输**：实时更新应用状态，支持状态快照和增量更新
- **Human-in-the-Loop**：支持人机协作，在流程中插入用户输入环节
- **工具调用**：集成外部工具调用，如天气查询、行程规划等
- **Activity 展示**：支持动态内容展示，如实时图表、进度条等
- **外部状态订阅**：演示如何在对话组件外部订阅和展示工具执行状态

{{ agui-comprehensive }}
