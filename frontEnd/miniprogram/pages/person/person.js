const app = getApp();
// api 统一请求接口
const api = app.globalData.api;
Page({
    data: {
        isHide: true,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        userInfo: "",
        errData: "",
    },
    onLoad() {
        const openId = wx.getStorageSync('openId');
        const userInfo = wx.getStorageSync('userInfo');
        openId ? this.setData({
            isHide: false,
            userInfo
        }) : "";
    },

    // 登录
    login() {
        const _this = this;
        wx.getUserProfile({
            desc: '登录后才能继续使用哟',
            success: (res) => {
                wx.setStorageSync('userInfo', res.userInfo);
                //点击允许后获取微信昵称与微信头像
                const {
                    nickName,
                    avatarUrl
                } = res.userInfo;
                wx.login({
                    success: function (e) {
                        //请求成功后获取你的code值
                        const code = e.code;
                        api.getData('http://www.breakEnglish.com', {
                            module: 'User',
                            action: 'Login',
                            code,
                            nickName,
                            avatar: avatarUrl
                        }).then(res => {
                            console.log(res);
                            if (res.code == 200) {
                                //将返回的ID值存入缓存中
                                wx.setStorageSync('openId', res.openid)
                                //弹框提示
                                wx.showToast({
                                    title: res.msg,
                                    icon: 'success'
                                })
                                //修改isHide值，以便于前台的判断展示
                                _this.setData({
                                    isHide: false
                                })
                            }
                        })
                    }
                })
            },
            fail: (res) => {
                //点击拒绝后弹框提示
                wx.showToast({
                    title: '授权登录失败',
                    icon: 'error'
                })
            }
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