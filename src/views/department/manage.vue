<template>
  <div class="wrapper">
    <van-nav-bar
      :title="$t('departmentManage.title')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
      <template v-if="!isEmpty&&permissions.update_department_order" #right>
        <span v-if="!isEdit" class="nav-edit" @click="isEdit = true">{{ $t('departmentManage.edit') }}</span>
        <van-button v-else class="nav-edit" :loading="saveLoading" :disabled="saveLoading" @click="handleEdit">{{ $t('departmentManage.finish') }}</van-button>
      </template>
    </van-nav-bar>
    <div class="company-name">{{companyName}}</div>
    <!--loading模块-->
    <Loading v-if="loading"></Loading>
    <div v-else-if="isEmpty" class="empty-box">
      <div class="empty-wrap">
        <van-image :src="emptyImg" class="empty-img"/>
        <p class="empty-word">{{ $t('departmentManage.empty') }}</p>
        <van-button class="empty-btn" @click="handleAdd">{{ $t('departmentManage.add') }}</van-button>
      </div>
    </div>
    <template v-else>
    <div class="detail-box">
      <Draggable
        v-model="dragList"
        :list="departmentList"
        :disabled="!isEdit">
        <transition-group>
          <div
            v-for="department in departmentList"
            :key="department.id"
            @click="permissions.get_department?toDepartmentDetail(department):''"
            class="item clearfix">
            <span class="item-label one-line float-l">{{ department.name }}</span>
            <div class="float-r item-count">
              <span v-if="!isEdit && department.user_count">{{department.user_count}}{{$t('departmentManage.man')}}</span>
              <van-icon v-if="!isEdit" name="arrow" class="item-icon "/>
              <van-icon v-else name="bars" class="item-icon"/>
            </div>
          </div>
        </transition-group>
      </Draggable>
    </div>
    <div class="add-btn-placeholder">
      <div class="add-btn-box">
        <button v-show="!isEdit&&permissions.add_department" class="add-btn" @click="handleAdd">
          <van-icon name="plus" class="add-btn-icon"/>
          {{ $t('departmentManage.add') }}
        </button>
      </div>
    </div>
    </template>
    <!--修改名称弹窗-->
    <NameSheet
      v-model="show"
      :title="$t('departmentManage.sheetTitle')"
      :init="departmentName"
      :loading="nameLoading"
      @on-confirm="addDepartment"/>
  </div>
</template>
<script>
import Draggable from 'vuedraggable'
import { mapGetters } from 'vuex'
import NameSheet from '@/components/NameSheet.vue'

const emptyImg = require('../../assets/empty-icon.png')

export default {
  name: 'departmentManage',
  components: {
    NameSheet,
    Draggable
  },
  data() {
    return {
      id: '',
      dragList: [],
      isEdit: false,
      companyName: '',
      departmentList: [],
      emptyImg,
      show: false,
      departmentName: '',
      loading: false,
      nameLoading: false,
      saveLoading: false
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'permissions']),
    isEmpty() {
      return this.departmentList.length === 0
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    // 获取用户信息
    getUserInfo() {
      this.http.getUserDetail(this.userInfo.user_id).then((res) => {
        if (res.status !== 0) {
          return
        }
        this.companyName = res.data.area.name
      })
    },
    // 处理位置排序
    handleEdit() {
      this.saveLoading = true
      const departmentsOrder = []
      this.departmentList.forEach((item) => {
        departmentsOrder.push(item.id)
      })
      const params = {
        departments_id: departmentsOrder
      }
      this.http.editDepartmentsSort(params).then((res) => {
        this.saveLoading = false
        this.isEdit = false
        if (res.status !== 0) {
          return
        }
        this.$toast(this.$t('global.editSuccess'))
      })
    },
    // 去部门详情
    toDepartmentDetail(department) {
      if (this.isEdit) {
        return
      }
      this.$router.push({
        name: 'departmentDetail',
        query: {
          id: department.id,
          departmentName: department.name,
          companyName: this.companyName
        }
      })
    },
    // 初始化列表
    initList() {
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
    // 处理添加按钮
    handleAdd() {
      this.show = true
      this.departmentName = ''
    },
    // 添加部门
    addDepartment(name) {
      const departmentName = name.trim()
      if (departmentName === '') {
        this.$toast(this.$t('departmentManage.emptyTip'))
        return
      }
      const isExit = this.departmentList.find(item => item.name === departmentName)
      if (isExit) {
        this.$toast(this.$t('departmentManage.repeatTip'))
        return
      }
      const params = {
        name: departmentName
      }
      this.nameLoading = true
      this.http.addDepartment(params).then((res) => {
        this.nameLoading = false
        if (res.status !== 0) {
          return
        }
        this.show = false
        this.initList()
        this.departmentName = departmentName
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
      this.getUserInfo()
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
.item-label {
  display: inline-block;
  max-width: 70%;
  font-size: 0.28rem;
  color: #3F4663;
}
.item-count{
  color: #94A5BE;
}
.item-icon {
  vertical-align: top;
  color: #ccc;
}
.add-btn-icon {
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
.company-name{
  padding: .2rem .3rem;
  font-size: .22rem;
  font-weight: 400;
  color: #94A5BE;
  background-color: #f6f8fd;
}
</style>
