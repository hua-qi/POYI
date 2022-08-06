const db = wx.cloud.database();
let overallMessagesList = [];
let overallLength = 1;
const openId = wx.getStorageSync('openId');

Page({
  data: {
    // 滚动栏默认位置
    viewId: "",
    message: "",
    messagesList: [],
    openId: "",
    triggered: false
  },

  onLoad() {
    overallMessagesList = [];
    this.getMessagesCollection();
    // 加载即显示最后一条信息
    this.setData({
      openId: openId,
      viewId: "msg-5"
    })
  },


  // 获取留言
  getMessagesCollection(skipIndex = 0, limitNum = 6) {
    // 获取数据
    db.collection("messages")
      .orderBy("timeStamp", "desc")
      .skip(6 * skipIndex)
      .limit(limitNum)
      .get()
      .then(res => {
        overallMessagesList.push(...res.data);
        // 升序排序
        overallMessagesList.sort((firstEl, secondEl) => firstEl.timeStamp - secondEl.timeStamp);

        this.setData({
          messagesList: overallMessagesList,
          // 根据 limitNum 判断是下拉刷新还是输入
          viewId: `msg-${limitNum === 6 ? 5 : overallMessagesList.length - 1}`
        })
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


  // 用户输入留言
  getMessage(e) {
    console.log(e);
    const message = e.detail.value;
    this.setData({
      message
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
    }

    this.addMessage(this.data.message);

  },

  // 数据库添加信息
  addMessage(message) {
    // 获取用户名
    const {
      nickName,
      avatarUrl
    } = wx.getStorageSync('userInfo');
    // 获取当前时间戳
    const timeStamp = Date.now();
    db.collection("messages").add({
        // data 字段表示需新增的 JSON 数据
        data: {
          nickName,
          avatarUrl,
          message,
          timeStamp
        }
      })
      .then(res => {
        // 这里是重点
        this.setData({
          message: "",
        })
        this.getMessagesCollection(0, 1);
      })
  }
})