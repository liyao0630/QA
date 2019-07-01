const http = require('http')
const path = require('path')
const ejs = require('ejs')
const { readFile } = require('../utils')
const MimeType = require('../utils/mimeType')
const mimeType = new MimeType()

class Intern {

  constructor(options) {
    let defaultOptions = {
      prot: 9530,
      host: 'localhost',
      templatePath: '../../view/template/',
      assetsPath: '../../../asstes/',
      CDN: 'http://localhost:9530',
      title: 'intern',
      defaultTitle: '-intern'
    }
    this.options = Object.assign({}, defaultOptions, options)
    this.staticRouter = new Map()
  }

  render(template, data, options) {
    return ejs.render(template, data, options)
  }

  add(router, callback) {
    this.staticRouter.set(router, callback)
  }

  getLayout(filePath, data) {
    let body = readFile(path.resolve(__dirname, filePath))
    body = this.render(body.toString(), data)

    data = Object.assign({ title: this.options.title + this.options.defaultTitle, seo: '', css: '', js: '', CDN: this.options.CDN }, data, {body})
    
    let layout = readFile(path.resolve(__dirname, this.options.templatePath + '../layout/index.html'))

    /* let body = readFile(path.resolve(__dirname, filePath))
    body = this.render(body.toString(), data)
    data = Object.assign({ title: this.options.title + this.defaultOptions, seo: '', css: '', js: '' }, {body:path.resolve(__dirname, filePath)})
    let layout = readFile(path.resolve(__dirname, this.options.templatePath + '../layout/index.html')) */
    return this.render(layout.toString(), data)
  }

  getAssets(filePath) {
    let template = readFile(path.resolve(__dirname, filePath))
    if (template) {
      return template
    }
  }

  server() {
    http.createServer((request, response) => {
      try {
        let currentUrl = request.url
        let contentType = mimeType.getMime('.json')
        let extname = path.extname(currentUrl)
        let template = ''
        let statusCode = 200

        if (extname) {
          contentType = mimeType.getMime(extname)
          template = this.getAssets(this.options.assetsPath + currentUrl)
        }

        if (!template) {
          let data = {}
          if (this.staticRouter.has(currentUrl)) {
            data = this.staticRouter.get(currentUrl)()
          }

          template = this.getAssets(this.options.templatePath + currentUrl + 'index.html')
          
          if (template) {
            contentType = mimeType.getMime('.html')
            template = this.getLayout(this.options.templatePath + currentUrl + 'index.html', data)
          }
        }

        if (!template) {
          statusCode = 404
          template = ''
        }

        response.writeHead(statusCode, {
          'charset': 'utf-8',
          'Content-Type': contentType
        });
        response.end(template)
      } catch (error) {
        console.log(error)
        response.end('{status: -1, message: "Business Exception"}')
      }

    }).listen(this.options.prot, this.options.host)
    console.log('http://localhost:9530')
  }

}

module.exports = exports = Intern;