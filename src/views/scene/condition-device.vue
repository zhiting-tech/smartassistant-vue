<template>
  <div class="wrap">
    <van-nav-bar
      :title="deviceInfo.name"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
      <template v-if="!isCondition" #right>
        <span class="reset-btn" @click="reset">{{ $t('global.reset') }}</span>
      </template>
    </van-nav-bar>
    <Loading v-if="loading"></Loading>
    <template v-else>
      <div
        v-for="(item, index) in opList"
        :key="index"
        class="cell"
        :class="{ 'delay': item.attribute === 'delay', 'color': item.attribute === 'hue' }"
        @click="handleOp(item, index)">
        <p class="op-name one-line">{{ item.name }}</p>
        <div class="cell-right">
          <span class="block-color" v-if="!isCondition && item.attribute === 'rgb'" :style="{'background': item.chose.name}"></span>
          <span v-if="!isCondition && item.attribute !== 'rgb'">{{ item.chose.name }}</span>
          <van-icon
            name="arrow"
            color="#cccccc"
            size="0.3rem"
            class="icon"/>
        </div>
      </div>
      <div v-if="!isCondition" class="op-btn-placeholder">
        <div class="op-btn-box">
          <van-button
            class="op-btn"
            :disabled="!canNext"
            @click="handleNext">{{ $t('condition.next') }}</van-button>
        </div>
      </div>
    </template>
    <!-- 开关选择 -->
    <SwitchPopup
      v-model="switchShow"
      :needSwitch="!isCondition"
      :initVal="currentSwitch"
      @on-change="handleSwitch"
      :title="$t('condition.switch')"/>
    <!-- 窗帘控制选择 -->
    <CurtainPopup
      v-model="curtainShow"
      :needSwitch="!isCondition"
      :initVal="currentCurtain"
      @on-change="handleCurtain"
      :title="$t('condition.curtainTitle')"/>
    <!-- 百分比选择 -->
    <PercentagePopup
      v-model="percentShow"
      :needCondition="isCondition"
      :initCondition="initCondition"
      :initVal="currentPercent"
      @on-confirm="handlePercent"
      :title="percentTitle"
      :tipWord="tipWord"
      :activeColor="activeColor"
      :inactiveColor="inactiveColor"
      :max="percentMax"
      :min="percentMin"
      :unit="unit"/>
    <!-- 延时选择 -->
    <TimePicker
      v-model="delayShow"
      :title="$t('condition.delay')"
      :current="currentTime"
      @on-sure="handleDelay"/>
    <!-- 感应器选择 -->
    <SensorPopup
      v-model="sensorShow"
      :targetList="sensorSelect"
      :initVal="currentStatus"
      @on-change="handleSensor"
      :title="$t('condition.state')"/>
    <!-- 彩色选择 -->
    <ColorPickerPopup
      v-model="colorPickerShow"
      :title="colorPickerTitle"
      :initVal="currentColorPicker"
      @on-confirm="handleColorPicker"/>
    <!-- 守护选择 -->
    <GuardPopup
      v-model="guardShow"
      :initVal="guardActive"
      @on-change="handleGuard"
      :title="$t('condition.guard')"/>
    <!-- 无线开关选择 -->
    <SwitchPressPopup
      v-model="switchPressShow"
      :initVal="currentSwitchPress"
      @on-change="handleSwitchPress"
      :title="$t('condition.switch')"/>
  </div>
</template>
<script>
import { getAttr } from '@/config/deviceAttr'
import TimePicker from '@/components/TimePicker.vue'
import SwitchPopup from './components/SwitchPopup.vue'
import CurtainPopup from './components/CurtainPopup.vue'
import PercentagePopup from './components/PercentagePopup.vue'
import SensorPopup from './components/SensorPopup.vue'
import ColorPickerPopup from './components/ColorPickerPopup.vue'
import GuardPopup from './components/GuardPopup.vue'
import SwitchPressPopup from './components/SwitchPressPopup.vue'

