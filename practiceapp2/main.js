const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test2'
});


app.get('/', (req, res) => {
    const sql = "select * from savings";
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.render('index', { savings: result });
    });
});

app.post('/', (req, res) => {
    const sql = "INSERT INTO savings SET ?"
    con.query(sql, req.body, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.redirect('/');
    });
});

app.get('/create', (req, res) =>
    res.sendFile(path.join(__dirname, './views/form.html')))

app.get('/edit/:id', (req, res) => {
    const sql = "SELECT * FROM savings WHERE id = ?";
    con.query(sql, [req.params.id], function (err, result, fields) {
        if (err) throw err;
        res.render('edit', { savings: result });
    });
});

app.post('/update/:id', (req, res) => {
    const sql = "UPDATE savings SET ? WHERE id = " + req.params.id;
    con.query(sql, req.body, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.redirect('/');
    });
});

app.get('/delete/:id', (req, res) => {
    const sql = "DELETE FROM savings WHERE id = ?";
    con.query(sql, [req.params.id], function (err, result, fields) {
        if (err) throw err;
        console.log(result)
        res.redirect('/');
    })
});

app.get('/sortDate', (req, res) => {
    const sql = "SELECT * FROM savings ORDER BY date ASC;";
    con.query(sql, req.body, function (err, result, fields) {
        if (err) throw err;
        console.log(result)
        res.render('index2', { savings: result });
    })
});
app.get('/sortPrice', (req, res) => {
    const sql = "SELECT * FROM savings ORDER BY savings ASC;";
    con.query(sql, req.body, function (err, result, fields) {
        if (err) throw err;
        console.log(result)
        res.render('index3', { savings: result });
    })
});

app.get('/archive.ejs', (req, res) => {
    const sql = "SELECT distinct DATE_FORMAT(date, '%Y')as date from savings ORDER BY date ASC;";
    con.query(sql, req.body, function (err, result, fields) {
        if (err) throw err;
        console.log(result)
        res.render('archive', { savings: result });
    })
});

app.get('/graph.ejs/:date', (req, res) => {
    const sql = "Select DATE_FORMAT(date, '%m月')as date ,savings,summary,type FROM savings WHERE date = " + req.params.date + " ORDER BY date ASC";
    con.query(sql, req.params.date, function (err, result, fields) {
        if (err) throw err;
        console.log(result)
        res.render('graph', { savings: result });
    })
});



app.listen(port);
console.log('Server listen on port:' + port);