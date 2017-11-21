App({
  onLaunch: function () {

  },
  getUserInfo: function (cb) {
    wx.login({
      success: function (res) {
        if (res.code) {
          var code = res.code;
          wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
              that.globalData.userInfo = res.userInfo
            },
            fail: function () {
            }
          })
        }
      },
    })
  },

  globalData: {
    userInfo: null, //微信数据
  }
})
