<template>
  <div class="owner">
    <div class="header" @click="toUser">
      <van-skeleton
        avatar
        :row="1"
        avatar-shape="square"
        avatar-size="1.2rem"
        :loading="loading">
        <div class="user-info">
          <van-image
            :src="headerImg"
            fit="cover"
            class="user-header"
            @error="setDefaultHeader"/>
          <span class="user-phone">{{ ownInfo.nickname }}</span>
          <van-icon name="arrow" class="right-icon"/>
        </div>
      </van-skeleton>
    </div>
    <div class="scroll-box">
      <div class="brand-item" @click="toAreaDetail">
        <img src="../../assets/home-icon.png" class="icon-img"/>
        <span>{{ $t('owner.position') }}</span>
        <van-icon name="arrow" class="right-icon"/>
      </div>
      <div class="brand-item" @click="toPan" v-if="wangpan">
        <img src="../../assets/zhiting-pan-icon.png" class="icon-img"/>
        <span>{{ $t('owner.pan') }}</span>
        <van-icon name="arrow" class="right-icon"/>
      </div>
      <div v-if="crm" class="brand-item" @click="toCrm">
        <img src="../../assets/crm-icon.png" class="icon-img"/>
        <span>{{ $t('owner.customerManagement') }}</span>
        <van-icon name="arrow" class="right-icon"/>
      </div>
      <div v-if="scm" class="brand-item" @click="toScm">
        <img src="../../assets/scm-icon.png" class="icon-img"/>
        <span>{{ $t('owner.scmManagement') }}</span>
        <van-icon name="arrow" class="right-icon"/>
      </div>
      <div class="brand-item" @click="toSupport">
        <img src="../../assets/brand-icon.png" class="icon-img"/>
        <span>{{ $t('owner.support') }}</span>
        <van-icon name="arrow" class="right-icon"/>
      </div>
      <div class="brand-item" @click="toThirdPlatform">
        <img src="../../assets/third-icon.png" class="icon-img"/>
        <span>{{ $t('owner.platform') }}</span>
        <van-icon name="arrow" class="right-icon"/>
      </div>
      <div class="brand-item" @click="sceneShow = true" v-if="false">
        <img src="../../assets/lang-icon.png" class="icon-img"/>
        <span>{{ $t('owner.lang') }}</span>
        <van-icon name="arrow" class="right-icon"/>
      </div>
      <div class="brand-item" @click="toExperience()">
        <img src="../../assets/experience-icon.png" class="icon-img"/>
        <span>{{ $t('owner.experience') }}</span>
        <van-icon name="arrow" class="right-icon"/>
      </div>
      <div class="brand-item" @click="protocol">
        <img src="../../assets/shield-icon.png" class="icon-img"/>
        <span>{{ $t('owner.protocol') }}</span>
        <van-icon name="arrow" class="right-icon"/>
      </div>
    </div>
    <!-- 语言切换 -->
    <div class="lang-part">
      <van-action-sheet
        v-model="sceneShow"
        :title="$t('owner.sheetTitle')">
        <div class="lang-wrap">
          <van-radio-group
            v-model="activeLang">
            <van-cell-group>
              <van-cell
                v-for="lang in langList"
                :key="lang.lang"
                clickable
                @click="langChange(lang)">
                <template #title>
                  <p class="lang-title" :class="{ 'lang-active': activeLang === lang.lang }">
                    <span class="lang-name one-line float-l">
                      {{ lang.name }}
                    </span>
                  </p>
                </template>
                <template #right-icon>
                  <van-radio :name="lang.lang" checked-color="#2DA3F6"/>
                </template>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </div>
      </van-action-sheet>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

const defaultHeader = require('../../assets/default-header.png')

