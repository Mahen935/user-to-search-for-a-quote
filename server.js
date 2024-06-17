const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

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

// API to save a favourite quote
app.post('/api/favourites', (req, res) => {
    const { quote_id } = req.body;
    const sql = 'INSERT INTO favourites (quote_id) VALUES (?)';
    db.query(sql, [quote_id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ id: result.insertId, quote_id });
    });
});

// API to get all favourite quotes
app.get('/api/favourites', (req, res) => {
    const sql = `
        SELECT quotes.id, quotes.text, quotes.author 
        FROM favourites 
        JOIN quotes ON favourites.quote_id = quotes.id
    `;
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(result);
    });
});

// Serve search and favourites page
app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

app.get('/favourites', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'favourites.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
