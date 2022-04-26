import Vue from 'vue'
import Router from 'vue-router'
import Device from './views/device/index.vue'
import DeviceDetail from './views/device/detail.vue'
import DeviceResourse from './views/device/resourse.vue'
import DeviceManage from './views/device/manage.vue'
import DeviceDiscover from './views/device/discover.vue'
import DeviceConnect from './views/device/connect.vue'
import Owner from './views/owner/index.vue'
import BrandSupport from './views/brand/index.vue'
import BrandDetail from './views/brand/detail.vue'
import PluginDetail from './views/plugin/detail.vue'
import AreaDetail from './views/area/detail.vue'
import LocationManage from './views/location/manage.vue'
import LocationDevice from './views/location/device.vue'
import LocationSetting from './views/location/setting.vue'
import Login from './views/login/index.vue'
import Register from './views/register/index.vue'
import AuthStepOne from './views/login/auth-step-1.vue'
import AuthStepTwo from './views/login/auth-step-2.vue'
import AuthPan from './views/login/auth-pan.vue'
import User from './views/user/index.vue'
import MemberManage from './views/user/manage.vue'
import ThirdPlatform from './views/third-platform/index.vue'
import UserCredentials from './views/guide/user-credentials.vue'
import SceneGuide from './views/guide/scene.vue'
import RoleList from './views/role/index.vue'
import RoleAdd from './views/role/add.vue'
import ProfessionLogin from './views/login/profession.vue'
import Scene from './views/scene/index.vue'
import SetScene from './views/scene/set-scene.vue'
import SceneLog from './views/scene/log.vue'
import EffectiveTime from './views/scene/effective-time.vue'
import ConditionsList from './views/scene/condition-list.vue'
import ConditionsDevice from './views/scene/condition-device.vue'
import ConditionsScene from './views/scene/condition-scene.vue'
import HomeKit from './views/login/homekit.vue'
import PowerManage from './views/owner/power-manage.vue'
import CertificateManage from './views/owner/certificate-manage.vue'
import TransferOwner from './views/user/transfer-owner.vue'
import Log from './views/owner/log.vue'
import Backup from './views/owner/backup.vue'
import BackupMark from './views/owner/backup-mark.vue'
import BackupLocation from './views/owner/backup-location.vue'
import Recovery from './views/owner/recovery.vue'
import Upgrade from './views/device/upgrade.vue'
import Protocol from './views/protocol/index.vue'
import ProtocolUser from './views/protocol/user.vue'
import ProtocolPrivacy from './views/protocol/privacy.vue'
import DepartmentManage from './views/department/manage.vue'
import DepartmentDetail from './views/department/detail.vue'
import DepartmentSetting from './views/department/setting.vue'
import ExperienceCenter from './views/experience-center/index.vue'
import OutLineHelp from './views/help/out-line.vue'
import OfflineHelp from './views/help/offline-help.vue'
import ChangeIcon from './views/device/change-icon.vue'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'device',
      component: Device
    },
    {
      path: '/device/detail',
      name: 'deviceDetail',
      component: DeviceDetail
    },
    {
      path: '/device/resourse',
      name: 'deviceResourse',
      component: DeviceResourse
    },
    {
      path: '/device/manage',
      name: 'deviceManage',
      component: DeviceManage
    },
    {
      path: '/device/discover',
      name: 'deviceDiscover',
      component: DeviceDiscover
    },
    {
      path: '/device/connect',
      name: 'deviceConnect',
      component: DeviceConnect
    },
    {
      path: '/device/upgrade',
      name: 'upgrade',
      component: Upgrade
    },
    {
      path: '/owner',
      name: 'owner',
      component: Owner
    },
    {
      path: '/owner/power-manage',
      name: 'powerManage',
      component: PowerManage
    },
    {
      path: '/owner/certificate-manage',
      name: 'certificateManage',
      component: CertificateManage
    },
    {
      path: '/owner/log',
      name: 'log',
      component: Log
    },
    {
      path: '/owner/backup',
      name: 'backup',
      component: Backup
    },
    {
      path: '/owner/backup-mark',
      name: 'backupMark',
      component: BackupMark
    },
    {
      path: '/owner/backup-location',
      name: 'backupLocation',
      component: BackupLocation
    },
    {
      path: '/owner/recovery',
      name: 'recovery',
      component: Recovery
    },
    {
      path: '/brand/support',
      name: 'brandSupport',
      component: BrandSupport
    },
    {
      path: '/brand/detail',
      name: 'brandDetail',
      component: BrandDetail
    },
    {
      path: '/plugin/detail',
      name: 'pluginDetail',
      component: PluginDetail
    },
    {
      path: '/area/detail',
      name: 'areaDetail',
      component: AreaDetail
    },
    {
      path: '/member/manage',
      name: 'memberManage',
      component: MemberManage
    },
    {
      path: '/location/manage',
      name: 'locationManage',
      component: LocationManage
    },
    {
      path: '/location/device',
      name: 'locationDevice',
      component: LocationDevice
    },
    {
      path: '/location/setting',
      name: 'locationSetting',
      component: LocationSetting
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/profession-login',
      name: 'professionLogin',
      component: ProfessionLogin
    },
    {
      path: '/auth-step-one',
      name: 'authStepOne',
      component: AuthStepOne
    },
    {
      path: '/auth-step-two',
      name: 'authStepTwo',
      component: AuthStepTwo
    },
    {
      path: '/auth-pan',
      name: 'authPan',
      component: AuthPan
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/third-platform',
      name: 'thirdPlatform',
      component: ThirdPlatform
    },
    {
      path: '/guide/user-credentials',
      name: 'userCredentials',
      component: UserCredentials
    },
    {
      path: '/role-list',
      name: 'roleList',
      component: RoleList
    },
    {
      path: '/role-add',
      name: 'roleAdd',
      component: RoleAdd
    },
    {
      path: '/scene',
      name: 'scene',
      component: Scene
    },
    {
      path: '/set-scene',
      name: 'setScene',
      component: SetScene
    },
    {
      path: '/scene/log',
      name: 'sceneLog',
      component: SceneLog
    },
    {
      path: '/guide/scene',
      name: 'sceneGuide',
      component: SceneGuide
    },
    {
      path: '/scene/effective-time',
      name: 'effectiveTime',
      component: EffectiveTime
    },
    {
      path: '/scene/condition/list',
      name: 'conditionsList',
      component: ConditionsList
    },
    {
      path: '/scene/condition/device',
      name: 'conditionsDevice',
      component: ConditionsDevice
    },
    {
      path: '/scene/condition/scene',
      name: 'conditionsScene',
      component: ConditionsScene
    },
    {
      path: '/homeKit',
      name: 'homeKit',
      component: HomeKit
    },
    {
      path: '/transfer/owner',
      name: 'transferOwner',
      component: TransferOwner
    },
    {
      path: '/protocol',
      name: 'protocol',
      component: Protocol
    },
    {
      path: '/protocol/user',
      name: 'protocolUser',
      component: ProtocolUser
    },
    {
      path: '/protocol/privacy',
      name: 'protocolPrivacy',
      component: ProtocolPrivacy
    },
    {
      path: '/department/manage',
      name: 'departmentManage',
      component: DepartmentManage
    },
    {
      path: '/department/detail',
      name: 'departmentDetail',
      component: DepartmentDetail
    },
    {
      path: '/department/setting',
      name: 'departmentSetting',
      component: DepartmentSetting
    },
    {
      path: '/experience/center',
      name: 'experienceCenter',
      component: ExperienceCenter
    },
    {
      path: '/help/out-line',
      name: 'outLineHelp',
      component: OutLineHelp
    },
    {
      path: '/help/offline-help',
      name: 'offlineHelp',
      component: OfflineHelp
    },
    {
      path: '/device/change-icon',
      name: 'changeIcon',
      component: ChangeIcon
    }
  ]
})
