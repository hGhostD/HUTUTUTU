// pages/HUPickImage/HUPickImage.ts
const Colorthief = require('miniapp-color-thief').default;

let HUOpenCVModule = {};
require.async('../../OpenCVModule/HUOpenCVModule.js').then((mod) => {
    HUOpenCVModule = mod;
  })
  .catch(({
    errMsg,
    mod
  }) => {
    console.error(`path: ${mod}, ${errMsg}`)
  })

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: 'test.jpg',
    imgBase64: '',
    imgMat: {},
    canvasDom: {},
    colors: [
      [255, 255, 255],
      [255, 255, 255],
      [255, 255, 255],
      [255, 255, 255],
      [255, 255, 255]
    ],
    colorsText: [
      "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff",
    ],
    revertColor: [255, 255, 255] 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.loadImg(this.data.imgPath);
  },

  selectImageClick() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album'],
      success: (res) => {
        console.debug("选择图片", res);
        this.loadImg(res.tempFiles[0].tempFilePath);
      }
    })
  },

  convertGray() {
    console.log(this.data.imgMat.size());
    // let gray = HUOpenCVModule.convertToGray(this.data.imgMat);
    // HUOpenCVModule.show(this.data.canvasDom, gray);

  },

  async loadImg(imgSrc) {
    let _that = this;
    const mat = await HUOpenCVModule.readImage(imgSrc);
    // 计算图片主题色
    const thief = Colorthief(mat.data).palette(5);
    const colors = thief.get();
    const colorsText = thief.getHex();
    const revertColor = [255-colors[0][0], 255-colors[0][1],255-colors[0][2]];
    this.setData({
      imgPath: imgSrc,
      imgMat: mat,
      colors: colors,
      colorsText: colorsText,
      revertColor: revertColor
    })
    // let sharp = await HUOpenCVModule.calculateSharpness(mat);
    let cal = HUOpenCVModule.drawHistogram(mat);
    const result = HUOpenCVModule.convertMatToBase64(cal);
    _that.setData({
      imgBase64: result
    })

    cal.delete();
    mat.delete();
  },

  saveImageClick(res) {
    console.log(res);
    wx.saveImageToPhotosAlbum({
      filePath: res.tempFilePath,
      success: (res) => {
        console.info('保存成功', res);

      },
      fail: (error) => {
        console.error('保存失败', error);
      }
    })
  }
})