let overallusageReplies = [];
Component({
    properties: {
        propSign: String,
        propPart: String
    },

    data: {
        exercise: "",
        time: "",
        type: "",
        usageReplies: []
    },

    lifetimes: {
        attached() {
            console.log(this.properties.propPart);
            // 获取习题
            let exercise = wx.getStorageSync("exercise_languageUsage");
            let type = exercise.type;
            console.log(exercise);
            // 获取时间并处理
            const time = exercise.time.substring(0, 2) * 60 * 1000;
            this.setData({
                exercise,
                time,
                type
            })
        }
    },

    methods: {
        RadioChange(e) {
            const order = e.currentTarget.dataset.order;
            const reply = e.detail.charAt(0);
            overallusageReplies[order - 1] = reply ? reply : "";
            this.setData({
                usageReplies: overallusageReplies
            });
        },
        // 携带内容进行路由跳转
        submit() {
            wx.setStorageSync('usage_replies', this.data.usageReplies);
            // 获取题目部分、标志 (并进行路由跳转)
            const sign = this.properties.propSign;
            const part = this.properties.propPart;
            let type = this.data.type;
            const typeCut = type.slice(0, type.length - 1);
            let partName = ""
            if (sign) {
                if (type === "TEM4") {
                    partName = "cloze";
                } else if (type === "TEM8") {
                    partName = "translation"
                }
                wx.navigateTo({
                    url: `/pages/exercise/exercise?sign=${sign}&part=${typeCut}_${partName}`,
                })
            } else {
                wx.navigateTo({
                    url: `/pages/analysis/analysis?part=${part}&type=${type}`,
                })
            }
        },

        // 子组件传值 (倒计时完成) 保存内容 自动跳转
        onCountDown() {
            this.submit();
        }
    }
})