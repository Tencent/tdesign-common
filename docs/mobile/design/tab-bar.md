### 何时使用

用于承载应用中的核心一级导航，帮助用户在不同功能模块之间快速切换。

### 组件搭配使用

#### 标签栏可与[徽标](./badge)组合使用，用于提示模块状态或新增消息。

#### 当使用悬浮胶囊标签栏时，可在保留导航结构不变的前提下，按场景切换普通视觉和液态玻璃视觉。

液态玻璃风格建议用于：

- 图片、风景、插画等具备明显背景层次的页面
- 需要突出悬浮感、轻透感的品牌化场景

液态玻璃风格不建议用于：

- 背景信息非常复杂且会影响图标识别的页面
- 强调纯功能效率、弱装饰的高密度后台场景

### 推荐 / 慎用示例

#### 建议标签栏数量控制在 2-5 个之间；若超过 5 个，建议重新梳理信息架构。

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

#### 避免同一状态下出现不一致的图标和文字颜色。

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

#### 文本应为对标签的简要说明，避免过长文本导致换行或截断。

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

| 组件名称             | 何时使用                                                               |
| :------------------- | :--------------------------------------------------------------------- |
| [选项卡](./tabs)     | 当内容数据需要按分类维度进行切换，且主要交互发生在内容区域顶部时使用。 |
| [侧边栏](./side-bar) | 当内容项数量较多，需要用户根据类别快速定位目标内容时使用。             |
