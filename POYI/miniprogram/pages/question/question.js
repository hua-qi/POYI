const db = wx.cloud.database();
const _ = db.command;
Page({
    data: {
    },
    getQuestion(e) {
        const type = e.currentTarget.dataset.type;
        wx.navigateTo({
          url: '/pages/topicList/topicList?type=' + type,
        })
    },

})