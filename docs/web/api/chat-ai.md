---
title: ChatAI
description: 用于AI大模型聊天。
isComponent: true
usage: { title: '', description: '' }
spline: ai
---

### hunyuan 大模型&快速接入
下面是一个开箱即用的 hunyuan 大模型流式调用示例,默认支持`单轮对话`

### hunyuan Key 申请
首先你要去申请 key，[开通并获取 API-Key](https://hunyuanaide.taiji.woa.com/web/home_api?wsId=10144)

### hunyuan 大模型最佳实践

前端传入 apiKey 参数，直接调用 hunyuan 的 api 流式接口服务。该用法仅用于快速体验组件效果，在前端明文传递密钥并不是一种推荐的做法，主要存在安全风险问题。
为了避免安全风险，推荐由业务侧传入代理的大模型接口服务请求，前端按照指定的出参格式返回数据，使用`chatRequest`传入流式接口请求，组件内部会根据    hunyuan 流式接口数据结构去解析
{{ chat-ai }}
### 入参设计

这是 hunyuan 的大模型入参，可以看到参数非常多，组件内不关注 hunyuan 大模型接口的参数，由业务侧自定义模型配置选项，第一个参数 messages ，当前对话的上下文，里面 role 和 content 是最关键的
```js
/**
 * ChatRequest是一个函数类型，表示对聊天API的请求。
 * 它接受ChatRequestParams对象并返回一个Promise，该Promise在解析时返回一个Response对象。
 */
export type ChatRequest = (params: ChatRequestParams ) => Promise<Response>;
export interface ChatRequestParams {
  messages: message[]; // 消息列表
  signal?: AbortSignal; // 中止请求
}
/**
 * 表示聊天消息对象的角色和提问内容。
 */
export interface message {
  role: string;
  content: string;
}

```

### hunyuan 大模型配置参数如下：

```json
{
  "Model": "hunyuan",
  "Messages": [
    {
      "role": "user",
      "content": "hi "
    }
  ],
  "Stream": true,
  "StreamModeration": null,
  "TopP": null,
  "Temperature": null,
  "EnableEnhancement": null
}
```
