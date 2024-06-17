const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your-username',
    password: 'your-password',
    database: 'quote_db'
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

// API to search quotes
app.get('/api/quotes', (req, res) => {
    const search = req.query.search;
    const sql = 'SELECT * FROM quotes WHERE text LIKE ?';
    db.query(sql, [`%${search}%`], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(result);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
