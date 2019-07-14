const fs = require('fs')
const path = require('path')
const content_types = require('./content_types')

class Response {

  static readAssets(response, filePath) {
    let contentType = 'html'
    let statusCode = 404
    let resulte = ''
    if (fs.existsSync(filePath)) {
      statusCode = 200
      contentType = path.extname(filePath).slice(1)
      resulte = fs.existsSync(filePath) && fs.readFileSync(filePath)
    }
    this.end(response, resulte, contentType, statusCode)
  }

  static end(response, resulte, contentType = 'html', statusCode = 200) {
    response.writeHead(statusCode, {
      'charset': 'utf-8',
      'Content-Type': content_types[contentType]
    });
    response.end(resulte)
  }
}

module.exports = exports = Response;
