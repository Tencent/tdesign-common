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

### 液态玻璃悬浮胶囊

##### 在悬浮胶囊形态上叠加液态玻璃材质（`--glass`），对标 iOS 26 Liquid Glass。

- **通透材质**：通过 `backdrop-filter` 对胶囊后方内容做模糊（blur 20px）与饱和度增强（saturate 180%），形成通透的玻璃质感，而非纯色填充。
- **镜面高光**：胶囊顶部受光、向下渐隐的折射高光，是液态玻璃的视觉签名；底部保留柔光反射。
- **折射描边**：1px 半透明描边叠加内阴影，模拟玻璃边缘的折射与厚度。
- **暗色适配**：暗色模式下切换为深色玻璃材质，并降低镜面亮度，避免刺眼。

> 适用于需要强悬浮感与高级质感的底部导航，如内容流、全屏浏览类应用。建议胶囊后方保留可透出内容（非纯色底）以发挥材质效果。

### 推荐/慎用示例

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
