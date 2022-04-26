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
  name: 'curtainPopup',
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
      type: [String, Number],
      default: ''
    },
    needSwitch: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeIcon,
      inactiveIcon,
      show: this.value,
      active: this.initVal,
      opList: [
        {
          value: 100,
          name: this.$t('condition.curtainOpen')
        },
        {
          value: 0,
          name: this.$t('condition.curtainClose')
        },
        {
          value: 'percent',
          name: this.$t('condition.curtianPercent')
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
        if (this.initVal === 0 || this.initVal === 100) {
          this.active = this.initVal
        } else {
          this.active = 'percent'
        }
      })
    },
    switchChange(item) {
      this.active = item.value
      this.$emit('on-change', item)
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
