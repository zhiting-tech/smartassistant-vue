export const global = {
  home: 'home',
  scene: 'scene',
  mine: 'mine',
  loading: 'loading',
  all: 'all',
  save: 'save',
  saving: 'Saving...',
  enter: 'please enter ',
  saveSuccess: 'saved successfully',
  editSuccess: 'edit successfully',
  delSuccess: 'successfully deleted',
  traSuccess: 'Successfully transferred',
  addSuccess: 'Successfully added',
  delSuccessChecked: 'The family has been deleted, and the files stored in the Zhiting Cloud Disk have been deleted at the same time',
  isDelChecked: 'At the same time delete files stored in Zhiting Cloud Disk',
  add: 'add',
  recover: 'recover',
  recovering: 'resuming...',
  del: 'delete',
  update: 'update',
  opFail: 'operation failed',
  finish: 'finish',
  filter: 'filter',
  confirm: 'confirm',
  cancel: 'cancel',
  weak: 'no network yet',
  retry: 'retry',
  netWorkErr: 'network error',
  noPermission: 'permission denied',
  empty: 'no content',
  reset: 'reset',
  off: 'Off',
  on: 'On',
  linkFail: 'SA connection failed or no permission',
  reconnect: 'Reconnect',
  year: 'Year',
  month: 'Month',
  day: 'Day',
  hour: 'Hour',
  minute: 'Minute',
  second: 'Second',
  now: 'Now',
  timing: 'Timing',
  tra: 'Transfer owner',
  loadingVerify: 'Crating verify...',
  powerName: 'Switch',
  colorTempName: 'Color temperature',
  brightnessName: 'Brightness',
  uploaderSuccess: 'Uploaded successfully',
  normal: 'normal',
  warn: 'warn',
  error: 'error',
  other: 'other',
  trace: 'trace',
  debug: 'debug',
  fatal: 'fatal',
  panic: 'panic',
  noMore: 'no more',
  updateSuccess: 'update completed',
  updateFail: 'update failed',
  deleting: 'deleting...',
  quit: 'quit',
  departmentPlaceholder: 'Please select a department',
  rolePlaceholder: 'Please select a role',
  remark: 'remark',
  fail: 'fail'
}

export const home = {
  btn: 'add smart device',
  empty: 'You don`t have equipment',
  offline: 'offline'
}

