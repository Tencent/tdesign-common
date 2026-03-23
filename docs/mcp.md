---
title: TDesign MCP
description: TDesign 提供的长期维护的 MCP 工具， 用于在 AI 辅助编程的场景中更高效、更准确地使用 TDesign 的各种开发资源。
spline: ai
---

TDesign 提供长期维护的 [MCP](https://github.com/modelcontextprotocol) 工具，通过简单的配置即可生效， 用于在 AI 辅助编程的场景中更高效、更准确地使用 TDesign 的各种开发资源。什么是

## 如何安装 TDesign MCP

在任何支持 MCP 协议的 AI IDE 中，将以下配置添加到 MCP 配置中

```javascript
{
  "mcpServers": {
    // 或 servers（根据不同的 MCP 客户端决定）
    "tdesign-mcp-server": {
      "command": "npx",
      "args": ["-y", "tdesign-mcp-server@latest"]
    }
  }
}
```

## 如何使用 TDesign MCP

TDesign MCP 目前内置了四个 tools，分别是 `get-component-docs`、`get-component-list`、`get-component-changelog` 和 `get-component-dom`，用于辅助解决使用 TDesign 过程中的各种实际需求，包括但不限于辅助代码生成、 解决 API 使用问题、 升级组件库版本和 辅助代码迁移等场景。

### 辅助代码生成

通过自然语言描述，可以配合 TDesign MCP 快速进行代码编写。

<video controls width="100%">
<source src="https://tdesign.gtimg.com/site/mcp/mcp-vibecoding.mp4" type="video/mp4" />
</video>

### 解决 API 使用问题

通过 TDesign MCP 提供更准确的上下文，可以辅助模型更快定位到使用 TDesign 的问题

<video controls width="100%">
    <source src="https://tdesign.gtimg.com/site/mcp/mcp-fix.mp4" type="video/mp4" />
</video>

### 升级组件库的版本

通过 TDesign MCP 获取当前使用的 TDesign 技术栈的更新日志，可以辅助解决升级 TDesign 的过程，快速对一些功能升级进行针对性回归。

<video controls width="100%">
    <source src="https://tdesign.gtimg.com/site/mcp/mcp-changelog.mp4" type="video/mp4" />
</video>
