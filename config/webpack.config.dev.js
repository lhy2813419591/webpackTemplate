/**
 * 开发环境配置
 */

const path = require('path')
const webpackBase = require('./webpack.config.base')
const webpackMerge = require('webpack-merge')

module.exports = webpackMerge(webpackBase, {
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 2813
  },
  hot: true, // 模块热更新
  overlay: { // 错误、警告展示设置（页面全屏显示信息，默认关闭）
    errors: true,
    warnings: true
  }
})