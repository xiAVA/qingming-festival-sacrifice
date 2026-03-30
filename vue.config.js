const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    // 配置 Source Map，让断点调试生效
  configureWebpack: {
    devtool: 'source-map'
  },
  transpileDependencies: true,
//  server: {
//     host: '0.0.0.0',  // 允许局域网访问
//     strictPort: false  // 端口被占用时自动尝试下一个
//   },
  //改端口号
  devServer: {
    port: 7070,
    host: '0.0.0.0',  // 允许局域网访问
   proxy: {
    '/api': {
      target: 'http://localhost:8080',
      pathRewrite: {
        '^/api': '',
      },
    },
  },
  },

})
