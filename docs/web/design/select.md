## 1.组件设计指南

### 1.1.使用规范

（1）选择器控件适用于5个以上选项的场景，在少于5个选项场景建议使用单选框/多选框进行平铺展示，以提高操作效率。

![使用规范1](https://tdesign.gtimg.com/site/design/images/使用规范1-1851340.jpg)



（2）当选项内容过多，需要限制选择器展示高度，过多的选项可用滚动条进行收纳。



![修改001](https://tdesign.gtimg.com/site/design/images/修改001.png)

### 1.2.组件的状态

选择器状态可分为：默认状态、不可用菜单、异步加载中。

![状态](https://tdesign.gtimg.com/site/design/images/状态-1851392.jpg)



### 1.3.对齐/布局方式

#### 1.3.1.在表单中的选择器

![表单选择器](https://tdesign.gtimg.com/site/design/images/表单选择器-1851403.jpg)



（1）区域一：在区域一中触发的选择器，在下铺展，宽度同选择框。

![表单选择器-区域一](https://tdesign.gtimg.com/site/design/images/表单选择器-区域一-1851412.jpg)



（2）区域二：在区域二中触发的选择器，在上铺展，宽度同选择框。

![表单选择器-区域二](https://tdesign.gtimg.com/site/design/images/表单选择器-区域二-1851419.jpg)



#### 1.3.2.在其他场景下的选择器

![其它场景](https://tdesign.gtimg.com/site/design/images/其它场景-1851427.jpg)



（1）区域一：在区域一中触发的选择器，在右下角展示。

![其它场景-区域一](https://tdesign.gtimg.com/site/design/images/其它场景-区域一-1851435.jpg)



（2）区域二：在区域二中触发的选择器，在左下角展示。

![其它场景-区域二](https://tdesign.gtimg.com/site/design/images/其它场景-区域二-1851442.jpg)



（3）区域三：在区域三中触发的选择器，在右上角展示。

![其它场景-区域三](https://tdesign.gtimg.com/site/design/images/其它场景-区域三-1851452.jpg)



（4）区域四：在区域四中触发的选择器，在左上角展示。

![其它场景-区域四](https://tdesign.gtimg.com/site/design/images/其它场景-区域四-1851460.jpg)



### 1.4.正确/错误范例

如分组内容超过3个以上，尽可能将选项进行分类并采用多层选择器，而非平铺至下拉菜单超出高度。

![正确&错误范例1](https://tdesign.gtimg.com/site/design/images/正确&错误范例1-1851469.jpg)



### 1.5.相似组件

| 组件名   | 何时使用                                                     |
| :------- | :----------------------------------------------------------- |
| 选择器   | 选择器主要用于收纳选项，是一种录入信息类控件，常用于表单、筛选等信息录入场景。 |
| 下拉菜单 | 下拉菜单主要用于对过多的操作进行收纳，常跟随于按钮后面，点击后是触发相应的操作。 |
