## 组件设计指南


### 组件搭配使用


#### 与搜索框搭配使用，可在数据量较大时，提供快捷的检索能力

![](https://iwiki.oa.tencent.com/download/attachments/457350942/image2020-10-28_18-39-2.png?version=1&modificationDate=1606718617000&api=v2)

#### 与树结构搭配搭配使用，可在选项数据有父子层级结构时，提供更清晰的选择能力

![](https://iwiki.oa.tencent.com/download/attachments/457350942/image2020-10-28_18-45-56.png?version=1&modificationDate=1606718617000&api=v2)

![](https://iwiki.oa.tencent.com/download/attachments/457350942/%E6%A0%91%E7%BB%93%E6%9E%84_%E5%8F%B3%E9%80%89%E6%8B%A9.png?version=1&modificationDate=1606718619000&api=v2)



### 常见用法

#### 单个选项内容过多时，每个选项内容折行显示

![](https://iwiki.oa.tencent.com/download/attachments/457350942/image2020-10-28_18-41-17.png?version=1&modificationDate=1606718619000&api=v2)

#### 选项数据内容过多时，保持当前页列表数量为最大可显示数量

![](https://iwiki.oa.tencent.com/download/attachments/457350942/%E5%8A%A0%E6%90%9C%E7%B4%A2.png?version=1&modificationDate=1606718619000&api=v2)

#### 需要明确展示“源”数据数量变化时，可使用不保留选项的互动形式。
![](https://iwiki.oa.tencent.com/download/attachments/457350942/image2020-10-28_18-52-24.png?version=1&modificationDate=1606718618000&api=v2)

#### 需要始终展示“源”数据时，可使用保留选项的互动形式。

![](https://iwiki.oa.tencent.com/download/attachments/457350942/%E5%8F%B3%E5%A4%8D%E5%88%B6.png?version=1&modificationDate=1606718618000&api=v2)


### 相似组件

| 组件名 | 何时使用                                                   |
| :----- | :--------------------------------------------------------- |
| 穿梭框 | 一组数据进行两种状态的分类时；总类和子类的选项筛选时。     |
| 树     | 用于承载有父子关系的结构化内容，提供内容层级的展示。       |

