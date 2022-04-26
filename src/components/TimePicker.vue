<template>
  <van-popup
    v-model="show"
    round
    position="bottom"
    @open="initData(current)">
    <div class="picker-wrap">
      <van-icon
        name="cross"
        size="0.18rem"
        color="#3F4663"
        class="close-btn"
        @click="show = false"/>
      <h3 v-if="title" class="title">{{ title }}</h3>
      <div v-else class="time-wrap">
        <div class="time-box" @click="switchTime('start')">
          <p class="label">{{ $t('effectiveTime.start') }}</p>
          <p class="time" :class="{ 'active': timeType === 'start' }">{{ startTimeStr }}</p>
        </div>
        <div class="time-box" @click="switchTime('end')">
          <p class="label">{{ $t('effectiveTime.end') }}</p>
          <p class="time" :class="{ 'active': timeType === 'end' }">{{ endTimeStr }}</p>
        </div>
      </div>
      <div class="picker-box">
        <van-picker
          type="datetime"
          ref="picker"
          visible-item-count="5"
          :columns="columns"
          item-height="1rem"
          @change="handleChange"/>
        <div class="time-label">
        <span>{{ $t('effectiveTime.hour') }}</span>
        <span>{{ $t('effectiveTime.minute') }}</span>
        <span>{{ $t('effectiveTime.second') }}</span>
        </div>
      </div>
      <van-button
        @click="handleConfirm"
        class="sure-btn">{{ $t('global.confirm') }}</van-button>
    </div>
  </van-popup>
</template>
<script>
export default {
  name: 'timePicker',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    // 标题
    title: {
      type: String,
      default: '',
    },
    // 当前时间
    current: {
      type: Number,
      default: 0
    },
    // 开始时间
    startTime: {
      type: Number,
      default: 0
    },
    // 结束时间
    endTime: {
      type: Number,
      default: 0
    },
    // 当前是开始还是结束
    type: {
      type: String,
      default: 'start'
    }
  },
  data() {
    return {
      show: this.value,
      start: this.startTime,
      end: this.endTime,
      timeType: this.type,
      columns: []
    }
  },
  computed: {
    startTimeStr() {
      return this.$methods.formatTime(this.start)
    },
    endTimeStr() {
      return this.$methods.formatTime(this.end)
    }
  },
  watch: {
    value(val) {
      this.show = val
    },
    show(val) {
      this.$emit('input', val)
    },
    type(val) {
      this.timeType = val
    }
  },
  methods: {
    // 初始化值
    initData(val) {
      setTimeout(() => {
        // 初始化开始值
        this.start = this.startTime
        this.end = this.endTime
        this.timeType = this.type
        // 初始化当前值
        this.initCurrent(val)
      })
    },
    // 初始化当前选择时间
    initCurrent(val) {
      const { picker } = this.$refs
      const res = this.$methods.formatTime(val)
      const list = res.split(':')
      picker.setValues(list)
    },
    // 切换值
    switchTime(type) {
      this.timeType = type
      if (type === 'start') {
        this.initCurrent(this.start)
      } else {
        this.initCurrent(this.end)
      }
    },
    // 处理值变化
    handleConfirm() {
      const { picker } = this.$refs
      const res = this.formatToSecond(picker.getValues())
      if (this.title) {
        this.$emit('on-sure', res)
      } else {
        this.$emit('on-sure', this.start, this.end)
      }
    },
    // 处理变化值
    handleChange(picker, val) {
      if (this.timeType === 'start') {
        this.start = this.formatToSecond(val)
      } else {
        this.end = this.formatToSecond(val)
      }
    },
    // 时间转为秒
    formatToSecond(arr) {
      let res = 0
      arr.forEach((item, index) => {
        const val = parseInt(item, 10)
        if (index === 0) {
          res += val * 60 * 60
        } else if (index === 1) {
          res += val * 60
        } else {
          res += val
        }
      })
      return res
    },
    initColmns() {
      const arr = []
      this.columns = []
      // 初始化列表值
      for (let i = 0; i <= 59; i += 1) {
        const val = i > 9 ? `${i}` : `0${i}`
        arr.push(val)
      }
      for (let i = 1; i <= 3; i += 1) {
        let val = []
        if (i === 1) {
          val = arr.slice(0, 24)
        } else {
          val = arr
        }
        const obj = {
          values: val
        }
        this.columns.push(obj)
      }
    }
  },
  created() {
    this.initColmns()
  }
}
</script>
<style lang="scss" scoped>
.title {
  padding-bottom: 0.3rem;
  font-weight: bold;
  font-size: 0.32rem;
  color: #3F4663;
}
.picker-wrap {
  position: relative;
  background: #fff;
  padding: 0.3rem;
}
.picker-box {
  position: relative;
}
.picker-box::before {
  content: "";
  position: absolute;
  top: 0;
  left: -0.3rem;
  right: -0.3rem;
  height: 1PX;
  z-index: 9;
  background: #eee;
}
.close-btn {
  position: absolute;
  z-index: 9;
  top: 0.3rem;
  right: 0.3rem;
  font-weight: bold;
}
.time-wrap {
  display: flex;
  padding: 0.08rem 0 0.3rem;
}
.time-box {
  flex: 1;
  text-align: center;
  .label {
    font-weight: bold;
    font-size: 0.22rem;
    color: #3F4663;
    padding-bottom: 0.15rem;
  }
  .active {
    color: #2DA3F6;
  }
}
.time {
  font-size: 0.36rem;
  font-weight: bold;
  color: #94A5BE;
}
.time-label {
  display: flex;
  align-items: center;
  width: calc(100% - 0.7rem);
  height: 1rem;
  position: absolute;
  top: 50%;
  z-index: 2;
  transform: translateY(-50%);
  pointer-events: none;
  span {
    flex: 1;
    text-align: right;
    font-size: 0.28rem;
    font-weight: bold;
    color: #94A5BE;
  }
}
.sure-btn {
  width: 100%;
  height: 1rem;
  background: #F6F8FD;
  border: 0;
  border-radius: 0.2rem;
  margin-top: 0.8rem;
  color: #3F4663;
}
</style>
<style scoped>
.picker-box >>> .van-picker__columns {
  padding: 0 0.4rem;
}
.picker-box >>> .van-ellipsis {
  font-size: 0.36rem;
  font-weight: bold;
  color: #3F4663;
}
.picker-box >>> .van-picker__frame {
  left: 0;
  right: 0;
}
</style>
