// 优先设置 wasm.br 文件路径
global.wasm_url = '/OpenCVModule/lib/OpenCV/opencv_js.wasm.br'

const cv = require("./lib/OpenCV/opencv");
const tool = require('./lib/Tools/S2iBridgeTool');

const S2iOpenCVModule = {

  logVersion() {
    console.info(' 加载 OpenCV 版本 \n', cv.getBuildInformation());
  },

  async readImage(imgPath) {
    const imgData = await tool.getImageDataWithPath(imgPath);
    const mat = cv.imread(imgData);
    return mat;
  },
  convertImgPathToBase64(imgPath) {
    return tool.convertImgPathToBase64(imgPath)
  },

  convertMatToBase64(mat) {
    return tool.convertMatToBase64(mat);
  },
  show(canvas, mat) {
    cv.imshow(canvas, mat);
  }
}

module.exports = S2iOpenCVModule;