---
title: TDesign MCP
description: A long-term maintained MCP tool provided by TDesign for more efficient and accurate use of TDesign development resources in AI-assisted programming scenarios.
spline: ai
---

TDesign provides a long-term maintained [MCP](https://github.com/modelcontextprotocol) tool that can be activated with simple configuration, enabling more efficient and accurate use of TDesign development resources in AI-assisted programming scenarios.

## How to Install TDesign MCP

In any AI IDE that supports the MCP protocol, add the following configuration to your MCP settings:

```javascript
{
  "mcpServers": {
    // or "servers" (depending on your MCP client)
    "tdesign-mcp-server": {
      "command": "npx",
      "args": ["-y", "tdesign-mcp-server@latest"]
    }
  }
}
```

## How to Use TDesign MCP

TDesign MCP currently includes four built-in tools: `get-component-docs`, `get-component-list`, `get-component-changelog`, and `get-component-dom`. These tools help address various practical needs when using TDesign, including but not limited to assisted code generation, resolving API usage issues, upgrading component library versions, and assisting with code migration.

### Assisted Code Generation

With natural language descriptions, you can quickly write code with the help of TDesign MCP.

<video controls width="100%">
<source src="https://tdesign.gtimg.com/site/mcp/mcp-vibecoding.mp4" type="video/mp4" />
</video>

### Resolving API Usage Issues

By providing more accurate context through TDesign MCP, models can quickly identify issues when using TDesign.

<video controls width="100%">
    <source src="https://tdesign.gtimg.com/site/mcp/mcp-fix.mp4" type="video/mp4" />
</video>

### Upgrading Component Library Versions

By using TDesign MCP to retrieve the changelog of your current TDesign tech stack, you can streamline the TDesign upgrade process and quickly perform targeted regression testing for specific feature updates.

<video controls width="100%">
    <source src="https://tdesign.gtimg.com/site/mcp/mcp-changelog.mp4" type="video/mp4" />
</video>
