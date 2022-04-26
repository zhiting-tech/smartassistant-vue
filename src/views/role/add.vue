<template>
  <div class="role-wrap">
    <van-nav-bar
      :title="title"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft"
      @click-right="deleteRole">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
      <template v-if="roleId && permissions.delete_role" #right>
        <span class="delete-btn">{{ $t('global.del') }}</span>
      </template>
    </van-nav-bar>
    <!--loading模块-->
    <Loading v-if="loading"></Loading>
    <template v-else>
    <div class="role-box">
      <input
        v-model="roleName"
        :placeholder="$t('roleAdd.placeholder')"
        maxlength="20"
        class="role-name"/>
      <p class="label-word">{{ $t('roleAdd.label') }}</p>
      <div class="role-part" v-if="deviceRoleList.length>0">
        <div class="role-top clearfix">
          <h3 class="float-l">{{ $t('roleAdd.device') }}</h3>
          <p
            @click="selectAll(deviceRoleList)"
            class="float-r"
            :class="[whichClass(deviceRoleList)]">
            <span @click.stop="advanceShow = true" class="setting">{{ $t('roleAdd.advance') }}</span>
            {{ $t('roleAdd.selectAll') }}
          </p>
        </div>
        <div class="role-list">
          <div
            v-for="item in deviceRoleList"
            :key="item.permission.name"
            class="role-item one-line"
            :class="{ 'active': item.allow }"
            @click="selectSingle(item)">{{ item.permission.name }}</div>
        </div>
      </div>
      <div class="role-part" v-if="areaRoleList.length>0">
        <div class="role-top clearfix">
          <h3 class="float-l">{{ $t('roleAdd.family') }}</h3>
          <p
            @click="selectAll(areaRoleList)"
            class="float-r"
            :class="[whichClass(areaRoleList)]">{{ $t('roleAdd.selectAll') }}</p>
        </div>
        <div class="role-list">
          <div
            v-for="item in areaRoleList"
            :key="item.permission.name"
            class="role-item one-line"
            :class="{ 'active': item.allow }"
            @click="selectSingle(item)">{{ item.permission.name }}</div>
        </div>
      </div>
      <div class="role-part" v-if="companyRoleList.length>0">
        <div class="role-top clearfix">
          <h3 class="float-l">{{ $t('roleAdd.company') }}</h3>
          <p
            @click="selectAll(companyRoleList)"
            class="float-r"
            :class="[whichClass(companyRoleList)]">{{ $t('roleAdd.selectAll') }}</p>
        </div>
        <div class="role-list">
          <div
            v-for="item in companyRoleList"
            :key="item.permission.name"
            class="role-item one-line"
            :class="{ 'active': item.allow }"
            @click="selectSingle(item)">{{ item.permission.name }}</div>
        </div>
      </div>
      <div class="role-part" v-if="locationRoleList.length>0">
        <div class="role-top clearfix">
          <h3 class="float-l">{{ $t('roleAdd.room') }}</h3>
          <p
            @click="selectAll(locationRoleList)"
            class="float-r"
            :class="[whichClass(locationRoleList)]">{{ $t('roleAdd.selectAll') }}</p>
        </div>
        <div class="role-list">
          <div
            v-for="item in locationRoleList"
            :key="item.permission.name"
            class="role-item one-line"
            :class="{ 'active': item.allow }"
            @click="selectSingle(item)">{{ item.permission.name }}</div>
        </div>
      </div>
      <div class="role-part" v-if="departmentRoleList.length>0">
        <div class="role-top clearfix">
          <h3 class="float-l">{{ $t('roleAdd.department') }}</h3>
          <p
            @click="selectAll(departmentRoleList)"
            class="float-r"
            :class="[whichClass(departmentRoleList)]">{{ $t('roleAdd.selectAll') }}</p>
        </div>
        <div class="role-list">
          <div
            v-for="item in departmentRoleList"
            :key="item.permission.name"
            class="role-item one-line"
            :class="{ 'active': item.allow }"
            @click="selectSingle(item)">{{ item.permission.name }}</div>
        </div>
      </div>
      <div class="role-part" v-if="sceneRoleList.length>0">
        <div class="role-top clearfix">
          <h3 class="float-l">{{ $t('roleAdd.scene') }}</h3>
          <p
            @click="selectAll(sceneRoleList)"
            class="float-r"
            :class="[whichClass(sceneRoleList)]">{{ $t('roleAdd.selectAll') }}</p>
        </div>
        <div class="role-list">
          <div
            v-for="item in sceneRoleList"
            :key="item.permission.name"
            class="role-item one-line"
            :class="{ 'active': item.allow }"
            @click="selectSingle(item)">{{ item.permission.name }}</div>
        </div>
      </div>
      <div class="role-part" v-if="roleList.length>0">
        <div class="role-top clearfix">
          <h3 class="float-l">{{ $t('roleAdd.role') }}</h3>
          <p
            @click="selectAll(roleList)"
            class="float-r"
            :class="[whichClass(roleList)]">{{ $t('roleAdd.selectAll') }}</p>
        </div>
        <div class="role-list">
          <div
            v-for="item in roleList"
            :key="item.permission.name"
            class="role-item one-line"
            :class="{ 'active': item.allow }"
            @click="selectSingle(item)">{{ item.permission.name }}</div>
        </div>
      </div>
    </div>
    <div v-if="permissions.update_role" class="save-btn-placeholder">
      <div class="save-btn-box">
        <van-button
          :loading="addLoading"
          :loading-text="$t('global.saving')"
          :disabled="!canSave || addLoading"
          class="save-btn"
          @click="handleSave">{{ $t('global.save') }}</van-button>
      </div>
    </div>
    </template>
    <HightLevel
      v-model="advanceShow"
      :info="deviceAdvanced"/>
    <!--删除确认弹窗-->
    <van-dialog
      v-model="dialogShow"
      show-cancel-button
      :before-close="handleConfirm"
      confirm-button-color="#2DA3F6"
      cancel-button-color="#94A5BE">
      <h3 class="delete-title">{{ $t('roleAdd.delTitle') }}</h3>
      <p class="delete-tip">{{ $t('roleAdd.delContent') }}</p>
    </van-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import HightLevel from './hight-level.vue'

