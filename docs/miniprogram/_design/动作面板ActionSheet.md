# 动作面板 ActionSheet

## 组件设计指南

### 何时使用

需要提供一组与当前场景操作相关的关联操作时使用。

### 组件搭配使用

##### 动作面板与[按钮](./button)组合使用，通过按钮点击唤起动作面板。

<div class="item">
   <img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/mobile-guide/ActionSheet%201.png" />
   <em></em>
</div>


<hr />

### 常见用法

##### 当用户完成一个事件可以通过若干种方式达成，可以用动态面板来承载这若干种方式的操作。

<div class="item">
    <img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/mobile-guide/ActionSheet%202.png" />
    <em></em>
</div>


##### 当页面中有一组操作因低频/空间不足不希望外露时，但却必要存在，可以用动作面板来承载，通过“更多”按钮触发

<div class="item">
    <img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/mobile-guide/ActionSheet3.png" />
    <em></em>
</div>


### 推荐/慎用示例

##### 动作面板中不建议提供太多操作项，若过多项在小屏手机中导致需纵向滚动，体验将会受损。

<div class="legend">
  <div class="item">
    <img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/mobile-guide/ActionSheet%204-1.png" />
    <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/good.png" />
  </div>

  <div class="item">
    <img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/mobile-guide/ActionSheet%204-2.png" />
    <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/bad.png" />
  </div>
</div>

<hr />

##### 动作面板中的操作项不建议用icon完成替代文字。

<div class="legend">
  <div class="item">
    <img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/mobile-guide/ActionSheet%205-1.png" />
    <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/good.png" />
  </div>

  <div class="item">
    <img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/mobile-guide/ActionSheet%205-2.png" />
    <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/bad.png" />
  </div>
</div>

<hr />



### 相似组件

| 组件名 | 何时使用                             |
| :----- | :----------------------------------- |
| [抽屉](./drawer) | 需要收折展示一组数量较多的菜单时使用。 |
| [对话框](./dialog) | 需要用户做一些决定，或这提供完成某个任务是需要的一些额外信息时使用。 |
