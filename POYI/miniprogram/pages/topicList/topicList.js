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
        db.collection('topicList').where({
            type: option.type
        }).get().then(res => {
            const partsList = res.data[0].partsList;
            const idList = res.data[0].idList;
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
        const sign = this.data.part.substring(5, 8);
        const part = this.data.part.replace(reg, "");
        const id = e.currentTarget.dataset.id;

        // 请求整套习题
        if (sign === "ALL") {

            let partName = await this.getAllExercises({
                id,
                type
            });

            wx.hideLoading();
            wx.redirectTo({
                url: `/pages/exercise/exercise?sign=all&part=${typeCut}_${partName}&type=${type}`,
            })

        } else {

            let res = await this.getExercisePart({
                part,
                id,
                type
            });

            wx.setStorageSync(`exercise_${part.slice(4)}`, res.data[0]);

            wx.hideLoading();
            wx.redirectTo({
                url: `/pages/exercise/exercise?part=${part}&type=${type}`
            })
        }

    },

    // 性能优化 请求 习题函数
    getExercisePart(event) {
        const {
            part,
            id,
            type
        } = event

        return new Promise((resolve, reject) => {
            db.collection(part).where({
                type,
                id
            }).get().then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    },

    async getAllExercises(event) {
        let {
            id,
            type
        } = event;
        let partName, partArray;

        if (type === "CET4" || type === "CET6") {
            partName = "writing";
            partArray = ["CET_writing", "CET_listening", "CET_reading", "CET_translation"];
        } else if (type === "TEM4") {
            partName = "listening";
            partArray = ["TEM_listening", "TEM_cloze", "TEM_languageUsage", "TEM_reading", "TEM_writing"];
        } else if (type === "TEM8") {
            partName = "listening";
            partArray = ["TEM_listening", "TEM_reading", "TEM_languageUsaage", "TEM_translation", "TEM_writing"];
        }

        let getExercisePromises = partArray.map(part => this.getExercisePart({
            part,
            id,
            type
        }))

        let allExercise = await Promise.all(getExercisePromises);

        allExercise.forEach((item, index) => {
            wx.setStorageSync(
                `exercise_${partArray[index].slice(4)}`,
                item.data[0]
            );
        })

        return partName;
    }

})