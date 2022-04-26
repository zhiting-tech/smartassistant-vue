<template>
   <div class="wrapper">
    <van-nav-bar
      :title="$t('locationDevice.title')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft"
      @click-right="deleteShow = true">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
      <template #right v-if="permissions.delete_location">
        <span class="nav-right">{{ $t('locationDevice.del') }}</span>
      </template>
    </van-nav-bar>
    <!--loading模块-->
    <Loading v-if="loading"></Loading>
    <template v-else>
    <div class="detail-box">
      <div class="item clearfix" @click="permissions.update_location_name?show = true:''">
        <span class="item__label one-line float-l">{{ $t('locationDevice.name') }}</span>
        <span class="item__name float-r">
          {{ name }}
          <van-icon name="arrow" class="item__icon"/>
        </span>
      </div>
    </div>
    <div v-show="deviceList.length" class="device-list clearfix">
      <p class="device-tip">{{ $t('locationDevice.tip') }}</p>
      <div
        v-for="device in deviceList"
        :key="device.id"
        class="device-item float-l"
        @click="toDeviceDetail(device)">
        <CommonImage
          class="img"
          :src="device.logo_url"
          fit="contain"/>
        <p class="one-line">{{ device.name }}</p>
      </div>
    </div>
    </template>
    <!--修改名称弹窗-->
    <NameSheet
      v-model="show"
      :title="$t('locationDevice.sheetTitle')"
      :init="name"
      :loading="nameLoading"
      @on-confirm="editRoomName"/>
    <!--删除确认弹窗-->
    <van-dialog
      v-model="deleteShow"
      show-cancel-button
      :before-close="deleteRoom"
      confirm-button-color="#2DA3F6"
      cancel-button-color="#94A5BE">
      <h3 class="delete-title">{{ $t('locationDevice.delTitle') }}</h3>
      <p class="delete-tip">{{ $t('locationDevice.delContent') }}</p>
    </van-dialog>
   </div>
</template>
<script>
import { mapGetters } from 'vuex'
import NameSheet from '@/components/NameSheet.vue'

export default {
  name: 'locationDevice',
  components: {
    NameSheet
  },
  data() {
    return {
      show: false,
      deleteShow: false,
      id: '',
      name: '',
      deviceList: [],
      loading: false,
      nameLoading: false
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    initList() {
      this.loading = true
      this.http.getLocationDetail(this.id).then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        const { name, devices } = res.data
        this.name = name || ''
        this.deviceList = devices || []
      }).catch(() => {
        this.loading = false
      })
    },
    // 去设备详情
    toDeviceDetail(device) {
      if (device.is_sa) {
        this.$methods.setSession('sa', JSON.stringify(device))
      }
      this.$router.push({
        name: 'deviceDetail',
        query: {
          pluginId: device.plugin_id,
          deviceId: device.id,
          isSa: device.is_sa,
          pluginUrl: device.plugin_url
        }
      })
    },
    // 编辑房间名
    editRoomName(name) {
      const room = name.trim()
      if (room === '') {
        this.$toast(this.$t('locationDevice.emptyTip'))
        return
      }
      const params = {
        name: room
      }
      this.nameLoading = true
      this.http.editLocationName(this.id, params).then((res) => {
        this.nameLoading = false
        if (res.status !== 0) {
          return
        }
        this.$toast(this.$t('global.saveSuccess'))
        this.name = room
        this.show = false
      }).catch(() => {
        this.nameLoading = false
      })
    },
    deleteRoom(action, done) {
      if (action === 'confirm') {
        // 删除房间
        this.http.deleteLocation(this.id).then((res) => {
          done()
          if (res.status !== 0) {
            return
          }
          this.$toast(this.$t('global.delSuccess'))
          this.onClickLeft()
        })
      } else {
        done()
      }
    },
    // 提示无编辑
  },
  created() {
    const { query } = this.$route
    this.id = query.id || ''
    if (this.id) {
      this.initList()
    }
  }
}
</script>
<style lang="scss" scoped>
.detail-box {
  margin-top: 1PX;
}
.item {
  line-height: 1.1;
  padding: 0.34rem 0.3rem;
  background: #fff;
}
.item__label {
  display: inline-block;
  font-size: 0.28rem;
  color: #3F4663;
}
.item__name {
  font-size: 0.28rem;
  color: #94A5BE;
}
.item__icon {
  margin-left: 0.25rem;
  vertical-align: top;
  color: #ccc;
}
.device-tip {
  padding: 0.3rem;
  font-size: 0.28rem;
  color: #94A5BE;
  line-height: 1.1;
}
.device-item {
  padding: 0.3rem;
  width: 3.3rem;
  height: 2.2rem;
  margin-left: 0.3rem;
  margin-bottom: 0.3rem;
  background: #FFFFFF;
  border-radius: 0.2rem;
  text-align: center;
  .img {
    height: 1rem;
  }
  p {
    padding-top: 0.22rem;
    line-height: 1.1;
    font-size: 0.28rem;
    color: #3F4663;
  }
}
.nav-right {
  font-weight: bold;
}
.delete-title {
  padding-top: 0.53rem;
  text-align: center;
  font-size: 0.28rem;
  font-weight: bold;
  color: #3F4663;
}
.delete-tip {
  padding: 0.23rem 0.3rem 0.56rem 0.3rem;
  font-size: 0.24rem;
  font-weight: bold;
  line-height: 1.5;
  color: #3F4663;
  text-align: center;
}
</style>
