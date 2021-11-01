


### 何时使用

布局用于页面区域划分，稳定地呈现相对应的内容。
页面布局通常划分为：内容区域（Content）、顶部区域（Header）、侧边区域（Sider）、和底部区域（Footer）。

### 与页面布局相关

#### 画板尺寸

为了减少布局设定时的沟通与拆分计算成本，基于主流屏幕尺寸，通常将标准画板宽度定为1440px。

#### 布局的规律

为了页面布局的一致性，在不同区域中放置内容元素时，应当保持间距的规律性。在TDesign中使用一组具有韵律的间距值，在遵循 8 倍数原则的基础上，增加了 4、12 两档小间距，以灵活满足不同的应用场景。

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/layout1.png" />

### 常见用法

#### 固定布局

当顶部需要承载重要功能时，可以将顶部区域、底部区域固定。当内容区域过高时，可以将侧边区域固定。

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/layout2.png" />

#### 响应式布局

为了更好地适配各种尺寸的显示设备可以使用响应式布局，通过设置断点实现布局的切换。当浏览器宽度小于配置的断点值时，侧边区域的导航自动从展开态变为收起态。

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/layout3.png" />

### 建议/慎用示例

##### 为了保证内容区域不被过度拉伸，应注意限定其最大宽度，取值可根据实际情况决定。TDesign中 建议的内容区域最大宽度为 1688px。

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/layout4.png" />

##### 当需要兼顾带鱼屏等超宽屏幕时，对于包含左侧导航的网页，可以考虑采用内容区域左对齐的方式，以避免左侧导航与内容区域间的距离过大，提升切换效率。

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/layout5.png" />

更多布局设计可参考： [全局样式-Layout布局](/design/layout)
