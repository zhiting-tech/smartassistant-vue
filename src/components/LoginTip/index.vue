<template>
  <van-dialog
    v-model="isShow"
    title=""
    theme="round-button"
    confirmButtonText="知道了"
    confirmButtonColor="#2DA3F6"
    @confirm="sure">
    <div class="van-dialog__message">
      <div class="tips-icon"><img :src="require('../../assets/tips-warning.png')" /></div>
      <div class="tips-title">提示</div>
      <div v-if="status === 5012">当前终端无凭证或已过期，请拥有者在专业版中设置允许找回用户凭证后重新登录。</div>
      <div v-else-if="status === 5031">密码已修改，请重新登录。</div>
      <div v-else-if="areaName" class="tips-text">你已被管理员移出“{{ areaName }}”</div>
      <div v-else class="tips-text">你已被管理员移出家庭/公司</div>
    </div>
  </van-dialog>
</template>
<script>
import store from '../../store'
import router from '../../router'

export default {
  name: 'loginTip',
  data() {
    return {
      status: 5012, // 5012 用户未登录 5003 用户不存在
      isShow: false,
      areaName: ''
    }
  },
  computed: {
  },
  methods: {
    sure() {
      this.isShow = false
      store.commit('setToken', '')
      this.$methods.setStore('token', '')
      router.push({
        name: 'professionLogin'
      })
    }
  }
}
</script>
<style scoped>
  .tips-icon{
    text-align: center;
    margin-bottom: .2rem;
  }
  .tips-icon img{
    width: 1rem;
    height: 1rem;
  }
  .tips-title{
    font-size: .36rem;
    font-weight: bold;
    color: #333333;
    margin-bottom: .2rem;
  }
  .tips-text{;
    color: #333333;
    margin-bottom: .2rem;
  }
</style>
