---
title: SwipeCell
description: Used to carry more actions in the list, by sliding left and right to show, the width of the button fixed height varies according to the height of the list.
spline: base
isComponent: true
toc: false
---

### Left slide operation

{{ left }}

### Right swipe operation

{{ right }}

### Left and right slide operation

{{ double }}

### Sliding operation with ICONS

{{ icon }}

### Operation with double confirmation

{{ event }}

### css style

- The content in slot needs to define its own style
- When using the slot Insert button, the height:100% is set for the first layer wrap component of the slot, but the second layer content is not set, in order to achieve the vertical overlay effect, you need to manually set the style="height:100%"
- If you are passing an array of buttons using the #right and #left attributes, you can quickly specify a menu background color using theme, with the theme value being the theme value of the t-button component