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

### Layout Direction

{{ layout }}

### Custom Column Number

{{ column }}

### Table Layout

Sets the algorithm used to layout `table` cells, rows, and columns, exactly the same as the native table-layout css property. For more details, see [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout)。`fixed` by default.

- `fixed`: In the fixed table layout algorithm, the width of each column is determined as follows:
  - A column element with explicit width sets the width for that column.
  - Otherwise, a cell in the first row with explicit width determines the width for that column.
  - Otherwise, the column gets the width from the shared remaining horizontal space.

- `auto`: The automatic table layout algorithm is used. The widths of the table and its cells are adjusted to fit the content.

{{ table-layout }}

### Custom Style

{{ custom-style }}

### nest

{{ nest }}