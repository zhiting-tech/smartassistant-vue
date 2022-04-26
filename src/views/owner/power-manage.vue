<template>
  <div class="wrapper">
    <van-nav-bar
      :title="$t('owner.powerTitle')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
    </van-nav-bar>
    <div class="op-list">
      <van-cell-group>
        <van-cell :class="{'link': item.type === 'link'}" v-for="item in opList" :key="item.value" :clickable="item.type === 'link'" @click="item.type === 'link'?handleOp(item):''">
          <template #title>
            <div class="title one-line">
              {{item.name}}
            </div>
          </template>
          <template #right-icon>
            <van-icon v-if="item.type === 'link'" size=".4rem" color="#969799" name="arrow" />
            <van-switch
              v-else
              v-model="params.remote_help.enable"
              :loading="loading"
              size="0.36rem"
              active-color="#2da3f6"
              inactive-color="#cfd6e0"
              @change="setSetting"/>
          </template>
          <template #label v-if="item.type === 'switch'">
            <div class="des">开启后，智汀技术人员可以远程控制您的智慧中心进行诊断和修复，关闭则无法远程控制，请谨慎开启</div>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
    <!--确认弹窗-->
    <van-dialog
      v-model="confirmShow"
      show-cancel-button
      :cancelButtonText="$t('global.cancel')"
      :confirmButtonText="$t('global.confirm')"
      confirm-button-color="#2DA3F6"
      cancel-button-color="#94A5BE"
      :before-close="beforeClose">
      <div class="tips-content">{{$t('owner.remoteHelpTips')}}</div>
    </van-dialog>
  </div>
</template>
<script>

export default {
  name: 'powerManage',
  data() {
    return {
      opList: [
        {
          value: 'certificateManage',
          name: this.$t('owner.certificate'),
          type: 'link'
        },
        {
          value: 'log',
          name: this.$t('owner.log'),
          type: 'link'
        },
        {
          value: 'backup',
          name: this.$t('owner.backup'),
          type: 'link'
        },
        {
          value: 'remoteHelp',
          name: this.$t('owner.remoteHelp'),
          type: 'switch'
        }
      ],
      params: {
        remote_help: {
          enable: false
        },
      },
      loading: false,
      confirmShow: false,
    }
  },
  methods: {
    onClickLeft() {
      if (this.$methods.getSession('sa')) {
        const saInfo = JSON.parse(this.$methods.getSession('sa'))
        this.$router.push({
          name: 'deviceDetail',
          query: {
            pluginId: saInfo.plugin_id,
            deviceId: saInfo.id,
            isSa: saInfo.is_sa,
            pluginUrl: saInfo.plugin_url
          }
        })
      } else {
        this.$router.go(-1)
      }
    },
    handleOp(item) {
      if (item.value === 'certificateManage') {
        this.$router.push({
          name: 'certificateManage'
        })
      } else if (item.value === 'log') {
        this.$router.push({
          name: 'log'
        })
      } else if (item.value === 'backup') {
        this.$router.push({
          name: 'backup'
        })
      }
    },
    getUserCertificate() {
      this.http.getUserCertificate().then((res) => {
        if (res.status !== 0) {
          return
        }
        this.params.remote_help.enable = res.data.remote_help.enable
      })
    },
    setSetting(value) {
      this.params.remote_help.enable = value
      if (value) {
        this.confirmShow = true
      } else {
        this.http.setUserCertificate(this.params).then((res) => {
          this.loading = false
          if (res.status !== 0) {
            this.params.remote_help.enable = !value
            return
          }
          this.$toast.success(this.$t('owner.offRemoteHelp'))
        }).catch(() => {
          this.loading = false
        })
      }
    },
    beforeClose(action, done) {
      if (action === 'confirm') {
        this.http.setUserCertificate(this.params).then((res) => {
          if (res.status !== 0) {
            this.params.remote_help.enable = !this.params.remote_help.enable
            return
          }
          done()
          this.$toast.success(this.$t('owner.onRemoteHelp'))
        })
      } else {
        done()
        this.params.remote_help.enable = !this.params.remote_help.enable
      }
    },
  },
  created() {
    this.getUserCertificate()
  }
}
</script>
<style lang="scss" scoped>
  .van-cell.link{
    align-items: center;
  }
  .van-cell::after{
    left: 0;
    right: 0;
  }
.op-list {
  margin-top: 1PX;
  .title{
    max-width: 4rem;
  }
}
.op-item {
  display: flex;
  align-items: center;
  padding: 0.37rem 0.3rem;
  background: #fff;
  border-bottom: 1PX solid #eee;
  span {
    flex: 1;
    width: 6.04rem;
    font-size: 0.28rem;
    color: #3f4663;
  }
}
.tips-content {
  padding: 0.58rem 0.8rem;
  font-size: 0.28rem;
  font-weight: bold;
  line-height: 1.5;
  color: #3F4663;
  text-align: center;
}
</style>
