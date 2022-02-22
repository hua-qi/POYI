const db = wx.cloud.database();
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
    this.getMessagesCollection();

  },
  onHide() {
    
  },

  getMessagesCollection(i = 0) {
    // 获取数据
    db.collection("messages")
      .orderBy("timeStamp", "desc")
      .skip(6 * i)
      .limit(6)
      .get()
      .then(res => {
        overallMessagesList.push(...res.data);
        // 升序排序
        overallMessagesList.sort(this.sortBy('timeStamp', 1))
        this.setData({
          messagesList: overallMessagesList
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
    db.collection("messages").add({
        // data 字段表示需新增的 JSON 数据
        data: {
          nickName,
          message,
          timeStamp
        }
      })
      .then(res => {
        console.log(res);
        overallMessagesList = [];
        this.setData({
          message: ""
        })
        // 重新获取 message 信息
        this.getMessagesCollection();
      })
  }
})