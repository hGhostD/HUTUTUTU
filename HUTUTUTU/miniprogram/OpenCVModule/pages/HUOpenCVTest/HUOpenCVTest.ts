// OpenCVModule/pages/HUOpenCVTest/HUOpenCVTest.ts
let HUOpenCVModule = require('../../HUOpenCVModule');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.initCanvas("canvas1")
  },

  versionClick() {
    HUOpenCVModule.logVersion();
  },

  async loadImgClick() {
    const imgPath = '../../images/1.jpg';
    const mat = await HUOpenCVModule.readImage(imgPath);
    console.info(mat);
    HUOpenCVModule.show(this.canvasDom, mat);
    const base64 = HUOpenCVModule.convertMatToBase64(mat);
    
    this.setData({
      imgSrc: base64,
    });
  },

  // 获取画布
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
        console.info("111", canvas2d);
        // 设置画布的宽度和高度
        canvas2d.width = res[0].width;
        canvas2d.height = res[0].height;
        _that.canvasDom = canvas2d
      });
  },
})