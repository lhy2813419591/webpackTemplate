/**
 * 生产环境配置
 */

const webpackBase = require('./webpack.config.base') // 引入基础配置
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //  提取css
const webpackMerge = require('webpack-merge') // 引入 webpack-merge 插件
const CleanWebpackPlugin = require('clean-webpack-plugin') // 清理dist文件夹

// 合并配置文件
module.exports = webpackMerge(webpackBase, {
  plugins: [
    new MiniCssExtractPlugin({// 提取出的Css的相关配置
      filename: 'public/css/[name].[hash].css', // 文件存放路径
      chunkFilename: 'public/css/[id].[hash].css'// 公共代码块存放路径
    }),
    new CleanWebpackPlugin(['dist'], {// 自动清理 dist 文件夹
      root: path.resolve(__dirname, '../'), // 根目录
      verbose: true, // 开启在控制台输出信息
      dry: false // 启用删除文件
    })
  ],
  optimization: {
    minimize: true,
    splitChunks: {// 配置提取公共代码
      chunks: 'async', // 提取文件的范围 这里设为只在异步加载的文件中提取
      minSize: 30000, // 配置提取块的最小大小（即不同页面之间公用代码的大小）
      minChunks: 3, // 最小共享块数，即公共代码最少的重复次数一般设为3
      maxAsyncRequests: 5, // 按需加载时，并行请求的最大数量
      maxInitialRequests: 5, // 入口的最大并行请求数 最好根据chunks来设置
      automaticNameDelimiter: '~', // 生成的名称指定要使用的分隔符
      name: true,
      cacheGroups: {// 设置缓存组
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
          chunks: 'all'
        },
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true // 如果当前块已被主代码块包含是否重用
        },
        styles: {
          minChunks: 2,
          name: 'styles',
          test: /\.css$/,
          chunks: 'all'
        }
      }
    },
    runtimeChunk: {
      name: 'manifest' // 打包运行文件
    }
  }
})
