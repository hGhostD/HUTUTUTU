// pages/HUPickImage/HUPickImage.ts
let HUOpenCVModule = {}
require('../../OpenCVModule/HUOpenCVModule', mod => {
    HUOpenCVModule = mod
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: '../../OpenCVModule/images/1.jpg',
    show: false,
    btnStyle: ""
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
        console.log("选择图片", res.tempFiles[0]);
        this.setData({imgPath: res.tempFiles[0].tempFilePath})
      }
    })
  },

  pop() {
    this.setData({ show: true })
  },

  onClose() {
    this.setData({ show: false });
  },
})