export const owner = {
  position: 'family/company',
  pan: 'Zhiting Cloud Disk',
  support: 'support brand',
  platform: 'third-party platform',
  lang: 'language',
  sheetTitle: 'Switch language',
  zh: 'chinese',
  en: 'english',
  powerTitle: 'advanced settings',
  certificate: 'user credentials',
  certificateTip: 'the user credential is the key to access the smart center. Please select whether to allow members to retrieve the credential through the cloud.',
  certificateAppTitle: 'zhiting Family Cloud Certificate',
  certificateAppTip: 'issued to clients when members join the family',
  certificateTitle1: 'allow to retrieve',
  certificateDesc1: 'members can retrieve their credentials on any client to connect to the smart center',
  certificateTitle2: 'not allowed to retrieve',
  certificateDesc2: 'members can connect to the smart center on a client with credentials, but cannot connect again after uninstalling the APP',
  certificatePanAppTitle: 'zhiting Cloud Disk Certificate',
  certificatePanAppTip: 'issued to the client when the member is authorized to log in or log in to the cloud account',
  panCertificateTitle1: 'allow access',
  panCertificateDesc1: 'members can log in to the cloud account to obtain credentials to connect to the smart center',
  panCertificateTitle2: 'not allowed',
  panCertificateDesc2: 'members cannot log in to the cloud account to obtain credentials to connect to the smart center, and can only obtain credentials through authorized login',
  certificateSetTip: 'you can go to the Professional Edition-Home-Smart Center to modify the selected items',
  log: 'log',
  backup: 'data backup',
  logSync: 'sync logs to the cloud',
  logSyncDesc: 'after opening, the log will be automatically uploaded to Zhiting cloud, and provided to Zhiting for diagnosis problems, etc',
  logging: 'logging',
  logUpload: 'upload log',
  logUploading: 'uploading',
  logUploadTime: 'upload time',
  logUploadSuccess: 'uploaded successfully',
  logUploadFail: 'upload failed',
  logDateFilter: 'date filter',
  logAllDate: 'all dates',
  logUploadConfirmTip: 'are you sure to upload the log to Zhiting Cloud?',
  backupRecord: 'backup record',
  backupBtn: 'backup',
  backupConfirmSecTitle: 'restore the backup data to replace the current data, are you sure you want to continue?',
  backupConfirmContent: '* recovery takes a certain time, and the smart center will be suspended during the recovery process, and it can be used normally after the recovery is over',
  backupDelSecTitle: 'the backup data cannot be retrieved after deletion. Are you sure you want to continue?',
  backupMarkTip: '* the smart center will be temporarily suspended during the backup process, and it can be used normally after the backup is over',
  backupMarkPlaceholder: 'please enter remarks',
  backupStart: 'start backup',
  backupMarkSecTitle: 'are you sure you want to back up the current data?',
  backupMarkContent: '* recovery takes a certain time, and the smart center will be suspended during the recovery process, and it can be used normally after the recovery is over',
  backingUp: 'backing up',
  backupNeedTime: 'this may take a few minutes to a few hours',
  backupTime: 'backup time:',
  backupSuccess: 'successful backup',
  backupFail: 'Backup failed',
  backupDate: 'data date and time',
  backupFailReason: 'reason for failure',
  recoverSuccess: 'successful recovery',
  recoverFail: 'recovery failed',
  protocol: 'User Agreement and Privacy Policy',
  experience: 'Experience center',
  customerManagement: 'Customer Management',
  scmManagement: 'Supply Chain Management',
  remoteHelp: 'Remote Assistance',
  remoteHelpTips: 'After it is turned on, Zhiting technicians can remotely control your smart center for diagnosis and repair. Are you sure to turn it on?',
  onRemoteHelp: 'Remote Assistance is on',
  offRemoteHelp: 'Remote Assistance is off',
  selectFileRecovery: 'Select file recovery',
  scheduleBackup: 'Schedule a backup',
  backupLocation: 'Backup location',
  backupData: 'Backup data',
  allData: 'All data',
  internalStorage: 'internal storage',
  smartCenterData: 'Smart Center data',
  wangpanData: 'Wangpan data',
  crmData: 'Customer management data',
  scmData: 'Supply Chain Management Data',
}

export const discover = {
  title: 'Add device',
  scan: 'Scanning',
  tip1: '1.Please make sure that the device is connected to the power source and connected to the local area network;',
  tip2: '2.When adding a brand for the first time, please enter [I-Support Brand] to add the brand;',
  add: 'Add',
  empty: 'Device not found',
  retry: 'Rescan'
}

export const connect = {
  title: 'Device connection',
  connect: 'Device connecting',
  success: 'connection succeeded!',
  fail: 'Connection failed!',
  retry: 'retry'
}

export const areaDetail = {
  title: 'Family/Company',
  name: 'name',
  area: 'room',
  code: 'qr code',
  department: 'department',
  verify: 'Verification Code',
  role: 'roles',
  quitFamily: 'Leave the family',
  member: 'member',
  man: 'people',
  sheetTitle: 'Family/Company Name',
  quitTitle: 'Are you sure to leave the family?',
  quitContent: 'After logging out, you can’t view and control the family’s room equipment',
  delTitle: 'confirm to delete?',
  delContent: 'After deleting, all devices under the family/company will be automatically unbound',
  roleTitle: 'Choose a role',
  roleTip1: 'Invitation code',
  roleTip2: 'Select a role and generate an invitation code to invite friends to join. The invitation code is valid within 10 minutes',
  roleTip3: 'Select a department and role and generate an invitation code to invite employees to join. The invitation code is valid within 10 minutes',
  invite: 'Generate invitation code',
  empty: 'please enter the family name',
  inviteTip: 'the invitation code has been generated, please invite friends to join',
  timeTip: 'valid within 10 minutes, please scan the code to join',
  saveTip: 'save to album',
  tapTip: 'long press to save to album',
  joinTip: 'invite you to join',
  creat: 'Creat',
  effective: 'The valid time of captcha is 10 minutes',
  disband: 'Dissolve the company',
  quitCompany: 'Leave the company',
  tips: 'Hint',
  deleteArea: 'It takes a certain amount of time to delete data and cloud disk files, and it has been running in the background for you. Please go to the home page of the APP to switch home/company to check the deletion status.'
}

