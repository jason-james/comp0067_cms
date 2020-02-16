const express = require('express');
const basicAuth = require('express-basic-auth');
const sha256 = require('sha256');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();
const moment = require('moment');

let connection;

// Connect to database
 (async () => {
    connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'hear_me_out'
    });
})();

const auth = basicAuth({ authorizer: myAsyncAuthorizer, authorizeAsync: true, unauthorizedResponse: getUnauthorizedResponse});

function getUnauthorizedResponse(req) {
    return req.auth
        ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected')
        : 'No credentials provided'
}

async function myAsyncAuthorizer(email, password, cb) {
    // Use given email to query DB and find what the password should be
    const [rows, fields] = await connection.execute("SELECT * FROM `users` WHERE `email` = '" + email + "'");
    if (rows[0].password === password)
        return cb(null, true);
    else
        return cb(null, false)
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('82e4e438a0705fabf61f9854e3b575af'));

app.get('/api/users', async (req, res) => {
    const [rows, fields] = await connection.execute('SELECT * FROM `users`');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ users: rows }));
});

app.listen(3001, () => {
        console.log('Express server is running on localhost:3001');
    }
);

app.get('/api/authenticate', auth, async (req, res) => {
    const options = {
        httpOnly: true,
        signed: true,
    };

    if (res) {
        res.cookie('email', req.auth.user, options).send()
    } else {
        res.status(401);
        res.send()
    }
});

app.get('/api/getUserInfo', async (req, res) => {
    const [rows, fields] = await connection.execute("SELECT * FROM `users` WHERE `email` = '" + req.signedCookies.email + "'");
    res.send({userInfo: rows[0]})
});

app.get('/api/logout', (req, res) => {
    res.clearCookie('email').end();
});

app.post('/api/createArticle', async (req, res) => {
    let userInfo = await JSON.parse(req.query.userInfo);
    let date = moment(new Date());
    let query = mysql.format(`INSERT into articles SET author_id=?, title=?, date_added=?, status=?, last_saved=?, content=?`,
        [userInfo.userInfo.user_id, req.query.title, date.format("YYYY-MM-DD"), 'pending', date.format("YYYY-MM-DD HH:MM:SS"), req.query.content]);
    connection.execute(query);
    console.log(query)
    res.send()
});

app.post('/api/saveNewArticle', async (req, res) => {
    let userInfo = await JSON.parse(req.query.userInfo);
    let date = moment(new Date());
    let query = mysql.format(`INSERT into articles SET author_id=?, title=?, status=?, last_saved=?, content=?`,
        [userInfo.userInfo.user_id, req.query.title, 'saved', date.format("YYYY-MM-DD HH:MM:SS"), req.query.content]);
    connection.execute(query);
    console.log(query)
    res.send()
});

app.post('/api/saveExistingArticle', async (req, res) => {
    let date = moment(new Date());
    let query = mysql.format(`UPDATE articles SET title=?, last_saved=?, content=? WHERE article_id=?`,
        [req.query.title, date.format("YYYY-MM-DD HH:MM:SS"), req.query.content, req.query.article]);
    connection.execute(query);
    console.log(query);
    res.send()
});

app.post('/api/submitExistingArticle', async (req, res) => {
    let date = moment(new Date());
    let query = mysql.format(`UPDATE articles SET title=?, date_added=?, status=?, last_saved=?, content=? WHERE article_id=?`,
        [req.query.title, date.format("YYYY-MM-DD"), 'pending', date.format("YYYY-MM-DD HH:MM:SS"), req.query.content, req.query.article]);
    connection.execute(query);
    console.log(query);
    res.send();
});

app.get('/api/getSingleUserArticles', async (req, res) => {
    let userInfo = await JSON.parse(req.query.userInfo);
    let author = userInfo.userInfo.first_name + " " + userInfo.userInfo.last_name;
    let [rows, fields] = await connection.execute(`SELECT article_id, title, date_added, status, last_saved FROM articles WHERE author_id = ?`, [userInfo.userInfo.user_id]);

    let data = [];
    rows.forEach((row) => {
        let tmp = {...row};
        tmp["author"] = author;
        if (!row.date_added) {
            tmp["date_added"] = "-"
        } else {
            tmp["date_added"] = row["date_added"].toLocaleDateString();
        }
        tmp["last_saved"] = row["last_saved"].toLocaleString();
        data.push(tmp);
    });
    console.log(data);
    res.send(data)
});

app.get('/api/getArticleContentById', async (req, res) => {
    let [rows, fields] = await connection.execute(`SELECT title, content FROM articles WHERE article_id = ?`, [req.query.article_id]);
    res.send(rows[0])
});