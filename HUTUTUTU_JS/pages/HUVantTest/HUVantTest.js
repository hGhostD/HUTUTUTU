// pages/HUVantTest/HUVantTest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '123'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })
  },

  getuserInfoClick() {
    wx.getUserInfo({
      success: function(res) {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
        console.info(res);
      }
    })
  },

  networkClick() {
    wx.request({
      url: 'https://hghostd.top/api/data', //仅为示例，并非真实的接口地址
      data: {
        'key': 'name'
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data)
      }
    })
  },

  getClick() {
    let that = this;
    wx.request({
      url: 'https://hghostd.top/api/user/login',
      method: 'POST',
      success (res) {
        console.info(res);
        that.setData({
          content: JSON.stringify(res.data)
        })
      }
    })
  }

})