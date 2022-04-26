import * as http from './instance'

const apiHeader = process.env.NODE_ENV === 'development' ? '/api' : '/api'
const scHeader = process.env.NODE_ENV === 'development' ? '/sc' : 'https://sc.zhitingtech.com'

/**
* 请求列子
*/
export const example = params => http.p(
  `${apiHeader}/examle`,
  params
)

/**
* 设备列表
 @param { id: String } 路径参数 家庭id
*/
export const getDeviceList = (params = {}) => http.g(
  `${apiHeader}/devices`,
  params
)

/**
* 获取设备详情
@param { id: String } 路径参数 设备id
*/
export const getDeviceDetail = (id, params = {}) => http.g(
  `${apiHeader}/devices/${id}`,
  params
)

/**
* 修改设备名称
@param { id: String } 路径参数 设备id
@param { name: String } 修改后的设备名称
*/
export const editDevice = (id, params = {}) => http.u(
  `${apiHeader}/devices/${id}`,
  params
)

/**
* 删除设备
@param { id: String } 路径参数 设备id
*/
export const deleteDevice = (id, params = {}) => http.d(
  `${apiHeader}/devices/${id}`,
  params
)

/**
* 品牌列表
@param { name:String, type:Number } 名称，类型
*/
export const getBrandList = params => http.g(
  `${apiHeader}/brands`,
  params
)

/**
* 品牌详情
@param { id: Number } 参数路径，品牌id
*/
export const getBrandDetail = (id, params = {}) => http.g(
  `${apiHeader}/brands/${id}`,
  params
)

/**
* 插件详情
@param { id: String } 参数路径，插件id
*/
export const getPluginDetail = (id, params = {}) => http.g(
  `${apiHeader}/plugins/${id}`,
  params
)

/**
* 安装/更新插件
@param { brand: String } 参数路径，品牌名称
*/
export const installPlugin = (brand, params = {}) => http.p(
  `${apiHeader}/brands/${brand}/plugins`,
  params
)

/**
* 删除插件
@param { brand: String } 参数路径，品牌名称
*/
export const deletePlugin = (brand, params = {}) => http.d(
  `${apiHeader}/brands/${brand}/plugins`,
  params
)

/**
* 获取家庭列表
*/
export const getAreaList = (params = {}) => http.g(
  `${apiHeader}/areas`,
  params
)

/**
* 获取家庭详情
@param { id: String } 路径参数 家庭id
*/
export const getAreaDetail = (id, params = {}) => http.g(
  `${apiHeader}/areas/${id}`,
  params
)

/**
* 获取家庭详情
@param { id: String } 路径参数 家庭id
*/
export const editAreaName = (id, params = {}) => http.u(
  `${apiHeader}/areas/${id}`,
  params
)

/**
* 删除家庭
@param { id: String } 路径参数 家庭id
*/
export const deleteArea = (id, params = {}) => http.d(
  `${apiHeader}/areas/${id}`,
  params
)

/**
* 获取区域详情
@param { id: String } 路径参数 区域id
*/
export const getLocationDetail = (id, params = {}) => http.g(
  `${apiHeader}/locations/${id}`,
  params
)

/**
* 编辑区域名称
@param { id: String } 路径参数 区域id
@param { name: String } 新的区域名称
*/
export const editLocationName = (id, params = {}) => http.u(
  `${apiHeader}/locations/${id}`,
  params
)

/**
* 删除家庭区域
@param { id: String } 路径参数 区域id
*/
export const deleteLocation = (id, params = {}) => http.d(
  `${apiHeader}/locations/${id}`,
  params
)

/**
 * 家庭/物业下的房间/区域列表
 @param { id: String } 路径参数 家庭id
 */
export const getLocations = (params = {}) => http.g(
  `${apiHeader}/locations`,
  params
)

