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
      <div class="color-box">
        <div id="picker" class="picker-box">
          <svg style="display:none;">
            <defs>
              <g id="handle">
                <circle cx="8" cy="8" r="6" fill="transparent" stroke-width="2" stroke="#fff"></circle>
              </g>
            </defs>
          </svg>
          <div class="mask"></div>
        </div>
      </div>
      <van-button class="confirm-btn" @click="confirm">{{ $t('global.confirm') }}</van-button>
    </div>
  </van-popup>
</template>
<script>
import iro from '@jaames/iro'

export default {
  name: 'colorPickerPopup',
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
      type: String,
      default: '',
    }
  },
  data() {
    return {
      show: this.value,
      active: '=',
      hexString: this.initVal,
      colorPicker: null,
      colorHsv: { h: 0, s: 0, v: 100 }
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
        if (!this.colorPicker) {
          this.createPicker()
          this.colorPicker.color.hexString = this.initVal
        }
        this.active = this.initCondition
      })
    },
    // 生成colorPicker组件
    createPicker() {
      // 适配大小
      const clientWidth = document.body.clientWidth || document.documentElement.clientWidth
      const standard = 375
      const width = 200 * (clientWidth / standard)
      this.colorPicker = new iro.ColorPicker('#picker', {
        // Set the size of the color picker
        width,
        handleSvg: '#handle',
        layout: [
          {
            component: iro.ui.Wheel
          },
        ],
        // Set the initial color to pure red
        color: '#f00'
      })
      this.colorPicker.on('color:change', (color) => {
        this.colorChange(color)
      })
    },
    confirm() {
      this.$emit('on-confirm', this.hexString, this.active)
    },
    colorChange(value) {
      this.hexString = value.hexString
    },
    // 颜色转化
    hsvToRgb(h, s, v) {
      s /= 100
      v /= 100
      let r = 0
      let g = 0
      let b = 0
      const i = parseInt((h / 60) % 6, 10)
      const f = h / 60 - i
      const p = v * (1 - s)
      const q = v * (1 - f * s)
      const t = v * (1 - (1 - f) * s)
      switch (i) {
        case 0:
          r = v; g = t; b = p
          break
        case 1:
          r = q; g = v; b = p
          break
        case 2:
          r = p; g = v; b = t
          break
        case 3:
          r = p; g = q; b = v
          break
        case 4:
          r = t; g = p; b = v
          break
        case 5:
          r = v; g = p; b = q
          break
        default:
          break
      }
      r = parseInt(r * 255.0, 10)
      g = parseInt(g * 255.0, 10)
      b = parseInt(b * 255.0, 10)
      return this.colorHex(`rgb(${r},${g},${b})`)
    },
    colorHex(color) {
      const that = color
      // 十六进制颜色值的正则表达式
      const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
      // 如果是rgb颜色表示
      if (/^(rgb|RGB)/.test(that)) {
        const aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',')
        let strHex = '#'
        for (let i = 0; i < aColor.length; i += 1) {
          let hex = Number(aColor[i]).toString(16)
          if (hex.length < 2) {
            hex = `0${hex}`
          }
          strHex += hex
        }
        if (strHex.length !== 7) {
          strHex = that
        }
        return strHex
      } if (reg.test(that)) {
        const aNum = that.replace(/#/, '').split('')
        if (aNum.length === 6) {
          return that
        } if (aNum.length === 3) {
          let numHex = '#'
          for (let i = 0; i < aNum.length; i += 1) {
            numHex += (aNum[i] + aNum[i])
          }
          return numHex
        }
      }
      return that
    },
    rgbToHsl(r, g, b) {
      r /= 255
      g /= 255
      b /= 255
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      let h; let s; const
        l = (max + min) / 2
      if (max === min) {
        h = s === 0 // achromatic
      } else {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0)
            break
          case g:
            h = (b - r) / d + 2
            break
          case b:
            h = (r - g) / d + 4
            break
          default:
            h /= 6
        }
      }
      return [h, s, l]
    }
  },
  mounted() {
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
.color-box{
  height: 6rem;
  width: 100%;
  padding: 0.3rem 0 0.6rem 0;
  text-align: center;
  .picker-box {
    display: inline-block;
    padding-top: 0.6rem;
    position: relative;
    .mask{
      display: none;
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: transparent;
      z-index: 10;
    }
  }
  .picker-box.disable{
    opacity: .5;
    .mask{
      display: block;
    }
  }
}
.active {
  color: #fff;
  background: #2DA3F6;
  transition: all 0.5s;
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
