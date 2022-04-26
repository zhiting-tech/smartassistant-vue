<template>
  <div class="department-setting">
    <van-nav-bar
      :title="$t('departmentSetting.title')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
      <template #right>
        <van-button class="nav-edit" round size="small" type="info" :loading="saveLoading" @click="handleSave">{{ $t('global.save') }}</van-button>
      </template>
    </van-nav-bar>
    <template>
      <div class="department-name">
        <input v-model="office.name" :placeholder="$t('departmentSetting.departmentName')"/>
      </div>
    </template>
    <div class="detail-box">
      <div class="office-list">
        <div class="role-item" @click="handleAction()">
          <div class="role-name one-line">{{$t('departmentSetting.departmentHead')}}</div>
          <div class="role-info" v-if="memberInfo.is_manager">
            <span class="role-face">
              <van-image width=".6rem" height=".6rem" round fit="cover" lazy-load :src="memberInfo.url">
                <template v-slot:error><img src="../../assets/default-header.png"></template>
              </van-image>
            </span>
            <span class="user-name one-line">{{ memberInfo.nickname }}</span>
          </div>
          <van-icon name="arrow" size=".4rem" color="#CCCCCC"/>
        </div>
      </div>
    </div>
    <van-button
      type="default"
      @click="deleteShow = true"
      :loading="finishLoading"
      :loading-text="$t('global.saving')"
      :disabled="finishLoading"
      class="finish-btn">
      {{ $t('departmentSetting.deleteDepartment') }}</van-button>
    <!--权限转换-->
    <van-action-sheet v-model="show" :title="$t('departmentSetting.departmentHead')">
      <div class="content">
        <div class="role-list">
          <van-cell v-for="(member,index) in departmentInfo.users" :key="index" clickable @click="selectTarget(member)">
            <template #title>
              <div class="role-item">
                <div class="role-face">
                  <van-image width=".8rem" height=".8rem" round fit="cover" lazy-load :src="member.url">
                    <template v-slot:error><img src="../../assets/default-header.png"></template>
                  </van-image>
                </div>
                <div class="role-info">
                  <p class="user-name one-line">{{ member.nickname }}</p>
                  <p class="role-name one-line">{{ member.role_name }}</p>
                </div>
              </div>
            </template>
            <template #right-icon>
              <div class="van-radio" :class="{'active': office.manager_id === member.user_id}">
                <van-icon class="circle" size=".46rem" name="circle" />
                <van-icon class="checked" size=".46rem" name="checked" />
              </div>
            </template>
          </van-cell>
        </div>
        <div class="btn-box">
          <van-button
            type="default"
            block
            @click="handleSure"
            :loading="finishLoading"
            :loading-text="$t('global.saving')"
            :disabled="finishLoading">
            {{ $t('global.confirm') }}</van-button>
        </div>
      </div>
    </van-action-sheet>
    <!--删除确认弹窗-->
    <van-dialog
      v-model="deleteShow"
      show-cancel-button
      :before-close="handleDelete"
      confirm-button-color="#2DA3F6"
      cancel-button-color="#94A5BE">
      <h3 class="delete-title">{{ $t('departmentSetting.delTitle') }}</h3>
      <p class="delete-tip">{{ $t('departmentSetting.delContent') }}</p>
    </van-dialog>
  </div>
</template>
<script>

import { mapGetters } from 'vuex'

