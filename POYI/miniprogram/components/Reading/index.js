// 数据库实例化
const db = wx.cloud.database();
// 定义全局选项数据
const CETSectionAReplies = ["","","","","","","","","",""];
const CETSectionBReplies = [];
const CETSectionCReplies = [];
const TEMSectionAReplies = [];
const TEMSectionBReplies = [];
Component({
  properties: {
    // 接收父组件传值
    propSign: String,
    propPart: String,
  },

  data: {
    type: "", // 习题所属类型
    exercise: "", // 题目数据
    time: "", // 限时时间
    // CET
    // sections 数据
    CETSectionA: "",
    CETSectionB: "",
    CETSectionC: "",
    sectionAReplies: [],
    // TEM
    TEMSectionA: "",
    TEMSectionB: "",
  },

  lifetimes: {
    attached: function () {
      // 解析 习题
      this.parseExercise();
      // 请求 sections 数据
      this.getSections();
    },

  },

  methods: {
    // 习题解析
    parseExercise() {
      // 1. 缓存中获取数据
      const exercise = wx.getStorageSync('exercise_reading');
      const {
        time,
        type
      } = exercise;
      const countDown = time.substring(0, 2) * 60 * 1000;
      this.setData({
        exercise,
        time: countDown,
        type
      });
    },

    // 请求 sections 数据
    getSections() {
      const {
        type,
        children
      } = this.data.exercise;
      let requestList = '';
      if (type === "CET4" || type === "CET6") {
        requestList = [{
            collectionName: "CET_readingSectionA",
            id: children.sectionAId,
            section: "CETSectionA"
          },
          {
            collectionName: "CET_readingSectionB",
            id: children.sectionBId,
            section: "CETSectionB"
          },
          {
            collectionName: "CET_readingSectionC",
            id: children.sectionCId,
            section: "CETSectionC"
          },
        ]
      } else if (type === "TEM4" || type === "TEM8") {
        requestList = [{
            collectionName: "TEM_readingSectionA",
            id: children.sectionAId,
            section: "TEMSectionA"
          },
          {
            collectionName: "TEM_readingSectionB",
            id: children.sectionBId,
            section: "TEMSectionB"
          },
        ]
      }
      // 根据 exersice.children[] 中id 进行 数据库查询
      requestList.forEach(item => {
        db.collection(item.collectionName).where({
          type: type,
          id: item.id
        }).get().then(res => {
          console.log(res)
          this.setData({
            [item.section]: res.data[0]
          })
          wx.setStorageSync(item.collectionName, res.data[0]);
        });
      })

    },

    // CET
    sectionAPickerChange(e) {
      const optionIndex = parseInt(e.detail.value);
      const analysisIndex = e.target.dataset.analysisindex;
      const options = this.data.CETSectionA.options;
      CETSectionAReplies[analysisIndex] = options[optionIndex] ? options[optionIndex] : "";
      this.setData({
        sectionAReplies: CETSectionAReplies
      });
    },

    sectionBFieldBlur(e) {
      console.log(e);
      const reply = e.detail.value;
      const replyIndex = e.target.dataset.order.substring(0, 2) - 36;
      CETSectionBReplies[replyIndex] = reply ? reply : "";
    },

    sectionCRadioChange(e) {
      const {
        order,
        reply
      } = e.detail;
      CETSectionCReplies[order - 46] = reply ? reply : "";
    },

    // TEM 
    sectionAChoiceChange(e) {
      const {
        order,
        reply
      } = e.detail;
      TEMSectionAReplies[order - 41] = reply ? reply : "";
    },
    sectionBReplyBlur(e) {
      const order = e.currentTarget.dataset.order;
      const reply = e.detail.value;
      TEMSectionBReplies[order - 51] = reply ? reply : "";
    },
    // 提交
    submit() {
      // 获取题目部分、标志 (并进行路由跳转)
      const type = this.data.type;
      const sign = this.properties.propSign;
      const part = this.properties.propPart;
      if (type === "CET4" || type === "CET6") {
        const reading_replies = {
          sectionAReplies: CETSectionAReplies,
          sectionBReplies: CETSectionBReplies,
          sectionCReplies: CETSectionCReplies
        };
        wx.setStorageSync('reading_replies', reading_replies);
        this.jump({
          type,
          sign,
          part
        })
      } else if (type === "TEM4") {
        const reading_replies = {
          sectionAReplies: TEMSectionAReplies,
          sectionBReplies: TEMSectionBReplies
        };
        wx.setStorageSync('reading_replies', reading_replies);
        this.jump({
          type,
          sign,
          part
        })
      }
    },

    jump(event) {
      let {
        sign,
        part,
        type
      } = event;
      console.log(event);
      const typeCut = type.slice(0, type.length - 1);
      let partName = "";
      if (sign) {
        if (type === "CET4" || type === "CET6") {
          partName = "translation";
        } else if (type === "TEM4") {
          partName = "writing";
        } else if (type === "TEM8") {
          partName = "languagaUsage";
        }
        wx.navigateTo({
          url: `/pages/exercise/exercise?sign=${sign}&part=${typeCut}_${partName}&type=${type}`,
        })
      } else {
        wx.navigateTo({
          url: `/pages/analysis/analysis?part=${part}&type=${type}`,
        })
      }
    },

    // 子组件传值 (倒计时完成) 保存内容 自动跳转
    onCountDown: function () {
      this.submit()
    }
  }
})