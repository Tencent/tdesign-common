---
title: Captcha 验证码
description: 通过滑块拼图交互完成真人校验，适用于登录、注册、提交等移动端风险控制场景。
spline: form
isComponent: true
toc: false
---

## 代码演示

### 01 组件类型

#### 基础滑块拼图验证

通过移动端触控拖动滑块，将真实图片拼图块移动到目标缺口位置完成验证。

{{ base }}

#### 自定义图片

通过设置背景图、拼图块图片和缺口位置，可接入业务侧或服务端生成的验证码素材。建议背景图本身已包含目标缺口/遮罩；拖动块使用服务端返回的透明 PNG，或技术栈运行时用 canvas 从背景图裁剪出的真实图像块。样式层只负责承载 `img` / `canvas` / `--td-captcha-piece-image`，不负责用 CSS 画一个假的拼图块。缺口目标位置和拖动块初始位置分别由 `--td-captcha-target-left/top` 与 `--td-captcha-piece-left/top` 控制。

{{ customImage }}

#### 灵活配置

缺口数量、目标坐标、拼图块素材、误差阈值、拖动轨迹和校验策略应由技术栈组件或服务端 challenge 数据定义，common 样式层不固定这些规则。单缺口可通过 `--td-captcha-target-left/top/width/height` 与 `--td-captcha-piece-left/top/width/height` 定位；多个缺口可重复渲染 `.t-captcha__cutout` 和 `.t-captcha__piece`，并为每个节点设置独立的 CSS 变量与图片素材。误差阈值建议只用于移动端触控交互反馈，最终通过结果仍应以服务端校验为准。

### 02 组件状态

#### 受控状态

组件可由外部控制 `status`，用于展示验证中、验证成功或验证失败等状态。

{{ status }}

### 03 组件操作

#### 刷新验证码

当验证码过期、验证失败或用户主动点击刷新时，应重新拉取验证码素材。

{{ refresh }}

#### 服务端校验

生产环境建议将拖动距离、验证码 token 等信息提交给服务端完成校验，避免仅在客户端判断通过结果。

{{ serverVerify }}
