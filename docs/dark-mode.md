---
title: 深色模式
description: 组件库提供了深色模式，以适配在操作系统深色模式下的展示体验，可以点击官网右上角开关切换整体浅色与深色模式体验。
spline: design-mode
---

### 如何使用

**方式 1：给 `html` 增加 `theme-mode` 属性来控制深色/浅色展示：**

```javascript
// 深色模式
document.documentElement.setAttribute('theme-mode', 'dark');
// 浅色模式
document.documentElement.removeAttribute('theme-mode');
```

**方式 2：给 `html` 增加 `dark` 类名来控制深色/浅色展示：**

```javascript
// 深色模式
document.documentElement.classList.add('dark');
// 浅色模式
document.documentElement.classList.remove('dark');
```

### 实现原理

组件库使用 [css variables（自定义属性）](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties) 来实现所有颜色相关的 Design Token，目前所有现代浏览器基本上都已经支持这一特性，我们默认实现了浅色和深色两套色板值，供页面主题切换时应用。

对本方案浏览器兼容性有疑问的小伙伴可以参考[这里](https://caniuse.com/css-variables)
