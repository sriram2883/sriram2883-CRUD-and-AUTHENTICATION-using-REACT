const mysql = require('mysql2');
const Admindb = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MYSQL'
});
Admindb.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Entering Root");
    }
});

Admindb.query("CREATE DATABASE IF NOT EXISTS Admin", (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Using Database");
    }
});
Admindb.query("use Admin");
Admindb.query(`CREATE TABLE IF NOT EXISTS Admin_Table (
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

Admindb.query(`INSERT INTO Admin_Table (username,email,password) VALUES ('Admin','Admin@gmail.com','$2a$10$n2hEoC0vGfJk5Fo2VoKoyeH/OWd173qA.irYCOSdJ1KW3cTxDYFdK')`, (err, result) => {
});

module.exports = Admindb;