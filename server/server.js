const db = require('./models/model.js');
const Userdb = require('./models/Users.js');
const express = require('express');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admindb = require('./models/Admin.js');
const app = express();

const cors =require('cors')
const corsOptions={
    origin:'*',
    optionsSuccessStatus:200
}
app.use(cors(corsOptions))
app.use(express.json());
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    JWT.verify(token, 'secret', (err, user) => {
        if (err) return res.sendStatus(403);
        if (user.username !== 'Admin') {
            const query = `SELECT * FROM User_Table WHERE username = ?`;
            Userdb.query(query, [user.username], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.sendStatus(500);
                }
                if (result.length === 0) {
                    return res.sendStatus(401);
                }
                next();
            });
        } else {
            next(); 
        }
    });
}

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const query = `INSERT INTO User_Table (username, email, password) VALUES (?, ?, ?)`;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal server error');
        }
        Userdb.query(query, [username, email, hash], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(400).send('Error registering user');
            }
            res.status(201).json({ message: 'User registered successfully', result });
        });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM User_Table WHERE username = ?`;

    Userdb.query(query, [username], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal server error');
        }
        if (result.length === 0) {
            return res.status(404).send("User not found");
        }
        bcrypt.compare(password, result[0].password, (err, isMatch) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal server error');
            }
            if (isMatch) {
                const token = JWT.sign({ username: result[0].username, email: result[0].email }, 'secret', { expiresIn: '24h' });
                res.status(200).json({ token });
            } else {
                res.status(401).send("Incorrect password");
            }
        });
    });
});
app.post('/admin', (req, res) => {
    const { username,email, password } = req.body;
    const query = `SELECT * FROM Admin_Table WHERE username = ?`;

    Admindb.query(query, [username], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).send('Internal server error');
        }
        if (result.length === 0) {
            return res.status(404).send("User not found");
        }
        bcrypt.compare(password, result[0].password, (err, isMatch) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal server error');
            }
            if (isMatch) {
                const token = JWT.sign({ username: result[0].username, email: result[0].email }, 'secret', { expiresIn: '24h' });
                res.status(200).json({ token });
            } else {
                res.status(401).send("Incorrect password");
            }
        });
    });
});

app.get('/admin/transactions', authenticateToken, (req, res) => {
    db.query("SELECT * FROM Transaction_Table", (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching transactions');
        }
        res.status(200).json(result);
    });
});

app.get('/admin/transactions/:id', authenticateToken, (req, res) => {
    const query = "SELECT * FROM Transaction_Table WHERE transaction_id=?";

    db.query(query, [req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching transaction');
        }
        res.status(200).json(result);
    });
}
);

app.post('/admin/transactions', authenticateToken, (req, res) => {
    const { transaction_id,customer_id,transaction_date,amount,status,payment_method,currency,logged_by } = req.body;
    const query = `INSERT INTO Transaction_Table (transaction_id,customer_id,transaction_date,amount,status,payment_method,currency,logged_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(query, [transaction_id,customer_id,transaction_date,amount,status,payment_method,currency,logged_by], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error creating transaction');
        }
        res.status(201).json({ message: 'Transaction created successfully', result });
    });
});

app.put('/admin/transactions/:id', authenticateToken, (req, res) => {
    const {customer_id,transaction_date,amount,status,payment_method,currency,logged_by } = req.body;
    const query = `UPDATE Transaction_Table SET customer_id=?, transaction_date=?, amount=?, status=?, payment_method=?, currency=?, logged_by=? WHERE transaction_id=?`;

    db.query(query, [customer_id,transaction_date,amount,status,payment_method,currency,logged_by,req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error updating transaction');
        }
        res.status(202).json({ message: 'Transaction updated successfully', result });
    });
});

app.delete('/admin/transactions/:id', authenticateToken, (req, res) => {
    const query = "DELETE FROM Transaction_Table WHERE transaction_id=?";

    db.query(query, [req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting transaction');
        }
        res.status(200).json({ message: 'Transaction deleted successfully', result });
    });
});

app.delete('/admin/users/:id', authenticateToken, (req, res) => {
    const query = "DELETE FROM User_Table WHERE username=?";

    Userdb.query(query, [req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting user');
        }
        res.status(200).json({ message: 'User deleted successfully', result });
    });
});

app.get('/admin/users', authenticateToken, (req, res) => {
    Userdb.query("SELECT username,email FROM User_Table", (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching users');
        }
        res.status(200).json(result);
    });
});

app.get('/transactions', authenticateToken, (req, res) => {
    db.query("SELECT * FROM Transaction_Table", (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching transactions');
        }
        res.status(200).json(result);
    });
});

app.post('/transactions', authenticateToken, (req, res) => {
    const { transaction_id, customer_id, transaction_date, amount, status, payment_method, currency,logged_by } = req.body;
    const query = `INSERT INTO Transaction_Table (transaction_id, customer_id, transaction_date, amount, status, payment_method, currency , logged_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [transaction_id, customer_id, transaction_date, amount, status, payment_method, currency,logged_by], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error creating transaction');
        }
        res.status(201).json({ message: 'Transaction created successfully', result });
    });
});

app.put('/transactions/:id', authenticateToken, (req, res) => {
    const { customer_id, transaction_date, amount, status, payment_method, currency, logged_by } = req.body;
    const query = `UPDATE Transaction_Table SET customer_id=?, transaction_date=?, amount=?, status=?, payment_method=?, currency=?, logged_by=? WHERE transaction_id=?`;

    db.query(query, [customer_id, transaction_date, amount, status, payment_method, currency,logged_by, req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error updating transaction');
        }
        res.status(202).json({ message: 'Transaction updated successfully', result });
    });
});

app.delete('/transactions/:id', authenticateToken, (req, res) => {
    const query = "DELETE FROM Transaction_Table WHERE transaction_id=?";
    db.query(query, [req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error deleting transaction', result: null });
        }
        
        res.status(200).json({ message: 'Transaction deleted successfully', result });
    });
});

app.get('/transactions/:id', authenticateToken, (req, res) => {
    const query = "SELECT * FROM Transaction_Table WHERE transaction_id=?";

    db.query(query, [req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching transaction');
        }
        res.status(200).json(result);
    });
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});