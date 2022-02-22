const db = wx.cloud.database();
Page({
    data: {
        partsList: "",
        idList: "",
        show: false,
        part: "",
        type: ""
    },
    onLoad(option) {
        console.log(option);
        db.collection('topicList').where({
            type: option.type
        }).get().then(res => {
            console.log(res.data);
            const partsList = res.data[0].partsList;
            const idList = res.data[0].idList;
            // wx.setStorageSync('topicList', res.data);
            this.setData({
                partsList,
                idList,
                type: option.type
            })
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
        wx.showLoading({
            title: '生成习题中~',
        })
        let type = this.data.type;
        const typeCut = type.slice(0, type.length - 1);
        const reg = /[4,6,8]+/g;
        const part = this.data.part.replace(reg, "");
        const sign = this.data.part.substring(5,8);
        const id = e.currentTarget.dataset.id;
        if (sign === "ALL") {
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
            }
            wx.hideLoading();
            wx.redirectTo({
                url: `/pages/exercise/exercise?sign=all&part=${typeCut}_${partName}&type=${type}`,
            })
        } else {
            console.log(part);
            console.log(id);
            console.log(type);
            await this.getExercisePart({
                part,
                id,
                type
            });
            wx.hideLoading();
            wx.redirectTo({
                url: `/pages/exercise/exercise?part=${part}&type=${type}`
            })
        }

    },

    // 请求 习题函数
    async getExercisePart(event) {
        const {
            part,
            id,
            type
        } = event;
        console.log(event)
        await db.collection(part).where({
            type,
            id
        }).get().then(res => {
            console.log(res);
            wx.setStorageSync(`exercise_${part.slice(4)}`, res.data[0]);
        });
    },



})