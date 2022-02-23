---
title: Table 表格
description: 表格常用于展示同类结构下的多种数据，易于组织、对比和分析等，并可对数据进行搜索、筛选、排序等操作。一般包括表头、数据行和表尾三部分。
isComponent: true
spline: data
---

### 表格分类

随着表格功能越来越多，如果把所有的功能都集中在一个组件里面，代码文件会越来越臃肿。既不利于维护，也不利于按需引入必要功能的业务。

因此，表格组件有三个：`BaseTable`（基础表格）、`PrimaryTable`（主表格）、`EnhancedTable`（增强型表格），三种表格都会导出。默认导出 `PrimaryTable`。

- `BaseTable`（基础表格）包含一些基础功能：固定表头、固定列、冻结行、加载态、分页、多级表头、合并单元格、自定义单元格、自定义表头、自定义表尾、文本省略、对齐方式、表格事件、尺寸、行类名、边框、斑马线、悬浮态、空数据等
- `PrimaryTable`（主表格）包含一些更高级的功能：行展开/收起、过滤、排序、异步加载、拖拽排序等。`PrimaryTable` 包含 `BaseTable` 的所有功能
- `EnhancedTable`（增强型表格）包含一些更复杂的功能：树形结构等。`EnhancedTable` 包含 `BaseTable` 和 `PrimaryTable` 的所有功能

一般情况下，直接使用 `PrimaryTable` 即可满足 90% 的需求，即默认导出的表格。涉及到非常复杂的需求后，使用 `EnhancedTable`。

### 基础表格

简单表格，使用分页切换数据。使用边框线、斑马纹等清晰呈现各数据单元格边界线，辅助信息区隔。

