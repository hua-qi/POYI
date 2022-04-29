// components/LevelItem/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    propWordOrTopic: String,
    propType: String,
    propTitle: String,
    propImgUrl: String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getQuestion(e) {
      const propWordOrTopic = this.properties.propWordOrTopic;
      const type = e.currentTarget.dataset.type;

      let item = propWordOrTopic === "word" ? "word" : "topicList";

      wx.navigateTo({
        url: `/pages/${item}/${item}?type=${type}`,
      })
    },
  }
})