let overallClozeReplies = ["", "", "", "", "", "", "", "", "", ""];
Component({
    properties: {
        propSign: String,
        propPart: String
    },

    data: {
        exercise: "",
        time: "",
        type: "",
        clozeReplies: []
    },

    lifetimes: {
        attached() {
            // 获取习题
            let exercise = wx.getStorageSync("exercise_cloze");
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
        clozePickerChange(e) {
            console.log(e);
            const replyIndex = parseInt(e.detail.value);
            const analysisIndex = e.target.dataset.analysisindex;
            overallClozeReplies[analysisIndex] = this.data.exercise.options[replyIndex];
            this.setData({
                clozeReplies: overallClozeReplies
            });
        },

        // 携带内容进行路由跳转
        submit() {
            wx.setStorageSync('cloze_replies', this.data.clozeReplies);
            // 获取题目部分、标志 (并进行路由跳转)
            const sign = this.properties.propSign;
            const part = this.properties.propPart;
            let type = this.data.type;
            const typeCut = type.slice(0, type.length - 1);
            if (sign) {
                    wx.navigateTo({
                        url: `/pages/exercise/exercise?sign=${sign}&part=${typeCut}_reading&type=${type}`,
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