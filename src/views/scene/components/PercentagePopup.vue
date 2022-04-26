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
      <div v-if="needCondition" class="condition-box">
        <button
          v-for="item in conditionList"
          :key="item.value"
          class="condition-btn"
          :class="{ 'active': active === item.value }"
          @click="handleCondition(item)">{{ item.name }}</button>
      </div>
      <div class="control">
        <p v-if="needCondition && tipWord" class="tip-word">{{ tipWord }}</p>
        <p class="proportion">{{ percentage }}<span>{{unit}}</span></p>
        <van-slider
          v-model="sliderVal"
          bar-height="0.8rem"
          :active-color="activeColor"
          :inactive-color="inactiveColor"
          :min="min"
          :max="max"
          @change="onChange">
          <template #button>
            <div class="light-control--btn"></div>
          </template>
        </van-slider>
      </div>
      <van-button class="confirm-btn" @click="confirm">{{ $t('global.confirm') }}</van-button>
    </div>
  </van-popup>
</template>
<script>

export default {
  name: 'percentagePopup',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    initCondition: {
      type: String,
      default: '=',
    },
    initVal: {
      type: [Number, String],
      default: 0,
    },
    // 提示文字
    tipWord: {
      type: String,
      default: ''
    },
    needCondition: {
      type: Boolean,
      default: true
    },
    activeColor: {
      type: String,
      default: 'linear-gradient(to right, #FEBF32, #FFB06B)'
    },
    inactiveColor: {
      type: String,
      default: '#f1f4fc'
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    unit: {
      type: String,
      default: '%'
    },
  },
  data() {
    return {
      show: this.value,
      active: '=',
      conditionList: [
        {
          value: '<',
          name: this.$t('condition.less')
        },
        {
          value: '=',
          name: this.$t('condition.equal')
        },
        {
          value: '>',
          name: this.$t('condition.more')
        }
      ],
      sliderVal: this.initVal, // 滑动值
      percentage: 0
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
        this.active = this.initCondition
        this.sliderVal = this.initVal - 0
        this.percentage = this.unit === '%' ? this.$methods.getPercent(this.max, this.min, this.sliderVal) : this.sliderVal
      })
    },
    handleCondition(item) {
      this.active = item.value
    },
    confirm() {
      this.$emit('on-confirm', this.sliderVal, this.active)
    },
    onChange(value) {
      this.percentage = this.unit === '%' ? this.$methods.getPercent(this.max, this.min, value) : value
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  position: relative;
  padding-bottom: 0.28rem;
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
  border-bottom: 1PX solid #eee;
}
.tip-word {
  text-align: center;
  font-size: 0.28rem;
  font-weight: bold;
  color: #94A5BE;
}
.condition-box {
  display: flex;
  width: 6.9rem;
  padding: 0.1rem;
  background: #F6F8FD;
  margin: 0.5rem auto;
  border-radius: 0.5rem;
}
.condition-btn {
  flex: 1;
  height: 0.8rem;
  background: transparent;
  color: #94A5BE;
  border-radius: 0.5rem;
}
.active {
  color: #fff;
  background: #2DA3F6;
  transition: all 0.5s;
}
.control {
  padding: 0.45rem 0.3rem 1.12rem 0.3rem;
}
.proportion {
  padding: 0.3rem 0;
  font-weight: bold;
  font-size: 0.54rem;
  color: #3F4663;
  text-align: center;
  span {
    font-weight: bold;
    font-size: 0.3rem;
  }
}
.light-control--btn {
  width: 0.5rem;
  height: 1rem;
  background: #fff;
  border-radius: 0.1rem;
  box-shadow: 0px 0px 10px 0px #d1d1d1;
}
.confirm-btn {
  width: 6.9rem;
  height: 1rem;
  background: #F6F8FD;
  margin-left: 0.3rem;
  border-radius: 0.2rem;
  border: 0;
  color: #3F4663;
}
</style>
<style scoped>
.control >>> .van-slider {
  border-radius: 0.2rem;
}
</style>
