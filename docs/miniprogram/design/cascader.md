

### 何时使用

当一组选项由递进层级构成，且每个层级有大量的选项需要用户逐级选择时使用。


### 组件搭配使用

##### 级联选择器与[索引](./indexes)组合使用，当每个层级选项较多时，配合索引有利于用户快速找到目标选项。

<div class="item">
  <img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/mobile-guide/Cascader%201.png" />
</div>


### 常见用法

##### 在表单中，级联选择器可放置于表单内容需要的顺序中，通常用于地址信息的选择和填写。
<div class="legend">
 <div class="item">
  <img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/mobile-guide/Cascader%202.png" />
 </div>
</div>


### 推荐/慎用示例

##### 级联选择器的层级不宜超过4层，层级过多时应调整数据结构或改用其他交互方式。

<div class="legend">
 <div class="item">
  <img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/mobile-guide/Cascader%203-1.png" />
  <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/bad.png" />
 </div>
</div>

<hr />

##### 在多层级中，各层级选项的归属关系应具备逻辑相关性，数据层级由大到小，避免归属关系混乱。

<div class="legend">
  <div class="item">
    <img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/mobile-guide/Cascader%203-2.png" />
    <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/good.png" />
  </div>

  <div class="item">
    <img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/mobile-guide/Cascader%203-3.png" />
    <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/bad.png" />
  </div>
</div>


### 相似组件

| 组件名             | 何时使用                                                                                     |
| :----------------- | :------------------------------------------------------------------------------------------- |
| [选择器](./picker) | 当需要在有限的空间展示大量选项供用户选择，或者一组选项由递进层级构成需要用户逐级选择时使用。 |
