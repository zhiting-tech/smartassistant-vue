<template>
  <div class="creat-scene">
    <van-nav-bar
      :title="title"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft"
      @click-right="deleteShow = true">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
      <template #right v-if="isEdit && permissions.delete_scene">
        <span class="nav-edit">{{ $t('global.del') }}</span>
      </template>
    </van-nav-bar>
    <!--loading模块-->
    <Loading v-if="loading"></Loading>
    <template v-else>
      <div class="scene-box">
        <van-field
          v-model="params.name"
          :disabled="!canUpdate"
          class="scene-name"
          clearable
          :placeholder="$t('creatScene.placeholder')"
          maxlength="40"
          @blur="getSceneName()" />
      </div>
      <div class="add-box">
        <div class="item-box" v-if="!isEmptyCondition">
          <div class="item-header">
            <div class="left-info">
              <div class="title">{{$t('creatScene.headerTitle1')}}</div>
              <span v-if="conditionList.length > 1" @click="showRelation">
                {{ params.condition_logic === 1
                  ? $t('creatScene.relationItemTitle1')
                  : params.condition_logic === 2
                  ? $t('creatScene.relationItemTitle2')
                  : ''
                }}
              <van-icon name="arrow-down" color="#3F4663"/></span>
            </div>
            <div class="right-info" @click="showTrigger()">
              <van-icon name="add" :color="isManual || !canUpdate ? '#CED5DE' : '#2DA3F6'" size=".4rem" />
            </div>
          </div>
          <van-swipe-cell
            v-for="(condition, index) in conditionList"
            :key="index"
            :disabled="(isEdit && isManual) || !canUpdate">
            <div class="item-list" @click="conditionChange(condition, index)">
              <div class="content">
                <div class="title" v-html="getConditionTitle(condition)"></div>
              </div>
              <div
                v-if="condition.condition_type === 1 || condition.condition_type === 2"
                class="info">
                <h3>
                  {{condition.condition_type === 1 ? $t('creatScene.conditionItemTitle2') : condition.device_info.name}}
                </h3>
                <p v-if="condition.condition_type === 2">
                  <span v-if="condition.device_info && condition.device_info.status === 2" class="c-yellow">
                    {{ $t('creatScene.deviceDel') }}
                  </span>
                  <span v-else>
                    {{ condition.device_info.location_name }}
                  </span>
                </p>
              </div>
              <div
                class="image-item"
                :class="{
                  'border': condition.condition_type === 2,
                  'disabled': condition.device_info && condition.device_info.status === 2
                }">
                <CommonImage
                  class="dev-img"
                  lazy-load
                  fit="contain"
                  :src="getConditionIcon(condition)"/>
                <span v-if="condition.device_info && condition.device_info.status === 3" class="mask">{{$t('scene.offLine')}}</span>
                <span v-if="condition.device_info && condition.device_info.status === 2" class="mask">{{$t('scene.deleted')}}</span>
              </div>
            </div>
            <template #right>
              <van-button
                square
                :text="$t('global.del')"
                type="danger"
                class="delete-button"
                @click="deleteCondition(index)"/>
            </template>
          </van-swipe-cell>
        </div>
        <div v-else class="add-item active" @click="show = true">
          <div class="add-icon"><van-icon name="add" /></div>
          <p class="add-description">{{$t('creatScene.addCondition')}}</p>
        </div>
        <div class="item-box" v-if="!isEmptyTask">
          <div class="item-header">
            <div class="left-info">
              <div class="title">{{$t('creatScene.headerTitle2')}}</div>
            </div>
            <div class="right-info" @click="addMission">
              <van-icon name="add" :color="!canUpdate ? '#CED5DE' : '#2DA3F6'" size=".4rem" />
            </div>
          </div>
          <van-swipe-cell
            v-for="(task, index) in taskList"
            :key="index"
            :disabled="!canUpdate">
            <div class="item-list" @click="taskChange(task, index)">
              <div class="content">
                <div class="title" v-html="getTaskTitle(task)"></div>
                <div v-if="task.delay_seconds" class="count-down-box">
                  <van-icon name="underway-o"/>
                  <van-count-down
                    :time="task.delay_seconds * 1000"
                    :format="timeFormat(task.delay_seconds)"
                    :auto-start="false"/>
                </div>
              </div>
              <div class="info">
                <h3>{{ task.type === 1 ? task.device_info.name : task.control_scene_info.name }}</h3>
                <p v-if="task.type === 1">
                  <span v-if="task.device_info.status === 2" class="c-yellow">
                    {{ $t('creatScene.deviceDel') }}
                  </span>
                  <span v-else>
                    {{ task.device_info.location_name }}
                  </span>
                </p>
                <p v-if="task.type !== 1 && task.control_scene_info">
                  <span v-if="task.control_scene_info.status === 2" class="c-yellow">
                    {{ $t('creatScene.sceneDel') }}
                  </span>
                </p>
              </div>
              <div
                class="image-item"
                :class="{
                  'border': task.type === 1,
                  'disabled': (task.device_info && task.device_info.status === 2) ||(task.control_scene_info && task.control_scene_info.status === 2)
                }">
                <CommonImage
                  class="dev-img"
                  fit="contain"
                  lazy-load
                  :src="getTaskIcon(task)"/>
                <span v-if="task.device_info && task.device_info.status === 3" class="mask">{{$t('scene.offLine')}}</span>
                <span v-if="task.device_info && task.device_info.status === 2" class="mask">{{$t('scene.deleted')}}</span>
              </div>
            </div>
            <template #right>
              <van-button
                square
                :text="$t('global.del')"
                type="danger"
                class="delete-button"
                @click="deleteTask(index)"/>
            </template>
          </van-swipe-cell>
        </div>
        <div
          v-else
          class="add-item"
          :class="{'active': !isEmptyCondition}"
          @click="addMission">
          <div class="add-icon"><van-icon name="add" /></div>
          <p class="add-description">{{$t('creatScene.addTask')}}</p>
        </div>
        <div
          v-show="needEffective"
          class="item-box"
          @click="handleEffectiveTime()">
          <div class="item-list no-border">
            <div class="text-item">
              <div class="title">{{$t('scene.effictiveTimeTitle')}}</div>
              <p>{{ repeatType }}</p>
            </div>
            <div class="time-item">{{ effectiveTime }}</div>
            <van-icon name="arrow" color="#CCCCCC" size=".4rem"/>
          </div>
        </div>
      </div>
      <!-- 保存按钮 -->
      <div
        v-if="canUpdate"
        style="height:1.6rem;">
        <div class="save-btn-box">
          <van-button
            class="save-btn"
            type="info"
            block
            :loading="finishLoading"
            :loading-text="$t('global.saving')"
            :disabled="finishLoading"
            @click="onClickRight()">
            {{ $t('creatScene.finish') }}
          </van-button>
        </div>
      </div>
    </template>
    <!-- 添加触发条件-->
    <van-action-sheet
      v-model="show"
      :title="$t('creatScene.conditionTitle')"
      class="action-condition">
      <div class="condition-box">
        <div
          v-for="item in triggerList"
          :key="item.value"
          class="condition-item"
          @click="handleTrigger(item)"
          :class="{'disabled': item.disabled}">
          <div class="image-item">
            <van-image width=".8rem" height=".8rem" lazy-load :src="item.icon"/>
          </div>
          <div class="text-item">
            <div class="title">{{ item.name }}</div>
            <p>{{ item.desc }}</p>
          </div>
          <van-icon name="arrow" color="#CCCCCC" size=".4rem"/>
        </div>
      </div>
    </van-action-sheet>
    <!-- 添加执行任务-->
    <van-action-sheet v-model="taskShow" :title="$t('creatScene.taskTitle')" class="action-condition">
      <div class="condition-box">
        <div
          v-for="item in missionList"
          :key="item.value"
          class="condition-item"
          @click="handleMission(item)">
          <div class="image-item">
            <van-image width=".8rem" height=".8rem" lazy-load :src="item.icon"/>
          </div>
          <div class="text-item">
            <div class="title">{{ item.name }}</div>
            <p>{{ item.desc }}</p>
          </div>
          <van-icon name="arrow" color="#CCCCCC" size=".4rem"/>
        </div>
      </div>
    </van-action-sheet>
    <!-- 请选择多条件关系-->
    <van-action-sheet
      v-model="relationShow"
      :title="$t('creatScene.relationTitle')"
      class="action-condition">
      <van-radio-group v-model="params.condition_logic">
        <div class="condition-box">
          <div
            v-for="item in relationList"
            :key="item.value"
            class="condition-item"
            :class="{ 'disabled': item.disabled }"
            @click="handleRelation(item)">
            <div class="text-item">
              <div
                class="title"
                :class="{ 'active': params.condition_logic === item.value }">
                {{ item.name }}
              </div>
            </div>
            <div class="radio-item">
              <van-radio :name="item.value" />
            </div>
          </div>
        </div>
      </van-radio-group>
    </van-action-sheet>
    <!-- 控制场景-->
    <van-action-sheet v-model="controlShow" :title="$t('creatScene.controlTitle')" class="action-condition">
      <van-radio-group v-model="controlActive">
        <div class="condition-box">
          <div
            v-for="item in controlList"
            :key="item.value"
            class="condition-item"
            @click="handleControl(item)">
            <div class="text-item">
              <div class="title" :class="{ 'active': controlActive === item.value }">{{ item.name }}</div>
            </div>
            <div class="radio-item">
              <van-radio :name="item.value" />
            </div>
          </div>
        </div>
      </van-radio-group>
    </van-action-sheet>
    <!-- 时间选择 -->
    <TimePicker
      v-model="timeShow"
      title="定时"
      :current="currentTime"
      @on-sure="handleTiming"/>
    <!--删除确认弹窗-->
    <van-dialog
      v-model="deleteShow"
      show-cancel-button
      :confirmButtonText="$t('global.del')"
      confirm-button-color="#2DA3F6"
      cancel-button-color="#94A5BE"
      :before-close="beforeClose">
      <p class="delete-tip">{{ $t('creatScene.delTip') }}</p>
    </van-dialog>
  </div>
