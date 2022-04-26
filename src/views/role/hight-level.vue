<template>
  <div class="advance-part">
    <van-action-sheet
      v-model="show"
      :round="false"
      @open="getData"
      :closeable="false">
      <div class="role-wrap">
        <van-nav-bar
          :title="$t('roleAdd.advanceTitle')"
          left-arrow
          :fixed="true"
          :placeholder="true">
          <template #left>
            <van-icon @click.stop="onClickLeft" name="arrow-left" color="#3F4663"/>
          </template>
          <template #right>
            <span @click.stop="deleteRole" class="sure-btn">{{ $t('global.confirm') }}</span>
          </template>
        </van-nav-bar>
        <div class="role-box" v-if="userInfo.area_type === 2">
          <div
            v-for="(department,index) in departmentsList"
            :key="index"
            class="room-part">
            <h2 class="room-title">{{ department.name }}</h2>
            <div
              v-for="device in department.devices"
              :key="device.id"
              class="role-part">
              <div class="role-top clearfix">
                <h3 class="float-l">{{ device.name }}</h3>
                <p
                  @click="selectAll(device)"
                  class="float-r"
                  :class="[wichClass(device)]">
                  {{ $t('roleAdd.selectAll') }}
                </p>
              </div>
              <div class="role-list">
                <div
                  v-for="item in device.permissions"
                  :key="item.permission.name"
                  class="role-item one-line"
                  :class="{ 'active': item.allow }"
                  @click="selectSingle(item)">{{ getPerName(item.permission.name) }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="role-box" v-else>
          <div
            v-for="(area,index) in areas"
            :key="index"
            class="room-part">
            <h2 class="room-title">{{ area.name }}</h2>
            <div
              v-for="device in area.devices"
              :key="device.id"
              class="role-part">
              <div class="role-top clearfix">
                <h3 class="float-l">{{ device.name }}</h3>
                <p
                  @click="selectAll(device)"
                  class="float-r"
                  :class="[wichClass(device)]">
                  {{ $t('roleAdd.selectAll') }}
                </p>
              </div>
              <div class="role-list">
                <div
                  v-for="item in device.permissions"
                  :key="item.permission.name"
                  class="role-item one-line"
                  :class="{ 'active': item.allow }"
                  @click="selectSingle(item)">{{ getPerName(item.permission.name) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getAttr } from '@/config/deviceAttr'

export default {
  name: 'hightLevel',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      show: this.value
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    areas() {
      return this.info.locations || []
    },
    departmentsList() {
      return this.info.departments || []
    }
  },
  watch: {
    value(val) {
      this.show = val
    },
    show(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    onClickLeft() {
      this.show = false
    },
    getPerName(attr) {
      return getAttr(attr)
    },
    // 样式控制
    wichClass(device) {
      const permissions = device.permissions || []
      const checkList = permissions.filter(item => item.allow)
      if (checkList.length === permissions.length) {
        return 'check'
      }
      if (checkList.length > 0) {
        return 'select'
      }
      return ''
    },
    deleteRole() {
      this.onClickLeft()
    },
    selectSingle(item) {
      const temp = item
      temp.allow = !temp.allow
    },
    selectAll(device) {
      const { permissions } = device
      const checkList = permissions.filter(item => item.allow)
      permissions.forEach((item) => {
        const temp = item
        if (checkList.length === permissions.length) {
          temp.allow = false
        } else {
          temp.allow = true
        }
      })
    },
    getData() {}
  }
}
</script>
<style lang="scss" scoped>
.role-wrap {
  min-height: 100vh;
  background: $bgColor;
}
.sure-btn {
  font-size: 0.28rem;
  font-weight: bold;
  color: #3F4663;
}
.role-name {
  padding: 0 0.3rem;
  width: 100%;
  height: 1rem;
  background: $bgColor;
  border-radius: 0.2rem;
  font-weight: bold;
  color: #505670;
}
.room-part {
  background: #fff;
  margin-top: 0.2rem;
  padding: 0 0.3rem;
}
.role-part {
  padding-bottom: 0.3rem;
  border-bottom: 0.01rem solid #eee;
}
.room-title {
  padding: 0.35rem 0;
  border-bottom: 0.01rem solid #eee;
  font-size: 0.32rem;
  font-weight: bold;
  color: #3F4663;
}
.role-top {
  padding-top: 0.34rem;
  h3 {
    font-size: 0.28rem;
    color: #3F4663;
  }
  p {
    position: relative;
    padding-right: 0.52rem;
    font-size: 0.28rem;
    color: #3F4663;
  }
  p:after {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 0.32rem;
    height: 0.32rem;
    background-size: 100% 100%;
    background-image: url('../../assets/uncheck-icon.png');
    content: '';
  }
  .select:after {
    background-image: url('../../assets/select-icon.png');
  }
  .check:after {
    background-image: url('../../assets/check-icon.png');
  }
}
.role-list {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -2.15%;
}
.role-item {
  padding: 0 0.1rem;
  width: 29%;
  height: 0.6rem;
  background: #fff;
  border: 0.01rem solid #ddd;
  border-radius: 0.08rem;
  font-size: 0.24rem;
  color: #94A5BE;
  text-align: center;
  line-height: 0.6rem;
  margin: 0.15rem 2.15%;
}
.role-item:nth-child(3n) {
  margin-right: 0;
}
.active {
  position: relative;
  background: #EAF6FE;
  border-color: #2DA3F6;
  color: #2DA3F6;
}
.active:after {
  content: '';
  position: absolute;
  top: -1PX;
  right: 0;
  width: 0.28rem;
  height: 0.28rem;
  background-size: 100% 100%;
  background-image: url(../../assets/check-icon-top-right.png);
}
</style>
