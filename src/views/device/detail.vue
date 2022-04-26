<template>
  <div class="device-detail">
    <van-nav-bar
      v-show="titleShow"
      :title="$t('deviceDetail.title')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft"
      @click-right="onClickRight"
    >
      <template #left>
        <van-icon name="arrow-left" color="#3F4663" />
      </template>
      <template v-if="canSet" #right>
        <van-icon name="setting-o" color="#3F4663" size="0.36rem" />
      </template>
    </van-nav-bar>
    <!-- sa设备 -->
    <div v-if="isSa">
      <Loading v-if="resourseLoading"></Loading>
      <div v-else>
        <div class="sa-box">
        <CommonImage class="sa-img" :src="saInfo.logo_url" fit="contain" />
        <p class="one-line">{{ saInfo.name }}</p>
      </div>
      <div class="resourse" v-if="false" @click="gotoResourse">
      <!-- <div class="resourse" v-if="userInfo.is_owner" @click="gotoResourse"> -->
      <!-- <div class="resourse" @click="gotoResourse"> -->
        <div class="device-item clearfix">
          <span class="device-item--label float-l">{{ $t("resourceMonitoring.title") }}</span>
          <p class="device-item--name float-r">
            <van-icon name="arrow" class="device-item--icon" />
          </p>
        </div>
        <div class="utilization">
          <div class="util-left"><img :src="cpu" alt="" /></div>
          <div class="util-right">
            <div class="rate">
              <span>{{ $t('resourceMonitoring.CPUutilization') }}</span>
              <span style=" color:#2DA3F6 ">{{resourses.percpu_usage && resourses.percpu_usage.toFixed(2) + '%'}}</span>
            </div>
            <div class="progress">
              <van-progress
                color="linear-gradient(to right,#75B8FD , #2DA3F6)"
                stroke-width="0.15rem"
                :percentage="resourses.percpu_usage"
                style="width: 100%"
                :show-pivot="false"
              />
            </div>
          </div>
        </div>
        <div class="utilization">
          <div class="util-left"><img :src="ram" alt="" /></div>
          <div class="util-right">
            <div class="rate">
              <span>{{ $t('resourceMonitoring.RAMutilization') }}</span>
              <span style="color:#37C48A">{{`${resourses.mem_usage}/${resourses.mem_total}`}}</span>
            </div>
            <div class="progress">
              <van-progress
                color="linear-gradient(to right, #46F1AB ,#37C48A)"
                stroke-width="0.15rem"
                :percentage="(parseInt(resourses.mem_usage)/(parseInt(resourses.mem_total)*1024))*100"
                style="width: 100%"
                :show-pivot="false"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="plugin-op" v-if="opList.length > 0">
        <div v-for="item in opList" :key="item.value" class="op-item" @click="handleOp(item)">
          <span>{{ item.name }}</span>
          <van-icon name="arrow" class="right-icon" />
        </div>
      </div>
      </div>
    </div>
    <div v-else class="plugin-html">
      <!--loading模块-->
      <Loading v-show="loading"></Loading>
      <!--嵌入插件详情页-->
      <iframe
        v-show="!isSa"
        id="insert"
        name="insert"
        class="iframe"
        :class="{ 'full-height': !titleShow, opacity: loading }"
      >
      </iframe>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

const menu = require('../../assets/menu.png')
const cpu = require('../../assets/CPU.png')
const ram = require('../../assets/ram.png')

