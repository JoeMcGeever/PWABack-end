
/* mysql.js */

import mysql from 'mysql'

// process.env.CLEARDB_DATABASE_URL = 'mysql://blah:blah@us-cdbr-east-02.cleardb.com/heroku_blah?reconnect=true'
// const connectionString = 'process.env.CLEARDB_DATABASE_URL'
// const pool = mysql.createPool(connectionString)

const localDB = 'mysql://apiuser:CHANGEME@localhost/api?reconnect=true'
const connectionString = process.env.CLEARDB_DATABASE_URL || localDB
const pool = mysql.createPool(connectionString)

// const pool = mysql.createPool({
// 	host: 'localhost',
// 	user: 'apiuser',
// 	database: 'api',
// 	password: 'CHANGEME'
// })

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection) connection.release()
    return
})

function all(sql) {
    return new Promise( (resolve, reject) => {
        pool.query(sql, (err, res, fields) => {
            if(res === undefined) resolve([])
            const result = JSON.parse(JSON.stringify(res))
            if(err) reject(err)
            resolve(result)
        })
    })
}

function get(sql) {
    return new Promise( (resolve, reject) => {
        pool.query(sql, (err, res, fields) => {
            if(res === undefined) return resolve(null)
            const result = JSON.parse(JSON.stringify(res))
            if(err) return reject(err)
						resolve(result[0])
        })
    })
}

function run(sql) {
    return new Promise( (resolve, reject) => {
        pool.query(sql, (err, res, fields) => {
					console.log(err)
            if(err) reject(err)
					  console.log(res)
						resolve()
        })
    })
}

export { all, get, run }
