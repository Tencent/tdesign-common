# 标签栏 TabBar

## 组件设计指南

### 何时使用

目标模块/视图需要从应用的任何地方直接进行访问时使用。

### 组件搭配使用

##### 标签栏与[徽标](./badge)组合使用，用于告知用户该模块/视图的状态变化。

<div class="legend">
  <div class="item">
    <img src="https://tdesign.gtimg.com/site/design/mobile-guide/tab-bar/tab-bar-1.png" />
  </div>

  <div class="item">
    <img src="https://tdesign.gtimg.com/site/design/mobile-guide/tab-bar/tab-bar-2.png" />
  </div>
</div>

### 推荐/慎用示例

#### 液态玻璃材质

液态玻璃用于需要保留背景上下文的底部导航。应确保标签文字和图标在复杂背景、明暗主题及增强能力不可用时仍清晰可读；材质效果不得改变标签栏的点击区域、层级、固定定位或安全区行为。

`normal` 形态保持原有矩形轮廓。`round` 与液态玻璃组合时使用屏幕内缩的悬浮胶囊：保留 12px 水平间距和 8px 底部间距，内容使用 4px 内缩；图标位于文字上方，选中项使用同心胶囊和品牌色 tint 表达层级。液态玻璃不改变导航语义或点击区域。

##### 建议标签栏数量在2-5个之间；若多与5个，建议重新审视应用的信息架构，对信息架构进行优化。

<div class="legend">
  <div class="item">
    <img src="https://tdesign.gtimg.com/site/design/mobile-guide/tab-bar/tab-bar-3.png" />
    <img class="tag" src="https://tdesign.gtimg.com/site/doc/good.png" />
  </div>

  <div class="item">
    <img src="https://tdesign.gtimg.com/site/design/mobile-guide/tab-bar/tab-bar-4.png" />
    <img class="tag" src="https://tdesign.gtimg.com/site/doc/bad.png" />
  </div>
</div>

<hr />

##### 避免在同个状态下有不同颜色的文本和图标。

<div class="legend">
  <div class="item">
    <img src="https://tdesign.gtimg.com/site/design/mobile-guide/tab-bar/tab-bar-5.png" />
    <img class="tag" src="https://tdesign.gtimg.com/site/doc/good.png" />
  </div>

  <div class="item">
    <img src="https://tdesign.gtimg.com/site/design/mobile-guide/tab-bar/tab-bar-6.png" />
    <img class="tag" src="https://tdesign.gtimg.com/site/doc/bad.png" />
  </div>
</div>

<hr />

##### 文本是对标签的简要说明，不建议将文本进行截断或换行，所以应避免使用长文本。

<div class="legend">
  <div class="item">
    <img src="https://tdesign.gtimg.com/site/design/mobile-guide/tab-bar/tab-bar-7.png" />
    <img class="tag" src="https://tdesign.gtimg.com/site/doc/good.png" />
  </div>
</div>

<hr />

<div class="item">
   <img src="https://tdesign.gtimg.com/site/design/mobile-guide/tab-bar/tab-bar-8.png" />
   <img class="tag" src="https://tdesign.gtimg.com/site/doc/bad.png" />
</div>

### 相似组件

| 组件名               | 何时使用                                                                      |
| :------------------- | :---------------------------------------------------------------------------- |
| [选项卡](./tabs)     | 当内容/数据需要一定的分类纬度进行区分，便于用户快速作出选择并切换时可以使用。 |
| [侧边栏](./side-bar) | 当内容项数量较多，需要用户根据品类快速选择到目标内容项时使用。                |
