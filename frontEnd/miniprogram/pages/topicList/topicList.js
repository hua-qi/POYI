const app = getApp();
// api 统一请求接口
const api = app.globalData.api;
Page({
    data: {
        partsList: "",
        idList: "",
        show: false,
        part: "",
        type: ""
    },
    async onLoad(option) {
        await api.showLoading();
        this.getTopicList(option);
        await api.hideLoading();
    },

     getTopicList(option) {
        api.getData('http://www.breakEnglish.com', {
            module: 'Exercise',
            action: 'QueryTopicList',
            type: option.type
        }).then((res) => {
            const partsList = res[0].partsList;
            const idList = res[0].idList;
            this.setData({
                type: option.type,
                partsList,
                idList
            });
            console.log(res);
        }).catch((err) => {
            console.error(err);
        })
    },

    showPopup(e) {
        this.setData({
            show: true,
            part: e.currentTarget.dataset.part
        });
    },

    onClose() {
        this.setData({
            show: false,
            part: ""
        });
    },

    async getExercise(e) {
        api.showLoading()
        let type = this.data.type;
        const typeCut = type.slice(0, type.length - 1);
        const reg = /[4,6,8]+/g;
        const part = this.data.part.replace(reg, "");
        const sign = this.data.part.substring(5, 8);
        const id = e.currentTarget.dataset.id;
        if (sign === "ALL") {
            const partName = await this.getExerciseParts({
                type,
                id
            });
            await api.hideLoading();
            wx.redirectTo({
                url: `/pages/exercise/exercise?sign=all&part=${typeCut}_${partName}&type=${type}`,
            })
        } else {
            await this.getExercisePart({
                part,
                id,
                type
            })
            await api.hideLoading();
            wx.redirectTo({
                url: `/pages/exercise/exercise?part=${part}&type=${type}`
            })
        }

    },

    // 请求 习题函数
    getExercisePart(event) {
        const {
            part,
            id,
            type
        } = event;
        return new Promise((resolve, reject) => {
            api.getData('http://www.breakEnglish.com', {
                module: 'Exercise',
                action: 'QueryExercise',
                collectionName: part,
                id,
                type
            }).then(res => {
                wx.setStorageSync(`exercise_${part.slice(4)}`, res[0]);
                console.log(res[0]);
                resolve();
            }).catch(err => {
                console.error(err);
                reject(err);
            })
        })
    },

    async getExerciseParts(params) {
        const {
            type,
            id
        } = params;
        let partName = "";
        let partArray = "";
        if (type === "CET4" || type === "CET6") {
            partName = "writing";
            partArray = ["CET_writing", "CET_listening", "CET_reading", "CET_translation"];
        } else if (type === "TEM4") {
            partName = "listening";
            partArray = ["TEM_listening", "TEM_cloze", "TEM_languageUsage", "TEM_reading", "TEM_writing"];
        } else if (type === "TEM8") {
            partName = "listening";
            partArray = ["TEM_listening", "TEM_reading", "TEM_languageUsage", "TEM_translation", "TEM_writing"];
        }
        for (let i = 0; i < partArray.length; i++) {
            await this.getExercisePart({
                part: partArray[i],
                id,
                type
            });
        };

        return partName;
    }



})