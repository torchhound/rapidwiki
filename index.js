const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');

const api = require('./routes/api');
const views = require('./routes/views')
var port = process.env.PORT || 5000;
const app = express();
const http = require('http').Server(app);

app.engine('html', require('ejs').renderFile); 
app.set('view engine', 'html');
app.use(express.static('views'));
app.use(bodyParser.json());
app.use('/api', api);
app.use('/', views);
app.use(function(req, res) {
	res.status(400);
    res.render("notFound.html");
 });
app.use(logError);

function logError(error, req, res, next){
	console.log(error);
	next(error);
};

http.listen(port, function() {
	console.log("Listening on port " + port);
});

module.exports = app;