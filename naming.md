# 团队语言规范
产品的设计开发离不开团队协作。设计资源的新增与使用会难以避免地缺乏规划性，解决方案时常被重复地定义着。

所以在TDesign设计体系，我们必须确保所有人对于这些标准的定义及运用方式有着一致的认知，通过标准化的协作语言来进行工作。
# 命名规范

|用途|中文|英文|
| :- | :- | :- |
|服务于互联网产品设计中具有内在关联性的、组织有序的设计资产和辅助工具|设计体系|Design System|
|设计体系对外品牌名称|暂无|TDesign|
|提供给设计师和前端工程师可复用的界面组成要素，功能流程与交互行为等|资产|Design Assets|
|提供给设计师使用的规范文档|设计指南|Design Guideline|
|设计资产包含的UIkit，页面模版等设计师使用的部分|设计资源|Component Library|
|设计资产包含的开发同学使用的代码组件，开发文档|组件库||
|组件库中提供的不同开发语言的版本||<p>Web for React </p><p>Mobile for Vue</p>|
|TDesign 提供的是通用的界面组成要素，例如文本标签，输入框，按钮等|基础组件||
|由基础组件结合业务属性，通常为某内垂直行业定制的组件|行业组件||
|由组件结合的要素|模块||
|由模块和模块组合构成的界面|页面模版||
|不同的设备端口|<p>桌面端</p><p>移动端</p>|<p>Web</p><p>Mobile</p>|
# 设计资产控件命名及分类规范
设计资产中的涉及到基础组件/高阶组件和组件库是一一对应关系，两者命名和分类保持一致，确保设计师使用的任何控件，在组件库内可以找到对应的代码。

具体的控件规范，设计师请参考设计指南；开发工程师请参考组件库。
## 组件的命名
按照设计师和前端工程师的共同认知进行命名和归类

|**基础(Basic)**|**布局(Layout)**|**导航(Navigations)**|**数据类(Data)**|**沟通类（Notice）**|**输入类(Input)**|**其他Others**|
| :- | :- | :- | :- | :- | :- | :- |
|色彩Color|布局Layout|选项卡Tabs|图表Diagram|全局提醒Message|输入框Input|模态抽屉Drawer|
|字体Fonts|栅格Grid|步骤条Steps|列表List|文字提示Tootip|日期选择器DatePicker|锚点Anchor|
|图标Icon|卡片Card|面包屑Breadcrumb|表格Table|加载中Loading|时间选择器TimePicker|标签Tag|
|动效Motion|走马灯Carousel|分页Pagination|表单Form|警告提示Alert|单选框Radio||
|按钮Button|分割线Divider|导航菜单Menu|树Tree|徽标数Badge|多选框Checkbox||
|||||用户引导Onboarding|搜索框Search||
|||||气泡确认Popconfirm|穿梭框Transfer||
|||||对话框Dialog|下拉菜单Dropdown||
|||||消息通知Notification|树选择TreeSelect||
||||||上传Upload||
||||||开关Switch||
||||||选择器Select||