export const locationManage = {
  title: 'Room',
  edit: 'edit',
  finish: 'finish',
  empty: 'No room available',
  add: 'add room',
  sheetTitle: 'Room name',
  emptyTip: 'please enter the room name',
  repeatTip: 'duplicate room name'
}

export const locationDevice = {
  title: 'Room detail ',
  del: 'delete',
  name: 'name',
  tip: 'room device',
  sheetTitle: 'Room name',
  delTitle: 'Are you sure to delete this room?',
  delContent: 'deleting a room will not delete the equipment in the room',
  emptyTip: 'please enter the room name'
}

export const locationsetting = {
  title: 'Setting',
  add: 'add room',
  tip1: 'device name',
  placeholder: 'please enter the device name',
  tip2: 'device location',
  finish: 'finish',
  sheetTitle: 'Room',
  emptyTip: 'please enter the room name',
  repeatTip: 'duplicate room name',
  deviceEmpty: 'please enter the device name',
  success: 'successfully modified'
}

export const login = {
  login: 'login',
  logoTip: 'zhiting account login',
  authTip: 'after logging in, you will access your Zhiting account information',
  phone: 'phone number',
  phonePlaceHolder: 'please enter phone number',
  password: 'password',
  passwordPlaceHolder: 'please enter the password',
  auth: 'authorized login',
  phoneEmptyTip: 'please enter phone number',
  phoneErr: 'incorrect phone number',
  passwordEmptyTip: 'please enter the password',
  register: 'register',
  forget: 'forgot password',
  protocol: 'Please read and tick the agreement',
  profession: 'professional Edition',
  account: 'username',
  accountPlaceholder: 'please enter user name',
  success: 'login successful',
  authStep1: 'account login',
  authStep2: 'bind',
  authTip2: 'after binding, you will access the device control of your Zhiting account',
  authBindArea: 'bound family',
  authBindPlaceholder: 'please select the family to be bound',
  authVerify: 'verification code',
  authVerifyPlaceholder: 'please enter verification code',
  authTip3: 'the verification code is generated by the family owner to the Zhiting Family Cloud APP-My-Family/Company-Corresponding Family',
  authBind: 'bind',
  authBinded: '(has been bound)',
  welcome: 'welcome to join Zhiting pan',
  agree1_1: 'agree to authorize the following information of Zhiting Home (',
  agree1_2: ') to Zhiting pan',
  panAuth: 'confirm authorization',
  checkedText: 'Read and agree to Zhiting Family Cloud',
  agreementUser: 'User Agreement',
  agreementPrivacy: 'Privacy Policy'
}

export const branddetail = {
  title: 'Brand details',
  added: 'added',
  updateAll: 'update all',
  addAll: 'add all',
  version: 'version number:',
  supportTip: 'devices supported by the brand',
  delContent1: 'Are you sure to delete this plugin?',
  delContent2: 'cannot be used after deletion'
}

export const brandsupport = {
  title: 'Support brand',
  addPlugin: 'add plugin',
  searchPlaceholder: 'enter the brand name to search',
  searchTip: 'The following brands of equipment can be added. If you need to add other brands, you can click the search icon in the upper right corner to add; if the system does not have a corresponding brand plug-in, you can switch to the manual upload plug-in in [Creation]',
  sheetName: 'title',
  uploadTitle: 'click upload plugin',
  uploadContent: 'If the system does not have the plug-in, you can upload it manually',
  sure: 'determine',
  added: 'added',
  total: 'total',
  plugin: 'plugin',
  acceptZip: 'Please upload the compressed package in zip format',
  addFail: 'add failed'
}

export const devicedetail = {
  title: 'Device details',
  update: 'Firmware update',
  power: 'advanced settings',
  softwareUpgrade: 'software upgrade',
  currentVersion: 'current version',
  checkVersion: 'check for upgrade',
  latestVersion: 'currently the latest version',
  checkNewVersion: 'check that there is a new version',
  isUpdate: 'whether to upgrade'
}

export const deviceManage = {
  name: 'device name',
  position: 'device location',
  plugin: 'associated plugin',
  del: 'delete device',
  delTitle: 'are you sure you want to delete the device',
  empty: 'please enter the device name',
  modify: 'successfully modified',
  changeIcon: 'Change icon'
}

