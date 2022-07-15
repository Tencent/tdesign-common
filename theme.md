---
title: 主题配置
spline: explain
---

### 使用 CSS 变量

组件库通用的 Design Token 均使用 css variables 声明，你可以在自己的项目中声明同名变量来覆盖他们的值：

```css
--td-brand-color: orange;
--td-warning-color: yellow;
--td-error-color: red;
--td-success-color: green;
```

完整的 token 列表见 [\_light.less](https://github.com/Tencent/tdesign-common/blob/develop/style/web/theme/_light.less)。

#### 使用主题生成器配置 CSS 变量

因为涉及到的 token 数量很多，我们提供了更直观的基于 CSS Token 实现的`主题配置生成器`，来帮助您快速定制您需要的主题。您可以通过点击官网右下角的按钮打开我们的主题配置生成器。

通过主题配置生成器配置出您满意的 token 之后，请点击`导出主题配置`，我们会导出一份全新的 CSS 文件到您本地，您只需要将文件放置进您的项目文件目录中，并在项目中 import 该 CSS 文件，即可得到一个全新主题样式的 TDesign 。

### 使用 less 变量

如果你的项目也使用 less 技术栈，且对组件有更精细的定制需求，我们也抽离了大部分组件实现过程中用到的变量，以 less 变量的方式提供出来，

```less
// 以 Button 为例
// 尺寸
@btn-height-s: 24px;
@btn-height-default: 32px;
@btn-height-l: 40px;

// 圆角
@btn-border-radius: @border-radius-default;
@btn-shape-border-radius-s: (@btn-height-s / 2);
@btn-shape-border-radius-default: (@btn-height-default / 2);
@btn-shape-border-radius-l: (@btn-height-l / 2);

// 阴影

//字号
@btn-font-s: @font-size-s;
@btn-font-default: @font-size-base;
@btn-font-l: @font-size-l;

// 图标大小
@btn-icon-size-s: @font-size-base;
@btn-icon-size-default: @font-size-l;
@btn-icon-size-l: @font-size-xl;

// padding
@btn-padding-horizontal-s: @spacer;
@btn-padding-horizontal-default: (@spacer * 2);
@btn-padding-horizontal-l: (@spacer * 3);
```

要修改这些 less 变量，需要改为从 npm ESM 产物中引入组件库：

```js
// tdesign-npm-name 替换为当前在使用的包名称
import TDesign from "tdesign-npm-name/esm";
// 引入组件库全局样式资源
import "tdesign-npm-name/esm/style/index.js";
```

关于各类构建产物的差别可以参考 [构建产物规范](https://github.com/Tencent/tdesign-common/blob/develop/develop-install.md)。

之后，你可以在自己的项目自行修改这些变量的值，比如使用 modifyVars ：

```js
{
    loaderOptions: {
        less: {
            lessOptions: {
                modifyVars: {
                    '@brand-color': '#ebb105',
                },
                javascriptEnabled: true,
            },
        },
    }
}
```
