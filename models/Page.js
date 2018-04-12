var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Page = sequelize.define('Page', {
    	title: Sequelize.STRING,
    	body: Sequelize.TEXT,
    	timestamp: Sequelize.NOW
	});
  return Page;
};