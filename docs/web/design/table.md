## 1. 组件设计指南



### 1.1. 表格hover状态

数据行列hover，可以更好引导用户的浏览视线，以及各元素焦点。



#### 1.1.1. 数据行列hover态



表格数据行hover态：

![数据行列hover态](https://tdesign.gtimg.com/site/design/images/数据行列hover态-1836265.jpg)



在斑马纹表格中，在整行hover底色需与斑马纹做区分，让被hover的数据行更明显：

![数据行列斑马纹hover态](https://tdesign.gtimg.com/site/design/images/数据行列斑马纹hover态-1836275.jpg)



数据列排序突出显示：

![数据列排序突出显示](https://tdesign.gtimg.com/site/design/images/数据列排序突出显示-1836317.jpg)



#### 1.1.2. 表格常见元素hover态

涉及表头筛选、排序等，数据行操作、图标、链接等常见内容元素hover态。

![3.1.2 常见元素hover态](https://tdesign.gtimg.com/site/design/images/3.1.2 常见元素hover态-1836332.jpg)



#### 1.1.3. 数据行不可编辑态

由于资源锁定、创建中等业务逻辑，会存在数据行无法选中或编辑的情况。

![数据行列不可编辑态](https://tdesign.gtimg.com/site/design/images/数据行列不可编辑态-1836339.jpg)



### 1.2. 表格数据列



#### 1.2.1. 列宽

列宽需要确定合理的默认值，是表格内容有较好的展示效果。不能太窄，大量数据会显示不完；不能太宽，大量留白会让浏览效率降低。

设定列宽建议遵循以下几点：

- 单元格内容长度固定时，如手机号、日期等，列宽应大于该固定宽度；
- 单元格内容长度不固定时，应考虑大多数情况下内容的长度。如备注信息允许最大输入100个字符，但大部分备注不超过20个字符，则可设定20字符宽度保证大多数情况下显示完整；
- 当设定列宽不满足数据完整显示，可允许用户自定义调整列宽。



设定合适列宽：

![合适列宽](https://tdesign.gtimg.com/site/design/images/合适列宽-1836352.jpg)



自定义调整列宽：

![自定义调整列宽](https://tdesign.gtimg.com/site/design/images/自定义调整列宽-1836369.jpg)



#### 1.2.2. 数据显示

当单元格显示数据较多时，可以多行显示（如显示3行）或者截断显示，鼠标hover时呈现详情内容。



单行截断：

![单行截断](https://tdesign.gtimg.com/site/design/images/单行截断-1836382.jpg)



3行限制截断：

![多行截断](https://tdesign.gtimg.com/site/design/images/多行截断-1836389.jpg)



操作列中，空间不足情况下可展示2个高频操作，其余做隐藏处理。也可以选用图标按钮样式，节省一定空间。



隐藏部分操作：

![隐藏部分操作](https://tdesign.gtimg.com/site/design/images/隐藏部分操作-1836401.jpg)



图标操作：

![图标操作](https://tdesign.gtimg.com/site/design/images/图标操作-1836409.jpg)



#### 1.2.3. 自定义显示列

当表格中数据列显示较多时，可结合业务逻辑自定义设置需要显示的数据列。



自定义设置表格列：

![自定义设置表格列](https://tdesign.gtimg.com/site/design/images/自定义设置表格列-1836417.jpg)



点击后，弹窗设置：

![自定义设置表格列-弹窗](https://tdesign.gtimg.com/site/design/images/自定义设置表格列-弹窗-1836427.jpg)





### 1.3. 数据对齐



#### 3.3.1. 横向数据行对齐规则

**顶部对齐** : 当同一数据行中出现多行，建议内容顶部对齐，数据之间自动形成规整的线，便于视线的流动；

**居中对齐** : 当单行时，建议内容居中对齐，用户横向快速浏览。



顶部对齐：

![编组](https://tdesign.gtimg.com/site/design/images/编组-1836440.jpg)



居中对齐：

![编组 2](https://tdesign.gtimg.com/site/design/images/编组 2-1836447.jpg)



#### 1.3.2. 纵向数据列对齐规则

在表格中尽量不要对数据进行居中对齐，没有明确边界的数据会降低查看效率。表格中列的对齐规则如下：

**数值型数据右对齐** : 便于对比数字的量级和大小（小数点后位数要一致，便于更好的右对齐；精度保证的前提下位数尽量少，如果主体落在整数部分则小数控制在1~2位）；

**文本型数据左对齐** : 整体上符合人们从左往右的阅读习惯。因此，日期型、IP地址、ID、区间这类由数字字符串组成的数据也属于文本型数据。



数值右对齐，文本左对齐：

![3.3.2纵向数据列对齐规则](https://tdesign.gtimg.com/site/design/images/3.3.2纵向数据列对齐规则-1836468.jpg)



### 1.4. 数据呈现：零值、空值

当单元格数据零值时，显示为“0” ，而且数据格式（如小数位等）与同列数据保持一致；

数据空值时，则单元格显示“-”。



零值、空值：

![3.4 数据呈现：零值、空值](https://tdesign.gtimg.com/site/design/images/3.4 数据呈现：零值、空值-1836500.jpg)



### 1.5. 表格加载

表格加载包含两种：表格数据刷新加载 和 表格数据异步加载。

**刷新加载**：整个表格覆盖蒙层，并用刷新图标展示加载状态，加载后，刷新表格数据；

**异步加载**：滚动表格至底部时触发内容加载，表格底部图标+文字展示加载状态。加载后，新数据跟随表格原有数据呈现。



刷新加载：

![表格加载](https://tdesign.gtimg.com/site/design/images/表格加载-1836513.jpg)



异步加载：

![异步加载](https://tdesign.gtimg.com/site/design/images/异步加载-1836520.jpg)



### 1.6. 表格空状态

表格空状态一般出现在以下场景：用户未进行操作、用户操作结果（如清空数据、搜索或筛选无结果等）、出现错误（网络异常、接口调用失败等）以及

权限限制（无权限查看内容）。



清空数据：

![image2020-9-21_17-55-27](https://tdesign.gtimg.com/site/design/images/image2020-9-21_17-55-27-1836527.png)



网络异常：

![image2020-9-21_17-56-12](https://tdesign.gtimg.com/site/design/images/image2020-9-21_17-56-12-1836533.png)



权限限制：

![image2020-9-21_17-56-47](https://tdesign.gtimg.com/site/design/images/image2020-9-21_17-56-47-1836549.png)



### 1.7. 表格操作



#### 1.7.1. 支持单选、多选操作

在涉及到表单选择、或批量操作场景中，可在数据行前直接单选或多选操作对象。



单选：

![单选-1](https://tdesign.gtimg.com/site/design/images/单选-1.jpg)



多选：

![多选-1](https://tdesign.gtimg.com/site/design/images/多选-1.jpg)

###  

#### 1.7.2. 升降序

提供初始排序，根据内容而定：时序数据按时间降序、金额按降序或升序或采用综合排序等；

不同字段排序逻辑：**文本、数值和日期**，如下：

**文本**：数字大小 / a-z / A-Z / 汉字 / 其他字符排序；
**数值**：大小排序；
**日期**：先后排序。

![编组 4](https://tdesign.gtimg.com/site/design/images/编组 4-1836574.jpg)



#### 1.7.3. 筛选、提示等



按一定的数据维度进行筛选：

![筛选](https://tdesign.gtimg.com/site/design/images/筛选-1836609.jpg)



筛选态，并在表格第一行呈现筛选条件内容：

![表格筛选替换](https://tdesign.gtimg.com/site/design/images/表格筛选替换.png)



对标签进行注释，鼠标hover时呈现说明内容：

![标签说明](https://tdesign.gtimg.com/site/design/images/标签说明-1836627.jpg)