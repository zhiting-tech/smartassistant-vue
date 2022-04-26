<template>
  <div class="wrapper">
    <van-nav-bar
      :title="$t('locationManage.title')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
      <template v-if="!isEmpty&&permissions.update_location_order" #right>
        <span v-if="!isEdit" class="nav-edit" @click="isEdit = true">{{ $t('locationManage.edit') }}</span>
        <van-button v-else class="nav-edit" :loading="saveLoading" :disabled="saveLoading" @click="handleEdit">{{ $t('locationManage.finish') }}</van-button>
      </template>
    </van-nav-bar>
    <!--loading模块-->
    <Loading v-if="loading"></Loading>
    <div v-else-if="isEmpty" class="empty-box">
      <div class="empty-wrap">
        <van-image :src="emptyImg" class="empty-img"/>
        <p class="empty-word">{{ $t('locationManage.empty') }}</p>
        <van-button v-if="permissions.add_location" class="empty-btn" @click="handleAdd">{{ $t('locationManage.add') }}</van-button>
      </div>
    </div>
    <template v-else>
    <div class="detail-box">
      <Draggable
        v-model="dragList"
        :list="locationList"
        :disabled="!isEdit">
        <transition-group>
          <div
            v-for="location in locationList"
            :key="location.id"
            @click="permissions.get_location ? toLocationDevice(location):''"
            class="item clearfix">
            <span class="item__label one-line float-l">{{ location.name }}</span>
            <van-icon v-if="!isEdit" name="arrow" class="item__icon float-r"/>
            <van-icon v-else name="bars" class="item__icon float-r"/>
          </div>
        </transition-group>
      </Draggable>
    </div>
    <div class="add-btn-placeholder">
      <div class="add-btn-box">
        <button v-show="!isEdit&&permissions.add_location" class="add-btn" @click="handleAdd">
          <van-icon name="plus" class="add-btn__icon"/>
          {{ $t('locationManage.add') }}
        </button>
      </div>
    </div>
    </template>
    <!--修改名称弹窗-->
    <NameSheet
      v-model="show"
      :title="$t('locationManage.sheetTitle')"
      :init="locationName"
      :loading="nameLoading"
      @on-confirm="addRoom"/>
  </div>
</template>
<script>
import Draggable from 'vuedraggable'
import { mapGetters } from 'vuex'
import NameSheet from '@/components/NameSheet.vue'

const emptyImg = require('../../assets/empty-icon.png')

export default {
  name: 'locationManage',
  components: {
    NameSheet,
    Draggable
  },
  data() {
    return {
      id: '',
      dragList: [],
      isEdit: false,
      locationList: [],
      emptyImg,
      show: false,
      locationName: '',
      loading: false,
      nameLoading: false,
      saveLoading: false
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    isEmpty() {
      return this.locationList.length === 0
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    // 处理位置排序
    handleEdit() {
      this.saveLoading = true
      const locationOrder = []
      this.locationList.forEach((item) => {
        locationOrder.push(item.id)
      })
      const params = {
        locations_id: locationOrder
      }
      this.http.editLocationSort(params).then((res) => {
        this.saveLoading = false
        this.isEdit = false
        if (res.status !== 0) {
          return
        }
        this.$toast(this.$t('global.editSuccess'))
      })
    },
    // 去房间设备页
    toLocationDevice(location) {
      if (this.isEdit) {
        return
      }
      this.$router.push({
        name: 'locationDevice',
        query: {
          id: location.id
        }
      })
    },
    // 初始化列表
    initList() {
      this.loading = true
      this.http.getLocations().then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        const { locations } = res.data
        this.locationList = locations || []
      }).catch(() => {
        this.loading = false
      })
    },
    // 处理添加按钮
    handleAdd() {
      this.show = true
      this.locationName = ''
    },
    // 添加房间
    addRoom(name) {
      const room = name.trim()
      if (room === '') {
        this.$toast(this.$t('locationManage.emptyTip'))
        return
      }
      const isExit = this.locationList.find(item => item.name === room)
      if (isExit) {
        this.$toast(this.$t('locationManage.repeatTip'))
        return
      }
      const params = {
        name: room
      }
      this.nameLoading = true
      this.http.addLocation(params).then((res) => {
        this.nameLoading = false
        if (res.status !== 0) {
          return
        }
        this.show = false
        this.initList()
        this.locationName = room
        this.$toast(this.$t('global.saveSuccess'))
      }).catch(() => {
        this.nameLoading = false
      })
    }
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
.nav-edit {
  font-size: 0.28rem;
  font-weight: bold;
  color: #3F4663;
  padding: 0;
  border: 0 none;
}
.item {
  line-height: 1.1;
  padding: 0.34rem 0.3rem;
  background: #fff;
  border-bottom: 0.01rem solid #eee;
}
.item__label {
  display: inline-block;
  max-width: 6.2rem;
  font-size: 0.28rem;
  color: #3F4663;
}
.item__icon {
  margin-left: 0.25rem;
  vertical-align: top;
  color: #ccc;
}
.add-btn__icon {
  font-weight: bold;
  vertical-align: text-top;
  margin-right: 0.2rem;
}
.add-btn-placeholder {
  height: 1.6rem;
}
.add-btn-box {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  padding: 0.3rem;
  background: $bgColor;
}
.add-btn {
  width: 6.9rem;
  height: 1rem;
  background: #fff;
  border-radius: 0.2rem;
  font-size: 0.28rem;
  font-weight: bold;
  color: #2DA3F6;
}
.empty-box {
  display: flex;
  height: calc(100vh - 0.92rem);
  justify-content: center;
  align-items: center;
}
.empty-wrap {
  text-align: center;
}
.empty-img {
  width: 2rem;
  height: 0.77rem;
}
.empty-word {
  padding: 0.15rem 0 0.73rem 0;
  color: #94A5BE;
}
.empty-btn {
  width: 3rem;
  height: 1rem;
  background: #2DA3F6;
  border-radius: 0.08rem;
  color: #fff;
}
</style>
