---
title: Upload 上传
description: 上传组件允许用户传输文件或提交自己的内容。
isComponent: true
usage: { title: '', description: '' }
spline: form
---

### 上传功能分类

文件上传功能速查表，共 7 种风格，不在表格中的属性组合均不支持。

| 图片/文件 | 是否批量 | 允许拖拽 | API |
| -- | -- | -- | -- |
| 文件 | 单文件 | 不允许拖拽 | theme=file, multiple=false |
| 文件 | 批量文件 | 不允许拖拽 | theme=file, multiple=true |
| 文件 | 单文件 | 不允许拖拽，输入框风格 | theme=single-input, multiple=false |
| 文件 | 批量文件 | 允许拖拽 | theme=file-flow, multiple=true, draggable=true |
| 图片 | 单图片 | 不允许拖拽 | theme=image, multiple=false |
| 图片 | 批量图片 | 不允许拖拽 | theme=image, multiple=true |
| 图片 | 批量图片 | 允许拖拽 | theme=image-flow, multiple=true, draggable=true |

### 基础文件上传

基础文件上传风格，设置 `theme=file` 即可，这种风格不支持拖拽上传，文档下方有拖拽上传和批量上传示例。

- `action` 表示上传接口地址。
- `formatRequest` 用于格式化上传接口请求参数，可以新增或修改参数。
- `formatResponse` 用于格式化接口响应值，如果响应值中的 `error` 字段存在，则会判定本次上传失败。
- `sizeLimit` 用于设置文件大小限制，如果超出限制不会触发上传请求。
- `allowUploadDuplicateFile` 是否允许上产相同文件名的文件。
- `onSelectChange` 会在文件选择之后，上传请求发起之前触发。
- `onSuccess` 会在上传成功后触发。
- `onFail` 会在上传失败后出发。

{{ base }}

### 输入框单文件上传

设置 `theme="single-input"` 即可，这种风格不支持拖拽上传，文档下方有拖拽上传和批量上传示例。

{{ single-input }}

### 基础图片上传

图片上传成功后，显示预览图片；图片上传失败后，不显示预览图片。

设置属性 `theme="image"` 即可，这种风格不支持拖拽上传，文档下方有拖拽上传和批量上传示例。

图片预览地址，默认会读取上传接口返回的 `url` 字段。如果想要自定义图片预览地址，可以通过 `formatResponse` 设置。如果接口和`formatResponse` 没有返回 `url` 字段，组件会默认填充一个 base64 的预览地址，以便查阅图片。

{{ image }}

### 单文件拖拽上传

支持拖拽文件到指定区域触发上传，支持图片和文件两种类型。

- 组件内的所有文本均可通过 `locale` 统一配置，也支持全局配置。
- 如果拖拽上传单个文件，设置 `theme="file"` 和 `draggable=true`。
- 如果拖拽上传单张图片，设置 `theme="image"` 和 `draggable=true`。

{{ draggable }}

### 批量上传文件

批量上传通常作为一个单独的功能出现，上传的内容用表格来承载。由于批量上传需要的时间较长，某些场景下会出现先选择文件，确认后再统一上传的场景。

- 批量文件上传，请设置属性 `theme="file-flow"` 和 `multiple=true`。

{{ file-flow-list }}

### 批量上传图片

- 批量图片上传，请设置属性 `theme="image-flow"` 和 `multiple=true`。
- 使用 `uploadAllFilesInOneRequest` 与 `batchUpload` 实现多文件批量合并上传。
- 使用 `allowUploadDuplicateFile` 实现多文上传时可重复选择重名文件。

{{ img-flow-list }}

### 自定义上传方法

可以使用 `requestMethod` 自定义上传方法，返回 Promise 对象，resolve 参数中的 `status` 控制上传成功或失败。

{{ request-method }}

### 自定义风格上传

{{ single-custom }}

### 自定义拖拽上传

{{ custom-drag }}
