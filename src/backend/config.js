const mysql = require("mysql");

const db = mysql.createPool({  // Używamy `createPool()`, żeby unikać timeoutów
    host: "localhost",
    user: "root",
    password: "haslo1234",
    database: "sklep",
    connectionLimit: 10  // Maks. 10 jednoczesnych połączeń
});

module.exports = db;
