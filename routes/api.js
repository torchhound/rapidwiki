var express = require('express');
var Sequelize = require('sequelize');

var router = express.Router();

var sequelize = new Sequelize('wikiDb', null, null, {
    dialect: "sqlite",
    storage: './wiki.sqlite',
});

sequelize.authenticate()
	.then(function(err) {
    	console.log('Database connection successful!');
  	}, function (err) {
    	console.log('Unable to connect to the database:', err);
  	});

sequelize.Page = sequelize.import('../models/Page');

sequelize.sync({ force: true })
	.then(function(err) {
    	console.log('Database synced!');
  	}, function (err) {
    	console.log('An error occurred while creating the table:', err);
  	});

router.post('/create', function(req, res, next) {
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    res.status(400).send('Empty JSON');
  } else {
    sequelize.Page.create({title: req.body.title, body: req.body.body})
      .then(x => {
        console.log('201');
        res.status(201).send(x);
      })
      .catch(err => {
        console.log('400');
        res.status(400).send(`Database error: ${err}`);
      })
  }
});

router.get('/all', function(req, res, next) {
  sequelize.Page.all({raw: true}).then(pages => {
    if (pages === undefined || pages.length == 0) {
      console.log('Empty');
      res.status(200).send(JSON.stringify({"title": "No pages in database", "body": ""}));
    } else {
      console.log('Not Empty');
      res.status(200).send(pages);
    }
  })
})

module.exports = router;