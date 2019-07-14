const Intern = require('./lib/intern')
const response = require('./lib/response')
const Template = require('./lib/template')
const template = new Template()
const db = require('./lib/db')
const intern = new Intern()
intern.get('/', (res, req) => {
  db.local.query('select * from user').then((data) => {
    let resulte = template.show('/index.html', { title: '首页', css: ['/assets/css/index.css'], js: ['/assets/js/index.js'], list: data })
    response.end(req, 200, 'html', JSON.stringify(resulte))
  })
})

intern.get('/list', () => {
  return { title: '列表页' }
})

intern.post('/list', (data) => {
  console.log(data)
  return data
})

intern.server()