Component({

  properties: {
    propTime:Number
  },

  data: {
    minutes: 0,
    seconds: 0,

  },

  methods: {
    onChange: function(e) {
      // 获取时间 
      let { minutes, seconds, milliseconds } = e.detail;
      // 倒计时停止时 向父组件发送事件
      if ( minutes === 0 && seconds === 0 && milliseconds === 0 ) {
        this.triggerEvent("countDown");
      }

      this.setData({
        minutes : minutes >= 10 ? minutes : `0${minutes}`,
        seconds : seconds >= 10 ? seconds : `0${seconds}`,
      })
    
    }
  }
})
