<template>
  <div class="user">
    <van-nav-bar
      :title="$t('deviceManage.changeIcon')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="$router.go(-1)">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
    </van-nav-bar>
    <!--loading模块-->
    <Loading v-if="loading"></Loading>
    <template v-else>
      <div class="images-box">
        <van-row gutter="10">
          <van-col span="6" v-for="(item,index) in imagesList" :key="index" @click="onChange(item)">
            <div class="item" :class="{'active': active === item.type}">
              <van-image class="face" :src="item.url"/>
              <div class="name one-line">{{item.name}}</div>
              <label class="status-label" v-show="active === item.type">
                <van-icon name="success" />
              </label>
            </div>
          </van-col>
        </van-row>
      </div>
      <div class="bottom-button-placeholder">
        <div class="bottom-button-box">
          <van-button type="info" block @click="sure">
            {{$t('global.finish')}}
          </van-button>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

const light = require('../../assets/test/test-1.png')
const switchs = require('../../assets/test/test-2.png')
const socket = require('../../assets/test/test-3.png')
const curtain = require('../../assets/test/test-4.png')
const gateway = require('../../assets/test/test-5.png')
const sensor = require('../../assets/test/test-6.png')
const camera = require('../../assets/test/test-7.png')
const doorLock = require('../../assets/test/test-8.png')
const other = require('../../assets/test/test-9.png')

export default {
  name: 'changeIcon',
  components: {},
  data() {
    return {
      active: 0,
      imagesList: [
        { name: '灯', url: light },
        { name: '开关', url: switchs },
        { name: '插座', url: socket },
        { name: '窗帘电机', url: curtain },
        { name: '网关', url: gateway },
        { name: '传感器', url: sensor },
        { name: '摄像头', url: camera },
        { name: '智能门锁', url: doorLock },
        { name: '其他', url: other }
      ],
      loading: false,
      deviceId: '',
      logoType: ''
    }
  },
  computed: {
    ...mapGetters(['websocket'])
  },
  methods: {
    ...mapActions(['setToken']),
    // onClickLeft() {
    //   this.
    // },
    // 切换图片选择
    onChange(params) {
      this.active = params.type
    },
    // 获取用户信息
    getDeviceLogos(id) {
      this.loading = true
      this.http.deviceLogos(id).then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        this.imagesList = res.data.device_logos || []
      }).catch(() => {
        this.loading = false
      })
    },
    // 确定换图
    sure() {
      const params = {
        logo_type: this.active
      }
      this.http.editDevice(this.deviceId, params).then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        this.onClickLeft()
      })
    }
  },
  created() {
    const { deviceId, type } = this.$route.query
    this.deviceId = Number(deviceId)
    this.active = Number(type)
    this.getDeviceLogos(deviceId)
  }
}
</script>
<style lang="scss" scoped>
.user {
  min-height: 100vh;
  background: #FFFFFF;
}
.images-box {
  padding: .2rem .3rem;
  .van-col{

  }
  .item.active{
    box-shadow: 0px 0px 15px 0px rgba(21, 21, 21, 0.15);
  }
  .item{
    height: 2.2rem;
    padding: .2rem .2rem;
    overflow: hidden;
    background: #FFFFFF;
    border-radius: .08rem;
    position: relative;
    margin-bottom: .2rem;
    .face{
      width: 100%;
      height: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: .2rem;
    }
    .name{
      height: .4rem;
      line-height: .4rem;
      text-align: center;
      font-size: .28rem;
      font-weight: bold;
      color: #3F4663;
    }
    label{
      position: absolute;
      right: -0.16rem;
      top: -0.06rem;
      width: 0.5rem;
      height: 0.3rem;
      background: #2DA3F6;
      text-align: center;
      transform: rotate(45deg);
      box-shadow: 0 1px 1px #ccc;
      .van-icon {
        color: #FFFFFF;
        font-size: .12rem;
        transform: rotate(-50deg);
      }
    }
  }
}
.bottom-button-placeholder{
  height: 1.6rem;
}
.bottom-button-box {
  width: 100%;
  max-width: 750px;
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  padding: 0.3rem;
  background: #FFFFFF;
}
.text-over {
  display: inline-block;
  max-width: 5rem;
}
.right-icon {
  vertical-align: top;
  margin-left: 0.3rem;
}
</style>
<style scoped>
  .images-box >>> .van-image__img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
</style>
