<template>
  <van-popup
    v-model="show"
    round
    position="bottom"
    @open="initData">
    <div class="wrap">
      <van-icon
        name="cross"
        color="#3F4663"
        size="0.18rem"
        class="close-btn"
        @click="show = false"/>
      <h3 class="title">{{ title }}</h3>
      <van-radio-group
        v-model="active">
        <van-cell-group>
          <van-cell
            v-for="item in opList"
            :key="item.value"
            clickable
            @click="switchChange(item)">
            <template #title>
              <p class="switch-title" :class="{ 'active': active === item.value }">
                {{ item.name }}
              </p>
            </template>
            <template #right-icon>
            <van-radio :name="item.value">
              <template #icon="props">
                <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
              </template>
            </van-radio>
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>
  </van-popup>
</template>
<script>
const activeIcon = require('@/assets/check-icon.png')
const inactiveIcon = require('@/assets/uncheck-icon.png')

export default {
  name: 'guardPopup',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    initVal: {
      type: Number,
      default: -1
    },
  },
  data() {
    return {
      activeIcon,
      inactiveIcon,
      show: this.value,
      active: this.initVal,
      opList: [
        {
          value: 0,
          name: this.$t('condition.openAtHome')
        },
        {
          value: 1,
          name: this.$t('condition.openLeaveHome')
        },
        {
          value: 2,
          name: this.$t('condition.openSleep')
        },
        {
          value: 3,
          name: this.$t('condition.closeGuard')
        }
      ]
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
    initData() {
      setTimeout(() => {
        this.active = this.initVal
      })
    },
    switchChange(item) {
      this.active = item.value
      this.$emit('on-change', item)
    },
    // 'false'字符串 转 false Boolean
    transform(str) {
      let res = false
      if (str === 'false') {
        res = false
      } else if (str === 'true') {
        res = true
      } else if (str === 'toggle') {
        res = 'toggle'
      }
      return res
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  position: relative;
}
.close-btn {
  font-weight: bold;
  position: absolute;
  top: 0.3rem;
  right: 0.3rem;
}
.title {
  padding: 0.35rem 0.3rem;
  font-weight: bold;
  font-size: 0.32rem;
  color: #3F4663;
}
.active {
  color: #2DA3F6;
}
.img-icon {
  height: 0.37rem;
}
</style>
