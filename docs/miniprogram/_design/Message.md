# 消息通知 Message

## 组件设计指南

### 何时使用

当需要对用户进行较轻量的反馈或提示，可以自动消失或通过点击关闭，通常由用户触发。

### 与页面布局相关

##### 通知通常出现在页面顶部，叠加在页面的上层，可在一段时间后自动消失、或用户点击关闭。

<div class="legend">
  <div class="item">
    <img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/mobile-guide/Drawer%201.png" />
  </div>
  
  <div class="item">
    <img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/mobile-guide/Drawer%201.png" />
  </div>
</div>

<hr />

### 推荐/慎用示例

##### 当需要在通知栏中展示按钮时，不建议超过1个。若需要使用更多按钮，建议使用其它交互方式。

<div class="legend">
  <div class="item">
    <img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/mobile-guide/Drawer4-2.png" />
    <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/bad.png" />
  </div>
</div>

<hr />

##### 消息通知是一种相对轻量、短时的反馈方式，尽量避免在页面中同时堆叠多个消息通知，用户可能会来不及关注它们。

<div class="legend">
  <div class="item">
    <img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/mobile-guide/Drawer4-2.png" />
    <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/bad.png" />
  </div>
</div>

<hr />

### 相似组件

| 组件名 | 何时使用                             |
| :----- | :----------------------------------- |
| [消息通知](./message) |  |
| [轻提示](./toast) |  |
| [公告栏](./noticeBar) |  |
