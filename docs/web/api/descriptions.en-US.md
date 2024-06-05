---
title: Descriptions
description: Descriptions are typically used to display information on detail pages.
isComponent: true
usage: { title: '', description: '' }
spline: layout
---

### Basics

{{ base }}

### Bordered

{{ bordered }}

### Colon

{{ colon }}

### Mode

- `fixed`: In the fixed table layout algorithm, the width of each column is determined as follows:
  - A column element with explicit width sets the width for that column.
  - Otherwise, a cell in the first row with explicit width determines the width for that column.
  - Otherwise, the column gets the width from the shared remaining horizontal space.
- `auto`: The automatic table layout algorithm is used. The widths of the table and its cells are adjusted to fit the content.

{{ mode }}

### Layout Direction

{{ layout }}

### Custom Column Number

{{ column }}

### Custom Style

{{ custom-style }}

### nest

{{ nest }}