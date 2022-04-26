<template>
  <div class="user">
    <van-nav-bar
      :title="$t('user.title')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
    </van-nav-bar>
    <!--loading模块-->
    <Loading v-if="loading"></Loading>
    <template v-else>
      <div class="user-list">
        <div class="user-item clearfix">
          <span class="user-item--name">{{ $t('user.picture') }}</span>
          <van-image
            :src="headerImg"
            class="user-item--img float-r"
            @error="setDefaultHeader"/>
        </div>
        <div class="user-item clearfix" @click="show = true">
          <span class="user-item--name">{{ $t('user.nickname') }}</span>
          <p class="user-item--right">
            <span class="text-over one-line">{{ userName }}</span>
            <van-icon class="right-icon" name="arrow"/>
          </p>
        </div>
      </div>
      <div v-if="!isApp && !isInsert" class="quit-btn-placeholder">
        <div class="quit-btn-box">
          <button class="quit-btn" @click="logout">
            退出登录
          </button>
        </div>
      </div>
    </template>
    <!--修改名称弹窗-->
    <NameSheet
      v-model="show"
      :title="$t('user.nickname')"
      :init="userName"
      :loading="nameLoading"
      @on-confirm="editName"/>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import NameSheet from '@/components/NameSheet.vue'

const defaultHeader = require('../../assets/default-header.png')

export default {
  name: 'user',
  components: {
    NameSheet
  },
  data() {
    return {
      headerImg: '',
      userName: '',
      show: false,
      nameLoading: false,
      loading: false,
      userId: ''
    }
  },
  computed: {
    ...mapGetters(['isApp', 'websocket', 'isInsert'])
  },
  methods: {
    ...mapActions(['setToken']),
    onClickLeft() {
      this.$router.go(-1)
    },
    setDefaultHeader() {
      this.headerImg = defaultHeader
    },
    // 退出登录
    logout() {
      this.websocket.destroy()
      this.$toast('退出成功')
      this.$methods.setStore('token', '')
      this.setToken('')
      this.$methods.setStore('refreshToken', '')
      this.$router.replace({
        name: 'professionLogin'
      })
    },
    // 获取用户信息
    getUserInfo() {
      this.loading = true
      this.http.getUserDetail(this.userId).then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        this.userName = res.data.nickname
      }).catch(() => {
        this.loading = false
      })
    },
    editName(name) {
      const userName = name.trim()
      if (userName === '') {
        this.$toast(this.$t('user.empty'))
        return
      }
      if (userName.length < 6) {
        this.$toast(this.$t('user.lessErr'))
        return
      }
      if (userName.length > 20) {
        this.$toast(this.$t('user.moreErr'))
        return
      }
      this.nameLoading = true
      const params = {
        nickname: userName
      }
      this.http.editUser(this.userId, params).then((res) => {
        this.nameLoading = false
        if (res.status !== 0) {
          return
        }
        this.userName = name
        this.show = false
        this.$toast(this.$t('global.saveSuccess'))
      }).catch(() => {
        this.nameLoading = false
      })
    }
  },
  created() {
    const { userId } = this.$route.query
    this.userId = userId
    this.getUserInfo()
  }
}
</script>
<style lang="scss" scoped>
.user {
  min-height: 100vh;
  background: $bgColor;
}
.user-list {
  margin-top: 1PX;
}
.user-item {
  display: flex;
  align-items: center;
  line-height: 1.1;
  padding: 0 0.3rem;
  height: 1rem;
  background: #fff;
  border-bottom: 0.01rem solid #eee;
}
.user-item--name {
  flex: 1;
  max-width: 6.5rem;
  font-size: 0.28rem;
  font-weight: bold;
  color: #3F4663;
}
.user-item--img {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  overflow: hidden;
}
.user-item--right {
  color: #94A5BE;
}
.quit-btn-placeholder {
  height: 1.6rem;
}
.quit-btn-box {
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  padding: 0.3rem;
  background: $bgColor;
}
.quit-btn {
  width: 6.9rem;
  height: 1rem;
  background: #fff;
  border-radius: 0.2rem;
  border: 0;
  font-size: 0.28rem;
  color: #FF0000;
}
.text-over {
  display: inline-block;
  max-width: 5rem;
}
.right-icon {
  vertical-align: top;
  margin-left: 0.3rem;
}
</style>
