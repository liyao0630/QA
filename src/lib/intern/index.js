const http = require('http')
const path = require('path')
const fs = require('fs')
const querystring = require('querystring');
const MimeType = require('../utils/mimeType')
const Template = require('../template')
const response = require('../response')
const template = new Template()
const mimeType = new MimeType()
console.log(response.isAssets)
class Intern {

  constructor(options) {
    let defaultOptions = {
      prot: 9530,
      host: 'localhost',
      templatePath: path.resolve(__dirname, '../../view/template/'),
      assetsPath: path.resolve(__dirname, '../../../'),
      CDN: '',
      commonTitle: '-intern'
    }
    this.options = Object.assign({}, defaultOptions, options)
    this.layoutTemplate = fs.readFileSync(path.resolve(__dirname, '../../view/template/layout.html'), 'utf-8')
    this.getRouter = new Map()
    this.postRouter = new Map()
  }

  get(router, callback) {
    this.getRouter.set(router, callback)
  }

  post(router, callback) {
    this.postRouter.set(router, callback)
  }

  response(res, code, contentType, resulte) {
    console.log(resulte)
    res.writeHead(code, {
      'charset': 'utf-8',
      'Content-Type': mimeType.getMime(contentType)
    });
    res.end(resulte)
  }

  server() {
    http.createServer((req, res) => {
      try {
        let currentUrl = req.url
        let method = req.method
        let contentType = ''
        let resulte = ''
        let statusCode = 200
        if (method === 'GET') {

          if (response.isAssets(currentUrl)) {
            return response.readAssets(res, this.options.assetsPath + currentUrl)
          }

          if (this.getRouter.has(currentUrl)) {
            this.getRouter.get(currentUrl)(req, res)
          }
        }

        if (method === "POST") {
          if (this.postRouter.has(currentUrl)) {
            let body = ''
            req.on('data', (chunk) => {
              body += chunk
            })
            req.on('end', async () => {
              let resulte = await this.postRouter.get(currentUrl)(querystring.parse(body))
              contentType = resulte.type || 'json'
              if (contentType === 'json') {
                resulte = JSON.stringify(resulte)
              }
              return this.response(res, statusCode, contentType, resulte)
            })
          }
        }
      } catch (error) {
        console.log(error)
        res.end('{status: -1, message: "Business Exception"}')
      }

    }).listen(this.options.prot, this.options.host)
    console.log('http://localhost:9530')
  }
}

module.exports = exports = Intern;