export default {
  name: 'roleAdd',
  components: {
    HightLevel
  },
  data() {
    return {
      roleName: '',
      roleId: 0,
      loading: false,
      advanceShow: false,
      roleDetail: {},
      dialogShow: false, // 删除弹窗
      isControlInit: true, // 判断设备权限是否是初始值
      isUpdateInit: true, // 判断设备权限是否是初始值
      isDeleteInit: true, // 判断设备权限是否是初始值
      isManageInit: true, // 判断设备权限是否是初始值
      addLoading: false
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    title() {
      if (this.roleId) {
        return this.$t('roleAdd.editTitle')
      }
      return this.$t('roleAdd.addTitle')
    },
    canSave() {
      return this.roleName.trim() !== ''
    },
    deviceRoleList() {
      return this.roleDetail.device || []
    },
    areaRoleList() {
      return this.roleDetail.area || []
    },
    locationRoleList() {
      return this.roleDetail.location || []
    },
    sceneRoleList() {
      return this.roleDetail.scene || []
    },
    roleList() {
      return this.roleDetail.role || []
    },
    deviceAdvanced() {
      return this.roleDetail.device_advanced || {}
    },
    companyRoleList() {
      return this.roleDetail.company || []
    },
    departmentRoleList() {
      return this.roleDetail.department || []
    },
    // 控制设备 用于监听
    controlDevice() {
      return this.deviceRoleList.find(item => item.permission.action === 'control')
    },
    // 修改设备
    updateDevice() {
      return this.deviceRoleList.find(item => item.permission.action === 'update')
    },
    // 删除设备
    deleteDevice() {
      return this.deviceRoleList.find(item => item.permission.action === 'delete')
    },
    // 管理设备
    manageDevice() {
      return this.deviceRoleList.find(item => item.permission.action === 'manage')
    }
  },
  watch: {
    controlDevice: {
      deep: true,
      handler(val) {
        if (this.isControlInit) {
          // 第一次进来取接口的值
          this.isControlInit = false
          return
        }
        this.handleDevicePermission(val)
      }
    },
    updateDevice: {
      deep: true,
      handler(val) {
        if (this.isUpdateInit) {
          // 第一次进来取接口的值
          this.isUpdateInit = false
          return
        }
        this.handleDevicePermission(val)
      }
    },
    deleteDevice: {
      deep: true,
      handler(val) {
        if (this.isDeleteInit) {
          // 第一次进来取接口的值
          this.isDeleteInit = false
          return
        }
        this.handleDevicePermission(val)
      }
    },
    manageDevice: {
      deep: true,
      handler(val) {
        if (this.isManageInit) {
          // 第一次进来取接口的值
          this.isManageInit = false
          return
        }
        this.handleDevicePermission(val)
      }
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    // 权限高级联动
    handleDevicePermission(control) {
      const { permission } = control
      if (this.deviceAdvanced.locations) {
        this.deviceAdvanced.locations.forEach((area) => {
          area.devices.forEach((device) => {
            const permissions = device.permissions || []
            permissions.forEach((per) => {
              if (per.permission.action === permission.action) {
                per.allow = control.allow
              }
            })
          })
        })
      }
      if (this.deviceAdvanced.departments) {
        // 修改设备
        this.deviceAdvanced.departments.forEach((department) => {
          department.devices.forEach((device) => {
            const permissions = device.permissions || []
            permissions.forEach((per) => {
              if (per.permission.action === permission.action) {
                per.allow = control.allow
              }
            })
          })
        })
      }
    },
    // 样式控制
    whichClass(list) {
      const checkList = list.filter(item => item.allow)
      if (checkList.length === list.length) {
        return 'check'
      }
      if (checkList.length > 0) {
        return 'select'
      }
      return ''
    },
    deleteRole() {
      this.dialogShow = true
    },
    // 处理确认删除
    handleConfirm(action, done) {
      if (action === 'confirm') {
        this.http.deleteRole(this.roleId).then((res) => {
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
    // 获取角色详情
    initData() {
      this.loading = true
      this.http.getRoleDetail(this.roleId).then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        const { role } = res.data || {}
        const { permissions } = role
        this.roleName = role.name
        this.roleDetail = permissions || {}
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取角色模板
    initTemp() {
      this.loading = true
      this.http.getRoleTemp().then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        const { role } = res.data || {}
        const { permissions } = role
        this.roleDetail = permissions || {}
      }).catch(() => {
        this.loading = false
      })
    },
    // 处理前端保存校验
    verify() {
      if (
        !this.deviceRoleList.find(item => item.allow)
        && !this.areaRoleList.find(item => item.allow)
        && !this.locationRoleList.find(item => item.allow)
        && !this.sceneRoleList.find(item => item.allow)
        && !this.roleList.find(item => item.allow)
        && !this.companyRoleList.find(item => item.allow)
        && !this.departmentRoleList.find(item => item.allow)
      ) {
        this.$toast(this.$t('roleAdd.roleEerror'))
        return false
      }
      return true
    },
    // 处理保存按钮
    handleSave() {
      if (!this.verify()) {
        return
      }
      const name = this.roleName.trim()
      const permissions = {
        device: this.deviceRoleList,
        area: this.areaRoleList,
        location: this.locationRoleList,
        scene: this.sceneRoleList,
        role: this.roleList,
        device_advanced: this.deviceAdvanced,
        company: this.companyRoleList,
        department: this.departmentRoleList
      }
      const params = {
        name,
        permissions
      }
      this.addLoading = true
      if (this.roleId) {
        this.http.editRole(this.roleId, params).then((res) => {
          this.addLoading = false
          if (res.status !== 0) {
            return
          }
          this.$toast(this.$t('global.saveSuccess'))
          this.onClickLeft()
        })
      } else {
        this.http.addRole(params).then((res) => {
          this.addLoading = false
          if (res.status !== 0) {
            return
          }
          this.$toast(this.$t('global.saveSuccess'))
          this.onClickLeft()
        })
      }
    },
    selectSingle(item) {
      const temp = item
      temp.allow = !temp.allow
    },
    selectAll(list) {
      const checkList = list.filter(item => item.allow)
      list.forEach((item) => {
        const temp = item
        if (checkList.length === list.length) {
          temp.allow = false
        } else {
          temp.allow = true
        }
      })
    }
  },
  created() {
    const { query } = this.$route
    if (query.id) {
      this.roleId = Number(query.id)
      this.initData()
    } else {
      this.initTemp()
    }
  }
}
</script>
<style lang="scss" scoped>
.delete-btn {
  font-size: 0.28rem;
  font-weight: bold;
  color: #3F4663;
}
.role-box {
  padding: 0.2rem 0.3rem;
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
.role-box input::-webkit-input-placeholder {
  color: #94A5BE;
}
.label-word {
  padding: 0.45rem 0 0.4rem 0;
  font-size: 0.22rem;
  font-weight: bold;
  color: #94A5BE;
}
.role-part {
  margin-bottom: 0.8rem;
}
.role-top {
  h3 {
    font-size: 0.36rem;
    font-weight: bold;
    color: #3F4663;
  }
  .setting {
    color: #2DA3F6;
    margin-right: 0.4rem;
  }
  p {
    position: relative;
    padding-right: 0.52rem;
    font-weight: bold;
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
  margin: 0 -.22rem;
}
.role-item {
  padding: 0 0.1rem;
  width: 2rem;
  height: 0.6rem;
  background: #fff;
  border: 0.01rem solid #ddd;
  border-radius: 0.08rem;
  font-size: 0.24rem;
  color: #94A5BE;
  text-align: center;
  line-height: 0.6rem;
  margin: .15rem .22rem;
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
.save-btn-placeholder {
  width: 100%;
  height: 1rem;
  background: #fff;
}
.save-btn-box {
  position: fixed;
  padding: 0.3rem 0;
  width: 7.5rem;
  background: #fff;
  z-index: 99;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  text-align: center;
}
.save-btn {
  width: 6.9rem;
  height: 1rem;
  background: #2DA3F6;
  border: 0;
  border-radius: 0.2rem;
  color: #fff;
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
<style scoped>
.advance-part >>> .van-action-sheet {
  height: 100%;
  max-height: 100%;
}
</style>
