// pages/HUPickImage/HUPickImage.ts
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
// import Dialog from '@vant/weapp/dialog/dialog';
const Dialog = require('@vant/weapp/dialog/dialog')

const myCanvas = 'myCanvas';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: 'test.jpg',
    show: false,
    imgBase64: '',
    imgMat: {},
    canvasDom: {},
    canvasWidth: 0,
    canvasHeight: 0,
    colors: [
      [255, 255, 255],
      [255, 255, 255],
      [255, 255, 255],
      [255, 255, 255],
      [255, 255, 255]
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    
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

  pop() {
    this.setData({
      show: true
    })
  },

  onClose() {
    this.setData({
      show: false
    });
  },

  convertGray() {
    let gray = HUOpenCVModule.convertToGray(this.data.imgMat);
    HUOpenCVModule.show(this.data.canvasDom, gray);
  },

  async loadImg(imgSrc) {
    let _that = this;
    let canvasW = wx.getSystemInfoSync().windowWidth * 0.9;

    wx.getImageInfo({
      src: imgSrc,
      success(res) {
        const canvasH = res.height / res.width * canvasW;
      }

    });

    const mat = await HUOpenCVModule.readImage(imgSrc);
    const res = HUOpenCVModule.convertMatToBase64(mat);

    this.setData({
      imgPath: imgSrc,
      imgBase64: res,
      imgMat: mat
    })
    /**
     * 
    
    const colors = await HUOpenCVModule.getKmeans(mat, 5);
    this.setData({
      colors: colors
    })
    */
    
    // let sharp = await HUOpenCVModule.calculateSharpness(mat);
    // console.log('shaprness:::', sharp);
    let cal = HUOpenCVModule.drawHistogram(mat);
    // console.log(cal.rows, cal.cols);
    // console.log(this.data.canvasHeight, this.data.canvasWidth);
    const result = HUOpenCVModule.convertMatToBase64(cal);
    _that.setData({
      imgBase64: result
    })
    
    mat.delete();
  },

  saveImageClick() {
    wx.canvasToTempFilePath({
      canvas: this.data.canvasDom,
      success(res) {
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
  }
})