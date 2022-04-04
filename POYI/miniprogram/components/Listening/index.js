// 获取播放器实例
const InnerAudioContext = wx.createInnerAudioContext();
// 获取云数据库实例
const db = wx.cloud.database();
// 定义全局 section 已选项
let overallSectionAReplies = [];
let overallSectionBReplies = [];
let overallSectionCReplies = [];
let overallDictation = "";
let overallTaskGapFill = [];
let overallConversationReplies = [];
Component({
  options: {
    // 组件样式隔离
    styleIsolation: 'isolated'
  },
  properties: {
    // 接收父组件传值
    propSign: String,
    propPart: String,
    propType: String
  },
  data: {
    type: "", // 习题类型 CET4/6 / TEM4/8
    exercise: "", // 习题内容
    // 音频播放器
    time: "", // 习题限时时长
    isPlay: false, // 播放开关
    percentage: 0, // 进度条比例
    currentTime: "", // 音频正在播放时长
    duration: "", // 音频总时长
    // CET
    // sections 内容
    CETSectionA: "",
    CETSectionB: "",
    CETSectionC: "",
    // TEM
    TEMDictation: "",
    TEMSectionA: "",
    TEMSectionB: ""
  },
  lifetimes: {
    attached() {
      // 习题解析
      wx.showLoading({
        title: '加载中...',
      })
      this.parseExercise();
      // 请求sections数据
      this.getSections();
      wx.hideLoading();
    },

    detached() {
      InnerAudioContext.pause();
    }
  },

  methods: {
    // 解析习题信息
    parseExercise() {
      // 从缓存中获取习题数据
      const exercise = wx.getStorageSync('exercise_listening');
      // 获取音频链接、题目类型、子数据、限时时间
      const {
        listeningUrl,
        type,
        time
      } = exercise;
      // 处理时间
      const countdown = time.substring(0, 2) * 60 * 1000;
      // 播放器实例链接赋值
      InnerAudioContext.src = listeningUrl;
      this.setData({
        exercise,
        time: countdown,
        type
      });
      // 播放时间格式化方法
      const formatTime = (param) => {
        let min = parseInt(param / 60);
        let sec = parseInt(param % 60);
        return `${[min,sec].map(numberFormat).join(':')}`;
      };

      const numberFormat = n => {
        n = n.toString();
        return n[1] ? n : `0${n}`;
      }
      // 监听音频进度更新函数
      const that = this;
      InnerAudioContext.onTimeUpdate(() => {
        let percentage = (InnerAudioContext.currentTime / InnerAudioContext.duration).toFixed(2);
        let formatCurrentTime = formatTime(InnerAudioContext.currentTime);
        let formatDuration = formatTime(InnerAudioContext.duration);
        that.setData({
          percentage,
          currentTime: formatCurrentTime,
          duration: formatDuration
        })
      });
    },

    // 请求 sections 数据
    getSections() {
      const {
        children,
        type
      } = this.data.exercise;
      // 根据 exersice.children[] 中id 进行 查询
      let requestList = '';
      if (type === 'CET4' || type === 'CET6') {
        requestList = [{
            collectionName: "CET_listeningSectionA",
            id: children.sectionAId,
            section: "CETSectionA"
          },
          {
            collectionName: "CET_listeningSectionB",
            id: children.sectionBId,
            section: "CETSectionB"
          },
          {
            collectionName: "CET_listeningSectionC",
            id: children.sectionCId,
            section: "CETSectionC"
          },
        ]
      } else if (type === 'TEM4') {
        requestList = [{
            collectionName: "TEM_dictation",
            id: children.dictationId,
            section: "TEMDictation"
          },
          {
            collectionName: "TEM_listeningSectionA",
            id: children.sectionAId,
            section: "TEMSectionA"
          },
          {
            collectionName: "TEM_listeningSectionB",
            id: children.sectionBId,
            section: "TEMSectionB"
          },
        ]
      } else {
        requestList = [
        {
          collectionName: "TEM_listeningSectionA",
          id: children.sectionAId,
          section: "TEMSectionA"
        },
        {
          collectionName: "TEM_listeningSectionB",
          id: children.sectionBId,
          section: "TEMSectionB"
        },
      ]
      }
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

    // 播放事件
    listenerButtonPlay() {
      InnerAudioContext.play();
      this.setData({
        isPlay: true
      });
      const that = this;
      InnerAudioContext.onEnded(() => {
        that.setData({
          isPlay: false
        })
      })

    },

    // 暂停事件
    listenerButtonPause () {
      InnerAudioContext.pause();
      this.setData({
        isPlay: false
      })
    },

    // CET4 答案填写
    // 单选
    // sectionA
    sectionARadioChange(e) {
      // 获取序号与选项
      const {
        order,
        reply
      } = e.detail;
      // 全局数组赋值
      overallSectionAReplies[order - 1] = reply ? reply : "";
    },
    sectionBRadioChange(e) {
      const {
        order,
        reply
      } = e.detail;
      overallSectionBReplies[order - 8] = reply ? reply : "";
    },
    sectionCRadioChange(e) {
      const {
        order,
        reply
      } = e.detail;
      overallSectionCReplies[order - 16] = reply ? reply : "";
    },

    // TEM4 答案填写
    getComposition(e) {
      overallDictation = e.detail.value
    },
    sectionAFieldBlur(e) {
      let value = e.detail.value;
      let fieldIndex = e.currentTarget.dataset.order - 1;
      overallTaskGapFill[fieldIndex] = value;
    },
    TEMsectionBRadioChange(e) {
      const {
        order,
        reply
      } = e.detail;
      overallConversationReplies[order - 1] = reply ? reply : "";

    },

    // 数据提交/跳转
    // 获取题目部分、标志 (并进行路由跳转)
    submit() {
      const type = this.data.type;
      const sign = this.properties.propSign;
      const part = this.properties.propPart;
      if (type === "CET4" || type === "CET6") {
        const listening_replies = {
          sectionAReplies: overallSectionAReplies,
          sectionBReplies: overallSectionBReplies,
          sectionCReplies: overallSectionCReplies
        };
        wx.setStorageSync('listening_replies', listening_replies);
        this.jump({
          type,
          sign,
          part
        });
      } else if (type === "TEM4") {
        const listening_replies = {
          dictation: overallDictation,
          taskGapFill: overallTaskGapFill,
          conversationReplies: overallConversationReplies
        };
        wx.setStorageSync('listening_replies', listening_replies);
        this.jump({
          type,
          sign,
          part
        });
      }
    },

    jump(event) {
      this.listenerButtonPause();
      let {
        sign,
        part,
        type
      } = event;
      const typeCut = type.slice(0, type.length - 1);
      let partName = ""
      if (sign) {
        if (type === "CET4" || type === "CET6" || type === "TEM8") {
          partName = "reading"
        } else if (type === "TEM4") {
          partName = "languageUsage"
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
    onCountDown() {
      this.submit()
    },

  }

})