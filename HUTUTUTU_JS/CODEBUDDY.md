# CODEBUDDY.md

This file provides guidance to CodeBuddy Code when working with code in this repository.

## 项目概述

这是一个微信小程序项目，主要用于图像处理和分析。项目集成了 OpenCV.js 进行图像操作，并使用 Vant Weapp 作为 UI 组件库。

## 项目类型

- **平台**: 微信小程序 (WeChat Mini Program)
- **主要语言**: JavaScript
- **UI 框架**: Vant Weapp (`@vant/weapp` ^1.10.18)

## 目录结构

```
├── app.js                    # 小程序入口文件
├── app.json                  # 小程序全局配置
├── app.wxss                  # 小程序全局样式
├── project.config.json       # 微信开发者工具项目配置
├── package.json              # npm 依赖配置
├── .eslintrc.js              # ESLint 配置
│
├── pages/                    # 页面目录
│   ├── HUPickImage/          # 图片选择页面 (主页面)
│   ├── HUSaveImage/          # 图片保存页面
│   ├── HUCropImage/          # 图片裁剪页面
│   ├── HUVantTest/           # Vant 组件测试页面
│   └── cropper/              # 裁剪功能页面
│
├── components/              # 组件目录
│   ├── HUColorTag/           # 颜色标签组件
│   └── image-cropper/        # 图片裁剪组件
│
├── OpenCVModule/             # OpenCV 模块封装
│   ├── HUOpenCVModule.js     # OpenCV 核心模块
│   └── lib/
│       ├── OpenCV/           # OpenCV.js 库
│       │   ├── opencv.js
│       │   └── opencv_js.wasm.br
│       └── Tools/
│           ├── HUBridgeTool.js        # 桥接工具 (环境适配)
│           └── HUWXOpenCVTool.js      # 微信小程序 OpenCV 工具
│
└── utils/
    └── util.js               # 工具函数
```

## 常用命令

### 开发相关

- **微信开发者工具**: 使用微信开发者工具打开项目根目录进行开发和调试
- **安装依赖**: `npm install` (在项目根目录和 OpenCVModule 目录都需要执行)

### 代码检查

- **ESLint**: 项目配置了 ESLint，规则定义在 `.eslintrc.js`
- **全局变量**: 微信小程序 API (wx, App, Page, Component, getApp, getCurrentPages, requirePlugin, requireMiniProgram) 已声明为全局变量

## OpenCV 模块使用

OpenCV 模块位于 `OpenCVModule/HUOpenCVModule.js`，主要功能包括：

- `readImage(imgPath)` - 读取图片为 Mat 对象
- `convertToGray(mat)` - 转换为灰度图
- `convertMatToBase64(mat)` - Mat 转 Base64
- `getKmeans(mat, k)` - K-Means 聚类分析
- `calculateSharpness(mat)` - 计算图片清晰度
- `drawHistogram(mat)` - 绘制直方图

使用方式：
```javascript
let HUOpenCVModule = {};
require.async('../../OpenCVModule/HUOpenCVModule.js').then((mod) => {
  HUOpenCVModule = mod;
  // 使用模块
  const mat = await HUOpenCVModule.readImage(imgPath);
})
```

## 页面路由

路由定义在 `app.json` 的 `pages` 数组中。主要页面：
- `pages/HUPickImage/HUPickImage` - 首页，图片选择和分析
- `pages/HUSaveImage/HUSaveImage` - 图片保存
- `pages/HUCropImage/HUCropImage` - 图片裁剪

## 注意事项

1. OpenCV 模块使用异步加载，需要使用 `require.async`
2. 图片路径处理需要使用微信小程序的 `wx.chooseMedia` API
3. OpenCV.js 的 wasm 文件位于 `OpenCVModule/lib/OpenCV/opencv_js.wasm.br`
4. 项目 appid: `wxb4cf445380df3089`
