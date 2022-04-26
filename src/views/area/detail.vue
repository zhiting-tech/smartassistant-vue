<template>
  <div class="wrapper">
    <van-nav-bar
      :title="title"
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
      <div class="detail-box">
        <div class="item clearfix" @click="permissions.update_area_name || permissions.update_area_company_name ? show = true : noPermissionTip()">
          <span class="item__label one-line float-l">{{ $t('areaDetail.name') }}</span>
          <p class="item__name float-r">
            <span class="one-line">{{ areaInfo.name }}</span>
            <van-icon name="arrow" class="item__icon"/>
          </p>
        </div>
        <div v-if="userInfo.area_type === 1" @click="toAreaManage" class="item clearfix">
          <span class="item__label one-line float-l">{{ $t('areaDetail.area') }}</span>
          <span class="item__name float-r">
            {{ areaInfo.location_count ?areaInfo.location_count : '' }}
            <van-icon name="arrow" class="item__icon"/>
          </span>
        </div>
        <div v-if="permissions.get_area_invite_code" @click="userInfo.area_type === 1?sceneShow = true:departmentSceneShow = true" class="item clearfix">
          <span class="item__label one-line float-l">{{ $t('areaDetail.code') }}</span>
          <span class="item__name float-r">
            <van-icon name="arrow" class="item__icon"/>
          </span>
        </div>
        <div v-if="userInfo.area_type === 2" @click="toDepartmentManage" class="item clearfix">
          <span class="item__label one-line float-l">{{ $t('areaDetail.department') }}</span>
          <span class="item__name float-r">
            {{ areaInfo.department_count }}
            <van-icon name="arrow" class="item__icon"/>
          </span>
        </div>
        <div @click="permissions.get_role ? toRoleList() : noPermissionTip()" class="item clearfix">
          <span class="item__label one-line float-l">{{ $t('areaDetail.role') }}</span>
          <span class="item__name float-r">
            {{ areaInfo.role_count }}
            <van-icon name="arrow" class="item__icon"/>
          </span>
        </div>
        <div class="item clearfix" v-if="userInfo.is_owner">
          <span class="item__label one-line float-l">{{ $t('areaDetail.verify') }}</span>
          <span class="item__name float-r">
            <van-button type="info" size="small" @click="getVerify()">{{ $t('areaDetail.creat') }}</van-button>
          </span>
        </div>
      </div>
      <div v-if="MemberList.length" class="role-list">
        <div class="role-title">{{ $t('areaDetail.member') }}（{{ MemberList.length }}{{ $t('areaDetail.man') }}）</div>
        <div
          v-for="member in MemberList"
          :key="member.user_id" class="role-item"
          @click="toMemberManage(member.user_id)">
          <div class="role-left">
            <img :src="member.avatar_url?member.avatar_url:faceHeader">
          </div>
          <div class="role-right">
            <p class="user-name">{{ member.nickname }}</p>
            <p class="role-name">{{ getMemberRole(member) }}</p>
            <van-icon name="arrow" class="role-item__icon"/>
          </div>
        </div>
      </div>
      <!--demo嵌入隐藏-->
      <template v-if="!isInsert">
        <div class="op-btn-placeholder" v-if="!userInfo.is_owner">
          <div class="op-btn-box">
            <button @click="handleQuit" class="op-btn">{{ userInfo.area_type === 2?$t('areaDetail.quitCompany'):$t('areaDetail.quitFamily') }}</button>
          </div>
        </div>
        <div class="op-btn-placeholder" v-else>
          <div class="op-btn-box">
            <button @click="handleDelete" class="op-btn">{{ userInfo.area_type === 2?$t('areaDetail.disband'):$t('global.del') }}</button>
          </div>
        </div>
      </template>
    </template>
    <!--修改名称弹窗-->
    <NameSheet
      v-model="show"
      :title="$t('areaDetail.sheetTitle')"
      :init="areaInfo.name"
      :loading="nameLoading"
      @on-confirm="editAreaName"/>
    <!--删除确认弹窗-->
    <van-dialog
      v-model="dialogShow"
      show-cancel-button
      :before-close="handleConfirm"
      confirm-button-color="#2DA3F6"
      cancel-button-color="#94A5BE">
      <h3 class="delete-title">{{ dialogInfo.title }}</h3>
      <div class="delete-tip">
        <p>{{ dialogInfo.content }}</p>
        <van-checkbox v-if="userInfo.is_owner" v-model="deleteChecked" icon-size=".35rem" checked-color="#FF0000"><span  class="checked-text">{{$t('global.isDelChecked')}}</span></van-checkbox>
      </div>
    </van-dialog>
    <!-- 选择角色 -->
    <div class="sheet-part">
      <van-action-sheet
        v-model="sceneShow"
        :title="$t('areaDetail.roleTitle')">
        <div class="sheet-role-wrap">
          <div class="sheet-title-placeholder">
            <div class="sheet-title">
              <h3>{{ $t('areaDetail.roleTip1') }}</h3>
              <p>{{ $t('areaDetail.roleTip2') }}</p>
            </div>
          </div>
          <div class="role-scroll-box">
            <van-checkbox-group v-model="result">
              <van-cell-group>
                <van-cell
                  v-for="(role, index) in roleList"
                  :key="role.value"
                  clickable
                  @click="toggle(index)">
                  <template #title>
                    <p class="sheet-role-title" :class="{ 'sheet-role-active': result.includes(role.id) }">
                      <span class="sheet-role-name one-line float-l">
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
          </div>
          <div class="invite-btn-placeholder">
            <div class="invite-btn-box">
              <van-button
                class="invite-btn"
                :loading="makeLoading"
                :loading-text="$t('areaDetail.invite')"
                :disabled="makeLoading"
                :class="{ 'disabled': !result.length }"
                @click="makeInviteCode">{{ $t('areaDetail.invite') }}</van-button>
            </div>
          </div>
        </div>
      </van-action-sheet>
    </div>
    <!--邀请码弹窗组件-->
    <InviteCode
      v-model="inviteShow"
      :src="qrCode"
      :code="codeInfo"/>
    <!--获取验证码弹窗-->
    <van-dialog
      v-model="verifyShow"
      show-cancel-button
      :before-close="handleVerify"
      confirm-button-color="#2DA3F6"
      cancel-button-color="#94A5BE"
      :cancelButtonText="$t('global.copy')"
      :confirmButtonText="$t('global.confirm')">
      <h3 class="verify-title">{{ $t('areaDetail.verify') }}</h3>
      <p class="verify-tips">{{ $t('areaDetail.effective') }}</p>
      <div class="verify-code">
        <p>{{verifyCode}}</p>
      </div>
    </van-dialog>
    <!-- 公司添加部门跟角色生成二维码 -->
    <div class="sheet-part">
      <van-action-sheet
        v-model="departmentSceneShow"
        :title="$t('areaDetail.roleTitle')">
        <div class="invite-target-wrap">
          <div class="invite-target-title">
            <h3>{{ $t('areaDetail.roleTip1') }}</h3>
            <p>{{ $t('areaDetail.roleTip3') }}</p>
          </div>
          <div class="invite-target-box">
            <van-cell :value="departmentName" is-link value-class="content" @click="departmentShow = true">
              <template #title>
                <span class="custom-title">{{$t('areaDetail.department')}}</span>
              </template>
            </van-cell>
            <van-cell :value="roleName" is-link value-class="content" @click="roleShow = true">
              <template #title>
                <span class="custom-title">{{$t('areaDetail.role')}}</span>
              </template>
            </van-cell>
          </div>
          <div class="invite-btn-placeholder">
            <div class="invite-btn-box">
              <van-button
                class="invite-btn"
                :loading="makeLoading"
                :loading-text="$t('areaDetail.invite')"
                :disabled="makeLoading"
                :class="{ 'disabled': !result.length }"
                @click="makeInviteCode">{{ $t('areaDetail.invite') }}</van-button>
            </div>
          </div>
        </div>
      </van-action-sheet>
    </div>
    <!--选择部门-->
    <div class="department-part">
      <van-action-sheet v-model="departmentShow" :title="$t('areaDetail.department')">
        <div class="content">
          <div class="department-list">
            <van-radio-group v-model="selectId">
              <van-cell-group >
                <van-cell v-for="(member,index) in departmentList" :key="index" clickable @click="selectId = member.id">
                  <template #title>
                    <div class="department-item">
                      <div class="user-name one-line">
                        {{ member.name }}
                      </div>
                    </div>
                  </template>
                  <template #right-icon>
                    <van-radio :name="member.id" />
                  </template>
                </van-cell>
              </van-cell-group>
            </van-radio-group>
          </div>
          <div class="btn-box">
            <van-button
              type="default"
              block
              @click="handleSure('department')"
              :disabled="!selectId">
              {{ $t('global.confirm') }}</van-button>
          </div>
        </div>
      </van-action-sheet>
    </div>
    <!--选择角色-->
    <div class="role-part">
      <van-action-sheet v-model="roleShow" :title="$t('areaDetail.role')">
        <div class="content">
          <div class="role-list">
            <van-checkbox-group v-model="result">
              <van-cell-group>
                <van-cell
                  v-for="(role, index) in roleList"
                  :key="role.value"
                  clickable
                  @click="toggle(index)">
                  <template #title>
                    <p class="sheet-role-title" :class="{ 'sheet-role-active': result.includes(role.id) }">
                      <span class="sheet-role-name one-line float-l">
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
          </div>
          <div class="btn-box">
            <van-button
              type="default"
              block
              @click="handleSure('role')"
              :disabled="!result.length">
              {{ $t('global.confirm') }}</van-button>
          </div>
        </div>
      </van-action-sheet>
    </div>
    <!--删除成功弹窗-->
    <van-dialog
      v-model="delSuccess"
      :before-close="sureConfirm"
      confirm-button-color="#2DA3F6"
      cancel-button-color="#94A5BE">
      <h3 class="delete-title">{{ $t('areaDetail.tips') }}</h3>
      <div class="delete-tip">
        <p>{{ $t('areaDetail.deleteArea') }}</p>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import NameSheet from '@/components/NameSheet.vue'
