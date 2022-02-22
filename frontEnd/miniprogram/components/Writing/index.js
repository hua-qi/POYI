Component({

  properties: {
    propSign: String,
    propPart: String
  },

  data: {
    exercise: "",
    time: "",
    type: "",
    typeCut: "",
    imgList: [],
  },

  lifetimes: {
    attached() {
      console.log(this.properties.propPart);
      // 获取习题
      let exercise = wx.getStorageSync("exercise_writing");
      let type = exercise.type;
      const typeCut = type.slice(0, type.length - 1);
      const imgUrl = exercise.imgUrl;
      let imgList = [];
      imgList.push(imgUrl);
      console.log(exercise);
      // 获取时间并处理
      const time = exercise.time.substring(0, 2) * 60 * 1000;
      this.setData({
        exercise,
        time,
        type,
        typeCut,
        imgList
      })
    }
  },

  methods: {
    // 获取作文内容
    getComposition(e) {
      let composition = e.detail.value;
      wx.setStorageSync('writingComposition', composition);
    },

    // 图片预览功能 
    preview(e) {
      const currentUrl = e.currentTarget.dataset.src;
      wx.previewImage({
        current: currentUrl,
        urls: this.data.imgList
      })

    },
    // 携带内容进行路由跳转
    submit() {
      // 获取题目部分、标志 (并进行路由跳转)
      const sign = this.properties.propSign;
      const part = this.properties.propPart;
      let type = this.data.type;
      const typeCut = this.data.typeCut;
      if (sign) {
        if (type === "CET4" || type === "CET6") {
          wx.navigateTo({
            url: `/pages/exercise/exercise?sign=${sign}&part=${typeCut}_listening&type=${type}`,
          })
        } else if (type === "TEM4" || type === "TEM8") {
          wx.reLaunch({
            url: `/pages/analysis/analysis?sign=${sign}&part=${typeCut}_listening&type=${type}`,
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
      this.submit();
    }
  }
})