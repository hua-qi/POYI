// 云数据库方法实例化
const db = wx.cloud.database();
const _ = db.command;
Page({
    data: {
        word: "",
        words: [],
        rightId: "",
        selectId: "",
        selected: false,
        value: 0,
        rightGradientColor: {
            '0%': '#cbe6fc',
            '100%': '#1d91f6'
        },
        wrongGradientColor: {
            '0%': '#fb7299',
            '100%': '#e13646'
        }
    },

    onShow() {
        // 调用下一题函数
        this.next();
    },

    // 答案验证
    verify(option) {
        let selected = true;
        const rightId = this.data.word._id;
        const selectId = option.target.dataset.id;
        this.setData({
            selectId,
            rightId,
            selected
        })
    },

    // 倒计时实现
    countDown() {
        let value = 0;
        this.setData({
            timer: setInterval(() => {
                value += 1;
                console.log(1);
                // 倒计时停止
                this.setData({
                    value
                })
                if (value === 100 || this.data.selected) {
                    this.setData({
                        value: 100,
                        selected: true,
                    });
                    // 清除限时
                    clearInterval(this.data.timer);
                    // 错题标记
                    this.wrongMark();
                }
            }, 100)
        })
    },

    // 下一题
    async next() {
        let words = "";
        // 获取单词数据
        await db.collection("CET4_words").aggregate().sample({
            size: 4
        }).end().then(res => {
            words = res.list
        });
        let word = words[Math.floor(Math.random() * words.length)];
        this.setData({
            words,
            word,
            rightId: word._id,
            selectId: "",
            selected: false,
            value: 0,
        });

        // 调用倒计时函数
        this.countDown();
    },

    // 错题标记
    wrongMark() {
        let selectId = this.data.selectId;
        let rightId = this.data.rightId;
        const openId = wx.getStorageSync('openId');
        if (selectId !== rightId) {
            wx.cloud.callFunction({
                name: "pushOpenId",
                data: {
                    collection: "CET4_words",
                    myWhere: {
                        _id: rightId
                    },
                    myData: {
                        openId,
                    }
                }
            }).then(res => {
                console.log(res);
            })
        }
    },

    // 页面隐藏后清除限时
    onHide() {
        clearInterval(this.data.timer);
        this.setData({
            value: 0
        })
    }

})