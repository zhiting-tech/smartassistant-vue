<template>
  <div class="wrapper">
    <van-nav-bar
      :title="$t('departmentDetail.title')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
    </van-nav-bar>
    <div class="company-name">{{queryData.companyName}} <van-icon name="arrow"/><span>{{queryData.departmentName}}</span></div>
    <!--loading模块-->
    <Loading v-if="loading"></Loading>
    <div v-else-if="isEmpty" class="empty-box">
      <div class="empty-wrap">
        <van-image :src="emptyImg" class="empty-img"/>
        <p class="empty-word">{{ $t('departmentDetail.empty') }}</p>
        <!-- <van-button class="empty-btn" @click="handleAdd">{{ $t('departmentDetail.add') }}</van-button>-->
      </div>
    </div>
    <template v-else>
    <div class="detail-box">
      <div class="role-title">{{ $t('departmentDetail.member') }}（{{ memberList.length }}{{ $t('departmentDetail.man') }}）</div>
      <div class="role-list">
        <div v-for="member in memberList" :key="member.user_id" class="role-item"
          @click="toMemberManage(member)">
          <div class="role-face">
            <van-image width=".8rem" height=".8rem" round fit="cover" lazy-load :src="member.url">
              <template v-slot:error><img src="../../assets/default-header.png"></template>
            </van-image>
          </div>
          <div class="role-info">
            <p class="user-name"><span class="nickname one-line">{{ member.nickname }}</span> <span v-if="member.is_manager" class="rank"><img src="../../assets/rank.png" alt=""></span></p>
            <p class="role-name one-line">{{ getMemberRole(member) }}</p>
          </div>
          <van-icon name="arrow" size=".4rem" color="#CCCCCC"/>
        </div>
      </div>
    </div>
    </template>
    <div class="add-btn-box">
      <van-button v-if="permissions.add_department_user" class="add-btn" @click="handleAdd">
        {{ $t('departmentDetail.add') }}
      </van-button>
      <van-button v-if="permissions.update_department" class="add-btn" @click="handleSet">
        {{ $t('departmentDetail.set') }}
      </van-button>
    </div>
    <!--修改名称弹窗-->
    <AddMembersPopup
      v-model="show"
      :title="$t('departmentDetail.add')"
      :selected="memberList"
      :saveLoading="addLoading"
      @on-confirm="addMembers"/>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import AddMembersPopup from '@/components/AddMembersPopup.vue'

const emptyImg = require('../../assets/empty-icon.png')

export default {
  name: 'departmentDetail',
  components: {
    AddMembersPopup,
  },
  data() {
    return {
      id: '',
      queryData: {},
      dragList: [],
      isEdit: false,
      emptyImg,
      show: false,
      loading: false,
      addLoading: false,
      saveLoading: false,
      memberList: [],
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    isEmpty() {
      return this.memberList.length === 0
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    // 获取部门详情
    getDepartmentDetail(departmentId) {
      this.loading = true
      this.http.departmentDetail(departmentId).then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        const { users } = res.data
        this.memberList = users || []
      }).catch(() => {
        this.loading = false
      })
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
    // 去成员详情页
    toMemberManage(member) {
      setTimeout(() => {
        this.$router.push({
          name: 'memberManage',
          query: {
            userId: member.user_id
          }
        })
      }, 300)
    },
    // 处理添加按钮
    handleAdd() {
      this.show = true
    },
    handleSet() {
      this.$router.push({
        name: 'departmentSetting',
        query: {
          departmentId: this.queryData.id
        }
      })
    },
    // 添加成员
    addMembers(arrId) {
      if (arrId.length === 0) {
        this.$toast(this.$t('departmentDetail.emptyTip'))
        return
      }
      const params = {
        users: arrId
      }
      this.addLoading = true
      this.http.addDepartmentMembers(this.queryData.id, params).then((res) => {
        this.addLoading = false
        if (res.status !== 0) {
          return
        }
        this.$toast(this.$t('global.addSuccess'))
        this.show = false
        this.getDepartmentDetail(this.queryData.id)
      }).catch(() => {
        this.addLoading = false
      })
    }
  },
  created() {
    const { query } = this.$route
    this.queryData = query || {}
    if (this.queryData.id) {
      this.getDepartmentDetail(this.queryData.id)
    }
  }
}
</script>
<style lang="scss" scoped>
.nav-edit {
  font-size: 0.28rem;
  font-weight: bold;
  color: #3F4663;
  padding: 0;
  border: 0 none;
}
.company-name{
  display: flex;
  align-items: center;
  padding: .2rem .3rem;
  font-size: .22rem;
  font-weight: 400;
  color: #94A5BE;
  background-color: #f6f8fd;
}
.detail-box {
  background-color: #ffffff;
}
.role-list {
  background: #fff;
  max-height: calc(100vh - 4rem);
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.role-title {
  padding: 0.27rem 0.3rem 0.12rem 0.3rem;
  font-size: 0.24rem;
  color: #94A5BE;
}
.role-item {
  display: flex;
  align-items: center;
  padding: 0.2rem 0.3rem;
  border-bottom: 0.01rem solid #eee;
}
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
    position: relative;
    align-items: center;
    .nickname{
      display: inline-block;
      max-width: 4rem;
    }
    img{
      width: .28rem;
      height: auto;
      vertical-align: top;
    }
  }
  .role-name {
    margin-top: .15rem;
    font-size: 0.24rem;
    color: #94A5BE;
  }
}
.add-btn-icon {
  font-weight: bold;
  vertical-align: text-top;
  margin-right: 0.2rem;
}
.add-btn-box {
  width: 100%;
  max-width: 750px;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  padding: 0.3rem;
  background: $bgColor;
  display: flex;
}
.add-btn {
  flex: 1;
  height: 1rem;
  margin: 0 3%;
  background: #fff;
  border-radius: 0.2rem;
  font-size: 0.28rem;
  font-weight: bold;
  color: #2DA3F6;
  border: none;
}
.add-btn + .add-btn{
  width: 44%;
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
