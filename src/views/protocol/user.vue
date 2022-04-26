<template>
  <div class="protocol">
    <van-nav-bar
      :title="$t('protocol.agreementTitle')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
    </van-nav-bar>
    <iframe id="agreement" width="100%" height="100%" class="agreement" :src="protocolUrl"></iframe>
  </div>
</template>
<script>
import { envOrigin } from '@/config'

export default {
  name: 'agreement',
  data() {
    return {}
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    getRootPath() {
      const pathName = window.location.pathname.substring(1)
      const webName = pathName === '' ? '' : pathName.substring(0, pathName.lastIndexOf('/') + 1)
      return `${window.location.protocol}//${window.location.host}/${webName}`
    }
  },
  computed: {
    protocolUrl() {
      return `${envOrigin}/smartassitant/protocol/user/`
    }
  },
  mounted() {}
}
</script>
<style lang="scss" scoped>
  .agreement {
    width: 100%;
    height: calc(100vh - 1rem);
    border: 0;
    margin-top: -1PX;
    overflow: auto;
  }
</style>
