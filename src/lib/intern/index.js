const http = require('http')
const path = require('path')
const fs = require('fs')
const response = require('../response')
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

  isAssets(url) {
    return /\/assets\//.test(url)
  }

  get(router, callback) {
    this.getRouter.set(router, callback)
  }

  post(router, callback) {
    this.postRouter.set(router, callback)
  }

  server() {
    http.createServer((req, res) => {
      try {
        let currentUrl = req.url
        let method = req.method
        if (method === 'GET') {
          if (this.getRouter.has(currentUrl)) {
            return this.getRouter.get(currentUrl)(req, res)
          }
        }

        if (method === "POST") {
          if (this.postRouter.has(currentUrl)) {
            return this.postRouter.get(currentUrl)(req, res)
          }
        }

        if (this.isAssets(currentUrl)) {
          return response.readAssets(res, this.options.assetsPath + currentUrl)
        }

        res.writeHead(404, {
          'charset': 'utf-8',
          'Content-Type': 'text/html'
        });
        res.end('')
      } catch (error) {
        console.log(error)
        res.end('{status: -1, message: "Business Exception"}')
      }

    }).listen(this.options.prot, this.options.host)
    console.log('http://localhost:9530')
  }
}

module.exports = exports = Intern;
