const Intern = require('./lib/intern')
const Template = require('./lib/template')
const template = new Template()
const db = require('./lib/db')
const intern = new Intern()
intern.get('/', async () => {
  return await db.local.query('select * from user').then((data) => {
    console.log(data)
    // return { title: '首页', css: ['/css/index.css'], js: ['/js/index.js'], list:  data} 
    return { title: '首页', css: ['/assets/css/index.css'], js: ['/assets/js/index.js'], list: data }
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