<template>
  <div class="third">
    <van-nav-bar
      :title="$t('experienceCenter.title')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
    </van-nav-bar>
    <iframe
      :src="experienceUrl"
      width="100%"
      height="100%"
      scrolling="no"
      class="third-iframe"/>
  </div>
</template>
<script>
import { envOrigin } from '@/config'

export default {
  name: 'experienceCenter',
  data() {
    return {}
  },
  computed: {
    experienceUrl() {
      return `${envOrigin}/#/experience/center`
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    }
  },
  mounted() {
    document.body.style.overflow = 'hidden'
  },
  beforeDestroy() {
    document.body.style.overflow = 'initial'
  }
}
</script>
<style lang="scss" scoped>
.third {
  min-height: 100vh;
  background: $bgColor;
  overflow: auto;
}
.third-iframe {
  width: 100%;
  min-height: calc(100vh - 1rem);
  border: 0;
  margin-top: -1PX;
  overflow: auto;
}
</style>
