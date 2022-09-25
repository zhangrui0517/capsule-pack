<div align="center">
  <br>
  <h1>capsule-pack</h1>
  <p align="left">
    支持快速开发项目的脚手架，支持配置自定义和项目模板、自定义模版生成。
    预置react、工具库（开发中）、组件库（开发中）开发模板，使用webpack5进行构建。
  </p>
</div>

## 目录
1. [安装](#install)
2. [使用](#usage)

<h2 align="center" id="install">安装</h2>
<br/>

Install with npm:

```bash
npm install capsule-pack --save-dev
```

Install with yarn:

```bash
yarn add capsule-pack --dev
```

<h2 align="center" id="usage">使用</h2>
<br/>

可直接指定模板，目前支持react模板，工具库和组件库模板正在开发中。
template为选填，不指定模板，会提供支持的模板进行选择。

```bash
cpack create [template]
```

支持自定义模板，会读取项目所在根目录下的template文件夹，可自定义模板内容。

```bash
cpack new [template]
```

项目启动命令已经预置在package.json的scripts中，可按情况使用。

```bash
yarn run dev
```