/**
* 添加家庭区域
@param { id: String, name: String } 家庭id 房间名称
*/
export const addLocation = (params = {}) => http.p(
  `${apiHeader}/locations`,
  params
)

/**
* 设置房间排序
@param { id: String } 路径参数 家庭id
@param { locations_id: String[] } 房间ID列表
*/
export const editLocationSort = (params = {}) => http.u(
  `${apiHeader}/locations`,
  params
)

/**
* 登录
@param { phone: String, password: String } 账号 密码
*/
export const sessionLogin = (params = {}) => http.p(
  `${apiHeader}/sessions/login`,
  params
)

/**
* 内网登出
@param { phone: String, password: String } 账号 密码
*/
export const sessionLogout = (params = {}) => http.p(
  `${apiHeader}/sessions/logout`,
  params
)

/**
* 登录
@param { grant_type: String, refresh_token: String. account_name: String, password: String } 账号 密码
*/
export const authLogin = (params = {}) => http.p(
  `${apiHeader}/oauth/access_token`,
  params
)

/**
* 获取角色列表
@param { }
*/
export const getRoleList = (params = {}) => http.g(
  `${apiHeader}/roles`,
  params
)

/**
* 添加角色
@param { }
*/
export const addRole = (params = {}) => http.p(
  `${apiHeader}/roles`,
  params
)

/**
* 编辑角色
@param { }
*/
export const editRole = (id, params = {}) => http.u(
  `${apiHeader}/roles/${id}`,
  params
)

/**
* 获取角色详情
@param { id } 路径参数 角色id
*/
export const getRoleDetail = (id, params = {}) => http.g(
  `${apiHeader}/roles/${id}`,
  params
)

/**
* 删除角色
@param { id } 路径参数 角色id
*/
export const deleteRole = (id, params = {}) => http.d(
  `${apiHeader}/roles/${id}`,
  params
)

/**
* 获取角色模板
@param {}
*/
export const getRoleTemp = (params = {}) => http.g(
  `${apiHeader}/role_tmpl`,
  params
)

/**
* 获取角色权限
@param {}
*/
export const getRolePermission = (id, params = {}) => http.g(
  `${apiHeader}/users/${id}/permissions`,
  params
)

/**
* 获取成员列表
@param {  }
*/
export const getUser = (params = {}) => http.g(
  `${apiHeader}/users`,
  params
)

/**
* 获取成员详情
@param { id } 成员id
*/
export const getUserDetail = (id, params = {}) => http.g(
  `${apiHeader}/users/${id}`,
  params
)

/**
* 获取成员详情
@param { id } 成员id
*/
export const editUser = (id, params = {}) => http.u(
  `${apiHeader}/users/${id}`,
  params
)

/**
* 删除成员
@param { id } 成员id
*/
export const deleteMember = (id, params = {}) => http.d(
  `${apiHeader}/users/${id}`,
  params
)

/**
* 退出家庭
@param { id } 成员id
*/
export const quitArea = (areaId, userId, params = {}) => http.d(
  `${apiHeader}/areas/${areaId}/users/${userId}`,
  params
)

/**
* 编辑成员
@param { id, role_id } 成员id 角色id
*/
export const editMember = (id, roleId, params = {}) => http.u(
  `${apiHeader}/users/${id}/roles/${roleId}`,
  params
)

/**
 * 获取邀请二维码
 @param { id } 角色id
 */
export const getInvitationCode = (id, params = {}) => http.p(
  `${apiHeader}/users/${id}/invitation/code`,
  params
)

/**
 * 获取场景列表
 @param {}
 */
export const scenesList = (params = {}) => http.g(
  `${apiHeader}/scenes`,
  params
)

/**
 * 场景列表排序
 @param {}
 */
export const scenesSort = (params = {}) => http.u(
  `${apiHeader}/scenes`,
  params
)

/**
 * 创建场景
 @param {id} 场景ID
 */
export const creatScene = (params = {}) => http.p(
  `${apiHeader}/scenes`,
  params
)

