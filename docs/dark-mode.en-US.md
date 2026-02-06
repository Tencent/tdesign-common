---
title: Dark Mode
description: TDesign provides a dark mode to adapt to the display experience in the dark mode of the operating system. Click the switch in the upper right corner of the website to experience the dark mode of components.
spline: design-mode
---

### Usage

**Method 1: add `theme-mode` attribution for `html` to control the display of `dark/light` mode:**

```javascript
// dark mode
document.documentElement.setAttribute('theme-mode', 'dark');
// light mode
document.documentElement.removeAttribute('theme-mode');
```

**Method 2: add a `dark` class to `html` to control the display of `dark/light` mode:**

```javascript
// dark mode
document.documentElement.classList.add('dark');
// light mode
document.documentElement.classList.remove('dark');
```

### Implementation Solution

TDesign uses [CSS Variables](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties) to implement all color-related Design Tokens. Currently, almost all modern browsers support this feature. We have implemented two sets of color palettes, light and dark, by default, for applying when switching the page theme.

Read [the documentation](https://caniuse.com/css-variables) if you have doubts about the browser compatibility of this solution.
