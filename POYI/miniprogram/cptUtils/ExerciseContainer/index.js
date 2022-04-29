Component({

    properties: {
        propSection: {
            type: String,
            required: true
        },
        propDirections: {
            type: Array || String,
        },
        propExercises: {
            type: Array,
            required: true,
        }
    },

    data: {
        directionsIsArray: "",
        replies: "" // radio group 全局标识
    },

    lifetimes: {
        attached() {
            let isArray = typeof this.properties.propDirections === "Array" ? "Array" : "String";
            console.log(isArray);
            this.setData({
                directionsIsArray: isArray
            })
        }
    },
    methods: {

        // 选项
        sectionRadioChange(e) {
            // 获取序号
            const order = e.currentTarget.dataset.order;
            // 获取选项并处理
            const reply = e.detail.charAt(0);
            // 向父组件发送处理后的数据
            this.triggerEvent("overHandOption",{order,reply});
        }
    }
})