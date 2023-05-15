// 优先设置 wasm.br 文件路径
global.wasm_url = '/OpenCVModule/lib/OpenCV/opencv_js.wasm.br'

const cv = require("./lib/OpenCV/opencv");
const tool = require('./lib/Tools/HUBridgeTool');

const HUOpenCVModule = {

  logVersion() {
    console.info(' ==== 加载 OpenCV 版本 ==== \n', cv.getBuildInformation());
  },

  async readImage(imgPath) {
    const imgData = await tool.getImageDataWithPath(imgPath);
    const mat = cv.imread(imgData);
    return mat;
  },

  convertImgPathToBase64(imgPath) {
    return 'data:image/jpeg;base64,' + tool.convertImgPathToBase64(imgPath)
  },

  convertMatToBase64(mat) {
    let base64 = tool.convertMatToBase64(mat);
    // mat.delete();
    return base64;
  },

  show(canvas, mat) {
    cv.imshow(canvas, mat);
  },

  convertToGray(mat) {
    let result = new cv.Mat();
    console.debug('mat channels:', mat.channels());
    let channel = mat.channels();
    let type = cv.COLOR_BGRA2GRAY;
    if (channel == 1) {
      type = cv.COLOR_GRAY2RGB;
    } else if (channel == 3) {
      type = cv.COLOR_RGB2GRAY;
    } else if (channel == 4) {
      type = cv.COLOR_RGBA2GRAY;
    }
    //
    cv.cvtColor(mat, result, type);
    return result;
  },
  convertGrayToRGBA(mat) {
    let dst = new cv.Mat();
    cv.cvtColor(mat, dst, cv.COLOR_GRAY2RGBA);
    return dst;
  }
}

module.exports = HUOpenCVModule;