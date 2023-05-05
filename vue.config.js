'use strict'

const port = process.env.port || process.env.npm_config_port || 9528 // dev port
let timeStamp = new Date().getTime();
// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: `http://127.0.0.1:8000`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      },
    }
  },
  configureWebpack: {    //重点
    output: { // 输出重构 打包编译后的js文件名称,添加时间戳.
      filename: `js/js[name].${timeStamp}.js`,
      chunkFilename: `js/chunk.[id].${timeStamp}.js`,
    }
  },
}
