const mysql = require("mysql");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "haslo1234",
    database: "sklep",
    connectionLimit: 10
});

module.exports = db;
