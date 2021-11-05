# Table 表格

表格常用于展示同类结构下的多种数据，易于组织、对比和分析等，并可对数据进行搜索、筛选、排序等操作。一般包括表头、数据行和表尾三部分。

### 基础表格

简单表格，使用分页切换数据。使用边框线、斑马纹等清晰呈现各数据单元格边界线，辅助信息区隔。

{{ base }}

### 固定表头和列的表格


在浏览数据时，可以根据实际使用需要将表格表头、列固定，便于信息对照或操作。

#### 固定表头的表格

表格内容高度超出后，滚动时表头会自动固定。可通过 `height` 或 `maxHeight` 设置表格高度，单位同 CSS 属性。

{{ fixed-header }}

#### 固定列的表格

支持固定左侧列和固定右侧列。可通过给列属性设置 `fixed: 'left'` 或 `fixed: right` 以达成固定列效果。

{{ fixed-column }}

#### 固定表头和列的表格

支持同时固定表头和固定列。

{{ fixed-header-col }}

### 可展开和收起的表格

表格提供可收纳功能，展开后可以进一步查看详细内容。

{{ expandable }}

### 自定义单元格/表头的表格

为满足复杂的业务需求，单元格和表头均支持自定义。

#### 自定义单元格的表格

标题默认使用 `title` 渲染，自定义标题则有以下几种方式：

- 使用 `title` 作为渲染函数，函数参数为：`title({ col, colIndex })`

- 插槽，使用 `title` 的值作为插槽名称

- 【不推荐使用】使用 `render` 作为渲染函数，函数参数为：`render({col, colIndex, row, rowIndex, type})`，
单元格的 `type` 值为 cell，标题的 `type` 值为 title。使用排序、过滤等功能时不能使用该方法

{{ custom-cell }}

#### 自定义表头的表格

{{ custom-header }}

### 可排序的表格

对先后顺序有要求的场景（如安全策略场景），提供表格排序能力，用户可以调整位置。

#### 单字段排序

- 将需要排序的列属性 `sorter` 设置为 `true`，示例：`{ colKey: 'date', title: '日期', sorter: true }`
- 设置表格排序属性 `sort` 的值为 `{ sortBy: 'date', descending: true }`，其中 `descending` 表示是否为降序排序，值为 `true` 表示降序，值为 `false` 表示升序
- 排序发生变化时，监听事件 `onSortChange`，在事件处理程序中添加业务逻辑

提供列属性 `sortType`，用于自定义支持排序方式。可选值有 `desc`/`asc`/`all`，分别表示只能降序徘、只能升序徘、降序和升序。

{{ single-sort }}

#### 多字段排序

- 设置表格属性 `multipleSort` 为 true
- 将需要排序的列属性 `sorter` 设置为 true，可以设置多个列，示例：`[{ colKey: 'date', title: '日期', sorter: true }, { colKey: 'cost', title: '花费', sorter: true }]`
- 设置表格排序属性 `sort` 的值为 `[{ sortBy: 'date', descending: true }, { sortBy: 'cost', descending: false }]`
- 排序发生变化时，监听事件 `onSortChange`，在事件处理程序中添加业务逻辑

{{ multiple-sort }}

#### 本地数据排序

本地数据排序，表示组件内部会对参数 data 进行数据排序。如果 data 数据为 10 条，就仅对这 10 条数据进行排序。

- 将需要排序的列属性 `sorter` 设置为排序函数，示例：`{ colKey: 'date', title: '日期', sorter: (a, b) => a.status - b.status  }`
- 设置表格排序属性 `sort` 的值为 `{ sortBy: 'date', descending: true }`
- 排序发生变化时，监听事件 `onSortChange`，在事件处理程序中添加业务逻辑

{{ data-sort }}

### 可选中行的表格

在涉及到表单选择、或批量操作场景中，可在数据行前直接单选或多选操作对象。

#### 单选

{{ select-single }}

#### 多选

{{ select-multiple }}
### 可分页的表格

#### 远程数据分页

远程数据分页，表示组件内部不会对参数 `data` 进行分页。只输出分页信息，以供远程请求进行分页。

{{ pagination-ajax }}
#### 本地数据分页

本地数据分页，表示组件内部会对参数 `data` 进行分页

{{ pagination }}

### 可筛选的表格

{{ filter-controlled }}

### 带合并单元格的表格

根据数据结构，可以将表格中的行列进行合并。

{{ merge-cells }}


### 多级表头的表格

表头数据标签可采用多级呈现，表述信息层级包含关系。

{{ multi-header }}

### 加载状态的表格

#### 普通加载

{{ loading }}

#### 异步加载

{{ async-loading }}

### 空表格

使用默认空表格样式。

{{ empty }}

### 可拖拽排序的表格

{{ drag-sort }}

### 树形结构的表格

{{ tree }}
