Component({
    properties: {
        propSign: String,
        propPart: String,
        propType: String
    },

    data: {
        usageAnalysis: ""
    },

    lifetimes: {
        attached() {
            const usageReplies = wx.getStorageSync('usage_replies')
            const useageExercise = wx.getStorageSync('exercise_languageUsage');
            let usageAnalysis = [];
            useageExercise.questions.forEach((item, index) => {
                let {
                    order,
                    answer,
                    analysis,
                    title
                } = item;
                const reply = usageReplies[index] ? usageReplies[index] : "";
                usageAnalysis[index] = {
                    order,
                    answer,
                    analysis,
                    reply,
                    title
                };
            })
            this.setData({
                usageAnalysis
            })
        }
    },
    methods: {
        // 跳转(路由判断)
        jump() {
            // 清除本地缓存
            wx.removeStorageSync('usage_replies');
            wx.removeStorageSync('exercise_languageUsage');
            const sign = this.properties.propSign;
            let type = this.properties.propType;
            const typeCut = type.slice(0, type.length - 1);
            let partName = ""
            if (sign) {
                if (type === "TEM4") {
                    partName = "cloze"
                } else if (type === "TEM8") {
                    partName = "translation"
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