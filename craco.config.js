/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

const endpoint = 'http://ycrpark.iptime.org:8080/'

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // /src/**/* -> /@/**/*
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: endpoint,
        pathRewrite: { '^/api': '' }
      }
    },
  },
}
