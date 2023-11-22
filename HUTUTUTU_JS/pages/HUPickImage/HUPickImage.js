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
    btnStyle: "margin-left: 10px; width: 30vw; height: 10vw;",
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
    this.initCanvas(myCanvas);
  },

  initCanvas(canvasId) {
    var _that = this;
    wx.createSelectorQuery()
      .select('#' + canvasId)
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        const canvas2d = res[0].node;
        // 设置画布的宽度和高度
        canvas2d.width = res[0].width;
        canvas2d.height = res[0].height;
        _that.setData({
          canvasDom: canvas2d
        });
      });
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
        _that.setData({
          canvasWidth: canvasW,
          canvasHeight: res.height / res.width * canvasW,
        })
      }
    });

    const mat = await HUOpenCVModule.readImage(imgSrc);
    const base64 = HUOpenCVModule.convertMatToBase64(mat);
    this.setData({
      imgPath: imgSrc,
      imgBase64: base64,
      imgMat: mat
    })
    /**
     * 
    
    const colors = await HUOpenCVModule.getKmeans(mat, 5);
    this.setData({
      colors: colors
    })
    */
    
    let sharp = await HUOpenCVModule.calculateSharpness(mat);
    console.log('shaprness:::', sharp);
    //let sharp2 = HUOpenCVModule.calculateMatSharpness(mat);
    //console.log('shaprness2:::', sharp2);

    HUOpenCVModule.show(this.data.canvasDom, mat);
  },

  saveImageClick() {
    Dialog.alert({
      mesage: '保存成功',
      theme: 'round-button',
    })

    return;
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