export default {
  name: 'owner',
  data() {
    return {
      checked: true,
      headerImg: '',
      loading: false,
      sceneShow: false,
      activeLang: 'zh',
      ownInfo: {},
      wangpan: false,
      crm: false,
      scm: false
    }
  },
  computed: {
    ...mapGetters(['isApp', 'area', 'userInfo', 'token']),
    langList() {
      return [
        {
          lang: 'zh',
          name: this.$t('owner.zh')
        },
        {
          lang: 'en',
          name: this.$t('owner.en')
        }
      ]
    }
  },
  methods: {
    setDefaultHeader() {
      this.headerImg = defaultHeader
    },
    // 切换语言
    langChange(lang) {
      this.activeLang = lang.lang
      this.$i18n.locale = this.activeLang
      this.$methods.setStore('lang', this.activeLang)
      this.sceneShow = false
    },
    // 获取用户信息
    getUserInfo() {
      this.loading = true
      const userId = this.userInfo.user_id
      this.http.getUserDetail(userId).then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        this.ownInfo = res.data
        this.headerImg = res.data.avatar_url
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取扩展列表信息
    getExtensions() {
      this.http.extensions().then((res) => {
        if (res.status !== 0) {
          return
        }
        if (res.data.extension_names.includes('wangpan')) {
          this.wangpan = true
        }
        if (res.data.extension_names.includes('crm')) {
          this.crm = true
        }
        if (res.data.extension_names.includes('scm')) {
          this.scm = true
        }
      })
    },
    toUser() {
      const userId = this.userInfo.user_id
      this.$router.push({
        name: 'user',
        query: {
          userId
        }
      })
    },
    toAreaDetail() {
      this.$router.push({
        name: 'areaDetail'
      })
    },
    // 智汀网盘
    toPan() {
      // 智汀网盘地址，目前暂时写本地地址
      const lang = this.$methods.getStore('lang')
      const { protocol, hostname } = window.location
      console.log(protocol, hostname)
      const href = `${protocol}//${hostname}:9020/wangpan/#/?from=zhiting&lang=${lang}`
      if (this.isApp) {
        window.location.href = href
      } else {
        window.open(href, '_blank')
      }
    },
    // crm
    toCrm() {
      // 智汀crm地址，目前暂时写本地地址
      const { origin } = window.location
      const href = `${origin}/crm/#/?crmToken=${this.token}` // https://sa248.zhitingtech.com:9091
      window.open(href, '_blank')
    },
    // scm
    toScm() {
      // 智汀网盘地址，目前暂时写本地地址
      const { origin } = window.location
      const href = `${origin}/scm/#/?scmToken=${this.token}`
      window.open(href, '_blank')
    },
    toSupport() {
      this.$router.push({
        name: 'brandSupport',
        query: {
          type: 'system'
        }
      })
    },
    toThirdPlatform() {
      this.$router.push({
        name: 'thirdPlatform'
      })
    },
    toExperience() {
      this.$router.push({
        name: 'experienceCenter'
      })
    },
    // 跳转体验中心
    experience() {
      this.$router.push({
        name: 'experience'
      })
    },
    // 跳转用户协议
    protocol() {
      this.$router.push({
        name: 'protocol'
      })
    }
  },
  created() {
    this.getExtensions()
    this.activeLang = this.$methods.getStore('lang') || 'zh'
    this.getUserInfo()
  }
}
</script>
<style lang="scss" scoped>
.owner {
  min-height: calc(100vh - 1rem);
  background: $bgColor;
}
.header {
  padding: 0.6rem 0.3rem;
  background: #fff;
  margin-bottom: 0.2rem;
}
.user-info {
  display: flex;
  align-items: center;
}
.user-header {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 0.27rem;
}
.user-phone {
  flex: 1;
  font-size: 0.4rem;
  font-weight: bold;
  color: #3F4663;
}
.brand-item {
  display: flex;
  align-items: center;
  padding: 0.45rem 0.4rem;
  background: #fff;
  margin-top: 1px;
  span {
    width: 6.04rem;
    font-size: 0.28rem;
    font-weight: bold;
    color: #3F4663;
  }
}
.icon-img {
  height: 0.3rem;
  margin-right: 0.2rem;
}
.lang-wrap {
  height: 50vh;
}
</style>
