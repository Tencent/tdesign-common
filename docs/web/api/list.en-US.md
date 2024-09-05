---
title: List
description: The lists use a continuous column to display multiple rows of elements. They are commonly used to display batches of modules with the same composition and content. They can carry a variety of information content, from pure text to complex combinations of graphics and text.
isComponent: true
usage: { title: "", description: "" }
spline: data
---

### Basic text list

The list containing only simple text. Used when displaying relatively simple information.

{{ base }}

### Multi-line text list

The list containing only main text and descriptive text. Used when displaying more complex information with multiple fields or content.

{{ multiline }}

### Basic image-text list

The list containing simple graphics and text. Used when information needs to be displayed using a combination of images and text.

{{ image-text }}

### List with operations

The list containing operations. Used when operations need to be performed on the column.

{{ operation }}

### Lists of different sizes

Provides large, medium (default), and small sizes.

{{ size }}

### Stripe Style List

When the list content is abundant, set `stripe` to make it easier for users to obtain information.

{{ stripe }}

### Asynchronous Load List

When data needs to be loaded and displayed through a secondary request, you can handle the related logic through `asyncLoading` API.

{{ loading }}

### List with header content and footer content

{{ header-footer }}

### List with scroll event

{{ scroll }}

### List with Virtual scrolling

Supports enabling virtual scrolling, suitable for scenarios where long lists are loaded at once.

{{ virtual-scroll }}