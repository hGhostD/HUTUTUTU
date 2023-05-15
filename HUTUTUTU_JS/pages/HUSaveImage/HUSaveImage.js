// pages/HUSaveImage/HUSaveImage.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: '../../OpenCVModule/images/1.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    console.info('data', this.data);
  },

  saveImageClick() {

    wx.getImageInfo({
      src: this.data.imgPath,
      success: res => {
        console.info(res);

        wx.saveImageToPhotosAlbum({
          filePath: res.path,
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