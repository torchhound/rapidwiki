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

module.exports = router;