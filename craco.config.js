/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const CracoEsbuildPlugin = require('craco-esbuild')

const endpoint = 'http://ycrpark.iptime.org:8080/'

module.exports = {
  plugins: [{ plugin: CracoEsbuildPlugin }],
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // /src/**/* -> /@/**/*
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: endpoint,
        pathRewrite: { '^/api': '' },
      },
      '/photo': {
        target: endpoint,
      },
    },
  },
}
