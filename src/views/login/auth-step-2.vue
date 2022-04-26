<template>
  <div>
    <div class="back clearfix">
      <van-icon
        class="float-l"
        name="arrow-left"
        size="0.3rem"
        color="#3F4663"
        @click="backStep"/>
        <div class="step-box">
          <div class="step-item step-active">
            <div>1</div>
            <p>{{ $t('login.authStep1') }}</p>
          </div>
          <div class="line"></div>
          <div class="step-item step-active">
            <div>2</div>
            <p>{{ $t('login.authStep2') }}</p>
          </div>
        </div>
    </div>
    <div class="wrap">
      <div class="logo-box">
        <img class="logo" src="../../assets/logo.png"/>
        <p class="agree">{{ $t('login.authTip2') }}</p>
      </div>
      <div class="field">
        <div
          class="field-item"
          :class="{ 'filed-active': currentArea.id }">
          <p class="field-label">{{ $t('login.authBindArea') }}</p>
          <div class="field-box">
            <p
              class="placeholder"
              :class="{ 'active': currentArea.id }"
              @click="areaShow = true">{{ currentArea.name }}</p>
            <van-icon
              name="arrow-down"
              class="arrow-down-icon"/>
          </div>
        </div>
        <p v-show="areaErr" class="error-tip">{{ areaErr }}</p>
        <div class="field-item pdt70" :class="{ 'filed-active': verifyCode }">
          <p class="field-label">{{ $t('login.authVerify') }}</p>
          <div class="field-box">
            <input
              v-model="verifyCode"
              type="text"
              maxlength="20"
              :placeholder="$t('login.authVerifyPlaceholder')"/>
          </div>
        </div>
        <p v-show="verifyCodeErr" class="error-tip">{{ verifyCodeErr }}</p>
        <p class="info-tip">{{ $t('login.authTip3') }}</p>
      </div>
      <div>
        <van-button
          class="bind-btn"
          @click="bind"
          :disabled="loading">{{ $t('login.authBind') }}</van-button>
      </div>
    </div>
    <!--选择家庭弹窗-->
    <van-popup
      v-model="areaShow"
      round
      position="bottom"
      class="area-poup">
      <div class="area-wrap">
        <div class="top-box">
          <p class="title">{{ $t('login.authBindArea') }}</p>
          <van-icon
            name="cross"
            class="close-icon"
            @click="closePoup"/>
        </div>
        <van-radio-group
          v-model="activeArea">
          <van-cell-group>
            <van-cell
              v-for="area in areaList"
              :key="area.id"
              clickable>
              <template #title>
                <p class="title" :class="{ 'active': activeArea === area.id }">
                  <span class="name one-line float-l">
                    <van-icon name="wap-home-o" class="home-icon"/>
                    {{ area.name }}<span v-if="area.isBind">{{ $t('login.authBinded') }}</span>
                  </span>
                </p>
              </template>
              <template
                v-if="!area.isBind"
                #right-icon>
                <van-radio
                  :name="area.id"
                  @click="areaChange(area)">
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
  </div>
</template>
<script>
const activeIcon = require('@/assets/check-icon.png')
const inactiveIcon = require('@/assets/uncheck-icon.png')

