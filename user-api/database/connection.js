const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'apiusers'
  },
})

module.exports = knex