export default {
  name: 'deviceDetail',
  data() {
    return {
      menu,
      id: '',
      isSa: false,
      pluginUrl: '',
      loading: false,
      titleShow: true, // 是否显示标题
      deviceInfo: {},
      saInfo: {},
      cpu,
      ram,
      resourses: [],
      resourseLoading: false,
      timer: null
    }
  },
  computed: {
    ...mapGetters(['permissions', 'userInfo']),
    canSet() {
      if (this.deviceInfo.permissions) {
        return (
          this.deviceInfo.permissions.update_device || this.deviceInfo.permissions.delete_device
        )
      }
      return false
    },
    opList() {
      const arr = []
      const softwarePower = 'sa_firmware_upgrade'
      const firmwarePower = 'sa_software_upgrade'
      if (this.userInfo.is_owner) {
        arr.push({
          value: 'powerManage',
          name: this.$t('deviceDetail.power'),
        })
      }
      if (this.permissions[softwarePower]) {
        arr.push({
          value: 'softwareUpgrade',
          name: this.$t('deviceDetail.softwareUpgrade'),
        })
      }
      if (this.permissions[firmwarePower]) {
        arr.push({
          value: 'firmwareUpgrade',
          name: this.$t('deviceDetail.update'),
        })
      }
      return arr
    },
  },
  methods: {
    onClickLeft() {
      if (this.$route.query.backHome || this.isSa) {
        this.$router.push({ name: 'device' })
      } else {
        this.$router.go(-1)
      }
      // this.$router.push({ name: 'device' })
    },
    // 处理sa设备操作
    handleOp(item) {
      // 处理逻辑
      if (item.value === 'powerManage') {
        this.$router.push({
          name: 'powerManage',
        })
      } else if (item.value === 'softwareUpgrade') {
        this.$router.push({
          name: 'upgrade',
          query: { type: 'software' },
        })
      } else if (item.value === 'firmwareUpgrade') {
        this.$router.push({
          name: 'upgrade',
          query: { type: 'firmware' },
        })
      }
    },
    // 获取设备详情
    initData() {
      this.http
        .getDeviceDetail(this.id)
        .then((res) => {
          if (res.status !== 0) {
            return
          }
          const { device_info: deviceInfo } = res.data
          this.deviceInfo = deviceInfo || {}
          // 设置iframe地址
          this.setPlugin()
        })
        .catch(() => {
          this.setPlugin()
        })
    },
    // 设置插件地址
    setPlugin() {
      // 替换插件连接地址设备名称（修复修改设备名称无法更新问题）
      const { name } = this.deviceInfo
      const pluginUrl = name
        ? this.pluginUrl.replace(/name=[^&]*/, `name=${name}`)
        : this.pluginUrl
      const iframe = document.querySelector('#insert') || {}
      iframe.src = decodeURIComponent(pluginUrl)
      // 接受子级message
      window.addEventListener('message', this.receiMessage, false)
      this.loading = true
      iframe.onload = () => {
        this.loading = false
      }
    },
    onClickRight() {
      // 去设备设置页面
      this.$router.push({
        name: 'deviceManage',
        query: {
          id: this.id,
          isSa: this.isSa,
        },
      })
    },
    // 接受消息
    receiMessage(msg) {
      if (msg.data.op === 'setTitle') {
        // 查看通知详情
        this.titleShow = msg.data.value.isShow
      }
    },
    gotoResourse() {
      this.$router.push({ name: 'deviceResourse' })
    },
    getResourse(bool) {
      if (bool) {
        this.resourseLoading = true
      }
      this.http.getResources().then((res) => {
        this.resourseLoading = false
        this.resourses = res.data
      })
    },
  },
  mounted() {
    const { deviceId, isSa, pluginUrl } = this.$route.query
    this.id = deviceId
    this.initData()
    if (`${isSa}` === 'true') {
      // sa设备不走外链
      this.isSa = true
      const saInfo = this.$methods.getSession('sa')
      this.saInfo = saInfo ? JSON.parse(saInfo) : {}
      // if (this.userInfo.is_owner) {
      //   this.getResourse(true)
      //   this.timer = setInterval(() => {
      //     this.getResourse(false)
      //   }, 30000)
      // }
      return
    }
    // 设置插件详情页面
    this.pluginUrl = pluginUrl
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  }
}
</script>
<style lang="scss" scoped>
.iframe {
  width: 100%;
  height: calc(100vh - 0.98rem);
}
.full-height {
  height: calc(100vh - 0.04rem);
}
.opacity {
  opacity: 0;
}
.sa-box {
  padding: 0.62rem;
  text-align: center;
  p {
    font-size: 0.32rem;
    color: #3f4663;
  }
}
.plugin-op {
  border-top: 0.2rem solid #f6f8fd;
}
.op-item {
  display: flex;
  align-items: center;
  padding: 0.37rem 0.3rem;
  background: #fff;
  border-bottom: 1px solid #eee;
  span {
    flex: 1;
    width: 6.04rem;
    font-size: 0.28rem;
    font-weight: bold;
    color: #3f4663;
  }
}
.sa-img {
  width: 2.6rem;
  height: 2.6rem;
}
.bottom-operation {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1rem;
  background: #ffffff;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
  border-radius: 0.4rem 0.4rem 0px 0px;
  cursor: pointer;
}
.condition-item {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.3rem 0.3rem;
  overflow: hidden;
  background-color: #fff;
  border-bottom: 1px solid #eeeeee;
  cursor: pointer;
  .item-name {
    flex: 1;
  }
  .item-desc {
    font-weight: 500;
    color: #94a5be;
  }
  .revise {
    width: 0.4rem;
  }
}
.condition-item-bottom {
  padding: 0.3rem 0.3rem;
  text-align: center;
}
.switch-wrap {
  position: relative;
  .close-btn {
    font-weight: bold;
    position: absolute;
    top: 0.3rem;
    right: 0.3rem;
  }
  .title {
    padding: 0.4rem 0.3rem;
    font-weight: bold;
    font-size: 0.32rem;
    color: #3f4663;
    position: relative;
  }
  .switch-title {
    color: #94a5be;
  }
  .switch-title.active {
    color: #2da3f6;
  }
}

.device-item {
  line-height: 1.1;
  padding: 0.34rem 0.3rem;
  background: #fff;
  border-bottom: 0.01rem solid #eee;
  &:nth-of-type(1) {
    border: none;
  }
}
.device-item--label {
  display: inline-block;
  font-size: 0.28rem;
  font-weight: bold;
  color: #3f4663;
}
.device-item--name {
  font-size: 0.28rem;
  color: #94a5be;
  span {
    display: inline-block;
    max-width: 4.6rem;
  }
}
.device-item--icon {
  margin-left: 0.25rem;
  vertical-align: top;
  color: #ccc;
}
.resourse {
  padding: 0.1rem 0 0;
  background-color: rgb(245, 245, 245);
}
.utilization {
  background: #fff;
  display: flex;
  padding: 0 0 0.3rem 0;
}
.util-left {
  padding: 0 0 0 0.3rem;
  img {
    width: 1rem;
  }
}
.util-right {
  flex: 1;
  padding: 0 0.2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .rate {
    display: flex;
    justify-content: space-between;
    margin: 0 0 0.1rem 0;
    padding-bottom: 0.1rem;
  }
  .progress {
    padding-bottom: 0.1rem;
  }
}
</style>
