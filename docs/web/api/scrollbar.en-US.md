---
title: Scrollbar
description: A custom scrollbar that replaces the native one, with configurable display timing, thumb size and scroll step.
isComponent: true
usage: { title: '', description: '' }
spline: layout
---

### Basic Usage

Set the height of the scroll container with `container`. The scrollbar shows up automatically when content overflows, and you can drag the thumb or scroll the wheel to see the rest.

{{ base }}

### Horizontal Scrolling

A horizontal scrollbar shows up when content is wider than the container.

{{ horizontal }}

### Size Control

`container` supports `height`, `maxHeight`, `width` and `maxWidth`. With `height` the container height is fixed; with `maxHeight` the container height adapts to its content and the scrollbar only shows up after content overflows.

{{ container }}

### Auto Resize

`autoresize` controls whether the container size follows the content, enabled by default; when disabled the container keeps a fixed size and leaves blank space for short content.

{{ autoresize }}

### Visibility

`visibility` controls when the scrollbar shows up, options are `hover`, `always` and `hide`. `autoExpand` controls whether the track expands outwards on hover or while dragging the thumb, to enlarge the interactive hotspot.

{{ visibility }}

### Scroll Step

`step` applies to both arrow keys and the mouse wheel. Set `tabindex` on the container so that it can be focused to respond to keyboard scrolling.

{{ step }}

### Instance Methods

The component instance provides `scrollTo`, `scrollToEdge` and `getValues`, used to scroll to a specific position, scroll to one edge, and get the scroll information. `left` and `top` in the result are the thumb offsets relative to the track.

{{ methods }}

### Disabled

When `disabled` is `true`, the scrollbar is hidden and the content can not be scrolled by wheel, keyboard or thumb.

{{ disabled }}
