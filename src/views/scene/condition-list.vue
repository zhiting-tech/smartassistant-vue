<template>
  <div class="wrap">
    <van-nav-bar
      :title="$t('scene.conditionTitle')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
      <template #right>
        <!-- 筛选popver -->
        <van-popover
          v-model="popoverShow"
          trigger="click"
          :get-container="getContainer"
          placement="bottom-end"
          :offset="[-5, 10]">
          <div class="area-list">
            <div
              v-for="item in areaList"
              :key="item.id"
              class="area-item"
              :class="{ 'active': item.id === activeArea }"
              @click="choseArea(item)">
              {{ item.name }}
            </div>
          </div>
          <template #reference>
            <span class="right-btn">{{ $t('global.filter') }}</span>
          </template>
        </van-popover>
      </template>
    </van-nav-bar>
    <Loading v-if="loading"></Loading>
    <template v-else>
      <div
        v-for="area in areaDeviceList"
        :key="area.location_id"
        class="area">
        <p v-if="area.locationName" class="area-name">{{ area.locationName }}</p>
        <div
          v-for="item in area.list"
          :key="item.id"
          class="device-item"
          @click="toDeviceCondition(item)">
          <div class="device-pic">
            <CommonImage
              class="d-img"
              fit="contain"
              :src="item.logo_url"/>
          </div>
          <div class="center">
            <p class="device-name one-line">{{ item.name }}</p>
            <p class="device-area one-line">{{ area.locationName }}</p>
          </div>
          <van-icon
            name="arrow"
            color="#cccccc"
            size="0.3rem"/>
        </div>
      </div>
      <div v-show="isEmpty" class="empty-part">
        <div class="empty-box">
          <img src="../../assets/empty-list.png"/>
          <p>{{ $t('global.empty') }}</p>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: 'sceneConditionsList',
  data() {
    return {
      popoverShow: false,
      activeArea: -1,
      op: '',
      type: 1,
      loading: false,
      areaList: [], // 房间列表
      deviceList: []
    }
  },
  computed: {
    areaDeviceList() {
      if (this.activeArea === -1) {
        return this.deviceList
      }
      const res = this.deviceList.find(item => item.locationId === this.activeArea)
      if (res) {
        return [res]
      }
      return []
    },
    isEmpty() {
      return this.areaDeviceList.length === 0
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    getContainer() {
      return document.querySelector('.right-btn')
    },
    choseArea(area) {
      this.activeArea = area.id
    },
    // 格式化设备数据格式，前端显示需要
    formatDevice(list) {
      const obj = {}
      const res = []
      list.forEach((item) => {
        if (!item.is_sa) {
          // 不需要sa设备
          if (obj[item.location_id]) {
            obj[item.location_id].list.push(item)
          } else {
            obj[item.location_id] = {
              locationId: item.location_id,
              locationName: item.location_name,
              list: [item]
            }
          }
        }
      })
      Object.keys(obj).forEach((key) => {
        res.push(obj[key])
      })
      return res
    },
    // 初始化设备列表
    initList() {
      this.loading = true
      const params = {
        type: this.type
      }
      this.http.getDeviceList(params).then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        const list = res.data.devices || []
        this.deviceList = this.formatDevice(list)
      }).catch(() => {
        this.loading = false
      })
    },
    // 初始化房间列表
    initLocationList() {
      this.http.getLocations().then((res) => {
        if (res.status !== 0) {
          return
        }
        const all = {
          id: -1,
          name: this.$t('global.all')
        }
        const { locations } = res.data
        this.areaList = locations || []
        this.areaList.unshift(all)
      })
    },
    // 去设备条件选择页
    toDeviceCondition(item) {
      this.$router.push({
        name: 'conditionsDevice',
        query: {
          id: item.id,
          op: this.op,
          sceneId: this.$route.query.sceneId,
        }
      })
    }
  },
  created() {
    const { query } = this.$route
    this.op = query.op
    this.type = query.type
    this.initList()
    this.initLocationList()
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  min-height: 100vh;
  background: $bgColor;
}
.right-btn {
  color: #3F4663;
  font-weight: bold;
}
.area {
  margin-top: 1PX;
}
.area-name {
  padding: 0.3rem;
  font-size: 0.24rem;
  color: #94A5BE;
}
.device-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.25rem 0.3rem;
  background: #fff;
  .center {
    width: 5.5rem;
  }
}
.device-item::after {
  content: "";
  position: absolute;
  left: 1.5rem;
  right: 0.3rem;
  bottom: 0;
  border-bottom: 1PX solid #eee;
}
.device-pic {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 0.9rem;
  height: 0.9rem;
  border: 1PX solid #eeeeee;
  border-radius: 0.08rem;
  margin-right: 0.3rem;
  .d-img {
    height: 0.8rem;
    max-width: 0.8rem;
  }
}
.device-name {
  font-size: 0.28rem;
  color: #3F4663;
}
.device-area {
  padding-top: 0.1rem;
  font-size: 0.24rem;
  color: #94A5BE;
}
.area-list {
  width: 3rem;
  max-height: 4rem;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

.area-item {
  position: relative;
  padding: 0.28rem 0.3rem;
  text-align: left;
  font-size: 0.28rem;
  color: #3F4663;
  border-bottom: 1PX solid #eee;
}
.active {
  color: #2DA3F6;
}
.active::after {
  content: "";
  position: absolute;
  right: 0.3rem;
  width: 0.37rem;
  height: 0.37rem;
  background-image: url(../../assets/check-icon.png);
  background-size: 100% 100%;
}
.empty-part {
  display: flex;
  height: calc(100vh - 1.2rem);
  align-items: center;
  justify-content: center;
}
.empty-box {
  text-align: center;
  p {
    padding-top: 0.2rem;
    font-size: 0.28rem;
    color: #94A5BE;
  }
}
</style>
<style scoped>
.right-btn >>> .van-popover__arrow {
  border: 0;
}
</style>
