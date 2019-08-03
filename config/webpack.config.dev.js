/**
 * 开发环境配置
 */

const path = require('path')
const webpackBase = require('./webpack.config.base')
const webpackMerge = require('webpack-merge')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //  提取css

module.exports = webpackMerge(webpackBase, {
  devServer: {
    contentBase: path.join(__dirname, '../dist'),
    compress: true,
    port: 3000,
    hotOnly: true, // 模块热更新
    overlay: { // 错误、警告展示设置（页面全屏显示信息，默认关闭）
      errors: true,
      warnings: true
    },
    liveReload: true, // 检测到文件更改时重新加载
    open: true, // 自动打开浏览器
    writeToDisk: true, // 将生成的文件写入磁盘
    watchContentBase: true// 监控编译生成的文件
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 启用webpack热模块更新
    new MiniCssExtractPlugin({// 提取出的Css的相关配置
      filename: 'public/css/[name].[hash].css' // 文件存放路径
    })
  ],
  optimization: {
    minimize: true,
    splitChunks: {// 配置提取公共代码
      chunks: 'all',
      minSize: 30000, // 配置提取块的最小大小（即不同页面之间公用代码的大小）
      minChunks: 3, // 最小共享块数，即公共代码最少的重复次数一般设为3
      automaticNameDelimiter: '.', // 生成的名称指定要使用的分隔符
      cacheGroups: {// 设置缓存组
        vendors: {
          name: 'vendors',
          test (module) {
            let path = module.resource
            return /[\\/]node_modules[\\/]/.test(path) || /[\\/]lib[\\/]/.test(path)
          },
          priority: 30
        },
        commons: {
          name: 'commons',
          test: /\.js$/,
          enforce: true,
          priority: 20
        }
      }
    },
    runtimeChunk: {
      name: 'manifest' // 打包运行文件
    }
  }
})
