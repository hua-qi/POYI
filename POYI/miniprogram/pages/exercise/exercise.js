Page({
  data: {
    sign: "",
    part: "",
    type: "",
  },

  onLoad(option) {
    console.log(option)
    this.setData({
      sign: option.sign,
      part: option.part,
      type: option.type
    })
  }
})