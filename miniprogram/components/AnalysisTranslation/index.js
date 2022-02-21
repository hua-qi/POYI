Component({
  properties: {
    propSign: String,
    propPart: String,
    propType: String
  },

  data: {
    modelEssay: "",
    translationArticle: ""
  },

  lifetimes: {
    attached: function () {
      // 获取翻译范文
      const {
        modelEssay
      } = wx.getStorageSync('exercise_translation');
      // 获取翻译
      const translationArticle = wx.getStorageSync('translationArticle');
      this.setData({
        modelEssay,
        translationArticle,
      })
    }
  },

  methods: {
    // 跳转(路由判断)
    jump() {
      // 清除本地缓存
      wx.removeStorageSync('exercise_translation');
      wx.removeStorageSync('translationArticle');
      const sign = this.properties.propSign;
      let type = this.properties.propType;
      const typeCut = type.slice(0, type.length - 1);
      if (sign) {
        if (type === "CET4") {
          wx.reLaunch({
            url: `/pages/topicList/topicList?type=${type}`,
          })
        } else if (type === "TEM8") {
          wx.navigateTo({
            url: `/pages/analysis/analysis?sign=${sign}&part=${typeCut}_writing&type=${type}`,
          })
        }
      } else {
        wx.reLaunch({
          url: `/pages/topicList/topicList?type=${type}`,
        })
      }
    }
  }
})