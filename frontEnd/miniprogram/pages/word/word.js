const app = getApp();
// api 统一请求接口
const api = app.globalData.api;
Page({
    data: {
        word: '',
        words: [],
        rightId: '',
        selectId: '',
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

    // 获取四个随机单词
    getWords() {
        return new Promise((resolve, reject) => {
            api.getData('http://www.breakEnglish.com', {
                module: 'Word',
                action: 'RandomQuery',
                collectionName: 'CET4_words'
            }).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
                console.err(err);
            })
        })
    },

    // 下一题
    async next() {
        // 获取单词数据
        await this.getWords().then(res => {
            const word = res[Math.floor(Math.random() * res.length)];
            this.setData({
                words: res,
                word,
                rightId: word._id,
                selectId: "",
                selected: false,
                value: 0,
            });
        });

        // 调用倒计时函数
        this.countDown();
    },

    pushOpenId(param) {
        console.log(param)
        // param: CET4_words: _id, openId
        api.getData('http://www.breakEnglish.com',{
            module: 'Word',
            action: 'PushOpenId',
            collectionName: 'CET4_words',
            ...param
        }).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        })
    },

    // 错题标记
    wrongMark() {
        let selectId = this.data.selectId;
        let rightId = this.data.rightId;
        const openId = wx.getStorageSync('openId');
        if (selectId !== rightId) {
            this.pushOpenId({
                _id: rightId,
                openId
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