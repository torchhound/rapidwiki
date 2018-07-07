const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const sessioncheck = require('./sessioncheck');

let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('home.html');
});

router.get('/search', sessioncheck.sessionChecker, function(req, res, next) {
  res.render('search.html');
});

router.get('/create', sessioncheck.sessionChecker, function(req, res, next) {
  res.render('create.html');
});

router.get('/all', sessioncheck.sessionChecker, function(req, res, next) {
  res.render('all.html');
});

router.get('/recent', sessioncheck.sessionChecker, function(req, res, next) {
  res.render('recent.html');
});

router.get('/categories', sessioncheck.sessionChecker, function(req, res, next) {
  res.render('categories.html');
});

router.get('/view/category/*', sessioncheck.sessionChecker, function(req, res, next) {
  res.render('category.html');
});

router.get('/view/page/*', sessioncheck.sessionChecker, function(req, res, next) {
  res.render('page.html');
});

router.get('/files', sessioncheck.sessionChecker, function(req, res, next) {
  res.render('files.html');
});

router.get('/auth', function(req, res, next) {
  res.render('auth.html');
});

module.exports = router;