export default {
  name: 'bind',
  data() {
    return {
      verifyCode: '',
      verifyCodeErr: '',
      loading: false,
      params: {},
      activeIcon,
      inactiveIcon,
      areaShow: false,
      activeArea: -1,
      areaErr: '',
      currentArea: {
        id: 0,
        name: this.$t('login.authBindPlaceholder')
      },
      areaList: []
    }
  },
  methods: {
    backStep() {
      this.$router.go(-1)
    },
    // 关闭poup弹窗
    closePoup() {
      this.areaShow = false
    },
    // 获取家庭列表
    initAreaList() {
      this.http.getScAreaList().then((res) => {
        if (res.status !== 0) {
          return
        }
        this.areaList = res.data.areas.map((item) => {
          // 处理是否被绑定
          if (item.cloud_map) {
            item.isBind = item.cloud_map['xiaodu.baidu.com']
          } else {
            item.isBind = false
          }
          return item
        })
        console.log(this.areaList)
      })
    },
    // 选择家庭列表
    areaChange(area) {
      this.currentArea = area
      this.closePoup()
    },
    // 登录前端认证
    verify() {
      if (!this.currentArea.id) {
        this.areaErr = this.$t('login.authBindPlaceholder')
        return false
      }
      this.areaErr = ''
      const verifyCode = this.verifyCode.trim()
      if (verifyCode === '') {
        this.verifyCodeErr = this.$t('login.authVerifyPlaceholder')
        return false
      }
      this.verifyCodeErr = ''
      return true
    },
    // 登录
    bind() {
      if (!this.verify()) {
        return
      }
      // 模拟发送登录请求
      this.loading = true
      this.params.area_id = this.currentArea.id
      this.params.code = this.verifyCode
      this.http.thirdBind(this.params).then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        const { redirect_uri: redirectUrl } = res.data
        if (redirectUrl) {
          window.location.href = redirectUrl
        }
      }).catch(() => {
        this.loading = false
      })
    },
    // 浏览器地址转化
    getUrlParams(url) {
      if (url.indexOf('?') === -1) {
        return {}
      }
      const str = url.substr(url.indexOf('?') + 1)
      const obj = {}
      const arr = str.split('&')
      arr.forEach((item) => {
        const param = item.split('=')
        const [key, value] = param
        obj[key] = decodeURIComponent(value)
      })
      return obj
    }
  },
  created() {
    // 获取device_id参数
    const { search, href } = window.location
    const params = search ? this.getUrlParams(search) : this.getUrlParams(href)
    this.params = params
    // 初始化家庭列表
    this.initAreaList()
  }
}
</script>
<style lang="scss" scoped>
.pdt70 {
  padding-top: 0.7rem;
}
.back {
  font-size: 0.36rem;
  color: #3F4663;
  padding: 0.2rem 0.34rem;
}
.step-box {
  display: flex;
  justify-content: center;
  .line {
    width: 1rem;
    height: 1PX;
    background: #94a5be;
    opacity: 0.5;
    margin: 0.18rem 0.13rem 0 0;
  }
}
.step-item {
  text-align: center;
  opacity: 0.5;
  div {
    width: 0.36rem;
    height: 0.36rem;
    background: #94a5be;
    border-radius: 50%;
    margin: 0 auto;
    font-size: 0.24rem;
    color: #fff;
    line-height: 0.36rem;
  }
  p {
    padding-top: 0.13rem;
    font-size: 0.24rem;
    color: #94a5be;
  }
}
.step-active {
  opacity: 1;
  div {
    position: relative;
    background: #2da3f6;
  }
  p {
    color: #3f4663;
  }
}
.step-active div:after {
  position: absolute;
  top: -0.05rem;
  left: -0.05rem;
  content: "";
  width: 0.46rem;
  height: 0.46rem;
  background: #2da3f6;
  opacity: 0.2;
  border-radius: 50%;
}
.wrap {
  padding: 0 1rem;
  background: #fff;
}
.logo-box {
  padding-top: 1.4rem;
  text-align: center;
}
.logo {
  width: 2.24rem;
  height: 0.81rem;
}
.field {
  position: relative;
  padding: 1.18rem 0;
}
.field-item {
  position: relative;
  border-bottom: 0.01rem solid #ccc;
}
.field-box {
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 0.2rem 0;
  font-weight: bold;
  color: #3F4663;
  .left-label {
    font-size: 0.28rem;
    font-weight: bold;
  }
  .left-label:after {
    display: inline-block;
    content: "";
    width: 0.01rem;
    height: 0.26rem;
    background: #ccc;
    margin-left: 0.3rem;
  }
  input {
    width: 100%;
    flex: 1;
    font-size: 0.48rem;
  }
}
.placeholder {
  flex: 1;
  font-size: 0.28rem;
  color: #94a5be;
}
.active {
  font-size: 0.36rem;
  font-weight: bold;
  color: #3f4663;
}
.arrow-down-icon {
  color: #94a5be;
}
.has-label {
  padding: 0 0.3rem;
}
.error-tip {
  padding-top: 0.2rem;
  color: #FF0000;
}
.field-label {
  font-weight: bold;
  font-size: 0.28rem;
  color: #94A5BE;
}
.filed-active {
  border-color: #3F4663;
}
.field input::-webkit-input-placeholder {
  font-weight: normal;
  font-size: 0.28rem;
  color: #94A5BE;
}
.bind-btn {
  width: 100%;
  height: 1rem;
  background: #2DA3F6;
  border-radius: 0.08rem;
  font-weight: bold;
  color: #FFFFFF;
}
.agree {
  padding-top: 0.2rem;
  font-size: 0.22rem;
  color: #94A5BE;
  text-align: center;
}
.info-tip {
  padding-top: 0.2rem;
  font-size: 0.22rem;
  color: #94A5BE;
  line-height: 1.5;
}
.area-poup {
  height: 8rem;
  .img-icon {
    width: 0.38rem;
    height: 0.38rem;
  }
  .top-box {
    padding: 0.34rem;
    .title {
      font-size: 0.32rem;
      font-weight: bold;
      color: #3f4663;
    }
    .close-icon {
      position: absolute;
      top: 0.3rem;
      right: 0.3rem;
      font-size: 0.2rem;
      font-weight: bold;
      color: #3f4663;
    }
  }
  .home-icon {
    font-size: 0.36rem;
    margin-right: 0.25rem;
    vertical-align: sub;
  }
  .title {
    font-size: 0.28rem;
    color: #94A5BE;
  }
  .active {
    color: #2DA3F6;
  }
}
</style>
