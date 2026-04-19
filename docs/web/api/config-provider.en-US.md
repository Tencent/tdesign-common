---
title: Global property configuration
description: The global attribute configuration contains the text language configuration of each component and other common configurations to reduce duplicate common configurations.
isComponent: true
tdDocTabs: [{ tab: 'demo', name: '示例' }, { tab: 'api', name: 'API' }]
spline: explain
---

### Internationalization

The supported language TDesign provided:

| Language              | File    |
| --------------------- | ------- |
| Chinese (Simplified)  | `zh_CN` |
| Chinese (Traditional) | `zh_TW` |
| English               | `en_US` |
| Korean                | `ko_KR` |
| Japanese              | `ja_JP` |
| Russian               | `ru_RU` |
| Italian               | `it_IT` |
| Arabic                | `ar_KW` |

If you want to contribute more language packs, please refer to [How to add a language pack](https://github.com/Tencent/tdesign-common/blob/develop/js/global-config/locale/CONTRIBUTING.md) PR.

{{ global }}

> Attention! When you use esm to import other components, make sure to import ConfigProvider with the corresponding esm version as well. Otherwise, there may be an issue with the language pack not taking effect.

### Pagination

{{ pagination }}

### Input

{{ input }}

### DatePicker

{{ date-picker }}

### Calendar

{{ calendar }}

### Dialog

{{ dialog }}

> Note! When using functional calls and needing to override `Plugin`, you need to configure `isContextEffectPlugin` (a global configuration to determine whether it affects the components used by the functional call method).

### Popconfirm

{{ popconfirm }}

### Table

{{ table }}

### others

{{ others }}

### FAQ

#### Regarding multi-language configuration, plugin functional calls

When using functional calls, if you need to override `Plugin`, you need to configure `isContextEffectPlugin` (a global configuration to determine whether it affects the components used by the functional call method).
