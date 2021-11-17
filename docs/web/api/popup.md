# Popup 弹出层

弹出层组件是其他弹窗类组件如气泡确认框实现的基础，当这些组件提供的能力不能满足定制需求时，可以在弹出层组件基础上封装。

### 基础示例

Popup 由两部分组成，一个是「浮层内容」，二个是让「浮层内容」显示出来的「触发元素」，两者均可自定义。使用 `content` 自定义浮层内容

{{ base }}

### 触发元素

可以使用 `triggerElement` 自定义触发元素。

{{ trigger-element }}

### 触发方式

{{ trigger }}

### 位置方向

使用 `placement` 控制浮层方向，如果需要浮层箭头，设置 `showArrow=true` 即可

{{ placement }}

### 浮层样式

- `overlayClassName` 用于定义浮层样式类名
- `overlayStyle` 用于定义浮层样式，比如浮层宽度。浮层宽度默认根据内容宽度呈现，可自由设置宽度和最大宽度。
  如果想要浮层宽度同触发元素一样宽，也可以使用 `overlayStyle` 实现，示例如下，

{{ style }}

### 显示控制
{{ visible }}

### 挂载父节点

浮层默认父节点是 `body`，可通过 `attach` 自由调整挂载的父节点元素

{{ container }}

### 隐藏时销毁

`destroyOnClose` 用于控制浮层隐藏时是否销毁浮层内容

{{ destroy }}

### 禁用浮层显示

{{ disabled }}
