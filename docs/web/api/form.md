# Form 表单

用以收集、校验和提交数据，一般由输入框、单选框、复选框、选择器等控件组成。 

### 何时使用

用于需要收集信息；

对输入的信息进行校验。

## 组件类型

### 典型表单

一个典型表单组件包含各种表单项，比如输入框、选择器、单选框、多选框、开关、文本输入等。

{{ base }}

### 注册表单

新用户注册时常用的表单形式，包括邮箱、密码、确认密码等。

{{ register }}

### 登录表单

专门适用于登录页面的账号级密码输入的表单。

{{ login }}

### 动态增减表单

{{ dynamic }}

### 不同尺寸的表单

为了适应不同尺寸的布局，TD提供大小两种不同尺寸的表单

{{ size }}

### 不同对齐方式的表单（需要设计提供demo原型）

TDesign根据具体目标和制约因素，选择最佳的标签对齐方式，默认对齐方式为右对齐

{{ align }}

### 不同布局类型的表单

{{ layout }}

### 不同状态的表单

{{ status }}

#### 验证状态

在防止用户犯错的前提下，尽可能让用户更早地发现并纠正错误。
表单内置的校验规则有：date / url / email / required / boolean / max / min / len / number / enum / idcard / telnumber / pattern。
其中 `date` / `url` / `email` 等校验规则参数参看：[https://github.com/validatorjs/validator.js](https://github.com/validatorjs/validator.js)

{{ validator }}

#### 提示状态

以icon或者提示文字的形式来提示用户对表单的填写

{{ validator-status }}

### 表单校验

以icon或者提示文字的形式来提示用户对表单的填写

{{ custom-validator }}
