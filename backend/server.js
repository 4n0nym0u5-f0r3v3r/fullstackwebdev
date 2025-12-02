const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["https://localhost", "http://localhost", "https://fullstackweb.dev", "http://fullstackweb.dev", "https://www.fullstackweb.dev", "http://www.fullstackweb.dev", "http://192.168.1.14", "https://192.168.1.14"]
}));

// MySQL connection
const db = mysql.createConnection({
    host: 'mysqlhost',
    user: 'root',
    password: 'password',
    database: 'authdb'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Database connected');
});

// Routes
app.post('/api/signup', (req, res) => {
    const {
        email,
        password
    } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.execute(query, [email, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({
            error: 'Database error'
        });
        res.status(201).json({
            message: 'User registered'
        });
    });
});

app.post('/api/login', (req, res) => {
    const {
        email,
        password
    } = req.body;
    const query = 'SELECT * FROM users WHERE email = ?';

    db.execute(query, [email], (err, results) => {
        if (err || results.length === 0) return res.status(400).json({
            error: 'Invalid credentials'
        });

        const user = results[0];
        if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({
                id: user.id
            }, 'secret_key', {
                expiresIn: '1h'
            });
            return res.json({
                message: 'Login successful',
                token
            });
        } else {
            return res.status(400).json({
                error: 'Invalid credentials'
            });
        }
    });
});

// Start the server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});