export const membermanage = {
  title: 'Member information',
  role: 'roles',
  sheetTitle: 'Choose a role',
  sheetTitle2: 'Choose a department',
  delTitle: 'are you sure to delete this member?',
  modify: 'successfully modified',
  department: 'department',
  undivided: 'undivided'
}

export const plugindetail = {
  title: 'Plugin details',
  version: 'version number:',
  support: 'devices supported by the brand'
}

export const register = {
  title: 'registered',
  phone: 'phone number',
  phonePlaceHolder: 'please enter phone number',
  password: 'password',
  passwordPlaceHolder: 'please enter a password (6-20 digits, including letters and numbers)',
  verifyCode: 'verification code',
  verifyCodePlaceHolder: 'please enter verification code',
  getVerifyCode: 'get code',
  cutdoown: 'Re-acquire in seconds',
  tipTitle: 'The number is already registered, do you want to log in?',
  login: 'login',
  phoneError: 'please enter 11 digits mobile phone number',
  passwordEmpty: 'please enter the password',
  passwordError: 'password must meet 6-20 digits',
  success: 'authentication is successful'
}

export const roleAdd = {
  addTitle: 'Add role',
  editTitle: 'Edit role',
  placeholder: 'please enter the role name',
  label: 'this role can operate:',
  device: 'device',
  advance: 'advanced settings',
  family: 'family',
  company: 'company',
  selectAll: 'select all',
  room: 'room',
  department: 'department',
  role: 'roles',
  scene: 'scene',
  delTitle: 'confirm to delete?',
  delContent: 'after deleting this role, users of this role will be automatically removed from the family',
  roleEerror: 'please check permissions',
  advanceTitle: 'Control/editing device'
}

export const addlist = {
  title: 'Role list'
}

export const third = {
  title: 'Third-party platform',
  du: 'xiaodu',
  tm: 'tmall elf',
  duTitle: 'Connect to Baidu Xiaodu',
  duconnect: 'after connection, the smart device can be controlled through the voice of Xiaodu smart speaker. For example: "Xiaodu Xiaodu, turn on the light"',
  duStep1: '1. complete the product networking configuration in the Zhiting APP',
  duexplain1: 'complete the device networking configuration according to the guidance in the APP',
  duStep2: '2. The configuration is xiaodu',
  duexplain2: '(if you have already configured Xiaodu, you can skip this step)',
  duexplain3: '① download and install the Xiaodu Speaker APP.',
  duexplain4: '② register or log in to your Baidu account and pair your Xiaodu speakers.',
  duStep3: '3. bind Zhiting account',
  duexplain5: '① click "My" in the navigation bar at the bottom of the homepage of Xiaodu Speaker APP >> "Add Smart Home Appliances" >> search for "Zhiting"',
  duexplain6: '② click login account, enter Zhiting account and password to complete binding',
  duexplain7: '③ after the binding is successful, the Xiaodu Speaker APP will automatically synchronize your device on the Zhiting platform.',
  duStep4: 'how to use a small degree to influence the voice control of Zhiting equipment',
  duexplain8: '1. modify the device name, group, and connection type on the Xiaodu APP',
  duexplain9: 'make sure to use Chinese to describe the device name, special characters and Martian text are not allowed.',
  duexplain10: 'examples of correct equipment naming: living room lights, hallway sockets, bedroom switches...',
  duexplain11: '2. use Xiaodu speakers to control the device with voice',
  duexplain12: 'use the wake-up word "Xiaodu Xiaodu" to wake up the Xiaodu speaker. At this time, you can see the blue logo aperture on the speaker, and then say the voice command of "open/close + device name";',
  duexplain13: 'for example: "Xiaodu Xiaodu, turn on the living room light"'
}

export const user = {
  title: 'Personal information',
  picture: 'avatar',
  nickname: 'nickname',
  empty: 'please enter a nickname',
  lessErr: 'nickname cannot be less than 6 digits',
  moreErr: 'nickname cannot be greater than 20 digits'
}

export const scene = {
  manual: 'Manual',
  automatic: 'Automatic',
  operation: 'Execute',
  noScene: 'No scene',
  addScene: 'Click Add scene',
  howCreatTitle: 'How to create a scene',
  howCreatCon: 'Let\'s get started with smart scenes',
  deleted: 'Deleted',
  offLine: 'Off-line',
  effictiveTimeTitle: 'Effective time',
  conditionTitle: 'When the equipment changes'
}

