const http = require('http')
const path = require('path')
const fs = require('fs')
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
      assetsPath: path.resolve(__dirname, '../../../asstes/'),
      CDN: '',
      commonTitle: '-intern'
    }
    this.options = Object.assign({}, defaultOptions, options)
    this.getRouter = new Map()
  }

  get(router, callback) {
    this.getRouter.set(router, callback)
  }

  response(response, code, contentType, resulte) {
    response.writeHead(code, {
      'charset': 'utf-8',
      'Content-Type': mimeType.getMime(extname)
    });
    response.end(resulte)
  }

  server() {
    http.createServer(async (request, response) => {
      try {
        let currentUrl = request.url
        let contentType = mimeType.getMime('.json')
        let extname = path.extname(currentUrl)
        let resulte = ''
        let statusCode = 200

        if (extname) {
          let filePath = this.options.assetsPath + currentUrl
          if (fs.existsSync(filePath)) {
            contentType = mimeType.getMime(extname)
            resulte = template.static(filePath)
          }
        } else {
          if (this.getRouter.has(currentUrl)) {
            resulte = await this.getRouter.get(currentUrl)()
            contentType = mimeType.getMime('.html')
          }
        }

        if (resulte) {
          response.writeHead(statusCode, {
            'charset': 'utf-8',
            'Content-Type': contentType
          });
          response.end(resulte.toString())
        } else {
          statusCode = 404
          resulte = ''
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
