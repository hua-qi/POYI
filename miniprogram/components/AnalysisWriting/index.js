Component({
  properties: {
    propSign: String,
    propPart: String,
    propType: String
  },

  data: {
    modelEssay: "",
    componsitionArray: "",
    typeCut: ""
  },
  lifetimes: {
    attached() {
      // 获取 typeCut
      const typeCut = this.properties.propType.slice(0, this.properties.propType.length - 1);
      // 获取范文
      const {
        modelEssay
      } = wx.getStorageSync('exercise_writing');
      // 获取作文
      const composition = wx.getStorageSync('writingComposition');
      // 作文格式化
      const componsitionArray = composition.split(/[(\r\n)\r\n]+/);
      componsitionArray.forEach(item => {
        item.trim();
      })

      this.setData({
        modelEssay,
        componsitionArray,
        typeCut
      })
    }
  },

  methods: {
    jump() {
      // 清除本地缓存
      wx.removeStorageSync('exercise_writing');
      wx.removeStorageSync('writingComposition');
      const sign = this.properties.propSign;
      let type = this.properties.propType;
      console.log(type);
      const typeCut = type.slice(0, type.length - 1);
      if (sign) {
        if (type === "CET4" || type === "CET6") {
          wx.navigateTo({
            url: `/pages/analysis/analysis?sign=${sign}&part=${typeCut}_listening&type=${type}`,
          })
        } else if (type === "TEM4" || type === "TEM8") {
          console.log(333);
          wx.reLaunch({
            url: `/pages/topicList/topicList?type=${type}`,
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