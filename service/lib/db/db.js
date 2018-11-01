const mysql = require('mysql')
const sqlFormatter = require('sql-formatter')

function get_connection(){
  return mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWD,
    port: 3306,
    database: process.env.DB_NAME
  })
}


class Db{
  constructor(){
    if(!Db.pool) {
      Db.pool = get_connection()
    }
  }

  async insert(tbl, data, conn = null) {
    const sql = `insert into ${tbl} set ?`
    const result = await this.query(sql, data, conn)
    return result.insertId

  }

  update(tbl, data, conn = null) {
    const {id, ...others} = data
    if(!id) {
      throw '需要ID'
    }

    const flds = Object.keys(others)
      .filter( fld => {
        return typeof others[fld] !== 'undefined' &&
          others[fld] !== null
      })

    const sql = `update ${tbl}
      SET ${flds.map(fld => `\`${fld}\`=?`).join(',')}
      where id=?
    `

    const fldValues = flds.map(fld => data[fld])
    fldValues.push(id)
    return this.query(sql, fldValues, conn)
  }

  delete(tbl, id) {
    const sql = `delete from ${tbl} where id = ${id}`
    return this.query(sql)
  }

  async queryById(tbl, id) {
    const sql = `select * from ${tbl} where id=?`
    const list = this.query(sql, [id])
    if(list.length > 0)  {
      return list[0]
    }
    return null
  }

  async queryOne(sql, params) {
    const list = await this.query(sql, params)
    if(list.length > 0) {return list[0]}
    return null
  }


  async getConnection() {
    return new Promise( (resolve, reject) => {
      Db.pool.getConnection( (err, connection) => {
        if(err) {
          reject(err)
          return
        }
        resolve(connection)
      })
    })
  }

  async getById(table, id) {
    const sql = `select * from ${table} where id = ?`
    return this.queryOne(sql, [id])
  }

  async beginTransaction(connection) {
    return new Promise( (resolve, reject) => {
      connection.beginTransaction(err => {
        if(err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  }

  async rollback(connection) {
    return new Promise( (resolve, reject) => {
      connection.rollback(err => {
        if(err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  }

  async commitTransation(connection) {
    return new Promise( (resolve, reject) => {
      connection.commit(err => {
        if(err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  }


  query(sql, params, conn = null) {

    return new Promise((resolve, reject) => {
      function __query(connection, sql, params) {
        connection.query(sql, params, (error, results, fields) => {
          connection.release()
          if (error) {
            console.log(sqlFormatter.format(sql))
            reject(error)
          }
          resolve(results)
        })
      }
      if (conn) {
        __query(connection, sql, params)
      } else {
        Db.pool.getConnection(function (err, connection) {
          if (err) {
            throw err
          }
          __query(connection, sql, params)
        })
      }
    })
  }
}

module.exports = Db