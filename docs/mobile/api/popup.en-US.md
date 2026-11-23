---
title: Popup
description: Triggered by other controls, the screen slides out or pops up a custom content area.
spline: message
isComponent: true
toc: false
---

### 01 Component Type

#### Basic Popup

{{ base }}

### 02 Component Example

#### Example

{{ with-title }}

{{ custom-close }}

### 03 Nested Popup

#### Multiple Nested Popups

{{ nested }}

## Wide Screen Adaptation

Top and bottom popups remain full width by default. Use the optional `maxWidth` prop to limit their width and center them horizontally on tablets, foldable devices, or landscape screens. A value of `600px` is recommended; popups remain full width on narrower screens.

`maxWidth` accepts a number in pixels or a CSS length string. Omitting it preserves the existing layout; `none` removes the width limit. This prop only applies to top and bottom popups. Left, right, and center popups are unaffected.
