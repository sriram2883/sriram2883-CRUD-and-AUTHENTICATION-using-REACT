const mysql = require('mysql2');
const Userdb = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MYSQL'
});

Userdb.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Entering Root");
    }
});

Userdb.query("CREATE DATABASE IF NOT EXISTS Users", (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Using Database");
    }
});
Userdb.query("use Users");
Userdb.query(`CREATE TABLE IF NOT EXISTS User_Table (
    id INT(10) UNIQUE NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100)
)`, (err, result) => {
    if (err) {
        console.log(err);
        console.log("Table Already Exists or Error in Creating Table");
    }
});

module.exports = Userdb;