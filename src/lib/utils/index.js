const fs = require('fs')

module.exports = exports = {
  assertExists(path) {
    return fs.existsSync(path)
  },
  readFileSync(path) {
    return fs.readFileSync(path)
  },
  readFile(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
}