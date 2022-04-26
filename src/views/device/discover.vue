<template>
  <div class="discover-wrap">
    <van-nav-bar
      :title="$t('discover.title')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
    </van-nav-bar>
    <div class="discover">
      <div class="radar-part">
        <!--扫描-->
        <div class="radar">
          <div class="dot dot-1" :class="{ 'a-breath': isScan }"></div>
          <div class="dot dot-2" :class="{ 'a-breath': isScan }"></div>
          <div class="dot dot-3" :class="{ 'a-breath': isScan }"></div>
          <div class="cover" :class="{ 'a-rotate': isScan }"></div>
          <!--未发现-->
          <img v-show="!isScan" src="../../assets/warn-icon.png" class="scan-fail"/>
        </div>
        <p v-if="isScan" class="scan-word">{{ $t('discover.scan') }}...</p>
        <p v-else class="scan-word">{{ $t('discover.empty') }}</p>
        <p class="scan-tip">{{ $t('discover.tip1') }}</p>
        <p class="scan-tip">{{ $t('discover.tip2') }}</p>
        <div v-show="!isScan" class="scan-btn--box">
          <button class="scan-btn" @click="scanDevice">{{ $t('discover.retry') }}</button>
        </div>
      </div>
      <div class="discover-list">
        <div
          v-for="device in discoverList"
          :key="device.id"
          class="discover-item">
          <div class="discover-pic">
            <CommonImage
              class="img"
              :src="device.logo_url"
              fit="contain"/>
          </div>
          <div class="discover-info">
            <p class="discover-name">{{ device.name }}</p>
            <span class="plugin-id one-line">{{device.plugin_id}}</span>
          </div>
          <button
            class="add-btn"
            @click="connect(device)">{{ $t('discover.add') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'deviceDiscover',
  data() {
    return {
      areaId: '', // 家庭id
      isScan: true,
      discoverList: [],
      msgId: 1,
      timer: null // 未发现显示定时器
    }
  },
  computed: {
    ...mapGetters(['websocket', 'permissions'])
  },
  mounted() {
    this.scanDevice()
  },
  methods: {
    // 扫描方法
    scanDevice() {
      this.isScan = true
      // 发送发现指令
      this.msgId = Date.now()
      this.websocket.send({
        id: this.msgId,
        service: 'discover'
      })
      // 接受消息
      this.websocket.onmessage((data) => {
        const msg = JSON.parse(data)
        if (msg.id === this.msgId) {
          if (!msg.data) {
            return
          }
          const { device } = msg.data
          const isExist = this.discoverList.find(item => item.iid === device.iid)
          if (!isExist) {
            clearTimeout(this.timer)
            this.discoverList.push(device)
          }
        }
      })
      // 未发现设置显示
      this.timer = setTimeout(() => {
        this.isScan = false
      }, 5000)
    },
    onClickLeft() {
      this.$router.push({ name: 'device' })
    },
    connect(device) {
      if (!this.permissions.add_device) {
        this.$toast(this.$t('global.noPermission'))
        return
      }
      const query = Object.assign({}, device)
      query.area_id = this.areaId
      if (device.auth_required) {
        this.$router.push({
          name: 'homeKit',
          query
        })
      } else {
        this.$router.push({
          name: 'deviceConnect',
          query
        })
      }
    },
  },
  created() {
    const { areaId } = this.$route.query
    this.areaId = areaId
  }
}
</script>
<style lang="scss" scoped>
.discover {
  padding: 0.63rem 0.3rem 0 0.3rem;
}
.radar {
  position: relative;
  z-index: 9;
  height: 3.5rem;
  width: 3.5rem;
  background: -webkit-repeating-radial-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 23%, #eee 24%, rgba(255, 255, 255, 0) 25%);
  margin: 0 auto;
  border-radius: 50%;
  border: 0.02rem solid #eee;
  overflow: hidden;
}
.radar::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0.1rem;
  height: 0.1rem;
  background: #2DA3F6;
  margin-left: -0.05rem;
  margin-top: -0.05rem;
  border-radius: 0.05rem;
}
.dot {
  position: absolute;
  width: 0.13rem;
  height: 0.13rem;
  background: #2DA3F6;
  opacity: 0;
  border-radius: 50%;
}
.a-rotate {
  animation: rotation 3s linear infinite;
}
.dot-1 {
  top: 0.95rem;
  right: 1.04rem;
  animation-delay: 0.4s;
}
.dot-2 {
  top: 0.52rem;
  right: 1.12rem;
  animation-delay: 0.2s;
}
.dot-3 {
  top: 1.25rem;
  right: 2.92rem;
  animation-delay: 2.3s;
}
.cover {
  transform-origin: bottom right;
  border-right: 0.02rem solid #2DA3F6;
  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0) 45%, #2DA3F6 100%);
  width: 50%;
  height: 50%;
  position: absolute;
  top: 0;
  left: 0;
}
.scan-fail {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 9;
  transform: translate(-50%, -50%);
  width: 0.36rem;
}
.a-breath {
  animation-name: breath;
  animation-duration: 3s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.scan-word {
  padding-top: 0.45rem;
  padding-bottom: 0.16rem;
  font-size: 0.32rem;
  font-weight: bold;
  color: #94A5BE;
  text-align: center;
}
.scan-tip {
  font-size: 0.24rem;
  color: #94A5BE;
  line-height: 0.38rem;
}
.scan-btn--box {
  padding-top: 0.58rem;
  text-align: center;
}
.scan-btn {
  width: 3rem;
  height: 1rem;
  background: #2DA3F6;
  border-radius: 0.08rem;
  font-size: 0.28rem;
  font-weight: bold;
  color: #ffffff;
}
.discover-list {
  padding-top: 1rem;
}
.discover-item {
  display: flex;
  align-items: center;
  padding: 0.3rem 0;
  border-top: 0.01rem solid #eeeeee;
}
.discover-pic {
  padding: 0.2rem;
  width: 1.2rem;
  height: 1.2rem;
  background: #FFFFFF;
  border: 0.01rem solid #EEEEEE;
  border-radius: 0.08rem;
  text-align: center;
  .img {
    height: 100%;
  }
}
.discover-info{
  padding: 0 0.3rem;
  width: 4.7rem;
  word-break: break-all;
}
.discover-name {
  font-size: 0.28rem;
  color: #3F4663;
  line-height: 1.5;
}
.plugin-id{
  max-width: 3.5rem;
  display: inline-block;
  background-color: rgba(7, 181, 163, .1);
  height: .3rem;
  border-radius: .15rem;
  padding: 0 .2rem;
  color: #07B5A3;
  font-size: .2rem;
  margin-top: .15rem;
}
.add-btn {
  padding: 0;
  width: 1rem;
  height: 0.6rem;
  background: $bgColor;
  border-radius: 0.08rem;
  font-size: 0.28rem;
  color: #2DA3F6;
}
@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes breath {
  0% {
    opacity: 0;
  }
  10%{
    opacity: 1;
  }
  20%{
    opacity: 1;
  }
  40% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
</style>
