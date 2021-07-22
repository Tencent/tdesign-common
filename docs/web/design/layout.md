


### 何时使用

布局用于页面区域划分，稳定地呈现相对应的内容。页面布局通常划分为以下几个区域：

内容区域（Content）：通常用于放置主体内容。

顶部区域（Header）：位于页面顶部，通常用于放置顶部导航。

侧边区域（Sider）：位于主体内容两侧，通常用于放置侧边导航。

底部区域（Footer）：位于页面底部，通常用于放置辅助信息。

<img width="100%" src="https://iwiki.oa.tencent.com/download/attachments/444689894/%E5%B8%83%E5%B1%80%E9%85%8D%E5%9B%BE1.jpg?version=1&modificationDate=1606100425000&api=v2" />


### 与页面布局相关

#### 布局的规律
##### 为了页面布局的一致性，在不同区域中放置内容元素时，应当保持间距的规律性。我们推荐了一组具有韵律的间距值，在遵循 8 倍数原则的基础上，增加了 4、12 两档小间距，以灵活满足不同的应用场景。

<img src="https://iwiki.oa.tencent.com/download/attachments/444689894/%E5%B8%83%E5%B1%80%E9%85%8D%E5%9B%BE7.jpg?version=1&modificationDate=1606100425000&api=v2" />

### 常见用法

##### 导航可固定

当顶部需要承载重要功能时，可以将顶部区域、底部区域固定。当内容区域过高时，可以将侧边区域固定。

<img src="https://iwiki.oa.tencent.com/download/attachments/444689894/%E5%B8%83%E5%B1%80%E9%85%8D%E5%9B%BE6.jpg?version=1&modificationDate=1606100425000&api=v2" />

#### 导航可响应式

侧边区域可设置为响应式布局，当浏览器宽度小于配置的断点值，侧边导航自动从展开态变为收起态（TDesign 中该断点值默认为 992px）。

为了保证内容区域不被过度拉伸，应注意限定其最大宽度，取值可根据实际情况决定，TDesign 建议的内容区域最大宽度为 1688px。

为了减少布局时的沟通与拆分计算成本，基于主流屏幕尺寸，我们将标准画板宽度定为 1440px。

<img src="https://iwiki.oa.tencent.com/download/attachments/444689894/%E5%B8%83%E5%B1%80%E9%85%8D%E5%9B%BE5.jpg?version=1&modificationDate=1606100425000&api=v2" />

#### 对齐方式

当需要兼顾带鱼屏等超宽屏幕时，对于包含左侧导航的网页，可以考虑采用内容区域左对齐的方式，以避免左侧导航与内容区域间的距离过大，提升切换效率。  

<img src="https://iwiki.oa.tencent.com/download/attachments/444689894/%E5%B8%83%E5%B1%80%E9%85%8D%E5%9B%BE8.jpg?version=1&modificationDate=1606100425000&api=v2" />