export const creatScene = {
  title: 'Creating scenes',
  title2: 'Modify the scene',
  finish: 'Finish',
  placeholder: 'Scene name',
  addCondition: 'Add trigger condition',
  addTask: 'Add execution task',
  headerTitle1: 'If',
  headerTitle2: 'Just do it',
  conditionTitle: 'Add trigger condition',
  conditionItemTitle1: 'Manual execution',
  conditionItemCon1: 'Click to execute',
  conditionItemTitle2: 'Timing',
  conditionItemCon2: 'For example, 8:00 every day',
  conditionItemTitle3: 'When the equipment status changes',
  conditionItemCon3: 'For example, when you turn on the light, when you feel a person',
  taskTitle: 'Add execution task',
  taskItemTitle1: 'Smart devices',
  taskItemCon1: 'Such as lights, music',
  taskItemTitle2: 'Control scene',
  taskItemCon2: 'Such as opening the scene of summer party',
  relationTitle: 'Please select a multi conditional relationship',
  relationItemTitle1: 'All conditions are met',
  relationItemTitle2: 'Satisfy any condition',
  controlTitle: 'Control scene',
  controlItemTitle1: 'Execute a scene',
  controlItemTitle2: 'Turn on automatic execution',
  controlItemTitle3: 'Turn off automatic execution',
  manualClick: 'Click execute manually',
  delTip: 'whether to delete the scene',
  allDay: 'all day',
  quitTip: 'modifications will be lost after exit, whether to exit',
  crrayOut: 'carried out',
  modifySuccess: 'successfully modified',
  addSuccess: 'created successfully',
  deviceDel: 'device has been deleted',
  sceneDel: 'scene has been deleted',
  noSceneName: 'The scene name has not been set yet',
  noAddCondition: 'Trigger condition not added',
  noAddTask: 'Execution task not added'
}

export const sceneLog = {
  title: 'Execution log',
  empty: 'No logs',
  deviceDelete: 'Device removed',
  deviceBroken: 'Device offline',
  sceneDelete: 'Scene deleted',
  executeTimeout: 'Execution timeout',
  executeSuccess: 'Successful implementation',
  executePartialSuccess: 'Partial execution successful'
}

export const sceneGuide = {
  title: 'How to create a scene',
  stepTitle1: 'Create step',
  step1: '1.Add device',
  explain1: 'Before creating a smart scene, make sure your home has added devices',
  step2: '2.Create scene',
  explain2: '① Click "Scene" in the navigation bar below zhiting app → click "+" to enter the scene arrangement',
  explain3: '② Fill in the scene name. For example: going to the cinema',
  explain4: '③ Click "add trigger condition", select trigger type and set trigger condition. For example: "when the equipment status changes" → "bedroom lamp" → "switch on" → "next", the triggering conditions are added',
  explain5: '④ Click "add execution task", select task type and set execution event. For example: "smart device" → "bedroom lamp" → "Brightness" → "next step", complete the task of adding',
  explain6: '⑤ Click finish in the upper right corner to complete the scene creation',
  stepTitle2: 'How to play smart scenes',
  patternTitle1: 'Wake up mode',
  explain7: 'The curtain will be opened automatically, the smart speaker will play wake-up music, the toaster will be turned on, and the rice cooker will be turned on.',
  patternTitle2: 'Office mode',
  explain8: 'Personalized access control system and automatic adjustment of lighting atmosphere and other intelligent functions create a unique office environment for employees.',
  create: 'o create the scene'
}

export const credentialsGuide = {
  title: 'how to set up to retrieve user credentials',
  tip: '"The current terminal has no credential" is because you have changed your mobile phone/tablet to log in or uninstalled the APP to verify the credential for the safety of your family information. Family owners can use the following path to set up and retrieve user credentials:',
  stepTitle1: '1. Log in to the professional version to enter the details of the smart center',
  stepTitle2: '2. Select Authority Management-Retrieve User Credentials',
  stepTitle3: '3. Change selection and save'
}

