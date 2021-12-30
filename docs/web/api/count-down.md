---
{
  title: "CountDown 倒计时",
  description: "用于实时展示倒计时数值，支持毫秒精度。",
  isComponent: true,
  spline: data,
}
---

### 基础用法

time 属性代表倒计时的总时长，单位为毫秒。

{{ base }}

### 自定义格式

使用 format 属性设置倒计时的格式内容。

{{ custom-format }}

### 毫秒级渲染

倒计时默认每秒渲染一次，设置 milliscond 属性可以用来开启毫秒级渲染，开启毫秒级渲染后可通过设置格式“SSS”选择保留的毫秒值位数。

{{ milliscond-render }}

### 自定义样式

通过使用插槽进行自定义倒计时样式，timeData 的格式见 API。

{{ custom-style }}

### 手动控制

通过使用 ref 获取组件实例，可以调用 start、pause、reset 等方法来控制。

{{ manual-control }}
