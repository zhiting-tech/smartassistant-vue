<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view v-if="isReady"></router-view>
    </transition>
    <!--loading模块-->
    <Loading v-if="!isReady"></Loading>
    <van-tabbar
      v-show="isShowNav"
      v-model="active"
      active-color="#2DA3F6"
      inactive-color="#CFD6E0"
      :placeholder="true"
      @change="menuChange">
      <van-tabbar-item icon="home-o" name="device">
        <span>{{ $t('global.home') }}</span>
        <template #icon="props">
          <img :src="props.active ? homeIcon.active : homeIcon.inactive" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item icon="scene-o" name="scene">
        <span>{{ $t('global.scene') }}</span>
        <template #icon="props">
          <img :src="props.active ? sceneIcon.active : sceneIcon.inactive" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item icon="user-o" name="owner">
        <span>{{ $t('global.mine') }}</span>
        <template #icon="props">
          <img :src="props.active ? ownIcon.active : ownIcon.inactive" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Socket from 'ws-plugin'
import { getRemote } from '../config/index'

const homeIconActive = require('./assets/home-active.png')
const homeIcon = require('./assets/home.png')
const ownIconActive = require('./assets/owner-active.png')
const ownIcon = require('./assets/owner.png')
const sceneIconActive = require('./assets/scene-active.png')
const sceneIcon = require('./assets/scene.png')

export default {
  data() {
    return {
      active: 'device',
      ws: null,
      isAreaReady: false,
      isPermissionReady: false,
      isWsReady: false,
      homeIcon: {
        active: homeIconActive,
        inactive: homeIcon
      },
      sceneIcon: {
        active: sceneIconActive,
        inactive: sceneIcon
      },
      ownIcon: {
        active: ownIconActive,
        inactive: ownIcon
      }
    }
  },
  computed: {
    ...mapGetters(['token', 'userInfo']),
    isShowNav() {
      const whiteList = ['device', 'scene', 'owner']
      const { name } = this.$route
      return whiteList.includes(name)
    },
    isReady() {
      return this.isAreaReady && this.isPermissionReady && this.isWsReady
    }
  },
  watch: {
    $route(to) {
      this.active = to.name
      // 登录拦截
      if (!this.token) {
        this.LoginFilter()
      }
    },
    token(val) {
      // 换账号登录
      if (val) {
        this.initData()
      }
    }
  },
  methods: {
    ...mapActions([
      'setWebsocket',
      'setArea',
      'setToken',
      'setUserInfo',
      'setPermissions',
      'setIsApp',
      'setIsInsert']),
    menuChange(menu) {
      if (menu === 'device') {
        this.$router.push({
          name: 'device'
        })
      } else if (menu === 'scene') {
        this.$router.push({
          name: 'scene'
        })
      } else if (menu === 'owner') {
        this.$router.push({
          name: 'owner'
        })
      }
    },
    // 切换用户初始化数据
    initData() {
      this.getArea()
      this.getUserInfo()
      this.createWebsocket()
    },
    // 获取家庭id
    getArea() {
      this.isAreaReady = false
      this.http.getAreaList().then((res) => {
        this.isAreaReady = true
        if (res.status !== 0) {
          return
        }
        const { areas } = res.data
        const area = areas.length ? areas[0] : {}
        this.setArea(area)
      }).catch(() => {
        this.isAreaReady = true
      })
    },
    // 登录拦截
    LoginFilter() {
      // 不需要登录的白名单
      const whiteList = [
        'thirdPlatform',
        'thirdExplain',
        'professionLogin',
        'authStepOne',
        'authStepTwo',
        'outLineHelp'
      ]
      if (whiteList.includes(this.$route.name)) {
        this.isAreaReady = true
        this.isPermissionReady = true
        this.isWsReady = true
        return
      }
      const token = this.$methods.getStore('token')
      const userId = this.$methods.getStore('userId')
      if (token && userId) {
        const userInfo = {
          user_id: userId
        }
        this.setUserInfo(userInfo)
        this.setToken(token)
      } else {
        this.isAreaReady = true
        this.isPermissionReady = true
        this.isWsReady = true
        // 需要登录的页面就拦截
        const backUrl = window.location.href
        this.$router.replace({
          name: 'professionLogin',
          query: {
            backUrl
          }
        })
      }
    },
    // 获取用户信息
    getUserInfo() {
      const userId = this.userInfo.user_id
      this.isPermissionReady = false
      this.http.getUserDetail(userId).then((res) => {
        if (res.status !== 0) {
          this.isPermissionReady = true
          return
        }
        const userInfo = {
          user_id: res.data.user_id,
          nickname: res.data.nickname,
          is_owner: res.data.is_owner,
          area_type: res.data.area.area_type
        }
        this.setUserInfo(userInfo)
        this.getUserPerimssion(userInfo.user_id)
      }).catch(() => {
        this.isPermissionReady = true
      })
    },
    // 获取用户权限
    getUserPerimssion(userId) {
      if (!userId) {
        return
      }
      this.http.getRolePermission(userId).then((res) => {
        this.isPermissionReady = true
        if (res.status !== 0) {
          return
        }
        const { permissions } = res.data
        this.setPermissions(permissions)
      }).catch(() => {
        this.isPermissionReady = true
      })
    },
    // 创建一个websocket
    createWebsocket() {
      // 测试建立一个websocket，保存全局的ws对象
      this.isWsReady = false
      this.ws = new Socket({
        url: `${getRemote()}?token=${this.token}`
      })
      this.setWebsocket(this.ws)
      setTimeout(() => {
        this.isWsReady = true
      })
    },
    // 浏览器地址转化
    getUrlParams(url) {
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
  mounted() {
    // 注册全局方法
    this.$bus.$on('updatePermission', this.getUserPerimssion)
    this.active = this.$route.name
  },
  created() {
    const { href } = window.location
    const params = this.getUrlParams(href)
    // 初始化语言
    const lang = this.$methods.getStore('lang')
    if (lang) {
      this.$i18n.locale = lang
    } else {
      // 默认设置中文
      this.$methods.setStore('lang', 'zh')
    }
    // app内嵌入
    if (this.$methods.isApp()) {
      this.setIsApp(true)
      // 异步执行
      zhiting.invoke('getUserInfo', {}, (res) => {
        const { token, userId } = res
        // 设置全局user_id 和 token
        const userInfo = {
          user_id: userId
        }
        this.setUserInfo(userInfo)
        if (token) {
          this.setToken(token)
          this.initData()
        }
      })
    } else if (params.from === 'demo') {
      // 写死一个token
      this.setToken('MTYyMjE2ODMxMHxOd3dBTkVKRVVsRlpTRFpEVDBwT1NFTkNOa0ZSVDAxWVFWcEtNMFpLVGs1Q1VGWXpOakpUVUVNeU1rRlVOa2hWTTFoRlZqZEdUa0U9fKGXhfMJH44wwjtFn-gHdWE_A6-WiDtaLODGsmLfDUIV')
      const userInfo = {
        user_id: 2
      }
      this.setIsInsert(true)
      // this.LoginFilter()
      this.setUserInfo(userInfo)
      this.initData()
    } else {
      // 判断登录 分为app内嵌 和 浏览器登录
      this.LoginFilter()
    }
  }
}
</script>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-avtive {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
