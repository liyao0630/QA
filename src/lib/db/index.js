const utils = require('../utils')
const DB = require('./db')

let db = {}
let mysqlConfig =  utils.getConfig().web.mysql

mysqlConfig.forEach(config => {
  db[config.name] = new DB(config)
});

module.exports = exports = db