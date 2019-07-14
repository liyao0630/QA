const querystring = require('querystring')

class Request {

  static bodyParse(req) {
    return new Promise((resolve, reject) => {
      try {
        let body = ''
        req.on('data', (chunk) => {
          body += chunk
        })
        req.on('end', async () => {
          resolve(querystring.parse(body))
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.exports = exports = Request;