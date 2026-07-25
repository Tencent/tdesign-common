---
title: TabBar
description: Used to quickly switch between different functional modules, located at the bottom of the page.
spline: navigation
isComponent: true
toc: false
---

### 01 Component Type

#### Text TabBar

{{ text }}

#### Icon&Text TabBar

{{ base }}

#### Icon TabBar

{{ pure-icon }}

#### Double layer TabBar

{{ text-spread }}

### 02 Component Style

#### Weakly select TabBar

{{ badge-props }}

#### Suspension capsule TabBar

{{ round }}

#### Liquid Glass material

Set `effect="glass"` to enable the Liquid Glass material. It does not change `shape`, fixed positioning, safe-area, or placeholder behavior. When enhancement is unavailable, the component retains a readable translucent background, border, and shadow.

Pair it with `shape="round"` for an inset floating capsule, compact icon-and-label layout, and a concentric selected state. `shape="normal"` retains the full-width rectangular layout.

Use `--td-tab-bar-glass-bg-color`, `--td-tab-bar-glass-border-color`, and `--td-tab-bar-glass-shadow` to customize the stable material styles. The selected capsule on a round TabBar is controlled by `--td-tab-bar-selected-bg-color` and `--td-tab-bar-selected-bg-opacity`; the latter uses a percentage. Refraction strength and texture parameters remain internal in the initial API.

### 02 Custom

#### Custom style

{{ custom }}
