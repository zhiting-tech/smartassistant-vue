<template>
  <div class="resourse-detail">
    <van-nav-bar
      :title="$t('resourceMonitoring.title')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="$router.back()"
    >
      <template #left>
        <van-icon name="arrow-left" color="#3F4663" />
      </template>
    </van-nav-bar>
    <Loading v-if="loading"></Loading>
    <div v-else>
      <div class="resourse">
        <div class="utilization">
          <div class="util-left"><img :src="cpu" alt="" /></div>
          <div class="util-right">
            <div class="rate">
              <span>{{ $t('resourceMonitoring.CPUutilization') }}</span>
              <span style=" color:#2DA3F6 ">{{resourses.percpu_usage.toFixed(2) + '%'}}</span>
            </div>
            <div class="progress">
              <van-progress
                color="linear-gradient(to right,#75B8FD , #2DA3F6)"
                stroke-width="0.15rem"
                :percentage="resourses.percpu_usage.toFixed(2)"
                style="width: 100%"
                :show-pivot="false"
              />
            </div>
          </div>
        </div>
        <div class="utilization">
          <div class="util-left"><img :src="ram" alt="" /></div>
          <div class="util-right">
            <div class="rate">
              <span>{{ $t('resourceMonitoring.RAMutilization') }}</span>
              <span style="color:#37C48A">{{`${resourses.mem_usage}/${resourses.mem_total}`}}</span>
            </div>
            <div class="progress">
              <van-progress
                color="linear-gradient(to right, #46F1AB ,#37C48A)"
                stroke-width="0.15rem"
                :percentage="(parseInt(resourses.mem_usage)/(parseInt(resourses.mem_total)*1024))*100"
                style="width: 100%"
                :show-pivot="false"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="service" v-for="(item,index) in services" :key="index">
        <div class="service-head">
          <div>
            <img :src="item.icon" alt="" /><span>{{ item.name }}</span>
          </div>
          <div class="head-right" v-if='index===0'>
            <p>CPU:{{ item.basis_percpu_usage }}%</p>
            <p>RAM:{{ item.basis_mem_usage }}</p>
          </div>
          <div class="head-right" v-if='index===1'>
            <p>CPU:{{ item.plugin_percpu_usage }}%</p>
            <p>RAM:{{ item.plugin_mem_usage }}</p>
          </div>
          <div class="head-right" v-if='index===2'>
            <p>CPU:{{ item.extension_percpu_usage }}%</p>
            <p>RAM:{{ item.extension_mem_usage }}</p>
          </div>
        </div>
        <div class="service-center" v-for="(it,idx) in item.service" :key="idx">
          <div class="center-head">
            <div class="center-head-left">
              <i
                class="circle"
                :style="{ backgroundColor: it.isStartUp ? '#37C58B' : '#FF5161' }"
              ></i>
              <span class="service-name" :title="it.service_name">{{ it.service_name }}</span>
            </div>
            <div class="center-head-right" v-if="!['zt-nginx','smartassistant'].includes(it.name)" @click="reStart(it)">
              <img src="../../assets/chongzhi.png" v-show="!it.reStarting" alt="" />
              <img src="../../assets/chongzhi.png" class="rotate" v-show="it.reStarting" alt="" />
              <span>{{
                it.reStarting
                  ? $t("resourceMonitoring.isReStart")
                  : $t("resourceMonitoring.reStart")
              }}</span>
            </div>
          </div>
          <p class="small">
            <span v-if="!it.reStarting && !it.reStartFail">{{ it.run_time }}</span>
            <span v-if="it.reStarting" style="color: #ff5161">{{
              $t("resourceMonitoring.isReStart")
            }}</span>
            <span v-if='it.reStartFail' style="color: #ff5161">{{ $t("resourceMonitoring.reStartFail") }}</span>
          </p>
          <div class="center-center">
            <div class="center-rate">
              <div class="rate-head">
                <span>CPU</span>
                <span>{{ it.percpu_usage }}%</span>
              </div>
              <div class="rate-center">
                <van-progress
                  color="linear-gradient(to right,#75B8FD , #2DA3F6)"
                  stroke-width="0.15rem"
                  :percentage="it.percpu_usage"
                  style="width: 100%"
                  :show-pivot="false"
                />
              </div>
            </div>
            <div class="center-rate">
              <div class="rate-head">
                <span>RAM</span>
                <span>{{ it.mem_usage }}</span>
              </div>
              <div class="rate-center">
                <van-progress
                  color="linear-gradient(to right, #46F1AB ,#37C48A)"
                  stroke-width="0.15rem"
                  :percentage="(parseInt(it.mem_usage)/(parseInt(resourses.mem_total)*1024))*100"
                  style="width: 100%"
                  :show-pivot="false"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 引入icon和图片

