// let HUOpenCVModule = require('../../HUOpenCVModule');
import colorThief from "miniapp-color-thief";
import HUOpenCVModule from "../../HUOpenCVModule";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '../../images/1.jpg',
    canvasDom: {},
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
    console.info(mat.data);
    let palette = colorThief(mat.data)
      .palette(5)
      .get();
    console.log(palette); // [[0,0,0],[0,0,0],[0,0,0]...]
    HUOpenCVModule.show(this.data.canvasDom, mat);
    const base64 = HUOpenCVModule.convertMatToBase64(mat);
    
    this.setData({
      imgSrc: imgPath,
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
        // 设置画布的宽度和高度
        canvas2d.width = res[0].width;
        canvas2d.height = res[0].height;
        _that.setData({
          canvasDom: canvas2d
        })
      });
  },
})