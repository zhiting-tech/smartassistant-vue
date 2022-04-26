export default {
  /**
   * 生成随机24位id
   * @param { Number } max 生成随机数的长度
  */
  getId(max = 10) {
    let str = ''
    const range = max
    // const newArr = [...`${Date.now()}`]
    const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    for (let i = 0; i < range; i += 1) {
      const pos = Math.round(Math.random() * (arr.length - 1))
      str += arr[pos]
    }
    return str
  },
  /**
   * 手机号验证
   * @param { String } phonNum 手机号
  */
  isPhone(phone = '') {
    // 以1开头的11位号码都默认是手机号
    return /^1\d{10}$/.test(phone)
  },
  /**
   * 注册密码认证
   * @param { String } password 密码
  */
  isPassWord(password = '') {
    return /^.{6,20}$/.test(password)
  },
  /**
   * 判断是否是pc端
  */
  isMobile() {
    const { userAgent } = navigator
    const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
    return Agents.some(i => userAgent.includes(i))
  },
  /**
   *  设置localStorage
  */
  setStore(name, val) {
    if (window.localStorage && window.localStorage.getItem) {
      window.localStorage.setItem(name, val)
    }
  },
  /**
   *  获取localStorage
  */
  getStore(name) {
    if (window.localStorage && window.localStorage.getItem) {
      return window.localStorage.getItem(name)
    }
    return ''
  },
  setSession(name, val) {
    if (window.sessionStorage && window.sessionStorage.getItem) {
      window.sessionStorage.setItem(name, val)
    }
  },
  /**
   *  获取localStorage
  */
  getSession(name) {
    if (window.sessionStorage && window.sessionStorage.getItem) {
      return window.sessionStorage.getItem(name)
    }
    return ''
  },
  /**
   *  判断h5是否在app内打开
  */
  isApp() {
    const ua = navigator.userAgent
    if (ua.includes('zhitingua')) {
      return true
    }
    return false
  },
  /**
   * 格式化时间
   * @param { val } 格式化时间 单位：秒
   */
  formatTime(val) {
    if (!val) {
      return '00:00:00'
    }
    let hour = Math.floor(val / 60 / 60)
    let minue = Math.floor((val / 60) % 60)
    let second = val % 60
    hour = hour > 9 ? hour : `0${hour}`
    minue = minue > 9 ? minue : `0${minue}`
    second = second > 9 ? second : `0${second}`
    return `${hour}:${minue}:${second}`
  },
  /**
   * 时间戳获取时分秒的秒数
   * @param { val } 格式化时间 单位：秒
   */
  getTimestamp(val) {
    if (!val) {
      return 0
    }
    const date = new Date(val * 1000)
    const hours = date.getHours()
    const minues = date.getMinutes()
    const seconds = date.getSeconds()
    return (hours * 60 + minues) * 60 + seconds
  },
  /**
   * 格式化日期时间
   * @param { nS, type } 格式化时间 自定义类型
   * nS 时间戳，单位秒 type 显示类型
   */
  getTime(nS, type) {
    if (!nS) {
      return ''
    }
    const date = new Date(nS * 1000)
    let time = ''
    const year = date.getFullYear()
    let mon = date.getMonth() + 1
    let day = date.getDate()
    let hours = date.getHours()
    let minu = date.getMinutes()
    let sec = date.getSeconds()
    if (mon < 10) {
      mon = `0${mon}`
    }
    if (day < 10) {
      day = `0${day}`
    }
    if (hours < 10) {
      hours = `0${hours}`
    }
    if (minu < 10) {
      minu = `0${minu}`
    }
    if (sec < 10) {
      sec = `0${sec}`
    }
    if (type === 'YY-MM-DD hh:mm:ss') {
      time = `${year}-${mon}-${day} ${hours}:${minu}:${sec}`
    } if ((type === 'YY-MM-DD')) {
      time = `${year}-${mon}-${day}`
    } if ((type === 'YY-MM')) {
      time = `${year}-${mon}`
    } if ((type === 'MM-DD')) {
      time = `${mon}-${day}`
    } if ((type === 'hh:mm:ss')) {
      time = `${hours}:${minu}:${sec}`
    } if ((type === 'hh:mm')) {
      time = `${hours}:${minu}`
    } if ((type === 'mm:ss')) {
      time = `${minu}:${sec}`
    } if ((type === 'YYMMDD')) {
      time = `${year}年${mon}月${day}日`
    } if ((type === 'MMDD hh:mm')) {
      time = `${mon}月${day}日 ${hours}:${minu}`
    } if (type === 'MM-DD hh:mm') {
      time = `${mon}-${day} ${hours}:${minu}`
    } if (type === 'YY-MM-DD hh:mm') {
      time = `${year}-${mon}-${day} ${hours}:${minu}`
    } if (type === 'yymmdd') {
      time = `${year}${mon}${day}`
    }
    return time
  },

  /**
   * int类型的计算百分比
   * @param { max, min, value } max区间最大值， min区间最小值, value区间真实值
   */
  getPercent(max, min, value) {
    // let res = Number(((value - min) / (max - min) * 100))
    let res = Math.round(Number(((value - min) / (max - min) * 100)))
    if (res < 0) {
      res = 0
    }
    return res
  },

  /**
   * 判断是否具备写的权限
   * @param { val } val 由0/1/2/4随意相加组合的和，如果存在2证明有权限
   */
  formatPermission(val) {
    const permission = [2, 3, 6, 7]
    return permission.includes(val)
  }
}
