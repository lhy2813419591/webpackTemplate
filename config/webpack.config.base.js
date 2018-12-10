/**
 * webpack 基础配置
 */
const webpack = require('webpack')

const path = require('path')

const fs = require('fs')

const Entries = {} // 保存文件入口
const pages = []// 存放html-webpack-plugin实例
const env = process.env.NODE_ENV !== 'prod' // 判断运行环境
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 引入mini-css-extract-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');

//  获取html-webpack-plugin实例集合
(function () {
  let pagePath = path.join(__dirname, '../src/page')// 定义存放html页面的文件夹路径
  let paths = fs.readdirSync(pagePath) // 获取pagePath路径下的所有文件
  paths.forEach(page => {
    page = page.split('.')[0]// 获取文件名（不带后缀）
    pages.push(new HtmlWebpackPlugin({
      filename: `views/${page}.html`, // 生成的html文件的路径（基于出口配置里的path）
      template: path.resolve(__dirname, `../src/page/${page}.html`), // 参考的html模板文件
      chunks: [page, 'commons', 'vendors', 'styles', 'manifest'], // 配置生成的html引入的公共代码块 引入顺序从右至左
      favicon: path.resolve(__dirname, '../src/img/favicon.ico'), // 配置每个html页面的favicon
      minify: {// 配置生成的html文件的压缩配置
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        conservativeCollapse: true,
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        trimCustomFragments: true
      }
    }))
    Entries[page] = path.resolve(__dirname, `../src/js/${page}.js`)// 入口js文件
  })
})()

module.exports = {
  // 配置入口文件
  entry: Entries,
  // 启用 sourceMap
  devtool: 'cheap-module-source-map',
  // 配置文件出口
  output: {
    // 将打包好的js输出到public（静态资源目录）下的js文件夹中
    filename: 'public/js/[name].bundle.[hash].js',
    path: path.resolve(__dirname, '../dist')// 输出目录，所有文件的输出路径都基于此路径之上(需要绝对路径)
  },
  // 省略文件后缀
  resolve: {
    extensions: ['.js'] // 配置过后，书写该类文件路径的时候可以省略文件后缀
  },
  // loader
  module: {
    rules: [
      // 使用expose处理JQuery（JQ使用npm安装）配置了这一条后就不要使用external（主要用于cdn引入）
      {
        test: require.resolve('jquery'), // 此loader配置项的目标是NPM中的jquery
        loader: 'expose-loader?$!expose-loader?jQuery' // 先把jQuery对象声明成为全局变量`jQuery`，再通过管道进一步又声明成为全局变量`$`
      },
      // 处理html
      {
        test: /\.html$/,
        use: [{
          loader: 'html-withimg-loader' // 处理img标签中的图片
        }]
      },
      // 处理样式表
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          env ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(less)$/,
        use: [
          env ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      // 使用babel处理js文件
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: 'babel-loader'
      },
      // 处理图片
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000, // 设置图像大小超过多少转存为单独图片
            name: 'public/img/[name].[hash].[ext]' // 转存的图片目录
          }
        }]
      },
      // 处理字体
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['url-loader']
      }
    ]
  },
  // 配置插件
  plugins: [
    // 分离tml-webpack-plugin实例数组、引入jq
    ...pages, new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.$': 'jquery',
      'window.jQuery': 'jquery'
    })
  ]
}