import clip from '@/utils/clipboard'
import InviteCode from './components/InviteCode.vue'

const activeIcon = require('../../assets/check-box-icon.png')
const inactiveIcon = require('../../assets/uncheck-box-icon.png')
const faceHeader = require('../../assets/default-header.png')

export default {
  name: 'areaDetail',
  components: {
    NameSheet,
    InviteCode
  },
  data() {
    return {
      areaInfo: {},
      show: false,
      dialogShow: false,
      deleteChecked: false,
      dialogType: 'quit', // quit 退出 delete 删除
      loading: false,
      nameLoading: false,
      makeLoading: false,
      sceneShow: false, // 生成邀请码弹窗
      result: [], // 选择生成的角色
      activeIcon,
      inactiveIcon,
      faceHeader,
      inviteShow: false, // 邀请弹窗控制
      roleList: [], // 角色列表
      MemberList: [], // 成员列表
      qrCode: '',
      userName: '', // 用户名称
      position: 0,
      verifyShow: false,
      verifyCode: '345fos',
      departmentSceneShow: false,
      departmentName: this.$t('global.departmentPlaceholder'),
      roleName: this.$t('global.rolePlaceholder'),
      departmentId: 0,
      selectId: 0,
      finishLoading: false,
      departmentList: [],
      departmentShow: false,
      roleShow: false,
      delSuccess: false
    }
  },
  computed: {
    ...mapGetters(['area', 'userInfo', 'permissions', 'isInsert']),
    title() {
      if (this.userInfo.area_type === 1) {
        return this.$t('areaDetail.familyTitle')
      }
      return this.$t('areaDetail.companyTitle')
    },
    id() {
      return this.area.id
    },
    dialogInfo() {
      if (this.dialogType === 'quit') {
        return {
          title: this.$t('areaDetail.quitTitle'),
          content: this.$t('areaDetail.quitContent')
        }
      }
      return {
        title: this.$t('areaDetail.delTitle'),
        content: this.$t('areaDetail.delContent'),
      }
    },
    codeInfo() {
      return {
        name: this.userName,
        areaName: this.areaInfo.name
      }
    }
  },
  watch: {
    title() {
      if (this.userInfo.mode === 1) {
        return this.$t('areaDetail.familyTitle')
      }
      return this.$t('areaDetail.companyTitle')
    }
  },
  methods: {
    ...mapActions(['setToken', 'setArea']),
    onClickLeft() {
      this.$router.go(-1)
    },
    toAreaManage() {
      this.$router.push({
        name: 'locationManage',
        query: {
          id: this.id
        }
      })
    },
    toDepartmentManage() {
      this.$router.push({
        name: 'departmentManage',
        query: {
          id: this.id
        }
      })
    },
    toRoleList() {
      this.$router.push({
        name: 'roleList'
      })
    },
    // 没有权限提示
    noPermissionTip() {
      this.$toast(this.$t('global.noPermission'))
    },
    // 获取用户角色
    getMemberRole(member) {
      let role = ''
      if (member.role_infos) {
        member.role_infos.forEach((item) => {
          role += `${item.name}、`
        })
        return role.replace(/、$/, '')
      }
      return ''
    },
    // 初始化列表
    initList() {
      this.loading = true
      this.http.getAreaDetail(this.id).then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        this.areaInfo = res.data
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取用户信息
    getUserInfo() {
      this.http.getUserDetail(this.userInfo.user_id).then((res) => {
        if (res.status !== 0) {
          return
        }
        this.userName = res.data.nickname
      })
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
    // 获取成员列表
    getMemberList() {
      this.http.getUser().then((res) => {
        if (res.status !== 0) {
          return
        }
        const { users } = res.data
        this.MemberList = users || []
      })
    },
    // 选择角色
    toggle(index) {
      this.$refs.checkboxes[index].toggle()
    },
    // 生成邀请码
    makeInviteCode() {
      const userId = this.userInfo.user_id
      const params = {
        role_ids: this.result,
        department_ids: this.departmentId ? [this.departmentId] : []
      }
      if (!this.result.length) {
        this.$toast(this.$t('global.rolePlaceholder'))
        return
      }
      if (this.userInfo.area_type === 2) {
        if (!this.departmentId) {
          this.$toast(this.$t('global.departmentPlaceholder'))
          return
        }
      }
      this.makeLoading = true
      this.http.getInvitationCode(userId, params).then((res) => {
        this.makeLoading = false
        if (res.status !== 0) {
          return
        }
        const { qr_code: qrCode } = res.data
        this.qrCode = qrCode
        this.inviteShow = true
      }).catch(() => {
        this.makeLoading = false
      })
    },
    // 修改家庭名称
    editAreaName(name) {
      const area = name.trim()
      if (area === '') {
        this.$toast(this.$t('areaDetail.empty'))
        return
      }
      const params = {
        name: area
      }
      this.nameLoading = true
      this.http.editAreaName(this.id, params).then((res) => {
        this.nameLoading = false
        if (res.status !== 0) {
          return
        }
        this.areaInfo.name = area
        this.show = false
        this.$toast(this.$t('global.saveSuccess'))
        this.area.name = area
        this.setArea(this.area)
      }).catch(() => {
        this.nameLoading = false
      })
    },
    // 处理弹窗确定按钮
    handleConfirm(action, done) {
      if (action === 'confirm') {
        if (this.dialogType === 'quit') {
          this.quit()
        } else {
          this.deleteArea()
        }
      } else {
        done()
      }
    },
    deleteArea() {
      // 删除家庭
      this.http.deleteArea(this.id, { is_del_cloud_disk: this.deleteChecked }).then((res) => {
        this.dialogShow = false
        if (res.status !== 0) {
          return
        }
        if (res.data.remove_status === 1) {
          if (this.deleteChecked) {
            this.delSuccess = true
          } else {
            this.$toast(this.$t('global.delSuccess'))
            this.$router.push({
              name: 'professionLogin'
            })
          }
        }
      })
    },
    // handleQuit
    handleQuit() {
      this.dialogType = 'quit'
      this.dialogShow = true
    },
    handleDelete() {
      this.dialogType = 'delete'
      this.dialogShow = true
    },
    // 退出家庭
    quit() {
      this.http.quitArea(this.area.id, this.userInfo.user_id).then((res) => {
        this.dialogShow = false
        if (res.status !== 0) {
          return
        }
        this.setToken('')
        this.$methods.setStore('token', '')
        this.$router.push({
          name: 'professionLogin'
        })
      })
    },
    // 去成员管理页面
    toMemberManage(userId) {
      const params = {
        position: this.position
      }
      this.changeQuery(params)
      setTimeout(() => {
        this.$router.push({
          name: 'memberManage',
          query: {
            userId,
            type: 'role'
          }
        })
      }, 300)
    },
    // 修改浏览地址参数， 保证返回能定位
    changeQuery(params) {
      // 修改浏览器参数值
      const { query, path } = this.$router.history.current
      // 对象的拷贝
      const newQuery = JSON.parse(JSON.stringify(query))
      // 地址栏的参数值赋值
      Object.assign(newQuery, params)
      this.$router.replace({ path, query: newQuery })
    },
    // 获取滚动条与顶端距离
    handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      this.position = scrollTop
    },
    // 获取验证码
    getVerify() {
      this.$toast.loading({
        message: this.$t('global.loadingVerify'),
        forbidClick: true,
      })
      this.http.verification().then((res) => {
        this.$toast.clear()
        if (res.status !== 0) {
          return
        }
        this.verifyCode = res.data.code
        this.verifyShow = true
      })
    },
    handleVerify(action, done) {
      if (action === 'confirm') {
        setTimeout(done, 100)
      } else {
        this.handleCopy(this.verifyCode, window.event)
        done()
      }
    },
    // 复制
    handleCopy(text, event) {
      clip(text, event)
    },
    // 部门列表
    getDepartmentList() {
      this.loading = true
      this.http.departmentsList().then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        const { departments } = res.data
        this.departmentList = departments || []
      }).catch(() => {
        this.loading = false
      })
    },
    handleSure(type) {
      if (type === 'department') {
        this.departmentId = this.selectId
        this.departmentName = this.departmentList.find(item => item.id === this.departmentId).name || '请选择部门'
        this.departmentShow = false
      }
      if (type === 'role') {
        const roleList = []
        this.roleList.forEach((role) => {
          this.result.forEach((id) => {
            if (role.id === id) {
              roleList.push(role)
            }
          })
        })
        let res = ''
        roleList.forEach((item) => {
          res += `${item.name}、`
        })
        this.roleName = res.replace(/、$/, '')
        this.roleShow = false
      }
    },
    sureConfirm() {
      this.delSuccess = false
      this.$router.push({
        name: 'professionLogin'
      })
    }
  },
  created() {
    this.initList()
    this.getUserInfo()
    this.getRoleList()
    this.getMemberList()
    this.getDepartmentList()
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    this.$nextTick(() => {
      // 实现滚动效果
      setTimeout(() => {
        const { query, path } = this.$route
        if (query.position || Number(query.position) >= 60) {
          document.documentElement.scrollTop = Number(query.position)
          document.body.scrollTop = Number(query.position)
          // 对象的拷贝
          const newQuery = JSON.parse(JSON.stringify(query))
          delete newQuery.position
          // 地址栏的参数值赋值
          this.$router.replace({ path, query: newQuery })
        }
      }, 500)
    })
  }
}
</script>
<style lang="scss" scoped>
  .wrapper{
    height: 100vh;
  }
