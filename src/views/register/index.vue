<template>
  <div>
    <div class="back">
      <van-icon
        name="arrow-left"
        size="0.3rem"
        color="#3F4663"
        @click="backStep"/>
    </div>
    <div class="wrap">
      <p class="word">{{ $t('register.title') }}</p>
      <div class="field">
        <div class="field-item" :class="{ 'filed-active': phone }">
          <p class="field-label">{{ $t('register.phone') }}</p>
          <div class="field-box">
            <span class="left-label">+86</span>
            <input
              v-model="phone"
              type="number"
              class="has-label"
              :placeholder="$t('register.phonePlaceHolder')"/>
          </div>
          <p class="error-tip">{{ phoneErr }}</p>
        </div>
        <div class="field-item pdt70" :class="{ 'filed-active': password }">
          <p class="field-label">{{ $t('register.password') }}</p>
          <div class="field-box">
            <input
              v-model="password"
              class="has-icon"
              :type="type"
              maxlength="20"
              :placeholder="$t('register.passwordPlaceHolder')"/>
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
            <p class="error-tip">{{ passwordErr }}</p>
          </div>
        </div>
        <div class="field-item pdt70" :class="{ 'filed-active': verifyCode }">
          <p class="field-label">{{ $t('register.verifyCode') }}</p>
          <div class="field-box">
            <input
              v-model="verifyCode"
              class="has-icon"
              type="text"
              maxlength="6"
              :placeholder="$t('register.verifyCodePlaceHolder')"/>
            <div class="right-btn">
              <span
                v-if="!isCutting"
                :class="{ 'gray': !phone }"
                @click="getVerifyCode">{{ $t('register.getVerifyCode') }}</span>
              <span v-else class="gray">{{ cutTime }}{{ $t('register.cutdoown') }}</span>
            </div>
          </div>
          <p class="error-tip">{{ verifyCodeErr }}</p>
        </div>
      </div>
      <div>
        <van-button
          :disabled="!canSubmit"
          class="login-btn"
          @click="register">{{ $t('global.finish') }}</van-button>
      </div>
    </div>
    <!-- 登录弹窗 -->
    <van-dialog
      v-model="loginShow"
      show-cancel-button
      @confirm="toLogin"
      confirm-button-color="#2DA3F6"
      cancel-button-color="#94A5BE"
      confirmButtonText="$t('register.login')">
      <p class="login-title">{{ $t('register.tipTitle') }}</p>
    </van-dialog>
  </div>
</template>
<script>
export default {
  name: 'login',
  data() {
    return {
      phone: '',
      password: '',
      verifyCode: '',
      isPassWordShow: false,
      cutTime: 120,
      timer: null,
      isCutting: false,
      phoneErr: '', // 手机错误信息
      passwordErr: '', // 密码错误信息
      verifyCodeErr: '', // 验证码错误提示
      loginShow: false // 登录弹窗控制
    }
  },
  computed: {
    type() {
      return this.isPassWordShow ? 'text' : 'password'
    },
    canSubmit() {
      return (
        this.phone !== ''
        && this.password !== ''
        && this.verifyCode !== ''
      )
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
    // 去登录页
    toLogin() {
      this.$router.push({
        name: 'login',
        query: {
          account: this.phone
        }
      })
    },
    // 判断手机
    verifyPhone() {
      const phone = this.phone.trim()
      if (!this.$methods.isPhone(phone)) {
        this.phoneErr = this.$t('register.phoneError')
        return false
      }
      this.phoneErr = ''
      return true
    },
    // 判断密码
    verifyPassword() {
      const { password } = this
      if (password === '') {
        this.passwordErr = this.$t('register.passwordEmpty')
        return false
      }
      if (!this.$methods.isPassWord(password)) {
        this.passwordErr = this.$t('register.passwordError')
        return false
      }
      return true
    },
    // 获取验证码
    getVerifyCode() {
      const { phone } = this
      if (phone === '') {
        return
      }
      if (!this.verifyPhone()) {
        return
      }
      this.cutTime = 120
      this.isCutting = true
      this.timer = setInterval(() => {
        this.cutTime = this.cutTime - 1
        if (this.cutTime <= 0) {
          this.isCutting = false
          clearInterval(this.timer)
        }
      }, 998)
    },
    // 注册
    register() {
      if (!this.verifyPhone()) {
        return
      }
      if (!this.verifyPassword()) {
        return
      }
      this.$dialog('认证成功')
    }
  }
}
</script>
<style lang="scss" scoped>
.pdt70 {
  padding-top: 0.7rem;
}
.back {
  padding: 0.2rem 0.34rem;
}
.wrap {
  padding: 0 1rem;
  background: #fff;
}
.word {
  padding-top: 0.4rem;
  text-align: center;
  font-size: 0.4rem;
  color: #3F4663;
}
.field {
  position: relative;
  padding: 1.18rem 0;
}
.field-item {
  position: relative;
  border-bottom: 0.01rem solid #ccc;
}
.field-label {
  font-weight: bold;
  font-size: 0.28rem;
  color: #94A5BE;
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
.error-tip {
  position: absolute;
  left: 0;
  bottom: -0.5rem;
  color: #FF0000;
}
.has-label {
  padding: 0 0.3rem;
}
.has-icon {
  padding-right: 0.4rem;
}
.right-btn {
  color: #2DA3F6;
  .gray {
    color: #94A5BE;
  }
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
.link-box {
  padding-top: 0.4rem;
  span {
    font-weight: bold;
    color: #3F4663;
  }
}
.agree {
  padding-top: 1.7rem;
  font-size: 0.22rem;
  color: #94A5BE;
  text-align: center;
}
.login-title {
  padding: 0.53rem 0.3rem;
  text-align: center;
  font-size: 0.28rem;
  font-weight: bold;
  color: #3F4663;
}
</style>
