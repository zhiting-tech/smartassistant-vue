<template>
  <div class="connect">
    <van-nav-bar
      :title="$t('connect.title')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft"
    >
      <template #left>
        <van-icon name="arrow-left" color="#3F4663" />
      </template>
    </van-nav-bar>
    <div class="progress">
      <van-circle
        v-model="currentRate"
        :rate="rate"
        :speed="100"
        color="#2DA3F6"
        layer-color="#DDE5EB"
        size="4.6rem"
        :stroke-width="40"
      />
      <div class="spaner">
        <p class="rate-font">{{ rateFixed }}<span>%</span></p>
      </div>
    </div>
    <p v-if="isConnecting" class="connecting">{{ $t("connect.connect") }}...</p>
    <template v-else>
      <div v-if="isConnectSuccess" class="connect-success">
        <van-icon name="checked" size="0.4rem" color="#0BDB99" />
        <span>{{ $t("connect.success") }}</span>
      </div>
      <div v-if="!isHomekit" class="connect-fail">
        <p class="fail">{{ $t("connect.fail") }}</p>
        <p class="tip">请检查并确保：</p>
        <p class="tip">1、设备正常供电；</p>
        <p class="tip">2、设备网络连接正常；</p>
        <div class="btn-box-placeholder">
          <div class="btn-box">
            <van-button class="btn" @click="retry">{{ $t("connect.retry") }}</van-button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'deviceConnect',
  data() {
    return {
      currentRate: 0,
      rate: 0,
      timer: null,
      device: {},
      isConnecting: false, // 是否连接中
      isConnectSuccess: false, // 是否连接成功
      msgId: 1,
    }
  },
  computed: {
    ...mapGetters(['websocket', 'userInfo']),
    rateFixed() {
      return parseInt(this.currentRate, 10)
    },
    isHomekit() {
      return this.device.auth_required === 'true' || this.device.auth_required
    },
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    connectDevice() {
      this.mockProcess()
      const areaId = this.device.area_id
      const device = Object.assign({}, this.device)
      delete device.area_id
      this.isConnecting = true
      if (this.isHomekit) {
        // 发送发现指令
        this.msgId = Date.now()
        this.websocket.send({
          id: this.msgId,
          domain: device.plugin_id,
          service: 'connect',
          data: {
            iid: device.iid,
            auth_params: {
              pin: device.code
            },
          },
        })
      } else {
        // 发送发现指令
        this.msgId = Date.now()
        this.websocket.send({
          id: this.msgId,
          domain: device.plugin_id,
          service: 'connect',
          data: {
            iid: device.iid
          },
        })
      }
      // 接受消息
      this.websocket.onmessage((data) => {
        const msg = JSON.parse(data)
        if (msg.id === this.msgId) {
          if (msg.success) {
            this.rate = 100
            this.isConnectSuccess = true
            // 跳转至设备详情页
            setTimeout(() => {
              this.$router.replace({
                name: 'locationSetting',
                query: {
                  from: device.name,
                  areaId,
                  deviceId: msg.data.device.id,
                },
              })
            }, 1000)
          } else {
            clearInterval(this.timer)
            this.isConnecting = false
            this.isConnectSuccess = false
            device.error = msg.error.message
            if (this.isHomekit) {
              this.$router.push({
                name: 'homeKit',
                query: device
              })
            }
          }
        }
      })
    },
    // 模拟进度条
    mockProcess() {
      this.rate = 0
      this.timer = setInterval(() => {
        if (this.rate >= 94) {
          clearInterval(this.timer)
          return
        }
        this.rate = this.rate + 2
      }, 50)
    },
    // 重新连接
    retry() {
      this.connectDevice()
    },
  },
  created() {
    this.device = this.$route.query
    if (Object.keys(this.device).length) {
      // 连接设备
      this.connectDevice()
    }
  }
}
</script>
<style lang="scss" scoped>
.progress {
  position: relative;
  width: 4.6rem;
  margin: 1.5rem auto 0 auto;
}
.spaner {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -0.02rem;
  left: -0.02rem;
  width: 4.64rem;
  height: 4.64rem;
  background-image: url(../../assets/circle-spiner.png);
  background-size: 100% 100%;
}
.rate-font {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3f4663;
  span {
    font-size: 0.75rem;
  }
}
.connecting {
  padding-top: 0.53rem;
  font-size: 0.28rem;
  color: #94a5be;
  text-align: center;
}
.connect-fail {
  padding-top: 0.5rem;
  text-align: center;
  .fail {
    padding-bottom: 0.5rem;
    font-size: 0.28rem;
    color: #fe0000;
  }
  .tip {
    padding: 0 0.24rem;
    text-align: left;
    font-size: 0.28rem;
    color: #94a5be;
    line-height: 0.4rem;
  }
}
.connect-success {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 0.46rem;
  span {
    margin-left: 0.21rem;
  }
}
</style>
