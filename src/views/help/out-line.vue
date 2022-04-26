<template>
  <div class="wrapper">
    <van-nav-bar
      title="离线帮助"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
    </van-nav-bar>
    <div class="container">
      <div class="paragraph">
        <p class="title">出现“设备已离线”提示怎么办？</p>
        <p class="content">当出现“设备已离线”提示时，可能因为当前网络环境较差或设备断电导致。</p>
      </div>
      <div class="paragraph">
        <p class="title">设如果设备通过WiFi方式连接，请尝试以下操作：</p>
        <p class="content"><span class="order">1.</span>设备是否连接电源；</p>
        <p class="content"><span class="order">2.</span>路由器是否能连接外网；</p>
        <p class="content"><span class="order">3.</span>尝试断电重启设备；</p>
        <p class="content"><span class="order">4.</span>如果路由器更换密码，请尝试重新连接路由器；</p>
      </div>
      <div class="paragraph">
        <p class="title">如果设备为网关子设备，请尝试以下操作：</p>
        <p class="content"><span class="order">1.</span>请检查网关是否上电；</p>
        <p class="content"><span class="order">2.</span>请确认设备电量状态；</p>
        <p class="content"><span class="order">3.</span>请确认设备是否在网关附近；</p>
        <p class="content"><span class="order">4.</span>请确认设备未被他人占用。</p>
      </div>
      <p class="title">检查完毕后，请尝试刷新设备状态。</p>
    </div>
    <div v-if="type === 'sa'" class="container">
      <div class="paragraph">
        <p class="title">出现“智慧中心连接失败”提示怎么办？</p>
        <p class="content">当出现“智慧中心连接失败”提示时，可能因为当前网络环境较差或智慧中心断电导致。</p>
      </div>
      <div class="paragraph">
        <p class="title">请尝试以下操作：</p>
        <p class="content"><span class="order">1.</span>智慧中心是否连接电源；</p>
        <p class="content"><span class="order">2.</span>智慧中心网络是否正常；</p>
        <p class="content"><span class="order">3.</span>尝试断电重启智慧中心；</p>
        <p class="content"><span class="order">4.</span>使手机与智慧中心处于同一局域网；</p>
        <p class="content"><span class="order">5.</span>登录；</p>
      </div>
      <p class="title">进行以上操作后，请尝试刷新页面查看智慧中心状态。</p>
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
.wrapper {
  background: #fff;
}
.container {
  padding: 0 0.3rem;
  .paragraph {
    padding-bottom: 0.36rem;
  }
  .title {
    padding-bottom: 0.1rem;
    font-size: 0.28rem;
    font-weight: bold;
    color: #3f4663;
  }
  .content {
    font-size: 0.28rem;
    color: #3f4663;
    line-height: 0.48rem;
  }
  .order {
    position: relative;
    font-weight: bold;
    margin-right: 0.1rem;
  }
  .order:before {
    content: "";
    position: absolute;
    top: 0rem;
    left: -0.06rem;
    width: 0.22rem;
    height: 0.22rem;
    background: #3f4663;
    opacity: 0.2;
    border-radius: 50%;
  }
}
</style>
