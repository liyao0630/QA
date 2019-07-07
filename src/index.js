const Intern = require('./lib/intern')
// const db = require('./lib/db')
const intern = new Intern()
intern.get('/', () => {
  // db.local.query('select * from user')
  var mysql = require('mysql');
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123123',
    database: 'test'
  });

  connection.connect();

  connection.query('SELECT * from user', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ',results);
  });

  connection.end();
  return { title: '首页', css: ['/css/index.css'], js: ['/js/index.js'] }
})

intern.get('/list', () => {
  return { title: '列表页' }
})

intern.server()