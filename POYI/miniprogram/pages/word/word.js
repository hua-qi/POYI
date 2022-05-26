// 云数据库方法实例化
const db = wx.cloud.database();
const _ = db.command;
Page({
    data: {
        type: "",
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

     onLoad(option) {
         this.setData({
            type: option.type
        })

        // 调用下一题函数
         this.next();
    },

    // 下一题
    async next() {
        let collectionName = `${this.data.type}_words`;
        console.log(collectionName)

        let words = "";
        // 获取单词数据 （须进行同步设置，便于之后获取 word）
        await db.collection(collectionName).aggregate().sample({
            size: 4
        }).end().then(res => {
            console.log(res);
            words = res.list
        });

        // 随机选择正确选项
        let word = words[Math.floor(Math.random() * words.length)];
        console.log(word)
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

                // 倒计时时间到 或者 用户已选择
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