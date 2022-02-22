let overallTranslation = "";
Component({

  properties: {
    propSign: String,
    propPart: String
  },

  data: {
    exercise: "", // 习题内容
    time: "" ,// 限时时间,
    type: "" // 习题所属类型
  },

  lifetimes: {
    attached: function () {
      // 缓存中获取习题数据
      const exercise = wx.getStorageSync('exercise_translation');
      let { type, time } = exercise;
      // 获取时间并处理
      time = time.substring(0, 2) * 60 * 1000;
      this.setData({
        exercise,
        time,
        type
      })
    }
  },

  methods: {
    getTranslation(e) {
      overallTranslation = e.detail.value;
    },

    // 携带内容进行路由跳转
    submit() {
      wx.setStorageSync('translationArticle', overallTranslation)

      // 获取题目部分、标志 (并进行路由跳转)
      const type = this.data.type;
      const sign = this.properties.propSign;
      const part = this.properties.propPart;
      const typeCut = type.slice(0, type.length - 1); 
      if (sign) {
        if ( type === "CET4" || type === "CET6") {
          wx.reLaunch({
            url: `/pages/analysis/analysis?sign=${sign}&part=${typeCut}_writing&type=${type}`,
          })
        } else if ( type === "TEM8" ) {
          wx.navigateTo({
            url: `/pages/exercise/exercise?sign=${sign}&part=${typeCut}_writing&type=${type}`,
          })
        }
      } else {
        wx.navigateTo({
            url: `/pages/analysis/analysis?part=${part}&type=${type}`,
        })
      }
    },

    // 子组件传值 (倒计时完成) 保存内容 自动跳转
    onCountDown() {
      this.submit()
    }


  }
})