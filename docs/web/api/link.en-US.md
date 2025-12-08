---
title: Link
description: Used to navigate to a new page, such as internal project links or external friendly links.
isComponent: true
usage: { title: '', description: '' }
spline: base
---

### Text Link

#### Base Text Link

The simplest form of a text link is to directly redirect to the corresponding URL when clicked. A underline is added below the text to indicate it is a link

{{ base }}

#### Underline Link

A underline is added below the text to indicate it is a link.

{{ underline }}

#### Link with Icon

Text links can be used in combination with icons to understand the meaning of the link.

{{ icon }}

### Hover State Link

The hover option can be controlled with two values: `color` and `underline`.

{{ hover }}

### Different Status of Links

Different link theme colors can be offered according to different states such as `default`,`primary`, `success`, `warning`, and `danger`.

{{ theme }}

### Disabled Link

When the link is not available, a disabled state will be displayed.

{{ disabled }}

### Different Sizes of Links

Provide two shapes: small, medium and large.

{{ size }}
