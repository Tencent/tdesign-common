---
title: Steps
description: Displays task steps or task progress.
spline: base
isComponent: true
toc: false
---

## Code demo

Step bar, the direction can be horizontal and vertical, you can customize the step bar display content and whether it is writable

### Component type

#### Horizontal step bar

Supports three types: serial number, icon, and abbreviated

{{ horizontal }}


#### Vertical step bar

Supports three types: serial number, icon, and abbreviated

{{ vertical }}

### component status

#### TAB status

Four states are supported: default, finish, process and error.

{{ status }}


#### Special types

Through the existing characteristics, two common types are modified:

- Vertical customization (used in Cascader)
- Pure display step bar
- You can refer to the following code to achieve

{{ special }}