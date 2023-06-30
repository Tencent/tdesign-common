# 对话框 Dialog

## 组件设计指南

### 何时使用

需要用户做一些决定，或提供完成某个任务需要的一些额外信息时使用。

### 组件搭配使用

##### 与输入类组合使用，用于帮助用户完成一些快捷的输入或选择；但不建议一个对话框内有多种不同的输入类组件。

<div class="legend">
  
  <div class="item">
    <img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/mobile-guide/dialog%201-1.png" />
  </div>
  
  <div class="item">
    <img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/mobile-guide/dialog%201-2.png" />
  </div> 
  
</div>


### 常见用法

##### 用于较为重要的信息提示。

<div class="legend">
  <div class="item">
    <img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/mobile-guide/dialog%202.png" />
  </div>
</div>

<hr />

##### 用于较为重要的信息提示，且需要用户决定。

<div class="legend">
  <div class="item">
    <img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/mobile-guide/dialog%203-1.png" />
    <em></em>
  </div>
  <div class="item">
    <img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/mobile-guide/dialog%203-2.png" />
    <em></em>
  </div>
</div>


### 推荐/慎用示例

##### 确认类对话框通常用于较危险操作的二次确认，建议对话框按钮文本的涉及需要清楚地表明操作后果，加强感知避免误操作。

<div class="legend">
  <div class="item">
    <img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/mobile-guide/dialog%204-1.png" />
    <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/good.png" />
  </div>

  <div class="item">
    <img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/mobile-guide/dialog%204-2.png" />
    <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/bad.png" />
  </div>
</div>


### 何时使用
| 组件名 | 何时使用                             |
| :----- | :----------------------------------- |
| [轻提示](./toast) |当需要对用户进行轻量反馈或提示，且不需要用户进行操作时使用，轻提示会在一段时间后自动消失。|
| [消息通知](./message) |当需要对用户进行较轻量的反馈或提示，可以自动消失或通过点击关闭，通常由用户触发。|

