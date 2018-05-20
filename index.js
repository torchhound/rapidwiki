const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');

const api = require('./routes/api');
const views = require('./routes/views')
const port = process.env.PORT || 5000;
const app = express();
const http = require('http').Server(app);
const env = process.env.ENV || 'dev'; //dev, test, or prod
var sessionSecret = process.env.SESSION_SECRET || 'TEST_SECRET';

app.use(helmet());
app.engine('html', require('ejs').renderFile); 
app.set('view engine', 'html');
app.use(express.static('views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logError);
app.use(session({
    key: 'userId',
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 604800000,
    }
}));
app.use((req, res, next) => {
    if (req.cookies.userId && !req.session.user) {
        res.clearCookie('userId');        
    }
    next();
});
app.use(compression());
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