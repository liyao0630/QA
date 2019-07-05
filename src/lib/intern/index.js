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
      layoutPath: path.resolve(__dirname, '../../view/template/layout.html'),
      CDN: 'http://localhost:9530',
      defaultTitle: '-intern'
    }
    this.options = Object.assign({}, defaultOptions, options)
    this.getRouter = new Map()
    this.layout = template.static(this.options.layoutPath).toString()
  }

  get(router, callback) {
    this.getRouter.set(router, callback)
  }

  server() {
    http.createServer(async (request, response) => {
      try {
        let currentUrl = request.url
        let contentType = mimeType.getMime('.json')
        let extname = path.extname(currentUrl)
        let filePath = this.options.assetsPath + currentUrl
        let resulte = ''
        let statusCode = 200

        if (extname && fs.existsSync(filePath)) {
          contentType = mimeType.getMime(extname)
          resulte = template.static(filePath)
        } else {
          let data = {}

          if (this.getRouter.has(currentUrl)) {
            data = this.getRouter.get(currentUrl)()
          }

          filePath = this.options.templatePath + currentUrl + 'index.html'
          if (fs.existsSync(filePath)) {
            contentType = mimeType.getMime('.html')
            resulte = template.show(filePath, data, this.layout)
          }
        }

        if (resulte) {
          response.writeHead(statusCode, {
            'charset': 'utf-8',
            'Content-Type': contentType
          });
          response.end(resulte)
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