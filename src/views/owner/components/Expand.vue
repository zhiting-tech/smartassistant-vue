<template>
  <div class="log-detail-box">
    <div ref="expandContent" class="content-box" :style="{ 'max-height': expand ? '10rem' : '1.42rem' }">
      <slot></slot>
    </div>
    <div
      v-if="showMore"
      class="arrow-box"
      :class="{ 'rotate': expand }"
      @click="changeExpand()">
      <van-icon name="arrow-down" color="#94a5be" class="arrow-down"/>
      <van-icon name="arrow-down" color="#94a5be" class="arrow-down mgt-16"/>
    </div>
  </div>
</template>
<script>
export default {
  name: 'expand',
  data() {
    return {
      showMore: false,
      expand: true
    }
  },
  methods: {
    // 展开日志详情
    changeExpand() {
      this.expand = !this.expand
    }
  },
  mounted() {
    const box = this.$refs.expandContent
    const height = box.clientHeight
    if (height > 75) {
      this.showMore = true
      this.expand = false
    }
  }
}
</script>
<style lang="scss" scoped>
.content-box {
  max-height: 1.42rem;
  overflow: hidden;
  transition: max-height 0.6s;
}
.arrow-box {
  transition: all 1s;
  position: relative;
  text-align: center;
  .arrow-down {
    display: block;
  }
  .mgt-16 {
    margin-top: -0.16rem;
  }
}
.rotate {
  transform: rotate(180deg);
}
</style>
