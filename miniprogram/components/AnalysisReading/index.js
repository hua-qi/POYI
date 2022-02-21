import { getGrade } from "../../utils/Grade";
Component({
  properties: {
    propSign: String,
    propPart: String,
    propType: String
  },

  data: {
    // RAS: reply-answer-score
    RAS: "",
    // CET
    CETSectionAAnalysis: "",
    CETSectionBAnalysis: "",
    CETSectionCAnalysis: "",
    // TEM
    TEMSectionAAnalysis: "",
    TEMSectionBAnalysis: ""
  },

  lifetimes: {
    // 生命周期： created 和 attached 的区别！
    attached() {
      const type = this.properties.propType;
      if (type === "CET4" || type === "CET6") {
        const scores = [3.55,7.1, 14.2];
        const {
          CETSectionAAnalysis: sectionA,
          CETSectionBAnalysis: sectionB,
          CETSectionCAnalysis: sectionC
        } = this.CETAnalysis();
        const RAS = getGrade({
          sectionA,
          sectionB,
          sectionC
        },scores)
        this.setData({
          RAS,
         ...this.CETAnalysis()
        })
      } else if (type === "TEM4") {
        const {
          sectionAAnalysis: TEMSectionAAnalysis,
          sectionBAnalysis: TEMSectionBAnalysis
        } = this.TEMAnalysis();
        this.setData({
          TEMSectionAAnalysis,
          TEMSectionBAnalysis
        })
      }

    },
  },

  methods: {
    // CET 获取答案与解析方法
    getCETAnalysis(section, replies, analyzing) {
      const sign = section.id.charAt(section.id.length - 1);
      if (sign == 1) {
        section.analysisList.forEach((analysis, index) => {
          let {
            order,
            answer,
            grammar,
            semantics
          } = analysis;
          const reply = replies[index] ? replies[index].substring(0, 1) : "";
          analyzing[index] = {
            order,
            answer,
            grammar,
            semantics,
            reply
          };
        })
      } else if (sign == 2) {
        section.analysisList.forEach((item, index) => {
          const {
            order,
            answer,
            location,
            analysis
          } = item;
          const reply = replies[index] ? replies[index] : "";
          analyzing[index] = {
            order,
            answer,
            location,
            analysis,
            reply
          };
        })
      } else if (sign == 3) {
        let space = 46;
        section.exercises.forEach(exercise => {
          exercise.questions.forEach(question => {
            const {
              order,
              answer,
              analysis,
              location
            } = question;
            const reply = replies[question.order - space] ? replies[question.order - space] : "";
            analyzing[question.order - space] = {
              order,
              answer,
              analysis,
              location,
              reply
            }
          })
        })
      }
    },

    // CET 获取 用户 所填与解析
    CETAnalysis() {
      // 获取用户所填答案
      const {
        sectionAReplies,
        sectionBReplies,
        sectionCReplies
      } = wx.getStorageSync('reading_replies');
      let sectionAAnalysis = [],
        sectionBAnalysis = [],
        sectionCAnalysis = [];
      // 获取正确答案与解析
      const sections = [{
        "section": "CET_readingSectionA",
        "replies": sectionAReplies,
        "analyzing": sectionAAnalysis
      }, {
        "section": "CET_readingSectionB",
        "replies": sectionBReplies,
        "analyzing": sectionBAnalysis
      }, {
        "section": "CET_readingSectionC",
        "replies": sectionCReplies,
        "analyzing": sectionCAnalysis
      }];
      sections.forEach(item => {
        this.getCETAnalysis(wx.getStorageSync(item.section), item.replies, item.analyzing);
      });
      return {
        CETSectionAAnalysis: sectionAAnalysis,
        CETSectionBAnalysis: sectionBAnalysis,
        CETSectionCAnalysis: sectionCAnalysis
      }
    },

    // TEM 获取答案与解析方法
    getTEMAnalysis(section, replies, analyzing) {
      const sign = section.id.charAt(section.id.length - 1);
      if (sign == 1) {
        section.exercises.forEach(exercise => {
          exercise.questions.forEach(question => {
            const {
              order,
              answer,
              analysis
            } = question;
            const reply = replies[question.order - 41] ? replies[question.order - 41] : "";
            analyzing[question.order - 41] = {
              order,
              answer,
              analysis,
              reply
            };
          })
        })
      } else if (sign == 2) {
        section.exercises.forEach(exercise => {
          exercise.questions.forEach(question => {
            const {
              order,
              answer,
              analysis
            } = question;
            const reply = replies[question.order - 51] ? replies[question.order - 51] : "";
            analyzing[question.order - 51] = {
              order,
              answer,
              analysis,
              reply
            };
          })
        })
      }
    },

    // TEM 获取 用户 所填与解析
    TEMAnalysis() {
      // 获取用户所填答案
      const {
        sectionAReplies,
        sectionBReplies
      } = wx.getStorageSync('reading_replies')
      let sectionAAnalysis = [],
        sectionBAnalysis = [];
      // 获取正确答案与解析
      const sections = [{
        "section": "TEM_readingSectionA",
        "replies": sectionAReplies,
        "analyzing": sectionAAnalysis
      }, {
        "section": "TEM_readingSectionB",
        "replies": sectionBReplies,
        "analyzing": sectionBAnalysis
      }];
      sections.forEach(item => {
        this.getTEMAnalysis(wx.getStorageSync(item.section), item.replies, item.analyzing);
        // 清除本地缓存
        wx.removeStorageSync(item.section);
      });

      return {
        sectionAAnalysis,
        sectionBAnalysis
      }

    },

    // 跳转(路由判断)
    jump() {
      // 清除本地缓存
      wx.removeStorageSync('reading_replies');
      const sign = this.properties.propSign;
      let type = this.properties.propType;
      const typeCut = type.slice(0, type.length - 1);
      let partName = ""
      if (sign) {
        if (type === "CET4" || type === "CET6") {
          partName = "translation"
        } else if (type === "TEM4") {
          partName = "writing"
        } else if (type === "TEM8") {
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