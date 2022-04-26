<template>
  <div class="member-wrap">
    <van-nav-bar
      :title="$t('membermanage.title')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
    </van-nav-bar>
    <!--loading模块-->
    <Loading v-if="loading"></Loading>
    <template v-else>
    <div class="header">
      <van-image
        round
        fit="cover"
        :src="headerImg"
        class="user-header"
        @error="setDefaultHeader"/>
      <span class="user-phone">{{ memberInfo.nickname }}</span>
    </div>
    <div class="scroll-box">
      <div class="member-item" @click="handleRoleChange">
        <img src="../../assets/member-icon.png" class="icon-img"/>
        <span class="label">{{ $t('membermanage.role') }}</span>
        <p class="name">
          <span class="over">
            {{ roleName }}
          </span>
        <van-icon v-if="!isOwner" name="arrow" class="right-icon"/>
        </p>
      </div>
      <div v-if="userInfo.area_type=== 2" class="member-item" @click="handleDepartmentChange()">
        <img src="../../assets/department-icon.png" class="icon-img"/>
        <span class="label">{{ $t('membermanage.department') }}</span>
        <p class="name">
          <span class="over">
            {{ departmentName?departmentName:$t('membermanage.undivided') }}
          </span>
          <van-icon v-if="!isOwner" name="arrow" class="right-icon"/>
        </p>
      </div>
    </div>
    <div class="delete-btn-placeholder" v-if="delPermission&&!isOwner">
      <div class="delete-btn-box">
        <button class="delete-btn" @click="sureShow = true">{{ $t('global.del') }}</button>
      </div>
    </div>
    <div class="transfer-btn-placeholder" v-if="isOwner&&(userInfo.user_id===memberInfo.user_id)">
        <div class="transfer-btn-box">
          <button class="transfer-btn" @click="goTransferOwner">{{ $t('global.tra') }}</button>
        </div>
      </div>
    </template>
    <!-- 选择角色 -->
    <div class="sheet-part">
      <van-action-sheet
        v-model="sceneShow"
        :title="$t('membermanage.sheetTitle')">
        <div class="role-wrap">
          <van-checkbox-group v-model="result">
            <van-cell-group>
              <van-cell
                v-for="(role, index) in roleList"
                :key="role.value"
                clickable
                @click="toggle(index, 'role')">
                <template #title>
                  <p class="role-title" :class="{ 'role-active': result.includes(role.id) }">
                    <span class="role-name one-line float-l">
                      {{ role.name }}
                    </span>
                  </p>
                </template>
                <template #right-icon>
                  <van-checkbox :name="role.id" ref="checkboxes">
                    <template #icon="props">
                      <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                    </template>
                  </van-checkbox>
                </template>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
          <div class="confirm-btn-placeholder">
            <div class="confirm-btn-box">
              <van-button
                class="confirm-btn"
                :loading="saveLoading"
                :loading-text="$t('global.saving')"
                :disabled="!result.length || saveLoading"
                @click="roleChange">{{ $t('global.confirm') }}</van-button>
            </div>
          </div>
        </div>
      </van-action-sheet>
    </div>
    <!-- 选择部门 -->
    <div class="sheet-part">
      <van-action-sheet
        v-model="departmentShow"
        :title="$t('membermanage.sheetTitle2')">
        <div class="role-wrap">
          <van-checkbox-group v-model="departmentResult">
            <van-cell-group>
              <van-cell
                v-for="(department, index) in departmentList"
                :key="department.id"
                clickable
                @click="toggle(index, 'department')">
                <template #title>
                  <p class="role-title" :class="{ 'role-active': departmentResult.includes(department.id) }">
                    <span class="role-name one-line float-l">
                      {{ department.name }}
                    </span>
                  </p>
                </template>
                <template #right-icon>
                  <van-checkbox :name="department.id" ref="departmentCheckboxes">
                    <template #icon="props">
                      <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                    </template>
                  </van-checkbox>
                </template>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
          <div class="confirm-btn-placeholder">
            <div class="confirm-btn-box">
              <van-button
                class="confirm-btn"
                :loading="saveLoading"
                :loading-text="$t('global.saving')"
                :disabled="saveLoading"
                @click="departmentChange">{{ $t('global.confirm') }}</van-button>
            </div>
          </div>
        </div>
      </van-action-sheet>
    </div>
    <!--删除确认弹窗-->
    <van-dialog
      v-model="sureShow"
      show-cancel-button
      :before-close="deleteMember"
      confirm-button-color="#2DA3F6"
      cancel-button-color="#94A5BE">
      <p class="delete-tip">{{ $t('membermanage.delTitle') }}</p>
    </van-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

