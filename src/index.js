const Intern = require('./lib/intern')
const Template = require('./lib/template')
const template = new Template()
const db = require('./lib/db')
const intern = new Intern()
intern.get('/', async () => {
  return await db.local.query('select * from user').then((data) => {
    // return { title: '首页', css: ['/css/index.css'], js: ['/js/index.js'], list:  data} 
    return template.show('/index.html',{ title: '首页', css: ['/css/index.css'], js: ['/js/index.js'], list:  data})
  })
})

intern.get('/list', () => {
  return { title: '列表页' }
})

intern.server()