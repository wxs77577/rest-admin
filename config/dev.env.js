'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URI: `"${process.env.API_URI || 'http://192.168.50.57:5555/admin/api/'}"`
})