const defaultHeader = require('../../assets/default-header.png')
const activeIcon = require('../../assets/check-box-icon.png')
const inactiveIcon = require('../../assets/uncheck-box-icon.png')

export default {
  name: 'memberManage',
  data() {
    return {
      loading: false,
      checked: true,
      sceneShow: false, // 角色选择
      sureShow: false, // 删除弹窗
      result: [], // 角色列表
      departmentResult: [], // 部门列表
      activeIcon,
      inactiveIcon,
      roleList: [],
      headerImg: '',
      userId: '', // 用户id
      isOwner: false,
      isSelf: false,
      memberInfo: {}, // 用户信息
      saveLoading: false,
      departmentShow: false,
      departmentList: []
    }
  },
  computed: {
    ...mapGetters(['area', 'userInfo', 'permissions']),
    delPermission() {
      return (this.permissions.delete_area_member && !(this.isOwner || this.isSelf))
    },
    roleName() {
      let role = ''
      if (this.memberInfo.role_infos) {
        this.memberInfo.role_infos.forEach((item) => {
          role += `${item.name}、`
        })
        return role.replace(/、$/, '')
      }
      return ''
    },
    departmentName() {
      let department = ''
      if (this.memberInfo.department_infos) {
        this.memberInfo.department_infos.forEach((item) => {
          department += `${item.name}、`
        })
        return department.replace(/、$/, '')
      }
      return ''
    }
  },
  methods: {
    setDefaultHeader() {
      this.headerImg = defaultHeader
    },
    onClickLeft() {
      this.$router.go(-1)
    },
    // 获取角色列表
    getRoleList() {
      if (!this.permissions.get_role) {
        return
      }
      this.http.getRoleList().then((res) => {
        if (res.status !== 0) {
          return
        }
        const { roles } = res.data
        this.roleList = roles.filter(item => item.id !== -1) || []
      })
    },
    // 获取角色列表
    getDepartmentList() {
      if (!this.permissions.get_department) {
        return
      }
      this.http.departmentsList().then((res) => {
        if (res.status !== 0) {
          return
        }
        const { departments } = res.data
        this.departmentList = departments.filter(item => item.id !== -1) || []
      })
    },
    // 获取成员详情
    getMemberDetail() {
      this.loading = true
      this.http.getUserDetail(this.userId).then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        this.isOwner = res.data.is_owner
        this.isSelf = res.data.is_self
        this.memberInfo = res.data || {}
        this.headerImg = res.data.avatar_url
        const roleList = this.memberInfo.role_infos || []
        const departmentList = this.memberInfo.department_infos || []
        this.result = roleList.map(item => item.id)
        this.departmentResult = departmentList.map(item => item.id)
      }).catch(() => {
        this.loading = false
      })
    },
    // 修改成员按钮
    handleRoleChange() {
      if (!this.permissions.update_area_member_role || this.isOwner) {
        return
      }
      this.sceneShow = true
      this.getRoleList()
    },
    // 修改部门按钮
    handleDepartmentChange() {
      if (!this.permissions.update_area_member_department) {
        return
      }
      this.departmentShow = true
      this.getDepartmentList()
    },
    // 选择角色
    toggle(index, type) {
      if (type === 'role') {
        this.$refs.checkboxes[index].toggle()
      } else {
        this.$refs.departmentCheckboxes[index].toggle()
      }
    },
    // 修改成员角色
    roleChange() {
      const params = {
        role_ids: this.result
      }
      this.saveLoading = true
      this.http.editUser(this.userId, params).then((res) => {
        this.saveLoading = false
        this.sceneShow = false
        if (res.status !== 0) {
          return
        }
        // 如果是自己修改自己的角色就要重新获取权限
        if (Number(this.userId) === this.userInfo.user_id) {
          this.$bus.$emit('updatePermission', this.userInfo.user_id)
        }
        // 修改本地名称
        const roleResult = []
        this.result.forEach((roleId) => {
          const role = this.roleList.find(item => item.id === roleId)
          roleResult.push(role)
        })
        this.memberInfo.role_infos = roleResult
        this.$toast(this.$t('membermanage.modify'))
      })
    },
    // 修改部门
    departmentChange() {
      const params = {
        department_ids: this.departmentResult
      }
      this.saveLoading = true
      this.http.editUser(this.userId, params).then((res) => {
        this.saveLoading = false
        this.departmentShow = false
        if (res.status !== 0) {
          return
        }
        // 如果是自己修改自己的角色就要重新获取权限
        if (Number(this.userId) === this.userInfo.user_id) {
          this.$bus.$emit('updatePermission', this.userInfo.user_id)
        }
        // 修改本地名称
        const departmentResult = []
        this.departmentResult.forEach((departmentId) => {
          const department = this.departmentList.find(item => item.id === departmentId)
          departmentResult.push(department)
        })
        this.memberInfo.role_infos = departmentResult
        this.getMemberDetail()
        this.$toast(this.$t('membermanage.modify'))
      })
    },
    // 删除成员
    deleteMember(action, done) {
      if (action === 'confirm') {
        this.http.deleteMember(this.userId).then((res) => {
          done()
          if (res.status !== 0) {
            return
          }
          this.onClickLeft()
        })
      } else {
        done()
      }
    },
    // 跳转转移拥有者
    goTransferOwner() {
      this.$router.push({ name: 'transferOwner' })
    }
  },
  created() {
    const { query } = this.$route
    this.userId = query.userId
    this.getMemberDetail()
  }
}
</script>
<style lang="scss" scoped>
.member-wrap {
  min-height: calc(100vh);
  background: $bgColor;
}
.header {
  display: flex;
  align-items: center;
  padding: 0.6rem 0.3rem;
  background: #fff;
  margin-bottom: 0.2rem;
}
.user-header {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  text-align: justify;
  margin-right: 0.27rem;
}
.user-phone {
  flex: 1;
  font-size: 0.4rem;
  font-weight: bold;
  color: #3F4663;
}
.member-item {
  display: flex;
  height: 1rem;
  align-items: center;
  padding: 0 0.4rem;
  background: #fff;
  margin-top: 1px;
  .label {
    flex: 1;
    font-size: 0.28rem;
    font-weight: bold;
    color: #3F4663;
  }
  .name {
    font-size: 0.28rem;
    color: #94A5BE;
  }
  .over {
    display: inline-block;
    max-width: 4.6rem;
    vertical-align: middle;
  }
  .right-icon {
    margin-left: 0.2rem;
    vertical-align: middle;
  }
}
.icon-img {
  height: 0.3rem;
  margin-right: 0.2rem;
}
.delete-btn-placeholder,.transfer-btn-placeholder {
  height: 1.6rem;
}
.delete-btn-box,.transfer-btn-box {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.3rem 0;
}
.delete-btn,.transfer-btn {
  width: 6.9rem;
  height: 1rem;
  background: #fff;
  border-radius: 0.2rem;
  color: #3F4663;
  font-weight: bold;
}
.role-wrap {
  height: 60vh;
  overflow-y: auto;
}
.confirm-btn-placeholder {
  height: 1.6rem;
}
.confirm-btn-box {
  position: absolute;
  left: 0.3rem;
  bottom: 0;
  padding: 0.3rem 0;
  background: #fff;
}
.confirm-btn {
  width: 6.9rem;
  height: 1rem;
  background: #F6F8FD;
  border-radius: 0.2rem;
  color: #3F4663;
  border: 0;
}
.role-title {
  font-size: 0.28rem;
  color: #94A5BE;
}
.role-active {
  color: #2DA3F6;
}
.role-name {
  max-width: 6rem;
  color: #3F4663;
}
.img-icon {
  height: 0.37rem;
}
.delete-tip {
  padding: 0.58rem 0.8rem;
  font-size: 0.28rem;
  font-weight: bold;
  line-height: 1.5;
  color: #3F4663;
  text-align: center;
}
</style>
<style scoped>
.role-wrap >>> .van-cell {
  padding: 0.4rem 0.35rem;
}
.role-wrap >>> .van-cell::after {
  left: 0;
  right: 0;
}
.sheet-part >>> .van-action-sheet__header {
  padding: 0 0.4rem;
  font-size: 0.32rem;
  font-weight: bold;
  color: #3F4663;
  text-align: left;
}
.sheet-part >>> .van-action-sheet__close {
  font-size: 0.26rem;
  font-weight: bold;
  color: #3F4663;
}
</style>
