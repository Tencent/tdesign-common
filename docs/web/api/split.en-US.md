---
title: Split
description: Split divides an area into resizable panels and is suitable for workbenches, editors, and complex information layouts.
isComponent: true
usage: { title: '', description: '' }
spline: layout
---

### Basic Split

Drag the divider between panels to resize adjacent panels.

{{ base }}

### Direction

Split supports both horizontal and vertical panel arrangements.

{{ direction }}

### Size Constraints

Use `defaultSize` to define initial sizes, and use `min`, `max`, and `resizable` to control resizing constraints.

{{ limit }}

### Lazy Rendering

When `lazy` is enabled, only the divider moves during dragging and panel sizes update when dragging ends. This is useful when panel content is expensive to render.

{{ lazy }}

### Instance Methods

Use the `getSizes`, `setSizes`, and `reset` instance methods to inspect or update panel sizes.

{{ instance }}
