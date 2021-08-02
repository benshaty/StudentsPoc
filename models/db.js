// File dependencies
const mysql = require('mysql');

// MySql db config
let dbConfig = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "students_poc",
}

let connection;

// Connect to db
function connect(){
    connection = mysql.createConnection(dbConfig);
    return new Promise((resolve, reject) => {
        connection.connect((err)=>{err?reject("cant connect to DB!"):resolve()});
    });
}

// Run Sql query
function runQuery(sqlQuery) {
    return new Promise((resolve, reject) => {
        connection.query(sqlQuery, (err,res) => {
            err?reject(err):resolve(extractDBRes(res));
        })
    });
}

// Extract data from return json
function extractDBRes(res) {
    return JSON.parse(JSON.stringify(res).replace("RowDataPacket",""));
}

module.exports = {
    "connect" : connect,
    "runQuery" : runQuery
}