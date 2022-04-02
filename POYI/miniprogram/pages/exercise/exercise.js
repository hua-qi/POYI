Page({
  data: {
    sign: "",
    part: "",
    type: "",
  },

  onLoad(option) {
    this.setData({
      sign: option.sign,
      part: option.part,
      type: option.type
    })
  }
})