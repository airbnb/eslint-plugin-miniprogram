# eslint-plugin-miniprogram

[![npm](https://img.shields.io/npm/v/eslint-plugin-miniprogram.svg)](https://www.npmjs.com/package/eslint-plugin-miniprogram)
[![Build Status](https://travis-ci.com/airbnb/eslint-plugin-miniprogram.svg?branch=master)](https://travis-ci.com/airbnb/eslint-plugin-miniprogram)

[English Version](./README.md)

## 关于

该插件可以帮助你 lint 你的小程序代码。

### 关于 `.mina` 文件

关于开发 `.mina` 文件的细节，请参考 [mina-webpack](https://github.com/tinajs/mina-webpack) 项目。

## 如何使用

安装插件：

```bash
npm install --save-dev eslint eslint-plugin-miniprogram
```

在 `.eslintrc.js` 文件里加入：

```js
// .eslintrc.js
module.exposts = {
  // you'll need vue-eslint-parser for `.mina` files
  parser: "vue-eslint-parser",
  plugins: [
    // amongst other other plugins, e.g. prettier
    "prettier",
    // 加入这个插件
    "miniprogram"
  ]
};
```

添加以下规则：

```js
// .eslintrc.js
module.exposts = {
  rules: {
    // 其他规则
    "miniprogram/attribute-event-name-case": ["error", "camel"],
    "miniprogram/component-name": ["error"],
    "miniprogram/no-unused-components": ["error"],
    "miniprogram/no-unregistered-components": ["error"],
    "miniprogram/no-wx-sync-api": ["warn"],
    "miniprogram/prefer-wx-promisify": ["error"],
    "miniprogram/config-json-validate-fields": ["error"]
    // 剩下的规则
  }
};
```

## 规则

### 使用 wx `promisify` (`prefer-wx-promisify`)

小程序的 API 包括[回调](http://callbackhell.com/)，建议使用 `promisify` 转换为 promise。

#### 细节

*错误*用法：

```ts
wx.request({
  url: "https://www.example.com",
  success(res) {
    console.log(res);
  },
  fail(error) {
    console.error(error);
  },
  complete() {
    console.log("complete");
  }
});
```

*正确*用法：

```ts
try {
  const res = await promisify(wx.request)({
    url: "https://www.example.com",
  });
  console.log(res);
} catch (error) {
  console.error(error);
} finally {
  console.log("complete");
}
```

#### 相关规则

- `no-wx-sync-api`

### 禁用 wx.xxSync API (`no-wx-sync-api`)

同步 API 会阻塞 JS 运行时，导致性能问题。

比如 `wx.getStorageSync` 大概会占用 30~100ms CPU 时间:

```ts
console.time("sync");
wx.setStorageSync("key", "value");
console.timeEnd("sync");
```

#### 规则细节

禁用所有 `wx.xxxSync` API 调用.

*错误*用法：

```ts
wx.setStorageSync("key", "value");
```

*正确*用法：

```ts
await promisify(wx.setStorage)({
  key: "key",
  data: "value"
});
```

#### 相关规则

- `prefer-wx-promisify`

### 检查未被使用的组件 (`no-unused-components`)

#### 规则细节

*错误*用法：

```vue
<config>
{
  "component": ture,
  "usingComponent": {
    // 这个 `my-comp` 没有被用到
    "my-comp": "/path/to/myComp.mina"
  }
}
</config>

<template>
  <view>hi</view>
</template>
```

### 检查未被声明使用的组件 (`no-unregistered-components`)

#### 规则细节

*错误*用法：

```vue
<config>
{
  "component": ture,
  "usingComponent": {
    "my-comp": "/path/to/myComp.mina"
  }
}
</config>

<template>
  <!-- typo here -->
  <my-compp />
</template>
```

### 检查 component / page 的配置 (config-json-validate-fields)

|                               | [微信小程序](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html#%E4%BD%BF%E7%94%A8-component-%E6%9E%84%E9%80%A0%E5%99%A8%E6%9E%84%E9%80%A0%E9%A1%B5%E9%9D%A2) | [百度小程序](https://smartprogram.baidu.com/docs/develop/framework/custom-component_comp/#%E4%BD%BF%E7%94%A8-Component-%E6%9E%84%E9%80%A0%E5%99%A8%E6%9E%84%E9%80%A0%E9%A1%B5%E9%9D%A2) |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 使用 `Page` 函数构造页面      | 无 `components`                                                                                                                                                                                       | 无 `components`                                                                                                                                                                         |
| 使用 `Component` 函数构造页面 | `usingComponents`                                                                                                                                                                                     | `component`                                                                                                                                                                             |
| 使用 `Component` 函数构造组件 | `usingComponents`                                                                                                                                                                                     | `component`                                                                                                                                                                             |
| `navigationBarTextStyle` 的值 | 只能是 `black`/`white`                                                                                                                                                                                |
| `backgroundTextStyle` 的值    | 只能是 `dark`/`light`                                                                                                                                                                                 |


不同的小程序平台可能有不同的配置文件格式。

如果你用了 `Component` 函数，建议总是加上 `"conponent": true`。

```ts
// comp.js
Component({});
```

```html
<!-- comp.mina -->
<config>
{ "component": true, "usingComponents": {} }
</config>
```

如果你用了 `Page` 函数，建议不使用 `"conponent": true`。

```ts
// page.js
Page({});
```

```html
<!-- page.mina -->
<config>
{ "usingComponents": {} }
</config>
```

你应该总是加上 `"usingComponents": {}`，即便是空的情况。

```html
<!-- comp.mina -->
<config>
{ "component": true, "usingComponents": {} }
</config>
```

你只能使用 `black` 或者 `white` 作为 `navigationBarTextStyle` 的值。

你只能使用 `dark` 或者 `light` 作为 `backgroundTextStyle` 的值。

### 检查 `usingComponents` 内组件名 (`component-name`)

一些用例：

```json5
{
  "comp": "/path/to/myComp.mina", // 应为 `my-comp
  "comp": "/path/to/anotherComp/index.mina" // 应为 `another-comp`
}
```

### 检查属性的大小写 (`attribute-event-name-case`)

|            | (例如)        | 微信小程序 | 百度小程序 |
| ---------- | ------------- | ---------- | ---------- |
| Camel Case | bind:myEvent  | √          | √          |
| Kebab Case | bind:my-event | √          | 不支持     |
| Snake Case | bind:my_event | √          | √          |

- `'camel'`

```html
<comp bind:myEvent="onClick" />
```

- `'kebab'`

```html
<comp bind:my-event="onClick" />
```

- `'snake'`

```html
<comp bind:my_event="onClick" />
```
