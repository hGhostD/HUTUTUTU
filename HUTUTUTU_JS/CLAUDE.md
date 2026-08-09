# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

WeChat Mini Program (微信小程序) for image processing and analysis — AppID `wxb4cf445380df3089`, base lib `3.16.2`. Pure JavaScript (converted from TypeScript in May 2023). The app picks images, extracts dominant colors via k-means, computes sharpness, draws histograms, and supports cropping.

**Key dependencies:** OpenCV.js (WebAssembly, brotli-compressed), Vant Weapp (`@vant/weapp`), `miniapp-color-thief`.

## Development workflow

- **Open in WeChat DevTools**: open the repo root; the DevTools handle all compilation (WXML/WXSS/JS). No build scripts exist.
- **Install dependencies**: `npm install` in the repo root (and `OpenCVModule/` if you modify its dependencies).
- **Build npm**: after `npm install`, use WeChat DevTools → "构建 npm" to regenerate `miniprogram_npm/` (configured via `packNpmManually: true` in `project.config.json`).
- **Lint**: ESLint is configured (`.eslintrc.js`) but has no npm script — run `npx eslint <files>` manually. Rules are currently empty (only global declarations for `wx`, `App`, `Page`, `Component`, `getCurrentPages`, `getApp`, `requirePlugin`, `requireMiniProgram`).
- **No tests exist** in this project.

## Architecture

### Page/component pattern

Standard Mini Program structure: each page and component is a directory with `.js`, `.json`, `.wxml`, `.wxss` files. `Page()` and `Component()` constructors are used directly — no framework abstractions.

### Subpackage loading (critical)

The OpenCV module (`OpenCVModule/`) is a **subpackage** declared in `app.json`. Subpackage modules **cannot** be synchronously required from the main package. Use `require.async()`:

```js
require.async('../../OpenCVModule/HUOpenCVModule.js').then((mod) => { ... })
```

Pages inside the subpackage itself (e.g., `HUOpenCVTest`) use standard ES module `import` instead — the DevTools resolve those at build time.

### OpenCV pipeline (`OpenCVModule/HUOpenCVModule.js`)

1. `global.wasm_url` is set to the absolute path of the brotli-compressed WASM **before** `require("./lib/OpenCV/opencv")` — this is required by the opencv.js loader.
2. `readImage(imgPath)` delegates to `HUBridgeTool` → `HUWXOpenCVTool`, which uses `wx.createOffscreenCanvas({type:'2d'})` to decode images, extracts pixel data via `getImageData`, and passes it to `cv.imread()`. Images taller than 1000px are auto-downscaled to width 300.
3. Mat→base64 conversion also uses offscreen canvas: `createImageData` → `putImageData` → `canvas.toDataURL()` (PNG for 4-channel RGBA, JPEG q0.8 otherwise).
4. `getKmeans(mat, k)` downsamples to width 100, builds a `CV_32F` sample matrix (k-means requires float32), and runs `cv.kmeans` with `TermCriteria(COUNT, 10, 1.0)`, 5 attempts, `KMEANS_RANDOM_CENTERS`. Known memory leak (per git log).
5. `calculateSharpness(mat)` takes a 100×100 center ROI, converts to grayscale, applies `cv.Laplacian`, and returns the standard deviation.
6. `drawHistogram(mat)` renders a fixed 256×164 grayscale histogram as filled rectangles, returned as an RGBA Mat → base64.

### Color extraction

`miniapp-color-thief` works directly on `cv.Mat.data` (a `Uint8ClampedArray`): `Colorthief(mat.data).palette(5).get()` returns RGB arrays, `.getHex()` returns hex strings.

### Inter-page state

Pages communicate through `getApp().globalData`:

| Field | Used by | Notes |
|---|---|---|
| `imageBase64` | HUPickImage | Base64-encoded image data |
| `imageFilePath` | HUPickImage, cropper | Filesystem path after `writeFileSync`, used as cropper `src` |
| `imageWidth` / `imageHeight` | HUPickImage, cropper | Image dimensions |
| `imgSrc` | cropper → HUPickImage | cropper writes this on submit; HUPickImage reads it in `onShow` |

### Image saving flow

`saveImageClick` in HUPickImage: strips the data URI prefix → writes the base64 data to `wx.env.USER_DATA_PATH + "/postershare.png"` via `wx.getFileSystemManager().writeFileSync` → stores the file path in `globalData.imageFilePath` → navigates to `/pages/cropper/cropper`.

## Known issues

- **`HUCropImage`** is an empty template stub still registered in `app.json` — safe to remove if unused.

## Page routes (from `app.json`)

| Route | Description |
|---|---|
| `pages/HUPickImage/HUPickImage` | Main page: image pick, theme color, histogram, navigation to cropper |
| `pages/cropper/cropper` | Crop workflow using `image-cropper` component |
| `pages/HUVantTest/HUVantTest` | Vant UI / API test page |
| `pages/HUSaveImage/HUSaveImage` | Minimal save-to-album demo |
| `pages/HUCropImage/HUCropImage` | Empty placeholder stub |
| `OpenCVModule/pages/HUOpenCVTest/HUOpenCVTest` | OpenCV test page (in subpackage) |
