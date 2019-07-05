const { assertExists, readFile, readFileSync } = require('../utils')
const ejs = require('ejs')

module.exports = exports = class Template{
  getAssets(filePath) {
    let template = assertExists(filePath) && readFileSync(filePath)
    if (template) {
      return template
    }
  }

  async getLayout(filePath, data) {
    let template = await Promise.all([readFile(filePath), readFile(path.resolve(this.options.templatePath + '/layout.html'))])

    let body = this.render(template[0].toString(), data)

    data = Object.assign({ title: this.options.title + this.options.defaultTitle, seo: '', css: '', js: '', CDN: this.options.CDN }, data, {body})
    
    // let layout = readFile(this.options.templatePath + '../layout/index.html')
    return this.render(template[1].toString(), data)
    /* 
    let body = readFile(filePath)
    body = this.render(body.toString(), data)

    data = Object.assign({ title: this.options.title + this.options.defaultTitle, seo: '', css: '', js: '', CDN: this.options.CDN }, data, {body})
    
    let layout = readFile(this.options.templatePath + '../layout/index.html')
    return this.render(layout.toString(), data)
    */

    /* 
    let body = readFile(path.resolve(__dirname, filePath))
    body = this.render(body.toString(), data)
    data = Object.assign({ title: this.options.title + this.defaultOptions, seo: '', css: '', js: '' }, {body:path.resolve(__dirname, filePath)})
    let layout = readFile(path.resolve(__dirname, this.options.templatePath + '../layout/index.html')) 
    return this.render(layout.toString(), data)
    */
  }

  ender(template, data, options) {
    return ejs.render(template, data, options)
  }
}