/**
 * 获取场景
 @param {id} 场景ID
 */
export const getSceneDetail = (id, params = {}) => http.g(
  `${apiHeader}/scenes/${id}`,
  params
)

/**
 * 修改场景
 @param {id} 场景ID
 */
export const reviseScene = (id, params = {}) => http.u(
  `${apiHeader}/scenes/${id}`,
  params
)

/**
 * 删除场景
 @param {id} 场景ID
 */
export const deleteScene = (id, params = {}) => http.d(
  `${apiHeader}/scenes/${id}`,
  params
)

/**
 * 执行场景
 @param {id} 场景ID
 */
export const executeScene = (id, params = {}) => http.p(
  `${apiHeader}/scenes/${id}/execute`,
  params
)

/**
 * 获取日志列表
 @param {}
 */
export const logsList = (params = {}) => http.g(
  `${apiHeader}/scene_logs`,
  params
)

/**
 * 获取网盘授权列表
 @param {}
 */
export const getScopes = (params = {}) => http.g(
  `${apiHeader}/scopes`,
  params
)

/**
 * 获取scope_token接口
 @param { scopes: string[] } 权限范围列表，user，area 等，需要设置白名单
 */
export const getScopesToken = (params = {}) => http.p(
  `${apiHeader}/scopes/token`,
  params
)

/**
 * 转移拥有者
 @param { id } 新拥有者的id
 */
export const transferOwner = (id, params = {}) => http.u(
  `${apiHeader}/users/${id}/owner`,
  params
)

/**
 * 获取第三方绑定验证码
 @param {}
 */
export const verification = (params = {}) => http.p(
  `${apiHeader}/verification/code`,
  params
)


/**
* 第三方授权登录
@param { phone: String, password: String } 账号 密码
*/
export const thirdLogin = (params = {}) => http.p(
  `${scHeader}/sessions/login`,
  params
)

/**
* 第三方绑定
*/
export const thirdBind = (params = {}) => http.p(
  `${scHeader}/cloud/bind`,
  params
)

/**
* sc家庭列表
*/
export const getScAreaList = (params = {}) => http.g(
  `${scHeader}/areas`,
  params
)

/**
 * 获取找回用户凭证的配置
 @param {}
 */
export const getUserCertificate = (params = {}) => http.g(
  `${apiHeader}/setting`,
  params
)

/**
 * 设置找回用户凭证
 @param {}
 */
export const setUserCertificate = (params = {}) => http.u(
  `${apiHeader}/setting`,
  params
)

/**
 * 获取日志列表
 @param {}
 */
export const getLogList = (params = {}) => http.g(
  `${apiHeader}/log`,
  params
)

/**
 * 获取日志列表
 @param {}
 */
export const uploadLog = (params = {}) => http.u(
  `${apiHeader}/log`,
  params
)

/**
 * 创建备份
 @param {}
 */
export const createBackup = (params = {}) => http.p(
  `${apiHeader}/supervisor/backups`,
  params
)

/**
 * 获取备份列表
 @param {}
 */
export const getBackupList = (params = {}) => http.g(
  `${apiHeader}/supervisor/backups`,
  params
)

/**
 * 恢复备份
 @param {}
 */
export const recoverBackup = (params = {}) => http.p(
  `${apiHeader}/supervisor/backups/restore`,
  params
)

/**
 * 删除备份
 @param {}
 */
export const deleteBackup = (params = {}) => http.d(
  `${apiHeader}/supervisor/backups`,
  params
)

/**
 * 备份路径列表
 @param {}
 */
export const getBackupPaths = (params = {}) => http.g(
  `${apiHeader}/supervisor/backups/paths`,
  params
)

/**
 * 获取版本信息
 @param {}
 */
export const getSaVersionInfo = (params = {}) => http.g(
  `${apiHeader}/supervisor/update`,
  params
)

