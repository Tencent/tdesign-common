---
title: Global property configuration
description: The global attribute configuration contains the text language configuration of each component and other common configurations to reduce duplicate common configurations.
isComponent: true
toc: false
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

### Upload

{{ upload-en }}

### Table

{{ table-en }}

### others

{{ other-en }}

### Global Component Classprefix

the classprefix of TDesign component is `t`. In some situations, it is necessary to change the component prefix to meet the usage needs.

You can use the `esm` version (which guarantees that you can modify less vars), modify the `classPrefix` through global configuration, and cooperate with less-loader to modify the `@prefix` less vars to ensure the normal styling of the components.

```js
import Vue from 'vue';
import TDesign from 'tdesign-mobile-vue/esm';

Vue.createApp({}).use(TDesign);
```

```html
<t-config-provider :globalConfig="{ classPrefix: 'any'}">
  <t-button>TDesign to any design</t-button>
</t-config-provider>
```

#### vue-cli

```js
// vue.config.js
{
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            '@prefix': 'any', // // should be the same as classPrefix
          },
          javascriptEnabled: true,
        },
      },
    }
  }
}
```

#### vite

```js
// vite.config.js
{
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          '@prefix': 'any', // should be the same as classPrefix
        },
        javascriptEnabled: true,
      },
    }
  }
}
```
