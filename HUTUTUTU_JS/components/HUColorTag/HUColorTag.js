// components/HUColorTag/HUColorTag.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      title: {
        type: String,
        value: 'default value'
      },
      color: {
        type: Object,
        value: [0, 176, 255]
      }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapClick: function() {
      wx.setClipboardData({
        data: this.data.title,
        success (res) {
          wx.getClipboardData({
            success (res) {
              console.log('复制到剪切板', res.data) // data
            }
          })
        }
      })
    }
  },
})