/**
 * 获取软件最新版本
 @param {}
 */
export const getSaLatestVersionInfo = (params = {}) => http.g(
  `${apiHeader}/supervisor/update/latest`,
  params
)

/**
 * 软件升级
 @param {}
 */
export const updateSaVersion = (params = {}) => http.p(
  `${apiHeader}/supervisor/update`,
  params
)

/**
 * 上传插件
 @param {}
 */
export const uploaderPlugins = params => http.p(
  `${apiHeader}/plugins`,
  params
)

/**
 * 创作插件列表
 @param {} // list_type: 0所有已添加插件 1开发者添加的插件（创作）
 */
export const creatPlugins = params => http.g(
  `${apiHeader}/plugins`,
  params
)

/**
 * 创作插件删除
 @param {} // list_type: 0所有已添加插件 1开发者添加的插件（创作）
 */
export const deleteCreatPlugin = (id, params = {}) => http.d(
  `${apiHeader}/plugins/${id}`,
  params
)

/**
 * 部门列表
 @param {}
 */
export const departmentsList = params => http.g(
  `${apiHeader}/departments`,
  params
)

/**
 * 设置部门排序
 @param { departments_id: String[] } 部门ID列表
 */
export const editDepartmentsSort = (params = {}) => http.u(
  `${apiHeader}/departments`,
  params
)

/**
 * 添加部门
 @param { id: String, name: String } 公司id 部门名称
 */
export const addDepartment = (params = {}) => http.p(
  `${apiHeader}/departments`,
  params
)

/**
 * 获取部门详情
 @param { id: String } 路径参数 家庭id
 */
export const departmentDetail = (id, params = {}) => http.g(
  `${apiHeader}/departments/${id}`,
  params
)

/**
 * 添加部门成员
 @param { id: String, params{users: []} } id部门id， users成员id数组
 */
export const addDepartmentMembers = (id, params = {}) => http.p(
  `${apiHeader}/departments/${id}/users`,
  params
)

/**
 * 更新部门
 @param { id: String, params{users: []} } id部门id， users成员id数组
 */
export const updateDepartment = (id, params = {}) => http.u(
  `${apiHeader}/departments/${id}`,
  params
)

/**
 * 删除部门
 @param { id: String, params{users: []} } id部门id， users成员id数组
 */
export const deleteDepartment = (id, params = {}) => http.d(
  `${apiHeader}/departments/${id}`,
  params
)

/**
 * 获取扩展列表
 @param {}
 */
export const extensions = (params = {}) => http.g(
  `${apiHeader}/extensions`,
  params
)

/**
 * 获取硬件版本信息
 @param {}
 */
export const getFirmwareVersionInfo = (params = {}) => http.g(
  `${apiHeader}/supervisor/firmware/update`,
  params
)

/**
 * 获取固件最新版本
 @param {}
 */
export const getFirmwareLatestVersionInfo = (params = {}) => http.g(
  `${apiHeader}/supervisor/firmware/update/latest`,
  params
)

/**
 * 硬件升级
 @param {}
 */
export const updateFirmwareVersion = (params = {}) => http.p(
  `${apiHeader}/supervisor/firmware/update`,
  params
)

/**
 * 设备图标
 @param { id: String, params{} } id 设备id
 */
export const deviceLogos = (id, params = {}) => http.g(
  `${apiHeader}/devices/${id}/logo`,
  params
)

/**
 * 挂载硬盘
 @param {params }
 */
export const backupsMount = params => http.p(
  `${apiHeader}/supervisor/backups/mount`,
  params
)

/**
 * 资源监控  服务列表（cpu，内存）
 @param {params }
 */
export const getResources = params => http.g(
  `${apiHeader}/resources`,
  params
)

/**
 * 重启服务
 @param { id: String, params{} } id 设备id
 */
export const reStartResources = (id, params) => http.u(
  `${apiHeader}/resources/containers/${id}`,
  params
)
