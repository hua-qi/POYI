
Component({

    properties: {
        propRas: Array
    },

    data: {
        sectionsGrade:""
    },
    lifetimes: {
        attached() {
            const sectionsGrade = this.parseRas(this.properties.propRas);
            this.setData({
                sectionsGrade
            })
        }
    },
    methods: {
        parseRas(ras) {
            let sectionsGrade = [];
            console.log(ras);
            ras.forEach((item, index) => {
                let score = 0;
                item.answers.forEach((answer, aindex) => {
                    answer === item.replies[aindex] ? score += item.score : score += 0;
                });
                sectionsGrade[index] = {
                    "section": item.section,
                    "score": Math.round(score * 100) / 100
                }
            });
            return sectionsGrade;
        }
    }
})