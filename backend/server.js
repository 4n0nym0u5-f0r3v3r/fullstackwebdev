const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'mysqlhost',
    user: 'myuser',
    password: 'mypassword',
    database: 'authdb'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Database connected');
});

// Routes
app.post('/api/signup', (req, res) => {
    const { email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.execute(query, [email, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ message: 'User registered' });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ?';
    
    db.execute(query, [email], (err, results) => {
        if (err || results.length === 0) return res.status(400).json({ error: 'Invalid credentials' });
        
        const user = results[0];
        if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '1h' });
            return res.json({ message: 'Login successful', token });
        } else {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
    });
});

// Start the server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
