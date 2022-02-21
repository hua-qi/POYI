Component({

    properties: {
        propSign: String,
        propPart: String,
        propType: String
    },

    data: {
        clozeAnalysis: ""
    },

    lifetimes: {
        attached() {
            const clozeReplies = wx.getStorageSync('cloze_replies')
            const clozeExercise = wx.getStorageSync('exercise_cloze');
            let clozeAnalysis = [];      
            clozeExercise.analysisList.forEach((item, index) => {
                let {
                    order,
                    answer,
                    analysis
                } = item;
                const reply = clozeReplies[index] ? clozeReplies[index].substring(0, 1) : "";
                clozeAnalysis[index] = {
                    order,
                    reply,
                    analysis,
                    answer
                };
            })
            this.setData({
                clozeAnalysis 
            })
        }
    },
    methods: {
        // 跳转(路由判断)
        jump() {
            // 清除本地缓存
            wx.removeStorageSync('cloze_replies');
            wx.removeStorageSync('exercise_cloze');
            const sign = this.properties.propSign;
            let type = this.properties.propType;
            const typeCut = type.slice(0, type.length - 1);
            if (sign) {
                wx.navigateTo({
                    url: `/pages/analysis/analysis?sign=${sign}&part=${typeCut}_reading&type=${type}`,
                })
            } else {
                wx.reLaunch({
                    url: `/pages/topicList/topicList?type=${type}`,
                })
            }
        }
    }
})