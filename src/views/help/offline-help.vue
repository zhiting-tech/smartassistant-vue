<template>
  <div class="wrapper">
    <van-nav-bar
      title="离线帮助"
      left-arrow
      :fixed="true"
      :placeholder="true"
      :border="false"
      @click-left="onClickLeft">
    </van-nav-bar>
    <div class="device">
      <img src="../../assets/offline-help.png" alt="">
    </div>
    <div class="help-info">
      <dl>
        <dt class="title">当您的设备离线时，请依次检查:</dt>
        <dd>设备是否有电</dd>
        <dd>网关是否在线</dd>
        <dd>设备是否被他人重置、占用，可以尝试重新连接</dd>
      </dl>
    </div>
  </div>
</template>
<script>
export default {
  name: 'outLineHelp',
  data() {
    return {
      type: ''
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    }
  },
  created() {
    this.type = this.$route.query.type
  }
}
</script>
<style lang="scss" scoped>
.wrapper{
  background-color: #ffffff;
  -webkit-touch-callout: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.device {
  padding-top: 0.5rem;
  padding-bottom: .5rem;
  text-align: center;
  img{
    width: 3.6rem;
    height: 3.6rem;
  }
}
.help-info{
  padding: 0 .3rem;
  dl dt{
    font-size: .32rem;
    color: #3F4663;
    font-weight: 700;
    margin-bottom: .3rem;
  }
  dl dd{
    font-weight: 400;
    color: #3F4663;
    margin-bottom: .2rem;
    position: relative;
    padding-left: .3rem;
    a{
      color: #2DA3F6;
    }
  }
  dl dd::before{
    content: "";
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #3F4663;
    position: absolute;
    left: 0;
    top: 50%;
    margin-top: -2px;
  }
}
</style>
