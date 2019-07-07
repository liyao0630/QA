const mysql = require('mysql')

const defaultOptions = {
  host: '127.0.0.1',
  port: 3306,
  user: '',
  password: '',
  database: '',
  connectionLimit: 20,
  connectTimeout: 10000,
  waitForConnections: true,
  charset: 'UTF8_GENERAL_CI',
  supportBigNumbers: true,
  bigNumberStrings: false,
  dateStrings: false,
  insecureAuth: true
}

function printSql(sql) {
  if (process.env.NODE_ENV === 'development') {
    console.log(sql)
  }
}
class DB {
  constructor(options) {
    this.options = {};
    this.master = false;
    if (!options) {
      throw new Error('mysql config options is missing');
    }
    this.master = !!options.master;
    this.options = Object.assign({}, defaultOptions, options);
    console.log(this.options)
    for (let k in options) {
      if (typeof this.options[k] !== 'undefined') {
        this.options[k] = options[k];
      }
    }
  }

  connect() {
    return mysql.createConnection(this.options)
  }
  getConnect() {
    return this.connect()
  }
  async query(sql) {
    printSql(sql)
    return new Promise((resolve, reject) => {
      this.getConnect().query(sql, (err, results, fields) => {
        if (err) {
          reject(err)
        }
        resolve(results)
      })
    })
  }
}

module.exports = exports = DB;