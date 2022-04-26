<template>
  <div class="device-manage">
    <van-nav-bar
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
    </van-nav-bar>
    <div class="device-box">
      <CommonImage
        class="device-img"
        fit="contain"
        :src="deviceInfo.logo_url"/>
      <p class="one-line">{{ deviceInfo.name }}</p>
    </div>
    <div class="device-msg">
      <div
        v-if="deviceInfo.permissions.update_device"
        class="device-item clearfix"
        @click="show = true">
        <span class="device-item--label float-l">{{ $t('deviceManage.name') }}</span>
        <p class="device-item--name float-r">
          <span class="one-line">{{ deviceInfo.name }}</span>
          <van-icon name="arrow" class="device-item--icon"/>
        </p>
      </div>
      <div
        v-if="deviceInfo.permissions.update_device"
        @click="toAreaSetting"
        class="device-item clearfix">
        <span class="device-item--label float-l">{{ $t('deviceManage.position') }}</span>
        <p class="device-item--name float-r">
          <span class="one-line">{{ userInfo.area_type === 1?location.name:department.name }}</span>
          <van-icon name="arrow" class="device-item--icon"/>
        </p>
      </div>
      <div
        v-if="!isSa"
        @click="toPluginDetail"
        class="device-item clearfix">
        <span class="device-item--label float-l">{{ $t('deviceManage.plugin') }}</span>
        <p class="device-item--name float-r">
          <van-icon name="arrow" class="device-item--icon"/>
        </p>
      </div>
      <div
        v-if="deviceInfo.permissions.update_device"
        @click="toChangeIcon"
        class="device-item clearfix">
        <span class="device-item--label float-l">{{ $t('deviceManage.changeIcon') }}</span>
        <p class="device-item--name float-r">
          <span class="one-line">{{ deviceInfo.logo.name }}</span>
          <van-icon name="arrow" class="device-item--icon"/>
        </p>
      </div>
    </div>
    <button
      v-if="deviceInfo.permissions.delete_device && !isSa"
      class="delete-btn"
      @click="deleteShow = true">
      {{ $t('deviceManage.del') }}
    </button>
    <!--修改名称弹窗-->
    <NameSheet
      v-model="show"
      :title="$t('deviceManage.name')"
      :init="deviceInfo.name"
      :loading="nameLoading"
      @on-confirm="editDevice"/>
    <!--删除确认弹窗-->
    <van-dialog
      v-model="deleteShow"
      show-cancel-button
      :before-close="deleteDevice"
      confirm-button-color="#2DA3F6"
      cancel-button-color="#94A5BE">
      <h3 class="delete-title">{{ $t('deviceManage.delTitle') }}</h3>
    </van-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import NameSheet from '@/components/NameSheet.vue'

export default {
  name: 'deviceManage',
  components: {
    NameSheet
  },
  data() {
    return {
      id: '',
      isSa: false,
      show: false,
      deleteShow: false,
      deviceInfo: {
        permissions: {},
        logo: {}
      },
      nameLoading: false,
      msgId: 1
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'websocket']),
    department() {
      return this.deviceInfo.department || {}
    },
    location() {
      return this.deviceInfo.location || {}
    },
    areaInfo() {
      return this.deviceInfo.area || {}
    },
    pluginInfo() {
      return this.deviceInfo.plugin || {}
    },
    paramsId() {
      if (this.userInfo.area_type === 1) {
        return this.location.id || ''
      }
      return this.department.id || ''
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    // 跳转区域设置
    toAreaSetting() {
      this.$router.push({
        name: 'locationSetting',
        query: {
          areaId: this.areaInfo.id,
          locationId: this.paramsId,
          deviceId: this.id
        }
      })
    },
    // 跳转插件详情
    toPluginDetail() {
      const pluginId = this.pluginInfo.id
      this.$router.push({
        name: 'pluginDetail',
        query: {
          pluginId
        }
      })
    },
    // 跳转更换图标
    toChangeIcon() {
      this.$router.push({
        name: 'changeIcon',
        query: {
          deviceId: this.deviceInfo.id,
          type: this.deviceInfo.logo.type
        }
      })
    },
    // 获取设备数据
    initData() {
      this.http.getDeviceDetail(this.id).then((res) => {
        if (res.status !== 0) {
          return
        }
        const { device_info: deviceInfo } = res.data
        this.deviceInfo = deviceInfo || {}
      })
    },
    // 修改设备名称
    editDevice(name) {
      const room = name.trim()
      if (room === '') {
        this.$toast(this.$t('deviceManage.empty'))
        return
      }
      const params = {
        name: room,
        location_id: this.location.id
      }
      this.nameLoading = true
      this.http.editDevice(this.id, params).then((res) => {
        this.nameLoading = false
        if (res.status !== 0) {
          return
        }
        if (this.isSa) {
          // 如果是sa设备，更新缓存名称
          let sa = this.$methods.getSession('sa')
          sa = sa ? JSON.parse(sa) : {}
          sa.name = room
          this.$methods.setSession('sa', JSON.stringify(sa))
        }
        this.$toast(this.$t('deviceManage.modify'))
        this.deviceInfo.name = room
        this.show = false
      }).catch(() => {
        this.nameLoading = false
      })
    },
    // 删除设备
    deleteDevice(action, done) {
      if (action === 'confirm') {
        // 发送发现指令
        this.msgId = Date.now()
        this.websocket.send({
          id: this.msgId,
          domain: this.deviceInfo.plugin.id,
          service: 'disconnect',
          data: {
            iid: this.deviceInfo.iid,
          }
        })
        // 接受消息
        this.websocket.onmessage((data) => {
          const msg = JSON.parse(data)
          if (msg.id === this.msgId) {
            if (msg.success) {
              this.$router.push({
                name: 'device'
              })
            } else {
              this.$toast(msg.error.message)
            }
          }
        })
      } else {
        done()
      }
    },
  },
  created() {
    const { query } = this.$route
    this.id = query.id || ''
    this.isSa = `${query.isSa}` === 'true'
    if (this.id) {
      this.initData()
    }
  }
}
</script>
<style lang="scss" scoped>
.device-manage {
  min-height: 100vh;
  background: $bgColor;
}
.device-box {
  padding: 0.2rem 0.3rem 0.85rem 0.3rem;
  background: #fff;
  text-align: center;
  p {
    font-size: 0.32rem;
    font-weight: bold;
    color: #3F4663;
  }
}
.device-img {
  height: 2.4rem;
}
.device-msg {
  margin-top: 0.2rem;
}
.device-item {
  line-height: 1.1;
  padding: 0.34rem 0.3rem;
  background: #fff;
  border-bottom: 0.01rem solid #eee;
}
.device-item--label {
  display: inline-block;
  font-size: 0.28rem;
  font-weight: bold;
  color: #3F4663;
}
.device-item--name {
  font-size: 0.28rem;
  color: #94A5BE;
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
.delete-btn {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0.2rem;
  width: 6.9rem;
  height: 1rem;
  background: #fff;
  border-radius: 0.2rem;
  font-weight: bold;
  color: #3F4663;
}
.delete-title {
  padding: 0.53rem 0.3rem;
  text-align: center;
  font-size: 0.28rem;
  font-weight: bold;
  color: #3F4663;
}
</style>
