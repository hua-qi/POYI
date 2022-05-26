Page({
    data: {
        userInfo: "",
        errData: "",
    },
    onLoad() {
        const userInfo = wx.getStorageSync('userInfo');
        if (userInfo) {
            this.setData({
                userInfo: userInfo,
            })
        }
    },

    // 登录功能
    login() {
        // 是否拥有缓存数据
        // 登录
        wx.getUserProfile({
            desc: '登录后才能继续使用哟~',
            success: (result) => {
                // 获取用户信息
                wx.setStorageSync('userInfo', result.userInfo);

                // 数据动态绑定
                this.setData({
                    errData: "",
                    userInfo: result.userInfo,
                });

                // 获取用户openID
                wx.cloud.callFunction({
                    name: 'getOpenId',
                }).then(res => {
                    wx.setStorageSync('openId', res.result.openid);
                });

            },
            fail: (err) => {
                this.setData({
                    userInfo: '',
                    errData: "不再考虑一下吗？"
                })
            },
        })
    },

    getWrods() {
        wx.reLaunch({
            url: '/pages/word/word',
        })
    },
    getQuestions() {
        wx.reLaunch({
            url: '/pages/question/question',
        })
    },
    getWrongs() {
        wx.reLaunch({
            url: '/pages/wrongs/wrongs',
        })
    },

    getMessages() {
        wx.reLaunch({
            url: '/pages/message/message',
        })
    }

})