<template>
<div class="wrapper">
  <van-nav-bar
    :title="$t('owner.log')"
    left-arrow
    :fixed="true"
    :placeholder="true"
    @click-left="onClickLeft">
    <template #left>
      <van-icon name="arrow-left" color="#3F4663"/>
    </template>
  </van-nav-bar>
  <div class="top-box">
    <div class="title">
      <h3>{{ $t('owner.logSync') }}</h3>
      <van-switch
        v-model="logSetting"
        :loading="settingLoading"
        size="0.36rem"
        active-color="#2da3f6"
        inactive-color="#cfd6e0"
        @change="setSetting"/>
    </div>
    <p class="desc">{{ $t('owner.logSyncDesc') }}</p>
  </div>
  <van-sticky :offset-top="`.92rem`">
    <div class="type-box">
      <p class="log-tip">{{ $t('owner.logging') }}</p>
      <div class="filter-box">
        <p class="filter-item" @click="dateShow = true">
          <span>{{ logDate }}</span>
          <van-icon name="arrow-down" color="#3f4663" class="down-icon"/>
        </p>
        <p class="filter-item" @click="typeShow = true">
          <span>{{ activeLog }}</span>
          <van-icon name="arrow-down" color="#3f4663" class="down-icon"/>
        </p>
      </div>
    </div>
  </van-sticky>
  <div class="log-list">
    <van-list
      v-model="loading"
      :finished="finished"
      :finished-text="$t('global.noMore')"
      @load="loadData(true)">
      <div
        v-for="(item, index) in logList"
        :key="item.time + index"
        class="log-item">
        <div class="top">
          <p class="left">{{ item.logTime }}</p>
          <div class="right">
            <span v-if="item.level === 'info'" class="tag normal">{{ $t('global.normal') }}</span>
            <span v-else-if="item.level === 'warning'" class="tag warn">{{ $t('global.warn') }}</span>
            <span v-else-if="item.level === 'error'" class="tag error">{{ $t('global.error') }}</span>
            <span v-else-if="item.level === 'trace'" class="tag debug">{{ $t('global.trace') }}</span>
            <span v-else-if="item.level === 'debug'" class="tag debug">{{ $t('global.debug') }}</span>
            <span v-else-if="item.level === 'fatal'" class="tag error">{{ $t('global.fatal') }}</span>
            <span v-else-if="item.level === 'panic'" class="tag error">{{ $t('global.panic') }}</span>
            <p class="date">{{ item.logDate }}</p>
          </div>
        </div>
        <Expand>
          <p class="content">{{ item.msg }}</p>
        </Expand>
      </div>
    </van-list>
  </div>
  <div class="commit-btn-placeholder">
    <div v-show="!logSetting" class="commit-btn-box">
      <van-button class="commit-btn" @click="handleUpload">{{ $t('owner.logUpload') }}</van-button>
    </div>
  </div>
  <!--日志类型弹窗-->
  <LogTypePopup
    v-model="typeShow"
    :active="typeActive"
    :opList="typeList"
    @on-change="handleTypeChange"/>
  <!--选择日志日期-->
  <van-calendar
    v-model="dateShow"
    class="calendar"
    color="#3699ff"
    :show-confirm="false"
    :show-mark="false"
    :min-date="minDate"
    :max-date="maxDate"
    :default-date="defaultDate"
    @select="handelDateSelect">
    <template v-slot:title>
      <div class="calendar-title clearfix">
        <span class="float-l" @click="handleChoseAll">{{ $t('global.all') }}</span>
        {{ $t('owner.logDateFilter') }}
      </div>
    </template>
  </van-calendar>
  <!--上传确认按钮-->
  <ConfirmDialog
    v-model="confirmShow"
    :title="confirmTitle"
    :secondTitle="confirmSecondTitle"
    :textCenter="true"
    @confirm="uploadLog"/>
  <!--操作反馈弹窗-->
  <FeedbackDialog
    v-model="feedbackShow"
    :type="feedbackType"
    :title="feedbackTitle"
    :content="feedbackContent"/>
  <!--模拟进度条弹窗-->
  <ProgressDialog
    ref="progress"
    v-model="progressShow"
    :title="progerssTitle"
    :content="progressContent"/>
</div>
</template>
<script>
import LogTypePopup from './components/LogTypePopup.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import FeedbackDialog from './components/FeedbackDialog.vue'
import ProgressDialog from './components/ProgressDialog.vue'
import Expand from './components/Expand.vue'

const PAGE_SIZE = 50

