const fs = require('fs')
const path = require('path')
const ejs = require('ejs')
const BusinessException = require('../utils/businessException')
module.exports = exports = class Template {
  constructor() {
    this.templatePath = path.resolve(__dirname, '../../view/template/'),
    this.layoutTemplate = fs.readFileSync(path.resolve(__dirname, '../../view/template/layout.html'), 'utf-8')
  }
  
  show(filePath, data, layout = true) {
    filePath = this.templatePath + filePath
    if (fs.existsSync(filePath)) {
      let body = fs.readFileSync(filePath).toString()
      body = this.render(body, data)
      if (layout) {
        data = Object.assign({ title: '', seo: '', css: '', js: '', CDN: '' }, data, { body })
        return this.render(this.layoutTemplate, data)
      } else {
        return body
      }
    } else {
      throw new BusinessException(`${filePath}不存在`, -1, {})
    }
  }

  render(template, data, options) {
    return ejs.render(template, data, options)
  }
}