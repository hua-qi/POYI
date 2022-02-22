Page({
  data: {
    part: "",
    sign: "",
    type: "",
  },
  
  onLoad(option) {
    console.log(option);
    this.setData({
      part: option.part,
      sign: option.sign,
      type: option.type
    })
  }
 
})