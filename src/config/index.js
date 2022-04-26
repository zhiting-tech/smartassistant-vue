export const getenvOrigin = () => {
  const isProd = process.env.VUE_APP_ORIGIN === 'prod'
  if (isProd) {
    return 'https://gz.sc.zhitingtech.com'
  }
  return 'https://scgz.zhitingtech.com'
}
export const envOrigin = getenvOrigin()
