---
title: "全局特性配置"
description: "全局特性配置包含各个组件的文本语言配置及其他通用配置，可以减少重复的通用配置。"
isComponent: true
tdDocTabs: [{ tab: 'demo', name: '示例' }, { tab: 'api', name: 'API' }]
spline: 'explain'
---

### 全局配置

```html
<template>
  <t-config-provider :global-config="globalConfig">
    <App>业务组件入口</App>
  </t-config-provider>
</template>

<script setup>
import merge from 'lodash/merge';
import enConfig from 'tdesign-vue/locale/en_US';
// import enConfig from 'tdesign-vue-next/locale/en_US';
// import enConfig from 'tdesign-react/locale/en_US';

// 全局特性配置，可以引入英文默认配置 enConfig
const globalConfig = merge(enConfig, {
  // 可以在此处定义更多自定义配置，具体可配置内容，参看 API 文档
  calendar: {},
  table: {},
  pagination: {},
});
</script>
```

### Pagination 分页

{{ pagination }}

### DatePicker 日期选择器

{{ date-picker }}

### Calendar 日历

{{ calendar }}

### Dialog 对话框

{{ dialog }}

### Popconfirm 气泡对话框

{{ popconfirm }}

### Table 表格

{{ table }}

### 其他组件

{{ others }}