export const effectiveTime = {
  allDay: 'all day',
  period: 'period',
  start: 'start',
  end: 'start',
  repeat: 'repeat',
  everyDay: 'every day',
  week: 'monday to friday',
  customize: 'customize',
  monday: 'monday',
  tuesday: 'tuesday',
  wednesday: 'wednesday',
  thursday: 'thursday',
  friday: 'friday',
  saturday: 'saturday',
  sunday: 'sunday',
  hour: 'H',
  minute: 'M',
  second: 'S',
  timeErr: 'the start time cannot be greater than the end time'
}

export const condition = {
  switch: 'switch',
  brightness: 'brightness',
  colorTemperature: 'color temperature',
  hue: 'hue',
  saturation: 'saturation',
  rgb: 'rgb',
  delay: 'delay',
  turnOn: 'turn on',
  shutDown: 'shut down',
  change: 'switch',
  less: 'less than',
  equal: 'equal',
  more: 'more than',
  next: 'next step',
  leftButton: 'left button',
  middleButton: 'middle button',
  rightButton: 'right button',
  rear: 'rear',
  curtainTitle: 'curtain state',
  curtainState: 'open state',
  curtainOpen: 'open the curtains',
  curtainClose: 'close the curtains',
  curtianPercent: 'percentage of curtains opened',
  temperature: 'temperature',
  humidity: 'humidity',
  isDetected: 'motion is detected',
  offToOn: 'off to on',
  onToOff: 'on to off',
  isLeakDetected: 'flooding detected',
  color: 'color',
  firstSwitchOn: 'One-click open',
  firstSwitchOff: 'One-click close',
  secondSwitchOn: 'Two-click open',
  secondSwitchOff: 'Two-click close',
  thirdSwitchOn: 'Three-click open',
  thirdSwitchOff: 'Three-click close',
  guard: 'Guard',
  openAtHome: 'Turn on at home mode',
  openLeaveHome: 'Turn on away from home mode',
  openSleep: 'Turn on sleep mode',
  closeGuard: 'Turn off daemon mode',
  singlePress: 'Single press',
  doublePress: 'Double press',
  longPress: 'Long press',
  state: 'State',
}

export const transferOwner = {
  title: 'Transfer owner',
  tips: 'The family owner has the highest authority of the family and can delete the family. You can transfer the role to the member. After the transfer, your role will be changed to manager.',
  headerText: 'Select a member to transfer the owner role to him：'
}

export const deviceAttr = {
  power: 'Power',
  colorTemperature: 'Color temperature',
  brightness: 'Brightness',
  hue: 'Hue',
  saturation: 'Saturation',
  lantern: 'Lantern',
  temperature: 'Temperature',
  humidity: 'Humidity',
  detected: 'State',
  windowDoorClose: 'State',
  leakDetected: 'State',
  targetState: 'Guard',
  powers1: 'One Key',
  powers2: 'Two keys',
  powers3: 'Three keys',
  curtainState: 'Curtain state',
  state: 'State',
  style: 'Style',
  direction: 'Direction',
  calibration: 'Calibration',
  switchEvent: 'Power',
  onOff: 'On off',
  volume: 'Volume',
  contactSensorState: 'State',
  motionDetected: 'State',
  statusLowBattery: 'Low battery state'
}

export const protocol = {
  title: 'User Agreement and Privacy Policy',
  privacyPolicy: 'Privacy Policy',
  userAgreement: 'User Agreement',
  agreementTitle: 'User Agreement',
  privacyTitle: 'Privacy Policy'
}

export const departmentManage = {
  title: 'Department',
  edit: 'Edit',
  finish: 'Finish',
  empty: 'No department',
  add: 'Add department',
  sheetTitle: 'Department name',
  emptyTip: 'Please enter the department name',
  repeatTip: 'Duplicate department name',
  man: 'people'
}

export const departmentDetail = {
  title: 'Department',
  empty: 'No members',
  add: 'Add member',
  member: 'members',
  man: 'man',
  set: 'Department setting',
  emptyTip: 'Please enter the department name',
}

export const departmentSetting = {
  title: 'Department setting',
  deleteDepartment: 'Delete department',
  departmentName: 'Department name',
  departmentHead: 'Department Head',
  nameEmpty: 'Please set the department name',
  quitTip: 'The information is not saved, do you want to exit?',
  delTitle: 'Are you sure to delete this department?',
  delContent: 'Deleting the department will not delete the members!'
}

export const experienceCenter = {
  title: 'Experience Center'
}
