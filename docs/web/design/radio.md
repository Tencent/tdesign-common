## 1.组件设计指南

### 1.1.使用规范和场景

#### 1.1.1.在表单中使用

表单中的单选框选项全部外显，选项数量不宜过多。

![使用场景1](https://tdesign.gtimg.com/site/design/images/使用场景1.jpg)



#### 1.1.2.在表格中使用

单选框用在表格中，需为每一行添加一个多选框。

![使用场景2](https://tdesign.gtimg.com/site/design/images/使用场景2.jpg)



### 1.2.选项的特殊情况

（1） 默认的选项放在前面，有引导用户选择的需要时可以注明“推荐”。

![特殊情况1](https://tdesign.gtimg.com/site/design/images/特殊情况1.jpg)



（2）有不可用的选项时，置灰选项，鼠标hover时，提示不可选的原因。

![特殊情况2](https://tdesign.gtimg.com/site/design/images/特殊情况2.jpg)



### 1.3.正确/错误范例

（1）不要用单选框触发一个弹窗。

![正确&错误示例1](https://tdesign.gtimg.com/site/design/images/正确&错误示例1.jpg)



弹窗承载的信息可以使用表单就地展开的展示方式。

建议：带有详情信息的单选框采用竖排的布局方式，凸显信息的从属关系。

若信息较多时，建议采用底色将信息分组。

![正确&错误示例2](https://tdesign.gtimg.com/site/design/images/正确&错误示例2.jpg)



（2）不要用单选框开启一个功能。

![正确&错误示例3](https://tdesign.gtimg.com/site/design/images/正确&错误示例3.jpg)



建议使用开关或者checkbox开启/关闭一个功能，根据业务需求选择使用开关（即时生效）或checkbox（临时标记，需提交才可生效）。

![正确&错误示例4](https://tdesign.gtimg.com/site/design/images/正确&错误示例4.jpg)





### 1.4.相似组件

| 组件名   | 何时使用                                                     |
| :------- | :----------------------------------------------------------- |
| 下拉菜单 | 在有限的空间内，需要承载多种操作，并且不影响页面结构；常与表格、列表等组件组合使用，可以将不常用的操作进行收纳，减少对空间的占用。 |
