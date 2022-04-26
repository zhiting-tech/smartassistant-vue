import Vue from 'vue'
import {
  Tabbar,
  TabbarItem,
  ActionSheet,
  NavBar,
  Icon,
  Image as VanImage,
  Loading,
  Dialog,
  Tab,
  Tabs,
  Button,
  Checkbox,
  CheckboxGroup,
  Cell,
  CellGroup,
  RadioGroup,
  Radio,
  Circle,
  Empty,
  Search,
  Lazyload,
  Switch,
  Collapse,
  CollapseItem,
  Picker,
  Popup,
  Popover,
  Field,
  SwipeCell,
  Slider,
  Skeleton,
  NoticeBar,
  CountDown,
  Sticky,
  List,
  PasswordInput,
  NumberKeyboard,
  Uploader,
  Calendar,
  Overlay,
  Progress,
  Col,
  Row,
  DatetimePicker,
  DropdownMenu,
  DropdownItem,
} from 'vant'

import i18n from './lang/index' // 多语言
import * as common from './utils/common'
import CommonImage from './components/CommonImage.vue'
import WeakNetwork from './components/WeakNetwork.vue'
import CommonLoading from './components/Loading.vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/index.scss'
import * as http from './api/http'
import Bus from './bus/index'
import 'vant/lib/index.css'
// eslint-disable-next-line
import '@vant/touch-emulator'
import 'zt-plugin-sdk'

Vue.use(Tabbar)
  .use(TabbarItem)
  .use(ActionSheet)
  .use(NavBar)
  .use(Icon)
  .use(VanImage)
  .use(Loading)
  .use(Dialog)
  .use(Tab)
  .use(Tabs)
  .use(Button)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Cell)
  .use(CellGroup)
  .use(RadioGroup)
  .use(Radio)
  .use(Circle)
  .use(Empty)
  .use(Search)
  .use(Lazyload)
  .use(Switch)
  .use(Collapse)
  .use(CollapseItem)
  .use(Picker)
  .use(Popup)
  .use(Popover)
  .use(Field)
  .use(SwipeCell)
  .use(Slider)
  .use(Skeleton)
  .use(NoticeBar)
  .use(CountDown)
  .use(Sticky)
  .use(List)
  .use(PasswordInput)
  .use(NumberKeyboard)
  .use(Uploader)
  .use(Calendar)
  .use(Overlay)
  .use(Progress)
  .use(Col)
  .use(Row)
  .use(DatetimePicker)
  .use(DropdownMenu)
  .use(DropdownItem)

// 注册全局image组件
Vue.component('CommonImage', CommonImage)
Vue.component('WeakNetwork', WeakNetwork)
Vue.component('Loading', CommonLoading)
Vue.config.productionTip = false
Vue.prototype.http = http
Vue.prototype.$methods = common.default
Vue.prototype.$bus = Bus
new Vue({
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app')
