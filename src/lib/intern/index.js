const http = require('http')
const path = require('path')
const fs = require('fs')
const querystring = require('querystring');
const MimeType = require('../utils/mimeType')
const Template = require('../template')
const template = new Template()
const mimeType = new MimeType()
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

  response(response, code, contentType, resulte) {
    console.log(contentType, mimeType.getMime(contentType))
    response.writeHead(code, {
      'charset': 'utf-8',
      'Content-Type': mimeType.getMime(contentType)
    });
    response.end(resulte)
  }

  isAssets(url) {
    return /\/assets\//.test(url)
  }

  readAssets(response, filePath) {
    let contentType
    let resulte = ''
    let statusCode = 200
    if (fs.existsSync(filePath)) {
      contentType = path.extname(filePath).slice(1)
      resulte = fs.existsSync(filePath) && fs.readFileSync(filePath)
    } else {
      statusCode = 404
      contentType = 'html'
    }
    this.response(response, statusCode, contentType, resulte)
  }

  server() {
    http.createServer(async (request, response) => {
      try {
        let currentUrl = request.url
        let method = request.method
        let contentType = ''
        let resulte = ''
        let statusCode = 200
        if (method === 'GET') {
          if (this.isAssets(currentUrl)) {
            return this.readAssets(response, this.options.assetsPath + currentUrl)
          }

          if (this.getRouter.has(currentUrl)) {
            let data = await this.getRouter.get(currentUrl)()
            contentType = resulte.type || 'html'
            resulte = template.show(currentUrl + '/index.html', data)
            return this.response(response, statusCode, contentType, resulte)
          }
        }

        if (method === "POST") {
          if (this.postRouter.has(currentUrl)) {
            let body = ''
            request.on('data', (chunk) => {
              body += chunk
            })
            request.on('end', async () => {
              let resulte = await this.postRouter.get(currentUrl)(querystring.parse(body))
              contentType = resulte.type || 'html'
              return this.response(response, statusCode, contentType, JSON.stringify(resulte))
            })
          }
        }
      } catch (error) {
        console.log(error)
        response.end('{status: -1, message: "Business Exception"}')
      }

    }).listen(this.options.prot, this.options.host)
    console.log('http://localhost:9530')
  }
}

module.exports = exports = Intern;
