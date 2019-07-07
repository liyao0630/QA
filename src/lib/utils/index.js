const fs = require('fs')
const path = require('path')
const YAML = require('yaml')
module.exports = exports = {
  isDevelopment() {
    return process.env.NODE_ENV === 'development'
  },
  getConfig() {
    let dev = this.isDevelopment() ? 'dev/' : ''
    let configPath = '../../config/' + dev + 'application.yml'
    let configStr = fs.readFileSync(path.resolve(__dirname, configPath), 'utf-8')
    return YAML.parse(configStr)
  }
}