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
          <div class="step-item">
            <div>2</div>
            <p>{{ $t('login.authStep2') }}</p>
          </div>
        </div>
    </div>
    <div class="wrap">
      <div class="logo-box">
        <img class="logo" src="../../assets/logo.png"/>
        <p class="agree">{{ $t('login.authTip') }}</p>
      </div>
      <div class="field">
        <div class="field-item" :class="{ 'filed-active': phone }">
          <p class="field-label">{{ $t('login.phone') }}</p>
          <div class="field-box">
            <span class="left-label">+86</span>
            <input
              v-model="phone"
              type="number"
              class="has-label"
              :placeholder="$t('login.phonePlaceHolder')"/>
          </div>
          <p class="error-tip">{{ phoneErr }}</p>
        </div>
        <div class="field-item pdt70" :class="{ 'filed-active': password }">
          <p class="field-label">{{ $t('login.password') }}</p>
          <div class="field-box">
            <input
              v-model="password"
              class="has-icon"
              :type="type"
              maxlength="20"
              :placeholder="$t('login.passwordPlaceHolder')"/>
            <div class="icon-right">
              <img
                v-show="!isPassWordShow"
                @click="isPassWordShow = !isPassWordShow"
                src="../../assets/eye-open-icon.png"/>
              <img
                v-show="isPassWordShow"
                @click="isPassWordShow = !isPassWordShow"
                src="../../assets/eye-close-icon.png"/>
            </div>
          </div>
          <p class="error-tip">{{ passwordErr }}</p>
        </div>
      </div>
      <div>
        <van-button
          class="login-btn"
          @click="login"
          :disabled="loading">{{ $t('login.auth') }}</van-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'login',
  data() {
    return {
      isPassWordShow: false,
      phone: '',
      password: '',
      phoneErr: '',
      passwordErr: '',
      loading: false,
      params: {}
    }
  },
  computed: {
    type() {
      return this.isPassWordShow ? 'text' : 'password'
    }
  },
  watch: {
    phone(val) {
      if (val.length > 11) {
        this.phone = val.slice(0, 11)
      }
    }
  },
  methods: {
    backStep() {
      this.$router.go(-1)
    },
    // 登录前端认证
    verify() {
      const phone = this.phone.trim()
      const password = this.password.trim()
      if (phone === '') {
        this.phoneErr = this.$t('login.phoneEmptyTip')
        return false
      }
      if (!this.$methods.isPhone(phone)) {
        this.phoneErr = this.$t('login.phoneErr')
        return false
      }
      this.phoneErr = ''
      if (password === '') {
        this.passwordErr = this.$t('login.passwordEmptyTip')
        return false
      }
      this.passwordErr = ''
      return true
    },
    // 登录
    login() {
      if (!this.verify()) {
        return
      }
      // 模拟发送登录请求
      this.loading = true
      const params = {
        phone: this.phone,
        password: this.password
      }
      this.http.thirdLogin(params).then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        this.$router.push({
          name: 'authStepTwo',
          query: this.params
        })
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
.has-label {
  padding: 0 0.3rem;
}
.error-tip {
  position: absolute;
  left: 0;
  bottom: -0.5rem;
  color: #FF0000;
}
.field-label {
  font-weight: bold;
  font-size: 0.28rem;
  color: #94A5BE;
}
.has-icon {
  padding-right: 0.4rem;
}
.filed-active {
  border-color: #3F4663;
}
.field input::-webkit-input-placeholder {
  font-weight: normal;
  font-size: 0.28rem;
  color: #94A5BE;
}
.icon-right {
  position: absolute;
  right: 0;
  bottom: 0.2rem;
  img {
    width: 0.36rem;
  }
}
.login-btn {
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
</style>
