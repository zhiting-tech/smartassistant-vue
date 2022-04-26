<template>
  <div class="protocol">
    <van-nav-bar
      :title="$t('protocol.title')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
    </van-nav-bar>
    <div class="nav-group">
      <!--/smartassitant/protocol/user-->
      <a class="link" href="javascript:;" @click="goAgreement('/smartassitant/protocol/user/')">
        <span>{{ $t('protocol.userAgreement') }}</span>
        <van-icon name="arrow" class="right-icon" size=".4rem" color="#ccc"/>
      </a>
      <!-- /smartassitant/protocol/privacy-->
      <a class="link" href="javascript:;" @click="goAgreement('/smartassitant/protocol/privacy/')">
        <span>{{ $t('protocol.privacyPolicy') }}</span>
        <van-icon name="arrow" class="right-icon" size=".4rem" color="#ccc"/>
      </a>
    </div>
  </div>
</template>
<script>
import { envOrigin } from '@/config'

export default {
  name: 'third',
  data() {
    return {}
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    goAgreement(url) {
      const target = `${envOrigin}${url}`
      window.open(target, '_blank')
    }
  },
}
</script>
<style lang="scss" scoped>
  .link {
    display: flex;
    align-items: center;
    padding: 0.35rem 0.3rem;
    background: #fff;
    border-top: 1px solid #ebedf0;
    span {
      flex: 1;
      font-size: 0.28rem;
      font-weight: bold;
      color: #3F4663;
    }
  }
  .link:last-of-type{
    border-bottom: 1px solid #ebedf0;
  }
</style>
