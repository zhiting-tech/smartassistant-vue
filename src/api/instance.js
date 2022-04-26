import axios from 'axios'
import qs from 'qs'
import { Toast } from 'vant'
import store from '../store'
import i18n from '../lang/index'
import * as $methods from '../utils/common'
import Bus from '../bus/index'
import { LoginTip } from '../components/LoginTip/index'
import router from '../router'

const REFRESH_TOKEN = 'refreshToken'

// 怎加一个普通的axios
const commonAx = axios.create({
  baseURL: '/',
  withCredentials: true, // 跨域携带证书
  timeout: 20000,
  headers: {
    'content-type': 'application/json;charset=UTF-8',
  }
})

commonAx.interceptors.request.use((config) => {
  // 每个请求都带上token
  const { token } = store.state
  if (token) {
    config.headers['smart-assistant-token'] = token
  }
  // 上传接口参数转为 formData
  if (config.method === 'post') {
    if (config.url.includes('/plugins')) {
      // config.headers['content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
      config.headers['content-type'] = 'multipart/form-data'
    }
  }
  return config
})

const commonItr = (reqAxios, type, url, params) => {
  let reqParams = params
  let reqUrl = url
  if (typeof params !== 'object') {
    reqParams = {}
  }
  const arg = qs.stringify(reqParams)
  if (Object.keys(reqParams).length > 0) {
    reqUrl = (type === 'get') ? `${url}?${arg}` : url
  }

  return reqAxios[type](reqUrl, reqParams)
}

let isRefreshing = false // 标记是否正在刷新 token
let requests = [] // 存储待重发请求的数组

// 刷新 access_token 的接口
const refreshAccessToken = () => {
  const refreshToken = $methods.default.getStore(REFRESH_TOKEN)
  if (!refreshToken) {
    LoginTip.show('', 5003)
  }
  const params = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  }
  commonItr(commonAx, 'post', '/api/oauth/access_token', params).then((response) => {
    const { data } = response
    if (data.status !== 0) {
      if (data.status === 5026 || data.status === 5027) {
        // 登录拦截
        router.push({
          name: 'professionLogin'
        })
      }
      return
    }
    const { access_token: token, refresh_token: newRefreshToken } = data.data.token_info
    // 更新token
    $methods.default.setStore(REFRESH_TOKEN, newRefreshToken)
    $methods.default.setStore('token', token)
    store.dispatch('setToken', token)
    // token 刷新后将数组的方法重新执行
    requests.forEach(cb => cb())
    requests = [] // 重新请求完清空
  }).catch(err => Promise.reject(err)).finally(() => {
    isRefreshing = false
  })
}

const commonBase = (reqAxios, type, url, params) => new Promise((resolve, reject) => {
  commonItr(reqAxios, type, url, params)
    .then((response) => {
      const { data } = response
      const { config } = response
      if ((data.status === 5026 && !config.url.includes('/oauth/access_token')) || (data.status === 5027 && !config.url.includes('/oauth/access_token'))) {
        // access_token过期 无感刷新access_token
        if (!isRefreshing) {
          isRefreshing = true
          refreshAccessToken()
        } else {
          requests.push(() => {
            commonAx(config)
          })
        }
      } else if (data.status === 5012) {
        // 登录拦截
        LoginTip.show(store.state.area.name, data.status)
      } else if (data.status === 5031) {
        // 登录拦截
        LoginTip.show(store.state.area.name, data.status)
      } else if (data.status === 5003) {
        // 用户不存在
        LoginTip.show('', data.status)
      } else if (data.status === 5021) {
        // 没有权限 重新获取权限
        const { userInfo } = store.state
        Bus.$emit('updatePermission', userInfo.user_id)
        Toast(data.reason)
      } else if (data.status !== 0) {
        Toast(data.reason)
      }
      resolve(data)
    })
    .catch((error) => {
      // 如果是固件、软件升级的话不显示网络异常提示
      if ((type === 'get' && url !== '/api/supervisor/update') || (type === 'get' && url !== '/api/supervisor/firmware/update')) {
        reject(error)
      } else {
        Toast.fail(i18n.messages[i18n.locale].global.netWorkErr)
        reject(error)
      }
    })
})


// 是因为 post 和 put 第二个参数是data，所以可以直接在第二个参数的位置写上数据，

// 后台可以访问到,而delete第二个参数是 config，所以要通过 config 里面的 data 来传参，所以应该这样写：axios.delete('/api',{data:{id:1}})

export const g = (url, params) => commonBase(commonAx, 'get', url, params)

export const p = (url, params) => commonBase(commonAx, 'post', url, params)

export const d = (url, params) => commonBase(commonAx, 'delete', url, { data: params })

export const u = (url, params) => commonBase(commonAx, 'put', url, params)

export const pa = (url, params) => commonBase(commonAx, 'patch', url, params)

export const op = (url, params) => commonBase(commonAx, 'options', url, params)
