<template>
  <div class="wrapper">
    <van-nav-bar
      title="数据恢复"
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
              <van-cell v-for="(item,index) in radioList" :key="index" :title="item.name" clickable @click="changeRadio(item)">
                <template #title>
                  <div class="folder-info">
                    <div class="file-icon">
                      <van-image :src="item.file_type === 0?folder:zip" class="poster"></van-image>
                    </div>
                    <div class="file-info one-line">{{item.name}}</div>
                  </div>
                </template>
                <template #right-icon>
                  <van-icon size=".4rem" color="#CCCCCC" v-if="item.file_type === 0" name="arrow" />
                  <van-radio v-else :name="item.path" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </div>
        <div  v-if="canSubmit" class="btn-box-placeholder">
          <div class="btn-box">
            <van-button :disabled="isRecovering" class="btn" @click="handleSure">恢复</van-button>
          </div>
        </div>
      </template>
    </template>
    <!--确认弹窗-->
    <ConfirmDialog
      v-model="confirmShow"
      :title="confirmTitle"
      :secondTitle="confirmSecondTitle"
      :content="confirmContent"
      @confirm="handleConfirm"/>
    <!--操作恢复反馈弹窗-->
    <FeedbackDialog
      v-model="feedbackShow"
      :type="feedbackType"
      :title="feedbackTitle"
      :content="feedbackContent"/>
    <!--操作挂载弹窗-->
    <MountDialog
      v-model="mountShow"
      :content="mountContent"
      :loading="mountLoading"
      @confirm="handleMount"/>
    <!--进度弹窗-->
    <ProgressDialog
      ref="progress"
      v-model="progressShow"
      :title="progressTitle"
      :content="progressContent"/>
  </div>
</template>
<script>
import Breadcrumb from '@/components/Breadcrumb.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import FeedbackDialog from './components/FeedbackDialog.vue'
import MountDialog from './components/MountDialog.vue'
import ProgressDialog from './components/ProgressDialog.vue'

const empty = require('../../assets/empty.png')
const activeIcon = require('../../assets/check-box-icon.png')
const inactiveIcon = require('../../assets/uncheck-box-icon.png')
const folder = require('../../assets/file-icon/folder.png')
const zip = require('../../assets/file-icon/zip.png')

export default {
  name: 'recovery',
  components: {
    Breadcrumb,
    ConfirmDialog,
    FeedbackDialog,
    MountDialog,
    ProgressDialog
  },
  computed: {
    isNoFiles() {
      return this.radioList.length === 0
    },
    canSubmit() {
      return this.radioList.find(item => item.file_type !== 0)
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
      ],
      params: {
        path: '',
        type: 0,
        only_dir: false
      },
      radio: 1,
      radioList: [],
      confirmShow: false,
      confirmTitle: '恢复',
      confirmSecondTitle: '恢复备份的数据替换目前的数据，你确定 要继续吗？',
      confirmContent: '* 恢复需要一定时间，且恢复过程中智慧 中心将暂停使用，恢复结束后可正常使用',
      feedbackShow: false,
      feedbackType: '',
      feedbackTitle: '',
      feedbackContent: '',
      mountShow: false,
      mountContent: '需要挂载后才可以访问，是否将可用硬盘1 挂载到外部存储？',
      mountLoading: false,
      progressShow: false,
      progressTitle: '',
      progressContent: '',
      pvName: '',
      isRecovering: false,
      currentBackup: {},
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
    // 选择进入文件夹
    changeRadio(params) {
      if (this.isRecovering) {
        return
      }
      if (params.type === 4) {
        this.pvName = params.name
        this.mountShow = true
        this.mountContent = `需要挂载后才可以访问，是否将可用${params.name}, 挂载到外部存储？`
      } else if (params.file_type === 0) {
        this.params.path = params.path
        this.params.type = params.type
        const breadcrumb = { name: params.name, path: params.path, type: params.type }
        this.breadcrumb.push(breadcrumb)
        this.getBackupPaths(this.params)
      } else {
        this.currentBackup = params
        this.radio = params.path
      }
    },
    // 确定恢复反馈
    handleSure() {
      this.confirmTitle = this.$t('global.recover')
      this.confirmSecondTitle = this.$t('owner.backupConfirmSecTitle')
      this.confirmContent = this.$t('owner.backupConfirmContent')
      this.confirmShow = true
    },
    // 当前位置路劲切换
    changeBread(params, index) {
      this.breadcrumb = this.breadcrumb.slice(0, index + 1)
      this.params.type = params.type
      this.params.path = params.path
      this.getBackupPaths(this.params)
    },
    // 恢复数据处理
    recoverBackup() {
      // 发送请求
      const params = {
        restore_type: 1,
        restore_path: this.currentBackup.path,
        path_type: this.currentBackup.type,
        restore_file_name: this.currentBackup.name
      }
      this.isRecovering = true
      this.http.recoverBackup(params).then((res) => {
        if (res.status === 0) {
          // 成功回调
          this.feedbackType = 'success'
          this.feedbackTitle = this.$t('owner.recoverSuccess')
          this.recoverSuccess()
        } else {
          // 失败回调
          this.feedbackType = 'fail'
          this.feedbackTitle = this.$t('owner.recoverFail')
          this.progressShow = false
          this.feedbackShow = true
          this.isRecovering = false
        }
      }).catch(() => {
        this.isRecovering = false
      })
    },
    // 恢复成功回调
    recoverSuccess() {
      // 轮询调用接口判断sa是否重启成功
      setTimeout(() => {
        this.http.getSaVersionInfo().then((res) => {
          if (res.status === 0) {
            this.$refs.progress.done()
            this.progressShow = false
            this.feedbackShow = true
            this.isRecovering = false
            this.onClickLeft()
          }
        }).catch(() => {
          this.recoverSuccess()
        })
      }, 8000)
    },
    // 恢复确定
    handleConfirm() {
      // const now = Date.now() / 1000
      this.progressTitle = this.$t('global.recovering')
      this.progressContent = `${this.$t('owner.backupNeedTime')}<br/>恢复的文件：${this.currentBackup.name}`
      this.progressShow = true
      this.recoverBackup()
    },
    //
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
    min-width: .72rem;
    width: .72rem;
    text-align: center;
    margin-right: .2rem;
  }
}
.btn-box-placeholder .btn-box{
  background-color: #F6F8FD;
}
</style>
<style scoped>
  .folder-list >>> .van-cell__title {
    text-overflow:ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
