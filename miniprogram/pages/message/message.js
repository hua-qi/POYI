const app = getApp();
// api 统一请求接口
const api = app.globalData.api;
let overallMessagesList = [];
let overallLength = 1;
Page({
  data: {
    message: "",
    messagesList: [],
    openId: "",
    triggered: false
  },

  onLoad() {
    overallMessagesList = [];

    // 获取 用户的 openId
    const openId = wx.getStorageSync('openId');
    this.setData({
      openId,
      messagesList: []
    });
    this.getMessagesCollection(overallLength);

  },

  getMessagesCollection(i) {
    return new Promise((resolve, reject) => {
      api.getData('http://www.breakEnglish.com', {
        module: 'Message',
        action: 'QueryMessage',
        docSize: 6 * i
      }).then(res => {
        overallMessagesList.push(...res);
        overallMessagesList.sort(this.sortBy('timeStamp', 1));
        this.setData({
          messagesList: overallMessagesList
        });
        console.log(res);
        resolve();
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    })

  },

  sortBy(attr, rev) {
    if (rev == undefined) {
      rev = 1
    } else {
      (rev) ? 1: -1;
    }
    return function (a, b) {
      a = a[attr];
      b = b[attr];
      if (a < b) {
        return rev * -1
      }
      if (a > b) {
        return rev * 1
      }
      return 0;
    }
  },


  // 获取留言信息
  getMessage(e) {
    console.log(e);
    const message = e.detail.value;
    this.setData({
      message
    })
  },

  // 下拉获取更多信息
  dropDown() {
    // 获取messages
    this.getMessagesCollection(overallLength);
    overallLength++;
    this.dropDownStop();
  },

  // 停止下拉刷新
  dropDownStop() {
    this.setData({
      triggered: false
    })
  },

  submit() {
    // 获取留言
    let message = "";
    if (!this.data.message) {
      wx.showToast({
        title: '留言得有字呀~',
        icon: "error",
        duration: 2000
      })
      return
    } else {
      message = this.data.message;
    }
    // 获取用户名
    const {
      nickName
    } = wx.getStorageSync('userInfo');
    // 获取当前时间戳
    const timeStamp = Date.now();
    const openId = wx.getStorageSync('openId');
    api.getData('http://www.breakEnglish.com', {
      module: 'Message',
      action: 'InsertMessage',
      openId,
      nickName,
      message,
      timeStamp
    }).then(res => {
      console.log(res);
      overallMessagesList = [];
      this.setData({
        message: ""
      });
      this.getMessagesCollection();
    }).catch(err => {
      console.error(err);
    })
  }
})