const fs = require('fs')
const path = require('path')
const content_types = require('./content_types')

class Response {

  static isAssets(url) {
    return /\/assets\//.test(url)
  }

  static readAssets(response, filePath) {
    let contentType = 'html'
    let statusCode = 404
    let resulte = ''
    if (fs.existsSync(filePath)) {
      statusCode = 200
      contentType = path.extname(filePath).slice(1)
      resulte = fs.existsSync(filePath) && fs.readFileSync(filePath)
    }
    this.end(response, statusCode, contentType, resulte)
  }

  static contentType(request) {
    console.log(request.accept)
  }

  static setHeader(response, name, value) {
    response.setHeader(name, value)
  }

  static end(res, code, contentType, resulte) {
    res.writeHead(code, {
      'charset': 'utf-8',
      'Content-Type': content_types[contentType]
    });
    res.end(resulte)
  }
}

module.exports = exports = Response;
