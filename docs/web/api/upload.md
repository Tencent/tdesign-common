---
title: Upload 上传
description: 上传组件允许用户传输文件或提交自己的内容。
isComponent: true
usage: { title: '', description: '' }
spline: form
---

### 基础上传

`action` 用于定义上传接口地址。`format` 用于格式化上传参数。`formatResponse` 用于格式化返回值，如果返回值中的 `error` 为真，则表示上传失败。

{{ base }}

### 拖拽上传

支持拖拽文件到指定区域触发上传。

{{ draggable }}

### 图片上传

图片上传成功后，显示预览图片；图片上传失败后，不显示预览图片。

图片预览地址，默认会读取上传接口返回的 `url` 字段。如果想要自定义图片预览地址，可以通过 `formatResponse` 设置。如果接口和`formatResponse` 没有返回 `url` 字段，组件会默认填充一个 base64 的预览地址，以便查阅图片。

{{ image }}

### 批量上传

批量上传通常作为一个单独的功能出现，上传的内容用表格来承载。由于批量上传需要的时间较长，某些场景下会出现先选择文件，确认后再统一上传的场景。

#### 批量上传文件

{{ file-flow-list }}

#### 批量上传图片

{{ img-flow-list }}

### 合并上传文件

使用 `uploadAllFilesInOneRequest` 与 `batchUpload` 实现多文件批量合并上传。

{{ file-flow-list-batch-upload }}

### 文件重复上传

使用 `allowUploadDuplicateFile` 实现多文上传时可重复选择重名文件。

{{ file-flow-list-duplicate }}

### 自定义上传方法

可以使用 `requestMethod` 自定义上传方法，返回 Promise 对象，resolve 参数中的 `status` 控制上传成功或失败。

{{ request-method }}

### 自定义风格上传

{{ single-custom }}

### 自定义拖拽上传

{{ custom-drag }}