export default {
  name: 'conditionsDevice',
  components: {
    SwitchPopup,
    CurtainPopup,
    PercentagePopup,
    TimePicker,
    SensorPopup,
    ColorPickerPopup,
    GuardPopup,
    SwitchPressPopup
  },
  data() {
    return {
      loading: false,
      switchShow: false,
      curtainShow: false, // 窗帘控制显示
      percentShow: false, // 百分比控制显示
      delayShow: false,
      canNext: false,
      operation: 'condition', // 操作类型 condition 触发条件 execution 执行条件
      currentIndex: 0,
      currentSwitch: '', // 当前开关状态
      currentCurtain: '', // 当前窗帘状态
      initCondition: '', // 当前操作符
      currentPercent: 0, // 当前百分比值
      unit: '%', // 当前单位'%' '℃'
      percentTitle: '', // 百分比弹窗标题
      tipWord: '', // 提示文案
      activeColor: '', // 百分比激活颜色
      inactiveColor: '', // 百分比底部颜色
      percentMax: 0, // 百分比最大值
      percentMin: 0, // 百分比最大值
      currentAttr: {}, // 当前控制属性
      currentTime: 0, // 当前时间
      opList: [], // 用户操作列表
      deviceId: '', // 设备id
      conditionList: [],
      taskList: [],
      delTaskList: [], // 删除任务id
      deviceInfo: {},
      query: {}, // 参数，用来初始化
      sensorShow: false,
      currentStatus: '',
      currentSensorAttr: '',
      sensorSelect: [
        {
          value: 1,
          name: this.$t('condition.isDetected')
        }
      ],
      colorPickerShow: false, // 彩灯控制显示
      currentColorPicker: '#FFD67E', // 当前颜色
      colorPickerTitle: this.$t('condition.color'), // 彩灯标题
      guardShow: false, // 守护控制显示
      guardActive: -1,
      switchPressShow: false,
      currentSwitchPress: ''
    }
  },
  computed: {
    isCondition() {
      return this.operation === 'condition'
    },
    isModify() {
      return this.query.index !== undefined
    },
    info() {
      return {
        name: this.deviceInfo.name,
        location_name: this.deviceInfo.location.name,
        logo_url: this.deviceInfo.logo_url,
        status: this.deviceInfo.status
      }
    }
  },
  watch: {
    opList: {
      deep: true,
      handler(list) {
        let result = false
        list.forEach((item, index) => {
          if (item.type === 'hue' || item.type === 'saturation' || item.type === 'current_position' || item.type === 'style' || item.type === 'direction' || item.type === 'calibration' || item.type === 'state' || item.type === 'permit_join') {
            list.splice(index, 1)
          }
          if ((item.attribute !== 'delay' && item.chose.value) || (item.attribute !== 'delay' && item.chose.value === 0)) {
            result = true
          }
        })
        this.canNext = result
      }
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    // 获取设备详情
    getDeviceDetail() {
      this.loading = true
      this.http.getDeviceDetail(this.deviceId).then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        this.deviceInfo = res.data.device_info
        const list = []
        this.deviceInfo.attributes.forEach((item) => {
          item.name = getAttr(item.type)
          const obj = Object.assign({}, item)
          obj.chose = {}
          list.push(obj)
        })
        this.opList = list
        // 判断是否是执行条件
        if (this.operation === 'execution') {
          const obj = {
            type: 'delay',
            name: this.$t('condition.delay'),
            chose: {}
          }
          this.opList.push(obj)
        }
        // 初始修改值
        this.initData()
      }).catch(() => {
        this.loading = false
      })
    },
    // 初始值
    initData() {
      const map = {
        on: this.$t('condition.turnOn'),
        off: this.$t('condition.shutDown'),
        toggle: this.$t('condition.change')
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
      let mapStateName = ''
      const { index } = this.query
      if (this.isModify) {
        if (this.isCondition) {
          const conditionAttr = this.conditionList[index].condition_attr
          const { operator } = this.conditionList[index]
          this.opList.forEach((item) => {
            if (item.type === conditionAttr.type) {
              item.chose = {
                max: conditionAttr.max,
                min: conditionAttr.min,
                value: conditionAttr.val,
                name: `${this.$methods.getPercent(conditionAttr.max, conditionAttr.min, conditionAttr.val)}%`,
                op: operator
              }
            }
          })
        } else {
          const task = this.taskList[index] || {}
          const taskDevices = task.attributes || []
          this.opList.forEach((item) => {
            taskDevices.forEach((dev) => {
              if (item.type === dev.type) {
                switch (true) {
                  case item.type === 'on_off' && item.aid === dev.aid:
                    item.chose = {
                      value: dev.val,
                      name: map[dev.val]
                    }
                    break // 可选
                  case item.type === 'powers_1' || item.type === 'powers_2' || item.type === 'powers_3':
                    item.chose = {
                      value: dev.val,
                      name: map[dev.val]
                    }
                    break // 可选
                  case item.type === 'temperature':
                    item.chose = {
                      max: dev.max,
                      min: dev.min,
                      value: dev.val,
                      name: `${dev.val}℃`
                    }
                    break // 可选
                  case item.type === 'detected':
                    item.chose = {
                      value: dev.val,
                      name: detectedMap[dev.val]
                    }
                    break // 可选
                  case item.type === 'contact_sensor_state':
                    item.chose = {
                      value: dev.val,
                      name: windowDoorMap[dev.val]
                    }
                    break // 可选
                  case item.type === 'leak_detected':
                    item.chose = {
                      value: dev.val,
                      name: leakDetectedMap[dev.val]
                    }
                    break // 可选
                  case item.type === 'rgb':
                    item.chose = {
                      value: dev.val,
                      name: dev.val
                    }
                    break // 可选
                  case item.type === 'target_state':
                    item.chose = {
                      max: dev.max,
                      min: dev.min,
                      value: dev.val,
                      name: targetStateMap[dev.val]
                    }
                    break // 可选
                  case item.type === 'brightness':
                    item.chose = {
                      max: dev.max,
                      min: dev.min,
                      value: dev.val,
                      name: `${this.$methods.getPercent(dev.max, dev.min, dev.val)}%`
                    }
                    break // 可选
                  case item.type === 'color_temp':
                    item.chose = {
                      max: dev.max,
                      min: dev.min,
                      value: dev.val,
                      name: `${this.$methods.getPercent(dev.max, dev.min, dev.val)}%`
                    }
                    break // 可选
                  case item.type === 'humidity':
                    item.chose = {
                      max: dev.max,
                      min: dev.min,
                      value: dev.val,
                      name: `${this.$methods.getPercent(dev.max, dev.min, dev.val)}%`
                    }
                    break // 可选
                  case item.type === 'target_position':
                    if (dev.val === 0 || dev.val === 100) {
                      mapStateName = mapState[dev.val]
                    } else {
                      mapStateName = `${this.$methods.getPercent(dev.max, dev.min, dev.val)}%`
                    }
                    item.chose = {
                      max: dev.max,
                      min: dev.min,
                      value: dev.val,
                      name: mapStateName
                    }
                    break // 可选
                  case item.type === 'volume':
                    item.chose = {
                      max: dev.max,
                      min: dev.min,
                      value: dev.val,
                      name: `${this.$methods.getPercent(dev.max, dev.min, dev.val)}%`
                    }
                    break // 可选
                  case item.type === 'motion_detected':
                    item.chose = {
                      value: dev.val,
                      name: detectedMap[dev.val]
                    }
                    break // 可选
                  case item.type === 'delay':
                    item.chose = {
                      value: dev.val,
                      name: `${this.$methods.formatTime(dev.val)} ${this.$t('condition.rear')}`
                    }
                    break // 可选
                  default: // 你可以有任意数量的case语句
                  // 语句
                }
              }
            })
          })
          // 延时
          const currentIndex = this.opList.findIndex(item => item.attribute === 'delay')
          this.currentIndex = currentIndex
          if (task.delay_seconds) {
            this.handleDelay(task.delay_seconds)
          }
        }
      }
    },
    // 重置操作
    reset() {
      this.opList.forEach((item) => {
        item.chose = {}
      })
    },
    handleOp(item, index) {
      this.currentIndex = index
      switch (true) {
        case item.type === 'on_off':
          // 开关
          this.currentSwitch = `${item.chose.value}`
          this.switchShow = true
          break // 可选
        case item.type === 'powers_1' || item.type === 'powers_2' || item.type === 'powers_3':
          // 开关
          this.currentSwitch = `${item.chose.value}`
          this.switchShow = true
          break // 可选
        case item.type === 'brightness':
          // 亮度
          this.percentTitle = this.$t('condition.brightness')
          this.tipWord = ''
          this.activeColor = 'linear-gradient(to right, #FEBF32, #FFB06B)'
          this.inactiveColor = '#f1f4fc'
          this.currentAttr = {
            max: item.max,
            min: item.min,
            attribute: 'brightness',
          }
          this.percentMax = item.max
          this.percentMin = item.min
          this.currentPercent = item.chose.value ? item.chose.value : item.min
          this.initCondition = item.chose.op || '='
          this.unit = '%'
          this.percentShow = true
          break // 可选
        case item.type === 'color_temp':
          // 色温
          this.percentTitle = this.$t('condition.colorTemperature')
          this.tipWord = ''
          this.activeColor = 'transparent'
          this.inactiveColor = 'linear-gradient(90deg, #7ECFFC, #FFD26E 40%, #FFB06B)'
          this.currentAttr = {
            max: item.max,
            min: item.min,
            attribute: 'color_temp',
          }
          this.percentMax = item.max
          this.percentMin = item.min
          this.currentPercent = item.chose.value ? item.chose.value : item.min
          this.initCondition = item.chose.op || '='
          this.unit = '%'
          this.percentShow = true
          break // 可选
        case item.type === 'target_position':
          if (item.chose.op && item.chose.op !== '=') {
            this.currentCurtain = 'percent'
          } else {
            this.currentCurtain = item.chose.value
          }
          this.curtainShow = true
          this.percentTitle = this.$t('condition.curtainTitle')
          this.tipWord = ''
          this.activeColor = '#2DA3F6'
          this.inactiveColor = '#F1F4FC'
          this.currentAttr = {
            max: item.max,
            min: item.min,
            attribute: 'target_position',
          }
          this.percentMax = item.max
          this.percentMin = item.min
          this.currentPercent = item.chose.value ? item.chose.value : item.min
          this.unit = '%'
          this.initCondition = item.chose.op || '='
          break // 可选
        case item.type === 'temperature':
          // 温度
          this.percentTitle = this.$t('condition.temperature')
          this.tipWord = ''
          this.activeColor = 'linear-gradient(90deg, #FEBF32, #FFB06B)'
          this.inactiveColor = '#F1F4FC'
          this.currentAttr = {
            max: item.max,
            min: item.min,
            attribute: 'temperature',
          }
          this.percentMax = item.max
          this.percentMin = item.min
          this.currentPercent = item.chose.value ? item.chose.value : item.min
          this.unit = '℃'
          this.initCondition = item.chose.op || '='
          this.percentShow = true
          break // 可选
        case item.type === 'humidity':
          // 湿度
          this.percentTitle = this.$t('condition.humidity')
          this.tipWord = ''
          this.activeColor = '#2DA3F6'
          this.inactiveColor = '#F1F4FC'
          this.currentAttr = {
            max: item.max,
            min: item.min,
            attribute: 'humidity',
          }
          this.percentMax = item.max
          this.percentMin = item.min
          this.currentPercent = item.chose.value ? item.chose.value : item.min
          this.unit = '%'
          this.initCondition = item.chose.op || '='
          this.percentShow = true
          break // 可选
        case item.type === 'detected':
          // 人体感应
          this.sensorSelect = [
            {
              value: 1,
              name: this.$t('condition.isDetected')
            }
          ]
          this.currentStatus = `${item.chose.value}`
          this.currentSensorAttr = 'detected'
          this.sensorShow = true
          break // 可选
        case item.type === 'contact_sensor_state':
          // 门窗感应
          this.sensorSelect = [
            {
              value: 1,
              name: this.$t('condition.offToOn')
            },
            {
              value: 0,
              name: this.$t('condition.onToOff')
            }
          ]
          this.currentStatus = `${item.chose.value}`
          this.currentSensorAttr = 'contact_sensor_state'
          this.sensorShow = true
          break // 可选
        case item.type === 'leak_detected':
          // 水浸感应
          this.sensorSelect = [
            {
              value: 1,
              name: this.$t('condition.isLeakDetected')
            }
          ]
          this.currentStatus = `${item.chose.value}`
          this.currentSensorAttr = 'leak_detected'
          this.sensorShow = true
          break // 可选
        case item.type === 'rgb':
          // 彩色调整
          this.currentAttr = {
            max: item.max,
            min: item.min,
            attribute: 'rgb',
          }
          this.currentColorPicker = item.chose.value ? item.chose.value : item.val
          this.colorPickerShow = true
          break // 可选
        case item.type === 'target_state':
          // 彩色调整
          this.guardActive = item.chose.value
          this.guardShow = true
          break // 可选
        case item.type === 'switch_event':
          // 开关
          this.currentSwitchPress = item.chose.value
          this.switchPressShow = true
          break // 可选
        case item.type === 'volume':
          // 亮度
          this.percentTitle = this.$t('deviceAttr.volume')
          this.tipWord = ''
          this.activeColor = '#2DA3F6'
          this.inactiveColor = '#F1F4FC'
          this.currentAttr = {
            max: item.max,
            min: item.min,
            attribute: 'volume',
          }
          this.percentMax = item.max || 100
          this.percentMin = item.min || 0
          this.currentPercent = item.chose.value ? item.chose.value : 0
          this.initCondition = item.chose.op || '='
          this.unit = '%'
          this.percentShow = true
          break // 可选
        case item.type === 'motion_detected':
          // 人体感应
          this.sensorSelect = [
            {
              value: 1,
              name: this.$t('condition.isDetected')
            }
          ]
          this.currentStatus = `${item.chose.value}`
          this.currentSensorAttr = 'motion_detected'
          this.sensorShow = true
          break // 可选
        case item.type === 'delay':
          if (!this.isCondition) {
            this.currentTime = item.chose.value
          }
          this.delayShow = true
          break // 可选
        default: // 你可以有任意数量的case语句
        // 语句
      }
    },
    // 跳转至创建场景页面
    toCreatScene() {
      this.$router.replace({
        name: 'setScene',
        query: {
          sceneId: this.$route.query.sceneId
        }
      })
    },
    /**
    *  把source的字段，覆盖设置到target的字段，递归覆盖，不直接覆盖对象
    * @param target
    * @param source
    */
    extend(target, source) {
      Object.keys(source).forEach((key) => {
        const newValue = source[key]
        const oldValue = target[key] || 0
        // 如果 是数组，有值就追加，没值就覆盖
        if (Array.isArray(oldValue)) {
          target[key] = [...oldValue, ...newValue]
        } else if (typeof (oldValue) === 'object') {
          // 如果是object 递归设置
          target[key] = this.extend(oldValue, newValue)
        } else {
          // 判断，如果不是object，就直接设置
          // 普通字段
          target[key] = newValue
        }
      })
      return target
    },
    // 处理选择条件
    handleCondition(condition) {
      const { index } = this.query
      if (this.isModify) {
        // 初始修改数据
        this.conditionList[index] = this.extend(this.conditionList[index], condition)
      } else {
        condition.device_info = this.info
        this.conditionList.push(condition)
      }
      this.$methods.setSession('conditionList', JSON.stringify(this.conditionList))
      this.toCreatScene()
    },
    // 窗帘选择处理
    handleCurtain(item) {
      this.curtainShow = false
      if (item.value === 'percent') {
        this.percentShow = true
      } else if (this.isCondition) {
        // 保存传输数据
        const sceneConditions = {
          condition_type: 2,
          device_id: this.deviceId,
          operator: '=',
          condition_attr: {
            type: 'target_position',
            val: item.value,
            val_type: this.opList[this.currentIndex].val_type,
            aid: this.opList[this.currentIndex].aid,
            permission: this.opList[this.currentIndex].permission
          }
        }
        this.handleCondition(sceneConditions)
      } else {
        this.opList[this.currentIndex].chose = item
      }
    },
    // 开关处理
    handleSwitch(item) {
      this.switchShow = false
      if (this.isCondition) {
        // 保存传输数据
        const sceneConditions = {
          condition_type: 2,
          device_id: this.deviceId,
          operator: '=',
          condition_attr: {
            type: 'on_off',
            val: item.value,
            val_type: this.opList[this.currentIndex].val_type,
            aid: this.opList[this.currentIndex].aid,
            permission: this.opList[this.currentIndex].permission
          }
        }
        this.handleCondition(sceneConditions)
      } else {
        this.opList[this.currentIndex].chose = item
      }
    },
    // 百分比选择处理
    handlePercent(val, op) {
      this.percentShow = false
      if (this.isCondition) {
        // 保存传输数据
        const sceneConditions = {
          condition_type: 2,
          device_id: this.deviceId,
          operator: op,
          condition_attr: {
            type: this.currentAttr.attribute,
            max: this.opList[this.currentIndex].max,
            min: this.opList[this.currentIndex].min,
            val,
            val_type: this.opList[this.currentIndex].val_type,
            aid: this.opList[this.currentIndex].aid,
            permission: this.opList[this.currentIndex].permission
          }
        }
        this.handleCondition(sceneConditions)
      } else {
        const nameVal = this.unit === '%' ? this.$methods.getPercent(this.currentAttr.max, this.currentAttr.min, val) : val
        const chose = {
          max: this.currentAttr.max,
          min: this.currentAttr.min,
          value: val,
          name: nameVal + this.unit
        }
        this.opList[this.currentIndex].chose = chose
      }
    },
    // 处理延迟
    handleDelay(val) {
      const chose = {
        value: val,
        name: `${this.$methods.formatTime(val)} ${this.$t('condition.rear')}`
      }
      this.opList[this.currentIndex].chose = chose
      this.delayShow = false
    },
    // 下一步处理
    handleNext() {
      let delay = 0
      const task = []
      this.opList.forEach((item) => {
        if ((item.chose.value && item.type !== 'delay') || (item.chose.value === 0 && item.type !== 'delay')) {
          if (item.min === undefined || item.max === undefined) {
            const obj = { // type为smart_device时，必须设置
              device_id: this.deviceId,
              type: item.type,
              val: item.chose.value,
              aid: item.aid,
              permission: item.permission,
              val_type: item.val_type
            }
            task.push(obj)
          } else {
            const obj = { // type为smart_device时，必须设置
              device_id: this.deviceId,
              type: item.type,
              max: item.max,
              min: item.min,
              val: item.chose.value,
              aid: item.aid,
              permission: item.permission,
              val_type: item.val_type
            }
            task.push(obj)
          }
        }
        if (item.type === 'delay') {
          delay = item.chose.value || 0
          const obj = { type: 'delay', val: item.chose.value }
          task.push(obj)
        }
      })
      const sceneTasks = {
        type: 1, // 1:控制设备；2:手动执行;3:开启自动执行;4:关闭自动执行
        delay_seconds: delay, // 可不传，延迟秒数
        device_id: this.deviceId,
        attributes: task
      }
      if (delay === 0) {
        // 延迟秒速为0时 删除
        const index = task.findIndex(item => item.type === 'delay')
        task.splice(index, 1)
        delete sceneTasks.delay_seconds
      }
      sceneTasks.device_info = this.info
      if (this.isModify) {
        // 删除任务
        const { index } = this.query
        const { id } = this.taskList[index]
        if (id && !this.delTaskList.includes(id)) {
          this.delTaskList.push(id)
        }
        this.taskList[index] = sceneTasks
      } else {
        this.taskList.push(sceneTasks)
      }
      this.$methods.setSession('delTaskList', JSON.stringify(this.delTaskList))
      this.$methods.setSession('taskList', JSON.stringify(this.taskList))
      this.toCreatScene()
    },
    // 感应器处理
    handleSensor(item) {
      this.sensorShow = false
      if (this.isCondition) {
        // 保存传输数据
        const sceneConditions = {
          condition_type: 2,
          device_id: this.deviceId,
          operator: '=',
          condition_attr: {
            type: this.currentSensorAttr,
            val: item.value,
            val_type: this.opList[this.currentIndex].val_type,
            aid: this.opList[this.currentIndex].aid,
            permission: this.opList[this.currentIndex].permission
          }
        }
        this.handleCondition(sceneConditions)
      } else {
        this.opList[this.currentIndex].chose = item
      }
    },
    // 彩色灯处理
    handleColorPicker(hexString, op) {
      this.colorPickerShow = false
      if (this.isCondition) {
        // 保存传输数据
        const sceneConditions = {
          condition_type: 2,
          device_id: this.deviceId,
          operator: op,
          condition_attr: {
            type: 'rgb',
            val: hexString,
            val_type: this.opList[this.currentIndex].val_type,
            aid: this.opList[this.currentIndex].aid,
            permission: this.opList[this.currentIndex].permission
          }
        }
        this.handleCondition(sceneConditions)
      } else {
        const chose = {
          value: hexString,
          name: hexString
        }
        this.opList[this.currentIndex].chose = chose
      }
    },
    // 守护处理
    handleGuard(item) {
      this.guardShow = false
      if (this.isCondition) {
        // 保存传输数据
        const sceneConditions = {
          condition_type: 2,
          device_id: this.deviceId,
          operator: '=',
          condition_attr: {
            type: 'target_state',
            val: item.value,
            val_type: this.opList[this.currentIndex].val_type,
            aid: this.opList[this.currentIndex].aid,
            permission: this.opList[this.currentIndex].permission
          }
        }
        this.handleCondition(sceneConditions)
      } else {
        this.opList[this.currentIndex].chose = item
      }
    },
    // 无线开关处理
    handleSwitchPress(item) {
      this.switchPressShow = false
      if (this.isCondition) {
        // 保存传输数据
        const sceneConditions = {
          condition_type: 2,
          device_id: this.deviceId,
          operator: '=',
          condition_attr: {
            type: 'switch_event',
            val: item.value,
            val_type: this.opList[this.currentIndex].val_type,
            aid: this.opList[this.currentIndex].aid,
            permission: this.opList[this.currentIndex].permission
          }
        }
        this.handleCondition(sceneConditions)
      }
    }
  },
  created() {
    const conditionStr = this.$methods.getSession('conditionList')
    this.conditionList = conditionStr ? JSON.parse(conditionStr) : []
    const taskStr = this.$methods.getSession('taskList')
    this.taskList = taskStr ? JSON.parse(taskStr) : []
    const delTaskStr = this.$methods.getSession('delTaskList')
    this.delTaskList = delTaskStr ? JSON.parse(delTaskStr) : []
    const { query } = this.$route
    this.query = query
    this.operation = query.op || 'condition'
    // 初始化设备相关信息
    this.deviceId = query.id - 0
    this.getDeviceDetail()
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  min-height: 100vh;
  background: $bgColor;
}
.cell {
  display: flex;
  align-items: center;
  padding: 0.36rem 0.3rem;
  background: #fff;
  border-top: 1PX solid #eee;
}
.cell.color {
  padding: 0.3rem 0.3rem;
}
.delay {
  margin-top: 0.2rem;
  border-top: 0;
}
.op-name {
  flex: 1;
  font-size: 0.28rem;
  font-weight: bold;
  color: #3F4663;
}
.cell-right {
  display: flex;
  align-items: center;
  span {
    font-weight: bold;
    color: #94A5BE;
    margin-right: 0.3rem;
  }
  .icon {
    vertical-align: middle;
  }
}
.op-btn-placeholder {
  height: 1.6rem;
}
.op-btn-box {
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  padding: 0.3rem;
  background: $bgColor;
}
.op-btn {
  width: 6.9rem;
  height: 1rem;
  background: #2DA3F6;
  border-radius: 0.2rem;
  color: #fff;
}
.block-color {
  width: .7rem;
  height: .4rem;
  border-radius: .04rem;
  background: transparent;
}
</style>
