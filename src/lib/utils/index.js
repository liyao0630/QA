const fs = require('fs')

class BusinessException {
  constructor(err, code, data) {
      this.err = err;
      this.code = code || -1;
      this.data = data;
  }
}

function assertExists(path) {
  return fs.existsSync(path)
}

function readFile(path) {
  if (assertExists(path)) {
    return fs.readFileSync(path)
  }
}

module.exports = exports = {
  BusinessException,
  assertExists,
  readFile
}