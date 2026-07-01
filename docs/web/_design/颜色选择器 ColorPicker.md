# 颜色选择器 ColorPicker

## 组件设计指南

### 何时使用

当用户需要对形状、字体或可修改的元素自定义更改颜色时。

### 与页面布局相关

##### 固定布局：可布局于左侧或右侧编辑栏上，区分内容读取区和工具操作区，高效引导用户发现和使用。

<div class="legend">
  <div class="item">
    <img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/guide/colorpicker7.png" />
    <em>图示：置于左侧编辑栏</em>
  </div>
   <div class="item">
    <img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/guide/colorpicker8.png" />
    <em>图示：置于右侧编辑栏</em>
  </div>
</div>
<hr />

##### 自由布局：以浮窗的形式呈现，拖拽任意移动位置，防止浮窗遮挡页面内容，增强页面布局灵活性。

<div class="legend">
  <div class="item">
    <img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/guide/colorpicker9.png" />
    <em></em>
  </div>
</div>
<hr />

### 吸色（Eyedropper）

##### 何时使用

当用户需要从页面既有内容（如背景图、素材、参考样图）中直接取色，而非在面板中手动调整色值时。典型场景：上传背景图后调整页面背景色、从设计稿中取色匹配、从已有页面元素中吸取品牌色。

##### 交互说明

- 通过 `enableEyedropper` 控制是否展示吸色按钮，默认不展示。按钮固定在面板头部（`__head`）左侧，与关闭按钮分置两端，便于发现。
- 点击吸色按钮调用浏览器原生 EyeDropper API，进入系统级吸色态：光标变为放大取色镜，可在屏幕任意位置取色，按 `Esc` 取消。
- 仅 Chromium 内核浏览器（Chrome 95+、Edge 95+）支持该能力。组件在渲染前先做能力探测，不支持的环境下不渲染吸色按钮，避免出现不可用的入口。
- 吸色完成后的颜色通过既有的 `onChange` / `v-model` 通道回填，与手动调色、输入色值的回填行为完全一致；渐变模式下回填到当前选中的渐变色点。
- 吸色过程中建议保持面板打开；吸色取消时不改变当前色值。

##### 组成

- 吸色按钮：复用 `__icon` 视觉语言（次级文字色、hover 态浅色容器底、圆角），尺寸略大于色板操作图标以保证点击热区。
- 不支持环境下：按钮整体不渲染（而非置灰），避免误导用户。
