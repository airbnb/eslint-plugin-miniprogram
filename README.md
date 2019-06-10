# eslint-plugin-miniprogram

[![npm](https://img.shields.io/npm/v/eslint-plugin-miniprogram.svg)](https://www.npmjs.com/package/eslint-plugin-miniprogram)
[![Build Status](https://travis-ci.com/airbnb/eslint-plugin-miniprogram.svg?branch=master)](https://travis-ci.com/airbnb/eslint-plugin-miniprogram)

[中文版](./README_cn.md)

## About

This ESLint plugin exists to help you lint your Mini Program code.

### `.mina` files

For developing with `.mina` files, you can refer to [mina-webpack](https://github.com/tinajs/mina-webpack) repo for details.

## How to use

Install the plugin:

```bash
npm install --save-dev eslint eslint-plugin-miniprogram
```

In your `.eslintrc.js` file, include this plugin:

```js
// .eslintrc.js
module.exposts = {
  // you'll need vue-eslint-parser for `.mina` files
  parser: "vue-eslint-parser",
  plugins: [
    // amongst other other plugins, e.g. prettier
    "prettier",
    // include this plugin
    "miniprogram"
  ]
};
```

Enable rules:

```js
// .eslintrc.js
module.exposts = {
  rules: {
    // other rules
    "miniprogram/attribute-event-name-case": ["error", "camel"],
    "miniprogram/component-name": ["error"],
    "miniprogram/no-unused-components": ["error"],
    "miniprogram/no-unregistered-components": ["error"],
    "miniprogram/no-wx-sync-api": ["warn"],
    "miniprogram/prefer-wx-promisify": ["error"],
    "miniprogram/config-json-validate-fields": ["error"]
    // rest of the rules
  }
};
```

## Rules

### Prefer wx `promisify` (`prefer-wx-promisify`)

Mini Program API introduces a new style of callbacks whick could be a new
[callback hell](http://callbackhell.com/).

You can use `promisify` to enter the Promise world.

#### Details

Prefer `promisify` over wx style callbacks including `success`, `fail` and `complete`.

Examples of **incorrect** code for this rule:

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

Examples of **correct** code for this rule:

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

#### Related Rules

- `no-wx-sync-api`

### Disallow the use of wx.xxSync API (`no-wx-sync-api`)

Sync API will block JavaScript running and cause bad performance.

For example `wx.getStorageSync` costs 30~100ms CPU time:

```ts
console.time("sync");
wx.setStorageSync("key", "value");
console.timeEnd("sync");
```

#### Rule Details

Disallow any `wx.xxxSync` API call.

Examples of **incorrect** code for this rule:

```ts
wx.setStorageSync("key", "value");
```

Examples of **correct** code for this rule:

```ts
await promisify(wx.setStorage)({
  key: "key",
  data: "value"
});
```

#### Related Rules

- `prefer-wx-promisify`

### No unused component (`no-unused-components`)

#### Rule Details

Bad case:

```vue
<config>
{
  "component": ture,
  "usingComponent": {
    // unused `my-comp`
    "my-comp": "/path/to/myComp.mina"
  }
}
</config>

<template>
  <view>hi</view>
</template>
```

### No unregistered component (`no-unregistered-components`)

Bad case:

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

### Validate fields in component / page config file (config-json-validate-fields)

|                                 | [WeChat](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html#%E4%BD%BF%E7%94%A8-component-%E6%9E%84%E9%80%A0%E5%99%A8%E6%9E%84%E9%80%A0%E9%A1%B5%E9%9D%A2) | [Baidu](https://smartprogram.baidu.com/docs/develop/framework/custom-component_comp/#%E4%BD%BF%E7%94%A8-Component-%E6%9E%84%E9%80%A0%E5%99%A8%E6%9E%84%E9%80%A0%E9%A1%B5%E9%9D%A2) |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Use `Page` for page             | no `components`                                                                                                                                                                                   | no `components`                                                                                                                                                                    |
| Use `Component` for page        | `usingComponents`                                                                                                                                                                                 | `component`                                                                                                                                                                        |
| Use `Component` for component   | `usingComponents`                                                                                                                                                                                 | `component`                                                                                                                                                                        |
| `navigationBarTextStyle` values | can only be `black`/`white`                                                                                                                                                                       |
| `backgroundTextStyle` values    | can only be `dark`/`light`                                                                                                                                                                        |

Different Mini Program runtimes have different required fields in config (`.json`) file.

You should add `"conponent": true` if you are using `Component` function.

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

You should not use `"conponent": true` in `Page` function.

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

You should always add `"usingComponents": {}`, even if it's empty.

```html
<!-- comp.mina -->
<config>
{ "component": true, "usingComponents": {} }
</config>
```

You should only use `black` or `white` for `navigationBarTextStyle` values.

You should only use `dark` or `light` for `backgroundTextStyle` values.

### Lint `usingComponents` name (`component-name`)

Some use cases:

```json5
{
  "comp": "/path/to/myComp.mina", // should be `my-comp
  "comp": "/path/to/anotherComp/index.mina" // should be `another-comp`
}
```

### Check event name case (`attribute-event-name-case`)

|            | (Demo)        | WeChat | Baidu |
| ---------- | ------------- | ------ | ----- |
| Camel Case | bind:myEvent  | √      | √     |
| Kebab Case | bind:my-event | √      | ×     |
| Snake Case | bind:my_event | √      | √     |

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
