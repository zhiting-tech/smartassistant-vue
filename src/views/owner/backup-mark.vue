<template>
  <div class="wrapper">
    <van-nav-bar
      :title="$t('owner.backup')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3f4663"/>
      </template>
    </van-nav-bar>
    <div class="block">
      <div class="flex-item">
        <div class="item-title"><span>* </span>{{ $t('owner.backupLocation') }}：</div>
        <div class="item-text one-line" @click="goBackupLocation">{{locationName}}</div>
        <div class="item-icon" @click="goBackupLocation"><van-icon size=".4rem" color="#cccccc" name="arrow" /></div>
      </div>
      <div class="flex-item"  @click="checkboxShow = true">
        <div class="item-title"><span>* </span>{{ $t('owner.backupData') }}：</div>
        <div class="item-text one-line">{{dataTypeText}}</div>
        <div class="item-icon"><van-icon size=".4rem" color="#cccccc" name="arrow" /></div>
      </div>
      <div class="flex-item">
        <div class="item-title"><span>* </span>{{ $t('owner.backupTime') }}：</div>
        <div class="item-text one-line" @click="selectTimeType">{{time?time:$t('global.now')}}</div>
        <div class="item-icon" @click="selectTimeType"><van-icon size=".4rem" color="#cccccc" name="arrow" /></div>
      </div>
    </div>
    <div class="mark-box">
      <h3 class="mark">{{ $t('global.remark') }}：</h3>
      <van-field
        v-model="markMessage"
        class="text-border"
        rows="9"
        type="textarea"
        :placeholder="$t('owner.backupMarkPlaceholder')"
        :maxlength="255"
        :show-word-limit="true"/>
    </div>
    <p class="tip">{{ $t('owner.backupMarkTip') }}</p>
    <div class="backup-btn-placeholder">
      <div class="backup-btn-box">
        <van-button class="backup-btn" @click="handleBackup">{{ $t('owner.backupStart') }}</van-button>
      </div>
    </div>
    <!--确认弹窗-->
    <ConfirmDialog
      v-model="confirmShow"
      :title="confirmTitle"
      :secondTitle="confirmSecondTitle"
      :content="confirmContent"
      @confirm="handleConfirm"/>
    <!--操作反馈弹窗-->
    <FeedbackDialog
      v-model="feedbackShow"
      :type="feedbackType"
      :title="feedbackTitle"
      :content="feedbackContent"/>
    <!--进度弹窗-->
    <ProgressDialog
      ref="progress"
      v-model="progressShow"
      :title="progressTitle"
      :content="progressContent"/>
    <!--备份时间选择-->
    <van-action-sheet class="backup-time" v-model="radioShow" :title="$t('owner.backupTime')">
      <div class="content">
        <van-radio-group v-model="radio">
          <van-cell-group>
            <van-cell v-for="(item,index) in radioList" :key="index" :title="item.name" clickable @click="changeRadio(item.value)">
              <template #right-icon>
                <van-radio :name="item.value" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
    </van-action-sheet>
    <!--备份时间设置-->
    <van-action-sheet class="picker-time" v-model="timeShow" :title="$t('global.timing')">
      <div class="content">
        <van-datetime-picker
          v-model="currentDate"
          visible-item-count="5"
          type="datetime"
          ref="picker"
          title="定时"
          :show-toolbar="false"
          :swipe-duration="500"
          :min-date="minDate"
          :max-date="maxDate"
          item-height="1rem"
          @confirm="confirmTime"
        />
        <div class="time-label">
          <span>{{ $t('global.month') }}</span>
          <span>{{ $t('global.day') }}</span>
          <span>{{ $t('global.hour') }}</span>
          <span>{{ $t('global.minute') }}</span>
        </div>
      </div>
      <div class="confirm-btn"><van-button block @click="sure">{{ $t('global.confirm') }}</van-button></div>
    </van-action-sheet>
    <!--备份数据选择-->
    <van-action-sheet class="picker-time" v-model="checkboxShow" :title="$t('owner.backupData')">
      <div class="role-wrap">
        <van-checkbox-group v-model="result">
          <van-cell-group>
            <van-cell
              v-for="(item,index) in dataList"
              :key="index"
              clickable
              :disabled="index===0"
              :class="{'disabled':index===0}"
              @click="toggle(index)">
              <template #title>
                <div class="role-title" :class="{ 'role-active': dataList.includes(item.id) }">
                    <span class="role-name one-line float-l">
                      {{ item.name }}
                    </span>
                </div>
              </template>
              <template #right-icon>
                <van-checkbox :name="item.value" ref="checkboxes" :disabled="index===0">
                  <template #icon="props">
                    <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                  </template>
                </van-checkbox>
              </template>
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
      </div>
      <div class="confirm-btn" >
        <van-button :loading-text="$t('global.saving')" block @click="dataSelect">{{ $t('global.confirm') }}</van-button>
      </div>
    </van-action-sheet>
  </div>