export default {
  name: 'log',
  components: {
    LogTypePopup,
    ConfirmDialog,
    FeedbackDialog,
    ProgressDialog,
    Expand
  },
  data() {
    return {
      logSetting: false,
      settingLoading: false,
      typeShow: false,
      dateShow: false,
      confirmShow: false,
      feedbackShow: false,
      feedbackType: '',
      feedbackTitle: '',
      feedbackContent: '',
      progressShow: false,
      progerssTitle: this.$t('owner.logUploading'),
      progressContent: '',
      typeActive: 'all',
      defaultDate: null,
      currentDate: '', // 筛选的条件日期
      loading: false,
      finished: false,
      typeList: [
        {
          value: 'all',
          name: this.$t('global.all')
        },
        {
          value: 'info',
          name: this.$t('global.normal')
        },
        {
          value: 'warning',
          name: this.$t('global.warn')
        },
        {
          value: 'error',
          name: this.$t('global.error')
        },
        {
          value: 'other',
          name: this.$t('global.other')
        }
      ],
      logList: [], // 日志列表
      params: {
        date: '',
        type: 'all', // all  info warning error
        page: 1
      }, // 获取列表参数
      minDate: new Date(2021, 11, 20), // 最小日期
      maxDate: new Date(2021, 11, 27), // 最大日期
      confirmTitle: this.$t('owner.logUpload'),
      confirmSecondTitle: this.$t('owner.logUploadConfirmTip'),
      lastDate: ''
    }
  },
  computed: {
    activeLog() {
      const res = this.typeList.find(item => item.value === this.typeActive)
      return res.name
    },
    logDate() {
      if (this.currentDate === '') {
        return this.$t('owner.logAllDate')
      }
      return this.currentDate
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    // 处理日志类型变化
    handleTypeChange(item) {
      this.typeShow = false
      this.typeActive = item.value
      if (!this.currentDate) {
        this.initDate()
      }
      this.params.type = item.value
      this.params.page = 1
      this.logList = []
      this.loadData()
    },
    // 处理选择全部日期
    handleChoseAll() {
      this.handelDateSelect('')
    },
    // 初始化默认日期参数
    initDate() {
      const seconds = Date.now() / 1000
      this.params.date = this.$methods.getTime(seconds, 'yymmdd')
    },
    // 处理日期选择
    handelDateSelect(date) {
      if (!date) {
        this.initDate()
        this.defaultDate = null
        this.currentDate = ''
      } else {
        const seconds = date.getTime() / 1000
        this.currentDate = this.$methods.getTime(seconds, 'YY-MM-DD')
        this.params.date = this.$methods.getTime(seconds, 'yymmdd')
      }
      this.params.page = 1
      this.logList = []
      this.dateShow = false
      this.loadData()
    },
    // 获取日志设置状态
    getSetting() {
      this.http.getUserCertificate().then((res) => {
        if (res.status !== 0) {
          return
        }
        this.logSetting = res.data.log_setting.log_switch
      })
    },
    // 设置日志状态
    setSetting(logSwitch) {
      const params = {
        log_setting: {
          log_switch: logSwitch
        }
      }
      this.settingLoading = true
      this.http.setUserCertificate(params).then(() => {
        this.settingLoading = false
      }).catch(() => {
        this.settingLoading = false
      })
    },
    // 加载数据
    loadData(isMore = false) {
      if (!isMore) {
        this.finished = false
      }
      this.loading = true
      this.http.getLogList(this.params).then((res) => {
        this.loading = false
        if (res.status !== 0 && res.status !== 3) {
          this.finished = true
          return
        }
        if (res.data.last_line) {
          this.params.last_line = res.data.last_line
        }
        if (isMore) {
          this.logList = this.logList.concat(this.formatData(res.data.logs))
        } else {
          this.logList = this.formatData(res.data.logs)
        }
        /**
        * hack: 为了妥协接口无法一次性请求全部数据，只有前端分日期去模拟拿全部日期数据
        */
        if (!this.currentDate) {
          if (this.params.date === res.data.last_day) {
            this.params.page += 1
          } else if (res.data.logs.length < PAGE_SIZE) {
            this.params.page = 1
            this.params.date = res.data.last_day
          } else {
            this.params.page += 1
          }
        } else {
          this.params.page += 1
        }
        // 超过一千条或者没有日志了不再请求
        if (!res.data.last_day || (this.currentDate && this.logList.length < PAGE_SIZE)) {
          this.params.page = 1
          this.finished = true
        }
      }).catch(() => {
        this.loading = false
        this.finished = true
      })
    },
    // 格式化数据
    formatData(list) {
      return list.map((item) => {
        const arr = item.time.split(/\s+/)
        const [logDate, logTime] = arr
        item.logDate = logDate
        item.logTime = logTime
        item.expand = true
        return item
      })
    },
    // 处理上传按钮
    handleUpload() {
      this.confirmShow = true
    },
    // 上传日志
    uploadLog() {
      const now = Date.now() / 1000
      this.progressContent = `${this.$t('owner.logUploadTime')}：${this.$methods.getTime(now, 'YY-MM-DD hh:mm')}`
      this.progressShow = true
      this.http.uploadLog().then((res) => {
        if (res.status === 0) {
          // 成功
          this.$refs.progress.done()
          this.feedbackType = 'success'
          this.feedbackTitle = this.$t('owner.logUploadSuccess')
        } else {
          // 失败
          this.feedbackType = 'fail'
          this.feedbackTitle = this.$t('owner.logUploadFail')
        }
        setTimeout(() => {
          this.progressShow = false
          this.feedbackShow = true
        }, 500)
      })
    },
    // 获取当天年月日
    getLastDate() {
      const date = new Date()
      const year = date.getFullYear()
      const mon = date.getMonth()
      const day = date.getDate()
      this.maxDate = new Date(year, mon, day) // 最大日期
      if (day >= 6) {
        this.minDate = new Date(year, mon, day - 6) // 最小日期
      } else if (mon > 0) {
        if (mon === 2 || mon === 4 || mon === 6 || mon === 7 || mon === 9 || mon === 11) {
          this.minDate = new Date(year, mon - 1, 30 - Math.abs(day - 6))
        } else if (mon === 1) {
          this.minDate = new Date(year, mon - 1, 28 - Math.abs(day - 6))
        } else {
          this.minDate = new Date(year, mon - 1, 31 - Math.abs(day - 6))
        }
      } else if (mon === 0) {
        this.minDate = new Date(year - 1, 11, 30 - Math.abs(day - 6))
      }
    }
  },
  created() {
    this.initDate()
    this.getSetting()
    this.loadData()
  },
  mounted() {
    this.getLastDate()
  }
}
</script>
<style lang="scss" scoped>
.top-box {
  padding: 0.3rem;
  background: #fff;
  .title {
    display: flex;
    h3 {
      flex: 1;
    }
  }
  .desc {
    padding-top: 0.25rem;
    max-width: 5.5rem;
    font-size: 0.24rem;
    color: #3f4663;
    line-height: 1.5;
  }
}
.type-group {
  width: 1.6rem;
  background: #fff;
  box-shadow: 0 0 0.2rem 0 rgba(0, 0, 0, 0.1);
  border-radius: 0.2rem;
  .active {
    color: #2da3f6
  }
}
.type-item {
  padding: 0.36rem 0;
  border-bottom: 1PX solid #eee;
  text-align: center;
  font-size: 0.28rem;
  color: #3f4663;
}
.type-item:last-child {
  border-bottom: 0;
}
.type-box {
  padding: 0.3rem;
  background: #f6f8fd;
  .log-tip {
    padding-bottom: 0.18rem;
    font-size: 0.24rem;
    color: #94a5be;
  }
}
.filter-item {
  display: inline-block;
  margin-right: 0.76rem;
  span {
    font-size: 0.28rem;
    font-weight: bold;
    color: #3f4663;
    margin-right: 0.13rem;
  }
  .down-icon {
    vertical-align: top;
  }
}
.log-item {
  padding: 0.3rem;
  background: #fff;
  margin-bottom: 0.2rem;
  .top {
    display: flex;
    padding-bottom: 0.2rem;
    .left {
      padding-right: 0.3rem;
      font-size: 0.56rem;
      color: #3f4663;
      height: 0.46rem;
      border-right: 1PX solid #eee;
    }
    .right {
      padding-left: 0.3rem;
    }
    .tag {
      display: inline-block;
      padding: 0.05rem 0.1rem;
      border-radius: 0.14rem;
      font-size: 0.18rem;
    }
    .normal {
      background-color: rgba(11, 219, 153, 0.2);
      color: #0bdb99;
    }
    .debug {
      background-color: rgba(45, 163, 246, 1);
      color: #ffffff;
    }
    .warn {
      background-color: rgba(246, 174, 30, 0.2);
      color: #f6ae1e;
    }
    .error {
      background-color: rgba(255, 0, 0, 0.2);
      color: #ff0000;
    }
    .date {
      padding-top: 0.06rem;
      font-size: 0.18rem;
      color: #3f4663;
    }
  }
  .content {
    line-height: 0.44rem;
    font-size: 0.24rem;
    color: #3f4663;
  }
}
.commit-btn-placeholder {
  height: 1.6rem;
}
.commit-btn-box {
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translate(-50%);
  padding: 0.3rem;
  background-color: #f6f8fd;
}
.commit-btn {
  width: 6.9rem;
  height: 1rem;
  background: #2da3f6;
  border-radius: 0.2rem;
  color: #fff;
}
.pa160{
  padding-bottom: 1.6rem;
}
</style>
<style scoped>
.calendar-title {
  padding: 0 0.3rem;
  font-size: 0.32rem;
  font-weight: bold;
  color: #3f4663;
  cursor: pointer;
  border-bottom: 1PX solid #eee;
}
.calendar >>> .van-calendar__selected-day {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 0.2rem;
}
.calendar >>> .van-calendar__header-subtitle,
.calendar >>> .van-calendar__month-title {
  font-weight: bold;
}
.calendar >>> .van-calendar__weekday:first-child,
.calendar >>> .van-calendar__weekday:last-child {
  color: #f3a934;
}
</style>
