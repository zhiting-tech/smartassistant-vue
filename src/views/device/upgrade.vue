<template>
  <div class="wrapper">
    <van-nav-bar
      :title="title"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
    </van-nav-bar>
    <div class="software-box">
      <img src="../../assets/software-upgrade.png" class="upgrade-img"/>
      <p class="version">{{ $t('deviceDetail.currentVersion') }}：{{ this.versionInfo.version }}</p>
    </div>
    <div class="upgrade-btn-placeholder">
      <div class="upgrade-btn-box">
        <van-button class="upgrade-btn" @click="handleUpdate">{{ $t('deviceDetail.checkVersion') }}</van-button>
      </div>
    </div>
    <!--更新弹窗-->
    <van-dialog class="update-info-dialog" v-model="checkShow" title="" :showConfirmButton="false">
      <div class="update-info-box">
        <div class="rocket"><img src="../../assets/rocket.png" alt=""></div>
        <h2>检查更新</h2>
        <p class="description">{{ $t('deviceDetail.checkNewVersion') }}{{ versionInfo.latest_version }}，{{ $t('deviceDetail.isUpdate') }}？</p>
        <div class="update-btn">
          <van-button round color="#2da3f6" block :loading="loading" @click="handleConfirm()">{{$t('global.update')}}</van-button>
        </div>
      </div>
      <div v-show="!loading" class="close-btn" @click="checkShow = false">
        <van-icon name="cross" />
      </div>
    </van-dialog>
  </div>
</template>
<script>
export default {
  name: 'softwareUpgrade',
  data() {
    return {
      versionInfo: {},
      checkShow: false,
      loading: false,
      queryData: {
        type: ''
      }
    }
  },
  computed: {
    title() {
      return this.queryData.type === 'software' ? this.$t('deviceDetail.softwareUpgrade') : this.$t('deviceDetail.update')
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    getVersionInfo() {
      if (this.queryData.type === 'software') {
        this.http.getSaVersionInfo().then((res) => {
          if (res.status !== 0) {
            return
          }
          this.versionInfo = res.data
        })
      } else {
        this.http.getFirmwareVersionInfo().then((res) => {
          if (res.status !== 0) {
            return
          }
          this.versionInfo = res.data
        })
      }
    },
    handleUpdate() {
      if (this.queryData.type === 'software') {
        this.http.getSaLatestVersionInfo().then((res) => {
          if (res.status !== 0) {
            return
          }
          if (this.versionInfo.version === res.data.latest_version) {
            this.$toast(this.$t('deviceDetail.latestVersion'))
          } else {
            this.versionInfo = res.data
            this.checkShow = true
          }
        })
      } else {
        this.http.getFirmwareLatestVersionInfo().then((res) => {
          if (res.status !== 0) {
            return
          }
          if (this.versionInfo.version === res.data.latest_version) {
            this.$toast(this.$t('deviceDetail.latestVersion'))
          } else {
            this.versionInfo = res.data
            this.checkShow = true
          }
        })
      }
    },
    handleConfirm() {
      this.loading = true
      // 处理更新
      const params = {
        version: this.versionInfo.latest_version
      }
      if (this.queryData.type === 'software') {
        this.http.updateSaVersion(params).then((res) => {
          if (res.status !== 0) {
            this.$toast(this.$t('global.updateFail'))
            this.checkShow = false
          } else {
            this.updateSuccess()
          }
        }).catch(() => {
          this.checkShow = false
        })
      } else {
        this.http.updateFirmwareVersion(params).then((res) => {
          if (res.status !== 0) {
            this.$toast(this.$t('global.updateFail'))
            this.checkShow = false
          } else {
            this.updateSuccess()
          }
        }).catch(() => {
          this.checkShow = false
        })
      }
    },
    // 恢复成功回调
    updateSuccess() {
      // 轮询调用接口判断sa是否重启成功
      let times = 0
      const timing = setInterval(() => {
        times += 1
        if (times === 10) {
          clearInterval(timing)
          return
        }
        if (this.queryData.type === 'software') {
          this.http.getSaVersionInfo().then((res) => {
            this.loading = false
            if (res.status === 0) {
              this.$toast(this.$t('global.updateSuccess'))
              this.versionInfo = res.data
              this.checkShow = false
              clearInterval(timing)
            }
          }).catch(() => {
            this.loading = true
          })
        } else {
          this.http.getFirmwareVersionInfo().then((res) => {
            this.loading = false
            if (res.status === 0) {
              this.$toast(this.$t('global.updateSuccess'))
              this.versionInfo = res.data
              this.checkShow = false
              clearInterval(timing)
            }
          }).catch(() => {
            this.loading = true
          })
        }
      }, 10000)
    }
  },
  created() {
    const { query } = this.$route
    this.queryData = query || {}
    this.getVersionInfo()
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  background: #fff;
}
.software-box {
  padding-top: 1.1rem;
  text-align: center;
}
.upgrade-img {
  width: 2.43rem;
  height: 2.18rem;
}
.version {
  padding-top: 0.65rem;
  font-size: 0.28rem;
  font-weight: bold;
  color: #3F4663;
}
.upgrade-btn-placeholder {
  height: 1.6rem;
}
.upgrade-btn-box {
  padding: 0.3rem 0;
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
}
.upgrade-btn {
  width: 6.9rem;
  height: 1rem;
  background: #2da3f6;
  border-radius: 0.2rem;
  color: #fff;
}
.content {
  padding: 0.5rem 0.3rem;
  text-align: center;
}
.update-info-dialog{
  background-color: transparent;
}
.update-info-box{
  width: 4.8rem;
  text-align: center;
  background-color: #ffffff;
  margin: 0 auto;
  border-radius: .32rem;
  padding: .3rem 0;
}
.update-info-box .rocket{
  text-align: center;
}
.update-info-box .rocket img{
  width: 2.73rem;
  height: auto;
}
.update-info-box h2{
  font-size: .4rem;
  font-weight: bold;
  color: #3F4663;
  margin: .24rem 0;
}
.update-info-box p{
  font-weight: bold;
  color: #3F4663;
  line-height: .4rem;
  padding: 0 .5rem;
}
.update-info-box .update-btn{
  padding: .2rem .4rem;
}
.close-btn{
  width: .48rem;
  height: .48rem;
  background-color: #ffffff;
  margin: 0 auto;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: .3rem;
  margin-top: .8rem;
}
</style>
