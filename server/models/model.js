//	id, transaction_id, customer_id, transaction_date, amount, status, payment_method, currency
const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MYSQL'
});
db.connect((err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("Entering Root");
    }
});

db.query("CREATE DATABASE IF NOT EXISTS transactions", (err, result)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("Using Database");
    }
});
db.query("use transactions");
db.query(`CREATE TABLE IF NOT EXISTS Transaction_Table (
    id INT(10) UNIQUE NOT NULL PRIMARY KEY AUTO_INCREMENT,
    transaction_id int(30) UNIQUE NOT NULL,
    customer_id VARCHAR(30) NOT NULL,
    transaction_date varchar(100),
    amount FLOAT,
    status VARCHAR(30),
    payment_method VARCHAR(30) NOT NULL,
    currency VARCHAR(30),
    logged_by VARCHAR(30)
)`, (err, result) => {
    if (err) {
        console.log(err);
        console.log("Table Already Exists or Error in Creating Table");
    }
});

module.exports=db ;