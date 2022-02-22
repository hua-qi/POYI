const app = getApp();
// api 统一请求接口
const api = app.globalData.api;
Page({
  data: {
    wrongs: "",
  },

  onLoad() {
    this.getWrongs();
  },

   getWrongs() {
    const openId = wx.getStorageSync('openId');
      api.getData('http://www.breakEnglish.com',{
        module: 'Word',
        action: 'QueryWrongs',
        collectionName: 'CET4_words',
        openId
      }).then(res => {
        this.setData({
          wrongs: res
        })
      })
  },

  remove(e) {
    const wordId = e.target.dataset.wordid;
    const openId = wx.getStorageSync("openId");
    api.getData('http://www.breakEnglish.com',{
      module: 'Word',
      action: 'PullOpenId',
      collectionName: 'CET4_words',
      _id: wordId,
      openId
    }).then(res => {
      console.log(res);
      this.getWrongs()
    })
  }
})