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