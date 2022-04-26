<template>
  <div class="wrap-box">
    <div class="back clearfix">
      <van-icon
        class="float-l"
        name="arrow-left"
        size="0.3rem"
        color="#3F4663"
        @click="backStep"/>
    </div>
    <div class="wrap">
      <div class="logo-box">
        <div>
          <div class="p-logo">
            {{ $t('login.profession') }}
          </div>
        </div>
        <img class="logo" src="../../assets/logo.png"/>
      </div>
      <div class="field">
        <div class="field-item" :class="{ 'filed-active': account }">
          <p class="field-label">{{ $t('login.account') }}</p>
          <div class="field-box">
            <input
              v-model="account"
              :placeholder="$t('login.accountPlaceholder')"/>
          </div>
          <p class="error-tip">{{ accountErr }}</p>
        </div>
        <div class="field-item pdt70" :class="{ 'filed-active': password }">
          <p class="field-label">{{ $t('login.password') }}</p>
          <div class="field-box">
            <input
              v-model="password"
              class="has-icon"
              :type="type"
              maxlength="20"
              :placeholder="$t('login.passwordEmptyTip')"/>
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
          :disabled="loading">{{ $t('login.login') }}</van-button>
      </div>
    </div>
    <div class="protocol">
      <van-checkbox icon-size=".28rem" v-model="checked">{{$t('login.checkedText')}}</van-checkbox>
      <a href="javascript:;" @click="goAgreement('/smartassitant/protocol/user/')">{{$t('login.agreementUser')}}</a>、
      <a href="javascript:;" @click="goAgreement('/smartassitant/protocol/privacy/')">{{$t('login.agreementPrivacy')}}</a>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { envOrigin } from '@/config'

export default {
  name: 'login',
  data() {
    return {
      isPassWordShow: false,
      account: '',
      password: '',
      accountErr: '',
      passwordErr: '',
      loading: false,
      params: {},
      checked: false
    }
  },
  computed: {
    type() {
      return this.isPassWordShow ? 'text' : 'password'
    }
  },
  watch: {
    account(val) {
      if (val.length > 11) {
        this.account = val.slice(0, 11)
      }
      if (val.trim()) {
        this.accountErr = ''
      }
    },
    password(val) {
      if (val.trim()) {
        this.passwordErr = ''
      }
    }
  },
  methods: {
    ...mapActions(['setToken', 'setUserInfo']),
    backStep() {
      this.$router.go(-1)
    },
    // 登录前端认证
    verify() {
      const account = this.account.trim()
      const password = this.password.trim()
      if (account === '') {
        this.accountErr = this.$t('login.accountPlaceholder')
        return false
      }
      this.accountErr = ''
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
      if (!this.checked) {
        this.$toast(this.$t('login.protocol'))
        return
      }
      // 模拟发送登录请求
      this.loading = true
      const params = {
        grant_type: 'password',
        account_name: this.account,
        password: this.password
      }
      this.http.authLogin(params).then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        const { user_id: userId } = res.data.user_info
        const { access_token: token, refresh_token: refreshToken } = res.data.token_info
        this.$methods.setStore('token', token)
        this.$methods.setStore('refreshToken', refreshToken)
        this.$methods.setStore('userId', userId)
        this.setToken(token)
        this.setUserInfo(res.data.user_info)
        this.$toast(this.$t('login.success'))
        const { backUrl } = this.$route.query
        if (backUrl) {
          window.location.replace(backUrl)
        } else {
          this.$router.replace({
            name: 'device'
          })
        }
      }).catch(() => {
        this.loading = false
      })
    },
    goAgreement(url) {
      const target = `${envOrigin}${url}`
      window.open(target, '_blank')
    }
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
  text-align: center;
  padding: 0.2rem 0.34rem;
}
.wrap-box{
  min-height: 100vh;
  padding-bottom: 1rem;
  position: relative;
}
.wrap {
  padding: 0 1rem;
  background: #fff;
}
.logo-box {
  padding-top: 0.6rem;
  text-align: center;
}
.p-logo {
  display: inline-block;
  padding: 0 0.2rem;
  height: 0.48rem;
  border: 1PX solid #2DA3F6;
  border-radius: 0.24rem;
  margin: 0 auto 1rem auto;
  color: #2DA3F6;
  line-height: 0.48rem;
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
.protocol{
  position: absolute;
  padding: 0 .2rem;
  bottom: .3rem;
  left: 0;
  width: 100%;
  font-size: .22rem;
  color: #94A5BE;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  a {
    color: #2DA3F6;
  }
}
</style>
<style scoped>
  .protocol >>> .van-checkbox__label{
    color: #94A5BE;
  }
</style>
