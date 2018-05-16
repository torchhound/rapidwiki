const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const session = require('express-session');
var cookieParser = require('cookie-parser');

const api = require('./routes/api');
const views = require('./routes/views')
const port = process.env.PORT || 5000;
const app = express();
const http = require('http').Server(app);
var env = process.env.ENV || 'dev'; //dev or prod
var config = require('./config')[env];

app.engine('html', require('ejs').renderFile); 
app.set('view engine', 'html');
app.use(express.static('views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logError);
app.use(session({
    key: 'userId',
    secret: config.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));
app.use((req, res, next) => {
    if (req.cookies.userId && !req.session.user) {
        res.clearCookie('userId');        
    }
    next();
});
app.use('/api', api);
app.use('/', views);
app.use(function(req, res) {
    res.status(400);
    res.render("notFound.html");
});

function logError(error, req, res, next) {
	console.log(error);
	next(error);
};

http.listen(port, function() {
	console.log("Listening on port " + port);
});

module.exports = app;