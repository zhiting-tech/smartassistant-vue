<template>
  <van-dialog
    v-model="show"
    :showConfirmButton="false"
    :lockScroll="false"
    :close-on-click-overlay="true"
    @opened="onOpened"
    @closed="onClosed"
    class="code-dialog">
    <div class="code-wrap">
      <h3 class="code-title">{{ $t('areaDetail.inviteTip') }}</h3>
      <van-icon name="cross" class="close-btn" @click="show=false"/>
      <div v-show="!isCreateImg" ref="saveImg" class="code-body">
        <van-image
          :src="headerImg"
          class="user-header"
          @error="setDefaultHeader"/>
        <p class="user-name">{{ code.name }}</p>
        <p class="label">{{ $t('areaDetail.joinTip') }}{{ code.areaName }}</p>
        <div class="code-box">
          <vue-qr :text="download_url" :margin="10" :size="200"></vue-qr>
        </div>
        <p class="time">{{ $t('areaDetail.timeTip') }}</p>
      </div>
      <div v-show="isCreateImg" ref="imgBox" class="img-box">
        <img :src="saveUrl"/>
      </div>
    </div>
    <van-button
      v-if="!isMobile"
      class="save-btn"
      @click="saveImage">{{ $t('areaDetail.saveTip') }}</van-button>
    <van-button
      v-else
      class="save-btn">{{ $t('areaDetail.tapTip') }}</van-button>
  </van-dialog>
</template>
<script>
import VueQr from 'vue-qr'
import html2canvas from 'html2canvas'

const defaultHeader = require('../../../assets/default-header.png')

export default {
  name: 'inviteCode',
  components: {
    VueQr
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    code: {
      type: Object,
      default: () => {}
    },
    src: {
      type: String,
      default: ''
    }
  },
  watch: {
    value(val) {
      this.show = val
    },
    show(val) {
      this.$emit('input', val)
    },
    src(val) {
      const code = {
        qr_code: val,
        url: `${window.location.protocol}//${window.location.host}`,
        area_name: this.code.areaName,
      }
      this.download_url = JSON.stringify(code)
    }
  },
  data() {
    return {
      show: this.value,
      headerImg: '',
      defaultHeader,
      isCreateImg: false,
      saveUrl: '',
      download_url: ''
    }
  },
  computed: {
    isMobile() {
      return this.$methods.isMobile()
    }
  },
  created() {},
  methods: {
    setDefaultHeader() {
      this.headerImg = defaultHeader
    },
    // 监听动画结束
    onOpened() {
      if (this.download_url) {
        this.createImage()
      }
    },
    onClosed() {
      this.download_url = ''
      this.isCreateImg = false
    },
    // 图片格式转换方法
    dataURLToBlob(dataurl) {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n) {
        n -= 1
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    // 生成图片方法
    createImage() {
      const canvasID = this.$refs.saveImg
      // const that = this
      html2canvas(canvasID, {
        scrollY: 0,
        scrollX: 0,
        allowTaint: true
      }).then((canvas) => {
        // const dom = document.body.appendChild(canvas)
        // dom.style.display = 'none'
        // document.body.removeChild(dom)
        // const blob = that.dataURLToBlob(dom.toDataURL('image/png'))
        this.saveUrl = canvas.toDataURL('image/png') // URL.createObjectURL(blob)
        // URL.revokeObjectURL(blob)
        // this.isCreateImg = true
      })
    },
    // 点击保存图片
    saveImage() {
      const a = document.createElement('a')
      const imgName = this.$methods.getId(12)
      a.style.display = 'none'
      a.setAttribute('href', this.saveUrl)
      // 这块是保存图片操作  可以设置保存的图片的信息
      a.setAttribute('download', `${imgName}.png`)
      document.body.appendChild(a)
      document.body.removeChild(a)
      a.click()
    }
  }
}
</script>
<style lang="scss" scoped>
.code-dialog {
  position: absolute;
  top: 50%;
  background-color: transparent;
  border-radius: 0.2rem;
}
.code-wrap {
  position: relative;
  background: #fff;
  border-radius: 0.2rem;
  overflow: hidden;
}
.close-btn {
  position: absolute;
  top: 0.24rem;
  right: 0.24rem;
  font-size: 0.24rem;
  font-weight: bold;
  color: #3F4663;
}
.code-body {
  text-align: center;
  padding-top: 0.65rem;
  padding-bottom: 0.5rem;
  background: #fff;
  border-radius: 0.2rem;
}
.img-box {
  height: 7.72rem;
  img {
    width: 100%;
    height: 100%;
  }
}
.code-title {
  padding: 0.32rem 0.38rem;
  border-bottom: 1PX solid #eee;
  font-size: 0.28rem;
  font-weight: bold;
  color: #3F4663;
}
.user-header {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  overflow: hidden;
}
.user-name {
  padding-top: 0.2rem;
  font-size: 0.32rem;
  font-weight: bold;
  color: #3F4663;
}
.label {
  padding-top: 0.14rem;
  color: #3F4663;
}
.code-box {
  width: 3.3rem;
  height: 3.3rem;
  margin: 0.6rem auto 0;
  img {
    width: 100%;
  }
}
.time {
  padding-top: 0.1rem;
  font-size: 0.24rem;
  color: #94A5BE;
}
.save-btn {
  width: 100%;
  height: 1rem;
  background: #fff;
  border-radius: 0.2rem;
  border-width: 0;
  margin-top: 0.4rem;
  color: #3F4663;
}
</style>
<style scoped>
.save-btn >>> .van-button__text {
  font-weight: bold;
}
</style>
