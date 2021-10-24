# Table 表格

表格常用于展示同类结构下的多种数据，易于组织、对比和分析等，并可对数据进行搜索、筛选、排序等操作。一般包括表头、数据行和表尾三部分。

##### 在 TDesign 中，提供多种不同形式的表格：基础表格、带边框线、斑马线表格、固定行列表格、展开收起表格、行列合并表格、多级表头表格、排序表格和可选择数据行等。

### 基础表格

简单表格，使用分页切换数据。使用边框线、斑马纹等清晰呈现各数据单元格边界线，辅助信息区隔。

支持控制组件是否显示 边框线(bordered)、斑马纹(stripe)、悬浮态(hover)等。

{{ base }}

### 固定表头和列


在浏览数据时，可以根据实际使用需要将表格表头、列固定，便于信息对照或操作。

#### 固定表头

表格内容高度超出后，滚动时表头会自动固定。可通过 height 或 maxHeight 设置表格高度，单位同 CSS 属性。

{{ fixed-header }}

#### 固定列

支持固定左侧列和固定右侧列。可通过给列属性设置 `fixed: 'left'` 或 `fixed: right` 以达成固定列效果。

{{ fixed-column }}

#### 固定表头和列

支持同时固定表头和固定列。

{{ fixed-header-col }}

### 展开收起

表格提供可收纳功能，展开后可以进一步查看详细内容。

支持控制展开图标是否显示、何时显示、如何显示等。关键 API `expandIcon`

{{ expandable }}

### 自定义单元格/表头

为满足复杂的业务需求，单元格和表头均支持自定义。

#### 自定义单元格

{{ custom-cell }}

#### 自定义表头

{{ custom-header }}

### 排序

对先后顺序有要求的场景（如安全策略场景），提供表格排序能力，用户可以调整位置。

支持单字段排序、多字段排序、远程数据排序、本地数据排序等。

#### 单字段排序

- 将需要排序的列属性 `sorter` 设置为 true，示例：`{ colKey: 'date', title: '日期', sorter: true }`
- 设置表格排序属性 `sort` 的值为 `{ sortBy: 'date', descending: true }`，其中 descending 表示是否为降序排序，值为 true 表示降序，值为 false 表示升序
- 排序发生变化时，监听事件 `onSortChange`，在事件处理程序中添加业务逻辑

至此，单字段排序功能完成。

在某些特殊的场景下，可能某些字段只能支持降序排，不能升序徘。为此，我们特别提供了列属性 `sortType`，用于自定义支持哪些排序方式。sortType 可选值有 desc/asc/all，分别表示只能降序徘、只能升序徘、降序和升序都可以。

{{ single-sort }}

#### 多字段排序

- 设置表格属性 `multipleSort` 为 true
- 将需要排序的列属性 `sorter` 设置为 true，可以设置多个列，示例：`[{ colKey: 'date', title: '日期', sorter: true }, { colKey: 'cost', title: '花费', sorter: true }]`
- 设置表格排序属性 `sort` 的值为 `[{ sortBy: 'date', descending: true }, { sortBy: 'cost', descending: false }]`
- 排序发生变化时，监听事件 `onSortChange`，在事件处理程序中添加业务逻辑

至此，多字段排序功能完成。

{{ multiple-sort }}

#### 本地数据排序

本地数据排序，表示组件内部会对参数 data 进行数据排序。如果 data 数据为 10 条，就仅对这 10 条数据进行排序。

- 将需要排序的列属性 `sorter` 设置为 true，示例：`{ colKey: 'date', title: '日期', sorter: (a, b) => a.status - b.status  }`
- 设置表格排序属性 `sort` 的值为 `{ sortBy: 'date', descending: true }`
- 排序发生变化时，监听事件 `onSortChange`，在事件处理程序中添加业务逻辑

至此，本地单字段排序功能完成。和前面提到的单字段排序仅有 `sorter` 配置的区别

{{ data-sort }}

### 选中行

在涉及到表单选择、或批量操作场景中，可在数据行前直接单选或多选操作对象。

#### 单选

{{ select-single }}

#### 多选

{{ select-multiple }}
### 分页

#### 远程数据分页

远程数据分页，表示组件内部不会对参数 data 进行分页。只输出分页信息，以供远程请求进行分页。

{{ pagination-ajax }}
#### 本地数据分页

本地数据分页，表示组件内部会对参数 data 进行分页

{{ pagination }}

### 筛选

{{ filter-controlled }}

### 合并单元格

根据数据结构，可以将表格中的行列进行合并。

{{ merge-cells }}


### 多级表头

表头数据标签可采用多级呈现，表述信息层级包含关系。

{{ multi-header }}

### 加载状态

#### 普通加载

{{ loading }}

#### 异步加载

{{ async-loading }}

### 空表格

使用默认空表格样式。

{{ empty }}

### 拖拽排序

{{ drag-sort }}

### 树形结构

{{ tree }}
