<template>
  <van-overlay :show="show" @click="show = false">
    <div class="feed-wrapper" @click.stop>
      <div class="message-box">
        <div class="tips-icon">
          <van-image width="1rem" height="1rem" fit="cover" :src="warning"/>
        </div>
        <h3 class="title">{{ title }}</h3>
        <p class="content" v-html="content"></p>
        <div class="button-box clearfix">
          <van-button round class="float-l cancel-btn" @click="handleCancel">{{ $t('global.cancel') }}</van-button>
          <van-button round class="float-r confirm-btn" :loading="loading" @click="handleConfirm">{{ $t('global.confirm') }}</van-button>
        </div>
      </div>
    </div>
  </van-overlay>
</template>
<script>
const warning = require('../../../assets/tips-warning.png')

export default {
  name: 'feedbackDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'success' // success fail
    },
    title: {
      type: String,
      default: '提示'
    },
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      warning,
      show: this.value
    }
  },
  watch: {
    value(val) {
      this.show = val
    },
    show(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    handleConfirm() {
      this.$emit('confirm')
    },
    handleCancel() {
      this.show = false
    }
  }
}
</script>
<style lang="scss" scoped>
.feed-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.message-box {
  padding: 0.5rem;
  width: 6rem;
  background: #fff;
  border-radius: 0.2rem;
  text-align: center;
}
.title {
  padding-top: 0.2rem;
  font-size: 0.36rem;
  font-weight: bold;
  color: #333333;
}
.content {
  padding-top: 0.2rem;
  line-height: 0.48rem;
  font-size: 0.28rem;
  color: #3f4663;
  margin-bottom: .4rem;
}
.van-button {
  width: 2.3rem;
  height: .8rem;
  border: 1px solid #2DA3F6;
}
.cancel-btn{
  background: #FFFFFF;
  color: #2DA3F6;
}
.confirm-btn {
  background: #2DA3F6;
  color: #fff;
}
</style>
