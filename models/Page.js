var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Page = sequelize.define('Page', {
    	title: {
    		type: Sequelize.STRING,
    		unique: true
    	},
    	body: Sequelize.TEXT,
    	category: Sequelize.TEXT,
    	timestamp: Sequelize.NOW
	});
  return Page;
};