export default {
  name: 'departmentSetting',
  data() {
    return {
      departmentId: '', // 部门id
      departmentInfo: {
        name: '',
        users: []
      },
      show: false,
      finishLoading: false,
      saveLoading: false,
      memberInfo: {},
      office: {
        name: '',
        manager_id: 0
      },
      deleteShow: false,
      initialManager: false,
      initialManagerId: 0
    }
  },
  computed: {
    ...mapGetters(['area']),
    isSetting() {
      if (this.initialManagerId) {
        if (this.office.manager_id) {
          return (this.office.manager_id !== this.initialManagerId) || (this.departmentInfo.name !== this.office.name)
        }
        return true
      }
      return this.office.manager_id || (this.departmentInfo.name !== this.office.name)
    },
    id() {
      return this.area.id
    },
  },
  methods: {
    onClickLeft() {
      if (this.isSetting) {
        this.$dialog.confirm({
          title: '',
          confirmButtonColor: '#2DA3F6',
          confirmButtonText: this.$t('global.quit'),
          message: this.$t('departmentSetting.quitTip'),
        }).then(() => {
          this.$router.go(-1)
        }).catch(() => false)
      } else {
        this.$router.go(-1)
      }
    },
    // 获取部门详情
    getDepartmentDetail(departmentId) {
      this.loading = true
      this.http.departmentDetail(departmentId).then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        this.departmentInfo = res.data || {}
        this.office.name = res.data.name
        const memberInfo = res.data.users.find(item => item.is_manager) || {}
        this.memberInfo = memberInfo
        this.office.manager_id = memberInfo.user_id || 0
        this.initialManagerId = memberInfo.user_id || 0
      }).catch(() => {
        this.loading = false
      })
    },
    handleAction() {
      this.show = true
    },
    // 删除部门
    handleDelete(action, done) {
      if (action === 'confirm') {
        // 删除房间
        this.http.deleteDepartment(this.departmentId).then((res) => {
          done()
          if (res.status !== 0) {
            return
          }
          this.$toast(this.$t('global.delSuccess'))
          this.$router.push({
            name: 'departmentManage',
            query: {
              id: this.id
            }
          })
        })
      } else {
        done()
      }
    },
    // 修改设备信息
    handleSave() {
      if (this.office.name === '') {
        this.$toast(this.$t('departmentSetting.nameEmpty'))
        return
      }
      if (!this.office.manager_id) {
        this.office.manager_id = 0
      }
      this.saveLoading = true
      this.http.updateDepartment(this.departmentId, this.office).then((res) => {
        this.saveLoading = false
        if (res.status !== 0) {
          return
        }
        this.getDepartmentDetail(this.departmentId)
        this.$toast(this.$t('global.updateSuccess'))
      })
    },
    // 确定转权
    handleSure() {
      this.show = false
      this.memberInfo = this.departmentInfo.users.find(item => item.user_id === this.office.manager_id) || {}
      if (this.memberInfo.user_id) {
        this.memberInfo.is_manager = true
      }
    },
    // 选择对象
    selectTarget(member) {
      if (member.user_id === this.office.manager_id) {
        this.office.manager_id = 0
      } else {
        this.office.manager_id = member.user_id
      }
    }
  },
  created() {
    const { departmentId } = this.$route.query
    this.departmentId = departmentId ? Number(departmentId) : 0
    if (this.departmentId) {
      this.getDepartmentDetail(this.departmentId)
    }
  }
}
</script>
<style lang="scss" scoped>
.department-setting {
  min-height: 100vh;
  background: #f6f8fd;
}
.nav-edit{
  width: 1rem;
  height: .5rem;
}
.department-name {
  padding: .2rem .3rem;
  background-color: #ffffff;
  input {
    padding: 0 0.25rem;
    width: 100%;
    height: 1rem;
    background: #F6F8FD;
    border-radius: 0.2rem;
  }
  input::-webkit-input-placeholder{
    color: #94A5BE;
  }
}
.detail-box {
  background-color: #ffffff;
}
.office-list {
  background: #fff;
  .role-item {
    min-height: 1rem;
    display: flex;
    align-items: center;
    padding: 0.2rem 0.3rem;
    border-bottom: 0.01rem solid #eee;
    cursor: pointer;
    word-break: break-all;
  }
  .role-name{
    flex: 1;
    font-size: 0.28rem;
    font-weight: bold;
    color: #3F4663;
  }
  .role-info {
    position: relative;
    padding: 0 .3rem;
    overflow: hidden;
    display: flex;
    align-items: center;
    .role-face {
      img {
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 50%;
        overflow: hidden;
      }
    }
    .user-name {
      font-size: 0.28rem;
      color: #3F4663;
      margin-left: .1rem;
      max-width: 1.5rem;
    }
  }
}
.role-list {
  background: #fff;
  min-height: 5rem;
  max-height: calc(100vh - 4rem);
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  .role-item {
    display: flex;
    align-items: center;
    line-height: normal;
    .role-face {
      img {
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 50%;
        overflow: hidden;
      }
    }
    .role-info {
      position: relative;
      word-break: break-all;
      flex: 1;
      padding: 0 .3rem;
      overflow: hidden;
      .user-name {
        font-size: 0.28rem;
        color: #3F4663;
      }
      .role-name {
        margin-top: .15rem;
        font-size: 0.24rem;
        color: #94A5BE;
      }
    }
  }
  .van-radio{
    .van-icon{
      color: #c8c9cc;
    }
    .van-icon.checked{
      display: none;
    }
  }
  .van-radio.active{
    .van-icon{
      color: #1989fa;
    }
    .van-icon.circle{
      display: none;
    }
    .van-icon.checked{
      display: block;
    }
  }
}
.finish-btn {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0.3rem;
  width: 6.9rem;
  height: 1rem;
  border-radius: 0.2rem;
  color: #3F4663;
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
  .department-setting >>> .van-action-sheet__header {
    padding: 0 0.4rem;
    font-size: 0.32rem;
    font-weight: bold;
    color: #3F4663;
    text-align: left;
  }
  .department-setting >>> .van-action-sheet__close {
    font-size: 0.26rem;
    font-weight: bold;
    color: #3F4663;
  }
</style>