表格宽度模式有两种：`fixed` 和 `auto`，[MDN 详细解释](https://developer.mozilla.org/zh-CN/docs/Web/CSS/table-layout)，组件默认为 `fixed`。

{{ base }}

### 固定表头和列的表格

在浏览数据时，可以根据实际使用需要将表格表头、列固定，便于信息对照或操作。

#### 固定表头的表格

表格内容高度超出后，滚动时表头会自动固定。可通过 `height` 或 `maxHeight` 设置表格高度，单位同 CSS 属性。建议使用 `maxHeight` 自适应高度。

表格宽度模式有两种：`fixed` 和 `auto`，[MDN 详细解释](https://developer.mozilla.org/zh-CN/docs/Web/CSS/table-layout)，组件默认为 `fixed`。如果希望表格列宽自适应，设置 `table-layout: auto` 即可。

{{ fixed-header }}

#### 固定列的表格

列的数量过多时，使用固定列方便表格数据内容呈现，支持固定左侧列和固定右侧列。可通过给列属性设置 `fixed: 'left'` 或 `fixed: right` 以达成固定列效果。

表格宽度模式有两种：`fixed` 和 `auto`，[MDN 详细解释](https://developer.mozilla.org/zh-CN/docs/Web/CSS/table-layout)，组件默认为 `fixed`。如果希望表格列宽自适应，设置 `table-layout: auto` 即可，这种模式下固定列必须指定表格内容的总宽度，即 `tableContentWidth`，内容宽度的值必须大于表格可见宽度。

{{ fixed-column }}

#### 固定表头和列的表格

支持同时固定表头和固定列。

表格宽度模式有两种：`fixed` 和 `auto`，[MDN 详细解释](https://developer.mozilla.org/zh-CN/docs/Web/CSS/table-layout)，组件默认为 `fixed`。如果希望表格列宽自适应，设置 `table-layout: auto` 即可，这种模式下固定列必须指定表格内容的总宽度，即 `tableContentWidth`，内容宽度的值必须大于表格可见宽度。

{{ fixed-header-col }}

### 可展开和收起的表格

表格提供可收纳功能，展开后可以进一步查看详细内容。

- `expandedRowKeys` 用于存储展开行的值，支持非受控属性 `defaultExpandedRowKeys`。
- `expandedRow` 用于定义展开行显示的具体内容，参数有 `{ row, rowIndex }`。
- `expandIcon` 用于自定义展开图标，值为 true 显示默认图标，值为 false 不显示图标，值为函数则表示完全自定义图标。
- `expandOnRowClick` 表示是否允许点击表格行时展开。
- 展开行发生变化时会触发展开行变化事件。

{{ expandable }}

### 自定义的表格

为满足复杂的业务需求，单元格和表头均支持自定义。

#### 自定义单元格的表格

单元格默认使用 `row[colKey]` 渲染数据内容，自定义单元格有以下 3 种方式：

- 使用 `cell` 作为渲染函数，函数参数为：`{col, colIndex, row, rowIndex}`。

- 对于有插槽特性的框架，支持插槽，使用 `cell` 的值作为插槽名称；如果 `cell` 值为空，则默认取 `colKey` 作为插槽名称。

- 【不推荐使用】使用 `render` 渲染函数，函数参数为：`{col, colIndex, row, rowIndex, type}`，其中 `type` 的值为 `title`。

{{ custom-cell }}

### 自定义表头的表格

标题默认使用 `title` 渲染，自定义标题则有以下 3 种方式：

- 使用 `title` 作为渲染函数，函数参数为：`title({ col, colIndex })`。

- 对于有插槽特性的框架，支持插槽，使用 `title` 的值作为插槽名称。

- 【不推荐使用】使用 `render` 作为渲染函数，函数参数为：`render({ col, colIndex, row, rowIndex, type })`，其中 `type` 值为 `cell`。使用排序、过滤等功能时不能使用该方法。

{{ custom-header }}

### 自定义表尾的表格

表格提供自定义表尾功能，可用于表尾数据统计等场景。使用 `foot` 定义表尾内容。

- 默认输出 `foot` 字符串，如果 `foot` 类型为函数，则作为表尾渲染函数自定义表尾内容。
- 对于有插槽特性的框架，支持插槽，使用 `foot` 的值作为插槽名称。

#### 可进行列配置的表格

自定义设置需要展示的列，可以通过 `columnController` 字段来设置，其中：
- `columnController.fields` 来设置可以自定义的列，不传表示全部可自定义。
- `columnController.displayType` 用来设置自定义列的内容展示的方式，有 `auto-width` 和 `fixed-width` 可选。

{{ custom-col }}

### 可排序的表格

对先后顺序有要求的场景（如安全策略场景），提供表格排序能力，用户可以调整位置。

#### 单字段排序

- 将需要排序的列属性 `sorter` 设置为 `true`，示例：`{ colKey: 'date', title: '日期', sorter: true }`。
- 设置表格排序属性 `sort` 的值为 `{ sortBy: 'date', descending: true }`，其中 `descending` 表示是否为降序排序，值为 `true` 表示降序，值为 `false` 表示升序。
- 排序发生变化时，监听事件 `onSortChange`，在事件处理程序中添加业务逻辑。

提供列属性 `sortType`，用于自定义支持排序方式。可选值有 `desc`/`asc`/`all`，分别表示只能降序徘、只能升序徘、降序和升序。

{{ single-sort }}

#### 多字段排序

- 设置表格属性 `multipleSort` 为 true。
- 将需要排序的列属性 `sorter` 设置为 true，可以设置多个列，示例：`[{ colKey: 'date', title: '日期', sorter: true }, { colKey: 'cost', title: '花费', sorter: true }]`。
- 设置表格排序属性 `sort` 的值为 `[{ sortBy: 'date', descending: true }, { sortBy: 'cost', descending: false }]`

{{ multiple-sort }}

#### 本地数据排序

本地数据排序，表示组件内部会对参数 data 进行数据排序。如果 data 数据为 10 条，就仅对这 10 条数据进行排序。

- 将需要排序的列属性 `sorter` 设置为排序函数，示例：`{ colKey: 'date', title: '日期', sorter: (a, b) => a.status - b.status }`。
- 设置表格排序属性 `sort` 的值为 `{ sortBy: 'date', descending: true }`。
- 排序发生变化时，监听事件 `onSortChange`，在事件处理程序中添加业务逻辑。
- 排序发生变化时，因为是本地数据排序，因此数据也会发生变化，需要监听 `onDatachange`，事件处理受控数据。

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

本地数据分页，表示组件内部会对参数 `data` 进行分页。

{{ pagination }}

### 可筛选的表格

组件默认内置：复选框、单选按钮、输入框等类型的筛选器。同时，也可以自定义任何筛选器，如示例中的日期选择器。

- 表格属性 `filterValue` 用于设置过滤功能默认值，示例：`{ firstName: '' }`。
- 筛选器值发生变化时，会触发 `filterChange` 事件。
- 列配置 `filter.type` 决定使用哪一种筛选器，可选值有：`single/multiple/input`，分别表示：单选按钮筛选器、复选框筛选器、输入框筛选器。
- 列配置 `filter.list` 用于配置当前筛选器可选值有哪些，仅当 `filter.type` 等于 single 或 multiple 时有效。
- 列配置 `filter.props` 用于透传筛选器属性，可以对筛选器进行任何原组件支持的属性配置.
- 列配置 `filter.component` 用于自定义筛选器，只要保证自定义筛选器包含 `value` 属性 和 `change` 事件，即可像内置筛选器一样正常使用。
- 列配置 `filter.showConfirmAndReset` 用于控制是否显示“确认”“重置”按钮.
- 列配置 `filter.resetValue` 用于设置点击“重置”按钮时的重置值，并非每个场景都会重置为 `''` 或 `[]` `null`，默认重置为 `''`。
- 表格属性 `filterRow` 可完全自定义过滤结果行显示内容

{{ filter-controlled }}

### 带合并单元格的表格

根据数据结构，可以将表格中的行列进行合并。

{{ merge-cells }}

### 多级表头的表格

表头数据标签可采用多级呈现，表述信息层级包含关系。

{{ multi-header }}

### 加载状态的表格

#### 普通加载

普通加载，会在表格上面显示半透明加载层，表格内容不隐藏。

- `loading=true` 显示默认加载状态；`loading=false` 不显示加载状态；`loading`值类型为函数，则表示自定义加载状态文本内容，对于支持插槽的框架还支持同名插槽（不包含加载图标）。
- `loadingProps` 用于透传加载组件全部属性，可以使用该特性定制化更多个性加载状态。

{{ loading }}

#### 异步加载

使用 `asyncLoading` 定义异步加载状态。

- `asyncLoading=''` 表示非加载状态或加载完成状态；
- `asyncLoading='load-more'` 表格底部显示“加载更多”；
- `asyncLoading='loading'` 表格底部显示“正在加载中，请稍后”；
- `asyncLoading` 值类型为函数，则表示完全自定义底部异步加载内容。

{{ async-loading }}

### 空表格

使用默认空表格样式。

{{ empty }}

### 可拖拽排序的表格

#### 行拖拽排序

{{ drag-sort }}

#### 列拖拽排序

{{ drag-col-sort }}

### 树形结构的表格

请使用 `EnhancedTable`，`Table/PrimaryTable/BaseTable` 等不支持树形结构。

#### 树形结构显示

如果数据源中存在字段 `children`，表格会自动根据 children 数据显示为树形结构，无需任何特殊配置。如果数据中的子节点字段不是 `children`，可以使用 `tree.childreKey` 定义字段别名，示例：`tree={ childrenKey: 'list' }`。

除了定义子节点别名，树形结构还支持定义缩进距离、第几列显示为树结点展开等。更多信息查看 API 文档的 `tree` 属性。

{{ tree }}

#### 树形结构行选中

{{ tree-select }}
