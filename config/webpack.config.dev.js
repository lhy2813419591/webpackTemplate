/**
 * 开发环境配置
 */

const path = require('path')
const webpackBase = require('./webpack.config.base')
const webpackMerge = require('webpack-merge')
const webpack = require('webpack')

module.exports = webpackMerge(webpackBase, {
  plugins: [
    new webpack.HotModuleReplacementPlugin() // 启用webpack热模块更新
  ],
  devServer: {
    contentBase: path.join(__dirname, '../dist'),
    compress: true,
    port: 80,
    hotOnly: true, // 模块热更新
    overlay: { // 错误、警告展示设置（页面全屏显示信息，默认关闭）
      errors: true,
      warnings: true
    }
  }
})