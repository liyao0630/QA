const fs = require('fs')
const ejs = require('ejs')
const BusinessException = require('../utils/businessException')
module.exports = exports = class Template {
  readFile(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
  static(filePath) {
    return fs.existsSync(filePath) && fs.readFileSync(filePath)
  }

  show(filePath, data, layoutTemplate) {
    if (fs.existsSync(filePath)) {
      let body = fs.readFileSync(filePath).toString()
      body = this.render(body, data)
      if (layoutTemplate) {
        data = Object.assign({ title: '', seo: '', css: '', js: '', CDN: '' }, data, { body })
        return this.render(layoutTemplate, data)
      } else {
        return body
      }
    } else {
      throw new BusinessException(`${filePath}不存在`, -1, {})
    }

  }

  /* async show(filePath, data) {
    let template = await Promise.all([readFile(filePath), readFile(path.resolve(this.options.templatePath + '/layout.html'))])

    let body = this.render(template[0].toString(), data)

    data = Object.assign({ title: this.options.title + this.options.defaultTitle, seo: '', css: '', js: '', CDN: this.options.CDN }, data, {body})
    
    return this.render(template[1].toString(), data)
  } */

  render(template, data, options) {
    return ejs.render(template, data, options)
  }
}