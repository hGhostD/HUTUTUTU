// 优先设置 wasm.br 文件路径 必须使用绝对地址
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
    if (mat.rows > 1000 ) {
      cv.resize(mat, mat, {width: 300, height: parseInt(mat.rows * (300 / mat.cols))}, 0 , 0, cv.INTER_AREA);
    }
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
    cv.cvtColor(mat, result, type);
    return result;
  },

  convertGrayToRGBA(mat) {
    let dst = new cv.Mat();
    cv.cvtColor(mat, dst, cv.COLOR_GRAY2RGBA);
    return dst;
  },
  // 聚合运算
  async getKmeans(mat, k) {

    const width = 100;
    const height = parseInt(100 / mat.cols * mat.rows);
    const dst = new cv.Mat();
    // 降低分辨率
    cv.resize(mat, dst, {
      width: width,
      height: height
    }, 0, 0, cv.INTER_AREA);
    // 网上说 必须使用 float32 格式才能进行 kmeans 计算
    let sample = new cv.Mat(dst.rows * dst.cols, 3, cv.CV_32F);
    for (var y = 0; y < dst.rows; y++)
      for (var x = 0; x < dst.cols; x++)
        for (var z = 0; z < 3; z++)
          sample.floatPtr(y + x * mat.rows)[z] = mat.ucharPtr(y, x)[z];
    // 颜色量化
    const criteria = new cv.TermCriteria(cv.TermCriteria_EPS + cv.TermCriteria_COUNT, 10, 1.0);
    const labels = new cv.Mat();
    const attempts = 5;
    const centers = new cv.Mat();

    cv.kmeans(sample, k, labels, criteria, attempts, cv.KMEANS_RANDOM_CENTERS, centers);
    // 格式化结果
    const r = [];
    for (let i = 0; i < centers.data32F.length; i += 3) {
      r[i / 3] = [parseInt(centers.data32F[i]), parseInt(centers.data32F[i + 1]), parseInt(centers.data32F[i + 2])];
    }
    console.log(r);
    dst.delete();
    sample.delete();
    labels.delete();
    centers.delete();
    return r;
  },

  // 计算图片清晰度
  async calculateSharpness(mat) {

    let rect = new cv.Rect(mat.cols / 2 - 50, mat.rows / 2 - 50, 100, 100);
    let gray = mat.roi(rect);
    
    const channle = mat.channels();

    if (channle != 1) {
      gray = this.convertToGray(gray);
    }

    let sobel = new cv.Mat();
    let myMean = new cv.Mat(1, 4, cv.CV_64F);
    let myStddev = new cv.Mat(1, 4, cv.CV_64F);
    cv.Laplacian(gray, sobel, cv.CV_64F);
    cv.meanStdDev(sobel, myMean, myStddev);

    return myStddev.doubleAt(0, 0);
  }
}

module.exports = HUOpenCVModule;