---
title: Link 链接
description: 按钮用于开启一个闭环的操作任务，如“删除”对象、“购买”商品等。
isComponent: true
usage: { title: '', description: '' }
spline: base
---

### 文字链接

#### 基础文字链接

最简单的文字链接形式，点击后直接跳转到对应链接。

{{ base }}

#### 下划线文字链接

在文字下加横线，表明此处为链接。

{{ underline }}

#### 带图标的文字链接

文字链接与图标搭配使用，通过图标快速了解链接所代表的含义。

{{ prefixIcon }}


### 提示不同状态的链接

在_blank、primary、success、warming、danger不同状态下，可提供对应的链接主题色。

{{ theme }}

### 禁用的链接

当链接不可用时，显示禁用状态。

{{ disabled }}