const cpu = require('../../assets/CPU.png')
const ram = require('../../assets/ram.png')
const baseIcon = require('../../assets/data_configuration.png')
const pluginIcon = require('../../assets/parallel_tasks.png')
const extensionIcon = require('../../assets/timeline.png')

export default {
  name: 'deviceResourse',
  data() {
    return {
      cpu,
      ram,
      resourses: [],
      services: [],
      loading: false,
      timer: null,
    }
  },
  methods: {
    reStart(item) {
      item.reStarting = true
      item.reStartFail = null
      console.log(item)
      this.http.reStartResources(item.id, { name: item.name }).then((res) => {
        item.reStarting = false
        if (res.status !== 0) {
          item.reStartFail = true
          return
        }
        this.$toast.success('重启成功')
        this.getResourse(false)
      })
    },
    getResourse(bool) {
      if (bool) {
        this.loading = true
      }
      this.http.getResources().then((res) => {
        this.loading = false
        this.resourses = res.data
        this.setServices(res.data)
      })
    },
    setServices(data) {
      this.services = []
      for (let i = 1; i <= 3; i += 1) {
        const obj = {}
        obj.service = data.service.filter(it => it.type === i)
        obj.service.sort((a, b) => (a.name > b.name ? 1 : -1))
        obj.service.forEach((it) => {
          this.$set(it, 'reStarting', false)
          this.$set(it, 'reStartFail', null)
        })
        switch (i) {
          case 1:
            obj.basis_mem_usage = data.basis_mem_usage
            obj.basis_percpu_usage = data.basis_percpu_usage
            obj.name = this.$t('resourceMonitoring.basiServices')
            obj.icon = baseIcon
            break
          case 2:
            obj.plugin_percpu_usage = data.plugin_percpu_usage
            obj.plugin_mem_usage = data.plugin_mem_usage
            obj.name = this.$t('resourceMonitoring.pluginServices')
            obj.icon = pluginIcon
            break
          case 3:
            obj.extension_percpu_usage = data.extension_percpu_usage
            obj.extension_mem_usage = data.extension_mem_usage
            obj.name = this.$t('resourceMonitoring.extensionServices')
            obj.icon = extensionIcon
            break
          default:
            break
        }
        this.services.push(obj)
      }
    },

  },
  created() {
    this.getResourse(true)
  },
  mounted() {
    this.timer = setInterval(() => {
      this.getResourse(false)
    }, 30000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  }
}
</script>

<style lang="scss" scoped>
.resourse-detail {
  width: 100%;
  background-color: rgb(245, 245, 245);
  overflow: hidden;
}
.resourse {
  padding: 0.3rem 0 0;
  background: #fff;
  margin: 0 0 0.2rem;
}
.utilization {
  display: flex;
  padding: 0 0 0.3rem 0;
}
.util-left {
  padding: 0 0 0 0.3rem;
  img {
    width: 1rem;
  }
}
.util-right {
  flex: 1;
  padding: 0 0.2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .rate {
    display: flex;
    justify-content: space-between;
    margin: 0 0 0.1rem 0;
    padding-bottom: 0.1rem;
  }
  .progress {
    padding-bottom: 0.1rem;
  }
}
.service {
  background: #fff;
  padding: 0.3rem;
  margin-bottom: 0.2rem;
}
.service-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.1rem;
  img {
    width: 0.35rem;
    vertical-align: middle;
    margin-right: 0.15rem;
  }
  .head-right {
    font-size: 0.15rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
}
.service-center {
  background-color: #f6f8fd;
  border-radius: 0.15rem;
  margin-bottom: 0.2rem;
}
.center-head {
  padding: 0.2rem 0.2rem 0.1rem;
  height: .6rem;
  display: flex;
  justify-content: space-between;
  .service-name {
    display: inline-block;
    width: 2rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
    font-size: 0.18rem;
  }
}
.circle {
  display: inline-block;
  width: 0.14rem;
  height: 0.14rem;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 0.13rem;
}
.center-head-left {
  font-size: 0.15rem;
}
.center-head-right {
  padding-right: 0.1rem;
  img {
    width: 0.22rem;
    vertical-align: middle;
    margin-right: 0.1rem;
  }
  span {
    color: #2da3f6;
    font-size: 0.2rem;
  }
}
.small {
  position: relative;
  span {
    font-size: 0.18rem;
    transform: scale(0.75, 0.75);
    position: absolute;
    top: -0.14rem;
    left: 0.38rem;
    color: #94a5be;
  }
}
.center-center {
  padding: 0.3rem 0.3rem;
  display: flex;
  justify-content: space-between;
}
.center-rate {
  width: 45%;
}
.rate-head {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.rate-center {
  margin: 0.2rem 0 0.1rem;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.rotate {
  animation: spin 0.8s linear infinite;
}
</style>
