<template>
  <van-popup
    v-model="show"
    position="bottom"
    class="warp-popup"
    @open="getMemberList">
    <van-nav-bar
      :title="title"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
      <template #right>
        <van-button class="nav-edit" round size="small" type="info" :loading="saveLoading" :disabled="choseList.length===0" @click="handleEdit">{{ $t('global.confirm') }}<span v-if="choseList.length>0">({{choseList.length}})</span></van-button>
      </template>
    </van-nav-bar>
    <!--loading模块-->
    <Loading v-if="loading"></Loading>
    <div v-else-if="isEmpty" class="empty-box">
      <div class="empty-wrap">
        <van-image :src="emptyImg" class="empty-img"/>
        <p class="empty-word">{{ $t('departmentDetail.empty') }}</p>
      </div>
    </div>
    <template v-else>
      <div class="detail-box">
        <div class="tips">勾选即可添加成员</div>
        <div class="members-select" v-if="choseList.length>0">
          <div class="select-tags" ref="scroll">
            <span class="tag" v-for="(item,index) in choseList" :key="index" @click="deleteTag(item)">
              <van-image width=".45rem" height=".45rem" round fit="cover" lazy-load :src="item.url">
                <template v-slot:error><van-image round fit="cover" :src="require('../assets/default-header.png')"></van-image></template>
              </van-image>
              <span class="tag-name">{{item.nickname}}</span>
              <van-icon name="clear" color="rgba(0,0,0,.5)" size=".2rem" @click.stop="deleteTag(item)"/>
            </span>
          </div>
        </div>
        <div class="role-list">
          <div v-for="member in membersList" :key="member.user_id" class="role-item"
               @click="chooseMember(member)">
            <div class="role-face">
              <van-image width=".8rem" height=".8rem" round fit="cover" lazy-load :src="member.url">
                <template v-slot:error><img src="../assets/default-header.png"></template>
              </van-image>
            </div>
            <div class="role-info">
              <p class="user-name one-line">{{ member.nickname }}</p>
              <p class="role-name one-line">{{ member.role_name }}</p>
            </div>
            <van-checkbox v-model="member.checked" shape="square" icon-size=".36rem"></van-checkbox>
          </div>
        </div>
      </div>
    </template>
  </van-popup>
</template>

<script>
const emptyImg = require('../assets/empty-icon.png')

export default {
  name: 'addMembersPopup',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    saveLoading: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    selected: {
      type: Array,
      defaults: () => []
    },
    maxlength: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      emptyImg,
      show: this.value,
      tagArr: [],
      membersList: [],
      loading: false
    }
  },
  computed: {
    isEmpty() {
      return this.membersList.length === 0
    },
    choseList() {
      return this.membersList.filter(item => item.checked)
    },
  },
  watch: {
    value(val) {
      this.show = val
    },
    show(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    onClickLeft() {
      this.show = false
    },
    // 获取添加成员列表
    getMemberList() {
      this.loading = true
      this.http.getUser().then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        const { users } = res.data
        users.forEach((item) => {
          item.checked = false
          for (let i = 0; i < this.selected.length; i += 1) {
            if (this.selected[i].user_id === item.user_id) {
              item.checked = true
            }
          }
        })
        this.membersList = users.filter(item => item.id !== -1) || []
      }).catch(() => {
        this.loading = false
      })
    },
    chooseMember(member) {
      member.checked = !member.checked
    },
    deleteTag(params) {
      this.membersList.forEach((item) => {
        const temp = item
        if (params.user_id === temp.user_id) {
          temp.checked = !temp.checked
        }
      })
    },
    handleEdit() {
      const arr = []
      this.choseList.forEach((item) => {
        arr.push(item.user_id)
      })
      this.$emit('on-confirm', arr)
    }
  }
}
</script>
<style scoped lang="scss">
.warp-popup {
  height: 100%;
  width: 100%;
}
.nav-edit{
  min-width: 1rem;
  height: .5rem;
}
.tips{
  background: #ffffff;
  color: #CCCCCC;
  padding: .2rem .3rem;
}
.detail-box{
  display: flex;
  flex-direction: column;
  height: calc(100vh - 1rem);
}
.members-select{
  width: 100%;
  padding: .1rem .2rem;
  background-color: #FFFFFF;
  border-radius: .4rem;
  position: relative;
  margin-bottom: .1rem;
}
.select-tags{
  line-height: normal;
  white-space: normal;
  display: flex;
  flex-wrap: wrap;
  max-height: 1.6rem;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
}
.select-tags .tag{
  height: .6rem;
  padding: 0 .2rem 0 .1rem;
  color: #343434;
  border-radius: .3rem;
  box-sizing: border-box;
  white-space: nowrap;
  margin: .1rem .1rem;
  display: flex;
  align-items: center;
  position: relative;
  background-color: rgba(45, 163, 246, .1);
}
.select-tags .tag-name{
  padding-left: .1rem;
  max-width: 1.2rem;
  overflow: hidden;
  color: #3F4663;
}
.select-tags .van-icon{
  cursor: pointer;
  color: #999999;
  position: absolute;
  right: 0;
  top: 0;
}
.role-list {
  flex: 1;
  background: #fff;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  position: relative;
}
.role-item {
  display: flex;
  align-items: center;
  padding: 0.2rem 0.3rem;
  border-bottom: 0.01rem solid #eee;
  .van-checkbox{
    min-height: .4rem;
  }
}
.role-face {
  img {
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    overflow: hidden;
  }
}
.role-info {
  position: relative;
  word-break: break-all;
  flex: 1;
  padding: 0 .3rem;
  overflow: hidden;
  .user-name {
    font-size: 0.28rem;
    color: #3F4663;
  }
  .role-name {
    margin-top: .15rem;
    font-size: 0.24rem;
    color: #94A5BE;
  }
}
.empty-box {
  display: flex;
  height: calc(100vh - 0.92rem);
  justify-content: center;
  align-items: center;
}
.empty-word {
  text-align: center;
  padding: 0.15rem 0 0.73rem 0;
  color: #94A5BE;
}
</style>
<style scoped>
#app .nav-edit .van-button__text{
  font-weight: normal;
}
</style>
