const S2iOpenCVTool = {

  async getImageDataWithPath(imgPath) {

    let offscreenCanvas = wx.createOffscreenCanvas({
      type: '2d'
    });
    const image = offscreenCanvas.createImage();
    await new Promise(function (resolve, reject) {
      image.onload = resolve
      image.onerror = reject
      image.src = imgPath
    })
    const imgData = this.getImageData(image, offscreenCanvas);
    return imgData;
  },

  // 获取图像数据和调整图像大小
  getImageData(image, offscreenCanvas) {
    // const ctx = wx.createCanvasContext(canvasId);
    let canvasWidth = image.width;
    // canvas Height
    let canvasHeight = Math.floor(canvasWidth * (image.height / image.width));
    // 离屏画布的宽度和高度不能小于图像的
    offscreenCanvas.width = canvasWidth;
    offscreenCanvas.height = canvasHeight;
    // draw image on canvas
    let ctx = offscreenCanvas.getContext('2d')
    ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
    // get image data from canvas
    let imgData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

    return imgData;
  },
  /**
   * 
   * Mat => base64, 转化为 jpeg 压缩率 0.8
   */
  convertMatToBase64(mat) {
    const off_cav = wx.createOffscreenCanvas({
      type: '2d',
      width: mat.cols,
      height: mat.rows
    });
    const off_ctx = off_cav.getContext('2d');
    off_ctx.width = mat.cols;
    off_ctx.height = mat.rows;
    let result = off_cav.createImageData(mat.data, mat.cols, mat.rows);
    off_ctx.putImageData(result, 0, 0);
    const base64 = off_cav.toDataURL('image/jpeg', 0.8);
    return base64;
  },
  /**
   * path => base64
   */
  convertImgPathToBase64(path) {

    let fs = wx.getFileSystemManager();
    // 同步接口
    try {
      return fs.readFileSync(path, 'base64');
    } catch (e) {
      console.error(e);
    }
  },
}

module.exports = S2iOpenCVTool;