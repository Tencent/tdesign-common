---
title: SelectInput 筛选器输入框
description: 定义：筛选器通用输入框，
isComponent: true
spline: data
---

### 筛选器输入框

统一筛选器逻辑包含：输入框、下拉框、无边框模式等。基于 TagInput、Input、Popup 等组件开发，支持这些组件的全部特性。将主要应用于 Select、Cascader、TreeSelect、DatePicker、TimePicker 等筛选器组件。

### 单选筛选器输入框

{{ single }}

### 多选筛选器输入框

{{ multiple }}

### 自动填充筛选器

{{ autocomplete }}

### 可调整下拉框宽度的筛选器输入框

下拉框宽度规则：下拉框宽度默认和输入框宽度保持一同宽，如果下拉框宽度超出输入框组件会自动撑开下拉框宽度，但最大宽度不超过 `1000px`。也可以通过 `popupProps.overlayStyle.width` 自由设置下拉框宽度。

{{ width }}

### 选中项数量超出的输入框

{{ overTagsDisplayType }}


### 可折叠选中项的筛选器输入框

选中项数量超过 `minCollapsedNum` 时会被折叠，可使用 `collapsedItems` 自定义折叠选项中的呈现方式。

{{ collapsed-items }}

### 不通状态的筛选器输入框

{{ status }}

### 可透传内置组件全部属性的筛选器输入框

支持透传 Input、TagInput、Popup 等组件的全部属性，即支持这些组件的全部特性。

{{ component }}
