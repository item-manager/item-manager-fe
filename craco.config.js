/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

const endpoint = '라즈베리파이주소?'

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // /src/**/* -> /@/**/*
    },
  },
  devServer: {
    proxy: {
      '/api': endpoint,
    },
  },
}
