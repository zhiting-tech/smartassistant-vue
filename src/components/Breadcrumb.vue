<template>
  <div class="breadcrumb clearfix">
    <span
      class="breadcrumb-item"
      v-for="(item, index) in list"
      :key="index">
      <span
        class="breadcrumb-text one-line"
        @click="changeBread(item, index)">
        {{item.name}}
      </span>
      <van-icon
        v-if="index + 1 !== list.length"
        color="#A2A7AE"
        size=".24rem"
        name="arrow"/>
    </span>
  </div>
</template>
<script>
export default {
  name: 'breadcrumb',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    changeBread(item, index) {
      if (index + 1 === this.list.length) {
        return
      }
      this.$emit('onChange', item, index)
    }
  }
}
</script>
<style lang="scss" scoped>
.breadcrumb{
  padding: .3rem .3rem;
}
.breadcrumb-item{
  float: left;
  display: flex;
  align-items: center;
}
.breadcrumb-text{
  display: inline-block;
  max-width: 2.6rem;
  font-size: .24rem;
  color: #A2A7AE;
}
.breadcrumb-item .van-icon{
  margin: 0 .05rem;
}
</style>