</template>
<script>
import ConfirmDialog from './components/ConfirmDialog.vue'
import ProgressDialog from './components/ProgressDialog.vue'
import FeedbackDialog from './components/FeedbackDialog.vue'

const activeIcon = require('../../assets/check-box-icon.png')
const inactiveIcon = require('../../assets/uncheck-box-icon.png')

export default {
  name: 'backupMark',
  components: {
    ConfirmDialog,
    ProgressDialog,
    FeedbackDialog
  },
  data() {
    return {
      activeIcon,
      inactiveIcon,
      markMessage: '',
      confirmShow: false,
      confirmTitle: '',
      confirmSecondTitle: '',
      confirmContent: '',
      progressShow: false,
      progressTitle: '',
      progressContent: '',
      feedbackShow: false,
      feedbackType: '',
      feedbackTitle: '',
      feedbackContent: '',
      radioShow: false,
      locationName: `${this.$t('owner.internalStorage')} - backup`,
      radio: 1,
      radioList: [
        { name: this.$t('global.now'), value: 1 },
        { name: this.$t('global.timing'), value: 2 }
      ],
      time: '',
      timeShow: false,
      minDate: new Date(),
      maxDate: new Date(new Date().getFullYear(), 12, 12),
      currentDate: 0,
      checkboxShow: false,
      result: ['test'],
      dataList: [
        { name: this.$t('owner.smartCenterData'), value: 'test' },
      ],
      dataTypeText: this.$t('owner.allData'),
      queryData: {},
    }
  },
  watch: {},
  methods: {
    onClickLeft() {
      this.$methods.setSession('breadcrumb', '')
      this.$router.push({
        name: 'backup'
      })
    },
    // 获取扩展列表信息
    getExtensions() {
      this.http.extensions().then((res) => {
        if (res.status !== 0) {
          return
        }
        const arr = res.data.extension_names || []
        this.result = this.result.concat(arr)
        this.dataList = this.dataList.concat(this.formatData(arr))
      })
    },
    // 处理备份按钮
    handleBackup() {
      this.confirmTitle = this.$t('owner.backupBtn')
      this.confirmSecondTitle = this.$t('owner.backupMarkSecTitle')
      this.confirmContent = this.$t('owner.backupMarkContent')
      this.confirmShow = true
    },
    // 处理确定回调
    handleConfirm() {
      const now = Date.now() / 1000
      this.progressTitle = this.$t('owner.backingUp')
      this.progressContent = `${this.$t('owner.backupNeedTime')}<br/>${this.$t('owner.backupTime')}：${this.$methods.getTime(now, 'YY-MM-DD hh:mm')}`
      this.progressShow = true
      this.createBackup()
    },
    // 备份数据
    createBackup() {
      const arr = this.result.slice(1)
      const params = {
        note: this.markMessage,
        start_time: this.currentDate ? Date.parse(this.currentDate) / 1000 : 0,
        backup_path: this.queryData.path || '/backup',
        extensions: arr,
        path_type: Number(this.queryData.type) || 1
      }
      this.$methods.setSession('backupInfo', '')
      this.http.createBackup(params).then((res) => {
        const now = Date.now() / 1000
        const date = this.$methods.getTime(now, 'YY-MM-DD hh:mm')
        if (res.status === 0) {
          this.feedbackType = 'success'
          this.feedbackTitle = this.$t('owner.backupSuccess')
          this.feedbackContent = `${this.$t('owner.backupDate')}：${date}`
          this.backupSuccess()
        } else {
          this.feedbackType = 'fail'
          this.feedbackTitle = this.$t('owner.backupFail')
          this.feedbackContent = `${this.$t('owner.backupDate')}：${date}<br/>${this.$t('owner.backupFailReason')}：${res.reason}`
          this.progressShow = false
          this.feedbackShow = true
        }
      })
    },
    // 备份成功回调
    backupSuccess() {
      // 轮询调用接口判断sa是否重启成功
      setTimeout(() => {
        this.http.getSaVersionInfo().then(() => {
          this.markMessage = ''
          this.$refs.progress.done()
          this.progressShow = false
          this.feedbackShow = true
          this.$methods.setSession('breadcrumb', '')
          this.$router.push({
            name: 'backup'
          })
        }).catch(() => {
          this.backupSuccess()
        })
      }, 8000)
    },
    //
    selectTimeType() {
      if (this.currentDate) {
        this.radio = 2
      } else {
        this.radio = 1
      }
      this.radioShow = true
    },
    // 选择时间类型
    changeRadio(value) {
      this.radio = value
      if (value === 2) {
        this.timeShow = true
      } else {
        this.currentDate = 0
        this.time = 0
      }
      this.radioShow = false
    },
    // 格式化时间显示
    formatter(type, val) {
      if (type === 'month') {
        return `<span>${val}</span>月`
      } if (type === 'day') {
        return `<span>${val}</span>日`
      } if (type === 'hour') {
        return `<span>${val}</span>时`
      } if (type === 'minute') {
        return `<span>${val}</span>分`
      }
      return val
    },
    // 确定选择
    confirmTime(value) {
      const time = this.$methods.getTime(Date.parse(value) / 1000, 'YY-MM-DD hh:mm')
      this.time = time
      this.timeShow = false
    },
    sure() {
      const time = this.$methods.getTime(Date.parse(this.currentDate) / 1000, 'YY-MM-DD hh:mm')
      this.time = time
      this.timeShow = false
    },
    toggle(index) {
      if (index === 0) {
        return
      }
      this.$refs.checkboxes[index].toggle()
    },
    dataSelect() {
      let res = ''
      this.dataList.forEach((item) => {
        if (this.result.includes(item.value)) {
          res += `${item.name}、`
        }
      })
      if (this.result.length === this.dataList.length) {
        this.dataTypeText = this.$t('owner.allData')
      } else {
        this.dataTypeText = res.replace(/、$/, '')
      }
      this.checkboxShow = false
    },
    goBackupLocation() {
      const params = {
        backupNote: this.markMessage,
        backupTime: this.currentDate,
        backupExtensions: this.result,
        backupDataList: this.dataList,
        backupType: Number(this.queryData.type) || 1
      }
      this.$methods.setSession('backupInfo', JSON.stringify(params))
      this.$router.push({
        name: 'backupLocation',
        query: {
          path: this.$route.query.path
        }
      })
    },
    // 格式化数据
    formatData(list) {
      const itemName = {
        wangpan: this.$t('owner.wangpanData'),
        crm: this.$t('owner.crmData'),
        scm: this.$t('owner.scmData')
      }
      return list.map(item => ({
        value: item,
        name: itemName[item]
      }))
    },
  },
  created() {
    const { query } = this.$route
    if (query.locationName) {
      this.locationName = query.locationName
      this.queryData = query
    }
    if (this.$methods.getSession('backupInfo')) {
      const backupInfo = JSON.parse(this.$methods.getSession('backupInfo'))
      this.markMessage = backupInfo.backupNote
      this.currentDate = backupInfo.backupTime
      this.result = backupInfo.backupExtensions
      this.dataList = backupInfo.backupDataList
      if (backupInfo.backupTime) {
        const time = this.$methods.getTime(Date.parse(backupInfo.backupTime) / 1000, 'YY-MM-DD hh:mm')
        this.time = time
      }
      let res = ''
      this.dataList.forEach((item) => {
        if (this.result.includes(item.value)) {
          res += `${item.name}、`
        }
      })
      if (this.result.length === this.dataList.length) {
        this.dataTypeText = this.$t('owner.allData')
      } else {
        this.dataTypeText = res.replace(/、$/, '')
      }
      this.$methods.setSession('backupInfo', '')
    } else {
      this.getExtensions()
    }
  }
}
</script>
<style lang="scss" scoped>
.block {
  background: #fff;
  margin-top: 0.2rem;
}
.flex-item{
  display: flex;
  align-items: center;
  padding: 0.3rem .3rem;
  position: relative;
  cursor: pointer;
  .item-title{
    font-weight: bold;
    color: #3F4663;
    span{
      color: #FF0000;
    }
  }
  .item-text{
    flex: 1;
    font-weight: 400;
    color: #3F4663;
  }
}
.flex-item::after{
  position: absolute;
  box-sizing: border-box;
  content: ' ';
  pointer-events: none;
  right: .3rem;
  bottom: 0;
  left: .3rem;
  border-bottom: 1px solid #ebedf0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.mark-box {
  padding: 0.3rem;
  background: #fff;
  margin-top: 0.2rem;
}
.mark {
  padding-bottom: 0.4rem;
  font-size: 0.28rem;
  color: #3f4663;
  font-weight: bold;
}
.text-border {
  border: 1PX solid #ddd;
  border-radius: 0.08rem;
}
.tip {
  padding: 0.3rem;
  font-size: 0.24rem;
  color: #ff0000;
}
.backup-btn-placeholder {
  height: 1.6rem;
}
.backup-btn-box {
  padding: 0.3rem 0;
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
}
.backup-btn {
  width: 6.9rem;
  height: 1rem;
  background: #2da3f6;
  border-radius: 0.2rem;
  color: #fff;
}
.confirm-btn{
    padding: .2rem .3rem;
    .van-button{
      background-color: #F6F8FD;
      border-color: #F6F8FD;
      color: #3F4663;
    }
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
.picker-time .content{
  position: relative;
}
.time-label {
  display: flex;
  align-items: center;
  width: 100%;
  height: 1rem;
  position: absolute;
  top: 50%;
  z-index: 2;
  transform: translateY(-50%);
  pointer-events: none;
  span {
    flex: 1;
    text-align: right;
    font-size: 0.28rem;
    font-weight: bold;
    color: #94A5BE;
    padding-right: .3rem;
  }
}
</style>
<style scoped>
  .backup-time >>> .van-action-sheet__header,.picker-time >>> .van-action-sheet__header{
    padding-left: .3rem;
    text-align: left;
  }
  .backup-time >>> .van-action-sheet__close,.picker-time >>> .van-action-sheet__close{
    color: #3F4663;
    font-size: .3rem;
    font-weight: 700;
  }
  .backup-time >>> .van-cell{
    padding: 0.3rem 0.32rem;
  }
  .picker-time >>> .van-picker__columns .van-picker-column:first-child{
    display: none;
  }
  .picker-time >>>  .van-picker-column__item{
    font-size: .36rem;
    font-weight: 700;
    color: #CED5DE;
    padding-right: .3rem;
  }
  .picker-time >>>  .van-picker-column__item.van-picker-column__item--selected{
    color: #3F4663;
  }
  .picker-time >>>  .van-picker-column__item.van-picker-column__item--selected{
    font-size: .5rem;
    color: #3F4663;
    font-weight: 700;
    margin-right: .1rem;
  }
</style>
