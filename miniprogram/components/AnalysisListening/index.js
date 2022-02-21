import { getGrade } from "../../utils/Grade";
Component({
  properties: {
    propSign: String,
    propPart: String,
    propType: String,
  },

  data: {
    // reply-answer-score
    RAS: "",
    // CET4
    sectionAAnalysis: "",
    sectionBAnalysis: "",
    sectionCAnalysis: "",
    // TEM4
    dictationAnalysis: "",
    taskGapFillAnalysis: "",
    conversationAnalysis: ""
  },

  lifetimes: {
    // 生命周期： created 和 attached 的区别！
    attached: function () {
      let type = this.properties.propType;
      if (type === "CET4" || type === "CET6") {

        const scores = [7.1, 7.1, 14.2];
        const {
          sectionAAnalysis: sectionA,
          sectionBAnalysis: sectionB,
          sectionCAnalysis: sectionC
        } = this.CETAnalysis();
        // RAS: reply answer score
        const RAS = getGrade({
          sectionA,
          sectionB,
          sectionC
        }, scores);
        // this.CETAnalysis 返回值 sectionAAnalysis, sectionBAnalysis, sectionCAnalysis
        this.setData({
          RAS,
          ...this.CETAnalysis()
        });
      } else if (type === 'TEM4') {
        // 分数未知 暂不调用函数
        const scores = []
        const {
          dictationAnalysis,
          taskGapFillAnalysis: taskGapFill,
          conversationAnalysis: conversation
        } = this.TEMAnalysis();
        // const RAS = getGrade({
        //   taskGapFill,
        //   conversation
        // })
        this.setData({
          RAS,
          ...this.TEMAnalysis
        });
      }
    },

  },

  methods: {
    // 获取 CET 答案与解析方法
    getCETAnalysis(section, replies, analyzing) {
      const sign = section.id.charAt(section.id.length - 1);
      let space = "";
      const sign_space = [{
          "sign": 1,
          "space": 1
        },
        {
          "sign": 2,
          "space": 8
        },
        {
          "sign": 3,
          "space": 16
        }
      ];
      sign_space.forEach(item => {
        if (sign == item.sign) {
          space = item.space
        }
      });
      section.exercises.forEach(exercise => {
        exercise.questions.forEach(question => {
          const {
            order,
            answer,
            analysis
          } = question;
          const reply = replies[question.order - space] ? replies[question.order - space] : "";
          analyzing[question.order - space] = {
            order,
            answer,
            analysis,
            reply
          };
        })
      })
    },

    // CET 获取用户所选项与解析
    CETAnalysis() {
      // 获取用户所选项 
      const {
        sectionAReplies,
        sectionBReplies,
        sectionCReplies
      } = wx.getStorageSync('listening_replies');
      // 创建解析容器
      let sectionAAnalysis = [],
        sectionBAnalysis = [],
        sectionCAnalysis = [];
      // 获取答案与解析
      const sections = [{
          "section": "CET_listeningSectionA",
          "replies": sectionAReplies,
          "analyzing": sectionAAnalysis
        },
        {
          "section": "CET_listeningSectionB",
          "replies": sectionBReplies,
          "analyzing": sectionBAnalysis
        },
        {
          "section": "CET_listeningSectionC",
          "replies": sectionCReplies,
          "analyzing": sectionCAnalysis
        },
      ];
      sections.forEach(item => {
        this.getCETAnalysis(wx.getStorageSync(item.section), item.replies, item.analyzing);
      });
      return {
        sectionAAnalysis,
        sectionBAnalysis,
        sectionCAnalysis
      };

    },

    // 获取 CET listening & reading 的分数
    getTEMAnalysis(section, replies, analyzing) {
      const sign = section.id.charAt(section.id.length - 1);
      console.log(section);
      if (sign == 0) {
        analyzing.modelEssay = section.modelEssay;
        analyzing.dictation = replies ? replies : "";
      } else if (sign == 1) {
        section.analysisList.forEach((item, index) => {
          const reply = replies[index] ? replies[index] : "";
          // item: order answer analysis
          analyzing[index] = {
            ...item,
            reply
          };
        })
      } else if (sign == 2) {
        const space = 1;
        section.exercises.forEach(exercise => {
          exercise.questions.forEach(question => {
            const {
              order,
              answer,
              analysis
            } = question;
            const reply = replies[question.order - space] ? replies[question.order - space] : "";
            analyzing[question.order - space] = {
              order,
              answer,
              analysis,
              reply
            };
          })
        })
      }
    },

    // TEM 获取用户所选项与解析
    TEMAnalysis() {
      // 获取用户所选项 
      const {
        dictation,
        taskGapFill,
        conversationReplies
      } = wx.getStorageSync('listening_replies');
      // 创建解析容器
      let dictationAnalysis = {},
        taskGapFillAnalysis = [],
        conversationAnalysis = [];
      const sections = [{
          "section": "TEM_dictation",
          "replies": dictation,
          "analyzing": dictationAnalysis
        },
        {
          "section": "TEM_listeningSectionA",
          "replies": taskGapFill,
          "analyzing": taskGapFillAnalysis
        },
        {
          "section": "TEM_listeningSectionB",
          "replies": conversationReplies,
          "analyzing": conversationAnalysis
        }
      ];
      sections.forEach(item => {
        this.getTEMAnalysis(wx.getStorageSync(item.section), item.replies, item.analyzing);
        // 清除本地缓存
        wx.removeStorageSync(item.section);
      });
      return {
        dictationAnalysis,
        taskGapFillAnalysis,
        conversationAnalysis
      }
    },


    // 跳转(路由判断)
    jump() {
      // 清除本地缓存
      wx.removeStorageSync('listening_replies');
      const sign = this.properties.propSign;
      let type = this.properties.propType;
      console.log(type);
      const typeCut = type.slice(0, type.length - 1);
      let partName = "";
      if (sign) {
        if (type === "CET4" || type === "CET6" || type === "TEM8") {
          partName = "reading"
        } else if (type === "TEM4") {
          partName = "languageUsage"
        }
        wx.navigateTo({
          url: `/pages/analysis/analysis?sign=${sign}&part=${typeCut}_${partName}&type=${type}`,
        })
      } else {
        wx.reLaunch({
          url: `/pages/topicList/topicList?type=${type}`,
        })
      }
    }
  }
})