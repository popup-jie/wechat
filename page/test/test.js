// page/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: ['http://www.ppbar.com.cn/file/file/preview/MTUwNjU4NDM3OTAzNCUyRjIwMTcwOTI4JTJGNjg2ZTdjYWI5Y2UxNDViODg0MjIyOWY2MThjN2U0ODFfMjY0NjcxLmpwZw==', 'http://www.ppbar.com.cn/20171108/745d1186-2950-4d7b-91f5-a61d8750b9c2.png',
      'http://www.ppbar.com.cn/file/file/preview/MTUwNjY2MzkyODg1NyUyRjIwMTcwOTI5JTJGNTMyMjI3Y2MwM2IyNDdkNTlkYTlhM2U2ODhkMjI4NDJfMjY5NDcwLmpwZw==',
      'http://www.ppbar.com.cn/file/file/preview/MTUwNjQ4NDE4MzgyMyUyRjIwMTcwOTI3JTJGMDFkZTgyOGU5NmJlNGNhYTlhMDc3MjVhZmNiZjZlMGZfMjAxNjA2MjcwMi5qcGc=']
  },
  send(detail) {
    console.log(detail)
  },
  ItemClick(detail) {
    console.log(detail)
  }
})