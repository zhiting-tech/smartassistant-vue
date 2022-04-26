<template>
  <div class="device" @scroll="scroll">
    <!--loading模块-->
    <Loading v-if="loading"></Loading>
    <template v-else>
    <div class="header clearfix">
      <p>
        <span class="one-line float-l">{{ area.name }}</span>
        <!-- 注释：暂时单个家庭无需切换 -->
        <!-- <van-icon class="mgl25" name="arrow" size="0.4rem"/> -->
      </p>
      <van-icon
        v-if="permissions.add_device"
        @click="discover"
        class="add-icon float-r"
        name="add-o"
        size="0.48rem"
        color="#3F4663"/>
    </div>
    <!-- 弱网提示 -->
    <WeakNetwork v-if="isWeak" @on-retry="initList()"/>
    <!-- 没有家庭 -->
    <div v-if="!area.id && !isWeak" class="empty-area">
      <div class="empty-box">
        <img src="../../assets/empty.png"/>
        <p>{{ $t('global.empty') }}</p>
      </div>
    </div>
    <!-- 区域导航 -->
    <van-tabs
      v-show="locationList.length"
      v-model="activeLocation"
      sticky
      :background="tabBgColor"
      line-width="0.4rem"
      line-height="0.06rem"
      color="#2DA3F6"
      title-inactive-color="#94A5BE"
      title-active-color="#3F4663"
      @scroll="handleScroll"
      @change="handleTabChange"
      class="position">
      <div class="set-box" v-if="false">
        <div v-if="layoutMenuValue === 'square'" class="set-item" @click="tabMenuType('list')">
          <img :src="squareMenu" />
        </div>
        <div v-else class="set-item" @click="tabMenuType('square')">
          <img :src="listMenu" />
        </div>
        <div class="set-item select-set" @click="showSelect = !showSelect">
          <img :src="setMenu" />
        </div>
        <div class="select-box" v-if="showSelect">
          <ul>
            <li v-for="(item,index) in setList" :key="index"><a href="javascript:;"><img :src="item.icon" alt=""><span>{{item.name}}</span></a></li>
          </ul>
        </div>
      </div>
      <van-tab
        v-for="location in locationList"
        :key="location.id"
        :name="location.id"
        :title="location.name">
        <!-- 请求loaing -->
        <div v-if="loading" class="loading-box">
          <van-loading
            vertical
            color="#2DA3F6"
            size="0.6rem"
            type="spinner">
            {{ $t('global.loading') }}...
          </van-loading>
        </div>
        <!--设备列表-->
        <template v-else-if="hasDevice">
          <!--layoutMenuValue === 'list'-->
          <div class="device-list list" v-if="false">
            <div
              v-for="device in deviceList"
              :key="device.id"
              class="device-item"
              @click="toDeviceDetail(device)">
              <CommonImage class="device-item--img" fit="contain" :src="device.logo_url"/>
              <div class="device-row one-line">
                <div class="clearfix " :class="{ 'outline': !device.isOnline }">
                  <span class="device-item--name one-line float-l">{{ device.name }}</span>
                  <span v-if="!device.isOnline" class="device-item--outline float-l">{{ $t('home.offline') }}</span>
                </div>
                <div v-if="device.switch_list&&device.switch_list.length>0" class="device-state">
                  <span v-for="(power,index) in device.switch_list" :key="index">{{power.val==='on' || power.val=== 1?'开':'关'}} <span class="line">|</span></span>
                </div>
                <div v-if="(device.type=== 'temperature_humidity_sensor' && device.temperature !=='') || (device.type=== 'temperature_humidity_sensor' && device.humidity !== '')" class="device-state">
                  <template v-if="device.isOnline">{{device.temperature}}℃ | {{device.humidity}}%</template>
                </div>
                <div v-if="device.type=== 'contact_sensor'" class="device-state">
                  <span v-if="device.isOnline" :class="{'primary': device.power}">{{device.power?'已打开':'已关闭'}}</span>
                </div>
                <div v-if="device.type=== 'motion_sensor'" class="device-state">
                  <span v-if="device.isOnline" class="danger">{{device.power?'有人移动':''}}</span>
                </div>
                <div v-if="device.type=== 'leak_sensor'" class="device-state">
                  <span v-if="device.isOnline" :class="{'danger': device.power}">{{device.power?'检测水浸':'检测无水'}}</span>
                </div>
              </div>
              <button
                v-if="(!device.is_sa && device.hasPermission)"
                class="device-btn"
                :class="[device.power ? 'device-btn--on' : 'device-btn--off']"
                @click.stop="operateDevice(device)"></button>
            </div>
            <div
              v-if="permissions.add_device"
              class="device-item"
              @click="discover">
              <div class="add-btn">
                <van-icon
                  name="plus"
                  size="0.4rem"
                  color="#94a5be"/>
              </div>
            </div>
          </div>
          <div class="device-list square">
            <div
              v-for="device in deviceList"
              :key="device.id"
              class="device-item"
              @click="toDeviceDetail(device)">
              <div class="clearfix" :class="{ 'outline': !device.isOnline }">
              <span class="device-item--name one-line float-l">
                {{ device.name }}
              </span>
                <span v-if="!device.isOnline" class="device-item--outline float-l">{{ $t('home.offline') }}</span>
              </div>
              <div class="device-row">
                <CommonImage
                  class="device-item--img"
                  fit="contain"
                  :src="device.logo_url"/>
                <button
                  v-if="(!device.is_sa && device.hasPermission)"
                  class="device-btn"
                  :class="[device.power ? 'device-btn--on' : 'device-btn--off']"
                  @click.stop="operateDevice(device)"></button>
                <div v-if="device.switch_list&&device.switch_list.length>0" class="device-state">
                  <span v-for="(power,index) in device.switch_list" :key="index">{{power.val==='on' || power.val=== 1?'开':'关'}} <span class="line">|</span></span>
                </div>
                <div v-if="(device.type=== 'temperature_humidity_sensor' && device.temperature !=='') || (device.type=== 'temperature_humidity_sensor' && device.humidity !== '')" class="device-state">
                  <template v-if="device.isOnline">{{device.temperature}}℃ | {{device.humidity}}%</template>
                </div>
                <div v-if="device.type=== 'contact_sensor'" class="device-state">
                  <span v-if="device.isOnline" :class="{'primary': device.power}">{{device.power?'已打开':'已关闭'}}</span>
                </div>
                <div v-if="device.type=== 'motion_sensor'" class="device-state">
                  <span v-if="device.isOnline" class="danger">{{device.power?'有人移动':''}}</span>
                </div>
                <div v-if="device.type=== 'leak_sensor'" class="device-state">
                  <span v-if="device.isOnline" :class="{'danger': device.power}">{{device.power?'检测水浸':'检测无水'}}</span>
                </div>
              </div>
            </div>
            <div
              v-if="permissions.add_device"
              class="device-item"
              @click="discover">
              <div class="add-btn">
                <van-icon
                  name="plus"
                  size="0.4rem"
                  color="#ffffff"/>
              </div>
            </div>
          </div>
        </template>
        <!--没有设备提示-->
        <div v-else class="device-empty">
          <div class="empty-box">
            <img src="../../assets/device-not-found.png"/>
            <p>{{ $t('home.empty') }}</p>
            <button v-if="permissions.add_device" @click="discover">{{ $t('home.btn') }}</button>
          </div>
        </div>
      </van-tab>
    </van-tabs>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

