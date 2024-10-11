---
title: "全局特性配置"
description: "全局特性配置包含各个组件的文本语言配置及其他通用配置，可以减少重复的通用配置。"
isComponent: true
tdDocTabs: [{ tab: 'demo', name: '示例' }, { tab: 'api', name: 'API' }]
spline: 'explain'
---


### 国际化配置

TDesign 支持国际化/多语言配置，目前支持的语言包括:

语言 | 对应文件
-- | --
简体中文 | `zh_CN`
繁体中文 | `zh_TW`
英语 | `en_US`
韩语 | `ko_KR`
日语 | `ja_JP`
俄语 | `ru_RU`
意大利语 | `it_IT`
阿拉伯语 | `ar_KW`

如果你想贡献更多语言包，欢迎参考 [如何新增语言包](https://github.com/Tencent/tdesign-common/blob/develop/js/global-config/locale/CONTRIBUTING.md) 发起 PR。

### Upload 表格

{{ upload-en }}

### Table 表格

{{ table-en }}

### 其他组件

{{ other-en }}


### 全局组件前缀

TDesign 的组件前缀统一为`t`，在一些业务场景中，有需要改变组件前缀来满足业务的使用场景。
可以使用`esm`版本（保证您可以修改less vars)，通过全局配置修改`classPrefix`，并配合 less-loader 修改`@prefix`这个 less vars 来保证组件样式的正常。

```js
import Vue from 'vue'
import TDesign from 'tdesign-vue-next/esm'

Vue.createApp({}).use(TDesign)

...

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
                     '@prefix': 'any',// 请注意需要与classPrefix保持一致
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
                    '@prefix': 'any',// 请注意需要与classPrefix保持一致
                },
                javascriptEnabled: true,
            },
        }
    }
}
```