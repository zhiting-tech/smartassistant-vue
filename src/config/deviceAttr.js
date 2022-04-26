import i18n from '../lang/index'

const attrMap = {
  power: 'power',
  color_temp: 'colorTemperature',
  brightness: 'brightness',
  hue: 'hue',
  saturation: 'saturation',
  rgb: 'rgb',
  temperature: 'temperature',
  humidity: 'humidity',
  detected: 'detected',
  window_door_close: 'windowDoorClose',
  leak_detected: 'leakDetected',
  target_state: 'targetState',
  powers_1: 'powers1',
  powers_2: 'powers2',
  powers_3: 'powers3',
  target_position: 'curtainState',
  state: 'state',
  style: 'style',
  direction: 'direction',
  calibration: 'calibration',
  switch_event: 'switchEvent',
  on_off: 'onOff',
  volume: 'volume',
  contact_sensor_state: 'contactSensorState',
  motion_detected: 'motionDetected',
  status_low_battery: 'statusLowBattery',
}

export const getAttr = (attr) => {
  const { deviceAttr } = i18n.messages[i18n.locale]
  const map = attrMap[attr]
  if (!map) {
    return attr
  }
  return deviceAttr[map]
}

export default {}
