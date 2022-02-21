Component({
    properties: {
        propType: String
    },

    data: {

    },

    methods: {
        previous() {
            wx.navigateBack({
              delta: 1,
            })
        },

        backTopic() {
            console.log(this.properties.propType);
            wx.reLaunch({
              url: '/pages/topicList/topicList?type=' + this.properties.propType,
            })
        }
    }
})
