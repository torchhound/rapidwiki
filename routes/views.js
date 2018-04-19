var express = require('express');

var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('home.html');
});

router.get('/search', function(req, res, next) {
	res.render('search.html');
});

router.get('/create', function(req, res, next) {
	res.render('create.html');
});

router.get('/all', function(req, res, next) {
	res.render('all.html');
});

router.get('/recent', function(req, res, next) {
	res.render('recent.html');
});

router.get('/categories', function(req, res, next) {
	res.render('categories.html');
});

router.get('/view/category/*', function(req, res, next) {
	res.render('category.html');
});

router.get('/view/page/*', function(req, res, next) {
	res.render('page.html');
});

module.exports = router;