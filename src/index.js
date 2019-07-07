const Intern = require('./lib/intern')
const db = require('./lib/db')
const intern = new Intern()
intern.get('/', async () => {
  const data = await db.local.query('select * from tag')
  console.log(data)
  return {title: '首页', css: ['/css/index.css'], js: ['/js/index.js']}
})

intern.get('/list', () => {
  return {title: '列表页'}
})

intern.server()