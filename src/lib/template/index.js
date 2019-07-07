const fs = require('fs')
const path = require('path')
const ejs = require('ejs')
const BusinessException = require('../utils/businessException')

module.exports = exports = class Template {
  constructor() {
    this.templatePath = path.resolve(__dirname, '../../view/template/'),
    this.layoutTemplate = fs.readFileSync(path.resolve(__dirname, '../../view/template/layout.html'), 'utf-8')
  }

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

  /* show(filePath, data, layout = true) {
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

  } */

  
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