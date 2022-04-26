<template>
  <div class="wrapper">
    <van-nav-bar
      title="备份位置"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3f4663"/>
      </template>
    </van-nav-bar>
    <Breadcrumb :list="breadcrumb" @onChange="changeBread"/>
    <Loading v-if="loading"></Loading>
    <template v-else>
      <!-- 没有文件 -->
      <div class="empty-box" v-if="isNoFiles">
        <van-empty
          class="custom-image"
          :image="empty"
          :description="$t('global.empty')">
        </van-empty>
      </div>
      <template v-else>
        <div class="folder-list">
          <van-radio-group v-model="radio">
            <van-cell-group>
              <van-cell v-for="(item,index) in radioList" :key="index" :title="item.name" clickable>
                <template #title>
                  <div class="folder-info" @click="changeRadio(item)">
                    <div class="file-icon">
                      <van-image :src="item.file_type === 0?folder:zip" class="poster"></van-image>
                    </div>
                    <div class="file-info one-line">{{item.name}}</div>
                  </div>
                </template>
                <template #right-icon>
                  <van-radio v-if="item.type === 1 || item.type === 7 || item.type === 8" :name="item.path"  @click="radio = item.path"/>
                  <van-icon v-else size=".4rem" color="#CCCCCC" name="arrow" @click="changeRadio(item)" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </div>
        <div v-if="canSubmit" class="btn-box-placeholder">
          <div class="btn-box">
            <van-button class="btn" @click="handleSure">{{ $t('global.confirm') }}</van-button>
          </div>
        </div>
      </template>
    </template>
    <!--挂载反馈弹窗-->
    <MountDialog
      v-model="mountShow"
      :content="mountContent"
      :loading="mountLoading"
      @confirm="handleMount"/>
  </div>
</template>
<script>
import Breadcrumb from '@/components/Breadcrumb.vue'
import MountDialog from './components/MountDialog.vue'

const empty = require('../../assets/empty.png')
const activeIcon = require('../../assets/check-box-icon.png')
const inactiveIcon = require('../../assets/uncheck-box-icon.png')
const folder = require('../../assets/file-icon/folder.png')
const zip = require('../../assets/file-icon/zip.png')

export default {
  name: 'backupLocation',
  components: {
    Breadcrumb,
    MountDialog
  },
  computed: {
    locationName() {
      let res = ''
      this.breadcrumb.forEach((item, index) => {
        if (index !== 0) {
          res += `${item.name} - `
        }
      })
      return res.replace(/ - $/, '')
    },
    isNoFiles() {
      return this.radioList.length === 0
    },
    canSubmit() {
      return this.radioList.find(item => item.type === 1 || item.type === 7 || item.type === 8)
    }
  },
  data() {
    return {
      empty,
      activeIcon,
      inactiveIcon,
      folder,
      zip,
      loading: false,
      breadcrumb: [
        { name: '存储', path: '', type: 0 },
        { name: '内部存储', path: '/', type: 2 },
      ],
      radio: '/backup',
      radioList: [],
      params: {
        path: '/',
        type: 2,
        only_dir: true
      },
      mountLoading: false,
      mountShow: false,
      mountContent: '需要挂载后才可以访问，是否将可用硬盘1 挂载到外部存储？',
      pvName: ''
    }
  },
  watch: {},
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    // 获取备份数据列表
    getBackupPaths(params) {
      this.loading = true
      this.http.getBackupPaths(params).then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        this.radioList = res.data.paths || []
      }).catch(() => {
        this.loading = false
      })
    },
    // 选择时间类型
    changeRadio(params) {
      if (params.type === 4) {
        this.pvName = params.name
        this.mountContent = `需要挂载后才可以访问，是否将可用${params.name}, 挂载到外部存储？`
        this.mountShow = true
      } else if (params.file_type === 0) {
        this.params.path = params.path
        this.params.type = params.type
        const breadcrumb = { name: params.name, path: params.path, type: params.type }
        this.breadcrumb.push(breadcrumb)
        this.getBackupPaths(this.params)
      }
    },
    // 确定备份位置
    handleSure() {
      const res = this.radioList.find(item => item.path === this.radio)
      const locationName = `${this.locationName} - ${res.name}`
      // 存当前导航信息
      this.$methods.setSession('breadcrumb', JSON.stringify(this.breadcrumb))
      this.$router.push({
        name: 'backupMark',
        query: {
          path: this.radio,
          type: res.type || 1,
          locationName
        }
      })
    },
    changeBread(params, index) {
      this.breadcrumb = this.breadcrumb.slice(0, index + 1)
      if (index === 0) {
        this.getBackupPaths()
      } else {
        this.params.type = params.type
        this.params.path = params.path
        this.getBackupPaths(this.params)
      }
    },
    // 挂载硬盘
    handleMount() {
      this.mountLoading = true
      this.http.backupsMount({ pv_name: this.pvName }).then((res) => {
        this.mountLoading = false
        if (res.status !== 0) {
          return
        }
        this.mountShow = false
        this.breadcrumb = [
          { name: '存储', path: '', type: 0 },
          { name: '外部存储', path: '/', type: 3 },
        ]
        this.params = {
          path: '/',
          type: 3,
          only_dir: true
        }
        this.getBackupPaths(this.params)
      }).catch(() => {
        this.mountLoading = false
      })
    }
  },
  created() {
    let breadcrumb = this.$methods.getSession('breadcrumb')
    breadcrumb = breadcrumb ? JSON.parse(breadcrumb) : []
    if (breadcrumb.length) {
      this.breadcrumb = breadcrumb
      this.params.path = breadcrumb[breadcrumb.length - 1].path
      this.params.type = breadcrumb[breadcrumb.length - 1].type
      // this.$methods.setSession('breadcrumb', '')
    }
    const { query } = this.$route
    if (query.path) {
      this.radio = query.path
    }
    this.getBackupPaths(this.params)
  }
}
</script>
<style lang="scss" scoped>
.tip {
    padding: 0.3rem;
    font-size: 0.24rem;
    color: #ff0000;
  }
.folder-list .van-cell{
  align-items: center;
}
.folder-info{
  display: flex;
  align-items: center;
  padding-right: .2rem;
  .file-icon {
    width: .72rem;
    text-align: center;
    margin-right: .2rem;
  }
}
.btn-box-placeholder .btn-box{
  background-color: #F6F8FD;
}
.empty-box{
  padding: .5rem 0;
}
</style>
<style scoped>
  .folder-list >>> .van-cell__title {
    text-overflow:ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
