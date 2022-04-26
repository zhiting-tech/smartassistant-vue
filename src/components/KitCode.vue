<template>
  <div class="code-input-main">
    <input
      class="code-input"
      ref="codeInput"
      @focus="focus"
      @blur="blur"
      type="text" v-model="code"
      maxlength="8"
      :data-value="`${code}`"
      onkeyup="value=value.replace(/\s+/g, '')">
    <van-password-input
      :class="`item-${code.length}`"
      gutter=".3rem"
      :length="codeLength"
      :value="code"
      :focused="showKeyboard"
      :mask="false"
      :error-info="errorInfo"/>
    <div v-if="errorInfo" class="connect-fail">
      <p class="fail" v-if="false">{{ errorInfo || '设置代码不正确，请重新输入！' }}</p>
      <p class="tip">请检查并确保：</p>
      <p class="tip">1、设备正常供电；</p>
      <p class="tip">2、设备与智慧中心处于同一局域网；</p>
      <p class="tip">3、设备未被其他中心枢纽连接；</p>
    </div>
  </div>
</template>
<script>

export default {
  name: 'kitCode',
  props: {
    codeLength: {
      default: 6,
      type: Number
    }
  },
  data() {
    return {
      showKeyboard: false,
      code: '',
      errorInfo: '',
      queryData: {},
      msgId: ''
    }
  },
  watch: {
    code(code) {
      this.$refs.codeInput.focus()
      this.code = this.code.replace(/\s+/g, '')
      this.errorInfo = ''
      if (code.length === 8) {
        this.autoRequest(code)
      }
    }
  },
  methods: {
    focus() {
      this.showKeyboard = true
    },
    blur() {
      this.showKeyboard = false
    },
    // 进行home-kit码匹配
    autoRequest(code) {
      this.queryData.code = code
      const device = Object.assign({}, this.queryData)
      if (device.error) {
        delete device.error
      }
      // 跳转至设备详情页
      this.$router.push({
        name: 'deviceConnect',
        query: device
      })
    }
  },
  mounted() {
    this.queryData = this.$route.query
    if (this.$route.query.error) {
      this.errorInfo = this.$route.query.error
      this.code = ''
    }
    this.$nextTick(() => {
      this.$refs.codeInput.focus()
    })
  }
}
</script>
<style lang="scss" scoped>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
  }

  .code-input-main {
    position: relative;
  }

  .code-input {
    height: .8rem;
    width: 100%;
    position: absolute;
    z-index: 9999;
    border: none;
    outline: none;
    color: transparent;
    background-color: transparent;
    text-shadow: 0 0 0 transparent;
    opacity: 0;
  }
  .connect-fail {
    padding: .3rem .3rem;
    .fail {
      font-size: 0.28rem;
      color: #fe0000;
      margin-bottom: .3rem;
    }
    .tip {
      text-align: left;
      font-size: 0.28rem;
      color: #94a5be;
      margin-bottom: .15rem;
    }
  }
</style>
<style scoped>
  .van-password-input >>> .van-password-input__security{
    height: .8rem;
  }
  .van-password-input >>> .van-password-input__item{
    width: .6rem;
    background: #FFFFFF;
    border: .02rem solid #CCCCCC;
    border-radius: 8px;
    text-align: center;
    font-size: .4rem;
    color: #3F4663;
    font-weight: 700;
  }
  .van-password-input >>> .van-password-input__error-info {
    text-align: left;
  }
  .van-password-input >>> .van-password-input__item--focus{
    border-color: #2DA3F6;
  }
  .van-password-input >>> .van-password-input__item--focus .van-password-input__cursor{
    background-color: #2DA3F6;
  }
  .van-password-input .item-1 >>> .van-password-input__item:nth-child(1){
    border-color: #2DA3F6;
  }
  .van-password-input .item-2 >>> .van-password-input__item:nth-child(1),
  .van-password-input .item-2 >>> .van-password-input__item:nth-child(2){
    border-color: #2DA3F6;
  }
  .van-password-input .item-3 >>> .van-password-input__item:nth-child(1),
  .van-password-input .item-3 >>> .van-password-input__item:nth-child(2),
  .van-password-input .item-3 >>> .van-password-input__item:nth-child(3){
    border-color: #2DA3F6;
  }
  .van-password-input .item-4 >>> .van-password-input__item:nth-child(1),
  .van-password-input .item-4 >>> .van-password-input__item:nth-child(2),
  .van-password-input .item-4 >>> .van-password-input__item:nth-child(3),
  .van-password-input .item-4 >>> .van-password-input__item:nth-child(4){
    border-color: #2DA3F6;
  }
  .van-password-input .item-5 >>> .van-password-input__item:nth-child(1),
  .van-password-input .item-5 >>> .van-password-input__item:nth-child(2),
  .van-password-input .item-5 >>> .van-password-input__item:nth-child(3),
  .van-password-input .item-5 >>> .van-password-input__item:nth-child(4),
  .van-password-input .item-5 >>> .van-password-input__item:nth-child(5){
    border-color: #2DA3F6;
  }
  .van-password-input .item-6 >>> .van-password-input__item:nth-child(1),
  .van-password-input .item-6 >>> .van-password-input__item:nth-child(2),
  .van-password-input .item-6 >>> .van-password-input__item:nth-child(3),
  .van-password-input .item-6 >>> .van-password-input__item:nth-child(4),
  .van-password-input .item-6 >>> .van-password-input__item:nth-child(5),
  .van-password-input .item-6 >>> .van-password-input__item:nth-child(6){
    border-color: #2DA3F6;
  }
  .van-password-input .item-7 >>> .van-password-input__item:nth-child(1),
  .van-password-input .item-7 >>> .van-password-input__item:nth-child(2),
  .van-password-input .item-7 >>> .van-password-input__item:nth-child(3),
  .van-password-input .item-7 >>> .van-password-input__item:nth-child(4),
  .van-password-input .item-7 >>> .van-password-input__item:nth-child(5),
  .van-password-input .item-7 >>> .van-password-input__item:nth-child(6),
  .van-password-input .item-7 >>> .van-password-input__item:nth-child(7){
    border-color: #2DA3F6;
  }
  .van-password-input .item-8 >>> .van-password-input__item:nth-child(1),
  .van-password-input .item-8 >>> .van-password-input__item:nth-child(2),
  .van-password-input .item-8 >>> .van-password-input__item:nth-child(3),
  .van-password-input .item-8 >>> .van-password-input__item:nth-child(4),
  .van-password-input .item-8 >>> .van-password-input__item:nth-child(5),
  .van-password-input .item-8 >>> .van-password-input__item:nth-child(6),
  .van-password-input .item-8 >>> .van-password-input__item:nth-child(7),
  .van-password-input .item-8 >>> .van-password-input__item:nth-child(8){
    border-color: #2DA3F6;
  }
</style>
