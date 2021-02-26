## 1.组件设计指南

### 1.1.使用规范

#### 1.1.1. 当模块内容能在一屏内全部展示完，无需显示分页控件。

![使用规范1](https://tdesign.gtimg.com/site/design/images/使用规范1-1822808.jpg)

![使用规范2](https://tdesign.gtimg.com/site/design/images/使用规范2-1822821.jpg)

#### 1.1.2. 当模块内有多选选项时，在选中多选的状态下，建议选择可展示数据总量的分页控件。

![使用规范3](https://tdesign.gtimg.com/site/design/images/使用规范3-1822839.png)



#### 1.1.3. 在小型模块当中需要用到的分页控件，可以使用极简版或迷你版，以节省空间。

![使用规范4](https://tdesign.gtimg.com/site/design/images/使用规范4-1822867.jpg)

### 1.2.组件拆解

完整的分页控件内容有：信息提示（已选、总数展示）、翻页操作按钮、分页页码按钮、每页显示行数设置、页面快捷跳转。

![组件拆解](https://tdesign.gtimg.com/site/design/images/组件拆解-1822876.jpg)

### 1.3.组件状态

分页的状态分为可用和禁用状态。

![状态](https://tdesign.gtimg.com/site/design/images/状态-1822890.jpg)

### 1.4.对齐/布局方式

分页控件一般出现在页面模块（列表、表格）后面，通常居于页面底部的右下角。

![对齐方式](https://tdesign.gtimg.com/site/design/images/对齐方式-1822898.jpg)


## 交互逻辑

### 分页

#### 基础分页（少于5页）

所有分页按钮均可按

![交互逻辑1](https://tdesign.gtimg.com/site/design/images/交互逻辑1-1822911.jpg)



#### 基础分页（多于5页少于10页）

当页面在第一页时，左翻页按钮置灰不能按

![基础（多于5页）-1](https://tdesign.gtimg.com/site/design/images/基础（多于5页）-1.png)

当页面在非第一页和最后一页，左右翻页正常用

![交互逻辑3](https://tdesign.gtimg.com/site/design/images/交互逻辑3-1822970.jpg)

当页面在最后一页时，右翻页不出现

![交互逻辑4](https://tdesign.gtimg.com/site/design/images/交互逻辑4-1822973.jpg)



#### 大量页面分页

当前页在1-3时，展示前5页码及最后一页

![交互逻辑5](https://tdesign.gtimg.com/site/design/images/交互逻辑5-1822992.jpg)



当前页在4页至最后倒数3页之间，展示首、尾页、以及当前页前后两页，中间页用...省略：

![交互逻辑6](https://tdesign.gtimg.com/site/design/images/交互逻辑6-1823000.jpg)



页面展示数量选择：

![交互逻辑7](https://tdesign.gtimg.com/site/design/images/交互逻辑7-1823010.jpg)



迷你版切换页面：

![交互逻辑8](https://tdesign.gtimg.com/site/design/images/交互逻辑8-1823017.jpg)



快速跳转至指定页：

输入框内输入指定页后，回车即跳转至该页面。

![交互逻辑9](https://tdesign.gtimg.com/site/design/images/交互逻辑9-1823028.jpg)