const mysql = require('mysql');


let dbConfig = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "students_poc",
}

let connection;

function connect(){
    connection = mysql.createConnection(dbConfig);
    return new Promise((resolve, reject) => {
        connection.connect((err)=>{err?reject():resolve()});
    });
}
function runQuery(sqlQuery) {
    return new Promise((resolve, reject) => {
        connection.query(sqlQuery, (err,res) => {
            err?reject(err):resolve(extractDBRes(res));
        })
    });
}

function extractDBRes(res) {
    return JSON.parse(JSON.stringify(res).replace("RowDataPacket",""));
}

module.exports = {
    "connect" : connect,
    "runQuery" : runQuery
}