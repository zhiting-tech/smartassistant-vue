const path = require('path')

const resolve = dir => path.join(__dirname, dir)
// 远程代理Ip
const baseUrl = 'http://192.168.22.247:9020'
// const baseUrl = 'http://192.168.22.151:37965'
// 输出文件夹 智能输出为dist 插件输出为yeelight
const outputDir = process.env.PLUGIN_NAME ? `./plugin/${process.env.PLUGIN_NAME}` : 'dist'

// const vConsole = require('vconsole-webpack-plugin')

module.exports = {
  publicPath: './',
  outputDir,
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    disableHostCheck: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
      '/api': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api' // 本地加api
        }
      },
      '/sc': {
        target: 'http://192.168.22.123:9097',
        changeOrigin: true,
        pathRewrite: {
          '^/sc': '/'
        }
      }
    },
  },
  css: {
    loaderOptions: {
      // 默认情况下 `sass` 选项会同时对 `sass` 和 `scss` 语法同时生效
      // 因为 `scss` 语法在内部也是由 sass-loader 处理的
      // 但是在配置 `data` 选项的时候
      // `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
      // 在这种情况下，我们可以使用 `scss` 选项，对 `scss` 语法进行单独配置
      scss: {
        prependData: '@import "src/styles/var.scss";'
      }
    }
  },
  configureWebpack: (config) => {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    config.plugins.push(
      // 手机端调试
      // eslint-disable-next-line new-cap
      // new vConsole({
      //   filter: [], // 需要过滤的入口文件
      //   enable: process.env.NODE_ENV !== 'production'// 生产环境不打开
      // })
    )
    Object.assign(config, {
      // 开发生产共同配置
      resolve: {
        alias: {
          '@': resolve('src')
        }
      }
    })
  },
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        const plugin = process.env.PLUGIN_NAME
        if (plugin) {
          args[0].template = `plugins/${plugin}/index.html`
        }
        return args
      })
  }
}
