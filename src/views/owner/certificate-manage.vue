<template>
  <div class="wrapper">
    <van-nav-bar
      :title="$t('owner.certificate')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
    </van-nav-bar>
    <div class="content">
      <p class="tip-word">{{ $t('owner.certificateTip') }}</p>
      <div class="set-item">
        <div class="app-icon"></div>
        <div>
          <h3 class="title">{{ $t('owner.certificateAppTitle') }}</h3>
          <p class="desc">{{ $t('owner.certificateAppTip') }}</p>
        </div>
      </div>
      <div class="set-box">
        <div
          v-for="item in setList"
          :key="item.value"
          class="set-item"
          @click="handleSet(item)">
          <div class="left">
            <h3 class="title">{{ item.title }}</h3>
            <p class="desc">{{ item.desc }}</p>
          </div>
          <div
            class="check-icon"
            :class="{ 'checked': item.checked }"></div>
        </div>
      </div>
    </div>
    <div class="content mgt20">
      <div class="set-item">
        <div class="app-icon pan-icon"></div>
        <div>
          <h3 class="title">{{ $t('owner.certificatePanAppTitle') }}</h3>
          <p class="desc">{{ $t('owner.certificatePanAppTip') }}</p>
        </div>
      </div>
      <div class="set-box">
        <div
          v-for="item in panSetList"
          :key="item.value"
          class="set-item"
          @click="handlePanSet(item)">
          <div class="left">
            <h3 class="title">{{ item.title }}</h3>
            <p class="desc">{{ item.desc }}</p>
          </div>
          <div
            class="check-icon"
            :class="{ 'checked': item.checked }"></div>
        </div>
      </div>
    </div>
    <div class="finish-btn-placeholder" v-if="userInfo.is_owner">
      <div class="finish-btn-box">
        <van-button @click="sure" class="finish-btn">{{ $t('global.save') }}</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'powerManage',
  computed: {
    ...mapGetters(['userInfo']),
  },
  data() {
    return {
      setList: [
        {
          value: 1,
          title: this.$t('owner.certificateTitle1'),
          desc: this.$t('owner.certificateDesc1'),
          checked: false
        },
        {
          value: 2,
          title: this.$t('owner.certificateTitle2'),
          desc: this.$t('owner.certificateDesc2'),
          checked: false
        }
      ],
      panSetList: [
        {
          value: 1,
          title: this.$t('owner.panCertificateTitle1'),
          desc: this.$t('owner.panCertificateDesc1'),
          checked: false
        },
        {
          value: 2,
          title: this.$t('owner.panCertificateTitle2'),
          desc: this.$t('owner.panCertificateDesc2'),
          checked: false
        }
      ],
      params: {
        user_credential_found_setting: {
          user_credential_found: false
        },
        get_cloud_disk_credential_setting: {
          get_cloud_disk_credential_setting: true
        }
      }
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    handleSet(set) {
      if (!this.userInfo.is_owner) {
        return
      }
      this.setList.forEach((item) => {
        item.checked = false
      })
      set.checked = true
      if (set.value === 1) {
        this.params.user_credential_found_setting.user_credential_found = true
      } else {
        this.params.user_credential_found_setting.user_credential_found = false
      }
    },
    handlePanSet(set) {
      if (!this.userInfo.is_owner) {
        return
      }
      this.panSetList.forEach((item) => {
        item.checked = false
      })
      set.checked = true
      if (set.value === 1) {
        this.params.get_cloud_disk_credential_setting.get_cloud_disk_credential_setting = true
      } else {
        this.params.get_cloud_disk_credential_setting.get_cloud_disk_credential_setting = false
      }
    },
    getUserCertificate() {
      this.http.getUserCertificate().then((res) => {
        if (res.status !== 0) {
          return
        }
        this.params = res.data || {}
        if (this.params.user_credential_found_setting.user_credential_found) {
          this.setList[0].checked = true
        } else {
          this.setList[1].checked = true
        }
        if (this.params.get_cloud_disk_credential_setting.get_cloud_disk_credential_setting) {
          this.panSetList[0].checked = true
        } else {
          this.panSetList[1].checked = true
        }
      })
    },
    sure() {
      this.http.setUserCertificate(this.params).then((res) => {
        if (res.status !== 0) {
          return
        }
        this.$toast(this.$t('global.saveSuccess'))
        this.onClickLeft()
      })
    }
  },
  created() {
    this.getUserCertificate()
  }
}
</script>
<style lang="scss" scoped>
.mgt20 {
  margin-top: 0.2rem;
}
.tip-word {
  padding: 0.16rem 0.3rem;
  font-size: 0.24rem;
  font-weight: bold;
  color: #94A5be;
  line-height: 1.5;
}
.set-item {
  display: flex;
  align-items: center;
  padding: 0.38rem 0.3rem;
  background: #fff;
  border-bottom: 1PX solid #eee;
  .app-icon {
    width: 0.74rem;
    height: 0.74rem;
    background-size: 100% 100%;
    background-image: url(../../assets/zhiting-power.png);
    margin-right: 0.2rem;
  }
  .pan-icon {
    background-image: url(../../assets/zhiting-pan-power.png);
  }
  .left {
    flex: 1;
  }
  .title {
    padding-bottom: 0.15rem;
    font-size: 0.28rem;
    font-weight: bold;
    color: #3f4663;
  }
  .desc {
    font-size: 0.22rem;
    font-weight: bold;
    color: #94a5be;
    line-height: 1.5;
  }
  .check-icon {
    width: 0.37rem;
    height: 0.37rem;
    background-image: url(../../assets/uncheck-icon.png);
    background-size: 100% 100%;
    margin-left: 0.2rem;
  }
  .checked {
    background-image: url(../../assets/check-icon.png);
  }
}
.finish-btn-placeholder {
  height: 2.2rem;
}
.finish-btn-box {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  padding: 0.3rem;
  text-align: center;
  background: #f6f8fd;
}
.finish-btn {
  width: 6.9rem;
  height: 1rem;
  background: #2da3f6;
  border-radius: 0.2rem;
  color: #fff;
}
</style>
