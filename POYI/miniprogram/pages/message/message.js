const db = wx.cloud.database();
let overallMessagesList = [];
let overallLength = 1;
const openId = wx.getStorageSync('openId');

Page({
  data: {
    message: "",
    messagesList: [],
    openId: "",
    triggered: false
  },

  onLoad() {
    this.getMessagesCollection();
  },
 

  // 获取留言
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
        // overallMessagesList.sort(this.sortBy('timeStamp', 1))
        overallMessagesList.sort((firstEl, secondEl) => firstEl.timeStamp - secondEl.timeStamp);
        this.setData({
          messagesList: overallMessagesList,
          openId
        })
      })
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
    this.getMessagesCollection(overallLength++);
    this.dropDownStop();
  },

  // 停止下拉刷新
  dropDownStop() {
    this.setData({
      triggered: false
    })
  },

  // 发送留言
  submit() {

    // 边界判断
    if (!this.data.message) {
      wx.showToast({
        title: '留言得有字呀~',
        icon: "error",
        duration: 2000
      })
      return
    } else {
      this.addMessage(this.data.message);
    }
    
  },

  // 同步数据库
  addMessage(message) {
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
        // 这里是重点
        // 为了达到每次发送留言后，页面总显示最新的 6 条数据效果
        // 特此添加了一个全局数组，每次重新请求最新信息时，进行清空
        overallMessagesList = [];
        this.setData({
          message: ""
        })
        // 重新获取 message 信息
        this.getMessagesCollection();
      })
  }
})