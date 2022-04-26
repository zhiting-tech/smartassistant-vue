<template>
  <div class="scene" @scroll="scroll">
    <div class="header">
      <p>
        <span class="one-line float-l">{{ area.name }}</span>
        <!-- 注释：暂时单个家庭无需切换 -->
        <!-- <van-icon class="mgl25" name="arrow" size="0.4rem"/> -->
      </p>
      <van-icon
        @click="log()"
        class="notes-icon"
        name="notes-o"
        size="0.48rem"
        color="#3F4663"/>
      <van-icon
        v-if="permissions.add_scene"
        @click="toCreateScene"
        class="add-icon"
        name="add-o"
        size="0.48rem"
        color="#3F4663"/>
    </div>
    <van-notice-bar color="#F6AE1E" background="#FDF3DF" left-icon="info-o" v-if="false">
      智慧中心连接失败或者无权限
      <template v-slot:right-icon>
        <span class="notice-right"><van-icon name="replay" />刷新</span>
      </template>
    </van-notice-bar>
    <Loading v-if="loading"></Loading>
    <template v-else>
      <!-- 存在场景 -->
      <div class="scene-box" v-if="manualList.length>0 || autoRunList.length>0">
        <div ref="sceneType" class="scene-type-box">
          <van-sticky :container="sceneType">
            <div class="scene-type-header clearfix">
              <van-tabs class="float-l" :line-width="30" title-inactive-color="#94A5BE" title-active-color="#3F4663" background="#f6f8fd" v-model="activeType">
                <van-tab :title="`${$t('scene.manual')}`" :disabled="!isSort" name="manual"></van-tab>
                <van-tab :title="`${$t('scene.automatic')}`" :disabled="!isSort" name="automatic"></van-tab>
              </van-tabs>
              <div class="float-r sort" @click="sort"><span>{{isSort?'排序':'完成'}}</span></div>
            </div>
          </van-sticky>
          <draggable v-if="activeType==='manual'" v-model="manualList" :disabled="isSort" animation="300">
            <div class="type-item" :class="{'classify': !isSort}" @click="isSort?reviseScene(item):''" v-for="(item,index) in manualList" :key="index">
              <div class="item-header">
                <div class="title">{{item.name}}</div>
                <div class="operation" v-if="isSort" @click.stop>
                  <van-button
                    :class="{'disabled': !item.control_permission || !permissions.control_scene}"
                    size="small"
                    :color="!item.control_permission || !permissions.control_scene?'#CFD6E0':''"
                    :loading="item.loading"
                    @click="operation(item)">
                    {{ $t('scene.operation') }}
                  </van-button>
                </div>
              </div>
              <div class="item-list">
                <div class="right-box">
                  <div v-for="(item1, index1) in item.items" :key="index1" class="image-item" :class="{'borer': item1.type===1}">
                    <CommonImage
                      class="img"
                      fit="contain"
                      :src="item1.type===1?item1.logo_url:sceneImg">
                    </CommonImage>
                    <span v-if="item1.status===3" class="mask">{{$t('scene.offLine')}}</span>
                    <span v-if="item1.status===2" class="mask">{{$t('scene.deleted')}}</span>
                  </div>
                </div>
              </div>
              <van-icon class="wapNavIcon" size=".5rem" color="#94A5BE" v-if="!isSort" name="wap-nav" />
            </div>
          </draggable>
          <draggable v-if="activeType==='automatic'" v-model="autoRunList" :disabled="isSort" animation="300">
            <div class="type-item" :class="{'classify': !isSort}" @click="isSort?reviseScene(item):''" v-for="(item,index) in autoRunList" :key="index">
              <div class="item-header">
                <div class="title">{{item.name}}</div>
                <div class="operation" v-if="isSort" @click.stop>
                  <van-switch
                    :class="{'disabled': !item.control_permission || !permissions.control_scene}"
                    v-model="item.is_on"
                    :active-color="!item.control_permission || !permissions.control_scene ? '#CFD6E0' : '#2DA3F6'"
                    inactive-color="#CFD6E0"
                    size=".36rem"
                    :loading="item.loading"
                    @input="!item.loading?onInput(item):''" />
                </div>
              </div>
              <div class="item-list">
                <div class="left-box">
                  <div class="image-item">
                    <CommonImage
                      v-if="item.condition.type===1"
                      width=".8rem"
                      height=".8rem"
                      class="img"
                      fit="contain"
                      :src="timingImg">
                    </CommonImage>
                    <van-image
                      v-if="item.condition.type===2"
                      width=".8rem"
                      height=".8rem"
                      class="img"
                      fit="contain"
                      :src="item.condition.logo_url?item.condition.logo_url:deviceImg">
                      <template v-slot:error>
                        <van-image
                          width=".8rem"
                          height=".8rem"
                          class="img"
                          fit="contain"
                          :src="deviceImg">
                        </van-image>
                      </template>
                    </van-image>
                    <span v-if="item.condition.status===3" class="mask">{{$t('scene.offLine')}}</span>
                    <span v-if="item.condition.status===2" class="mask">{{$t('scene.deleted')}}</span>
                  </div>
                  <div class="image-item chains">
                    <van-image width=".32rem" height="auto" lazy-load :src="chains"/>
                  </div>
                </div>
                <div class="right-box">
                  <div v-for="(item1, index1) in item.items" :key="index1" class="image-item" :class="{'borer': item1.type===1}">
                    <CommonImage
                      class="img"
                      fit="contain"
                      :src="item1.type===1?item1.logo_url:sceneImg"/>
                    <span v-if="item1.status===3" class="mask">{{$t('scene.offLine')}}</span>
                    <span v-if="item1.status===2" class="mask">{{$t('scene.deleted')}}</span>
                  </div>
                </div>
              </div>
              <van-icon class="wapNavIcon" size=".5rem" color="#94A5BE" v-if="!isSort" name="wap-nav" />
            </div>
          </draggable>
        </div>
      </div>
      <!-- 没有场景 -->
      <div class="empty-box" v-if="isNoScene">
        <van-empty
          class="custom-image"
          :image="empty"
          :description="$t('scene.noScene')">
          <van-button
            v-if="permissions.add_scene"
            @click="toCreateScene()"
            type="info"
            class="bottom-button">{{$t('scene.addScene')}}</van-button>
        </van-empty>
      </div>
      <!-- 链接不上智慧云SA -->
      <div class="empty-box" v-if="false">
        <van-empty
          class="custom-image"
          :image="emptyPower"
          :description="$t('global.linkFail')">
          <van-button @click="toCreateScene()" icon="replay" type="info" class="bottom-button">{{$t('global.reconnect')}}</van-button>
        </van-empty>
      </div>
      <!--如何创建场景-->
      <div v-if="isNoScene" class="how-creat">
        <div class="title">{{$t('scene.howCreatTitle')}}</div>
        <div class="creat-intro" @click="guide()">
          <van-image :src="require('../../assets/creat-scene.png')"/>
          <div class="intro-text">{{$t('scene.howCreatCon')}}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'

