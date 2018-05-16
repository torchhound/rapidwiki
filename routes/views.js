var express = require('express');
const session = require('express-session');
var cookieParser = require('cookie-parser');

var router = express.Router();

function sessionChecker(req, res, next) {
    if (!req.session.user || !req.cookies.userId) {
        res.redirect('/auth');
    } else {
        next();
    }    
}

router.get('/', function(req, res, next) {
	res.render('home.html');
});

router.get('/search', sessionChecker, function(req, res, next) {
	res.render('search.html');
});

router.get('/create', sessionChecker, function(req, res, next) {
	res.render('create.html');
});

router.get('/all', sessionChecker, function(req, res, next) {
	res.render('all.html');
});

router.get('/recent', sessionChecker, function(req, res, next) {
	res.render('recent.html');
});

router.get('/categories', sessionChecker, function(req, res, next) {
	res.render('categories.html');
});

router.get('/view/category/*', sessionChecker, function(req, res, next) {
	res.render('category.html');
});

router.get('/view/page/*', sessionChecker, function(req, res, next) {
	res.render('page.html');
});

router.get('/files', sessionChecker, function(req, res, next) {
	res.render('files.html');
});

router.get('/auth', function(req, res, next) {
	res.render('auth.html');
});

module.exports = router;