const squareMenu = require('../../assets/icon-square-menu.png')
const listMenu = require('../../assets/icon-list-menu.png')
const setMenu = require('../../assets/icon-set.png')
const homeIcon = require('../../assets/icon-home.png.png')
const closeEyeIcon = require('../../assets/icon-close-eye.png')
const openEyeIcon = require('../../assets/icon-open-eye.png')
const equalizerIcon = require('../../assets/icon-equalizer.png')
const layersIcon = require('../../assets/icon-layers.png')

export default {
  name: 'device',
  data() {
    return {
      squareMenu,
      listMenu,
      setMenu,
      layoutMenuValue: 'square',
      activeLocation: -1, // 当前选中房间
      activeArea: '', // 当前选中家庭
      tabBgColor: 'transparent',
      areaList: [],
      locationList: [],
      allDeviceList: [],
      deviceList: [],
      loading: false,
      isWeak: false,
      position: 0,
      switchList: [],
      showSelect: false,
      setList: [
        { name: '房间管理', icon: homeIcon },
        { name: '设备排序', icon: layersIcon },
        { name: '隐藏离线设备', icon: closeEyeIcon },
        { name: '显示所有设备', icon: openEyeIcon },
        { name: '常用设备设置', icon: equalizerIcon }
      ]
    }
  },
  computed: {
    ...mapGetters(['websocket', 'userInfo', 'area', 'permissions']),
    hasDevice() {
      return this.deviceList.length
    }
  },
  watch: {
  },
  methods: {
    // 处理吸顶
    handleScroll({ isFixed }) {
      if (isFixed) {
        this.tabBgColor = '#fff'
      } else {
        this.tabBgColor = 'transparent'
      }
    },
    // 初始化房间列表
    initLocationList() {
      if (!this.area.id) {
        return
      }
      this.loading = true
      if (this.userInfo.area_type === 1) {
        this.http.getLocations().then((res) => {
          this.loading = false
          if (res.status !== 0) {
            return
          }
          const all = {
            id: -1,
            name: this.$t('global.all')
          }
          const { locations } = res.data
          this.locationList = locations || []
          this.locationList.unshift(all)
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.http.departmentsList().then((res) => {
          this.loading = false
          if (res.status !== 0) {
            return
          }
          const all = {
            id: -1,
            name: this.$t('global.all')
          }
          const { departments } = res.data
          this.locationList = departments || []
          this.locationList.unshift(all)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 初始设备列表
    initList() {
      this.loading = true
      this.isWeak = false
      this.http.getDeviceList().then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        const devices = res.data.devices || []
        devices.forEach((item) => {
          item.isOnline = true
          item.power = false
          item.hasPermission = false
          item.temperature = ''
          item.humidity = ''
        })
        this.allDeviceList = devices
        this.initLocationDevice(this.activeLocation)
      }).catch(() => {
        this.loading = false
        this.isWeak = true
      })
    },
    // 获取当前房间设备
    initLocationDevice(locaionId) {
      // areaId '-1' 全部
      const list = []
      this.allDeviceList.forEach((device) => {
        if (locaionId === -1) {
          list.push(device)
        } else if (device.location_id === locaionId) {
          list.push(device)
        }
      })
      // 获取设备初始状态
      list.forEach((item) => {
        const device = item
        device.power = false
        // 发送初始化指令
        this.getDeviceState(device)
      })
      this.deviceList = list
    },
    // 处理tab点击
    handleTabChange(locationId) {
      const params = {
        locationId
      }
      this.changeQuery(params)
      this.initLocationDevice(locationId)
    },
    // 获取设备初始值
    getDeviceState(device) {
      if (device.is_sa) {
        // sa设备不需要获取初始设备
        return
      }
      // 获取初始值
      device.stateId = this.$methods.getId() - 0
      this.websocket.send({
        id: device.stateId,
        domain: device.plugin_id,
        service: 'get_instances',
        data: {
          iid: device.iid
        }
      })
    },
    // 发送操作指令
    sendCommand(device, val) {
      this.websocket.send({
        id: 1,
        domain: device.plugin_id,
        service: 'set_attributes',
        data: {
          attributes: [
            {
              iid: device.iid,
              aid: device.aid,
              val
            }
          ]
        }
      })
    },
    // 操作设备
    operateDevice(device) {
      if (!device.isOnline) {
        this.$toast(this.$t('global.opFail'))
        return
      }
      if (!device.power) {
        this.sendCommand(device, 'on')
      } else {
        this.sendCommand(device, 'off')
      }
    },
    discover() {
      this.$router.push({
        name: 'deviceDiscover',
        query: {
          areaId: this.area.id
        }
      })
    },
    toDeviceDetail(device) {
      const params = {
        position: this.position
      }
      this.changeQuery(params)
      setTimeout(() => {
        if (device.is_sa) {
          this.$methods.setSession('sa', JSON.stringify(device))
        }
        this.$router.push({
          name: 'deviceDetail',
          query: {
            pluginId: device.plugin_id,
            deviceId: device.id,
            isSa: device.is_sa,
            pluginUrl: device.plugin_url
          }
        })
      }, 500)
    },
    handleMessage(data) {
      const msgJson = JSON.parse(data)
      if (!msgJson.event_type) {
        this.deviceList.forEach((device) => {
          // 初始化设备信息
          if (msgJson.id && msgJson.id === device.stateId) {
            if (!msgJson.success) {
              device.isOnline = false
            } else {
              const { instances } = msgJson.data
              const types = ['light_bulb', 'bulb', 'outlet', 'wall_plug', 'switch', 'gateway', 'security_system', 'leak_sensor', 'contact_sensor', 'motion_sensor', 'temperature_sensor', 'humidity_sensor']
              const temperatureType = ['temperature_sensor']
              const humidityType = ['humidity_sensor']
              const instanceType = instances.find(instance => instance.iid === device.iid)
              const operation = instanceType.services.find(service => types.includes(service.type)) || {}
              const temOperation = instanceType.services.find(service => temperatureType.includes(service.type)) || {}
              const humOperation = instanceType.services.find(service => humidityType.includes(service.type)) || {}
              const { attributes } = operation || []
              device.isOnline = true
              if (operation.type === 'temperature_sensor' || operation.type === 'humidity_sensor') {
                device.type = 'temperature_humidity_sensor'
              } else {
                device.type = operation.type
              }
              if (operation.type === 'light_bulb' || operation.type === 'outlet' || operation.type === 'bulb' || operation.type === 'wall_plug') {
                attributes.forEach((attr) => {
                  if (attr.type === 'on_off') {
                    device.aid = attr.aid
                    if (attr.val === 'on' || attr.val === 1) {
                      device.power = true
                    } else {
                      device.power = false
                    }
                    // 权限控制
                    device.hasPermission = this.$methods.formatPermission(attr.permission)
                  }
                })
              }
              if (operation.type === 'switch') {
                const switchOperation = instanceType.services.filter(service => service.type === 'switch') || []
                if (switchOperation.length > 1) {
                  device.switch_list = []
                  switchOperation.forEach((item) => {
                    item.attributes.forEach((attr) => {
                      if (attr.type === 'on_off') {
                        if (attr.val === 'on' || attr.val === 1) {
                          attr.power = true
                        } else {
                          attr.power = false
                        }
                        // 权限控制
                        attr.hasPermission = this.$methods.formatPermission(attr.permission)
                        device.switch_list.push(attr)
                      }
                    })
                  })
                } else {
                  attributes.forEach((attr) => {
                    if (attr.type === 'on_off') {
                      device.aid = attr.aid
                      if (attr.val === 'on' || attr.val === 1) {
                        device.power = true
                      } else {
                        device.power = false
                      }
                      // 权限控制
                      device.hasPermission = this.$methods.formatPermission(attr.permission)
                    }
                  })
                }
              }
              if (operation.type === 'contact_sensor') {
                attributes.forEach((attr) => {
                  if (attr.type === 'contact_sensor_state') {
                    device.aid = attr.aid
                    device.power = !!attr.val
                  }
                })
              }
              if (operation.type === 'motion_sensor') {
                attributes.forEach((attr) => {
                  if (attr.type === 'motion_detected') {
                    device.aid = attr.aid
                    device.power = attr.val
                  }
                })
              }
              if (operation.type === 'leak_sensor') {
                attributes.forEach((attr) => {
                  if (attr.type === 'leak_detected') {
                    device.aid = attr.aid
                    device.power = !!attr.val
                  }
                })
              }
              if (device.type === 'temperature_humidity_sensor') {
                if (temOperation.attributes) {
                  temOperation.attributes.forEach((attr) => {
                    if (attr.type === 'temperature') {
                      device.temperature = attr.val
                      device.temperature_aid = attr.aid
                    }
                  })
                }
                if (humOperation.attributes) {
                  humOperation.attributes.forEach((attr) => {
                    if (attr.type === 'humidity') {
                      device.humidity_aid = attr.aid
                      device.humidity_max = attr.max
                      device.humidity_min = attr.min
                      device.humidity = this.getPercent(attr.max, attr.min, attr.val)
                    }
                  })
                }
              }
            }
          }
        })
      }
      // 设备状态变化
      if (msgJson.event_type && msgJson.event_type === 'attribute_change') {
        const { data: changeData } = msgJson
        // 更新设备状态
        this.deviceList.forEach((device) => {
          const { attr } = changeData
          if (attr.iid === device.iid) {
            if (device.type === 'temperature_humidity_sensor') {
              if (attr.aid === device.humidity_aid) {
                device.humidity = this.getPercent(device.humidity_max, device.humidity_min, attr.val)
              }
              if (attr.aid === device.temperature_aid) {
                device.temperature = attr.val
              }
            }
            if (device.type === 'light_bulb' || device.type === 'outlet' || device.type === 'bulb' || device.type === 'wall_plug') {
              if (attr.aid === device.aid) {
                if (attr.val === 'on' || attr.val === 1) {
                  device.power = true
                } else {
                  device.power = false
                }
              }
            }
            if (device.type === 'switch') {
              if (device.switch_list) {
                device.switch_list.forEach((item) => {
                  if (item.aid === attr.aid) {
                    if (attr.val === 'on' || attr.val === 1) {
                      item.val = 'on'
                    } else {
                      item.val = 'off'
                    }
                  }
                })
              } else if (attr.aid === device.aid) {
                if (attr.val === 'on' || attr.val === 1) {
                  device.power = true
                } else {
                  device.power = false
                }
              }
            }
            if (device.type === 'contact_sensor') {
              if (attr.aid === device.aid) {
                device.power = !!attr.val
              }
            }
            if (device.type === 'motion_sensor') {
              if (attr.aid === device.aid) {
                device.power = attr.val
              }
            }
            if (device.type === 'leak_sensor') {
              if (attr.aid === device.aid) {
                device.power = !!attr.val
              }
            }
          }
        })
      }
    },
    // 切换家庭
    areaChange(area) {
      this.activeArea = area.id
      if (this.area.id === area.id) {
        return
      }
      this.area = area
      // 初始化当前家庭设备
      this.initList()
      // 获取对应的房间列表
      this.initLocationList()
      this.changeQuery(area)
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
    scroll(event) {
      this.position = event.target.scrollTop
    },
    // 获取百分比
    getPercent(max, min, value) {
      let res = Math.round(Number(((value - min) / (max - min)) * 100))
      if (res < 0) {
        res = 0
      }
      return res
    },
    // 切换列表模式还是方块模式
    tabMenuType(type) {
      this.$methods.setStore('layoutMenuValue', type)
      this.layoutMenuValue = type
    },
    isShowSelect(e) {
      if (document.querySelector('.select-set')) {
        if (!document.querySelector('.select-set').contains(e.target)) {
          if (this.showSelect) {
            this.showSelect = false
          }
        }
      }
    }
  },
  created() {
    const { query } = this.$route
    if (query.locationId) {
      this.activeLocation = Number(query.locationId)
    }
    if (this.$methods.getStore('layoutMenuValue')) {
      if (this.$methods.getStore('layoutMenuValue') === 'list') {
        this.layoutMenuValue = 'list'
      } else if (this.$methods.getStore('layoutMenuValue') === 'square') {
        this.layoutMenuValue = 'square'
      }
    }
    // 初始化当前家庭设备
    this.initList()
    // 获取对应的房间列表
    this.initLocationList()
    // this.websocket.onmessage((data) => {
    // })
  },
  mounted() {
    this.websocket.onmessage(this.handleMessage)
    this.$nextTick(() => {
      // 实现滚动效果
      setTimeout(() => {
        const { query, path } = this.$route
        if (query.position || Number(query.position) >= 60) {
          document.querySelector('.device').scrollTop = Number(query.position)
          // 对象的拷贝
          const newQuery = JSON.parse(JSON.stringify(query))
          delete newQuery.position
          // 地址栏的参数值赋值
          this.$router.replace({ path, query: newQuery })
        }
      }, 500)
      document.addEventListener('click', (e) => {
        this.isShowSelect(e)
      })
    })
  },
  destroyed() {
    document.addEventListener('click', e => this.isShowSelect(e))
  }
}
</script>
<style lang="scss" scoped>
.mgl25 {
  margin-left: 0.25rem;
  vertical-align: middle;
}
.danger{
  color: #FF7F7F;
}
.primary{
  color: #2da3f6;
}
.device {
  height: calc(100vh - 1rem);
  background: $bgColor;
  background-image: url(../../assets/home-bg.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.device::-webkit-scrollbar{
  display: none;
}
.header {
  position: relative;
  padding: 0 0.3rem;
  height: 1.38rem;
  line-height: 1.38rem;
  background: transparent;
  p {
    font-size: 0.48rem;
    font-weight: bold;
    color: #3F4663;
  }
  span {
    max-width: 5.5rem;
    font-weight: bold;
  }
  .add-icon {
    position: absolute;
    top: 50%;
    right: 0.3rem;
    transform: translateY(-50%);
  }
}
.device-list {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 0.4rem;
}
.device-item {
  position: relative;
  padding: 0.33rem;
  width: 3.3rem;
  height: 2.4rem;
  background: #fff;
  border-radius: 0.2rem;
  margin-top: 0.3rem;
  margin-left: 0.3rem;
}
.device-row {
  position: relative;
  height: 1rem;
}
.device-item--img {
  position: absolute;
  left: 0;
  bottom: 0;
  min-width: 0.5rem;
  max-width: 1rem;
  height: 1rem;
}
.outline {
  opacity: 0.5;
  .device-item--name {
    max-width: 1.9rem;
  }
}
.device-item--name {
  max-width: 100%;
  line-height: 1.1;
  font-size: 0.28rem;
  color: #3F4663;
  margin-bottom: 0.38rem;
}
.device-item--outline {
  width: 0.58rem;
  height: 0.32rem;
  border: 0.01rem solid #94A5BE;
  border-radius: 0.04rem;
  margin-left: 0.16rem;
  font-size: 0.2rem;
  color: #94A5BE;
  text-align: center;
  line-height: 0.32rem;
}
.device-btn,.device-state {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 0.6rem;
  height: 0.6rem;
  background-color: transparent;
  background-size: 100% 100%;
  border: 0;
}
.device-state{
  color: #94A5BE;
  font-size: .2rem;
  width: auto;
  height: auto;
}
.device-state .line{
  margin: 0 .05rem;
}
.device-state span:last-of-type .line{
  display: none;
}
.device-btn--on {
  background-image: url(../../assets/device-btn-on.png);
}
.device-btn--off {
  background-image: url(../../assets/device-btn-off.png);
}
.add-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -0.5rem;
  margin-top: -0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1rem;
  height: 1rem;
  background: #DDE5EB;
  border-radius: 50%;
}

.device-list.list{
  padding: 0 .3rem .4rem .3rem;
}
.device-list.list .device-item{
  width: 100%;
  height: auto;
  margin-left: 0;
  display: flex;
  align-items: center;
}
.device-list.list .device-item--img{
  position: relative;
  margin-right: .2rem;
  width: 1rem;
  height: 1rem;
}
.device-list.list .device-item--name{
  margin-bottom: 0;
}
.device-list.list .device-row{
  flex: 1;
  height: auto;
}
.device-list.list .device-state{
  position: relative;
  margin-top: .25rem;
}
.device-list.list .device-btn {
  position: relative;
}
.device-list.list .add-btn{
  position: relative;
  background: transparent;
}

.set-box{
  padding-left: .3rem;
  height: .88rem;
  position: absolute;
  right: .2rem;
  top: 0;
  display: flex;
  align-items: center;
  .set-item {
    padding: .1rem .15rem;
    cursor: pointer;
  }
  img{
    width: .32rem;
    height: .32rem;
  }
}

.device-empty,
.empty-area {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 6.9rem;
  height: calc(100vh - 4rem);
  background: rgba(255, 255, 255, 0.8);
  border-radius: 0.2rem;
  margin: 0.22rem auto;
}
.loading-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 2rem);
}
.empty-area {
  .empty-box {
    img {
      width: 2rem;
    }
  }
}
.empty-box {
  text-align: center;
  img {
    width: 0.79rem;
  }
  p {
    padding: 0.22rem 0 0.73rem;
    font-size: 0.28rem;
    color: #94A5BE;
  }
  button {
    width: 3rem;
    height: 1rem;
    background: #2DA3F6;
    border-radius: 0.08rem;
    border: 0;
    font-size: 0.28rem;
    color: #fff;
  }
}
.wrap {
  height: 50vh;
}
.home-icon {
  font-size: 0.36rem;
  margin-right: 0.25rem;
  vertical-align: sub;
}
.title {
  font-size: 0.28rem;
  color: #94A5BE;
}
.active {
  color: #2DA3F6;
}
.name {
  max-width: 6rem;
}
.select-box{
  width: 3.5rem;
  position: absolute;
  top: 46px;
  right: .3rem;
  background: #3F4663;
  box-shadow: 0px 0px .2rem 0px rgba(0, 0, 0, 0.1);
  border-radius: .2rem;
  z-index: 999;
  overflow: hidden;
}
.select-box li a{
  display: flex;
  align-items: center;
  font-weight: 700;
  color: #FFFFFF;
  padding: .3rem .3rem;
  border-bottom: 1px solid rgba(148, 165, 190, .2);
}
.select-box li:last-of-type a{
  border-bottom: 0 none;
}
.select-box li a img{
  margin-right: .3rem;
  height: auto;
  width: .35rem;
}
</style>
<style scoped>
.device >>> .van-tab__text {
  font-size: 0.32rem;
  font-weight: bold;
}
/*.device >>> .van-tabs__wrap {*/
/*  padding-right: 1.5rem;*/
/*  background: #FFFFFF;*/
/*}*/
.device >>> .van-tab {
  padding: 0 0.32rem;
  flex: 0 0 auto;
}
.device >>> .van-tab__text--ellipsis {
  overflow: initial;
}
.device >>> .van-tabs__nav--line {
  padding-bottom: 0.16rem;
}
.wrap >>> .van-cell {
  padding: 0.43rem 0.3rem;
}
</style>
