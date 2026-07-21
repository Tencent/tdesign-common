### 何时使用

需要从一个数据集中选择多个选项时；

需要对两种状态进行切换时（选中或未选中，打开或关闭），可单独使用多选框；

需要一个标记控件，通过触发操作按钮后才生效时；

### 组件搭配使用

##### 与气泡提示搭配使用。多选框所在选项为必选项时，用户漏选则弹出气泡提示。

<div class="legend">
  <div class="item">
    <img src="https://tdesign.gtimg.com/site/design/guide/checkbox/checkbox-1@2x.png" />
  </div>

  <div class="item"></div>
</div>

<hr />

##### 与对话框搭配使用。多选框所在选项勾选时需警示或二次确认时，点击后可弹出模态对话框提示。

<img src="https://tdesign.gtimg.com/site/design/guide/checkbox/checkbox-2@2x.png" />

### 常见用法

##### 多选框可在表单中单独使用。

<div class="legend">
  <div class="item">
    <img src="https://tdesign.gtimg.com/site/design/guide/checkbox/checkbox-3@2x.png" />
  </div>

  <div class="item"></div>
</div>

<hr />

##### 若需要通过操作多选框隐藏部分内容，可以使用就地隐藏/展开的方式。

<img src="https://tdesign.gtimg.com/site/design/guide/checkbox/checkbox-4@2x.png" />

<hr />

### 按钮风格的多选框组

##### 当需要在多个选项中快速识别已选结果时，例如 CRM/OA 系统的权限分配或功能开关配置，可使用按钮风格的多选框组。选中项以填充背景突出，未选中项保持描边或弱背景，方便高频操作。

##### 按钮风格提供描边、填充和主色填充三种形态。选项较多时可采用纵向排列，以保持清晰的扫描路径。

##### 设计取舍：按钮多选框不采用单选分段控件的连体边框和单一滑块。每个选项都是独立的可选单元，选中背景直接落在对应项上，因此可同时清晰呈现任意多个已选权限；横向空间不足时会自然换行，也不会产生断开的外框或模糊的组边界。

##### 描边形态使用品牌色描边与浅色选中背景，填充形态使用弱容器底与独立选中块，主色填充用于需要更强确认反馈的操作。三个形态均保留焦点、禁用和表单校验状态。

<hr />

### 推荐/慎用示例

##### 当选项较多且字段长度不一时，建议将多选框对齐。

<div class="legend">
  <div class="item">
    <img src="https://tdesign.gtimg.com/site/design/guide/checkbox/checkbox-5@2x.png" />
    <img class="tag" src="https://tdesign.gtimg.com/site/doc/good.png" />
  </div>

  <div class="item">
    <img src="https://tdesign.gtimg.com/site/design/guide/checkbox/checkbox-6@2x.png" />
    <img class="tag" src="https://tdesign.gtimg.com/site/doc/bad.png" />
  </div>
</div>

### 相似组件

| 组件名               | 何时使用                               |
| :------------------- | :------------------------------------- |
| [多选框](./checkbox) | 标记控件，需要与“提交”等操作结合使用。 |
| [开关](./switch)     | 即时生效的控件，可单独使用。           |
