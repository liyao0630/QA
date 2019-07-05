const Intern = require('./lib/intern/index')
const intern = new Intern()

intern.add('/', () => {
  return {title: '首页123', css: ['/css/index.css'], js: ['/js/index.js']}
})

intern.add('/list', () => {
  return {title: '列表页'}
})

intern.server()