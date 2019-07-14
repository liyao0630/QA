const request = require('./lib/request')
const response = require('./lib/response')
const Intern = require('./lib/intern')
const Template = require('./lib/template')
const template = new Template()
const db = require('./lib/db')
const intern = new Intern()

intern.get('/', (res, req) => {
  db.local.query('select * from user').then((data) => {
    let resulte = template.show('/index.html', { title: '首页', css: ['/assets/css/index.css'], js: ['/assets/js/index.js'], list: data })
    response.end(req, resulte)
  })
})

intern.get('/list', (res, req) => {
  let resulte = template.show('/list/index.html', { title: '列表页' }, false)
  response.end(req, resulte)
})

intern.post('/list', (res, req) => {
  request.bodyParse(res).then(data => {
    console.log(data)
    response.end(req, '234')
  })
})

intern.server()