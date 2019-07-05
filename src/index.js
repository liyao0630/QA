const Intern = require('./lib/intern')
const intern = new Intern()

intern.get('/', () => {
  return {title: '首页', css: ['/css/index.css'], js: ['/js/index.js']}
})

intern.get('/list', () => {
  return {title: '列表页'}
})

intern.server()