</template>
<script>

import { mapGetters } from 'vuex'
import TimePicker from '@/components/TimePicker.vue'

// 当天时间戳
const dayTime = new Date(new Date().toLocaleDateString()).getTime() / 1000
const dayTimeEnd = dayTime + (24 * 60 * 60 - 1)
const manualIcon = require('../../assets/icon-manual.png')
const timingIcon = require('../../assets/icon-timing.png')
const deviceIcon = require('../../assets/icon-device.png')
const smartDevice = require('../../assets/icon-smart-device.png')
const controlScene = require('../../assets/icon-control-scene.png')
const emptyImg = require('../../assets/empty-icon.png')

export default {
  name: 'creatScene',
  components: {
    TimePicker
  },
  data() {
    return {
      sceneId: '', // 场景id 用来判断是否编辑
      fromScene: false, // 是否从场景列表进来
      emptyImg,
      manualIcon,
      timingIcon,
      deviceIcon,
      smartDevice,
      controlScene,
      conditionList: [], // 执行条件列表
      taskList: [],
      loading: false,
      finishLoading: false,
      show: false,
      taskShow: false,
      relationShow: false,
      controlShow: false,
      deleteShow: false,
      currentTime: 0, // 当前选择时间
      timeIndex: -1, // 用来判断是修改时间还是新增 -1：新增 其他：修改项的下标值index
      oldParams: {}, // 旧的params 用来判断是否修改
      params: { // 创建场景数据结构体
        name: '', // 名称 必须
        condition_logic: 1, // auto_run 为false时可不传，1满足所有，2，满足任一
        auto_run: false, // true 为自动，false为手动
        time_period: 1, // 生效时间类型，全天为1，时间段为2,auto_run为false可不传
        effect_start_time: dayTime, // 生效开始时间,time_period为0时应传某天0点;auto_run为false可不传
        effect_end_time: dayTimeEnd, // 生效结束时间,time_period为0时应传某天24点;auto_run为false可不传
        repeat_type: 1, // 重复执行的类型；1：每天; 2:工作日 ；3：自定义;auto_run为false可不传
        repeat_date: '1234567', // 只能传长度为7包含1-7的数字；"1122"视为不合法传参;repeat_type为0时:"1234567";1时:12345;2时：任意
        scene_conditions: [], // auto_run 为手动时，传空数组
        scene_tasks: [] // 执行列表
      },
      sceneConditions: { // 触发条件结构体
        condition_type: 0, // 1:定时；2：设备状态变化时
        timing: 0, // // 1:定时；2：设备状态变化时
        device_id: 0, // condition_type为2时需传
        operator: '=', // ">","<","=";  操作符，condition_type为2时需传
        condition_attr: {}
      },
      delConditionList: [], // 删除场景的id
      delTaskList: [], // 删除任务id
      triggerList: [
        {
          value: 0,
          disabled: false,
          name: this.$t('creatScene.conditionItemTitle1'),
          desc: this.$t('creatScene.conditionItemCon1'),
          icon: manualIcon
        },
        {
          value: 1,
          disabled: false,
          name: this.$t('creatScene.conditionItemTitle2'),
          desc: this.$t('creatScene.conditionItemCon2'),
          icon: timingIcon
        },
        {
          value: 2,
          disabled: false,
          name: this.$t('creatScene.conditionItemTitle3'),
          desc: this.$t('creatScene.conditionItemCon3'),
          icon: deviceIcon
        }
      ],
      missionList: [
        {
          value: 1,
          name: this.$t('creatScene.taskItemTitle1'),
          desc: this.$t('creatScene.taskItemCon1'),
          icon: smartDevice
        },
        {
          value: 2,
          name: this.$t('creatScene.taskItemTitle2'),
          desc: this.$t('creatScene.taskItemCon2'),
          icon: controlScene
        }
      ],
      relationList: [
        {
          value: 1,
          name: this.$t('creatScene.relationItemTitle1'),
          disabled: false
        },
        {
          value: 2,
          name: this.$t('creatScene.relationItemTitle2'),
          disabled: false
        }
      ],
      controlActive: 0,
      controlList: [
        {
          value: 2,
          name: this.$t('creatScene.controlItemTitle1')
        },
        {
          value: 3,
          name: this.$t('creatScene.controlItemTitle2')
        },
        {
          value: 4,
          name: this.$t('creatScene.controlItemTitle3')
        }
      ],
      timeShow: false,
      position: 0
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    // 是否有编辑权限
    canUpdate() {
      if (this.isEdit) {
        return this.permissions.update_scene
      }
      return true
    },
    // 是否编辑
    isEdit() {
      return !!this.sceneId
    },
    // 页面标题
    title() {
      if (this.isEdit) {
        return this.$t('creatScene.title2')
      }
      return this.$t('creatScene.title')
    },
    // 是否手动自行
    isManual() {
      const index = this.conditionList.findIndex(item => item.condition_type === 0)
      return this.conditionList.length && index !== -1
    },
    // 能否选择 满足所有关系条件
    canMultiple() {
      const timeList = this.conditionList.filter(item => item.condition_type === 1)
      if (timeList.length > 1) {
        return false
      }
      return true
    },
    // 能否创建
    canCreate() {
      return this.params.name && !this.isEmptyCondition && !this.isEmptyTask
    },
    // 返回是否需要弹窗提示
    reIsDialog() {
      if (!this.canUpdate) {
        return true
      }
      if (this.isEdit) {
        return JSON.stringify(this.params) === JSON.stringify(this.oldParams)
      }
      return !this.params.name && this.isEmptyCondition && this.isEmptyTask
    },
    // 是否需要有效时间
    needEffective() {
      return !this.isEmptyCondition && !this.isManual
    },
    // 生效时间段
    effectiveTime() {
      if (this.params.time_period === 1) {
        return this.$t('creatScene.allDay')
      }
      const start = this.$methods.getTimestamp(this.params.effect_start_time)
      const end = this.$methods.getTimestamp(this.params.effect_end_time)
      return `${this.$methods.formatTime(start)} - ${this.$methods.formatTime(end)}`
    },
    // 重复频类
    repeatType() {
      if (this.params.repeat_type === 1) {
        return this.$t('effectiveTime.everyDay')
      }
      if (this.params.repeat_type === 2) {
        return this.$t('effectiveTime.week')
      }
      let res = ''
      const list = this.params.repeat_date.split('')
      const map = {
        1: this.$t('effectiveTime.monday'),
        2: this.$t('effectiveTime.tuesday'),
        3: this.$t('effectiveTime.wednesday'),
        4: this.$t('effectiveTime.thursday'),
        5: this.$t('effectiveTime.friday'),
        6: this.$t('effectiveTime.saturday'),
        7: this.$t('effectiveTime.sunday')
      }
      list.forEach((val) => {
        res += `${map[val]}、`
      })
      return res.replace(/、$/, '')
    },
    isEmptyCondition() {
      return this.conditionList.length === 0
    },
    isEmptyTask() {
      return this.taskList.length === 0
    }
  },
  watch: {
    show(val) {
      if (!val) {
        return
      }
      const list = this.conditionList
      // 监听条件变化处理触发选项
      const manual = list.find(item => item.condition_type === 0)
      const auto = list.find(item => item.condition_type === 1)
      if (manual) {
        // 手动禁止所有
        this.triggerList.forEach((item) => {
          item.disabled = true
        })
      } else if (auto) {
        // 自动且满足所有 禁止手动和定时
        if (this.params.condition_logic === 1) {
          this.triggerList.forEach((item) => {
            if (item.value !== 2) {
              item.disabled = true
            } else {
              item.disabled = false
            }
          })
        } else {
          // 自动且其他 禁止手动
          this.triggerList.forEach((item) => {
            if (item.value === 0) {
              item.disabled = true
            } else {
              item.disabled = false
            }
          })
        }
      } else {
        // 编辑禁止自动换手动
        this.triggerList.forEach((item) => {
          if (item.value === 0 && (list.length || this.isEdit)) {
            item.disabled = true
          } else {
            item.disabled = false
          }
        })
      }
    }
  },
  methods: {
    onClickLeft() {
      if (this.reIsDialog) {
        this.$router.go(-1)
        return
      }
      this.$dialog.confirm({
        title: '',
        confirmButtonColor: '#2DA3F6',
        message: this.$t('creatScene.quitTip'),
      }).then(() => {
        if (this.$route.query.position) {
          const { position } = JSON.parse(JSON.stringify(this.$route.query))
          this.$router.push({
            name: 'scene',
            query: { position }
          })
        } else {
          this.$router.push({
            name: 'scene'
          })
        }
      }).catch(() => false)
    },
    // 获取场景详情
    getSceneDetail() {
      this.loading = true
      this.http.getSceneDetail(this.sceneId).then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        this.params = res.data
        this.oldParams = JSON.parse(JSON.stringify(res.data))
        if (!this.params.auto_run) {
          const obj = JSON.parse(JSON.stringify(this.sceneConditions))
          this.conditionList.push(obj)
        } else {
          this.conditionList = this.params.scene_conditions || []
        }
        this.taskList = this.params.scene_tasks || []
      }).catch(() => {
        this.loading = false
      })
    },
    // 触发条件标题
    getConditionTitle(condition) {
      const actionMap = {
        on: this.$t('condition.turnOn'),
        off: this.$t('condition.shutDown')
      }
      const firstActionMap = {
        on: this.$t('condition.firstSwitchOn'),
        off: this.$t('condition.firstSwitchOff')
      }
      const secondActionMap = {
        on: this.$t('condition.secondSwitchOn'),
        off: this.$t('condition.secondSwitchOff')
      }
      const thirdActionMap = {
        on: this.$t('condition.thirdSwitchOn'),
        off: this.$t('condition.thirdSwitchOff')
      }
      const opMap = {
        '>': this.$t('condition.more'),
        '=': this.$t('condition.equal'),
        '<': this.$t('condition.less')
      }
      const detectedMap = {
        1: this.$t('condition.isDetected')
      }
      const windowDoorMap = {
        1: this.$t('condition.offToOn'),
        0: this.$t('condition.onToOff')
      }
      const leakDetectedMap = {
        1: this.$t('condition.isLeakDetected')
      }
      const targetStateMap = {
        0: this.$t('condition.openAtHome'),
        1: this.$t('condition.openLeaveHome'),
        2: this.$t('condition.openSleep'),
        3: this.$t('condition.closeGuard')
      }
      const mapState = {
        100: this.$t('condition.curtainOpen'),
        0: this.$t('condition.curtainClose')
      }
      const mapPress = {
        0: this.$t('condition.singlePress'),
        1: this.$t('condition.doublePress'),
        2: this.$t('condition.longPress'),
      }
      if (condition.condition_type === 0) {
        return this.$t('creatScene.conditionItemTitle1')
      }
      if (condition.condition_type === 1) {
        return this.$methods.getTime(condition.timing, 'hh:mm:ss')
      }
      if (condition.condition_type === 2) {
        const item = condition.condition_attr || {}
        if (item.type === 'on_off') {
          return actionMap[item.val]
        }
        if (item.type === 'powers_1') {
          return firstActionMap[item.val]
        }
        if (item.type === 'powers_2') {
          return secondActionMap[item.val]
        }
        if (item.type === 'powers_3') {
          return thirdActionMap[item.val]
        }
        if (item.type === 'brightness') {
          return `${this.$t('condition.brightness')}${opMap[condition.operator]}${this.$methods.getPercent(item.max, item.min, item.val)}%`
        }
        if (item.type === 'color_temp') {
          return `${this.$t('condition.temperature')}${opMap[condition.operator]}${this.$methods.getPercent(item.max, item.min, item.val)}%`
        }
        if (item.type === 'temperature') {
          return `${this.$t('condition.temperature')}${opMap[condition.operator]}${item.val}℃`
        }
        if (item.type === 'humidity') {
          return `${this.$t('condition.humidity')}${opMap[condition.operator]}${this.$methods.getPercent(item.max, item.min, item.val)}%`
        }
        if (item.type === 'detected') {
          return detectedMap[item.val]
        }
        if (item.type === 'contact_sensor_state') {
          return windowDoorMap[item.val]
        }
        if (item.type === 'leak_detected') {
          return leakDetectedMap[item.val]
        }
        if (item.type === 'target_state') {
          return targetStateMap[item.val]
        }
        if (item.type === 'rgb') {
          return `${this.$t('condition.color')} <span style="background-color: ${item.val}; display: inline-block; width: .2rem; height: .2rem"></span>`
        }
        if (item.type === 'target_position') {
          if (item.val === 0 || item.val === 100) {
            if (condition.operator !== '=') {
              return `${this.$t('condition.curtainTitle')}${opMap[condition.operator]}${item.val}%`
            }
            return mapState[item.val]
          }
          return `${this.$t('condition.curtainTitle')}${opMap[condition.operator]}${this.$methods.getPercent(item.max, item.min, item.val)}%`
        }
        if (item.type === 'switch_event') {
          return mapPress[item.val]
        }
        if (item.type === 'volume') {
          return `${this.$t('deviceAttr.volume')}${opMap[condition.operator]}${this.$methods.getPercent(item.max, item.min, item.val)}%`
        }
        if (item.type === 'motion_detected') {
          return detectedMap[item.val]
        }
      }
      return ''
    },
    // 获取执行条件icon
    getConditionIcon(condition) {
      if (condition.condition_type === 0) {
        return this.manualIcon
      }
      if (condition.condition_type === 1) {
        return this.timingIcon
      }
      return condition.device_info.logo_url
    },
    // 获取任务标题
    getTaskTitle(task) {
      let res = ''
      const actionMap = {
        on: this.$t('condition.turnOn'),
        off: this.$t('condition.shutDown'),
        toggle: this.$t('condition.change')
      }
      const firstActionMap = {
        on: this.$t('condition.firstSwitchOn'),
        off: this.$t('condition.firstSwitchOff'),
        toggle: this.$t('condition.firstSwitchChange')
      }
      const secondActionMap = {
        on: this.$t('condition.secondSwitchOn'),
        off: this.$t('condition.secondSwitchOff'),
        toggle: this.$t('condition.secondSwitchChange')
      }
      const thirdActionMap = {
        on: this.$t('condition.thirdSwitchOn'),
        off: this.$t('condition.thirdSwitchOff'),
        toggle: this.$t('condition.thirdSwitchChange')
      }
      const detectedMap = {
        1: this.$t('condition.isDetected')
      }
      const windowDoorMap = {
        0: this.$t('condition.offToOn'),
        1: this.$t('condition.onToOff')
      }
      const leakDetectedMap = {
        1: this.$t('condition.isLeakDetected')
      }
      const targetStateMap = {
        0: this.$t('condition.openAtHome'),
        1: this.$t('condition.openLeaveHome'),
        2: this.$t('condition.openSleep'),
        3: this.$t('condition.closeGuard')
      }
      const mapState = {
        100: this.$t('condition.curtainOpen'),
        0: this.$t('condition.curtainClose')
      }
      if (task.attributes && task.attributes.length) {
        task.attributes.forEach((item) => {
          if (item.type === 'on_off') {
            res += actionMap[item.val]
          }
          if (item.type === 'powers_1') {
            res += firstActionMap[item.val]
          }
          if (item.type === 'powers_2') {
            res += secondActionMap[item.val]
          }
          if (item.type === 'powers_3') {
            res += thirdActionMap[item.val]
          }
          if (item.type === 'brightness') {
            res += `${this.$t('condition.brightness')}${this.$methods.getPercent(item.max, item.min, item.val)}%`
          }
          if (item.type === 'color_temp') {
            res += `${this.$t('condition.colorTemperature')}${this.$methods.getPercent(item.max, item.min, item.val)}%`
          }
          if (item.type === 'temperature') {
            res += `${this.$t('condition.temperature')}${item.val}℃`
          }
          if (item.type === 'humidity') {
            res += `${this.$t('condition.humidity')}${this.$methods.getPercent(item.max, item.min, item.val)}%`
          }
          if (item.type === 'detected') {
            res += detectedMap[item.val]
          }
          if (item.type === 'contact_sensor_state') {
            res += windowDoorMap[item.val]
          }
          if (item.type === 'leak_detected') {
            res += leakDetectedMap[item.val]
          }
          if (item.type === 'target_state') {
            res += targetStateMap[item.val]
          }
          if (item.type === 'rgb') {
            res += `${this.$t('condition.color')} <span style="background-color: ${item.val}; display: inline-block; width: .2rem; height: .2rem"></span>`
          }
          if (item.type === 'target_position') {
            if (item.val === 0 || item.val === 100) {
              res += mapState[item.val]
            } else {
              res += `${this.$t('condition.curtainTitle')}${this.$methods.getPercent(item.max, item.min, item.val)}%`
            }
          }
          if (item.type === 'volume') {
            res += `${this.$t('deviceAttr.volume')}${this.$methods.getPercent(item.max, item.min, item.val)}%`
          }
          if (item.type === 'motion_detected') {
            res += detectedMap[item.val]
          }
          res += '、'
        })
        return res.replace(/、$/, '')
      }
      if (task.type === 2) {
        return this.$t('creatScene.crrayOut')
      }
      if (task.type === 3) {
        return this.$t('global.on')
      }
      if (task.type === 4) {
        return this.$t('global.off')
      }
      return ''
    },
    // 获取任务icon
    getTaskIcon(task) {
      if (task.type === 1) {
        if (task.device_info && task.device_info.logo_url !== undefined) {
          return task.device_info.logo_url
        }
        return this.smartDevice
      }
      return this.controlScene
    },
    // 修改触发条件
    conditionChange(condition, index) {
      if (!this.canUpdate) {
        return
      }
      if (condition.condition_type === 1) {
        this.timeShow = true
        this.timeIndex = index
        this.currentTime = this.$methods.getTimestamp(condition.timing)
      } else if (condition.condition_type === 2) {
        // 设备删除不能跳转
        if (condition.device_info && condition.device_info.status === 2) {
          return
        }
        // 跳转设备触发页
        this.saveTempData()
        this.$router.push({
          name: 'conditionsDevice',
          query: {
            index,
            id: condition.device_id,
            sceneId: this.$route.query.sceneId,
            op: 'condition'
          }
        })
      }
    },
    // 修改执行任务
    taskChange(task, index) {
      if (!this.canUpdate) {
        return
      }
      if (task.type === 1) {
        // 设备删除不给跳转
        if (task.device_info && task.device_info.status === 2) {
          return
        }
        // 跳转设备触发页
        const id = task.device_id
        this.saveTempData()
        this.$router.push({
          name: 'conditionsDevice',
          query: {
            index,
            id,
            sceneId: this.$route.query.sceneId,
            op: 'execution'
          }
        })
      }
    },
    // 删除触发条件
    deleteCondition(index) {
      const { id } = this.conditionList[index]
      if (id) {
        this.delConditionList.push(id)
      }
      this.conditionList.splice(index, 1)
    },
    // 删除任务
    deleteTask(index) {
      const { id } = this.taskList[index]
      if (id && !this.delTaskList.includes(id)) {
        this.delTaskList.push(id)
      }
      this.taskList.splice(index, 1)
    },
    // 处理选择触发条件
    handleTrigger(item) {
      if (item.disabled) {
        return
      }
      this.show = false
      if (item.value === 0) {
        const obj = JSON.parse(JSON.stringify(this.sceneConditions))
        obj.condition_type = item.value
        this.conditionList.push(obj)
      } else if (item.value === 1) {
        this.timeShow = true
        this.currentTime = 0
        this.timeIndex = -1
      } else if (item.value === 2) {
        this.saveTempData()
        this.$router.push({
          name: 'conditionsList',
          query: {
            sceneId: this.$route.query.sceneId,
            op: 'condition',
            type: 2
          }
        })
      }
    },
    // 是否可以多关系弹窗
    showRelation() {
      if (!this.canUpdate) {
        return
      }
      if (!this.canMultiple) {
        this.relationList[0].disabled = true
      } else {
        this.relationList[0].disabled = false
      }
      this.relationShow = true
    },
    // 处理多选关系
    handleRelation(item) {
      if (item.disabled) {
        return
      }
      this.params.condition_logic = item.value
      this.relationShow = false
      if (this.conditionList.length < 2) {
        this.show = true
      }
    },
    // 处理控制场景
    handleControl(item) {
      this.controlActive = item.value
      // 跳转至控制场景页
      this.saveTempData()
      this.$router.push({
        name: 'conditionsScene',
        query: {
          type: item.value
        }
      })
    },
    // 处理添加任务按钮
    addMission() {
      if (this.isEmptyCondition || !this.canUpdate) {
        return
      }
      this.taskShow = true
    },
    // 处理执行任务
    handleMission(item) {
      if (item.value === 1) {
        this.saveTempData()
        // 跳转至设备列表页
        this.$router.push({
          name: 'conditionsList',
          query: {
            sceneId: this.$route.query.sceneId,
            op: 'execution',
            type: 1
          }
        })
      } else if (item.value === 2) {
        this.controlShow = true
      }
    },
    onClickRight() {
      if (!this.params.name) {
        this.$toast(this.$t('creatScene.noSceneName'))
      } else if (this.isEmptyCondition) {
        this.$toast(this.$t('creatScene.noAddCondition'))
      } else if (this.isEmptyTask) {
        this.$toast(this.$t('creatScene.noAddTask'))
      }
      if (!this.canCreate) {
        return
      }
      this.params.auto_run = !this.isManual
      this.params.scene_conditions = JSON.parse(JSON.stringify(this.conditionList))
      this.params.scene_tasks = JSON.parse(JSON.stringify(this.taskList))
      // 删除多余参数
      this.params.scene_tasks.forEach((item) => {
        if (item.device_info) {
          delete item.device_info
        }
      })
      this.params.scene_conditions.forEach((item) => {
        if (item.device_info) {
          delete item.device_info
        }
      })
      let params = {}
      if (!this.params.auto_run) {
        // 手动自行
        params = {
          name: this.params.name,
          auto_run: this.params.auto_run,
          scene_tasks: this.params.scene_tasks
        }
      } else {
        params = JSON.parse(JSON.stringify(this.params))
      }
      this.finishLoading = true
      if (this.isEdit) {
        // 修改场景
        if (this.delConditionList.length) {
          params.del_condition_ids = this.delConditionList
        }
        if (this.delTaskList.length) {
          params.del_task_ids = this.delTaskList
        }
        params.id = this.sceneId
        this.http.reviseScene(this.sceneId, params).then((res) => {
          this.finishLoading = false
          if (res.status !== 0) {
            return
          }
          this.$toast(this.$t('creatScene.modifySuccess'))
          this.$router.push({
            name: 'scene'
          })
        }).catch(() => {
          this.finishLoading = false
        })
      } else {
        // 创建场景
        this.http.creatScene(params).then((res) => {
          this.finishLoading = false
          if (res.status !== 0) {
            return
          }
          this.$toast(this.$t('creatScene.addSuccess'))
          this.$router.push({
            name: 'scene'
          })
        }).catch(() => {
          this.finishLoading = false
        })
      }
    },
    // beforeClose
    beforeClose(action, done) {
      if (action === 'confirm') {
        this.deleteScene()
      } else {
        done()
      }
    },
    // 删除场景
    deleteScene() {
      this.http.deleteScene(this.sceneId).then((res) => {
        if (res.status !== 0) {
          return
        }
        this.$toast(this.$t('global.delSuccess'))
        this.$router.push({
          name: 'scene'
        })
      })
      // do something
    },
    handleEffectiveTime() {
      if (!this.canUpdate) {
        return
      }
      this.saveTempData()
      this.$router.push({
        name: 'effectiveTime'
      })
    },
    // 匹对场景名
    getSceneName() {
      // 假接口
      // this.http.getSceneName().then((res) => {
      //   if (res.status !== 0) {
      //     return
      //   }
      //   this.$toast('执行成功')
      // }).catch(() => {
      //   this.$toast('与其他场景重名，请修改')
      // })
    },
    // 处理时间
    handleTiming(val) {
      const time = dayTime + val
      const obj = {
        condition_type: 1,
        timing: time
      }
      if (this.timeIndex === -1) {
        this.conditionList.push(obj)
      } else {
        this.conditionList[this.timeIndex] = Object.assign(this.conditionList[this.timeIndex], obj)
      }
      this.timeShow = false
    },
    // 显示条件控制
    showTrigger() {
      if (this.isManual || !this.canUpdate) {
        return
      }
      if (this.conditionList.length === 1) {
        this.showRelation()
      } else {
        this.show = true
      }
    },
    // 保存已选择数据
    saveTempData() {
      this.$methods.setSession('sceneParams', JSON.stringify(this.params))
      this.$methods.setSession('taskList', JSON.stringify(this.taskList))
      this.$methods.setSession('conditionList', JSON.stringify(this.conditionList))
      this.$methods.setSession('delTaskList', JSON.stringify(this.delTaskList))
    },
    // 倒计时格式显示
    timeFormat(time) {
      const hour = this.$t('effectiveTime.hour')
      const minute = this.$t('effectiveTime.minute')
      const second = this.$t('effectiveTime.second')
      const rear = this.$t('condition.rear')
      if (parseInt(time / 3600, 10) > 0) {
        return `HH ${hour} mm ${minute} ss ${second}${rear}`
      }
      if (parseInt(time / 60, 10) > 0) {
        return `mm ${minute} ss ${second}${rear}`
      }
      return `ss ${second}${rear}`
    }
  },
  beforeRouteEnter(to, from, next) {
    // 只有从列表进来才重新调接口获取数据
    let fromScene = false
    if (from.name === 'scene' || from.name === null) {
      fromScene = true
    }
    next((vm) => {
      vm.fromScene = fromScene
    })
  },
  created() {
    // 处理参数
    const { query } = this.$route
    this.sceneId = query.sceneId ? Number(query.sceneId) : ''
    this.$nextTick(() => {
      if (this.sceneId && this.fromScene) {
        this.getSceneDetail()
      }
    })
    // 处理已选数据
    const conditionStr = this.$methods.getSession('conditionList')
    const taskStr = this.$methods.getSession('taskList')
    const paramsStr = this.$methods.getSession('sceneParams')
    const delTaskStr = this.$methods.getSession('delTaskList')
    this.conditionList = conditionStr ? JSON.parse(conditionStr) : []
    this.taskList = taskStr ? JSON.parse(taskStr) : []
    this.delTaskList = delTaskStr ? JSON.parse(delTaskStr) : []
    this.params = paramsStr ? JSON.parse(paramsStr) : this.params
    this.$methods.setSession('conditionList', '')
    this.$methods.setSession('taskList', '')
    this.$methods.setSession('delTaskList', '')
    this.$methods.setSession('sceneParams', '')
  }
}
</script>
<style lang="scss" scoped>
.c-yellow {
  color: #F6AE1E;
}
.creat-scene {
  min-height: 100vh;
  background: $bgColor;
}
.nav-edit{
  color: #3F4663;
}
.scene-box{
  padding: .4rem .3rem;
  background: #ffffff;
}
.scene-name {
  padding: 0 0.3rem;
  width: 100%;
  height: 1rem;
  background: $bgColor;
  border-radius: 0.2rem;
  font-weight: bold;
  color: #505670;
}
.add-box{
  padding: .4rem .3rem;
  .item-box{
    background: #ffffff;
    border-radius: .2rem;
    overflow: hidden;
    margin-bottom: .4rem;
    .item-header {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      padding: .25rem .3rem;
      overflow: hidden;
      background-color: #fff;
      .left-info{
        flex: 1;
        .title{
          font-size: .36rem;
          font-weight: bold;
          color: #3F4663;
        }
        p,span{
          margin-top: .1rem;
          font-size: .22rem;
          font-weight: 400;
          color: #3F4663;
        }
      }
    }
    .item-list{
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      padding: .3rem .3rem;
      overflow: hidden;
      background-color: #fff;
      border-top: 1px solid #EEEEEE;
      .content{
        flex: 1;
        .title{
          font-weight: bold;
          color: #3F4663;
          max-width: 2rem;
          text-overflow:ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        .count-down-box{
          display: inline-block;
          height: .4rem;
          padding: 0 .15rem;
          background: #EAF6FE;
          border-radius: .18rem;
          color: #2DA3F6;
          font-size: .2rem;
          margin-top: .1rem;
          .van-icon{
            transform: translateY(.03rem);
          }
          .van-count-down{
            margin-left: .1rem;
            color: #2DA3F6;
            font-size: .2rem;
            display: inline-block;
          }
        }
      }
      .info{
        margin-right: .3rem;
        text-align: right;
        h3{
          font-size: .28rem;
          font-weight: bold;
          color: #3F4663;
          max-width: 2rem;
          text-overflow:ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        p{
          font-size: .22rem;
          font-weight: 400;
          color: #94A5BE;
          margin-top: .1rem;
        }
      }
      .time-item{
        font-size: .28rem;
        font-weight: bold;
        color: #94A5BE;
        margin-right: .2rem;
      }
      .image-item{
        width: .8rem;
        height: .8rem;
        border-radius: .08rem;
        position: relative;
        overflow: hidden;
        .mask{
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: .3rem;
          line-height: .3rem;
          text-align: center;
          color: #ffffff;
          font-size: .2rem;
          background: rgba(0,0,0,.5);
        }
      }
      .border{
        border: 1PX solid #EEEEEE;
      }
    }
    .item-list.no-border{
      border-top: none 0;
    }
    .delete-button{height: 100%;}
  }
  .add-item{
    height: 3rem;
    background: #ffffff;
    border-radius: .2rem;
    overflow: hidden;
    margin-bottom: .4rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    .add-icon{
      font-size: .48rem;
      color: #CED5DE;
      margin-bottom: .1rem;
    }
    .add-description{
      font-size: .3rem;
      font-weight: bold;
      color: #CED5DE;
    }
  }
  .add-item.active {
    cursor: pointer;
    .add-icon{
      color: #36A7F6;
    }
    .add-description{
      color: #36A7F6;
    }
  }
}
.condition-item{
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding: .3rem .4rem;
  overflow: hidden;
  background-color: #fff;
  border-top: 1px solid #EEEEEE;
}
.condition-item .image-item{
  margin-right: .3rem;
}
.dev-img {
  height: 0.8rem;
  width: 0.8rem;
}
.text-item{
  flex: 1;
}
.text-item .title{
  font-weight: bold;
  color: #575C75;
  margin-bottom: .1rem;
}
.text-item .title.active{
  color: #36A7F6;
}
.text-item p{
  font-size: .22rem;
  font-weight: 500;
  color: #94A5BE;
}
.action-condition .van-cell{
  padding: .3rem .4rem;
}
.condition-box {
  .disabled {
    opacity: 0.6;
  }
}
.save-btn-box {
  width: 100%;
  max-width: 750px;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.3rem .3rem;
  background: $bgColor;
}
.save-btn {
  height: 1rem;
  border: 0;
  border-radius: 0.2rem;
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
  .scene-name >>> .van-field__body{
    height: 100%;
  }
  .action-condition >>> .van-action-sheet__header{
    text-align: left;
    padding: 0 .4rem;
    color: #3F4663;
    font-size: .32rem;
  }
</style>
