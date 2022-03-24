const db = wx.cloud.database();
const openId = wx.getStorageSync("openId");
Page({
  data: {
    // 错词集
    wrongs: "",
    // 错词数
    total: ""
  },

  onLoad() {
    if (openId) this.getWrongs(openId);
  },

  // 获取错词集
  getWrongs(openId) {
    db.collection("CET4_words").where({
      userOpenIds: openId
    }).get().then(res => {
    let total = res.data.length;
      this.setData({
        wrongs: res.data,
        total
      })
    });

  },


  remove(e) {
    const wordId = e.target.dataset.wordid;
    wx.cloud.callFunction({
      name: "popOpenId",
      data: {
        collection: "CET4_words",
        myWhere: {
          _id: wordId
        },
        myData: {
          openId,
        }
      }
    }).then(res => {
      this.getWrongs(openId);
    })

  }
})