.detail-box {
  margin-top: 1PX;
}
.item {
  line-height: 1.1;
  padding: 0.2rem 0.3rem;
  background: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  height: 1rem;
}
.item__label {
  display: inline-block;
  font-size: 0.28rem;
  color: #3F4663;
  flex: 1;
}
.item__name {
  font-size: 0.28rem;
  color: #94A5BE;
  span {
    display: inline-block;
    max-width: 4.8rem;
  }
  .van-button{
    background-color: #EAF6FE;
    color: #2DA3F6;
    border-color: #2DA3F6;
    width: 1.2rem;
    border-radius: .08rem;
    font-weight: 500;
  }
}
.item__icon {
  margin-left: 0.25rem;
  vertical-align: top;
  color: #ccc;
}
.op-btn-placeholder {
  height: 1.6rem;
}
.op-btn-box {
  position: fixed;
  width: 100%;
  max-width: 7.5rem;
  left: 50%;
  bottom: 0;
  padding: 0.3rem 0;
  background: $bgColor;
  transform: translateX(-50%);
  text-align: center;
}
.op-btn {
  width: 6.9rem;
  height: 1rem;
  background: #fff;
  border-radius: 0.2rem;
  font-size: 0.28rem;
  font-weight: bold;
  color: #3F4663;
}
.delete-title {
  padding-top: 0.53rem;
  text-align: center;
  font-size: 0.28rem;
  font-weight: bold;
  color: #3F4663;
}
.delete-tip {
  padding: 0.23rem 0.4rem 0.3rem 0.4rem;
  p{
    font-size: .28rem;
    font-weight: bold;
    line-height: 1.5;
    color: #3F4663;
    margin-bottom: .15rem;
  }
  .checked-text{
    font-size: .28rem;
    color: #FF0000;
    font-weight: bold;
  }
}
.role-list {
  background: #fff;
  margin-top: 0.2rem;
}
.role-title {
  padding: 0.27rem 0.3rem 0.12rem 0.3rem;
  font-size: 0.24rem;
  color: #94A5BE;
}
.role-item {
  display: flex;
  padding: 0.2rem 0.3rem;
  border-bottom: 0.01rem solid #eee;
}
.role-left {
  img {
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 0.3rem;
  }
}
.role-right {
  position: relative;
  flex: 1;
}
.user-name {
  padding-top: 0.08rem;
  font-size: 0.28rem;
  color: #3F4663;
}
.role-name {
  padding-top: 0.1rem;
  padding-right: 0.4rem;
  font-size: 0.24rem;
  color: #94A5BE;
  text-align: justify;
}
.role-item__icon {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  color: #ccc;
}
.sheet-role-wrap {
  position: relative;
  height: 60vh;
}
.role-scroll-box {
  padding-top: 1.6rem;
  height: calc(60vh - 1.6rem);
  overflow-y: scroll;
}
.sheet-title-placeholder {
  height: 0;
}
.sheet-title {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
  padding: 0.3rem 0.4rem;
  background: #fff;
  h3 {
    font-size: 0.32rem;
    font-weight: bold;
    color: #3F4663;
  }
  p {
    padding-top: 0.16rem;
    font-size: 0.22rem;
    color: #3F4663;
  }
}
.sheet-role-title {
  font-size: 0.28rem;
  color: #94A5BE;
}
.sheet-role-active {
  color: #2DA3F6;
}
.sheet-role-name {
  max-width: 6rem;
}
.img-icon {
  height: 0.37rem;
}
.invite-btn-placeholder {
  height: 1.6rem;
}
.invite-btn-box {
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 0.3rem 0;
  width: 100%;
  background: #fff;
  text-align: center;
}
.invite-btn {
  width: 6.9rem;
  height: 1rem;
  background: #F1F4FD;
  border-radius: 0.2rem;
  color: #3F4663;
}
  .verify-title {
    padding-top: 0.4rem;
    text-align: center;
    font-size: .32rem;
    font-weight: bold;
    color: #3F4663;
    margin-bottom: .25rem;
  }
  .verify-tips {
    font-size: .28rem;
    font-weight: bold;
    color: #94A5BE;
    text-align: center;
  }
  .verify-code{
    font-size: 1.2rem;
    font-weight: bold;
    color: #3F4663;
    text-align: center;
    padding: .25rem .2rem;
  }
  .invite-target-title{
    padding: 0.3rem 0.4rem;
    background: #fff;
    h3 {
      font-size: 0.32rem;
      font-weight: bold;
      color: #3F4663;
    }
    p {
      padding-top: 0.16rem;
      font-size: 0.22rem;
      color: #3F4663;
    }
  }
  .invite-target-box .content{
    color: #94A5BE;
  }
  .department-part{
    .department-list {
      background: #fff;
      min-height: 3rem;
      max-height: 6rem;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      margin-top: 0;
      .department-item {
        display: flex;
        align-items: center;
        line-height: normal;
        padding: .1rem 0;
        border-bottom: none 0;
        .user-name {
          font-size: 0.28rem;
          color: #3F4663;
        }
      }
    }
    .btn-box{
      padding: .3rem .3rem;
      .van-button{
        height: 1rem;
        border-radius: 0.2rem;
        background: #F6F8FD;
        color: #3F4663;
      }
    }
  }
  .role-part{
    .role-list{
      background: #fff;
      min-height: 3rem;
      max-height: 6rem;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      margin-top: 0;
      .van-cell{
        padding: .3rem .3rem;
      }
    }
    .btn-box{
      padding: .3rem .3rem;
      .van-button{
        height: 1rem;
        border-radius: 0.2rem;
        background: #F6F8FD;
        color: #3F4663;
      }
    }
  }
</style>
<style scoped>
.sheet-part >>> .van-action-sheet__header {
  height: 0;
  overflow: hidden;
}
.sheet-role-wrap >>> .van-cell {
  padding: 0.4rem 0.35rem;
}
.sheet-role-wrap >>> .van-cell::after, .invite-target-wrap >>> .van-cell::after {
  left: 0;
  right: 0;
}
.sheet-part >>> .van-action-sheet__close,.invite-target-wrap >>> .van-action-sheet__close{
  font-size: 0.26rem;
  font-weight: bold;
  color: #3F4663;
  z-index: 10;
}
.department-part >>> .van-action-sheet__header,.role-part >>> .van-action-sheet__header {
  padding: 0 0.4rem;
  font-size: 0.32rem;
  font-weight: bold;
  color: #3F4663;
  text-align: left;
}
.department-part >>> .van-action-sheet__close,.role-part >>> .van-action-sheet__close {
  font-size: 0.26rem;
  font-weight: bold;
  color: #3F4663;
}
.department-part >>> .van-overlay,.role-part >>> .van-overlay {
  background-color: transparent;
}
</style>
