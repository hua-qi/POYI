const db = wx.cloud.database();
Page({
  data: {
    wrongs: "",
    total: ""
  },

  onLoad() {
    const openId = wx.getStorageSync('openId');
    this.getWrongs(openId);
    this.getTotal(openId);
  },

  async getWrongs(openId) {
    await db.collection("CET4_words").where({
      userOpenIds: openId
    }).get().then(res => {
      console.log(res);
      this.setData({
        wrongs: res.data
      })
    });

  },
  async getTotal(openId) {
    await db.collection("CET4_words").where(({
      userOpenIds: openId
    })).count().then(res => {
      this.setData({
        total: res.total
      })
    });
  },

  remove(e) {
    console.log(e);
    const wordId = e.target.dataset.wordid;
    console.log(wordId);
    const openId = wx.getStorageSync("openId");
    console.log(openId);
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
      console.log(res);
      this.getWrongs(openId);
      this.getTotal(openId);
    })

  }
})