const timingImg = require('../../assets/icon-timing.png')
const deviceImg = require('../../assets/icon-device.png')
const sceneImg = require('../../assets/condition-scene-icon.png')
const chains = require('../../assets/chains.png')
const empty = require('../../assets/empty-icon.png')
const emptyPower = require('../../assets/empty-power.png')

export default {
  name: 'scene',
  components: {
    draggable
  },
  data() {
    return {
      loading: false,
      timingImg,
      chains,
      deviceImg,
      empty,
      emptyPower,
      sceneImg,
      sceneTypeList: [
        { name: this.$t('scene.manual'), type: 'manual' },
        { name: this.$t('scene.automatic'), type: 'automatic' }
      ],
      activeType: 'manual',
      manualList: [],
      autoRunList: [],
      sceneType: null,
      isSort: true,
      position: 0
    }
  },
  computed: {
    ...mapGetters(['websocket', 'area', 'permissions']),
    isNoScene() {
      return this.manualList.length === 0 && this.autoRunList.length === 0
    }
  },
  methods: {
    getSceneList() {
      this.loading = true
      this.http.scenesList().then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        const { manual, auto_run: autoRun } = res.data
        if (manual && manual.length > 0) {
          manual.forEach((item) => {
            item.loading = false
          })
        }
        if (autoRun && autoRun.length > 0) {
          autoRun.forEach((item) => {
            item.loading = false
          })
        }
        this.manualList = manual || []
        this.autoRunList = autoRun || []
      }).catch(() => {
        this.loading = false
      })
    },
    updateSceneList() {
      this.http.scenesList().then((res) => {
        if (res.status !== 0) {
          return
        }
        const { manual, auto_run: autoRun } = res.data
        if (manual && manual.length > 0) {
          manual.forEach((item) => {
            item.loading = false
          })
        }
        if (autoRun && autoRun.length > 0) {
          autoRun.forEach((item) => {
            item.loading = false
          })
        }
        this.manualList = manual || []
        this.autoRunList = autoRun || []
        this.$toast.success('执行成功')
      })
    },
    toCreateScene() {
      this.$router.push({
        name: 'setScene'
      })
    },
    log() {
      this.$router.push({ name: 'sceneLog' })
    },
    guide() {
      this.$router.push({ name: 'sceneGuide' })
    },
    reviseScene(params) {
      if (this.permissions.update_scene) {
        const obj = {
          position: this.position
        }
        this.changeQuery(obj)
        setTimeout(() => {
          this.$router.push({
            name: 'setScene',
            query: {
              position: this.position,
              sceneId: params.id,
              name: params.name
            }
          })
        }, 300)
      } else {
        this.$toast('暂无编辑场景权限')
      }
    },
    // 开关操作
    onInput(params) {
      if (params.control_permission && this.permissions.control_scene) {
        params.loading = true
        this.http.executeScene(params.id, { is_execute: params.is_on }).then((res) => {
          params.loading = false
          if (res.status !== 0) {
            this.$toast(res.reason)
            this.autoRunList.forEach((item) => {
              if (item.id === params.id) {
                item.is_on = !params.is_on
              }
            })
            return
          }
          if (params.is_on) {
            this.$toast('自动执行已开启')
          } else {
            this.$toast('自动执行已关闭')
          }
        })
      } else {
        params.is_on = !params.is_on
        this.$toast('暂无控制场景权限')
      }
    },
    // 执行操作
    operation(params) {
      if (params.control_permission && this.permissions.control_scene) {
        params.loading = true
        this.http.executeScene(params.id, { is_execute: true }).then((res) => {
          if (res.status !== 0) {
            this.$toast(res.reason)
            return
          }
          this.updateSceneList()
        })
      } else {
        this.$toast('暂无控制场景权限')
      }
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
    // 排序
    sort() {
      if (this.isSort) {
        this.isSort = !this.isSort
      } else {
        let sceneIds = []
        if (this.activeType === 'manual') {
          sceneIds = this.manualList.map(item => item.id)
        } if (this.activeType === 'automatic') {
          sceneIds = this.autoRunList.map(item => item.id)
        }
        this.http.scenesSort({ scene_ids: sceneIds }).then((res) => {
          this.loading = false
          if (res.status !== 0) {
            return
          }
          this.isSort = !this.isSort
          this.getSceneList()
        })
      }
    }
  },
  created() {
    this.getSceneList()
  },
  mounted() {
    this.sceneType = this.$refs.sceneType
    this.$nextTick(() => {
      // 实现滚动效果
      setTimeout(() => {
        const { query, path } = this.$route
        if (query.position || Number(query.position) >= 60) {
          document.querySelector('.scene').scrollTop = Number(query.position)
          // 对象的拷贝
          const newQuery = JSON.parse(JSON.stringify(query))
          delete newQuery.position
          // 地址栏的参数值赋值
          this.$router.replace({ path, query: newQuery })
        }
      }, 500)
    })
  }
}
</script>
<style lang="scss" scoped>
  .mgl25 {
    margin-left: 0.25rem;
    vertical-align: middle;
  }
  .img {
    width: 100%;
    height: 100%;
  }
  .scene {
    height: calc(100vh - 1rem);
    background: $bgColor;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .scene::-webkit-scrollbar{
    display: none;
  }
  .header {
    position: relative;
    padding: 0 0.3rem;
    height: 1.38rem;
    line-height: 1.38rem;
    background: #ffffff;
    display: flex;
    align-items: center;
    p {
      font-size: 0.48rem;
      font-weight: bold;
      color: #3F4663;
      flex: 1;
    }
    span {
      max-width: 5.5rem;
      font-weight: bold;
    }
    .notes-icon{
      margin-right: .4rem;
    }
  }
  .notice-right{
    display: flex;
    align-items: center;
    cursor: pointer;
    .van-icon{
      margin-right: .1rem;
    }
  }
  .scene-box{
    padding: 0 .3rem;
    .scene-type-box {
      .scene-type-header{
        margin-bottom: .2rem;
        .van-tabs{
          width: 2rem;
        }
        .sort{
          height: .88rem;
          display: flex;
          align-items: center;
        }
      }
      .type-item {
        background: #ffffff;
        border-radius: .2rem;
        padding: .3rem .3rem;
        margin-bottom: .2rem;
        position: relative;
        overflow: hidden;
        .item-list{
          display: flex;
          .left-box{
            display: flex;
            flex-wrap: wrap;
            .image-item:first-child{
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
            .chains{
              line-height: .8rem;
              margin: 0 .2rem;
            }
          }
          .right-box{
            display: flex;
            position: relative;
            margin-left: -.12rem;
            margin-right: -.12rem;
            flex: 1;
            flex-wrap: wrap;
            .image-item{
              width: .8rem;
              height: .8rem;
              border-radius: .08rem;
              margin: 0 .1rem .2rem .1rem;
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
            .image-item.borer{
              padding: .05rem;
              border: 1px solid #EEEEEE;
            }
          }
        }
        .van-icon{
          position: absolute;
          top: 50%;
          right: .3rem;
          margin-top: -.25rem;
        }
      }
      .type-item.classify{
        padding-right: 1rem;
        box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
      }
    }
  }
  .item-header{
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    min-height: .6rem;
    overflow: hidden;
    color: #323233;
    background-color: #fff;
    margin-bottom: .2rem;
    .title{
      font-weight: bold;
      color: #3F4663;
      flex: 1;
    }
    .operation {
      .van-switch{
        width: .72rem;
        height: .36rem;
      }
      .van-button{
        width: 1.4rem;
        height: .6rem;
        font-size: .3rem;
        font-weight: bold;
        color: #2DA3F6;
        background: #F1F4FC;
        border-radius: .08rem;
        border: none 0;
      }
    }
  }
  .empty-box{
      padding: .3rem .3rem;
      .custom-image{
        background: #ffffff;
        border-radius: .2rem;
      }
      .bottom-button{
        border-radius: .08rem;
      }
    }
  .how-creat{
      padding: .3rem .3rem;
      .title{
        color: #94A5BE;
        font-size: .28rem;
        margin-bottom: .3rem;
      }
      .creat-intro{
        background: #ffffff;
        border-radius: .2rem;
        overflow: hidden;
        .intro-text{
          padding: .2rem .4rem .3rem .4rem;
          font-size: .28rem;
          font-weight: bold;
          color: #3F4663;
          background: #ffffff;
        }
      }
    }
</style>
<style scoped>
  .scene-type-box >>> .van-sticky--fixed .scene-type-header{
    background: #f6f8fd;
    padding: 0 .3rem;
  }
  .scene-type-box >>> .van-tabs__line {
    background: #2DA3F6;
  }
</style>
<style>
  .custom-image .van-empty__image {
    width: 2rem;
    height: .77rem;
  }
  .custom-image .van-empty__description{
    font-size: .28rem;
    color: #94A5BE;
    margin-top: .1rem;
  }
</style>
